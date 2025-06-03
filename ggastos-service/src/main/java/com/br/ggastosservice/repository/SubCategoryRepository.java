package com.br.ggastosservice.repository;

import com.br.ggastosservice.model.SubCategory;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SubCategoryRepository extends JpaRepository<SubCategory, Long> {

    @Query(value = "SELECT * FROM sub_category WHERE enabled = 1", nativeQuery = true)
    public List<SubCategory> listAllSubCategoriesEnableds();

    List<SubCategory> findByCategoryIdAndEnabled(long categoryId, boolean enabled);
}