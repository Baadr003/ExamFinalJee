package com.pollu.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.pollu.demo.dto.BaseResponseDTO;
import com.pollu.demo.entities.User;
import com.pollu.demo.repositories.UserRepository;
import com.pollu.demo.services.PdfService;
import com.pollu.demo.services.PollutionService;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.extern.slf4j.Slf4j;

import java.security.Principal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/pollution")
@CrossOrigin(origins = "http://localhost:3000")
@Validated
@Slf4j
public class PollutionController {

    @Autowired
    private PdfService pdfService;

    @Autowired
    private PollutionService pollutionService;

    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/current")
    public ResponseEntity<?> getCurrentPollution(
            @RequestParam @DecimalMin("-90.0") @DecimalMax("90.0") double lat,
            @RequestParam @DecimalMin("-180.0") @DecimalMax("180.0") double lon) {
        try {
            return ResponseEntity.ok(pollutionService.getCurrentPollution(lat, lon));
        } catch (Exception e) {
            log.error("Error fetching current pollution", e);
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/forecast")
    public ResponseEntity<?> getForecast(
            @RequestParam @DecimalMin("-90.0") @DecimalMax("90.0") double lat,
            @RequestParam @DecimalMin("-180.0") @DecimalMax("180.0") double lon) {
        try {
            return ResponseEntity.ok(pollutionService.getForecast(lat, lon));
        } catch (Exception e) {
            log.error("Error fetching forecast", e);
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(
            @RequestParam @DecimalMin("-90.0") @DecimalMax("90.0") double lat,
            @RequestParam @DecimalMin("-180.0") @DecimalMax("180.0") double lon,
            @RequestParam long start,
            @RequestParam long end) {
        try {
            return ResponseEntity.ok(pollutionService.getHistory(lat, lon, start, end));
        } catch (Exception e) {
            log.error("Error fetching history", e);
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
    @GetMapping("/export-pdf")
public ResponseEntity<byte[]> exportPdf(
    @RequestParam double lat,
    @RequestParam double lon,
    @RequestParam String cityName) {
    try {
        BaseResponseDTO currentData = pollutionService.getCurrentPollution(lat, lon);
        BaseResponseDTO historyData = pollutionService.getHistory(lat, lon, 
            Instant.now().minusSeconds(86400).getEpochSecond(),
            Instant.now().getEpochSecond());

        byte[] pdfBytes = pdfService.generatePollutionReport(cityName, currentData, historyData);

        return ResponseEntity.ok()
            .header("Content-Type", "application/pdf")
            .header("Content-Disposition", 
                String.format("attachment; filename=rapport-pollution-%s-%s.pdf",
                    cityName, 
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmm"))))
            .body(pdfBytes);
    } catch (Exception e) {
        log.error("Error generating PDF", e);
        return ResponseEntity.internalServerError().build();
    }
}
    
}