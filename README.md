# Secura - Secure Digital Evidence & Legal Document Management Platform

**SIH Problem Statement ID:** 26190

## Overview
Secura is a highly secure, centralized platform designed for authorized law enforcement, investigation, forensic, legal, and audit personnel. It provides an end-to-end digital evidence management solution with an immutable chain of custody, document integrity verification (SHA-256), mock blockchain anchoring, and **AI-powered Semantic Search & Summarization** running 100% locally to guarantee zero data leakage.

## Architecture
Secura is built on a modern, decoupled microservices architecture:
* **Frontend (Port 3000):** Next.js 14, React 18, TypeScript, Tailwind CSS
* **Core Backend (Port 8000):** Django 5, DRF, SQLite (default fallback) / PostgreSQL
* **AI Microservice (Port 8001):** FastAPI, \sentence-transformers\, \PyPDF2\
* **Local LLM Engine:** Ollama (Llama 3) for zero-telemetry natural language synthesis

## Key Features
1. **Secure File Vault:** AES-256 encrypted uploads with strict Role-Based Access Control (RBAC).
2. **AI Semantic Search:** Search through thousands of case documents using meaning and context (Cosine Similarity vector search) rather than just keywords.
3. **AI Document Synthesis:** Instantly generate bullet-point summaries of lengthy legal documents and FIRs using Llama 3.
4. **Audit Trail & Chain of Custody:** Every action (view, download, upload) is logged immutably.
5. **Cryptographic Integrity:** SHA-256 hashing verifies that documents have not been tampered with since upload.

## Installation & Setup (Local Development)

The system is configured to run entirely natively on your machine without requiring Docker, utilizing SQLite and an In-Memory Vector Store for rapid testing.

### Prerequisites
* Node.js v18+ 
* Python 3.10+
* Ollama installed locally ([ollama.com](https://ollama.com))

### 1. Download Local AI Model
Before starting the app, ensure you pull the Llama 3 model into Ollama:
\\\ash
ollama run llama3
\\\

### 2. Run the Setup Script
Open a terminal in the root folder and run the setup script. This will install all Python and Node dependencies, migrate the database, and seed it with demo data.
\\\ash
setup.bat
\\\
*(If on Mac/Linux, simply run the commands inside setup.bat manually).*

### 3. Start the Application
Double-click \start.bat\ or run it from your terminal:
\\\ash
start.bat
\\\
This will spawn three terminal windows running the Frontend (3000), Backend (8000), and AI Engine (8001).

## Demo Accounts
The system is seeded with fictional data for demonstration purposes. Use any of the following credentials to log in:
* **Admin:** \26000000\ / \gov123\
* **Investigator:** \26010001\ / \gov123\

## Team Notes
Please ensure no mock/dummy files remain in the root directory before pushing to production. Sample evidence files for testing uploads can be found in the \docs/\ folder.
