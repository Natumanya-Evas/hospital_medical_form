package com.medic.vitals;

import javax.persistence.*;

import com.medic.patient.Patient;

@Entity
@Table(name = "vitals")
public class Vitals {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vital_id", nullable = false)
    private int id;

    @Column(name = "temperature", nullable = false)
    private double temperature;

    @Column(name = "heart_rate", nullable = false)
    private int heartRate;

    @Column(name = "blood_pressure_systolic", nullable = false)
    private int bloodPressureSystolic;

    @Column(name = "blood_pressure_diastolic", nullable = false)
    private int bloodPressureDiastolic;

    @Column(name = "respiratory_rate", nullable = false)
    private int respiratoryRate;

    @Column(name = "oxygen_saturation", nullable = false)
    private double oxygenSaturation;

    @Column(name = "note", nullable = true)
    private String note;

    // THIS IS THE FK TO PATIENT
    @OneToOne
    @JoinColumn(name = "patient_id", nullable = false, unique = true)
    private Patient patient;

    public Vitals() {}

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public double getTemperature() { return temperature; }
    public void setTemperature(double temperature) { this.temperature = temperature; }

    public int getHeartRate() { return heartRate; }
    public void setHeartRate(int heartRate) { this.heartRate = heartRate; }

    public int getBloodPressureSystolic() { return bloodPressureSystolic; }
    public void setBloodPressureSystolic(int bloodPressureSystolic) { this.bloodPressureSystolic = bloodPressureSystolic; }

    public int getBloodPressureDiastolic() { return bloodPressureDiastolic; }
    public void setBloodPressureDiastolic(int bloodPressureDiastolic) { this.bloodPressureDiastolic = bloodPressureDiastolic; }

    public int getRespiratoryRate() { return respiratoryRate; }
    public void setRespiratoryRate(int respiratoryRate) { this.respiratoryRate = respiratoryRate; }

    public double getOxygenSaturation() { return oxygenSaturation; }
    public void setOxygenSaturation(double oxygenSaturation) { this.oxygenSaturation = oxygenSaturation; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
}
