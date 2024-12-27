package com.pollu.demo.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
public class PasswordResetDTO {
    @NotBlank(message = "L'email est requis")
    @Email(message = "Format d'email invalide")
    private String email;
    
    @NotBlank(message = "Le code est requis")
    private String code;
    
    @NotBlank(message = "Le nouveau mot de passe est requis")
    private String newPassword;
}