package com.communityhub.backend.controller;

import com.communityhub.backend.entity.Category;
import com.communityhub.backend.repository.CategoryRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    /**
     * Get all categories
     * GET /api/categories
     */
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get category by ID
     * GET /api/categories/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get active categories
     * GET /api/categories/active
     */
    @GetMapping("/active")
    public ResponseEntity<List<Category>> getActiveCategories() {
        List<Category> categories = categoryRepository.findByIsActiveTrue();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get categories by type
     * GET /api/categories/type/{type}
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Category>> getCategoriesByType(@PathVariable String type) {
        List<Category> categories = categoryRepository.findByCategoryType(type);
        return ResponseEntity.ok(categories);
    }

    /**
     * Create a new category
     * POST /api/categories
     */
    @PostMapping
    public ResponseEntity<Category> createCategory(@Valid @RequestBody Category category) {
        // Check if category name already exists
        if (categoryRepository.findByCategoryName(category.getCategoryName()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        
        category.setIsActive(true);
        Category savedCategory = categoryRepository.save(category);
        return new ResponseEntity<>(savedCategory, HttpStatus.CREATED);
    }

    /**
     * Update an existing category
     * PUT /api/categories/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody Category categoryRequest) {
        
        return categoryRepository.findById(id)
                .map(category -> {
                    category.setCategoryName(categoryRequest.getCategoryName());
                    category.setCategoryType(categoryRequest.getCategoryType());
                    category.setDescription(categoryRequest.getDescription());
                    Category updatedCategory = categoryRepository.save(category);
                    return ResponseEntity.ok(updatedCategory);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a category (soft delete by setting isActive to false)
     * DELETE /api/categories/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .map(category -> {
                    category.setIsActive(false);
                    categoryRepository.save(category);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Permanently delete a category
     * DELETE /api/categories/{id}/permanent
     */
    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<Void> permanentlyDeleteCategory(@PathVariable Long id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

// Made with Bob