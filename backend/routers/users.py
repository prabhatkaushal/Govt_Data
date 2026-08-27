from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, RoleEnum
from ..schemas import UserResponse, UserCreate
from .auth import get_current_user, get_password_hash

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/", response_model=List[UserResponse])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in [RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]:
        raise HTTPException(status_code=403, detail="Not authorized to view all users")
    return db.query(User).offset(skip).limit(limit).all()

@router.post("/", response_model=UserResponse)
def create_user(user_in: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in [RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]:
        raise HTTPException(status_code=403, detail="Not authorized to create users")
        
    # Check existing
    if db.query(User).filter(User.email == user_in.email).first():
        raise HTTPException(status_code=409, detail="Email already registered")
        
    if db.query(User).filter(User.username == user_in.username).first():
        raise HTTPException(status_code=409, detail="Username already taken")
        
    new_user = User(
        **user_in.model_dump(exclude={"password"}),
        password_hash=get_password_hash(user_in.password)
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.id != user_id and current_user.role not in [RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]:
        raise HTTPException(status_code=403, detail="Not authorized to view this user")
        
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
