package com.br.ggastosservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.br.ggastosservice.dto.CategoriesDto;
import com.br.ggastosservice.model.Category;
import com.br.ggastosservice.service.CategoryService;
import java.util.List;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.GET, produces = {"application/json"})
    public List<CategoriesDto> findAll() {
        return categoryService.findAllDto();
    }

    @GetMapping("/type/{type}")
    public List<CategoriesDto> findByType(@PathVariable("type") String type) {
        return categoryService.findByEnabledTrueAndTypeDto(type);
    }

    @ResponseBody
    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(method = RequestMethod.POST, consumes = {"application/json"}, produces = {"application/json"})
    public Category create(@RequestBody Category category) {
        return categoryService.create(category);
    }

    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/{categoryId}", method = RequestMethod.PUT)
    public void update(@PathVariable("categoryId") long categoryId, @RequestBody Category category) throws Exception {
        categoryService.update(categoryId, category);
    }

    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/{categoryId}", method = RequestMethod.DELETE)
    public void delete(@PathVariable("categoryId") long categoryId) throws Exception {
        categoryService.disable(categoryId);
    }

}
