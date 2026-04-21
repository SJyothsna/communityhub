package com.communityhub.backend.controller;

import com.communityhub.backend.dto.CommunityServiceRequest;
import com.communityhub.backend.dto.CommunityServicesResponse;
import com.communityhub.backend.entity.CommunityService;
import com.communityhub.backend.service.CommunityServiceService;
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
public class CommunityServiceController {

    private final CommunityServiceService communityServiceService;

    /**
     * Tag a service to a community
     * POST /api/community-services
     */
    @PostMapping("/community-services")
    public ResponseEntity<CommunityService> tagServiceToCommunity(
            @Valid @RequestBody CommunityServiceRequest request) {
        CommunityService communityService = communityServiceService.tagServiceToCommunity(request);
        return new ResponseEntity<>(communityService, HttpStatus.CREATED);
    }

    /**
     * Get all services for a community (MOST IMPORTANT API)
     * GET /api/communities/{communityId}/services
     * Optional query params: categoryId, subcategoryId, keyword
     */
    @GetMapping("/communities/{communityId}/services")
    public ResponseEntity<CommunityServicesResponse> getServicesForCommunity(
            @PathVariable Long communityId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long subcategoryId,
            @RequestParam(required = false) String keyword) {
        CommunityServicesResponse response = communityServiceService
                .getServicesForCommunity(communityId, categoryId, subcategoryId, keyword);
        return ResponseEntity.ok(response);
    }

    /**
     * Remove a service from a community
     * DELETE /api/communities/{communityId}/services/{serviceId}
     */
    @DeleteMapping("/communities/{communityId}/services/{serviceId}")
    public ResponseEntity<Void> removeServiceFromCommunity(
            @PathVariable Long communityId,
            @PathVariable Long serviceId) {
        communityServiceService.removeServiceFromCommunity(communityId, serviceId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all communities where a service is available
     * GET /api/services/{serviceId}/communities
     */
    @GetMapping("/services/{serviceId}/communities")
    public ResponseEntity<List<CommunityService>> getCommunitiesForService(
            @PathVariable Long serviceId) {
        List<CommunityService> communities = communityServiceService.getCommunitiesForService(serviceId);
        return ResponseEntity.ok(communities);
    }
}

// Made with Bob
