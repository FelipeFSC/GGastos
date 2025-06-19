package com.br.ggastosservice.dto;

import java.math.BigDecimal;

public interface MonthlyTotalDto {

    String getMonth();

    String getType();

    BigDecimal getTotal();

}
