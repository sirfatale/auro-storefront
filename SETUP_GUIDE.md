# Auro StoreFront - Complete Setup Guide

This guide will walk you through setting up your Amazon affiliate storefront step-by-step.

## Step 1: Supabase Database Setup (5 minutes)

### 1.1 Create a New Supabase Project

1. Go to [Supabase](https://app.supabase.com)
2. Sign in with your existing account
3. Click "New Project"
4. Fill in:
   - **Project Name**: `auro-storefront`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest to your location
5. Click "Create new project" and wait for it to finish (takes ~2 min)

### 1.2 Create the Products Table

Once your project is ready:

1. Click on your new project
2. Go to the **SQL Editor** (left sidebar)
3. Click "New Query"
4. Copy and paste this SQL code:

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

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON products
  FOR SELECT USING (TRUE);
```

5. Click "Run" (the play button)
6. You should see "Success!" message

### 1.3 Get Your Supabase Credentials

1. Go to **Settings** (bottom of left sidebar)
2. Click **API**
3. You'll see two important values:
   - **Project URL**: Looks like `https://xxxxx.supabase.co`
   - **anon public key**: Long string starting with `eyJhbGc...`

**Copy these values - you'll need them soon!**

---

## Step 2: Set Up Project on Your Computer (10 minutes)

### 2.1 Download/Clone the Project

The project folder is at: `G:\My Drive\Claude\auro-storefront`

Navigate to this folder in your terminal (Command Prompt or PowerShell):

```bash
cd "G:\My Drive\Claude\auro-storefront"
```

### 2.2 Install Dependencies

```bash
npm install
```

This downloads all the necessary libraries. It might take 2-3 minutes.

### 2.3 Configure Environment Variables

1. Open the `.env.local` file in this folder with a text editor (Notepad is fine)
2. Fill in the values:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_ADMIN_PASSWORD=MySecurePassword123
```

Replace:
- `xxxxx.supabase.co` with your actual Supabase URL from Step 1.3
- `eyJhbGc...` with your anon public key from Step 1.3
- `MySecurePassword123` with a password of your choice (you'll use this to log into the admin dashboard)

3. **Save the file** (Ctrl+S)

### 2.4 Test Locally

Still in the terminal:

```bash
npm run dev
```

This starts a local development server. You should see:
```
VITE v5.0.8  ready in 123 ms

➜  Local:   http://localhost:5173/
```

Open http://localhost:5173 in your browser. You should see your StoreFront!

**To stop the server**: Press Ctrl+C in the terminal

---

## Step 3: Amazon Associates Account (Varies)

While you wait for Amazon approval, you can test your site and add products with placeholder links.

### 3.1 Apply for Amazon Associates

1. Go to https://associates.amazon.com
2. Click "Join Now"
3. Sign in with your Amazon account (create one if needed)
4. Fill out the application:
   - Website: `https://www.aurotechgroup.com`
   - Traffic description: Describe your business
5. **Amazon will review and approve (24-48 hours)**

### 3.2 Once Approved: Get Affiliate Links

Once you receive the approval email:

1. Find a product on Amazon you want to share
2. Click the product (anywhere on the product page)
3. Look for the **Share** button
4. Click **Get link** → Amazon Associates
5. Copy the link - it will include your affiliate ID

Example: `https://www.amazon.com/dp/B123ABCD?tag=youraffiliateID`

---

## Step 4: Add Your First Products (5 minutes)

### 4.1 Access Admin Dashboard

1. Make sure the development server is running (`npm run dev`)
2. Go to http://localhost:5173
3. Click the **Admin** button in the top right
4. Enter your admin password (from Step 2.3)
5. You're now in the dashboard!

### 4.2 Add a Product

1. Click **Add Product** in the left sidebar
2. Fill in the form:
   - **Product Name**: e.g., "USB-C Hub"
   - **Category**: Choose one (Technology, Tools, Electronics)
   - **Price**: e.g., "29.99"
   - **Description**: Optional brief description
   - **Amazon Affiliate Link**: Your affiliate link from Step 3.2
   - **Active**: Make sure it's checked
3. Click **Add Product**
4. You should see a success message

### 4.3 View Your Storefront

1. Click **Home** in the top navigation
2. You should now see your product displayed!
3. Try clicking "View on Amazon" - it should take you to Amazon with your affiliate link

---

## Step 5: Push to GitHub (5 minutes)

This backs up your code and prepares it for deployment.

### 5.1 Initialize Git

In the terminal (in your auro-storefront folder):

```bash
git init
git add .
git commit -m "Initial commit: Auro StoreFront setup"
```

### 5.2 Create GitHub Repository

1. Go to https://github.com (sign in with your sirfatale account)
2. Click the **+** icon (top right) → **New repository**
3. Name it: `auro-storefront`
4. **Don't** add README, .gitignore, or license (we already have these)
5. Click **Create repository**

### 5.3 Push Your Code

GitHub will show you commands to run. In your terminal, run:

```bash
git remote add origin https://github.com/sirfatale/auro-storefront.git
git branch -M main
git push -u origin main
```

(The exact commands may vary slightly - follow what GitHub shows)

**You'll need to authenticate**: GitHub might ask for a password or personal access token. If prompted:
1. Go to https://github.com/settings/tokens
2. Click "Generate new token"
3. Select: repo, workflow
4. Copy the token and paste it when prompted

---

## Step 6: Build for Production (2 minutes)

Before deploying, create the production build:

```bash
npm run build
```

This creates a `dist` folder with optimized files ready for Hostinger.

---

## Step 7: Deploy to Hostinger (15-30 minutes)

Now you have two options depending on your Hostinger hosting type.

### Option A: Upload via File Manager (Works for all Hostinger plans)

1. Go to your [Hostinger control panel](https://hpanel.hostinger.com)
2. Go to **File Manager**
3. Open the `public_html` folder
4. Delete all existing files (except if you want to keep your main site separate)
5. Go back to the root
6. **If you want StoreFront as subdomain** (e.g., `storefront.aurotechgroup.com`):
   - Go to **Domains** → Your domain
   - Create a subdomain: `storefront`
   - Note the folder it points to
   - Upload the `dist` folder contents there
7. **If you want StoreFront as subfolder** (e.g., `aurotechgroup.com/storefront`):
   - Inside public_html, create a folder: `storefront`
   - Upload `dist` folder contents into it

**Uploading the files**:
1. On your computer, open the `dist` folder
2. In Hostinger File Manager, drag and drop all files from `dist` into the target folder
3. Refresh your browser - your site should now be live!

### Option B: Git Integration (If your Hostinger plan supports it)

1. In Hostinger, look for **Git Integration** or **Git Repository**
2. Connect your GitHub repository: `sirfatale/auro-storefront`
3. Set:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Click deploy
5. Hostinger will automatically build and deploy your site

### Option C: Using FTP (Advanced)

1. Get your FTP credentials from Hostinger
2. Use an FTP client (FileZilla is free)
3. Connect to your FTP server
4. Navigate to `public_html`
5. Upload all files from the `dist` folder

---

## Step 8: Link from Your Main Site (Optional)

Add a link to your StoreFront from your main Auro Technology Group website:

```html
<a href="https://yourdomain.com/storefront">Visit Our StoreFront</a>
```

Or add it to your navigation menu.

---

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env.local` exists and has the correct values
- Restart the dev server: Ctrl+C, then `npm run dev` again

### Products not showing up
- Verify products are marked "Active" in the dashboard
- Check your Supabase URL and keys are correct
- Open browser developer tools (F12) and check Console for errors

### Admin password not working
- Verify the `VITE_ADMIN_PASSWORD` in `.env.local` is correct
- Remember it's case-sensitive
- Restart the dev server if you changed it

### Deploy not working
- Make sure you ran `npm run build` before uploading
- Upload files from inside the `dist` folder, not the folder itself
- Check Hostinger's file permissions

### Amazon affiliate links showing 404
- Verify the affiliate link starts with `https://`
- Make sure your affiliate ID is in the link: `?tag=yourID`

---

## Quick Reference

| What | Where |
|------|-------|
| Project folder | `G:\My Drive\Claude\auro-storefront` |
| Supabase dashboard | https://app.supabase.com |
| GitHub repository | https://github.com/sirfatale/auro-storefront |
| Hostinger panel | https://hpanel.hostinger.com |
| Local development | http://localhost:5173 |
| Admin password | Set in `.env.local` |

---

## Next Steps

1. ✅ Set up Supabase database
2. ✅ Configure environment variables
3. ✅ Test locally
4. ⏳ Wait for Amazon Associates approval
5. ✅ Add your first products
6. ✅ Push to GitHub
7. ✅ Deploy to Hostinger
8. ✅ Link from your main website

**You're all set! Happy selling! 🎉**

For questions, email: ian@auronetworks.com
