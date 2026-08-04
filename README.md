# Ambria Employee Joining Form

Standalone public form for new-hire submissions. Lives at:

**https://finance381.github.io/employee-form/**

Deliberately hosted OUTSIDE the `/ambria-ops/` PWA scope so that installed PWAs cannot capture the link and force it into standalone WebView. Employees always get a real browser tab with camera / file picker / address bar working normally.

## Stack

- Vite + React 18
- Tailwind CSS v4
- Supabase JS client (anon-only)
- Deploys via GitHub Actions → GitHub Pages

## Setup

```bash
npm install
cp .env.example .env    # (create with your Supabase keys)
npm run dev
```

## Environment

Set these in **GitHub repo → Settings → Secrets and variables → Actions**:

- `VITE_SUPABASE_URL` — same as Ambria Ops
- `VITE_SUPABASE_ANON_KEY` — same as Ambria Ops (public anon key is safe to embed)

## Pages Setup

1. Push to `main`
2. Repo → Settings → Pages → Source = **GitHub Actions**
3. First push triggers deploy → URL live at `finance381.github.io/employee-form/`

## Backend

Submits to Supabase Edge Function `submit-employee` in the same project as Ambria Ops. No backend changes needed. The Edge Function is fully public (no auth), enforces rate-limits + honeypot, writes rows with `status='pending'` for HR review inside Ambria Ops.

## Notes

- **No service worker** — this app must never be installable as a PWA. Keeping it a plain browser page is the entire point.
- The `?form=employee` route in the main Ambria Ops app redirects here for backwards compatibility.
