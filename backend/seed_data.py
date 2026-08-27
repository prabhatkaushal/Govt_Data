import os
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from .database import SessionLocal, engine, Base
from .models import User, RoleEnum, Department, Case, Document, DocumentVersion, AuditLog, BlockchainRecord, EvidenceChain
from .routers.auth import get_password_hash
from .utils.blockchain import anchor_document_to_blockchain
from .routers.documents import generate_file_hash
import uuid

def seed():
    # Base.metadata.drop_all(bind=engine)
    # Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if already seeded
    if db.query(User).first():
        print("Database already seeded")
        return
        
    print("Seeding departments...")
    depts = [
        Department(name="Cyber Crime Cell", department_code="CYB-01", organization="NCRB", location="Delhi"),
        Department(name="Women Safety Division", department_code="WSD-02", organization="NCRB", location="Delhi"),
        Department(name="Forensic Lab", department_code="FSL-03", organization="MHA", location="Delhi"),
        Department(name="Legal Services", department_code="LGL-04", organization="MHA", location="Delhi"),
    ]
    db.add_all(depts)
    db.commit()
    for d in depts: db.refresh(d)
    
    print("Seeding users...")
    users = [
        User(username="admin", employee_id="EMP001", full_name="Super Admin", email="admin@nyayavault.gov", password_hash=get_password_hash("password"), role=RoleEnum.SUPER_ADMIN),
        User(username="investigator", employee_id="EMP002", full_name="Inspector Rahul Sharma", email="investigator@nyayavault.gov", password_hash=get_password_hash("password"), role=RoleEnum.INVESTIGATING_OFFICER, department_id=depts[0].id),
        User(username="forensic", employee_id="EMP003", full_name="Dr. Anita Mehta", email="forensic@nyayavault.gov", password_hash=get_password_hash("password"), role=RoleEnum.FORENSIC_OFFICER, department_id=depts[2].id),
        User(username="legal", employee_id="EMP004", full_name="Advocate Priya Patel", email="legal@nyayavault.gov", password_hash=get_password_hash("password"), role=RoleEnum.LEGAL_OFFICER, department_id=depts[3].id),
        User(username="auditor", employee_id="EMP005", full_name="Auditor Verma", email="auditor@nyayavault.gov", password_hash=get_password_hash("password"), role=RoleEnum.AUDITOR),
    ]
    db.add_all(users)
    db.commit()
    for u in users: db.refresh(u)
    
    print("Seeding cases...")
    cases = [
        Case(case_number="FIR-2026-00482", title="Cyber Crime Investigation", description="Digital Fraud and Identity Theft", case_type="CYBERCRIME", police_station="Cyber Cell Central", investigating_officer_id=users[1].id, department_id=depts[0].id, priority="HIGH", status="UNDER_INVESTIGATION", confidentiality_level="CONFIDENTIAL", incident_date=datetime.utcnow() - timedelta(days=10), registration_date=datetime.utcnow() - timedelta(days=8), created_by=users[1].id),
        Case(case_number="FIR-2026-00631", title="Women Safety Investigation", description="Harassment Complaint", case_type="WOMEN_SAFETY", police_station="Women Cell North", investigating_officer_id=users[1].id, department_id=depts[1].id, priority="CRITICAL", status="OPEN", confidentiality_level="HIGHLY_CONFIDENTIAL", incident_date=datetime.utcnow() - timedelta(days=5), registration_date=datetime.utcnow() - timedelta(days=2), created_by=users[1].id),
    ]
    db.add_all(cases)
    db.commit()
    for c in cases: db.refresh(c)
    
    print("Seeding documents...")
    # Create fake files for hashing
    os.makedirs("/tmp/nyayavault_seed", exist_ok=True)
    fake_file = "/tmp/nyayavault_seed/dummy.txt"
    with open(fake_file, "w") as f:
        f.write("This is a simulated forensic report for demo purposes.")
    dummy_hash = generate_file_hash(fake_file)
    
    docs = [
        Document(document_id=f"DOC-{uuid.uuid4().hex[:6].upper()}", case_id=cases[0].id, title="Initial FIR Report", document_type="FIR", file_name="fir_482.pdf", file_path=fake_file, file_size=1024, mime_type="application/pdf", uploaded_by=users[1].id, sha256_hash=dummy_hash),
        Document(document_id=f"DOC-{uuid.uuid4().hex[:6].upper()}", case_id=cases[0].id, title="Forensic Analysis Report", document_type="FORENSIC_REPORT", file_name="forensic_analysis_482.pdf", file_path=fake_file, file_size=2048, mime_type="application/pdf", uploaded_by=users[2].id, sha256_hash=dummy_hash),
    ]
    db.add_all(docs)
    db.commit()
    for d in docs: db.refresh(d)
    
    print("Seeding document versions and blockchain...")
    for d in docs:
        version = DocumentVersion(document_id=d.id, version_number=1, file_path=d.file_path, sha256_hash=d.sha256_hash, change_description="Original Upload", uploaded_by=d.uploaded_by)
        db.add(version)
        db.commit()
        db.refresh(version)
        
        tx = anchor_document_to_blockchain(db, d.id, d.sha256_hash, d.uploaded_by, "UPLOADED")
        version.blockchain_reference = tx.transaction_id
        db.commit()
        
        chain = EvidenceChain(document_id=d.id, action="UPLOADED", performed_by=d.uploaded_by, current_hash=d.sha256_hash, blockchain_tx_id=tx.transaction_id)
        db.add(chain)
        
        audit = AuditLog(actor_id=d.uploaded_by, action="UPLOAD_DOCUMENT", resource_type="DOCUMENT", resource_id=str(d.id), result="SUCCESS", severity="LOW")
        db.add(audit)
        
    db.commit()
    print("Seeding complete.")
    db.close()

if __name__ == "__main__":
    seed()
