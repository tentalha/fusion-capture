# FusionCapture - RBAC & SSO Demo Application

A comprehensive Next.js application demonstrating **Role-Based Access Control (RBAC)**, **Permission-Based Access Control**, and **SSO authentication** with Google and GitHub.

## 🎯 Features

### Authentication (SSO)
- ✅ Google OAuth integration
- ✅ GitHub OAuth integration
- ✅ Account linking (multiple providers → one user)
- ✅ Session-based authentication with JWT
- ✅ Secure credential storage

### Authorization System
- ✅ **Role-Based Access Control (RBAC)**: Admin, Editor, Viewer
- ✅ **Permission-Based Access Control**: Granular permissions per role
- ✅ **Protected Routes**: Middleware-level route protection
- ✅ **Dynamic Navigation**: Menu items shown/hidden based on permissions
- ✅ **Conditional Rendering**: Components rendered based on roles
- ✅ **Button-Level Control**: Actions enabled/disabled by permissions
- ✅ **Role-Specific Content**: Different content for different roles

### UI Authorization Patterns
- 🔒 **Protected Pages**: Role-restricted pages with automatic redirects
- 🧭 **Dynamic Navigation**: Navbar adapts to user permissions
- 🎨 **Conditional Components**: Sections visible only to authorized users
- 🔘 **Permission-Gated Buttons**: Actions available based on permissions
- 📄 **403 Page**: Unauthorized access handling
- ⚡ **Loading States**: Proper authentication check indicators

## 🏗️ System Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Authentication**: NextAuth.js v5
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

### Project Structure
```
fusion-capture/
├── app/
│   ├── (routes)/
│   │   ├── login/              # Login page with SSO
│   │   ├── dashboard/          # Admin & Editor only
│   │   ├── content/            # Editor & Admin (write permissions)
│   │   ├── users/              # Admin only (manage:users)
│   │   ├── analytics/          # Admin only (view:analytics)
│   │   ├── profile/            # All authenticated users
│   │   └── unauthorized/       # 403 error page
│   ├── api/
│   │   ├── auth/[...nextauth]/ # NextAuth API routes
│   │   └── users/              # User management API
│   ├── layout.tsx              # Root layout with SessionProvider
│   └── page.tsx                # Home page with role-specific content
├── components/
│   ├── AuthGuard.tsx           # Route protection HOC
│   ├── PermissionGate.tsx      # Component-level permission check
│   ├── Navbar.tsx              # Dynamic navigation
│   └── SessionProvider.tsx     # NextAuth session wrapper
├── lib/
│   ├── auth.ts                 # NextAuth configuration
│   ├── db.ts                   # MongoDB connection
│   ├── models/
│   │   └── User.ts             # User model with roles/permissions
│   └── hooks/
│       └── useAuth.ts          # Custom auth hook
├── middleware.ts               # Route protection middleware
└── types/
    └── next-auth.d.ts          # NextAuth type extensions
```

## 📋 User Personas & Permissions

### 1. **Admin** 👑
**Role**: Full administrative access

**Permissions**:
- `read:all` - Read all content
- `write:all` - Write/edit all content
- `delete:all` - Delete any content
- `manage:users` - Manage users and roles
- `view:analytics` - View analytics dashboard
- `approve:content` - Approve content for publication

**Access**:
- ✅ Home, Dashboard, Content, Users, Analytics, Profile
- ✅ All buttons and actions enabled
- ✅ Can change user roles
- ✅ Can delete content

### 2. **Editor** ✏️
**Role**: Content management and editing

**Permissions**:
- `read:all` - Read all content
- `write:own` - Write own content
- `write:content` - Create and edit content
- `approve:content` - Approve content

**Access**:
- ✅ Home, Dashboard, Content, Profile
- ❌ Users, Analytics (Admin only)
- ✅ Can create and edit content
- ❌ Cannot delete content (Admin only)
- ❌ Cannot manage users

### 3. **Viewer** 👁️
**Role**: Read-only access

**Permissions**:
- `read:all` - Read all content

**Access**:
- ✅ Home, Profile
- ❌ Dashboard, Content, Users, Analytics
- ❌ No write or delete permissions
- 👀 Read-only access to available content

## 🚀 Setup Instructions

### 1. Prerequisites
- Node.js 18+ installed
- MongoDB instance (local or cloud)
- Google OAuth credentials
- GitHub OAuth App credentials

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/fusion-capture

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 3. Get OAuth Credentials

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret

#### GitHub OAuth:
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret

### 4. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

### 5. Install Dependencies

```bash
npm install
```

### 6. Start MongoDB

