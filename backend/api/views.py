import hashlib
import os
import uuid
from django.conf import settings
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import *
from .serializers import *
from cryptography.fernet import Fernet

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

from .permissions import IsInvestigator, IsLegalOfficer, IsSuperAdmin
import threading
import requests

def trigger_ai_pipeline(file_data, file_name, document_id):
    try:
        files = {'file': (file_name, file_data)}
        ai_url = os.environ.get("AI_MICROSERVICE_URL", "http://localhost:8001")
        ext_res = requests.post(f"{ai_url}/extract-text/", files=files)
        if ext_res.status_code == 200:
            text = ext_res.json().get("extracted_text", "")
            if text.strip():
                payload = {"document_id": document_id, "text": text}
                emb_res = requests.post(f"{ai_url}/generate-embeddings/", json=payload)
    except Exception as e:
        pass

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsSuperAdmin()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        validated_data = serializer.validated_data
        password = validated_data.pop('password', 'gov123')
        
        department = validated_data.get('department')
        if department and department.department_code:
            try:
                dd_str = "".join(filter(str.isdigit, department.department_code))
                if len(dd_str) >= 2:
                    dd = dd_str[-2:]
                elif len(dd_str) == 1:
                    dd = f"0{dd_str}"
                else:
                    dd = "00"
            except Exception:
                dd = "00"
        else:
            dd = "00"
            
        prefix = f"26{dd}"
        
        users_with_prefix = User.objects.filter(username__startswith=prefix)
        max_serial = 0
        for u in users_with_prefix:
            try:
                serial = int(u.username[4:])
                if serial > max_serial:
                    max_serial = serial
            except ValueError:
                pass
                
        aaaa = f"{max_serial + 1:04d}"
        username = f"{prefix}{aaaa}"
        
        user = serializer.save(username=username)
        user.set_password(password)
        user.save()

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

from .permissions import IsInvestigator, IsLegalOfficer, IsReadOnly

