package com.br.ggastosservice.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.br.ggastosservice.dto.CategoriesDto;
import com.br.ggastosservice.model.Category;
import com.br.ggastosservice.model.SubCategory;
import com.br.ggastosservice.repository.CategoryRepository;
import com.br.ggastosservice.repository.SubCategoryRepository;

@Transactional
@Service
public class CategoryService {

    private CategoryRepository categoryRepository;

    private SubCategoryRepository subCategoryRepository;

    public CategoryService(CategoryRepository categoryRepository
            , SubCategoryRepository subCategoryRepository) {
        this.categoryRepository = categoryRepository;
        this.subCategoryRepository = subCategoryRepository;
    }

    public List<CategoriesDto> listAllCategories() {
        List<Category> categories = listAllCategoriesEnableds(); 
    
        List<CategoriesDto> CategoriesDtoList = new ArrayList<CategoriesDto>();
        for (Category category : categories) {
            List<SubCategory> subcategories = subCategoryRepository.findByCategoryIdAndEnabled(category.getId(), true);

            CategoriesDto categoriesDto = new CategoriesDto();
            categoriesDto.setCategory(category);
            categoriesDto.setSubCategory(subcategories);
            CategoriesDtoList.add(categoriesDto);
        }

        return CategoriesDtoList;
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
