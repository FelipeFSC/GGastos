package com.br.ggastosservice.repository;

import com.br.ggastosservice.model.SubCategory;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubCategoryRepository extends JpaRepository<SubCategory, Long> {
    
    List<SubCategory> findByCategoryId(long categoryId);

}
