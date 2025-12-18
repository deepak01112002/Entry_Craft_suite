# Local Development Setup

## The Problem

Vercel serverless functions in the `/api` directory only work when deployed to Vercel or when using `vercel dev`. Regular `vite` dev server doesn't handle these routes.

## Solution: Use Vercel CLI for Local Development

### Step 1: Install Dependencies

```bash
npm install
```

This will install the `vercel` CLI as a dev dependency.

### Step 2: Create Environment File

Create a `.env.local` file in the root directory with your credentials:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=entry_craft
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
COMPANY_UNITS=Company 1,Company 2,Company 3
```

### Step 3: Run Development Server

For local development with API support, use:

```bash
npm run dev:vercel
```

This will:
- Start Vercel dev server which handles both:
  - Frontend (Vite) on port 8080
  - API routes (`/api/*`) as serverless functions

**Note**: The regular `npm run dev` only runs Vite (frontend only, API will 404).

### Step 4: Access Your App

Open http://localhost:8080 in your browser.

## Alternative: Use Vite Only (Frontend Only)

If you want to test the frontend without the backend:

```bash
npm run dev
```

**Note**: API calls will fail with this method (404 errors). Use `npm run dev:vercel` for full-stack development with working API routes.

## Troubleshooting

### Port Already in Use

If port 8080 is already in use, Vercel will automatically use the next available port. Check the terminal output for the actual port.

### Environment Variables Not Loading

- Make sure `.env.local` is in the root directory
- Restart the dev server after changing environment variables
- Vercel dev automatically loads `.env.local` files

### API Routes Still 404

1. Make sure you're using `npm run dev` (not `npm run dev:vite`)
2. Check that `vercel` package is installed: `npm list vercel`
3. Verify your `.env.local` file exists and has correct values
4. Check the terminal for any error messages

## How It Works

- `vercel dev` runs both:
  - Vite dev server for the React frontend
  - Vercel serverless function runtime for `/api/*` routes
- All API routes in `/api` directory are automatically available
- Environment variables from `.env.local` are loaded automatically

