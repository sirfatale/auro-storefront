# ATG Tech Picks

An Amazon affiliate storefront for Auro Technology Group, built with React and Supabase.
Content/curation site — no cart or checkout, every product links out to Amazon.

## Features

- **Homepage**: Hero banner, shop-by-category grid, curated "Top Picks" section, trust content, and deal-alert newsletter signup
- **Shop Page**: Product grid with live search, category filter, sort (Featured / Price / Newest), and a "Showing N products" count
- **Admin Dashboard**: Add, edit, and delete products; rename or merge categories on the fly
- **Affiliate Disclosure & Privacy Policy pages**: Placeholder legal copy — see the note below before launch
- **Dark mode**: Light by default, with a toggle (saved to `localStorage`)
- **Responsive Design**: Mobile, tablet, and desktop layouts
- **Admin Auth with MFA**: Real Supabase Auth login (email + password) plus a required
  authenticator-app code (TOTP) — see "Admin Access & MFA" below

## Tech Stack

- **Frontend**: React + Vite + React Router
- **Backend**: Supabase (PostgreSQL database)
- **Styling**: Custom CSS with CSS variables (light/dark theme tokens)
- **Hosting**: Cloudflare Pages (auto-deploys on push to GitHub)

## ⚠️ Before You Go Live: Amazon Associates Compliance

