# 🚀 Quick Setup Guide

Follow these steps to get the application running quickly.

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Setup MongoDB

### Option A: Local MongoDB
```bash
# Install MongoDB (macOS)
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify it's running
mongosh
```

### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env.local`

## Step 3: Setup OAuth Providers

### Google OAuth Setup
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "FusionCapture Demo"
3. Enable APIs: Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Name: "FusionCapture"
7. Authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
8. Copy **Client ID** and **Client Secret**

### GitHub OAuth Setup
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - Application name: `FusionCapture Demo`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Click **Register application**
5. Generate a **Client Secret**
6. Copy **Client ID** and **Client Secret**

## Step 4: Configure Environment Variables

Create `.env.local` file (already exists, just update values):

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/fusion-capture
# Or for Atlas: mongodb+srv://username:password@cluster.mongodb.net/fusion-capture

# NextAuth Secret (generate with: openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<paste-your-generated-secret>

# Google OAuth
GOOGLE_CLIENT_ID=<paste-google-client-id>
GOOGLE_CLIENT_SECRET=<paste-google-client-secret>

# GitHub OAuth
GITHUB_CLIENT_ID=<paste-github-client-id>
GITHUB_CLIENT_SECRET=<paste-github-client-secret>
```

### Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

## Step 5: Start the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 6: Create Demo Users

### First User (Viewer)
1. Sign in with Google or GitHub
2. You'll be assigned the **Viewer** role by default

### Create Admin User
```bash
# Connect to MongoDB
mongosh

# Switch to database
use fusion-capture

# Find your user
db.users.find().pretty()

# Update to admin
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)

# Verify
db.users.find({ email: "your-email@example.com" }).pretty()
```

### Create Editor User
Sign in with a different email/provider, then:
```bash
mongosh
use fusion-capture
db.users.updateOne(
  { email: "editor-email@example.com" },
  { $set: { role: "editor" } }
)
```

## Step 7: Test Authorization

### Test as Viewer:
- ✅ Can access: Home, Profile
- ❌ Cannot access: Dashboard, Content, Users, Analytics
- Try accessing `/dashboard` → should redirect to `/unauthorized`

### Test as Editor:
- ✅ Can access: Home, Dashboard, Content, Profile
- ❌ Cannot access: Users, Analytics
- Can edit content but cannot delete

### Test as Admin:
- ✅ Can access: All pages
- ✅ All buttons enabled
- Can manage users and change roles

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
brew services list

# Restart MongoDB
brew services restart mongodb-community

# Check connection
mongosh
```

### OAuth Issues
- Verify redirect URIs match exactly (including protocol)
- Check credentials are correctly copied (no extra spaces)
- Ensure OAuth apps are enabled in respective consoles

### NextAuth Issues
- Clear browser cookies and localStorage
- Restart dev server
- Check `.env.local` is in root directory
- Verify all environment variables are set

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

## Testing Account Linking

1. Sign in with Google (use email: test@example.com)
2. Sign out
3. Sign in with GitHub (use same email: test@example.com)
4. Go to Profile page
5. ✅ Should see both "google" and "github" provider badges

## Quick Commands Cheat Sheet

```bash
# Install dependencies
npm install

# Generate auth secret
openssl rand -base64 32

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# MongoDB commands
mongosh
use fusion-capture
db.users.find().pretty()
db.users.updateOne({ email: "..." }, { $set: { role: "admin" } })
```

## Need Help?

Check the main [README.md](./README.md) for detailed documentation.
