package com.medic.medication;

import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import org.springframework.stereotype.Repository;

@Repository
public class MedicinePriceDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void save(MedicinePrice price) {
        entityManager.persist(price);
    }

    @Transactional
    public MedicinePrice update(MedicinePrice price) {
        return entityManager.merge(price);
    }

    public MedicinePrice findById(int id) {
        return entityManager.find(MedicinePrice.class, id);
    }

    public List<MedicinePrice> findAll() {
        return entityManager.createQuery("from MedicinePrice", MedicinePrice.class).getResultList();
    }

    @Transactional
    public void delete(int id) {
        MedicinePrice price = entityManager.find(MedicinePrice.class, id);
        if (price != null) {
            entityManager.remove(price);
        }
    }
}
