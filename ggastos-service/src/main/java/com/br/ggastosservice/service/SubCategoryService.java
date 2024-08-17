package com.br.ggastosservice.service;

import com.br.ggastosservice.model.Category;
import com.br.ggastosservice.model.SubCategory;
import com.br.ggastosservice.repository.SubCategoryRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class SubCategoryService {

    private SubCategoryRepository subCategoryRepository;

    private CategoryService categoryService;

    public SubCategoryService(SubCategoryRepository subCategoryRepository, CategoryService categoryService) {
        this.subCategoryRepository = subCategoryRepository;
        this.categoryService = categoryService;
    }

    public SubCategory findOne(long id) throws Exception  {
        Optional<SubCategory> subCategory = subCategoryRepository.findById(id);
        if (subCategory == null || !subCategory.isPresent()) {
            throw new Exception("Categoria id: " +id+ ", não encontrado!");
        }
        return subCategory.get();
    }

    public SubCategory create(SubCategory subCategory) throws Exception {
        Category category = categoryService.findOne(subCategory.getCategory().getId());
        subCategory.setCategory(category);
        subCategory.setEnabled(true);
        return subCategoryRepository.save(subCategory);
    }

    public void update(long subCategoryId, SubCategory subCategory) throws Exception {
        findOne(subCategoryId);
        categoryService.findOne(subCategory.getCategory().getId());
        subCategory.setId(subCategoryId);
        subCategory.setEnabled(true);
        subCategoryRepository.save(subCategory);
    }

    public void disable(long subCategoryId) throws Exception {
        SubCategory subCategory = findOne(subCategoryId);
        subCategory.setEnabled(false);
        subCategoryRepository.save(subCategory);
    }

    public List<SubCategory> findByCategory(long categoryId) {
        return subCategoryRepository.findByCategoryIdAndEnabled(categoryId, true);
    }
}
