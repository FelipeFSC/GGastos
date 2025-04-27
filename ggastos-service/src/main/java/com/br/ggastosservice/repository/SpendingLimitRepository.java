package com.br.ggastosservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.br.ggastosservice.model.SpendingLimit;

public interface SpendingLimitRepository extends JpaRepository<SpendingLimit, Long> {
    
}
