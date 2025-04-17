package com.br.ggastosservice.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.br.ggastosservice.model.TransactionType;
import com.br.ggastosservice.repository.TransactionTypeRepository;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private TransactionTypeRepository transactionTypeRepository;

    @Override
    public void run(String... args) {
        if (transactionTypeRepository.count() == 0) {
            String types[] = {
                "entrada",
                "saida",
                "transferencia"
            };

            for (String type : types) {
                TransactionType transactionType = new TransactionType();
                transactionType.setName(type);
                transactionTypeRepository.save(transactionType);
            }

            System.out.println("✔ Dados iniciais inseridos.");
        }
    }

}
