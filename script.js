// ===================== Icônes SVG réutilisables (popups des terrains) =====================

const ICON_PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>';
const ICON_ROUTE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>';
const ICON_SHARE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>';
const ICON_UNLOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>';
const ICON_MAP_PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>';
const ICON_CLOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';
const ICON_MAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>';

// Icône des marqueurs de terrain sur la carte (pin vert personnalisé, remplace le pin bleu par défaut de Leaflet)
const terrainMarkerIcon = L.divIcon({
    className: 'terrain-marker-icon',
    html: '<svg width="29" height="45" viewBox="0 0 29 45" xmlns="http://www.w3.org/2000/svg">' +
          '<g transform="translate(2,2)">' +
          '<path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 9.4 12.5 28.5 12.5 28.5s12.5-19.1 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="#74C15A" stroke="white" stroke-width="2"/>' +
          '<circle cx="12.5" cy="12.5" r="5" fill="white"/>' +
          '</g>' +
          '</svg>',
    iconSize: [29, 45],
    iconAnchor: [14, 43],
    popupAnchor: [0, -36]
});


// ===================== Gestion de la langue =====================

const LANGUES_DISPONIBLES = ['fr', 'nl', 'de'];

function detecterLanguePreferee() {
    const sauvegardee = localStorage.getItem('mapetanque_lang');
    if (sauvegardee && LANGUES_DISPONIBLES.includes(sauvegardee)) {
        return sauvegardee;
    }

    const navigateur = (navigator.language || 'fr').slice(0, 2).toLowerCase();
    return LANGUES_DISPONIBLES.includes(navigateur) ? navigateur : 'fr';
}

let currentLang = detecterLanguePreferee();

function t(cle) {
    return translations[currentLang][cle];
}

// Piste du panneau d'info actuellement ouvert, pour le régénérer si la langue change
let panneauOuvertActuel = null;

function appliquerTraductions() {

    const dict = translations[currentLang];

    document.documentElement.lang = dict.html_lang;

    // Textes simples
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
        el.textContent = dict[el.dataset.i18n];
    });

    // Attributs aria-label
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
        el.setAttribute('aria-label', dict[el.dataset.i18nAria]);
    });

    // Attributs placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
        el.setAttribute('placeholder', dict[el.dataset.i18nPlaceholder]);
    });

    // Titre + tagline
    document.getElementById('tagline').textContent = dict.tagline;

    // Crédit OpenStreetMap dans le footer
    document.getElementById('footer-credit-prefix').textContent = dict.footer_credit_prefix;

    // Bouton actif dans le sélecteur de langue
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });

    // Reconstruire le contenu (statique) des panneaux À propos/FAQ/Contact dans la nouvelle langue
    construireContenuPanneaux();

    // Régénérer les statistiques du footer
    mettreAJourStats();

    // Régénérer le bandeau chiffré de la section statistiques
    mettreAJourBandeauStats();

    // Actualiser les liens de partage du site dans le footer (texte traduit)
    if (typeof actualiserLiensPartageFooter === 'function') {
        actualiserLiensPartageFooter();
    }

    // Régénérer le titre par défaut d'un éventuel marqueur de recherche déjà ouvert
    if (typeof searchMarker !== 'undefined' && searchMarker && searchMarker.isPopupOpen()) {
        searchMarker.getPopup().setContent(searchMarker._displayName || '');
    }
}

function changerLangue(langue) {
    if (!LANGUES_DISPONIBLES.includes(langue)) return;
    currentLang = langue;
    localStorage.setItem('mapetanque_lang', langue);
    appliquerTraductions();
}

document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
        changerLangue(btn.dataset.lang);
    });
});


// ===================== Carte =====================

// Création de la carte centrée sur la Belgique
const map = L.map('map').setView([50.8503, 4.3517], 8);

let userPosition = null;

// Fond OpenStreetMap
const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
});

// Fond satellite
const satellite = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
        attribution: 'Tiles &copy; Esri'
    }
);

// Afficher OpenStreetMap par défaut
osm.addTo(map);

