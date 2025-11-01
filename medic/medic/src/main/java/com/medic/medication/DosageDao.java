package com.medic.medication;

import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import org.springframework.stereotype.Repository;

@Repository
public class DosageDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void save(Dosage dosage) {
        entityManager.persist(dosage);
    }

    @Transactional
    public Dosage update(Dosage dosage) {
        return entityManager.merge(dosage);
    }

    public Dosage findById(int id) {
        return entityManager.find(Dosage.class, id);
    }

    public List<Dosage> findAll() {
        return entityManager.createQuery("from Dosage", Dosage.class).getResultList();
    }

    @Transactional
    public void delete(int id) {
        Dosage dosage = entityManager.find(Dosage.class, id);
        if (dosage != null) {
            entityManager.remove(dosage);
        }
    }
}
