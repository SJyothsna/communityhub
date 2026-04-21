package com.communityhub.backend.repository;

import com.communityhub.backend.entity.ServiceRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRecommendationRepository extends JpaRepository<ServiceRecommendation, Long> {

    List<ServiceRecommendation> findByServiceIdAndCommunityId(Long serviceId, Long communityId);

    List<ServiceRecommendation> findByServiceId(Long serviceId);

    List<ServiceRecommendation> findByCommunityId(Long communityId);

    @Query("SELECT COUNT(sr) FROM ServiceRecommendation sr WHERE sr.serviceId = :serviceId AND sr.communityId = :communityId")
    Long countRecommendations(@Param("serviceId") Long serviceId, @Param("communityId") Long communityId);
}

// Made with Bob
