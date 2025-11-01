package com.medic.admin;

public class AdminUtil {
    private String username;
    private String name;
    private String role;

    // Constructor
    public AdminUtil(String username, String name, String role) {
        this.username = username;
        this.name = name;
        this.role = role;
    }

    // Getters
    public String getUsername() { return username; }
    public String getName() { return name; }
    public String getRole() { return role; }
}
