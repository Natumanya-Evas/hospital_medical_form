package com.medic.medication;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class DispenserService {

    private final DispenserDao dao;

    public DispenserService(DispenserDao dao) {
        this.dao = dao;
    }

    @Transactional
    public void create(Dispenser dispenser) {
        dao.save(dispenser);
    }

    @Transactional
    public void update(Dispenser dispenser) {
        dao.update(dispenser);
    }

    @Transactional
    public void delete(int id) {
        dao.delete(id);
    }

    public DispenserDTO getById(int id) {
        Dispenser dispenser = dao.getById(id);
        return convertToDTO(dispenser);
    }

    public List<DispenserDTO> getAll() {
        List<Dispenser> dispensers = dao.getAll();
        return dispensers.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private DispenserDTO convertToDTO(Dispenser dispenser) {
        if (dispenser == null) {
            return null;
        }

        DispenserDTO dto = new DispenserDTO();
        dto.setId(dispenser.getId());
        dto.setWorkName(dispenser.getWorkName());
        dto.setLocation(dispenser.getLocation());
        dto.setPhone(dispenser.getPhone());
        dto.setEmail(dispenser.getEmail());

        // Convert dosages to DTOs
        if (dispenser.getDosages() != null) {
            Set<DosageDTO> dosageDTOs = dispenser.getDosages().stream()
                    .map(this::convertDosageToDTO)
                    .collect(Collectors.toSet());
            dto.setDosages(dosageDTOs);
        }

        return dto;
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

        // Convert medicine price to DTO
        if (dosage.getMedicinePrice() != null) {
            MedicinePriceDTO medicinePriceDTO = convertMedicinePriceToDTO(dosage.getMedicinePrice());
            dosageDTO.setMedicinePrice(medicinePriceDTO);
        }

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
}