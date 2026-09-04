# 1. General Development Rules

- **Inspect existing code before changing it.** Always read the existing Django models, DRF views, and Next.js components before building new ones.
- **Reuse existing architecture.** Stick to Django REST Framework (DRF) patterns for the backend and Next.js App Router patterns for the frontend.
- **Avoid unnecessary rewrites.** Do not switch frameworks (e.g., do not migrate to FastAPI since the project is already built in Django).
- **Do not invent APIs.** Check `urls.py` and `views.py` to see if an endpoint already exists before creating a new one.
- **Keep changes modular.** 
- **Preserve working functionality.** 

# 2. Code Quality

- **Naming:** Use `snake_case` for Python variables/functions and `CamelCase` for classes. Use `camelCase` for TypeScript/JavaScript variables and `PascalCase` for React components.
- **Components:** Next.js components should be functional and utilize Hooks. Favor Server Components where client-side interactivity is not needed.
- **Services:** Keep business logic inside Django ViewSets or extract them to service layers if they become too complex.
- **Error handling:** Return standard HTTP status codes (e.g., 400 for bad request, 403 for forbidden, 404 for not found) using DRF's `Response`.
- **Validation:** Always use DRF Serializers for incoming data validation. Do not manually parse `request.data` without a serializer if possible.

# 3. Security Rules

- **Never expose secrets.** Keep `SECRET_KEY`, Database URLs, and JWT keys in `.env` files. Never commit `.env`.
- **Never hardcode API keys.** 
- **Never log passwords/tokens.** Audit logs must never contain sensitive authentication material.
- **Validate uploaded files.** Ensure file types, sizes, and mime types are checked before saving to disk.
- **Validate user permissions server-side.** Frontend UI hiding is not security. Always enforce RBAC in Django views using DRF `permission_classes` or custom permission checks.
- **Never trust frontend authorization.**
- **Protect sensitive documents.** Documents must only be served to authorized users. 
- **Use secure password handling.** Rely on Django's built-in `make_password` and authentication backends.
- **Follow least privilege.** Ensure users only have access to data required for their specific role.

# 4. Document Rules

- **Upload:** Documents must be hashed (SHA-256) at the exact time of upload.
- **Storage:** Files are saved to the `/media/` directory with UUID-based names to prevent scraping and path traversal.
- **Modification:** Documents are immutable. To "modify" a document, a new `DocumentVersion` must be created.
- **Deletion:** Soft deletes only. Mark status as "INACTIVE" instead of physically deleting to preserve audit trails.
- **Verification:** Any fetch of a document should allow for hash re-computation to verify it hasn't been altered on disk.

# 5. Evidence Rules

- **Evidence IDs:** Must be globally unique.
- **Custody:** Every interaction (upload, view, sign, transfer) MUST create a record in the `EvidenceChain` table.
- **Audit events:** `EvidenceChain` acts as the primary chain-of-custody tracker.

# 6. AI Rules

- **AI is Planned.** When implemented:
- AI must NOT invent legal facts or case information (No hallucinations).
- AI should use authorized data only (respecting RBAC in RAG architectures).
- AI must clearly distinguish retrieved information from generated summaries.

# 7. Blockchain Rules

- **Simulated Architecture:** Currently uses a `BlockchainRecord` table.
- Never store large documents directly on-chain.
- Only store integrity proofs (SHA-256 hashes), timestamps, and actor metadata in the blockchain record.

# 8. Database Rules

- **Schema changes:** Must be done via Django's `makemigrations` and `migrate` commands. Never modify the database schema directly.
- **Validation:** Enforce constraints at the database level where possible (e.g., `unique=True`, `null=False`).
- **Sensitive data:** PII and highly sensitive case notes should be treated carefully.

# 9. API Rules

- **Authentication:** All secured endpoints must require a valid JWT via `Authorization: Bearer <token>`.
- **Authorization:** Check `request.user.role`.
- **Error responses:** Use structured JSON error responses.

# 10. UI/UX Rules

- **Consistency:** Use the provided Tailwind/shadcn UI components.
- **Design Language:** Professional, government-grade, security-oriented (navy, dark grays, clear status indicators).
- **Responsive layout:** Ensure the dashboard is usable on tablets and desktops.

# 11. Error Handling

- Django backend should catch exceptions and return sanitized 500 errors in production, preventing stack trace leakage.

# 12. Testing Rules

- New features should be testable.
- Ensure authentication and permissions are explicitly tested.

# 13. Git/Change Rules

- Commit often with clear, descriptive messages.
- Preserve backwards compatibility for APIs if the frontend relies on them.
