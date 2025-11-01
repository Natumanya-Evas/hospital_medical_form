package com.medic.vitals;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/biometrics")
public class BiometricsController {

    @Autowired
    private BiometricsService biometricsService;


    @GetMapping
    public ResponseEntity<List<BiometricsDTO>> getAllBiometrics(){
    List<BiometricsDTO> list = biometricsService.getAll();
    return ResponseEntity.ok(list);
    
}
    @PostMapping
    public ResponseEntity<Void> create(@RequestBody Biometrics biometrics) {
        biometricsService.save(biometrics);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BiometricsDTO> getById(@PathVariable int id) {
        return ResponseEntity.ok(biometricsService.getBiometricById(id));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<BiometricsDTO> getByPatient(@PathVariable int patientId) {
        return ResponseEntity.ok(biometricsService.getByPatientId(patientId));
    }

    @PutMapping
    public ResponseEntity<Void> update(@RequestBody Biometrics biometrics) {
        biometricsService.update(biometrics);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        Biometrics b = biometricsService.getById(id);
        biometricsService.delete(b);
        return ResponseEntity.noContent().build();
    }
}
