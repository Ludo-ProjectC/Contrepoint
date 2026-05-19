/* ═══════════════════════════════════════════════════════════════════
   VENTS_DATA.js — Données de référence pour le module VENTS
   À intégrer dans analyseur.js (section dédiée VENTS).
   
   Tessitures données en MIDI note number (Do4 = 60).
   - written: tessiture telle qu'écrite sur la partition
   - sounding: tessiture réelle au son
   - transpose: décalage en demi-tons (écrit + transpose = sonore)
   
   Registres : grave (low) / médium (mid) / aigu (high) / suraigu (extreme)
   ═══════════════════════════════════════════════════════════════════ */

/* ─── Instruments à vent (bois) ─── */
const VTS_INSTRUMENTS = {

  /* ═══ FLÛTES ═══ */
  FL: {
    family: 'flutes',
    label: { fr:'Flûte', en:'Flute', es:'Flauta' },
    short: 'Fl.',
    clef: 'treble',
    color: '#4F46E5',          // violet famille flûtes
    transpose: 0,              // non transpositeur
    written:  { lo: 60, hi: 96 },   // C4 → C7
    sounding: { lo: 60, hi: 96 },
    registers: {
      low:    { lo: 60, hi: 67, char: { fr:'Doux, voilé, pâle', en:'Soft, veiled, pale', es:'Suave, velado, pálido' } },
      mid:    { lo: 68, hi: 79, char: { fr:'Souple, expressif, clair', en:'Supple, expressive, clear', es:'Ágil, expresivo, claro' } },
      high:   { lo: 80, hi: 88, char: { fr:'Brillant, perçant', en:'Bright, piercing', es:'Brillante, penetrante' } },
      extreme:{ lo: 89, hi: 96, char: { fr:'Strident, fatigant', en:'Strident, tiring', es:'Estridente, fatigante' } }
    }
  },

  PICC: {
    family: 'flutes',
    label: { fr:'Piccolo', en:'Piccolo', es:'Flautín' },
    short: 'Picc.',
    clef: 'treble',
    color: '#4F46E5',
    transpose: 12,             // sonne 1 octave plus haut
    written:  { lo: 62, hi: 96 },   // D4 → C7
    sounding: { lo: 74, hi: 108 },  // D5 → C8
    registers: {
      low:    { lo: 62, hi: 71, char: { fr:'Faible, peu utilisé', en:'Weak, rarely used', es:'Débil, poco usado' } },
      mid:    { lo: 72, hi: 84, char: { fr:'Clair, vif', en:'Clear, lively', es:'Claro, vivo' } },
      high:   { lo: 85, hi: 93, char: { fr:'Brillant, éclatant', en:'Brilliant, dazzling', es:'Brillante, deslumbrante' } },
      extreme:{ lo: 94, hi: 96, char: { fr:'Strident — éviter en tenue', en:'Strident — avoid on long notes', es:'Estridente — evitar en notas tenidas' } }
    }
  },

  /* ═══ HAUTBOIS ═══ */
  OB: {
    family: 'oboes',
    label: { fr:'Hautbois', en:'Oboe', es:'Oboe' },
    short: 'Hb.',
    clef: 'treble',
    color: '#059669',          // vert famille hautbois
    transpose: 0,
    written:  { lo: 58, hi: 91 },   // Bb3 → G6
    sounding: { lo: 58, hi: 91 },
    registers: {
      low:    { lo: 58, hi: 64, char: { fr:'Rauque, puissant', en:'Raucous, powerful', es:'Áspero, potente' } },
      mid:    { lo: 65, hi: 76, char: { fr:'Chantant, pastoral', en:'Singing, pastoral', es:'Cantabile, pastoral' } },
      high:   { lo: 77, hi: 86, char: { fr:'Tendu, pénétrant', en:'Tense, penetrating', es:'Tenso, penetrante' } },
      extreme:{ lo: 87, hi: 91, char: { fr:'Acide — délicat', en:'Acidic — delicate', es:'Ácido — delicado' } }
    }
  },

  CA: {
    family: 'oboes',
    label: { fr:'Cor anglais', en:'English Horn', es:'Corno inglés' },
    short: 'C.A.',
    clef: 'treble',
    color: '#059669',
    transpose: -7,             // en Fa, sonne une quinte juste plus bas
    written:  { lo: 60, hi: 84 },   // C4 → C6
    sounding: { lo: 53, hi: 77 },   // F3 → F5
    registers: {
      low:    { lo: 60, hi: 67, char: { fr:'Sombre, nostalgique', en:'Dark, nostalgic', es:'Oscuro, nostálgico' } },
      mid:    { lo: 68, hi: 77, char: { fr:'Mélancolique, lyrique', en:'Melancholic, lyrical', es:'Melancólico, lírico' } },
      high:   { lo: 78, hi: 84, char: { fr:'Tendu', en:'Tense', es:'Tenso' } }
    }
  },

  /* ═══ CLARINETTES ═══ */
  CL: {
    family: 'clarinets',
    label: { fr:'Clarinette en Sib', en:'Clarinet in Bb', es:'Clarinete en Sib' },
    short: 'Cl.',
    clef: 'treble',
    color: '#D97706',          // orange famille clarinettes
    transpose: -2,             // en Sib, sonne 1 ton plus bas
    written:  { lo: 50, hi: 91 },   // D3 → G6
    sounding: { lo: 48, hi: 89 },   // C3 → F6
    registers: {
      low:    { lo: 50, hi: 59, char: { fr:'Chalumeau — sombre, riche', en:'Chalumeau — dark, rich', es:'Chalumeau — oscuro, rico' } },
      mid:    { lo: 60, hi: 71, char: { fr:'Clairon — neutre, peu sonore', en:'Throat — neutral, weak', es:'Garganta — neutro, débil' } },
      high:   { lo: 72, hi: 84, char: { fr:'Clair, expressif', en:'Clear, expressive', es:'Claro, expresivo' } },
      extreme:{ lo: 85, hi: 91, char: { fr:'Aigu, brillant', en:'High, brilliant', es:'Agudo, brillante' } }
    }
  },

  CLB: {
    family: 'clarinets',
    label: { fr:'Clarinette basse', en:'Bass Clarinet', es:'Clarinete bajo' },
    short: 'Cl.b.',
    clef: 'treble',            // notation française (sonne 9ce M plus bas) — alternative bass clef
    color: '#D97706',
    transpose: -14,            // en Sib, sonne une 9ce majeure plus bas (notation aiguë)
    written:  { lo: 50, hi: 84 },   // D3 → C6
    sounding: { lo: 36, hi: 70 },   // C2 → Bb4
    registers: {
      low:    { lo: 50, hi: 59, char: { fr:'Profond, mystérieux', en:'Deep, mysterious', es:'Profundo, misterioso' } },
      mid:    { lo: 60, hi: 72, char: { fr:'Doux, sombre', en:'Soft, dark', es:'Suave, oscuro' } },
      high:   { lo: 73, hi: 84, char: { fr:'Plaintif', en:'Plaintive', es:'Plañidero' } }
    }
  },

  /* ═══ BASSONS ═══ */
  BN: {
    family: 'bassoons',
    label: { fr:'Basson', en:'Bassoon', es:'Fagot' },
    short: 'Bn.',
    clef: 'bass',
    color: '#DC2626',          // rouge famille bassons
    transpose: 0,
    written:  { lo: 34, hi: 75 },   // Bb1 → Eb5
    sounding: { lo: 34, hi: 75 },
    registers: {
      low:    { lo: 34, hi: 46, char: { fr:'Grave, grognant, comique', en:'Low, grunting, comic', es:'Grave, gruñón, cómico' } },
      mid:    { lo: 47, hi: 60, char: { fr:'Sombre, noble', en:'Dark, noble', es:'Oscuro, noble' } },
      high:   { lo: 61, hi: 70, char: { fr:'Tendu, plaintif', en:'Tense, plaintive', es:'Tenso, plañidero' } },
      extreme:{ lo: 71, hi: 75, char: { fr:'Étranglé — éviter', en:'Strangled — avoid', es:'Ahogado — evitar' } }
    }
  },

  CBN: {
    family: 'bassoons',
    label: { fr:'Contrebasson', en:'Contrabassoon', es:'Contrafagot' },
    short: 'C.Bn.',
    clef: 'bass',
    color: '#DC2626',
    transpose: -12,            // sonne 1 octave plus bas
    written:  { lo: 34, hi: 63 },   // Bb1 → Eb4
    sounding: { lo: 22, hi: 51 },   // Bb0 → Eb3
    registers: {
      low:    { lo: 34, hi: 46, char: { fr:'Très grave, puissant', en:'Very low, powerful', es:'Muy grave, potente' } },
      mid:    { lo: 47, hi: 55, char: { fr:'Sombre', en:'Dark', es:'Oscuro' } },
      high:   { lo: 56, hi: 63, char: { fr:'Peu utilisé', en:'Rarely used', es:'Poco usado' } }
    }
  }
};

