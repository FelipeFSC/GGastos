package com.br.ggastosservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.br.ggastosservice.model.CreditCard;
import com.br.ggastosservice.service.CreditCardService;

@RestController
@RequestMapping("/credit-cards")
public class CreditCardController {
    
    private CreditCardService creditCardService;

    public CreditCardController(CreditCardService creditCardService) {
        this.creditCardService = creditCardService;
    }

    @ResponseBody
    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(method = RequestMethod.POST, consumes = {"application/json"}, produces = {"application/json"})
    public CreditCard create(@RequestBody CreditCard creditCard) {
        return creditCardService.create(creditCard);
    }

    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/{creditCardId}", method = RequestMethod.PUT)
    public void update(@PathVariable("creditCardId") long creditCardId, @RequestBody CreditCard creditCard) throws Exception {
        creditCardService.update(creditCard, creditCardId);
    }

    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/{creditCardId}", method = RequestMethod.DELETE)
    public void delete(@PathVariable("creditCardId") long creditCardId) throws Exception {
        creditCardService.disable(creditCardId);
    }

}
