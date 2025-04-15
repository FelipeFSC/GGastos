package com.br.ggastosservice.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.br.ggastosservice.model.Account;
import com.br.ggastosservice.model.CreditCard;
import com.br.ggastosservice.repository.CreditCardRepository;

@Service
public class CreditCardService {
    
    private AccountService accountService;

    private CreditCardRepository creditCardRepository;

    public CreditCardService(CreditCardRepository creditCardRepository,
            AccountService accountService) {
        this.creditCardRepository = creditCardRepository;
        this.accountService = accountService;
    }

    public List<CreditCard> findByEnabled(boolean enabled) {
        return creditCardRepository.findByEnabled(enabled);
    }

    public List<CreditCard> findByEnabledAndAccountId(boolean enabled, long accountId) {
        return creditCardRepository.findByEnabledAndAccountId(enabled, accountId);
    }

    public CreditCard findOne(long id) throws Exception {
        Optional<CreditCard> creditCard = creditCardRepository.findById(id);
        if (creditCard == null || !creditCard.isPresent()) {
            throw new Exception("Credit card id: " +id+ ", não encontrado!");
        }
        return creditCard.get();
    }

    public CreditCard create(CreditCard creditCard) throws Exception {
        Account account = accountService.findOne(creditCard.getAccount().getId());
        creditCard.setAccount(account);
        creditCard.setIcon(creditCard.getIcon().trim().toLowerCase());
        creditCard.setEnabled(true);
        creditCardRepository.save(creditCard);
        return creditCard;
    }

    public void update(CreditCard creditCard, long creditCardId) throws Exception {
        findOne(creditCardId);
        creditCard.setId(creditCardId);
        creditCard.setEnabled(true);
        creditCardRepository.save(creditCard);
    }

    public void disable(long creditCardId) throws Exception {
        CreditCard creditCard = findOne(creditCardId);
        creditCard.setEnabled(false);
        creditCardRepository.save(creditCard);
    }

}
