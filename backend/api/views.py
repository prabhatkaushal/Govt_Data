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
    permission_classes = [permissions.AllowAny]

import threading
import requests

def trigger_ai_pipeline(file_data, file_name, document_id):
    try:
        print(f"Triggering AI pipeline for {document_id}")
        files = {'file': (file_name, file_data)}
        ai_url = os.environ.get("AI_MICROSERVICE_URL", "http://localhost:8001")
        ext_res = requests.post(f"{ai_url}/extract-text/", files=files)
        if ext_res.status_code == 200:
            text = ext_res.json().get("extracted_text", "")
            if text.strip():
                payload = {"document_id": document_id, "text": text}
                emb_res = requests.post(f"{ai_url}/generate-embeddings/", json=payload)
                print("Embeddings generated:", emb_res.json())
            else:
                print("No text extracted.")
        else:
            print("Extract text failed:", ext_res.status_code)
    except Exception as e:
        print("AI Pipeline failed:", e)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.select_related('department').all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        validated_data = serializer.validated_data
        password = validated_data.pop('password', 'gov123')
        
        department = validated_data.get('department')
        if department and department.department_code:
            try:
                # e.g., 'CYB-01' -> '01'
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
    queryset = Case.objects.select_related('investigating_officer', 'department').prefetch_related('documents').all()
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
        # Only Admin or Super Admin can delete cases
        if request.user.role not in ['ADMIN', 'SUPER_ADMIN']:
            return Response(
                {"error": "Only Administrators are authorized to permanently delete cases."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        instance = self.get_object()
        
        # Log to Audit Trail BEFORE deletion
        AuditLog.objects.create(
            action="DELETE_CASE",
            actor=request.user,
            resource_type="CASE",
            resource_id=instance.case_number,
            metadata_info={"description": f"Case '{instance.title}' permanently deleted from database by Admin."}
        )
        
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.select_related('case', 'uploaded_by').all()
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated, IsReadOnly | IsInvestigator]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']

    def get_queryset(self):
        from django.utils import timezone
        qs = Document.objects.all()
        # If explicitly requesting deleted files (Recycle Bin)
        if self.request.query_params.get('deleted') == 'true':
            return qs.filter(status='DELETED')
        # Allow retrieving specific deleted object for restore action
        if self.action in ['restore', 'retrieve']:
            return qs
        # Otherwise hide DELETED files from normal views
        return qs.exclude(status='DELETED')

    def destroy(self, request, *args, **kwargs):
        from django.utils import timezone
        # 1. Enforce Admin only
        if request.user.role not in ['ADMIN', 'SUPER_ADMIN']:
            return Response(
                {"error": "Only Administrators are authorized to delete documents."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        instance = self.get_object()
        
        # Soft Delete Logic
        instance.status = 'DELETED'
        instance.deleted_at = timezone.now()
        instance.deleted_by = request.user
        instance.save()
        
        # 2. Log to Audit Trail
        AuditLog.objects.create(
            action="FILE_DELETED",
            actor=request.user,
            resource_type="DOCUMENT",
            resource_id=instance.document_id,
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
            
        # Restore Logic (Revert to verified if it was verified, else pending)
        instance.status = 'VERIFIED' if instance.verified_by else 'PENDING_VERIFICATION'
        instance.deleted_at = None
        instance.deleted_by = None
        instance.save()
        
        AuditLog.objects.create(
            action="FILE_RESTORED",
            actor=request.user,
            resource_type="DOCUMENT",
            resource_id=instance.document_id,
            metadata_info={"description": f"Document '{instance.file_name}' restored from Recycle Bin by Admin."}
        )
        return Response({"status": "restored"})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsInvestigator])
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
            resource_id=instance.document_id,
            metadata_info={"description": f"Document flagged as Suspicious.", "reason": reason}
        )
        return Response({"status": "flagged"})

    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        # Phase 1: Real SHA-256 and Mocked AES-256 (Simulated S3 Storage)
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        
        file_name = file_obj.name
        existing_doc = Document.objects.filter(file_name=file_name).first()
        if existing_doc:
            if request.POST.get('replace') == 'true':
                existing_doc.delete()
            else:
                return Response({"error": "File with this name already exists", "code": "DUPLICATE_NAME"}, status=status.HTTP_409_CONFLICT)

        # Calculate true SHA-256
        file_hash = hashlib.sha256()
        for chunk in file_obj.chunks():
            file_hash.update(chunk)
        sha256_hex = file_hash.hexdigest()
        
        # Reset file pointer
        file_obj.seek(0)
        
        # Mock AES-256 encryption and saving to S3
        # In a real scenario, this key would be in settings.py
        key = Fernet.generate_key()
        cipher = Fernet(key)
        
        # Read file, encrypt, and save to mock S3 directory
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
        
        # Add the computed fields to the request data
        mutable_data = request.data.copy()
        mutable_data['document_id'] = doc_id
        mutable_data['file_path'] = file_path
        mutable_data['file_name'] = file_name
        mutable_data['file_size'] = file_obj.size
        mutable_data['sha256_hash'] = sha256_hex
        mutable_data['mime_type'] = file_obj.content_type
        
        serializer = self.get_serializer(data=mutable_data)
        if not serializer.is_valid():
            print("VALIDATION ERROR:", serializer.errors)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        doc_instance = serializer.instance
        
        # If document_type is FIR, create FIR record
        if doc_instance.document_type == 'FIR' and doc_instance.case:
            # Enforce 1 FIR per Case
            if FIR.objects.filter(case=doc_instance.case).exists():
                doc_instance.delete()
                return Response({"error": "This case already has an FIR. Only one FIR per case is allowed.", "code": "MULTIPLE_FIR"}, status=status.HTTP_400_BAD_REQUEST)
            FIR.objects.create(
                fir_number=f"FIR-{uuid.uuid4().hex[:6].upper()}",
                case=doc_instance.case,
                document=doc_instance
            )
        
        # Phase 3: Simulated Hyperledger Fabric Blockchain Logging
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
            action="UPLOAD_DOCUMENT",
            actor=request.user,
            resource_type="DOCUMENT",
            resource_id=doc_id,
            metadata_info={"description": f"Document {file_name} encrypted (AES-256) and uploaded to mock-S3. SHA256: {sha256_hex[:12]}..."}
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
        
        # Add a digital signature and audit log automatically
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
            resource_id=doc.document_id,
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
