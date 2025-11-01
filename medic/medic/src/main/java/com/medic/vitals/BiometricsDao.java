package com.medic.vitals;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import org.springframework.stereotype.Repository;

@Repository
public class BiometricsDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void save(Biometrics biometrics) {
        entityManager.persist(biometrics);
    }

    public Biometrics getById(int id) {
        return entityManager.find(Biometrics.class, id);
    }

    public List<Biometrics> getAllBiometrics(){
        String sql = "select a from Biometrics a";

        List<Biometrics> list = entityManager.createQuery(sql,Biometrics.class)
        .getResultList();
        return list;
    }

    public Biometrics getByPatientId(int patientId) {
        String jpql = "SELECT b FROM Biometrics b WHERE b.patient.id = :patientId";
        return entityManager.createQuery(jpql, Biometrics.class)
                            .setParameter("patientId", patientId)
                            .getSingleResult();
    }

    @Transactional
    public void update(Biometrics biometrics) {
        entityManager.merge(biometrics);
    }

    @Transactional
    public void delete(Biometrics biometrics) {
        entityManager.remove(entityManager.contains(biometrics) ? biometrics : entityManager.merge(biometrics));
    }
}
