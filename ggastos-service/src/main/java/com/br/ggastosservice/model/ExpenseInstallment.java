package com.br.ggastosservice.model;

import java.time.LocalDate;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "expense_installment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseInstallment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double installmentValue;

    private LocalDate duaDate;

    private LocalDate paidDate;

    private String status; // ENUM ('PAGO', 'PENDENTE', 'VENCEU')

    private LocalDate createDate;

    private LocalDate updateDate;

    @ManyToOne
    @JoinColumn(name = "expense_id")
    private Expense expense;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "sub_category_id")
    private SubCategory subCategory;
}
