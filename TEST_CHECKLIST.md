# ✅ Testing Checklist

## Pre-Testing Setup

### 1. Environment Variables
- [x] MongoDB URI configured
- [x] NextAuth URL set to http://localhost:3000
- [x] NextAuth Secret generated
- [x] Google OAuth credentials added
- [x] GitHub OAuth credentials added

### 2. Dependencies
Run: `npm install`
- [x] All packages installed

### 3. Database Connection
- [x] MongoDB Atlas connection string configured
- [ ] Database accessible (test connection)

## Testing Steps

### Phase 1: Application Startup
```bash
npm run dev
```

Expected:
- [x] Server starts on http://localhost:3000
- [ ] No compilation errors
- [ ] No runtime errors

### Phase 2: Authentication Testing

#### Test 1: Login Page Access
1. Open http://localhost:3000
2. Click "Sign In" button
3. Should redirect to /login

Expected:
- [ ] Login page loads without errors
- [ ] Two OAuth buttons visible (Google & GitHub)
- [ ] No console errors

#### Test 2: Google OAuth
1. Click "Continue with Google"
2. Complete Google authentication
3. Should redirect back to app

Expected:
- [ ] Successfully authenticated
- [ ] User created in MongoDB
- [ ] Default role: viewer
- [ ] Redirected to home page
- [ ] Navbar visible with user info

#### Test 3: Session Persistence
1. Refresh the page
2. Should remain logged in

Expected:
- [ ] Session persists
- [ ] No re-authentication required
- [ ] User data still visible

#### Test 4: Account Linking
1. Sign out
2. Sign in with GitHub (using same email as Google)
3. Navigate to /profile

Expected:
- [ ] Successfully authenticated
- [ ] Same user account
- [ ] Both "google" and "github" provider badges visible
- [ ] No duplicate user created

### Phase 3: Authorization Testing

#### Test 5: Viewer Role Restrictions
**As Viewer:**

1. Check navigation menu
   - [ ] Only "Home" and "Profile" visible
   - [ ] No Dashboard, Content, Users, Analytics

2. Try accessing /dashboard directly
   - [ ] Redirected to /unauthorized
   - [ ] 403 error page displayed

3. Try accessing /users directly
   - [ ] Redirected to /unauthorized

4. Check home page
   - [ ] Only 1 permission visible: read:all
   - [ ] Limited action cards visible
   - [ ] Restricted Feature card is grayed out

#### Test 6: Upgrade to Editor
**Update role in MongoDB:**
```bash
mongosh "mongodb+srv://sohaibrafique:sohaibrafique@cluster0.tj23vdk.mongodb.net/"
use fusion-capture
db.users.find().pretty()
db.users.updateOne(
  { email: "YOUR_EMAIL" },
  { $set: { role: "editor" } }
)
```

**Sign out and sign in again:**

1. Check navigation
   - [ ] Dashboard, Content now visible
   - [ ] Users, Analytics still hidden

2. Access /dashboard
   - [ ] Successfully loads
   - [ ] Shows "Editor View" message
   - [ ] Delete Items button is disabled

3. Access /content
   - [ ] Successfully loads
   - [ ] Edit buttons enabled
   - [ ] Delete buttons disabled/grayed

4. Try accessing /users
   - [ ] Still redirected to /unauthorized

5. Check home page
   - [ ] 4 permissions visible
   - [ ] More action cards visible

#### Test 7: Upgrade to Admin
**Update role in MongoDB:**
```bash
db.users.updateOne(
  { email: "YOUR_EMAIL" },
  { $set: { role: "admin" } }
)
```

**Sign out and sign in again:**

1. Check navigation
   - [ ] All menu items visible
   - [ ] Users and Analytics accessible

2. Access /users
   - [ ] Successfully loads
   - [ ] Can see all users
   - [ ] Can change user roles
   - [ ] Delete buttons visible

3. Access /analytics
   - [ ] Successfully loads
   - [ ] Dashboard with metrics visible

4. Access /dashboard
   - [ ] All buttons enabled including Delete
   - [ ] Shows "Admin View" message

5. Access /content
   - [ ] All buttons enabled (Edit & Delete)

6. Check home page
   - [ ] 6 permissions visible
   - [ ] All action cards visible

### Phase 4: UI Component Testing

#### Test 8: Dynamic Navigation
- [ ] Navigation changes based on role
- [ ] Mobile menu works correctly
- [ ] User avatar and role badge displayed
- [ ] Logout button works

#### Test 9: Permission Gates
- [ ] Buttons show/hide based on permissions
- [ ] Components render conditionally
- [ ] Fallback UI displays correctly
- [ ] No console errors

#### Test 10: Loading States
- [ ] Loading spinner shows during auth check
- [ ] Smooth transitions between states
- [ ] No flash of unauthorized content

### Phase 5: Edge Cases

#### Test 11: Direct URL Access
**While logged out:**
1. Try to access /dashboard directly
   - [ ] Redirected to /login

**While logged in as Viewer:**
1. Try to access /users directly
   - [ ] Redirected to /unauthorized

#### Test 12: Session Expiry
1. Wait for session to expire (or manually clear cookies)
2. Try to access protected route
   - [ ] Redirected to /login

#### Test 13: Multiple Tabs
1. Open app in two browser tabs
2. Sign out in one tab
3. Try to navigate in other tab
   - [ ] Properly handles authentication state

## Common Issues & Solutions

### Issue 1: "Function.prototype.apply" Error
**Solution**: Fixed with updated authOptions configuration

### Issue 2: MongoDB Connection Failed
**Solution**: Check MongoDB URI, ensure IP whitelist allows connections

### Issue 3: OAuth Redirect Mismatch
**Solution**: Verify redirect URIs in Google/GitHub console match exactly:
- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

### Issue 4: Session Not Persisting
**Solution**: Check NEXTAUTH_SECRET is set and consistent

### Issue 5: Role Changes Not Reflecting
**Solution**: Sign out and sign in again after updating role in database

## Final Verification

### Checklist Summary
- [ ] All authentication tests pass
- [ ] All authorization tests pass
- [ ] UI components work as expected
- [ ] No console errors
- [ ] No network errors
- [ ] Database operations successful
- [ ] Account linking works
- [ ] Role-based access control works
- [ ] Permission-based UI control works
- [ ] Direct URL access protection works

## Performance Check
- [ ] Pages load quickly (< 2s)
- [ ] No unnecessary re-renders
- [ ] Database queries efficient
- [ ] No memory leaks

## Security Verification
- [ ] JWT tokens in HTTP-only cookies
- [ ] Middleware protects routes
- [ ] No sensitive data exposed in client
- [ ] CSRF protection active
- [ ] XSS protection via React

---

**Testing Status**: ⏳ In Progress
**Last Updated**: December 11, 2025
