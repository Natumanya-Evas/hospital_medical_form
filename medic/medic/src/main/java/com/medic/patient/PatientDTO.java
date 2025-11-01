package com.medic.patient;

import java.sql.Timestamp;
import java.util.Set;

import com.medic.medication.DosageDTO;
import com.medic.result.DiagnosisDTO;
import com.medic.result.ResultDTO;
import com.medic.visit.VisitDto;
import com.medic.vitals.BiometricsDTO;
import com.medic.vitals.VitalsDTO;
import com.medic.ward.BedDTO;

public class PatientDTO {
    private int id;
    private String firstName;
    private String lastName;
    private String middleName;
    private Timestamp dateOfBirth;
    private String gender;
    private String contactNumber;
    private AddressDto address;
    private BedDTO bed;
    private VitalsDTO vitals;
    private BiometricsDTO biometrics;
    private Set<DosageDTO> dosages;
    private Set<DiagnosisDTO> diagnoses;
    private Set<ResultDTO> results;
    private Set<VisitDto> visits;

    public PatientDTO() {}

    // Full constructor
    public PatientDTO(int id, String firstName, String lastName, String middleName,
                      Timestamp dateOfBirth, String gender, String contactNumber,
                      AddressDto address, BedDTO bed, VitalsDTO vitals, BiometricsDTO biometrics) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.middleName = middleName;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.contactNumber = contactNumber;
        this.address = address;
        this.bed = bed;
        this.vitals = vitals;
        this.biometrics = biometrics;
    }

    // Getters & Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public Timestamp getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(Timestamp dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public AddressDto getAddress() {
        return address;
    }

    public void setAddress(AddressDto address) {
        this.address = address;
    }

    public BedDTO getBed() {
        return bed;
    }

    public void setBed(BedDTO bed) {
        this.bed = bed;
    }

    public VitalsDTO getVitals() {
        return vitals;
    }

    public void setVitals(VitalsDTO vitals) {
        this.vitals = vitals;
    }

    public BiometricsDTO getBiometrics() {
        return biometrics;
    }

    public void setBiometrics(BiometricsDTO biometrics) {
        this.biometrics = biometrics;
    }

    public Set<DosageDTO> getDosages() {
        return dosages;
    }

    public void setDosages(Set<DosageDTO> dosages) {
        this.dosages = dosages;
    }

    public Set<DiagnosisDTO> getDiagnoses() {
        return diagnoses;
    }

    public void setDiagnoses(Set<DiagnosisDTO> diagnoses) {
        this.diagnoses = diagnoses;
    }

    public Set<ResultDTO> getResults() {
        return results;
    }

    public void setResults(Set<ResultDTO> results) {
        this.results = results;
    }

    public Set<VisitDto> getVisits() {
        return visits;
    }

    public void setVisits(Set<VisitDto> visits) {
        this.visits = visits;
    }


}
