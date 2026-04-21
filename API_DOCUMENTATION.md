# CommunityHub Backend - API Documentation

## Overview
CommunityHub is a community-centric service directory backend that allows services to be visible across multiple communities.

## Base URL
```
http://localhost:8080/api
```

## Database Access
H2 Console: http://localhost:8080/h2-console
- JDBC URL: jdbc:h2:mem:communityhub
- Username: sa
- Password: (empty)

---

## API Endpoints

### Community APIs

#### 1. Create Community
**POST** `/api/communities`

Request Body:
```json
{
  "communityName": "Green Park Residents",
  "description": "Trusted services for Green Park residents",
  "city": "Dublin",
  "area": "Ranelagh"
}
```

#### 2. Get All Communities
**GET** `/api/communities`

#### 3. Get Community by ID
**GET** `/api/communities/{communityId}`

#### 4. Update Community
**PUT** `/api/communities/{communityId}`

#### 5. Deactivate Community
**PATCH** `/api/communities/{communityId}/deactivate`

---

### Category APIs

#### 1. Create Category
**POST** `/api/categories`

Request Body:
```json
{
  "categoryName": "Home Services",
  "categoryType": "SERVICE",
  "description": "Household support and maintenance services"
}
```

#### 2. Get All Categories
**GET** `/api/categories`

#### 3. Get Category by ID
**GET** `/api/categories/{categoryId}`

---

### Subcategory APIs

#### 1. Create Subcategory
**POST** `/api/subcategories`

Request Body:
```json
{
  "categoryId": 1,
  "subcategoryName": "Plumber",
  "description": "Plumbing related services"
}
```

#### 2. Get Subcategories by Category
**GET** `/api/categories/{categoryId}/subcategories`

---

### Provider APIs

#### 1. Create Provider
**POST** `/api/providers`

Request Body:
```json
{
  "providerName": "John Plumbing Services",
  "contactPerson": "John",
  "phoneNumber": "0871234567",
  "email": "john@example.com",
  "whatsappNumber": "0871234567",
  "addressLine1": "12 Main Street",
  "city": "Dublin",
  "area": "Ranelagh",
  "description": "Trusted local plumbing service"
}
```

#### 2. Get Provider by ID
**GET** `/api/providers/{providerId}`

#### 3. Get All Providers
**GET** `/api/providers`

#### 4. Search Providers
**GET** `/api/providers/search?keyword=john`

---

### Service APIs

#### 1. Create Service
**POST** `/api/services`

Request Body:
```json
{
  "providerId": 1,
  "subcategoryId": 1,
  "serviceName": "Emergency Plumbing Repairs",
  "shortDescription": "Quick help for leaks and blockages",
  "fullDescription": "Provides emergency plumbing services for homes.",
  "serviceMode": "HOME_VISIT",
  "ageGroup": null,
  "priceInfo": "From €50",
  "areaServed": "Ranelagh, Rathmines, Dublin 6"
}
```

Service Modes: `HOME_VISIT`, `AT_PROVIDER_LOCATION`, `ONLINE`, `MIXED`

#### 2. Get Service by ID
**GET** `/api/services/{serviceId}`

#### 3. Get All Services
**GET** `/api/services`

#### 4. Search Services
**GET** `/api/services/search?keyword=plumber&subcategoryId=1`

#### 5. Update Service
**PUT** `/api/services/{serviceId}`

#### 6. Deactivate Service
**PATCH** `/api/services/{serviceId}/deactivate`

---

### Community-Service Mapping APIs

#### 1. Tag Service to Community
**POST** `/api/community-services`

Request Body:
```json
{
  "communityId": 1,
  "serviceId": 5,
  "isFeatured": true,
  "displayOrder": 1,
  "addedBy": "admin"
}
```

#### 2. Get All Services for a Community (MOST IMPORTANT)
**GET** `/api/communities/{communityId}/services`

Optional Query Parameters:
- `categoryId` - Filter by category
- `subcategoryId` - Filter by subcategory
- `keyword` - Search in service names

Example:
```
GET /api/communities/1/services?categoryId=1&subcategoryId=2&keyword=plumb
```

Response:
```json
{
  "communityId": 1,
  "communityName": "Green Park Residents",
  "services": [
    {
      "serviceId": 5,
      "serviceName": "Emergency Plumbing Repairs",
      "providerName": "John Plumbing Services",
      "subcategoryName": "Plumber",
      "categoryName": "Home Services",
      "shortDescription": "Quick help for leaks and blockages",
      "phoneNumber": "0871234567",
      "whatsappNumber": "0871234567",
      "email": "john@example.com",
      "serviceMode": "HOME_VISIT",
      "priceInfo": "From €50",
      "areaServed": "Ranelagh, Rathmines, Dublin 6",
      "isFeatured": true,
      "recommendationCount": 3
    }
  ]
}
```

#### 3. Remove Service from Community
**DELETE** `/api/communities/{communityId}/services/{serviceId}`

---

### Recommendation APIs

#### 1. Add Recommendation
**POST** `/api/recommendations`

Request Body:
```json
{
  "communityId": 1,
  "serviceId": 5,
  "recommenderName": "Sanjana",
  "recommenderNote": "Used him twice for kitchen leak, good service"
}
```

#### 2. Get Recommendations for Service in Community
**GET** `/api/communities/{communityId}/services/{serviceId}/recommendations`

---

## Example Workflow

### Adding a Plumber to 3 Communities

1. **Create Provider**
```bash
POST /api/providers
{
  "providerName": "John Plumbing Services",
  "contactPerson": "John",
  "phoneNumber": "0871234567",
  ...
}
# Returns: providerId = 1
```

2. **Create Service**
```bash
POST /api/services
{
  "providerId": 1,
  "subcategoryId": 1,
  "serviceName": "Emergency Plumbing Repairs",
  ...
}
# Returns: serviceId = 5
```

3. **Tag to Multiple Communities**
```bash
POST /api/community-services
{ "communityId": 1, "serviceId": 5 }

POST /api/community-services
{ "communityId": 2, "serviceId": 5 }

POST /api/community-services
{ "communityId": 3, "serviceId": 5 }
```

Now the same service appears in all 3 communities!

---

## Database Schema

See `schema.sql` for complete database structure.

Key tables:
- `communities` - Community information
- `categories` - Top-level categories
- `subcategories` - Service subcategories
- `providers` - Service providers
- `services` - Actual services
- `community_services` - Mapping table (many-to-many)
- `service_recommendations` - User recommendations

---

## Technology Stack

- Spring Boot 3.2.0
- Java 17
- H2 Database (in-memory)
- Spring Data JPA
- Lombok
- Maven

---

## Running the Application

```bash
cd communityhub
mvn spring-boot:run
```

Application will start on port 8080.