package com.medic.visit;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VisitService {

    @Autowired
    private VisitDao visitDao;

    public void save(Visit visit) {
        visitDao.save(visit);
    }

    // Return DTO instead of entity
    public VisitDto getById(int id) {
        Visit visit = visitDao.getById(id);
        return convertVisitToDTO(visit);
    }

    public Visit getVisitById(int id){
        return visitDao.getById(id);
    }

    // Return List<VisitDto> instead of List<Visit>
    public List<VisitDto> getAll() {
        List<Visit> visits = visitDao.getAll();
        return visits.stream()
                .map(this::convertVisitToDTO)
                .collect(Collectors.toList());
    }

    // Return List<VisitDto> for patient visits
    public List<VisitDto> getByPatientId(int patientId) {
        List<Visit> visits = visitDao.getByPatientId(patientId);
        return visits.stream()
                .map(this::convertVisitToDTO)
                .collect(Collectors.toList());
    }

    public void update(Visit visit) {
        visitDao.update(visit);
    }

    public void delete(Visit visit) {
        visitDao.delete(visit);
    }

    // Helper to convert to DTO
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
}
