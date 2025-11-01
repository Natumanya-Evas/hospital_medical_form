package com.medic.ward;

import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import org.springframework.stereotype.Repository;

@Repository
public class WardDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void save(Ward ward) {
        entityManager.persist(ward);
    }

    public Ward getById(int id) {
        return entityManager.find(Ward.class, id);
    }

    public List<Ward> getAll() {
        return entityManager.createQuery("SELECT w FROM Ward w", Ward.class)
                            .getResultList();
    }

    @Transactional
    public void update(Ward ward) {
        entityManager.merge(ward);
    }

    @Transactional
    public void delete(Ward ward) {
        entityManager.remove(entityManager.contains(ward) ? ward : entityManager.merge(ward));
    }
}
