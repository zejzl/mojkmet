# 🔐 mojkmet.eu Authentication - Complete Setup

**Date:** February 7, 2026  
**Status:** ✅ Fully Functional (Login, Register, Sessions)

---

## ✅ What's Working

### 1. User Registration (`/register`)
**URL:** https://mojkmet.eu/register

**Features:**
- Full registration form with validation
- Role selection: CONSUMER (kupec) or FARMER (kmet)
- Password validation (min 8 characters)
- Password confirmation matching
- Duplicate email detection
- bcrypt password hashing (12 rounds)
- Auto-login after successful registration
- Redirect to appropriate page based on role

**User Flow:**
1. User fills form (name, email, password, role)
2. Frontend validates (passwords match, length, etc.)
3. POST to `/api/register`
4. Backend checks if email exists
5. Hashes password with bcrypt
6. Creates user in database (Prisma → Neon)
7. Auto-login with NextAuth
8. Redirect: FARMER → `/dashboard/farmer`, CONSUMER → `/`

### 2. User Login (`/login`)
**URL:** https://mojkmet.eu/login

**Features:**
- Email + password authentication
- NextAuth credential provider
- Session management (JWT strategy)
- Error handling (wrong credentials)
- Remember me functionality (via JWT)
- Redirect after successful login

**User Flow:**
1. User enters email + password
2. Frontend calls NextAuth `signIn('credentials')`
3. NextAuth calls authorize function in `lib/auth.ts`
4. Backend finds user by email (Prisma)
5. Compares password with bcrypt
6. Creates JWT session token
7. Redirects to homepage

### 3. Session Management
**Strategy:** JWT (JSON Web Tokens)

**Session Data Stored:**
- User ID
- Email
- Name
- Role (CONSUMER/FARMER/ADMIN)

**Session Duration:** Default NextAuth (30 days)

**Security:**
- Passwords hashed with bcrypt (factor 12)
- JWT signed with NEXTAUTH_SECRET
- HTTPS only in production (automatic)
- HttpOnly cookies (prevents XSS)

---

## 🏗️ Architecture

### Database Schema (Prisma)

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  password      String
  image         String?
  role          UserRole  @default(CONSUMER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  farm          Farm?
  orders        Order[]
  reviews       Review[]
  favorites     Favorite[]
}

enum UserRole {
  CONSUMER
  FARMER
  ADMIN
}
```

### API Endpoints

**1. Registration:** `POST /api/register`
```typescript
Request:
{
  "name": "Marko Novak",
  "email": "marko@example.com",
  "password": "securepassword123",
  "role": "CONSUMER" | "FARMER"
}

Response (Success):
{
  "user": {
    "id": "clx...",
    "email": "marko@example.com",
    "name": "Marko Novak",
    "role": "CONSUMER"
  }
}

Response (Error):
{
  "error": "User already exists"
}
```

**2. Authentication:** `POST /api/auth/signin`
```typescript
// Handled by NextAuth
// Called via signIn('credentials', { email, password })
```

**3. Session Check:** `GET /api/auth/session`
```typescript
// Returns current user session
// Null if not logged in
```

### Frontend Components

**Files:**
- `app/register/page.tsx` - Registration form
- `app/login/page.tsx` - Login form
- `lib/auth.ts` - NextAuth configuration
- `lib/prisma.ts` - Database client
- `app/api/register/route.ts` - Registration API
- `app/api/auth/[...nextauth]/route.ts` - NextAuth handler

---

## 🧪 Testing

### Test User Registration

**1. Go to:** https://mojkmet.eu/register

**2. Fill form:**
- Name: Test User
- Email: test@example.com
- Password: testpassword123
- Confirm: testpassword123
- Role: Kupec (Consumer)

**3. Click:** Ustvari račun

**4. Expected:**
- User created in database
- Auto-login successful
- Redirect to homepage
- Session cookie set

### Test User Login

**1. Go to:** https://mojkmet.eu/login

**2. Fill form:**
- Email: test@example.com
- Password: testpassword123

**3. Click:** Prijavi se

**4. Expected:**
- Authentication successful
- Redirect to homepage
- Session active

### Verify Session

**Check if logged in:**
```javascript
// In browser console at mojkmet.eu
fetch('/api/auth/session')
  .then(r => r.json())
  .then(console.log)

// Expected if logged in:
{
  "user": {
    "id": "...",
    "email": "test@example.com",
    "name": "Test User",
    "role": "CONSUMER"
  }
}

