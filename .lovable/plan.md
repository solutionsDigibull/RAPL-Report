

## Plan: Multi-Module UI Overhaul (7 Work Streams)

This is a large set of changes spanning the Excel Dashboard upload flow, the entire Reports & Templates module, template card redesign, premium handling, AI prompt enhancements, layout optimization, and style consistency. Here is the implementation plan organized by work stream.

---

### 1. Excel Dashboard — Replace "Sample Data" with Real Upload + Daily Limit

**Files:** `src/pages/ExcelDashboard.tsx`, new `src/hooks/useUploadLimit.ts`

- Replace the "Upload Sample Data" button with a real file input (`<input type="file" accept=".xlsx,.xls,.csv" />`) styled as a drop zone
- Create `useUploadLimit` hook using `localStorage` to track uploads per day (key: `upload_count_YYYY-MM-DD`)
  - Returns `{ remaining: number, canUpload: boolean, recordUpload: () => void }`
  - Max 10 uploads/day
- After each upload, show counter: "9 uploads remaining today"
- When limit is 0: disable upload button, show "Daily upload limit reached. Try again tomorrow."
- Note: localStorage enforcement is UI-level; backend enforcement would require Supabase (flagged for future)

### 2. Reports & Templates — Merge with Pagination + Card Sizing Fix

**Files:** `src/pages/ReportsAndTemplates.tsx`, `src/pages/Reports.tsx`, `src/pages/Templates.tsx`

- `ReportsAndTemplates.tsx` already merges both — tabs are "Pre-Engineered Reports" and "Template Library". This is done.
- **Pagination**: Add pagination (8 cards per page) to both `Reports.tsx` and the template grid in `Templates.tsx` using a simple page state + slice logic
- **Card sizing fix in Reports.tsx**: The report cards in the grid (`sm:grid-cols-2`) expand when filtered because fewer cards fill the grid. Fix by applying fixed min/max height and `min-h-[120px]` to each card, and ensure the grid doesn't collapse columns

### 3. Template Card Redesign

**Files:** `src/pages/Templates.tsx`, `src/data/templateData.ts`

- Add new fields to template data interfaces:
  - `format`: `"excel" | "doc" | "pdf" | "text"`
  - `department`: `"Purchasing" | "Production" | "Sales" | "Quality" | "Finance"`
  - `category`: `"Reports" | "Prompts" | "Business Communication"`
  - `icon`: string identifier for per-template icon
  - `price`: `"Included" | "Premium"`
- Update all template data arrays with these new fields
- Redesign `TemplateCard` component to display:
  - Category-specific icon (replacing generic `FileSpreadsheet`)
  - Title, subtitle
  - Price badge ("Included" in teal, "Premium" in amber with bull icon)
  - Format badge (Excel/Doc/PDF/Text)
  - Department badge
  - Reduced download counts (divide current values by ~3)

### 4. Premium Template Handling

**Files:** `src/pages/Templates.tsx`, `src/components/templates/ReportModal.tsx`, `src/components/templates/ReportPreviewModal.tsx`

- For premium templates:
  - Remove preview/download/view buttons
  - Replace with: "Contact your BuLLMind representative to access this template."
  - Replace star icon with a bull/ox icon (use `Beef` from lucide-react or a custom SVG)
  - Add distinct visual styling: muted overlay, amber border, lock indicator
- CTA actions on premium cards open a contact message instead of modal
- Note: Backend URL-access prevention requires Supabase auth (flagged for future)

### 5. AI Prompt Templates — ISTVON Enhancement

**Files:** `src/pages/Templates.tsx`

- Update the ISTVON header line to include a `HelpCircle` icon
- On click/hover of help icon, show a tooltip or small dialog explaining the ISTVON framework (Identify, Source, Transform, Validate, Optimize, Notify)
- Add "Open in AI Insights" button to each AI prompt card that navigates to `/ai-insights` (using `useNavigate`)

### 6. Reports & Templates Layout Improvements

**Files:** `src/pages/Templates.tsx`, `src/pages/Reports.tsx`

- Add summary stats bar at top of Templates tab: "Total Templates: X | Total Downloads: X | Most Popular: [name]"
- Ensure grid is 3-4 cards per row on desktop (`lg:grid-cols-3 xl:grid-cols-4` — already in place for Templates, needs fixing for Reports)
- Add a "Featured" section showing top 3 most-downloaded templates before the category sections
- Enforce consistent card dimensions with fixed heights
- Improve mobile responsiveness (1 col on mobile, 2 on sm)

### 7. CTA Button Standardization

**Files:** `src/pages/Templates.tsx`

- Standardize all CTA labels:
  - AI Prompts: "Use Template"
  - Business Comm: "Open Template"
  - Report Templates: "Use This Template"
- Ensure consistent button sizing, placement, and hierarchy across all card types

---

### Files Changed Summary

| File | Action |
|------|--------|
| `src/hooks/useUploadLimit.ts` | New — daily upload limit hook |
| `src/pages/ExcelDashboard.tsx` | Update upload flow + counter |
| `src/data/templateData.ts` | Add format/department/category/price fields |
| `src/pages/Templates.tsx` | Major redesign — cards, pagination, premium, ISTVON, layout |
| `src/pages/Reports.tsx` | Pagination, card sizing fix, grid layout |
| `src/pages/ReportsAndTemplates.tsx` | Add summary stats bar |

### Estimated Effort
High — approximately 15-20 distinct code changes across 6+ files. No architectural risk; all changes are within existing component patterns.

