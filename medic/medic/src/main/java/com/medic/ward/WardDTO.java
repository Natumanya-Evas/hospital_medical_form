package com.medic.ward;

import java.util.Set;

public class WardDTO {
    private int wardId;
    private String wardName;
    private String location;
    private Set<BedDTO> beds;

    public WardDTO() {}

    public int getWardId() {
        return wardId;
    }

    public void setWardId(int wardId) {
        this.wardId = wardId;
    }

    public String getWardName() {
        return wardName;
    }

    public void setWardName(String wardName) {
        this.wardName = wardName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Set<BedDTO> getBeds() {
        return beds;
    }

    public void setBeds(Set<BedDTO> beds) {
        this.beds = beds;
    }
}
    