package com.br.ggastosservice.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.br.ggastosservice.model.Transaction;
import com.br.ggastosservice.repository.TransactionRepository;

@Service
public class TransactionService {
    
    private TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public List<Transaction> findAll() {
        return transactionRepository.findAll();
    }

}
