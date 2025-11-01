package com.medic.report;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.medic.patient.PatientDTO;
import com.medic.result.DiagnosisDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private static final String PATIENT_API_BASE_URL = "http://localhost:8080/medic/api/patients";
    
    @Autowired
    private RestTemplate restTemplate;

    public Report generateReportFromPatientId(int patientId) {
        try {
            // Fetch complete patient data from existing API
            String patientUrl = PATIENT_API_BASE_URL + "/" + patientId;
            ResponseEntity<PatientDTO> response = restTemplate.getForEntity(patientUrl, PatientDTO.class);
            
            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                return null;
            }
            
            PatientDTO patient = response.getBody();
            return createReportFromPatientDTO(patient);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate report from patient API for ID: " + patientId, e);
        }
    }
    
    private Report createReportFromPatientDTO(PatientDTO patient) {
        Report report = new Report();
        
        // Basic patient info
        report.setId(patient.getId());
        report.setPatientName(patient.getFirstName() + " " + patient.getLastName());
        report.setGender(patient.getGender());
        report.setReportDate(new java.sql.Timestamp(System.currentTimeMillis()));
        
        // Calculate age from timestamp
        if (patient.getDateOfBirth() != null) {
            java.time.LocalDate dob = new java.sql.Timestamp(patient.getDateOfBirth().getTime())
                .toLocalDateTime().toLocalDate();
            report.calculateAge(dob);
        }
        
        // Convert VitalsDTO to VitalsDTO (they're already DTOs!)
        if (patient.getVitals() != null) {
            report.setVitals(patient.getVitals());
        }
        
        // Convert BiometricsDTO to BiometricsDTO
        if (patient.getBiometrics() != null) {
            report.setBiometrics(patient.getBiometrics());
        }
        
        // Convert diagnoses
        if (patient.getDiagnoses() != null) {
            report.setDiagnosis(patient.getDiagnoses());
        }
        
        // Convert results
        if (patient.getResults() != null) {
            report.setResult(patient.getResults());
        }
        
        // Convert dosages
        if (patient.getDosages() != null) {
            report.setDosage(patient.getDosages());
        }
        
        // Calculate derived fields
        report.calculateBmi();
        report.evaluateCriticalVitals();
        
        // Generate summary
        String summary = generateSummary(patient.getDiagnoses());
        report.setSummary(summary);
        
        return report;
    }
    
    private String generateSummary(java.util.Set<DiagnosisDTO> diagnoses) {
        if (diagnoses == null || diagnoses.isEmpty()) {
            return "No diagnoses available";
        }
        return diagnoses.stream()
            .map(DiagnosisDTO::getDiagnosed)
            .filter(diagnosed -> diagnosed != null && !diagnosed.trim().isEmpty())
            .collect(Collectors.joining("; "));
    }
    
    public Report getCompactReportFromPatientId(int patientId) {
        Report fullReport = generateReportFromPatientId(patientId);
        if (fullReport == null) {
            return null;
        }
        
        // Create compact version
        Report compact = new Report();
        compact.setId(fullReport.getId());
        compact.setPatientName(fullReport.getPatientName());
        compact.setAge(fullReport.getAge());
        compact.setGender(fullReport.getGender());
        compact.setSummary(fullReport.getSummary());
        compact.setHasCriticalVitals(fullReport.isHasCriticalVitals());
        compact.setBmi(fullReport.getBmi());
        compact.setBmiCategory(fullReport.getBmiCategory());
        
        return compact;
    }
}