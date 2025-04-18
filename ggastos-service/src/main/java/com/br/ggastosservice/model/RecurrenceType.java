package com.br.ggastosservice.model;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "recurrence_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecurrenceType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private int day;

    private int month;

    private int year;

}
