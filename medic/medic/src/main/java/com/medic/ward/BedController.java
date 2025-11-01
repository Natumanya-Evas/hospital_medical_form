package com.medic.ward;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/beds")
public class BedController {

    @Autowired
    private BedService bedService;

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody Bed bed) {
        bedService.save(bed);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BedDTO> getById(@PathVariable int id) {
        BedDTO bed = bedService.getById(id);
        if (bed != null) {
            return ResponseEntity.ok(bed);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<BedDTO>> getAll() {
        return ResponseEntity.ok(bedService.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable int id, @RequestBody Bed updatedBed) {
        Bed existing = bedService.getBedById(id);
        if (existing != null) {
            updatedBed.setId(id);
            bedService.update(updatedBed);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        Bed bed = bedService.getBedById(id);
        if (bed != null) {
            bedService.delete(bed);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
