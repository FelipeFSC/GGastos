package com.br.ggastosservice.controller;

import com.br.ggastosservice.model.SubCategory;
import com.br.ggastosservice.service.SubCategoryService;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sub-category")
public class SubCategoryController {
    
    private SubCategoryService subCategoryService;

    public SubCategoryController(SubCategoryService subCategoryService) {
        this.subCategoryService = subCategoryService;
    }
    
    @PostMapping()
    public SubCategory create(@RequestBody SubCategory subCategory) throws Exception {
        return subCategoryService.create(subCategory);
    }

    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/{subCategoryId}", method = RequestMethod.PUT)
    public void update(@PathVariable("subCategoryId") long subCategoryId, @RequestBody SubCategory subCategory) throws Exception {
        subCategoryService.update(subCategoryId, subCategory);
    }

    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/{subCategoryId}", method = RequestMethod.DELETE)
    public void delete(@PathVariable("subCategoryId") long subCategoryId) throws Exception {
        subCategoryService.disable(subCategoryId);
    }

    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/{categoryId}", method = RequestMethod.GET, produces = {"application/json"})
    public List<SubCategory> findByCategory(@PathVariable("categoryId") long categoryId) {
        return subCategoryService.findByCategory(categoryId);
    }
    
}
