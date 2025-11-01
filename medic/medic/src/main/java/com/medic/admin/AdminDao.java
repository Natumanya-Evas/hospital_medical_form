package com.medic.admin;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import org.springframework.stereotype.Repository;

@Repository
public class AdminDao {
    @PersistenceContext
    private EntityManager entityManager;

    public void setEntityManager(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Transactional
    public void saveAdmin(Admin admin) {
        entityManager.persist(admin);
    }
    @Transactional
public AdminUtil getAdminById(int id) {
    String hql = "SELECT new com.medic.admin.AdminUtil(a.username, a.name, a.role) " +
                 "FROM Admin a WHERE a.id = :id";
    return entityManager.createQuery(hql, AdminUtil.class)
                        .setParameter("id", id)
                        .getSingleResult();
}

    @Transactional
    public Admin authenticateAdmin(String username, String password) {
        String sql = "select username, name, role from Admin a where a.username = :username and a.password = :password";
        return entityManager.createQuery(sql, Admin.class)
                .setParameter("username", username)
                .setParameter("password", password)
                .getSingleResult();
    }   
    
}