/* ─── Ordre canonique de partition (du plus aigu au plus grave) ─── */
const VTS_SCORE_ORDER = ['PICC','FL','OB','CA','CL','CLB','BN','CBN'];

/* ─── Configuration par défaut d'un orchestre standard ─── */
const VTS_DEFAULT_CONFIG = {
  flutes:    { count: 2, aux: false },   // 2 flûtes, pas de piccolo
  oboes:     { count: 2, aux: false },   // 2 hautbois, pas de cor anglais
  clarinets: { count: 2, aux: false },   // 2 clarinettes, pas de cl. basse
  bassoons:  { count: 2, aux: false }    // 2 bassons, pas de contrebasson
};

/* ─── Règles d'écriture spécifiques aux bois ─────────────────────
   Toutes les règles SATB classiques s'appliquent (parallélismes,
   croisements, espacement, conduite sensible, résolution dissonances,
   accord augmenté). Ci-dessous : règles ADDITIONNELLES propres aux bois.
   ═══════════════════════════════════════════════════════════════ */
const VTS_RULES = [

  /* ─ Tessitures ─ */
  {
    id: 'vts_range_extreme',
    severity: 'warn',
    label: { fr:'Note dans le registre extrême', en:'Note in extreme register', es:'Nota en registro extremo' },
    desc:  { fr:'Note dans la zone "extreme" du registre — fatigante, fragile en tenue.',
             en:'Note in the "extreme" register zone — tiring, fragile on long notes.',
             es:'Nota en la zona "extrema" del registro — fatigante, frágil en notas tenidas.' }
  },
  {
    id: 'vts_range_out',
    severity: 'error',
    label: { fr:'Note hors tessiture', en:'Note out of range', es:'Nota fuera de tesitura' },
    desc:  { fr:'Note injouable sur cet instrument.',
             en:'Note unplayable on this instrument.',
             es:'Nota imposible de tocar en este instrumento.' }
  },

  /* ─ Registre faible des clarinettes (gorge) ─ */
  {
    id: 'vts_cl_throat',
    severity: 'warn',
    label: { fr:'Clarinette : registre de gorge faible', en:'Clarinet: weak throat register', es:'Clarinete: registro de garganta débil' },
    desc:  { fr:'La zone B♭3–B♭4 (notes écrites) est faible et neutre. Éviter pour mélodies importantes en solo.',
             en:'The B♭3–B♭4 range (written) is weak and dull. Avoid for important solo melodies.',
             es:'La zona Si♭3–Si♭4 (notas escritas) es débil y neutra. Evitar para melodías solistas importantes.' }
  },

  /* ─ Doublures dangereuses ─ */
  {
    id: 'vts_doubling_unison',
    severity: 'info',
    label: { fr:'Doublure à l\'unisson Fl+Hb', en:'Fl+Ob unison doubling', es:'Duplicación al unísono Fl+Ob' },
    desc:  { fr:'Le timbre du hautbois domine la flûte à l\'unisson — la flûte perd son identité.',
             en:'The oboe timbre dominates the flute at the unison — the flute loses identity.',
             es:'El timbre del oboe domina la flauta al unísono — la flauta pierde identidad.' }
  },
  {
    id: 'vts_doubling_octave_good',
    severity: 'info',
    label: { fr:'Doublure à l\'octave (mélange recommandé)', en:'Octave doubling (recommended blend)', es:'Duplicación a la octava (mezcla recomendada)' },
    desc:  { fr:'Fl+Hb ou Cl+Bn à l\'octave : mélange riche et équilibré.',
             en:'Fl+Ob or Cl+Bn at the octave: rich and balanced blend.',
             es:'Fl+Ob o Cl+Bn a la octava: mezcla rica y equilibrada.' }
  },

  /* ─ Trou d'octave ─ */
  {
    id: 'vts_octave_gap',
    severity: 'warn',
    label: { fr:'Trou d\'octave entre deux pupitres', en:'Octave gap between desks', es:'Hueco de octava entre atriles' },
    desc:  { fr:'Plus d\'une octave entre deux voix adjacentes — l\'orchestration sonne creuse.',
             en:'More than an octave between adjacent voices — orchestration sounds hollow.',
             es:'Más de una octava entre voces adyacentes — la orquestación suena hueca.' }
  },

  /* ─ Tenues aiguës sur double anche ─ */
  {
    id: 'vts_held_high_reed',
    severity: 'warn',
    label: { fr:'Note aiguë tenue (htb/bn)', en:'Long high note (ob/bn)', es:'Nota aguda tenida (ob/fag)' },
    desc:  { fr:'Hautbois et bassons : éviter les tenues longues dans le registre aigu (fatigue de l\'anche).',
             en:'Oboes and bassoons: avoid long held notes in the high register (reed fatigue).',
             es:'Oboes y fagotes: evitar notas tenidas largas en el registro agudo (fatiga de caña).' }
  },

  /* ─ Sauts mélodiques ─ */
  {
    id: 'vts_big_leap',
    severity: 'info',
    label: { fr:'Grand saut mélodique (>1 octave)', en:'Large melodic leap (>1 octave)', es:'Salto melódico amplio (>1 octava)' },
    desc:  { fr:'Les bois permettent de plus grands sauts que les voix humaines, mais au-delà d\'une 10e diatonique : prudence.',
             en:'Woodwinds allow larger leaps than human voices, but beyond a 10th: caution.',
             es:'Las maderas permiten saltos mayores que las voces humanas, pero más allá de una 10ª: precaución.' }
  },

  /* ─ Spécifique piccolo ─ */
  {
    id: 'vts_picc_low',
    severity: 'warn',
    label: { fr:'Piccolo dans le grave', en:'Piccolo in low register', es:'Flautín en grave' },
    desc:  { fr:'Le piccolo dans son grave (D4–B4) est faible et sans personnalité — éviter.',
             en:'Piccolo in its low register (D4–B4) is weak and characterless — avoid.',
             es:'El flautín en su grave (Re4–Si4) es débil y sin carácter — evitar.' }
  }
];

