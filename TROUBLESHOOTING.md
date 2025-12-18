# Troubleshooting API 404 Errors

## The Problem

You're getting `404 (Not Found)` errors when trying to access `/api/*` routes.

## Step-by-Step Fix

### Step 1: Verify You're Running the Correct Command

**❌ WRONG:**
```bash
npm run dev
```
This only runs Vite (frontend only). API routes will return 404.

**✅ CORRECT:**
```bash
npm run dev:vercel
```
This runs Vercel dev server which includes both frontend AND API routes.

### Step 2: Check the Terminal Output

When you run `npm run dev:vercel`, look for:

```
Vercel CLI X.X.X
...
Ready! Available at http://localhost:XXXX
```

**Important**: Note the port number (XXXX). It might be:
- `3000` (Vercel default)
- `8080` (from vite.config.ts)
- Or another port if those are in use

### Step 3: Access the Correct Port

Make sure you're accessing the **exact port** shown in the terminal.

For example:
- If terminal shows: `http://localhost:3000`
- Open in browser: `http://localhost:3000` (NOT 8080)

### Step 4: Test the API Directly

1. Open your browser
2. Go to: `http://localhost:XXXX/api/test` (use the port from terminal)
3. You should see: `{"message":"API is working!",...}`
4. If you see 404, the API routes aren't being detected

### Step 5: Verify Environment Variables

Make sure `.env.local` exists in the root directory with:
```env
MONGODB_URI=your_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
COMPANY_UNITS=Company 1,Company 2
```

## Common Issues

### Issue: "Still getting 404"

**Check:**
1. ✅ Are you running `npm run dev:vercel`? (not `npm run dev`)
2. ✅ Are you accessing the correct port from terminal?
3. ✅ Did you check `/api/test` in browser?
4. ✅ Are API files in `/api` directory? (not `/src/api`)

**Try:**
```bash
# Delete .vercel cache
rm -rf .vercel

# Restart
npm run dev:vercel
```

### Issue: "Port mismatch"

**Symptom**: Frontend loads but API gives 404

**Solution**: 
- Check terminal for actual port
- Use that port in browser
- Or set explicit port in `vite.config.ts`

### Issue: "API routes not detected"

**Check terminal output for:**
- Messages about detecting API routes
- Any error messages
- The actual port being used

**Try:**
1. Stop the server (Ctrl+C)
2. Delete `.vercel` folder: `rm -rf .vercel`
3. Restart: `npm run dev:vercel`
4. Check terminal output carefully

## Quick Diagnostic

Run this in your browser console (F12) while on your app:

```javascript
// Test API connection
fetch('/api/test')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

**Expected**: Should show `{message: "API is working!", ...}`
**If 404**: API routes aren't being served (wrong command or port)

## Still Not Working?

1. Check browser console (F12) for detailed error messages
2. Check terminal for Vercel dev server messages
3. Verify you're in the project root directory
4. Make sure all dependencies are installed: `npm install`
5. Check that API files exist: `ls -la api/config/`

