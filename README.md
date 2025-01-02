# City Pollution  - README

# Table des matières

- [Introduction](#introduction)
- [Vue d'ensemble de l'architecture et des technologies](#vue-densemble-de-larchitecture-et-des-technologies)
- [Diagramme de Classe](#diagramme-de-classe)
- [Structure du projet](#structure-du-projet)
- [Docker image ](#Docker-image)
- [Fonctionnalités](#fonctionnalités)
- [Structure des Services](#structure-des-services)
- [Instructions pour l'Utilisation](#instructions-pour-lutilisation)
- [Problèmes Courants](#problèmes-courants)
- [Contribution et Contributeurs](#contribution-et-contributeurs)
- [Démonstration Vidéo](#démonstration-vidéo)
- [Conclusion](#conclusion)

# 📖Introduction
City Pollution est une application interactive qui permet de suivre et de visualiser la pollution atmosphérique en temps réel, avec un accent sur la région d'El Jadida au Maroc. Elle fournit des informations sur l'indice de qualité de l'air (AQI), des prévisions sur trois jours, un historique des données, et des notifications en temps réel.
Ce projet utilise Docker Compose pour configurer et gérer une application complète avec une base de données MySQL, un backend Spring Boot, et un frontend React. Voici une explication détaillée de chaque service, des étapes pour configurer le projet, ainsi qu'une vue d'ensemble des technologies utilisées et de l'architecture.


![WhatsApp Image 2025-01-02 à 20 35 12_a5397920](https://github.com/user-attachments/assets/594cc6b2-0705-4da1-a376-587b91e36abf)


---

## 💡Vue d'ensemble de l'architecture et des technologies

### Architecture
L'application est divisée en trois principaux services qui communiquent via un réseau Docker :
- **🛢️Base de données** : MySQL pour la gestion des données.
- **☕Backend** : Une API REST développée avec Spring Boot.
- **⚛️ Frontend** : Une interface utilisateur développée en ReactJS.

Voici un diagramme représentant l'architecture de l'application :

![44](https://github.com/user-attachments/assets/d971f595-6a23-4ac9-b990-b202c799aa58)


---

### Technologies utilisées

| Composant         | Technologie        |
|-------------------|--------------------|
| 🛢️Base de données   | MySQL 8.0         |
| ☕Backend           | Spring Boot       |
|⚛️ Frontend          | ReactJS           |
|🐳⚙️Conteneurisation  | Docker & Docker Compose |

---

## Diagramme de Classe


![image](https://github.com/user-attachments/assets/2701f54b-eaf8-4d81-b1b4-b020595de966)


---

## Structure du projet

Le projet est organisé en trois répertoires principaux :


```plaintext
├── docker-compose.yml
├── Exman-1/demo       # Code source du backend
├── Front              # Code source du frontend
├── mysql-data         # Volume pour la persistance des données MySQL

```

---
## Docker image 

```plaintext
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: pollution-db
    restart: always
    environment:
      MYSQL_ALLOW_EMPTY_PASSWORD: "yes"
      MYSQL_DATABASE: pollution
    healthcheck:
      test: ["CMD", "mysqladmin" ,"ping", "-h", "localhost"]
      timeout: 5s
      retries: 10
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - pollution-network

  backend:
    build: 
      context: ./Exman-1/demo
      dockerfile: Dockerfile
    container_name: pollution-backend
    restart: always
    depends_on:
      mysql:
        condition: service_healthy
    environment:
      SPRING_PROFILES_ACTIVE: debug
      SPRING_JPA_SHOW_SQL: "true"
      LOGGING_LEVEL_ROOT: DEBUG
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/pollution?allowPublicKeyRetrieval=true&useSSL=false&createDatabaseIfNotExist=true
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: ""
      OPENWEATHERMAP_API_KEY: dc9e1a277550ae28ae253f49934f8338
      SPRING_JPA_HIBERNATE_DDL_AUTO: update
      SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT: org.hibernate.dialect.MySQLDialect
      SPRING_MVC_PATHMATCH_MATCHING_STRATEGY: ANT_PATH_MATCHER
    ports:
      - "8081:8080"
    networks:
      - pollution-network

  frontend:
    build:
      context: ./Front
      dockerfile: Dockerfile
    container_name: pollution-frontend
    restart: always
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://localhost:8081
    networks:
      - pollution-network

networks:
  pollution-network:
    driver: bridge

volumes:
  mysql-data:
```
---

## ⚙️Fonctionnalités

### Fonctionnalités principales

- **Système d'authentification** :
- Utilisation de JWT pour sécuriser les sessions utilisateur.
- Points d'entrée publics pour l'inscription et la connexion.
- Sécurisation des routes sensibles avec des règles d'autorisation strictes.

-L'image ci-dessous montre une interface de connexion avec champs "Username" et "Password", bouton "Login", et option "Mot de passe oublié ?". Les points d'entrée publics pour l'inscription et la connexion (boutons "Login" et "Register") permettent un accès de base

![image](https://github.com/user-attachments/assets/2fea4392-4797-420e-8c9d-2f2d81d03f01)

### Visualisation interactive
- Carte interactive avec Leaflet pour afficher les indices de pollution.
- Fonctionnalités de recherche, localisation et ajout de favoris.
- Possibilité de télécharger un rapport détaillé sur la pollution d'une ville en format PDF.
- Classement dynamique : À côté de la carte interactive, un classement dynamique des villes les plus polluées au monde est mis à jour en temps réel.
![WhatsApp Image 2025-01-02 à 21 18 57_f3b0c55c](https://github.com/user-attachments/assets/27dba879-ba8a-4678-b33d-845bc40f39d8)
 
![image](https://github.com/user-attachments/assets/51b0b81a-f0f9-44cb-877b-8d84bb366ec9)

### Notifications en temps réel
- Intégration des WebSockets avec STOMP pour des alertes instantanées.
- Filtrage des messages entrants pour prévenir les injections malveillantes.

![image](https://github.com/user-attachments/assets/dc6aeb56-f231-42b0-b473-13da47e535a2)

### Historique et prévisions
- Données historiques accessibles pour chaque ville.
- Prévisions sur plusieurs jours.

![WhatsApp Image 2025-01-02 à 21 38 24_fd1e2eeb](https://github.com/user-attachments/assets/236fa098-005c-433f-a3b3-66b31889f856)
![WhatsApp Image 2025-01-02 à 21 36 25_3d84647a](https://github.com/user-attachments/assets/3e2e4275-4d79-454e-bfe9-edc134c507bf)

- **API Backend** :
  - CRUD complet pour les entités gérées.
  - Intégration avec l'API OpenWeatherMap pour récupérer des données météorologiques.
- **Conteneurisation** :
  - Déploiement simplifié à l'aide de Docker Compose.

### Fonctionnalités supplémentaires

- Santé des services surveillée par des healthchecks.
- Persistance des données grâce à un volume Docker.

### Sécurité

- *Authentification JWT* : Validation des tokens pour sécuriser les requêtes.
- *Protection des routes* : Accès réservé aux utilisateurs authentifiés.
- *Validation des données* : Annotations telles que @NotNull et @Email pour garantir l'intégrité.
- *Gestion des erreurs* : Gestion centralisée des exceptions avec un GlobalExceptionHandler.
- *CORS* : Configuration pour permettre les échanges sécurisés entre frontend et backend.
- *Sécurité des WebSockets* : Contrôle des connexions via JWT et filtrage des messages.

---

## Structure des Services

### MySQL

```plaintext
yaml
services:
  mysql:
    image: mysql:8.0
    container_name: pollution-db
    restart: always
    environment:
      MYSQL_ALLOW_EMPTY_PASSWORD: "yes"
      MYSQL_DATABASE: pollution
    healthcheck:
      test: ["CMD", "mysqladmin" ,"ping", "-h", "localhost"]
      timeout: 5s
      retries: 10
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - pollution-network
```

#### Description
- **Image** : mysql:8.0
- **Nom du conteneur** : pollution-db
- **Ports exposés** : 3306 (local) vers 3306 (conteneur).
- **Volume** : mysql-data pour persister les données.
- **Réseau** : pollution-network.

### Backend
```plaintext
yaml
  backend:
    build: 
      context: ./Exman-1/demo
      dockerfile: Dockerfile
    container_name: pollution-backend
    restart: always
    depends_on:
      mysql:
        condition: service_healthy
    environment:
      SPRING_PROFILES_ACTIVE: debug
      SPRING_JPA_SHOW_SQL: "true"
      LOGGING_LEVEL_ROOT: DEBUG
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/pollution?allowPublicKeyRetrieval=true&useSSL=false&createDatabaseIfNotExist=true
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: ""
      OPENWEATHERMAP_API_KEY: dc9e1a277550ae28ae253f49934f8338
      SPRING_JPA_HIBERNATE_DDL_AUTO: update
      SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT: org.hibernate.dialect.MySQLDialect
      SPRING_MVC_PATHMATCH_MATCHING_STRATEGY: ANT_PATH_MATCHER
    ports:
      - "8081:8080"
    networks:
      - pollution-network
```

#### Description
- **Chemin de construction** : ./Exman-1/demo.
- **Nom du conteneur** : pollution-backend.
- **Ports exposés** : 8081 (local) vers 8080 (conteneur).
- **Variables d'environnement** :
  - SPRING_PROFILES_ACTIVE, SPRING_JPA_SHOW_SQL, SPRING_DATASOURCE_URL, etc.
  - Clé API OpenWeatherMap : dc9e1a277550ae28ae253f49934f8338.
- **Réseau** : pollution-network.

### Frontend
```plaintext
yaml
  frontend:
    build:
      context: ./Front
      dockerfile: Dockerfile
    container_name: pollution-frontend
    restart: always
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://localhost:8081
    networks:
      - pollution-network
```

#### Description
- **Chemin de construction** : ./Front.
- **Nom du conteneur** : pollution-frontend.
- **Ports exposés** : 3000 (local) vers 3000 (conteneur).
- **Variables d'environnement** : REACT_APP_API_URL pour l'URL de l'API backend.
- **Réseau** : pollution-network.

---

## Réseaux
```plaintext
yaml
networks:
  pollution-network:
    driver: bridge

- **Type de réseau** : bridge.
```
---


## Instructions pour l'Utilisation

### Prérequis
- Docker et Docker Compose doivent être installés sur votre machine.

### Étapes
1. Clonez le dépôt contenant ce fichier Docker Compose.
2. Naviguez dans le répertoire du projet.
3. Exécutez la commande suivante pour démarrer les services :
   
bash
   docker-compose up --build

4. Accédez aux services :
   - Backend : [http://localhost:8081](http://localhost:8081)
   - Frontend : [http://localhost:3000](http://localhost:3000)

---

## Notes
- Le service backend dépend de la disponibilité du service mysql.
- Assurez-vous que la clé API OpenWeatherMap est valide.
- Pour stopper les services, utilisez :
  
bash
  docker-compose down

- Les données MySQL sont persistées dans le volume mysql-data.

---

## Problèmes Courants
- Si le conteneur mysql ne démarre pas correctement, vérifiez les journaux :
  
bash
  docker logs pollution-db

- Assurez-vous que le port 3306 n'est pas utilisé par un autre service sur votre machine.

---

## Contribution et Contributeurs

Nous accueillons les contributions de chacun avec plaisir et nous apprécions votre aide pour améliorer encore ce projet ! Si vous souhaitez contribuer, veuillez suivre ces directives :

### Contributeurs
- **Nom du contributeur 1** : Badr Korichi <Badr.korichi578@gmail.com>
- **Nom du contributeur 2** : Salma Jalat <salma.jalat03@gmail.com>

## Démonstration Vidéo:

Cliquez sur le lien ci-dessous pour regarder une vidéo de démonstration :



https://github.com/user-attachments/assets/36d375ae-5a8e-4baa-be83-02ce75ea0557





## Conclusion

City Pollution Map offre une solution complète pour la surveillance de la qualité de l'air, en combinant sécurité, performance et facilité d'utilisation. Avec des technologies modernes comme React, Spring Boot, JWT, Redis, et MySQL, elle répond aux besoins des utilisateurs pour une expérience fluide et fiable.
