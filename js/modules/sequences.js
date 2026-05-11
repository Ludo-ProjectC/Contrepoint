/* ═══ sequences.js — Module Séquences harmoniques ═══ */
// ── Music theory constants ──
const SEQ_NOTE_S = ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
const SEQ_NOTE_F = ['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'];
const SEQ_LETTERS = ['C','D','E','F','G','A','B'];
const SEQ_MAJ_SCALE = [0,2,4,5,7,9,11]; // semitones from root
const SEQ_MIN_SCALE_NAT = [0,2,3,5,7,8,10]; // natural minor
const SEQ_MIN_SCALE_HAR = [0,2,3,5,7,8,11]; // harmonic minor

const SEQ_KEY_PAIRS = [
  {maj:'C',min:'A'},{maj:'G',min:'E'},{maj:'D',min:'B'},{maj:'A',min:'F♯'},
  {maj:'E',min:'C♯'},{maj:'B',min:'G♯'},{maj:'F♯',min:'D♯'},
  {maj:'G♭',min:'E♭'},{maj:'D♭',min:'B♭'},{maj:'A♭',min:'F'},
  {maj:'E♭',min:'C'},{maj:'B♭',min:'G'},{maj:'F',min:'D'}
];

const SEQ_KS_MAJ = {'C':0,'G':1,'D':2,'A':3,'E':4,'B':5,'F♯':6,'G♭':-6,'D♭':-5,'A♭':-4,'E♭':-3,'B♭':-2,'F':-1};
const SEQ_KS_MIN = {'A':0,'E':1,'B':2,'F♯':3,'C♯':4,'G♯':5,'D♯':6,'E♭':-6,'B♭':-5,'F':-4,'C':-3,'G':-2,'D':-1};

function SEQ_noteToPC(n){const m=n.replace(/♯/g,'#').replace(/♭/g,'b');const t={'C':0,'C#':1,'Db':1,'D':2,'D#':3,'Eb':3,'E':4,'Fb':4,'E#':5,'F':5,'F#':6,'Gb':6,'G':7,'G#':8,'Ab':8,'A':9,'A#':10,'Bb':10,'B':11,'Cb':11,'B#':0};return t[m]??0;}
function SEQ_useFlats(k){return ['F','B♭','E♭','A♭','D♭','G♭','D','G','C','F','B♭','E♭'].includes(k);}
function SEQ_pcToName(pc,key){return(SEQ_useFlats(key)?SEQ_NOTE_F:SEQ_NOTE_S)[((pc%12)+12)%12];}

// Chromatic roman numeral label (for non-diatonic sequences)
function SEQ_chromRoman(semiFromTonic, qType){
  const deg = ['I','♭II','II','♭III','III','IV','♯IV','V','♭VI','VI','♭VII','VII'][((semiFromTonic%12)+12)%12];
  if(qType === 'dom7') return deg + '7';
  if(qType === 'dim7') return deg.toLowerCase() + '°7';
  if(qType === 'min') return deg.toLowerCase();
  return deg;
}

// Get scale degrees for a key
function SEQ_getScale(key, mode){
  const root = SEQ_noteToPC(key);
  const pattern = mode === 'major' ? SEQ_MAJ_SCALE : SEQ_MIN_SCALE_HAR;
  return pattern.map(s => (root + s) % 12);
}

// Build triad from scale degree (0-indexed)
function SEQ_buildTriad(scale, deg){
  return [scale[deg], scale[(deg+2)%7], scale[(deg+4)%7]];
}

// Build seventh chord from scale degree
function SEQ_buildSeventh(scale, deg){
  return [scale[deg], scale[(deg+2)%7], scale[(deg+4)%7], scale[(deg+6)%7]];
}

// Chord quality detection
function SEQ_chordQuality(notes){
  const r = notes[0];
  const intervals = notes.slice(1).map(n => ((n - r) % 12 + 12) % 12);
  if(notes.length === 3){
    if(intervals[0]===4 && intervals[1]===7) return 'M';
    if(intervals[0]===3 && intervals[1]===7) return 'm';
    if(intervals[0]===3 && intervals[1]===6) return 'dim';
    if(intervals[0]===4 && intervals[1]===8) return 'aug';
    return '?';
  }
  if(notes.length === 4){
    if(intervals[0]===4 && intervals[1]===7 && intervals[2]===11) return 'M7';
    if(intervals[0]===4 && intervals[1]===7 && intervals[2]===10) return '7';
    if(intervals[0]===3 && intervals[1]===7 && intervals[2]===10) return 'm7';
    if(intervals[0]===3 && intervals[1]===6 && intervals[2]===10) return 'ø7';
    if(intervals[0]===3 && intervals[1]===6 && intervals[2]===9) return 'o7';
    if(intervals[0]===3 && intervals[1]===7 && intervals[2]===11) return 'mM7';
    return '?7';
  }
  return '?';
}

// Roman numeral labels
const SEQ_ROM_MAJ = ['I','ii','iii','IV','V','vi','vii°'];
const SEQ_ROM_MIN = ['i','ii°','III','iv','V','VI','vii°']; // harmonic minor: V is major
const SEQ_ROM_MAJ7 = ['IΔ7','ii7','iii7','IVΔ7','V7','vi7','viiø7'];
const SEQ_ROM_MIN7 = ['imΔ7','iiø7','IIIΔ7','iv7','V7','VIΔ7','vii°7'];

