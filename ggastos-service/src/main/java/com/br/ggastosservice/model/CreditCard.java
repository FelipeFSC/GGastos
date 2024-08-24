package com.br.ggastosservice.model;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "credit_card")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreditCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String icon;

    private String color;

    @Column(name = "card_limit")
    private double cardLimit;

    @Column(name = "closing_date")
    private byte closingDate;

    @Column(name = "due_date")
    private byte dueDate;

    private boolean enabled;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

}
