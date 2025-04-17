package com.br.ggastosservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.br.ggastosservice.model.TransactionType;

public interface TransactionTypeRepository extends JpaRepository<TransactionType, Long> {
    
}
