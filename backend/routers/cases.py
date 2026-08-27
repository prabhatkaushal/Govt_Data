from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ..database import get_db
from ..models import Case, User, RoleEnum
from ..schemas import CaseResponse, CaseCreate
from .auth import get_current_user

router = APIRouter(prefix="/api/cases", tags=["cases"])

def check_case_permission(user: User, case: Case):
    if user.role in [RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.AUDITOR, RoleEnum.VIEWER]:
        return True
    if user.role == RoleEnum.INVESTIGATING_OFFICER and case.investigating_officer_id == user.id:
        return True
    if user.department_id and case.department_id == user.department_id:
        return True
    return False

@router.get("/", response_model=List[CaseResponse])
def list_cases(
    skip: int = 0, 
    limit: int = 100, 
    status: Optional[str] = None,
    priority: Optional[str] = None,
    case_type: Optional[str] = None,
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    query = db.query(Case)
    
    # Role based filtering
    if current_user.role == RoleEnum.INVESTIGATING_OFFICER:
        query = query.filter(Case.investigating_officer_id == current_user.id)
    elif current_user.role in [RoleEnum.POLICE_OFFICER, RoleEnum.LEGAL_OFFICER]:
        query = query.filter(Case.department_id == current_user.department_id)
        
    if status:
        query = query.filter(Case.status == status)
    if priority:
        query = query.filter(Case.priority == priority)
    if case_type:
        query = query.filter(Case.case_type == case_type)
        
    return query.offset(skip).limit(limit).all()

@router.post("/", response_model=CaseResponse)
def create_case(
    case_in: CaseCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in [RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.INVESTIGATING_OFFICER, RoleEnum.LEGAL_OFFICER]:
        raise HTTPException(status_code=403, detail="Not authorized to create cases")
        
    # Generate case number
    year = datetime.utcnow().year
    count = db.query(Case).count() + 1
    case_number = f"CASE-{year}-{count:05d}"
    
    new_case = Case(
        **case_in.model_dump(),
        case_number=case_number,
        created_by=current_user.id,
        investigating_officer_id=current_user.id if not case_in.investigating_officer_id else case_in.investigating_officer_id,
        department_id=current_user.department_id if not case_in.department_id else case_in.department_id,
        registration_date=datetime.utcnow()
    )
    db.add(new_case)
    db.commit()
    db.refresh(new_case)
    return new_case

@router.get("/{case_id}", response_model=CaseResponse)
def get_case(
    case_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
        
    if not check_case_permission(current_user, case):
        raise HTTPException(status_code=403, detail="Not authorized to view this case")
        
    return case

@router.patch("/{case_id}", response_model=CaseResponse)
def update_case(
    case_id: int, 
    case_in: CaseCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
        
    if current_user.role not in [RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN] and case.investigating_officer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this case")
        
    update_data = case_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(case, key, value)
        
    if update_data.get("status") == "CLOSED":
        case.closure_date = datetime.utcnow()
        
    db.commit()
    db.refresh(case)
    return case
