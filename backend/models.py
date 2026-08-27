from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean, JSON, Enum, Float
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .database import Base

class RoleEnum(str, enum.Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    ADMIN = "ADMIN"
    INVESTIGATING_OFFICER = "INVESTIGATING_OFFICER"
    POLICE_OFFICER = "POLICE_OFFICER"
    LEGAL_OFFICER = "LEGAL_OFFICER"
    PROSECUTOR = "PROSECUTOR"
    FORENSIC_OFFICER = "FORENSIC_OFFICER"
    AUDITOR = "AUDITOR"
    VIEWER = "VIEWER"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.VIEWER)
    designation = Column(String)
    department_id = Column(Integer, ForeignKey("departments.id"))
    account_status = Column(String, default="ACTIVE")
    last_login = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    department = relationship("Department", back_populates="users")
    cases = relationship("Case", back_populates="investigating_officer")
    access_requests = relationship("AccessRequest", back_populates="requester", foreign_keys="[AccessRequest.requester_id]")
    audit_logs = relationship("AuditLog", back_populates="actor")

class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    department_code = Column(String, unique=True)
    organization = Column(String)
    location = Column(String)
    status = Column(String, default="ACTIVE")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    users = relationship("User", back_populates="department")
    cases = relationship("Case", back_populates="department")

class Case(Base):
    __tablename__ = "cases"
    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String, unique=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text)
    case_type = Column(String)
    police_station = Column(String)
    investigating_officer_id = Column(Integer, ForeignKey("users.id"))
    department_id = Column(Integer, ForeignKey("departments.id"))
    priority = Column(String, default="MEDIUM")
    status = Column(String, default="OPEN")
    confidentiality_level = Column(String, default="INTERNAL")
    incident_date = Column(DateTime)
    registration_date = Column(DateTime)
    closure_date = Column(DateTime)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    investigating_officer = relationship("User", foreign_keys=[investigating_officer_id], back_populates="cases")
    department = relationship("Department", back_populates="cases")
    documents = relationship("Document", back_populates="case")

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(String, unique=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    title = Column(String, nullable=False)
    description = Column(Text)
    document_type = Column(String)
    file_name = Column(String)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer)
    mime_type = Column(String)
    uploaded_by = Column(Integer, ForeignKey("users.id"))
    confidentiality_level = Column(String, default="INTERNAL")
    current_version = Column(Integer, default=1)
    status = Column(String, default="ACTIVE")
    sha256_hash = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_accessed_at = Column(DateTime)
    
    case = relationship("Case", back_populates="documents")
    uploader = relationship("User", foreign_keys=[uploaded_by])
    versions = relationship("DocumentVersion", back_populates="document")
    evidence_chain = relationship("EvidenceChain", back_populates="document")
    digital_signatures = relationship("DigitalSignature", back_populates="document")

class DocumentVersion(Base):
    __tablename__ = "document_versions"
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    version_number = Column(Integer, nullable=False)
    file_path = Column(String, nullable=False)
    sha256_hash = Column(String)
    change_description = Column(Text)
    uploaded_by = Column(Integer, ForeignKey("users.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    digital_signature = Column(Text)
    blockchain_reference = Column(String)
    status = Column(String, default="ACTIVE")
    
    document = relationship("Document", back_populates="versions")
    uploader = relationship("User", foreign_keys=[uploaded_by])

class EvidenceChain(Base):
    __tablename__ = "evidence_chains"
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    action = Column(String, nullable=False)
    performed_by = Column(Integer, ForeignKey("users.id"))
    source_ip = Column(String)
    device_info = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    previous_hash = Column(String)
    current_hash = Column(String)
    blockchain_tx_id = Column(String)
    remarks = Column(Text)
    
    document = relationship("Document", back_populates="evidence_chain")
    user = relationship("User", foreign_keys=[performed_by])

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    actor_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String, nullable=False)
    resource_type = Column(String)
    resource_id = Column(String)
    ip_address = Column(String)
    device_info = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    result = Column(String)
    severity = Column(String)
    metadata_info = Column(JSON)
    
    actor = relationship("User", back_populates="audit_logs")

class DigitalSignature(Base):
    __tablename__ = "digital_signatures"
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    signed_by = Column(Integer, ForeignKey("users.id"))
    document_hash = Column(String)
    signature = Column(Text, nullable=False)
    algorithm = Column(String)
    signed_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="VALID")
    
    document = relationship("Document", back_populates="digital_signatures")
    signer = relationship("User")

class BlockchainRecord(Base):
    __tablename__ = "blockchain_records"
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    transaction_id = Column(String, unique=True, nullable=False)
    block_number = Column(Integer)
    document_hash = Column(String, index=True, nullable=False)
    previous_block_hash = Column(String)
    current_block_hash = Column(String)
    actor_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="ANCHORED")

    document = relationship("Document")
    actor = relationship("User")

class AccessRequest(Base):
    __tablename__ = "access_requests"
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    requester_id = Column(Integer, ForeignKey("users.id"))
    reason = Column(Text)
    status = Column(String, default="PENDING")  # PENDING, APPROVED, REJECTED, EXPIRED
    reviewer_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    reviewed_at = Column(DateTime)
    expires_at = Column(DateTime)
    
    document = relationship("Document")
    requester = relationship("User", foreign_keys=[requester_id], back_populates="access_requests")
    reviewer = relationship("User", foreign_keys=[reviewer_id])

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(String)
    title = Column(String)
    message = Column(String, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User")
