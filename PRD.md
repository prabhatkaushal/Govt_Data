# 1. Project Overview
**NyayaVault - Secure Digital Document Management System**
"A secure, tamper-evident digital platform for managing legal, investigative, and evidentiary documents throughout their lifecycle."
The project solves the problem of fragmented storage, unauthorized access, and tampering of sensitive legal documents (FIRs, Forensics, Evidence). Current physical or standard cloud storage lacks accountability and cryptographic proof of integrity. NyayaVault acts as a centralized vault where every interaction is logged and every document is hashed and version-controlled.

# 2. Target Users
- **Investigating Officers:** Manage assigned cases and upload evidence.
- **Legal Departments/Prosecutors:** View finalized case documents.
- **Administrators:** Manage departments and roles.
- **Viewers:** Access shared/publicly allowed documents.

# 3. User Problems
Officers struggle to maintain a clean chain of custody for digital files. Standard systems do not mathematically prove a document hasn't been secretly altered.

# 4. Product Goals
Centralize documents securely, enforce RBAC, mathematically prove integrity via hashing and simulated blockchain, and maintain an immutable chain of custody.

# 5. Functional Requirements
- Authentication: **PARTIALLY IMPLEMENTED** (Django sessions/tokens setup, pending robust frontend integration)
- Role-based access: **PARTIALLY IMPLEMENTED** (Roles exist in DB, route guards pending)
- Case management: **IMPLEMENTED** (Django CRUD endpoints)
- Document upload: **PARTIALLY IMPLEMENTED** (Endpoints defined, multipart parsing pending)
- Document versioning: **IMPLEMENTED** (Append-only `DocumentVersion` model)
- Evidence management & Chain of custody: **IMPLEMENTED** (`EvidenceChain` model captures actions and hashes)
- Audit trail: **PARTIALLY IMPLEMENTED** (`AuditLog` model exists)
- Hash/integrity verification: **IMPLEMENTED** (SHA-256 field tracking)
- Blockchain verification: **PARTIALLY IMPLEMENTED** (Local `BlockchainRecord` DB simulation)
- Digital signatures: **PLACEHOLDER / MOCK** (`DigitalSignature` model exists without real PKI)
- AI/OCR & Semantic Search: **NOT IMPLEMENTED**

# 6. Non-Functional Requirements
- **Security:** Argon2/PBKDF2 passwords, isolated local storage.
- **Auditability:** Every document action must drop an `EvidenceChain` trace.

# 7. User Stories
- "As an investigating officer, I want to securely upload a forensic report so that it cannot be altered without leaving a cryptographic trace."
- "As an administrator, I want to review the system audit logs so that I can detect unauthorized access attempts."

# 8. Use Cases
- Create Case, Upload Document, View Document, Verify Integrity.

# 9. Success Criteria
A user can upload a file, have its hash generated, and view its immutable chain of custody timeline proving it hasn't been altered.

# 10. Scope
**IN SCOPE:** Case/Document CRUD, Hashing, Chain of Custody, Audit Log, Local Block Simulation.
**FUTURE SCOPE:** AI/OCR, RAG, Hyperledger Fabric Node, Aadhaar eSign.
