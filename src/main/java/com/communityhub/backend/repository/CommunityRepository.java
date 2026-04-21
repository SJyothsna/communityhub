package com.communityhub.backend.repository;

import com.communityhub.backend.entity.Community;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {

    List<Community> findByIsActiveTrue();

    List<Community> findByCityAndIsActiveTrue(String city);

    List<Community> findByAreaAndIsActiveTrue(String area);
}

// Made with Bob
