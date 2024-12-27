package com.pollu.demo.dto;


public class UserProfileUpdateDTO {
    
    @jakarta.validation.constraints.NotBlank(message = "Le nom d'utilisateur ne peut pas être vide")
    @jakarta.validation.constraints.Size(min = 3, max = 50, message = "Le nom d'utilisateur doit contenir entre 3 et 50 caractères")
    private String username;
    
    private String currentPassword;
    
    @jakarta.validation.constraints.Size(min = 6, message = "Le nouveau mot de passe doit contenir au moins 6 caractères")
    private String newPassword;

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}