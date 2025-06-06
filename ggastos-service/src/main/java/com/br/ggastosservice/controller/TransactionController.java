package com.br.ggastosservice.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.br.ggastosservice.dto.TesteDto;
import com.br.ggastosservice.model.Transaction;
import com.br.ggastosservice.service.SpendingLimitService;
import com.br.ggastosservice.service.TransactionService;

@RestController
@RequestMapping("/transactions")
public class TransactionController {
    
    private TransactionService transactionService;

    private SpendingLimitService spendingLimitService;

    public TransactionController(TransactionService transactionService
            , SpendingLimitService spendingLimitService) {
        this.transactionService = transactionService;
        this.spendingLimitService = spendingLimitService;
    }

    @GetMapping("/date/{date}")
    public List<Transaction> findByDate(@PathVariable("date") String date) throws Exception {
        return transactionService.findByDate(date);
    }

    @GetMapping("")
    public List<Transaction> findAll() throws Exception {
        return transactionService.findAll();
    }

    @GetMapping("/{transactionId}")
    public Transaction findById(@PathVariable("transactionId") long transactionId) throws Exception {
        return transactionService.findOne(transactionId);
    }

    @GetMapping("/{transactionId}/aaaa")
    public List<Transaction> findExpiredUnpaid(@PathVariable("transactionId") long transactionId) throws Exception {
        return transactionService.findExpiredUnpaid(transactionId);
    }

    @PostMapping()
    public void create(@RequestBody Transaction transaction) throws Exception {
        transactionService.create(transaction);
    }

    @PutMapping("/{transactionId}")
    public void update(@RequestBody Transaction transaction,
            @PathVariable("transactionId") long transactionId) throws Exception {
        transactionService.update(transaction, transactionId);
    }

    @DeleteMapping("/{transactionId}")
    public void delete(@PathVariable("transactionId") long transactionId) throws Exception {
        transactionService.delete(transactionId);
    }

    @PatchMapping("/{transactionId}/is-paid")
    public void isPaid(@PathVariable("transactionId") long transactionId) throws Exception {
        transactionService.paidTransaction(transactionId);
        spendingLimitService.updateSpendLimitBalanceByCategory(transactionId);
    }




    @PostMapping("/teste")
    public void teste(@RequestBody TesteDto transactions) throws Exception {
        transactionService.teste(transactions);
    }

}
