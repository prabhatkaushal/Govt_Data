# Phases

## Phase 0 — Project Setup
✅ COMPLETE. Next.js and Django scaffolded.

## Phase 1 — Authentication
🟡 IN PROGRESS. Django user models and settings exist, but seamless JWT integration with Next.js is pending.

## Phase 2 — User & Role Management
🟡 IN PROGRESS. `RoleEnum` exists in `models.py`, but Django Admin / API role assignment is basic.

## Phase 3 — Case Management
✅ COMPLETE. Django models and DRF viewsets implemented. Next.js dashboard UI exists.

## Phase 4 — Document Management
🟡 IN PROGRESS. Models and basic UI exist, but the actual multipart file upload pipeline needs connection.

## Phase 5 — Secure Storage
🟡 IN PROGRESS. Currently local `MEDIA_ROOT`. Needs S3 migration.

## Phase 6 — Document Integrity
✅ COMPLETE (Data Layer). SHA-256 hash fields are present in the models.

## Phase 7 — Evidence Management
✅ COMPLETE. `EvidenceChain` model established.

## Phase 8 — Audit Trail
🟡 IN PROGRESS. `AuditLog` exists, but automatic middleware triggers need refinement.

## Phase 9 — Search
🟡 IN PROGRESS. Django ORM basic filtering; advanced search pending.

## Phase 10 — AI/OCR
🔵 PLANNED.

## Phase 11 — Blockchain
🟡 IN PROGRESS. Simulated locally via `BlockchainRecord`. Needs Hyperledger integration.

## Phase 12 — Digital Signatures
🟡 IN PROGRESS. Mocked via `DigitalSignature` model. Needs PKI/Aadhaar integration.

## Phase 13 — Security Hardening
🔵 PLANNED.

## Phase 14 — Testing
❌ BLOCKED (Requires core flows to stabilize).

## Phase 15 — Deployment
🔵 PLANNED.

# Current Development Phase
Phase 4/5. The foundational models and UI are in place, but the end-to-end multipart upload pipeline and authentication connection need finalization.

# Recommended Next Phase
Complete Phase 1 (Auth) and Phase 4 (Document Upload). The frontend must successfully POST a file to Django, Django must calculate the hash, save it, and return a success response to the UI.
