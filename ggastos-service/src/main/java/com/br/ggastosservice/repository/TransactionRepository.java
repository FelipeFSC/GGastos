package com.br.ggastosservice.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.br.ggastosservice.dto.MonthlyTotalDto;
import com.br.ggastosservice.model.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query(value = "SELECT * FROM transaction"
        +" LEFT JOIN sub_category ON transaction.sub_category_id = sub_category.id"
        +" LEFT JOIN category ON sub_category.category_id = category.id"
        +" WHERE transaction.transaction_date BETWEEN :dataInicio AND :dataFim AND paid_date IS NOT NULL"
        +" AND (transaction.category_id = :categoryId OR category.id = :categoryId)", nativeQuery = true)
    List<Transaction> searchTransactionsByCategoryAndDate(@Param("categoryId") Long categoryId,
        @Param("dataInicio") LocalDateTime dataInicio,
        @Param("dataFim") LocalDateTime dataFim);

    List<Transaction> findByFixedTransactionId(Long fixedTransactionId);

    List<Transaction> findAllByTransactionDateBetweenOrderByTransactionDate(LocalDateTime ano, LocalDateTime mes);

    List<Transaction> findByPaidDateNotNullOrderByCategoryIdAscSubCategoryAscPaidDateAsc();

    @Query("SELECT t FROM Transaction t " +
       "WHERE t.paidDate IS NOT NULL " +
       "AND t.transactionDate BETWEEN :start AND :end " +
       "ORDER BY t.category.id ASC, t.subCategory.id ASC, t.paidDate ASC")
    List<Transaction> findPaidTransactionsInPeriod(
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
    );

    List<Transaction> findByTransactionTypeIdAndPaidDateNotNullAndTransactionDateBetweenOrderByCategoryIdAscSubCategoryCategoryIdAsc(
        long transactionTypeId,
        LocalDateTime startOfMonth,
        LocalDateTime endOfMonth
    );

    @Query(value = "SELECT * FROM transaction"
        + " WHERE transaction_date < CURRENT_DATE() AND paid_date IS NULL"
        + " AND transaction_type_id = :transactionTypeId", nativeQuery = true)
    List<Transaction> findByTransactionTypeId(long transactionTypeId);

    @Query(value = "SELECT SUM(value) AS total_value FROM transaction"+
        " where transaction_type_id = :transactionTypeId AND paid_date IS NOT NULL AND account_id = :accountId", nativeQuery = true)
    BigDecimal findTotalValuesByTransactionType(long transactionTypeId, long accountId);


    @Query(value = "SELECT SUM(value) AS total_value FROM transaction"+
        " INNER JOIN account ON transaction.account_id = account.id"+
        " where transaction_type_id = :transactionTypeId AND paid_date IS NOT NULL AND account.not_in_total IS FALSE", nativeQuery = true)
    BigDecimal findTotalValues(long transactionTypeId);

    @Query(value = "SELECT " +
            " FORMATDATETIME(t.transaction_date, 'yyyy-MM') AS month,"+
            " tt.name AS type, SUM(t.value) AS total FROM transaction t"+
            "   INNER JOIN transaction_type tt ON t.transaction_type_id = tt.id" +
            " WHERE tt.name IN ('entrada', 'saida')" +
            " AND YEAR(t.transaction_date) = :ano AND t.paid_date IS NOT NULL" +
            "   GROUP BY FORMATDATETIME(t.transaction_date, 'yyyy-MM'), tt.name" +
            " ORDER BY month, type", nativeQuery = true)
    List<MonthlyTotalDto> findMonthlyTotalsByYear(@Param("ano") int ano);

    List<Transaction> findByFixedTransactionIdAndTransactionDateGreaterThanEqual(
        Long fixedTransactionId, LocalDateTime transactionDate
    );

}
