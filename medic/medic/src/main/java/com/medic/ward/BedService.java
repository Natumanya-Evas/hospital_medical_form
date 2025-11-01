package com.medic.ward;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BedService {

    @Autowired
    private BedDao bedDao;

    public void save(Bed bed) {
        bedDao.save(bed);
    }

    public Bed getBedById(int id){
        return bedDao.getById(id);
    }

    public BedDTO getById(int id) {
        Bed bed = bedDao.getById(id);
        return convertToBedDTO(bed);
    }

    public List<BedDTO> getAll() {
        return bedDao.getAll()
                     .stream()
                     .map(this::convertToBedDTO)
                     .collect(Collectors.toList());
    }

    public void update(Bed bed) {
        bedDao.update(bed);
    }

    public void delete(Bed bed) {
        bedDao.delete(bed);
    }

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

        // Ward info (null-safe)
        if (bed.getWard() != null) {
            bedDTO.setWardId(bed.getWard().getId());

        }

        return bedDTO;
    }
}
