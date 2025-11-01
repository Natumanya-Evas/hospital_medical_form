package com.medic.ward;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wards")
public class WardController {

    @Autowired
    private WardService wardService;

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody Ward ward) {
        wardService.save(ward);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<WardDTO> getById(@PathVariable int id) {
        WardDTO ward = wardService.getById(id);
        if (ward != null) {
            return ResponseEntity.ok(ward);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<WardDTO>> getAll() {
        return ResponseEntity.ok(wardService.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable int id, @RequestBody Ward updatedWard) {
        Ward existing = wardService.getByWardId(id);
        if (existing != null) {
            updatedWard.setId(id);
            wardService.update(updatedWard);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        Ward ward = wardService.getByWardId(id);
        if (ward != null) {
            wardService.delete(ward);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    


}
