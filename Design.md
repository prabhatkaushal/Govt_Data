# 1. Design Philosophy

The NyayaVault design system is built to convey trust, security, and authority. 
**Style:** SECURE + PROFESSIONAL + MODERN + GOVERNMENT-GRADE + INVESTIGATION-FOCUSED.
It is not a generic SaaS dashboard; it must feel like a secure investigative environment. Information density should be high but highly organized.

# 2. Color System

**RECOMMENDED COLORS:**
- **Primary/Brand:** Deep Navy (`#0f172a` / slate-900) - Conveys authority and security.
- **Background:** Very Light Gray (`#f8fafc` / slate-50) for contrast and readability.
- **Surface/Cards:** White (`#ffffff`) with subtle borders, not heavy shadows.
- **Verified/Success:** Emerald Green (`#10b981`) - Used strictly for "Integrity Verified", "Blockchain Anchored", and valid signatures.
- **Warning:** Amber (`#f59e0b`) - For pending access requests or missing signatures.
- **Alert/Danger:** Red (`#ef4444`) - For tampered files, failed hash checks, or security breaches.

# 3. Typography

- **Font family:** Inter (or similar clean sans-serif like Roboto/San Francisco).
- **Headings:** Bold, slightly tighter letter spacing for a modern, serious look.
- **Body:** 14px or 16px, highly legible for long reports.
- **Monospace:** Use `JetBrains Mono` or `Fira Code` when displaying SHA-256 hashes or transaction IDs.

# 4. Spacing

- Follow standard Tailwind spacing scale (4px, 8px, 16px, 24px, 32px).
- UI should feel structured and grid-aligned.

# 5. Components

- **Buttons:** Sharp or slightly rounded corners (e.g., `rounded-md`), solid colors.
- **Cards:** Used to encapsulate Cases and Documents.
- **Tables:** Data-dense tables for Audit Logs and Evidence Chains with sticky headers.
- **Badges:** Essential for showing Status, Role, and Confidentiality Level.

# 6. Dashboard Design

- High-level overview.
- Metrics: Total Open Cases, Documents Uploaded Today, Security Alerts, Recent Audit Logs.
- Quick access to "My Assigned Cases".

# 7. Case Workspace

The central hub for an investigation.
- **Header:** Case Number, Title, Status, Priority Badge.
- **Tabs:** Overview | Documents | Evidence Chain | Personnel.
- **Layout:** Two-column layout with case details on the left, and recent activity timeline on the right.

# 8. Document Viewer

A secure modal or dedicated page to view sensitive documents.
**Critical UI Elements:**
- **Security Indicators (Top Right):**
  - [✓ Integrity Verified] (Green)
  - [✓ Signature Valid] (Green)
  - [✓ Blockchain Anchored] (Green)
  - [🔒 Confidential] (Navy)
- **Metadata Sidebar:** File size, Uploaded by, Timestamp, SHA-256 Hash.

# 9. Evidence UI

- **Chain of Custody Timeline:** A vertical stepper/timeline component showing every state change (UPLOADED, VIEWED, SIGNED, MODIFIED) from the `EvidenceChain` table.

# 10. Audit UI

- A full-screen, data-grid table showing global `AuditLog` events. Filters for Actor, IP Address, Resource, and Date.

# 11. Search UI

- Global search bar in the top navigation.
- Search results page categorized by Cases, Documents, and Users.

# 12. Responsive Design

- **Desktop (1024px+):** Full side navigation, complex tables, side-by-side case views.
- **Tablet (768px+):** Collapsed sidebar, stacked cards.
- **Mobile:** Not the primary target for complex forensic work, but must support basic viewing and approval workflows.

# 13. Accessibility

- **Contrast:** Strict adherence to WCAG AA contrast ratios.
- **Keyboard navigation:** All modals and forms must be keyboard accessible.
- **Screen readers:** ARIA labels on all icon-only buttons.

# 14. UX Principles

1. **Security:** Never obscure security warnings.
2. **Clarity:** Legal and technical jargon must be clearly presented.
3. **Speed:** Investigating officers need fast access.
4. **Trust:** Visible cryptographic hashes reassure the user.
5. **Traceability:** Every screen should make it obvious *who* is logged in and *what* they are looking at.
