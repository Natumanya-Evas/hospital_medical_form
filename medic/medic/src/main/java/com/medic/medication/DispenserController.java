package com.medic.medication;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dispensers")
public class DispenserController {

    private final DispenserService service;

    public DispenserController(DispenserService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Dispenser> create(@RequestBody Dispenser dispenser) {
        service.create(dispenser);
        return ResponseEntity.ok(dispenser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Dispenser> update(@PathVariable int id, @RequestBody Dispenser dispenser) {
        dispenser.setId(id);
        service.update(dispenser);
        return ResponseEntity.ok(dispenser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable int id) {
        service.delete(id);
        return ResponseEntity.ok("Dispenser deleted successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<DispenserDTO> getById(@PathVariable int id) {
        DispenserDTO dispenser = service.getById(id);
        return ResponseEntity.ok(dispenser);
    }

    @GetMapping
    public ResponseEntity<List<DispenserDTO>> getAll() {
        List<DispenserDTO > dispensers = service.getAll();
        return ResponseEntity.ok(dispensers);
    }
}
