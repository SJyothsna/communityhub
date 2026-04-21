package com.communityhub.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "services")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_id")
    private Long serviceId;

    @Column(name = "provider_id", nullable = false)
    private Long providerId;

    @Column(name = "subcategory_id", nullable = false)
    private Long subcategoryId;

    @Column(name = "service_name", nullable = false, length = 150)
    private String serviceName;

    @Column(name = "short_description", length = 300)
    private String shortDescription;

    @Column(name = "full_description", columnDefinition = "TEXT")
    private String fullDescription;

    @Column(name = "service_mode", length = 50)
    private String serviceMode;

    @Column(name = "age_group", length = 50)
    private String ageGroup;

    @Column(name = "price_info", length = 150)
    private String priceInfo;

    @Column(name = "area_served", length = 200)
    private String areaServed;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}

// Made with Bob
