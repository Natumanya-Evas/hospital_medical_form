package com.medic.medication;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/medicine-prices")
public class MedicinePriceController {

    private final MedicinePriceService service;

    public MedicinePriceController(MedicinePriceService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<MedicinePrice> create(@RequestBody MedicinePrice price) {
        return ResponseEntity.ok(service.create(price));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicinePrice> update(@PathVariable int id, @RequestBody MedicinePrice price) {
        price.setId(id);
        return ResponseEntity.ok(service.update(price));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicinePrice> getById(@PathVariable int id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<MedicinePrice>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
