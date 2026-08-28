# PROJECT MEMORY

## Current Status
The project successfully completed a major migration of the backend from FastAPI to Django (and Django REST Framework). The frontend remains Next.js 14 utilizing a deep-navy cybersecurity design language. Core data models have been translated to Django ORM.

## Current Architecture
Next.js (React) Frontend connecting via Axios to a Django REST API backend. SQLite is currently being used for local dev persistence.

## Implemented Features
- Django Models (`User`, `Case`, `Document`, `EvidenceChain`, `AuditLog`, `BlockchainRecord`, `DigitalSignature`).
- Next.js UI structure (Login, Dashboard, Cases, Documents).
- UI Design System applied (Shield logo, gradients, deep navy sidebars).

## In Progress
- Connecting the Next.js frontend upload forms to the Django DRF endpoints.
- End-to-end authentication flow (JWT).

## Planned
- Real Hyperledger Fabric blockchain anchoring.
- AI / OCR integrations.
- Comprehensive Unit Testing.

## Important Files
- `backend/api/models.py`: The single source of truth for the database schema, including versioning and chain-of-custody.
- `frontend/src/components/layout/Sidebar.tsx`: The primary navigation shell.
- `PROJECT_OVERVIEW.md`: Master documentation for PPT and judging reference.

## Database State
Using SQLite via Django settings. Models are fully migrated locally.

## API State
DRF basic setup exists in `api/views.py`.

## Authentication State
Django built-in `AbstractUser`. Next.js uses a dummy Context that needs to be wired to Django token endpoints.

## Security State
Django defaults (CSRF, XSS protection). Passwords hashed using PBKDF2.

## Blockchain State
Mocked via `BlockchainRecord` local table.

## AI State
Not implemented.

## Search State
Basic ORM filtering.

## Evidence State
Implemented via `EvidenceChain` model schema.

## Audit State
Implemented via `AuditLog` model schema.

## Known Issues
- The frontend Next.js forms (like document upload) are currently mocked and not successfully persisting multipart data to the new Django backend yet.

## Decisions Made
- Transitioned backend from FastAPI to Django for more robust ORM and built-in administrative features.
- Documents are stored off-chain; only integrity-related hashes are anchored.

## Do Not Change
- The dual-sidebar cybersecurity design aesthetic in the frontend.
- The append-only `DocumentVersion` philosophy (never delete/overwrite files).

## Next Steps
- Finalize the API connection between Next.js and Django for User Auth and Document Uploads.

## Last Updated
2026-08-28
