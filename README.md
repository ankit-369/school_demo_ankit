# HealthConnect

Clickable frontend demo of a school health-management SaaS (Next.js App Router,
TypeScript, Tailwind v4, shadcn/ui, Zustand).

```bash
npm install
npm run dev
```

Open http://localhost:3000 — it redirects to `/admin/dashboard`.

## Layout

- `app/` — routes mirror the sitemap; `app/admin/layout.tsx` wraps pages in the app shell
- `components/layout/` — Sidebar, BottomNav, TopBar, RoleSwitcher
- `components/ui/` — shadcn primitives plus shared app primitives
  (KpiTile, KpiBand, StatusBadge, SourceBadge, DataTable, EmptyState, PageHeader, Modal)
- `lib/store/` — the Zustand mock database (persisted to localStorage), split into slices
- `lib/types/` — small, focused type files
- `design-reference/` — original screen designs

Design tokens live in `app/globals.css`. Teal (`synced`) is reserved for data from hfiles.in.
