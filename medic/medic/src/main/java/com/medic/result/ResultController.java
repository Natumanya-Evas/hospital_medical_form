package com.medic.result;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
public class ResultController {

    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    @PostMapping
    public ResponseEntity<Result> create(@RequestBody Result result) {
        resultService.save(result);
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<List<ResultDTO>> getAllResults(){
        List<ResultDTO> results = resultService.getAllResults();
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResultDTO> getById(@PathVariable int id) {
        ResultDTO result = resultService.getById(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<ResultDTO>> getByPatient(@PathVariable int patientId) {
        List<ResultDTO> results = resultService.getByPatientId(patientId);
        return ResponseEntity.ok(results);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Result> update(@PathVariable int id, @RequestBody Result updatedResult) {
        updatedResult.setId(id);
        resultService.update(updatedResult);
        return ResponseEntity.ok(updatedResult);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        Result result = resultService.getResultById(id);
        resultService.delete(result);
        return ResponseEntity.noContent().build();
    }
}
