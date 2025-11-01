package com.medic.result;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/diagnoses")
public class DiagnosisController {

    @Autowired
    private DiagnosisService diagnosisService;

    @PostMapping
    public ResponseEntity<Diagnosis> create(@RequestBody Diagnosis diagnosis) {
        diagnosisService.save(diagnosis);
        return ResponseEntity.ok(diagnosis);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Diagnosis> update(@PathVariable int id, @RequestBody Diagnosis diagnosis) {
        diagnosis.setId(id);
        diagnosisService.update(diagnosis);
        return ResponseEntity.ok(diagnosis);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        Diagnosis diagnosis = diagnosisService.getDiagnosisById(id);
        if (diagnosis != null) {
            diagnosisService.delete(diagnosis);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiagnosisDTO> getById(@PathVariable int id) {
        DiagnosisDTO diagnosis = diagnosisService.getById(id);
        return diagnosis != null ? ResponseEntity.ok(diagnosis) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public List<DiagnosisDTO> getAll() {
        return diagnosisService.getAll();
    }

    @GetMapping("/patient/{patientId}")
    public List<DiagnosisDTO> getByPatient(@PathVariable int patientId) {
        return diagnosisService.getByPatientId(patientId);
    }
}
