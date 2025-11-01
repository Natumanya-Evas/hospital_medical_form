package com.medic.medication;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dosages")
public class DosageController {

    private final DosageService service;

    public DosageController(DosageService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Dosage> create(@RequestBody Dosage dosage) {
        return ResponseEntity.ok(service.create(dosage));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Dosage> update(@PathVariable int id, @RequestBody Dosage dosage) {
        dosage.setId(id);
        return ResponseEntity.ok(service.update(dosage));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DosageDTO> getById(@PathVariable int id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<DosageDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
