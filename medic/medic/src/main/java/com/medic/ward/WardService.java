package com.medic.ward;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class WardService {

    @Autowired
    private WardDao wardDao;

    @PersistenceContext
    private EntityManager entityManager;

    public void save(Ward ward) {
        wardDao.save(ward);
    }

    @Transactional(readOnly = true)
    public Ward getByWardId(int id) {
        // Use JOIN FETCH to eagerly load beds
        String hql = "SELECT w FROM Ward w LEFT JOIN FETCH w.beds WHERE w.id = :id";
        return entityManager.createQuery(hql, Ward.class)
                .setParameter("id", id)
                .getSingleResult();
    }

    @Transactional(readOnly = true)
    public WardDTO getById(int id) {
        // Use JOIN FETCH to eagerly load beds
        String hql = "SELECT w FROM Ward w LEFT JOIN FETCH w.beds WHERE w.id = :id";
        Ward ward = entityManager.createQuery(hql, Ward.class)
                .setParameter("id", id)
                .getSingleResult();
        return convertToWardDTO(ward);
    }

    @Transactional(readOnly = true)
    public List<WardDTO> getAll() {
        // Use JOIN FETCH to eagerly load beds for all wards
        String hql = "SELECT DISTINCT w FROM Ward w LEFT JOIN FETCH w.beds";
        List<Ward> wards = entityManager.createQuery(hql, Ward.class)
                .getResultList();
        return wards.stream()
                .map(this::convertToWardDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void update(Ward ward) {
        wardDao.update(ward);
    }

    @Transactional
    public void delete(Ward ward) {
        wardDao.delete(ward);
    }

    // New method: fetch Ward with Beds eagerly and return as DTO
    @Transactional(readOnly = true)
    public WardDTO getWardWithBeds(int id) {
        Ward ward = entityManager.createQuery(
                "SELECT w FROM Ward w LEFT JOIN FETCH w.beds WHERE w.id = :id", Ward.class)
                .setParameter("id", id)
                .getSingleResult();
        return convertToWardDTO(ward);
    }

    // Conversion method from Ward entity to WardDTO
    private WardDTO convertToWardDTO(Ward ward) {
        if (ward == null) {
            return null;
        }

        WardDTO wardDTO = new WardDTO();
        wardDTO.setWardId(ward.getId());
        wardDTO.setWardName(ward.getName());
        wardDTO.setLocation(ward.getLocation());

        // Convert beds to BedDTOs - now beds are eagerly loaded so no LazyInitializationException
        if (ward.getBeds() != null) {
            Set<BedDTO> bedDTOs = ward.getBeds().stream()
                    .map(this::convertToBedDTO)
                    .collect(Collectors.toSet());
            wardDTO.setBeds(bedDTOs);
        }

        return wardDTO;
    }

    // Conversion method from Bed entity to BedDTO
    private BedDTO convertToBedDTO(Bed bed) {
        if (bed == null) {
            return null;
        }

        BedDTO bedDTO = new BedDTO();
        bedDTO.setBedId(bed.getId());
        bedDTO.setBedNumber(bed.getBedNumber());
        bedDTO.setBedRow(bed.getBedRow());
        bedDTO.setBedColumn(bed.getBedColumn());
        bedDTO.setOccupied(bed.isOccupied());
        bedDTO.setWardId(bed.getWard().getId());

        return bedDTO;
    }
}