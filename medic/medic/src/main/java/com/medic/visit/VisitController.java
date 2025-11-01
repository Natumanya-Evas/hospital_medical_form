package com.medic.visit;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/visits")
public class VisitController {

    @Autowired
    private VisitService visitService;

    @GetMapping
    public ResponseEntity<List<VisitDto>> getAllVisits(){
        List<VisitDto> list = visitService.getAll();
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody Visit visit) {
        visitService.save(visit);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<VisitDto> getById(@PathVariable int id) {
        return ResponseEntity.ok(visitService.getById(id));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<VisitDto>> getByPatient(@PathVariable int patientId) {
        return ResponseEntity.ok(visitService.getByPatientId(patientId));
    }

    @PutMapping
    public ResponseEntity<Void> update(@RequestBody Visit visit) {
        visitService.update(visit);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        Visit v = visitService.getVisitById(id);
        visitService.delete(v);
        return ResponseEntity.noContent().build();
    }
}
