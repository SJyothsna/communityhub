package com.communityhub.backend.controller;

import com.communityhub.backend.entity.ServiceRecommendation;
import com.communityhub.backend.repository.CommunityRepository;
import com.communityhub.backend.repository.ServiceRecommendationRepository;
import com.communityhub.backend.repository.ServiceRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RecommendationController {

    private final ServiceRecommendationRepository recommendationRepository;
    private final ServiceRepository serviceRepository;
    private final CommunityRepository communityRepository;

    /**
     * Get all recommendations
     * GET /api/recommendations
     */
    @GetMapping("/recommendations")
    public ResponseEntity<List<ServiceRecommendation>> getAllRecommendations() {
        List<ServiceRecommendation> recommendations = recommendationRepository.findAll();
        return ResponseEntity.ok(recommendations);
    }

    /**
     * Get recommendation by ID
     * GET /api/recommendations/{id}
     */
    @GetMapping("/recommendations/{id}")
    public ResponseEntity<ServiceRecommendation> getRecommendationById(@PathVariable Long id) {
        return recommendationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get recommendations by service ID
     * GET /api/services/{serviceId}/recommendations
     */
    @GetMapping("/services/{serviceId}/recommendations")
    public ResponseEntity<List<ServiceRecommendation>> getRecommendationsByService(@PathVariable Long serviceId) {
        // Verify service exists
        if (!serviceRepository.existsById(serviceId)) {
            return ResponseEntity.notFound().build();
        }
        
        List<ServiceRecommendation> recommendations = recommendationRepository.findByServiceId(serviceId);
        return ResponseEntity.ok(recommendations);
    }

    /**
     * Get recommendations by community ID
     * GET /api/communities/{communityId}/recommendations
     */
    @GetMapping("/communities/{communityId}/recommendations")
    public ResponseEntity<List<ServiceRecommendation>> getRecommendationsByCommunity(@PathVariable Long communityId) {
        // Verify community exists
        if (!communityRepository.existsById(communityId)) {
            return ResponseEntity.notFound().build();
        }
        
        List<ServiceRecommendation> recommendations = recommendationRepository.findByCommunityId(communityId);
        return ResponseEntity.ok(recommendations);
    }

    /**
     * Get recommendations by service and community
     * GET /api/services/{serviceId}/communities/{communityId}/recommendations
     */
    @GetMapping("/services/{serviceId}/communities/{communityId}/recommendations")
    public ResponseEntity<List<ServiceRecommendation>> getRecommendationsByServiceAndCommunity(
            @PathVariable Long serviceId,
            @PathVariable Long communityId) {
        
        // Verify service and community exist
        if (!serviceRepository.existsById(serviceId) || !communityRepository.existsById(communityId)) {
            return ResponseEntity.notFound().build();
        }
        
        List<ServiceRecommendation> recommendations = 
                recommendationRepository.findByServiceIdAndCommunityId(serviceId, communityId);
        return ResponseEntity.ok(recommendations);
    }

    /**
     * Get recommendation count for a service in a community
     * GET /api/services/{serviceId}/communities/{communityId}/recommendations/count
     */
    @GetMapping("/services/{serviceId}/communities/{communityId}/recommendations/count")
    public ResponseEntity<Map<String, Long>> getRecommendationCount(
            @PathVariable Long serviceId,
            @PathVariable Long communityId) {
        
        // Verify service and community exist
        if (!serviceRepository.existsById(serviceId) || !communityRepository.existsById(communityId)) {
            return ResponseEntity.notFound().build();
        }
        
        Long count = recommendationRepository.countRecommendations(serviceId, communityId);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

    /**
     * Get recommendation count for a service (across all communities)
     * GET /api/services/{serviceId}/recommendations/count
     */
    @GetMapping("/services/{serviceId}/recommendations/count")
    public ResponseEntity<Map<String, Long>> getRecommendationCountForService(@PathVariable Long serviceId) {
        // Verify service exists
        if (!serviceRepository.existsById(serviceId)) {
            return ResponseEntity.notFound().build();
        }
        
        List<ServiceRecommendation> recommendations = recommendationRepository.findByServiceId(serviceId);
        Map<String, Long> response = new HashMap<>();
        response.put("count", (long) recommendations.size());
        return ResponseEntity.ok(response);
    }

    /**
     * Create a new recommendation
     * POST /api/recommendations
     */
    @PostMapping("/recommendations")
    public ResponseEntity<ServiceRecommendation> createRecommendation(
            @Valid @RequestBody ServiceRecommendation recommendation) {
        
        // Verify service exists
        if (!serviceRepository.existsById(recommendation.getServiceId())) {
            return ResponseEntity.badRequest().build();
        }
        
        // Verify community exists
        if (!communityRepository.existsById(recommendation.getCommunityId())) {
            return ResponseEntity.badRequest().build();
        }
        
        // Set default status if not provided
        if (recommendation.getStatus() == null || recommendation.getStatus().isEmpty()) {
            recommendation.setStatus("APPROVED");
        }
        
        ServiceRecommendation savedRecommendation = recommendationRepository.save(recommendation);
        return new ResponseEntity<>(savedRecommendation, HttpStatus.CREATED);
    }

    /**
     * Update an existing recommendation
     * PUT /api/recommendations/{id}
     */
    @PutMapping("/recommendations/{id}")
    public ResponseEntity<ServiceRecommendation> updateRecommendation(
            @PathVariable Long id,
            @Valid @RequestBody ServiceRecommendation recommendationRequest) {
        
        // Verify service exists
        if (!serviceRepository.existsById(recommendationRequest.getServiceId())) {
            return ResponseEntity.badRequest().build();
        }
        
        // Verify community exists
        if (!communityRepository.existsById(recommendationRequest.getCommunityId())) {
            return ResponseEntity.badRequest().build();
        }
        
        return recommendationRepository.findById(id)
                .map(recommendation -> {
                    recommendation.setServiceId(recommendationRequest.getServiceId());
                    recommendation.setCommunityId(recommendationRequest.getCommunityId());
                    recommendation.setRecommenderName(recommendationRequest.getRecommenderName());
                    recommendation.setRecommenderNote(recommendationRequest.getRecommenderNote());
                    recommendation.setStatus(recommendationRequest.getStatus());
                    ServiceRecommendation updatedRecommendation = recommendationRepository.save(recommendation);
                    return ResponseEntity.ok(updatedRecommendation);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a recommendation
     * DELETE /api/recommendations/{id}
     */
    @DeleteMapping("/recommendations/{id}")
    public ResponseEntity<Void> deleteRecommendation(@PathVariable Long id) {
        if (recommendationRepository.existsById(id)) {
            recommendationRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Update recommendation status
     * PATCH /api/recommendations/{id}/status
     */
    @PatchMapping("/recommendations/{id}/status")
    public ResponseEntity<ServiceRecommendation> updateRecommendationStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        
        return recommendationRepository.findById(id)
                .map(recommendation -> {
                    recommendation.setStatus(status);
                    ServiceRecommendation updatedRecommendation = recommendationRepository.save(recommendation);
                    return ResponseEntity.ok(updatedRecommendation);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

// Made with Bob