package com.medic.visit;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.medic.patient.Patient;
@Entity
@Table(name = "visit")
public class Visit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "visit_id", nullable = false)
    private int id;
    @Column(name = "reason", nullable = false)
    private String reason;
    @Column(name = "visit_type", nullable = false)
    private String visitType;
    @Column(name = "visit_date", nullable = false)
    private Timestamp visitDate;
    @Column(name = "end_date", nullable = true)
    private Timestamp endDate;
    @Column(name = "is_active", nullable = false)
    private boolean isActive;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = true)
    private Patient patient;

    public Visit(){

    }
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getReason() {
        return reason;
    }
    public void setReason(String reason) {
        this.reason = reason;
    }
    public String getVisitType() {
        return visitType;
    }
    public void setVisitType(String visitType) {
        this.visitType = visitType;
    }
    public Timestamp getVisitDate() {
        return visitDate;
    }
    public void setVisitDate(Timestamp visitDate) {
        this.visitDate = visitDate;
    }
    public Timestamp getEndDate() {
        return endDate;
    }
    public void setEndDate(Timestamp endDate) {
        this.endDate = endDate;
    }
    public Patient getPatient() {
        return patient;
    }
    public void setPatient(Patient patient) {
        this.patient = patient;
    }
    public boolean isActive() {
        return isActive;
    }
    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }
    
    
   
    
  
}