// ── Sequence definitions ──
const SEQ_SEQUENCES = [
  // Category: Quintes
  {cat:'Quintes',id:'d5',name:'Quintes descendantes (triades)',desc:'La séquence la plus fondamentale. Basse descend par quinte, monte par quarte.',
   degrees:[0,3,6,2,5,1,4,0], use7:false, modelLen:2, tags:['fondamental']},
  {cat:'Quintes',id:'d5_7',name:'Quintes descendantes (septièmes)',desc:'Chaîne de septièmes descendant par quinte. Résolution 7→3 systématique.',
   degrees:[0,3,6,2,5,1,4,0], use7:true, modelLen:2, tags:['septièmes']},
  {cat:'Quintes',id:'a5',name:'Quintes ascendantes (triades)',desc:'Mouvement de basse par quinte ascendante. Moins fréquent.',
   degrees:[0,4,1,5,2,6,3,0], use7:false, modelLen:2, tags:['rare']},
  {cat:'Quintes',id:'a5_7',name:'Quintes ascendantes (septièmes)',desc:'Chaîne de septièmes montant par quinte.',
   degrees:[0,4,1,5,2,6,3,0], use7:true, modelLen:2, tags:['septièmes','rare']},
  
  // Category: Tierces
  {cat:'Tierces',id:'d3',name:'Tierces descendantes',desc:'Basse descend par tierce. Effet de glissement harmonique doux.',
   degrees:[0,5,3,1,6,4,0], use7:false, modelLen:2, tags:['chromatique']},
  {cat:'Tierces',id:'d3_7',name:'Tierces descendantes (septièmes)',desc:'Tierces descendantes avec accords de septième.',
   degrees:[0,5,3,1,6,4,0], use7:true, modelLen:2, tags:['septièmes']},
  {cat:'Tierces',id:'a3',name:'Tierces ascendantes',desc:'Basse monte par tierce. Crée un effet d\'expansion harmonique.',
   degrees:[0,2,4,6,1,3,5,0], use7:false, modelLen:2, tags:[]},
  
  // Category: Secondes
  {cat:'Secondes',id:'d2',name:'Secondes descendantes',desc:'Basse descend par degré conjoint. Effet de lamento / basse chromatique.',
   degrees:[0,6,5,4,3,2,1,0], use7:false, modelLen:2, tags:['lamento']},
  {cat:'Secondes',id:'d2_7',name:'Secondes descendantes (septièmes)',desc:'Basse descendante par degré conjoint avec septièmes.',
   degrees:[0,6,5,4,3,2,1,0], use7:true, modelLen:2, tags:['septièmes','lamento']},
  {cat:'Secondes',id:'a2',name:'Secondes ascendantes',desc:'Basse monte par degré conjoint. Règle de l\'octave ascendante.',
   degrees:[0,1,2,3,4,5,6,0], use7:false, modelLen:2, tags:['règle de l\'octave']},
  {cat:'Secondes',id:'a2_7',name:'Secondes ascendantes (septièmes)',desc:'Monte par degré conjoint avec septièmes.',
   degrees:[0,1,2,3,4,5,6,0], use7:true, modelLen:2, tags:['septièmes']},
  
  // Category: Sixtes (first-inversion sequences)
  {cat:'Sixtes',id:'a56',name:'5–6 ascendante',desc:'Basse conjointe ascendante, alternance 5/3 et 6/3. Évite les quintes parallèles.',
   degrees:[0,5,1,6,2,0,3,1,4], inv:[0,1,0,1,0,1,0,1,0], use7:false, modelLen:2, tags:['fondamental'],
   outerInterval:'10'},
  {cat:'Sixtes',id:'d56',name:'5–6 descendante',desc:'Basse conjointe descendante, alternance 5/3 et 6/3.',
   degrees:[0,2,6,3,5,1,4,0], inv:[0,1,0,1,0,1,0,0], use7:false, modelLen:2, tags:[],
   outerInterval:'10'},
  {cat:'Sixtes',id:'par63d',name:'6/3 parallèles descendantes',desc:'Fauxbourdon : accords de sixte parallèles descendant par degré conjoint. Sixtes parallèles entre voix extrêmes.',
   degrees:[0,6,5,4,3,2,1,0], inv:[1,1,1,1,1,1,1,0], use7:false, modelLen:2, tags:['fauxbourdon'],
   outerInterval:'6'},
  {cat:'Sixtes',id:'par63a',name:'6/3 parallèles ascendantes',desc:'Accords de sixte parallèles montant par degré conjoint.',
   degrees:[0,1,2,3,4,5,6,0], inv:[1,1,1,1,1,1,1,0], use7:false, modelLen:2, tags:[],
   outerInterval:'6'},

  // Category: Composées (compound sequences)
  {cat:'Composées',id:'d5up4',name:'↓5 ↑4 (descend 5te, monte 4te)',desc:'Alternance quinte descendante / quarte ascendante. Très utilisée par Bach.',
   degrees:[0,3,0,3,6,2,5,1,4,0], use7:false, modelLen:2, tags:['Bach'], custom:true,
   intervals:[-5,+4,-5,+4,-5,+4,-5,+4]},
  {cat:'Composées',id:'d3up4',name:'↓3 ↑4 (descend 3ce, monte 4te)',desc:'Alternance tierce descendante / quarte ascendante.',
   degrees:[0,5,1,6,2,5,0], use7:false, modelLen:2, tags:[]},
  {cat:'Composées',id:'d4up2',name:'↓4 ↑2 (descend 4te, monte 2de)',desc:'Alternance quarte descendante / seconde ascendante.',
   degrees:[0,4,5,1,2,5,6,0], use7:false, modelLen:2, tags:[]},
  {cat:'Composées',id:'pachelbel',name:'Pachelbel (I–V–vi–iii–IV–I–IV–V)',desc:'Le canon de Pachelbel. Basse descendante emblématique.',
   degrees:[0,4,5,2,3,0,3,4], use7:false, modelLen:2, tags:['célèbre'], fixed:true},
  {cat:'Composées',id:'romanesca',name:'Romanesca (I–V–vi–iii–IV–I–ii–V)',desc:'Variante Renaissance de la basse descendante.',
   degrees:[0,4,5,2,3,0,1,4], use7:false, modelLen:2, tags:['Renaissance'], fixed:true},
  {cat:'Composées',id:'monte',name:'Monte (IV–V–vi / ♭VI–♭VII–i)',desc:'Mouvement ascendant par seconde. Patron de séquence Renaissance-Baroque.',
   degrees:[3,4,5,3,4,5,0], use7:false, modelLen:3, tags:['Renaissance'], fixed:true},
  {cat:'Composées',id:'fonte',name:'Fonte (ii–V–I en séquence)',desc:'Séquence descendante ii–V–I transposée à chaque degré.',
   degrees:[1,4,0,6,3,5,0], use7:false, modelLen:3, tags:['Baroque'], fixed:true},

  // Category: Cadences enchaînées (chromatic — uses chromRoots instead of degrees)
  {cat:'Cadences',id:'evit5',name:'Évitées par quintes (V7)',
   desc:'Chaîne de septièmes de dominante descendant par quinte. Chaque V7 ne résout pas mais devient la dominante du ton suivant.',
   chromRoots:[7,0,5,10,3,8,1,7], chromType:'dom7', modelLen:2, tags:['chromatique']},
  {cat:'Cadences',id:'evit5dim',name:'Évitées par quintes (dim7)',
   desc:'Même mouvement par quintes descendantes, mais avec des septièmes diminuées. Toutes les parties descendent par demi-ton.',
   chromRoots:[7,0,5,10,3,8,1,7], chromType:'dim7', modelLen:2, tags:['chromatique','enharmonique']},
  {cat:'Cadences',id:'int3d',name:'Interrompues tierce desc.',
   desc:'Suite de V7 dont chaque fondamentale descend d\'une tierce. Produit un cycle de 4 tonalités.',
   chromRoots:[7,4,1,10,7], chromType:'dom7', modelLen:2, tags:['chromatique']},
  {cat:'Cadences',id:'int3a',name:'Interrompues tierce asc.',
   desc:'Suite de V7 dont chaque fondamentale monte d\'une tierce.',
   chromRoots:[7,10,1,4,7], chromType:'dom7', modelLen:2, tags:['chromatique']},
  {cat:'Cadences',id:'int4d',name:'Interrompues quarte desc.',
   desc:'Suite de V7 dont chaque fondamentale descend d\'une quarte.',
   chromRoots:[7,2,9,4,11,6,1,7], chromType:'dom7', modelLen:2, tags:['chromatique']},
  {cat:'Cadences',id:'romp',name:'Rompues (V7→vi en chaîne)',
   desc:'Chaîne de cadences rompues : chaque V7 résout sur le degré supérieur (vi) au lieu de la tonique attendue.',
   chromRoots:[7,9,2,4,9,11,0], chromTypes:['dom7','min','dom7','min','dom7','min','maj'], modelLen:2, tags:['cadence rompue']},
  // ── Extended: Dim7 chains ──
  {cat:'Cadences',id:'dim7chain',name:'Chaîne de 7ᵉˢ diminuées',
   desc:'Enchaînement de septièmes diminuées descendant par demi-ton chromatique. Chaque accord est une réinterprétation enharmonique du précédent.',
   chromRoots:[11,10,9,8,7,6,5,4,3,2,1,0], chromType:'dim7', modelLen:2, tags:['chromatique','enharmonique','dim7']},
  {cat:'Cadences',id:'dim7asc',name:'7ᵉˢ diminuées ascendantes',
   desc:'Septièmes diminuées montant par demi-ton. Mouvement chromatique ascendant total.',
   chromRoots:[11,0,1,2,3,4,5,6,7], chromType:'dim7', modelLen:2, tags:['chromatique','dim7']},

  // ── Omnibus ──
  {cat:'Chromatiques',id:'omnibus',name:'Omnibus',
   desc:'Mouvement chromatique contraire : basse ↓ (do–si–si♭–la–la♭–sol) / soprano ↑ (mi–fa–fa♯–sol–sol♯–la). Voix intérieures tenues (do, sol). Alternance I–V⁴₃–I⁶–V⁴₂–I⁶… .',
   chromRoots:[0,11,10,9,8,7], chromType:'dom7', modelLen:2, tags:['chromatique','omnibus'],
   /* Exact SATB voice-leading: */
   customVoicing:[
     {S:64,A:60,T:55,B:48}, /* C4-E4, C4, G3, C3 = I */
     {S:65,A:60,T:55,B:47}, /* F4(=E#), C4, G3, B2 = V4/3 */
     {S:66,A:60,T:55,B:46}, /* F#4, C4, G3, Bb2 = ? (passing) */
     {S:67,A:60,T:55,B:45}, /* G4, C4, G3, A2 = I6 (A bass) */
     {S:68,A:60,T:55,B:44}, /* Ab4(=G#), C4, G3, Ab2 = V4/2 */
     {S:69,A:60,T:55,B:43}  /* A4, C4, G3, G2 = arrives at new key */
   ]},
  {cat:'Chromatiques',id:'omnibus_ext',name:'Omnibus inversé',
   desc:'Omnibus inversé : basse ↑ chromatique (sol–sol♯–la–la♯–si–do) / soprano ↓ chromatique (mi–mi♭–ré–ré♭–do). Même principe de mouvement contraire, direction inversée.',
   chromRoots:[7,8,9,10,11,0], chromType:'dom7', modelLen:2, tags:['chromatique','omnibus']},

  // ── Chromatic voice exchange ──
  {cat:'Chromatiques',id:'chrom_vx',name:'Échange chromatique de voix',
   desc:'Deux voix échangent leurs notes par mouvement chromatique contraire. Basse monte chromatiquement (do→do♯→ré→ré♯→mi) pendant que le soprano descend (mi→mi♭→ré→ré♭→do). L\'accord change de couleur sans changer de fonction.',
   chromRoots:[0,1,2,3,4,0], chromTypes:['maj','dim','min','dim','maj','maj'], modelLen:2, tags:['chromatique','voix']},

  // ── Monte/Fonte/Ponte chromatiques ──
  {cat:'Chromatiques',id:'monte_chrom',name:'Monte chromatique',
   desc:'Patron Monte avec inflexions chromatiques : IV–V–vi transposé en montant par demi-ton au lieu de ton entier. Effet de poussée chromatique ascendante intensifiée.',
   chromRoots:[5,7,9,6,8,10,7,9,0], chromTypes:['maj','dom7','min','maj','dom7','min','maj','dom7','maj'], modelLen:3, tags:['chromatique','Renaissance']},
  {cat:'Chromatiques',id:'fonte_chrom',name:'Fonte chromatique',
   desc:'Patron Fonte avec descente chromatique : ii–V–I transposé en descendant par demi-ton. Chaque cycle « fond » d\'un demi-ton.',
   chromRoots:[2,7,0,1,6,11,0,5,10], chromTypes:['min','dom7','maj','min','dom7','maj','min','dom7','maj'], modelLen:3, tags:['chromatique','Baroque']},
  {cat:'Chromatiques',id:'ponte',name:'Ponte (pédale)',
   desc:'Patron Ponte (pont) : pédale de dominante tenue pendant que l\'harmonie se déplace autour. La basse reste fixe sur le Vᵉ degré.',
   degrees:[4,0,4,3,4,1,4,0], use7:false, modelLen:2, tags:['Renaissance','pédale']},

  // ── Séquence par triton ──
  {cat:'Chromatiques',id:'tritone',name:'Par triton (substitution)',
   desc:'Chaîne de dominantes par substitution tritonique. Chaque V7 est remplacé par le V7 situé un triton plus loin. Basse descend par demi-ton.',
   chromRoots:[7,1,6,0,5,11,7], chromType:'dom7', modelLen:2, tags:['chromatique','jazz','tritone']},

  // ── 7èmes diatoniques descendantes variantes ──
  {cat:'Quintes',id:'d5_7_alt',name:'Quintes desc. (7èmes alternées)',
   desc:'Comme la séquence par quintes avec septièmes, mais en alternant 7ᵉ de dominante et 7ᵉ mineure (résolution 7→3 / liaison 3→7).',
   degrees:[0,3,6,2,5,1,4,0], use7:true, modelLen:2, tags:['septièmes','variante']},

  // ── Laitz D2 (−5/+4) variants ──
  {cat:'Quintes',id:'d5_63',name:'D2 (−5/+4) + ⁶₃ — Quintes desc. avec renversements',
   desc:'Séquence de quintes descendantes alternant position fondamentale et premier renversement (Laitz Ex. 17.18A).',
   degrees:[0,3,6,2,5,1,4,0], inv:[0,1,0,1,0,1,0,0], use7:false, modelLen:2, tags:['Laitz']},
  {cat:'Quintes',id:'d5_7_inter',name:'D2 (−5/+4) + 7 interlocking — 7èmes imbriquées',
   desc:'Toutes les septièmes sont présentes simultanément : chaque accord résout sa septième pendant qu\'une nouvelle septième apparaît (Laitz Ex. 17.18E interlocking).',
   degrees:[0,3,6,2,5,1,4,0], use7:true, modelLen:2, tags:['septièmes','Laitz','interlocking']},
  {cat:'Quintes',id:'d5_65',name:'D2 (−5/+4) + ⁶₅ — 7èmes en renversement',
   desc:'Quintes descendantes avec septièmes en alternance 5/3 et 6/5. La basse descend par degré conjoint (Laitz Ex. 17.18E).',
   degrees:[0,3,6,2,5,1,4,0], inv:[0,1,0,1,0,1,0,0], use7:true, modelLen:2, tags:['septièmes','Laitz']},
  {cat:'Quintes',id:'d5_42',name:'D2 (−5/+4) + ⁴₂ — Septièmes second renversement',
   desc:'Quintes descendantes avec septièmes alternant 4/2 et 6/5. Basse progresse par degré conjoint alterné (Laitz p. 342).',
   degrees:[0,3,6,2,5,1,4,0], inv:[0,1,0,1,0,1,0,0], use7:true, modelLen:2, tags:['septièmes','Laitz']},

  // ── Laitz D3 (−4/+2) variant ──
  {cat:'Tierces',id:'d3_63',name:'D3 (−4/+2) + ⁶₃ — Tierces desc. avec renversements',
   desc:'Tierces descendantes alternant position fondamentale et premier renversement. Mouvement de basse plus conjoint (Laitz Ex. 17.18B).',
   degrees:[0,5,3,1,6,4,0], inv:[0,1,0,1,0,1,0], use7:false, modelLen:2, tags:['Laitz']},

  // ── Laitz A2 (−3/+4) root position ──
  {cat:'Secondes',id:'a2_34',name:'A2 (−3/+4) — Secondes asc. (↓3 ↑4)',
   desc:'Basse alterne tierce descendante et quarte ascendante. Résultat net : montée par seconde. Séquence « 5-6 » en position fondamentale (Laitz Ex. 17.18D).',
   degrees:[0,5,1,6,2,0,3,4,0], use7:false, modelLen:2, tags:['Laitz','5-6']},

  // ── Laitz A2 (+5/−4) (already exists as 'a5' but add Laitz label) ──

  // ══════════════════════════════════════
  // Category: Dominantes secondaires (Applied Chords) — Laitz pp. 367-370
  // ══════════════════════════════════════
  {cat:'Dom. secondaires',id:'app_d2',name:'D2 (−5/+4) — Dom. sec. (triades)',
   desc:'Séquence par quintes descendantes avec dominantes secondaires : chaque accord diatonique est précédé de son V. Le chromatisme crée un mouvement de sensibles résolvantes à travers le cercle des quintes (Laitz Ex. 18.20).',
   chromRoots:[0,0,5,6,11,11,4,4,9,9,2,2,7],
   chromTypes:['maj','dom7','maj','dom7','dim','dom7','min','dom7','min','dom7','min','dom7','maj'],
   modelLen:2, tags:['Laitz','dom. sec.']},
  {cat:'Dom. secondaires',id:'app_d2_7alt',name:'D2 (−5/+4) — Dom. sec. (7èmes alternées)',
   desc:'Quintes descendantes avec V7 secondaires alternant avec septièmes diatoniques. Résolution 7→3 entre chaque paire V7→cible (Laitz Ex. 18.20B).',
   chromRoots:[0,0,5,6,11,11,4,4,9,9,2,2,7],
   chromTypes:['dom7','dom7','maj7','dom7','dim7','dom7','min7','dom7','min7','dom7','min7','dom7','maj'],
   modelLen:2, tags:['Laitz','septièmes','dom. sec.']},
  {cat:'Dom. secondaires',id:'app_d2_7inter',name:'D2 (−5/+4) — Dom. sec. (7èmes imbriquées)',
   desc:'Toutes les septièmes dominantes imbriquées : V7/IV→V7/vii°→V7/iii→V7/vi→V7/ii→V7/V→V7→I. Chaque V7 résout directement dans le V7 du degré suivant (Laitz Ex. 18.20B interlocking).',
   chromRoots:[0,5,10,3,8,1,7,0],
   chromType:'dom7',
   modelLen:2, tags:['Laitz','septièmes','dom. sec.','interlocking']},
  {cat:'Dom. secondaires',id:'app_d3',name:'D3 (+3/−5) — Dom. sec. (triades)',
   desc:'Tierces descendantes avec dominantes secondaires : basse monte par tierce vers un V, puis descend par quinte vers la résolution. Crée un chromatisme ascendant dans la basse (Laitz Ex. 18.22-23).',
   chromRoots:[0,4,9,2,7,0,5,11,4,0],
   chromTypes:['maj','dom7','min','dom7','min','dom7','min','dom7','maj','maj'],
   modelLen:2, tags:['Laitz','dom. sec.']},
  {cat:'Dom. secondaires',id:'app_d3_65',name:'D3 (+3/−5) — Dom. sec. (⁶₅)',
   desc:'Tierces descendantes avec V⁶₅ secondaires en renversement. Basse descend chromatiquement par demi-ton entre chaque paire V⁶₅→cible (Laitz Ex. 18.23).',
   chromRoots:[0,4,9,2,7,0,5,11,4,0],
   chromTypes:['maj','dom7','min','dom7','min','dom7','min','dom7','maj','maj'],
   modelLen:2, tags:['Laitz','dom. sec.','renversement']},
  {cat:'Dom. secondaires',id:'app_a2',name:'A2 (−3/+4) — Dom. sec. (5-6 ascendante)',
   desc:'Séquence 5-6 ascendante avec dominantes secondaires : la basse monte chromatiquement d\'un demi-ton pour former un V⁶ qui résout sur le degré suivant en montant (Laitz Ex. 18.24-25). Puissant mouvement chromatique ascendant.',
   chromRoots:[0,0,2,2,4,4,5,5,7,7,9,9,0],
   chromTypes:['maj','dom7','min','dom7','min','dom7','maj','dom7','maj','dom7','min','dom7','maj'],
   modelLen:2, tags:['Laitz','dom. sec.','5-6']},
  {cat:'Dom. secondaires',id:'app_a2_7',name:'A2 (−3/+4) — Dom. sec. (7èmes)',
   desc:'Variante avec V7 secondaires en position fondamentale. Chaque V7 résout en montant par quarte (Laitz Ex. 18.25).',
   chromRoots:[0,5,5,7,7,9,9,0],
   chromTypes:['dom7','maj','dom7','maj','dom7','min','dom7','maj'],
   modelLen:2, tags:['Laitz','septièmes','dom. sec.']},

  // ══════════════════════════════════════
  // Category: Modèles historiques (Corelli, Vivaldi, Haydn, Mozart, Schubert, Brahms)
  // ══════════════════════════════════════
  {cat:'Modèles historiques',id:'corelli',name:'Corelli (chaîne 7-3 baroque)',
   desc:'Suspension 7-3 typique de Corelli : chaque accord prépare et résout la septième de l\'accord suivant. Mouvement de basse par quintes descendantes avec suspensions caractéristiques du style des sonates en trio.',
   degrees:[0,3,6,2,5,1,4,0], use7:true, modelLen:2, tags:['Baroque','Corelli','suspensions'], fixed:true},
  {cat:'Modèles historiques',id:'vivaldi_ritornello',name:'Vivaldi (ritournelle concerto)',
   desc:'Patron de ritournelle vivaldien : I–V–vi–iii–IV–I–IV–V–I avec énergie rythmique. Base de nombreux concertos baroques.',
   degrees:[0,4,5,2,3,0,3,4,0], use7:false, modelLen:2, tags:['Baroque','Vivaldi','ritornello'], fixed:true},
  {cat:'Modèles historiques',id:'vivaldi_7',name:'Vivaldi (séquence 7èmes concertante)',
   desc:'Chaîne de septièmes diatoniques style concerto vivaldien. Énergie motorique baroque tardive avec mouvement de basse par quintes.',
   degrees:[0,3,6,2,5,1,4,0], use7:true, modelLen:2, tags:['Baroque','Vivaldi','septièmes']},
  {cat:'Modèles historiques',id:'haydn_classic',name:'Haydn (cadence classique I–vi–IV–ii–V–I)',
   desc:'Cadence classique haydnienne par tierces descendantes puis cadence parfaite. Modèle d\'équilibre du style classique viennois.',
   degrees:[0,5,3,1,4,0], use7:false, modelLen:2, tags:['Classique','Haydn'], fixed:true},
  {cat:'Modèles historiques',id:'mozart_galant',name:'Mozart (galant I–IV–V/V–V–I)',
   desc:'Cadence galante mozartienne avec dominante de dominante. Élégance et clarté du style classique. La V/V intensifie la cadence.',
   chromRoots:[0,5,2,7,0], chromTypes:['maj','maj','dom7','dom7','maj'],
   modelLen:2, tags:['Classique','Mozart','galant'], fixed:true},
  {cat:'Modèles historiques',id:'mozart_alberti',name:'Mozart (I–V6–I6–IV–V–I)',
   desc:'Patron mozartien avec basses d\'Alberti implicites : alternance de renversements pour fluidité mélodique de la basse. Très utilisé dans les sonates K. 545 et K. 331.',
   degrees:[0,4,0,3,4,0], inv:[0,1,1,0,0,0], use7:false, modelLen:2, tags:['Classique','Mozart'], fixed:true},
  {cat:'Modèles historiques',id:'schubert_terz',name:'Schubert (relations de tierce I–♭VI–IV–I)',
   desc:'Modulation par relation de tierce chromatique typique de Schubert. La basse descend par tierce majeure (I→♭VI) créant un effet de coloration romantique.',
   chromRoots:[0,8,5,0], chromTypes:['maj','maj','maj','maj'],
   modelLen:2, tags:['Romantique','Schubert','tierce'], fixed:true},
  {cat:'Modèles historiques',id:'schubert_mediant',name:'Schubert (chaîne médiantique)',
   desc:'Chaîne de relations médiantiques : I–III–♭VI–i. Voyage tonal par tierces caractéristique du lied schubertien.',
   chromRoots:[0,4,8,0], chromTypes:['maj','maj','maj','min'],
   modelLen:2, tags:['Romantique','Schubert','médiante']},
  {cat:'Modèles historiques',id:'brahms_plagal',name:'Brahms (plagale étendue iv–♭VII–I)',
   desc:'Cadence plagale étendue brahmsienne avec emprunt modal au mineur. Couleur sombre et nostalgique typique du romantisme tardif.',
   chromRoots:[0,5,10,0], chromTypes:['maj','min','maj','maj'],
   modelLen:2, tags:['Romantique','Brahms','plagale','emprunt modal'], fixed:true},
  {cat:'Modèles historiques',id:'brahms_chromcycle',name:'Brahms (cycle chromatique de tierces)',
   desc:'Cycle de tierces majeures équidistantes (I–♭VI–III–I), divisant l\'octave en trois. Procédé wagnero-brahmsien de transition tonale.',
   chromRoots:[0,8,4,0], chromTypes:['maj','maj','maj','maj'],
   modelLen:2, tags:['Romantique','Brahms','cycle de tierces']},

];