**Local MongoDB**:
```bash
mongod --dbpath=/path/to/data
```

**Or use MongoDB Atlas** (cloud):
Update `MONGODB_URI` in `.env.local` with your Atlas connection string.

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🧪 Testing Guide

### Test Scenario 1: Authentication & Account Linking
1. Sign in with Google
2. Note your assigned role (default: Viewer)
3. Sign out
4. Sign in with GitHub using the **same email**
5. ✅ Verify accounts are linked (both providers in profile)

### Test Scenario 2: Role-Based Route Protection
1. Sign in as Viewer
2. Try to access `/dashboard` directly in URL
3. ✅ Should redirect to `/unauthorized` (403)
4. Try to access `/users` directly
5. ✅ Should redirect to `/unauthorized`

### Test Scenario 3: Dynamic Navigation
1. Sign in as Viewer
2. ✅ See only: Home, Profile
3. Sign in as Editor
4. ✅ See: Home, Dashboard, Content, Profile
5. Sign in as Admin
6. ✅ See all navigation items

### Test Scenario 4: Permission-Based UI Control
1. Navigate to `/content` as Editor
2. ✅ See "Edit" buttons enabled
3. ✅ See "Delete" buttons disabled/grayed out
4. Navigate to `/content` as Admin
5. ✅ See all buttons enabled

### Test Scenario 5: Role-Specific Content
1. Sign in as different roles
2. ✅ Home page shows different permission cards
3. ✅ Dashboard shows role-specific messages
4. ✅ Profile shows current role and permissions

## 🎭 Creating Demo Users with Different Roles

Since the first user defaults to **Viewer**, you'll need to manually update roles in MongoDB:

### Option 1: MongoDB Compass (GUI)
1. Open MongoDB Compass
2. Connect to your database
3. Navigate to `fusion-capture` → `users` collection
4. Find your user document
5. Edit `role` field: `"admin"`, `"editor"`, or `"viewer"`
6. Save changes
7. Sign out and sign back in

### Option 2: MongoDB Shell
```bash
# Connect to MongoDB
mongosh

# Switch to database
use fusion-capture

# Update user role to admin
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)

# Update to editor
db.users.updateOne(
  { email: "another-email@example.com" },
  { $set: { role: "editor" } }
)
```

## 🔐 Authorization Implementation

### 1. Middleware-Level Protection (`middleware.ts`)
- Checks authentication and role before route access
- Redirects unauthenticated → /login
- Redirects unauthorized → /unauthorized

### 2. Component-Level (`AuthGuard.tsx`)
- Wraps pages requiring authentication
- Supports role and permission checks
- Shows loading state during auth check

### 3. Element-Level (`PermissionGate.tsx`)
- Conditionally renders components
- Supports fallback UI for unauthorized users
- Can check roles AND permissions

### 4. Hook-Based (`useAuth.ts`)
- Custom React hook for auth state
- Helper functions: hasRole(), hasPermission()
- Access to current user and session

## 📊 Code Examples

### Protect a Route
```typescript
import { AuthGuard } from '@/components/AuthGuard';

export default function AdminPage() {
  return (
    <AuthGuard requiredRoles={['admin']}>
      <div>Admin Content</div>
    </AuthGuard>
  );
}
```

### Conditional Button Rendering
```typescript
<PermissionGate 
  permissions={['delete:all']}
  fallback={<button disabled>Delete (Admin Only)</button>}
>
  <button>Delete</button>
</PermissionGate>
```

### Check Permissions in Component
```typescript
const { hasPermission, hasRole } = useAuth();

if (hasPermission('manage:users')) {
  // Show admin UI
}

if (hasRole(['admin', 'editor'])) {
  // Show editor features
}
```

## 🚧 Future Enhancements

- [ ] Permission inheritance and hierarchical roles
- [ ] Audit logging for authorization decisions
- [ ] Real-time permission updates without re-login
- [ ] Role management UI (create/edit roles)
- [ ] Custom permission creation
- [ ] Multi-tenant support
- [ ] API key authentication for external access
- [ ] Two-factor authentication (2FA)

## 📝 Notes

- **First User**: Defaults to Viewer role (manually update in DB)
- **Account Linking**: Multiple OAuth providers link to same email
- **Permissions**: Auto-assigned based on role in User model pre-save hook
- **Session**: JWT-based, permissions cached in token
- **Direct URL Access**: Fully protected via middleware

## 🤝 Support

For questions or issues during evaluation, please document them for our discussion call.

---

**Built with ❤️ using Next.js, NextAuth.js, MongoDB, and Tailwind CSS**
