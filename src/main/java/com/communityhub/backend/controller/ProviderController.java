package com.communityhub.backend.controller;

import com.communityhub.backend.dto.ProviderRequest;
import com.communityhub.backend.entity.Provider;
import com.communityhub.backend.repository.ProviderRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/providers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProviderController {

    private final ProviderRepository providerRepository;

    /**
     * Get all providers
     * GET /api/providers
     */
    @GetMapping
    public ResponseEntity<List<Provider>> getAllProviders() {
        List<Provider> providers = providerRepository.findAll();
        return ResponseEntity.ok(providers);
    }

    /**
     * Get provider by ID
     * GET /api/providers/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Provider> getProviderById(@PathVariable Long id) {
        return providerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get active providers
     * GET /api/providers/active
     */
    @GetMapping("/active")
    public ResponseEntity<List<Provider>> getActiveProviders() {
        List<Provider> providers = providerRepository.findByIsActiveTrue();
        return ResponseEntity.ok(providers);
    }

    /**
     * Get providers by city
     * GET /api/providers/city/{city}
     */
    @GetMapping("/city/{city}")
    public ResponseEntity<List<Provider>> getProvidersByCity(@PathVariable String city) {
        List<Provider> providers = providerRepository.findByCityAndIsActiveTrue(city);
        return ResponseEntity.ok(providers);
    }

    /**
     * Get providers by area
     * GET /api/providers/area/{area}
     */
    @GetMapping("/area/{area}")
    public ResponseEntity<List<Provider>> getProvidersByArea(@PathVariable String area) {
        List<Provider> providers = providerRepository.findByAreaAndIsActiveTrue(area);
        return ResponseEntity.ok(providers);
    }

    /**
     * Search providers by keyword
     * GET /api/providers/search?keyword={keyword}
     */
    @GetMapping("/search")
    public ResponseEntity<List<Provider>> searchProviders(@RequestParam String keyword) {
        List<Provider> providers = providerRepository.searchProviders(keyword);
        return ResponseEntity.ok(providers);
    }

    /**
     * Create a new provider
     * POST /api/providers
     */
    @PostMapping
    public ResponseEntity<Provider> createProvider(@Valid @RequestBody ProviderRequest request) {
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

        Provider savedProvider = providerRepository.save(provider);
        return new ResponseEntity<>(savedProvider, HttpStatus.CREATED);
    }

    /**
     * Update an existing provider
     * PUT /api/providers/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Provider> updateProvider(
            @PathVariable Long id,
            @Valid @RequestBody ProviderRequest request) {
        
        return providerRepository.findById(id)
                .map(provider -> {
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
                    Provider updatedProvider = providerRepository.save(provider);
                    return ResponseEntity.ok(updatedProvider);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a provider (soft delete by setting isActive to false)
     * DELETE /api/providers/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProvider(@PathVariable Long id) {
        return providerRepository.findById(id)
                .map(provider -> {
                    provider.setIsActive(false);
                    providerRepository.save(provider);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Permanently delete a provider
     * DELETE /api/providers/{id}/permanent
     */
    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<Void> permanentlyDeleteProvider(@PathVariable Long id) {
        if (providerRepository.existsById(id)) {
            providerRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

// Made with Bob