# 📊 Piste future : page statistiques par commune / province / région

Document de réflexion (rien n'est développé, juste la faisabilité explorée).

---

## Objectif

Une page affichant, par commune, ville, province et région :
- le nombre total de terrains
- le nombre de terrains par km²
- le nombre de terrains ajoutés/supprimés le mois dernier

## Faisabilité par élément

### 1. Nombre de terrains par commune / province / région
✅ **Facile.** Le script fait déjà une requête Nominatim par terrain (pour le nom de rue). Il suffit d'exploiter les champs d'adresse supplémentaires déjà présents dans la réponse Nominatim (commune, province, région) — aucun nouvel appel réseau nécessaire.

### 2. Nombre de terrains par km²
⚠️ **Faisable, mais demande une donnée supplémentaire** : la superficie de chaque commune/province/région.
- **Option recommandée** : données officielles Statbel (institut belge de statistique), en open data.
- Option alternative (plus complexe) : calcul via polygones de frontières administratives avec `geopandas`/`shapely` — nécessite une projection cartographique adaptée pour un calcul de surface précis.

### 3. Terrains ajoutés/supprimés le mois dernier
✅ **Faisable directement via OSM**, sans avoir à archiver nos propres snapshots.

Overpass propose un mécanisme fait pour ça : les **"augmented diffs" (adiff)**. En interrogeant Overpass avec deux dates (il y a un mois / aujourd'hui) pour une requête donnée, il renvoie directement les éléments créés, modifiés ou supprimés entre les deux — pas besoin de comparer nous-mêmes deux fichiers ni d'archiver quoi que ce soit.

**Avantages :**
- Pas de stockage de snapshots hebdomadaires nécessaire.
- Donnée exacte, gérée par OSM directement.
- Rend inutile le "chantier de versionning" évoqué comme piste future dans le README.

**Points de vigilance :**
- Un terrain "supprimé" dans nos résultats peut simplement avoir été re-tagué (perte du tag `sport=petanque`) sans avoir été physiquement détruit — à formuler prudemment ("retiré de la carte" plutôt que "détruit").
- Une requête adiff sur toute la Belgique peut être plus lourde ; à tester pour ne pas dépasser les limites des serveurs Overpass gratuits.
- Un terrain qui existe depuis des années mais vient seulement d'être cartographié apparaîtra comme "ajouté ce mois-ci" — nuance à garder en tête si les chiffres sont communiqués publiquement.

## Architecture envisagée

Cohérente avec l'existant : toujours 100% statique.
- Le script Python calcule les agrégats (comptages, densité, deltas mensuels via adiff) → génère un fichier JSON de données.
- Une page HTML dédiée affiche ces données (tableau/graphique).
- Pas de backend, pas de base de données nécessaire.

## Prochaine étape suggérée

1. Commencer par les points 1 et 2 (relativement rapides).
2. Tester une requête adiff sur Overpass Turbo pour voir concrètement ce qu'elle renvoie, avant de l'intégrer au script.
3. Traiter le point 3 comme un vrai petit chantier à part.
