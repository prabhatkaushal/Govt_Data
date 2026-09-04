from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class RoleEnum(models.TextChoices):
    SUPER_ADMIN = "SUPER_ADMIN", _("Super Admin")
    ADMIN = "ADMIN", _("Admin")
    INVESTIGATING_OFFICER = "INVESTIGATING_OFFICER", _("Investigating Officer")
    POLICE_OFFICER = "POLICE_OFFICER", _("Police Officer")
    LEGAL_OFFICER = "LEGAL_OFFICER", _("Legal Officer")
    PROSECUTOR = "PROSECUTOR", _("Prosecutor")
    FORENSIC_OFFICER = "FORENSIC_OFFICER", _("Forensic Officer")
    AUDITOR = "AUDITOR", _("Auditor")
    VIEWER = "VIEWER", _("Viewer")

class Department(models.Model):
    name = models.CharField(max_length=255, unique=True, db_index=True)
    department_code = models.CharField(max_length=50, unique=True)
    organization = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=50, default="ACTIVE")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class User(AbstractUser):
    employee_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    full_name = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(
        max_length=50,
        choices=RoleEnum.choices,
        default=RoleEnum.VIEWER,
    )
    designation = models.CharField(max_length=255, blank=True, null=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name="users")
    account_status = models.CharField(max_length=50, default="ACTIVE")
    
    def __str__(self):
        return self.username

class Case(models.Model):
    case_number = models.CharField(max_length=100, unique=True, db_index=True)
    title = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True, null=True)
    case_type = models.CharField(max_length=100, blank=True, null=True)
    police_station = models.CharField(max_length=255, blank=True, null=True)
    investigating_officer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="assigned_cases")
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name="cases")
    priority = models.CharField(max_length=50, default="MEDIUM")
    status = models.CharField(max_length=50, default="OPEN")
    confidentiality_level = models.CharField(max_length=50, default="INTERNAL")
    incident_date = models.DateTimeField(blank=True, null=True)
    registration_date = models.DateTimeField(blank=True, null=True)
    closure_date = models.DateTimeField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="created_cases")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.case_number

class FIR(models.Model):
    fir_number = models.CharField(max_length=100, unique=True, db_index=True)
    case = models.OneToOneField(Case, on_delete=models.CASCADE, related_name="fir_record")
    document = models.OneToOneField('Document', on_delete=models.CASCADE, related_name="fir_details", null=True, blank=True)
    registered_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.fir_number

class Document(models.Model):
    document_id = models.CharField(max_length=100, unique=True, db_index=True)
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name="documents", null=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    document_type = models.CharField(max_length=100, blank=True, null=True)
    file_name = models.CharField(max_length=255, blank=True, null=True)
    file_path = models.CharField(max_length=1024)
    file_size = models.IntegerField(blank=True, null=True)
    mime_type = models.CharField(max_length=100, blank=True, null=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="uploaded_documents")
    confidentiality_level = models.CharField(max_length=50, default="INTERNAL")
    current_version = models.IntegerField(default=1)
    status = models.CharField(max_length=50, default="PENDING_VERIFICATION")
    sha256_hash = models.CharField(max_length=256, db_index=True, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_accessed_at = models.DateTimeField(blank=True, null=True)
    
    # Audit & Lifecycle Tracking
    deleted_at = models.DateTimeField(blank=True, null=True)
    deleted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="deleted_documents")
    
    verified_at = models.DateTimeField(blank=True, null=True)
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="verified_documents")
    
    flagged = models.BooleanField(default=False)
    flagged_at = models.DateTimeField(blank=True, null=True)
    flagged_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="flagged_documents")
    flag_reason = models.TextField(blank=True, null=True)

class DocumentVersion(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name="versions")
    version_number = models.IntegerField()
    file_path = models.CharField(max_length=1024)
    sha256_hash = models.CharField(max_length=256, blank=True, null=True)
    change_description = models.TextField(blank=True, null=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    digital_signature = models.TextField(blank=True, null=True)
    blockchain_reference = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=50, default="ACTIVE")

class EvidenceChain(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name="evidence_chain")
    action = models.CharField(max_length=255)
    performed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    source_ip = models.CharField(max_length=45, blank=True, null=True)
    device_info = models.CharField(max_length=255, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    previous_hash = models.CharField(max_length=256, blank=True, null=True)
    current_hash = models.CharField(max_length=256, blank=True, null=True)
    blockchain_tx_id = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    remarks = models.TextField(blank=True, null=True)

class AuditLog(models.Model):
    actor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="audit_logs")
    action = models.CharField(max_length=255)
    resource_type = models.CharField(max_length=100, blank=True, null=True)
    resource_id = models.CharField(max_length=100, blank=True, null=True)
    ip_address = models.CharField(max_length=45, blank=True, null=True)
    device_info = models.CharField(max_length=255, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    result = models.CharField(max_length=100, blank=True, null=True)
    severity = models.CharField(max_length=50, blank=True, null=True)
    metadata_info = models.JSONField(blank=True, null=True)

class DigitalSignature(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name="digital_signatures")
    signed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    document_hash = models.CharField(max_length=256, blank=True, null=True)
    signature = models.TextField()
    algorithm = models.CharField(max_length=100, blank=True, null=True)
    signed_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default="VALID")

class BlockchainRecord(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    transaction_id = models.CharField(max_length=255, unique=True)
    block_number = models.IntegerField(blank=True, null=True)
    document_hash = models.CharField(max_length=256, db_index=True)
    previous_block_hash = models.CharField(max_length=256, blank=True, null=True)
    current_block_hash = models.CharField(max_length=256, blank=True, null=True)
    actor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=255, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default="ANCHORED")

class AccessRequest(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name="access_requests")
    reason = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50, default="PENDING")
    reviewer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(blank=True, null=True)
    expires_at = models.DateTimeField(blank=True, null=True)

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=100, blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

from pgvector.django import VectorField

class DocumentEmbedding(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name="embeddings")
    text_chunk = models.TextField()
    embedding = VectorField(dimensions=384)
    created_at = models.DateTimeField(auto_now_add=True)

