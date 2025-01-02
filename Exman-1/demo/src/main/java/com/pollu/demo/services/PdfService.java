package com.pollu.demo.services;

import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.*;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.pollu.demo.dto.BaseResponseDTO;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.ZoneOffset;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Table;

@Service
public class PdfService {
    
    public byte[] generatePollutionReport(String cityName, BaseResponseDTO current, BaseResponseDTO history) {
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
    
            // Header Section
            document.add(new Paragraph("Rapport de Qualité de l'Air")
                .setFontSize(24)
                .setTextAlignment(TextAlignment.CENTER)
                .setBold());
    
            // City and Date Info
            Table headerInfo = new Table(2);
            headerInfo.addCell(new Cell().add(new Paragraph("Ville: " + cityName))
                .setBorder(Border.NO_BORDER));
            headerInfo.addCell(new Cell().add(new Paragraph("Date: " + 
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))))
                .setBorder(Border.NO_BORDER)
                .setTextAlignment(TextAlignment.RIGHT));
            document.add(headerInfo);
    
            // Current Pollution Section
            document.add(new Paragraph("\nSituation Actuelle")
                .setFontSize(18)
                .setFontColor(ColorConstants.BLUE));
    
            Table currentTable = new Table(3);
            currentTable.setWidth(UnitValue.createPercentValue(100));
            currentTable.addHeaderCell(new Cell().add(new Paragraph("Polluant").setBold()));
            currentTable.addHeaderCell(new Cell().add(new Paragraph("Valeur").setBold()));
            currentTable.addHeaderCell(new Cell().add(new Paragraph("Unité").setBold()));
    
            if (current.getList() != null && !current.getList().isEmpty()) {
                var components = current.getList().get(0).getComponents();
                addTableRow(currentTable, "CO", components.getCo());
                addTableRow(currentTable, "NO₂", components.getNo2());
                addTableRow(currentTable, "O₃", components.getO3());
                addTableRow(currentTable, "PM2.5", components.getPm2_5());
                addTableRow(currentTable, "PM10", components.getPm10());
                addTableRow(currentTable, "SO₂", components.getSo2());
            }
            document.add(currentTable);
    
            // Historical Data Section
            document.add(new Paragraph("\nHistorique des 24 dernières heures")
                .setFontSize(18)
                .setFontColor(ColorConstants.BLUE));
    
            if (history.getList() != null && !history.getList().isEmpty()) {
                Table historyTable = new Table(4);
                historyTable.setWidth(UnitValue.createPercentValue(100));
                historyTable.addHeaderCell("Heure");
                historyTable.addHeaderCell("AQI");
                historyTable.addHeaderCell("PM2.5");
                historyTable.addHeaderCell("PM10");
    
                for (var item : history.getList()) {
                    LocalDateTime dateTime = LocalDateTime.ofEpochSecond(item.getDt(), 0, ZoneOffset.UTC);
                    historyTable.addCell(dateTime.format(DateTimeFormatter.ofPattern("HH:mm")));
                    historyTable.addCell(String.valueOf(item.getMain().getAqi()));
                    historyTable.addCell(String.format("%.1f", item.getComponents().getPm2_5()));
                    historyTable.addCell(String.format("%.1f", item.getComponents().getPm10()));
                }
                document.add(historyTable);
            }
    
            // Footer
            document.add(new Paragraph("\nRapport généré automatiquement")
                .setFontSize(10)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(ColorConstants.GRAY));
    
            document.close();
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }

    private void addTableRow(Table table, String pollutant, double value) {
        table.addCell(new Cell().add(new Paragraph(pollutant)));
        table.addCell(new Cell().add(new Paragraph(String.format("%.2f", value))));
        table.addCell(new Cell().add(new Paragraph("μg/m³")));
    }
}