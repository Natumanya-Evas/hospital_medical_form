package com.medic.medication;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class MedicinePriceService {

    private final MedicinePriceDao medicinePriceDao;

    public MedicinePriceService(MedicinePriceDao medicinePriceDao) {
        this.medicinePriceDao = medicinePriceDao;
    }

    public MedicinePrice create(MedicinePrice price) {
        medicinePriceDao.save(price);
        return price;
    }

    public MedicinePrice update(MedicinePrice price) {
        return medicinePriceDao.update(price);
    }

    public MedicinePrice getById(int id) {
        return medicinePriceDao.findById(id);
    }

    public List<MedicinePrice> getAll() {
        return medicinePriceDao.findAll();
    }

    public void delete(int id) {
        medicinePriceDao.delete(id);
    }
}
