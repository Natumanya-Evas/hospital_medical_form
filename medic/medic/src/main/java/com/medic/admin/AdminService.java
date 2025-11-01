package com.medic.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    @Autowired
    private AdminDao adminDao;

    public void saveAdmin(Admin admin) {
        adminDao.saveAdmin(admin);
    }
    public AdminUtil getAdminById(int id) {
        return adminDao.getAdminById(id);
    }
    public Admin authenticateAdmin(String username, String password) {
        return adminDao.authenticateAdmin(username, password);
    }

}
