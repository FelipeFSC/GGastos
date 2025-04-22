package com.br.ggastosservice.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.br.ggastosservice.model.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findAllByTransactionDateBetweenOrderByTransactionDate(LocalDateTime ano, LocalDateTime mes);

    List<Transaction> findByPaidDateNotNullOrderByCategoryIdAscSubCategoryAscPaidDateAsc();

    List<Transaction> findByTransactionTypeIdAndPaidDateNotNullOrderByCategoryIdAscSubCategoryCategoryIdAsc(long transactionTypeId);

    @Query(value = "SELECT SUM(value) AS total_value FROM transaction"+
        " where transaction_type_id = :transactionTypeId AND paid_date IS NOT NULL AND account_id = :accountId", nativeQuery = true)
    BigDecimal findTotalValuesByTransactionType(long transactionTypeId, long accountId);

    @Query(value = "SELECT SUM(value) AS total_value FROM transaction"+
        " where transaction_type_id = :transactionTypeId AND paid_date IS NOT NULL", nativeQuery = true)
    BigDecimal findTotalValues(long transactionTypeId);

}
