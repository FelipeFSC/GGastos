package com.br.ggastosservice.service;

import com.br.ggastosservice.model.Category;
import com.br.ggastosservice.model.SubCategory;
import com.br.ggastosservice.repository.SubCategoryRepository;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class SubCategoryService {

    private SubCategoryRepository subCategoryRepository;

    private CategoryService categoryService;

    public SubCategoryService(SubCategoryRepository subCategoryRepository, CategoryService categoryService) {
        this.subCategoryRepository = subCategoryRepository;
        this.categoryService = categoryService;
    }

    public SubCategory create(SubCategory subCategory) throws Exception {
        Category category = categoryService.findOne(subCategory.getCategory().getId());
        subCategory.setCategory(category);
        subCategory.setEnabled(true);
        return subCategoryRepository.save(subCategory);
    }

    public List<SubCategory> findByCategory(long categoryId) {
        return subCategoryRepository.findByCategoryId(categoryId);
    }
    
}
