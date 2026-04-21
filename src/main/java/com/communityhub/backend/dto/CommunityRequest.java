package com.communityhub.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityRequest {

    @NotBlank(message = "Community name is required")
    @Size(max = 150, message = "Community name must not exceed 150 characters")
    private String communityName;

    private String description;

    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @Size(max = 100, message = "Area must not exceed 100 characters")
    private String area;
}

// Made with Bob
