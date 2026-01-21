# 🏗️ System Architecture

## Overview

FusionCapture implements a comprehensive authorization system with multiple layers of protection, from middleware-level route guards to component-level permission checks.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                     Next.js Frontend                       │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │  │
│  │  │  Pages       │  │  Components  │  │  Hooks       │    │  │
│  │  │  - Home      │  │  - AuthGuard │  │  - useAuth() │    │  │
│  │  │  - Dashboard │  │  - PermGate  │  │              │    │  │
│  │  │  - Content   │  │  - Navbar    │  │              │    │  │
│  │  │  - Users     │  │              │  │              │    │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP Requests
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js Server                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Middleware Layer                        │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │  middleware.ts - Route Protection                    │ │  │
│  │  │  • Check authentication                              │ │  │
│  │  │  • Validate JWT token                                │ │  │
│  │  │  • Check role-based access                           │ │  │
│  │  │  • Redirect if unauthorized                          │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    API Routes                             │  │
│  │  ┌──────────────────┐  ┌────────────────────────────┐    │  │
│  │  │ /api/auth/       │  │ /api/users/                │    │  │
│  │  │ [...nextauth]    │  │ - GET  (list users)        │    │  │
│  │  │ • OAuth callback │  │ - PATCH (update role)      │    │  │
│  │  │ • Session mgmt   │  │                            │    │  │
│  │  └──────────────────┘  └────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                NextAuth.js Configuration                  │  │
│  │  • Providers: Google, GitHub                             │  │
│  │  • JWT Strategy                                          │  │
│  │  • Session callbacks                                     │  │
│  │  • Account linking logic                                 │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │ Database Queries
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                        MongoDB                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Users Collection                                         │  │
│  │  {                                                        │  │
│  │    _id: ObjectId,                                         │  │
│  │    name: "John Doe",                                      │  │
│  │    email: "john@example.com",                             │  │
│  │    role: "admin",                                         │  │
│  │    permissions: ["read:all", "write:all", ...],          │  │
│  │    accounts: [                                            │  │
│  │      { provider: "google", providerAccountId: "..." },   │  │
│  │      { provider: "github", providerAccountId: "..." }    │  │
│  │    ]                                                      │  │
│  │  }                                                        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Authorization Flow

### 1. Authentication Flow

```
User clicks "Sign In with Google"
         ↓
NextAuth redirects to Google OAuth
         ↓
User authorizes application
         ↓
Google redirects back with auth code
         ↓
NextAuth exchanges code for user info
         ↓
signIn callback in lib/auth.ts
         ↓
Check if user exists in MongoDB
    ├─ Yes → Link new provider to existing user
    └─ No  → Create new user with default role
         ↓
Generate JWT token with role & permissions
         ↓
Return session to client
         ↓
User is authenticated
```

### 2. Authorization Flow (Route Access)

```
User navigates to /dashboard
         ↓
Middleware (middleware.ts) intercepts request
         ↓
Extract JWT token from request
         ↓
Validate token
    ├─ Invalid → Redirect to /login
    └─ Valid → Continue
         ↓
Check user role from token
         ↓
Check if route requires specific role
    ├─ Insufficient permissions → Redirect to /unauthorized
    └─ Authorized → Allow access
         ↓
Page component loads
         ↓
AuthGuard component checks permissions
    ├─ No permission → Show loading/redirect
    └─ Has permission → Render content
         ↓
Page renders with permission-gated components
```

### 3. Permission Check Flow

```
Component needs to check permission
         ↓
Uses useAuth() hook or PermissionGate
         ↓
Retrieve session from NextAuth
         ↓
Check user.permissions array
         ↓
Does user have required permission?
    ├─ No  → Hide component / Show fallback
    └─ Yes → Render component
```

## Data Models

### User Model

