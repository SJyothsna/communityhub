package com.communityhub.backend.controller;

import com.communityhub.backend.dto.ServiceRequest;
import com.communityhub.backend.entity.Service;
import com.communityhub.backend.repository.ProviderRepository;
import com.communityhub.backend.repository.ServiceRepository;
import com.communityhub.backend.repository.SubcategoryRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ServiceController {

    private final ServiceRepository serviceRepository;
    private final ProviderRepository providerRepository;
    private final SubcategoryRepository subcategoryRepository;

    /**
     * Get all services
     * GET /api/services
     */
    @GetMapping("/services")
    public ResponseEntity<List<Service>> getAllServices() {
        List<Service> services = serviceRepository.findAll();
        return ResponseEntity.ok(services);
    }

    /**
     * Get service by ID
     * GET /api/services/{id}
     */
    @GetMapping("/services/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable Long id) {
        return serviceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get active services
     * GET /api/services/active
     */
    @GetMapping("/services/active")
    public ResponseEntity<List<Service>> getActiveServices() {
        List<Service> services = serviceRepository.findByIsActiveTrue();
        return ResponseEntity.ok(services);
    }

    /**
     * Get services by provider ID
     * GET /api/providers/{providerId}/services
     */
    @GetMapping("/providers/{providerId}/services")
    public ResponseEntity<List<Service>> getServicesByProvider(@PathVariable Long providerId) {
        // Verify provider exists
        if (!providerRepository.existsById(providerId)) {
            return ResponseEntity.notFound().build();
        }
        
        List<Service> services = serviceRepository.findByProviderIdAndIsActiveTrue(providerId);
        return ResponseEntity.ok(services);
    }

    /**
     * Get services by subcategory ID
     * GET /api/subcategories/{subcategoryId}/services
     */
    @GetMapping("/subcategories/{subcategoryId}/services")
    public ResponseEntity<List<Service>> getServicesBySubcategory(@PathVariable Long subcategoryId) {
        // Verify subcategory exists
        if (!subcategoryRepository.existsById(subcategoryId)) {
            return ResponseEntity.notFound().build();
        }
        
        List<Service> services = serviceRepository.findBySubcategoryIdAndIsActiveTrue(subcategoryId);
        return ResponseEntity.ok(services);
    }

    /**
     * Search services by keyword
     * GET /api/services/search?keyword={keyword}
     */
    @GetMapping("/services/search")
    public ResponseEntity<List<Service>> searchServices(@RequestParam String keyword) {
        List<Service> services = serviceRepository.searchServices(keyword);
        return ResponseEntity.ok(services);
    }

    /**
     * Search services by subcategory and keyword
     * GET /api/services/search?subcategoryId={subcategoryId}&keyword={keyword}
     */
    @GetMapping("/services/search/subcategory")
    public ResponseEntity<List<Service>> searchServicesBySubcategory(
            @RequestParam Long subcategoryId,
            @RequestParam String keyword) {
        List<Service> services = serviceRepository.searchServicesBySubcategory(subcategoryId, keyword);
        return ResponseEntity.ok(services);
    }

    /**
     * Create a new service
     * POST /api/services
     */
    @PostMapping("/services")
    public ResponseEntity<Service> createService(@Valid @RequestBody ServiceRequest request) {
        // Verify provider exists
        if (!providerRepository.existsById(request.getProviderId())) {
            return ResponseEntity.badRequest().build();
        }
        
        // Verify subcategory exists
        if (!subcategoryRepository.existsById(request.getSubcategoryId())) {
            return ResponseEntity.badRequest().build();
        }
        
        Service service = new Service();
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

        Service savedService = serviceRepository.save(service);
        return new ResponseEntity<>(savedService, HttpStatus.CREATED);
    }

    /**
     * Update an existing service
     * PUT /api/services/{id}
     */
    @PutMapping("/services/{id}")
    public ResponseEntity<Service> updateService(
            @PathVariable Long id,
            @Valid @RequestBody ServiceRequest request) {
        
        // Verify provider exists
        if (!providerRepository.existsById(request.getProviderId())) {
            return ResponseEntity.badRequest().build();
        }
        
        // Verify subcategory exists
        if (!subcategoryRepository.existsById(request.getSubcategoryId())) {
            return ResponseEntity.badRequest().build();
        }
        
        return serviceRepository.findById(id)
                .map(service -> {
                    service.setProviderId(request.getProviderId());
                    service.setSubcategoryId(request.getSubcategoryId());
                    service.setServiceName(request.getServiceName());
                    service.setShortDescription(request.getShortDescription());
                    service.setFullDescription(request.getFullDescription());
                    service.setServiceMode(request.getServiceMode());
                    service.setAgeGroup(request.getAgeGroup());
                    service.setPriceInfo(request.getPriceInfo());
                    service.setAreaServed(request.getAreaServed());
                    Service updatedService = serviceRepository.save(service);
                    return ResponseEntity.ok(updatedService);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a service (soft delete by setting isActive to false)
     * DELETE /api/services/{id}
     */
    @DeleteMapping("/services/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        return serviceRepository.findById(id)
                .map(service -> {
                    service.setIsActive(false);
                    serviceRepository.save(service);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Permanently delete a service
     * DELETE /api/services/{id}/permanent
     */
    @DeleteMapping("/services/{id}/permanent")
    public ResponseEntity<Void> permanentlyDeleteService(@PathVariable Long id) {
        if (serviceRepository.existsById(id)) {
            serviceRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

// Made with Bob