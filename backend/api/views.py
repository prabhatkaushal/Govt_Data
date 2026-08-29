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
    queryset = Case.objects.all()
    serializer_class = CaseSerializer
    permission_classes = [permissions.IsAuthenticated, IsReadOnly | IsInvestigator]
    http_method_names = ['get', 'post', 'head', 'options']

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
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
