package com.communityhub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityServicesResponse {

    private Long communityId;
    private String communityName;
    private List<ServiceDetailDTO> services;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ServiceDetailDTO {
        private Long serviceId;
        private String serviceName;
        private String providerName;
        private String subcategoryName;
        private String categoryName;
        private String shortDescription;
        private String phoneNumber;
        private String whatsappNumber;
        private String email;
        private String serviceMode;
        private String priceInfo;
        private String areaServed;
        private Boolean isFeatured;
        private Long recommendationCount;
    }
}

// Made with Bob
