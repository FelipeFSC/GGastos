package com.br.ggastosservice.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.br.ggastosservice.dto.CateogoryReportDto;
import com.br.ggastosservice.dto.MonthlyTotalDto;
import com.br.ggastosservice.service.ReportService;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/category-report/{categoryTypeId}")
    public CateogoryReportDto generateCategoryReportDto(@PathVariable("categoryTypeId") long categoryTypeId) {
        return reportService.generateCategoryReportDto(categoryTypeId);
    }

    @GetMapping("/inputs-outputs/{year}")
    public List<MonthlyTotalDto> findMonthlyTotalsByYear(@PathVariable("year") int year) throws Exception {
        return reportService.findMonthlyTotalsByYear(year);
    }

}
