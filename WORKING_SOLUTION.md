# Working Solution: Local Development Server

## The Problem

`vercel dev` with Vite isn't properly handling API routes - Vite serves them as static files instead of executing them.

## The Solution

I've created a custom Express server that:
- Runs your API routes (using the same handlers)
- Serves your Vite frontend
- Works reliably for local development

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Make sure you have `.env.local`** with your credentials:
   ```env
   MONGODB_URI=your_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   COMPANY_UNITS=Company 1,Company 2
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

   This now runs the Express server (not just Vite)!

4. **Access your app**:
   - Frontend: http://localhost:8080
   - API: http://localhost:8080/api/*

## What Changed

- **`server.js`** - New Express server that handles both API and frontend
- **`package.json`** - Updated `dev` script to use the new server
- Added dependencies: `express`, `cors`, `dotenv`

## How It Works

1. Express server handles `/api/*` routes using your existing Vercel handlers
2. Vite middleware serves the React frontend
3. Everything runs on port 8080
4. Environment variables loaded from `.env.local`

## For Production

When you deploy to Vercel, it will:
- Use the `/api` directory as serverless functions (as before)
- Serve the built frontend from `dist`
- Everything works automatically!

## Commands

- `npm run dev` - Run local server with API + frontend ✅
- `npm run dev:vite` - Run only Vite (frontend only, API will 404)
- `npm run dev:vercel` - Run vercel dev (if you want to test that)
- `npm run build` - Build for production

## Testing

After starting the server, test:
```bash
curl http://localhost:8080/api/test
```

Should return: `{"message":"API is working!",...}`

Now your API routes should work perfectly in local development! 🎉

