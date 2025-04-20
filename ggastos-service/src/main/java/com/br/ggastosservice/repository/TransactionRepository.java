package com.br.ggastosservice.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.br.ggastosservice.model.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findAllByTransactionDateBetweenOrderByTransactionDate(LocalDateTime ano, LocalDateTime mes);

    List<Transaction> findByPaidDateNotNullOrderByCategoryIdAscSubCategoryAscPaidDateAsc();

    List<Transaction> findByTransactionTypeIdAndPaidDateNotNullOrderByCategoryIdAscSubCategoryCategoryIdAsc(long transactionTypeId);

}