// ── Descriptions théoriques par catégorie  ──
const SEQ_CAT_THEORY = {

  'Quintes': `<p><b>Mouvement de fondamentale par quinte</b> — La séquence par quintes descendantes (ou quartes ascendantes) est le modèle le plus fondamental de l'harmonie tonale. Chaque accord partage une note commune avec le suivant, ce qui assure une conduite des voix naturelle et fluide.</p>`
  + `<p>En triades, la basse alterne entre sauts de quinte descendante et quarte ascendante (ex. I–IV–vii°–iii–vi–ii–V–I).</p>`
  + `<p><b>Avec septièmes</b>, une chaîne systématique se forme : la septième de chaque accord résout par mouvement conjoint descendant pour devenir la tierce de l'accord suivant (résolution 7→3), tandis que la tierce est maintenue comme septième de l'accord suivant (liaison 3→7).</p>`
  + `<p>Les quintes <b>ascendantes</b> (I–V–ii–vi–iii–vii°–IV–I) sont plus rares. Elles créent un effet de tension croissante en s'éloignant progressivement de la tonique.</p>`,

  'Tierces': `<p><b>Mouvement de fondamentale par tierce</b> — Deux accords successifs partagent ici deux notes communes sur trois, ce qui produit un mouvement harmonique particulièrement doux et coloré.</p>`
  + `<p>En tierces <b>descendantes</b>, la basse descend par tierce à chaque pas (ex. I–vi–IV–ii–vii°–V–I). Comme deux notes sont retenues, seule une voix bouge à chaque changement d'accord — un glissement presque imperceptible.</p>`
  + `<p><b>Avec septièmes</b>, la note qui se déplace crée la dissonance de septième qui appelle résolution, enrichissant le tissu harmonique sans rompre la douceur du mouvement.</p>`
  + `<p>Les tierces <b>ascendantes</b> créent un effet d'expansion et d'ouverture ; elles sont fréquentes dans le répertoire romantique.</p>`,

  'Secondes': `<p><b>Mouvement de fondamentale par seconde</b> — La basse progresse par degré conjoint, créant un mouvement scalaire continu. Les accords voisins par seconde ne partagent <i>aucune</i> note commune : la conduite des voix exige un mouvement contraire entre les parties.</p>`
  + `<p><b>Descendantes</b> — La basse chromatique descendante (do–si–la–sol…) est associée au <i>lamento</i>, patron expressif utilisé depuis la Renaissance pour évoquer la douleur ou la lamentation.</p>`
  + `<p><b>Ascendantes</b> — On retrouve la <i>Règle de l'octave</i> : chaque degré de la gamme reçoit une harmonisation conventionnelle qui guide la montée scalaire vers l'octave (I–ii–iii–IV–V–vi–vii°–I).</p>`
  + `<p><b>Avec septièmes</b>, la résolution de chaque dissonance propulse naturellement vers l'accord suivant, créant un mouvement directionnel irrésistible.</p>`,

  'Composées': `<p><b>Séquences à mouvement composé et patrons historiques</b> — Ces séquences alternent deux intervalles de fondamentale différents, ou suivent des patrons nommés hérités de la tradition du <i>partimento</i> Renaissance-Baroque.</p>`

  + `<span class="sub-title">Séquences à intervalles alternés</span>`
  + `<p><b>↓5 ↑4</b> — Descente de quinte puis montée de quarte, produisant un mouvement net descendant d'un degré à chaque paire d'accords. C'est un modèle favori de J.S. Bach, omniprésent dans ses chorals et ses œuvres pour clavier.</p>`
  + `<p><b>↓3 ↑4</b> — Alterne tierce descendante et quarte ascendante, produisant une montée nette par seconde à chaque paire. Le mouvement résultant est ascendant malgré l'intervalle descendant initial.</p>`
  + `<p><b>↓4 ↑2</b> — Alterne quarte descendante et seconde ascendante. Chaque paire descend d'une tierce nette, créant un parcours harmonique rapide vers la dominante.</p>`

  + `<span class="sub-title">Patrons historiques nommés</span>`
  + `<p><b>Pachelbel</b> (I–V–vi–iii–IV–I–IV–V) — La basse descendante emblématique du <i>Canon en ré</i>. Alternance de quintes descendantes et quartes descendantes, avec un retour conclusif IV–V. Ce patron reste l'un des plus utilisés de la musique populaire moderne.</p>`
  + `<p><b>Romanesca</b> (I–V–vi–iii–IV–I–ii–V) — Variante Renaissance de la basse descendante par tierces et quartes. Se distingue du Pachelbel par sa conclusion ii–V au lieu de IV–V, créant un mouvement cadentiel plus conventionnel.</p>`
  + `<p><b>Monte</b> (IV–V–vi / ♭VI–♭VII–i) — Patron ascendant par seconde : chaque paire d'accords monte d'un degré. Crée une poussée énergique vers le haut, fréquente dans les <i>partimenti</i> et la musique baroque italienne.</p>`
  + `<p><b>Fonte</b> (ii–V–I transposé) — Patron descendant qui « fond » d'un niveau tonal vers un autre. Une cellule ii–V–I est transposée en descendant, chaque itération donnant l'impression de glisser vers une nouvelle tonalité temporaire.</p>`,

  'Sixtes': `<p><b>Séquences en accords de sixte (premier renversement)</b> — Ces séquences utilisent le premier renversement (6/3) pour créer des basses conjointes et des mouvements parallèles caractéristiques.</p>`
  + `<span class="sub-title">Technique 5–6</span>`
  + `<p>La technique <b>5–6</b> est un outil fondamental de contrepoint : sur chaque note de basse, la quinte au-dessus se déplace vers la sixte, transformant un accord en position fondamentale en premier renversement de l'accord voisin. Cela permet à la basse de progresser par degrés conjoints tout en évitant les quintes parallèles qui se produiraient autrement.</p>`
  + `<p>Le mouvement entre voix extrêmes crée typiquement des <b>dixièmes parallèles</b> (10<sup>mes</sup>), un intervalle particulièrement euphonique.</p>`
  + `<span class="sub-title">Sixtes parallèles (Fauxbourdon)</span>`
  + `<p>Lorsque tous les accords sont en premier renversement et progressent par degré conjoint, on obtient des <b>sixtes parallèles</b> entre soprano et basse — le <i>fauxbourdon</i>, technique omniprésente du XV<sup>e</sup> siècle au style classique. Le mouvement parallèle crée un effet de flux continu et de douceur harmonique.</p>`,


  'Chromatiques': `<p><b>Séquences chromatiques et omnibus</b> — Ces séquences utilisent le mouvement chromatique — par demi-tons — pour créer des progressions qui traversent les frontières tonales.</p>`
  + `<span class="sub-title">Omnibus</span>`
  + `<p>L'<b>omnibus</b>  est une progression remarquable où la basse descend chromatiquement pendant que la soprano monte chromatiquement, en mouvement contraire strict. Les voix intérieures restent tenues (souvent sur la tonique et la tierce). Le résultat est une alternance I–V⁴₃–I⁶–V⁴₂ qui parcourt chromatiquement l'espace tonal sans jamais quitter la tonalité d'origine.</p>`
  + `<span class="sub-title">Échange chromatique de voix</span>`
  + `<p>Deux voix échangent leurs notes par mouvement chromatique contraire : la basse monte d'un demi-ton pendant que le soprano descend d'un demi-ton (ou vice-versa). L'accord change de couleur (ex: I → vii°⁶) sans changer de fonction fondamentale. C'est un enrichissement chromatique de la prolongation harmonique.</p>`
  + `<span class="sub-title">Monte/Fonte/Ponte chromatiques</span>`
  + `<p>Les patrons Renaissance (Monte, Fonte, Ponte) peuvent être chromatisés : au lieu de transposer par ton entier, chaque cycle est transposé par demi-ton, intensifiant la direction harmonique. Le <b>Ponte</b> utilise une pédale de dominante comme « pont » stable.</p>`
  + `<span class="sub-title">Substitution tritonique</span>`
  + `<p>Issue du jazz, la <b>substitution tritonique</b> remplace chaque V7 par le V7 situé un triton plus loin (même triton caractéristique, résolution par demi-ton descendant au lieu de quinte). En chaîne, la basse descend chromatiquement.</p>`,
  'Cadences': `<p><b>Cadences enchaînées</b> — On peut enchaîner systématiquement des cadences non résolues pour créer des séquences chromatiques. Chaque septième de dominante ne se résout pas comme attendu, mais débouche sur une nouvelle dominante.</p>`

  + `<span class="sub-title">Cadences évitées</span>`
  + `<p>La cadence s'<b>évite</b> en ajoutant une septième mineure à l'accord de résolution, le transformant en nouvelle dominante. Par <b>quintes descendantes</b>, on obtient une chaîne V7→I7→IV7→♭VII7… où chaque accord « glisse » vers le ton suivant. C'est la base du <i>circle of fifths</i> chromatique.</p>`
  + `<p>En substituant des <b>septièmes diminuées</b>, toutes les parties descendent par demi-ton, créant un mouvement chromatique total qui mène au genre enharmonique.</p>`

  + `<span class="sub-title">Cadences interrompues</span>`
  + `<p>La cadence s'<b>interrompt</b> en substituant une nouvelle V7 dont la fondamentale est une <b>tierce au-dessous</b> de la première. La chaîne V7→III7→I7→♭VI7… parcourt un cycle de 4 tonalités avant de revenir au point de départ.</p>`
  + `<p>La variante par <b>tierce ascendante</b> crée un cycle similaire en montant. La variante par <b>quarte descendante</b> produit un mouvement plus rapide à travers les tonalités.</p>`

  + `<span class="sub-title">Cadences rompues</span>`
  + `<p>La cadence se <b>rompt</b> en résolvant la V7 non pas sur la tonique, mais sur un accord consonant autre — typiquement le <b>vi</b> (sixième degré). Enchaînée en séquence, chaque V7 résout de façon « trompeuse » sur le degré supérieur, créant une alternance dominante–résolution inattendue à chaque niveau.</p>`,

  'Dom. secondaires': `<p><b>Séquences de dominantes secondaires (Applied Chords)</b> — Une dominante secondaire (V/x ou V7/x) est un accord qui tonicalise temporairement un degré diatonique. Lorsqu'on insère systématiquement des dominantes secondaires dans une séquence diatonique, on obtient un puissant mouvement chromatique ascendant ou descendant (Laitz, chap. 18, pp. 367-370).</p>`
  + `<span class="sub-title">D2 (−5/+4) avec dom. secondaires</span>`
  + `<p>La séquence par quintes descendantes la plus commune : chaque accord diatonique est précédé de son <b>V7</b> appliqué. La basse alterne quinte descendante et quarte ascendante avec des inflexions chromatiques (sensibles résolvantes). Variantes : triades, 7èmes alternées, 7èmes imbriquées (chaîne continue de V7).</p>`
  + `<span class="sub-title">D3 (+3/−5) avec dom. secondaires</span>`
  + `<p>La basse monte d'une tierce vers un V appliqué, puis descend d'une quinte vers sa résolution. Le chromatisme apparaît dans la basse qui monte par demi-ton entre chaque paire V→cible. Versions avec renversements (V⁶₅) créent un mouvement de basse descendant chromatique.</p>`
  + `<span class="sub-title">A2 (−3/+4) avec dom. secondaires</span>`
  + `<p>La technique <b>5-6 ascendante chromatique</b> : la basse monte d'un demi-ton chromatique pour former un V⁶ appliqué qui résout en montant vers le degré suivant. C'est l'un des patrons chromatiques les plus utilisés de la période classique — un escalier chromatique ascendant irrésistible.</p>`,

  'Modèles historiques': `<p><b>Modèles historiques — Du baroque au romantisme</b> — Ces séquences ne sont pas de pures formules abstraites : ce sont des <i>idiomes</i> attestés chez de grands compositeurs, transmis comme des objets stylistiques.</p>`
  + `<span class="sub-title">Baroque (Corelli, Vivaldi)</span>`
  + `<p><b>Corelli</b> — Chaîne de septièmes par quintes descendantes avec suspensions 7-3 systématiques. Modèle des sonates en trio, transmis par les <i>partimenti</i>.</p>`
  + `<p><b>Vivaldi</b> — Ritournelle de concerto avec énergie motorique : I–V–vi–iii–IV–I–IV–V–I. Cellule emblématique du concerto baroque.</p>`
  + `<span class="sub-title">Classique (Haydn, Mozart)</span>`
  + `<p><b>Haydn</b> — Cadence classique I–vi–IV–ii–V–I par tierces descendantes : équilibre et clarté du style viennois.</p>`
  + `<p><b>Mozart</b> — Cadence galante avec V/V (dominante de dominante) ou alternance de renversements (basses d'Alberti implicites, K. 545, K. 331).</p>`
  + `<span class="sub-title">Romantique (Schubert, Brahms)</span>`
  + `<p><b>Schubert</b> — Relations de tierce chromatique (I–♭VI) et chaînes médiantiques : coloration nostalgique du lied.</p>`
  + `<p><b>Brahms</b> — Cadence plagale étendue avec emprunt modal (iv–♭VII–I) et cycles de tierces équidistantes divisant l'octave en trois. Procédés du romantisme tardif.</p>`
};

