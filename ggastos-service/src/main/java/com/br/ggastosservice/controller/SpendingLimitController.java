package com.br.ggastosservice.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.br.ggastosservice.model.SpendingLimit;
import com.br.ggastosservice.service.SpendingLimitService;

@RestController
@RequestMapping("/spending-limit")
public class SpendingLimitController {
    
    private SpendingLimitService spendingLimitService;

    private SpendingLimitController(SpendingLimitService spendingLimitService) {
        this.spendingLimitService = spendingLimitService;
    }

    @GetMapping("/{spendingLimitId}")
    public SpendingLimit findById(@PathVariable("spendingLimitId") long spendingLimitId) throws Exception {
        return spendingLimitService.findOne(spendingLimitId);
    }

    @GetMapping("")
    public List<SpendingLimit> findAll() throws Exception {
        return spendingLimitService.findAll();
    }

    @PostMapping()
    public void create(@RequestBody SpendingLimit spendingLimit) throws Exception {
        spendingLimitService.create(spendingLimit);
    }
    
}