```typescript
interface User {
  _id: ObjectId;
  name: string;
  email: string;
  image?: string;
  role: 'admin' | 'editor' | 'viewer';
  permissions: string[];
  accounts: {
    provider: string;
    providerAccountId: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Session Model

```typescript
interface Session {
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    role: string;
    permissions: string[];
  };
  expires: string;
}
```

### JWT Token

```typescript
interface JWT {
  sub: string;           // User ID
  email: string;
  name: string;
  picture: string;
  role: string;
  permissions: string[];
  userId: string;
  iat: number;
  exp: number;
}
```

## Permission Matrix

| Permission      | Admin | Editor | Viewer | Description                    |
|----------------|-------|--------|--------|--------------------------------|
| read:all       | ✅    | ✅     | ✅     | Read all content              |
| write:own      | ✅    | ✅     | ❌     | Write own content             |
| write:content  | ✅    | ✅     | ❌     | Create/edit content           |
| write:all      | ✅    | ❌     | ❌     | Edit all content              |
| delete:all     | ✅    | ❌     | ❌     | Delete any content            |
| manage:users   | ✅    | ❌     | ❌     | Manage user roles             |
| view:analytics | ✅    | ❌     | ❌     | View analytics dashboard      |
| approve:content| ✅    | ✅     | ❌     | Approve content publication   |

## Route Protection Matrix

| Route        | Public | Viewer | Editor | Admin | Protection Level |
|-------------|--------|--------|--------|-------|------------------|
| /           | ❌     | ✅     | ✅     | ✅    | Authenticated    |
| /login      | ✅     | ✅     | ✅     | ✅    | Public           |
| /profile    | ❌     | ✅     | ✅     | ✅    | Authenticated    |
| /dashboard  | ❌     | ❌     | ✅     | ✅    | Role-based       |
| /content    | ❌     | ❌     | ✅     | ✅    | Permission-based |
| /users      | ❌     | ❌     | ❌     | ✅    | Permission-based |
| /analytics  | ❌     | ❌     | ❌     | ✅    | Permission-based |
| /unauthorized| ✅    | ✅     | ✅     | ✅    | Public           |

## Component Hierarchy

```
App
├── SessionProvider (NextAuth context)
│   ├── Navbar (dynamic based on permissions)
│   └── Page
│       ├── AuthGuard (page-level protection)
│       │   └── Page Content
│       │       ├── PermissionGate (component-level)
│       │       │   └── Protected Component
│       │       ├── PermissionGate
│       │       │   └── Protected Component
│       │       └── Public Component
│       └── Fallback (unauthorized)
```

## Security Layers

### Layer 1: Middleware (Server-Side)
- **Purpose**: First line of defense
- **Location**: Edge runtime
- **Checks**: Authentication & basic role validation
- **Action**: Redirect before page loads

### Layer 2: AuthGuard (Server Component)
- **Purpose**: Page-level protection
- **Location**: Server component
- **Checks**: Detailed role & permission validation
- **Action**: Show loading or redirect

### Layer 3: PermissionGate (Client Component)
- **Purpose**: Component-level visibility control
- **Location**: Client component
- **Checks**: Granular permission checks
- **Action**: Conditional rendering

### Layer 4: useAuth Hook (Client-Side)
- **Purpose**: Programmatic permission checks
- **Location**: Client components
- **Checks**: Runtime permission validation
- **Action**: Enable/disable features

## Authentication Strategy

### JWT Strategy
- **Token Storage**: HTTP-only cookie
- **Token Content**: User ID, role, permissions
- **Expiration**: 30 days (configurable)
- **Refresh**: Automatic via NextAuth

### Account Linking Strategy
1. User signs in with Provider A (e.g., Google)
2. User document created/updated in MongoDB
3. User signs out
4. User signs in with Provider B (e.g., GitHub) using same email
5. System detects existing user by email
6. Adds Provider B to user's accounts array
7. User has both providers linked

## Database Schema

```javascript
// users collection
{
  _id: ObjectId("..."),
  name: "John Doe",
  email: "john@example.com",
  image: "https://...",
  role: "admin",
  permissions: [
    "read:all",
    "write:all",
    "delete:all",
    "manage:users",
    "view:analytics",
    "approve:content"
  ],
  accounts: [
    {
      provider: "google",
      providerAccountId: "1234567890"
    },
    {
      provider: "github",
      providerAccountId: "abcdefgh"
    }
  ],
  createdAt: ISODate("2024-12-11T00:00:00Z"),
  updatedAt: ISODate("2024-12-11T00:00:00Z")
}
```

## API Endpoints

### Authentication
- `GET /api/auth/signin` - Sign in page
- `POST /api/auth/signin/:provider` - Initiate OAuth
- `GET /api/auth/callback/:provider` - OAuth callback
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session

### Users (Admin only)
- `GET /api/users` - List all users
- `PATCH /api/users/:id` - Update user role

## Technology Stack Details

### Frontend
- **Framework**: Next.js 14.0
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **Icons**: Lucide React
- **State**: React Context (NextAuth)

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Next.js API Routes
- **Auth**: NextAuth.js v5 (beta)
- **Database Driver**: Mongoose 9.x

### Database
- **Database**: MongoDB 7.x
- **ORM**: Mongoose
- **Connection**: Connection pooling with cached connections

### Deployment
- **Platform**: Vercel (recommended)
- **Database**: MongoDB Atlas (recommended)
- **Environment**: Production-ready configuration

## Performance Considerations

### Caching Strategy
- JWT tokens cached in HTTP-only cookies
- MongoDB connection pooled and cached
- Session data cached in JWT (no DB lookup on every request)

### Optimization
- Middleware runs on edge runtime (fast)
- Server components reduce client JavaScript
- Lazy loading for client components
- Efficient database queries with indexing

## Security Best Practices

✅ **Implemented**:
- JWT stored in HTTP-only cookies
- CSRF protection via NextAuth
- Role/permission validation at multiple layers
- SQL injection prevention (NoSQL with Mongoose)
- XSS protection via React
- Secure password hashing (bcryptjs) - if implemented

🔮 **Recommended for Production**:
- Rate limiting on authentication endpoints
- 2FA for admin accounts
- Audit logging for permission changes
- IP whitelisting for admin actions
- HTTPS enforcement
- Security headers (CSP, HSTS, etc.)

## Scalability

### Horizontal Scaling
- Stateless authentication (JWT)
- MongoDB supports sharding
- Next.js supports multiple instances
- Session data in token (no session store needed)

### Vertical Scaling
- Connection pooling for database
- Efficient queries with proper indexing
- Caching at multiple levels
- Edge runtime for middleware

## Future Architecture Enhancements

1. **Permission Inheritance**
   - Hierarchical permission structure
   - Role inheritance (e.g., Admin inherits Editor permissions)

2. **Multi-Tenancy**
   - Organization-level isolation
   - Tenant-specific roles and permissions

3. **Audit Logging**
   - Track all permission changes
   - User action logging
   - Security event monitoring

4. **Real-time Updates**
   - WebSocket for permission changes
   - Real-time role updates without re-login

5. **API Authentication**
   - API keys for external access
   - OAuth 2.0 for third-party apps

---

This architecture provides a solid foundation for a production-ready authorization system with multiple layers of security and scalability built in.