// Sélecteur de couches
const baseMaps = {
    "🗺️ Plan": osm,
    "🛰️ Satellite": satellite
};

L.control.layers(baseMaps).addTo(map);

// Sécurité : recalcule la taille de la carte une fois la page pleinement chargée
window.addEventListener('load', function () {
    map.invalidateSize();
});


// ===================== Flèche vers le terrain le plus proche (hors écran) =====================

// Liste plate de tous les terrains (indépendante des clusters), pour un calcul rapide du plus proche
let listeTousLesTerrains = [];
let terrainLePlusProche = null;

// Élément de la flèche, créé dynamiquement et ajouté à l'intérieur du conteneur de la carte
const flecheProche = document.createElement('div');
flecheProche.id = 'nearest-terrain-arrow';
flecheProche.className = 'nearest-arrow';
flecheProche.style.display = 'none';
flecheProche.innerHTML =
    '<span class="nearest-arrow-icon">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
    '<line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>' +
    '</svg></span>' +
    '<span class="nearest-arrow-label" data-i18n="nearest_terrain_label">Terrain le plus proche</span>';
document.getElementById('map').appendChild(flecheProche);

function trouverTerrainLePlusProche(lat, lon) {
    let plusProche = null;
    let distanceMin = Infinity;

    listeTousLesTerrains.forEach(function (t) {
        const d = calculDistance(lat, lon, t.lat, t.lon);
        if (d < distanceMin) {
            distanceMin = d;
            plusProche = t;
        }
    });

    return plusProche;
}

function mettreAJourFlecheTerrainProche() {

    if (!userPosition || !terrainLePlusProche) {
        flecheProche.style.display = 'none';
        return;
    }

    const latlngCible = L.latLng(terrainLePlusProche.lat, terrainLePlusProche.lon);

    // Le terrain le plus proche est déjà visible à l'écran : pas besoin de flèche
    if (map.getBounds().contains(latlngCible)) {
        flecheProche.style.display = 'none';
        return;
    }

    const tailleCarte = map.getSize();
    const centre = { x: tailleCarte.x / 2, y: tailleCarte.y / 2 };
    const pointCible = map.latLngToContainerPoint(latlngCible);

    const dx = pointCible.x - centre.x;
    const dy = pointCible.y - centre.y;

    // Position de la flèche sur le bord de la carte, en direction de la cible
    const marge = 55;
    const halfW = tailleCarte.x / 2 - marge;
    const halfH = tailleCarte.y / 2 - marge;

    let echelle;
    if (dx === 0) {
        echelle = halfH / Math.abs(dy);
    } else if (dy === 0) {
        echelle = halfW / Math.abs(dx);
    } else {
        echelle = Math.min(halfW / Math.abs(dx), halfH / Math.abs(dy));
    }

    const pointBord = {
        x: centre.x + dx * echelle,
        y: centre.y + dy * echelle
    };

    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    flecheProche.style.left = pointBord.x + 'px';
    flecheProche.style.top = pointBord.y + 'px';
    flecheProche.querySelector('.nearest-arrow-icon').style.transform = 'rotate(' + angle + 'deg)';
    flecheProche.style.display = 'flex';
}

// Recalcule la position/visibilité de la flèche à chaque déplacement ou zoom de la carte
map.on('move zoomend', mettreAJourFlecheTerrainProche);

// Cliquer sur la flèche centre directement la carte sur le terrain visé
flecheProche.addEventListener('click', function () {
    if (terrainLePlusProche) {
        map.setView([terrainLePlusProche.lat, terrainLePlusProche.lon], 17);
    }
});

// Appelé à chaque nouvelle localisation (géolocalisation ou recherche d'adresse)
function definirPositionUtilisateur(lat, lon) {
    userPosition = [lat, lon];
    terrainLePlusProche = trouverTerrainLePlusProche(lat, lon);
    mettreAJourFlecheTerrainProche();
}

// Icône réutilisée pour marquer une position (localisation ou résultat de recherche)
const positionIcon = L.divIcon({
    className: 'user-location',
    html: '<div></div>',
    iconSize: [20, 20]
});


