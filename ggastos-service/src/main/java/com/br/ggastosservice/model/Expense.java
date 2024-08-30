package com.br.ggastosservice.model;

import java.time.LocalDate;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "expense")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Expense {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double amount;

    private String description;

    private LocalDate paidDate; // quando foi pago

    private LocalDate paymentDate; // quando foi aberto

    private LocalDate createDate;

    private LocalDate updateDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "sub_category_id")
    private SubCategory subCategory;
}
