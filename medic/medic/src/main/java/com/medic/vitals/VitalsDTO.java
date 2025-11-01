package com.medic.vitals;

public class VitalsDTO {
    private int id;
    private double temperature;
    private int heartRate;
    private int bloodPressureSystolic;
    private int bloodPressureDiastolic;
    private int respiratoryRate;
    private double oxygenSaturation;
    private String note;


    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public double getTemperature() {
        return temperature;
    }
    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }
    public int getHeartRate() {
        return heartRate;
    }
    public void setHeartRate(int heartRate) {
        this.heartRate = heartRate;
    }
    public int getBloodPressureSystolic() {
        return bloodPressureSystolic;
    }
    public void setBloodPressureSystolic(int bloodPressureSystolic) {
        this.bloodPressureSystolic = bloodPressureSystolic;
    }
    public int getBloodPressureDiastolic() {
        return bloodPressureDiastolic;
    }
    public void setBloodPressureDiastolic(int bloodPressureDiastolic) {
        this.bloodPressureDiastolic = bloodPressureDiastolic;
    }
    public int getRespiratoryRate() {
        return respiratoryRate;
    }
    public void setRespiratoryRate(int respiratoryRate) {
        this.respiratoryRate = respiratoryRate;
    }
    public double getOxygenSaturation() {
        return oxygenSaturation;
    }
    public void setOxygenSaturation(double oxygenSaturation) {
        this.oxygenSaturation = oxygenSaturation;
    }
    public String getNote() {
        return note;
    }
    public void setNote(String note) {
        this.note = note;
    }


    
    
}
