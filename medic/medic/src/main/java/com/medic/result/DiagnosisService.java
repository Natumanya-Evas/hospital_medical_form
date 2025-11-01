package com.medic.result;

import java.util.List;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DiagnosisService {

    @Autowired
    private DiagnosisDao diagnosisDao;

    public void save(Diagnosis diagnosis) {
        diagnosisDao.save(diagnosis);
    }

    public void update(Diagnosis diagnosis) {
        diagnosisDao.update(diagnosis);
    }

    public Diagnosis getDiagnosisById(int id){
        return diagnosisDao.getById(id);
    }

    public void delete(Diagnosis diagnosis) {
        diagnosisDao.delete(diagnosis);
    }

    // Return DTO
    public DiagnosisDTO getById(int id) {
        Diagnosis diagnosis = diagnosisDao.getById(id);
        return convertDiagnosisToDTO(diagnosis);
    }

    // Return list of DTOs
    public List<DiagnosisDTO> getAll() {
        List<Diagnosis> diagnoses = diagnosisDao.getAll();
        return diagnoses.stream()
                .map(this::convertDiagnosisToDTO)
                .collect(Collectors.toList());
    }

    public List<DiagnosisDTO> getByPatientId(int patientId) {
        List<Diagnosis> diagnoses = diagnosisDao.getByPatientId(patientId);
        return diagnoses.stream()
                .map(this::convertDiagnosisToDTO)
                .collect(Collectors.toList());
    }

    // DTO conversion helpers
    private DiagnosisDTO convertDiagnosisToDTO(Diagnosis diagnosis) {
        if (diagnosis == null) return null;

        DiagnosisDTO dto = new DiagnosisDTO();
        dto.setId(diagnosis.getId());
        dto.setDiagnosed(diagnosis.getDiagnosed());
        dto.setSymptoms(diagnosis.getSymptoms());
        dto.setSigns(diagnosis.getSigns());
        dto.setTreatment(diagnosis.getTreatment());
        return dto;
    }

    
}
