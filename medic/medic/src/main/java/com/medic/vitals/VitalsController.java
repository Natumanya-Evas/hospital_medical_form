package com.medic.vitals;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/vitals")
public class VitalsController {

    @Autowired
    private VitalsService vitalsService;

    @GetMapping
    public ResponseEntity<List<VitalsDTO>> getAllVitals(){
        List<VitalsDTO> vitals = vitalsService.getAllVitals();
        return ResponseEntity.ok(vitals);
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody Vitals vitals) {
        vitalsService.save(vitals);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<VitalsDTO> getById(@PathVariable int id) {
        return ResponseEntity.ok(vitalsService.getById(id));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<VitalsDTO> getByPatient(@PathVariable int patientId) {
        return ResponseEntity.ok(vitalsService.getByPatientId(patientId));
    }

    @PutMapping
    public ResponseEntity<Void> update(@RequestBody Vitals vitals) {
        vitalsService.update(vitals);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        Vitals v = vitalsService.getVitalsById(id);
        vitalsService.delete(v);
        return ResponseEntity.noContent().build();
    }
}
