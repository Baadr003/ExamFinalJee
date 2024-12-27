package com.pollu.demo.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Map;
import java.util.HashMap;
import java.util.Random;

@Service
@Slf4j
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private TemplateEngine templateEngine;

    private static final String FROM_EMAIL = "citypollutioncitypollution@gmail.com";

    public void sendAlertEmail(String to, String subject, Map<String, Object> templateModel) {
        sendTemplatedEmail(to, subject, "alert-email", templateModel);
    }

    public void sendVerificationEmail(String to, String subject, Map<String, Object> templateModel) {
        sendTemplatedEmail(to, subject, "verification-email", templateModel);
    }

    public void sendPasswordResetEmail(String to, String subject, Map<String, Object> templateModel) {
        sendTemplatedEmail(to, subject, "reset-password-email", templateModel);
    }

    public void sendVerificationCode(String to, String username, String verificationCode) {
        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("username", username);
        templateModel.put("code", verificationCode);
        templateModel.put("expiryMinutes", 15);

        String subject = "Vérification de votre compte PolluAlert";
        sendTemplatedEmail(to, subject, "verification-email", templateModel);
        log.info("Verification code sent to: {} with code: {}", to, verificationCode);
    }

    // Ajout de la méthode pour le reset password avec le même pattern
    public void sendPasswordResetCode(String to, String username, String resetCode) {
        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("username", username);
        templateModel.put("code", resetCode);
        templateModel.put("expiryMinutes", 15);

        String subject = "Réinitialisation de votre mot de passe PolluAlert";
        sendTemplatedEmail(to, subject, "reset-password-email", templateModel);
        log.info("Password reset code sent to: {} with code: {}", to, resetCode);
    }

    public String generateVerificationCode() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }

    private void sendTemplatedEmail(String to, String subject, String template, Map<String, Object> templateModel) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            Context thymeleafContext = new Context();
            thymeleafContext.setVariables(templateModel);
            String htmlBody = templateEngine.process(template, thymeleafContext);

            helper.setFrom(FROM_EMAIL);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            emailSender.send(message);
            log.info("Email sent successfully to: {}", to);
            
        } catch (Exception e) {
            log.error("Failed to send email to: {}. Error: {}", to, e.getMessage());
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }
}