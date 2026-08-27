from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import BlockchainRecord, User
from ..schemas import BlockchainRecordResponse
from .auth import get_current_user

router = APIRouter(prefix="/api/blockchain", tags=["blockchain"])

@router.get("/", response_model=List[BlockchainRecordResponse])
def get_blockchain_ledger(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(BlockchainRecord).order_by(BlockchainRecord.block_number.desc()).offset(skip).limit(limit).all()

@router.get("/{transaction_id}", response_model=BlockchainRecordResponse)
def get_blockchain_transaction(transaction_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    record = db.query(BlockchainRecord).filter(BlockchainRecord.transaction_id == transaction_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return record
