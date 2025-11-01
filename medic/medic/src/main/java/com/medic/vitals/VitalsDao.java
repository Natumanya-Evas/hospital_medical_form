package com.medic.vitals;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import org.springframework.stereotype.Repository;

@Repository
public class VitalsDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void save(Vitals vitals) {
        entityManager.persist(vitals);
    }

    public Vitals getById(int id) {
        return entityManager.find(Vitals.class, id);
    }

    public Vitals getByPatientId(int patientId) {
        String jpql = "SELECT v FROM Vitals v WHERE v.patient.id = :patientId";
        return entityManager.createQuery(jpql, Vitals.class)
                            .setParameter("patientId", patientId)
                            .getSingleResult();
    }

    @Transactional
    public List<Vitals> getAllVitals(){
        String sql = "select v from Vitals v";
        List<Vitals> list = entityManager.createQuery(sql,Vitals.class)
        .getResultList();
        return list;
        
    }

    @Transactional
    public void update(Vitals vitals) {
        entityManager.merge(vitals);
    }

    @Transactional
    public void delete(Vitals vitals) {
        entityManager.remove(entityManager.contains(vitals) ? vitals : entityManager.merge(vitals));
    }
}
