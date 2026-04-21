package com.communityhub.backend.repository;

import com.communityhub.backend.entity.CommunityService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityServiceRepository extends JpaRepository<CommunityService, Long> {

    List<CommunityService> findByCommunityIdAndIsActiveTrue(Long communityId);

    List<CommunityService> findByServiceIdAndIsActiveTrue(Long serviceId);

    Optional<CommunityService> findByCommunityIdAndServiceId(Long communityId, Long serviceId);

    List<CommunityService> findByCommunityIdAndIsFeaturedTrueAndIsActiveTrue(Long communityId);

    @Query("SELECT cs FROM CommunityService cs WHERE cs.communityId = :communityId AND cs.isActive = true " +
            "ORDER BY cs.displayOrder ASC, cs.createdAt DESC")
    List<CommunityService> findByCommunityIdOrderedByDisplay(@Param("communityId") Long communityId);

    void deleteByCommunityIdAndServiceId(Long communityId, Long serviceId);
}

// Made with Bob
