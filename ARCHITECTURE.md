# Architecture modulaire — contrepoint.app

## Structure
```
/
├── index.html          Navigation + conteneur #app (panneaux injectés)
├── css/style.css       CSS complet (identique à l'original)
├── js/
│   ├── main.js         Loader ESM (fetch HTML + import() JS)
│   ├── i18n.js         I18N + setLang + applyI18n (FR/EN/ES, 392 clés)
│   ├── shared.js       Globals partagés (sans switchTab — main.js le remplace)
│   ├── premium.js      Système Mode compositeur
│   ├── contact.js      Formulaire Web3Forms
│   ├── seo.js          Mise à jour URL canonique
│   ├── sw.js           Service Worker inline
│   └── modules/
│       ├── home.{html,js}         Onglet 0
│       ├── transposeur.{html,js}  Onglet 1
│       ├── intervalles.{html,js}  Onglet 2
│       ├── harmonie.{html,js}     Onglet 3
│       ├── accords.{html,js}      Onglet 4
│       ├── modes.{html,js}        Onglet 5
│       ├── cadences.{html,js}     Onglet 6
│       ├── metronome.{html,js}    Onglet 7
│       ├── rythme.{html,js}       Onglet 8
│       ├── formes.{html,js}       Onglet 9  (premium)
│       ├── modulation.{html,js}   Onglet 10 (premium)
│       ├── sequences.{html,js}    Onglet 11 (premium)
│       └── analyseur.{html,js}    Onglet 12 (premium)
├── sitemap.xml, robots.txt, README.md
```

## Comment ça marche

1. **Au démarrage** : `main.js` charge automatiquement `home` (onglet 0).
2. **Au clic sur un onglet** : `switchTab(i)` charge dynamiquement le module si non chargé :
   - `fetch('js/modules/xxx.html')` → injection dans `#app`
   - `import('./modules/xxx.js')` → chargement ESM (dédupé nativement par le navigateur)
   - `applyI18n()` → traduction des nouveaux nœuds
3. **Deep linking** : `?tab=modulation` ouvre directement cet onglet.
4. **Multilingue** : aucun fichier dupliqué. Une seule copie HTML + `data-i18n="key"`. `setLang('en')` retraduit tout in-place.

## Compatibilité Netlify

- 100% statique, aucun build step requis.
- Les `fetch()` relatifs (`js/modules/xxx.html`) fonctionnent sur n'importe quel hébergeur statique.
- Les imports ESM dynamiques sont supportés par tous les navigateurs modernes (Chrome 63+, Firefox 67+, Safari 11.1+).

## Ajouter une langue

1. Ouvrir `js/i18n.js`, dupliquer la clé `fr:` en `de:` (par exemple) pour chaque entrée.
2. Ajouter `'de'` dans `SUPPORTED` en haut du fichier.
3. Ajouter `<button class="lang-opt" data-lang="de" onclick="setLang('de')">DE — Deutsch</button>` dans `index.html`.

## Ajouter/modifier un module

- Modifier `js/modules/xxx.html` (UI) et `js/modules/xxx.js` (logique).
- Si nouveau module : ajouter son nom à `MODULES` dans `main.js` + bouton onglet dans `index.html` + clés `tab.N` dans `i18n.js` pour les 3 langues.

## Notes techniques

- Les onclick="..." inline du HTML legacy restent supportés : chaque module attache ses fonctions à `window` (T1, MOD, SEQ, AH, FM, CAD, TA…).
- Pas de fuite mémoire : les modules ne sont chargés qu'une fois (cache `LOADED` dans main.js). Le navigateur dédupe les `import()`.
- Les scripts globaux (`i18n`, `shared`, `premium`, `contact`, `seo`, `sw`) sont chargés en classiques (non-module) pour préserver les globals.
