# 1. Design Philosophy
"Secure Digital Investigation & Document Command Center".
The UI adopts a bold, cybersecurity-grade identity language (deep navy fields, luminous blue gradients, sharp geometric shield/ribbon motifs). It is trustworthy, serious, minimal, and information-dense.

# 2. Color System (EXISTING COLORS)
- **Primary / Deep Navy:** `#0a1128` – `#0f172a` (brand fields, auth screens, sidebar).
- **Brand Blue Gradient:** `#1d4ed8` -> `#3b82f6` -> `#60a5fa`.
- **Background:** Light neutral `#f8fafc`.
- **Success:** Green `#10b981`.
- **Warning:** Amber `#f59e0b`.
- **Critical:** Red `#ef4444`.

# 3. Typography
System sans-serif (Inter/Roboto) for the application shell. Heavy weights (600-800) for hero branding.

# 4. Spacing
Tailwind default spacing scale (e.g., p-4, m-2).

# 5. Components
Uses `shadcn/ui` primitives (`Button`, `Input`, `Label`, `Card`).

# 6. Dashboard Design
Deeply analytical. Summary/KPI header band sits on a deep navy strip using the brand blue gradient for key numerals.

# 7. Case Workspace
Two-column sidebar structure. Primary icon sidebar (navy) and secondary contextual menu sidebar (light gray) holding case navigation.

# 8. Document Viewer
Must display explicit integrity state:
- ✓ Hash Verified
- ✓ Blockchain Anchored
- ✓ Digital Signature Valid
(Currently represented by mock badges in frontend).

# 9. Evidence UI
Table layouts with strict categorization (Demand, Ancillary, Pleadings) using distinct background color pills.

# 10. Audit UI
(Planned) Timeline-based audit rendering.

# 11. Search UI
Global search bar in the Topbar with "Advanced" dropdown filters.

# 12. Responsive Design
Tailwind standard breakpoints (sm, md, lg). Currently optimized for desktop command center viewing.

# 13. Accessibility
High contrast text on dark backgrounds. standard HTML labels on inputs.

# 14. UX Principles
1. Security
2. Clarity
3. Speed
4. Trust
5. Traceability
6. Accessibility
