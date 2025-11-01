package com.medic.vitals;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BiometricsService {

    @Autowired
    private BiometricsDao biometricsDao;

    public void save(Biometrics biometrics) {
        biometricsDao.save(biometrics);
    }

    // Return DTO instead of entity
    public Biometrics getById(int id) {
        Biometrics biometrics = biometricsDao.getById(id);
        return biometrics;
    }

    // Optional: Alias method also returning DTO
    public BiometricsDTO getBiometricById(int id) {
        Biometrics biometrics = biometricsDao.getById(id);
        return convertBiometricsToDTO(biometrics);
    }

    // Return DTO instead of entity
    public BiometricsDTO getByPatientId(int patientId) {
        Biometrics biometrics = biometricsDao.getByPatientId(patientId);
        return convertBiometricsToDTO(biometrics);
    }

    // Return list of DTOs
    public List<BiometricsDTO> getAll() {
        List<Biometrics> biometricsList = biometricsDao.getAllBiometrics();
        return biometricsList.stream()
                .map(this::convertBiometricsToDTO)
                .collect(Collectors.toList());
    }

    public void update(Biometrics biometrics) {
        biometricsDao.update(biometrics);
    }

    public void delete(Biometrics biometrics) {
        biometricsDao.delete(biometrics);
    }

    // Helper converter
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
}
