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

    public List<Category> listAllCategoriesEnableds() {
        return categoryRepository.listAllCategoriesEnableds();
    }

    public Category findOne(long id) throws Exception  {
        Optional<Category> category = categoryRepository.findById(id);
        if (category == null || !category.isPresent()) {
            throw new Exception("Categoria id: " +id+ ", não encontrado!");
        }
        return category.get();
    }

    public Category create(Category category) {
        category.setIcon(category.getIcon().toLowerCase());
        category.setEnabled(true);
        categoryRepository.save(category);
        return category;
    }

    public void update(long categoryId, Category category) throws Exception {
        findOne(categoryId);
        category.setId(categoryId);
        category.setEnabled(true);
        categoryRepository.save(category);
    }

    public void disable(long categoryId) throws Exception {
        Category category = findOne(categoryId);
        category.setEnabled(false);
        categoryRepository.save(category);
    }
}
