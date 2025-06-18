package com.br.ggastosservice.model;

import java.math.BigDecimal;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "account")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String icon;

    private String color;

    private BigDecimal balance;

    private boolean enabled;

    @Column(name="not_in_total")
    private boolean notInTotal;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

}
