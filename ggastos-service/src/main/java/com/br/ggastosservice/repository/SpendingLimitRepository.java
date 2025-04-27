package com.br.ggastosservice.repository;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;

import com.br.ggastosservice.model.SpendingLimit;

public interface SpendingLimitRepository extends JpaRepository<SpendingLimit, Long> {
    
    SpendingLimit findByCategoryIdAndFilterDateBetween(long categoryId, LocalDateTime inicio, LocalDateTime fim);

}
