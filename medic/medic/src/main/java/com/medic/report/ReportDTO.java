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

public class ReportDTO {
    private int id;
    private String patientName;
    private String gender;
    private int age;
    private Timestamp reportDate;
    private VitalsDTO vitals;
    private BiometricsDTO biometrics;
    private Set<DiagnosisDTO> diagnosis;
    private Set<ResultDTO> result;
    private Set<DosageDTO> dosage;
    private String summary;
    private boolean criticalVitals;
    private String bmiCategory;

    public ReportDTO() {}

    // Getters & Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public Timestamp getReportDate() {
        return reportDate;
    }

    public void setReportDate(Timestamp reportDate) {
        this.reportDate = reportDate;
    }

    public VitalsDTO getVitals() {
        return vitals;
    }

    public void setVitals(VitalsDTO vitals) {
        this.vitals = vitals;
    }

    public BiometricsDTO getBiometrics() {
        return biometrics;
    }

    public void setBiometrics(BiometricsDTO biometrics) {
        this.biometrics = biometrics;
    }

    public Set<DiagnosisDTO> getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(Set<DiagnosisDTO> diagnosis) {
        this.diagnosis = diagnosis;
    }

    public Set<ResultDTO> getResult() {
        return result;
    }

    public void setResult(Set<ResultDTO> result) {
        this.result = result;
    }

    public Set<DosageDTO> getDosage() {
        return dosage;
    }

    public void setDosage(Set<DosageDTO> dosage) {
        this.dosage = dosage;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public boolean isCriticalVitals() {
        return criticalVitals;
    }

    public void setCriticalVitals(boolean criticalVitals) {
        this.criticalVitals = criticalVitals;
    }

    public String getBmiCategory() {
        return bmiCategory;
    }

    public void setBmiCategory(String bmiCategory) {
        this.bmiCategory = bmiCategory;
    }

    // Utility methods
    public void calculateAge(LocalDate dateOfBirth) {
        if (dateOfBirth != null) {
            this.age = Period.between(dateOfBirth, LocalDate.now()).getYears();
        }
    }

    public void calculateBmi() {
        if (biometrics != null && biometrics.getHeight() > 0) {
            double heightInMeters = biometrics.getHeight() / 100.0; // convert cm to meters
            double bmi = biometrics.getMass() / (heightInMeters * heightInMeters);
            biometrics.setBmi(bmi);
            
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
        if (vitals == null) {
            this.criticalVitals = false;
            return;
        }

        boolean critical = 
            vitals.getTemperature() > 39.0 || vitals.getTemperature() < 35.0 || // High/Low fever
            vitals.getHeartRate() > 120 || vitals.getHeartRate() < 50 || // Tachycardia/Bradycardia
            vitals.getBloodPressureSystolic() > 180 || vitals.getBloodPressureDiastolic() > 120 || // Hypertension crisis
            vitals.getBloodPressureSystolic() < 90 || vitals.getBloodPressureDiastolic() < 60 || // Hypotension
            vitals.getRespiratoryRate() > 30 || vitals.getRespiratoryRate() < 10 || // Respiratory distress
            vitals.getOxygenSaturation() < 92; // Hypoxia

        this.criticalVitals = critical;
    }
}