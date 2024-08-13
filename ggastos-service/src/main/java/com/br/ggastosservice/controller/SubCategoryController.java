package com.br.ggastosservice.controller;

import com.br.ggastosservice.model.SubCategory;
import com.br.ggastosservice.service.SubCategoryService;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/subcategory")
public class SubCategoryController {
    
    SubCategoryService subCategoryService;

    public SubCategoryController(SubCategoryService subCategoryService) {
        this.subCategoryService = subCategoryService;
    }
    
    @PostMapping()
    public SubCategory create(@RequestBody SubCategory subCategory) throws Exception {
        return subCategoryService.create(subCategory);
    }

    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.GET, produces = {"application/json"})
    public List<SubCategory> findByCategory(long categoryId) {
        return subCategoryService.findByCategory(categoryId);
    }
    
}
