# City Pollution Map - README

# Table des matières

- [Introduction](#introduction)
- [Vue d'ensemble de l'architecture et des technologies](#vue-densemble-de-larchitecture-et-des-technologies)
  - [Architecture](#architecture)
  - [Technologies utilisées](#technologies-utilisées)
- [Structure du projet](#structure-du-projet)
- [Fonctionnalités](#fonctionnalités)
  - [Fonctionnalités principales](#fonctionnalités-principales)
  - [Fonctionnalités supplémentaires](#fonctionnalités-supplémentaires)
- [Structure des Services](#structure-des-services)
  - [MySQL](#mysql)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Réseaux](#réseaux)
- [Volumes](#volumes)
- [Instructions pour l'Utilisation](#instructions-pour-lutilisation)
  - [Prérequis](#prérequis)
  - [Étapes](#étapes)
- [Diagramme de Classe](#diagramme-de-classe)
- [Notes](#notes)
- [Problèmes Courants](#problèmes-courants)
- [Contribution et Contributeurs](#contribution-et-contributeurs)
  - [Contributeurs](#contributeurs)
- [Démonstration Vidéo](#démonstration-vidéo)
- [Conclusion](#conclusion)

# Introduction
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
...
