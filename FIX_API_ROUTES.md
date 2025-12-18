# Fix: API Routes Not Working with vercel dev

## The Problem

When running `npm run dev:vercel`, Vite is serving the API TypeScript files as static assets instead of Vercel executing them as serverless functions.

## Solution

**Restart the dev server** after the configuration changes:

1. **Stop the current server** (Ctrl+C)

2. **Delete the .vercel cache** (optional but recommended):
   ```bash
   rm -rf .vercel
   ```

3. **Restart with vercel dev**:
   ```bash
   npm run dev:vercel
   ```

4. **Check the terminal output** - You should see:
   - Vercel CLI starting
   - Vite starting
   - **Look for messages about API routes being detected**

5. **Test the API**:
   - Open: `http://localhost:8080/api/test` in your browser
   - Should see: `{"message":"API is working!",...}`
   - If you see TypeScript code, the routes still aren't working

## If Still Not Working

If after restarting you still see TypeScript code instead of JSON:

1. **Check Vercel CLI version**:
   ```bash
   vercel --version
   ```
   Should be 38.0.0 or higher

2. **Try updating Vercel CLI**:
   ```bash
   npm install -g vercel@latest
   ```

3. **Verify API file structure**:
   ```bash
   ls -la api/
   ls -la api/config/
   ```
   Should show `.ts` files, not `.js`

4. **Check that handlers are exported correctly**:
   All API files should have:
   ```typescript
   export default async function handler(req, res) { ... }
   ```

## Alternative: Use Different Port

If port conflicts are causing issues:

1. Change port in `vite.config.ts`:
   ```typescript
   port: 3000,  // or another port
   ```

2. Restart and use the new port

## Expected Behavior

When working correctly:
- `http://localhost:8080/api/test` → Returns JSON
- `http://localhost:8080/api/config` → Returns JSON or executes handler
- Frontend at `http://localhost:8080` → Works normally

When NOT working:
- `http://localhost:8080/api/test` → Shows TypeScript source code
- This means Vite is serving the files instead of Vercel executing them

