package com.br.ggastosservice.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "transaction")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long fixedTransactionId;

    private BigDecimal value;

    @ManyToOne
    @JoinColumn(name = "transaction_type_id")
    private TransactionType transactionType;

    private String description;

    private String observation;

    @Column(name = "paid_date")
    private LocalDateTime paidDate;

    @Column(name = "transaction_date")
    private LocalDateTime transactionDate;

    @Column(name = "create_date")
    private LocalDateTime createDate;

    @Column(name = "update_date")
    private LocalDateTime updateDate;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @ManyToOne
    @JoinColumn(name = "credit_card_id")
    private CreditCard creditCard;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "sub_category_id")
    private SubCategory subCategory;

    @ManyToOne
    @JoinColumn(name = "file_id")
    private FileAttachment selectedFile;

    public Transaction copy() {
        Transaction copy = new Transaction();
        copy.setFixedTransactionId(this.fixedTransactionId);
        copy.setValue(this.value);
        copy.setTransactionType(this.transactionType);
        copy.setDescription(this.description);
        copy.setObservation(this.observation);
        copy.setPaidDate(this.paidDate);
        copy.setTransactionDate(this.transactionDate);
        copy.setCreateDate(this.createDate);
        copy.setUpdateDate(this.updateDate);
        copy.setAccount(this.account);
        copy.setCreditCard(this.creditCard);
        copy.setCategory(this.category);
        copy.setSubCategory(this.subCategory);
        copy.setSelectedFile(this.selectedFile);
        return copy;
    }

}
