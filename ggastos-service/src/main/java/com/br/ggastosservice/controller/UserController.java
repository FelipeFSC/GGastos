package com.br.ggastosservice.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.br.ggastosservice.model.User;
import com.br.ggastosservice.service.UserService;

@RestController
@RequestMapping("/user")
public class UserController {
    
    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping()
    public User create(@RequestBody User user) {
        return userService.create(user);
    }

}
