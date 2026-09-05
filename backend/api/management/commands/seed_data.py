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
        self.stdout.write("Clearing existing data...")
        Case.objects.all().delete()
        User.objects.all().delete()
        Department.objects.all().delete()

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
            User(username="26000000", employee_id="EMP001", full_name="Super Admin", email="admin@secura.gov", password=make_password("gov123"), role=RoleEnum.SUPER_ADMIN),
            User(username="26010001", employee_id="EMP002", full_name="Inspector Rahul Sharma", email="investigator@secura.gov", password=make_password("gov123"), role=RoleEnum.INVESTIGATING_OFFICER, department=depts[0]),
            User(username="26020001", employee_id="EMP003", full_name="Dr. Anita Mehta", email="forensic@secura.gov", password=make_password("gov123"), role=RoleEnum.FORENSIC_OFFICER, department=depts[2]),
            User(username="26030001", employee_id="EMP004", full_name="Advocate Priya Patel", email="legal@secura.gov", password=make_password("gov123"), role=RoleEnum.LEGAL_OFFICER, department=depts[3]),
            User(username="26040001", employee_id="EMP005", full_name="Auditor Verma", email="auditor@secura.gov", password=make_password("gov123"), role=RoleEnum.AUDITOR),
        ]
        User.objects.bulk_create(users)
        investigator = User.objects.get(username="26010001")

        self.stdout.write("Skipping case seeding (removed placeholders)...")

        self.stdout.write(self.style.SUCCESS('Successfully seeded database'))
