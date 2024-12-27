# City Pollution Map - README

## Introduction

City Pollution Map est une application interactive qui permet de suivre et de visualiser la pollution atmosphérique en temps réel, avec un accent sur la région d'El Jadida au Maroc. Elle fournit des informations sur l'indice de qualité de l'air (AQI), des prévisions sur trois jours, un historique des données, et des notifications en temps réel.

## Objectifs

- Visualisation des données de pollution en temps réel.
- Suivi précis des indices de qualité de l'air (AQI).
- Prévisions de pollution sur trois jours.
- Historique des données pour analyse des tendances.
- Personnalisation avec gestion des villes favorites.
- Notifications en temps réel en cas de dégradation de la qualité de l'air.

## Architecture et Technologies

### Vue d'ensemble

L'application suit une architecture modulaire et scalable :

- *Frontend* : Développé avec React 18 et Material-UI pour des interfaces modernes, Leaflet pour les cartes interactives, SockJS pour WebSockets, et Axios pour les requêtes HTTP.
- *Backend* : Basé sur Spring Boot 3, avec Spring Security et JWT pour l'authentification, Spring WebSocket pour la communication en temps réel, et Spring Data JPA pour la gestion des données.
- *Base de données et Cache* : MySQL pour le stockage persistant et Redis pour le cache rapide.
- *Services externes* : OpenWeatherMap pour les données de pollution, services de géocodage pour la localisation et envoi de notifications.

### Diagramme d'architecture

#### Structure du projet

```plaintext
Directory structure:
└── Baadr003-ExamFinalJee/
    ├── .dockerignore
    ├── Front/
    │   ├── .gitignore
    │   ├── public/
    │   │   ├── manifest.json
    │   │   ├── index.html
    │   │   └── robots.txt
    │   ├── package.json
    │   ├── .dockerignore
    │   ├── Dockerfile
    │   ├── package-lock.json
    │   ├── README.md
    │   └── src/
    │       ├── setupTests.js
    │       ├── services/
    │       │   ├── favoriteService.js
    │       │   ├── authService.js
    │       │   ├── websocketService.js
    │       │   └── api.js
    │       ├── index.css
    │       ├── components/
    │       │   ├── ProtectedRoute.js
    │       │   ├── CitySearch.js
    │       │   ├── Map.js
    │       │   ├── EditProfileDialog.js
    │       │   ├── auth/
    │       │   │   └── AuthPage.js
    │       │   ├── PasswordResetDialog.js
    │       │   ├── PollutionTabs.js
    │       │   ├── UserProfile.js
    │       │   ├── layout/
    │       │   │   └── MainLayout.js
    │       │   ├── FavoritesList.js
    │       │   ├── CustomNotification.js
    │       │   ├── EmailVerificationDialog.js
    │       │   └── NotificationPreferences.js
    │       ├── theme.js
    │       ├── styles/
    │       │   └── global.css
    │       ├── App.js
    │       ├── reportWebVitals.js
    │       ├── pages/
    │       │   ├── TestAlerts.js
    │       │   └── MainPage.js
    │       ├── App.css
    │       ├── App.test.js
    │       ├── index.js
    │       └── utils/
    │           ├── authUtils.js
    │           ├── aqiUtils.js
    │           ├── sessionUtils.js
    │           └── constants.js
    ├── Exman-1/
    │   ├── .vscode/
    │   │   ├── settings.json
    │   │   └── launch.json
    │   ├── .dockerignore
    │   └── demo/
    │       ├── mvnw.cmd
    │       ├── .gitignore
    │       ├── .gitattributes
    │       ├── mvnw
    │       ├── pom.xml
    │       ├── .mvn/
    │       │   └── wrapper/
    │       │       └── maven-wrapper.properties
    │       ├── Dockerfile
    │       └── src/
    │           └── main/
    │               ├── resources/
    │               │   ├── application.properties
    │               │   ├── ehcache.xml
    │               │   ├── templates/
    │               │   │   ├── alert-email.html
    │               │   │   ├── verification-email.html
    │               │   │   └── reset-password-email.html
    │               │   └── message_fr.properties
    │               └── java/
    │                   └── com/
    │                       └── pollu/
    │                           └── demo/
    │                               ├── dto/
    │                               │   ├── UserProfileUpdateDTO.java
    │                               │   ├── AlertMessage.java
    │                               │   ├── UserPreferencesDTO.java
    │                               │   ├── UserDetailsDTO.java
    │                               │   ├── FavoriteCityDTO.java
    │                               │   ├── UserDTO.java
    │                               │   ├── AuthRequestDTO.java
    │                               │   ├── AuthResponseDTO.java
    │                               │   ├── PollutionDTO.java
    │                               │   ├── SimulateAlertRequest.java
    │                               │   ├── BaseResponseDTO.java
    │                               │   ├── VerificationDTO.java
    │                               │   └── PasswordResetDTO.java
    │                               ├── services/
    │                               │   ├── EmailService.java
    │                               │   ├── AlertService.java
    │                               │   ├── UserService.java
    │                               │   ├── PollutionService.java
    │                               │   ├── EmailTestService.java
    │                               │   └── FavoriteCityService.java
    │                               ├── repositories/
    │                               │   ├── FavoriteCityRepository.java
    │                               │   ├── AlertHistoryRepository.java
    │                               │   └── UserRepository.java
    │                               ├── entities/
    │                               │   ├── AlertHistory.java
    │                               │   ├── AlertPriority.java
    │                               │   ├── FavoriteCity.java
    │                               │   ├── Role.java
    │                               │   └── User.java
    │                               ├── controller/
    │                               │   ├── FavoriteCityController.java
    │                               │   ├── EmailTestController.java
    │                               │   ├── AlertController.java
    │                               │   ├── CacheController.java
    │                               │   ├── AuthController.java
    │                               │   └── PollutionController.java
    │                               ├── DemoApplication.java
    │                               └── config/
    │                                   ├── WebSocketConfig.java
    │                                   ├── SecurityConfig.java
    │                                   ├── OpenAPIConfig.java
    │                                   ├── CacheConfig.java
    │                                   └── EmailConfig.java
    └── docker-compose.yml





```
### Diagramme de classe




