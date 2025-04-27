package com.br.ggastosservice.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.br.ggastosservice.model.Category;
import com.br.ggastosservice.model.SpendingLimit;
import com.br.ggastosservice.repository.SpendingLimitRepository;

@Service
public class SpendingLimitService {
    
    private SpendingLimitRepository spendingLimitRepository;

    private CategoryService categoryService;

    private SpendingLimitService(SpendingLimitRepository spendingLimitRepository,
            CategoryService categoryService) {
        this.spendingLimitRepository = spendingLimitRepository;
        this.categoryService = categoryService;
    }

    public SpendingLimit findOne(long id) throws Exception  {
        Optional<SpendingLimit> spendingLimit = spendingLimitRepository.findById(id);
        if (spendingLimit == null || !spendingLimit.isPresent()) {
            throw new Exception("Spending limit ID: " +id+ ", não encontrado!");
        }
        return spendingLimit.get();
    }

    public List<SpendingLimit> findAll() throws Exception  {
        return spendingLimitRepository.findAll();
    }

    public SpendingLimit create(SpendingLimit spendingLimit) throws Exception {
        Category category = categoryService.findOne(spendingLimit.getCategory().getId());

        spendingLimit.setCategory(category);
        spendingLimit.setCreateDate(LocalDateTime.now());
        spendingLimitRepository.save(spendingLimit);
        return spendingLimit;
    }

}
