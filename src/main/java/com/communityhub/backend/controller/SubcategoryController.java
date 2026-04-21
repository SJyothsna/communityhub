package com.communityhub.backend.controller;

import com.communityhub.backend.entity.Subcategory;
import com.communityhub.backend.repository.CategoryRepository;
import com.communityhub.backend.repository.SubcategoryRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SubcategoryController {

    private final SubcategoryRepository subcategoryRepository;
    private final CategoryRepository categoryRepository;

    /**
     * Get all subcategories
     * GET /api/subcategories
     */
    @GetMapping("/subcategories")
    public ResponseEntity<List<Subcategory>> getAllSubcategories() {
        List<Subcategory> subcategories = subcategoryRepository.findAll();
        return ResponseEntity.ok(subcategories);
    }

    /**
     * Get subcategory by ID
     * GET /api/subcategories/{id}
     */
    @GetMapping("/subcategories/{id}")
    public ResponseEntity<Subcategory> getSubcategoryById(@PathVariable Long id) {
        return subcategoryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get active subcategories
     * GET /api/subcategories/active
     */
    @GetMapping("/subcategories/active")
    public ResponseEntity<List<Subcategory>> getActiveSubcategories() {
        List<Subcategory> subcategories = subcategoryRepository.findByIsActiveTrue();
        return ResponseEntity.ok(subcategories);
    }

    /**
     * Get subcategories by category ID
     * GET /api/categories/{categoryId}/subcategories
     */
    @GetMapping("/categories/{categoryId}/subcategories")
    public ResponseEntity<List<Subcategory>> getSubcategoriesByCategory(@PathVariable Long categoryId) {
        // Verify category exists
        if (!categoryRepository.existsById(categoryId)) {
            return ResponseEntity.notFound().build();
        }
        
        List<Subcategory> subcategories = subcategoryRepository.findByCategoryIdAndIsActiveTrue(categoryId);
        return ResponseEntity.ok(subcategories);
    }

    /**
     * Create a new subcategory
     * POST /api/subcategories
     */
    @PostMapping("/subcategories")
    public ResponseEntity<Subcategory> createSubcategory(@Valid @RequestBody Subcategory subcategory) {
        // Verify category exists
        if (!categoryRepository.existsById(subcategory.getCategoryId())) {
            return ResponseEntity.badRequest().build();
        }
        
        subcategory.setIsActive(true);
        Subcategory savedSubcategory = subcategoryRepository.save(subcategory);
        return new ResponseEntity<>(savedSubcategory, HttpStatus.CREATED);
    }

    /**
     * Update an existing subcategory
     * PUT /api/subcategories/{id}
     */
    @PutMapping("/subcategories/{id}")
    public ResponseEntity<Subcategory> updateSubcategory(
            @PathVariable Long id,
            @Valid @RequestBody Subcategory subcategoryRequest) {
        
        // Verify category exists
        if (!categoryRepository.existsById(subcategoryRequest.getCategoryId())) {
            return ResponseEntity.badRequest().build();
        }
        
        return subcategoryRepository.findById(id)
                .map(subcategory -> {
                    subcategory.setCategoryId(subcategoryRequest.getCategoryId());
                    subcategory.setSubcategoryName(subcategoryRequest.getSubcategoryName());
                    subcategory.setDescription(subcategoryRequest.getDescription());
                    Subcategory updatedSubcategory = subcategoryRepository.save(subcategory);
                    return ResponseEntity.ok(updatedSubcategory);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a subcategory (soft delete by setting isActive to false)
     * DELETE /api/subcategories/{id}
     */
    @DeleteMapping("/subcategories/{id}")
    public ResponseEntity<Void> deleteSubcategory(@PathVariable Long id) {
        return subcategoryRepository.findById(id)
                .map(subcategory -> {
                    subcategory.setIsActive(false);
                    subcategoryRepository.save(subcategory);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Permanently delete a subcategory
     * DELETE /api/subcategories/{id}/permanent
     */
    @DeleteMapping("/subcategories/{id}/permanent")
    public ResponseEntity<Void> permanentlyDeleteSubcategory(@PathVariable Long id) {
        if (subcategoryRepository.existsById(id)) {
            subcategoryRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

// Made with Bob