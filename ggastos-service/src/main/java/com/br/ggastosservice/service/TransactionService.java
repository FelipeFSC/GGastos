package com.br.ggastosservice.service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.br.ggastosservice.model.Account;
import com.br.ggastosservice.model.Category;
import com.br.ggastosservice.model.CreditCard;
import com.br.ggastosservice.model.FixedTransaction;
import com.br.ggastosservice.model.RecurrenceType;
import com.br.ggastosservice.model.SubCategory;
import com.br.ggastosservice.model.Transaction;
import com.br.ggastosservice.model.TransactionType;
import com.br.ggastosservice.repository.TransactionRepository;

@Service
public class TransactionService {

    private TransactionRepository transactionRepository;
    
    private SubCategoryService subCategoryService;

    private CategoryService categoryService;

    private AccountService accountService;

    private CreditCardService creditCardService;

    private TransactionTypeService transactionTypeService;

    private FixedTransactionService fixedTransactionService;

    public TransactionService(TransactionRepository transactionRepository,
            SubCategoryService subCategoryService, CategoryService categoryService,
            AccountService accountService, CreditCardService creditCardService,
            TransactionTypeService transactionTypeService, FixedTransactionService fixedTransactionService) {
        this.transactionRepository = transactionRepository;
        this.subCategoryService = subCategoryService;
        this.categoryService = categoryService;
        this.accountService = accountService;
        this.creditCardService = creditCardService;
        this.transactionTypeService = transactionTypeService;
        this.fixedTransactionService = fixedTransactionService;
    }

    public List<Transaction> findAll(String date) {
        int ano = Integer.parseInt(date.split("-")[0]);
        int mes = Integer.parseInt(date.split("-")[1]);

        LocalDateTime inicio = LocalDateTime.of(ano, mes, 1, 0, 0);

        LocalDateTime fim = inicio
            .with(TemporalAdjusters.lastDayOfMonth())
            .with(LocalTime.MAX);

        List<Transaction> list = transactionRepository.findAllByTransactionDateBetweenOrderByTransactionDate(inicio, fim);

        List<Transaction> generatedTransactions = new ArrayList<>();
        List<FixedTransaction> recurrenceTypes = fixedTransactionService.findAll();
        for (FixedTransaction fixed : recurrenceTypes) {
            LocalDateTime transactionStart = fixed.getTransactionDate();

            ChronoUnit unit = ChronoUnit.MONTHS;
            int step = 0;
            RecurrenceType type = fixed.getRecurrenceType();
            if (type.getDay() != 0) {
                unit = ChronoUnit.DAYS;
                step = type.getDay();

            } else if (type.getMonth() != 0) {
                unit = ChronoUnit.MONTHS;
                step = type.getMonth();

            } else if (type.getYear() != 0) {
                unit = ChronoUnit.YEARS;
                step = type.getYear();
            }

            LocalDateTime current = transactionStart;
            while (!current.isAfter(fim)) {
                if (!current.isBefore(inicio)) {
                    Transaction simulated = new Transaction();
                    simulated.setValue(fixed.getValue());
                    simulated.setTransactionType(fixed.getTransactionType());
                    simulated.setTransactionDate(current);
                    simulated.setAccount(fixed.getAccount());
                    simulated.setCategory(fixed.getCategory());
                    simulated.setSubCategory(fixed.getSubCategory());
                    simulated.setCreditCard(fixed.getCreditCard());
                    simulated.setDescription("[FIXED]");

                    // Você pode criar uma flag no DTO ou um campo transient para dizer que ela é simulada
                    generatedTransactions.add(simulated);
                    list.add(simulated);
                }

                current = current.plus(step, unit);
            }
        }

        return list;
    }

    public void create(Transaction transaction) throws Exception {
        verifyTransaction(transaction);
        transaction.setPaid(false);

        transactionRepository.save(transaction);
    }

    private void verifyTransaction(Transaction transaction) throws Exception {
        TransactionType transactionType = transactionTypeService.findOne(transaction.getTransactionType().getId());
        transaction.setTransactionType(transactionType);

        if (transaction.getSubCategory().getId() != 0) {
            SubCategory subCategory = subCategoryService.findOne(transaction.getSubCategory().getId());
            transaction.setSubCategory(subCategory);
        } else {
            transaction.setSubCategory(null);
        }
        if (transaction.getCategory().getId() != 0) {
            Category category = categoryService.findOne(transaction.getCategory().getId());
            transaction.setCategory(category);
        } else {
            transaction.setCategory(null);
        }
        if (transaction.getAccount().getId() != 0) {
            Account account = accountService.findOne(transaction.getAccount().getId());
            transaction.setAccount(account);
        } else {
            transaction.setAccount(null);
        }
        if (transaction.getCreditCard().getId() != 0) {
            CreditCard creditCard = creditCardService.findOne(transaction.getCreditCard().getId());
            transaction.setCreditCard(creditCard);
        } else {
            transaction.setCreditCard(null);
        }
    }

}
