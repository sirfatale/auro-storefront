# Auro Technology Group StoreFront

A professional Amazon affiliate storefront for Auro Technology Group, built with React and Supabase.

## Features

- **Public Storefront**: Display products organized by category (Technology, Tools, Electronics)
- **Admin Dashboard**: Easy product management with add, edit, and delete functionality
- **Responsive Design**: Mobile-friendly layout matching Auro branding
- **Password Protected**: Secure admin access
- **Amazon Integration**: Direct links to Amazon products with your affiliate URLs

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Supabase (PostgreSQL database)
- **Styling**: Custom CSS with Auro branding colors
- **Hosting**: Hostinger or any static hosting

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
   VITE_ADMIN_PASSWORD=your-secure-password
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

1. On the storefront, click the "Admin" button
2. Enter your admin password (set in .env.local)
3. Click "Add Product" in the dashboard
4. Fill in:
   - **Product Name**: Name of the item
   - **Category**: Choose Technology, Tools, or Electronics
   - **Price**: Product price
   - **Description**: Optional brief description
   - **Amazon Affiliate Link**: Your affiliate link (must start with https://)
   - **Active**: Toggle to show/hide on storefront
5. Click "Add Product"

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
VITE_ADMIN_PASSWORD=your-secure-password
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

Edit `.env.local`:
```
VITE_ADMIN_PASSWORD=your-new-password
```

### Change Categories

Edit `src/components/AdminDashboard.jsx`, find the select element:
```jsx
<select id="category" name="category" ...>
  <option value="Technology">Technology</option>
  <option value="Tools">Tools</option>
  <option value="Electronics">Electronics</option>
</select>
```

### Modify Branding Colors

Edit `src/index.css`:
```css
:root {
  --auro-dark-blue: #002c66;
  --auro-light-blue: #004a9f;
  --auro-accent: #0066cc;
  /* ... */
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
- Ensure VITE_ADMIN_PASSWORD matches what you set in `.env.local`
- Remember it's case-sensitive

### Deploy issues
- Make sure you ran `npm run build` before uploading
- Upload the contents of the `dist` folder, not the folder itself
- Contact Hostinger support for hosting-specific issues

## Support

For issues or questions, contact ian@auronetworks.com

---

Built with ❤️ for Auro Technology Group
