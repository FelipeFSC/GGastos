package com.br.ggastosservice.model;

import java.time.LocalDate;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "fixed_expense")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FixedExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private double amount;

    private String frequency; // (ENUM: SEMANAL, MENSAL, SEMESTRAL)

    private LocalDate openDate;

    private LocalDate closeDate;

    private String description;

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
