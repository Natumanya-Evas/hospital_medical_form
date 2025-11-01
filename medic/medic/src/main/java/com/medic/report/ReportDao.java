package com.medic.report;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.stereotype.Repository;

import com.medic.patient.Patient;
import com.medic.vitals.Biometrics;
import com.medic.vitals.BiometricsDTO;
import com.medic.vitals.Vitals;
import com.medic.vitals.VitalsDTO;
import com.medic.result.Diagnosis;
import com.medic.result.DiagnosisDTO;
import com.medic.result.Result;
import com.medic.result.ResultDTO;
import com.medic.medication.Dosage;
import com.medic.medication.DosageDTO;

@Repository
public class ReportDao {
@PersistenceContext
    private EntityManager entityManager;

    public Report getReportByPatientId(int patientId) {
        try {
            // Use JOIN FETCH to eagerly load all required relationships in a single query
            String patientQuery = """
                SELECT DISTINCT p FROM Patient p 
                LEFT JOIN FETCH p.vitals 
                LEFT JOIN FETCH p.biometrics 
                WHERE p.id = :patientId
                """;
            
            TypedQuery<Patient> query = entityManager.createQuery(patientQuery, Patient.class);
            query.setParameter("patientId", patientId);
            
            Patient patient = query.getResultStream().findFirst().orElse(null);
            if (patient == null) {
                return null;
            }

            Report report = new Report();
            report.setId(patient.getId());
            report.setPatientName(patient.getFirstName() + " " + patient.getLastName());
            report.setGender(patient.getGender());
            report.setReportDate(new java.sql.Timestamp(System.currentTimeMillis()));

            // Calculate age
            if (patient.getDateOfBirth() != null) {
                report.calculateAge(patient.getDateOfBirth().toLocalDateTime().toLocalDate());
            }

            // Convert entities to DTOs - they're already loaded due to JOIN FETCH
            if (patient.getVitals() != null) {
                report.setVitals(convertToVitalsDTO(patient.getVitals()));
            }

            if (patient.getBiometrics() != null) {
                report.setBiometrics(convertToBiometricsDTO(patient.getBiometrics()));
            }

            // Fetch other entities with separate optimized queries
            Set<DiagnosisDTO> diagnosisDTOs = getDiagnosesWithJoinFetch(patientId);
            report.setDiagnosis(diagnosisDTOs);

            Set<ResultDTO> resultDTOs = getResultsWithJoinFetch(patientId);
            report.setResult(resultDTOs);

            Set<DosageDTO> dosageDTOs = getDosagesWithJoinFetch(patientId);
            report.setDosage(dosageDTOs);

            // Calculate derived fields
            report.calculateBmi();
            report.evaluateCriticalVitals();

            // Generate summary
            String summary = generateSummary(diagnosisDTOs);
            report.setSummary(summary);

            return report;

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate report for patient ID: " + patientId, e);
        }
    }

    private Set<DiagnosisDTO> getDiagnosesWithJoinFetch(int patientId) {
        try {
            String jpql = """
                SELECT d FROM Diagnosis d 
                LEFT JOIN FETCH d.patient 
                WHERE d.patient.id = :patientId
                """;
            
            List<Diagnosis> diagnoses = entityManager.createQuery(jpql, Diagnosis.class)
                .setParameter("patientId", patientId)
                .getResultList();
            
            return diagnoses.stream()
                .map(this::convertToDiagnosisDTO)
                .collect(Collectors.toSet());
        } catch (Exception e) {
            // Log error but return empty set to avoid breaking the entire report
            System.err.println("Error fetching diagnoses for patient " + patientId + ": " + e.getMessage());
            return Set.of();
        }
    }

    private Set<ResultDTO> getResultsWithJoinFetch(int patientId) {
        try {
            String jpql = """
                SELECT r FROM Result r 
                LEFT JOIN FETCH r.patient 
                WHERE r.patient.id = :patientId
                """;
            
            List<Result> results = entityManager.createQuery(jpql, Result.class)
                .setParameter("patientId", patientId)
                .getResultList();
            
            return results.stream()
                .map(this::convertToResultDTO)
                .collect(Collectors.toSet());
        } catch (Exception e) {
            System.err.println("Error fetching results for patient " + patientId + ": " + e.getMessage());
            return Set.of();
        }
    }

