# NyayaVault - Secure Digital Evidence & Legal Document Management Platform

**SIH Problem Statement ID:** 26190

## Overview
NyayaVault is a centralized, highly secure platform designed for authorized law enforcement, investigation, forensic, legal, and audit personnel. It provides an end-to-end digital evidence management solution with an immutable chain of custody, document integrity verification (SHA-256), simulated blockchain anchoring, and digital signatures.

## Features
* **Secure Access:** Role-Based Access Control (RBAC) with JWT authentication.
* **Case Management:** Create, track, and manage legal cases securely.
* **Document Management:** Secure upload, classification, version control, and preview of confidential documents.
* **Evidence Integrity:** SHA-256 hashing for all uploaded files to guarantee no tampering.
* **Digital Signatures:** Prototype HMAC-based digital signatures to authenticate case files.
* **Blockchain Verification:** Simulated local ledger to anchor document hashes in an immutable chain.
* **Chain of Custody:** Detailed chronologic timeline for every action taken on an evidence file.
* **Auditability:** Complete audit logs mapping every system event with IP and actor details.
* **AI Assistance:** Mock AI endpoints demonstrating how classification, summarization, and smart search integrate.
* **Cybersecurity Dashboard:** Visual monitoring of the system's security score and active alerts.

## Tech Stack
* **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS, framer-motion
* **Backend:** Django 5, Django REST Framework (DRF)
* **Database:** SQLite (default for development)
* **Authentication:** JWT via `djangorestframework-simplejwt`
* **Containerization:** Docker & Docker Compose (Optional)

## Installation

### Prerequisites
* Node.js v18+ 
* Python 3.10+

### Environment Variables
No strict environment variables are required out-of-the-box for local SQLite development, but you can configure database URLs in `.env` if using PostgreSQL.

### Running Locally (Without Docker)

#### Backend (Django)
```bash
cd backend
python -m venv venv
# On Windows: venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver 0.0.0.0:8000
```

#### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

## Seed Data & Demo Accounts
The system is seeded with fictional data for demonstration purposes. Use the following accounts to test RBAC logic:
* **Admin:** `admin` / `password` (Super Admin)
* **Investigator:** `investigator@nyayavault.gov` / `password`
* **Forensic:** `forensic@nyayavault.gov` / `password`
* **Legal:** `legal@nyayavault.gov` / `password`
* **Auditor:** `auditor@nyayavault.gov` / `password`

## API Documentation
Once the backend is running, the OpenAPI/Swagger documentation is available at:
`http://localhost:8000/docs`

## Future Enhancements
* Replace local simulated blockchain with Hyperledger Fabric or an Ethereum private network.
* Integrate PKI-based digital signatures (eSign/Aadhaar integration).
* Implement real OCR and LLM (OpenAI/Gemini) for the AI Service abstraction.
* Integrate AWS S3 / Azure Blob Storage for scalable, encrypted document storage.
