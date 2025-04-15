package com.br.ggastosservice.dto;

import java.util.List;

import com.br.ggastosservice.model.Account;
import com.br.ggastosservice.model.CreditCard;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AccountCreditCardsDto {
    
    private Account account;

    private List<CreditCard> creditCards;

}
