package com.medic.visit;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import org.springframework.stereotype.Repository;

@Repository
public class VisitDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void save(Visit visit) {
        entityManager.persist(visit);
    }

    public Visit getById(int id) {
        return entityManager.find(Visit.class, id);
    }

    public List<Visit> getAll(){
        String sql = "select v from Visit v";
        List<Visit> list = entityManager.createQuery(sql,Visit.class)
        .getResultList();

        return list;

    }

    public List<Visit> getByPatientId(int patientId) {
        String jpql = "SELECT v FROM Visit v WHERE v.patient.id = :patientId";
        return entityManager.createQuery(jpql, Visit.class)
                            .setParameter("patientId", patientId)
                            .getResultList();
    }

    @Transactional
    public void update(Visit visit) {
        entityManager.merge(visit);
    }

    @Transactional
    public void delete(Visit visit) {
        entityManager.remove(entityManager.contains(visit) ? visit : entityManager.merge(visit));
    }
}
