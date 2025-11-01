package com.medic.vitals;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VitalsService {

    @Autowired
    private VitalsDao vitalsDao;

    public void save(Vitals vitals) {
        vitalsDao.save(vitals);
    }

    // Return DTO instead of entity
    public VitalsDTO getById(int id) {
        Vitals vitals = vitalsDao.getById(id);
        return convertVitalsToDTO(vitals);
    }

      public Vitals getVitalsById(int id) {
        Vitals vitals = vitalsDao.getById(id);
        return vitals;
    }
    

    // Return DTO instead of entity
    public VitalsDTO getByPatientId(int patientId) {
        Vitals vitals = vitalsDao.getByPatientId(patientId);
        return convertVitalsToDTO(vitals);
    }

    // Return list of DTOs
    public List<VitalsDTO> getAllVitals() {
        List<Vitals> vitalsList = vitalsDao.getAllVitals();
        return vitalsList.stream()
                .map(this::convertVitalsToDTO)
                .collect(Collectors.toList());
    }

    public void update(Vitals vitals) {
        vitalsDao.update(vitals);
    }

    public void delete(Vitals vitals) {
        vitalsDao.delete(vitals);
    }

    // DTO converter
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
}
