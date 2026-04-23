# Admin Panel Setup Instructions

## Files Created
- `src/main/resources/static/admin.html` - Admin interface
- `src/main/resources/static/admin.js` - JavaScript functionality

## How to Access the Admin Panel

### Step 1: Restart the Spring Boot Application
The application needs to be restarted to load the new admin files.

**Option A: Using Maven**
```bash
mvn spring-boot:run
```

**Option B: Using IDE**
1. Stop the current running application
2. Run `CommunityHubApplication.java` again

**Option C: Using Command Line**
```bash
# Build the project
mvn clean package

# Run the JAR
java -jar target/communityhub-0.0.1-SNAPSHOT.jar
```

### Step 2: Access the Admin Panel
Once the application is running, open your browser and navigate to:
```
http://localhost:8080/admin.html
```

### Step 3: Verify Application is Running
You should see this message in the console:
```
Started CommunityHubApplication in X.XXX seconds
```

## Troubleshooting

### 404 Error
- **Cause**: Application not restarted after adding new files
- **Solution**: Stop and restart the Spring Boot application

### Blank Page or JavaScript Errors
- **Cause**: Browser cache or CORS issues
- **Solution**: 
  1. Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
  2. Clear browser cache
  3. Check browser console (F12) for errors

### API Connection Errors
- **Cause**: Backend not running or wrong port
- **Solution**: 
  1. Verify application is running on port 8080
  2. Check that all controllers are loaded
  3. Test API endpoints directly: http://localhost:8080/api/communities

## Features Available

### Communities Tab
- View all communities
- Add new community
- Edit existing community
- Delete community (soft delete)

### Categories Tab
- View all categories
- Add new category
- Edit existing category
- Delete category (soft delete)

### Subcategories Tab
- View all subcategories
- Add new subcategory (requires category)
- Edit existing subcategory
- Delete subcategory (soft delete)

### Providers Tab
- View all providers
- Add new provider
- Edit existing provider
- Delete provider (soft delete)

### Services Tab
- View all services
- Add new service (requires provider and subcategory)
- Edit existing service
- Delete service (soft delete)

### Recommendations Tab
- View all recommendations
- Add new recommendation (requires service and community)
- Edit existing recommendation
- Delete recommendation (permanent delete)

## Usage Flow

1. **Select a tab** - Click on the tab for the entity you want to manage
2. **Select from dropdown** - Choose an item from the dropdown to view its details
3. **View in table** - The selected item appears in a table below
4. **Edit** - Click the "Edit" button to modify the record (form appears inline)
5. **Delete** - Click the "Delete" button to remove the record (with confirmation)
6. **Add New** - Click "+ Add New" to create a new record

## Notes

- All forms validate required fields
- Success/error messages appear at the top of each tab
- Changes are saved immediately to the database
- Dropdown lists refresh automatically after add/edit/delete operations
- The interface is responsive and works on mobile devices

## Default Data

If you need sample data, you can add it through the admin panel or use the existing HTML pages to create test data.