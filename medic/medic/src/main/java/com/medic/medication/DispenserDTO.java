package com.medic.medication;

import java.util.HashSet;
import java.util.Set;



public class DispenserDTO {
        private int  id;

    
    private String workName;

    
    private String location;

    
    private String phone;

    private String email;


    private Set<DosageDTO> dosages = new HashSet<>();


    public int getId() {
        return id;
    }


    public void setId(int id) {
        this.id = id;
    }


    public String getWorkName() {
        return workName;
    }


    public void setWorkName(String workName) {
        this.workName = workName;
    }


    public String getLocation() {
        return location;
    }


    public void setLocation(String location) {
        this.location = location;
    }


    public String getPhone() {
        return phone;
    }


    public void setPhone(String phone) {
        this.phone = phone;
    }


    public String getEmail() {
        return email;
    }


    public void setEmail(String email) {
        this.email = email;
    }


    public Set<DosageDTO> getDosages() {
        return dosages;
    }


    public void setDosages(Set<DosageDTO> dosages) {
        this.dosages = dosages;
    }




    
    
}
