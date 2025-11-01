package com.medic.patient;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @PostMapping
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
        patientService.savePatient(patient);
        return ResponseEntity.ok(patient);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientDTO> getPatient(@PathVariable int id) {
        PatientDTO patient = patientService.getPatientById(id);
        if (patient == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(patient);
    }

    @GetMapping
    public ResponseEntity<List<PatientDTO>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable int id, @RequestBody Patient patient) {
        patient.setId(id);
        patientService.updatePatient(patient);
        return ResponseEntity.ok(patient);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable int id) {
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }

    // New POST endpoint for bed assignment
    @PostMapping("/{patientId}/bed")
    public ResponseEntity<Void> assignBedToPatient(
            @PathVariable int patientId, 
            @RequestBody BedAssignmentRequest request) {
        try {
            patientService.assignBedToPatient(patientId, request.getBedId());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Request DTO for bed assignment
    public static class BedAssignmentRequest {
        private Integer bedId;
        
        public Integer getBedId() { 
            return bedId; 
        }
        
        public void setBedId(Integer bedId) { 
            this.bedId = bedId; 
        }
    }
}