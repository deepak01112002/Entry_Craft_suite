# Deployment Guide

## Quick Start for Vercel Deployment

### Step 1: Prepare Your Environment Variables

Before deploying, make sure you have:

1. **MongoDB Connection String**
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/`
   - Get it from MongoDB Atlas dashboard

2. **Cloudinary Credentials**
   - Cloud Name
   - API Key
   - API Secret
   - Get them from Cloudinary dashboard

3. **Company Units** (Optional)
   - Comma-separated list: `Company 1,Company 2,Company 3`

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit with backend integration"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/dashboard
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect the project settings

3. **Add Environment Variables**
   In the Vercel project settings, add these environment variables:
   
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
   DB_NAME=entry_craft
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   COMPANY_UNITS=Company 1,Company 2
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at `https://your-project.vercel.app`

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? (enter a name)
# - Directory? ./
# - Override settings? N

# Add environment variables
vercel env add MONGODB_URI
vercel env add CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_SECRET
vercel env add COMPANY_UNITS

# Redeploy with environment variables
vercel --prod
```

### Step 3: First Time Setup

1. Visit your deployed app URL
2. Login with:
   - Username: `admin`
   - Password: `admin@123`
3. You'll be redirected to setup page
4. Enter your project name
5. Start using the app!

## Updating Environment Variables After Deployment

You can update environment variables anytime:

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Edit or add variables
5. Redeploy (or wait for automatic redeploy)

**Note**: Changes to `COMPANY_UNITS` will be reflected immediately without redeployment.

## Troubleshooting

### API Routes Not Working

- Ensure `vercel.json` is in the root directory
- Check that API files are in `/api` directory
- Verify environment variables are set correctly

### Database Connection Issues

- Verify MongoDB connection string is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has read/write permissions

### Image Upload Failing

- Verify Cloudinary credentials
- Check Cloudinary dashboard for upload limits
- Ensure API key has upload permissions

### Company Units Not Updating

- Verify `COMPANY_UNITS` format (comma-separated, no extra spaces)
- Check Vercel environment variables are saved
- The app reads from env on each request, so changes should be immediate

## Production Checklist

- [ ] Change default admin credentials
- [ ] Set up proper MongoDB user with limited permissions
- [ ] Configure Cloudinary upload presets if needed
- [ ] Set up custom domain (optional)
- [ ] Enable Vercel analytics (optional)
- [ ] Configure backup strategy for MongoDB
- [ ] Set up monitoring/error tracking

## Support

For issues, check:
1. Vercel deployment logs
2. MongoDB Atlas connection logs
3. Cloudinary dashboard for upload issues
4. Browser console for frontend errors

