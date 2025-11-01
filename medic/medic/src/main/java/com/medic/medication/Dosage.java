package com.medic.medication;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.medic.patient.Patient;
@Entity
@Table(name = "dosage")
public class Dosage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;

    @Column(name = "drug_name", nullable = false)
    private String drugName;

    @Column(name = "amount", nullable = false)
    private String amount;

    @Column(name = "prescription", nullable = false)
    private String prescription;

    @Column(name = "caution")
    private String caution;

    @Column(name = "note")
    private String note;

    @OneToOne
    @JoinColumn(name = "medicine_price_id", nullable = true)
    private MedicinePrice medicinePrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dispenser_id", nullable = false)
    private Dispenser dispenser;
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = true)
    private Patient patient;

    public Dosage(){}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getDrugName() { return drugName; }
    public void setDrugName(String drugName) { this.drugName = drugName; }

    public String getAmount() { return amount; }
    public void setAmount(String amount) { this.amount = amount; }

    public String getPrescription() { return prescription; }
    public void setPrescription(String prescription) { this.prescription = prescription; }

    public String getCaution() { return caution; }
    public void setCaution(String caution) { this.caution = caution; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public MedicinePrice getMedicinePrice() { return medicinePrice; }
    public void setMedicinePrice(MedicinePrice medicinePrice) { this.medicinePrice = medicinePrice; }

    public Dispenser getDispenser() { return dispenser; }
    public void setDispenser(Dispenser dispenser) { this.dispenser = dispenser; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
}
