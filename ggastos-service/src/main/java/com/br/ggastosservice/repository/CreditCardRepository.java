package com.br.ggastosservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.br.ggastosservice.model.CreditCard;

public interface CreditCardRepository extends JpaRepository<CreditCard, Long> {
    
}
