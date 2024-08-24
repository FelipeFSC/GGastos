package com.br.ggastosservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.br.ggastosservice.model.CreditCard;

public interface CreditCardRepository extends JpaRepository<CreditCard, Long> {
    
    List<CreditCard> findByEnabled(boolean enabled);
    
}
