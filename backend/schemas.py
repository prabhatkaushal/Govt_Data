from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime
from .models import RoleEnum

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class UserBase(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None
    employee_id: Optional[str] = None
    phone: Optional[str] = None
    role: RoleEnum = RoleEnum.VIEWER
    designation: Optional[str] = None
    department_id: Optional[int] = None
    account_status: str = "ACTIVE"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    last_login: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class DepartmentBase(BaseModel):
    name: str
    department_code: Optional[str] = None
    organization: Optional[str] = None
    location: Optional[str] = None
    status: str = "ACTIVE"

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentResponse(DepartmentBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class CaseBase(BaseModel):
    title: str
    description: Optional[str] = None
    case_number: Optional[str] = None
    case_type: Optional[str] = None
    police_station: Optional[str] = None
    priority: str = "MEDIUM"
    status: str = "OPEN"
    confidentiality_level: str = "INTERNAL"
    investigating_officer_id: Optional[int] = None
    department_id: Optional[int] = None
    incident_date: Optional[datetime] = None
    registration_date: Optional[datetime] = None

class CaseCreate(CaseBase):
    pass

class CaseResponse(CaseBase):
    id: int
    closure_date: Optional[datetime] = None
    created_by: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class DocumentBase(BaseModel):
    title: str
    description: Optional[str] = None
    document_type: Optional[str] = None
    confidentiality_level: str = "INTERNAL"

class DocumentResponse(DocumentBase):
    id: int
    document_id: str
    case_id: int
    file_name: str
    file_path: str
    file_size: int
    mime_type: str
    uploaded_by: int
    current_version: int
    status: str
    sha256_hash: str
    created_at: datetime
    updated_at: datetime
    last_accessed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class DocumentVersionResponse(BaseModel):
    id: int
    document_id: int
    version_number: int
    file_path: str
    sha256_hash: str
    change_description: Optional[str] = None
    uploaded_by: int
    timestamp: datetime
    digital_signature: Optional[str] = None
    blockchain_reference: Optional[str] = None
    status: str
    
    class Config:
        from_attributes = True

class EvidenceChainResponse(BaseModel):
    id: int
    document_id: int
    action: str
    performed_by: int
    source_ip: Optional[str] = None
    device_info: Optional[str] = None
    timestamp: datetime
    previous_hash: Optional[str] = None
    current_hash: Optional[str] = None
    blockchain_tx_id: Optional[str] = None
    remarks: Optional[str] = None
    
    class Config:
        from_attributes = True

class AuditLogResponse(BaseModel):
    id: int
    actor_id: int
    action: str
    resource_type: Optional[str] = None
    resource_id: Optional[str] = None
    ip_address: Optional[str] = None
    device_info: Optional[str] = None
    timestamp: datetime
    result: Optional[str] = None
    severity: Optional[str] = None
    metadata_info: Optional[Any] = None
    
    class Config:
        from_attributes = True

class DigitalSignatureResponse(BaseModel):
    id: int
    document_id: int
    signed_by: int
    document_hash: str
    signature: str
    algorithm: str
    signed_at: datetime
    status: str
    
    class Config:
        from_attributes = True

class BlockchainRecordResponse(BaseModel):
    id: int
    document_id: int
    transaction_id: str
    block_number: int
    document_hash: str
    previous_block_hash: Optional[str] = None
    current_block_hash: Optional[str] = None
    actor_id: int
    action: Optional[str] = None
    timestamp: datetime
    status: str
    
    class Config:
        from_attributes = True
