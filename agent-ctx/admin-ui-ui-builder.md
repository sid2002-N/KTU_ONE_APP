# Task admin-ui — Agent Record

**Agent:** admin-ui (UI builder)
**Scope:** Recreate the lost KTU One admin panel UI (client-side only).

## Files Created
- `src/app/admin/page.tsx`
- `src/features/admin/admin-login.tsx`
- `src/features/admin/admin-dashboard.tsx`
- `src/features/admin/notices-admin.tsx`
- `src/features/admin/calendar-admin.tsx`
- `src/features/admin/papers-admin.tsx`
- `src/features/admin/syllabus-admin.tsx`

## Patterns
- `adminKey: string` prop threaded through every admin component.
- Auth headers: `Authorization: Bearer ${adminKey}` on all fetches; JSON POSTs add `Content-Type: application/json`; uploads use `FormData` (no Content-Type).
- Tabs: Radix `Tabs` with 4 triggers; 2-col grid on mobile, 4-col on `sm+`.
- Lists use `max-h-96 overflow-y-auto` per UI rule.
- Delete uses `confirm()`.
- All endpoints are relative URLs — the API agent will implement them separately.

## Endpoints Expected
- `GET/POST/DELETE /api/v1/admin/notices`
- `GET/POST/DELETE /api/v1/admin/calendar`
- `GET /api/v1/admin/papers` + `POST /api/v1/admin/papers/upload` + `DELETE /api/v1/admin/papers?id=`
- `GET /api/v1/admin/syllabus` + `POST /api/v1/admin/syllabus/upload` + `DELETE /api/v1/admin/syllabus?id=`
- `GET /api/v1/papers/:id/download` + `GET /api/v1/syllabus/:id/download` (public)

## Next steps
Run `bun run lint` from project root to verify there are no TS / ESLint issues.