const SEQ_CAT_THEORY_EN = {
  'Quintes': `<p><b>Root motion by fifth</b> — The descending fifth (or ascending fourth) sequence is the most fundamental model in tonal harmony. Each chord shares a common tone with the next, ensuring natural and smooth voice leading.</p>`
  + `<p>In triads, the bass alternates between descending fifths and ascending fourths (e.g. I–IV–vii°–iii–vi–ii–V–I).</p>`
  + `<p><b>With sevenths</b>, a systematic chain forms: the seventh of each chord resolves by stepwise descent to become the third of the next chord (7→3 resolution), while the third is held as the seventh of the next chord (3→7 link).</p>`
  + `<p><b>Ascending</b> fifths (I–V–ii–vi–iii–vii°–IV–I) are less common. They create an effect of growing tension by progressively moving away from the tonic.</p>`,

  'Tierces': `<p><b>Root motion by third</b> — Two successive chords here share two common tones out of three, producing particularly smooth and colorful harmonic motion.</p>`
  + `<p>In <b>descending</b> thirds, the bass descends by third at each step (e.g. I–vi–IV–ii–vii°–V–I). Since two tones are retained, only one voice moves at each chord change — an almost imperceptible glide.</p>`
  + `<p><b>With sevenths</b>, the moving voice creates the seventh dissonance that calls for resolution, enriching the harmonic texture without breaking the smoothness of the motion.</p>`
  + `<p><b>Ascending</b> thirds create an effect of expansion and opening; they are frequent in the Romantic repertoire.</p>`,

  'Secondes': `<p><b>Root motion by second</b> — The bass progresses by step, creating continuous scalar motion. Neighboring chords by second share <i>no</i> common tones: voice leading requires contrary motion between parts.</p>`
  + `<p><b>Descending</b> — The descending chromatic bass (C–B–A–G…) is associated with the <i>lamento</i>, an expressive pattern used since the Renaissance to evoke pain or lamentation.</p>`
  + `<p><b>Ascending</b> — Here we find the <i>Rule of the Octave</i>: each scale degree receives a conventional harmonization that guides the scalar ascent to the octave (I–ii–iii–IV–V–vi–vii°–I).</p>`
  + `<p><b>With sevenths</b>, the resolution of each dissonance naturally propels toward the next chord, creating an irresistible directional motion.</p>`,

  'Composées': `<p><b>Compound motion sequences and historical patterns</b> — These sequences alternate two different root intervals, or follow named patterns inherited from the Renaissance-Baroque <i>partimento</i> tradition.</p>`
  + `<span class="sub-title">Alternating interval sequences</span>`
  + `<p><b>↓5 ↑4</b> — Descending fifth then ascending fourth, producing a net downward motion of one degree per pair of chords. A favorite model of J.S. Bach, ubiquitous in his chorales and keyboard works.</p>`
  + `<p><b>↓3 ↑4</b> — Alternates descending third and ascending fourth, producing a net upward motion by second per pair. The resulting motion is ascending despite the initial descending interval.</p>`
  + `<p><b>↓4 ↑2</b> — Alternates descending fourth and ascending second. Each pair descends by a net third, creating a rapid harmonic path toward the dominant.</p>`
  + `<span class="sub-title">Named historical patterns</span>`
  + `<p><b>Pachelbel</b> (I–V–vi–iii–IV–I–IV–V) — The iconic descending bass of the <i>Canon in D</i>. Alternating descending fifths and descending fourths, with a concluding IV–V return. This pattern remains one of the most used in modern popular music.</p>`
  + `<p><b>Romanesca</b> (I–V–vi–iii–IV–I–ii–V) — A Renaissance variant of the descending bass by thirds and fourths. Differs from Pachelbel in its ii–V conclusion instead of IV–V, creating a more conventional cadential motion.</p>`
  + `<p><b>Monte</b> (IV–V–vi / ♭VI–♭VII–i) — An ascending pattern by second: each pair of chords rises by one degree. Creates an energetic upward push, frequent in <i>partimenti</i> and Italian Baroque music.</p>`
  + `<p><b>Fonte</b> (ii–V–I transposed) — A descending pattern that "melts" from one tonal level to another. A ii–V–I cell is transposed downward, each iteration giving the impression of sliding into a new temporary key.</p>`,

  'Sixtes': `<p><b>First inversion (sixth chord) sequences</b> — These sequences use first inversion (6/3) to create stepwise bass lines and characteristic parallel motions.</p>`
  + `<span class="sub-title">5–6 Technique</span>`
  + `<p>The <b>5–6</b> technique is a fundamental counterpoint tool: on each bass note, the fifth above moves to the sixth, transforming a root position chord into the first inversion of the neighboring chord. This allows the bass to progress by step while avoiding the parallel fifths that would otherwise occur.</p>`
  + `<p>The motion between outer voices typically creates <b>parallel tenths</b> (10ths), a particularly euphonious interval.</p>`
  + `<span class="sub-title">Parallel sixths (Fauxbourdon)</span>`
  + `<p>When all chords are in first inversion and progress by step, we get <b>parallel sixths</b> between soprano and bass — the <i>fauxbourdon</i>, a technique ubiquitous from the 15th century through the Classical style. The parallel motion creates an effect of continuous flow and harmonic sweetness.</p>`,

  'Chromatiques': `<p><b>Chromatic sequences and Omnibus</b> — These sequences use chromatic motion — by semitones — to create progressions that cross tonal boundaries.</p>`
  + `<span class="sub-title">Omnibus</span>`
  + `<p>The <b>Omnibus</b> is a remarkable progression where the bass descends chromatically while the soprano ascends chromatically, in strict contrary motion. Inner voices remain held (often on the tonic and third). The result is an alternation I–V⁴₃–I⁶–V⁴₂ that chromatically traverses tonal space without ever leaving the home key.</p>`
  + `<span class="sub-title">Chromatic voice exchange</span>`
  + `<p>Two voices exchange their notes through contrary chromatic motion: the bass rises by semitone while the soprano descends by semitone (or vice versa). The chord changes color (e.g., I → vii°⁶) without changing its fundamental function. This is a chromatic enrichment of harmonic prolongation.</p>`
  + `<span class="sub-title">Chromatic Monte/Fonte/Ponte</span>`
  + `<p>The Renaissance patterns (Monte, Fonte, Ponte) can be chromaticized: instead of transposing by whole tone, each cycle is transposed by semitone, intensifying the harmonic direction. The <b>Ponte</b> uses a dominant pedal as a stable "bridge."</p>`
  + `<span class="sub-title">Tritone substitution</span>`
  + `<p>From jazz, <b>tritone substitution</b> replaces each V7 with the V7 a tritone away (same characteristic tritone, resolution by descending semitone instead of fifth). In a chain, the bass descends chromatically.</p>`,

  'Cadences': `<p><b>Chained cadences</b> — Unresolved cadences can be systematically chained to create chromatic sequences. Each dominant seventh does not resolve as expected, but leads to a new dominant.</p>`
  + `<span class="sub-title">Avoided cadences</span>`
  + `<p>A cadence is <b>avoided</b> by adding a minor seventh to the resolution chord, transforming it into a new dominant. By <b>descending fifths</b>, we get a chain V7→I7→IV7→♭VII7… where each chord "slides" to the next key. This is the basis of the chromatic <i>circle of fifths</i>.</p>`
  + `<p>Substituting <b>diminished sevenths</b>, all voices descend by semitone, creating total chromatic motion leading to enharmonic reinterpretation.</p>`
  + `<span class="sub-title">Interrupted cadences</span>`
  + `<p>A cadence is <b>interrupted</b> by substituting a new V7 whose root is a <b>third below</b> the first. The chain V7→III7→I7→♭VI7… traverses a cycle of 4 keys before returning to the starting point.</p>`
  + `<p>The <b>ascending third</b> variant creates a similar ascending cycle. The <b>descending fourth</b> variant produces faster motion through keys.</p>`
  + `<span class="sub-title">Deceptive cadences</span>`
  + `<p>A cadence is <b>broken</b> by resolving V7 not to the tonic but to another consonant chord — typically <b>vi</b> (sixth degree). Chained in sequence, each V7 resolves "deceptively" to the upper degree, creating a dominant–unexpected resolution alternation at each level.</p>`,

  'Dom. secondaires': `<p><b>Applied chord sequences (Secondary Dominants)</b> — An applied chord (V/x or V7/x) temporarily tonicizes a diatonic degree. When applied dominants are systematically inserted into a diatonic sequence, powerful ascending or descending chromatic motion results (Laitz, ch. 18, pp. 367-370).</p>`
  + `<span class="sub-title">D2 (−5/+4) with applied chords</span>`
  + `<p>The most common applied sequence: each diatonic chord is preceded by its <b>V7</b>. The bass alternates descending fifths and ascending fourths with chromatic inflections (resolving leading tones). Variants: triads, alternating 7ths, interlocking 7ths (continuous V7 chain).</p>`
  + `<span class="sub-title">D3 (+3/−5) with applied chords</span>`
  + `<p>The bass rises by third to an applied V, then descends by fifth to its resolution. Chromaticism appears in the bass, which rises by semitone between each V→target pair. Versions with inversions (V⁶₅) create a chromatic descending bass motion.</p>`
  + `<span class="sub-title">A2 (−3/+4) with applied chords</span>`
  + `<p>The <b>chromatic ascending 5-6 technique</b>: the bass rises by chromatic semitone to form an applied V⁶ that resolves upward to the next scale degree. This is one of the most commonly used chromatic patterns of the Classical period — an irresistible chromatic ascending staircase.</p>`,

  'Modèles historiques': `<p><b>Historical models — From Baroque to Romantic</b> — These sequences are not abstract formulas: they are <i>idioms</i> documented in the works of major composers, passed down as stylistic objects.</p>`
  + `<span class="sub-title">Baroque (Corelli, Vivaldi)</span>`
  + `<p><b>Corelli</b> — Chain of sevenths by descending fifths with systematic 7-3 suspensions. Model of the trio sonatas, transmitted through <i>partimenti</i>.</p>`
  + `<p><b>Vivaldi</b> — Concerto ritornello with motoric energy: I–V–vi–iii–IV–I–IV–V–I. Emblematic cell of the Baroque concerto.</p>`
  + `<span class="sub-title">Classical (Haydn, Mozart)</span>`
  + `<p><b>Haydn</b> — Classical cadence I–vi–IV–ii–V–I by descending thirds: balance and clarity of the Viennese style.</p>`
  + `<p><b>Mozart</b> — Galant cadence with V/V (dominant of dominant) or alternating inversions (implicit Alberti basses, K. 545, K. 331).</p>`
  + `<span class="sub-title">Romantic (Schubert, Brahms)</span>`
  + `<p><b>Schubert</b> — Chromatic third relations (I–♭VI) and mediant chains: nostalgic coloration of the lied.</p>`
  + `<p><b>Brahms</b> — Extended plagal cadence with modal borrowing (iv–♭VII–I) and equidistant third cycles dividing the octave in three. Late-Romantic procedures.</p>`
};

function tSeqTheory(cat){return currentLang==='en'?(SEQ_CAT_THEORY_EN[cat]||SEQ_CAT_THEORY[cat]):SEQ_CAT_THEORY[cat];}

// ── State ──
const SEQ_S = {
  key: 'C', mode: 'major', seqId: 'd5', pm: 'chord',
  chords: [],
  openCats: new Set(),
  hlVoice: -1, // -1=none, 0=B, 1=T, 2=A, 3=S
  // ── Enrichments ──
  length: 8,           // 4-16 chords
  loop: false,         // loop mode for playback
  hybrid: null,        // {base:seqId, variation:'chromatic'|'harm'|'mel'|'alt'} or null
  transform: 'none',   // 'none' | 'inv' | 'retro' | 'aug' | 't3' | 't3down'
  transpose: 0,        // additional semitones
  panel: 'sequences',  // 'sequences' | 'hybrid' | 'transform' | 'library' | 'viz'
  library: [],         // user saved sequences (loaded from localStorage)
  showVoiceGraph: false,
  showHeatmap: false,
};

// ── Load library from localStorage on init ──
try {
  const saved = localStorage.getItem('pc_seq_library');
  if(saved) SEQ_S.library = JSON.parse(saved);
} catch(e){ SEQ_S.library = []; }

// ── Compute sequence chords ──
function SEQ_computeSequence(){
  const seq = SEQ_SEQUENCES.find(s => s.id === SEQ_S.seqId);
  if(!seq) return;
  const chords = [];
  const tonic = SEQ_noteToPC(SEQ_S.key);

  // ── Helper: build SATB voicing from pitch classes ──
  function SEQ_voiceSATB(pcs, roman, rootPC, qual, inversion){
    const rootName = SEQ_pcToName(rootPC, SEQ_S.key);
    const bassPC = inversion === 1 ? pcs[1] : pcs[0];
    let bassMidi = 48 + bassPC;
    while(bassMidi > 55) bassMidi -= 12;
    while(bassMidi < 36) bassMidi += 12;
    
    const tenPC = inversion === 1 ? pcs[2] : pcs[1];
    let tenorMidi = 60 + tenPC;
    while(tenorMidi < bassMidi + 3) tenorMidi += 12;
    while(tenorMidi > 67) tenorMidi -= 12;
    if(tenorMidi <= bassMidi) tenorMidi += 12;
    
    const altPC = inversion === 1 ? pcs[0] : pcs[2];
    let altoMidi = 60 + altPC;
    while(altoMidi < tenorMidi + 2) altoMidi += 12;
    while(altoMidi > 76) altoMidi -= 12;
    if(altoMidi <= tenorMidi) altoMidi += 12;
    
    let sopMidi;
    if(pcs.length === 4) sopMidi = 60 + pcs[3];
    else sopMidi = 60 + pcs[0];
    while(sopMidi < altoMidi) sopMidi += 12;
    while(sopMidi > 84) sopMidi -= 12;
    if(sopMidi <= altoMidi) sopMidi += 12;
    
    const qualStr = qual === 'M' ? '' : qual === 'm' ? 'm' : qual === 'dim' ? 'dim' : qual === 'aug' ? '+' : qual === '7' ? '7' : qual === 'm7' ? 'm7' : qual === 'M7' ? 'Δ7' : qual === 'ø7' ? 'ø7' : qual === 'o7' ? 'o7' : qual === 'mM7' ? 'mΔ7' : qual;
    
    return {
      pcs, midi: [bassMidi, tenorMidi, altoMidi, sopMidi],
      deg: 0, roman, quality: qual, inversion: inversion||0,
      rootName, name: rootName + qualStr
    };
  }

  if(seq.chromRoots){
    // ── Chromatic sequence path ──
    const types = Array.isArray(seq.chromTypes) ? seq.chromTypes
                : Array(seq.chromRoots.length).fill(seq.chromType || 'dom7');
    
    for(let i = 0; i < seq.chromRoots.length; i++){
      const rootPC = (tonic + seq.chromRoots[i]) % 12;
      const qType = types[i];
      let pcs;
      if(qType === 'dom7') pcs = [rootPC, (rootPC+4)%12, (rootPC+7)%12, (rootPC+10)%12];
      else if(qType === 'dim7') pcs = [rootPC, (rootPC+3)%12, (rootPC+6)%12, (rootPC+9)%12];
      else if(qType === 'min') pcs = [rootPC, (rootPC+3)%12, (rootPC+7)%12];
      else pcs = [rootPC, (rootPC+4)%12, (rootPC+7)%12]; // major
      
      const qual = SEQ_chordQuality(pcs);
      const roman = SEQ_chromRoman(seq.chromRoots[i], qType);
      chords.push(SEQ_voiceSATB(pcs, roman, rootPC, qual, 0));
    }
  } else {
    // ── Diatonic sequence path ──
    const scale = SEQ_getScale(SEQ_S.key, SEQ_S.mode);
    const degs = seq.degrees;
    
    for(let i = 0; i < degs.length; i++){
      const deg = degs[i];
      const notes = seq.use7 ? SEQ_buildSeventh(scale, deg) : SEQ_buildTriad(scale, deg);
      const qual = SEQ_chordQuality(notes);
      const romLabels = seq.use7 
        ? (SEQ_S.mode === 'major' ? SEQ_ROM_MAJ7 : SEQ_ROM_MIN7)
        : (SEQ_S.mode === 'major' ? SEQ_ROM_MAJ : SEQ_ROM_MIN);
      let roman = romLabels[deg] || ('?' + deg);
      
      const inversion = (seq.inv && seq.inv[i]) || 0;
      if(inversion === 1) roman += '⁶';
      
      chords.push(SEQ_voiceSATB(notes, roman, notes[0], qual, inversion));
      chords[chords.length-1].deg = deg;
    }
  }
  
  SEQ_S.chords = chords;
  
  // ── Apply length adjustment (4-16 chords) ──
  SEQ_applyLength();
  // ── Apply transformations ──
  SEQ_applyTransform();
  // ── Apply transposition ──
  SEQ_applyTranspose();
}

// ══════════════════════════════════════
// ── Length adjustment (4-16 chords + loop) ──
// ══════════════════════════════════════
function SEQ_applyLength(){
  const target = SEQ_S.length;
  const cur = SEQ_S.chords.length;
  if(!cur || target === cur) return;
  if(target < cur){
    SEQ_S.chords = SEQ_S.chords.slice(0, target);
  } else {
    // Extend by repeating the model (first modelLen chords)
    const seq = SEQ_SEQUENCES.find(s => s.id === SEQ_S.seqId);
    const mLen = (seq && seq.modelLen) || 2;
    while(SEQ_S.chords.length < target){
      const idx = SEQ_S.chords.length % cur;
      // Clone the chord but offset MIDI down by one octave-step iteration if needed
      const src = SEQ_S.chords[idx];
      const clone = {
        pcs: src.pcs.slice(),
        midi: src.midi.slice(),
        deg: src.deg,
        roman: src.roman,
        quality: src.quality,
        inversion: src.inversion,
        rootName: src.rootName,
        name: src.name
      };
      SEQ_S.chords.push(clone);
    }
  }
}

// ══════════════════════════════════════
// ── Transformations ──
// ══════════════════════════════════════
function SEQ_applyTransform(){
  const mode = SEQ_S.transform;
  if(mode === 'none' || !SEQ_S.chords.length) return;
  
  if(mode === 'retro'){
    // Retrograde: reverse the chord order
    SEQ_S.chords.reverse();
  } else if(mode === 'inv'){
    // Inversion: invert intervals around the bass of the first chord
    const pivot = SEQ_S.chords[0].midi[0];
    SEQ_S.chords.forEach(ch => {
      ch.midi = ch.midi.map(m => pivot * 2 - m);
      ch.pcs = ch.midi.map(m => ((m % 12) + 12) % 12);
      // Reorder voices ascending (bass to soprano)
      ch.midi.sort((a,b) => a - b);
      ch.pcs = ch.midi.map(m => ((m % 12) + 12) % 12);
    });
  } else if(mode === 'aug'){
    // Augmentation: duplicate each chord (rhythmic augmentation)
    const doubled = [];
    SEQ_S.chords.forEach(ch => {
      doubled.push(ch, {...ch, midi: ch.midi.slice(), pcs: ch.pcs.slice()});
    });
    SEQ_S.chords = doubled.slice(0, SEQ_S.length);
  } else if(mode === 't3'){
    // Transpose by major third up (+4 semitones)
    SEQ_S.chords.forEach(ch => {
      ch.midi = ch.midi.map(m => m + 4);
      ch.pcs = ch.midi.map(m => ((m % 12) + 12) % 12);
    });
  } else if(mode === 't3down'){
    // Transpose by major third down (-4 semitones)
    SEQ_S.chords.forEach(ch => {
      ch.midi = ch.midi.map(m => m - 4);
      ch.pcs = ch.midi.map(m => ((m % 12) + 12) % 12);
    });
  }
}

