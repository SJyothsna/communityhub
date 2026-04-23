# Database Persistence Configuration

## ✅ Changes Made

Your database has been changed from **in-memory** to **file-based** to persist data across application restarts.

### Configuration Changes in `application.properties`:

#### 1. Database URL Changed
**Before:**
```properties
spring.datasource.url=jdbc:h2:mem:communityhub
```

**After:**
```properties
spring.datasource.url=jdbc:h2:file:./data/communityhub
```

#### 2. JPA DDL Auto Changed
**Before:**
```properties
spring.jpa.hibernate.ddl-auto=none
```

**After:**
```properties
spring.jpa.hibernate.ddl-auto=update
```

#### 3. Schema Initialization Changed
**Before:**
```properties
spring.sql.init.mode=always
```

**After:**
```properties
spring.sql.init.mode=never
```

---

## 📁 Database File Location

Database files will be stored in:
```
./data/communityhub.mv.db
./data/communityhub.trace.db (if errors occur)
```

The `data/` folder is automatically created when you first start the application.

---

## 🔄 What This Means

### ✅ Benefits:
1. **Data Persists** - Your data will NOT be lost when you restart the application
2. **No Re-entry** - You don't need to re-enter data every time
3. **Production Ready** - Suitable for development and testing
4. **Backup Possible** - You can backup the `data/` folder

### ⚠️ Important Notes:
1. **First Run** - On first run, Hibernate will create tables automatically
2. **Schema Updates** - If you change entity classes, Hibernate will update tables
3. **Data Folder** - The `data/` folder is **NOT** in `.gitignore` (will be committed to Git for team sharing)
4. **H2 Console** - Use new JDBC URL: `jdbc:h2:file:./data/communityhub`
5. **Team Collaboration** - Database changes will be shared with your team via Git

---

## 🚀 How to Use

### First Time Setup:
1. **Delete old data** (if exists):
   ```bash
   # Stop the application first
   rm -rf data/
   ```

2. **Start the application**:
   ```bash
   mvn spring-boot:run
   ```

3. **Tables are created automatically** by Hibernate

4. **Add your data** using admin.html or individual pages

5. **Restart the application** - Your data will still be there!

---

## 🔍 Verify Data Persistence

### Test Steps:
1. Start application: `mvn spring-boot:run`
2. Add a community via `http://localhost:8080/admin.html`
3. Stop the application (Ctrl+C)
4. Start application again: `mvn spring-boot:run`
5. Open admin.html - Your community should still be there!

---

## 🗄️ H2 Console Access

### Updated Login Credentials:
- **URL:** `http://localhost:8080/h2-console`
- **JDBC URL:** `jdbc:h2:file:./data/communityhub` ⚠️ (CHANGED)
- **User Name:** `sa`
- **Password:** (leave empty)

---

## 🔧 Troubleshooting

### Issue: "Table already exists" error
**Cause:** Schema initialization running when tables already exist

**Solution:** Already fixed! `spring.sql.init.mode=never` prevents this

### Issue: Data still disappearing
**Cause:** Using old JDBC URL in H2 Console

**Solution:** Make sure to use `jdbc:h2:file:./data/communityhub` (not `mem:`)

### Issue: Can't find database file
**Cause:** Application not started yet or wrong directory

**Solution:** 
1. Start application first
2. Check `./data/` folder exists
3. Run from project root directory

### Issue: Want to reset database
**Solution:**
```bash
# Stop application first
rm -rf data/
# Start application - fresh database will be created
mvn spring-boot:run
```

---

## 📊 Database Modes Comparison

| Feature | In-Memory (OLD) | File-Based (NEW) |
|---------|----------------|------------------|
| Data Persistence | ❌ Lost on restart | ✅ Persists |
| Speed | ⚡ Faster | ⚡ Fast enough |
| Backup | ❌ Not possible | ✅ Copy data folder |
| Production Use | ❌ No | ✅ Yes (for dev/test) |
| Disk Space | ✅ None | 📁 Few MB |

---

## 🎯 Best Practices

### Development:
1. Use file-based database (current setup)
2. Backup `data/` folder before major changes
3. Use H2 Console to verify data

### Testing:
1. Keep a backup of `data/` folder with test data
2. Restore when needed for testing

### Production:
1. Consider switching to PostgreSQL or MySQL
2. Keep H2 for development only
3. Use proper database backups

---

## 🔄 Switching Back to In-Memory (Not Recommended)

If you need to switch back for some reason:

```properties
# In application.properties
spring.datasource.url=jdbc:h2:mem:communityhub
spring.jpa.hibernate.ddl-auto=none
spring.sql.init.mode=always
```

---

## 📝 Summary

✅ **Database is now persistent**
✅ **Data survives application restarts**
✅ **No need to re-enter data**
✅ **H2 Console URL updated**
✅ **Ready for development and testing**

**Next Steps:**
1. Restart your application
2. Add some test data
3. Restart again to verify data persists
4. Start using admin.html for management!

---

## 🆘 Need Help?

If data is still not persisting:
1. Check `application.properties` has correct settings
2. Verify `data/` folder is created
3. Check H2 Console with correct JDBC URL
4. Look for errors in application logs
5. Try deleting `data/` folder and restart

**The database will now retain all your data across restarts!** 🎉