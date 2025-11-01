package com.medic.ward;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "bed")
public class Bed {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bed_id", nullable = false)
    private int id;

    @Column(name = "bed_number", nullable = false)
    private String bedNumber;

    @Column(name = "bed_row", nullable = false)
    private int bedRow;

    @Column(name = "bed_column", nullable = false)
    private int bedColumn;

    @Column(name = "is_occupied", nullable = false)
    private boolean isOccupied;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ward_id", nullable = false)
    private Ward ward;
    
    public Bed() {}
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
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
    public Ward getWard() {
        return ward;
    }
    public void setWard(Ward ward) {
        this.ward = ward;
    }


    

    
}
