# Architecture du Carnet des Gagnants

**Version :** 1.0.0-dev

**Auteur :** Antoine Di Bartoloméo

**Architecte logiciel :** ChatGPT

**Dernière mise à jour :** 25 juillet 2026

---

# Vision

Le Carnet des Gagnants est une application de développement personnel conçue pour aider son utilisateur à prendre conscience de ses progrès, conserver ses réussites et cultiver un état d'esprit positif.

L'application repose sur quatre piliers :

- Journal
- Progression
- Gratitude
- Évolution personnelle

Le projet privilégie une architecture simple, claire et évolutive afin de pouvoir grandir sans devenir complexe.

---

# Objectifs

Les objectifs principaux sont :

- offrir une expérience utilisateur agréable ;
- garantir la confidentialité des données ;
- conserver un code lisible et maintenable ;
- documenter chaque évolution importante ;
- construire une application durable.

---

# Technologies

## Backend

- Node.js
- Express
- BetterSQLite3
- SQLite

## Frontend

- HTML5
- CSS3
- JavaScript ES6

## Outils

- Git
- GitHub
- Visual Studio Code

---

# Architecture générale

Le Carnet des Gagnants suit une architecture en couches.

Chaque couche possède une responsabilité unique.

```
Utilisateur

        │

        ▼

Interface HTML

        │

        ▼

JavaScript

        │

        ▼

Routes Express

        │

        ▼

Controllers

        │

        ▼

Services

        │

        ▼

Base SQLite
```

Cette séparation facilite la maintenance et les évolutions futures.

---

# Organisation du projet

## controllers/

Les contrôleurs reçoivent les requêtes HTTP.

Ils :

- valident les paramètres ;
- appellent les services ;
- renvoient la réponse.

Ils ne contiennent aucune logique métier.

---

## services/

Les services contiennent toute la logique métier.

Ils :

- effectuent les traitements ;
- manipulent les données ;
- communiquent avec la base SQLite.

---

## routes/

Les routes définissent les API de l'application.

Une route correspond à un module fonctionnel.

Exemple :

- auth
- journal
- gratitude
- progression

---

## database/

Le dossier database contient :

- la configuration SQLite ;
- l'initialisation de la base ;
- le schéma des tables.

---

## public/

Le dossier public contient toute l'interface utilisateur.

Il est organisé en plusieurs parties :

```
assets/
components/
css/
images/
js/
pages/
```

---

## docs/

Toute la documentation officielle du projet.

Chaque décision importante doit y être documentée.

---

# Flux des données

Lorsqu'un utilisateur effectue une action :

1. le navigateur envoie une requête ;
2. la route Express reçoit cette requête ;
3. le contrôleur la traite ;
4. le service exécute la logique métier ;
5. SQLite lit ou enregistre les données ;
6. la réponse est renvoyée à l'utilisateur.

---

# Principes d'architecture

Le projet applique les principes suivants :

- une responsabilité par fichier ;
- une fonctionnalité par module ;
- composants réutilisables ;
- logique métier centralisée dans les services ;
- contrôleurs les plus simples possible ;
- documentation systématique ;
- code lisible avant d'être intelligent.

---

# Structure actuelle

```
controllers/
database/
docs/
public/
routes/
services/

LICENSE
README.md
VERSION
package.json
server.js
```

---

# Modules actuels

Le projet est composé des modules suivants :

- Authentification
- Journal
- Progression
- Coffre de Gratitude

---

# Évolutions prévues

Les prochaines versions intégreront notamment :

- Dashboard
- Objectifs
- Défis
- Statistiques
- Export des données
- Synchronisation
- Sauvegarde
- Paramètres utilisateur

---

# Philosophie

Le Carnet des Gagnants n'est pas un simple journal.

Il est conçu comme un compagnon de progression personnelle.

Chaque évolution doit respecter les principes suivants :

- simplicité ;
- élégance ;
- cohérence ;
- pérennité.

Avant toute nouvelle fonctionnalité, la question suivante doit être posée :

> Cette fonctionnalité améliore-t-elle réellement l'expérience utilisateur tout en respectant la philosophie du projet ?

Si la réponse est non, elle ne doit pas être intégrée.