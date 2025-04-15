package com.br.ggastosservice.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "fixed_transaction")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FixedTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal value;

    private String transactionType; // (ENUM: entrada, saida, parcelado, fixo, transferencia de conta)

    private LocalDateTime transactionDate;

    private LocalDateTime createDate;

    private LocalDateTime updateDate;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @ManyToOne
    @JoinColumn(name = "credit_card_id")
    private CreditCard creditCard;

}
