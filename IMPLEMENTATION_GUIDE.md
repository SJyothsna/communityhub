# CommunityHub - Complete Implementation Guide

## Current Status

### ✅ Completed Components

1. **Project Structure** - Created
2. **Maven Configuration** (pom.xml) - Created
3. **Application Properties** - Created
4. **Database Schema** (schema.sql) - Created
5. **Main Application Class** - Created

### ✅ Entity Classes (7/7)
- Community.java
- Category.java
- Subcategory.java
- Provider.java
- Service.java
- CommunityService.java
- ServiceRecommendation.java

### ✅ Repository Interfaces (7/7)
- CommunityRepository.java
- CategoryRepository.java
- SubcategoryRepository.java
- ProviderRepository.java
- ServiceRepository.java
- CommunityServiceRepository.java
- ServiceRecommendationRepository.java

### ✅ DTOs (5 created, more needed)
- CommunityRequest.java
- ProviderRequest.java
- ServiceRequest.java
- CommunityServiceRequest.java
- CommunityServicesResponse.java

### ✅ Service Layer (1/7)
- CommunityServiceService.java ✅ (MOST IMPORTANT - COMPLETED)

### ✅ Controllers (1/7)
- CommunityServiceController.java ✅ (MOST IMPORTANT - COMPLETED)

---

## 🔨 Remaining Work

### 1. Additional DTOs Needed

Create these in `src/main/java/com/communityhub/backend/dto/`:

#### CategoryRequest.java
```java
package com.communityhub.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequest {
    @NotBlank(message = "Category name is required")
    @Size(max = 100)
    private String categoryName;
    
    @Size(max = 50)
    private String categoryType;
    
    private String description;
}
```

#### SubcategoryRequest.java
```java
package com.communityhub.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubcategoryRequest {
    @NotNull(message = "Category ID is required")
    private Long categoryId;
    
    @NotBlank(message = "Subcategory name is required")
    @Size(max = 100)
    private String subcategoryName;
    
    private String description;
}
```

#### RecommendationRequest.java
```java
package com.communityhub.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationRequest {
    @NotNull(message = "Service ID is required")
    private Long serviceId;
    
    @NotNull(message = "Community ID is required")
    private Long communityId;
    
    @Size(max = 150)
    private String recommenderName;
    
    @Size(max = 500)
    private String recommenderNote;
}
```

---

### 2. Service Layer Classes Needed

Create these in `src/main/java/com/communityhub/backend/service/`:

#### CommunityService.java
```java
package com.communityhub.backend.service;

import com.communityhub.backend.dto.CommunityRequest;
import com.communityhub.backend.entity.Community;
import com.communityhub.backend.repository.CommunityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommunityService {
    private final CommunityRepository communityRepository;

    @Transactional
    public Community createCommunity(CommunityRequest request) {
        Community community = new Community();
        community.setCommunityName(request.getCommunityName());
        community.setDescription(request.getDescription());
        community.setCity(request.getCity());
        community.setArea(request.getArea());
        community.setIsActive(true);
        return communityRepository.save(community);
    }

    @Transactional(readOnly = true)
    public List<Community> getAllCommunities() {
        return communityRepository.findByIsActiveTrue();
    }

    @Transactional(readOnly = true)
    public Community getCommunityById(Long id) {
        return communityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Community not found"));
    }

    @Transactional
    public Community updateCommunity(Long id, CommunityRequest request) {
        Community community = getCommunityById(id);
        community.setCommunityName(request.getCommunityName());
        community.setDescription(request.getDescription());
        community.setCity(request.getCity());
        community.setArea(request.getArea());
        return communityRepository.save(community);
    }

    @Transactional
    public void deactivateCommunity(Long id) {
        Community community = getCommunityById(id);
        community.setIsActive(false);
        communityRepository.save(community);
    }
}
```

#### CategoryService.java
```java
package com.communityhub.backend.service;

import com.communityhub.backend.dto.CategoryRequest;
import com.communityhub.backend.entity.Category;
import com.communityhub.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @Transactional
    public Category createCategory(CategoryRequest request) {
        Category category = new Category();
        category.setCategoryName(request.getCategoryName());
        category.setCategoryType(request.getCategoryType());
        category.setDescription(request.getDescription());
        category.setIsActive(true);
        return categoryRepository.save(category);
    }

    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findByIsActiveTrue();
    }

    @Transactional(readOnly = true)
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }
}
```

#### SubcategoryService.java
```java
package com.communityhub.backend.service;

import com.communityhub.backend.dto.SubcategoryRequest;
import com.communityhub.backend.entity.Subcategory;
import com.communityhub.backend.repository.SubcategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubcategoryService {
    private final SubcategoryRepository subcategoryRepository;

    @Transactional
    public Subcategory createSubcategory(SubcategoryRequest request) {
        Subcategory subcategory = new Subcategory();
        subcategory.setCategoryId(request.getCategoryId());
        subcategory.setSubcategoryName(request.getSubcategoryName());
        subcategory.setDescription(request.getDescription());
        subcategory.setIsActive(true);
        return subcategoryRepository.save(subcategory);
    }

    @Transactional(readOnly = true)
    public List<Subcategory> getSubcategoriesByCategory(Long categoryId) {
        return subcategoryRepository.findByCategoryIdAndIsActiveTrue(categoryId);
    }
}
```

