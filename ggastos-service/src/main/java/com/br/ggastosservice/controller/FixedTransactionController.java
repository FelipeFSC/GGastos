package com.br.ggastosservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.br.ggastosservice.model.FixedTransaction;
import com.br.ggastosservice.service.FixedTransactionService;

@RestController
@RequestMapping("/fixed-transactions")
public class FixedTransactionController {

    private FixedTransactionService fixedTransactionService;

    public FixedTransactionController(FixedTransactionService fixedTransactionService) {
        this.fixedTransactionService = fixedTransactionService;
    }

    @GetMapping("/{transactionId}")
    public FixedTransaction findById(@PathVariable("transactionId") long transactionId) throws Exception {
        return fixedTransactionService.findOne(transactionId);
    }

    @PostMapping()
    public void create(@RequestBody FixedTransaction fixedTransaction) throws Exception {
        fixedTransactionService.create(fixedTransaction);
    }
    
}