function SEQ_applyTranspose(){
  const semi = SEQ_S.transpose;
  if(!semi || !SEQ_S.chords.length) return;
  SEQ_S.chords.forEach(ch => {
    ch.midi = ch.midi.map(m => m + semi);
    ch.pcs = ch.midi.map(m => ((m % 12) + 12) % 12);
  });
}

// ══════════════════════════════════════
// ── Hybrid Generator ──
// ══════════════════════════════════════
function SEQ_generateHybrid(){
  const cfg = SEQ_S.hybrid;
  if(!cfg) return;
  const baseSeq = SEQ_SEQUENCES.find(s => s.id === cfg.base);
  if(!baseSeq) return;
  // Temporarily set seqId to base
  const oldId = SEQ_S.seqId;
  SEQ_S.seqId = cfg.base;
  SEQ_computeSequenceRaw();
  SEQ_S.seqId = oldId;
  
  // Apply hybrid variation
  if(cfg.variation === 'chromatic'){
    // Add chromatic passing tones in inner voices
    SEQ_S.chords.forEach((ch, i) => {
      if(i > 0 && i < SEQ_S.chords.length - 1 && i % 2 === 1){
        // Raise the alto by a semitone briefly
        ch.midi[2] += 1;
        ch.pcs = ch.midi.map(m => ((m % 12) + 12) % 12);
      }
    });
  } else if(cfg.variation === 'harm'){
    // Apply harmonic minor: raise the 7th degree (b7 -> 7)
    const tonic = SEQ_noteToPC(SEQ_S.key);
    const leading = (tonic + 11) % 12;
    const flatSeven = (tonic + 10) % 12;
    SEQ_S.chords.forEach(ch => {
      ch.midi = ch.midi.map(m => {
        if(((m % 12) + 12) % 12 === flatSeven) return m + 1;
        return m;
      });
      ch.pcs = ch.midi.map(m => ((m % 12) + 12) % 12);
    });
  } else if(cfg.variation === 'mel'){
    // Melodic minor: raise 6th and 7th ascending
    const tonic = SEQ_noteToPC(SEQ_S.key);
    const six = (tonic + 8) % 12, sev = (tonic + 10) % 12;
    SEQ_S.chords.forEach(ch => {
      ch.midi = ch.midi.map(m => {
        const pc = ((m % 12) + 12) % 12;
        if(pc === six || pc === sev) return m + 1;
        return m;
      });
      ch.pcs = ch.midi.map(m => ((m % 12) + 12) % 12);
    });
  } else if(cfg.variation === 'alt'){
    // Random alteration: alter one note per chord
    SEQ_S.chords.forEach((ch, i) => {
      const v = (i + 1) % 4;
      if(v !== 0) ch.midi[v] += (i % 2 ? 1 : -1);
      ch.pcs = ch.midi.map(m => ((m % 12) + 12) % 12);
    });
  }
}

// Internal version that doesn't trigger transformations
function SEQ_computeSequenceRaw(){
  const seq = SEQ_SEQUENCES.find(s => s.id === SEQ_S.seqId);
  if(!seq) return;
  const chords = [];
  const tonic = SEQ_noteToPC(SEQ_S.key);

  function SEQ_voiceSATB_raw(pcs, roman, rootPC, qual, inversion){
    const rootName = SEQ_pcToName(rootPC, SEQ_S.key);
    const bassPC = inversion === 1 ? pcs[1] : pcs[0];
    let bassMidi = 48 + bassPC;
    while(bassMidi > 55) bassMidi -= 12;
    while(bassMidi < 36) bassMidi += 12;
    const tenPC = inversion === 1 ? pcs[2] : pcs[1];
    let tenorMidi = 60 + tenPC;
    while(tenorMidi < bassMidi + 3) tenorMidi += 12;
    while(tenorMidi > 67) tenorMidi -= 12;
    if(tenorMidi <= bassMidi) tenorMidi += 12;
    const altPC = inversion === 1 ? pcs[0] : pcs[2];
    let altoMidi = 60 + altPC;
    while(altoMidi < tenorMidi + 2) altoMidi += 12;
    while(altoMidi > 76) altoMidi -= 12;
    if(altoMidi <= tenorMidi) altoMidi += 12;
    let sopMidi;
    if(pcs.length === 4) sopMidi = 60 + pcs[3];
    else sopMidi = 60 + pcs[0];
    while(sopMidi < altoMidi) sopMidi += 12;
    while(sopMidi > 84) sopMidi -= 12;
    if(sopMidi <= altoMidi) sopMidi += 12;
    const qualStr = qual === 'M' ? '' : qual === 'm' ? 'm' : qual === 'dim' ? 'dim' : qual === 'aug' ? '+' : qual === '7' ? '7' : qual === 'm7' ? 'm7' : qual === 'M7' ? 'Δ7' : qual === 'ø7' ? 'ø7' : qual === 'o7' ? 'o7' : qual === 'mM7' ? 'mΔ7' : qual;
    return {pcs, midi:[bassMidi, tenorMidi, altoMidi, sopMidi], deg:0, roman, quality:qual, inversion:inversion||0, rootName, name:rootName+qualStr};
  }

  if(seq.chromRoots){
    const types = Array.isArray(seq.chromTypes) ? seq.chromTypes : Array(seq.chromRoots.length).fill(seq.chromType || 'dom7');
    for(let i = 0; i < seq.chromRoots.length; i++){
      const rootPC = (tonic + seq.chromRoots[i]) % 12;
      const qType = types[i];
      let pcs;
      if(qType === 'dom7') pcs = [rootPC, (rootPC+4)%12, (rootPC+7)%12, (rootPC+10)%12];
      else if(qType === 'dim7') pcs = [rootPC, (rootPC+3)%12, (rootPC+6)%12, (rootPC+9)%12];
      else if(qType === 'min') pcs = [rootPC, (rootPC+3)%12, (rootPC+7)%12];
      else pcs = [rootPC, (rootPC+4)%12, (rootPC+7)%12];
      const qual = SEQ_chordQuality(pcs);
      const roman = SEQ_chromRoman(seq.chromRoots[i], qType);
      chords.push(SEQ_voiceSATB_raw(pcs, roman, rootPC, qual, 0));
    }
  } else {
    const scale = SEQ_getScale(SEQ_S.key, SEQ_S.mode);
    const degs = seq.degrees;
    for(let i = 0; i < degs.length; i++){
      const deg = degs[i];
      const notes = seq.use7 ? SEQ_buildSeventh(scale, deg) : SEQ_buildTriad(scale, deg);
      const qual = SEQ_chordQuality(notes);
      const romLabels = seq.use7 ? (SEQ_S.mode === 'major' ? SEQ_ROM_MAJ7 : SEQ_ROM_MIN7) : (SEQ_S.mode === 'major' ? SEQ_ROM_MAJ : SEQ_ROM_MIN);
      let roman = romLabels[deg] || ('?' + deg);
      const inversion = (seq.inv && seq.inv[i]) || 0;
      if(inversion === 1) roman += '⁶';
      chords.push(SEQ_voiceSATB_raw(notes, roman, notes[0], qual, inversion));
      chords[chords.length-1].deg = deg;
    }
  }
  SEQ_S.chords = chords;
}

// ══════════════════════════════════════
// ── Library (localStorage) ──
// ══════════════════════════════════════
function SEQ_libSave(){
  try {
    const seq = SEQ_SEQUENCES.find(s => s.id === SEQ_S.seqId);
    const name = prompt(tx('Nom de la séquence :', 'Sequence name:', 'Nombre de la secuencia:'), 
                       (seq ? tSeqNm(seq.name) : 'Custom') + ' — ' + SEQ_S.key + ' ' + SEQ_S.mode);
    if(!name) return;
    const entry = {
      id: 'lib_' + Date.now(),
      name: name,
      key: SEQ_S.key,
      mode: SEQ_S.mode,
      seqId: SEQ_S.seqId,
      length: SEQ_S.length,
      transform: SEQ_S.transform,
      transpose: SEQ_S.transpose,
      hybrid: SEQ_S.hybrid,
      chords: SEQ_S.chords.map(c => ({
        pcs: c.pcs.slice(),
        midi: c.midi.slice(),
        roman: c.roman, name: c.name, quality: c.quality,
        inversion: c.inversion, rootName: c.rootName, deg: c.deg
      })),
      savedAt: new Date().toISOString()
    };
    SEQ_S.library.push(entry);
    localStorage.setItem('pc_seq_library', JSON.stringify(SEQ_S.library));
    SEQ_render();
  } catch(e){ alert(tx('Erreur de sauvegarde', 'Save error', 'Error al guardar')); }
}

function SEQ_libLoad(id){
  const entry = SEQ_S.library.find(e => e.id === id);
  if(!entry) return;
  SEQ_S.key = entry.key;
  SEQ_S.mode = entry.mode;
  SEQ_S.seqId = entry.seqId;
  SEQ_S.length = entry.length || 8;
  SEQ_S.transform = entry.transform || 'none';
  SEQ_S.transpose = entry.transpose || 0;
  SEQ_S.hybrid = entry.hybrid || null;
  // Restore exact chords if saved
  if(entry.chords && entry.chords.length){
    SEQ_S.chords = entry.chords.map(c => ({...c, midi: c.midi.slice(), pcs: c.pcs.slice()}));
    SEQ_render(true); // skip recompute
  } else {
    SEQ_render();
  }
}

function SEQ_libDelete(id){
  if(!confirm(tx('Supprimer cette séquence ?', 'Delete this sequence?', '¿Eliminar esta secuencia?'))) return;
  SEQ_S.library = SEQ_S.library.filter(e => e.id !== id);
  try { localStorage.setItem('pc_seq_library', JSON.stringify(SEQ_S.library)); } catch(e){}
  SEQ_render();
}

