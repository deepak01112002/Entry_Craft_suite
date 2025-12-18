# Quick Start - Fix 404 API Errors

## The Problem

If you're getting `404 (Not Found)` errors for `/api/*` routes, you're likely running `npm run dev` which only starts Vite (frontend only).

## The Solution

**You MUST use `vercel dev` to run the API routes locally.**

### Step 1: Make sure you have environment variables

Create `.env.local` in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
DB_NAME=entry_craft
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
COMPANY_UNITS=Company 1,Company 2
```

### Step 2: Run the correct command

```bash
npm run dev:vercel
```

**NOT** `npm run dev` (this only runs frontend, API will 404)

### Step 3: Verify it's working

1. Check the terminal - you should see Vercel dev server starting
2. It will show the port (usually 3000 or 8080)
3. Open that URL in your browser
4. API routes should now work at `/api/config`, `/api/entries`, etc.

## Troubleshooting

### Still getting 404?

1. **Check which command you ran:**
   - ✅ `npm run dev:vercel` - Correct (has API)
   - ❌ `npm run dev` - Wrong (no API)

2. **Check terminal output:**
   - Should see "Vercel CLI" and "Ready" messages
   - Should show API routes being detected

3. **Check the port:**
   - Vercel dev might use port 3000 by default
   - Open the URL shown in terminal (not always localhost:8080)

4. **Verify environment variables:**
   - Make sure `.env.local` exists
   - Check that all required variables are set

### Port conflicts?

If port 3000 or 8080 is in use, Vercel will automatically use the next available port. Check the terminal output for the actual port number.

## Summary

- **For development with API**: `npm run dev:vercel` ✅
- **For frontend only**: `npm run dev` (API will 404) ⚠️

