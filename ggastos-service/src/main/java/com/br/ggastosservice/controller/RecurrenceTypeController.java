package com.br.ggastosservice.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.br.ggastosservice.model.RecurrenceType;
import com.br.ggastosservice.service.RecurrenceTypeService;

@RestController
@RequestMapping("/recurrences-types")
public class RecurrenceTypeController {

    private RecurrenceTypeService recurrenceTypeService;

    public RecurrenceTypeController(RecurrenceTypeService recurrenceTypeService) {
        this.recurrenceTypeService = recurrenceTypeService;
    }

    @GetMapping()
    public List<RecurrenceType> findAll() throws Exception {
        return recurrenceTypeService.findAll();
    }

}
