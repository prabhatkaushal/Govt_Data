import hmac
import hashlib
import os
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Document, DigitalSignature, User, RoleEnum
from ..schemas import DigitalSignatureResponse
from .auth import get_current_user
from ..utils.blockchain import anchor_document_to_blockchain
from .documents import record_evidence_chain

router = APIRouter(prefix="/api/documents", tags=["signatures"])

SIGNING_SECRET_KEY = os.getenv("SIGNING_SECRET_KEY", "dev-signing-key-not-for-production").encode()

@router.post("/{document_id}/sign", response_model=DigitalSignatureResponse)
def sign_document(document_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in [RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.INVESTIGATING_OFFICER, RoleEnum.LEGAL_OFFICER, RoleEnum.PROSECUTOR, RoleEnum.FORENSIC_OFFICER]:
        raise HTTPException(status_code=403, detail="Not authorized to digitally sign documents")
        
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    # Prototype HMAC-based digital signature
    message = f"{doc.sha256_hash}:{current_user.id}:{datetime.utcnow().isoformat()}".encode()
    signature = hmac.new(SIGNING_SECRET_KEY, message, hashlib.sha256).hexdigest()
    
    sig_record = DigitalSignature(
        document_id=doc.id,
        signed_by=current_user.id,
        document_hash=doc.sha256_hash,
        signature=signature,
        algorithm="HMAC-SHA256"
    )
    db.add(sig_record)
    db.commit()
    db.refresh(sig_record)
    
    # Anchor to blockchain
    tx = anchor_document_to_blockchain(db, doc.id, doc.sha256_hash, current_user.id, "SIGNED")
    
    # Chain of custody
    record_evidence_chain(db, doc.id, "SIGNED", current_user.id, current_hash=doc.sha256_hash, tx_id=tx.transaction_id)
    
    return sig_record
