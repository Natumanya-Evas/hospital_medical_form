package com.medic.result;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ResultDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void save(Result result) {
        entityManager.merge(result);
    }

    public Result getById(int id) {
        return entityManager.find(Result.class, id);
    }

    public List<Result> getByPatientId(int patientId) {
        String jpql = "SELECT r FROM Result r WHERE r.patient.id = :pid";
        return entityManager.createQuery(jpql, Result.class)
                .setParameter("pid", patientId)
                .getResultList();
    }

    @Transactional
    public void update(Result result) {
        entityManager.merge(result);
    }

    @Transactional
    public List<Result> getAllResults(){
        String sql = "select a from Result a";
        List<Result>  list = entityManager.createQuery(sql,Result.class)
        .getResultList();
        return list;
    }

    @Transactional
    public void delete(Result result) {
        entityManager.remove(entityManager.contains(result) ? result : entityManager.merge(result));
    }
}
