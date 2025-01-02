# City Pollution  - README

# Table des matières

- [Introduction](#introduction)
- [Vue d'ensemble de l'architecture et des technologies](#vue-densemble-de-larchitecture-et-des-technologies)
- [Structure du projet](#structure-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [Structure des Services](#structure-des-services)
- [Réseaux](#réseaux)
- [Volumes](#volumes)
- [Instructions pour l'Utilisation](#instructions-pour-lutilisation)
- [Diagramme de Classe](#diagramme-de-classe)
- [Notes](#notes)
- [Problèmes Courants](#problèmes-courants)
- [Contribution et Contributeurs](#contribution-et-contributeurs)
- [Démonstration Vidéo](#démonstration-vidéo)
- [Conclusion](#conclusion)

# Introduction
City Pollution Map est une application interactive qui permet de suivre et de visualiser la pollution atmosphérique en temps réel, avec un accent sur la région d'El Jadida au Maroc. Elle fournit des informations sur l'indice de qualité de l'air (AQI), des prévisions sur trois jours, un historique des données, et des notifications en temps réel.
Ce projet utilise Docker Compose pour configurer et gérer une application complète avec une base de données MySQL, un backend Spring Boot, et un frontend React. Voici une explication détaillée de chaque service, des étapes pour configurer le projet, ainsi qu'une vue d'ensemble des technologies utilisées et de l'architecture.

---

## Vue d'ensemble de l'architecture et des technologies

### Architecture
L'application est divisée en trois principaux services qui communiquent via un réseau Docker :
- **Base de données** : MySQL pour la gestion des données.
- **Backend** : Une API REST développée avec Spring Boot.
- **Frontend** : Une interface utilisateur développée en ReactJS.

Voici un diagramme représentant l'architecture de l'application :

![44](https://github.com/user-attachments/assets/d971f595-6a23-4ac9-b990-b202c799aa58)


---

### Technologies utilisées

| Composant         | Technologie        |
|-------------------|--------------------|
| Base de données   | MySQL 8.0         |
| Backend           | Spring Boot       |
| Frontend          | ReactJS           |
| Conteneurisation  | Docker & Docker Compose |

---

## Structure du projet

Le projet est organisé en trois répertoires principaux :

plaintext
.
├── docker-compose.yml
├── Exman-1/demo       # Code source du backend
├── Front              # Code source du frontend
├── mysql-data         # Volume pour la persistance des données MySQL


---

## Fonctionnalités

### Fonctionnalités principales

- **Gestion des données environnementales** :
  - Enregistrement et gestion des données dans une base MySQL.
- **API Backend** :
  - CRUD complet pour les entités gérées.
  - Intégration avec l'API OpenWeatherMap pour récupérer des données météorologiques.
- **Interface utilisateur** :
  - Tableau de bord interactif pour afficher et gérer les données.
- **Conteneurisation** :
  - Déploiement simplifié à l'aide de Docker Compose.

### Fonctionnalités supplémentaires

- Santé des services surveillée par des healthchecks.
- Persistance des données grâce à un volume Docker.

---

## Structure des Services

### MySQL
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


#### Description
- **Image** : mysql:8.0
- **Nom du conteneur** : pollution-db
- **Ports exposés** : 3306 (local) vers 3306 (conteneur).
- **Volume** : mysql-data pour persister les données.
- **Réseau** : pollution-network.

### Backend
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


#### Description
- **Chemin de construction** : ./Exman-1/demo.
- **Nom du conteneur** : pollution-backend.
- **Ports exposés** : 8081 (local) vers 8080 (conteneur).
- **Variables d'environnement** :
  - SPRING_PROFILES_ACTIVE, SPRING_JPA_SHOW_SQL, SPRING_DATASOURCE_URL, etc.
  - Clé API OpenWeatherMap : dc9e1a277550ae28ae253f49934f8338.
- **Réseau** : pollution-network.

### Frontend
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


#### Description
- **Chemin de construction** : ./Front.
- **Nom du conteneur** : pollution-frontend.
- **Ports exposés** : 3000 (local) vers 3000 (conteneur).
- **Variables d'environnement** : REACT_APP_API_URL pour l'URL de l'API backend.
- **Réseau** : pollution-network.

---

## Réseaux
yaml
networks:
  pollution-network:
    driver: bridge

- **Type de réseau** : bridge.

---

## Volumes
yaml
volumes:
  mysql-data:

- **Volume** : mysql-data pour la persistance des données MySQL.

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

## Diagramme de Classe


![image](https://github.com/user-attachments/assets/2701f54b-eaf8-4d81-b1b4-b020595de966)


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

Les contributions sont les bienvenues ! Si vous souhaitez participer, veuillez suivre les consignes décrites dans le fichier CONTRIBUTING.md.

### Contributeurs
- **Nom du contributeur 1** : Badr Korichi <Badr.korichi578@gmail.com>
- **Nom du contributeur 2** : Salma Jalat <salma.jalat03@gmail.com>

## Démonstration Vidéo:


https://github.com/user-attachments/assets/261564c0-fe16-4d77-8519-6e228181fbae



## Conclusion

City Pollution Map offre une solution complète pour la surveillance de la qualité de l'air, en combinant sécurité, performance et facilité d'utilisation. Avec des technologies modernes comme React, Spring Boot, JWT, Redis, et MySQL, elle répond aux besoins des utilisateurs pour une expérience fluide et fiable.
