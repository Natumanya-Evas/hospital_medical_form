package com.medic.result;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;

import com.medic.patient.Patient;
@Entity
@Table(name="diagnoses")
public class Diagnosis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name="diagnosed")
    private String diagnosed;

    @Column(name="symptoms")
    private String symptoms;

    @Column(name="signs")
    private String signs;

    @Column(name="treatment")
    private String treatment;
    @ManyToOne
    @JoinColumn(name="patient_id", nullable=false)
    private Patient patient;

    public Diagnosis() {

    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDiagnosed() {
        return diagnosed;
    }

    public void setDiagnosed(String diagnosed) {
        this.diagnosed = diagnosed;
    }

    public String getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
    }

    public String getSigns() {
        return signs;
    }
    public void setSigns(String signs) {
        this.signs = signs;
    }
    public String getTreatment() {
        return treatment;
    }

    public void setTreatment(String treatment) {
        this.treatment = treatment;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }  
    

}
