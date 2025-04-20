package com.br.ggastosservice.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.br.ggastosservice.model.Account;
import com.br.ggastosservice.model.Category;
import com.br.ggastosservice.model.CreditCard;
import com.br.ggastosservice.model.FixedTransaction;
import com.br.ggastosservice.model.RecurrenceType;
import com.br.ggastosservice.model.SubCategory;
import com.br.ggastosservice.model.TransactionType;
import com.br.ggastosservice.repository.FixedTransactionRepository;

@Service
public class FixedTransactionService {
    
    private FixedTransactionRepository fixedTransactionRepository;

    private SubCategoryService subCategoryService;

    private CategoryService categoryService;

    private AccountService accountService;

    private CreditCardService creditCardService;

    private TransactionTypeService transactionTypeService;

    private RecurrenceTypeService recurrenceTypeService;

    public FixedTransactionService(FixedTransactionRepository fixedTransactionRepository,
            SubCategoryService subCategoryService, CategoryService categoryService,
            AccountService accountService, CreditCardService creditCardService,
            TransactionTypeService transactionTypeService, RecurrenceTypeService recurrenceTypeService) {
        this.fixedTransactionRepository = fixedTransactionRepository;
        this.subCategoryService = subCategoryService;
        this.categoryService = categoryService;
        this.accountService = accountService;
        this.creditCardService = creditCardService;
        this.transactionTypeService = transactionTypeService;
        this.recurrenceTypeService = recurrenceTypeService;
    }

    public List<FixedTransaction> findAll() {
        return fixedTransactionRepository.findAll();
    }

    public FixedTransaction findOne(long id) throws Exception  {
        Optional<FixedTransaction> fixeTransaction = fixedTransactionRepository.findById(id);
        if (fixeTransaction == null || !fixeTransaction.isPresent()) {
            throw new Exception("Fixed transaction type ID: " +id+ ", não encontrado!");
        }
        return fixeTransaction.get();
    }

    public void create(FixedTransaction fixedTransaction) throws Exception {
        verifyFixedTransaction(fixedTransaction);
 
        fixedTransactionRepository.save(fixedTransaction);
    }

    public void update(FixedTransaction fixedTransaction, long fixedTransactionId) throws Exception {
        findOne(fixedTransactionId);
        verifyFixedTransaction(fixedTransaction);
        
        fixedTransaction.setId(fixedTransactionId);
        fixedTransactionRepository.save(fixedTransaction);
    }

    public void delete(long fixedTransactionId) throws Exception {
        FixedTransaction fixedTransaction = findOne(fixedTransactionId);
        fixedTransactionRepository.delete(fixedTransaction);
    }

    private void verifyFixedTransaction(FixedTransaction fixedTransaction) throws Exception {
        TransactionType transactionType = transactionTypeService.findOne(fixedTransaction.getTransactionType().getId());
        fixedTransaction.setTransactionType(transactionType);

        RecurrenceType recurrenceType = recurrenceTypeService.findOne(fixedTransaction.getRecurrenceType().getId());
        fixedTransaction.setRecurrenceType(recurrenceType);

        if (fixedTransaction.getSubCategory().getId() != 0) {
            SubCategory subCategory = subCategoryService.findOne(fixedTransaction.getSubCategory().getId());
            fixedTransaction.setSubCategory(subCategory);
        } else {
            fixedTransaction.setSubCategory(null);
        }
        if (fixedTransaction.getCategory().getId() != 0) {
            Category category = categoryService.findOne(fixedTransaction.getCategory().getId());
            fixedTransaction.setCategory(category);
        } else {
            fixedTransaction.setCategory(null);
        }
        if (fixedTransaction.getAccount().getId() != 0) {
            Account account = accountService.findOne(fixedTransaction.getAccount().getId());
            fixedTransaction.setAccount(account);
        } else {
            fixedTransaction.setAccount(null);
        }
        if (fixedTransaction.getCreditCard().getId() != 0) {
            CreditCard creditCard = creditCardService.findOne(fixedTransaction.getCreditCard().getId());
            fixedTransaction.setCreditCard(creditCard);
        } else {
            fixedTransaction.setCreditCard(null);
        }
    }
}
