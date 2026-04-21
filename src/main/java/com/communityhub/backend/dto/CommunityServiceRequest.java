package com.communityhub.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityServiceRequest {

    @NotNull(message = "Community ID is required")
    private Long communityId;

    @NotNull(message = "Service ID is required")
    private Long serviceId;

    private Boolean isFeatured = false;

    private Integer displayOrder = 0;

    private String addedBy;
}

// Made with Bob