// ===================== Géolocalisation =====================

document.getElementById("locateBtn").addEventListener("click", function () {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function(position) {

            let lat = position.coords.latitude;
            let lon = position.coords.longitude;

            definirPositionUtilisateur(lat, lon);

            map.setView([lat, lon], 15);

            L.marker([lat, lon], {
                icon: positionIcon
            })
            .addTo(map)
            .bindPopup(function () { return t('popup_here'); })
            .openPopup();

        }, function() {
            alert("Impossible de récupérer votre position.");
        });

    } else {
        alert("La géolocalisation n'est pas supportée par votre navigateur.");
    }

});


// ===================== Recherche d'adresse =====================

let searchMarker = null;

document.getElementById('searchForm').addEventListener('submit', function (e) {

    e.preventDefault();

    const input = document.getElementById('searchInput');
    const errorEl = document.getElementById('searchError');
    const query = input.value.trim();

    errorEl.textContent = '';

    if (!query) return;

    // Recherche biaisée vers la Belgique (sans l'exclure strictement, utile pour les communes frontalières)
    const url = 'https://nominatim.openstreetmap.org/search'
        + '?format=jsonv2'
        + '&q=' + encodeURIComponent(query)
        + '&limit=1'
        + '&viewbox=2.5,51.6,6.5,49.4'
        + '&bounded=0';

    fetch(url)
        .then(function (response) {
            if (!response.ok) throw new Error('Réponse Nominatim invalide');
            return response.json();
        })
        .then(function (resultats) {

            if (!resultats || resultats.length === 0) {
                errorEl.textContent = t('search_no_result');
                return;
            }

            const resultat = resultats[0];
            const lat = parseFloat(resultat.lat);
            const lon = parseFloat(resultat.lon);

            // Le point trouvé devient la référence pour le calcul de distance dans les popups des terrains
            definirPositionUtilisateur(lat, lon);

            // Zoom adapté à la nature du résultat (adresse précise, ville, région...)
            if (resultat.boundingbox) {
                const bbox = resultat.boundingbox.map(parseFloat);
                map.fitBounds([
                    [bbox[0], bbox[2]],
                    [bbox[1], bbox[3]]
                ]);
            } else {
                map.setView([lat, lon], 15);
            }

            if (searchMarker) {
                map.removeLayer(searchMarker);
            }

            searchMarker = L.marker([lat, lon], { icon: positionIcon })
                .addTo(map)
                .bindPopup(resultat.display_name)
                .openPopup();

            searchMarker._displayName = resultat.display_name;

        })
        .catch(function () {
            errorEl.textContent = t('search_failed');
        });

});


// ===================== Partage (site ou terrain précis) =====================

const sharePanel = document.getElementById('share-panel');
const shareOverlay = document.getElementById('share-overlay');
const shareTitleEl = document.getElementById('share-title');
const shareWhatsapp = document.getElementById('share-whatsapp');
const shareFacebook = document.getElementById('share-facebook');
const shareTwitter = document.getElementById('share-twitter');
const shareEmail = document.getElementById('share-email');
const shareCopyBtn = document.getElementById('share-copy');
const shareCopyLabel = document.getElementById('share-copy-label');

function ouvrirPartage(url, titre) {

    shareTitleEl.textContent = titre;

    const urlEncodee = encodeURIComponent(url);
    const texteEncode = encodeURIComponent(titre);

    shareWhatsapp.href = `https://wa.me/?text=${texteEncode}%20${urlEncodee}`;
    shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${urlEncodee}`;
    shareTwitter.href = `https://twitter.com/intent/tweet?url=${urlEncodee}&text=${texteEncode}`;
    shareEmail.href = `mailto:?subject=${texteEncode}&body=${urlEncodee}`;

    // Réinitialiser le libellé du bouton copier (au cas où il affichait "Lien copié !")
    shareCopyLabel.textContent = t('share_copy');
    shareCopyBtn.dataset.url = url;

    sharePanel.classList.add('open');
    shareOverlay.classList.add('visible');
}

