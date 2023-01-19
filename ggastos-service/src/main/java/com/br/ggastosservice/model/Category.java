package com.br.ggastosservice.model;

import java.util.List;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String type;

    private String name;

    private String color;

    private String icon;

    private boolean enabled;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
	@JoinColumn(name="category_id", nullable = true)
	private List<SubCategory> subCategories;

}
