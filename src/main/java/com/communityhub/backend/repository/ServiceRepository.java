package com.communityhub.backend.repository;

import com.communityhub.backend.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {

    List<Service> findByIsActiveTrue();

    List<Service> findByProviderIdAndIsActiveTrue(Long providerId);

    List<Service> findBySubcategoryIdAndIsActiveTrue(Long subcategoryId);

    @Query("SELECT s FROM Service s WHERE s.isActive = true AND " +
            "LOWER(s.serviceName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Service> searchServices(@Param("keyword") String keyword);

    @Query("SELECT s FROM Service s WHERE s.isActive = true AND " +
            "s.subcategoryId = :subcategoryId AND " +
            "LOWER(s.serviceName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Service> searchServicesBySubcategory(@Param("subcategoryId") Long subcategoryId,
            @Param("keyword") String keyword);
}

// Made with Bob
