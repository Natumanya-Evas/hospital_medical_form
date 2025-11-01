package com.medic.patient;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medic.medication.Dosage;
import com.medic.medication.DosageDTO;
import com.medic.medication.MedicinePrice;
import com.medic.medication.MedicinePriceDTO;
import com.medic.result.Diagnosis;
import com.medic.result.DiagnosisDTO;
import com.medic.result.Result;
import com.medic.result.ResultDTO;
import com.medic.vitals.Biometrics;
import com.medic.vitals.BiometricsDTO;
import com.medic.vitals.Vitals;
import com.medic.vitals.VitalsDTO;
import com.medic.ward.Bed;
import com.medic.ward.BedDTO;
import com.medic.visit.Visit;
import com.medic.visit.VisitDto;

@Service
public class PatientService {

    @Autowired
    private PatientDao patientDao;

    public void savePatient(Patient patient) {
        patientDao.savePatient(patient);
    }

    @Transactional(readOnly = true)
    public List<PatientDTO> getAllPatients() {
        List<Patient> patients = patientDao.getAllPatients();
        return patients.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PatientDTO getPatientById(int id) {
        Patient patient = patientDao.getPatientById(id);
        return convertToDTO(patient);
    }

    public void updatePatient(Patient patient) {
        patientDao.updatePatient(patient);
    }

    public void deletePatient(int id) {
        patientDao.deletePatient(id);
    }

    // Add this method for bed assignment
    @Transactional
    public void assignBedToPatient(int patientId, Integer bedId) {
        patientDao.assignBedToPatient(patientId, bedId);
    }

    // Main conversion method from Patient entity to PatientDTO
    private PatientDTO convertToDTO(Patient patient) {
        if (patient == null) {
            return null;
        }

        // Convert all nested objects
        AddressDto addressDto = convertAddressToDTO(patient.getAddress());
        BedDTO bedDTO = convertBedToDTO(patient.getBed());
        VitalsDTO vitalsDTO = convertVitalsToDTO(patient.getVitals());
        BiometricsDTO biometricsDTO = convertBiometricsToDTO(patient.getBiometrics());
        Set<VisitDto> visitDTOs = convertVisitsToDTO(patient.getVisits());
        Set<DosageDTO> dosageDTOs = convertDosagesToDTO(patient.getDosages());
        Set<DiagnosisDTO> diagnosisDTOs = convertDiagnosesToDTO(patient.getDiagnoses());
        Set<ResultDTO> resultDTOs = convertResultsToDTO(patient.getResults());

        // Create PatientDTO with basic info
        PatientDTO patientDTO = new PatientDTO(
            patient.getId(),
            patient.getFirstName(),
            patient.getLastName(),
            patient.getMiddleName(),
            patient.getDateOfBirth(),
            patient.getGender(),
            patient.getContactNumber(),
            addressDto,
            bedDTO,
            vitalsDTO,
            biometricsDTO
        );

        // Set the collections
        patientDTO.setVisits(visitDTOs);
        patientDTO.setDosages(dosageDTOs);
        patientDTO.setDiagnoses(diagnosisDTOs);
        patientDTO.setResults(resultDTOs);

        return patientDTO;
    }

    private AddressDto convertAddressToDTO(Address address) {
        if (address == null) {
            return null;
        }
        AddressDto addressDto = new AddressDto();
        addressDto.setStreet(address.getStreet());
        addressDto.setCity(address.getCity());
        addressDto.setState(address.getState());
        addressDto.setZipCode(address.getZipCode());
        return addressDto;
    }

    private BedDTO convertBedToDTO(Bed bed) {
        if (bed == null) {
            return null;
        }
        BedDTO bedDTO = new BedDTO();
        bedDTO.setBedId(bed.getId());
        bedDTO.setBedNumber(bed.getBedNumber());
        bedDTO.setBedRow(bed.getBedRow());
        bedDTO.setBedColumn(bed.getBedColumn());
        bedDTO.setOccupied(bed.isOccupied());
        if (bed.getWard() != null) {
            bedDTO.setWardId(bed.getWard().getId());
        }
        return bedDTO;
    }

    private VitalsDTO convertVitalsToDTO(Vitals vitals) {
        if (vitals == null) {
            return null;
        }
        VitalsDTO vitalsDTO = new VitalsDTO();
        vitalsDTO.setId(vitals.getId());
        vitalsDTO.setTemperature(vitals.getTemperature());
        vitalsDTO.setHeartRate(vitals.getHeartRate());
        vitalsDTO.setBloodPressureSystolic(vitals.getBloodPressureSystolic());
        vitalsDTO.setBloodPressureDiastolic(vitals.getBloodPressureDiastolic());
        vitalsDTO.setRespiratoryRate(vitals.getRespiratoryRate());
        vitalsDTO.setOxygenSaturation(vitals.getOxygenSaturation());
        vitalsDTO.setNote(vitals.getNote());
        return vitalsDTO;
    }

    private BiometricsDTO convertBiometricsToDTO(Biometrics biometrics) {
        if (biometrics == null) {
            return null;
        }
        BiometricsDTO biometricsDTO = new BiometricsDTO();
        biometricsDTO.setId(biometrics.getId());
        biometricsDTO.setMass(biometrics.getMass());
        biometricsDTO.setHeight(biometrics.getHeight());
        biometricsDTO.setWaistCircumference(biometrics.getWaistCircumference());
        biometricsDTO.setBmi(biometrics.getBmi());
        return biometricsDTO;
    }

    private Set<VisitDto> convertVisitsToDTO(Set<Visit> visits) {
        if (visits == null) {
            return null;
        }
        return visits.stream()
                .map(this::convertVisitToDTO)
                .collect(Collectors.toSet());
    }

    private VisitDto convertVisitToDTO(Visit visit) {
        if (visit == null) {
            return null;
        }
        VisitDto visitDTO = new VisitDto();
        visitDTO.setId(visit.getId());
        visitDTO.setReason(visit.getReason());
        visitDTO.setVisitType(visit.getVisitType());
        visitDTO.setVisitDate(visit.getVisitDate());
        visitDTO.setEndDate(visit.getEndDate());
        visitDTO.setActive(visit.isActive());
        return visitDTO;
    }

    private Set<DosageDTO> convertDosagesToDTO(Set<Dosage> dosages) {
        if (dosages == null) {
            return null;
        }
        return dosages.stream()
                .map(this::convertDosageToDTO)
                .collect(Collectors.toSet());
    }

    private DosageDTO convertDosageToDTO(Dosage dosage) {
        if (dosage == null) {
            return null;
        }
        DosageDTO dosageDTO = new DosageDTO();
        dosageDTO.setId(dosage.getId());
        dosageDTO.setDrugName(dosage.getDrugName());
        dosageDTO.setAmount(dosage.getAmount());
        dosageDTO.setPrescription(dosage.getPrescription());
        dosageDTO.setCaution(dosage.getCaution());
        dosageDTO.setNote(dosage.getNote());
        
        // Convert MedicinePrice
        MedicinePriceDTO medicinePriceDTO = convertMedicinePriceToDTO(dosage.getMedicinePrice());
        dosageDTO.setMedicinePrice(medicinePriceDTO);
        
        return dosageDTO;
    }

    private MedicinePriceDTO convertMedicinePriceToDTO(MedicinePrice medicinePrice) {
        if (medicinePrice == null) {
            return null;
        }
        MedicinePriceDTO medicinePriceDTO = new MedicinePriceDTO();
        medicinePriceDTO.setId(medicinePrice.getId());
        medicinePriceDTO.setQuantity(medicinePrice.getQuantity());
        medicinePriceDTO.setUnitMeasure(medicinePrice.getUnitMeasure());
        medicinePriceDTO.setPrice(medicinePrice.getPrice());
        return medicinePriceDTO;
    }

    private Set<DiagnosisDTO> convertDiagnosesToDTO(Set<Diagnosis> diagnoses) {
        if (diagnoses == null) {
            return null;
        }
        return diagnoses.stream()
                .map(this::convertDiagnosisToDTO)
                .collect(Collectors.toSet());
    }

    private DiagnosisDTO convertDiagnosisToDTO(Diagnosis diagnosis) {
        if (diagnosis == null) {
            return null;
        }
        DiagnosisDTO diagnosisDTO = new DiagnosisDTO();
        diagnosisDTO.setId(diagnosis.getId());
        diagnosisDTO.setDiagnosed(diagnosis.getDiagnosed());
        diagnosisDTO.setSymptoms(diagnosis.getSymptoms());
        diagnosisDTO.setSigns(diagnosis.getSigns());
        diagnosisDTO.setTreatment(diagnosis.getTreatment());
        return diagnosisDTO;
    }

    private Set<ResultDTO> convertResultsToDTO(Set<Result> results) {
        if (results == null) {
            return null;
        }
        return results.stream()
                .map(this::convertResultToDTO)
                .collect(Collectors.toSet());
    }

    private ResultDTO convertResultToDTO(Result result) {
        if (result == null) {
            return null;
        }
        ResultDTO resultDTO = new ResultDTO();
        resultDTO.setId(result.getId());
        resultDTO.setResultCode(result.getResultCode());
        resultDTO.setDescription(result.getDescription());
        resultDTO.setResultType(result.getResultType());
        resultDTO.setTestMethod(result.getTestMethod());
        resultDTO.setNotes(result.getNotes());
        resultDTO.setCreatedAt(result.getCreatedAt());
        return resultDTO;
    }
}