// Expected if logged out:
{}
```

---

## 🔒 Security Features

### ✅ Implemented

1. **Password Hashing**
   - bcrypt with salt rounds: 12
   - One-way encryption (can't be reversed)
   - Resistant to rainbow table attacks

2. **Session Security**
   - JWT tokens signed with NEXTAUTH_SECRET
   - HttpOnly cookies (JavaScript can't access)
   - SameSite cookies (CSRF protection)
   - Secure flag in production (HTTPS only)

3. **Input Validation**
   - Email format validation
   - Password length requirement (8+ chars)
   - Password confirmation matching
   - SQL injection prevention (Prisma parameterized queries)

4. **Database Security**
   - SSL/TLS connection to Neon (sslmode=require)
   - No raw SQL queries (Prisma ORM)
   - Unique email constraint (prevents duplicates)

### ⚠️ TODO (Future Security Enhancements)

1. **Email Verification**
   - Send confirmation email on registration
   - Verify email before allowing login
   - Prevent fake accounts

2. **Rate Limiting**
   - Limit login attempts (5 per hour)
   - Prevent brute force attacks
   - Use Vercel Rate Limiting or Upstash

3. **Password Reset**
   - "Forgot password" flow
   - Secure token generation
   - Email-based reset

4. **Two-Factor Authentication (2FA)**
   - Optional TOTP (Google Authenticator)
   - SMS verification
   - Backup codes

5. **Session Management**
   - View active sessions
   - Logout from all devices
   - Session expiry notifications

6. **Account Security**
   - Password strength meter
   - Breach detection (Have I Been Pwned API)
   - Security questions

---

## 📊 Current Database Status

**As of Feb 7, 2026:**
- Users: 2 (existing test accounts)
- Farms: 1 (Kmetija Vidmar)
- Products: 2 (Mleko, Sir)
- Categories: 4

**To check database:**
```bash
cd C:\Users\Administrator\Desktop\mojkmet-app
node check-data.js
```

---

## 🚀 Next Steps

### 1. Protected Routes (High Priority)
Create middleware to protect authenticated-only pages:

**Add:** `middleware.ts`
```typescript
import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token
  },
})

export const config = {
  matcher: ['/dashboard/:path*', '/orders/:path*']
}
```

### 2. User Dashboard
**For CONSUMER:**
- View orders
- Manage favorites
- Edit profile
- Change password

**For FARMER:**
- Manage farm profile
- Add/edit products
- View orders
- Analytics

### 3. Role-Based Access Control
**Implement permissions:**
- CONSUMER: Can browse, order
- FARMER: Can manage farm, products
- ADMIN: Can verify farms, moderate

### 4. Email Integration
**For authentication:**
- Welcome email on registration
- Password reset emails
- Order confirmation emails
- Newsletter subscriptions

---

## 🔧 Environment Variables

**Required in Vercel:**
- ✅ `DATABASE_URL` - Neon PostgreSQL connection
- ✅ `NEXTAUTH_SECRET` - JWT signing key
- ✅ `NEXTAUTH_URL` - Site URL for callbacks

**Optional (future):**
- `EMAIL_SERVER_HOST` - SMTP for emails
- `EMAIL_SERVER_USER` - SMTP username
- `EMAIL_SERVER_PASSWORD` - SMTP password
- `EMAIL_FROM` - Sender email address

---

## 📝 Code Quality Notes

**Good Practices:**
- ✅ TypeScript for type safety
- ✅ Prisma for database type safety
- ✅ bcrypt for password hashing
- ✅ Error handling with try/catch
- ✅ Loading states in UI
- ✅ Form validation before submit

**Could Improve:**
- Add Zod for schema validation
- Add unit tests (Vitest/Jest)
- Add E2E tests (Playwright)
- Add logging (Sentry/LogRocket)

---

## 🐛 Troubleshooting

### "Invalid credentials" on correct password
**Cause:** bcrypt hash comparison failing  
**Fix:** Check password was hashed correctly during registration

### Session not persisting
**Cause:** NEXTAUTH_SECRET mismatch or missing  
**Fix:** Verify NEXTAUTH_SECRET in Vercel matches local

### Registration creates user but login fails
**Cause:** Role not being passed to JWT callback  
**Fix:** Check `lib/auth.ts` jwt callback includes role

### "User already exists" but can't login
**Cause:** User created but password null  
**Fix:** Delete user from database, re-register

---

## ✅ Summary

**Authentication Status:** FULLY FUNCTIONAL

**What Users Can Do:**
1. ✅ Register new account (consumer or farmer)
2. ✅ Login with email + password
3. ✅ Session persists across pages
4. ✅ Logout (via NextAuth)
5. ✅ Passwords securely hashed

**What's Next:**
- Protected routes (dashboard)
- Email verification
- Password reset
- User profiles
- Role-based features

**Ready for:** Beta testing with real users! 🎉
