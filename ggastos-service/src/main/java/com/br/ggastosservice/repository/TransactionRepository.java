package com.br.ggastosservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.br.ggastosservice.model.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findAllByOrderByTransactionDate();

}
