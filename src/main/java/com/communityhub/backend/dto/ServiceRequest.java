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
public class ServiceRequest {

    @NotNull(message = "Provider ID is required")
    private Long providerId;

    @NotNull(message = "Subcategory ID is required")
    private Long subcategoryId;

    @NotBlank(message = "Service name is required")
    @Size(max = 150, message = "Service name must not exceed 150 characters")
    private String serviceName;

    @Size(max = 300, message = "Short description must not exceed 300 characters")
    private String shortDescription;

    private String fullDescription;

    @Size(max = 50, message = "Service mode must not exceed 50 characters")
    private String serviceMode; // HOME_VISIT, AT_PROVIDER_LOCATION, ONLINE, MIXED

    @Size(max = 50, message = "Age group must not exceed 50 characters")
    private String ageGroup;

    @Size(max = 150, message = "Price info must not exceed 150 characters")
    private String priceInfo;

    @Size(max = 200, message = "Area served must not exceed 200 characters")
    private String areaServed;
}

// Made with Bob