    private Set<DosageDTO> getDosagesWithJoinFetch(int patientId) {
        try {
            String jpql = """
                SELECT d FROM Dosage d 
                LEFT JOIN FETCH d.patient 
                LEFT JOIN FETCH d.medicinePrice 
                WHERE d.patient.id = :patientId
                """;
            
            List<Dosage> dosages = entityManager.createQuery(jpql, Dosage.class)
                .setParameter("patientId", patientId)
                .getResultList();
            
            return dosages.stream()
                .map(this::convertToDosageDTO)
                .collect(Collectors.toSet());
        } catch (Exception e) {
            System.err.println("Error fetching dosages for patient " + patientId + ": " + e.getMessage());
            return Set.of();
        }
    }

    // Conversion methods (same as before)
    private VitalsDTO convertToVitalsDTO(Vitals vitals) {
        if (vitals == null) return null;
        
        VitalsDTO dto = new VitalsDTO();
        dto.setId(vitals.getId());
        dto.setTemperature(vitals.getTemperature());
        dto.setHeartRate(vitals.getHeartRate());
        dto.setBloodPressureSystolic(vitals.getBloodPressureSystolic());
        dto.setBloodPressureDiastolic(vitals.getBloodPressureDiastolic());
        dto.setRespiratoryRate(vitals.getRespiratoryRate());
        dto.setOxygenSaturation(vitals.getOxygenSaturation());
        dto.setNote(vitals.getNote());
        return dto;
    }

    private BiometricsDTO convertToBiometricsDTO(Biometrics biometrics) {
        if (biometrics == null) return null;
        
        BiometricsDTO dto = new BiometricsDTO();
        dto.setId(biometrics.getId());
        dto.setMass(biometrics.getMass());
        dto.setHeight(biometrics.getHeight());
        dto.setWaistCircumference(biometrics.getWaistCircumference());
        dto.setBmi(biometrics.getBmi());
        return dto;
    }

    private DiagnosisDTO convertToDiagnosisDTO(Diagnosis diagnosis) {
        DiagnosisDTO dto = new DiagnosisDTO();
        dto.setId(diagnosis.getId());
        dto.setDiagnosed(diagnosis.getDiagnosed());
        dto.setSymptoms(diagnosis.getSymptoms());
        dto.setSigns(diagnosis.getSigns());
        dto.setTreatment(diagnosis.getTreatment());
        return dto;
    }

    private ResultDTO convertToResultDTO(Result result) {
        ResultDTO dto = new ResultDTO();
        dto.setId(result.getId());
        dto.setResultCode(result.getResultCode());
        dto.setDescription(result.getDescription());
        dto.setResultType(result.getResultType());
        dto.setTestMethod(result.getTestMethod());
        dto.setNotes(result.getNotes());
        dto.setCreatedAt(result.getCreatedAt());
        return dto;
    }

    private DosageDTO convertToDosageDTO(Dosage dosage) {
        DosageDTO dto = new DosageDTO();
        dto.setId(dosage.getId());
        dto.setDrugName(dosage.getDrugName());
        dto.setAmount(dosage.getAmount());
        dto.setPrescription(dosage.getPrescription());
        dto.setCaution(dosage.getCaution());
        dto.setNote(dosage.getNote());
        
        // MedicinePrice conversion if needed
        // if (dosage.getMedicinePrice() != null) {
        //     dto.setMedicinePrice(convertToMedicinePriceDTO(dosage.getMedicinePrice()));
        // }
        
        return dto;
    }

    private String generateSummary(Set<DiagnosisDTO> diagnoses) {
        if (diagnoses == null || diagnoses.isEmpty()) {
            return "No diagnoses available";
        }
        return diagnoses.stream()
            .map(DiagnosisDTO::getDiagnosed)
            .filter(diagnosed -> diagnosed != null && !diagnosed.trim().isEmpty())
            .collect(Collectors.joining("; "));
    }
}