package com.medic.ward;

public class BedDTO {
    private int bedId;
    private String bedNumber;
    private int bedRow;
    private int bedColumn;
    private boolean isOccupied;
    private int wardId;
  
    public int getBedId() {
        return bedId;
    }
    public void setBedId(int bedId) {
        this.bedId = bedId;
    }
    public String getBedNumber() {
        return bedNumber;
    }
    public void setBedNumber(String bedNumber) {
        this.bedNumber = bedNumber;
    }
    public int getBedRow() {
        return bedRow;
    }
    public void setBedRow(int bedRow) {
        this.bedRow = bedRow;
    }
    public int getBedColumn() {
        return bedColumn;
    }
    public void setBedColumn(int bedColumn) {
        this.bedColumn = bedColumn;
    }
    public boolean isOccupied() {
        return isOccupied;
    }
    public void setOccupied(boolean isOccupied) {
        this.isOccupied = isOccupied;
    }
    public int getWardId() {
        return wardId;
    }
    public void setWardId(int wardId) {
        this.wardId = wardId;
    }
    
    
}
