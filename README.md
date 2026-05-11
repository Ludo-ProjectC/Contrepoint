# Patch documentation `contrepoint-documentation.md`

5 remplacements ciblés pour refléter la refonte typographique complète
(Inter onglets + Fraunces sur H1 **et 5 titres de section** + nouveau sous-titre poétique).

---

## 🔧 Patch 1/5 — Section 5.3 « Performance et PWA »

### À CHERCHER (ligne ~180)

```
- **Preload** : police DM Sans + DM Serif Display
```

### À REMPLACER PAR

```
- **Preload** : polices DM Sans, DM Serif Display, Inter, Fraunces (4 fontes Google Fonts)
```

---

## 🔧 Patch 2/5 — Section 6.4 « Barre d'onglets — Pills aérées B+ »

### À CHERCHER (lignes ~217-224)

```
### 6.4 Barre d'onglets — Pills aérées B+

- Fond transparent (gap 1px entre onglets)
- Onglets : padding 8×14px, font 11.5px weight 500, color `#6b6884`
- Hover : pill `rgba(83,74,183,.05)` smooth
- Onglet actif : pill blanche + bordure violet + double ombre
- Séparateur subtil entre Rythme et Formes (gradient vertical 1px)
- Onglets Mode compositeur : ✦ doré, couleur `#5b54a8` → `#3730A3` au hover
```

### À REMPLACER PAR

```
### 6.4 Barre d'onglets — Pills aérées B+ (Inter)

- Fond transparent (gap 1px entre onglets)
- Onglets : **font Inter** (avec fallback DM Sans), padding 8×14px, font 12px weight 500, color `#6b6884`, letter-spacing `-.01em`
- Variantes stylistiques activées : `cv11` (1 distinctif), `ss01` (a single-storey), `ss03` (g moderne) + antialiasing
- Hover : pill `rgba(83,74,183,.05)` smooth + couleur `#534AB7`
- Onglet actif : pill blanche + bordure violet + double ombre
- Séparateur subtil entre Rythme et Formes (gradient vertical 1px)
- Onglets Mode compositeur : ✦ doré, couleur `#5b54a8` → `#3730A3` au hover

### 6.4bis Hero H1 — Refonte typographique éditoriale

- **H1 en Fraunces** (serif variable, axes `opsz` et `SOFT`) — distinct du logo en DM Serif Display
- Taille 42px, weight 600, letter-spacing `-.022em`, `opsz: 144` + `SOFT: 50`
- Mot-clé final en `<em>` italique violet (`#534AB7`) avec `SOFT: 100` (douceur accentuée) — signature visuelle
- HTML utilise `data-i18n-html` (au lieu de `data-i18n`) pour interpréter la balise `<em>`
- Mobile : 30px (au lieu de 26px) avec letter-spacing `-.018em`

**Phrase H1 trilingue** :
- FR : « De votre première idée jusqu'à la dernière *mesure*. »
- EN : « From your first idea to the final *measure*. »
- ES : « De tu primera idea hasta el último *compás*. »

**Sous-titre Hero** (Inter 16px, color `#5b5870`, line-height 1.6) :
- FR : « Esquissez vos motifs, explorez les harmonies, structurez vos formes — la théorie au service de votre imagination. »
- EN : « Sketch your motifs, explore harmonies, structure your forms — theory at the service of your imagination. »
- ES : « Esboza tus motivos, explora las armonías, estructura tus formas — la teoría al servicio de tu imaginación. »

### 6.4ter Titres de section en Fraunces (cohérence éditoriale globale)

Pour assurer une cohérence éditoriale forte sur toute la page d'accueil, **5 titres de section** ont été passés en Fraunces (même hiérarchie que le H1 Hero) :

| Section | Sélecteur CSS | Texte FR |
|---|---|---|
| Vidéo « Découvrir » | `.home-section-video .home-section-title` | « Voir Contrepoint en action » |
| Accès libre | `.home-section .home-section-title` | « 8 outils essentiels pour la théorie musicale — 100% gratuits » |
| Mode compositeur | `.home-section-premium .home-section-title` | « Outils avancés pour la composition, la modulation et l'analyse harmonique » |
| FAQ | `.home-section-faq .home-faq-title` | « Questions fréquentes » |
| Donate | `.home-section-donate .home-donate-title` | « Vous trouvez Contrepoint utile ? » |

**Réglages communs** :
- `font-family: 'Fraunces', 'DM Serif Display', serif`
- `font-weight: 600` (au lieu de 700 pour DM Sans : Fraunces est plus présente)
- `font-variation-settings: "opsz" 144, "SOFT" 50`
- `-webkit-font-smoothing: antialiased`
- Letter-spacing : `-.012em` (titres standards) ou `-.018em` (FAQ, plus gros)