class CaseViewSet(viewsets.ModelViewSet):
    queryset = Case.objects.all()
    serializer_class = CaseSerializer
    permission_classes = [permissions.IsAuthenticated, IsReadOnly | IsInvestigator]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']

    def perform_create(self, serializer):
        case_number = f"CASE-{uuid.uuid4().hex[:8].upper()}"
        serializer.save(
            case_number=case_number,
            created_by=self.request.user,
            department=self.request.user.department
        )

    def destroy(self, request, *args, **kwargs):
        if request.user.role not in ['ADMIN', 'SUPER_ADMIN']:
            return Response(
                {"error": "Only Administrators are authorized to permanently delete cases."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        instance = self.get_object()
        
        AuditLog.objects.create(
            action="DELETE_CASE",
            actor=request.user,
            resource_type="CASE",
            resource_id=instance.case_number,    ip_address=get_client_ip(request),

            metadata_info={"description": f"Case '{instance.title}' permanently deleted from database by Admin."}
        )
        
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsLegalOfficer])
    def verify(self, request, pk=None):
        from django.utils import timezone
        case = self.get_object()
        if case.verification_status == 'VERIFIED':
            return Response({"error": "Case is already verified"}, status=status.HTTP_400_BAD_REQUEST)
        
        case.verification_status = 'VERIFIED'
        case.save()
        
        AuditLog.objects.create(
            action="CASE_VERIFIED",
            actor=request.user,
            resource_type="CASE",
            resource_id=case.case_number,    ip_address=get_client_ip(request),

            metadata_info={"description": f"Case '{case.title}' independently verified by {request.user.full_name}"}
        )
        
        return Response({"status": "verified"})

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated, IsReadOnly | IsInvestigator]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']

    def get_queryset(self):
        from django.utils import timezone
        qs = Document.objects.all()
        if self.request.query_params.get('deleted') == 'true':
            return qs.filter(status='DELETED')
        if self.action in ['restore', 'retrieve']:
            return qs
        return qs.exclude(status='DELETED')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        AuditLog.objects.create(
            action="DOCUMENT_VIEWED",
            actor=request.user,
            resource_type="DOCUMENT",
            resource_id=instance.document_id,    ip_address=get_client_ip(request),

            metadata_info={"description": f"Document '{instance.file_name}' viewed by {request.user.username}."}
        )
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        from django.utils import timezone
        if request.user.role not in ['ADMIN', 'SUPER_ADMIN']:
            return Response(
                {"error": "Only Administrators are authorized to delete documents."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        instance = self.get_object()
        
        instance.status = 'DELETED'
        instance.deleted_at = timezone.now()
        instance.deleted_by = request.user
        instance.save()
        
        AuditLog.objects.create(
            action="FILE_DELETED",
            actor=request.user,
            resource_type="DOCUMENT",
            resource_id=instance.document_id,    ip_address=get_client_ip(request),

            metadata_info={"description": f"Document '{instance.file_name}' moved to Recycle Bin by Admin."}
        )
        
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        if request.user.role not in ['ADMIN', 'SUPER_ADMIN']:
            return Response(
                {"error": "Only Administrators are authorized to restore documents."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        instance = self.get_object()
        if instance.status != 'DELETED':
            return Response({"error": "Document is not deleted."}, status=status.HTTP_400_BAD_REQUEST)
            
        instance.status = 'VERIFIED' if instance.verified_by else 'PENDING_VERIFICATION'
        instance.deleted_at = None
        instance.deleted_by = None
        instance.save()
        
        AuditLog.objects.create(
            action="FILE_RESTORED",
            actor=request.user,
            resource_type="DOCUMENT",
            resource_id=instance.document_id,    ip_address=get_client_ip(request),

            metadata_info={"description": f"Document '{instance.file_name}' restored from Recycle Bin by Admin."}
        )
        return Response({"status": "restored"})

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        instance = self.get_object()
        
        update_type = "Modified" if kwargs.get('partial', False) else "Replaced metadata for"
        
        AuditLog.objects.create(
            action="DOCUMENT_UPDATED",
            actor=request.user,
            resource_type="DOCUMENT",
            resource_id=instance.document_id,    ip_address=get_client_ip(request),

            metadata_info={"description": f"{update_type} document '{instance.file_name}'."}
        )
        return response

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsLegalOfficer])
    def flag(self, request, pk=None):
        from django.utils import timezone
        instance = self.get_object()
        reason = request.data.get('reason', 'No reason provided')
        
        instance.flagged = True
        instance.flagged_at = timezone.now()
        instance.flagged_by = request.user
        instance.flag_reason = reason
        instance.save()
        
        AuditLog.objects.create(
            action="FILE_FLAGGED",
            actor=request.user,
            resource_type="DOCUMENT",
            resource_id=instance.document_id,    ip_address=get_client_ip(request),

            metadata_info={"description": f"Document flagged as Suspicious.", "reason": reason}
        )
        return Response({"status": "flagged"})

    from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def create(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        
        file_name = file_obj.name
        existing_doc = Document.objects.filter(file_name=file_name).first()
        is_replacement = False
        if existing_doc:
            if request.POST.get('replace') == 'true':
                is_replacement = True
                existing_doc.delete()
            else:
                return Response({"error": "File with this name already exists", "code": "DUPLICATE_NAME"}, status=status.HTTP_409_CONFLICT)

        file_hash = hashlib.sha256()
        for chunk in file_obj.chunks():
            file_hash.update(chunk)
        sha256_hex = file_hash.hexdigest()
        
        file_obj.seek(0)
        
        key = Fernet.generate_key()
        cipher = Fernet(key)
        
        file_data = file_obj.read()
        encrypted_data = cipher.encrypt(file_data)
        
        mock_s3_dir = os.path.join(settings.BASE_DIR, 'media', 'mock-s3')
        os.makedirs(mock_s3_dir, exist_ok=True)
        
        doc_id = f"DOC-{uuid.uuid4().hex[:8].upper()}"
        file_name = file_obj.name
        file_path = f"/media/mock-s3/{doc_id}.enc"
        full_path = os.path.join(mock_s3_dir, f"{doc_id}.enc")
        
        with open(full_path, 'wb') as ef:
            ef.write(encrypted_data)
            
        file_obj.seek(0)
        unencrypted_data = file_obj.read()
        threading.Thread(target=trigger_ai_pipeline, args=(unencrypted_data, file_name, doc_id)).start()
        mutable_data = request.data.copy()
        
        case_val = mutable_data.get('case')
        if case_val and isinstance(case_val, str) and case_val.startswith('CASE-'):
            try:
                case_obj = Case.objects.get(case_number=case_val)
                mutable_data['case'] = case_obj.id
            except Case.DoesNotExist:
                return Response({"error": f"Case {case_val} does not exist."}, status=status.HTTP_400_BAD_REQUEST)

        mutable_data['document_id'] = doc_id
        mutable_data['file_path'] = file_path
        mutable_data['file_name'] = file_name
        mutable_data['file_size'] = file_obj.size
        mutable_data['sha256_hash'] = sha256_hex
        mutable_data['mime_type'] = file_obj.content_type
        
        serializer = self.get_serializer(data=mutable_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        doc_instance = serializer.instance
        
        if doc_instance.document_type == 'FIR' and doc_instance.case:
            if FIR.objects.filter(case=doc_instance.case).exists():
                doc_instance.delete()
                return Response({"error": "This case already has an FIR. Only one FIR per case is allowed.", "code": "MULTIPLE_FIR"}, status=status.HTTP_400_BAD_REQUEST)
            FIR.objects.create(
                fir_number=f"FIR-{uuid.uuid4().hex[:6].upper()}",
                case=doc_instance.case,
                document=doc_instance
            )
        BlockchainRecord.objects.create(
            document=doc_instance,
            transaction_id=f"TXN-{uuid.uuid4().hex}",
            block_number=BlockchainRecord.objects.count() + 1000,
            action="UPLOAD",
            actor=request.user,
            document_hash=sha256_hex,
            status="PENDING"
        )
        
        AuditLog.objects.create(
            action="DOCUMENT_REPLACED" if is_replacement else "UPLOAD_DOCUMENT",
            actor=request.user,
            resource_type="DOCUMENT",
            resource_id=doc_id,    ip_address=get_client_ip(request),

            metadata_info={"description": f"Document {file_name} {'replaced (modified)' if is_replacement else 'uploaded'} and encrypted (AES-256). SHA256: {sha256_hex[:12]}..."}
        )
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)


    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsLegalOfficer])
    def verify(self, request, pk=None):
        from django.utils import timezone
        doc = self.get_object()
        if doc.status == 'VERIFIED' or doc.status == 'ACTIVE':
            return Response({"error": "Already verified"}, status=status.HTTP_400_BAD_REQUEST)
        
        doc.status = 'VERIFIED'
        doc.verified_by = request.user
        doc.verified_at = timezone.now()
        doc.save()
        
        DigitalSignature.objects.create(
            document=doc,
            signed_by=request.user,
            signature=f"verified-by-{request.user.employee_id}",
            document_hash=doc.sha256_hash or "mock-hash"
        )
        AuditLog.objects.create(
            action="FILE_VERIFIED",
            actor=request.user,
            resource_type="DOCUMENT",
            resource_id=doc.document_id,    ip_address=get_client_ip(request),

            metadata_info={"description": f"Document {doc.document_id} verified by {request.user.full_name}"}
        )
        
        return Response({"status": "verified"})

    @action(detail=True, methods=['post'])
    def sign(self, request, pk=None):
        doc = self.get_object()
        DigitalSignature.objects.create(
            document=doc,
            signed_by=request.user,
            signature="mock-signature-1234",
            document_hash=doc.sha256_hash
        )
        return Response({"status": "signed"})

class AuditLogViewSet(viewsets.ModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = AuditLog.objects.all().order_by('-timestamp')
        resource_id = self.request.query_params.get('resource_id', None)
        if resource_id is not None:
            queryset = queryset.filter(resource_id=resource_id)
        return queryset

class BlockchainRecordViewSet(viewsets.ModelViewSet):
    queryset = BlockchainRecord.objects.all()
    serializer_class = BlockchainRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

class EvidenceChainViewSet(viewsets.ModelViewSet):
    queryset = EvidenceChain.objects.all()
    serializer_class = EvidenceChainSerializer
    permission_classes = [permissions.IsAuthenticated]
