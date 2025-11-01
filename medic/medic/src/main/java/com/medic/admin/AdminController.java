package com.medic.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/admin")
    public ResponseEntity<Void> createAdmin(@RequestBody Admin admin) {
        adminService.saveAdmin(admin);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
            

    @GetMapping("/admin/{id}")
    public ResponseEntity<AdminUtil> getAdmin(@PathVariable int id) {
        AdminUtil admin = adminService.getAdminById(id);
        return ResponseEntity.ok(admin);
    }

    @PostMapping("/admin/authenticate")
    public ResponseEntity<Admin> authenticateAdmin(@RequestBody Admin admin) {
        Admin authenticatedAdmin = adminService.authenticateAdmin(admin.getUsername(), admin.getPassword());
        if (authenticatedAdmin != null) {
            return ResponseEntity.ok(authenticatedAdmin);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

}
