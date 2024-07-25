<h2 align="center">
  <a href="https://mon-enorme-tronc.fr/" alt="met uri">Mon Énorme Tronc</a>
</h2>
<div align="center">
 <img src="./vue/public/images/logo.png" width="200" height="200" />
</div>

<div align="center">

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com) &nbsp;
[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com) &nbsp;
[![forthebadge](https://forthebadge.com/images/badges/open-source.svg)](https://forthebadge.com) &nbsp;
![GitHub Repo stars](https://img.shields.io/github/stars/ZeRiix/Portfolio?color=red&logo=github&style=for-the-badge) &nbsp;
![GitHub forks](https://img.shields.io/github/forks/ZeRiix/Portfolio?color=red&logo=github&style=for-the-badge)

</div>

<h3 align="center">
    🔹
    <a href="https://github.com/mathcovax/mon-enorme-tronc/issues/new">Report Bug</a> &nbsp; &nbsp;
    🔹
    <a href="https://github.com/mathcovax/mon-enorme-tronc/issues">Request Feature</a>
</h3>

## Description

Mon Énorme Tronc est un projet de site e-commerce permettant de vendre des produits pour adultes en marketplace. Le projet est réalisé dans le cadre de la formation de développeur web à l'École Supérieure Génie Informatique (ESGI).

## Démarrer le projet

1 - **Dupliquer le .env.example et renomé en .env**

```bash
cp .env.example .env
touch .env.local
```

2 - **Récuperer les credentials firebase**

3 - **Récuperer les credentials stripe**

4 - **Démarrer le projet**

```bash
npm run dev
```

5 - **Générer la base de donnée et la remplir avec des fixtures**

```bash
npm run generate:prisma
npm run migrate:dev
npm run indexing:productSheet
npm run fixture
```

:warning: **Pour plus d'informations, référez-vous au fichier : [instructions.md](./instructions.md)** :warning:

## Fabriquer avec

- [PostgreSQL](https://www.postgresql.org/) (base de donnée normalisée)
- [Docker](https://www.docker.com/) (support)
- [Vue.js](https://vuejs.org/) (front)
- [DuploJs](https://github.com/duplojs/duplojs) (API)
- [MongoDB](https://www.mongodb.com/) (base de donnée non normalisée)

## Liste des tâches de MET

#### Tâches globales <img src="https://avatars.githubusercontent.com/u/70342449?v=4" width="16" alt="ZeRiix"/> <img src="https://avatars.githubusercontent.com/u/58041322?v=4" width="16" alt="Maubry94"/> <img src="https://avatars.githubusercontent.com/u/74609430?v=4" width="16" alt="Vitaalx"/> <img src="https://avatars.githubusercontent.com/u/98911237?v=4" width="16" alt="mathcovax"/>

- [x] Authentification sécurisée
- [x] Recherche de produits avancée
- [x] Gestion d'alertes par e-mail
- [x] Panier avec système de réservation
- [x] Intégration de plateforme de paiement
- [x] Gestion de livraison
- [x] Gestion des stocks
- [x] Historique de commande
- [x] Panel d'administration avec rôles d'utilisateurs

<br>

## Tâches détaillées

#### Fonctionnalités principales <img src="https://avatars.githubusercontent.com/u/70342449?v=4" width="16" alt="ZeRiix"/> <img src="https://avatars.githubusercontent.com/u/58041322?v=4" width="16" alt="Maubry94"/> <img src="https://avatars.githubusercontent.com/u/74609430?v=4" width="16" alt="Vitaalx"/> <img src="https://avatars.githubusercontent.com/u/98911237?v=4" width="16" alt="mathcovax"/>

- [x] Vendre n'importe quel type de produit

#### Authentification <img src="https://avatars.githubusercontent.com/u/98911237?v=4" width="16" alt="mathcovax"/> <img src="https://avatars.githubusercontent.com/u/58041322?v=4" width="16" alt="Maubry94"/>

- [x] Inscription avec confirmation par mail
- [x] Connexion et prévention de la connexion si le compte n'est pas confirmé

#### Recherche de produits <img src="https://avatars.githubusercontent.com/u/98911237?v=4" width="16" alt="mathcovax"/> <img src="https://avatars.githubusercontent.com/u/58041322?v=4" width="16" alt="Maubry94"/> <img src="https://avatars.githubusercontent.com/u/74609430?v=4" width="16" alt="Vitaalx"/>

- [x] Recherche via entrée utilisateur
  - [x] Par nom
  - [x] Par description d'un produit
  - [x] URL en tant que paramètre de recherche GET pour partage des termes de recherche
- [x] Recherche facettée
  - [x] Nom du produit
  - [x] Catégorie du produit
  - [x] Marque du produit
  - [x] Prix avec minimum et maximum
  - [x] Produit actuellement en promotion
  - [x] Produit actuellement en stock
  - [x] Facettes dans l'URL en tant que paramètre de recherche GET pour partage de la recherche

#### Gestion d'alertes par mail <img src="https://avatars.githubusercontent.com/u/74609430?v=4" width="16" alt="Vitaalx"/> <img src="https://avatars.githubusercontent.com/u/58041322?v=4" width="16" alt="Maubry94"/>

- [x] Visibilité de l'ensemble des alertes sur le compte client
- [x] Alerte sur nouveaux produits d'une catégorie
- [x] Alerte sur le restock d'un produit
- [x] Alerte sur les changements de prix
- [x] Inscription à la newsletter
- [x] Pouvoir désactiver chaque alerte mail selon les préférences d'un utilisateur et les respecter

#### Panier avec système de réservation <img src="https://avatars.githubusercontent.com/u/70342449?v=4" width="16" alt="ZeRiix"/>

- [x] Réservation de 15 minutes

#### Intégration d'une plateforme de paiement <img src="https://avatars.githubusercontent.com/u/70342449?v=4" width="16" alt="ZeRiix"/> <img src="https://avatars.githubusercontent.com/u/98911237?v=4" width="16" alt="mathcovax"/>

- [x] Intégration d'une API de paiement (Stripe, Paypal, Autres)
- [x] Création de liens de paiement uniques
- [x] Possibilité d'effectuer un remboursement (avec facture d'avoir)

#### Gestion de la livraison <img src="https://avatars.githubusercontent.com/u/98911237?v=4" width="16" alt="mathcovax"/>

- [x] Intégration d'une API de La Poste (ou du gouvernement)

#### Gestion des stocks <img src="https://avatars.githubusercontent.com/u/98911237?v=4" width="16" alt="mathcovax"/> <img src="https://avatars.githubusercontent.com/u/58041322?v=4" width="16" alt="Maubry94"/>

- [x] Alerte en fin de stock
- [x] Configuration des alertes (valeur absolue pour un produit)
- [x] Graphique d'évolution des stocks au cours des derniers mois

#### Historique de commande <img src="https://avatars.githubusercontent.com/u/74609430?v=4" width="16" alt="Vitaalx"/> <img src="https://avatars.githubusercontent.com/u/98911237?v=4" width="16" alt="mathcovax"/>

- [x] Demande de facturation
- [x] Demande de retour produit
- [x] Recherche
- [x] Commander à nouveau

#### Panel d'administration <img src="https://avatars.githubusercontent.com/u/70342449?v=4" width="16" alt="ZeRiix"/> <img src="https://avatars.githubusercontent.com/u/58041322?v=4" width="16" alt="Maubry94"/> <img src="https://avatars.githubusercontent.com/u/74609430?v=4" width="16" alt="Vitaalx"/> <img src="https://avatars.githubusercontent.com/u/98911237?v=4" width="16" alt="mathcovax"/>

- [x] CRUD sur l'ensemble des ressources
- [x] Dashboard avec datavisualisation (pas juste des KPI)
  - [x] Dashboard personnalisable sous forme de widgets
- [x] “Suppression” de compte
  - [x] Trouver une solution pour conserver les données d'un utilisateur en les rendant anonymes
  - [x] Possibilité de se créer de nouveau un compte avec les mêmes identifiants

#### Fonctionnalités bonus <img src="https://avatars.githubusercontent.com/u/70342449?v=4" width="16" alt="ZeRiix"/> <img src="https://avatars.githubusercontent.com/u/58041322?v=4" width="16" alt="Maubry94"/> <img src="https://avatars.githubusercontent.com/u/74609430?v=4" width="16" alt="Vitaalx"/> <img src="https://avatars.githubusercontent.com/u/98911237?v=4" width="16" alt="mathcovax"/>

- [x] Gestion des données personnelles
- [x] Opérations de promotion
- [ ] Dashboard comptabilité
- [x] Connexion en tant qu'utilisateur
- [x] Options de livraison variées

## Participants

- [ZeRiix](https://github.com/ZeRiix) <img src="https://avatars.githubusercontent.com/u/70342449?v=4" width="16" alt="ZeRiix"/>
- [Maubry94](https://github.com/Maubry94) <img src="https://avatars.githubusercontent.com/u/58041322?v=4" width="16" alt="Maubry94"/>
- [Vitaalx](https://github.com/Vitaalx) <img src="https://avatars.githubusercontent.com/u/74609430?v=4" width="16" alt="Vitaalx"/>
- [mathcovax](https://github.com/mathcovax) <img src="https://avatars.githubusercontent.com/u/98911237?v=4" width="16" alt="mathcovax"/>
