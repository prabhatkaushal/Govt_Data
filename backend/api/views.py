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

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class CaseViewSet(viewsets.ModelViewSet):
    queryset = Case.objects.all()
    serializer_class = CaseSerializer
    permission_classes = [permissions.IsAuthenticated]

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        # Generate SHA-256
        sha256 = hashlib.sha256()
        for chunk in file_obj.chunks():
            sha256.update(chunk)
        file_hash = sha256.hexdigest()

        # Save File locally
        media_dir = getattr(settings, 'MEDIA_ROOT', 'media')
        os.makedirs(media_dir, exist_ok=True)
        unique_filename = f"{uuid.uuid4()}_{file_obj.name}"
        file_path = os.path.join(media_dir, unique_filename)
        with open(file_path, 'wb+') as destination:
            for chunk in file_obj.chunks():
                destination.write(chunk)

        # Create Document
        case_id = request.data.get('case')
        case_instance = Case.objects.get(id=case_id) if case_id else None
        
        doc = Document.objects.create(
            document_id=str(uuid.uuid4()),
            case=case_instance,
            title=request.data.get('title', file_obj.name),
            description=request.data.get('description', ''),
            document_type=request.data.get('document_type', 'other'),
            file_name=file_obj.name,
            file_path=file_path,
            file_size=file_obj.size,
            mime_type=file_obj.content_type,
            uploaded_by=request.user,
            confidentiality_level=request.data.get('confidentiality_level', 'INTERNAL'),
            sha256_hash=file_hash
        )

        # Create Version
        DocumentVersion.objects.create(
            document=doc,
            version_number=1,
            file_path=file_path,
            sha256_hash=file_hash,
            change_description="Initial upload",
            uploaded_by=request.user
        )

        # Create Evidence Chain
        EvidenceChain.objects.create(
            document=doc,
            action="UPLOADED",
            performed_by=request.user,
            current_hash=file_hash,
            remarks=request.data.get('remarks', '')
        )

        serializer = self.get_serializer(doc)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

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

class BlockchainRecordViewSet(viewsets.ModelViewSet):
    queryset = BlockchainRecord.objects.all()
    serializer_class = BlockchainRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