function fermerPartage() {
    sharePanel.classList.remove('open');
    shareOverlay.classList.remove('visible');
}

document.getElementById('share-close').addEventListener('click', fermerPartage);
shareOverlay.addEventListener('click', fermerPartage);

shareCopyBtn.addEventListener('click', function () {
    const url = shareCopyBtn.dataset.url || window.location.href;

    navigator.clipboard.writeText(url).then(function () {
        shareCopyLabel.textContent = t('share_copied');
    }).catch(function () {
        // Navigateur trop ancien ou contexte non sécurisé : on sélectionne le texte via un prompt de secours
        window.prompt('Ctrl+C / Cmd+C :', url);
    });
});

// Fonction globale appelée depuis le lien "Partager" de chaque popup de terrain
window.partagerTerrain = function (lat, lon, titre) {
    const url = window.location.origin + window.location.pathname
        + `?lat=${lat.toFixed(6)}&lon=${lon.toFixed(6)}&z=18`;
    ouvrirPartage(url, titre);
};


// ===================== Icônes de partage du site (footer) =====================

const footerShareWhatsapp = document.getElementById('footer-share-whatsapp');
const footerShareFacebook = document.getElementById('footer-share-facebook');
const footerShareTwitter = document.getElementById('footer-share-twitter');
const footerShareEmail = document.getElementById('footer-share-email');
const footerShareCopy = document.getElementById('footer-share-copy');

function actualiserLiensPartageFooter() {

    const url = window.location.origin + window.location.pathname;
    const urlEncodee = encodeURIComponent(url);
    const texteEncode = encodeURIComponent(t('share_site_title'));

    footerShareWhatsapp.href = `https://wa.me/?text=${texteEncode}%20${urlEncodee}`;
    footerShareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${urlEncodee}`;
    footerShareTwitter.href = `https://twitter.com/intent/tweet?url=${urlEncodee}&text=${texteEncode}`;
    footerShareEmail.href = `mailto:?subject=${texteEncode}&body=${urlEncodee}`;
}

const copyTooltip = document.getElementById('copy-tooltip');
let copyTooltipTimeout = null;

footerShareCopy.addEventListener('click', function () {

    const url = window.location.origin + window.location.pathname;

    navigator.clipboard.writeText(url).then(function () {
        footerShareCopy.classList.add('footer-share-copied');

        copyTooltip.textContent = t('share_copied');
        copyTooltip.classList.add('visible');

        clearTimeout(copyTooltipTimeout);
        copyTooltipTimeout = setTimeout(function () {
            footerShareCopy.classList.remove('footer-share-copied');
            copyTooltip.classList.remove('visible');
        }, 2000);

    }).catch(function () {
        // Navigateur trop ancien ou contexte non sécurisé : on sélectionne le texte via un prompt de secours
        window.prompt('Ctrl+C / Cmd+C :', url);
    });
});


// ===================== Calcul de distance =====================

function calculDistance(lat1, lon1, lat2, lon2) {

    const R = 6371; // rayon de la Terre en km

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) *
        Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}


// ===================== Chargement des terrains =====================

const markers = L.markerClusterGroup({
    disableClusteringAtZoom: 16
});

