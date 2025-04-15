package com.br.ggastosservice.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.br.ggastosservice.dto.AccountCreditCardsDto;
import com.br.ggastosservice.model.Account;
import com.br.ggastosservice.model.CreditCard;

@Service
public class AccountCreditCardService {
    
    private AccountService accountService;

    private CreditCardService creditCardService;

    public AccountCreditCardService(AccountService accountService, CreditCardService creditCardService) {
        this.accountService = accountService;
        this.creditCardService = creditCardService;
    }

    public List<AccountCreditCardsDto> findAllAccountsAndCreditCards() {
        List<Account> accounts = accountService.findByEnabled(true);

        List<AccountCreditCardsDto> accountCreditCardsDtoList = new ArrayList<AccountCreditCardsDto>();
        for (Account account : accounts) {
            AccountCreditCardsDto accountCreditCardsDto = new AccountCreditCardsDto();
            accountCreditCardsDto.setAccount(account);

            List<CreditCard> creditCards = creditCardService
                .findByEnabledAndAccountId(true, account.getId());
            accountCreditCardsDto.setCreditCards(creditCards);

            accountCreditCardsDtoList.add(accountCreditCardsDto);
        }
        return accountCreditCardsDtoList;
    }
}
