package com.br.ggastosservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.br.ggastosservice.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    
}