fetch('data/terrains.geojson')
    .then(response => response.json())
    .then(data => {

        // Nombre de terrains recensés (pour le footer)
        afficherNombreTerrains(data.features.length);

        // Liste plate de tous les terrains, pour le calcul du plus proche (flèche hors écran)
        listeTousLesTerrains = data.features.map(function (feature) {
            return {
                lat: feature.geometry.coordinates[1],
                lon: feature.geometry.coordinates[0]
            };
        });

        L.geoJSON(data, {

            pointToLayer: function(feature, latlng) {

                return L.marker(latlng, { icon: terrainMarkerIcon });

            },

            onEachFeature: function(feature, layer) {

                let tags = feature.properties;

                function genererContenuPopup() {

                    let acces = (tags.access === "public" || tags.access === "yes")
                        ? t('popup_access_public')
                        : t('popup_access_probable');

                    let titre = tags.nearest_street
                        ? t('popup_terrain_prefix') + " " + tags.nearest_street
                        : t('popup_terrain_default');

                    let distance = "";

                    if (userPosition) {

                        let terrainLat = layer.getLatLng().lat;
                        let terrainLon = layer.getLatLng().lng;

                        let km = calculDistance(
                            userPosition[0],
                            userPosition[1],
                            terrainLat,
                            terrainLon
                        );

                        let valeurDistance = km < 1
                            ? `${Math.round(km * 1000)} m`
                            : `${km.toFixed(1)} km`;

                        distance = `<br><span class="popup-icon">${ICON_PIN}</span> ${t('popup_distance_label')} : ${valeurDistance}`;

                    } else {

                        distance = `<br><span class="popup-icon">${ICON_PIN}</span> ${t('popup_distance_hint')}`;

                    }

                    let terrainLat = layer.getLatLng().lat;
                    let terrainLon = layer.getLatLng().lng;

                    let itineraire = `
                    <br><br>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${terrainLat},${terrainLon}" target="_blank">
                    <span class="popup-link-icon">${ICON_ROUTE}</span> <span class="popup-link-text">${t('popup_itinerary')}</span>
                    </a>
                    `;

                    let partager = `
                    <br>
                    <a href="#" class="popup-share-btn">
                    <span class="popup-link-icon">${ICON_SHARE}</span> <span class="popup-link-text">${t('popup_share')}</span>
                    </a>
                    `;

                    return `
                    <b>${titre}</b><br><br>
                    <span class="popup-icon">${ICON_UNLOCK}</span> ${t('popup_access_label')} : ${acces}
                    ${distance}
                    ${itineraire}
                    ${partager}
                    `;

                }

                layer.bindPopup(genererContenuPopup);

                // Bouton "Partager" du popup : branché à chaque ouverture pour éviter
                // tout souci d'échappement de caractères spéciaux dans le nom de rue
                layer.on('popupopen', function (e) {
                    const boutonPartage = e.popup.getElement().querySelector('.popup-share-btn');
                    if (!boutonPartage) return;

                    boutonPartage.onclick = function (evt) {
                        evt.preventDefault();

                        const titreActuel = tags.nearest_street
                            ? t('popup_terrain_prefix') + " " + tags.nearest_street
                            : t('popup_terrain_default');

                        window.partagerTerrain(layer.getLatLng().lat, layer.getLatLng().lng, titreActuel);
                    };
                });

            }

        }).addTo(markers);

        map.addLayer(markers);

        // Lien de partage d'un terrain précis (?lat=...&lon=...) : centrer et ouvrir son popup
        const urlParams = new URLSearchParams(window.location.search);
        const paramLat = parseFloat(urlParams.get('lat'));
        const paramLon = parseFloat(urlParams.get('lon'));

        if (!isNaN(paramLat) && !isNaN(paramLon)) {

            let layerCorrespondant = null;

            markers.eachLayer(function (layer) {
                if (layerCorrespondant) return;
                const pos = layer.getLatLng();
                if (Math.abs(pos.lat - paramLat) < 0.0001 && Math.abs(pos.lng - paramLon) < 0.0001) {
                    layerCorrespondant = layer;
                }
            });

            if (layerCorrespondant) {
                markers.zoomToShowLayer(layerCorrespondant, function () {
                    layerCorrespondant.openPopup();
                });
            } else {
                // Terrain introuvable (peut-être retiré depuis) : on centre quand même sur les coordonnées
                map.setView([paramLat, paramLon], 18);
            }
        }

    });


// ===================== Menu burger =====================

const menuButton = document.getElementById("menu-button");
const sideMenu = document.getElementById("side-menu");
const closeMenu = document.getElementById("close-menu");
const menuOverlay = document.getElementById("menu-overlay");

menuButton.addEventListener("click", function () {
    sideMenu.classList.add("open");
    menuOverlay.classList.add("visible");
});

closeMenu.addEventListener("click", function () {
    sideMenu.classList.remove("open");
    menuOverlay.classList.remove("visible");
});

menuOverlay.addEventListener("click", function () {
    sideMenu.classList.remove("open");
    menuOverlay.classList.remove("visible");
});


