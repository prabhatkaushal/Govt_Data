from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from ..database import get_db
from ..models import Case, Document, AuditLog, User
from .auth import get_current_user

router = APIRouter(prefix="/api/reports", tags=["reports"])

@router.get("/dashboard-stats")
def get_dashboard_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total_cases = db.query(Case).count()
    active_cases = db.query(Case).filter(Case.status != "CLOSED").count()
    total_docs = db.query(Document).count()
    
    # Chart data
    cases_by_status = db.query(Case.status, func.count(Case.id)).group_by(Case.status).all()
    documents_by_type = db.query(Document.document_type, func.count(Document.id)).group_by(Document.document_type).all()
    
    # Recent activity
    recent_activity = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(5).all()

    return {
        "stats": {
            "totalCases": total_cases,
            "activeInvestigations": active_cases,
            "totalDocuments": total_docs,
            "evidenceRecords": total_docs,
            "digitallySigned": 0, # Placeholder
            "blockchainVerified": total_docs,
            "securityAlerts": 0,
            "pendingApprovals": 0
        },
        "charts": {
            "casesByStatus": [{"status": status, "count": count} for status, count in cases_by_status],
            "documentsByType": [{"type": dtype, "count": count} for dtype, count in documents_by_type],
        },
        "recentActivity": [
            {
                "action": act.action, 
                "timestamp": act.timestamp, 
                "actor_id": act.actor_id
            } for act in recent_activity
        ]
    }
