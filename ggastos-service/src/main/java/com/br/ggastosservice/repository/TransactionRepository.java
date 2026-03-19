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
            + " LEFT JOIN sub_category ON transaction.sub_category_id = sub_category.id"
            + " LEFT JOIN category ON sub_category.category_id = category.id"
            + " WHERE transaction.transaction_date BETWEEN :dataInicio AND :dataFim AND paid_date IS NOT NULL"
            + " AND (transaction.category_id = :categoryId OR category.id = :categoryId)", nativeQuery = true)
    List<Transaction> searchTransactionsByCategoryAndDate(@Param("categoryId") Long categoryId,
            @Param("dataInicio") LocalDateTime dataInicio,
            @Param("dataFim") LocalDateTime dataFim);

    List<Transaction> findByFixedTransactionId(Long fixedTransactionId);

    // installment group operations (parcelado)
    List<Transaction> findByInstallmentGroupId(Long installmentGroupId);

    List<Transaction> findAllByTransactionDateBetweenOrderByTransactionDate(LocalDateTime ano, LocalDateTime mes);

    // filter helpers for payment method
    List<Transaction> findAllByTransactionDateBetweenAndCreditCardIdIsNullOrderByTransactionDate(LocalDateTime ano, LocalDateTime mes);
    List<Transaction> findAllByTransactionDateBetweenAndCreditCardIdIsNotNullOrderByTransactionDate(LocalDateTime ano, LocalDateTime mes);

    List<Transaction> findByPaidDateNotNullOrderByCategoryIdAscSubCategoryAscPaidDateAsc();

    @Query("SELECT t FROM Transaction t " +
            "WHERE t.paidDate IS NOT NULL " +
            "AND t.transactionDate BETWEEN :start AND :end " +
            "ORDER BY t.category.id ASC, t.subCategory.id ASC, t.paidDate ASC")
    List<Transaction> findPaidTransactionsInPeriod(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    List<Transaction> findByTransactionTypeIdAndPaidDateNotNullAndTransactionDateBetweenOrderByCategoryIdAscSubCategoryCategoryIdAsc(
            long transactionTypeId,
            LocalDateTime startOfMonth,
            LocalDateTime endOfMonth);

    @Query(value = "SELECT * FROM transaction"
            + " WHERE transaction_date < CURRENT_DATE() AND paid_date IS NULL"
            + " AND transaction_type_id = :transactionTypeId", nativeQuery = true)
    List<Transaction> findByTransactionTypeId(long transactionTypeId);

    @Query(value = "SELECT SUM(value) AS total_value FROM transaction" +
            " where transaction_type_id = :transactionTypeId AND paid_date IS NOT NULL AND account_id = :accountId", nativeQuery = true)
    BigDecimal findTotalValuesByTransactionType(long transactionTypeId, long accountId);

    @Query(value = "SELECT SUM(value) AS total_value FROM transaction" +
            " where transaction_type_id = :transactionTypeId AND paid_date IS NOT NULL AND credit_card_id = :creditCardId", nativeQuery = true)
    BigDecimal findTotalValuesByTransactionTypeAndCreditCard(long transactionTypeId, long creditCardId);

    @Query(value = "SELECT SUM(value) AS total_value FROM transaction" +
            " INNER JOIN account ON transaction.account_id = account.id" +
            " where transaction_type_id = :transactionTypeId AND paid_date IS NOT NULL AND account.not_in_total IS FALSE", nativeQuery = true)
    BigDecimal findTotalValues(long transactionTypeId);

    @Query(value = "SELECT SUM(value) AS total_value FROM transaction" +
            " INNER JOIN account ON transaction.account_id = account.id" +
            " where transaction_type_id = :transactionTypeId AND paid_date IS NOT NULL AND account.not_in_total IS FALSE AND account.user_id = :userId", nativeQuery = true)
    BigDecimal findTotalValuesByTransactionTypeAndUser(long transactionTypeId, long userId);

    @Query(value = "SELECT SUM(t.value) AS total_value FROM transaction t" +
            "   INNER JOIN credit_card cc ON t.credit_card_id = cc.id" +
            "   INNER JOIN account a ON cc.account_id = a.id" +
            " WHERE t.transaction_type_id = :transactionTypeId AND t.paid_date IS NOT NULL AND a.not_in_total IS FALSE AND a.user_id = :userId", nativeQuery = true)
    BigDecimal findTotalValuesByTransactionTypeAndUserCreditCards(long transactionTypeId, long userId);

    @Query(value = "SELECT " +
            " FORMATDATETIME(t.transaction_date, 'yyyy-MM') AS month," +
            " tt.name AS type, SUM(t.value) AS total FROM transaction t" +
            "   INNER JOIN transaction_type tt ON t.transaction_type_id = tt.id" +
            " WHERE tt.name IN ('entrada', 'saida')" +
            " AND YEAR(t.transaction_date) = :ano AND t.paid_date IS NOT NULL" +
            "   GROUP BY FORMATDATETIME(t.transaction_date, 'yyyy-MM'), tt.name" +
            " ORDER BY month, type", nativeQuery = true)
    List<MonthlyTotalDto> findMonthlyTotalsByYear(@Param("ano") int ano);

    List<Transaction> findByFixedTransactionIdAndTransactionDateGreaterThanEqual(
            Long fixedTransactionId, LocalDateTime transactionDate);

    List<Transaction> findByIdAndTransactionDateGreaterThanEqual(
            Long transactionId, LocalDateTime transactionDate);

    List<Transaction> findByInstallmentGroupIdAndTransactionDateGreaterThanEqual(
            Long installmentGroupId, LocalDateTime transactionDate);

    @Query(value = "SELECT t.*"
                + " FROM transaction t"
                + " WHERE t.fixed_transaction_id = :fixedId"
                + "  AND t.transaction_date >= ("
                + "      SELECT t2.transaction_date"
                + "      FROM transaction t2"
                + "      WHERE t2.id = :transactionId"
                + "  )"
                + " ORDER BY t.transaction_date", nativeQuery = true)
    List<Transaction> findCurrentAndNextByFixedId(
            @Param("transactionId") Long transactionId,
            @Param("fixedId") Long fixedId);

    @Query(value = "SELECT t.*"
                + " FROM transaction t"
                + " WHERE t.installment_group_id = :groupId"
                + "  AND t.transaction_date >= ("
                + "      SELECT t2.transaction_date"
                + "      FROM transaction t2"
                + "      WHERE t2.id = :transactionId"
                + "  )"
                + " ORDER BY t.transaction_date", nativeQuery = true)
    List<Transaction> findCurrentAndNextByInstallmentGroup(
            @Param("transactionId") Long transactionId,
            @Param("groupId") Long groupId);

}
