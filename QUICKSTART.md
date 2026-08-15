# Quick Start Checklist

Copy and paste this checklist to track your progress:

## Pre-Setup
- [ ] GitHub account ready (sirfatale)
- [ ] Supabase account ready
- [ ] Hostinger account ready
- [ ] Amazon affiliate application submitted

## Setup (Follow SETUP_GUIDE.md)
- [ ] Create Supabase project
- [ ] Create products table in Supabase
- [ ] Get Supabase credentials (URL & Key)
- [ ] Update `.env.local` with credentials
- [ ] Run `npm install`
- [ ] Run `npm run dev` and test locally at http://localhost:5173
- [ ] Admin login works with your password

## Products
- [ ] Amazon Associates account approved (waiting email)
- [ ] Get first affiliate link
- [ ] Add first product via admin dashboard
- [ ] Product appears on storefront

## Deploy
- [ ] Run `npm run build`
- [ ] Initialize Git: `git init`
- [ ] Create GitHub repository
- [ ] Push code: `git push -u origin main`
- [ ] Upload `dist` folder to Hostinger
- [ ] Verify storefront is live at your domain

## Final Touches
- [ ] Test all affiliate links work
- [ ] Add link to your main website
- [ ] Add 5-10 products to showcase
- [ ] Share with friends and family!

---

## Essential Commands

```bash
# Install dependencies (run once)
npm install

# Start local development
npm run dev

# Build for production
npm run build

# Initialize git
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/sirfatale/auro-storefront.git
git push -u origin main
```

---

## Key Files

| File | Purpose |
|------|---------|
| `.env.local` | Your Supabase credentials (NEVER commit!) |
| `README.md` | Full documentation |
| `SETUP_GUIDE.md` | Detailed step-by-step setup |
| `dist/` | Production build (upload to Hostinger) |

---

## Support

Email: ian@auronetworks.com
GitHub: https://github.com/sirfatale/auro-storefront