**Note SEO** : le HTML statique du titre Mode compositeur a été synchronisé avec sa traduction i18n (ajout de « la modulation » dans la phrase FR pour cohérence crawler).
```

---

## 🔧 Patch 3/5 — Section 10 « Stack technique » (bloc Polices)

### À CHERCHER (lignes ~320-325)

```
**Polices** :
- **DM Sans** (400, 500, 600, 700) : corps de texte
- **DM Serif Display** (400) : logo Contrepoint
- **JetBrains Mono** (uniquement pour les portées d'export PDF)
```

### À REMPLACER PAR

```
**Polices** (hiérarchie à 3 fontes principales) :
- **DM Serif Display** (400) : logo Contrepoint (identité brand exclusive)
- **Fraunces** (variable, axes `opsz` et `SOFT`, weights 400/600/700, italic) : H1 Hero + 5 titres H2 de section éditoriaux
- **Inter** (400, 500, 600, 700) : navigation (onglets), sous-titres, UI moderne
- **DM Sans** (400, 500, 600, 700) : corps de texte général (fallback Inter)
- **JetBrains Mono** (uniquement pour les portées d'export PDF)

**Hiérarchie éditoriale** :
- DM Serif Display → identité brand uniquement (logo)
- Fraunces → moments éditoriaux (H1 Hero + 5 titres H2 de section page d'accueil)
- Inter → tout le reste (navigation, body, UI)
```

---

## 🔧 Patch 4/5 — Section 15 « Historique » (nouvelle entrée en tête)

### À CHERCHER (lignes ~386-395)

```
## 15. Historique

- **Mai 2026** : rebrand officiel « Projet C » → « Contrepoint »
  - Migration du nom dans 142 occurrences
  - Nouvelle URL : `https://contrepoint.app`
  - Nouveau logo : DM Serif Display 30px violet (style Spitfire)
  - Suppression de la tagline « Music Tools »
  - Régénération de l'og:image, favicon, manifest PWA
  - Conservation des localStorage `pc_*` pour ne pas casser les licences existantes
```

### À REMPLACER PAR

```
## 15. Historique

- **Mai 2026 (révision typographique)** : refonte de la hiérarchie typographique
  - Onglets nav : passage de DM Sans → **Inter 12px** avec variantes stylistiques `cv11`/`ss01`/`ss03`
  - H1 Hero : passage de DM Sans 34px → **Fraunces 42px** (serif variable, axe `opsz`/`SOFT`)
  - Mot-clé final du H1 en `<em>` italique violet (signature visuelle)
  - Refonte de la phrase H1 et du sous-titre dans les 3 langues (ton plus poétique/éditorial)
  - **Extension Fraunces aux 5 titres H2 de section** (Vidéo, Accès libre, Mode compositeur, FAQ, Donate) pour cohérence éditoriale globale
  - Synchronisation du HTML statique du titre Mode compositeur avec sa traduction i18n (ajout de « la modulation »)
  - Hiérarchie finale à 3 fontes : DM Serif Display (logo) → Fraunces (H1 + H2) → Inter (UI)

- **Mai 2026** : rebrand officiel « Projet C » → « Contrepoint »
  - Migration du nom dans 142 occurrences
  - Nouvelle URL : `https://contrepoint.app`
  - Nouveau logo : DM Serif Display 30px violet (style Spitfire)
  - Suppression de la tagline « Music Tools »
  - Régénération de l'og:image, favicon, manifest PWA
  - Conservation des localStorage `pc_*` pour ne pas casser les licences existantes
```

---

## 🔧 Patch 5/5 (optionnel) — Mise à jour du footer

### À CHERCHER

```
*Document généré : 8 mai 2026*
```

### À REMPLACER PAR

```
*Document généré : 8 mai 2026 — révision typographique étendue (H1 + 5 titres H2 en Fraunces)*
```

---

## ℹ️ Notes sur `sitemap.xml` et `robots.txt`

| Fichier | Verdict | Raison |
|---|---|---|
| `sitemap.xml` | ✅ **Aucune modification nécessaire** | Le `<lastmod>` est déjà à `2026-05-08`. Aucune URL ajoutée/supprimée — seuls des contenus textuels changent, sans impact sur le crawl. |
| `robots.txt` | ✅ **Aucune modification nécessaire** | Aucun lien avec la typographie. Les directives crawl restent valides. |

---

## ✅ Récapitulatif des fichiers à modifier

| Fichier | Patches | Statut |
|---|---|---|
| `contrepoint.html` | 6 patches initiaux + extension Fraunces aux 5 titres H2 | ✅ Appliqué et livré |
| `contrepoint-documentation.md` | 5 patches (ce document) | À appliquer |
| `sitemap.xml` | — | Inchangé |
| `robots.txt` | — | Inchangé |
