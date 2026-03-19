package com.br.ggastosservice.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.br.ggastosservice.model.User;
import com.br.ggastosservice.repository.UserRepository;

@Service
public class UserService {
    
    private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User findOne(long id) throws Exception {
        Optional<User> user = userRepository.findById(id);
        if (user == null || !user.isPresent()) {
            throw new Exception("User ID: " +id+ ", não encontrado!");
        }
        return user.get();
    }

    public User create(User user) {
        if (user.getName() == null || user.getName().trim().isEmpty()) {
            user.setName("Admin");
        }
        user.setCreateDate(LocalDateTime.now());
        userRepository.save(user);
        return user;
    }

    public User getOrCreateDefaultAdmin() {
        try {
            return findOne(1);
        } catch (Exception e) {
            User admin = new User();
            admin.setName("Admin");
            return create(admin);
        }
    }

}
