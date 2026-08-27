from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import AuditLog, User, RoleEnum
from ..schemas import AuditLogResponse
from .auth import get_current_user

router = APIRouter(prefix="/api/audit", tags=["audit"])

@router.get("/", response_model=List[AuditLogResponse])
def get_audit_logs(
    skip: int = 0, 
    limit: int = 100, 
    action: Optional[str] = None,
    actor_id: Optional[int] = None,
    severity: Optional[str] = None,
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Depending on role, users might only see their own logs or all logs
    query = db.query(AuditLog)
    
    if current_user.role not in [RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.AUDITOR]:
        # Regular users only see their own audit trail
        query = query.filter(AuditLog.actor_id == current_user.id)
    else:
        if actor_id:
            query = query.filter(AuditLog.actor_id == actor_id)
            
    if action:
        query = query.filter(AuditLog.action == action)
    if severity:
        query = query.filter(AuditLog.severity == severity)
        
    return query.order_by(AuditLog.timestamp.desc()).offset(skip).limit(limit).all()
