package com.br.ggastosservice.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.br.ggastosservice.model.SpendingLimit;

public interface SpendingLimitRepository extends JpaRepository<SpendingLimit, Long> {
    
    SpendingLimit findByCategoryIdAndFilterDateBetween(long categoryId, LocalDateTime inicio, LocalDateTime fim);

    List<SpendingLimit> findByFilterDateBetween(LocalDateTime inicio, LocalDateTime fim);

}
