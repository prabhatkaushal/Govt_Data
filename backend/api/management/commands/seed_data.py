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
            User(username="26000001", employee_id="26000001", full_name="Super Admin", email="admin@nyayavault.gov", password=make_password("gov123"), role=RoleEnum.SUPER_ADMIN),
            User(username="26010001", employee_id="26010001", full_name="Inspector Rahul Sharma", email="investigator@nyayavault.gov", password=make_password("gov123"), role=RoleEnum.INVESTIGATING_OFFICER, department=depts[0]),
            User(username="26030001", employee_id="26030001", full_name="Dr. Anita Mehta", email="forensic@nyayavault.gov", password=make_password("gov123"), role=RoleEnum.FORENSIC_OFFICER, department=depts[2]),
            User(username="26040001", employee_id="26040001", full_name="Advocate Priya Patel", email="legal@nyayavault.gov", password=make_password("gov123"), role=RoleEnum.LEGAL_OFFICER, department=depts[3]),
            User(username="26000002", employee_id="26000002", full_name="Auditor Verma", email="auditor@nyayavault.gov", password=make_password("gov123"), role=RoleEnum.AUDITOR),
        ]
        User.objects.bulk_create(users)
        investigator = User.objects.get(username="26010001")

        self.stdout.write("Seeding cases...")
        cases = [
            Case(case_number="FIR-2026-00482", title="Cyber Crime Investigation", description="Digital Fraud and Identity Theft", case_type="CYBERCRIME", police_station="Cyber Cell Central", investigating_officer=investigator, department=depts[0], priority="HIGH", status="UNDER_INVESTIGATION", incident_date=timezone.now() - timedelta(days=10), created_by=investigator),
            Case(case_number="FIR-2026-00631", title="Women Safety Investigation", description="Harassment Complaint", case_type="WOMEN_SAFETY", police_station="Women Cell North", investigating_officer=investigator, department=depts[1], priority="CRITICAL", status="OPEN", incident_date=timezone.now() - timedelta(days=5), created_by=investigator),
            Case(case_number="FIR-2026-00712", title="Corporate Espionage", description="Data leak from a major government contractor", case_type="ECONOMIC_OFFENCE", police_station="HQ Central", investigating_officer=investigator, department=depts[0], priority="CRITICAL", status="OPEN", incident_date=timezone.now() - timedelta(days=2), created_by=investigator),
            Case(case_number="FIR-2026-00805", title="Organized Crime Syndicate", description="Investigation into an illegal smuggling ring", case_type="ORGANIZED_CRIME", police_station="City District East", investigating_officer=investigator, department=depts[0], priority="HIGH", status="UNDER_INVESTIGATION", incident_date=timezone.now() - timedelta(days=25), created_by=investigator),
            Case(case_number="FIR-2026-00911", title="Financial Fraud", description="Phishing scam affecting 500+ victims", case_type="CYBERCRIME", police_station="Cyber Cell West", investigating_officer=investigator, department=depts[0], priority="MEDIUM", status="OPEN", incident_date=timezone.now() - timedelta(days=1), created_by=investigator),
        ]
        Case.objects.bulk_create(cases)

        self.stdout.write(self.style.SUCCESS('Successfully seeded database'))
