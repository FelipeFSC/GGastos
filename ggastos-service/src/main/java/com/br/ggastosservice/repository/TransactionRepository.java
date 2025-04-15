package com.br.ggastosservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.br.ggastosservice.model.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
}
