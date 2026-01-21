# 🎬 Demo & Testing Guide

This guide helps you demonstrate all the authorization features of the FusionCapture application.

## 🎯 Demo Flow

### Part 1: Authentication & SSO (5 minutes)

#### 1.1 Initial Login
1. Open `http://localhost:3000`
2. Should see welcome screen with "Sign In" button
3. Click "Sign In" → Redirects to `/login`
4. Show both OAuth options: Google & GitHub

#### 1.2 First Login (Google)
1. Click "Continue with Google"
2. Complete Google OAuth flow
3. **Result**: Logged in as **Viewer** (default role)
4. Navigate to home page
5. **Show**:
   - Navbar appears with user info
   - Role badge shows "VIEWER"
   - Only "Home" and "Profile" in navigation
   - Permission cards on home page (only `read:all`)

#### 1.3 Account Linking
1. Sign out
2. Sign in with **GitHub** using the **same email**
3. Navigate to `/profile`
4. **Show**: Both "google" and "github" provider badges
5. **Explain**: Multiple providers linked to one user account

### Part 2: Role-Based Access Control (10 minutes)

#### 2.1 Viewer Permissions
**Currently signed in as Viewer**

1. **Navigation Test**:
   - Show navbar → Only "Home" & "Profile" visible
   - Explain: Navigation dynamically rendered based on role

2. **Direct URL Test**:
   - Try to access `/dashboard` in URL bar
   - **Result**: Redirected to `/unauthorized` (403 page)
   - Try to access `/users`
   - **Result**: Same redirect
   - **Explain**: Middleware protects routes server-side

3. **Home Page Content**:
   - Show permission cards (only 1 permission: `read:all`)
   - Show grayed-out "Restricted Feature" card
   - Only 2 action cards visible (Home & Profile)
   - **Explain**: Conditional component rendering

#### 2.2 Upgrade to Editor Role
**Update user role in MongoDB**:

```bash
# Open new terminal
mongosh
use fusion-capture
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "editor" } }
)
```

**Refresh browser** (sign out & sign in):

1. **Navigation Test**:
   - Show navbar → Now see "Dashboard", "Content" added
   - Still no "Users" or "Analytics" (Admin only)

2. **Dashboard Access**:
   - Navigate to `/dashboard`
   - **Result**: Successfully loaded!
   - Show "Editor View" message at bottom
   - Show "Delete Items" button is **disabled**
   - **Explain**: Button-level permission control

3. **Content Page**:
   - Navigate to `/content`
   - Show "Edit" buttons are **enabled**
   - Show "Delete" buttons are **grayed out**
   - **Explain**: Permission-based UI control

4. **Home Page**:
   - More action cards visible (Dashboard, Content)
   - More permissions displayed (4 permissions)
   - Role badge shows "EDITOR"

#### 2.3 Upgrade to Admin Role
**Update user role again**:

