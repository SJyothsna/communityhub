# Community Hub - Quick Links Reference

## 🗄️ Database Console

### H2 Database Console
**URL:** `http://localhost:8080/h2-console`

**Login Credentials:**
- **JDBC URL:** `jdbc:h2:file:./data/communityhub`
- **User Name:** `sa`
- **Password:** (leave empty)
- **Driver Class:** `org.h2.Driver`

**Purpose:**
- View database tables directly
- Run SQL queries
- Check what data exists
- Debug data issues

**⚠️ IMPORTANT:**
- Database is now **FILE-BASED** (data persists across restarts)
- Database files stored in `./data/` folder
- Data will NOT be lost when you restart the application

---

## 🎨 Admin & Management Pages

### Main Admin Panel (Recommended)
**URL:** `http://localhost:8080/admin.html`
- Unified interface with tabs
- Manage all entities in one place
- Dropdown selection and inline editing

### API Test Page
**URL:** `http://localhost:8080/test-api.html`
- Quick API connectivity test
- Troubleshooting tool

---

## 🔧 Individual Controller Pages

### Communities
**URL:** `http://localhost:8080/communities.html`
- Manage communities
- Test Community API endpoints

### Categories
**URL:** `http://localhost:8080/categories.html`
- Manage categories
- Test Category API endpoints

### Subcategories
**URL:** `http://localhost:8080/subcategories.html`
- Manage subcategories
- Test Subcategory API endpoints

### Providers
**URL:** `http://localhost:8080/providers.html`
- Manage providers
- Test Provider API endpoints

### Services
**URL:** `http://localhost:8080/services.html`
- Manage services
- Test Service API endpoints

### Recommendations
**URL:** `http://localhost:8080/recommendations.html`
- Manage recommendations
- Test Recommendation API endpoints

### Community Services
**URL:** `http://localhost:8080/community-services.html`
- Tag services to communities
- Test Community-Service API endpoints

---

## 🌐 Home Page

### Landing Page
**URL:** `http://localhost:8080/` or `http://localhost:8080/index.html`
- Links to all pages
- Navigation hub

---

## 🔌 API Endpoints Base

### REST API Base URL
**URL:** `http://localhost:8080/api`

**Available Endpoints:**
- `/api/communities` - Community operations
- `/api/categories` - Category operations
- `/api/subcategories` - Subcategory operations
- `/api/providers` - Provider operations
- `/api/services` - Service operations
- `/api/recommendations` - Recommendation operations
- `/api/community-services` - Community-Service tagging

---

## 📋 Quick Access Checklist

When starting the application:

1. ✅ Start Spring Boot: `mvn spring-boot:run`
2. ✅ Check H2 Console: `http://localhost:8080/h2-console`
3. ✅ Test API: `http://localhost:8080/test-api.html`
4. ✅ Use Admin Panel: `http://localhost:8080/admin.html`

---

## 🔍 Troubleshooting Links

### If admin.html shows empty dropdowns:
1. Check H2 Console to see if data exists
2. Use test-api.html to verify API is working
3. Add data using individual controller pages

### If nothing loads:
1. Verify Spring Boot is running
2. Check console for "Started CommunityHubApplication"
3. Verify port 8080 is not in use by another application

---

## 💾 Database Tables (View in H2 Console)

Run these queries in H2 Console to check data:

```sql
-- Check all tables
SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='PUBLIC';

-- Check communities
SELECT * FROM COMMUNITY;

-- Check categories
SELECT * FROM CATEGORY;

-- Check subcategories
SELECT * FROM SUBCATEGORY;

-- Check providers
SELECT * FROM PROVIDER;

-- Check services
SELECT * FROM SERVICE;

-- Check recommendations
SELECT * FROM SERVICE_RECOMMENDATION;

-- Check community services
SELECT * FROM COMMUNITY_SERVICE;
```

---

## 🎯 Most Used Links

**For Daily Use:**
- Admin Panel: `http://localhost:8080/admin.html`
- H2 Console: `http://localhost:8080/h2-console`

**For Development:**
- Test API: `http://localhost:8080/test-api.html`
- Individual Pages: `http://localhost:8080/communities.html` (etc.)

**For Debugging:**
- H2 Console: `http://localhost:8080/h2-console`
- Browser Console: Press F12 in browser
- Application Logs: Check terminal where Spring Boot is running

---

## 📱 Bookmark These

Add these to your browser bookmarks for quick access:
1. `http://localhost:8080/admin.html` - Admin Panel
2. `http://localhost:8080/h2-console` - Database Console
3. `http://localhost:8080/test-api.html` - API Test

---

## 🚀 First Time Setup

1. Start application: `mvn spring-boot:run`
2. Open H2 Console: `http://localhost:8080/h2-console`
3. Login with credentials above
4. Check if tables exist (run SQL queries above)
5. Add initial data using: `http://localhost:8080/communities.html`
6. Use admin panel: `http://localhost:8080/admin.html`

---

**All links assume the application is running on localhost:8080**