![image](https://github.com/user-attachments/assets/2701f54b-eaf8-4d81-b1b4-b020595de966)

           



## Fonctionnalités

### Système d'authentification
- Utilisation de JWT pour sécuriser les sessions utilisateur.
- Points d'entrée publics pour l'inscription et la connexion.
- Sécurisation des routes sensibles avec des règles d'autorisation strictes.

### Visualisation interactive
- Carte interactive avec Leaflet pour afficher les indices de pollution.
- Fonctionnalités de recherche, localisation et ajout de favoris.

### Notifications en temps réel
- Intégration des WebSockets avec STOMP pour des alertes instantanées.
- Filtrage des messages entrants pour prévenir les injections malveillantes.

### Historique et prévisions
- Données historiques accessibles pour chaque ville.
- Prévisions sur plusieurs jours.

### Modèle de données

Le modèle de données inclut :
- Utilisateurs et leurs préférences.
- Données de pollution et villes favorites.
- Historique des alertes et configuration des notifications.

## Sécurité

- *Authentification JWT* : Validation des tokens pour sécuriser les requêtes.
- *Protection des routes* : Accès réservé aux utilisateurs authentifiés.
- *Validation des données* : Annotations telles que @NotNull et @Email pour garantir l'intégrité.
- *Gestion des erreurs* : Gestion centralisée des exceptions avec un GlobalExceptionHandler.
- *CORS* : Configuration pour permettre les échanges sécurisés entre frontend et backend.
- *Sécurité des WebSockets* : Contrôle des connexions via JWT et filtrage des messages.

## Backend

- *Architecture* : Suivant une structure en couches claire.
- *Contrôleurs* : Gestion des points d'entrée API REST.
- *Services* : Logique métier centralisée.
- *Repositories* : Interaction avec la base de données.
- *DTOs* : Transfert des données entre les couches.
- *Configurations* : Gérer la sécurité, WebSockets, cache, et documentation API.

## Frontend

- *Architecture modulaire* : Organisation en composants React distincts.
- *Carte interactive* : Visualisation dynamique et marqueurs détaillés.
- *Tableau de bord* : Gestion des données en temps réel, historique et favoris.

## Conclusion

City Pollution Map offre une solution complète pour la surveillance de la qualité de l'air, en combinant sécurité, performance et facilité d'utilisation. Avec des technologies modernes comme React, Spring Boot, JWT, Redis, et MySQL, elle répond aux besoins des utilisateurs pour une expérience fluide et fiable.
