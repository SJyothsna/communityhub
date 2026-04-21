package com.communityhub.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProviderRequest {

    @NotBlank(message = "Provider name is required")
    @Size(max = 150, message = "Provider name must not exceed 150 characters")
    private String providerName;

    @Size(max = 150, message = "Contact person must not exceed 150 characters")
    private String contactPerson;

    @Size(max = 30, message = "Phone number must not exceed 30 characters")
    private String phoneNumber;

    @Email(message = "Email should be valid")
    @Size(max = 150, message = "Email must not exceed 150 characters")
    private String email;

    @Size(max = 30, message = "WhatsApp number must not exceed 30 characters")
    private String whatsappNumber;

    @Size(max = 200, message = "Address line 1 must not exceed 200 characters")
    private String addressLine1;

    @Size(max = 200, message = "Address line 2 must not exceed 200 characters")
    private String addressLine2;

    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @Size(max = 100, message = "Area must not exceed 100 characters")
    private String area;

    private String description;
}

// Made with Bob