// ===================== Panneau d'info (À propos / Contact / FAQ) =====================

const infoPanel = document.getElementById("info-panel");
const infoOverlay = document.getElementById("info-overlay");
const closeInfo = document.getElementById("close-info");
const infoNavLinks = document.querySelectorAll('.info-nav-link');

function construireContenuAbout(dict) {
    const p = document.createElement('p');
    p.textContent = dict.about_text;

    const fragment = document.createDocumentFragment();
    fragment.appendChild(p);
    return fragment;
}

function construireContenuContact(dict) {
    const p = document.createElement('p');
    p.textContent = dict.contact_text + " ";

    const icone = document.createElement('span');
    icone.className = 'popup-icon';
    icone.innerHTML = ICON_MAIL;
    p.appendChild(icone);
    p.appendChild(document.createTextNode(' '));

    const lien = document.createElement('a');
    lien.href = "mailto:" + dict.contact_email;
    lien.textContent = dict.contact_email;
    p.appendChild(lien);

    const fragment = document.createDocumentFragment();
    fragment.appendChild(p);
    return fragment;
}

function construireContenuFaq(dict) {
    const fragment = document.createDocumentFragment();

    dict.faq_items.forEach(function (item) {
        const details = document.createElement('details');
        details.className = 'faq-item';

        const summary = document.createElement('summary');
        summary.textContent = item.q;

        const p = document.createElement('p');
        // Remplace l'emoji 📧 par l'icône SVG cohérente avec le reste du site
        p.innerHTML = item.a
            .split('📧')
            .join('<span class="popup-icon">' + ICON_MAIL + '</span>');

        details.appendChild(summary);
        details.appendChild(p);
        fragment.appendChild(details);
    });

    return fragment;
}

// Construit le contenu des 3 pages du panneau et les injecte dans le DOM.
// Appelée au chargement de la page ET à chaque changement de langue (jamais au clic) :
// le contenu existe donc dans le HTML dès le rendu initial, indépendamment de toute interaction.
function construireContenuPanneaux() {
    const dict = translations[currentLang];

    const pageAbout = document.getElementById('info-page-about');
    pageAbout.innerHTML = "";
    pageAbout.appendChild(construireContenuAbout(dict));

    const pageFaq = document.getElementById('info-page-faq');
    pageFaq.innerHTML = "";
    pageFaq.appendChild(construireContenuFaq(dict));

    const pageContact = document.getElementById('info-page-contact');
    pageContact.innerHTML = "";
    pageContact.appendChild(construireContenuContact(dict));
}

// Le clic ne fait plus que basculer quelle page est visible (le contenu existe déjà)
function ouvrirPanneauInfo(targetId) {

    document.querySelectorAll('.info-page').forEach(function (page) {
        page.classList.toggle('active', page.id === 'info-page-' + targetId);
    });

    panneauOuvertActuel = targetId;

    // Mettre en évidence l'onglet correspondant dans la mini-navigation
    infoNavLinks.forEach(function (btn) {
        btn.classList.toggle('active', btn.dataset.target === targetId);
    });

    infoPanel.classList.add("open");
    infoOverlay.classList.add("visible");
}

function fermerPanneauInfo() {
    infoPanel.classList.remove("open");
    infoOverlay.classList.remove("visible");
    panneauOuvertActuel = null;
}

document.querySelectorAll('#side-menu a').forEach(function (link) {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        // Fermer le menu burger
        sideMenu.classList.remove('open');
        menuOverlay.classList.remove('visible');

        // Ouvrir le panneau avec le contenu correspondant
        const targetId = this.getAttribute('href').replace('#', '');
        ouvrirPanneauInfo(targetId);
    });
});

// Navigation desktop (barre du header) : ouvre directement le panneau d'info
// (le sélecteur [data-target] exclut le lien "Statistiques", qui partage la même classe
// visuelle .info-nav-trigger mais pointe vers une vraie ancre de page, pas vers le panneau)
document.querySelectorAll('.info-nav-trigger[data-target]').forEach(function (btn) {
    btn.addEventListener('click', function () {
        ouvrirPanneauInfo(btn.dataset.target);
    });
});

