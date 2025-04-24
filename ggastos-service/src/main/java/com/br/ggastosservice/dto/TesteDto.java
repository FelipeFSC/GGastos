package com.br.ggastosservice.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TesteDto {
    
    private long accountId;

    private long categoryId;

    private List<TransactionUploadDto> transactions;

}
