# 1. Project Overview

**Project Name:** NyayaVault - Secure Digital Document Management System

**One-line description:** A centralized, highly secure platform for law enforcement, investigation, and legal personnel to manage sensitive documents with strict access controls and verifiable integrity.

**Problem being solved:** Law enforcement agencies, courts, and investigative organizations handle massive volumes of sensitive documents (FIRs, evidence, forensic reports, etc.). Currently, managing these physically or via disparate digital systems risks unauthorized access, tampering, loss of chain of custody, and inefficiency in retrieval.

**Why the problem matters:** The integrity of legal documents is paramount. If evidence or case files are tampered with, legal cases can collapse, leading to miscarriages of justice. Secure, auditable tracking is required by law.

**Current challenges:**
- Fragmented storage systems
- Lack of verifiable audit trails and chain of custody
- Difficulty in proving a document hasn't been tampered with
- Inefficient search and retrieval of case files
- Poor role-based access enforcement

**Proposed solution:** A unified platform providing role-based access control (RBAC), immutable audit trails, SHA-256 document hashing, simulated blockchain anchoring for integrity, and secure digital signatures. 

# 2. Target Users

- **Administrators (Super Admin / Admin):** Manage system configuration, users, and overall security.
- **Investigating Officers / Police Officers:** Create cases, upload evidence, and manage investigation files.
- **Forensic Officers:** Upload and verify forensic reports with digital signatures.
- **Legal Officers / Prosecutors:** Access case files, court filings, and judgments securely for legal proceedings.
- **Auditors:** Review audit logs, chain of custody, and ensure system compliance.
- **Viewers:** Authorized personnel with read-only access to specific cases.

# 3. User Problems

- **Investigating Officers:** Struggle to securely store and track the chain of custody for digital evidence without risking tampering.
- **Forensic Officers:** Need a way to cryptographically sign their reports so their authenticity cannot be disputed in court.
- **Prosecutors:** Waste time searching through disorganized physical or poorly indexed digital files to build cases.
- **Administrators:** Find it difficult to enforce strict "least privilege" access across different departments.
- **Auditors:** Lack a centralized, immutable log of who viewed, modified, or downloaded specific sensitive files.

# 4. Product Goals

1. **Digitize and centralize** sensitive document storage.
2. **Secure** documents through strict Role-Based Access Control (RBAC).
3. **Ensure Evidence Integrity** using hashing and blockchain verification.
4. **Maintain absolute accountability** through immutable audit trails and chain-of-custody tracking.
5. **Enable rapid discovery** of documents (with future AI/OCR enhancements).

# 5. Functional Requirements

- **Authentication:** Custom JWT-based authentication. (IMPLEMENTED)
- **User management:** Departments and User roles creation. (IMPLEMENTED)
- **Role-based access (RBAC):** Restricting API access based on user roles. (IMPLEMENTED)
- **Case management:** Create, track, and manage legal cases. (IMPLEMENTED)
- **Document upload:** Securely upload files to local storage. (IMPLEMENTED)
- **Document organization:** Link documents to specific cases. (IMPLEMENTED)
- **Document versioning:** Track different versions of a document. (IMPLEMENTED)
- **Document search:** Basic search. (PARTIALLY IMPLEMENTED)
- **Document preview:** Viewing documents securely. (PARTIALLY IMPLEMENTED - via frontend logic)
- **Secure sharing:** Access request workflow. (PLANNED - models exist, API pending)
- **Evidence management:** Track evidence metadata. (IMPLEMENTED)
- **Chain of custody:** Track every action on a document in `EvidenceChain`. (IMPLEMENTED)
- **Audit trail:** Log system actions in `AuditLog`. (IMPLEMENTED)
- **Digital signatures:** Mock HMAC-based signatures. (IMPLEMENTED)
- **Hash/integrity verification:** SHA-256 hash generation on upload. (IMPLEMENTED)
- **Blockchain verification:** Simulated blockchain anchoring in database. (IMPLEMENTED)
- **AI/OCR:** AI-assisted summarization and semantic search. (PLANNED)
- **Notifications:** In-app user notifications. (PLANNED - models exist)
- **Dashboard:** Overview of system activity and security. (PARTIALLY IMPLEMENTED)
- **Reporting:** Exporting audit logs and case summaries. (PLANNED)

# 6. Non-Functional Requirements

- **Security:** JWT authentication, SHA-256 hashing, no exposed secrets.
- **Scalability:** Django backend and Next.js frontend, capable of horizontal scaling. 
- **Availability:** High uptime targets.
- **Performance:** Fast document retrieval and API response times.
- **Privacy:** Strict data segregation by cases and roles.
- **Auditability:** Every system change must be logged immutably.
- **Reliability:** No single point of failure in production deployments.
- **Maintainability:** Clean, modular Django apps and React components.

# 7. User Stories

- "As an investigating officer, I want to securely upload a case document so that its integrity is cryptographically locked and tracked."
- "As an authorized prosecutor, I want to search documents by case number so that I can quickly prepare for a hearing."
- "As an administrator, I want to control permissions based on department and rank so that only authorized personnel can view sensitive FIRs."
- "As an auditor, I want to view the complete chain of custody for a piece of digital evidence so that I can verify it hasn't been accessed by unauthorized parties."

# 8. Use Cases

1. **Onboarding a New Case:** An Investigating Officer logs in, creates a new Case under their department, and assigns a confidentiality level.
2. **Uploading Evidence:** A Forensic Officer uploads a forensic report, which the system automatically hashes (SHA-256), signs, and anchors to the simulated blockchain, creating an immutable Evidence Chain record.
3. **Auditing a File:** An Auditor selects a document and views its Evidence Chain and Audit Logs to see every IP address and user that has interacted with it.

# 9. Success Criteria

- 100% of uploaded documents have a verifiable SHA-256 hash and blockchain record.
- Unauthorized users are strictly blocked from accessing cases outside their purview.
- A complete, unbroken chain of custody is generated for every document.
- Zero leakage of sensitive metadata to unauthenticated users.

# 10. Scope

**IN SCOPE:**
- Django REST API backend
- Next.js frontend
- SQLite/PostgreSQL Database
- JWT Authentication & RBAC
- Case and Document Management
- SHA-256 Integrity Verification
- Simulated Blockchain anchoring
- Mock Digital Signatures
- Chain of Custody & Audit Trails

**OUT OF SCOPE (For Prototype Phase):**
- Real hyperledger/Ethereum deployment
- Actual eSign/Aadhaar PKI integration
- Cloud object storage (S3) integration
- Production email servers

**FUTURE SCOPE:**
- Real OCR and AI (OpenAI/Gemini) for classification and search
- True decentralized blockchain network
- Advanced biometric authentication
