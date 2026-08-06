# 🔎 Exploration : terrains de pétanque insolites (usage perso / futurs articles)

---

## Catégories envisagées et faisabilité

| Catégorie | Faisabilité | Méthode |
|---|---|---|
| Plus grands / plus de terrains côte à côte | ⚠️ Requête + tri manuel | Overpass sort la géométrie, mais ne calcule pas les surfaces ni ne détecte les regroupements — tri à faire après coup (tableur ou petit script) |
| Plus isolés (loin de toute voirie) | ⚠️ Requête + calcul | Nécessite un calcul de distance à la route la plus proche (QGIS ou script Python + `shapely`) — pas natif dans Overpass |
| Moins isolés (centre-ville) | ⚠️ Requête + calcul | Idem |
| **Les "plus beaux"** (parc, Ravel, rivière, tourisme) | ✅ Requête directe | Filtre spatial `around:` vers `leisure=park`, `waterway=river`, `tourism=*`, réseaux cyclables/pédestres |
| **Les mieux équipés** (éclairage, pique-nique, aire de jeux) | ✅ Requête directe | Tag `lit=yes` + proximité `leisure=playground` / `amenity=picnic_table` |
| **Terrains qui portent un nom** | ✅ Requête directe | Filtre simple sur la présence du tag `name` |
| **Près d'un bar (idéalement avec terrasse)** | ✅ Requête directe | Proximité `amenity=bar/pub` — ⚠️ la présence d'une terrasse est mal renseignée sur OSM, à vérifier sur place |
| **Près d'une brasserie** | ✅ Requête directe | Proximité `craft=brewery` |
| **Près d'un château ou d'une abbaye/monastère** | ✅ Requête directe | Proximité `historic=castle` / `historic=monastery` |
| Terrains couverts strictement publics | ❌ Non exploitable actuellement | Testé : les seuls terrains `indoor=yes` trouvés en Belgique sont des clubs privés, aucun terrain couvert public identifiable sur OSM à ce jour |

Autres pistes évoquées mais non explorées davantage : terrains en camping, près d'une piscine extérieure, en zone industrielle, multi-sports (tag `sport` combiné), en cimetière, avec revêtement inhabituel, tagués `access=private`.

## Requêtes Overpass retenues (Liège, adaptables à toute la Belgique)

Zone de référence utilisée : `area["name"="Liège"]["admin_level"="8"]["boundary"="administrative"]`
(pour toute la Belgique : `area["ISO3166-1"="BE"]["admin_level"="2"]`)

### 1. Les "plus beaux"
```
[out:json][timeout:60];
area["name"="Liège"]["admin_level"="8"]["boundary"="administrative"]->.liege;
nwr["leisure"="pitch"]["sport"~"petanque|boules"]["access"!="private"](area.liege)->.terrains;
(
  nwr(around.terrains:50)["leisure"="park"];
  nwr(around.terrains:50)["waterway"="river"];
  nwr(around.terrains:50)["tourism"];
  nwr(around.terrains:50)["route"~"bicycle|foot"]["network"~"rcn|rwn|ncn|nwn"];
)->.points_interet;
nwr.terrains(around.points_interet:50);
out center tags;
```

### 2. Les mieux équipés
```
[out:json][timeout:60];
area["name"="Liège"]["admin_level"="8"]["boundary"="administrative"]->.liege;
nwr["leisure"="pitch"]["sport"~"petanque|boules"]["access"!="private"](area.liege)->.terrains;
(
  nwr(around.terrains:30)["leisure"="playground"];
  nwr(around.terrains:30)["amenity"="picnic_table"];
)->.equipements;
(
  nwr.terrains["lit"="yes"];
  nwr.terrains(around.equipements:30);
);
out center tags;
```

### 3. Terrains qui portent un nom
```
[out:json][timeout:60];
area["name"="Liège"]["admin_level"="8"]["boundary"="administrative"]->.liege;
nwr["leisure"="pitch"]["sport"~"petanque|boules"]["access"!="private"]["name"](area.liege);
out center tags;
```

### 4. Près d'un bar
```
[out:json][timeout:60];
area["name"="Liège"]["admin_level"="8"]["boundary"="administrative"]->.liege;
nwr["leisure"="pitch"]["sport"~"petanque|boules"]["access"!="private"](area.liege)->.terrains;
(
  nwr(around.terrains:50)["amenity"~"bar|pub"];
)->.bars;
nwr.terrains(around.bars:50);
out center tags;
```

### 5. Près d'une brasserie
```
[out:json][timeout:60];
area["name"="Liège"]["admin_level"="8"]["boundary"="administrative"]->.liege;
nwr["leisure"="pitch"]["sport"~"petanque|boules"]["access"!="private"](area.liege)->.terrains;
nwr(around.terrains:150)["craft"="brewery"]->.brasseries;
nwr.terrains(around.brasseries:150);
out center tags;
```

### 6. Près d'un château ou d'une abbaye/monastère
```
[out:json][timeout:60];
area["name"="Liège"]["admin_level"="8"]["boundary"="administrative"]->.liege;
nwr["leisure"="pitch"]["sport"~"petanque|boules"]["access"!="private"](area.liege)->.terrains;
(
  nwr(around.terrains:200)["historic"="castle"];
  nwr(around.terrains:200)["historic"="monastery"];
)->.patrimoine;
nwr.terrains(around.patrimoine:200);
out center tags;
```

---

## Terrains identifiés sur Liège
Six terrains repérés, avec un itinéraire en boucle depuis le **Château de Fayenbois** (50.6315961, 5.6416968) :

| # | Lieu | Coordonnées | Description |
|---|---|---|---|
| 1 | Grivegnée — square avec fontaine | 50.6182401, 5.6106787 | Terrain dans un square calme, nombreux bancs |
| 2 | Grivegnée — nouveau terrain | 50.6215596, 5.5991553 | Petit square, plaine de jeux, fontaine d'eau potable |
| 3 | Boulodrome d'Outremeuse | 50.6446584, 5.581959 | Deux terrains publics le long de la Meuse, à l'ombre des arbres |
| 4 | Cointe — plaine des sports | 50.6217713, 5.5603485 | Près du parc communal (foot, athlétisme, streetworkout...) |
| 5 | Angleur — parc du château de Péralta | 50.610604, 5.5859395 | En surplomb du parc, cafétéria du hall omnisport à proximité |
| 6 | Chênée | 50.6097802, 5.6214508 | 2 terrains partiellement ombragés, parking et bancs |

## Idées non testées, à explorer plus tard

- Angle "brasserie + patrimoine" combiné pour un article dédié ("les terrains les plus insolites de Liège")
- Élargir les 6 requêtes retenues à toute la Belgique (juste changer la zone de référence)
- Pour les catégories "plus grands" / "plus/moins isolés" : passer par un export Overpass + tri dans un tableur, ou script Python avec `shapely` pour les calculs de distance/surface
