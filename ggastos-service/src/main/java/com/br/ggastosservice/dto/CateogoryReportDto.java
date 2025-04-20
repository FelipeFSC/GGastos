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
public class CateogoryReportDto {

    private List<String> colors;

    private List<CategotyDataReportDto> data;

}
