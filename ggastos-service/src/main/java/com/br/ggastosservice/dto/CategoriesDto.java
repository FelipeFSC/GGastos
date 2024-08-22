package com.br.ggastosservice.dto;

import java.util.List;

import com.br.ggastosservice.model.Category;
import com.br.ggastosservice.model.SubCategory;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoriesDto {

    private Category category;

    private List<SubCategory> subCategory;

}
