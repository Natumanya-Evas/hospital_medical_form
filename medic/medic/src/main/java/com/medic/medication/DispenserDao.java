package com.medic.medication;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.NoResultException;
import javax.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class DispenserDao {

    @PersistenceContext
    private EntityManager em;

    @Transactional
    public void save(Dispenser dispenser) {
        em.persist(dispenser);
    }

    @Transactional
    public void update(Dispenser dispenser) {
        em.merge(dispenser);
    }

    @Transactional
    public void delete(int id) {
        Dispenser d = em.find(Dispenser.class, id);
        if (d != null) {
            em.remove(d);
        }
    }

    public Dispenser getById(int id) {
        try {
            return em.createQuery(
                    "SELECT d FROM Dispenser d " +
                    "LEFT JOIN FETCH d.dosages dos " +
                    "LEFT JOIN FETCH dos.medicinePrice " +
                    "WHERE d.id = :id", 
                    Dispenser.class)
                    .setParameter("id", id)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    public List<Dispenser> getAll() {
        return em.createQuery(
                "SELECT DISTINCT d FROM Dispenser d " +
                "LEFT JOIN FETCH d.dosages dos " +
                "LEFT JOIN FETCH dos.medicinePrice", 
                Dispenser.class)
                .getResultList();
    }
}