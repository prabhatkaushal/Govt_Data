# Current Development Phase

**Phase 7 — Audit Trail & Refinement (IN PROGRESS)**
The foundational backend (Django), database schema, JWT authentication, RBAC, case management, document uploading, hashing, and simulated blockchain are already implemented. The frontend is set up with Next.js but requires further integration and UI refinement to connect to all backend endpoints.

# Recommended Next Phase

**Phase 8 — Frontend Integration & UI Hardening**
The immediate next step is to ensure the Next.js frontend fully implements the UI for the existing backend capabilities. This includes building out the dashboard, case workspace, document viewers, and displaying the chain-of-custody (EvidenceChain) to the user.

---

# Roadmap

### Phase 0 — Project setup (✅ COMPLETE)
- **Objective:** Initialize repositories and environments.
- **Features:** Django backend, Next.js frontend, Docker Compose.
- **Status:** ✅ COMPLETE

### Phase 1 — Authentication (✅ COMPLETE)
- **Objective:** Secure access to the system.
- **Features:** Custom User model, JWT token generation, Login endpoint.
- **Modules:** `api.models.User`, `api.views.CustomTokenObtainPairView`.
- **Status:** ✅ COMPLETE

### Phase 2 — User & role management (✅ COMPLETE)
- **Objective:** Implement RBAC.
- **Features:** Departments, Roles (Admin, Investigator, etc.).
- **Status:** ✅ COMPLETE

### Phase 3 — Case management (✅ COMPLETE)
- **Objective:** Allow creation and tracking of investigations.
- **Features:** Case CRUD operations, assignment to officers.
- **Modules:** `api.models.Case`, `api.views.CaseViewSet`.
- **Status:** ✅ COMPLETE

### Phase 4 — Document management (✅ COMPLETE)
- **Objective:** Secure document storage.
- **Features:** File upload to `/media/`, metadata storage.
- **Modules:** `api.models.Document`, `api.views.DocumentViewSet`.
- **Status:** ✅ COMPLETE

### Phase 5 — Document integrity (✅ COMPLETE)
- **Objective:** Prevent tampering.
- **Features:** SHA-256 hash generation upon chunked file upload.
- **Status:** ✅ COMPLETE

### Phase 6 — Evidence management (✅ COMPLETE)
- **Objective:** Chain of custody.
- **Features:** `EvidenceChain` table tracking all interactions.
- **Status:** ✅ COMPLETE

### Phase 7 — Blockchain & Digital Signatures (🟡 IN PROGRESS)
- **Objective:** Simulated immutability and mock signatures.
- **Features:** `BlockchainRecord` table, mock `/sign` endpoint.
- **Status:** 🟡 IN PROGRESS (Backend models exist, UI integration pending)

### Phase 8 — Frontend Integration (🔵 PLANNED)
- **Objective:** Connect the Next.js UI to the full API.
- **Features:** Dashboards, case views, document viewers, audit logs UI.
- **Status:** 🔵 PLANNED

### Phase 9 — Search (🔵 PLANNED)
- **Objective:** Make finding documents easy.
- **Features:** Global keyword search, filtering by metadata.
- **Status:** 🔵 PLANNED

### Phase 10 — AI/OCR (🔵 PLANNED)
- **Objective:** Automate data extraction.
- **Features:** OCR on PDFs/Images, semantic search, case summarization.
- **Status:** 🔵 PLANNED

### Phase 11 — Security Hardening & Testing (🔵 PLANNED)
- **Objective:** Prepare for production.
- **Features:** Penetration testing, unit tests, fixing vulnerabilities.
- **Status:** 🔵 PLANNED
