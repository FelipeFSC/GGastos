package com.br.ggastosservice.model;

import java.time.LocalDate;

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

    private double amount;

    private String transactionType; // (ENUM: deposito, retirada)

    private String description;

    private LocalDate transactionDate;

    private LocalDate createDate;

    private LocalDate updateDate;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

}
