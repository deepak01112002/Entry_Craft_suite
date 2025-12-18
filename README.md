# Entry Craft Suite

A comprehensive product processing entry management system with backend integration, MongoDB storage, and Cloudinary image hosting.

## Features

- ✅ **Backend API** - Vercel serverless functions for data management
- ✅ **MongoDB Integration** - Persistent data storage
- ✅ **Cloudinary Integration** - Free image hosting service
- ✅ **Project Name Configuration** - One-time setup for project customization
- ✅ **Dynamic Company Units** - Configurable via environment variables
- ✅ **Product Entry Management** - Create, view, update, and delete entries
- ✅ **Image Upload** - Upload measurement images and signatures
- ✅ **PDF Generation** - Download and print entry reports

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn-ui
- **Backend**: Vercel Serverless Functions
- **Database**: MongoDB
- **Image Storage**: Cloudinary
- **Deployment**: Vercel (Free Tier)

## Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- MongoDB account (free tier available at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Cloudinary account (free tier available at [Cloudinary](https://cloudinary.com/))
- Vercel account (free tier available at [Vercel](https://vercel.com/))

## Setup Instructions

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd entry-craft-suite-main

# Install dependencies
npm install
# or
pnpm install
# or
yarn install
```

### 2. MongoDB Setup

1. Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier M0)
3. Create a database user and note the username/password
4. Whitelist your IP address (or use `0.0.0.0/0` for all IPs - not recommended for production)
5. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

### 3. Cloudinary Setup

1. Create a free Cloudinary account at https://cloudinary.com/
2. Go to Dashboard and copy:
   - Cloud Name
   - API Key
   - API Secret

### 4. Environment Variables

#### For Local Development

Create a `.env.local` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=entry_craft

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Company Units (comma-separated)
COMPANY_UNITS=Company 1,Company 2,Company 3

# Frontend API Base URL (optional, defaults to /api for production)
# VITE_API_BASE_URL=/api
```

#### For Vercel Deployment

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add all the variables from `.env.local`:
   - `MONGODB_URI`
   - `DB_NAME` (optional, defaults to `entry_craft`)
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `COMPANY_UNITS` (comma-separated list, e.g., `Company 1,Company 2,Company 3`)

**Note**: You can update these environment variables in Vercel dashboard anytime after deployment.

### 5. Local Development

**IMPORTANT**: You MUST use `npm run dev:vercel` to run the API routes locally.

```bash
# Start development server with API support (REQUIRED)
npm run dev:vercel
```

**⚠️ DO NOT use `npm run dev`** - This only runs the frontend and API routes will return 404 errors.

The app will be available at the URL shown in the terminal (usually `http://localhost:3000` or `http://localhost:8080`)

**Note**: Make sure you have created `.env.local` with all required environment variables before starting the dev server.

### 6. Deploy to Vercel

#### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts to link your project
```

#### Option 2: Using Vercel Dashboard

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your repository
5. Add environment variables (from step 4)
6. Click "Deploy"

### 7. First Time Setup

After deployment:

1. Visit your deployed app
2. Login with default credentials:
   - Username: `admin`
   - Password: `admin@123`
3. You'll be redirected to the setup page
4. Enter your project name (this can be changed later)
5. Start using the application!

## Project Structure

```
entry-craft-suite-main/
├── api/                    # Vercel serverless functions
│   ├── entries/           # Entry CRUD operations
│   ├── upload/            # Image upload to Cloudinary
│   └── config/            # Project configuration
├── src/
│   ├── components/        # React components
│   ├── context/           # React contexts (Auth, Config)
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities and API client
│   ├── pages/             # Page components
│   ├── types/             # TypeScript types
│   └── utils/             # Helper functions
├── vercel.json            # Vercel configuration
└── package.json           # Dependencies
```

## API Endpoints

All API endpoints are prefixed with `/api`:

- `GET /api/entries` - Get all entries
- `POST /api/entries` - Create new entry
- `GET /api/entries/[id]` - Get entry by ID
- `PUT /api/entries/[id]` - Update entry
- `DELETE /api/entries/[id]` - Delete entry
- `POST /api/upload` - Upload image to Cloudinary
- `GET /api/config` - Get app configuration
- `POST /api/config` - Update project name

## Configuration

### Company Units

Company units are configured via the `COMPANY_UNITS` environment variable. Use comma-separated values:

```env
COMPANY_UNITS=Company A,Company B,Company C
```

You can update this in Vercel dashboard after deployment, and it will be reflected immediately.

### Project Name

The project name is set during the first-time setup and stored in MongoDB. It can be updated later by modifying the config in the database or through the API.

## Default Login Credentials

- **Username**: `admin`
- **Password**: `admin@123`

**Important**: Change these credentials in production by modifying `src/context/AuthContext.tsx`

## Troubleshooting

### Images not uploading

- Verify Cloudinary credentials are correct
- Check that `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are set correctly

### Database connection errors

- Verify MongoDB connection string is correct
- Ensure your IP is whitelisted in MongoDB Atlas
- Check that database user has proper permissions

### Company units not showing

- Verify `COMPANY_UNITS` environment variable is set
- Ensure values are comma-separated (no spaces around commas)
- Restart the Vercel deployment after changing environment variables

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue in the repository.
