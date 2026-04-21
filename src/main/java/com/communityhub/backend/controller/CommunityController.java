package com.communityhub.backend.controller;

import com.communityhub.backend.dto.CommunityRequest;
import com.communityhub.backend.entity.Community;
import com.communityhub.backend.repository.CommunityRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/communities")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CommunityController {

    private final CommunityRepository communityRepository;

    /**
     * Get all communities
     * GET /api/communities
     */
    @GetMapping
    public ResponseEntity<List<Community>> getAllCommunities() {
        List<Community> communities = communityRepository.findAll();
        return ResponseEntity.ok(communities);
    }

    /**
     * Get community by ID
     * GET /api/communities/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Community> getCommunityById(@PathVariable Long id) {
        return communityRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get active communities
     * GET /api/communities/active
     */
    @GetMapping("/active")
    public ResponseEntity<List<Community>> getActiveCommunities() {
        List<Community> communities = communityRepository.findByIsActiveTrue();
        return ResponseEntity.ok(communities);
    }

    /**
     * Get communities by city
     * GET /api/communities/city/{city}
     */
    @GetMapping("/city/{city}")
    public ResponseEntity<List<Community>> getCommunitiesByCity(@PathVariable String city) {
        List<Community> communities = communityRepository.findByCityAndIsActiveTrue(city);
        return ResponseEntity.ok(communities);
    }

    /**
     * Get communities by area
     * GET /api/communities/area/{area}
     */
    @GetMapping("/area/{area}")
    public ResponseEntity<List<Community>> getCommunitiesByArea(@PathVariable String area) {
        List<Community> communities = communityRepository.findByAreaAndIsActiveTrue(area);
        return ResponseEntity.ok(communities);
    }

    /**
     * Create a new community
     * POST /api/communities
     */
    @PostMapping
    public ResponseEntity<Community> createCommunity(@Valid @RequestBody CommunityRequest request) {
        Community community = new Community();
        community.setCommunityName(request.getCommunityName());
        community.setDescription(request.getDescription());
        community.setCity(request.getCity());
        community.setArea(request.getArea());
        community.setIsActive(true);

        Community savedCommunity = communityRepository.save(community);
        return new ResponseEntity<>(savedCommunity, HttpStatus.CREATED);
    }

    /**
     * Update an existing community
     * PUT /api/communities/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Community> updateCommunity(
            @PathVariable Long id,
            @Valid @RequestBody CommunityRequest request) {
        
        return communityRepository.findById(id)
                .map(community -> {
                    community.setCommunityName(request.getCommunityName());
                    community.setDescription(request.getDescription());
                    community.setCity(request.getCity());
                    community.setArea(request.getArea());
                    Community updatedCommunity = communityRepository.save(community);
                    return ResponseEntity.ok(updatedCommunity);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a community (soft delete by setting isActive to false)
     * DELETE /api/communities/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommunity(@PathVariable Long id) {
        return communityRepository.findById(id)
                .map(community -> {
                    community.setIsActive(false);
                    communityRepository.save(community);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Permanently delete a community
     * DELETE /api/communities/{id}/permanent
     */
    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<Void> permanentlyDeleteCommunity(@PathVariable Long id) {
        if (communityRepository.existsById(id)) {
            communityRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

// Made with Bob