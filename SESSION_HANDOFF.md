# ATG Tech Picks (Auro Technology Group StoreFront) - Session Handoff

## Project Overview
Amazon affiliate storefront for Auro Technology Group. This is a content/curation site —
no cart, no checkout. Customers browse products by category and click through to Amazon
via affiliate links. Branded as **ATG Tech Picks**.

## Tech Stack
- **Frontend**: React + Vite + React Router (client-side routing added this session)
- **Backend**: Supabase (PostgreSQL)
- **Hosting**: Cloudflare Pages
- **Domain**: store.aurotechgroup.com (subdomain of aurotechgroup.com)

## URLs & Access
- **Live Site**: https://store.aurotechgroup.com
- **Admin Dashboard**: Click "Admin" in the navbar → enter password → redirects to `/admin`
- **Admin Password**: (user's custom password - set in Cloudflare env var `VITE_ADMIN_PASSWORD`)
- **GitHub**: https://github.com/sirfatale/auro-storefront
- **Cloudflare Pages**: auro-storefront project

## Current State ✅
- **Database**: Supabase (West Coast US, us-west-1)
  - Project ID: xulpelgxkasuzjtshnns
  - URL: https://xulpelgxkasuzjtshnns.supabase.co
  - RLS enabled, allows all operations
  - **Note**: `.env.local` had a corrupted/scrambled project URL at the start of this
    session (`rulpelgskasuqifahnns` instead of `xulpelgxkasuzjtshnns`), which broke local
    dev. Fixed — verify it's still correct if local dev breaks again.

- **Products Table**: `id, name, category, price, description, affiliate_link, image_url,
  active, created_at`. No rating/highlight/featured fields yet (intentionally skipped this
  session — see "Deferred" below).

- **Products in DB**: 3 real products (Peptide Pen / Health, StarTech 8 Outlet 1U PDU /
  Technology, Test / Tools) — the "Health" category is leftover test data, not on-brand
  for a tech affiliate site; consider removing/recategorizing.

## What Changed This Session (Frontend Redesign)
Full frontend redesign layered onto the **existing** app — same Supabase backend, same
admin CRUD logic, same live data. Not a rewrite, not a new project.

### New pages (`src/pages/`)
- `Home.jsx` — hero banner, shop-by-category grid, "Top Picks" curated section (currently
  just the 4 newest active products — no manual curation/featured flag yet), trust-pillars
  section, newsletter signup
- `Shop.jsx` — full product grid with search, category filter, sort (Featured / Price
  Low-High / Price High-Low / Newest), "Showing N products" count. Reads `?category=` from
  the URL so nav links / category cards deep-link correctly.
- `Contact.jsx` — simple mailto card (no backend contact form)
- `AffiliateDisclosure.jsx`, `PrivacyPolicy.jsx` — placeholder legal copy, each with an
  inline callout marking it as **not lawyer-reviewed yet**

### New components (`src/components/`)
- `Navbar.jsx` — logo, Home, Shop dropdown (categories pulled live via `useCategories`
  hook), Contact, dark-mode toggle, Admin/Dashboard/Logout button. Mobile hamburger menu.
- `Footer.jsx` — link columns (Company/Legal/Deal Alerts), Amazon Associates disclosure
  paragraph, copyright
- `DisclosureBanner.jsx` — persistent thin bar on every page: "As an Amazon Associate, we
  earn from qualifying purchases."
- `ProductCard.jsx` — image, category tag, name, description-as-highlight, price + "price
  as of [today's date], may change" note, "View on Amazon →" CTA
- `Newsletter.jsx` — email capture form, **front-end only** (no backend wired up — shows a
  "Thanks!" message on submit but doesn't persist anywhere). Used in both Footer (compact)
  and Home (full section).

### New hooks/utils/context
- `hooks/useProducts.js` — shared fetch of active products (replaces old inline fetch in
  the deleted `Storefront.jsx`)
- `hooks/useCategories.js` — distinct active categories, used by Navbar dropdown, Home
  category grid, and Shop filter
- `utils/categoryIcons.js` — emoji icon per category name (add entries to `ICONS` map for
  new categories)
- `context/ThemeContext.jsx` — light/dark mode, persisted to `localStorage` key
  `atg-theme`, applied via `data-theme` attribute on `<html>`

### Styling
- `src/index.css` fully rewritten to use CSS custom properties for light (default) and
  dark themes instead of the old hardcoded dark-only palette. Navy (#002c66) + electric
  blue (#0066cc) accent retained from original branding.
- Deleted `src/App.css` (unused after redesign) and `src/components/Storefront.jsx`
  (replaced by `Home.jsx` + `Shop.jsx`)

### Routing
- Added `react-router-dom`. Routes: `/`, `/shop`, `/contact`, `/affiliate-disclosure`,
  `/privacy-policy`, `/admin` (password-gated, shows an `AdminGate` prompt if not logged
  in rather than silently redirecting)

### Bug fixed
- Mobile navbar had a horizontal-overflow bug (Admin button pushed off-screen at ≤375px
  width) — fixed with responsive padding/sizing in the `@media (max-width: 768px)` block
  in `index.css`.

### Admin Dashboard
- Functionality unchanged — same fields, same add/edit/delete flow. Only restyled to pick
  up the new CSS variable system so it doesn't look broken next to the new theme.

## Deferred (explicitly out of scope this session, per user decision)
- **Star ratings** — skipped entirely, no UI for them, no DB field
- **Comparison table** page (side-by-side spec/price compare)
- **Per-product review/detail pages** (image gallery, pros/cons, specs table, editorial
  write-up) — current product cards link straight to Amazon, no detail page exists
- **"Featured" flag for Top Picks** — Home's Top Picks section just shows the 4 newest
  products; there's no admin-editable way to hand-curate which products appear there. If
  the user wants real curation, add a boolean column (e.g. `featured`) to the `products`
  table and an admin checkbox, then filter/sort on it in `Home.jsx`.

## Verified Working This Session
✅ Homepage, Shop page (with filters/sort/search), Contact, Affiliate Disclosure, Privacy
   Policy — all render correctly with real Supabase data
✅ Dark mode toggle
✅ Shop dropdown → category deep-link → Shop page pre-filtered
✅ Admin login → dashboard → product list/edit/delete, still using original password gate
✅ Mobile responsive (375px) after the navbar overflow fix
✅ `npm run build` completes with no errors

## Quick Start for New Session
1. `npm run dev` (or use the `auro-storefront-dev` launch config in `.claude/launch.json`)
2. Check `.env.local` has the correct Supabase URL if products fail to load
3. Live site: https://store.aurotechgroup.com

## Next Phase Ideas
- Manual curation for Top Picks (see "Deferred" above)
- Clean up the "Health" test-category product (Peptide Pen) — off-brand for a tech site
- Per-product review pages once there's enough real product content to justify them
- Real newsletter backend (Supabase table + insert, or a third-party service like
  Mailchimp/ConvertKit) instead of the current front-end-only form
- Amazon Associates compliance pass before going live with real affiliate links (see
  README "Before You Go Live" section)

## Contact Info
- User email: ian@auronetworks.com
- Company: Auro Technology Group
- Main site: aurotechgroup.com

---

**Session ended**: Frontend fully redesigned on top of the existing live Supabase-backed
storefront. Build verified, browser-tested (desktop + mobile), README updated.
**Next session goal**: User's call — likely either manual Top Picks curation, cleaning up
test data, or real product review/comparison pages once there's more product content.
