package com.br.ggastosservice.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//import com.br.ggastosservice.model.Expense;
//import com.br.ggastosservice.service.ExpenseService;

@RestController
@RequestMapping("/expense")
public class ExpenseController {
    
    /*
    {
        "id": 1,
        "amount": 150.75,
        "description": "Compra de material de escritório",
        "paidDate": "2024-08-15",
        "paymentDate": "",
        "createDate": "",
        "updateDate": "",
        "user": {
            "id": 1
        },
        "category": {
            "id": 0
        },
        "subCategory": {
            "id": 1
        }
    }
    */

    /*

    private ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping()
    public Expense create(@RequestBody Expense account) {
        System.out.println("");
        return expenseService.create(account);
    }

    */
}
