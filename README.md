# 🎯 Mapetanque

Carte interactive recensant les terrains de pétanque accessibles au public en Belgique.

🔗 **Site en ligne :** [mapetanque.github.io](https://mapetanque.github.io/)
📄 **Licence :** [MIT](./LICENSE)
📋 **Détail des fonctionnalités :** voir [FONCTIONNALITES.md](./FONCTIONNALITES.md)

---

## Historique des évolutions

## ✅ Historique des évolutions
 
- [x] Comprendre pourquoi certains terrains n'apparaissaient pas sur la carte
- [x] Charger les marqueurs par groupe (cluster) au-delà de plusieurs centaines de terrains
- [x] Affiner le regroupement des clusters par proximité géographique
- [x] Ajouter le nombre de terrains recensés + date de dernière mise à jour
- [x] Ajouter un menu burger (À propos / Nous contacter / FAQ)
- [x] Étoffer la FAQ (ex. comment ajouter ou supprimer un terrain)
- [x] Renommer chaque terrain en "Terrain [nom de la rue]"
- [x] Revoir le style visuel du titre
- [x] Ajouter la possibilité d'entrer une adresse ou une ville pour se déplacer sur la carte
- [x] Réfléchir aux canaux de promotion du site
- [x] Ajouter une version néerlandaise et allemande
- [x] Raccourcir le sous-titre → "La carte des terrains de pétanque publics en Belgique"
- [x] Ajouter une confirmation visuelle lors de la copie du lien de partage (footer)
- [x] Retirer l'intitulé redondant dans le panneau lorsqu'un sous-menu est ouvert
- [x] La distance vers un terrain doit s'afficher si on a cliqué sur "localiser" OU si on a entré une adresse, une ville etc
- [x] Modifier la taille à part de laquelle l’affichage mobile s’applique (actuellement 780px, désormais 1024px)
- [x] Remplacer les petites icones dans les boutons de la page d'accueil et dans les fiches par des icônes dans un style plus sobre et moderne similaire à celles pour les RS dans le footer
- [x] Changer la couleur globale du site web pour du vert
- [x] Dans les fiches terrain, enlever le surlignage sur le caractère avt la 1ere lettre
- [x] Renommer l'intitulé "Pétanque Belgique" qu'on peut voir notamment dans l'intitulé de l'onglet du navigateur, remplacer "Mapetanque Belgique" 
---

## Partie communautaire (en pause)

- [ ] Créer une fiche individuelle par terrain, indexable par Google
  - [ ] Permettre aux usagers de noter un terrain sur 5 et d'ajouter un commentaire
  - [ ] Définir la liste complète des informations associables à un terrain (zone ombragée, bar à proximité, terrain en pente, équipement de comptage des points, etc.)
- [ ] Prévoir un système de versionning des données, pour pouvoir revenir en arrière en cas d'attaque ou de mauvaise utilisation

---

## Outils utilisés

| Outil | Rôle |
|---|---|
| **Visual Studio Code** | Créer et modifier les fichiers du site, organiser le projet |
| **Leaflet** | Afficher la carte interactive (déplacements, marqueurs, popups...) |
| **OpenStreetMap** | Source des données géographiques |
| **Overpass Turbo** | Extraction automatique des données OpenStreetMap via l'API Overpass |
| **Python** | Automatiser la récupération des données OpenStreetMap (1×/semaine, le lundi à 3h) |
| **GitHub** | Stockage du projet, historique Git, automatisation, hébergement du site public |
| **Live Server** (extension VS Code) | Prévisualiser rapidement les changements de code en local |

---

## Structure du projet

```
├── index.html              # Structure de la page
├── style.css                # Mise en forme
├── script.js                 # Logique de la carte et des interactions
├── translations.js       # Textes du site en FR / NL / DE
├── generer_terrains.py  # Script de génération hebdomadaire des données
├── data/
│   └── terrains.geojson    # Données des terrains (générées automatiquement)
├── LICENSE                    # Licence MIT
├── FONCTIONNALITES.md   # Détail de toutes les fonctionnalités du site
└── README.md               # Ce fichier
```