This site was built to be structurally compliant, but **you must review it against the current
[Amazon Associates Program Operating Agreement](https://affiliate-program.amazon.com/help/operating/agreement)**
before launch. In particular, double-check:

- **Link format**: every affiliate link must include your real Associate tag (`?tag=your-associate-id`) — the admin form currently accepts any URL you paste in.
- **Disclosure placement**: the "As an Amazon Associate, we earn from qualifying purchases" banner and the Affiliate Disclosure page are placeholders — confirm wording and placement satisfy both the FTC and Amazon's own requirements.
- **No cached prices/stock claims**: the product cards show a "price as of [date]" note (today's date, not a stored value) — Amazon's rules prohibit displaying prices or availability as if they're live/guaranteed, so don't add a "last synced" price field without re-reading the rules on this.
- **Privacy Policy**: has placeholder copy only — update it to reflect exactly what you collect (newsletter emails, analytics, cookies) and have a lawyer review it.

The Affiliate Disclosure and Privacy Policy pages (`src/pages/AffiliateDisclosure.jsx`,
`src/pages/PrivacyPolicy.jsx`) both have an inline `legal-notice` callout flagging them as
placeholder copy.

## 🔐 Admin Access & MFA

The dashboard lives at a non-obvious path (`src/utils/adminPath.js`, currently
`/tagaloamode`) and requires a real Supabase Auth login — email + password, plus a
required authenticator-app code (TOTP, e.g. Google Authenticator or Authy). There is no
env-var password anymore; the old `VITE_ADMIN_PASSWORD` approach was removed because Vite
bakes `VITE_*` vars into the public JS bundle, so it was never actually secret.

### One-time setup

1. **Create the admin user** — in the Supabase Dashboard, go to
   **Authentication → Users → Add User**, enter your email and a strong password, and
   check **Auto Confirm User** (otherwise Supabase waits for an email confirmation link
   before the account can sign in, and this project doesn't have email sending
   configured).
2. **Lock down write access** — this is the step that actually matters. The `products`
   table's `anon` key is public by design (it ships in every page's JS bundle), so admin
   login alone doesn't stop someone from calling the Supabase API directly to write data
   unless the database itself enforces it. In the Supabase SQL Editor, check what write
   policies currently exist, then replace them with ones that require a fully
   MFA-verified session:

   ```sql
   -- See what's currently allowed
   select policyname, cmd, roles from pg_policies where tablename = 'products';

   -- Drop whatever policy is currently allowing anon/public writes
   -- (replace "<policy_name>" with what the query above shows for insert/update/delete)
   -- drop policy "<policy_name>" on products;

   -- Recreate: reads stay public, writes require aal2 (password + verified TOTP code)
   create policy "Public can read products" on products
     for select
     using (true);

   create policy "MFA-verified admin can insert" on products
     for insert
     with check ((auth.jwt() ->> 'aal') = 'aal2');

   create policy "MFA-verified admin can update" on products
     for update
     using ((auth.jwt() ->> 'aal') = 'aal2')
     with check ((auth.jwt() ->> 'aal') = 'aal2');

   create policy "MFA-verified admin can delete" on products
     for delete
     using ((auth.jwt() ->> 'aal') = 'aal2');
   ```

3. **Enroll your authenticator app** — go to `/tagaloamode` on the site, sign in with the
   email/password from step 1, and you'll be prompted to scan a QR code. Scan it with
   Google Authenticator, Authy, or similar, then enter the 6-digit code it generates.
   This only happens once per browser/device — the enrolled factor is tied to your
   Supabase user, not the browser, so signing in from a new device will ask for a code
   from the same app (no re-enrollment needed).

After that, every login asks for email + password, then a 6-digit code.

## Prerequisites

Before getting started, you'll need:

1. **GitHub Account** - for version control (you have: sirfatale)
2. **Supabase Account** - for the database (you have an existing account)
3. **Amazon Associates Account** - for affiliate links (in progress)
4. **Hostinger Account** - for hosting (you have an existing account)

## Setup Instructions

### 1. Supabase Database Setup

1. Log in to your Supabase account
2. Create a new project (name it something like "auro-storefront")
3. Go to the SQL Editor and run this query to create the products table:

```sql
CREATE TABLE products (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  affiliate_link TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Enable read access for all users" ON products
  FOR SELECT USING (TRUE);
```

4. Get your Supabase credentials:
   - Go to Settings → API
   - Copy your `Project URL` (VITE_SUPABASE_URL)
   - Copy your `anon public` key (VITE_SUPABASE_ANON_KEY)

### 2. Local Development Setup

1. Clone or download this project to your computer
2. Open a terminal in the project folder
3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env.local` file (copy from `.env.example`) and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open http://localhost:5173 in your browser

### 3. Amazon Affiliate Setup

1. Go to https://associates.amazon.com
2. Sign in with your Amazon account (or create one)
3. Complete the application with your website URL
4. Once approved, you'll get your affiliate ID
5. For each product, get the affiliate link:
   - Find the product on Amazon
   - Click "Share → Get link"
   - Use your Associate ID to generate the tracked link

### 4. Adding Products

1. Go to `/tagaloamode` and sign in (see "Admin Access & MFA" above)
2. Click "Add Product" in the dashboard
3. Fill in:
   - **Product Name**: Name of the item
   - **Category**: Pick an existing category or "+ Add new category"
   - **Price**: Product price
   - **Description**: Optional brief description
   - **Amazon Affiliate Link**: Your affiliate link (must start with https://)
   - **Active**: Toggle to show/hide on storefront
4. Click "Add Product"

## Deployment to Hostinger

### Option 1: Using Git Integration (Recommended)

1. **Push to GitHub**:
   - Initialize git: `git init`
   - Add your sirfatale GitHub account
   - Create a repository named `auro-storefront`
   - Push your code:
     ```bash
     git add .
     git commit -m "Initial commit"
     git remote add origin https://github.com/sirfatale/auro-storefront.git
     git push -u origin main
     ```

2. **Build the project locally**:
   ```bash
   npm run build
   ```
   This creates a `dist` folder with production-ready files.

3. **On Hostinger**:
   - Go to Hosting → Node.js Applications (if available)
   - Or use File Manager to upload the `dist` folder contents

### Option 2: Using FTP

1. Build the project:
   ```bash
   npm run build
   ```

2. Connect to Hostinger via FTP
3. Upload all files from the `dist` folder to your public_html directory
4. Set up environment variables in Hostinger's control panel

### Option 3: Hostinger Git Deployment

If Hostinger supports Git:
1. Connect your GitHub repository
2. Set the build command: `npm run build`
3. Set the publish directory: `dist`

## Environment Variables

Create a `.env.local` file with these variables:

```
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Important**: Never commit `.env.local` to GitHub. It's in `.gitignore` for security.

## Linking from Your Main Site

On your Auro Technology Group website (aurotechgroup.com), add a link to your storefront:

```html
<a href="https://yourdomain.com/storefront">Visit Our StoreFront</a>
```

Or add a navigation item in your main site's header.

## Customization

### Change Admin Password

Go to Supabase Dashboard → Authentication → Users, find your admin user, and use "Send
password recovery" or reset it directly there. There's no env var for this anymore.

### Change the Admin URL

Edit `ADMIN_PATH` in `src/utils/adminPath.js`.

### Change Categories

Categories are dynamic — the Shop dropdown, homepage category grid, and admin's category
select all read distinct values from the `products` table. To add a category, just pick
"+ Add new category" in the admin Add/Edit Product form. To give a category a custom icon in
the homepage grid, add an entry to the `ICONS` map in `src/utils/categoryIcons.js`.

### Modify Branding Colors

Edit the theme tokens in `src/index.css`:
```css
:root, [data-theme='light'] {
  --navy: #002c66;
  --navy-light: #004a9f;
  --accent: #0066cc;
  --accent-light: #2f8fff;
  /* ... */
}

[data-theme='dark'] {
  /* dark-mode overrides */
}
```

## Troubleshooting

### "Missing Supabase environment variables"
- Ensure `.env.local` exists and has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

### Products not showing up
- Check that products are marked as "Active" in the dashboard
- Verify Supabase URL and keys are correct
- Check browser console for errors (F12)

### Admin login not working
- "Invalid login credentials" → double check the email/password, and make sure the user
  was created with "Auto Confirm User" checked (or has confirmed their email)
- Stuck on the QR code screen → make sure the 6-digit code hasn't expired (they rotate
  every 30 seconds); if scanning fails, use "Start Over" to get a fresh QR code, or enter
  the manual secret shown below it
- Signed in but dashboard still shows "Admin access required" → you're at `aal1`
  (password only); the QR/code screen should appear automatically — if it doesn't,
  refresh the page

### Deploy issues
- Make sure you ran `npm run build` before uploading
- Upload the contents of the `dist` folder, not the folder itself
- Contact Hostinger support for hosting-specific issues

## Support

For issues or questions, contact ian@auronetworks.com

---

Built with ❤️ for Auro Technology Group
