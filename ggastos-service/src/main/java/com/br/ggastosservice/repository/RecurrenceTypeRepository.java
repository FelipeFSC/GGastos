package com.br.ggastosservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.br.ggastosservice.model.RecurrenceType;

public interface RecurrenceTypeRepository extends JpaRepository<RecurrenceType, Long> {
    
}
