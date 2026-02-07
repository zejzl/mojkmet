# ⚠️ Vercel Environment Variables - REQUIRED

**For mojkmet.eu to work fully, you need these 3 environment variables:**

## 1. Go to Vercel Dashboard
https://vercel.com/dashboard

## 2. Select mojkmet project

## 3. Go to Settings → Environment Variables

## 4. Add Required Environment Variables

### A. DATABASE_URL (Database Connection)

**Name:** `DATABASE_URL`

**Value:**
```
postgresql://neondb_owner:npg_biZp82eKaEvc@ep-little-dust-ag4wbjxz-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

**Database Endpoint:** `ep-little-dust-ag4wbjxz`  
**Branch:** `br-mute-thunder-ag8jjk1n`

**Environments:** All (Production, Preview, Development)

**Purpose:** Connects to Neon PostgreSQL database for farms, products, users

---

### B. NEXTAUTH_SECRET (Authentication)

**Name:** `NEXTAUTH_SECRET`

**Value:**
```
mojkmet-super-secret-key-change-in-production-2026
```

**Environments:** All (Production, Preview, Development)

**Purpose:** Secures NextAuth sessions and JWT tokens

**⚠️ Security Note:** Change this to a random string in production! Generate with:
```bash
openssl rand -base64 32
```

---

### C. NEXTAUTH_URL (Authentication URLs)

**Name:** `NEXTAUTH_URL`

**Value for Production:**
```
https://mojkmet.eu
```

**Value for Preview/Development:**
```
https://mojkmet.eu
```

**Environments:** All (Production, Preview, Development)

**Purpose:** Tells NextAuth what the site URL is for callbacks and redirects

---

## 5. Redeploy

After adding all 3 environment variables, go to **Deployments** and click **"Redeploy"** on the latest deployment.

---

## ✅ Verification Checklist

After deployment with all env vars:

- [ ] **Database:** Visit https://mojkmet.eu/api/farms → Should show farms list
- [ ] **Register:** Visit https://mojkmet.eu/register → Create test account → Should redirect to homepage
- [ ] **Login:** Visit https://mojkmet.eu/login → Login with test account → Should work
- [ ] **Homepage:** Visit https://mojkmet.eu → Should show "Kmetija Vidmar" in farms section

---

## 🚨 Without These Variables:

**Missing DATABASE_URL:**
- ❌ Homepage shows "Napaka pri nalaganju kmetij"
- ❌ /api/farms returns "Database not configured"

**Missing NEXTAUTH_SECRET:**
- ❌ Login/register pages crash
- ❌ NextAuth can't create sessions

**Missing NEXTAUTH_URL:**
- ❌ Login redirects fail
- ❌ OAuth callbacks break (if added later)

---

**Status:** ✅ All 3 variables have been added to Vercel (Feb 7, 2026)
