from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import *
from .serializers import *

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [permissions.AllowAny]

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.select_related('department').all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

from .permissions import IsInvestigator, IsLegalOfficer, IsReadOnly

class CaseViewSet(viewsets.ModelViewSet):
    queryset = Case.objects.select_related('investigating_officer', 'department').prefetch_related('documents').all()
    serializer_class = CaseSerializer
    permission_classes = [permissions.IsAuthenticated, IsReadOnly | IsInvestigator]
    http_method_names = ['get', 'post', 'head', 'options']

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.select_related('case', 'uploaded_by').all()
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated, IsReadOnly | IsInvestigator]
    http_method_names = ['get', 'post', 'head', 'options']

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsLegalOfficer])
    def verify(self, request, pk=None):
        doc = self.get_object()
        if doc.status == 'ACTIVE':
            return Response({"error": "Already verified"}, status=status.HTTP_400_BAD_REQUEST)
        
        doc.status = 'ACTIVE'
        doc.save()
        
        # Add a digital signature and audit log automatically
        DigitalSignature.objects.create(
            document=doc,
            signed_by=request.user,
            signature=f"verified-by-{request.user.employee_id}",
            document_hash=doc.sha256_hash or "mock-hash"
        )
        AuditLog.objects.create(
            action="VERIFIED_DOCUMENT",
            user=request.user,
            resource_type="DOCUMENT",
            resource_id=doc.document_id,
            description=f"Document {doc.document_id} verified by {request.user.full_name}"
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

class BlockchainRecordViewSet(viewsets.ModelViewSet):
    queryset = BlockchainRecord.objects.all()
    serializer_class = BlockchainRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
