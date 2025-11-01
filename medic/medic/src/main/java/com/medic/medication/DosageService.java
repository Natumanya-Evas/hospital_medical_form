package com.medic.medication;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class DosageService {

    private final DosageDao dosageDao;

    public DosageService(DosageDao dosageDao) {
        this.dosageDao = dosageDao;
    }

    public Dosage create(Dosage dosage) {
        dosageDao.save(dosage);
        return dosage;
    }

    public Dosage update(Dosage dosage) {
        return dosageDao.update(dosage);
    }

    // ✅ Return DTO instead of entity
    public DosageDTO getById(int id) {
        Dosage dosage = dosageDao.findById(id);
        return dosage != null ? mapToDosageDTO(dosage) : null;
    }

    // ✅ Return list of DTOs instead of entities
    public List<DosageDTO> getAll() {
        return dosageDao.findAll()
                .stream()
                .map(this::mapToDosageDTO)
                .collect(Collectors.toList());
    }

    public void delete(int id) {
        dosageDao.delete(id);
    }

    // ✅ Mapping helpers
    private DosageDTO mapToDosageDTO(Dosage dosage) {
        if (dosage == null) return null;

        DosageDTO dto = new DosageDTO();
        dto.setId(dosage.getId());
        dto.setDrugName(dosage.getDrugName());
        dto.setAmount(dosage.getAmount());
        dto.setPrescription(dosage.getPrescription());
        dto.setCaution(dosage.getCaution());
        dto.setNote(dosage.getNote());
        dto.setMedicinePrice(mapToMedicinePriceDTO(dosage.getMedicinePrice()));
        return dto;
    }

    private MedicinePriceDTO mapToMedicinePriceDTO(MedicinePrice medicinePrice) {
        if (medicinePrice == null) return null;

        MedicinePriceDTO dto = new MedicinePriceDTO();
        dto.setId(medicinePrice.getId());
        dto.setQuantity(medicinePrice.getQuantity());
        dto.setUnitMeasure(medicinePrice.getUnitMeasure());
        dto.setPrice(medicinePrice.getPrice());
        return dto;
    }
}
