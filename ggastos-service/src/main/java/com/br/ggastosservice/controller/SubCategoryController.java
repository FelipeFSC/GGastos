package com.br.ggastosservice.controller;

import com.br.ggastosservice.model.Category;
import com.br.ggastosservice.model.SubCategory;
import com.br.ggastosservice.service.CategoryService;
import com.br.ggastosservice.service.SubCategoryService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/subcategory")
public class SubCategoryController {

    @Autowired
    CategoryService categoryService;
    
    @Autowired
    SubCategoryService subCategoryService;
    
    @GetMapping("/list/categorys")
    public List<Category> listAllCategorysEnableds() {
        
        return categoryService.listAllCategorysEnableds();
    }
    
    @PostMapping("/create")
    public SubCategory create(@RequestBody SubCategory subCategory) {
        
        return subCategoryService.create(subCategory);
    }
    
}
