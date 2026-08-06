# Mapetanque — Récapitulatif des fonctionnalités

Document de référence interne (non destiné à être affiché sur le site public).
Dernière mise à jour : voir historique Git.

---

## 🗺️ Carte et données

- Carte interactive de la Belgique (Leaflet + fonds OpenStreetMap)
- Deux fonds de carte au choix : "Plan" et "Satellite" (contrôle de calques Leaflet)
- Terrains regroupés en clusters (chiffres colorés) qui se séparent automatiquement au zoom
- Données des terrains issues d'OpenStreetMap (requête Overpass ciblant `leisure=pitch` + `sport=boules`/`petanque` sur la Belgique)
- Régénération hebdomadaire automatique via le script `generer_terrains.py`
- Nom de rue/lieu le plus proche calculé pour chaque terrain (géocodage inversé Nominatim), **précalculé et stocké directement dans `terrains.geojson`** pour création d'un titre dynamique.

## 📍 Localisation et recherche

- Bouton "📍 Me localiser" (géolocalisation native du navigateur)
- Champ de recherche libre (adresse, ville, région) via l'API de recherche Nominatim
- Zoom automatiquement adapté à la nature du résultat trouvé (adresse précise → zoom serré ; ville/région → `fitBounds` sur toute la zone)
- Calcul de distance (formule de Haversine) affiché dans chaque fiche terrain une fois la position de l'utilisateur connue

## 📋 Fiche d'un terrain (popup au clic sur un marqueur)

- Titre dynamique : `Terrain [nom de rue]` si une rue proche a été trouvée, sinon `Terrain de pétanque`
- Statut d'accès : `public` ou `probablement public` (selon le tag OSM `access`)
- Distance jusqu'au terrain (si géolocalisation ou recherche active), sinon message incitant à se localiser
- Lien "🚗 Afficher l'itinéraire" → ouvre Google Maps en mode itinéraire
- Lien "📤 Partager ce terrain" → ouvre le panneau de partage avec un lien direct vers ce terrain précis

## 📤 Partage

- **Partage d'un terrain précis** : génère une URL du type `?lat=...&lon=...&z=18`. À l'ouverture de ce lien, le site retrouve automatiquement le terrain correspondant, centre la carte dessus et rouvre son popup — sans passer par une page dédiée par terrain (pas encore de fiches individuelles indexées Google, voir section "Pistes futures")
- **Partage du site** : rangée d'icônes discrètes dans le footer (WhatsApp, Facebook, X, e-mail, copier le lien), alignée à droite
- Petit retour visuel (icône qui change de couleur ~2 sec) lors de la copie du lien

## 🌍 Multilingue (FR / NL / DE)

- Sélecteur de langue fixe en haut à gauche de l'écran, visible en permanence
- Détection automatique de la langue du navigateur au premier passage (repli sur le français si langue non reconnue)
- Mémorisation du choix via `localStorage` (le visiteur retrouve sa langue lors d'une prochaine visite)
- Traduction complète et dynamique : titre, tagline, menu, panneau À propos/Contact/FAQ, popups des terrains, panneau de partage, footer (y compris pluriels et formats de date localisés : `31 juillet 2026` / `31 juli 2026` / `31. Juli 2026`)
- Toutes les traductions centralisées dans `translations.js`

## 📖 Panneau d'info coulissant

- Ouverture depuis le menu burger (☰, en haut à droite)
- Mini-navigation interne en haut du panneau (À propos / Contact / FAQ) permettant de changer de sujet **sans refermer le panneau**
- Onglet actif mis en évidence visuellement
- FAQ en accordéon natif (`<details>`/`<summary>`, sans JS dédié) — actuellement 5 questions/réponses :
  1. D'où viennent les informations affichées sur la carte ?
  2. Comment trouver un terrain près de moi ?
  3. Puis-je ajouter une photo, un avis ou des informations pratiques ?
  4. Un terrain accessible au public près de chez moi n'apparaît pas sur la carte, que faire ?
  5. Un terrain indiqué sur la carte n'existe plus ou n'est plus praticable, que faire ?

## 📊 Footer

- Nombre total de terrains recensés (calculé côté client depuis `terrains.geojson`, aucune configuration manuelle)
- Date de la dernière mise à jour des données, récupérée via l'API GitHub (date du dernier commit ayant modifié `terrains.geojson`)
- Crédit OpenStreetMap (lien cliquable)
- Icônes de partage du site

## 🎨 Identité visuelle et confort d'usage

- Jeu de mots visuel dans le titre : "**Map**etanque" (Map en italique/gras/bleu)
- Layout en flexbox occupant toute la hauteur d'écran (`min-height: 100vh`) : la carte s'étire pour occuper tout l'espace disponible, sans zone vide ni scrollbar parasite
- Site entièrement responsive (mobile/desktop), avec espace réservé en haut sur mobile pour éviter que le titre ne chevauche les boutons flottants
- Icône de marqueur cohérente (position utilisateur ou résultat de recherche)
- Panneaux coulissants (menu burger, info, partage) avec fond assombri et fermeture au clic extérieur

## 🛠️ Infrastructure

- Site 100 % statique : `index.html`, `style.css`, `script.js`, `translations.js`, `data/terrains.geojson`
- Hébergé sur GitHub Pages (`mapetanque.github.io`), déploiement automatique à chaque `git push`
- Génération des données via `generer_terrains.py`, à exécuter manuellement ou via tâche planifiée (~30 min d'exécution à cause de la limite Nominatim d'1 requête/seconde)

---

## 🔭 Pistes futures évoquées (non développées)

- Fiches individuelles par terrain avec URL dédiée, pour l'indexation Google (génération statique envisagée)
- Système de notes (/5) et commentaires par terrain (nécessiterait un backend — Supabase/Firebase envisagés)
- Tags associables à un terrain par les usagers (zone ombragée, bar à proximité, terrain en pente, compteur de points, etc. — liste complète déjà brainstormée)
- Balises Open Graph pour un rendu soigné des liens partagés sur les réseaux sociaux
- Nom de domaine personnalisé (ex. `mapetanque.be`) à la place de `mapetanque.github.io`
