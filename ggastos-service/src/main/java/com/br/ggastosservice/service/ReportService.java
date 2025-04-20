package com.br.ggastosservice.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import com.br.ggastosservice.dto.CategotyDataReportDto;
import com.br.ggastosservice.dto.CateogoryReportDto;
import com.br.ggastosservice.model.Transaction;

@Service
public class ReportService {

    private TransactionService transactionService;

    private ReportService(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    public CateogoryReportDto generateCategoryReportDto(long transactionTypeId) {
        List<Transaction> transactions = transactionService.findByTransactionTypeId(transactionTypeId);

        for (Transaction transaction : transactions) {
            if (transaction.getCategory() == null) {
                transaction.setCategory(transaction.getSubCategory().getCategory());
            }
        }
        transactions.sort(Comparator.comparing(t -> t.getCategory().getId()));

        CateogoryReportDto cateogoryReportDto = new CateogoryReportDto();
        cateogoryReportDto.setColors(new ArrayList<String>());
        cateogoryReportDto.setData(new ArrayList<CategotyDataReportDto>());

        BigDecimal soma = BigDecimal.ZERO;
        Transaction beforeTransaction = null;
        for (Transaction transaction : transactions) {
            if (beforeTransaction != null &&
                    beforeTransaction.getCategory().getId() !=
                    transaction.getCategory().getId()) {
                cateogoryReportDto.getColors().add(
                    beforeTransaction.getCategory().getColor()
                );
                BigDecimal showValue = BigDecimal.ZERO;
                if (transactionTypeId == 1) {
                    showValue = soma;
                } else {
                    showValue = soma.multiply(new BigDecimal(-1));
                }
                cateogoryReportDto.getData().add(
                    CategotyDataReportDto.builder()
                        .name(beforeTransaction.getCategory().getName())
                        .value(showValue)
                    .build()
                );

                soma = transaction.getValue();
            } else {
                soma = transaction.getValue().add(soma);
            }
            beforeTransaction = transaction;
        }
        cateogoryReportDto.getColors().add(
            beforeTransaction.getCategory().getColor()
        );

        BigDecimal showValue = BigDecimal.ZERO;
        if (transactionTypeId == 1) {
            showValue = soma;
        } else {
            showValue = soma.multiply(new BigDecimal(-1));
        }
        cateogoryReportDto.getData().add(
            CategotyDataReportDto.builder()
                .name(beforeTransaction.getCategory().getName())
                .value(showValue)
            .build()
        );

        return cateogoryReportDto;
    }

}
