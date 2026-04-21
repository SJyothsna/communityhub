# CommunityHub Backend

A Spring Boot backend application for managing community-centric service directories where services can be visible across multiple communities.

## Features

- ✅ Community management
- ✅ Service categories and subcategories
- ✅ Provider management
- ✅ Service listings
- ✅ **Many-to-many mapping**: Same service visible in multiple communities
- ✅ Service recommendations
- ✅ H2 in-memory database
- ✅ RESTful APIs
- ✅ Complete CRUD operations

## Technology Stack

- **Java**: 17
- **Spring Boot**: 3.2.0
- **Database**: H2 (in-memory)
- **ORM**: Spring Data JPA
- **Build Tool**: Maven
- **Utilities**: Lombok

## Project Structure

```
communityhub/
├── src/
│   ├── main/
│   │   ├── java/com/communityhub/backend/
│   │   │   ├── entity/          # JPA entities
│   │   │   ├── repository/      # Spring Data repositories
│   │   │   ├── service/         # Business logic
│   │   │   ├── controller/      # REST controllers
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   └── CommunityHubApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── schema.sql       # Database schema
│   └── test/
├── pom.xml
├── README.md
└── API_DOCUMENTATION.md
```

## Database Schema

### Core Tables
1. **communities** - Community information
2. **categories** - Top-level service categories (Home Services, Kids Classes, etc.)
3. **subcategories** - Specific services (Plumber, Electrician, Music, Art, etc.)
4. **providers** - Service providers/vendors
5. **services** - Actual service offerings
6. **community_services** - **Mapping table** (many-to-many relationship)
7. **service_recommendations** - User recommendations

### Key Relationships
- One provider → many services
- One service → one subcategory
- One subcategory → one category
- **One service ↔ many communities** (through community_services)
- **One community ↔ many services** (through community_services)

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Maven 3.6+

### Installation

1. **Clone or navigate to the project**
```bash
cd communityhub
```

2. **Build the project**
```bash
mvn clean install
```

3. **Run the application**
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### Access H2 Console
- URL: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:communityhub`
- Username: `sa`
- Password: (leave empty)

## Quick Start Guide

### 1. Create a Community
```bash
POST http://localhost:8080/api/communities
Content-Type: application/json

{
  "communityName": "Green Park Residents",
  "description": "Trusted services for Green Park residents",
  "city": "Dublin",
  "area": "Ranelagh"
}
```

### 2. Create a Category
```bash
POST http://localhost:8080/api/categories
Content-Type: application/json

{
  "categoryName": "Home Services",
  "categoryType": "SERVICE",
  "description": "Household support and maintenance"
}
```

### 3. Create a Subcategory
```bash
POST http://localhost:8080/api/subcategories
Content-Type: application/json

{
  "categoryId": 1,
  "subcategoryName": "Plumber",
  "description": "Plumbing services"
}
```

### 4. Create a Provider
```bash
POST http://localhost:8080/api/providers
Content-Type: application/json

{
  "providerName": "John Plumbing Services",
  "contactPerson": "John",
  "phoneNumber": "0871234567",
  "email": "john@example.com",
  "whatsappNumber": "0871234567",
  "city": "Dublin",
  "area": "Ranelagh"
}
```

### 5. Create a Service
```bash
POST http://localhost:8080/api/services
Content-Type: application/json

{
  "providerId": 1,
  "subcategoryId": 1,
  "serviceName": "Emergency Plumbing Repairs",
  "shortDescription": "Quick help for leaks and blockages",
  "serviceMode": "HOME_VISIT",
  "priceInfo": "From €50",
  "areaServed": "Ranelagh, Rathmines, Dublin 6"
}
```

### 6. Tag Service to Community
```bash
POST http://localhost:8080/api/community-services
Content-Type: application/json

{
  "communityId": 1,
  "serviceId": 1,
  "isFeatured": true,
  "displayOrder": 1
}
```

### 7. Get All Services for a Community
```bash
GET http://localhost:8080/api/communities/1/services
```

## Key APIs

### Most Important API
**Get Services for Community** - This is the main API for frontend
```
GET /api/communities/{communityId}/services?categoryId=1&subcategoryId=2&keyword=plumb
```

Returns all services available in a community with full details including provider info and recommendation count.

### Other Important APIs
- `POST /api/communities` - Create community
- `POST /api/providers` - Create provider
- `POST /api/services` - Create service
- `POST /api/community-services` - Tag service to community
- `POST /api/recommendations` - Add recommendation

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete API reference.

## Example Use Case

**Scenario**: Add a plumber service to 3 different communities

1. Create the provider once
2. Create the service once
3. Tag the same service to 3 communities:
   - Green Park Residents
   - Ranelagh Parents
   - Maple Residency

Now the same plumber appears in all 3 communities without data duplication!

## Development Notes

### Adding More Controllers

The project currently has the core CommunityServiceController implemented. To complete the application, you need to add:

1. **CommunityController** - CRUD for communities
2. **CategoryController** - CRUD for categories
3. **SubcategoryController** - CRUD for subcategories
4. **ProviderController** - CRUD for providers
5. **ServiceController** - CRUD for services
6. **RecommendationController** - CRUD for recommendations

Each controller should follow the same pattern as CommunityServiceController.

### Service Layer Pattern

Each controller should have a corresponding service class:
- CommunityService
- CategoryService
- SubcategoryService
- ProviderService
- ServiceService (for the Service entity)
- RecommendationService

## Testing

Use the H2 console or tools like Postman/Insomnia to test the APIs.

Sample test data can be inserted directly through H2 console or via API calls.

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Image upload for services
- [ ] Rating system
- [ ] Booking functionality
- [ ] Payment integration
- [ ] Email notifications
- [ ] Search with Elasticsearch
- [ ] Caching with Redis
- [ ] File-based H2 database (persistent)
- [ ] PostgreSQL/MySQL support

## Contributing

This is an MVP implementation. Feel free to extend with additional features.

## License

MIT License

## Contact

For questions or support, please refer to the API documentation.

---

**Note**: This is a backend-only application. You'll need to build a frontend (React, Angular, Vue, etc.) to consume these APIs.