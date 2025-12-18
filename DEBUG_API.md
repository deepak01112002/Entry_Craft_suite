# Debug API Routes

## Quick Test

1. **Make sure you're running the correct command:**
   ```bash
   npm run dev:vercel
   ```
   NOT `npm run dev`

2. **Check the terminal output:**
   - You should see "Vercel CLI" messages
   - Look for the port number (might be 3000, 8080, or another port)
   - You should see messages about detecting API routes

3. **Test the API directly in browser:**
   - Open: `http://localhost:3000/api/test` (or whatever port vercel dev shows)
   - You should see: `{"message":"API is working!","method":"GET",...}`
   - If this works, the API routes are working
   - If this gives 404, vercel dev isn't detecting the routes

4. **Check what port you're accessing:**
   - Look at the browser URL - is it `localhost:8080` or `localhost:3000`?
   - `vercel dev` might use port 3000 by default
   - Make sure you're accessing the SAME port that vercel dev shows in terminal

## Common Issues

### Issue 1: Wrong Port
- **Symptom**: 404 errors
- **Solution**: Check terminal output for the actual port, use that port

### Issue 2: Running Wrong Command
- **Symptom**: 404 errors
- **Solution**: Must use `npm run dev:vercel`, NOT `npm run dev`

### Issue 3: API Routes Not Detected
- **Symptom**: `/api/test` gives 404 even with `vercel dev`
- **Solution**: 
  - Delete `.vercel` folder: `rm -rf .vercel`
  - Restart: `npm run dev:vercel`
  - Check that files are in `/api` directory (not `/src/api`)

## Verify Your Setup

Run these commands to verify:

```bash
# 1. Check API files exist
ls -la api/config/
ls -la api/entries/
ls -la api/upload/

# 2. Check you're in the right directory
pwd  # Should show: .../entry-craft-suite-main

# 3. Check package.json has the right script
grep "dev:vercel" package.json

# 4. Run the correct command
npm run dev:vercel
```

## Expected Terminal Output

When `vercel dev` starts correctly, you should see:
```
Vercel CLI X.X.X
...
Ready! Available at http://localhost:XXXX
```

The port number (XXXX) is what you should use in your browser.

