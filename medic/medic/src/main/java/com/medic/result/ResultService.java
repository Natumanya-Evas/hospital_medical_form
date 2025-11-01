package com.medic.result;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResultService {

    private final ResultDao resultDao;

    public ResultService(ResultDao resultDao) {
        this.resultDao = resultDao;
    }

    @Transactional
    public void save(Result result) {
        resultDao.save(result);
    }

    @Transactional
    public void update(Result result) {
        resultDao.update(result);
    }

    @Transactional
    public void delete(Result result) {
        resultDao.delete(result);
    }

    // ✅ Return DTO for single result
    public ResultDTO getById(int id) {
        Result result = resultDao.getById(id);
        return convertResultToDTO(result);
    }

    public Result getResultById(int id){
        return resultDao.getById(id);
    }





    // ✅ Return DTO list by patient
    public List<ResultDTO> getByPatientId(int patientId) {
        List<Result> results = resultDao.getByPatientId(patientId);
        return results.stream()
                .map(this::convertResultToDTO)
                .collect(Collectors.toList());
    }

    public List<ResultDTO> getAllResults(){
        List<Result> results = resultDao.getAllResults();
        return results.stream()
                .map(this::convertResultToDTO)
                .collect(Collectors.toList());
    }



  
    private ResultDTO convertResultToDTO(Result result) {
        if (result == null) return null;

        ResultDTO resultDTO = new ResultDTO();
        resultDTO.setId(result.getId());
        resultDTO.setResultCode(result.getResultCode());
        resultDTO.setDescription(result.getDescription());
        resultDTO.setResultType(result.getResultType());
        resultDTO.setTestMethod(result.getTestMethod());
        resultDTO.setNotes(result.getNotes());
        resultDTO.setCreatedAt(result.getCreatedAt());
        return resultDTO;
    }
}
