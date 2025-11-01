package com.medic.medication;

public class DosageDTO {
        private int id;

    private String drugName;
    private String amount;

    private String prescription;

    private String caution;

    private String note;

    private MedicinePriceDTO medicinePrice;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDrugName() {
        return drugName;
    }

    public void setDrugName(String drugName) {
        this.drugName = drugName;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getPrescription() {
        return prescription;
    }

    public void setPrescription(String prescription) {
        this.prescription = prescription;
    }

    public String getCaution() {
        return caution;
    }

    public void setCaution(String caution) {
        this.caution = caution;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public MedicinePriceDTO getMedicinePrice() {
        return medicinePrice;
    }

    public void setMedicinePrice(MedicinePriceDTO medicinePrice) {
        this.medicinePrice = medicinePrice;
    }

     
}
