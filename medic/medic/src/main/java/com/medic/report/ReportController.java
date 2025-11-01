package com.medic.report;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private PdfReportService  pdfReportService;

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getPatientReport(@PathVariable int patientId) {
        try {
            Report report = reportService.generateReportFromPatientId(patientId);
            if (report == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(createErrorResponse("Failed to generate report", e));
        }
    }
        @GetMapping("/patient/{patientId}/pdf")
    public ResponseEntity<byte[]> generatePdfReport(@PathVariable int patientId) {
        try {
            Report report = reportService.generateReportFromPatientId(patientId);
            if (report == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            byte[] pdfBytes = pdfReportService.generatePdfReport(report);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("filename", "medical-report-patient-" + patientId + ".pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
                
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/patient/{patientId}/compact")
    public ResponseEntity<?> getCompactPatientReport(@PathVariable int patientId) {
        try {
            Report report = reportService.getCompactReportFromPatientId(patientId);
            if (report == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(createErrorResponse("Failed to generate compact report", e));
        }
    }

    private Map<String, String> createErrorResponse(String message, Exception e) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", message);
        errorResponse.put("details", e.getMessage());
        errorResponse.put("timestamp", new java.util.Date().toString());
        return errorResponse;
    }
}