# 1. General Development Rules
- Inspect existing code (`api/models.py`, frontend routes) before changing it.
- Reuse existing Django architecture. Do not rewrite to FastAPI.
- Preserve working functionality.

# 2. Code Quality
- Name ViewSets clearly (e.g., `CaseViewSet`).
- Always create Django migrations (`python manage.py makemigrations`) when altering `models.py`.

# 3. Security Rules
- Never expose `.env` secrets.
- Validate user permissions server-side in Django views. Never trust frontend UI hiding alone.
- Protect sensitive documents; files must not be exposed in Next.js `public/` or unprotected static routes.

# 4. Document Rules
- Documents are append-only. Use `DocumentVersion` to handle modifications. Do not overwrite the physical file or delete the DB record.

# 5. Evidence Rules
- Evidence interactions MUST be logged in the `EvidenceChain` table to maintain legal traceability.

# 6. AI Rules
- AI must NOT invent legal facts or bypass Django authorization checks. (When implemented).

# 7. Blockchain Rules
- NEVER store large documents directly on-chain. Only store cryptographic hashes (SHA-256) and metadata inside `BlockchainRecord`.

# 8. Database Rules
- Do not bypass Django ORM for direct SQL unless absolutely necessary.
- Do not delete sensitive data (Use soft-delete `status="ARCHIVED"`).

# 9. API Rules
- Use Django REST Framework standards (Serializers, ViewSets).
- Return appropriate HTTP status codes (403 Forbidden, 404 Not Found).

# 10. UI/UX Rules
- Maintain the deep navy/cybersecurity-grade professional design system.
- Ensure clear status indicators (e.g., green for Verified Hash).

# 11. Error Handling
- Catch exceptions in Django and return clean JSON error payloads.

# 12. Testing Rules
- Write tests in `backend/api/tests.py` using Django TestCase.

# 13. Git/Change Rules
- Small, focused commits. Do not mix frontend redesigns with backend schema changes in the same commit.
