package com.br.ggastosservice.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "spending_limit")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SpendingLimit {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal spentLimit;

    private BigDecimal spent;

    private LocalDateTime createDate;

    private LocalDateTime filterDate;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

}
