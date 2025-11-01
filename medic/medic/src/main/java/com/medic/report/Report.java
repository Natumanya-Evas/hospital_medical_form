package com.medic.report;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.Period;
import java.util.Set;

import com.medic.medication.DosageDTO;
import com.medic.result.DiagnosisDTO;
import com.medic.result.ResultDTO;
import com.medic.vitals.BiometricsDTO;
import com.medic.vitals.VitalsDTO;

public class Report {
    private int id;
    private String patientName;
    private Timestamp reportDate;
    private VitalsDTO vitals;
    private BiometricsDTO biometrics;
    private String gender;
    private int age;
    private Set<DiagnosisDTO> diagnosis;
    private Set<ResultDTO> result;
    private String physicianName;
    private Set<DosageDTO> dosage;
    private String summary;
    private Double bmi;
    private boolean hasCriticalVitals;
    private String bmiCategory;

    public Report() {}

    // Utility methods
    public void calculateAge(LocalDate dateOfBirth) {
        if (dateOfBirth != null) {
            this.age = Period.between(dateOfBirth, LocalDate.now()).getYears();
        }
    }

    public void calculateBmi() {
        if (biometrics != null && biometrics.getHeight() > 0) {
            double heightInMeters = biometrics.getHeight() / 100.0;
            this.bmi = biometrics.getMass() / (heightInMeters * heightInMeters);
            
            // Set BMI category
            if (bmi < 18.5) {
                this.bmiCategory = "Underweight";
            } else if (bmi < 25) {
                this.bmiCategory = "Normal";
            } else if (bmi < 30) {
                this.bmiCategory = "Overweight";
            } else {
                this.bmiCategory = "Obese";
            }
        }
    }

    public void evaluateCriticalVitals() {
        if (vitals != null) {
            hasCriticalVitals = 
                vitals.getTemperature() > 39.0 || vitals.getTemperature() < 35.0 ||
                vitals.getHeartRate() > 120 || vitals.getHeartRate() < 50 ||
                vitals.getBloodPressureSystolic() > 180 || vitals.getBloodPressureDiastolic() > 120 ||
                vitals.getBloodPressureSystolic() < 90 || vitals.getBloodPressureDiastolic() < 60 ||
                vitals.getRespiratoryRate() > 30 || vitals.getRespiratoryRate() < 10 ||
                vitals.getOxygenSaturation() < 92;
        }
    }

    // Helper methods for report generation
    public String getFormattedPatientInfo() {
        return String.format("%s, %d years, %s", patientName, age, gender);
    }

    public String getFormattedBloodPressure() {
        if (vitals != null) {
            return String.format("%d/%d mmHg", 
                vitals.getBloodPressureSystolic(), 
                vitals.getBloodPressureDiastolic());
        }
        return "N/A";
    }

    public boolean hasMedications() {
        return dosage != null && !dosage.isEmpty();
    }

    public boolean hasTestResults() {
        return result != null && !result.isEmpty();
    }

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public Timestamp getReportDate() { return reportDate; }
    public void setReportDate(Timestamp reportDate) { this.reportDate = reportDate; }

    public VitalsDTO getVitals() { return vitals; }
    public void setVitals(VitalsDTO vitals) { this.vitals = vitals; }

    public BiometricsDTO getBiometrics() { return biometrics; }
    public void setBiometrics(BiometricsDTO biometrics) { this.biometrics = biometrics; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public Set<DiagnosisDTO> getDiagnosis() { return diagnosis; }
    public void setDiagnosis(Set<DiagnosisDTO> diagnosis) { this.diagnosis = diagnosis; }

    public Set<ResultDTO> getResult() { return result; }
    public void setResult(Set<ResultDTO> result) { this.result = result; }

    public String getPhysicianName() { return physicianName; }
    public void setPhysicianName(String physicianName) { this.physicianName = physicianName; }

    public Set<DosageDTO> getDosage() { return dosage; }
    public void setDosage(Set<DosageDTO> dosage) { this.dosage = dosage; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public Double getBmi() { return bmi; }
    public void setBmi(Double bmi) { this.bmi = bmi; }

    public boolean isHasCriticalVitals() { return hasCriticalVitals; }
    public void setHasCriticalVitals(boolean hasCriticalVitals) { this.hasCriticalVitals = hasCriticalVitals; }

    public String getBmiCategory() { return bmiCategory; }
    public void setBmiCategory(String bmiCategory) { this.bmiCategory = bmiCategory; }
}