package com.br.ggastosservice.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.br.ggastosservice.model.RecurrenceType;
import com.br.ggastosservice.model.TransactionType;
import com.br.ggastosservice.repository.RecurrenceTypeRepository;
import com.br.ggastosservice.repository.TransactionTypeRepository;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private TransactionTypeRepository transactionTypeRepository;

    @Autowired
    private RecurrenceTypeRepository recurrenceTypeRepository;

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
        }

        if (recurrenceTypeRepository.count() == 0) {
            Object types[][] = {
                {"Semanal",    7,  0, 0},
                {"Quinzenal",  15, 0, 0},
                {"Mensal",     0,  1, 0},
                {"Bimestral",  0,  2, 0},
                {"Trimestral", 0,  3, 0},
                {"Semestral",  0,  6, 0},
                {"Anual",      0,  0, 1},
            };

            for (Object type[] : types) {
                RecurrenceType recurrenceType = new RecurrenceType();
                recurrenceType.setName((String) type[0]);
                recurrenceType.setDay((int) type[1]);
                recurrenceType.setMonth((int) type[2]);
                recurrenceType.setYear((int) type[3]);

                recurrenceTypeRepository.save(recurrenceType);
            }
        }

        System.out.println("✔ Dados iniciais inseridos.");
    }

}
