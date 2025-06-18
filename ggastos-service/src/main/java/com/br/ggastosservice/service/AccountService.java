package com.br.ggastosservice.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.br.ggastosservice.model.Account;
import com.br.ggastosservice.repository.AccountRepository;
import com.br.ggastosservice.repository.TransactionRepository;

@Service
public class AccountService {

    private AccountRepository accountRepository;

    private TransactionRepository transactionRepository;

    public AccountService(AccountRepository accountRepository,
            TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
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
        account.setBalance(BigDecimal.ZERO);
        account.setIcon(account.getIcon().trim().toLowerCase());
        account.setEnabled(true);
        accountRepository.save(account);
        return account;
    }

    public void update(Account account, long accountId) throws Exception {
        Account beforeAccout = findOne(accountId);
        account.setId(accountId);
        account.setEnabled(true);

        account.setBalance(beforeAccout.getBalance());
        accountRepository.save(account);
    }

    public void disable(long categoryId) throws Exception {
        Account account = findOne(categoryId);
        account.setEnabled(false);
        accountRepository.save(account);
    }

    public BigDecimal getGeneralBalance() {
        BigDecimal tatolIncome = transactionRepository.findTotalValues(1);
        BigDecimal totalExpense = transactionRepository.findTotalValues(2);

        tatolIncome = tatolIncome == null ? BigDecimal.ZERO : tatolIncome;
        totalExpense = totalExpense == null ? BigDecimal.ZERO : totalExpense;

        BigDecimal result = BigDecimal.ZERO;
        result = tatolIncome.add(totalExpense);
        return result;
    }

    public void updateBalance(long accountId) throws Exception {
        BigDecimal tatolIncome = transactionRepository.findTotalValuesByTransactionType(1, accountId);
        BigDecimal totalExpense = transactionRepository.findTotalValuesByTransactionType(2, accountId);

        tatolIncome = tatolIncome == null ? BigDecimal.ZERO : tatolIncome;
        totalExpense = totalExpense == null ? BigDecimal.ZERO : totalExpense;

        BigDecimal result = BigDecimal.ZERO;
        result = tatolIncome.add(totalExpense);

        Account account = findOne(accountId);
        account.setBalance(result);
        accountRepository.save(account);
    }

}
