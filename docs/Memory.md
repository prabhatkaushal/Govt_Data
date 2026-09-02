# PROJECT MEMORY

## Current Status
The project has a solid foundational backend built in Django and a Next.js frontend structure. The core backend data models and REST APIs for authentication, case management, and document uploading (with local storage and SHA-256 hashing) are completely implemented. 

## Current Architecture
- **Backend:** Django 5.x, Django REST Framework, Simple JWT.
- **Database:** SQLite (default fallback) / PostgreSQL.
- **Frontend:** Next.js 14, React 18, Tailwind CSS.
- **Storage:** Local file system (`/media/`).

## Implemented Features
- User Authentication (JWT)
- Role-Based Access Control (Roles: Admin, Investigating Officer, etc.)
- Case Management CRUD
- Document Upload & Local Storage
- SHA-256 Hashing on Upload
- Document Versioning (Database records)
- Chain of Custody logging (`EvidenceChain`)
- System Audit Logs (`AuditLog`)
- Mock Digital Signatures (`DigitalSignature` table and `/sign` endpoint)
- Simulated Blockchain Anchoring (`BlockchainRecord` table)

## In Progress
- Connecting the Next.js frontend views to all the implemented Django REST APIs.

## Planned
- Secure Document Preview in the UI.
- Access Request workflow integration.
- True AI/OCR processing and semantic search.
- Transitioning simulated blockchain to a real ledger (if required).
- Production deployment configuration (S3 integration for media).

## Important Files
- `backend/api/models.py`: Contains the absolute source of truth for the database schema (User, Case, Document, EvidenceChain, etc.).
- `backend/api/views.py`: Contains the DRF ViewSets governing business logic, particularly the `DocumentViewSet.create()` which handles file saving, hashing, and auditing simultaneously.
- `backend/core/settings.py`: Django configuration, database routing, JWT settings.

## Database State
Stable. Uses Django ORM. Key tables mapped:
- `api_user`
- `api_case`
- `api_document`
- `api_evidencechain`
- `api_auditlog`

## API State
Fully functional REST API available under `/` (e.g., `/cases/`, `/documents/`). Authentication under `/auth/login/`.

## Authentication State
Uses `djangorestframework-simplejwt`. Tokens are issued via `/auth/login/` and must be passed as Bearer tokens.

## Security State
Passwords are hashed. Files are hashed with SHA-256. API routes are protected by DRF's `IsAuthenticated`. Files are stored securely on the local disk.

## Blockchain State
Simulated. A database table (`BlockchainRecord`) mimics an immutable ledger by storing document hashes and transaction IDs.

## AI State
**NOT CURRENTLY IMPLEMENTED.** (Planned for future phases).

## Search State
Basic database ORM querying available. Semantic/Full-text search is not implemented yet.

## Evidence State
Fully implemented via the `EvidenceChain` model, which acts as an append-only log for document interactions.

## Audit State
Implemented. General actions can be logged to `AuditLog`, specific file actions to `EvidenceChain`.

## Known Issues
- `README.md` and old documentation incorrectly stated the backend was FastAPI. It has been verified to be Django. 
- Frontend UI is not yet fully wired to all the backend endpoints.

## Decisions Made
- **Backend Framework:** Django was selected (and implemented) over FastAPI for robust ORM and built-in auth features.
- **Blockchain:** Mocked in a relational table for prototype purposes.
- **Storage:** Local filesystem is used for immediate simplicity, with plans to abstract to S3.

## Do Not Change
- Do not migrate the backend away from Django.
- Do not remove the SHA-256 hashing step in the document upload process.
- The `EvidenceChain` must remain an append-only architecture.

## Next Steps
1. Wire up the Next.js frontend to the Django REST APIs.
2. Build the Dashboard and Case Workspace UIs.
3. Implement secure file download/preview APIs.

## Last Updated
August 29, 2026
