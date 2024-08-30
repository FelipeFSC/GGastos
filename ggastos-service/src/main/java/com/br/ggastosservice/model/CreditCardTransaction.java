package com.br.ggastosservice.model;

import java.time.LocalDate;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "credit_card_transaction")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreditCardTransaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double amount;

    private LocalDate transactionDate;

    private String description;

    private LocalDate createDate;

    private LocalDate updateDate;

    @ManyToOne
    @JoinColumn(name = "credit_card_id")
    private CreditCard creditCard;
}
