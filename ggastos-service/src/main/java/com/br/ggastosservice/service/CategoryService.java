package com.br.ggastosservice.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.br.ggastosservice.model.Category;
import com.br.ggastosservice.repository.CategoryRepository;

@Transactional
@Service
public class CategoryService {

    private CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public Category findOne(long id) throws Exception  {
        Optional<Category> category = categoryRepository.findById(id);
        if (category == null || !category.isPresent()) {
            throw new Exception("Categoria id: " +id+ ", não encontrado!");
        }
        return category.get();
    }

    public Category create(Category category) {
        categoryRepository.save(category);
        return category;
    }

    public void update(long oldCategoryId, Category category) throws Exception {
        findOne(oldCategoryId);
        category.setId(oldCategoryId);
        categoryRepository.save(category);
    }

    public void delete(long categoryId) throws Exception {
        Category category = findOne(categoryId);
        categoryRepository.delete(category);
    }
}
