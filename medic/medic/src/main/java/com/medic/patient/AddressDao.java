package com.medic.patient;

import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import org.springframework.stereotype.Repository;

@Repository
public class AddressDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void save(Address address) {
        entityManager.merge(address);
    }

    @Transactional
    public Address update(Address address) {
        return entityManager.merge(address);
    }

    public Address findById(int id) {
        return entityManager.find(Address.class, id);
    }

    public List<Address> findAll() {
        return entityManager.createQuery("from Address", Address.class).getResultList();
    }

    @Transactional
    public void delete(int id) {
        Address address = entityManager.find(Address.class, id);
        if (address != null) {
            entityManager.remove(address);
        }
    }
}