// Mini-navigation en haut du panneau : change de contenu sans le fermer
infoNavLinks.forEach(function (btn) {
    btn.addEventListener('click', function () {
        ouvrirPanneauInfo(btn.dataset.target);
    });
});

closeInfo.addEventListener('click', fermerPanneauInfo);
infoOverlay.addEventListener('click', fermerPanneauInfo);


// ===================== Section statistiques =====================

// Le lien au-dessus de la carte est une vraie ancre HTML (href="#stats-section") :
// le scroll fluide est géré nativement par le navigateur (scroll-behavior: smooth en CSS),
// aucun JS n'est nécessaire pour la navigation elle-même.

// Affiche le nombre total de terrains dans le bandeau chiffré de la section stats
function mettreAJourBandeauStats() {
    const el = document.querySelector('.stats-headline-number');
    if (!el) return;
    el.textContent = terrainsCount !== null ? terrainsCount : '…';
}

// ===================== Statistiques du footer =====================

let terrainsCount = null;
let lastUpdateRaw = null; // objet Date brut, reformaté selon la langue active
let comptageTermine = false;
let dateTermine = false;

function mettreAJourStats() {
    const statsEl = document.getElementById('site-stats');
    if (!statsEl) return;

    let parts = [];

    if (terrainsCount !== null) {
        parts.push(`<span class="footer-stats-icon">${ICON_MAP_PIN}</span> ${t('stats_count')(terrainsCount)}`);
    }

    if (lastUpdateRaw !== null) {
        const dateFormatee = lastUpdateRaw.toLocaleDateString(t('date_locale'), {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        parts.push(`<span class="footer-stats-icon">${ICON_CLOCK}</span> ${t('stats_last_update')} : ${dateFormatee}`);
    }

    if (parts.length > 0) {
        statsEl.innerHTML = parts.join(' · ');
    } else if (!comptageTermine && !dateTermine) {
        statsEl.textContent = t('stats_loading');
    } else {
        statsEl.textContent = t('stats_unavailable');
    }
}

function afficherNombreTerrains(count) {
    terrainsCount = count;
    comptageTermine = true;
    mettreAJourStats();
    mettreAJourBandeauStats();
}

// Date du dernier commit ayant modifié terrains.geojson, via l'API GitHub
fetch('https://api.github.com/repos/mapetanque/mapetanque.github.io/commits?path=data/terrains.geojson&page=1&per_page=1')
    .then(function (response) {
        if (!response.ok) throw new Error('Réponse API GitHub invalide');
        return response.json();
    })
    .then(function (commits) {
        if (commits.length > 0) {
            lastUpdateRaw = new Date(commits[0].commit.author.date);
        }
        dateTermine = true;
        mettreAJourStats();
    })
    .catch(function () {
        dateTermine = true;
        mettreAJourStats();
    });


// ===================== Footer toujours visible (position fixed) =====================

// Le footer est en position fixed ; on mesure sa hauteur réelle pour que .map-view et le bas de
// page lui réservent toujours exactement la bonne place (variable CSS --footer-height).
// ResizeObserver capte tous les cas qui changent cette hauteur : chargement, redimensionnement de
// la fenêtre, changement de langue (texte plus ou moins long), passage à la ligne du contenu, etc.
const footerEl = document.querySelector('footer');
if (footerEl) {
    if (window.ResizeObserver) {
        new ResizeObserver(function (entries) {
            for (const entry of entries) {
                document.documentElement.style.setProperty('--footer-height', entry.contentRect.height + 'px');
            }
        }).observe(footerEl);
    } else {
        // Repli pour les navigateurs sans ResizeObserver
        const ajusterHauteurFooter = function () {
            document.documentElement.style.setProperty('--footer-height', footerEl.offsetHeight + 'px');
        };
        ajusterHauteurFooter();
        window.addEventListener('resize', ajusterHauteurFooter);
    }
}


// ===================== Initialisation =====================

appliquerTraductions();