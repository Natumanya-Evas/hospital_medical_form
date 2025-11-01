package com.medic.result;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import org.springframework.stereotype.Repository;

@Repository
public class DiagnosisDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void save(Diagnosis diagnosis) {
        entityManager.persist(diagnosis);
    }

    @Transactional
    public void update(Diagnosis diagnosis) {
        entityManager.merge(diagnosis);
    }

    @Transactional
    public void delete(Diagnosis diagnosis) {
        entityManager.remove(entityManager.contains(diagnosis) ? diagnosis : entityManager.merge(diagnosis));
    }

    public Diagnosis getById(int id) {
        return entityManager.find(Diagnosis.class, id);
    }

    public List<Diagnosis> getAll() {
        return entityManager.createQuery("SELECT d FROM Diagnosis d", Diagnosis.class)
                .getResultList();
    }

    public List<Diagnosis> getByPatientId(int patientId) {
        return entityManager.createQuery("SELECT d FROM Diagnosis d WHERE d.patient.id = :patientId", Diagnosis.class)
                .setParameter("patientId", patientId)
                .getResultList();
    }
}
