import os
from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from api.models import User, Department, Case, Document, RoleEnum
from django.utils import timezone
from datetime import timedelta
import uuid

class Command(BaseCommand):
    help = 'Seeds the database with initial data'

    def handle(self, *args, **kwargs):
        if User.objects.exists():
            self.stdout.write(self.style.WARNING("Database already seeded"))
            return

        self.stdout.write("Seeding departments...")
        depts = [
            Department(name="Cyber Crime Cell", department_code="CYB-01", organization="NCRB", location="Delhi"),
            Department(name="Women Safety Division", department_code="WSD-02", organization="NCRB", location="Delhi"),
            Department(name="Forensic Lab", department_code="FSL-03", organization="MHA", location="Delhi"),
            Department(name="Legal Services", department_code="LGL-04", organization="MHA", location="Delhi"),
        ]
        Department.objects.bulk_create(depts)
        depts = list(Department.objects.all())

        self.stdout.write("Seeding users...")
        users = [
            User(username="admin", employee_id="EMP001", full_name="Super Admin", email="admin@nyayavault.gov", password=make_password("password"), role=RoleEnum.SUPER_ADMIN),
            User(username="investigator", employee_id="EMP002", full_name="Inspector Rahul Sharma", email="investigator@nyayavault.gov", password=make_password("password"), role=RoleEnum.INVESTIGATING_OFFICER, department=depts[0]),
            User(username="forensic", employee_id="EMP003", full_name="Dr. Anita Mehta", email="forensic@nyayavault.gov", password=make_password("password"), role=RoleEnum.FORENSIC_OFFICER, department=depts[2]),
            User(username="legal", employee_id="EMP004", full_name="Advocate Priya Patel", email="legal@nyayavault.gov", password=make_password("password"), role=RoleEnum.LEGAL_OFFICER, department=depts[3]),
            User(username="auditor", employee_id="EMP005", full_name="Auditor Verma", email="auditor@nyayavault.gov", password=make_password("password"), role=RoleEnum.AUDITOR),
        ]
        User.objects.bulk_create(users)
        investigator = User.objects.get(username="investigator")

        self.stdout.write("Seeding cases...")
        cases = [
            Case(case_number="FIR-2026-00482", title="Cyber Crime Investigation", description="Digital Fraud and Identity Theft", case_type="CYBERCRIME", police_station="Cyber Cell Central", investigating_officer=investigator, department=depts[0], priority="HIGH", status="UNDER_INVESTIGATION", incident_date=timezone.now() - timedelta(days=10), created_by=investigator),
            Case(case_number="FIR-2026-00631", title="Women Safety Investigation", description="Harassment Complaint", case_type="WOMEN_SAFETY", police_station="Women Cell North", investigating_officer=investigator, department=depts[1], priority="CRITICAL", status="OPEN", incident_date=timezone.now() - timedelta(days=5), created_by=investigator),
        ]
        Case.objects.bulk_create(cases)

        self.stdout.write(self.style.SUCCESS('Successfully seeded database'))
