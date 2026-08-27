from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import AuditLog, User
from .auth import get_current_user

router = APIRouter(prefix="/api/security", tags=["security"])

@router.get("/alerts")
def get_security_alerts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return [
        {
            "id": 1,
            "severity": "CRITICAL",
            "message": "Unauthorized attempt to access TOP_SECRET document",
            "timestamp": "2026-08-27T18:35:00Z"
        },
        {
            "id": 2,
            "severity": "HIGH",
            "message": "Document hash mismatch detected",
            "timestamp": "2026-08-27T18:39:00Z"
        },
        {
            "id": 3,
            "severity": "MEDIUM",
            "message": "Multiple failed login attempts detected",
            "timestamp": "2026-08-27T18:40:00Z"
        }
    ]
