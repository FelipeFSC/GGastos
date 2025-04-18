package com.br.ggastosservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.br.ggastosservice.model.FixedTransaction;

public interface FixedTransactionRepository extends JpaRepository<FixedTransaction, Long> {

}
