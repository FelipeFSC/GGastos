package com.br.ggastosservice.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.br.ggastosservice.model.Transaction;
import com.br.ggastosservice.service.TransactionService;

@RestController
@RequestMapping("/transactions")
public class TransactionController {
    
    private TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping("/date/{date}")
    public List<Transaction> findAll(@PathVariable("date") String date) throws Exception {
        return transactionService.findAll(date);
    }

    @PostMapping()
    public void create(@RequestBody Transaction transaction) throws Exception {
        transactionService.create(transaction);
    }

    @PatchMapping("/{transactionId}/is-paid")
    public void isPaid(@PathVariable("transactionId") long transactionId) throws Exception {
        transactionService.paidTransaction(transactionId);
    }

}