function SEQ_libExportJSON(){
  const blob = new Blob([JSON.stringify(SEQ_S.library, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sequences_library_' + new Date().toISOString().slice(0,10) + '.json';
  a.click();
  URL.revokeObjectURL(url);
}

function SEQ_libImportJSON(file){
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const imported = JSON.parse(e.target.result);
      if(!Array.isArray(imported)) throw new Error('Invalid format');
      // Merge by id, avoid duplicates
      const existingIds = new Set(SEQ_S.library.map(x => x.id));
      imported.forEach(entry => {
        if(!existingIds.has(entry.id)) SEQ_S.library.push(entry);
      });
      localStorage.setItem('pc_seq_library', JSON.stringify(SEQ_S.library));
      SEQ_render();
      alert(tx('Importé !', 'Imported!', '¡Importado!'));
    } catch(err){ alert(tx('Format JSON invalide', 'Invalid JSON format', 'Formato JSON inválido')); }
  };
  reader.readAsText(file);
}

// ══════════════════════════════════════
// ── Send to Analyzer ──
// ══════════════════════════════════════
function SEQ_sendToAnalyzer(){
  if(!SEQ_S.chords.length) return;
  const payload = {
    source: 'sequences',
    key: SEQ_S.key,
    mode: SEQ_S.mode,
    chords: SEQ_S.chords.map(c => ({
      midi: c.midi.slice(),
      pcs: c.pcs.slice(),
      roman: c.roman,
      name: c.name,
      quality: c.quality,
      rootName: c.rootName
    }))
  };
  try {
    sessionStorage.setItem('pc_analyzer_import', JSON.stringify(payload));
    // Analyzer is tab index 12 (MODULES array in main.js)
    if(typeof window.switchTab === 'function'){
      window.switchTab(12);
    }
  } catch(e){
    alert(tx('Impossible d\'envoyer vers l\'Analyseur', 'Cannot send to Analyzer', 'No se puede enviar al Analizador'));
  }
}

// ══════════════════════════════════════
// ── Voice Movement Graph + Heatmap ──
// ══════════════════════════════════════
function SEQ_renderVoiceGraph(){
  const chords = SEQ_S.chords;
  if(!chords.length) return '';
  const W = 60 + chords.length * 56;
  const H = 240;
  const pad = 30;
  // Find min/max MIDI to scale
  let minM = 999, maxM = 0;
  chords.forEach(c => c.midi.forEach(m => { if(m < minM) minM = m; if(m > maxM) maxM = m; }));
  const range = Math.max(12, maxM - minM);
  const yScale = m => pad + (H - 2*pad) * (1 - (m - minM) / range);
  const xScale = i => 40 + i * 56;
  
  const colors = ['#e74c3c','#e67e22','#2ecc71','#3498db']; // B T A S
  const labels = ['B','T','A','S'];
  
  let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:${H}px;display:block;background:#fafafa;border-radius:8px">`;
  // Grid lines
  for(let i = 0; i <= 4; i++){
    const y = pad + (H - 2*pad) * i / 4;
    svg += `<line x1="30" y1="${y}" x2="${W-10}" y2="${y}" stroke="#e5e7eb" stroke-width="0.5"/>`;
  }
  // Voice lines
  for(let v = 0; v < 4; v++){
    let d = '';
    chords.forEach((ch, i) => {
      const x = xScale(i), y = yScale(ch.midi[v]);
      d += (i === 0 ? 'M' : 'L') + x + ',' + y;
    });
    svg += `<path d="${d}" fill="none" stroke="${colors[v]}" stroke-width="2" opacity="0.85"/>`;
    chords.forEach((ch, i) => {
      const x = xScale(i), y = yScale(ch.midi[v]);
      svg += `<circle cx="${x}" cy="${y}" r="3.5" fill="${colors[v]}"/>`;
    });
    // Voice label at start
    svg += `<text x="15" y="${yScale(chords[0].midi[v])+4}" font-size="11" font-weight="700" fill="${colors[v]}" font-family="'DM Sans',sans-serif">${labels[v]}</text>`;
  }
  // X-axis chord labels
  chords.forEach((ch, i) => {
    svg += `<text x="${xScale(i)}" y="${H-8}" font-size="10" fill="#6b7280" text-anchor="middle" font-family="'DM Sans',sans-serif">${ch.roman}</text>`;
  });
  svg += '</svg>';
  return svg;
}

function SEQ_renderHeatmap(){
  const chords = SEQ_S.chords;
  if(chords.length < 2) return '';
  const W = 60 + (chords.length - 1) * 56;
  const cellH = 36;
  const H = 4 * cellH + 70;
  // Display order top→bottom: S, A, T, B
  const labels   = ['S','A','T','B'];
  const colors_v = ['#3498db','#2ecc71','#e67e22','#e74c3c']; // S=blue A=green T=orange B=red
  const midiIdx  = [3, 2, 1, 0]; // midi[3]=S, midi[2]=A, midi[1]=T, midi[0]=B
  let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:${H}px;display:block;background:#fafafa;border-radius:8px">`;
  
  svg += `<text x="${W/2}" y="20" font-size="11" font-weight="600" fill="#374151" text-anchor="middle" font-family="'DM Sans',sans-serif">${tx('Mouvement entre accords (rouge = saut large, orange = parallélisme)','Motion between chords (red = large leap, orange = parallel)','Movimiento entre acordes (rojo = salto amplio, naranja = paralelo)')}</text>`;
  
  for(let v = 0; v < 4; v++){
    const vi = midiIdx[v];
    const y = 35 + v * cellH;
    svg += `<text x="20" y="${y+cellH/2+4}" font-size="13" font-weight="700" fill="${colors_v[v]}" font-family="'DM Sans',sans-serif" text-anchor="middle">${labels[v]}</text>`;
    
    for(let i = 0; i < chords.length - 1; i++){
      const a = chords[i].midi[vi], b = chords[i+1].midi[vi];
      const interval = Math.abs(b - a);
      
      let parallel = false;
      for(let w = 0; w < 4; w++){
        if(w === vi) continue;
        const a2 = chords[i].midi[w], b2 = chords[i+1].midi[w];
        const i1 = Math.abs(a - a2) % 12, i2 = Math.abs(b - b2) % 12;
        if((i1 === 7 && i2 === 7) || (i1 === 0 && i2 === 0 && a !== a2)){
          parallel = true; break;
        }
      }
      
      let color = '#10b981';
      if(parallel) color = '#f59e0b';
      else if(interval > 7) color = '#ef4444';
      else if(interval > 4) color = '#fbbf24';
      
      const x = 40 + i * 56;
      svg += `<rect x="${x}" y="${y+4}" width="48" height="${cellH-8}" rx="4" fill="${color}" opacity="0.75"/>`;
      const sign = b > a ? '↑' : b < a ? '↓' : '=';
      svg += `<text x="${x+24}" y="${y+cellH/2+4}" font-size="11" font-weight="600" fill="#fff" text-anchor="middle" font-family="'DM Sans',sans-serif">${sign}${interval}</text>`;
    }
  }
  const ly = H - 14;
  svg += `<g font-family="'DM Sans',sans-serif" font-size="9">`;
  svg += `<rect x="40" y="${ly-8}" width="10" height="10" fill="#10b981"/><text x="54" y="${ly}" fill="#374151">${tx('OK','OK','OK')}</text>`;
  svg += `<rect x="100" y="${ly-8}" width="10" height="10" fill="#fbbf24"/><text x="114" y="${ly}" fill="#374151">${tx('Saut moyen','Mid leap','Salto medio')}</text>`;
  svg += `<rect x="190" y="${ly-8}" width="10" height="10" fill="#f59e0b"/><text x="204" y="${ly}" fill="#374151">${tx('Parallèle','Parallel','Paralelo')}</text>`;
  svg += `<rect x="270" y="${ly-8}" width="10" height="10" fill="#ef4444"/><text x="284" y="${ly}" fill="#374151">${tx('Saut large','Large leap','Salto amplio')}</text>`;
  svg += `</g>`;
  svg += '</svg>';
  return svg;
}

// Global diatonic pitch (for interval calculation)
function SEQ_midiToDiaGlobal(midi){
  const pc = ((midi % 12) + 12) % 12;
  const oct = Math.floor(midi / 12) - 1;
  return oct * 7 + [0,0,1,1,2,3,3,4,4,5,5,6][pc];
}

// ── SVG Staff Rendering ──
function SEQ_renderStaffSVG(){
  const chords = SEQ_S.chords;
  if(!chords.length) return '<div class="staff-empty">Sélectionnez une séquence</div>';
  
  const LS = 11; // line spacing
  const gapBetweenStaves = 26;
  const tTop = 30; // treble top line
  const bTop = tTop + 4*LS + gapBetweenStaves; // bass top line
  const H = bTop + 4*LS + 95;
  const leftMargin = 70;
  const chordSpacing = 56;
  const W = leftMargin + chords.length * chordSpacing + 40;
  
  const tY = i => tTop + i * LS;
  const bY = i => bTop + i * LS;
  
  // Middle C = MIDI 60 = treble ledger line below = bass ledger line above
  // Treble: bottom line (E4=64), space F4=65, G4=67 line, ...
  // Bass: top line (A3=57), ...
  
  function SEQ_midiToTrebleY(midi){
    // E4(64)=tY(4), F4(65)=tY(4)-LS/2, G4(67)=tY(3), etc.
    const diaFromC4 = SEQ_midiToDia(midi) - SEQ_midiToDia(60);
    return tY(4) - (diaFromC4 - 2) * (LS/2); // E4 is 2 diatonic steps above C4
  }
  
  function SEQ_midiToBassY(midi){
    const diaFromC3 = SEQ_midiToDia(midi) - SEQ_midiToDia(48);
    return bY(4) - (diaFromC3 - 2) * (LS/2); // E3 at bottom line
  }
  
  function SEQ_midiToDia(midi){
    const pc = ((midi % 12) + 12) % 12;
    const oct = Math.floor(midi / 12) - 1;
    const diaPC = [0,0,1,1,2,3,3,4,4,5,5,6][pc];
    return oct * 7 + diaPC;
  }
  
  // Key signature
  const ksN = (SEQ_S.mode === 'major' ? SEQ_KS_MAJ[SEQ_S.key] : SEQ_KS_MIN[SEQ_S.key]) || 0;
  const shOrder = [3,0,4,1,5,2,6]; // F C G D A E B
  const flOrder = [6,2,5,1,4,0,3]; // B E A D G C F
  const tSharpY = [tY(0), tY(1)+LS/2, tY(0)-LS/2, tY(1), tY(2)+LS/2, tY(1)-LS/2, tY(2)];
  const tFlatY = [tY(2), tY(0)+LS/2, tY(2)+LS/2, tY(1), tY(3)+LS/2, tY(1)+LS/2, tY(3)];
  const bSharpY = tSharpY.map(y => y + (bTop - tTop) + LS);
  const bFlatY = tFlatY.map(y => y + (bTop - tTop) + LS);
  
  const SC = '#1e1e2e'; // staff color (dark)
  const BBOT = bY(4); // bass bottom line
  let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:${W}px;height:${H}px;display:block">`;
  
  // ── Brace — Bravura SMuFL glyph U+E000 ──
  // Bravura brace: y=0(bottom) to y=997(top), width ~80 units
  const bT = tY(0), bB = BBOT;
  const braceH = bB - bT; // total system height in px
  const brSy = braceH / 997; // vertical scale
  const brSx = brSy * 0.85; // slightly narrower for elegance
  const bX = 16;
  // Position: translate so y=997→tY(0) and y=0→bY(4), flip Y
  svg += `<g transform="translate(${bX - 82*brSx}, ${bB}) scale(${brSx}, ${-brSy})">`;
  svg += `<path d="M20 498Q43 514 62 557Q81 600 82 646Q82 650 82 654Q82 658 81 662Q74 709 60 768Q46 826 44 869Q45 909 56 941Q67 972 72 980Q74 984 76 986Q77 988 77 990Q77 992 75 995Q73 997 71 997Q70 997 68 995Q66 994 63 990Q23 943 11 870Q0 798 2 737Q3 689 12 639Q22 589 22 548Q22 537 21 527Q20 516 18 506Q17 501 15 499Q14 498 11 498Q7 498 5 495Q2 493 2 490Q2 491 5 487Q7 484 11 483Q14 483 15 482Q17 480 18 476Q20 466 21 453Q22 440 22 431Q22 391 12 342Q3 293 2 244Q0 183 11 111Q23 39 63 -9Q66 -13 68 -14Q70 -16 71 -16Q73 -16 75 -14Q77 -11 77 -9Q77 -7 76 -5Q74 -3 72 1Q67 9 56 40Q45 72 44 112Q46 155 60 213Q74 272 81 319Q82 323 82 327Q82 331 82 335Q81 381 62 424Q43 467 20 483Q18 486 18 491Q18 496 20 498Z" fill="${SC}"/>`;
  svg += `</g>`;
  
  // ── Staff lines (start AFTER clef area) ──
  const sX1 = bX + 8, sX2 = W - 14;
  for(let i=0;i<5;i++) svg += `<line x1="${sX1}" y1="${tY(i)}" x2="${sX2}" y2="${tY(i)}" stroke="${SC}" stroke-width="0.7" opacity="0.4"/>`;
  for(let i=0;i<5;i++) svg += `<line x1="${sX1}" y1="${bY(i)}" x2="${sX2}" y2="${bY(i)}" stroke="${SC}" stroke-width="0.7" opacity="0.4"/>`;
  
  // ── Initial barline connecting both staves ──
  svg += `<line x1="${sX1}" y1="${tY(0)}" x2="${sX1}" y2="${BBOT}" stroke="${SC}" stroke-width="1" opacity="0.5"/>`;
  
  // ── Treble clef — Bravura SMuFL glyph U+E050 ──
  // Origin at G line (tY(3)), 1 staff space = 250 font units
  {
    const s = LS / 250; // scale: staff spacing to font units
    const cx = sX1 + 3; // left edge of clef
    const gLineY = tY(3); // G4 line
    svg += `<g transform="translate(${cx}, ${gLineY}) scale(${s}, ${-s})">`;
    svg += `<path d="M376 415Q375 424 376 427Q378 430 382 434Q465 510 518 605Q570 700 572 815Q572 881 555 942Q538 1002 507 1048Q495 1066 480 1081Q464 1097 455 1098Q444 1097 425 1082Q406 1067 390 1050Q335 987 313 903Q291 819 292 739Q292 695 296 651Q301 607 306 575Q308 567 307 562Q306 558 297 551Q184 463 95 350Q5 237 0 87Q0 -48 90 -148Q180 -247 364 -252Q382 -252 400 -250Q418 -249 433 -246Q441 -244 444 -245Q447 -246 448 -255Q458 -307 466 -363Q474 -419 475 -456Q471 -563 418 -594Q365 -625 316 -622Q276 -621 256 -612Q236 -603 236 -593Q236 -588 243 -584Q251 -581 268 -576Q293 -570 313 -547Q334 -525 335 -482Q335 -440 310 -410Q285 -381 239 -380Q188 -381 160 -414Q132 -447 132 -495Q130 -548 170 -601Q211 -654 322 -658Q378 -661 446 -622Q513 -582 519 -458Q518 -413 509 -353Q499 -293 490 -244Q488 -236 491 -233Q493 -231 503 -227Q580 -196 625 -135Q670 -74 671 11Q670 110 606 180Q542 249 430 252Q411 251 407 254Q402 257 401 270ZM470 943Q495 943 512 923Q529 902 530 861Q527 778 473 710Q419 643 356 591Q351 586 348 588Q344 589 343 599Q340 619 339 643Q337 667 337 691Q340 809 381 876Q422 942 470 943ZM361 262Q364 249 361 245Q359 242 346 238Q279 214 241 162Q202 109 201 44Q202 -24 233 -70Q264 -115 316 -133Q322 -135 330 -137Q337 -139 343 -139Q349 -139 352 -136Q355 -133 355 -128Q355 -123 350 -120Q346 -117 340 -115Q308 -101 288 -72Q269 -43 268 -8Q269 35 295 66Q322 96 368 109Q380 112 383 111Q387 109 388 101L438 -197Q440 -205 437 -207Q435 -209 424 -211Q412 -213 398 -215Q383 -216 368 -216Q235 -214 158 -150Q82 -86 80 20Q78 64 95 123Q113 181 173 252Q218 301 254 334Q291 366 326 394Q333 400 336 399Q339 398 340 390ZM430 103Q428 112 430 115Q432 118 441 117Q503 110 545 66Q587 21 589 -46Q588 -94 563 -130Q538 -167 495 -188Q486 -193 483 -192Q480 -191 479 -182Z" fill="${SC}"/>`;
    svg += `</g>`;
  }
  
  // ── Bass clef — Bravura SMuFL glyph U+E07C (French F clef) ──
  // Clean, compact style matching engraved reference. Scaled ×1.35 for proper staff fill.
  // Origin at F line (bY(1)), 250 font units = 1 staff space
  {
    const sy = (LS / 250) * 1.35;
    const sx = sy * 1.15; // légèrement plus large horizontalement
    const cx = sX1 + 2;
    const fLineY = bY(1); // F3 line
    svg += `<g transform="translate(${cx}, ${fLineY}) scale(${sx}, ${-sy})">`;
    svg += `<path d="M162 170Q78 165 39 111Q0 56 0 6Q0 2 1 -3Q7 -48 31 -71Q55 -94 84 -94H88Q119 -92 144 -67Q168 -41 169 -10Q167 33 140 47Q112 60 89 59H70Q60 59 57 64Q54 68 54 73Q54 75 55 76Q55 77 55 77Q74 115 98 126Q122 137 137 136Q189 134 208 99Q227 63 231 17Q231 16 232 15Q232 13 232 9Q233 0 234 -9Q234 -19 234 -28Q235 -120 203 -195Q171 -270 98 -327Q75 -345 49 -358Q24 -371 -2 -385Q-9 -390 -12 -395Q-15 -400 -15 -403Q-15 -407 -10 -410Q-5 -414 -2 -414Q57 -411 117 -373Q176 -335 215 -295Q267 -244 307 -170Q348 -97 350 -22V-18Q348 34 331 68Q313 102 288 122Q245 154 207 163Q169 171 166 170ZM418 127Q399 127 387 115Q374 102 374 84Q374 65 387 52Q399 39 418 39Q437 39 449 52Q462 65 462 84Q462 102 449 115Q437 127 418 127ZM418 -41Q400 -41 388 -54Q376 -66 375 -85Q376 -103 388 -116Q400 -128 418 -129Q437 -128 450 -116Q463 -103 463 -85Q463 -66 450 -54Q437 -41 418 -41Z" fill="${SC}"/>`;
    svg += `</g>`;
  }
  
  // Key signature — positioned after the clefs
  // French bass clef: 463 units × 1.35 × 1.15 ≈ 720 effective; treble: 671 units
  const clefEndX = sX1 + 2 + Math.ceil(463 * (LS/250) * 1.35 * 1.15) + 4;
  let ksX = clefEndX;
  if(ksN > 0){
    for(let i=0;i<ksN;i++){
      svg += `<text x="${ksX}" y="${tSharpY[i]+5}" font-size="14" fill="#1e1e2e" font-family="serif" text-anchor="middle">♯</text>`;
      svg += `<text x="${ksX}" y="${bSharpY[i]+5}" font-size="14" fill="#1e1e2e" font-family="serif" text-anchor="middle">♯</text>`;
      ksX += 9;
    }
  } else if(ksN < 0){
    for(let i=0;i<-ksN;i++){
      svg += `<text x="${ksX}" y="${tFlatY[i]+5}" font-size="14" fill="#1e1e2e" font-family="serif" text-anchor="middle">♭</text>`;
      svg += `<text x="${ksX}" y="${bFlatY[i]+5}" font-size="14" fill="#1e1e2e" font-family="serif" text-anchor="middle">♭</text>`;
      ksX += 9;
    }
  }
  
  // Note area starts after key signature
  const startX = ksX + 10;
  
  // Accidentals needed per note
  const ksSet = new Set();
  if(ksN > 0) for(let i=0;i<ksN;i++) ksSet.add(shOrder[i]);
  if(ksN < 0) for(let i=0;i<-ksN;i++) ksSet.add(flOrder[i]);
  
  function SEQ_needAcc(midi){
    const pc = ((midi%12)+12)%12;
    const dia = [0,0,1,1,2,3,3,4,4,5,5,6][pc];
    const nat = [0,2,4,5,7,9,11][dia];
    const d = ((pc - nat) + 12) % 12;
    if(d === 0) return ksSet.has(dia) ? '♮' : null;
    if(d === 1) return (ksN > 0 && ksSet.has(dia)) ? null : '♯';
    if(d === 11) return (ksN < 0 && ksSet.has(dia)) ? null : '♭';
    if(d === 2) return '𝄪';
    if(d === 10) return '𝄫';
    return null;
  }
  
  const nX0 = startX + 20;
  const nR = 6.5, nRy = 4.5;
  const colors = ['#e74c3c','#e67e22','#2ecc71','#3498db']; // B T A S
  const seq = SEQ_SEQUENCES.find(s => s.id === SEQ_S.seqId);
  
  // Store layout for drag
  window.SEQ_L = { nX0, chordSpacing, LS, tTop, bTop, tY, bY, SEQ_midiToTrebleY, SEQ_midiToBassY, notePositions: [] };
  
  // ── Model background (subtle shading behind the first modelLen chords) ──
  const mLen = seq.modelLen || 2;
  if(mLen > 0 && chords.length > mLen){
    const mx1 = nX0 - chordSpacing/2 + 4;
    const mx2 = nX0 + (mLen - 1) * chordSpacing + chordSpacing/2 - 4;
    svg += `<rect x="${mx1}" y="${tY(0)-8}" width="${mx2-mx1}" height="${BBOT - tY(0) + 16}" rx="6" fill="#534AB7" opacity="0.06"/>`;
    svg += `<text x="${(mx1+mx2)/2}" y="${tY(0)-12}" font-size="9" fill="#534AB7" font-weight="600" font-family="'DM Sans',sans-serif" text-anchor="middle" opacity="0.7">${tx('modèle','pattern','patrón')}</text>`;
  }
  
  chords.forEach((ch, idx) => {
    const x = nX0 + idx * chordSpacing;
    
    // Light barline between chords
    if(idx > 0){
      svg += `<line x1="${x - chordSpacing/2}" y1="${tY(0)}" x2="${x - chordSpacing/2}" y2="${BBOT}" stroke="${SC}" stroke-width="0.5" opacity="0.15"/>`;
    }
    
    // Bass note (ch.midi[0]) on bass clef
    const bassY = SEQ_midiToBassY(ch.midi[0]);
    const bx = x;
    SEQ_drawNote(svg, bx, bassY, bY, ch.midi[0], 0, idx);
    window.SEQ_L.notePositions.push({x:bx, y:bassY, ci:idx, vi:0});
    
    // Tenor (ch.midi[1]) on bass clef  
    const tenorY = SEQ_midiToBassY(ch.midi[1]);
    const tx = x + (tenorY === bassY ? 14 : 0);
    SEQ_drawNote(svg, tx, tenorY, bY, ch.midi[1], 1, idx);
    window.SEQ_L.notePositions.push({x:tx, y:tenorY, ci:idx, vi:1});
    
    // Alto (ch.midi[2]) on treble clef
    const altoY = SEQ_midiToTrebleY(ch.midi[2]);
    const ax = x;
    SEQ_drawNote(svg, ax, altoY, tY, ch.midi[2], 2, idx);
    window.SEQ_L.notePositions.push({x:ax, y:altoY, ci:idx, vi:2});
    
    // Soprano (ch.midi[3]) on treble clef
    const sopY = SEQ_midiToTrebleY(ch.midi[3]);
    const sx = x + (sopY === altoY ? 14 : 0);
    SEQ_drawNote(svg, sx, sopY, tY, ch.midi[3], 3, idx);
    window.SEQ_L.notePositions.push({x:sx, y:sopY, ci:idx, vi:3});
    
    // Roman numeral below
    svg += `<text x="${x}" y="${bY(4)+55}" font-size="13" fill="#534AB7" font-weight="700" font-family="'DM Sans',serif" text-anchor="middle">${ch.roman}</text>`;
    // Chord name
    svg += `<text x="${x}" y="${bY(4)+68}" font-size="9" fill="#9ca3af" font-weight="500" font-family="'DM Sans',sans-serif" text-anchor="middle">${ch.name}</text>`;
  });
  
  // Final double barline
  const endX = nX0 + (chords.length - 1) * chordSpacing + 20;
  svg += `<line x1="${endX}" y1="${tY(0)}" x2="${endX}" y2="${BBOT}" stroke="${SC}" stroke-width="0.8" opacity="0.35"/>`;
  svg += `<line x1="${endX+3}" y1="${tY(0)}" x2="${endX+3}" y2="${BBOT}" stroke="${SC}" stroke-width="2.2" opacity="0.4"/>`;
  
  svg += '</svg>';
  return svg;
  
  function SEQ_drawNote(parentSvg, nx, ny, lineY, midi, voiceIdx, chordIdx){
    const hl = SEQ_S.hlVoice === voiceIdx; // is this the highlighted voice?
    const dim = SEQ_S.hlVoice >= 0 && !hl; // dim non-highlighted voices
    const op = dim ? 0.3 : 1;
    // Ledger lines
    if(ny > lineY(4) + 1){
      for(let ly = lineY(4) + LS; ly <= ny + 1; ly += LS){
        svg += `<line x1="${nx-12}" y1="${ly}" x2="${nx+12}" y2="${ly}" stroke="${SC}" stroke-width="0.8" opacity="0.5"/>`;
      }
    }
    if(ny < lineY(0) - 1){
      for(let ly = lineY(0) - LS; ly >= ny - 1; ly -= LS){
        svg += `<line x1="${nx-12}" y1="${ly}" x2="${nx+12}" y2="${ly}" stroke="${SC}" stroke-width="0.8" opacity="0.5"/>`;
      }
    }
    // Accidental
    const acc = SEQ_needAcc(midi);
    if(acc) svg += `<text x="${nx-14}" y="${ny+5}" font-size="14" fill="${SC}" font-family="serif" text-anchor="middle" opacity="${op}">${acc}</text>`;
    // Highlight ring
    if(hl) svg += `<ellipse cx="${nx}" cy="${ny}" rx="${nR+3}" ry="${nRy+2.5}" fill="none" stroke="${colors[voiceIdx]}" stroke-width="1.5" opacity="0.4" transform="rotate(-12 ${nx} ${ny})"/>`;
    // Notehead
    svg += `<ellipse cx="${nx}" cy="${ny}" rx="${nR}" ry="${nRy}" fill="${colors[voiceIdx]}" opacity="${op}" transform="rotate(-12 ${nx} ${ny})"/>`;
  }
}

// ── Audio ──
let SEQ_audioCtx = null;
function SEQ_getCtx(){ return _getPianoCtx(); }
function SEQ_m2f(m){ return 440 * Math.pow(2, (m-69)/12); }

function SEQ_playNote(freq, startTime, dur, vel){
  var chain = _getPianoChain();
  pianoNote(freq, startTime, dur, chain.ctx, chain.dry, chain.wet, vel || 0.22);
}

function SEQ_playSequence(){
  // If already playing in loop mode, stop
  if(SEQ_S._loopTimer){
    clearInterval(SEQ_S._loopTimer);
    SEQ_S._loopTimer = null;
    const btn0 = document.getElementById('playBtn');
    if(btn0) btn0.classList.remove('playing');
    return;
  }
  
  function _playOnce(){
    const chain = _getPianoChain();
    const ctx = chain.ctx;
    const now = ctx.currentTime;
    const isChord = SEQ_S.pm === 'chord';
    const beatDur = 0.7;
    SEQ_S.chords.forEach((ch, i) => {
      const t0 = now + i * beatDur;
      if(isChord){
        ch.midi.forEach((m, j) => {
          SEQ_playNote(SEQ_m2f(m), t0 + j * 0.006, beatDur * 0.9, 0.22);
        });
      } else {
        ch.midi.forEach((m, j) => {
          SEQ_playNote(SEQ_m2f(m), t0 + j * 0.12, beatDur * 0.9, 0.20);
        });
      }
    });
    return SEQ_S.chords.length * beatDur * 1000;
  }
  
  const totalMs = _playOnce();
  const btn = document.getElementById('playBtn');
  if(btn) btn.classList.add('playing');
  
  if(SEQ_S.loop){
    // Schedule replays
    SEQ_S._loopTimer = setInterval(() => {
      _playOnce();
    }, totalMs + 200);
  } else {
    setTimeout(() => {
      if(btn) btn.classList.remove('playing');
    }, totalMs + 400);
  }
}

// ── MIDI Export ──
function SEQ_exportMIDI(){
  if(!SEQ_S.chords.length) return;
  const TPQ = 480;
  function vl(n){const b=[];b.push(n & 0x7F);n >>= 7;while(n){b.push((n & 0x7F)|0x80);n >>= 7;}return b.reverse();}
  function strBytes(s){return Array.from(s).map(c=>c.charCodeAt(0));}
  function u32(n){return[(n>>24)&0xFF,(n>>16)&0xFF,(n>>8)&0xFF,n&0xFF];}
  function u16(n){return[(n>>8)&0xFF,n&0xFF];}
  
  // Header
  let midi = [...strBytes('MThd'), ...u32(6), ...u16(1), ...u16(5), ...u16(TPQ)];
  
  // Tempo track
  let t0 = [...vl(0), 0xFF, 0x51, 0x03]; // tempo meta
  const uspb = Math.round(60000000 / 100); // 100 BPM
  t0.push((uspb>>16)&0xFF, (uspb>>8)&0xFF, uspb&0xFF);
  t0.push(...vl(0), 0xFF, 0x2F, 0x00);
  midi.push(...strBytes('MTrk'), ...u32(t0.length), ...t0);
  
  // Voice tracks: S A T B
  const voiceNames = ['Soprano','Alto','Ténor','Basse'];
  const channels = [0,1,2,3];
  const programs = [52,52,52,52]; // String ensemble
  
  for(let v=0;v<4;v++){
    let trk = [];
    // Track name
    const nameBytes = strBytes(voiceNames[v]);
    trk.push(...vl(0), 0xFF, 0x03, ...vl(nameBytes.length), ...nameBytes);
    // Program change
    trk.push(...vl(0), 0xC0 | channels[v], programs[v]);
    
    const dur = TPQ * 2; // half note per chord
    const voiceMap = [3,2,1,0]; // S=midi[3], A=midi[2], T=midi[1], B=midi[0]
    
    SEQ_S.chords.forEach((ch, i) => {
      const m = ch.midi[voiceMap[v]];
      const vel = 80;
      trk.push(...vl(i===0?0:0), 0x90 | channels[v], m, vel); // note on
      trk.push(...vl(dur), 0x80 | channels[v], m, 0); // note off
    });
    
    trk.push(...vl(0), 0xFF, 0x2F, 0x00);
    midi.push(...strBytes('MTrk'), ...u32(trk.length), ...trk);
  }
  
  const blob = new Blob([new Uint8Array(midi)], {type:'audio/midi'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const seq = SEQ_SEQUENCES.find(s => s.id === SEQ_S.seqId);
  a.href = url;
  a.download = `sequence_${SEQ_S.key.replace('♯','sharp').replace('♭','flat')}_${SEQ_S.mode}_${seq.id}.mid`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── PDF Export ──
function SEQ_exportPDF(){
  if(!SEQ_S.chords.length) return;
  const seq = SEQ_SEQUENCES.find(s => s.id === SEQ_S.seqId);
  
  // Get the SVG and extract its viewBox dimensions to keep proportions
  const staffEl = document.getElementById('staffArea');
  const svgEl = staffEl.querySelector('svg');
  if(!svgEl) return;
  
  const vb = svgEl.getAttribute('viewBox'); // "0 0 W H"
  const [,, svgW, svgH] = vb.split(' ').map(Number);
  
  // Clone the SVG innerHTML but make it responsive for print
  let svgStr = svgEl.outerHTML;
  // Remove fixed pixel dimensions, keep viewBox — let CSS control size
  svgStr = svgStr.replace(/style="[^"]*"/, `style="display:block"`);
  
  const w = window.open('','_blank');
  const lblTitle = currentLang==='en' ? 'Sequence:' : currentLang==='es' ? 'Secuencia:' : 'Séquence :';
  const lblS=t('ah_s'),lblA=t('ah_a'),lblT=t('ah_t'),lblB=t('ah_b');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
@page{size:letter landscape;margin:0.6in 0.7in}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'DM Sans',sans-serif;color:#111827}
h1{font-size:20px;font-weight:700;color:#534AB7;margin-bottom:3px}
.sub{font-size:12px;color:#6b7280;margin-bottom:12px}
.staff-container{
  width:100%;
  overflow:visible;
}
.staff-container svg{
  width:100%;
  height:auto;
  max-height:65vh;
}
.legend{display:flex;gap:16px;margin-top:10px;font-size:10px;color:#6b7280}
.legend span{display:inline-flex;align-items:center;gap:4px}
.legend .dot{width:7px;height:7px;border-radius:50%;display:inline-block}
@media print{
  body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .staff-container svg{
    width:100%;
    height:auto;
  }
}
</style></head><body>
<h1>${lblTitle} ${tSeqNm(seq.name)}</h1>
<div class="sub">${SEQ_S.key} ${SEQ_S.mode === 'major' ? (tx('majeur','major','mayor')) : (tx('mineur','minor','menor'))} — ${tSeqDesc(seq.desc)}</div>
<div class="staff-container">${svgStr}</div>
<div class="legend">
  <span><span class="dot" style="background:#3498db"></span> ${lblS}</span>
  <span><span class="dot" style="background:#2ecc71"></span> ${lblA}</span>
  <span><span class="dot" style="background:#e67e22"></span> ${lblT}</span>
  <span><span class="dot" style="background:#e74c3c"></span> ${lblB}</span>
</div>
</body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 500);
}

// ── Main SEQ_render ──
function SEQ_render(skipRecompute){
  if(!skipRecompute){
    if(SEQ_S.hybrid){
      SEQ_generateHybrid();
      SEQ_applyLength();
      SEQ_applyTransform();
      SEQ_applyTranspose();
    } else {
      SEQ_computeSequence();
    }
  }
  const seq = SEQ_SEQUENCES.find(s => s.id === SEQ_S.seqId);
  
  // Group sequences by category
  const cats = [...new Set(SEQ_SEQUENCES.map(s => s.cat))];
  
  let h = '';
  
  // Controls card
  h += `<div class="card"><div class="ctrl-row">`;
  h += `<div class="ctrl-col"><label>${t("t_key")}</label><select onchange="SEQ_S.key=SEQ_KEY_PAIRS[this.value][SEQ_S.mode==='major'?'maj':'min'];SEQ_render()" id="keySel">`;
  SEQ_KEY_PAIRS.forEach((p,i) => {
    const k = SEQ_S.mode === 'major' ? p.maj : p.min;
    h += `<option value="${i}"${k === SEQ_S.key ? ' selected' : ''}>${p.maj} / ${p.min}m</option>`;
  });
  h += `</select></div>`;
  h += `<div class="ctrl-col"><label>${currentLang==="en"?"Mode":currentLang==="es"?"Modo":"Mode"}</label><div class="pills">`;
  h += `<button class="pill${SEQ_S.mode==='major'?' on':''}" onclick="SEQ_S.mode='major';SEQ_S.key=SEQ_KEY_PAIRS[document.getElementById('seq_keySel').value].maj;SEQ_render()">${t("Major")}</button>`;
  h += `<button class="pill${SEQ_S.mode==='minor'?' on':''}" onclick="SEQ_S.mode='minor';SEQ_S.key=SEQ_KEY_PAIRS[document.getElementById('seq_keySel').value].min;SEQ_render()">${t('Minor')}</button>`;
  h += `</div></div>`;
  // Voice highlight selector
  const voiceNames = [{l:tx('Toutes','All','Todas'),i:-1},{l:'Soprano',i:3,c:'#3498db'},{l:'Alto',i:2,c:'#2ecc71'},{l:tx('Ténor','Tenor','Tenor'),i:1,c:'#e67e22'},{l:tx('Basse','Bass','Bajo'),i:0,c:'#e74c3c'}];
  h += `<div class="ctrl-col"><label>${currentLang==="en"?"Voices":currentLang==="es"?"Voces":"Voix"}</label><div class="pills">`;
  voiceNames.forEach(v => {
    const on = SEQ_S.hlVoice === v.i;
    const style = on && v.c ? `border-color:${v.c};color:${v.c};background:${v.c}15` : '';
    h += `<button class="pill${on?' on':''}" style="${style}" onclick="SEQ_S.hlVoice=${v.i};SEQ_render()">${v.l}</button>`;
  });
  h += `</div></div>`;
  h += `</div></div>`;
  
  // ── Enrichment controls (length, loop, transform, transpose) ──
  h += `<div class="card"><div class="ctrl-row" style="flex-wrap:wrap;gap:12px">`;
  // Length slider
  h += `<div class="ctrl-col" style="min-width:180px"><label>${tx('Longueur','Length','Longitud')} : <b>${SEQ_S.length}</b></label>`;
  h += `<input type="range" min="4" max="16" value="${SEQ_S.length}" oninput="SEQ_S.length=parseInt(this.value);SEQ_render()" style="width:100%"></div>`;
  // Loop toggle
  h += `<div class="ctrl-col"><label>${tx('Boucle','Loop','Bucle')}</label><div class="pills">`;
  h += `<button class="pill${SEQ_S.loop?' on':''}" onclick="SEQ_S.loop=!SEQ_S.loop;SEQ_render()">${SEQ_S.loop?'🔁 ON':'OFF'}</button>`;
  h += `</div></div>`;
  // Transform select
  h += `<div class="ctrl-col"><label>${tx('Transformation','Transformation','Transformación')}</label>`;
  h += `<select onchange="SEQ_S.transform=this.value;SEQ_render()" style="padding:6px 8px;border-radius:6px;border:1px solid #ccc;">`;
  const trOpts = [
    ['none', tx('Aucune','None','Ninguna')],
    ['inv', tx('Inversion','Inversion','Inversión')],
    ['retro', tx('Rétrograde','Retrograde','Retrógrado')],
    ['aug', tx('Augmentation','Augmentation','Aumentación')],
    ['t3', tx('Transpo. +3ᵐᵃʲ','Transpose +M3','Transp. +3ᴹ')],
    ['t3down', tx('Transpo. −3ᵐᵃʲ','Transpose −M3','Transp. −3ᴹ')]
  ];
  trOpts.forEach(([v,l]) => h += `<option value="${v}"${SEQ_S.transform===v?' selected':''}>${l}</option>`);
  h += `</select></div>`;
  // Transpose semitones
  h += `<div class="ctrl-col" style="min-width:130px"><label>${tx('Transposition','Transpose','Transposición')} : <b>${SEQ_S.transpose>0?'+':''}${SEQ_S.transpose}</b></label>`;
  h += `<input type="range" min="-12" max="12" value="${SEQ_S.transpose}" oninput="SEQ_S.transpose=parseInt(this.value);SEQ_render()" style="width:100%"></div>`;
  h += `</div></div>`;
  h += `<div class="card"><div class="card-title">${currentLang==="en"?"Sequences":currentLang==="es"?"Secuencias":"Séquences"}</div><div class="seq-list">`;
  cats.forEach(cat => {
    const catId = cat.replace(/[^a-zA-Z]/g,'');
    const isOpen = SEQ_S.openCats.has(cat);
    h += `<div class="cat-label" onclick="SEQ_S.openCats.has('${cat}')?SEQ_S.openCats.delete('${cat}'):SEQ_S.openCats.add('${cat}');document.getElementById('th_${catId}').classList.toggle('open');this.querySelector('.arrow').classList.toggle('open')"><span class="arrow${isOpen?' open':''}">▶</span> ${tSeqCat(cat)}</div>`;
    if(SEQ_CAT_THEORY[cat]) h += `<div class="cat-theory${isOpen?' open':''}" id="th_${catId}">${tSeqTheory(cat)}</div>`;
    SEQ_SEQUENCES.filter(s => s.cat === cat).forEach(s => {
      h += `<button class="seq-btn${s.id === SEQ_S.seqId ? ' on' : ''}" onclick="SEQ_S.seqId='${s.id}';SEQ_render()" title="${tSeqDesc(s.desc)}">${tSeqNm(s.name)}</button>`;
    });
  });
  h += `</div></div>`;
  
  // Info badge
  if(seq){
    h += `<div class="info-badge"><span class="ib-label">Info</span> ${tSeqDesc(seq.desc)}</div>`;
  }
  
  // ── Hybrid Generator panel ──
  h += `<div class="card"><div class="card-title">${tx('Générateur hybride','Hybrid Generator','Generador híbrido')}</div>`;
  h += `<div class="ctrl-row" style="flex-wrap:wrap;gap:10px">`;
  h += `<div class="ctrl-col"><label>${tx('Base','Base','Base')}</label>`;
  h += `<select id="hybBase" style="padding:6px 8px;border-radius:6px;border:1px solid #ccc;max-width:240px">`;
  const baseSel = SEQ_S.hybrid ? SEQ_S.hybrid.base : SEQ_S.seqId;
  SEQ_SEQUENCES.forEach(s => h += `<option value="${s.id}"${s.id===baseSel?' selected':''}>${tSeqNm(s.name)}</option>`);
  h += `</select></div>`;
  h += `<div class="ctrl-col"><label>${tx('Variation','Variation','Variación')}</label>`;
  h += `<select id="hybVar" style="padding:6px 8px;border-radius:6px;border:1px solid #ccc;">`;
  const varSel = SEQ_S.hybrid ? SEQ_S.hybrid.variation : 'chromatic';
  const vOpts = [
    ['chromatic', tx('Chromatique (broderies)','Chromatic (neighbors)','Cromática (bordaduras)')],
    ['harm', tx('Mineur harmonique','Harmonic minor','Menor armónica')],
    ['mel', tx('Mineur mélodique','Melodic minor','Menor melódica')],
    ['alt', tx('Altérations','Alterations','Alteraciones')]
  ];
  vOpts.forEach(([v,l]) => h += `<option value="${v}"${varSel===v?' selected':''}>${l}</option>`);
  h += `</select></div>`;
  h += `<div class="ctrl-col" style="justify-content:flex-end"><label>&nbsp;</label>`;
  h += `<button class="pill on" onclick="SEQ_S.hybrid={base:document.getElementById('hybBase').value,variation:document.getElementById('hybVar').value};SEQ_render()">${tx('Générer','Generate','Generar')}</button>`;
  if(SEQ_S.hybrid){
    h += `<button class="pill" style="margin-left:6px" onclick="SEQ_S.hybrid=null;SEQ_render()">${tx('Réinitialiser','Reset','Reiniciar')}</button>`;
  }
  h += `</div>`;
  h += `</div></div>`;
  
  // Staff area
  h += `<div class="staff-wrap" id="staffArea">${SEQ_renderStaffSVG()}</div>`;
  
  // Legend
  h += `<div class="legend">`;
  h += `<div class="legend-item"><div class="legend-dot" style="background:#3498db"></div>Soprano</div>`;
  h += `<div class="legend-item"><div class="legend-dot" style="background:#2ecc71"></div>Alto</div>`;
  h += `<div class="legend-item"><div class="legend-dot" style="background:#e67e22"></div>${tx("Ténor","Tenor","Tenor")}</div>`;
  h += `<div class="legend-item"><div class="legend-dot" style="background:#e74c3c"></div>${tx("Basse","Bass","Bajo")}</div>`;
  h += `<div class="legend-item" style="margin-left:8px"><div style="width:14px;height:10px;border-radius:3px;background:#534AB7;opacity:0.12;display:inline-block"></div> ${currentLang==="en"?"Pattern":currentLang==="es"?"Patrón":"Modèle"}</div>`;
  h += `<div class="legend-item" style="margin-left:auto;color:#b0adc4;font-style:italic">${currentLang==="en"?"↕ Drag notes to edit":currentLang==="es"?"↕ Arrastra las notas para editar":"↕ Glisser les notes pour modifier"}</div>`;
  h += `</div>`;
  
  // Play row
  h += `<div class="play-row">`;
  h += `<button class="play-btn" id="playBtn" onclick="SEQ_playSequence()">▶ ${t("btn_listen")}</button>`;
  h += `<div class="pm"><button class="${SEQ_S.pm==='chord'?'on':''}" onclick="SEQ_S.pm='chord';SEQ_render()">${t('btn_chord')}</button><button class="${SEQ_S.pm==='arp'?'on':''}" onclick="SEQ_S.pm='arp';SEQ_render()">${t('btn_arp')}</button></div>`;
  h += `<div style="flex:1"></div>`;
  h += `<button class="exp-btn" onclick="SEQ_sendToAnalyzer()" title="${tx('Envoyer cette séquence à l’Analyseur','Send this sequence to the Analyzer','Enviar esta secuencia al Analizador')}">🔍 ${tx('Analyser','Analyze','Analizar')}</button>`;
  h += `<button class="exp-btn" onclick="SEQ_libSave()">💾 ${tx('Sauver','Save','Guardar')}</button>`;
  h += `<button class="exp-btn" onclick="SEQ_exportPDF()">📄 PDF</button>`;
  h += `<button class="exp-btn" onclick="SEQ_exportMIDI()">🎹 MIDI</button>`;
  h += `</div>`;
  
  // ── Visualization toggles ──
  h += `<div class="card"><div class="card-title">${tx('Visualisation avancée','Advanced Visualization','Visualización avanzada')}</div>`;
  h += `<div class="pills" style="margin-bottom:10px">`;
  h += `<button class="pill${SEQ_S.showVoiceGraph?' on':''}" onclick="SEQ_S.showVoiceGraph=!SEQ_S.showVoiceGraph;SEQ_render(true)">📈 ${tx('Mouvement des voix','Voice motion','Movimiento de voces')}</button>`;
  h += `<button class="pill${SEQ_S.showHeatmap?' on':''}" onclick="SEQ_S.showHeatmap=!SEQ_S.showHeatmap;SEQ_render(true)">🔥 ${tx('Heatmap intervalles','Interval heatmap','Mapa de intervalos')}</button>`;
  h += `</div>`;
  if(SEQ_S.showVoiceGraph){
    h += `<div style="margin-bottom:10px"><div style="font-size:11px;color:#6b7280;margin-bottom:4px">${tx('Trajectoire des 4 voix dans le temps','Trajectory of the 4 voices over time','Trayectoria de las 4 voces en el tiempo')}</div>${SEQ_renderVoiceGraph()}</div>`;
  }
  if(SEQ_S.showHeatmap){
    h += `<div>${SEQ_renderHeatmap()}</div>`;
  }
  h += `</div>`;
  
  // ── Library panel ──
  h += `<div class="card"><div class="card-title">${tx('Bibliothèque personnelle','Personal Library','Biblioteca personal')} <span style="font-size:11px;color:#6b7280;font-weight:400">(${SEQ_S.library.length})</span></div>`;
  h += `<div class="pills" style="margin-bottom:10px">`;
  h += `<button class="pill" onclick="SEQ_libExportJSON()">⬇️ ${tx('Exporter JSON','Export JSON','Exportar JSON')}</button>`;
  h += `<button class="pill" onclick="document.getElementById('libImport').click()">⬆️ ${tx('Importer JSON','Import JSON','Importar JSON')}</button>`;
  h += `<input type="file" id="libImport" accept=".json" style="display:none" onchange="if(this.files[0])SEQ_libImportJSON(this.files[0])">`;
  h += `</div>`;
  if(SEQ_S.library.length === 0){
    h += `<div style="font-size:12px;color:#9ca3af;font-style:italic">${tx('Aucune séquence sauvegardée. Clic sur 💾 Sauver pour ajouter.','No saved sequences. Click 💾 Save to add.','Sin secuencias guardadas. Haz clic en 💾 Guardar.')}</div>`;
  } else {
    h += `<div style="display:flex;flex-direction:column;gap:6px;max-height:280px;overflow-y:auto">`;
    SEQ_S.library.slice().reverse().forEach(entry => {
      h += `<div style="display:flex;align-items:center;gap:8px;padding:6px 8px;background:#f8f9fb;border-radius:6px;font-size:12px">`;
      h += `<div style="flex:1;min-width:0"><div style="font-weight:600;color:#374151;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${entry.name}</div>`;
      h += `<div style="font-size:10px;color:#9ca3af">${entry.key} ${entry.mode} · ${(entry.chords||[]).length} ${tx('accords','chords','acordes')}</div></div>`;
      h += `<button class="pill" style="padding:3px 8px;font-size:11px" onclick="SEQ_libLoad('${entry.id}')">${tx('Charger','Load','Cargar')}</button>`;
      h += `<button class="pill" style="padding:3px 8px;font-size:11px;color:#ef4444" onclick="SEQ_libDelete('${entry.id}')">✕</button>`;
      h += `</div>`;
    });
    h += `</div>`;
  }
  h += `</div>`;
  
  document.getElementById('seq_app').innerHTML = h;
  SEQ_setupDrag();
}

// ── Drag & Drop notes ──
const SEQ_VOICE_RANGE = [[36,60],[48,67],[55,76],[60,84]]; // B T A S MIDI ranges
let SEQ_drag = null;

function SEQ_getSvgPos(e){
  const svgEl = document.querySelector('#staffArea svg');
  if(!svgEl) return null;
  const rect = svgEl.getBoundingClientRect();
  const vb = svgEl.viewBox.baseVal;
  return {
    x: (e.clientX - rect.left) / rect.width * vb.width,
    y: (e.clientY - rect.top) / rect.height * vb.height
  };
}

function SEQ_findHit(sx, sy){
  if(!window.SEQ_L) return null;
  const np = window.SEQ_L.notePositions;
  for(let i = 0; i < np.length; i++){
    if(Math.abs(sx - np[i].x) < 14 && Math.abs(sy - np[i].y) < 10)
      return np[i]; // {x, y, ci, vi}
  }
  return null;
}

function SEQ_yToMidiSnap(y, voiceIdx){
  const L = window.SEQ_L;
  if(!L) return 60;
  const [lo, hi] = SEQ_VOICE_RANGE[voiceIdx];
  // Use bass or treble converter depending on voice
  const conv = voiceIdx < 2 ? L.SEQ_midiToBassY : L.SEQ_midiToTrebleY;
  let best = lo, bd = 999;
  for(let m = lo; m <= hi; m++){
    const d = Math.abs(y - conv(m));
    if(d < bd){ bd = d; best = m; }
  }
  return best;
}

function SEQ_setupDrag(){
  const wrap = document.getElementById('staffArea');
  if(!wrap) return;
  const svgEl = wrap.querySelector('svg');
  if(!svgEl) return;
  
  svgEl.addEventListener('mousedown', e => {
    const p = SEQ_getSvgPos(e);
    if(!p) return;
    const hit = SEQ_findHit(p.x, p.y);
    if(hit){
      SEQ_drag = { ci: hit.ci, vi: hit.vi };
      svgEl.style.cursor = 'ns-resize';
      e.preventDefault();
    }
  });
  
  svgEl.addEventListener('mousemove', e => {
    const p = SEQ_getSvgPos(e);
    if(!p) return;
    if(!SEQ_drag){
      svgEl.style.cursor = SEQ_findHit(p.x, p.y) ? 'grab' : 'default';
      return;
    }
    // Live preview: update the midi and re-SEQ_render SVG only
    const newMidi = SEQ_yToMidiSnap(p.y, SEQ_drag.vi);
    if(SEQ_S.chords[SEQ_drag.ci] && SEQ_S.chords[SEQ_drag.ci].midi[SEQ_drag.vi] !== newMidi){
      SEQ_S.chords[SEQ_drag.ci].midi[SEQ_drag.vi] = newMidi;
      wrap.innerHTML = SEQ_renderStaffSVG();
      // Re-attach events on new SVG
      SEQ_setupDrag();
    }
  });
  
  svgEl.addEventListener('mouseup', () => { SEQ_drag = null; svgEl.style.cursor = 'default'; });
  svgEl.addEventListener('mouseleave', () => { SEQ_drag = null; svgEl.style.cursor = 'default'; });
  
  // Touch support
  svgEl.addEventListener('touchstart', e => {
    const t = e.touches[0];
    const p = SEQ_getSvgPos(t);
    if(!p) return;
    const hit = SEQ_findHit(p.x, p.y);
    if(hit){ SEQ_drag = { ci: hit.ci, vi: hit.vi }; e.preventDefault(); }
  }, {passive:false});
  
  svgEl.addEventListener('touchmove', e => {
    if(!SEQ_drag) return;
    const t = e.touches[0];
    const p = SEQ_getSvgPos(t);
    if(!p) return;
    const newMidi = SEQ_yToMidiSnap(p.y, SEQ_drag.vi);
    if(SEQ_S.chords[SEQ_drag.ci] && SEQ_S.chords[SEQ_drag.ci].midi[SEQ_drag.vi] !== newMidi){
      SEQ_S.chords[SEQ_drag.ci].midi[SEQ_drag.vi] = newMidi;
      wrap.innerHTML = SEQ_renderStaffSVG();
      SEQ_setupDrag();
    }
    e.preventDefault();
  }, {passive:false});
  
  svgEl.addEventListener('touchend', () => { SEQ_drag = null; });
}

SEQ_render();

/* ── Init auto ── */
try{ SEQ_render(); }catch(e){console.error('SEQ:',e)}
