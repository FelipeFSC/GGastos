package com.br.ggastosservice.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @GetMapping("")
    public List<Transaction> findAll(@PathVariable boolean enabled) throws Exception {
        return transactionService.findAll();
    }

}