/* ─── Mélanges de timbres recommandés (informationnels) ───────── */
const VTS_BLENDS = [
  { ids:['FL','CL'],         desc:{ fr:'Fl+Cl : pur, neutre, transparent',                       en:'Fl+Cl: pure, neutral, transparent',                  es:'Fl+Cl: puro, neutro, transparente' } },
  { ids:['FL','OB'],         desc:{ fr:'Fl+Hb : mélange riche (Hb prédominant à l\'unisson)',    en:'Fl+Ob: rich blend (Ob dominant at unison)',          es:'Fl+Ob: mezcla rica (Ob dominante al unísono)' } },
  { ids:['OB','CL'],         desc:{ fr:'Hb+Cl : contraste, chantant',                            en:'Ob+Cl: contrast, singing',                           es:'Ob+Cl: contraste, cantabile' } },
  { ids:['CL','BN'],         desc:{ fr:'Cl+Bn : mélange noble, profond (équivalent vents du Vl/Vc)',
                                                                                                  en:'Cl+Bn: noble, deep blend (winds equivalent of Vn/Vc)',
                                                                                                  es:'Cl+Bn: mezcla noble, profunda (equivalente Vn/Vc de vientos)' } },
  { ids:['OB','BN'],         desc:{ fr:'Hb+Bn : double anche — homogène et corsé',               en:'Ob+Bn: double-reed — homogeneous, full-bodied',       es:'Ob+Fag: doble caña — homogéneo y consistente' } },
  { ids:['PICC','FL'],       desc:{ fr:'Picc+Fl à l\'octave : éclat aigu classique',             en:'Picc+Fl at octave: classic high brilliance',          es:'Picc+Fl a la octava: brillo agudo clásico' } },
  { ids:['CA','BN'],         desc:{ fr:'C.A.+Bn : nostalgique, automnal',                        en:'E.H.+Bn: nostalgic, autumnal',                        es:'C.I.+Fag: nostálgico, otoñal' } }
];

/* ─── Helpers à exporter ─────────────────────────────────────── */
// VTS_writtenToSounding(midi, instId)  → midi sonore
// VTS_soundingToWritten(midi, instId)  → midi écrit
// VTS_inRange(midi, instId, 'written'|'sounding') → boolean
// VTS_getRegister(midi, instId)        → 'low'|'mid'|'high'|'extreme'|null
// (à implémenter dans analyseur.js)

window.VTS_INSTRUMENTS    = VTS_INSTRUMENTS;
window.VTS_SCORE_ORDER    = VTS_SCORE_ORDER;
window.VTS_DEFAULT_CONFIG = VTS_DEFAULT_CONFIG;
window.VTS_RULES          = VTS_RULES;
window.VTS_BLENDS         = VTS_BLENDS;
