package com.medic.medication;

public class MedicinePriceDTO {
    private int id;
    private int quantity;
    private String unitMeasure;
    private double price;

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public int getQuantity() {
        return quantity;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
    public String getUnitMeasure() {
        return unitMeasure;
    }
    public void setUnitMeasure(String unitMeasure) {
        this.unitMeasure = unitMeasure;
    }
    public double getPrice() {
        return price;
    }
    public void setPrice(double price) {
        this.price = price;
    }

    
    
}
