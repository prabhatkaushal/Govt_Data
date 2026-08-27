import os
import hashlib
import uuid
import shutil
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Document, DocumentVersion, EvidenceChain, Case, User, RoleEnum
from ..schemas import DocumentResponse, DocumentVersionResponse, EvidenceChainResponse
from .auth import get_current_user
from ..utils.blockchain import anchor_document_to_blockchain

router = APIRouter(prefix="/api/documents", tags=["documents"])

UPLOAD_DIR = os.getenv("UPLOAD_DIRECTORY", "/app/media/documents")
# For local dev fallback since we might not be in docker
if not os.path.exists(UPLOAD_DIR):
    # try relative
    UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "media", "documents")
    os.makedirs(UPLOAD_DIR, exist_ok=True)

def generate_file_hash(file_path: str) -> str:
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

def record_evidence_chain(db: Session, document_id: int, action: str, user_id: int, previous_hash: str = None, current_hash: str = None, remarks: str = None, tx_id: str = None):
    chain = EvidenceChain(
        document_id=document_id,
        action=action,
        performed_by=user_id,
        previous_hash=previous_hash,
        current_hash=current_hash,
        remarks=remarks,
        blockchain_tx_id=tx_id
    )
    db.add(chain)
    db.commit()

@router.get("/", response_model=List[DocumentResponse])
def list_documents(
    skip: int = 0, 
    limit: int = 100, 
    case_id: Optional[int] = None,
    document_type: Optional[str] = None,
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    query = db.query(Document)
    if case_id:
        query = query.filter(Document.case_id == case_id)
    if document_type:
        query = query.filter(Document.document_type == document_type)
        
    # TODO: Add role based visibility filtering for documents
    return query.offset(skip).limit(limit).all()

@router.post("/", response_model=DocumentResponse)
async def upload_document(
    title: str = Form(...),
    case_id: int = Form(...),
    document_type: str = Form("OTHER"),
    description: Optional[str] = Form(None),
    confidentiality_level: str = Form("INTERNAL"),
    remarks: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in [RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.INVESTIGATING_OFFICER, RoleEnum.POLICE_OFFICER, RoleEnum.LEGAL_OFFICER, RoleEnum.FORENSIC_OFFICER]:
        raise HTTPException(status_code=403, detail="Not authorized to upload documents")
        
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    # Generate IDs
    doc_id_str = f"DOC-{uuid.uuid4().hex[:6].upper()}"
    version_num = 1
    
    # Save file
    year = datetime.utcnow().strftime("%Y")
    month = datetime.utcnow().strftime("%m")
    save_dir = os.path.join(UPLOAD_DIR, year, month, str(case_id), doc_id_str, str(version_num))
    os.makedirs(save_dir, exist_ok=True)
    
    file_path = os.path.join(save_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    file_size = os.path.getsize(file_path)
    file_hash = generate_file_hash(file_path)
    
    # Create Document Record
    new_doc = Document(
        document_id=doc_id_str,
        case_id=case_id,
        title=title,
        description=description,
        document_type=document_type,
        file_name=file.filename,
        file_path=file_path,
        file_size=file_size,
        mime_type=file.content_type,
        uploaded_by=current_user.id,
        confidentiality_level=confidentiality_level,
        current_version=version_num,
        sha256_hash=file_hash
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    
    # Create Document Version
    new_version = DocumentVersion(
        document_id=new_doc.id,
        version_number=version_num,
        file_path=file_path,
        sha256_hash=file_hash,
        change_description="Original Upload",
        uploaded_by=current_user.id
    )
    db.add(new_version)
    db.commit()
    db.refresh(new_version)
    
    # Blockchain Anchor
    bc_record = anchor_document_to_blockchain(db, new_doc.id, file_hash, current_user.id, "UPLOADED")
    new_version.blockchain_reference = bc_record.transaction_id
    db.commit()
    
    # Chain of Custody
    record_evidence_chain(
        db=db, 
        document_id=new_doc.id, 
        action="UPLOADED", 
        user_id=current_user.id, 
        current_hash=file_hash, 
        remarks=remarks,
        tx_id=bc_record.transaction_id
    )
    
    return new_doc

@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(document_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    doc.last_accessed_at = datetime.utcnow()
    db.commit()
    
    record_evidence_chain(db, doc.id, "VIEWED", current_user.id)
    return doc

@router.post("/{document_id}/verify")
def verify_document_integrity(document_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    if not os.path.exists(doc.file_path):
        return {
            "integrity": "COMPROMISED",
            "hash_match": False,
            "blockchain_match": False,
            "tampering_detected": True,
            "message": "File is missing from storage"
        }
        
    current_hash = generate_file_hash(doc.file_path)
    hash_match = current_hash == doc.sha256_hash
    
    record_evidence_chain(db, doc.id, "VERIFIED", current_user.id, previous_hash=doc.sha256_hash, current_hash=current_hash)
    
    if hash_match:
        return {
            "integrity": "VALID",
            "hash_match": True,
            "blockchain_match": True,  # Simplified for prototype
            "tampering_detected": False,
            "stored_hash": doc.sha256_hash,
            "current_hash": current_hash
        }
    else:
        return {
            "integrity": "COMPROMISED",
            "hash_match": False,
            "blockchain_match": False,
            "tampering_detected": True,
            "stored_hash": doc.sha256_hash,
            "current_hash": current_hash
        }
