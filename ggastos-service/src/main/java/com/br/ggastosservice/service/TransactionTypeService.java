package com.br.ggastosservice.service;

import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.br.ggastosservice.model.TransactionType;
import com.br.ggastosservice.repository.TransactionTypeRepository;

@Transactional
@Service
public class TransactionTypeService {

    private TransactionTypeRepository transactionTypeRepository;

    public TransactionTypeService(TransactionTypeRepository transactionTypeRepository) {
        this.transactionTypeRepository = transactionTypeRepository;
    }

    public TransactionType findOne(long id) throws Exception  {
        Optional<TransactionType> transactionType = transactionTypeRepository.findById(id);
        if (transactionType == null || !transactionType.isPresent()) {
            throw new Exception("Transaction type ID: " +id+ ", não encontrado!");
        }
        return transactionType.get();
    }

}
