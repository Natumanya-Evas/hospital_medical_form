package com.medic.patient;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AddressService {

    private final AddressDao addressDao;

    public AddressService(AddressDao addressDao) {
        this.addressDao = addressDao;
    }

    public Address create(Address address) {
        addressDao.save(address);
        return address;
    }
    public Address getAddressById(int id){
        return addressDao.findById(id);
    }

    public Address update(Address address) {
        return addressDao.update(address);
    }

    // ✅ Convert entity to DTO for getById
    public AddressDto getById(int id) {
        Address address = addressDao.findById(id);
        return convertToDto(address);
    }

    // ✅ Convert entity to DTO for getAll
    public List<AddressDto> getAll() {
        return addressDao.findAll()
                         .stream()
                         .map(this::convertToDto)
                         .collect(Collectors.toList());
    }

    public void delete(int id) {
        addressDao.delete(id);
    }

    // 🔹 Helper method for conversion
    private AddressDto convertToDto(Address address) {
        if (address == null) {
            return null;
        }
        AddressDto dto = new AddressDto();
        dto.setId(address.getId());
        dto.setStreet(address.getStreet());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setZipCode(address.getZipCode());
        return dto;
    }
}
