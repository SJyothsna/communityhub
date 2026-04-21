package com.communityhub.backend.repository;

import com.communityhub.backend.entity.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProviderRepository extends JpaRepository<Provider, Long> {

    List<Provider> findByIsActiveTrue();

    List<Provider> findByCityAndIsActiveTrue(String city);

    List<Provider> findByAreaAndIsActiveTrue(String area);

    @Query("SELECT p FROM Provider p WHERE p.isActive = true AND " +
            "(LOWER(p.providerName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.contactPerson) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Provider> searchProviders(@Param("keyword") String keyword);
}

// Made with Bob
