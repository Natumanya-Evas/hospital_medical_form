package com.medic.patient;

import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import org.springframework.stereotype.Repository;

import com.medic.ward.Bed;

@Repository
public class PatientDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void savePatient(Patient patient) {
        entityManager.persist(patient);
    }
  
    @Transactional
    public Patient getPatientById(int id) {
        try {
            String hql = "SELECT p FROM Patient p " +
                         "LEFT JOIN FETCH p.visits " +
                         "LEFT JOIN FETCH p.dosages d " +
                         "LEFT JOIN FETCH d.medicinePrice " +
                         "LEFT JOIN FETCH p.diagnoses " +
                         "LEFT JOIN FETCH p.results " +
                         "LEFT JOIN FETCH p.address " +
                         "LEFT JOIN FETCH p.bed " +
                         "LEFT JOIN FETCH p.vitals " +
                         "LEFT JOIN FETCH p.biometrics " +
                         "WHERE p.id = :id";
            
            return entityManager.createQuery(hql, Patient.class)
                    .setParameter("id", id)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }
    
    @Transactional
    public List<Patient> getAllPatients() {
        String hql = "SELECT DISTINCT p FROM Patient p " +
                     "LEFT JOIN FETCH p.visits " +
                     "LEFT JOIN FETCH p.dosages " +
                     "LEFT JOIN FETCH p.diagnoses " +
                     "LEFT JOIN FETCH p.results " +
                     "LEFT JOIN FETCH p.address " +
                     "LEFT JOIN FETCH p.bed " +
                     "LEFT JOIN FETCH p.vitals " +
                     "LEFT JOIN FETCH p.biometrics";
        
        return entityManager.createQuery(hql, Patient.class).getResultList();
    }

    @Transactional
    public void updatePatient(Patient patient) {
        entityManager.merge(patient);
    }

    @Transactional
    public void deletePatient(int id) {
        Patient patient = entityManager.find(Patient.class, id);
        if (patient != null) {
            entityManager.remove(patient);
        }
    }

    @Transactional
    public void assignBedToPatient(int patientId, Integer bedId) {
        // Find the patient with bed relationship
        Patient patient = getPatientById(patientId);
        if (patient == null) {
            throw new RuntimeException("Patient not found with id: " + patientId);
        }

        // Handle bed assignment or unassignment
        if (bedId == null) {
            // Unassign current bed if exists
            if (patient.getBed() != null) {
                Bed currentBed = patient.getBed();
                currentBed.setOccupied(false);
                entityManager.merge(currentBed); // Update bed occupancy
                patient.setBed(null);
                entityManager.merge(patient); // Update patient
            }
        } else {
            // Find the new bed
            Bed newBed = entityManager.find(Bed.class, bedId);
            if (newBed == null) {
                throw new RuntimeException("Bed not found with id: " + bedId);
            }

            // Check if bed is already occupied
            if (newBed.isOccupied()) {
                throw new RuntimeException("Bed " + bedId + " is already occupied");
            }

            // Unassign current bed if exists
            if (patient.getBed() != null) {
                Bed currentBed = patient.getBed();
                currentBed.setOccupied(false);
                entityManager.merge(currentBed);
            }

            // Assign new bed
            newBed.setOccupied(true);
            entityManager.merge(newBed);
            patient.setBed(newBed);
            entityManager.merge(patient);
        }
    }
}