package com.br.ggastosservice.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.br.ggastosservice.model.Category;
import com.br.ggastosservice.model.SpendingLimit;
import com.br.ggastosservice.model.Transaction;
import com.br.ggastosservice.repository.SpendingLimitRepository;

@Service
public class SpendingLimitService {
    
    private SpendingLimitRepository spendingLimitRepository;

    private CategoryService categoryService;

    private TransactionService transactionService;

    private SpendingLimitService(SpendingLimitRepository spendingLimitRepository,
            CategoryService categoryService, TransactionService transactionService) {
        this.spendingLimitRepository = spendingLimitRepository;
        this.categoryService = categoryService;
        this.transactionService = transactionService;
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
        
        spendLimitVerification(spendingLimit, category);

        spendingLimit.setCategory(category);
        spendingLimit.setCreateDate(LocalDateTime.now());

        spendingLimitRepository.save(spendingLimit);
        return spendingLimit;
    }


    private void spendLimitVerification(SpendingLimit spendingLimit, Category category) throws Exception {
        LocalDateTime fim = spendingLimit.getFilterDate()
            .with(TemporalAdjusters.lastDayOfMonth())
            .with(LocalTime.MAX);
        SpendingLimit spendingLimitVerify = spendingLimitRepository.findByCategoryIdAndFilterDateBetween(category.getId(), spendingLimit.getFilterDate(), fim);
        if (spendingLimitVerify != null) {
            throw new Exception("Já existe limite de gastos para essa categoria");
        }

        List<Transaction> transactions = transactionService.findByDate(spendingLimit.getFilterDate(), category.getId());
        BigDecimal spend = BigDecimal.ZERO;
        for (Transaction transaction : transactions) {
            spend = spend.add(transaction.getValue());
        }
        spendingLimit.setSpent(spend.abs());
    }
}
