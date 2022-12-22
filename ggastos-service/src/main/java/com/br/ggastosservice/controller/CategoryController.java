package com.br.ggastosservice.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

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
    @RequestMapping(method = RequestMethod.GET, produces = { "application/json" })
    public List<Category> findAll() {
        return categoryService.findAll();
    }

    @ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	@RequestMapping(method = RequestMethod.POST, consumes = { "application/json" }, produces = { "application/json" })
	public Category create(@RequestBody Category category) {
		return categoryService.create(category);
	}

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RequestMapping(value = "/{categoryId}", method = RequestMethod.PUT)
    public void update(@PathVariable("categoryId") long categoryId, @RequestBody Category category) throws Exception {
        categoryService.update(categoryId, category);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
	@RequestMapping(value = "/{categoryId}", method = RequestMethod.DELETE)
	public void delete(@PathVariable("categoryId") long categoryId) throws Exception{
		categoryService.delete(categoryId);
	}

}
