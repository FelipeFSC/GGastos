package com.br.ggastosservice.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.br.ggastosservice.model.Account;
import com.br.ggastosservice.service.AccountService;

@RestController
@RequestMapping("/accounts")
public class AccountController {
    
    private AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/{accountId}/enabled/{enabled}")
    public List<Account> findByEnabled(@PathVariable boolean enabled) throws Exception {
        return accountService.findByEnabled(enabled);
    }

    @GetMapping("/{accountId}")
    public Account findOne(@PathVariable long accountId) throws Exception {
        return accountService.findOne(accountId);
    }

    @PostMapping()
    public Account create(@RequestBody Account account) throws Exception {
        return accountService.create(account);
    }

    @PutMapping("/{accountId}")
    public void update(@RequestBody Account account, @PathVariable long accountId) throws Exception {
        accountService.update(account, accountId);
    }

    @DeleteMapping("/{accountId}")
    public void disable(@PathVariable long accountId) throws Exception {
        accountService.disable(accountId);
    }

}
