package com.communityhub.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "service_recommendations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recommendation_id")
    private Long recommendationId;

    @Column(name = "service_id", nullable = false)
    private Long serviceId;

    @Column(name = "community_id", nullable = false)
    private Long communityId;

    @Column(name = "recommender_name", length = 150)
    private String recommenderName;

    @Column(name = "recommender_note", length = 500)
    private String recommenderNote;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "APPROVED";

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}

// Made with Bob
