package com.communityhub.backend.service;

import com.communityhub.backend.dto.CommunityServiceRequest;
import com.communityhub.backend.dto.CommunityServicesResponse;
import com.communityhub.backend.dto.CommunityServicesResponse.ServiceDetailDTO;
import com.communityhub.backend.entity.*;
import com.communityhub.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommunityServiceService {

    private final CommunityServiceRepository communityServiceRepository;
    private final CommunityRepository communityRepository;
    private final ServiceRepository serviceRepository;
    private final ProviderRepository providerRepository;
    private final SubcategoryRepository subcategoryRepository;
    private final CategoryRepository categoryRepository;
    private final ServiceRecommendationRepository recommendationRepository;

    @Transactional
    public CommunityService tagServiceToCommunity(CommunityServiceRequest request) {
        // Check if mapping already exists
        Optional<CommunityService> existing = communityServiceRepository
                .findByCommunityIdAndServiceId(request.getCommunityId(), request.getServiceId());

        if (existing.isPresent()) {
            throw new RuntimeException("Service already tagged to this community");
        }

        CommunityService communityService = new CommunityService();
        communityService.setCommunityId(request.getCommunityId());
        communityService.setServiceId(request.getServiceId());
        communityService.setIsFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false);
        communityService.setDisplayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0);
        communityService.setIsActive(true);
        communityService.setAddedBy(request.getAddedBy());

        return communityServiceRepository.save(communityService);
    }

    @Transactional(readOnly = true)
    public CommunityServicesResponse getServicesForCommunity(Long communityId, Long categoryId,
            Long subcategoryId, String keyword) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new RuntimeException("Community not found"));

        List<CommunityService> communityServices = communityServiceRepository
                .findByCommunityIdOrderedByDisplay(communityId);

        List<ServiceDetailDTO> serviceDetails = new ArrayList<>();

        for (CommunityService cs : communityServices) {
            com.communityhub.backend.entity.Service service = serviceRepository.findById(cs.getServiceId())
                    .orElse(null);

            if (service == null || !service.getIsActive()) {
                continue;
            }

            // Apply filters
            if (subcategoryId != null && !service.getSubcategoryId().equals(subcategoryId)) {
                continue;
            }

            Subcategory subcategory = subcategoryRepository.findById(service.getSubcategoryId())
                    .orElse(null);

            if (subcategory == null) {
                continue;
            }

            if (categoryId != null && !subcategory.getCategoryId().equals(categoryId)) {
                continue;
            }

            if (keyword != null && !keyword.isEmpty()) {
                if (!service.getServiceName().toLowerCase().contains(keyword.toLowerCase())) {
                    continue;
                }
            }

            Category category = categoryRepository.findById(subcategory.getCategoryId())
                    .orElse(null);

            Provider provider = providerRepository.findById(service.getProviderId())
                    .orElse(null);

            if (provider == null || category == null) {
                continue;
            }

            Long recommendationCount = recommendationRepository
                    .countRecommendations(service.getServiceId(), communityId);

            ServiceDetailDTO detail = new ServiceDetailDTO();
            detail.setServiceId(service.getServiceId());
            detail.setServiceName(service.getServiceName());
            detail.setProviderName(provider.getProviderName());
            detail.setSubcategoryName(subcategory.getSubcategoryName());
            detail.setCategoryName(category.getCategoryName());
            detail.setShortDescription(service.getShortDescription());
            detail.setPhoneNumber(provider.getPhoneNumber());
            detail.setWhatsappNumber(provider.getWhatsappNumber());
            detail.setEmail(provider.getEmail());
            detail.setServiceMode(service.getServiceMode());
            detail.setPriceInfo(service.getPriceInfo());
            detail.setAreaServed(service.getAreaServed());
            detail.setIsFeatured(cs.getIsFeatured());
            detail.setRecommendationCount(recommendationCount);

            serviceDetails.add(detail);
        }

        CommunityServicesResponse response = new CommunityServicesResponse();
        response.setCommunityId(community.getCommunityId());
        response.setCommunityName(community.getCommunityName());
        response.setServices(serviceDetails);

        return response;
    }

    @Transactional
    public void removeServiceFromCommunity(Long communityId, Long serviceId) {
        communityServiceRepository.deleteByCommunityIdAndServiceId(communityId, serviceId);
    }

    @Transactional(readOnly = true)
    public List<CommunityService> getCommunitiesForService(Long serviceId) {
        return communityServiceRepository.findByServiceIdAndIsActiveTrue(serviceId);
    }
}

// Made with Bob
