package com.br.ggastosservice.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.br.ggastosservice.dto.AccountCreditCardsDto;
import com.br.ggastosservice.model.Account;
import com.br.ggastosservice.service.AccountCreditCardService;
import com.br.ggastosservice.service.AccountService;

@RestController
@RequestMapping("/accounts")
public class AccountController {

    private AccountService accountService;

    private AccountCreditCardService accountCreditCardService;

    public AccountController(AccountService accountService,
            AccountCreditCardService accountCreditCardService) {
        this.accountService = accountService;
        this.accountCreditCardService = accountCreditCardService;
    }

    @GetMapping("/enabled/{enabled}")
    public List<Account> findByEnabled(@PathVariable boolean enabled) throws Exception {
        return accountService.findByEnabled(enabled);
    }

    @GetMapping("/{accountId}")
    public Account findOne(@PathVariable long accountId) throws Exception {
        return accountService.findOne(accountId);
    }

    @GetMapping("/credit-cards")
    public List<AccountCreditCardsDto> findAllAccountsAndCreditCards() {
        return accountCreditCardService.findAllAccountsAndCreditCards();
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

    @GetMapping("/update-balance")
    public BigDecimal getGeneralBalance() {
        return accountService.getGeneralBalance();
    }

    @PutMapping("/{accountId}/update-balance")
    public void updateBalance(@PathVariable long accountId) throws Exception {
        accountService.updateBalance(accountId);
    }

}
