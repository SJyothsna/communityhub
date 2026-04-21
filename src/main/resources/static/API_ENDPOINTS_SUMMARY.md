# CommunityHub API Endpoints Summary

This document lists all available API endpoints for the CommunityHub application.

## 🏘️ Communities Controller (`/api/communities`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/communities` | Get all communities |
| GET | `/api/communities/{id}` | Get community by ID |
| GET | `/api/communities/active` | Get active communities only |
| GET | `/api/communities/city/{city}` | Get communities by city |
| GET | `/api/communities/area/{area}` | Get communities by area |
| POST | `/api/communities` | Create a new community |
| PUT | `/api/communities/{id}` | Update an existing community |
| DELETE | `/api/communities/{id}` | Soft delete a community (sets isActive=false) |
| DELETE | `/api/communities/{id}/permanent` | Permanently delete a community |

## 📂 Categories Controller (`/api/categories`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/{id}` | Get category by ID |
| GET | `/api/categories/active` | Get active categories only |
| GET | `/api/categories/type/{type}` | Get categories by type |
| POST | `/api/categories` | Create a new category |
| PUT | `/api/categories/{id}` | Update an existing category |
| DELETE | `/api/categories/{id}` | Soft delete a category |
| DELETE | `/api/categories/{id}/permanent` | Permanently delete a category |

## 📑 Subcategories Controller (`/api/subcategories`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subcategories` | Get all subcategories |
| GET | `/api/subcategories/{id}` | Get subcategory by ID |
| GET | `/api/subcategories/active` | Get active subcategories only |
| GET | `/api/categories/{categoryId}/subcategories` | Get subcategories by category |
| POST | `/api/subcategories` | Create a new subcategory |
| PUT | `/api/subcategories/{id}` | Update an existing subcategory |
| DELETE | `/api/subcategories/{id}` | Soft delete a subcategory |
| DELETE | `/api/subcategories/{id}/permanent` | Permanently delete a subcategory |

## 👤 Providers Controller (`/api/providers`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/providers` | Get all providers |
| GET | `/api/providers/{id}` | Get provider by ID |
| GET | `/api/providers/active` | Get active providers only |
| GET | `/api/providers/city/{city}` | Get providers by city |
| GET | `/api/providers/area/{area}` | Get providers by area |
| GET | `/api/providers/search?keyword={keyword}` | Search providers by keyword |
| POST | `/api/providers` | Create a new provider |
| PUT | `/api/providers/{id}` | Update an existing provider |
| DELETE | `/api/providers/{id}` | Soft delete a provider |
| DELETE | `/api/providers/{id}/permanent` | Permanently delete a provider |

## 🛠️ Services Controller (`/api/services`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | Get all services |
| GET | `/api/services/{id}` | Get service by ID |
| GET | `/api/services/active` | Get active services only |
| GET | `/api/providers/{providerId}/services` | Get services by provider |
| GET | `/api/subcategories/{subcategoryId}/services` | Get services by subcategory |
| GET | `/api/services/search?keyword={keyword}` | Search services by keyword |
| GET | `/api/services/search/subcategory?subcategoryId={id}&keyword={keyword}` | Search services by subcategory and keyword |
| POST | `/api/services` | Create a new service |
| PUT | `/api/services/{id}` | Update an existing service |
| DELETE | `/api/services/{id}` | Soft delete a service |
| DELETE | `/api/services/{id}/permanent` | Permanently delete a service |

## ⭐ Recommendations Controller (`/api/recommendations`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recommendations` | Get all recommendations |
| GET | `/api/recommendations/{id}` | Get recommendation by ID |
| GET | `/api/services/{serviceId}/recommendations` | Get recommendations by service |
| GET | `/api/communities/{communityId}/recommendations` | Get recommendations by community |
| GET | `/api/services/{serviceId}/communities/{communityId}/recommendations` | Get recommendations by service and community |
| GET | `/api/services/{serviceId}/communities/{communityId}/recommendations/count` | Get recommendation count for service in community |
| GET | `/api/services/{serviceId}/recommendations/count` | Get total recommendation count for service |
| POST | `/api/recommendations` | Create a new recommendation |
| PUT | `/api/recommendations/{id}` | Update an existing recommendation |
| PATCH | `/api/recommendations/{id}/status?status={status}` | Update recommendation status |
| DELETE | `/api/recommendations/{id}` | Delete a recommendation |

## 🔗 Community Services Controller (`/api`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/community-services` | Tag a service to a community |
| GET | `/api/communities/{communityId}/services` | Get all services for a community (with filters) |
| GET | `/api/communities/{communityId}/services?categoryId={id}` | Filter services by category |
| GET | `/api/communities/{communityId}/services?subcategoryId={id}` | Filter services by subcategory |
| GET | `/api/communities/{communityId}/services?keyword={keyword}` | Search services by keyword |
| DELETE | `/api/communities/{communityId}/services/{serviceId}` | Remove service from community |
| GET | `/api/services/{serviceId}/communities` | Get all communities for a service |

## 📊 Total Endpoints

- **Communities**: 9 endpoints
- **Categories**: 8 endpoints
- **Subcategories**: 8 endpoints
- **Providers**: 10 endpoints
- **Services**: 11 endpoints
- **Recommendations**: 11 endpoints
- **Community Services**: 7 endpoints

**Total: 64 REST API endpoints**

## 🎯 Common Patterns

### Soft Delete vs Permanent Delete
- **Soft Delete** (`DELETE /{id}`): Sets `isActive = false`, data remains in database
- **Permanent Delete** (`DELETE /{id}/permanent`): Completely removes data from database

### Active Filters
Most controllers have an `/active` endpoint that returns only records where `isActive = true`

### Search Capabilities
- **Providers**: Search by keyword (name or contact person)
- **Services**: Search by keyword (service name) or by subcategory + keyword

### Location Filters
- **Communities**: Filter by city or area
- **Providers**: Filter by city or area

## 🚀 Testing

All endpoints can be tested using:
1. **HTML Test Pages**: Available at http://localhost:8080
2. **H2 Console**: http://localhost:8080/h2-console
3. **API Tools**: Postman, Insomnia, curl, etc.

## 📝 Request/Response Examples

### Create Community
```json
POST /api/communities
{
  "communityName": "Green Park Residents",
  "description": "Trusted services for Green Park residents",
  "city": "Dublin",
  "area": "Ranelagh"
}
```

### Create Service
```json
POST /api/services
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

### Tag Service to Community
```json
POST /api/community-services
{
  "communityId": 1,
  "serviceId": 1,
  "isFeatured": true,
  "displayOrder": 1
}
```

---

**Last Updated**: 2026-04-21
**Version**: 1.0.0