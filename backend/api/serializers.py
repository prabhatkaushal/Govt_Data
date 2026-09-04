from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), source='department', write_only=True, required=False, allow_null=True
    )
    username = serializers.CharField(read_only=True)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'full_name', 'role', 'department', 'department_id', 'employee_id']

class DocumentSerializer(serializers.ModelSerializer):
    uploader = UserSerializer(source="uploaded_by", read_only=True)
    verifier = UserSerializer(source="verified_by", read_only=True)
    deleter = UserSerializer(source="deleted_by", read_only=True)
    flagger = UserSerializer(source="flagged_by", read_only=True)
    class Meta:
        model = Document
        fields = '__all__'

class CaseSerializer(serializers.ModelSerializer):
    investigating_officer = UserSerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)
    documents = serializers.SerializerMethodField()
    case_number = serializers.CharField(read_only=True)
    class Meta:
        model = Case
        fields = '__all__'

    def get_documents(self, obj):
        # Exclude deleted documents when retrieving case details
        docs = obj.documents.exclude(status='DELETED')
        return DocumentSerializer(docs, many=True).data

class DocumentVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentVersion
        fields = '__all__'

class EvidenceChainSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvidenceChain
        fields = '__all__'

class AuditLogSerializer(serializers.ModelSerializer):
    actor_details = UserSerializer(source="actor", read_only=True)
    class Meta:
        model = AuditLog
        fields = '__all__'

class DigitalSignatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = DigitalSignature
        fields = '__all__'

class BlockchainRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockchainRecord
        fields = '__all__'
