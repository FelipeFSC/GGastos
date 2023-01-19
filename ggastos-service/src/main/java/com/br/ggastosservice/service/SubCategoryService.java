package com.br.ggastosservice.service;

import com.br.ggastosservice.model.SubCategory;
import com.br.ggastosservice.repository.SubCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SubCategoryService {

    @Autowired
    private SubCategoryRepository subCategoryRepository;

    public SubCategory create(SubCategory subCategory) {

        return subCategoryRepository.save(subCategory);
    }
    
}