```bash
mongosh
use fusion-capture
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

**Refresh browser** (sign out & sign in):

1. **Navigation Test**:
   - Show navbar → All items visible!
   - "Users" and "Analytics" now accessible

2. **Users Page** `/users`:
   - Show list of all users
   - Show role dropdown to change roles
   - Show delete buttons
   - **Explain**: Admin-only feature

3. **Analytics Page** `/analytics`:
   - Show comprehensive analytics dashboard
   - **Explain**: Only admins can view analytics

4. **Dashboard**:
   - All action buttons **enabled** (including Delete)
   - Show "Admin View" message
   - **Explain**: Full permissions

5. **Content Page**:
   - Both "Edit" and "Delete" buttons **enabled**
   - **Explain**: Admin has all permissions

### Part 3: Authorization Patterns (5 minutes)

#### 3.1 Protected Routes (Middleware)
- ✅ Demonstrated: Viewer accessing /dashboard → 403
- ✅ Demonstrated: Direct URL access blocked
- **Code**: Show `middleware.ts`

#### 3.2 Component-Level Authorization
- ✅ Demonstrated: Navigation items show/hide
- ✅ Demonstrated: Action cards conditional rendering
- **Code**: Show `Navbar.tsx` with `PermissionGate`

#### 3.3 Button-Level Authorization
- ✅ Demonstrated: Delete buttons disabled for Editors
- ✅ Demonstrated: All buttons enabled for Admins
- **Code**: Show `PermissionGate` usage in components

#### 3.4 Role-Specific Content
- ✅ Demonstrated: Different permission lists per role
- ✅ Demonstrated: Role-specific messages on pages
- **Code**: Show home page role-based rendering

#### 3.5 Loading States
- ✅ Demonstrated: Loading spinner during auth check
- ✅ Demonstrated: Smooth transitions
- **Code**: Show `AuthGuard.tsx` loading state

### Part 4: Account Linking Demo (2 minutes)

1. Sign out completely
2. Sign in with **Google** (first provider)
3. Note the user is created
4. Sign out
5. Sign in with **GitHub** (second provider, same email)
6. Navigate to `/profile`
7. **Show**: Both provider badges
8. **Explain**: 
   - Same user account
   - Multiple auth methods
   - Single set of roles/permissions

## 📊 Feature Checklist

### ✅ Authentication
- [x] Google OAuth
- [x] GitHub OAuth
- [x] Account linking
- [x] Session management
- [x] Secure logout

### ✅ Authorization - RBAC
- [x] 3 roles: Admin, Editor, Viewer
- [x] Role-based route protection
- [x] Role-based navigation
- [x] Role-specific content

### ✅ Authorization - Permissions
- [x] Granular permissions per role
- [x] Permission-based UI control
- [x] Permission checks in components
- [x] Permission-based button states

### ✅ Protected Routes
- [x] Middleware protection
- [x] Redirect to /login if unauthenticated
- [x] Redirect to /unauthorized if insufficient permissions
- [x] Direct URL access protection
- [x] Works with browser navigation

### ✅ UI Patterns
- [x] Pages: Role-restricted pages
- [x] Menu Items: Dynamic navigation
- [x] Buttons: Enabled/disabled by permissions
- [x] Components: Conditional rendering
- [x] Content: Role-specific content
- [x] Loading: Auth check loading states

### ✅ Pages Implemented
- [x] `/login` - SSO login page
- [x] `/` - Home with role-specific content
- [x] `/dashboard` - Admin & Editor only
- [x] `/content` - Editor & Admin
- [x] `/users` - Admin only
- [x] `/analytics` - Admin only
- [x] `/profile` - All authenticated users
- [x] `/unauthorized` - 403 error page

## 🎥 Screen Recording Script

### Scene 1: Login & Authentication (30 seconds)
1. Show login page with both OAuth options
2. Sign in with Google
3. Show home page loaded as Viewer
4. Show navigation (limited items)

### Scene 2: Viewer Restrictions (30 seconds)
1. Try to access `/dashboard` in URL
2. Show 403 page
3. Show only Home and Profile in nav
4. Show limited permissions on home page

### Scene 3: Editor Capabilities (45 seconds)
1. Update role to Editor (show terminal)
2. Sign in again
3. Show expanded navigation (Dashboard, Content added)
4. Navigate to Content page
5. Show Edit enabled, Delete disabled
6. Explain permission-based UI control

### Scene 4: Admin Full Access (45 seconds)
1. Update role to Admin (show terminal)
2. Sign in again
3. Show all navigation items
4. Navigate to Users page
5. Show ability to manage users
6. Navigate to Analytics page
7. Show comprehensive analytics
8. Return to Content page
9. Show all buttons enabled

### Scene 5: Account Linking (30 seconds)
1. Sign in with Google
2. Sign out
3. Sign in with GitHub (same email)
4. Show Profile page with both providers
5. Explain account linking

**Total Duration**: ~3 minutes

## 💡 Talking Points

### Architecture Highlights
- "Uses Next.js App Router with server components"
- "NextAuth.js handles authentication and session management"
- "MongoDB stores user data with roles and permissions"
- "Middleware provides first layer of route protection"
- "Client components handle UI-level authorization"

### Security Features
- "All routes protected at middleware level"
- "JWT tokens contain roles and permissions"
- "Direct URL access is blocked for unauthorized users"
- "Session validated on every protected route"

### Developer Experience
- "Simple hooks for checking permissions: `useAuth()`"
- "Reusable components: `AuthGuard`, `PermissionGate`"
- "TypeScript for type safety"
- "Clear separation of concerns"

### Scalability
- "Easy to add new roles and permissions"
- "Permission-based system allows granular control"
- "Can extend to multi-tenant architecture"
- "Ready for additional OAuth providers"

## 🔍 Code Walkthrough

### Key Files to Show
1. `middleware.ts` - Route protection
2. `lib/auth.ts` - NextAuth configuration
3. `lib/models/User.ts` - User schema with role/permissions
4. `components/AuthGuard.tsx` - Page-level protection
5. `components/PermissionGate.tsx` - Component-level authorization
6. `lib/hooks/useAuth.ts` - Authorization hooks
7. `app/(routes)/dashboard/page.tsx` - Example protected page

## 📸 Screenshot Checklist

Capture these screens for documentation:

- [ ] Login page with OAuth buttons
- [ ] Home page as Viewer (limited access)
- [ ] Home page as Editor (expanded access)
- [ ] Home page as Admin (full access)
- [ ] Navigation as different roles
- [ ] 403 Unauthorized page
- [ ] Dashboard with permission gates
- [ ] Content page showing disabled/enabled buttons
- [ ] Users management page (Admin)
- [ ] Analytics page (Admin)
- [ ] Profile page showing account linking

## 🎯 Key Demonstration Points

1. **SSO Integration**: Both Google and GitHub work seamlessly
2. **Account Linking**: Multiple providers → one user account
3. **Route Protection**: Direct URL access is blocked
4. **Dynamic UI**: Navigation changes based on role
5. **Granular Permissions**: Button-level control
6. **Error Handling**: Proper 403 page for unauthorized access
7. **Loading States**: Smooth user experience during auth checks
8. **Role-Specific Content**: Different users see different content

---

**Demo Duration**: 15-20 minutes total
**Preparation Time**: 5 minutes (setup roles in DB)
