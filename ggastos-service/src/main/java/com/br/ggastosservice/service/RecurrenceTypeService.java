package com.br.ggastosservice.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.br.ggastosservice.model.RecurrenceType;
import com.br.ggastosservice.repository.RecurrenceTypeRepository;

@Transactional
@Service
public class RecurrenceTypeService {
    
    private RecurrenceTypeRepository recurrenceTypeRepository;

    public RecurrenceTypeService(RecurrenceTypeRepository recurrenceTypeRepository) {
        this.recurrenceTypeRepository = recurrenceTypeRepository;
    }

    public List<RecurrenceType> findAll() {
        return recurrenceTypeRepository.findAll();
    }

    public RecurrenceType findOne(long id) throws Exception  {
        Optional<RecurrenceType> recurrenceType = recurrenceTypeRepository.findById(id);
        if (recurrenceType == null || !recurrenceType.isPresent()) {
            throw new Exception("Recurrence type ID: " +id+ ", não encontrado!");
        }
        return recurrenceType.get();
    }

}
