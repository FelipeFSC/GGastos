package com.br.ggastosservice.service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

import org.springframework.stereotype.Service;

import com.br.ggastosservice.model.Account;
import com.br.ggastosservice.model.Category;
import com.br.ggastosservice.model.CreditCard;
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

    public TransactionService(TransactionRepository transactionRepository,
            SubCategoryService subCategoryService, CategoryService categoryService,
            AccountService accountService, CreditCardService creditCardService,
            TransactionTypeService transactionTypeService) {
        this.transactionRepository = transactionRepository;
        this.subCategoryService = subCategoryService;
        this.categoryService = categoryService;
        this.accountService = accountService;
        this.creditCardService = creditCardService;
        this.transactionTypeService = transactionTypeService;
    }

    public List<Transaction> findAll(String date) {
        int ano = Integer.parseInt(date.split("-")[0]);
        int mes = Integer.parseInt(date.split("-")[1]);

        LocalDateTime inicio = LocalDateTime.of(ano, mes, 1, 0, 0);

        LocalDateTime fim = inicio
            .with(TemporalAdjusters.lastDayOfMonth())
            .with(LocalTime.MAX);
            
        return transactionRepository.findAllByTransactionDateBetweenOrderByTransactionDate(inicio, fim);
    }

    public void create(Transaction transaction) throws Exception {
        verifyTransaction(transaction);
        transaction.setPaid(true);

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
