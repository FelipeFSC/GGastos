package com.br.ggastosservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.br.ggastosservice.model.Category;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query(value = "SELECT * FROM category WHERE enabled = 1", nativeQuery = true)
    public List<Category> listAllCategoriesEnableds();

}
