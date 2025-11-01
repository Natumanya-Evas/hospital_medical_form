package com.medic.ward;

import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import org.springframework.stereotype.Repository;

@Repository
public class BedDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void save(Bed bed) {
        entityManager.persist(bed);
    }

    public Bed getById(int id) {
        return entityManager.find(Bed.class, id);
    }

    public List<Bed> getAll() {
        return entityManager.createQuery("SELECT b FROM Bed b", Bed.class)
                            .getResultList();
    }

    @Transactional
    public void update(Bed bed) {
        entityManager.merge(bed);
    }

    @Transactional
    public void delete(Bed bed) {
        entityManager.remove(entityManager.contains(bed) ? bed : entityManager.merge(bed));
    }
}
