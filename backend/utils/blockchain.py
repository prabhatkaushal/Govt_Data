import hashlib
import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from ..models import BlockchainRecord

def generate_hash(data: str) -> str:
    return hashlib.sha256(data.encode()).hexdigest()

def anchor_document_to_blockchain(db: Session, document_id: int, document_hash: str, actor_id: int, action: str = "UPLOADED") -> BlockchainRecord:
    # Get previous block hash
    last_block = db.query(BlockchainRecord).order_by(BlockchainRecord.block_number.desc()).first()
    previous_block_hash = last_block.current_block_hash if last_block else "0" * 64
    block_number = (last_block.block_number + 1) if last_block else 1
    
    # Generate transaction ID and current block hash
    transaction_id = f"TX-{uuid.uuid4().hex[:10].upper()}"
    timestamp_str = datetime.utcnow().isoformat()
    
    # Simplified block content for hashing
    block_content = f"{block_number}{timestamp_str}{document_hash}{previous_block_hash}{transaction_id}{actor_id}{action}"
    current_block_hash = generate_hash(block_content)
    
    record = BlockchainRecord(
        document_id=document_id,
        transaction_id=transaction_id,
        block_number=block_number,
        document_hash=document_hash,
        previous_block_hash=previous_block_hash,
        current_block_hash=current_block_hash,
        actor_id=actor_id,
        action=action,
        status="ANCHORED"
    )
    
    db.add(record)
    db.commit()
    db.refresh(record)
    return record
