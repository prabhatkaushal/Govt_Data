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
* **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui
* **Backend:** FastAPI, Python, SQLAlchemy, Pydantic, Alembic
* **Database:** PostgreSQL (or SQLite for local fallback)
* **Authentication:** JWT (JSON Web Tokens) with short-lived access and long-lived refresh tokens.
* **Containerization:** Docker & Docker Compose

## Installation

### Prerequisites
* Docker and Docker Compose
* Node.js v18+ (if running frontend locally)

### Environment Variables
Copy `.env.example` to `.env` and fill out the placeholders.

### Running with Docker (Recommended)
```bash
docker compose up --build
```
This will start PostgreSQL, the FastAPI backend on `http://localhost:8000`, and the Next.js frontend on `http://localhost:3000`.

### Running Locally (Without Docker)

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
python seed_data.py
uvicorn main:app --reload
```

#### Frontend
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
