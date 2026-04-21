package com.communityhub.backend.repository;

import com.communityhub.backend.entity.Subcategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubcategoryRepository extends JpaRepository<Subcategory, Long> {

    List<Subcategory> findByCategoryIdAndIsActiveTrue(Long categoryId);

    List<Subcategory> findByIsActiveTrue();
}

// Made with Bob
