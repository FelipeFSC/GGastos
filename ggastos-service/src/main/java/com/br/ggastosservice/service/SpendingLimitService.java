package com.br.ggastosservice.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
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

    public List<SpendingLimit> findCurrentMonth() {
        YearMonth mesAtual = YearMonth.now();

        LocalDateTime inicioDoMes = mesAtual.atDay(1).atStartOfDay();
        LocalDateTime fimDoMes = mesAtual.atEndOfMonth().atTime(23, 59, 59);

        return spendingLimitRepository.findByFilterDateBetween(inicioDoMes, fimDoMes);
    }

    public SpendingLimit create(SpendingLimit spendingLimit) throws Exception {
        Category category = categoryService.findOne(spendingLimit.getCategory().getId());
        
        spendLimitVerification(spendingLimit, category);

        spendingLimit.setCategory(category);
        spendingLimit.setCreateDate(LocalDateTime.now());

        spendingLimitRepository.save(spendingLimit);
        return spendingLimit;
    }

    public void update(long spendingLimitId, SpendingLimit spendingLimit) throws Exception {
        SpendingLimit find = findOne(spendingLimitId);
        spendingLimit.setCategory(find.getCategory());
        spendingLimit.setSpent(find.getSpent());
        spendingLimit.setCreateDate(find.getCreateDate());
        spendingLimit.setId(spendingLimitId);
        spendingLimitRepository.save(spendingLimit);
    }


    public void updateSpendLimitBalanceByCategory(long transactionId) throws Exception {
        Transaction transaction = transactionService.findOne(transactionId);

        long categoryId = 0;
        if (transaction.getCategory() == null) {
            categoryId = transaction.getSubCategory().getCategory().getId();
        } else {
            categoryId = transaction.getCategory().getId();
        }

        YearMonth mesAtual = YearMonth.now();
        LocalDateTime inicioDoMes = mesAtual.atDay(1).atStartOfDay();
        LocalDateTime fimDoMes = mesAtual.atEndOfMonth().atTime(23, 59, 59);

        SpendingLimit spendingLimit = spendingLimitRepository.findByCategoryIdAndFilterDateBetween(
            categoryId, inicioDoMes, fimDoMes);

        if (spendingLimit != null) {
            List<Transaction> transactions = transactionService.findByDate(spendingLimit.getFilterDate(), categoryId);
            BigDecimal spend = BigDecimal.ZERO;
            for (Transaction item : transactions) {
                spend = spend.add(item.getValue());
            }
            spendingLimit.setSpent(spend.abs());
            spendingLimitRepository.save(spendingLimit);
        }
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