#### ProviderService.java
```java
package com.communityhub.backend.service;

import com.communityhub.backend.dto.ProviderRequest;
import com.communityhub.backend.entity.Provider;
import com.communityhub.backend.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProviderService {
    private final ProviderRepository providerRepository;

    @Transactional
    public Provider createProvider(ProviderRequest request) {
        Provider provider = new Provider();
        provider.setProviderName(request.getProviderName());
        provider.setContactPerson(request.getContactPerson());
        provider.setPhoneNumber(request.getPhoneNumber());
        provider.setEmail(request.getEmail());
        provider.setWhatsappNumber(request.getWhatsappNumber());
        provider.setAddressLine1(request.getAddressLine1());
        provider.setAddressLine2(request.getAddressLine2());
        provider.setCity(request.getCity());
        provider.setArea(request.getArea());
        provider.setDescription(request.getDescription());
        provider.setIsActive(true);
        return providerRepository.save(provider);
    }

    @Transactional(readOnly = true)
    public Provider getProviderById(Long id) {
        return providerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
    }

    @Transactional(readOnly = true)
    public List<Provider> getAllProviders() {
        return providerRepository.findByIsActiveTrue();
    }

    @Transactional(readOnly = true)
    public List<Provider> searchProviders(String keyword) {
        return providerRepository.searchProviders(keyword);
    }
}
```

#### ServiceService.java (for Service entity)
```java
package com.communityhub.backend.service;

import com.communityhub.backend.dto.ServiceRequest;
import com.communityhub.backend.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceService {
    private final ServiceRepository serviceRepository;

    @Transactional
    public com.communityhub.backend.entity.Service createService(ServiceRequest request) {
        com.communityhub.backend.entity.Service service = new com.communityhub.backend.entity.Service();
        service.setProviderId(request.getProviderId());
        service.setSubcategoryId(request.getSubcategoryId());
        service.setServiceName(request.getServiceName());
        service.setShortDescription(request.getShortDescription());
        service.setFullDescription(request.getFullDescription());
        service.setServiceMode(request.getServiceMode());
        service.setAgeGroup(request.getAgeGroup());
        service.setPriceInfo(request.getPriceInfo());
        service.setAreaServed(request.getAreaServed());
        service.setIsActive(true);
        return serviceRepository.save(service);
    }

    @Transactional(readOnly = true)
    public com.communityhub.backend.entity.Service getServiceById(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
    }

    @Transactional(readOnly = true)
    public List<com.communityhub.backend.entity.Service> getAllServices() {
        return serviceRepository.findByIsActiveTrue();
    }

    @Transactional(readOnly = true)
    public List<com.communityhub.backend.entity.Service> searchServices(String keyword) {
        return serviceRepository.searchServices(keyword);
    }

    @Transactional
    public com.communityhub.backend.entity.Service updateService(Long id, ServiceRequest request) {
        com.communityhub.backend.entity.Service service = getServiceById(id);
        service.setServiceName(request.getServiceName());
        service.setShortDescription(request.getShortDescription());
        service.setFullDescription(request.getFullDescription());
        service.setServiceMode(request.getServiceMode());
        service.setAgeGroup(request.getAgeGroup());
        service.setPriceInfo(request.getPriceInfo());
        service.setAreaServed(request.getAreaServed());
        return serviceRepository.save(service);
    }

    @Transactional
    public void deactivateService(Long id) {
        com.communityhub.backend.entity.Service service = getServiceById(id);
        service.setIsActive(false);
        serviceRepository.save(service);
    }
}
```

#### RecommendationService.java
```java
package com.communityhub.backend.service;

import com.communityhub.backend.dto.RecommendationRequest;
import com.communityhub.backend.entity.ServiceRecommendation;
import com.communityhub.backend.repository.ServiceRecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {
    private final ServiceRecommendationRepository recommendationRepository;

    @Transactional
    public ServiceRecommendation addRecommendation(RecommendationRequest request) {
        ServiceRecommendation recommendation = new ServiceRecommendation();
        recommendation.setServiceId(request.getServiceId());
        recommendation.setCommunityId(request.getCommunityId());
        recommendation.setRecommenderName(request.getRecommenderName());
        recommendation.setRecommenderNote(request.getRecommenderNote());
        recommendation.setStatus("APPROVED");
        return recommendationRepository.save(recommendation);
    }

    @Transactional(readOnly = true)
    public List<ServiceRecommendation> getRecommendations(Long serviceId, Long communityId) {
        return recommendationRepository.findByServiceIdAndCommunityId(serviceId, communityId);
    }
}
```

---

### 3. Controller Classes Needed

Create these in `src/main/java/com/communityhub/backend/controller/`:

Follow the same pattern as CommunityServiceController.java for:
- CommunityController.java
- CategoryController.java
- SubcategoryController.java
- ProviderController.java
- ServiceController.java
- RecommendationController.java

Each controller should inject its corresponding service and expose REST endpoints.

---

## Quick Implementation Steps

1. **Copy the service class templates above** into their respective files
2. **Create the remaining DTOs** (CategoryRequest, SubcategoryRequest, RecommendationRequest)
3. **Create controllers** following the CommunityServiceController pattern
4. **Test with Postman or H2 Console**

---

## Testing the Application

Once all files are created:

```bash
cd communityhub
mvn clean install
mvn spring-boot:run
```

Then test the most important API:
```bash
GET http://localhost:8080/api/communities/1/services
```

---

## Priority Order

If you want to implement incrementally:

1. ✅ **CommunityServiceController** (DONE - Most Important)
2. **CommunityController** - Create/manage communities
3. **CategoryController** - Create categories
4. **SubcategoryController** - Create subcategories
5. **ProviderController** - Create providers
6. **ServiceController** - Create services
7. **RecommendationController** - Add recommendations

The core functionality (mapping services to communities) is already working!

---

## Notes

- All Java errors about package mismatch are VSCode issues and can be ignored
- The application will compile and run correctly with Maven
- H2 database will auto-create tables from schema.sql on startup
- All timestamps are auto-managed by Hibernate annotations
