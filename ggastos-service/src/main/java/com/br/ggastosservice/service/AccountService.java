package com.br.ggastosservice.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.br.ggastosservice.model.Account;
import com.br.ggastosservice.repository.AccountRepository;

@Service
public class AccountService {
    
    private AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public Account findOne(long id) throws Exception  {
        Optional<Account> category = accountRepository.findById(id);
        if (category == null || !category.isPresent()) {
            throw new Exception("Account id: " +id+ ", não encontrado!");
        }
        return category.get();
    }

    public List<Account> findByEnabled(boolean enabled) {
        return accountRepository.findByEnabled(enabled);
    }

    public Account create(Account account) {
        account.setIcon(account.getIcon().trim().toLowerCase());
        account.setEnabled(true);
        accountRepository.save(account);
        return account;
    }

    public void update(Account account, long accountId) throws Exception {
        findOne(accountId);
        account.setId(accountId);
        account.setEnabled(true);
        accountRepository.save(account);
    }

    public void disable(long categoryId) throws Exception {
        Account account = findOne(categoryId);
        account.setEnabled(false);
        accountRepository.save(account);
    }

}
