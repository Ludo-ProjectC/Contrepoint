/* ═══════════════════════════════════════════════════════════════════
   analyseur.js — Module analyseur
   Chargé dynamiquement par main.js lors du premier accès à l'onglet.
   Toutes les fonctions/variables avec préfixe majuscule (T1, MOD, etc.)
   sont exposées sur window pour rétro-compat avec onclick="..."
   ═══════════════════════════════════════════════════════════════════ */
/* ═══ TAB 10: ANALYSEUR HARMONIQUE ═══ */

/* ═══════════════════════════════════════════════════════════════════
   MULTI-SECTION MODE SWITCHER (Chat 1 — architecture)
   Modes : SATB (actif) | VENTS | CUIVRES | CORDES | TUTTI (placeholders)
   Les sections orchestrales seront implémentées dans les chats suivants.
   Chaque mode héritera des règles de base SATB + règles spécifiques (Berlioz).
   ═══════════════════════════════════════════════════════════════════ */
window.AH_currentMode = 'SATB';

function AH_setMode(mode){
  if(!['SATB','VENTS','CUIVRES','CORDES','TUTTI'].includes(mode)) return;
  window.AH_currentMode = mode;

  // Update button states
  document.querySelectorAll('.ah-mode-btn').forEach(b=>{
    b.classList.toggle('primary', b.dataset.mode===mode);
  });

  // Toggle wrappers
  const wrap    = document.getElementById('ah_satbWrapper');
  const vents   = document.getElementById('ah_ventsWrapper');
  const cuivres = document.getElementById('ah_cuivresWrapper');
  const cordes  = document.getElementById('ah_cordesWrapper');
  const tutti   = document.getElementById('ah_tuttiWrapper');
  const ph      = document.getElementById('ah_placeholder');
  if(!wrap || !ph) return;

  const hideAll = ()=>{
    wrap.style.display    = 'none';
    if(vents)   vents.style.display   = 'none';
    if(cuivres) cuivres.style.display = 'none';
    if(cordes)  cordes.style.display  = 'none';
    if(tutti)   tutti.style.display   = 'none';
    ph.style.display      = 'none';
  };

  if(mode === 'SATB'){
    hideAll();
    wrap.style.display    = '';
  } else if(mode === 'VENTS'){
    hideAll();
    if(vents)   vents.style.display   = 'block';
    if(typeof VTS_init === 'function') VTS_init();
  } else if(mode === 'CUIVRES'){
    hideAll();
    if(cuivres) cuivres.style.display = 'block';
    if(typeof BRS_init === 'function') BRS_init();
  } else if(mode === 'CORDES'){
    hideAll();
    if(cordes)  cordes.style.display  = 'block';
    if(typeof STR_init === 'function') STR_init();
  } else if(mode === 'TUTTI'){
    hideAll();
    if(tutti){
      tutti.style.display = 'block';
      if(typeof TUT_init === 'function') TUT_init();
    } else {
      ph.style.display = 'block';
      AH_fillPlaceholder(mode);
    }
  } else {
    hideAll();
    ph.style.display      = 'block';
    AH_fillPlaceholder(mode);
  }
}

function AH_fillPlaceholder(mode){
  const L = (typeof currentLang!=='undefined') ? currentLang : 'fr';
  const data = {
    CUIVRES: {
      icon:'🎺',
      title:{fr:'Mode Cuivres — En développement',en:'Brass Mode — In Development',es:'Modo Metales — En desarrollo'},
      desc:{
        fr:"Analyse pour cuivres : cors, trompettes, trombones, tuba. Notes naturelles (cuivres anciens), équilibre des pavillons, écriture en harmonie naturelle, sons bouchés et règles spécifiques de Berlioz.",
        en:"Analysis for brass: horns, trumpets, trombones, tuba. Natural notes (valveless brass), bell balance, harmonic-series writing, stopped notes and Berlioz-specific rules.",
        es:"Análisis para metales: trompas, trompetas, trombones, tuba. Notas naturales, equilibrio, escritura sobre serie armónica, sonidos tapados y reglas específicas de Berlioz."
      },
      rm:[
        {fr:'Pupitres : 4 Cors, 3 Trp., 3 Trb., 1 Tuba', en:'Desks: 4 Hns., 3 Tpt., 3 Tbn., 1 Tuba', es:'Atriles: 4 Trp., 3 Tpt., 3 Tbn., 1 Tuba'},
        {fr:'Écriture sur la série harmonique (cors et trompettes naturels)', en:'Harmonic-series writing (natural horns and trumpets)', es:'Escritura sobre la serie armónica (trompas y trompetas naturales)'},
        {fr:'Sons bouchés, sourdines, transpositions par tons', en:'Stopped notes, mutes, key-based transpositions', es:'Sonidos tapados, sordinas, transposiciones por tonos'},
        {fr:'Détection : intervalles impossibles, équilibre des forces', en:'Detection: impossible intervals, force balance', es:'Detección: intervalos imposibles, equilibrio de fuerzas'}
      ]
    },
    CORDES: {
      icon:'🎻',
      title:{fr:'Mode Cordes — En développement',en:'Strings Mode — In Development',es:'Modo Cuerdas — En desarrollo'},
      desc:{
        fr:"Analyse pour cordes : Vl.1, Vl.2, Altos, Vlc, Cb. Divisi, double-cordes, harmoniques, pizzicato, sul ponticello, et règles d'écriture orchestrale du quintette à cordes selon Berlioz.",
        en:"Analysis for strings: Vn.1, Vn.2, Violas, Vc., Cb. Divisi, double-stops, harmonics, pizzicato, sul ponticello, and orchestral string-quintet writing per Berlioz.",
        es:"Análisis para cuerdas: Vl.1, Vl.2, Violas, Vlc, Cb. Divisi, dobles cuerdas, armónicos, pizzicato, sul ponticello, y reglas del quinteto orquestal según Berlioz."
      },
      rm:[
        {fr:'5 pupitres + divisi (jusqu\'à 4 voix par pupitre)', en:'5 sections + divisi (up to 4 voices per section)', es:'5 atriles + divisi (hasta 4 voces por atril)'},
        {fr:'Tessitures, cordes à vide, double-cordes praticables', en:'Ranges, open strings, playable double-stops', es:'Tesituras, cuerdas al aire, dobles cuerdas practicables'},
        {fr:'Harmoniques naturels et artificiels, modes de jeu', en:'Natural and artificial harmonics, playing modes', es:'Armónicos naturales y artificiales, modos de juego'},
        {fr:'Détection : intervalles impraticables, divisi incohérents', en:'Detection: unplayable intervals, inconsistent divisi', es:'Detección: intervalos impracticables, divisi incoherentes'}
      ]
    },
    TUTTI: {
      icon:'🎭',
      title:{fr:'Mode Tutti orchestral — En développement',en:'Orchestral Tutti Mode — In Development',es:'Modo Tutti orquestal — En desarrollo'},
      desc:{
        fr:"Analyse globale : interactions entre toutes les sections (vents + cuivres + cordes). Équilibre orchestral, doublures inter-sections, masses sonores et règles globales de Berlioz pour l'orchestre symphonique.",
        en:"Global analysis: interactions across all sections (winds + brass + strings). Orchestral balance, cross-section doublings, sonic masses and Berlioz's overarching rules for the symphonic orchestra.",
        es:"Análisis global: interacciones entre todas las secciones (vientos + metales + cuerdas). Equilibrio orquestal, duplicaciones entre secciones, masas sonoras y reglas globales de Berlioz."
      },
      rm:[
        {fr:'Combinaison des 3 sections sur une même partition', en:'All 3 sections combined on a single score', es:'Las 3 secciones combinadas en una sola partitura'},
        {fr:'Équilibre des plans sonores (1er, 2e, 3e plan)', en:'Sonic plane balance (foreground, middle, background)', es:'Equilibrio de planos sonoros (1°, 2°, 3°)'},
        {fr:'Doublures inter-sections (cor + basson, etc.)', en:'Cross-section doublings (horn + bassoon, etc.)', es:'Duplicaciones inter-secciones (trompa + fagot, etc.)'},
        {fr:'Export PDF conducteur complet + parties séparées', en:'Full conductor PDF + separate parts export', es:'Exportación PDF conductor completo + partes separadas'}
      ]
    }
  };

  const d = data[mode]; if(!d) return;
  const pick = (o)=> o[L] || o.fr;
  const el = (id)=> document.getElementById(id);

  if(el('ah_phIcon'))  el('ah_phIcon').textContent  = d.icon;
  if(el('ah_phTitle')) el('ah_phTitle').textContent = pick(d.title);
  if(el('ah_phDesc'))  el('ah_phDesc').textContent  = pick(d.desc);
  for(let i=0;i<4;i++){
    const li = el('ah_phRm'+(i+1));
    if(li && d.rm[i]) li.textContent = pick(d.rm[i]);
  }
}

// Re-fill placeholder texts on language change
window.addEventListener('contrepoint:langchange', ()=>{
  if(window.AH_currentMode && window.AH_currentMode !== 'SATB'){
    AH_fillPlaceholder(window.AH_currentMode);
  }
});

window.AH_setMode = AH_setMode;
window.AH_fillPlaceholder = AH_fillPlaceholder;

/* ─── Helper global : génère les options de note pour datalist ─── */
function AH_buildNoteOptions(loMidi, hiMidi, useFlats){
  const NS = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const NF = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
  const arr = useFlats ? NF : NS;
  const opts = [];
  for(let m=loMidi; m<=hiMidi; m++){
    const pc = ((m%12)+12)%12;
    const oct = Math.floor(m/12)-1;
    opts.push(arr[pc]+oct);
  }
  return opts;
}

/* ─── Helper drag & drop générique pour canvas VTS/BRS/STR ─── */
function AH_initCanvasDrag(opts){
  // opts: { canvasId, getNoteAt, snapMidi, setMidi, onDragEnd, midiToName, useFlats }
  const canvas = document.getElementById(opts.canvasId); if(!canvas) return;
  let drag = null;

  function getPos(e){
    const r = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio||1;
    const src = e.touches ? e.touches[0] : e;
    return {x:(src.clientX-r.left), y:(src.clientY-r.top)};
  }

  function onDown(e){
    const p = getPos(e);
    const hit = opts.getNoteAt(p.x, p.y);
    if(!hit) return;
    drag = { ...hit, startY: p.y, startMidi: hit.midi, currentMidi: hit.midi };
    canvas.style.cursor = 'ns-resize';
    e.preventDefault();
  }
  function onMove(e){
    if(!drag){
      const p = getPos(e);
      canvas.style.cursor = opts.getNoteAt(p.x, p.y) ? 'ns-resize' : 'default';
      return;
    }
    const p = getPos(e);
    const newMidi = opts.snapMidi(drag, p.y);
    if(newMidi !== drag.currentMidi){
      drag.currentMidi = newMidi;
      opts.setMidi(drag, newMidi, /*preview=*/true);
    }
    if(e.cancelable) e.preventDefault();
  }
  function onUp(){
    if(!drag){ return; }
    opts.setMidi(drag, drag.currentMidi, /*preview=*/false);
    opts.onDragEnd && opts.onDragEnd(drag);
    drag = null;
    canvas.style.cursor = 'default';
  }

  canvas.addEventListener('mousedown', onDown);
  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('mouseup', onUp);
  canvas.addEventListener('mouseleave', ()=>{ if(drag){ onUp(); } });
  canvas.addEventListener('touchstart', onDown, {passive:false});
  canvas.addEventListener('touchmove', onMove, {passive:false});
  canvas.addEventListener('touchend', onUp);
}

/* ═══════════════════════════════════════════════════════════════════
   ███  VENTS MODULE  ███████████████████████████████████████████████
   Analyseur pour bois (flûtes, hautbois, clarinettes, bassons).
   N'écrit JAMAIS dans l'état SATB. Toutes fonctions préfixées VTS_*.
   ═══════════════════════════════════════════════════════════════════ */

/* ─── Données instruments (depuis vents_data.js) ─── */
const VTS_INSTRUMENTS = {
  /* ── FLÛTES ─────────────────────────────────────────── */
  FL: {
    family:'flutes', label:{fr:'Flûte en Do',en:'Flute in C',es:'Flauta en Do'}, short:'Fl.',
    clef:'treble', color:'#4F46E5', transpose:0,
    written:{lo:60,hi:96}, sounding:{lo:60,hi:96},
    registers:{
      low:{lo:60,hi:67,char:{fr:'Doux, voilé, pâle',en:'Soft, veiled, pale',es:'Suave, velado, pálido'}},
      mid:{lo:68,hi:79,char:{fr:'Souple, expressif, clair',en:'Supple, expressive, clear',es:'Ágil, expresivo, claro'}},
      high:{lo:80,hi:88,char:{fr:'Brillant, perçant',en:'Bright, piercing',es:'Brillante, penetrante'}},
      extreme:{lo:89,hi:96,char:{fr:'Strident, fatigant',en:'Strident, tiring',es:'Estridente, fatigante'}}
    }
  },
  FL_ALTO: {
    family:'flutes', label:{fr:'Flûte alto en Sol',en:'Alto Flute in G',es:'Flauta alto en Sol'}, short:'Fl.a.',
    clef:'treble', color:'#4F46E5', transpose:-5,
    written:{lo:60,hi:91}, sounding:{lo:55,hi:86},
    registers:{
      low:{lo:60,hi:67,char:{fr:'Sombre, chaleureux',en:'Dark, warm',es:'Oscuro, cálido'}},
      mid:{lo:68,hi:79,char:{fr:'Expressif, rond',en:'Expressive, round',es:'Expresivo, redondo'}},
      high:{lo:80,hi:88,char:{fr:'Clair, voilé',en:'Clear, veiled',es:'Claro, velado'}},
      extreme:{lo:89,hi:91,char:{fr:'Difficile — éviter',en:'Difficult — avoid',es:'Difícil — evitar'}}
    }
  },
  PICC: {
    family:'flutes', label:{fr:'Piccolo en Do',en:'Piccolo in C',es:'Flautín en Do'}, short:'Picc.',
    clef:'treble', color:'#4F46E5', transpose:12,
    written:{lo:62,hi:96}, sounding:{lo:74,hi:108},
    registers:{
      low:{lo:62,hi:71,char:{fr:'Faible, peu utilisé',en:'Weak, rarely used',es:'Débil, poco usado'}},
      mid:{lo:72,hi:84,char:{fr:'Clair, vif',en:'Clear, lively',es:'Claro, vivo'}},
      high:{lo:85,hi:93,char:{fr:'Brillant, éclatant',en:'Brilliant, dazzling',es:'Brillante, deslumbrante'}},
      extreme:{lo:94,hi:96,char:{fr:'Strident — éviter en tenue',en:'Strident — avoid on long notes',es:'Estridente — evitar en notas tenidas'}}
    }
  },
  PICC_DES: {
    family:'flutes', label:{fr:'Piccolo en Réb',en:'Piccolo in Db',es:'Flautín en Reb'}, short:'Picc.Db',
    clef:'treble', color:'#4F46E5', transpose:13,
    written:{lo:62,hi:96}, sounding:{lo:75,hi:109},
    registers:{
      low:{lo:62,hi:71,char:{fr:'Faible, rarement utilisé',en:'Weak, rarely used',es:'Débil, raramente usado'}},
      mid:{lo:72,hi:84,char:{fr:'Clair, brillant',en:'Clear, brilliant',es:'Claro, brillante'}},
      high:{lo:85,hi:96,char:{fr:'Strident, éclatant',en:'Strident, dazzling',es:'Estridente, deslumbrante'}}
    }
  },
  /* ── HAUTBOIS ────────────────────────────────────────── */
  OB: {
    family:'oboes', label:{fr:'Hautbois',en:'Oboe',es:'Oboe'}, short:'Hb.',
    clef:'treble', color:'#059669', transpose:0,
    written:{lo:58,hi:91}, sounding:{lo:58,hi:91},
    registers:{
      low:{lo:58,hi:64,char:{fr:'Rauque, puissant',en:'Raucous, powerful',es:'Áspero, potente'}},
      mid:{lo:65,hi:76,char:{fr:'Chantant, pastoral',en:'Singing, pastoral',es:'Cantabile, pastoral'}},
      high:{lo:77,hi:86,char:{fr:'Tendu, pénétrant',en:'Tense, penetrating',es:'Tenso, penetrante'}},
      extreme:{lo:87,hi:91,char:{fr:'Acide — délicat',en:'Acidic — delicate',es:'Ácido — delicado'}}
    }
  },
  OB_AMOUR: {
    family:'oboes', label:{fr:"Hautbois d'amour en La",en:'Oboe d\'amore in A',es:'Oboe de amor en La'}, short:'Hb.am.',
    clef:'treble', color:'#059669', transpose:-3,
    written:{lo:58,hi:88}, sounding:{lo:55,hi:85},
    registers:{
      low:{lo:58,hi:64,char:{fr:'Doux, velouté',en:'Soft, velvety',es:'Suave, aterciopelado'}},
      mid:{lo:65,hi:76,char:{fr:'Chantant, tendre',en:'Singing, tender',es:'Cantabile, tierno'}},
      high:{lo:77,hi:88,char:{fr:'Délicat, expressif',en:'Delicate, expressive',es:'Delicado, expresivo'}}
    }
  },
  CA: {
    family:'oboes', label:{fr:'Cor anglais en Fa',en:'English Horn in F',es:'Corno inglés en Fa'}, short:'C.A.',
    clef:'treble', color:'#059669', transpose:-7,
    written:{lo:60,hi:84}, sounding:{lo:53,hi:77},
    registers:{
      low:{lo:60,hi:67,char:{fr:'Sombre, nostalgique',en:'Dark, nostalgic',es:'Oscuro, nostálgico'}},
      mid:{lo:68,hi:77,char:{fr:'Mélancolique, lyrique',en:'Melancholic, lyrical',es:'Melancólico, lírico'}},
      high:{lo:78,hi:84,char:{fr:'Tendu',en:'Tense',es:'Tenso'}}
    }
  },
  /* ── CLARINETTES ─────────────────────────────────────── */
  CL: {
    family:'clarinets', label:{fr:'Clarinette en Sib',en:'Clarinet in Bb',es:'Clarinete en Sib'}, short:'Cl.',
    clef:'treble', color:'#D97706', transpose:-2,
    written:{lo:50,hi:91}, sounding:{lo:48,hi:89},
    registers:{
      low:{lo:50,hi:59,char:{fr:'Chalumeau — sombre, riche',en:'Chalumeau — dark, rich',es:'Chalumeau — oscuro, rico'}},
      mid:{lo:60,hi:71,char:{fr:'Clairon — neutre, peu sonore',en:'Throat — neutral, weak',es:'Garganta — neutro, débil'}},
      high:{lo:72,hi:84,char:{fr:'Clair, expressif',en:'Clear, expressive',es:'Claro, expresivo'}},
      extreme:{lo:85,hi:91,char:{fr:'Aigu, brillant',en:'High, brilliant',es:'Agudo, brillante'}}
    }
  },
  CL_A: {
    family:'clarinets', label:{fr:'Clarinette en La',en:'Clarinet in A',es:'Clarinete en La'}, short:'Cl.A',
    clef:'treble', color:'#D97706', transpose:-3,
    written:{lo:50,hi:91}, sounding:{lo:47,hi:88},
    registers:{
      low:{lo:50,hi:59,char:{fr:'Chalumeau — sombre, chaleureux',en:'Chalumeau — dark, warm',es:'Chalumeau — oscuro, cálido'}},
      mid:{lo:60,hi:71,char:{fr:'Clairon — neutre',en:'Throat — neutral',es:'Garganta — neutro'}},
      high:{lo:72,hi:84,char:{fr:'Clair, expressif',en:'Clear, expressive',es:'Claro, expresivo'}},
      extreme:{lo:85,hi:91,char:{fr:'Aigu, brillant',en:'High, brilliant',es:'Agudo, brillante'}}
    }
  },
  CL_MIB: {
    family:'clarinets', label:{fr:'Petite clarinette en Mib',en:'Clarinet in Eb',es:'Clarinete en Mib'}, short:'Cl.Eb',
    clef:'treble', color:'#D97706', transpose:3,
    written:{lo:50,hi:91}, sounding:{lo:53,hi:94},
    registers:{
      low:{lo:50,hi:59,char:{fr:'Maigre, peu utilisé',en:'Thin, rarely used',es:'Delgado, poco usado'}},
      mid:{lo:60,hi:71,char:{fr:'Clair, piquant',en:'Clear, piquant',es:'Claro, picante'}},
      high:{lo:72,hi:84,char:{fr:'Brillant, mordant',en:'Brilliant, biting',es:'Brillante, mordaz'}},
      extreme:{lo:85,hi:91,char:{fr:'Strident — éviter',en:'Strident — avoid',es:'Estridente — evitar'}}
    }
  },
  CLB: {
    family:'clarinets', label:{fr:'Clarinette basse en Sib',en:'Bass Clarinet in Bb',es:'Clarinete bajo en Sib'}, short:'Cl.b.',
    clef:'treble', color:'#D97706', transpose:-14,
    written:{lo:50,hi:84}, sounding:{lo:36,hi:70},
    registers:{
      low:{lo:50,hi:59,char:{fr:'Profond, mystérieux',en:'Deep, mysterious',es:'Profundo, misterioso'}},
      mid:{lo:60,hi:72,char:{fr:'Doux, sombre',en:'Soft, dark',es:'Suave, oscuro'}},
      high:{lo:73,hi:84,char:{fr:'Plaintif',en:'Plaintive',es:'Plañidero'}}
    }
  },
  /* ── BASSONS ─────────────────────────────────────────── */
  BN: {
    family:'bassoons', label:{fr:'Basson',en:'Bassoon',es:'Fagot'}, short:'Bn.',
    clef:'bass', color:'#DC2626', transpose:0,
    written:{lo:34,hi:75}, sounding:{lo:34,hi:75},
    registers:{
      low:{lo:34,hi:46,char:{fr:'Grave, grognant, comique',en:'Low, grunting, comic',es:'Grave, gruñón, cómico'}},
      mid:{lo:47,hi:60,char:{fr:'Sombre, noble',en:'Dark, noble',es:'Oscuro, noble'}},
      high:{lo:61,hi:70,char:{fr:'Tendu, plaintif',en:'Tense, plaintive',es:'Tenso, plañidero'}},
      extreme:{lo:71,hi:75,char:{fr:'Étranglé — éviter',en:'Strangled — avoid',es:'Ahogado — evitar'}}
    }
  },
  CBN: {
    family:'bassoons', label:{fr:'Contrebasson',en:'Contrabassoon',es:'Contrafagot'}, short:'C.Bn.',
    clef:'bass', color:'#DC2626', transpose:-12,
    written:{lo:34,hi:63}, sounding:{lo:22,hi:51},
    registers:{
      low:{lo:34,hi:46,char:{fr:'Très grave, puissant',en:'Very low, powerful',es:'Muy grave, potente'}},
      mid:{lo:47,hi:55,char:{fr:'Sombre',en:'Dark',es:'Oscuro'}},
      high:{lo:56,hi:63,char:{fr:'Peu utilisé',en:'Rarely used',es:'Poco usado'}}
    }
  }
};

/* ─── Familles VTS avec types sélectionnables ─── */
const VTS_FAMILIES = [
  {
    key:'flutes', color:'#4F46E5', maxCount:3,
    label:{fr:'🎼 Flûtes',en:'🎼 Flutes',es:'🎼 Flautas'},
    types:[
      {instId:'FL',       label:{fr:'Flûte en Do (standard)',en:'Flute in C (standard)',es:'Flauta en Do (estándar)'}},
      {instId:'FL_ALTO',  label:{fr:'Flûte alto en Sol (–5)',en:'Alto Flute in G (–5)',es:'Flauta alto en Sol (–5)'}},
      {instId:'PICC',     label:{fr:'Piccolo en Do (+12)',en:'Piccolo in C (+12)',es:'Flautín en Do (+12)'}},
      {instId:'PICC_DES', label:{fr:'Piccolo en Réb (+13)',en:'Piccolo in Db (+13)',es:'Flautín en Reb (+13)'}}
    ],
    hasAux:true,
    auxTypes:[
      {instId:'PICC',     label:{fr:'3e → Piccolo en Do',en:'3rd → Piccolo in C',es:'3° → Flautín en Do'}},
      {instId:'PICC_DES', label:{fr:'3e → Piccolo en Réb',en:'3rd → Piccolo in Db',es:'3° → Flautín en Reb'}},
      {instId:'FL_ALTO',  label:{fr:'3e → Flûte alto',en:'3rd → Alto Flute',es:'3° → Flauta alto'}}
    ]
  },
  {
    key:'oboes', color:'#059669', maxCount:3,
    label:{fr:'🎼 Hautbois',en:'🎼 Oboes',es:'🎼 Oboes'},
    types:[
      {instId:'OB',       label:{fr:'Hautbois (standard)',en:'Oboe (standard)',es:'Oboe (estándar)'}},
      {instId:'OB_AMOUR', label:{fr:"Hautbois d'amour en La (–3)",en:"Oboe d'amore in A (–3)",es:'Oboe de amor en La (–3)'}},
      {instId:'CA',       label:{fr:'Cor anglais en Fa (–7)',en:'English Horn in F (–7)',es:'Corno inglés en Fa (–7)'}}
    ],
    hasAux:true,
    auxTypes:[
      {instId:'CA',       label:{fr:'3e → Cor anglais',en:'3rd → English Horn',es:'3° → Corno inglés'}},
      {instId:'OB_AMOUR', label:{fr:"3e → Hautbois d'amour",en:"3rd → Oboe d'amore",es:'3° → Oboe de amor'}}
    ]
  },
  {
    key:'clarinets', color:'#D97706', maxCount:3,
    label:{fr:'🎼 Clarinettes',en:'🎼 Clarinets',es:'🎼 Clarinetes'},
    types:[
      {instId:'CL',     label:{fr:'Clarinette en Sib (–2, standard)',en:'Clarinet in Bb (–2, standard)',es:'Clarinete en Sib (–2, estándar)'}},
      {instId:'CL_A',   label:{fr:'Clarinette en La (–3)',en:'Clarinet in A (–3)',es:'Clarinete en La (–3)'}},
      {instId:'CL_MIB', label:{fr:'Petite clarinette en Mib (+3)',en:'Clarinet in Eb (+3)',es:'Clarinete en Mib (+3)'}},
      {instId:'CLB',    label:{fr:'Clarinette basse (–14)',en:'Bass Clarinet (–14)',es:'Clarinete bajo (–14)'}}
    ],
    hasAux:true,
    auxTypes:[
      {instId:'CLB',    label:{fr:'3e → Cl. basse',en:'3rd → Bass Cl.',es:'3° → Cl. bajo'}},
      {instId:'CL_MIB', label:{fr:'3e → Petite Cl. Mib',en:'3rd → Cl. in Eb',es:'3° → Cl. en Mib'}},
      {instId:'CL_A',   label:{fr:'3e → Cl. en La',en:'3rd → Cl. in A',es:'3° → Cl. en La'}}
    ]
  },
  {
    key:'bassoons', color:'#DC2626', maxCount:3,
    label:{fr:'🎼 Bassons',en:'🎼 Bassoons',es:'🎼 Fagotes'},
    types:[
      {instId:'BN',  label:{fr:'Basson (standard)',en:'Bassoon (standard)',es:'Fagot (estándar)'}},
      {instId:'CBN', label:{fr:'Contrebasson (–12)',en:'Contrabassoon (–12)',es:'Contrafagot (–12)'}}
    ],
    hasAux:true,
    auxTypes:[
      {instId:'CBN', label:{fr:'3e → Contrebasson',en:'3rd → Contrabassoon',es:'3° → Contrafagot'}}
    ]
  }
];

const VTS_SCORE_ORDER = ['PICC_DES','PICC','FL','FL_ALTO','OB','OB_AMOUR','CA','CL_MIB','CL','CL_A','CLB','BN','CBN'];

const VTS_RULES_META = {
  vts_range_extreme:{severity:'warn',label:{fr:'Note dans le registre extrême',en:'Note in extreme register',es:'Nota en registro extremo'}},
  vts_range_out:{severity:'error',label:{fr:'Note hors tessiture',en:'Note out of range',es:'Nota fuera de tesitura'}},
  vts_cl_throat:{severity:'warn',label:{fr:'Clarinette : registre de gorge faible',en:'Clarinet: weak throat register',es:'Clarinete: registro de garganta débil'}},
  vts_doubling_unison:{severity:'info',label:{fr:"Doublure à l'unisson Fl+Hb",en:'Fl+Ob unison doubling',es:'Duplicación al unísono Fl+Ob'}},
  vts_octave_gap:{severity:'warn',label:{fr:"Trou d'octave entre deux pupitres",en:'Octave gap between desks',es:'Hueco de octava entre atriles'}},
  vts_held_high_reed:{severity:'warn',label:{fr:'Note aiguë (htb/bn)',en:'High note (ob/bn)',es:'Nota aguda (ob/fag)'}},
  vts_big_leap:{severity:'info',label:{fr:'Grand saut mélodique (>1 octave)',en:'Large melodic leap (>1 octave)',es:'Salto melódico amplio (>1 octava)'}},
  vts_picc_low:{severity:'warn',label:{fr:'Piccolo dans le grave',en:'Piccolo in low register',es:'Flautín en grave'}}
};

/* ─── Helpers de conversion note ─── */
function VTS_writtenToSounding(midi, instId){
  const inst = VTS_INSTRUMENTS[instId]; if(!inst) return midi;
  return midi + inst.transpose;
}
function VTS_soundingToWritten(midi, instId){
  const inst = VTS_INSTRUMENTS[instId]; if(!inst) return midi;
  return midi - inst.transpose;
}
function VTS_inRange(midi, instId, kind){
  const inst = VTS_INSTRUMENTS[instId]; if(!inst) return false;
  const r = kind==='sounding' ? inst.sounding : inst.written;
  return midi >= r.lo && midi <= r.hi;
}
function VTS_getRegister(midiWritten, instId){
  const inst = VTS_INSTRUMENTS[instId]; if(!inst) return null;
  for(const k of ['low','mid','high','extreme']){
    const r = inst.registers[k];
    if(r && midiWritten >= r.lo && midiWritten <= r.hi) return k;
  }
  return null;
}

/* ─── Parser note texte → MIDI (ex: "C4", "Bb5", "F#3") ─── */
function VTS_parseNote(str){
  if(!str || typeof str!=='string') return null;
  const s = str.trim().replace(/♯/g,'#').replace(/♭/g,'b');
  const m = s.match(/^([A-Ga-g])([#b]?)(-?\d{1,2})$/);
  if(!m) return null;
  const letter = m[1].toUpperCase();
  const acc = m[2];
  const oct = parseInt(m[3],10);
  const base = {C:0,D:2,E:4,F:5,G:7,A:9,B:11}[letter];
  let pc = base + (acc==='#'?1:acc==='b'?-1:0);
  const midi = (oct + 1) * 12 + pc;
  if(midi < 0 || midi > 127) return null;
  return midi;
}
function VTS_midiToName(midi, useFlats){
  if(midi==null || isNaN(midi)) return '';
  const NS = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const NF = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
  const arr = useFlats ? NF : NS;
  const pc = ((midi%12)+12)%12;
  const oct = Math.floor(midi/12) - 1;
  return arr[pc] + oct;
}

/* ─── State ─── */
let VTS_config = JSON.parse(JSON.stringify({
  flutes:    {count:2, type:'FL',  aux:false, auxType:'PICC'},
  oboes:     {count:2, type:'OB',  aux:false, auxType:'CA'},
  clarinets: {count:2, type:'CL',  aux:false, auxType:'CLB'},
  bassoons:  {count:2, type:'BN',  aux:false, auxType:'CBN'}
}));
let VTS_activeInsts = [];
let VTS_chords = [];
let VTS_selChord = -1;
let VTS_noteHits = [];
const VTS_MAX_CHORDS = 20;
let VTS_keyInfo = {root:0,minor:false,sharps:0};
let VTS_errors = [];

/* ─── Construire la liste des instruments actifs depuis la config ─── */
function VTS_buildActiveInsts(){
  const cfg = VTS_config;
  const list = [];
  VTS_FAMILIES.forEach(f=>{
    const c = cfg[f.key];
    const n = c.count;
    for(let i=0; i<n; i++){
      const isAux = c.aux && i === n-1 && n >= 2;
      const instId = isAux ? (c.auxType || f.auxTypes[0].instId) : (c.type || f.types[0].instId);
      list.push({
        slotId: `${f.key}_${i+1}`,
        instId: instId,
        family: f.key,
        idx: i+1,
        isAux: isAux
      });
    }
  });
  VTS_activeInsts = list;
}

/* ─── Construire le panneau de configuration VENTS (dynamique) ─── */
function VTS_buildConfigPanel(){
  const el = document.getElementById('vts_configPanel'); if(!el) return;
  const L = (typeof currentLang!=='undefined') ? currentLang : 'fr';
  const tx2 = (o) => (typeof o==='object') ? (o[L] || o.fr) : o;

  let h = `<div class="vts-cfg-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin-top:6px">`;

  VTS_FAMILIES.forEach(fam=>{
    const cfg = VTS_config[fam.key];
    const color = fam.color;
    const auxDisabled = cfg.count < 2;

    h += `<div class="vts-family-cfg" style="border-left:3px solid ${color};padding:8px 10px;background:rgba(0,0,0,0.03);border-radius:6px">`;
    h += `<div style="font-weight:600;color:${color};font-size:11px;margin-bottom:6px">${tx2(fam.label)}</div>`;

    // Type selector
    if(fam.types && fam.types.length > 1){
      h += `<label style="display:flex;align-items:center;gap:6px;font-size:10px;margin-bottom:4px;color:var(--t2)">`;
      h += `<span>${L==='en'?'Type:':L==='es'?'Tipo:':'Type :'}</span>`;
      h += `<select id="vts_type_${fam.key}" class="note-sel" onchange="VTS_onConfigChange()" style="flex:1;font-size:10px">`;
      fam.types.forEach(t=>{
        const sel = (cfg.type===t.instId)?' selected':'';
        h += `<option value="${t.instId}"${sel}>${tx2(t.label)}</option>`;
      });
      h += `</select></label>`;
    }

    // Count selector
    h += `<label style="display:flex;align-items:center;gap:6px;font-size:10.5px;margin-bottom:4px">`;
    h += `<span data-i18n="vts_count">Nombre :</span>`;
    h += `<select id="vts_cfg_${fam.key}_count" class="note-sel" onchange="VTS_onConfigChange()" style="flex:1">`;
    for(let v=0;v<=fam.maxCount;v++) h += `<option value="${v}"${v===cfg.count?' selected':''}>${v}</option>`;
    h += `</select></label>`;

    // Aux type selector (only if hasAux + count >= 2)
    if(fam.hasAux && fam.auxTypes && fam.auxTypes.length > 0){
      h += `<label style="display:flex;align-items:center;gap:6px;font-size:10px;margin-bottom:2px;color:var(--t2)">`;
      h += `<input type="checkbox" id="vts_cfg_${fam.key}_aux" onchange="VTS_onConfigChange()"${cfg.aux?' checked':''}${auxDisabled?' disabled':''}> `;
      h += `<span style="margin-right:4px">${L==='en'?'Last →':L==='es'?'Último →':'Dernier →'}</span>`;
      h += `<select id="vts_auxtype_${fam.key}" class="note-sel" onchange="VTS_onConfigChange()" style="flex:1;font-size:10px"${auxDisabled?' disabled':''}>`;
      fam.auxTypes.forEach(t=>{
        const sel = (cfg.auxType===t.instId)?' selected':'';
        h += `<option value="${t.instId}"${sel}>${tx2(t.label)}</option>`;
      });
      h += `</select></label>`;
    }

    h += `</div>`;
  });

  h += `</div>`;
  h += `<div style="font-size:10px;color:var(--t3);margin-top:8px;line-height:1.5" data-i18n="vts_cfg_hint">💡 Choisissez le type et le nombre d'instruments. "Dernier →" substitue le dernier pupitre par un instrument auxiliaire.</div>`;
  el.innerHTML = h;
}

/* ─── Construire le sélecteur de tonalité ─── */
function VTS_buildKeySelector(){
  const sel = document.getElementById('vts_keySel'); if(!sel) return;
  const cur = sel.value;
  sel.innerHTML = AH_KEY_LIST.map((k,i)=>{
    const name = currentLang==='en'?k.nameEn:currentLang==='es'?k.nameEs:k.name;
    return `<option value="${i}">${name}</option>`;
  }).join('');
  if(cur) sel.value = cur;
}

/* ─── Construire les champs de saisie pour chaque instrument actif ─── */
function VTS_buildInputs(){
  const el = document.getElementById('vts_voiceInputs'); if(!el) return;
  const L = currentLang;
  if(!VTS_activeInsts.length){
    el.innerHTML = `<div style="padding:14px;text-align:center;color:var(--t3);font-size:11px;font-style:italic">${tx('Sélectionnez au moins un instrument dans la configuration ci-dessus.','Select at least one instrument in the configuration above.','Selecciona al menos un instrumento en la configuración anterior.')}</div>`;
    return;
  }
  let h = '';
  VTS_activeInsts.forEach(slot=>{
    const inst = VTS_INSTRUMENTS[slot.instId];
    const label = inst.label[L] || inst.label.fr;
    const num = slot.idx;
    const color = inst.color;
    const transposeLabel = inst.transpose !== 0
      ? `<span class="vts-trans-label" id="vts_trans_${slot.slotId}" style="font-size:9.5px;color:var(--t3);margin-left:6px"></span>`
      : '';
    // Note par défaut : médium de la tessiture écrite
    const defaultMidi = Math.round((inst.written.lo + inst.written.hi)/2);
    const defaultName = VTS_midiToName(defaultMidi, false);
    const dlId = `vts_dl_${slot.slotId}`;
    const useFlats = VTS_keyInfo ? VTS_keyInfo.sharps < 0 : false;
    const opts = AH_buildNoteOptions(inst.written.lo, inst.written.hi, useFlats);
    const datalist = `<datalist id="${dlId}">${opts.map(o=>`<option value="${o}">`).join('')}</datalist>`;
    // Bouton clef de ténor pour basson (BN, CBN)
    const hasTenorClefVTS = (slot.instId === 'BN' || slot.instId === 'CBN');
    const tenorBtnVTS = hasTenorClefVTS
      ? `<button onclick="VTS_toggleTenorClef('${slot.slotId}')" id="vts_tenorbtn_${slot.slotId}" title="${(typeof window.t==='function'&&window.t('str_clef_tenor'))||'Clef de ténor'}"
           style="font-size:9px;padding:2px 6px;border-radius:4px;border:1px solid var(--bd);background:${VTS_tenorClef[slot.slotId]?'#534AB7':'var(--bg)'};color:${VTS_tenorClef[slot.slotId]?'#fff':'var(--t2)'};cursor:pointer;margin-left:2px;font-weight:600" data-i18n="str_clef_tenor">${(typeof window.t==='function'&&window.t('str_clef_tenor'))||'Clef de ténor'}</button>`
      : '';
    h += `
      <div class="voice-row vts-voice-row" style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:5px;background:rgba(0,0,0,0.02);border-left:3px solid ${color}">
        <div class="voice-label" style="font-size:11px;font-weight:600;color:${color};min-width:130px">${label} ${num}${slot.isAux?' ★':''}</div>
        ${datalist}
        <input type="text" class="vts-note-input" id="vts_in_${slot.slotId}" value="${defaultName}"
               list="${dlId}"
               oninput="VTS_onNoteInput('${slot.slotId}')"
               style="width:70px;padding:3px 6px;font-size:11px;text-align:center;border:1px solid var(--bd);border-radius:4px;font-family:monospace">
        ${transposeLabel}${tenorBtnVTS}
        <span class="vts-register-badge" id="vts_reg_${slot.slotId}" style="font-size:9px;color:var(--t3);margin-left:auto"></span>
      </div>
    `;
  });
  el.innerHTML = h;
  // Mettre à jour les libellés "écrit → sonore" pour chaque instrument transpositeur
  VTS_activeInsts.forEach(slot=>{
    VTS_updateTransposeDisplay(slot.slotId);
    VTS_updateRegisterBadge(slot.slotId);
  });
}

function VTS_toggleTenorClef(slotId){
  VTS_tenorClef[slotId] = !VTS_tenorClef[slotId];
  const btn = document.getElementById('vts_tenorbtn_'+slotId);
  if(btn){
    btn.style.background = VTS_tenorClef[slotId] ? '#534AB7' : 'var(--bg)';
    btn.style.color = VTS_tenorClef[slotId] ? '#fff' : 'var(--t2)';
  }
  if(typeof TUT_render === 'function') TUT_render();
  VTS_render();
}
window.VTS_toggleTenorClef = VTS_toggleTenorClef;
function VTS_updateTransposeDisplay(slotId){
  const slot = VTS_activeInsts.find(s=>s.slotId===slotId); if(!slot) return;
  const inst = VTS_INSTRUMENTS[slot.instId];
  if(inst.transpose === 0) return;
  const inp = document.getElementById('vts_in_'+slotId); if(!inp) return;
  const lbl = document.getElementById('vts_trans_'+slotId); if(!lbl) return;
  const w = VTS_parseNote(inp.value);
  if(w == null){ lbl.textContent = ''; return; }
  const s = VTS_writtenToSounding(w, slot.instId);
  const useFlats = VTS_keyInfo.sharps < 0;
  const wn = VTS_midiToName(w, useFlats);
  const sn = VTS_midiToName(s, useFlats);
  lbl.textContent = `(${tx('écrit','written','escrito')} ${wn} → ${tx('sonore','sounding','sonoro')} ${sn})`;
}

/* ─── Mettre à jour le badge "registre" (low/mid/high/extreme) ─── */
function VTS_updateRegisterBadge(slotId){
  const slot = VTS_activeInsts.find(s=>s.slotId===slotId); if(!slot) return;
  const inst = VTS_INSTRUMENTS[slot.instId];
  const inp = document.getElementById('vts_in_'+slotId); if(!inp) return;
  const badge = document.getElementById('vts_reg_'+slotId); if(!badge) return;
  const w = VTS_parseNote(inp.value);
  if(w==null){ badge.textContent=''; badge.style.cssText=''; return; }
  if(!VTS_inRange(w, slot.instId, 'written')){
    badge.textContent = '⚠ ' + tx('hors tessiture','out of range','fuera tesitura');
    badge.style.cssText='background:#fee2e2;color:#dc2626;padding:3px 8px;border-radius:20px;font-weight:700;font-size:9.5px;border:1px solid #fca5a5;letter-spacing:0.3px';
    return;
  }
  const reg = VTS_getRegister(w, slot.instId);
  const map = {
    low:    {fr:'♭ grave',  en:'♭ low',     es:'♭ grave',   bg:'#eff6ff', cl:'#1e40af', bd:'#bfdbfe'},
    mid:    {fr:'◆ médium', en:'◆ mid',     es:'◆ medio',   bg:'#f0fdf4', cl:'#166534', bd:'#bbf7d0'},
    high:   {fr:'♯ aigu',  en:'♯ high',    es:'♯ agudo',   bg:'#fffbeb', cl:'#92400e', bd:'#fcd34d'},
    extreme:{fr:'⚡ extrême',en:'⚡ extreme', es:'⚡ extremo', bg:'#fff1f2', cl:'#be123c', bd:'#fda4af'}
  };
  const m = map[reg];
  if(!m){ badge.textContent=''; return; }
  badge.textContent = m[currentLang] || m.fr;
  badge.style.cssText=`background:${m.bg};color:${m.cl};padding:3px 8px;border-radius:20px;font-weight:700;font-size:9.5px;border:1px solid ${m.bd};letter-spacing:0.3px`;
  badge.style.fontWeight = '600';
}

/* ─── Handlers UI ─── */
function VTS_onConfigChange(){
  VTS_FAMILIES.forEach(f=>{
    const c  = document.getElementById('vts_cfg_'+f.key+'_count');
    const a  = document.getElementById('vts_cfg_'+f.key+'_aux');
    const t  = document.getElementById('vts_type_'+f.key);
    const at = document.getElementById('vts_auxtype_'+f.key);
    if(c)  VTS_config[f.key].count   = +c.value;
    if(a)  VTS_config[f.key].aux     = !!a.checked;
    if(t)  VTS_config[f.key].type    = t.value;
    if(at) VTS_config[f.key].auxType = at.value;
    // Désactiver aux si count < 2
    const auxEl    = document.getElementById('vts_cfg_'+f.key+'_aux');
    const auxSelEl = document.getElementById('vts_auxtype_'+f.key);
    const disabled = VTS_config[f.key].count < 2;
    if(auxEl){ auxEl.disabled = disabled; if(disabled){ auxEl.checked = false; VTS_config[f.key].aux = false; } }
    if(auxSelEl){ auxSelEl.disabled = disabled; }
  });
  VTS_buildActiveInsts();
  VTS_buildInputs();
  VTS_chords = [];
  VTS_selChord = -1;
  VTS_analyze();
  VTS_render();
}

function VTS_updateKey(){
  const v = +document.getElementById('vts_keySel').value;
  const k = AH_KEY_LIST[v];
  VTS_keyInfo = {root:k.root, minor:k.minor, sharps:k.sharps};
  // Rafraîchir les affichages transpose / registre
  VTS_activeInsts.forEach(s=>{
    VTS_updateTransposeDisplay(s.slotId);
    VTS_updateRegisterBadge(s.slotId);
  });
  VTS_analyze();
  VTS_render();
}

function VTS_onModeChange(){
  // Mode 'single' : on ne garde qu'un seul accord
  const mode = document.getElementById('vts_mode').value;
  if(mode === 'single' && VTS_chords.length > 1){
    VTS_chords = [VTS_chords[VTS_chords.length-1]];
    VTS_selChord = 0;
  }
  VTS_analyze(); VTS_render();
}

function VTS_onNoteInput(slotId){
  VTS_updateTransposeDisplay(slotId);
  VTS_updateRegisterBadge(slotId);
}

function VTS_getInputChord(){
  const notes = {};
  VTS_activeInsts.forEach(slot=>{
    const inp = document.getElementById('vts_in_'+slot.slotId);
    const midi = inp ? VTS_parseNote(inp.value) : null;
    notes[slot.slotId] = midi; // peut être null si invalide
  });
  return { notes };
}
function VTS_setInputChord(ch){
  if(!ch || !ch.notes) return;
  VTS_activeInsts.forEach(slot=>{
    const inp = document.getElementById('vts_in_'+slot.slotId);
    const midi = ch.notes[slot.slotId];
    if(inp && midi != null){
      const useFlats = VTS_keyInfo.sharps < 0;
      inp.value = VTS_midiToName(midi, useFlats);
    }
    VTS_updateTransposeDisplay(slot.slotId);
    VTS_updateRegisterBadge(slot.slotId);
  });
}

function VTS_addChord(){
  if(VTS_chords.length >= VTS_MAX_CHORDS){
    alert(`Max ${VTS_MAX_CHORDS} ${tx('accords','chords','acordes')}.`); return;
  }
  const mode = document.getElementById('vts_mode').value;
  if(mode === 'single' && VTS_chords.length >= 1){
    // En mode accord isolé, on remplace
    VTS_chords = [VTS_getInputChord()];
    VTS_selChord = 0;
  } else {
    VTS_chords.push(VTS_getInputChord());
    VTS_selChord = VTS_chords.length - 1;
  }
  VTS_analyze(); VTS_render();
  try{window.dispatchEvent(new CustomEvent('contrepoint:chordschange'));}catch(e){}
}
function VTS_updateChord(){
  if(VTS_selChord<0 || VTS_selChord>=VTS_chords.length) return;
  VTS_chords[VTS_selChord] = VTS_getInputChord();
  VTS_analyze(); VTS_render();
  try{window.dispatchEvent(new CustomEvent('contrepoint:chordschange'));}catch(e){}
}
function VTS_removeSelected(){
  if(!VTS_chords.length) return;
  const idx = VTS_selChord >= 0 && VTS_selChord < VTS_chords.length
    ? VTS_selChord : VTS_chords.length - 1;
  VTS_chords.splice(idx,1);
  VTS_selChord = Math.min(idx, VTS_chords.length - 1);
  if(!VTS_chords.length) VTS_selChord = -1;
  VTS_analyze(); VTS_render();
  try{window.dispatchEvent(new CustomEvent('contrepoint:chordschange'));}catch(e){}
}
function VTS_clearAll(){
  VTS_chords = []; VTS_selChord = -1;
  VTS_analyze(); VTS_render();
  try{window.dispatchEvent(new CustomEvent('contrepoint:chordschange'));}catch(e){}
}
function VTS_selectChord(i){
  VTS_selChord = i;
  if(i>=0 && i<VTS_chords.length) VTS_setInputChord(VTS_chords[i]);
}

/* ═══════════════════════════════════════════════════════════════════
   MOTEUR D'ANALYSE VENTS
   Travaille sur les NOTES SONORES (logique musicale).
   Reprend toutes les règles SATB généralisées + règles bois.
   ═══════════════════════════════════════════════════════════════════ */

/* ─── Helpers — versions VTS_ des fonctions SATB (copies préfixées) ─── */
function VTS_interval(a,b){ return Math.abs(b-a)%12; }
function VTS_motionType(v1a,v1b,v2a,v2b){
  const d1=v1b-v1a, d2=v2b-v2a;
  if(d1===0 && d2===0) return 'oblique';
  if(d1===0 || d2===0) return 'oblique';
  if((d1>0 && d2>0) || (d1<0 && d2<0)) return 'direct';
  return 'contrary';
}

/* ─── Convertir un accord (notes écrites par slot) en tableau de voix sonores ─── */
function VTS_chordToVoices(ch){
  // Renvoie [{slotId, instId, label, midiWritten, midiSounding, color, isAux}] trié grave→aigu sonore
  if(!ch || !ch.notes) return [];
  const arr = [];
  VTS_activeInsts.forEach(slot=>{
    const w = ch.notes[slot.slotId];
    if(w == null) return;
    const s = VTS_writtenToSounding(w, slot.instId);
    const inst = VTS_INSTRUMENTS[slot.instId];
    arr.push({
      slotId: slot.slotId,
      instId: slot.instId,
      family: slot.family,
      label: (inst.label[currentLang]||inst.label.fr) + ' ' + slot.idx,
      shortLabel: inst.short + slot.idx,
      midiWritten: w,
      midiSounding: s,
      color: inst.color,
      isAux: slot.isAux
    });
  });
  // Tri par ordre de partition (canonique) — pas par hauteur sonore — pour pairer correctement
  const order = VTS_SCORE_ORDER;
  arr.sort((a,b)=> order.indexOf(a.instId) - order.indexOf(b.instId));
  return arr;
}

/* ─── Analyse complète ─── */
function VTS_analyze(){
  VTS_errors = [];
  if(!VTS_chords.length){ VTS_renderErrors(); return; }
  const EN = currentLang==='en', ES = currentLang==='es';
  const L = {
    p5:    EN?'Parallel 5ths':ES?'Quintas paralelas':'Quintes //',
    p8:    EN?'Parallel 8ves':ES?'Octavas paralelas':'Octaves //',
    d8:    EN?'Direct 8ves':ES?'Octavas directas':'Octaves directes',
    d5:    EN?'Direct 5th':ES?'5ª directa':'Quinte directe',
    cross: EN?'Voice crossing':ES?'Cruzamiento':'Croisement',
    space: EN?'Spacing > 8ve':ES?'Espaciado > 8ª':'Espacement > 8ve',
    ltD:   EN?'Doubled leading tone':ES?'Sensible duplicada':'Sensible doublée',
    ltR:   EN?'Leading tone unresolved':ES?'Sensible sin resolver':'Sensible non résolue',
    octgap:EN?'Octave gap':ES?'Hueco de octava':"Trou d'octave",
    leap:  EN?'Large melodic leap':ES?'Salto melódico amplio':'Grand saut mélodique'
  };

  // ─── Pour chaque accord : tessiture, registre, gorge clarinette, piccolo grave, espacement ───
  VTS_chords.forEach((ch, ci)=>{
    const voices = VTS_chordToVoices(ch);
    // Tessitures (note écrite + note sonore)
    voices.forEach(v=>{
      const inst = VTS_INSTRUMENTS[v.instId];
      const wn = VTS_midiToName(v.midiWritten, VTS_keyInfo.sharps<0);
      const sn = VTS_midiToName(v.midiSounding, VTS_keyInfo.sharps<0);
      if(!VTS_inRange(v.midiWritten, v.instId, 'written')){
        VTS_errors.push({type:'error', chord:ci, slot:v.slotId,
          rule: VTS_RULES_META.vts_range_out.label[currentLang]||VTS_RULES_META.vts_range_out.label.fr,
          msg: `${v.label} : ${wn} ${tx('hors tessiture','out of range','fuera tesitura')}`});
        return;
      }
      const reg = VTS_getRegister(v.midiWritten, v.instId);
      if(reg === 'extreme'){
        VTS_errors.push({type:'warn', chord:ci, slot:v.slotId,
          rule: VTS_RULES_META.vts_range_extreme.label[currentLang]||VTS_RULES_META.vts_range_extreme.label.fr,
          msg: `${v.label} : ${wn} (${tx('registre extrême','extreme register','registro extremo')})`});
      }
      // Piccolo dans le grave (D4-B4 écrit)
      if(v.instId === 'PICC' && v.midiWritten <= 71){
        VTS_errors.push({type:'warn', chord:ci, slot:v.slotId,
          rule: VTS_RULES_META.vts_picc_low.label[currentLang]||VTS_RULES_META.vts_picc_low.label.fr,
          msg: `${v.label} : ${wn} (${tx('piccolo faible dans le grave','weak piccolo low register','flautín débil en grave')})`});
      }
      // Clarinette dans la gorge (Bb3-Bb4 écrit = 58-70)
      if((v.instId === 'CL' || v.instId === 'CLB') && v.midiWritten >= 60 && v.midiWritten <= 71){
        VTS_errors.push({type:'info', chord:ci, slot:v.slotId,
          rule: VTS_RULES_META.vts_cl_throat.label[currentLang]||VTS_RULES_META.vts_cl_throat.label.fr,
          msg: `${v.label} : ${wn} (${tx('clairon — neutre','throat — neutral','garganta — neutro')})`});
      }
    });

    // ─── Espacement & croisement entre voix adjacentes (ordre de partition) ───
    for(let i=0; i<voices.length-1; i++){
      const a = voices[i], b = voices[i+1];
      // En partition, a est au-dessus de b. Le SON peut différer (transpositions).
      // Test du croisement basé sur le SONORE : a doit être >= b en sonore (les bois acceptent égalité = unisson)
      if(a.midiSounding < b.midiSounding){
        VTS_errors.push({type:'error', chord:ci,
          rule: L.cross,
          msg: `${a.shortLabel}(${VTS_midiToName(a.midiSounding,VTS_keyInfo.sharps<0)}) < ${b.shortLabel}(${VTS_midiToName(b.midiSounding,VTS_keyInfo.sharps<0)}) ${tx('(sonore)','(sounding)','(sonoro)')}`});
      }
    }

    // ─── Doublure sensible (sur notes sonores) ───
    const lt = (VTS_keyInfo.root + 11) % 12;
    const ltVoices = voices.filter(v => (v.midiSounding%12) === lt);
    if(ltVoices.length >= 2){
      const names = ltVoices.map(v=>v.shortLabel).join(', ');
      VTS_errors.push({type:'error', chord:ci,
        rule: L.ltD,
        msg: `${names} ${tx('— sensible doublée','— leading tone doubled','— sensible duplicada')}`});
    }

    // ─── Doublure unisson Fl + Hb (timbre du Hb domine, Fl perd identité) ───
    voices.forEach((a, i)=>{
      for(let j=i+1; j<voices.length; j++){
        const b = voices[j];
        if(a.midiSounding === b.midiSounding){
          const fams = [a.family, b.family].sort().join('|');
          if(fams === 'flutes|oboes'){
            VTS_errors.push({type:'info', chord:ci,
              rule: VTS_RULES_META.vts_doubling_unison.label[currentLang]||VTS_RULES_META.vts_doubling_unison.label.fr,
              msg: `${a.shortLabel}=${b.shortLabel} (${VTS_midiToName(a.midiSounding,VTS_keyInfo.sharps<0)})`});
          }
        }
      }
    });
  });

  // ─── Entre accords consécutifs : parallélismes, quintes/octaves directes, sensible non résolue, grand saut ───
  for(let i=0; i<VTS_chords.length-1; i++){
    const vA = VTS_chordToVoices(VTS_chords[i]);
    const vB = VTS_chordToVoices(VTS_chords[i+1]);
    // Pour pairer : on se base sur slotId
    const mapA = {}; vA.forEach(v=> mapA[v.slotId] = v);
    const mapB = {}; vB.forEach(v=> mapB[v.slotId] = v);
    const sharedSlots = Object.keys(mapA).filter(k=> mapB[k]);

    // Paires entre toutes les combinaisons de voix partagées
    for(let x=0; x<sharedSlots.length; x++){
      for(let y=x+1; y<sharedSlots.length; y++){
        const sA = sharedSlots[x], sB = sharedSlots[y];
        const v1a = mapA[sA].midiSounding, v1b = mapB[sA].midiSounding;
        const v2a = mapA[sB].midiSounding, v2b = mapB[sB].midiSounding;
        const intA = VTS_interval(v1a, v2a), intB = VTS_interval(v1b, v2b);
        const motion = VTS_motionType(v1a, v1b, v2a, v2b);
        const lbl1 = mapA[sA].shortLabel, lbl2 = mapA[sB].shortLabel;
        if(intA===7 && intB===7 && motion==='direct')
          VTS_errors.push({type:'error', chord:i, rule:L.p5, msg:`${lbl1}–${lbl2} (${i+1}→${i+2})`});
        if(intA===0 && intB===0 && motion==='direct' && v1a !== v1b)
          VTS_errors.push({type:'error', chord:i, rule:L.p8, msg:`${lbl1}–${lbl2} (${i+1}→${i+2})`});
        if(intA!==0 && intB===0 && motion==='direct')
          VTS_errors.push({type:'error', chord:i, rule:L.d8, msg:`${lbl1}–${lbl2} (${i+1}→${i+2})`});
        if(intA!==7 && intB===7 && motion==='direct'){
          // Quinte directe : signaler surtout entre voix extrêmes (1er pupitre vs dernier)
          const idxA = VTS_SCORE_ORDER.indexOf(mapA[sA].instId);
          const idxB = VTS_SCORE_ORDER.indexOf(mapA[sB].instId);
          const isExtreme = (idxA === Math.min(idxA,idxB)) && (idxB === Math.max(idxA,idxB));
          // On reste warn (moins strict que SATB qui filtre sur S-B uniquement)
          VTS_errors.push({type:'warn', chord:i, rule:L.d5, msg:`${lbl1}–${lbl2} (${i+1}→${i+2})`});
        }
      }
    }

    // Sensible non résolue + grand saut (par voix individuelle)
    const lt = (VTS_keyInfo.root + 11) % 12;
    sharedSlots.forEach(s=>{
      const a = mapA[s], b = mapB[s];
      // Sensible
      if((a.midiSounding%12) === lt
         && (b.midiSounding%12) !== VTS_keyInfo.root%12
         && b.midiSounding !== a.midiSounding
         && b.midiSounding < a.midiSounding){
        VTS_errors.push({type:'warn', chord:i, rule:L.ltR, msg:`${a.shortLabel} (${i+1}→${i+2})`});
      }
      // Grand saut > 1 octave (info)
      const leap = Math.abs(b.midiSounding - a.midiSounding);
      if(leap > 12){
        VTS_errors.push({type:'info', chord:i, rule:L.leap, msg:`${a.shortLabel}: ${leap}st (${i+1}→${i+2})`});
      }
    });
  }

  VTS_renderErrors();
}

function VTS_renderErrors(){
  const el = document.getElementById('vts_errList');
  const cntEl = document.getElementById('vts_errCount');
  if(!el) return;
  if(cntEl) cntEl.textContent = VTS_errors.length;
  if(VTS_errors.length === 0 && VTS_chords.length >= 1){
    el.innerHTML = `<div class="err-item ok"><span class="err-icon">✓</span><div class="err-text"><span class="err-rule">${tx('Aucune erreur','No errors','Sin errores')}</span>${tx("L'écriture respecte les règles de conduite et les contraintes des bois.","Writing follows voice-leading and woodwind constraints.","La escritura respeta la conducción y las restricciones de las maderas.")}</div></div>`;
    return;
  }
  if(VTS_chords.length === 0){
    el.innerHTML = `<div class="no-errors">${tx("Ajoutez au moins un accord pour analyser.","Add at least one chord to analyze.","Añade al menos un acorde para analizar.")}</div>`;
    return;
  }
  el.innerHTML = VTS_errors.map(e=>{
    const ic = e.type==='error'?'✕':e.type==='warn'?'⚠':'ℹ';
    return `<div class="err-item ${e.type}" onclick="VTS_selectChord(${e.chord})"><span class="err-icon">${ic}</span><div class="err-text"><span class="err-rule">${e.rule}</span>${e.msg}</div></div>`;
  }).join('');
}

/* ═══════════════════════════════════════════════════════════════════
   RENDU PARTITION VENTS — Canvas multi-portées
   Une portée par instrument actif. Clés selon l'instrument.
   ═══════════════════════════════════════════════════════════════════ */
const VTS_DIA = [0,0,1,1,2,3,3,4,4,5,5,6];
const VTS_LM = 90, VTS_RM = 20, VTS_LS = 9; // line spacing un peu plus serré
// Clef de ténor optionnelle pour le basson (BN, CBN)
let VTS_tenorClef = {}; // {slotId: bool}

function VTS_midiToY(midi, staffTop, clefKind){
  const oct = Math.floor(midi/12) - 1;
  const pc = midi%12;
  const diaPos = oct*7 + VTS_DIA[pc];
  // treble: B4(71) dia34 sur 3e ligne
  // bass  : D3(50) dia22 sur 3e ligne
  // tenor : A3(57) dia27 sur 4e ligne (+VTS_LS offset)
  if(clefKind === 'treble') return staffTop + 2*VTS_LS - (diaPos - 34) * (VTS_LS/2);
  if(clefKind === 'tenor')  return staffTop + 2*VTS_LS - (diaPos - 26) * (VTS_LS/2);
  return staffTop + 2*VTS_LS - (diaPos - 22) * (VTS_LS/2);
}

function VTS_render(){
  // Mettre à jour le compteur
  const cnt = document.getElementById('vts_chordCount');
  if(cnt){
    const num = cnt.querySelector('span') ? cnt.firstChild : cnt;
    if(num.nodeType === 3) num.nodeValue = `${VTS_chords.length} / ${VTS_MAX_CHORDS} `;
    else cnt.firstChild.nodeValue = `${VTS_chords.length} / ${VTS_MAX_CHORDS} `;
  }

  const canvas = document.getElementById('vts_scoreCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const staves = VTS_activeInsts.length;
  if(staves === 0){
    canvas.width = 200; canvas.height = 80;
    canvas.style.width = '200px'; canvas.style.height = '80px';
    ctx.clearRect(0,0,200,80);
    ctx.fillStyle = '#9ca3af'; ctx.font = '11px sans-serif'; ctx.textAlign='center';
    ctx.fillText(tx('(aucun instrument)','(no instrument)','(sin instrumento)'), 100, 40);
    return;
  }

  const cw = Math.max(900, canvas.parentElement.clientWidth - 28);
  const staveGap = 18;
  const staveHeight = 4 * VTS_LS;
  const top = 26;
  const totalH = top + staves * (staveHeight + staveGap) + 30;

  canvas.style.width = cw + 'px';
  canvas.style.height = totalH + 'px';
  canvas.width = cw * dpr;
  canvas.height = totalH * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0,0,cw,totalH);

  // ─── Dessin des portées ───
  const stavesData = [];
  VTS_activeInsts.forEach((slot, idx)=>{
    const inst = VTS_INSTRUMENTS[slot.instId];
    const yTop = top + idx * (staveHeight + staveGap);
    stavesData.push({slot, inst, yTop});
    // 5 lignes
    ctx.strokeStyle = '#555'; ctx.lineWidth = 0.8;
    for(let l=0; l<5; l++){
      const y = yTop + l*VTS_LS;
      ctx.beginPath();
      ctx.moveTo(VTS_LM, y);
      ctx.lineTo(cw - VTS_RM, y);
      ctx.stroke();
    }
    // Barre de gauche
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(VTS_LM, yTop);
    ctx.lineTo(VTS_LM, yTop + 4*VTS_LS);
    ctx.stroke();

    // Étiquette instrument
    ctx.fillStyle = inst.color;
    ctx.font = 'bold 10px "DM Sans",sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(inst.short + slot.idx + (slot.isAux?' ★':''), VTS_LM - 8, yTop + 2*VTS_LS);

    // Clé
    const fs = VTS_LS * 4.2;
    ctx.fillStyle = '#1e1e2e';
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    const useTenorVTS = VTS_tenorClef[slot.slotId];
    if(useTenorVTS && typeof STR_drawTenorClef === 'function'){
      STR_drawTenorClef(ctx, VTS_LM + 3, yTop, VTS_LS);
    } else if(inst.clef === 'treble'){
      ctx.font = `${fs}px "Times New Roman",Georgia,serif`;
      const m = ctx.measureText('\uD834\uDD1E');
      const h = (m.actualBoundingBoxAscent||fs*0.75) + (m.actualBoundingBoxDescent||fs*0.25);
      ctx.fillText('\uD834\uDD1E', VTS_LM + 3, (yTop + 3*VTS_LS) + h*0.38 - (m.actualBoundingBoxDescent||fs*0.25));
    } else {
      const bfs = fs * 0.78;
      ctx.font = `${bfs}px "Times New Roman",Georgia,serif`;
      const m = ctx.measureText('\uD834\uDD22');
      const h = (m.actualBoundingBoxAscent||bfs*0.8) + (m.actualBoundingBoxDescent||bfs*0.1);
      ctx.fillText('\uD834\uDD22', VTS_LM + 4, (yTop + VTS_LS) - h*0.15 + (m.actualBoundingBoxAscent||bfs*0.8));
    }
  });

  // ─── Armure (basique : compteur de # ou ♭) ───
  const ksN = VTS_keyInfo.sharps || 0;
  const sharpTP = [0,1.5,-0.5,1,2.5,0.5,2], sharpBP = [1,2.5,0.5,2,3.5,1.5,3];
  const flatTP  = [2,0.5,2.5,1,3,1.5,3.5], flatBP  = [3,1.5,3.5,2,4,2.5,4.5];
  let ksX = VTS_LM + 38;
  stavesData.forEach(s=>{
    const tp = s.inst.clef === 'treble' ? sharpTP : sharpBP;
    const tpf = s.inst.clef === 'treble' ? flatTP : flatBP;
    if(ksN>0){
      ctx.font = `${VTS_LS*1.5}px "Times New Roman",Georgia,serif`;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillStyle = '#1e1e2e';
      for(let i=0;i<ksN&&i<7;i++){
        ctx.fillText('\u266F', ksX + i*8, s.yTop + tp[i]*VTS_LS);
      }
    } else if(ksN<0){
      const c = -ksN;
      ctx.font = `${VTS_LS*1.7}px "Times New Roman",Georgia,serif`;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillStyle = '#1e1e2e';
      for(let i=0;i<c&&i<7;i++){
        ctx.fillText('\u266D', ksX + i*8, s.yTop + tpf[i]*VTS_LS);
      }
    }
  });
  if(ksN!==0) ksX += Math.abs(ksN)*8 + 6;

  // ─── Notes ───
  VTS_noteHits = [];
  if(!VTS_chords.length) return;
  const startX = ksX + 14;
  const chW = Math.min(70, (cw - startX - VTS_RM - 10) / VTS_chords.length);
  const noteSize = Math.max(4, Math.min(6, 80/VTS_chords.length));

  // Set des erreurs pour highlight
  const errSet = new Set(VTS_errors.map(e=>e.chord));
  const errSet2 = new Set(VTS_errors.map(e=>e.chord+1));

  VTS_chords.forEach((ch, ci)=>{
    const x = startX + ci*chW + chW/2;
    // Highlight global accord erroné
    if(errSet.has(ci) || errSet2.has(ci)){
      ctx.fillStyle = 'rgba(239,68,68,0.06)';
      ctx.fillRect(x - chW/2 + 2, top - 6, chW - 4, totalH - top - 20);
    }
    if(ci === VTS_selChord){
      ctx.fillStyle = 'rgba(83,74,183,0.06)';
      ctx.fillRect(x - chW/2 + 2, top - 6, chW - 4, totalH - top - 20);
    }

    // Une note par instrument actif (note ÉCRITE — c'est ce qui s'affiche sur la portée)
    // Calculer Y + détecter collisions (mêmes notes côte à côte)
    const vtsNoteData = stavesData.map(s=>{
      const midi = ch.notes[s.slot.slotId];
      if(midi==null) return null;
      const effectiveClefVTS = VTS_tenorClef[s.slot.slotId] ? 'tenor' : s.inst.clef;
      const y = VTS_midiToY(midi, s.yTop, effectiveClefVTS);
      return {s, midi, y, xOff:0, effectiveClefVTS};
    }).filter(Boolean);
    // Trier par Y et décaler les notes trop proches sur la même portée
    const vtsSorted = [...vtsNoteData].sort((a,b)=>a.y-b.y);
    for(let i=1;i<vtsSorted.length;i++){
      if(Math.abs(vtsSorted[i].y - vtsSorted[i-1].y) < VTS_LS*0.9)
        vtsSorted[i].xOff = (noteSize+2)*2;
    }
    vtsNoteData.forEach(({s, midi, y, xOff})=>{
      const nx = x + xOff;
      const yTop2 = s.yTop, yBot = s.yTop + 4*VTS_LS;
      // Lignes supplémentaires
      ctx.strokeStyle = '#888'; ctx.lineWidth = 0.8;
      if(y < yTop2) for(let ly = yTop2 - VTS_LS; ly >= y - 1; ly -= VTS_LS){
        ctx.beginPath(); ctx.moveTo(nx-9, ly); ctx.lineTo(nx+9, ly); ctx.stroke();
      }
      if(y > yBot) for(let ly = yBot + VTS_LS; ly <= y + 1; ly += VTS_LS){
        ctx.beginPath(); ctx.moveTo(nx-9, ly); ctx.lineTo(nx+9, ly); ctx.stroke();
      }
      // Notehead
      ctx.save();
      ctx.translate(nx, y);
      ctx.rotate(-0.18);
      ctx.beginPath();
      ctx.ellipse(0, 0, noteSize+1, noteSize-1.5, 0, 0, Math.PI*2);
      ctx.fillStyle = s.inst.color;
      ctx.fill();
      ctx.restore();
      // Enregistrer pour drag
      VTS_noteHits.push({chordIdx:ci, slotId:s.slot.slotId, instId:s.slot.instId, x:nx, y, r:noteSize+4, midi, yTop:s.yTop, inst:s.inst});
      // Hors tessiture : entourer en rouge
      if(!VTS_inRange(midi, s.slot.instId, 'written')){
        ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(nx, y, noteSize+3, 0, Math.PI*2); ctx.stroke();
      }
    });

    // Barre de mesure entre accords
    if(ci < VTS_chords.length - 1){
      ctx.strokeStyle = '#ccc'; ctx.lineWidth = 0.5;
      const bx = x + chW/2;
      stavesData.forEach(s=>{
        ctx.beginPath();
        ctx.moveTo(bx, s.yTop);
        ctx.lineTo(bx, s.yTop + 4*VTS_LS);
        ctx.stroke();
      });
    }
  });

  // Double barre finale
  if(VTS_chords.length){
    const lx = startX + (VTS_chords.length-1)*chW + chW/2 + chW/2;
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
    stavesData.forEach(s=>{
      ctx.beginPath();
      ctx.moveTo(lx, s.yTop);
      ctx.lineTo(lx, s.yTop + 4*VTS_LS);
      ctx.stroke();
    });
    ctx.lineWidth = 3.5;
    stavesData.forEach(s=>{
      ctx.beginPath();
      ctx.moveTo(lx + 5, s.yTop);
      ctx.lineTo(lx + 5, s.yTop + 4*VTS_LS);
      ctx.stroke();
    });
  }
}

/* ═══════════════════════════
   AUDIO (réutilise le piano chain commun via _getPianoChain)
   ═══════════════════════════ */
function VTS_playChordAudio(ch, startTime, dur){
  if(typeof _getPianoChain !== 'function') return;
  const chain = _getPianoChain();
  const ctx = chain.ctx;
  const t = startTime || ctx.currentTime;
  let i = 0;
  VTS_activeInsts.forEach(slot=>{
    const w = ch.notes[slot.slotId];
    if(w == null) return;
    const s = VTS_writtenToSounding(w, slot.instId);
    const f = 440 * Math.pow(2, (s - 69)/12);
    if(typeof pianoNote === 'function'){
      pianoNote(f, t + (i++)*0.006, dur, ctx, chain.dry, chain.wet, 0.20);
    }
  });
}
function VTS_playSelected(){
  if(VTS_selChord < 0 || VTS_selChord >= VTS_chords.length) return;
  const btn = document.getElementById('vts_btnPlaySel');
  if(btn) btn.classList.add('playing');
  VTS_playChordAudio(VTS_chords[VTS_selChord], null, 1.5);
  setTimeout(()=> btn && btn.classList.remove('playing'), 1500);
}
function VTS_playAll(){
  if(!VTS_chords.length) return;
  if(typeof _getPianoChain !== 'function') return;
  const chain = _getPianoChain();
  const ctx = chain.ctx;
  const tempo = +(document.getElementById('vts_tempoInput').value) || 72;
  const beat = 60/tempo;
  const btn = document.getElementById('vts_btnPlayAll');
  if(btn) btn.classList.add('playing');
  const now = ctx.currentTime;
  VTS_chords.forEach((ch, i)=>{
    VTS_playChordAudio(ch, now + i*beat, beat*0.9);
  });
  setTimeout(()=> btn && btn.classList.remove('playing'), VTS_chords.length*beat*1000 + 400);
}

/* ═══════════════════════════════════════════════════════════════════
   EXPORT PDF — Paysage, jusqu'à 12 portées
   ═══════════════════════════════════════════════════════════════════ */
function VTS_exportPDF(){
  if(!VTS_chords.length){
    alert(tx("Ajoutez des accords avant d'exporter.","Add chords before exporting.","Añade acordes antes de exportar."));
    return;
  }
  if(!VTS_activeInsts.length){
    alert(tx("Configurez au moins un instrument.","Configure at least one instrument.","Configura al menos un instrumento."));
    return;
  }

  const staves = VTS_activeInsts.length;
  const W = 3300, H = 2550; // ~11" x 8.5" @ 300 dpi (paysage US Letter)
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);

  const pLM = 220, pRM = 120;
  const pLS = 26; // line spacing
  const staveH = 4 * pLS;
  const staveGap = 36;
  const topMargin = 180;
  const usableH = H - topMargin - 80;
  const needed = staves * (staveH + staveGap);
  const scale = needed > usableH ? usableH / needed : 1;
  const pLSadj = pLS * scale;
  const staveHadj = 4 * pLSadj;
  const staveGapAdj = staveGap * scale;

  // Titre
  ctx.fillStyle = '#534AB7';
  ctx.font = 'bold 48px "DM Sans",sans-serif';
  ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  ctx.fillText(tx("Analyse — Vents","Analysis — Winds","Análisis — Vientos"), pLM, 50);
  const keyEntry = AH_KEY_LIST[+document.getElementById('vts_keySel').value];
  const keyName = currentLang==='en'?keyEntry.nameEn:currentLang==='es'?keyEntry.nameEs:keyEntry.name;
  ctx.fillStyle = '#6b7280'; ctx.font = '26px "DM Sans",sans-serif';
  ctx.fillText(keyName, pLM, 110);

  // Portées
  const stavesData = [];
  VTS_activeInsts.forEach((slot, idx)=>{
    const inst = VTS_INSTRUMENTS[slot.instId];
    const yTop = topMargin + idx * (staveHadj + staveGapAdj);
    stavesData.push({slot, inst, yTop});
    // 5 lignes
    ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
    for(let l=0; l<5; l++){
      const y = yTop + l*pLSadj;
      ctx.beginPath();
      ctx.moveTo(pLM, y);
      ctx.lineTo(W - pRM, y);
      ctx.stroke();
    }
    // Barre gauche
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(pLM, yTop);
    ctx.lineTo(pLM, yTop + 4*pLSadj);
    ctx.stroke();

    // Étiquette
    ctx.fillStyle = inst.color;
    ctx.font = 'bold 22px "DM Sans",sans-serif';
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    ctx.fillText(inst.short + slot.idx + (slot.isAux?' ★':''), pLM - 14, yTop + 2*pLSadj);

    // Clé
    ctx.fillStyle = '#000';
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    const useTenorVTSpdf = VTS_tenorClef[slot.slotId];
    if(useTenorVTSpdf && typeof STR_drawTenorClef === 'function'){
      STR_drawTenorClef(ctx, pLM + 8, yTop, pLSadj);
    } else if(inst.clef === 'treble'){
      const fs = pLSadj * 5.4;
      ctx.font = `${fs}px "Times New Roman",Georgia,serif`;
      const m = ctx.measureText('\uD834\uDD1E');
      const h = (m.actualBoundingBoxAscent||fs*0.75) + (m.actualBoundingBoxDescent||fs*0.25);
      ctx.fillText('\uD834\uDD1E', pLM + 8, (yTop + 3*pLSadj) + h*0.38 - (m.actualBoundingBoxDescent||fs*0.25));
    } else {
      const bfs = pLSadj * 4.0;
      ctx.font = `${bfs}px "Times New Roman",Georgia,serif`;
      const m = ctx.measureText('\uD834\uDD22');
      const h = (m.actualBoundingBoxAscent||bfs*0.8) + (m.actualBoundingBoxDescent||bfs*0.1);
      ctx.fillText('\uD834\uDD22', pLM + 10, (yTop + pLSadj) - h*0.15 + (m.actualBoundingBoxAscent||bfs*0.8));
    }
  });

  // Armure
  const ksN = VTS_keyInfo.sharps || 0;
  const sharpTP = [0,1.5,-0.5,1,2.5,0.5,2], sharpBP = [1,2.5,0.5,2,3.5,1.5,3];
  const flatTP = [2,0.5,2.5,1,3,1.5,3.5], flatBP = [3,1.5,3.5,2,4,2.5,4.5];
  let pKsX = pLM + 100;
  stavesData.forEach(s=>{
    const tpS = s.inst.clef === 'treble' ? sharpTP : sharpBP;
    const tpF = s.inst.clef === 'treble' ? flatTP : flatBP;
    if(ksN > 0){
      ctx.font = `${pLSadj*1.7}px "Times New Roman",Georgia,serif`;
      ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillStyle = '#000';
      for(let i=0; i<ksN && i<7; i++) ctx.fillText('\u266F', pKsX + i*22, s.yTop + tpS[i]*pLSadj);
    } else if(ksN < 0){
      const cnt = -ksN;
      ctx.font = `${pLSadj*1.9}px "Times New Roman",Georgia,serif`;
      ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillStyle = '#000';
      for(let i=0; i<cnt && i<7; i++) ctx.fillText('\u266D', pKsX + i*22, s.yTop + tpF[i]*pLSadj);
    }
  });
  if(ksN !== 0) pKsX += Math.abs(ksN)*22 + 14;

  // Notes
  function pMY(midi, yTop, clefKind){
    const oct = Math.floor(midi/12) - 1;
    const pc = midi%12;
    const diaPos = oct*7 + VTS_DIA[pc];
    if(clefKind === 'treble') return yTop + 2*pLSadj - (diaPos - 34) * (pLSadj/2);
    if(clefKind === 'tenor')  return yTop + 2*pLSadj - (diaPos - 26) * (pLSadj/2);
    return yTop + 2*pLSadj - (diaPos - 22) * (pLSadj/2);
  }
  const noteStart = pKsX + 50;
  const chW = Math.min(220, (W - noteStart - pRM - 30) / VTS_chords.length);
  const pNS = 14 * scale;

  VTS_chords.forEach((ch, ci)=>{
    const x = noteStart + ci*chW + chW/2;
    stavesData.forEach(s=>{
      const midi = ch.notes[s.slot.slotId];
      if(midi == null) return;
      const effectiveClefPDF = VTS_tenorClef[s.slot.slotId] ? 'tenor' : s.inst.clef;
      const y = pMY(midi, s.yTop, effectiveClefPDF);
      const yTop = s.yTop, yBot = s.yTop + 4*pLSadj;
      ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
      if(y < yTop) for(let ly = yTop - pLSadj; ly >= y - 2; ly -= pLSadj){
        ctx.beginPath(); ctx.moveTo(x-24, ly); ctx.lineTo(x+24, ly); ctx.stroke();
      }
      if(y > yBot) for(let ly = yBot + pLSadj; ly <= y + 2; ly += pLSadj){
        ctx.beginPath(); ctx.moveTo(x-24, ly); ctx.lineTo(x+24, ly); ctx.stroke();
      }
      // Notehead
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-0.18);
      ctx.beginPath();
      ctx.ellipse(0, 0, pNS+3, pNS-4, 0, 0, Math.PI*2);
      ctx.fillStyle = s.inst.color;
      ctx.fill();
      ctx.restore();
    });
    if(ci < VTS_chords.length - 1){
      ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
      const bx = x + chW/2;
      stavesData.forEach(s=>{
        ctx.beginPath();
        ctx.moveTo(bx, s.yTop);
        ctx.lineTo(bx, s.yTop + 4*pLSadj);
        ctx.stroke();
      });
    }
  });
  // Double barre finale
  if(VTS_chords.length){
    const lx = noteStart + (VTS_chords.length-1)*chW + chW/2 + chW/2;
    ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
    stavesData.forEach(s=>{
      ctx.beginPath();
      ctx.moveTo(lx, s.yTop);
      ctx.lineTo(lx, s.yTop + 4*pLSadj);
      ctx.stroke();
    });
    ctx.lineWidth = 7;
    stavesData.forEach(s=>{
      ctx.beginPath();
      ctx.moveTo(lx+8, s.yTop);
      ctx.lineTo(lx+8, s.yTop + 4*pLSadj);
      ctx.stroke();
    });
  }

  // Output
  const pngData = c.toDataURL('image/png');
  const title = tx("Analyse — Vents","Analysis — Winds","Análisis — Vientos");
  const w = window.open('','_blank');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
@page{size:letter landscape;margin:0.4in 0.5in}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'DM Sans',sans-serif;color:#111827}
h1{font-size:18px;font-weight:700;color:#534AB7;margin-bottom:3px}
.sub{font-size:11px;color:#6b7280;margin-bottom:10px}
.staff-container{width:100%;overflow:visible}
.staff-container img{width:100%;height:auto;display:block}
@media print{
  body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .staff-container img{width:100%;height:auto}
}
</style></head><body>
<h1>${title} : ${keyName}</h1>
<div class="sub">${staves} ${tx('portée(s)','staves','pentagrama(s)')}</div>
<div class="staff-container"><img src="${pngData}" alt="${title}"></div>
</body></html>`);
  w.document.close();
  setTimeout(()=> w.print(), 500);
}

/* ═══════════════════════════════════════════════════════════════════
   PANNEAU THÉORIE — Style Liszt avec accolades couleur par famille
   Sections : Tessitures / Transpositions / Mélanges & doublures / Erreurs
   ═══════════════════════════════════════════════════════════════════ */
function VTS_renderTheoryPanel(){
  const el = document.getElementById('vts_theoryPanel'); if(!el) return;
  const L = currentLang;
  const pick = o => o[L] || o.fr;

  // Helper : familles dans l'ordre
  const families = [
    {fkey:'flutes',    base:'FL',  aux:'PICC', color:'#4F46E5', label:{fr:'Flûtes',en:'Flutes',es:'Flautas'}},
    {fkey:'oboes',     base:'OB',  aux:'CA',   color:'#059669', label:{fr:'Hautbois',en:'Oboes',es:'Oboes'}},
    {fkey:'clarinets', base:'CL',  aux:'CLB',  color:'#D97706', label:{fr:'Clarinettes',en:'Clarinets',es:'Clarinetes'}},
    {fkey:'bassoons',  base:'BN',  aux:'CBN',  color:'#DC2626', label:{fr:'Bassons',en:'Bassoons',es:'Fagotes'}}
  ];

  // ─── Section 1 : Tessitures (par famille avec accolade colorée) ───
  let h = `<div class="vts-theory">`;
  h += `<h3 style="font-size:13px;color:#534AB7;margin:0 0 8px;border-bottom:1px solid #e5e7eb;padding-bottom:4px">${tx('1. Tessitures','1. Ranges','1. Tesituras')}</h3>`;
  families.forEach(f=>{
    const insts = [VTS_INSTRUMENTS[f.base], VTS_INSTRUMENTS[f.aux]];
    h += `<div style="display:flex;gap:8px;margin-bottom:8px">
      <div style="width:5px;background:${f.color};border-radius:3px;flex-shrink:0"></div>
      <div style="flex:1">
        <div style="font-weight:600;color:${f.color};font-size:11.5px;margin-bottom:4px">${pick(f.label)}</div>
        <table style="width:100%;border-collapse:collapse;font-size:10px">
          <tr style="background:#f5f3ff">
            <th style="padding:3px 6px;text-align:left;border:1px solid #e5e7eb">${tx('Instrument','Instrument','Instrumento')}</th>
            <th style="padding:3px 6px;border:1px solid #e5e7eb">${tx('Écrit','Written','Escrito')}</th>
            <th style="padding:3px 6px;border:1px solid #e5e7eb">${tx('Sonore','Sounding','Sonoro')}</th>
            <th style="padding:3px 6px;border:1px solid #e5e7eb">${tx('Clé','Clef','Clave')}</th>
          </tr>`;
    insts.forEach(inst=>{
      if(!inst) return;
      const wn1 = VTS_midiToName(inst.written.lo, false);
      const wn2 = VTS_midiToName(inst.written.hi, false);
      const sn1 = VTS_midiToName(inst.sounding.lo, false);
      const sn2 = VTS_midiToName(inst.sounding.hi, false);
      const clef = inst.clef==='treble'? tx('Sol','Treble','Sol') : tx('Fa','Bass','Fa');
      h += `<tr>
        <td style="padding:3px 6px;border:1px solid #f0f0f4"><strong>${pick(inst.label)}</strong></td>
        <td style="padding:3px 6px;border:1px solid #f0f0f4">${wn1}–${wn2}</td>
        <td style="padding:3px 6px;border:1px solid #f0f0f4">${sn1}–${sn2}</td>
        <td style="padding:3px 6px;border:1px solid #f0f0f4">${clef}</td>
      </tr>`;
    });
    h += `</table></div></div>`;
  });

  // ─── Section 2 : Transpositions ───
  h += `<h3 style="font-size:13px;color:#534AB7;margin:14px 0 8px;border-bottom:1px solid #e5e7eb;padding-bottom:4px">${tx('2. Transpositions','2. Transpositions','2. Transposiciones')}</h3>`;
  h += `<table style="width:100%;border-collapse:collapse;font-size:10px;margin-bottom:8px">
    <tr style="background:#f5f3ff">
      <th style="padding:3px 6px;text-align:left;border:1px solid #e5e7eb">${tx('Instrument','Instrument','Instrumento')}</th>
      <th style="padding:3px 6px;border:1px solid #e5e7eb">${tx('Tonalité','Key','Tonalidad')}</th>
      <th style="padding:3px 6px;border:1px solid #e5e7eb">${tx('Décalage','Offset','Desfase')}</th>
      <th style="padding:3px 6px;text-align:left;border:1px solid #e5e7eb">${tx('Exemple','Example','Ejemplo')}</th>
    </tr>`;
  const transData = [
    {id:'PICC', key:'C', off:'+1 8ve', ex:{fr:'Do écrit → Do octave sup.', en:'Written C → C one 8ve up', es:'Do escrito → Do una 8ª arriba'}},
    {id:'CA',   key:'F', off:'-5J',    ex:{fr:'Do écrit → Fa grave',       en:'Written C → F below',         es:'Do escrito → Fa grave'}},
    {id:'CL',   key:'Bb',off:'-2m',    ex:{fr:'Do écrit → Sib grave',      en:'Written C → Bb below',        es:'Do escrito → Sib grave'}},
    {id:'CLB',  key:'Bb',off:'-9M',    ex:{fr:'Do écrit → Sib 9ce inf.',   en:'Written C → Bb (9th below)',  es:'Do escrito → Sib (9ª abajo)'}},
    {id:'CBN',  key:'C', off:'-1 8ve', ex:{fr:'Do écrit → Do octave inf.', en:'Written C → C one 8ve down',  es:'Do escrito → Do una 8ª abajo'}}
  ];
  transData.forEach(t=>{
    const inst = VTS_INSTRUMENTS[t.id];
    h += `<tr>
      <td style="padding:3px 6px;border:1px solid #f0f0f4"><strong style="color:${inst.color}">${pick(inst.label)}</strong></td>
      <td style="padding:3px 6px;border:1px solid #f0f0f4">${t.key}</td>
      <td style="padding:3px 6px;border:1px solid #f0f0f4">${t.off}</td>
      <td style="padding:3px 6px;border:1px solid #f0f0f4">${pick(t.ex)}</td>
    </tr>`;
  });
  h += `</table>
  <p style="font-size:10px;color:var(--t2);line-height:1.6">${tx(
    "Les instruments transpositeurs sonnent à une hauteur différente de celle écrite. La saisie se fait toujours en note écrite (telle qu'elle apparaît sur la partition).",
    "Transposing instruments sound at a different pitch than written. Input is always in written notation (as it appears on the score).",
    "Los instrumentos transpositores suenan en una altura distinta a la escrita. La entrada se hace siempre en nota escrita (tal como aparece en la partitura)."
  )}</p>`;

  // ─── Section 3 : Mélanges & doublures ───
  h += `<h3 style="font-size:13px;color:#534AB7;margin:14px 0 8px;border-bottom:1px solid #e5e7eb;padding-bottom:4px">${tx('3. Mélanges & doublures','3. Blends & doublings','3. Mezclas y duplicaciones')}</h3>`;
  const blends = [
    {ids:['FL','CL'],   desc:{fr:'Fl+Cl : pur, neutre, transparent', en:'Fl+Cl: pure, neutral, transparent', es:'Fl+Cl: puro, neutro, transparente'}},
    {ids:['FL','OB'],   desc:{fr:'Fl+Hb : mélange riche (Hb prédominant à l\'unisson)', en:'Fl+Ob: rich blend (Ob dominant at unison)', es:'Fl+Ob: mezcla rica (Ob dominante al unísono)'}},
    {ids:['OB','CL'],   desc:{fr:'Hb+Cl : contraste, chantant', en:'Ob+Cl: contrast, singing', es:'Ob+Cl: contraste, cantabile'}},
    {ids:['CL','BN'],   desc:{fr:'Cl+Bn : mélange noble, profond (équivalent vents du Vl/Vc)', en:'Cl+Bn: noble, deep blend (winds equivalent of Vn/Vc)', es:'Cl+Bn: mezcla noble, profunda (equivalente Vn/Vc de vientos)'}},
    {ids:['OB','BN'],   desc:{fr:'Hb+Bn : double anche — homogène et corsé', en:'Ob+Bn: double-reed — homogeneous, full-bodied', es:'Ob+Fag: doble caña — homogéneo y consistente'}},
    {ids:['PICC','FL'], desc:{fr:'Picc+Fl à l\'octave : éclat aigu classique', en:'Picc+Fl at octave: classic high brilliance', es:'Picc+Fl a la octava: brillo agudo clásico'}},
    {ids:['CA','BN'],   desc:{fr:'C.A.+Bn : nostalgique, automnal', en:'E.H.+Bn: nostalgic, autumnal', es:'C.I.+Fag: nostálgico, otoñal'}}
  ];
  h += `<ul style="margin:0 0 0 18px;padding:0;font-size:10.5px;line-height:1.8">`;
  blends.forEach(b=>{
    const i1 = VTS_INSTRUMENTS[b.ids[0]], i2 = VTS_INSTRUMENTS[b.ids[1]];
    h += `<li><strong style="color:${i1.color}">${i1.short}</strong> + <strong style="color:${i2.color}">${i2.short}</strong> — ${pick(b.desc)}</li>`;
  });
  h += `</ul>`;

  // ─── Section 4 : Erreurs courantes ───
  h += `<h3 style="font-size:13px;color:#534AB7;margin:14px 0 8px;border-bottom:1px solid #e5e7eb;padding-bottom:4px">${tx('4. Erreurs courantes','4. Common mistakes','4. Errores comunes')}</h3>`;
  const errs = [
    {fr:'Doubler la flûte et le hautbois à l\'unisson : le hautbois domine et la flûte perd son identité timbrique.',
     en:'Doubling flute and oboe at unison: oboe dominates and flute loses its tone identity.',
     es:'Duplicar flauta y oboe al unísono: el oboe domina y la flauta pierde su identidad tímbrica.'},
    {fr:'Trous d\'octave entre deux pupitres adjacents — l\'orchestration sonne creuse.',
     en:'Octave gaps between adjacent desks — orchestration sounds hollow.',
     es:'Huecos de octava entre atriles adyacentes — la orquestación suena hueca.'},
    {fr:'Notes tenues dans le registre aigu pour le hautbois ou le basson : fatigue rapide de l\'anche.',
     en:'Long held notes in the high register for oboe or bassoon: rapid reed fatigue.',
     es:'Notas tenidas en el registro agudo para oboe o fagot: fatiga rápida de la caña.'},
    {fr:'Mélodie importante au registre de gorge de la clarinette (Sib3–Sib4 écrit) : neutre, sans projection.',
     en:'Important melody in the clarinet throat register (Bb3–Bb4 written): neutral, no projection.',
     es:'Melodía importante en el registro de garganta del clarinete (Sib3–Sib4 escrito): neutra, sin proyección.'},
    {fr:'Piccolo dans son grave (D4–B4 écrit) : faible et sans personnalité — à éviter.',
     en:'Piccolo in its low register (D4–B4 written): weak and characterless — avoid.',
     es:'Flautín en su grave (Re4–Si4 escrito): débil y sin carácter — evitar.'},
    {fr:'Sauts mélodiques de plus d\'une 10e diatonique : possibles aux bois, mais à utiliser avec parcimonie.',
     en:'Melodic leaps larger than a diatonic 10th: possible on woodwinds, but use sparingly.',
     es:'Saltos melódicos mayores que una 10ª diatónica: posibles en maderas, pero usar con moderación.'}
  ];
  h += `<ul style="margin:0 0 0 18px;padding:0;font-size:10.5px;line-height:1.7">`;
  errs.forEach(e=> h += `<li style="margin-bottom:4px">${pick(e)}</li>`);
  h += `</ul>`;

  h += `</div>`;
  el.innerHTML = h;
}

/* ═══════════════════════════════════════════════════════════════════
   INITIALISATION — appelée par AH_setMode('VENTS')
   ═══════════════════════════════════════════════════════════════════ */
let VTS_initialized = false;
let VTS_dragInited = false;
function VTS_init(){
  if(!VTS_initialized){
    VTS_buildConfigPanel();
    VTS_buildActiveInsts();
    VTS_buildKeySelector();
    VTS_buildInputs();
    VTS_renderTheoryPanel();
    const sel = document.getElementById('vts_keySel');
    if(sel) sel.value = '0';
    VTS_keyInfo = {root:0, minor:false, sharps:0};
    VTS_initialized = true;
  }
  if(!VTS_dragInited){
    VTS_dragInited = true;
    AH_initCanvasDrag({
      canvasId: 'vts_scoreCanvas',
      getNoteAt(cx, cy){
        return VTS_noteHits.find(h=>Math.hypot(cx-h.x, cy-h.y)<=h.r) || null;
      },
      snapMidi(drag, cy){
        // snap diatonique : dy en pixels / (LS/2) = steps diatoniques
        const dy = drag.y - cy;
        const diaSteps = Math.round(dy / (VTS_LS/2));
        // Convertir startMidi en diatonique, ajouter diaSteps, reconvertir
        const DIA = [0,0,1,1,2,3,3,4,4,5,5,6];
        const CHR = [0,2,4,5,7,9,11]; // diatonic→semitone offset within octave
        function toDia(m){ return Math.floor(m/12)*7 + DIA[m%12]; }
        function fromDia(d){ const o=Math.floor(d/7); const s=((d%7)+7)%7; return o*12+CHR[s]; }
        return Math.max(0, Math.min(127, fromDia(toDia(drag.startMidi)+diaSteps)));
      },
      setMidi(drag, midi, preview){
        // Mettre à jour l'accord source
        if(VTS_chords[drag.chordIdx]) VTS_chords[drag.chordIdx].notes[drag.slotId] = midi;
        // Mettre à jour l'input
        const inp = document.getElementById('vts_in_'+drag.slotId);
        if(inp){ inp.value = VTS_midiToName(midi, VTS_keyInfo.sharps<0); }
        VTS_updateRegisterBadge(drag.slotId);
        VTS_analyze(); VTS_render();
        if(!preview) try{window.dispatchEvent(new CustomEvent('contrepoint:chordschange'));}catch(e){}
      },
      onDragEnd(){}
    });
  }
  VTS_analyze();
  VTS_render();
}

/* ─── Re-render on language change ─── */
window.addEventListener('contrepoint:langchange', ()=>{
  if(window.AH_currentMode === 'VENTS' && VTS_initialized){
    VTS_buildConfigPanel();
    VTS_buildKeySelector();
    VTS_buildInputs();
    VTS_renderTheoryPanel();
    VTS_analyze();
    VTS_render();
    if(typeof applyI18n==='function') applyI18n(currentLang);
  }
});

/* ─── Re-render on resize ─── */
window.addEventListener('resize', ()=>{
  if(window.AH_currentMode === 'VENTS' && VTS_initialized) VTS_render();
});

/* ─── Exports globaux ─── */
window.VTS_init = VTS_init;
window.VTS_onConfigChange = VTS_onConfigChange;
window.VTS_updateKey = VTS_updateKey;
window.VTS_onModeChange = VTS_onModeChange;
window.VTS_onNoteInput = VTS_onNoteInput;
window.VTS_addChord = VTS_addChord;
window.VTS_updateChord = VTS_updateChord;
window.VTS_removeSelected = VTS_removeSelected;
window.VTS_clearAll = VTS_clearAll;
window.VTS_selectChord = VTS_selectChord;
window.VTS_playSelected = VTS_playSelected;
window.VTS_playAll = VTS_playAll;
window.VTS_exportPDF = VTS_exportPDF;
window.VTS_toggleTenorClef = VTS_toggleTenorClef;
window.VTS_INSTRUMENTS = VTS_INSTRUMENTS;

/* ███  FIN MODULE VENTS  ███████████████████████████████████████████ */




/* ███  MODULE CUIVRES (BRS_*)  ████████████████████████████████████████
   Analyseur harmonique — Écriture pour cuivres
   Préfixe BRS_ — N'écrit JAMAIS dans l'état SATB ou VENTS.
   ══════════════════════════════════════════════════════════════════════ */

const BRS_INSTRUMENTS = {
  // ── Cors (6 tonalités) ──
  COR:    { name:{fr:'Cor en Fa',   en:'Horn in F',   es:'Trompa en Fa'},   short:'Cor',  transpose:-7,  clef:'treble', written:{lo:60,hi:91}, sounding:{lo:53,hi:84}, color:'#7C3AED', registers:{low:[60,67],mid:[68,79],high:[80,88],extreme:[89,99]} },
  COR_Eb: { name:{fr:'Cor en Mi♭', en:'Horn in E♭',  es:'Trompa en Mi♭'},  short:'Cor',  transpose:-9,  clef:'treble', written:{lo:60,hi:91}, sounding:{lo:51,hi:82}, color:'#7C3AED', registers:{low:[60,67],mid:[68,79],high:[80,88],extreme:[89,99]} },
  COR_E:  { name:{fr:'Cor en Mi',  en:'Horn in E',   es:'Trompa en Mi'},   short:'Cor',  transpose:-8,  clef:'treble', written:{lo:60,hi:91}, sounding:{lo:52,hi:83}, color:'#7C3AED', registers:{low:[60,67],mid:[68,79],high:[80,88],extreme:[89,99]} },
  COR_D:  { name:{fr:'Cor en Ré',  en:'Horn in D',   es:'Trompa en Re'},   short:'Cor',  transpose:-10, clef:'treble', written:{lo:60,hi:91}, sounding:{lo:50,hi:81}, color:'#7C3AED', registers:{low:[60,67],mid:[68,79],high:[80,88],extreme:[89,99]} },
  COR_A:  { name:{fr:'Cor en La',  en:'Horn in A',   es:'Trompa en La'},   short:'Cor',  transpose:-3,  clef:'treble', written:{lo:60,hi:91}, sounding:{lo:57,hi:88}, color:'#7C3AED', registers:{low:[60,67],mid:[68,79],high:[80,88],extreme:[89,99]} },
  COR_Bb: { name:{fr:'Cor en Si♭', en:'Horn in B♭',  es:'Trompa en Si♭'},  short:'Cor',  transpose:-2,  clef:'treble', written:{lo:60,hi:91}, sounding:{lo:58,hi:89}, color:'#7C3AED', registers:{low:[60,67],mid:[68,79],high:[80,88],extreme:[89,99]} },
  // ── Trompettes (4 tonalités) ──
  TRP:    { name:{fr:'Trompette Si♭',en:'Trumpet in B♭',es:'Trompeta en Si♭'}, short:'Trp',  transpose:-2, clef:'treble', written:{lo:54,hi:91}, sounding:{lo:52,hi:89}, color:'#DB2777', registers:{low:[54,63],mid:[64,75],high:[76,85],extreme:[86,99]} },
  TRP_Eb: { name:{fr:'Trompette Mi♭',en:'Trumpet in E♭',es:'Trompeta en Mi♭'}, short:'Trp',  transpose:3,  clef:'treble', written:{lo:54,hi:91}, sounding:{lo:57,hi:94}, color:'#DB2777', registers:{low:[54,63],mid:[64,75],high:[76,85],extreme:[86,99]} },
  TRP_F:  { name:{fr:'Trompette Fa', en:'Trumpet in F', es:'Trompeta en Fa'},  short:'Trp',  transpose:5,  clef:'treble', written:{lo:54,hi:91}, sounding:{lo:59,hi:96}, color:'#DB2777', registers:{low:[54,63],mid:[64,75],high:[76,85],extreme:[86,99]} },
  TRP_D:  { name:{fr:'Petite Trp Ré',en:'Piccolo Trp D',es:'Trp Pequeña Re'}, short:'Trp',  transpose:2,  clef:'treble', written:{lo:54,hi:91}, sounding:{lo:56,hi:93}, color:'#DB2777', registers:{low:[54,63],mid:[64,75],high:[76,85],extreme:[86,99]} },
  // ── Cornet à pistons ──
  CORNET: { name:{fr:'Cornet à pistons Si♭',en:'Cornet in B♭',es:'Corneta en Si♭'}, short:'Cnt', transpose:-2, clef:'treble', written:{lo:54,hi:91}, sounding:{lo:52,hi:89}, color:'#F43F5E', registers:{low:[54,63],mid:[64,75],high:[76,85],extreme:[86,99]} },
  // ── Trombones ──
  TRBT:   { name:{fr:'Trombone Ténor',en:'Tenor Trombone',es:'Trombón Tenor'}, short:'Trb',  transpose:0, clef:'bass', written:{lo:36,hi:82}, sounding:{lo:36,hi:82}, color:'#0369A1', registers:{low:[36,47],mid:[48,60],high:[61,72],extreme:[73,99]} },
  TRBB:   { name:{fr:'Trombone Basse',en:'Bass Trombone', es:'Trombón Bajo'},  short:'TrbB', transpose:0, clef:'bass', written:{lo:34,hi:79}, sounding:{lo:34,hi:79}, color:'#0284C7', registers:{low:[34,47],mid:[48,58],high:[59,70],extreme:[71,99]} },
  // ── Tuba ──
  TUBA:   { name:{fr:'Tuba',en:'Tuba',es:'Tuba'}, short:'Tuba', transpose:0, clef:'bass', written:{lo:22,hi:65}, sounding:{lo:22,hi:65}, color:'#374151', registers:{low:[22,36],mid:[37,50],high:[51,65],extreme:[66,99]} }
};

/* Types disponibles par famille */
const BRS_COR_TYPES  = [
  { instId:'COR',    label:{fr:'Fa (standard)',en:'F (standard)',es:'Fa (estándar)'} },
  { instId:'COR_Eb', label:{fr:'Mi♭',en:'E♭',es:'Mi♭'} },
  { instId:'COR_E',  label:{fr:'Mi',en:'E',es:'Mi'} },
  { instId:'COR_D',  label:{fr:'Ré',en:'D',es:'Re'} },
  { instId:'COR_A',  label:{fr:'La',en:'A',es:'La'} },
  { instId:'COR_Bb', label:{fr:'Si♭',en:'B♭',es:'Si♭'} },
];
const BRS_TRP_TYPES  = [
  { instId:'TRP',    label:{fr:'Si♭ (standard)',en:'B♭ (standard)',es:'Si♭ (estándar)'} },
  { instId:'TRP_Eb', label:{fr:'Mi♭',en:'E♭',es:'Mi♭'} },
  { instId:'TRP_F',  label:{fr:'Fa',en:'F',es:'Fa'} },
  { instId:'TRP_D',  label:{fr:'Ré (petite)',en:'D (piccolo)',es:'Re (pequeña)'} },
];

/* Familles configurables */
const BRS_FAMILIES = [
  { key:'cors',      instId:'COR',  maxCount:4, label:{fr:'Cors',             en:'Horns',           es:'Trompas'},
    auxLabel:{fr:'Cor 4 → Solo',    en:'Horn 4 → Solo',   es:'Trompa 4 → Solo'}, hasAux:true, types:BRS_COR_TYPES },
  { key:'trp',       instId:'TRP',  maxCount:3, label:{fr:'Trompettes',       en:'Trumpets',        es:'Trompetas'},
    auxLabel:{fr:'Trb.3 → Trb. Basse',en:'Trb.3 → Bass Trb.',es:'Trb.3 → Trb. Bajo'}, hasAux:false, types:BRS_TRP_TYPES },
  { key:'cornet',    instId:'CORNET',maxCount:3,label:{fr:'Cornets à pistons',en:'Cornets',         es:'Cornetas a pistones'},
    auxLabel:'', hasAux:false },
  { key:'trombones', instId:'TRBT', maxCount:3, label:{fr:'Trombones',        en:'Trombones',       es:'Trombones'},
    auxLabel:{fr:'Trb.3 → Trb. Basse',en:'Trb.3 → Bass Trb.',es:'Trb.3 → Trb. Bajo'}, hasAux:true, auxInst:'TRBB' },
  { key:'tuba',      instId:'TUBA', maxCount:1, label:{fr:'Tuba',             en:'Tuba',            es:'Tuba'},
    auxLabel:{fr:'+ Contretuba',    en:'+ Contratuba',    es:'+ Contratuba'},      hasAux:true }
];

/* Config par défaut */
let BRS_config = {
  cors:      { count:4, aux:false, type:'COR'  },
  trp:       { count:3, aux:false, type:'TRP'  },
  cornet:    { count:0, aux:false, type:'CORNET'},
  trombones: { count:2, aux:false, type:'TRBT' },
  tuba:      { count:1, aux:false, type:'TUBA' }
};

let BRS_activeInsts  = [];
let BRS_chords       = [];
let BRS_selChord     = -1;
let BRS_noteHits     = [];  // pour drag detection
const BRS_MAX_CHORDS = 20;
let BRS_keyInfo      = { root:0, minor:false, sharps:0 };
let BRS_errors       = [];
let BRS_mode         = 'single'; // 'single' | 'progression'
let BRS_tenorClef    = {}; // {slotId: bool} — clef de ténor pour trombone ténor

/* ── Constants for staff rendering (same as VTS) ─────────────────── */
const BRS_DIA = [0,0,1,1,2,3,3,4,4,5,5,6];
const BRS_LM  = 90, BRS_RM = 20, BRS_LS = 9;

/* ── Helpers ─────────────────────────────────────────────────────── */
function BRS_writtenToSounding(midi, instId){
  const inst = BRS_INSTRUMENTS[instId]; if(!inst) return midi;
  return midi + inst.transpose;
}
function BRS_inRange(midiWritten, instId){
  const inst = BRS_INSTRUMENTS[instId]; if(!inst) return false;
  return midiWritten >= inst.written.lo && midiWritten <= inst.written.hi;
}
function BRS_getRegister(midiWritten, instId){
  const inst = BRS_INSTRUMENTS[instId]; if(!inst) return null;
  for(const [reg,[lo,hi]] of Object.entries(inst.registers)){
    if(midiWritten >= lo && midiWritten <= hi) return reg;
  }
  return null;
}

const BRS_NOTE_S = ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
const BRS_NOTE_F = ['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'];
function BRS_midiToName(midi, useFlats){
  const oct = Math.floor(midi/12)-1;
  const pc  = ((midi%12)+12)%12;
  return (useFlats ? BRS_NOTE_F : BRS_NOTE_S)[pc] + oct;
}
function BRS_parseNote(str){
  if(!str) return null;
  const m = str.trim().match(/^([A-Ga-g])(#|b|♭|♯)?(\d)$/);
  if(!m) return null;
  const pc = {C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1].toUpperCase()];
  if(pc===undefined) return null;
  const acc = (m[2]==='#'||m[2]==='♯')?1:(m[2]==='b'||m[2]==='♭')?-1:0;
  return (parseInt(m[3])+1)*12 + pc + acc;
}
function BRS_midiToY(midi, staffTop, clef){
  const oct = Math.floor(midi/12)-1;
  const pc  = ((midi%12)+12)%12;
  const diaPos = oct*7 + BRS_DIA[pc];
  if(clef === 'treble') return staffTop + 2*BRS_LS - (diaPos - 34)*(BRS_LS/2);
  return staffTop + 2*BRS_LS - (diaPos - 22)*(BRS_LS/2);
}
function BRS_interval(a,b){ return Math.abs(b-a)%12; }
function BRS_motionType(v1a,v1b,v2a,v2b){
  const d1=v1b-v1a, d2=v2b-v2a;
  if(d1===0||d2===0) return 'oblique';
  return (d1>0&&d2>0)||(d1<0&&d2<0) ? 'similar' : 'contrary';
}

const BRS_KEY_LIST = [
  {name:'Do majeur',  nameEn:'C major',  nameEs:'Do mayor', root:0, minor:false,sharps:0},
  {name:'Sol majeur', nameEn:'G major',  nameEs:'Sol mayor',root:7, minor:false,sharps:1},
  {name:'Ré majeur',  nameEn:'D major',  nameEs:'Re mayor', root:2, minor:false,sharps:2},
  {name:'La majeur',  nameEn:'A major',  nameEs:'La mayor', root:9, minor:false,sharps:3},
  {name:'Mi majeur',  nameEn:'E major',  nameEs:'Mi mayor', root:4, minor:false,sharps:4},
  {name:'Si majeur',  nameEn:'B major',  nameEs:'Si mayor', root:11,minor:false,sharps:5},
  {name:'Fa♯ majeur', nameEn:'F♯ major', nameEs:'Fa♯ mayor',root:6, minor:false,sharps:6},
  {name:'Fa majeur',  nameEn:'F major',  nameEs:'Fa mayor', root:5, minor:false,sharps:-1},
  {name:'Si♭ majeur', nameEn:'B♭ major', nameEs:'Si♭ mayor',root:10,minor:false,sharps:-2},
  {name:'Mi♭ majeur', nameEn:'E♭ major', nameEs:'Mi♭ mayor',root:3, minor:false,sharps:-3},
  {name:'La♭ majeur', nameEn:'A♭ major', nameEs:'La♭ mayor',root:8, minor:false,sharps:-4},
  {name:'Ré♭ majeur', nameEn:'D♭ major', nameEs:'Re♭ mayor',root:1, minor:false,sharps:-5},
  {name:'La mineur',  nameEn:'A minor',  nameEs:'La menor', root:9, minor:true, sharps:0},
  {name:'Ré mineur',  nameEn:'D minor',  nameEs:'Re menor', root:2, minor:true, sharps:-1},
  {name:'Sol mineur', nameEn:'G minor',  nameEs:'Sol menor',root:7, minor:true, sharps:-2},
  {name:'Do mineur',  nameEn:'C minor',  nameEs:'Do menor', root:0, minor:true, sharps:-3},
  {name:'Mi mineur',  nameEn:'E minor',  nameEs:'Mi menor', root:4, minor:true, sharps:1},
  {name:'Si mineur',  nameEn:'B minor',  nameEs:'Si menor', root:11,minor:true, sharps:2},
  {name:'Fa♯ mineur', nameEn:'F♯ minor', nameEs:'Fa♯ menor',root:6, minor:true, sharps:3},
  {name:'Do♯ mineur', nameEn:'C♯ minor', nameEs:'Do♯ menor',root:1, minor:true, sharps:4}
];

/* ── Build instrument list ────────────────────────────────────────── */
function BRS_buildActiveInsts(){
  const list = [];
  let n = 0;

  // Cors
  const corInstId = BRS_config.cors.type || 'COR';
  const corCount = Math.min(BRS_config.cors.count, 4);
  for(let i=0;i<corCount;i++){
    list.push({ slotId:`brs_s${n++}`, instId:corInstId, idx:i+1, isAux:false, family:'cors' });
  }
  if(BRS_config.cors.aux && corCount>=4){
    list.push({ slotId:`brs_s${n++}`, instId:corInstId, idx:'S', isAux:true, family:'cors' });
  }

  // Trompettes
  const trpInstId = BRS_config.trp.type || 'TRP';
  const trpCount = Math.min(BRS_config.trp.count, 3);
  for(let i=0;i<trpCount;i++){
    list.push({ slotId:`brs_s${n++}`, instId:trpInstId, idx:i+1, isAux:false, family:'trp' });
  }

  // Cornets à pistons (famille indépendante)
  const cntCount = Math.min(BRS_config.cornet.count, 3);
  for(let i=0;i<cntCount;i++){
    list.push({ slotId:`brs_s${n++}`, instId:'CORNET', idx:i+1, isAux:false, family:'cornet' });
  }

  // Trombones (ténors + basse en auxiliaire)
  const trbCount = Math.min(BRS_config.trombones.count, 3);
  for(let i=0;i<trbCount;i++){
    const isAuxSlot = BRS_config.trombones.aux && i===trbCount-1 && trbCount===3;
    const instId = isAuxSlot ? 'TRBB' : 'TRBT';
    list.push({ slotId:`brs_s${n++}`, instId, idx:i+1, isAux:isAuxSlot, family:'trombones' });
  }

  // Tuba
  if(BRS_config.tuba.count>=1){
    list.push({ slotId:`brs_s${n++}`, instId:'TUBA', idx:1, isAux:false, family:'tuba' });
  }
  if(BRS_config.tuba.aux && BRS_config.tuba.count>=1){
    list.push({ slotId:`brs_s${n++}`, instId:'TUBA', idx:2, isAux:true, family:'tuba' });
  }

  BRS_activeInsts = list;
}

/* ── Config panel (VTS-style grid) ──────────────────────────────── */
function BRS_buildConfigPanel(){
  const el = document.getElementById('brs_configPanel'); if(!el) return;
  const L  = (typeof currentLang!=='undefined') ? currentLang : 'fr';
  const tx2 = (o) => (typeof o === 'object') ? (o[L] || o.fr) : o;

  let h = `<div class="vts-cfg-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin-top:6px">`;

  BRS_FAMILIES.forEach(fam => {
    const cfg  = BRS_config[fam.key];
    const inst = BRS_INSTRUMENTS[fam.instId];
    const color = inst.color;
    const auxDisabled = fam.key==='trombones' ? cfg.count < 3
                      : fam.key==='cors'      ? cfg.count < 4 : cfg.count < 1;

    h += `<div class="vts-family-cfg" style="border-left:3px solid ${color};padding:8px 10px;background:rgba(0,0,0,0.03);border-radius:6px">`;
    h += `<div style="font-weight:600;color:${color};font-size:11px;margin-bottom:6px">🎺 ${tx2(fam.label)}</div>`;

    // Type selector (cors, trompettes)
    if(fam.types && fam.types.length > 1){
      h += `<label style="display:flex;align-items:center;gap:6px;font-size:10px;margin-bottom:4px;color:var(--t2)">`;
      h += `<span>${L==='en'?'Type:':L==='es'?'Tipo:':'Type :'}</span>`;
      h += `<select id="brs_type_${fam.key}" class="note-sel" onchange="BRS_onConfigChange()" style="flex:1;font-size:10px">`;
      fam.types.forEach(t => {
        const sel = (cfg.type === t.instId) ? ' selected' : '';
        h += `<option value="${t.instId}"${sel}>${tx2(t.label)}</option>`;
      });
      h += `</select></label>`;
    }

    // Count selector
    h += `<label style="display:flex;align-items:center;gap:6px;font-size:10.5px;margin-bottom:4px">`;
    h += `<span data-i18n="vts_count">Nombre :</span>`;
    h += `<select id="brs_cfg_${fam.key}" class="note-sel" onchange="BRS_onConfigChange()" style="flex:1">`;
    for(let v=0;v<=fam.maxCount;v++) h += `<option value="${v}"${v===cfg.count?' selected':''}>${v}</option>`;
    h += `</select></label>`;

    // Aux toggle
    if(fam.hasAux && fam.auxLabel){
      h += `<label class="vts-aux-toggle" style="display:flex;align-items:center;gap:6px;font-size:10px;color:var(--t2)">`;
      h += `<input type="checkbox" id="brs_aux_${fam.key}" onchange="BRS_onConfigChange()"${cfg.aux?' checked':''}${auxDisabled?' disabled':''}> `;
      h += tx2(fam.auxLabel);
      h += `</label>`;
    }
    h += `</div>`;
  });

  h += `</div>`;
  h += `<div style="font-size:10px;color:var(--t3);margin-top:8px;line-height:1.5" data-i18n="brs_cfg_hint">💡 Configurez l'effectif par famille. L'auxiliaire remplace/complète le dernier pupitre.</div>`;
  el.innerHTML = h;
}

/* ── Key selector ────────────────────────────────────────────────── */
function BRS_buildKeySelector(){
  const sel = document.getElementById('brs_keySel'); if(!sel) return;
  const L = (typeof currentLang!=='undefined') ? currentLang : 'fr';
  sel.innerHTML = BRS_KEY_LIST.map((k,i)=>{
    const lbl = L==='en' ? k.nameEn : L==='es' ? k.nameEs : k.name;
    return `<option value="${i}">${lbl}</option>`;
  }).join('');
  sel.value = '0';
}

/* ── Voice input rows (VTS-style) ────────────────────────────────── */
function BRS_buildInputs(){
  const el = document.getElementById('brs_voiceInputs'); if(!el) return;
  const L  = (typeof currentLang!=='undefined') ? currentLang : 'fr';

  if(!BRS_activeInsts.length){
    el.innerHTML = `<div style="padding:14px;text-align:center;color:var(--t3);font-size:11px;font-style:italic">${(typeof window.t==='function')?window.t('brs_no_inst'):'Aucun instrument sélectionné.'}</div>`;
    return;
  }

  let lastFamily = null;
  let h = '';

  BRS_activeInsts.forEach(slot => {
    const inst  = BRS_INSTRUMENTS[slot.instId];
    const color = inst.color;
    const name  = inst.name[L] || inst.name.fr;
    const isTransp = inst.transpose !== 0;
    const defMidi = Math.round((inst.written.lo + inst.written.hi)/2);
    const defName = BRS_midiToName(defMidi, false);

    const transpLabel = isTransp
      ? `<span class="vts-trans-label" id="brs_tr_${slot.slotId}" style="font-size:9.5px;color:var(--t3);margin-left:6px"></span>`
      : '';

    // Family separator
    if(slot.family !== lastFamily){
      lastFamily = slot.family;
    }

    const dlId = `brs_dl_${slot.slotId}`;
    const useFlats = BRS_keyInfo ? BRS_keyInfo.sharps < 0 : false;
    const brsOpts = AH_buildNoteOptions(inst.written.lo, inst.written.hi, useFlats);
    const brsDL = `<datalist id="${dlId}">${brsOpts.map(o=>`<option value="${o}">`).join('')}</datalist>`;

    // Bouton clef de ténor pour trombones (TRBT, TRBB)
    const hasTenorClefBRS = (slot.instId === 'TRBT' || slot.instId === 'TRBB');
    const tenorBtnBRS = hasTenorClefBRS
      ? `<button onclick="BRS_toggleTenorClef('${slot.slotId}')" id="brs_tenorbtn_${slot.slotId}" title="${(typeof window.t==='function'&&window.t('str_clef_tenor'))||'Clef de ténor'}"
           style="font-size:9px;padding:2px 6px;border-radius:4px;border:1px solid var(--bd);background:${(BRS_tenorClef&&BRS_tenorClef[slot.slotId])?'#534AB7':'var(--bg)'};color:${(BRS_tenorClef&&BRS_tenorClef[slot.slotId])?'#fff':'var(--t2)'};cursor:pointer;margin-left:2px;font-weight:600" data-i18n="str_clef_tenor">${(typeof window.t==='function'&&window.t('str_clef_tenor'))||'Clef de ténor'}</button>`
      : '';

    h += `
      <div class="voice-row vts-voice-row" style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:5px;background:rgba(0,0,0,0.02);border-left:3px solid ${color}">
        <div class="voice-label" style="font-size:11px;font-weight:600;color:${color};min-width:140px">${name} ${slot.idx}${slot.isAux?' ★':''}</div>
        ${brsDL}
        <input type="text" class="vts-note-input" id="brs_in_${slot.slotId}" value="${defName}"
               list="${dlId}"
               oninput="BRS_onNoteInput('${slot.slotId}')"
               style="width:70px;padding:3px 6px;font-size:11px;text-align:center;border:1px solid var(--bd);border-radius:4px;font-family:monospace">
        ${transpLabel}${tenorBtnBRS}
        <span class="vts-register-badge" id="brs_rb_${slot.slotId}" style="font-size:9px;color:var(--t3);margin-left:auto"></span>
      </div>`;
  });

  el.innerHTML = h;

  BRS_activeInsts.forEach(slot => {
    BRS_updateTransposeDisplay(slot.slotId);
    BRS_updateRegisterBadge(slot.slotId);
  });
}

function BRS_updateTransposeDisplay(slotId){
  const slot = BRS_activeInsts.find(s=>s.slotId===slotId); if(!slot) return;
  const inst = BRS_INSTRUMENTS[slot.instId];
  if(inst.transpose===0) return;
  const inp = document.getElementById('brs_in_'+slotId); if(!inp) return;
  const lbl = document.getElementById('brs_tr_'+slotId); if(!lbl) return;
  const w = BRS_parseNote(inp.value);
  if(w==null){ lbl.textContent=''; return; }
  const s = BRS_writtenToSounding(w, slot.instId);
  const uf = BRS_keyInfo.sharps < 0;
  const wn = BRS_midiToName(w, uf), sn = BRS_midiToName(s, uf);
  const tx2 = (a,b,c) => (typeof currentLang!=='undefined'
    ? (currentLang==='en'?b:currentLang==='es'?c:a) : a);
  lbl.textContent = `(${tx2('écrit','written','escrito')} ${wn} → ${tx2('sonore','sounding','sonoro')} ${sn})`;
}

function BRS_updateRegisterBadge(slotId){
  const slot = BRS_activeInsts.find(s=>s.slotId===slotId); if(!slot) return;
  const inst = BRS_INSTRUMENTS[slot.instId];
  const inp  = document.getElementById('brs_in_'+slotId); if(!inp) return;
  const bdg  = document.getElementById('brs_rb_'+slotId); if(!bdg) return;
  const w = BRS_parseNote(inp.value);
  if(w==null){ bdg.textContent=''; bdg.style.cssText=''; return; }
  const L = (typeof currentLang!=='undefined') ? currentLang : 'fr';
  if(!BRS_inRange(w, slot.instId)){
    bdg.textContent = '⚠ '+(L==='en'?'out of range':L==='es'?'fuera tesitura':'hors tessiture');
    bdg.style.cssText='background:#fee2e2;color:#dc2626;padding:3px 8px;border-radius:20px;font-weight:700;font-size:9.5px;border:1px solid #fca5a5;letter-spacing:0.3px';
    return;
  }
  const reg = BRS_getRegister(w, slot.instId);
  const map = {
    low:     {fr:'♭ grave',  en:'♭ low',     es:'♭ grave',   bg:'#eff6ff',cl:'#1e40af',bd:'#bfdbfe'},
    mid:     {fr:'◆ médium', en:'◆ mid',     es:'◆ medio',   bg:'#f0fdf4',cl:'#166534',bd:'#bbf7d0'},
    high:    {fr:'♯ aigu',  en:'♯ high',    es:'♯ agudo',   bg:'#fffbeb',cl:'#92400e',bd:'#fcd34d'},
    extreme: {fr:'⚡ extrême',en:'⚡ extreme', es:'⚡ extremo', bg:'#fff1f2',cl:'#be123c',bd:'#fda4af'}
  };
  const m = map[reg];
  if(!m){ bdg.textContent=''; return; }
  bdg.textContent = m[L]||m.fr;
  bdg.style.cssText=`background:${m.bg};color:${m.cl};padding:3px 8px;border-radius:20px;font-weight:700;font-size:9.5px;border:1px solid ${m.bd};letter-spacing:0.3px`;
}

/* ── Config / key / mode handlers ────────────────────────────────── */
function BRS_onConfigChange(){
  BRS_FAMILIES.forEach(fam => {
    const c = document.getElementById('brs_cfg_'+fam.key);
    const a = document.getElementById('brs_aux_'+fam.key);
    const t = document.getElementById('brs_type_'+fam.key);
    if(c) BRS_config[fam.key].count = +c.value;
    if(a) BRS_config[fam.key].aux   = !!a.checked;
    if(t) BRS_config[fam.key].type  = t.value;
    // Sync family instId label when type changes
    if(t && fam.types) fam.instId = t.value;
    // Disable aux if not enough instruments
    if(a){
      const threshold = (fam.key==='cors') ? 4 : (fam.hasAux && fam.maxCount>=3) ? 3 : 1;
      a.disabled = BRS_config[fam.key].count < threshold;
      if(a.disabled){ a.checked = false; BRS_config[fam.key].aux = false; }
    }
  });
  BRS_buildActiveInsts();
  BRS_buildInputs();
  BRS_chords = []; BRS_selChord = -1;
  BRS_updateChordCounter();
  BRS_analyze();
  BRS_render();
}

function BRS_updateKey(){
  const sel = document.getElementById('brs_keySel'); if(!sel) return;
  const k = BRS_KEY_LIST[+sel.value];
  if(k) BRS_keyInfo = {root:k.root, minor:k.minor, sharps:k.sharps};
  BRS_activeInsts.forEach(s=>{
    BRS_updateTransposeDisplay(s.slotId);
    BRS_updateRegisterBadge(s.slotId);
  });
  BRS_analyze(); BRS_render();
}

function BRS_onModeChange(){
  const sel = document.getElementById('brs_modeSelect'); if(!sel) return;
  BRS_mode = sel.value;
  if(BRS_mode==='single' && BRS_chords.length>1){
    BRS_chords = [BRS_chords[BRS_chords.length-1]];
    BRS_selChord = 0;
  }
  BRS_analyze(); BRS_render();
}

function BRS_onNoteInput(slotId){
  BRS_updateTransposeDisplay(slotId);
  BRS_updateRegisterBadge(slotId);
}

function BRS_updateChordCounter(){
  const cnt = document.getElementById('brs_chordCount'); if(!cnt) return;
  const L = (typeof currentLang!=='undefined') ? currentLang : 'fr';
  const word = L==='en'?'chords':L==='es'?'acordes':'accords';
  cnt.innerHTML = `${BRS_chords.length} / ${BRS_MAX_CHORDS} <span>${word}</span>`;
}

/* ── Chord management ────────────────────────────────────────────── */
function BRS_getInputChord(){
  const notes = {};
  BRS_activeInsts.forEach(slot=>{
    const inp = document.getElementById('brs_in_'+slot.slotId);
    notes[slot.slotId] = inp ? BRS_parseNote(inp.value) : null;
  });
  return { notes, key:{...BRS_keyInfo} };
}

function BRS_setInputChord(ch){
  const uf = ch.key.sharps < 0;
  BRS_keyInfo = {...ch.key};
  const sel = document.getElementById('brs_keySel');
  if(sel){
    const ki = BRS_KEY_LIST.findIndex(k=>k.root===ch.key.root&&k.minor===ch.key.minor);
    if(ki>=0) sel.value = ki;
  }
  BRS_activeInsts.forEach(slot=>{
    const inp = document.getElementById('brs_in_'+slot.slotId);
    if(inp && ch.notes[slot.slotId]!=null) inp.value = BRS_midiToName(ch.notes[slot.slotId], uf);
    BRS_updateTransposeDisplay(slot.slotId);
    BRS_updateRegisterBadge(slot.slotId);
  });
}

function BRS_addChord(){
  if(BRS_chords.length >= BRS_MAX_CHORDS){
    const L=(typeof currentLang!=='undefined')?currentLang:'fr';
    alert(`Max ${BRS_MAX_CHORDS} ${L==='en'?'chords':L==='es'?'acordes':'accords'}.`); return;
  }
  const ch = BRS_getInputChord();
  if(BRS_mode==='single'){
    BRS_chords = [ch]; BRS_selChord = 0;
  } else {
    BRS_chords.push(ch);
    BRS_selChord = BRS_chords.length-1;
  }
  BRS_updateChordCounter();
  BRS_analyze(); BRS_render();
  try{window.dispatchEvent(new CustomEvent('contrepoint:chordschange'));}catch(e){}
}

function BRS_updateChord(){
  if(BRS_selChord<0||BRS_selChord>=BRS_chords.length) return;
  BRS_chords[BRS_selChord] = BRS_getInputChord();
  BRS_analyze(); BRS_render();
  try{window.dispatchEvent(new CustomEvent('contrepoint:chordschange'));}catch(e){}
}

function BRS_removeSelected(){
  if(BRS_selChord<0) return;
  BRS_chords.splice(BRS_selChord,1);
  BRS_selChord = Math.min(BRS_selChord, BRS_chords.length-1);
  if(BRS_selChord>=0) BRS_setInputChord(BRS_chords[BRS_selChord]);
  else BRS_selChord = -1;
  BRS_updateChordCounter();
  BRS_analyze(); BRS_render();
  try{window.dispatchEvent(new CustomEvent('contrepoint:chordschange'));}catch(e){}
}

function BRS_clearAll(){
  BRS_chords=[]; BRS_selChord=-1;
  BRS_updateChordCounter();
  BRS_analyze(); BRS_render();
  try{window.dispatchEvent(new CustomEvent('contrepoint:chordschange'));}catch(e){}
}

function BRS_selectChord(i){
  BRS_selChord=i;
  if(i>=0&&i<BRS_chords.length) BRS_setInputChord(BRS_chords[i]);
  BRS_analyze(); BRS_render();
}

/* ── Analysis helpers ────────────────────────────────────────────── */
function BRS_chordToVoices(ch){
  return BRS_activeInsts.map(slot=>{
    const w = ch ? ch.notes[slot.slotId] :
      BRS_parseNote((document.getElementById('brs_in_'+slot.slotId)||{}).value);
    return {
      slotId: slot.slotId, instId: slot.instId, family: slot.family,
      written: w,
      sounding: (w!=null) ? BRS_writtenToSounding(w, slot.instId) : null
    };
  }).filter(v=>v.written!=null);
}

/* ── Analysis engine ────────────────────────────────────────────── */
function BRS_analyze(){
  BRS_errors = [];

  // Chords to check: single current or full progression
  const isProgression = BRS_mode==='progression' && BRS_chords.length>0;
  const L = (typeof currentLang!=='undefined') ? currentLang : 'fr';

  const chordsToCheck = isProgression ? BRS_chords : [null];

  chordsToCheck.forEach((ch, ci)=>{
    const voices = BRS_chordToVoices(ch);
    const label  = isProgression ? `[${ci+1}] ` : '';

    const addErr = (type, rule, msg, slot) => BRS_errors.push({type,rule,msg:`${label}${msg}`,slot,chord:ci});

    /* brs_range_out — hors tessiture */
    voices.forEach(v=>{
      if(!BRS_inRange(v.written, v.instId)){
        const iname = BRS_INSTRUMENTS[v.instId].name[L]||BRS_INSTRUMENTS[v.instId].name.fr;
        addErr('error','brs_range_out',`${iname} ${BRS_midiToName(v.written,BRS_keyInfo.sharps<0)} — ${L==='en'?'out of range':L==='es'?'fuera de tesitura':'hors tessiture'}`, v.slotId);
      }
    });

    /* brs_range_extreme — registre extrême */
    voices.forEach(v=>{
      if(!BRS_inRange(v.written,v.instId)) return;
      if(BRS_getRegister(v.written,v.instId)==='extreme'){
        const iname = BRS_INSTRUMENTS[v.instId].name[L]||BRS_INSTRUMENTS[v.instId].name.fr;
        addErr('warn','brs_range_extreme',`${iname} — ${L==='en'?'extreme register (fatigue)':L==='es'?'registro extremo (fatiga)':'registre extrême (fatigue)'}`, v.slotId);
      }
    });

    /* brs_tuba_high — tuba > Do3 midi=48 */
    voices.filter(v=>v.instId==='TUBA').forEach(v=>{
      if(v.written>48){
        addErr('warn','brs_tuba_high', L==='en'?'Tuba: note above C3 (fatigue)':L==='es'?'Tuba: nota sobre Do3 (fatiga)':'Tuba : au-dessus de Do3 (fatigue)', v.slotId);
      }
    });

    /* brs_lt_doubled — sensible doublée */
    const lt = (BRS_keyInfo.root+11)%12;
    const ltV = voices.filter(v=>v.sounding!=null && v.sounding%12===lt);
    if(ltV.length>1){
      addErr('error','brs_lt_doubled', L==='en'?'Doubled leading tone':L==='es'?'Sensible duplicada':'Sensible doublée');
    }

    /* brs_horn_cross — croisement cors (ordre doit rester descendant) */
    const cors = voices.filter(v=>v.instId==='COR');
    for(let i=0;i<cors.length-1;i++){
      if(cors[i].sounding!=null && cors[i+1].sounding!=null && cors[i].sounding < cors[i+1].sounding){
        addErr('warn','brs_horn_cross',
          L==='en'?`Horn crossing (${i+1} below ${i+2})`:L==='es'?`Cruce de trompas (${i+1} debajo de ${i+2})`:`Croisement cors ${i+1}↔${i+2}`, cors[i].slotId);
      }
    }


    /* brs_trb_gliss — intervalle >7 demi-tons entre positions de trombone consécutifs */
    if(isProgression && ci>0 && BRS_chords[ci-1]){
      const prevVoices = BRS_chordToVoices(BRS_chords[ci-1]);
      voices.filter(v=>v.instId==='TRBT'||v.instId==='TRBB').forEach(v=>{
        const pv = prevVoices.find(x=>x.slotId===v.slotId);
        if(pv && pv.written!=null && Math.abs(v.written-pv.written)>7){
          addErr('info','brs_trb_gliss',
            L==='en'?'Trombone: possible glissando (>7 st)':L==='es'?'Trombón: glissando probable (>7 st)':'Trombone : glissando probable (>7 st)', v.slotId);
        }
      });
    }

    /* brs_p5 / brs_p8 — parallèles (progression uniquement) */
    if(isProgression && ci>0 && BRS_chords[ci-1]){
      const prevVoices = BRS_chordToVoices(BRS_chords[ci-1]);
      for(let i=0;i<voices.length-1;i++){
        for(let j=i+1;j<voices.length;j++){
          const v1=voices[i], v2=voices[j];
          const pv1=prevVoices.find(x=>x.slotId===v1.slotId);
          const pv2=prevVoices.find(x=>x.slotId===v2.slotId);
          if(!pv1||!pv2||pv1.sounding==null||pv2.sounding==null) continue;
          const iB = Math.abs(pv1.sounding-pv2.sounding)%12;
          const iA = Math.abs(v1.sounding-v2.sounding)%12;
          const mot = BRS_motionType(pv1.sounding,v1.sounding,pv2.sounding,v2.sounding);
          if(mot==='similar'){
            if(iB===7&&iA===7)
              addErr('error','brs_p5', L==='en'?'Parallel fifths':L==='es'?'Quintas paralelas':'Quintes parallèles', v1.slotId);
            if(iB===0&&iA===0)
              addErr('error','brs_p8', L==='en'?'Parallel octaves':L==='es'?'Octavas paralelas':'Octaves parallèles', v1.slotId);
          }
        }
      }
    }
  });

  /* Afficher erreurs */
  const errEl = document.getElementById('brs_errList');
  const cntEl = document.getElementById('brs_errCount');
  if(cntEl) cntEl.textContent = BRS_errors.length;
  if(!errEl) return;
  if(!BRS_errors.length){
    const L2=(typeof currentLang!=='undefined')?currentLang:'fr';
    errEl.innerHTML = `<div style="font-size:10px;color:#22c55e;padding:6px 0">✓ ${L2==='en'?'No errors detected':L2==='es'?'Sin errores detectados':'Aucune erreur détectée'}</div>`;
    return;
  }
  const icons={error:'🔴',warn:'🟡',info:'🔵'};
  errEl.innerHTML = BRS_errors.map(e=>`<div style="font-size:10px;padding:3px 0;border-bottom:1px solid var(--border)">${icons[e.type]} ${e.msg}</div>`).join('');
}

/* ── Canvas render (VTS-style multi-stave) ───────────────────────── */
function BRS_render(){
  /* Mettre à jour le compteur */
  const cnt = document.getElementById('brs_chordCount');
  if(cnt){
    const L=(typeof currentLang!=='undefined')?currentLang:'fr';
    const word = L==='en'?'chords':L==='es'?'acordes':'accords';
    if(cnt.firstChild && cnt.firstChild.nodeType===3)
      cnt.firstChild.nodeValue = `${BRS_chords.length} / ${BRS_MAX_CHORDS} `;
    else cnt.innerHTML = `${BRS_chords.length} / ${BRS_MAX_CHORDS} <span>${word}</span>`;
  }

  const canvas = document.getElementById('brs_scoreCanvas'); if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const staves = BRS_activeInsts.length;

  if(!staves){
    canvas.width=200; canvas.height=80;
    canvas.style.width='200px'; canvas.style.height='80px';
    ctx.clearRect(0,0,200,80);
    const L=(typeof currentLang!=='undefined')?currentLang:'fr';
    ctx.fillStyle='#9ca3af'; ctx.font='11px sans-serif'; ctx.textAlign='center';
    ctx.fillText(L==='en'?'(no instrument)':L==='es'?'(sin instrumento)':'(aucun instrument)',100,40);
    return;
  }

  const cw = Math.max(900, (canvas.parentElement||{}).clientWidth - 28 || 900);
  const staveGap   = 18;
  const staveHeight = 4 * BRS_LS;
  const top = 26;
  const totalH = top + staves*(staveHeight+staveGap) + 30;

  canvas.style.width  = cw+'px';
  canvas.style.height = totalH+'px';
  canvas.width  = cw*dpr;
  canvas.height = totalH*dpr;
  ctx.scale(dpr,dpr);
  ctx.clearRect(0,0,cw,totalH);

  /* ─ Portées ─ */
  const stavesData = [];
  BRS_activeInsts.forEach((slot,idx)=>{
    const inst = BRS_INSTRUMENTS[slot.instId];
    const yTop = top + idx*(staveHeight+staveGap);
    stavesData.push({slot,inst,yTop});

    ctx.strokeStyle='#555'; ctx.lineWidth=0.8;
    for(let l=0;l<5;l++){
      const y=yTop+l*BRS_LS;
      ctx.beginPath(); ctx.moveTo(BRS_LM,y); ctx.lineTo(cw-BRS_RM,y); ctx.stroke();
    }
    ctx.strokeStyle='#333'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(BRS_LM,yTop); ctx.lineTo(BRS_LM,yTop+4*BRS_LS); ctx.stroke();

    /* Étiquette */
    ctx.fillStyle=inst.color;
    ctx.font='bold 10px "DM Sans",sans-serif';
    ctx.textAlign='right'; ctx.textBaseline='middle';
    const L=(typeof currentLang!=='undefined')?currentLang:'fr';
    const nm = inst.name[L]||inst.name.fr;
    const short = nm.length>10 ? inst.short+(slot.idx==='S'?'S':slot.idx) : nm+' '+slot.idx;
    ctx.fillText(short+(slot.isAux?' ★':''), BRS_LM-8, yTop+2*BRS_LS);

    /* Clé */
    const fs = BRS_LS*4.2;
    ctx.fillStyle='#1e1e2e'; ctx.textAlign='left'; ctx.textBaseline='alphabetic';
    const useTenorBRS = (BRS_tenorClef && BRS_tenorClef[slot.slotId]);
    if(useTenorBRS && typeof STR_drawTenorClef === 'function'){
      STR_drawTenorClef(ctx, BRS_LM + 3, yTop, BRS_LS);
    } else if(inst.clef==='treble'){
      ctx.font=`${fs}px "Times New Roman",Georgia,serif`;
      const m=ctx.measureText('\uD834\uDD1E');
      const h=(m.actualBoundingBoxAscent||fs*0.75)+(m.actualBoundingBoxDescent||fs*0.25);
      ctx.fillText('\uD834\uDD1E', BRS_LM+3, (yTop+3*BRS_LS)+h*0.38-(m.actualBoundingBoxDescent||fs*0.25));
    } else {
      const bfs=fs*0.78;
      ctx.font=`${bfs}px "Times New Roman",Georgia,serif`;
      const m=ctx.measureText('\uD834\uDD22');
      const h=(m.actualBoundingBoxAscent||bfs*0.8)+(m.actualBoundingBoxDescent||bfs*0.1);
      ctx.fillText('\uD834\uDD22', BRS_LM+4, (yTop+BRS_LS)-h*0.15+(m.actualBoundingBoxAscent||bfs*0.8));
    }
  });

  /* ─ Armure ─ */
  const ksN = BRS_keyInfo.sharps||0;
  const sharpTP=[0,1.5,-0.5,1,2.5,0.5,2], sharpBP=[1,2.5,0.5,2,3.5,1.5,3];
  const flatTP=[2,0.5,2.5,1,3,1.5,3.5],   flatBP=[3,1.5,3.5,2,4,2.5,4.5];
  let ksX = BRS_LM+38;
  stavesData.forEach(s=>{
    const tp = s.inst.clef==='treble'?sharpTP:sharpBP;
    const tpf= s.inst.clef==='treble'?flatTP:flatBP;
    ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillStyle='#1e1e2e';
    if(ksN>0){
      ctx.font=`${BRS_LS*1.5}px "Times New Roman",Georgia,serif`;
      for(let i=0;i<ksN&&i<7;i++) ctx.fillText('\u266F', ksX+i*8, s.yTop+tp[i]*BRS_LS);
    } else if(ksN<0){
      ctx.font=`${BRS_LS*1.7}px "Times New Roman",Georgia,serif`;
      for(let i=0;i<-ksN&&i<7;i++) ctx.fillText('\u266D', ksX+i*8, s.yTop+tpf[i]*BRS_LS);
    }
  });
  if(ksN!==0) ksX += Math.abs(ksN)*8+6;

  /* ─ Notes ─ */
  BRS_noteHits = [];
  if(!BRS_chords.length) return;
  const startX = ksX+14;
  const chW    = Math.min(70,(cw-startX-BRS_RM-10)/BRS_chords.length);
  const noteSize = Math.max(4,Math.min(6,80/BRS_chords.length));
  const errSet  = new Set(BRS_errors.map(e=>e.chord));

  BRS_chords.forEach((ch,ci)=>{
    const x = startX+ci*chW+chW/2;
    if(errSet.has(ci)){
      ctx.fillStyle='rgba(239,68,68,0.06)';
      ctx.fillRect(x-chW/2+2,top-6,chW-4,totalH-top-20);
    }
    if(ci===BRS_selChord){
      ctx.fillStyle='rgba(83,74,183,0.10)';
      ctx.fillRect(x-chW/2+2,top-6,chW-4,totalH-top-20);
    }

    // Collision detection : notes côte à côte si même Y
    const brsNoteData = stavesData.map(s=>{
      const midi = ch.notes[s.slot.slotId]; if(midi==null) return null;
      const effClefBRS = (BRS_tenorClef && BRS_tenorClef[s.slot.slotId]) ? 'tenor' : s.inst.clef;
      const y = BRS_midiToY(midi, s.yTop, effClefBRS);
      return {s, midi, y, xOff:0};
    }).filter(Boolean);
    const brsSorted = [...brsNoteData].sort((a,b)=>a.y-b.y);
    for(let i=1;i<brsSorted.length;i++){
      if(Math.abs(brsSorted[i].y - brsSorted[i-1].y) < BRS_LS*0.9)
        brsSorted[i].xOff = (noteSize+2)*2;
    }
    brsNoteData.forEach(({s, midi, y, xOff})=>{
      const nx = x + xOff;
      const yTop2= s.yTop, yBot=s.yTop+4*BRS_LS;
      ctx.strokeStyle='#888'; ctx.lineWidth=0.8;
      if(y<yTop2) for(let ly=yTop2-BRS_LS;ly>=y-1;ly-=BRS_LS){
        ctx.beginPath(); ctx.moveTo(nx-9,ly); ctx.lineTo(nx+9,ly); ctx.stroke();
      }
      if(y>yBot) for(let ly=yBot+BRS_LS;ly<=y+1;ly+=BRS_LS){
        ctx.beginPath(); ctx.moveTo(nx-9,ly); ctx.lineTo(nx+9,ly); ctx.stroke();
      }
      ctx.save(); ctx.translate(nx,y); ctx.rotate(-0.18);
      ctx.beginPath(); ctx.ellipse(0,0,noteSize+1,noteSize-1.5,0,0,Math.PI*2);
      ctx.fillStyle = s.inst.color; ctx.fill(); ctx.restore();
      BRS_noteHits.push({chordIdx:ci, slotId:s.slot.slotId, instId:s.slot.instId, x:nx, y, r:noteSize+4, midi, yTop:s.yTop, inst:s.inst});
      if(!BRS_inRange(midi, s.slot.instId)){
        ctx.strokeStyle='#dc2626'; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.arc(nx,y,noteSize+3,0,Math.PI*2); ctx.stroke();
      }
    });

    if(ci<BRS_chords.length-1){
      ctx.strokeStyle='#ccc'; ctx.lineWidth=0.5;
      const bx=x+chW/2;
      stavesData.forEach(s=>{
        ctx.beginPath(); ctx.moveTo(bx,s.yTop); ctx.lineTo(bx,s.yTop+4*BRS_LS); ctx.stroke();
      });
    }
  });

  /* Double barre finale */
  if(BRS_chords.length){
    const lx=startX+(BRS_chords.length-1)*chW+chW/2+chW/2;
    ctx.strokeStyle='#333'; ctx.lineWidth=1;
    stavesData.forEach(s=>{ ctx.beginPath(); ctx.moveTo(lx,s.yTop); ctx.lineTo(lx,s.yTop+4*BRS_LS); ctx.stroke(); });
    ctx.lineWidth=3.5;
    stavesData.forEach(s=>{ ctx.beginPath(); ctx.moveTo(lx+5,s.yTop); ctx.lineTo(lx+5,s.yTop+4*BRS_LS); ctx.stroke(); });
  }

  /* Click to select chord */
  canvas.onclick = function(e){
    if(!BRS_chords.length) return;
    const rect=canvas.getBoundingClientRect();
    const xClick=(e.clientX-rect.left)*(cw/(rect.width||cw));
    const startX2=ksX+14;
    const chW2=Math.min(70,(cw-startX2-BRS_RM-10)/BRS_chords.length);
    const idx=Math.floor((xClick-startX2)/chW2);
    if(idx>=0&&idx<BRS_chords.length) BRS_selectChord(idx);
  };
}

/* ── Theory panel (enriched) ─────────────────────────────────────── */
function BRS_renderTheoryPanel(){
  const el = document.getElementById('brs_theoryPanel'); if(!el) return;
  const L   = (typeof currentLang!=='undefined') ? currentLang : 'fr';
  const p   = (o) => o[L]||o.fr;

  const section = (title, content) =>
    `<div style="margin-bottom:14px"><div style="font-size:10px;font-weight:700;color:var(--accent);margin-bottom:6px;border-bottom:1px solid var(--border);padding-bottom:3px">${title}</div>${content}</div>`;
  const row = (color,text) =>
    `<div style="font-size:9.5px;line-height:1.9;display:flex;gap:8px;align-items:flex-start"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};margin-top:3px;flex-shrink:0"></span><span>${text}</span></div>`;
  const li  = (text) => `<div style="font-size:9.5px;line-height:1.9">• ${text}</div>`;

  let h = '';

  /* 1. Tessitures */
  let rangesContent = '';
  Object.entries(BRS_INSTRUMENTS).forEach(([id,inst])=>{
    const n=inst.name[L]||inst.name.fr;
    const lo=BRS_midiToName(inst.written.lo,false), hi=BRS_midiToName(inst.written.hi,false);
    const tr=inst.transpose!==0?` (${p({fr:'sonne',en:'sounds',es:'suena'})} ${inst.transpose>0?'+':''}${inst.transpose}½T)`:'';
    rangesContent += row(inst.color, `<strong>${n}${tr}</strong> : ${lo} – ${hi}`);
  });
  h += section(p({fr:'Tessitures & transpositions',en:'Ranges & transpositions',es:'Tesituras & transposiciones'}), rangesContent);

  /* 2. Registres & fatigue */
  h += section(p({fr:'Registres & fatigue des lèvres',en:'Registers & embouchure fatigue',es:'Registros & fatiga de embocadura'}), [
    li(p({fr:'<strong>Registre grave :</strong> son plein et chaleureux, moins projeté (cors : parfois bouché naturellement)',en:'<strong>Low register:</strong> full and warm, less projected (horns: sometimes naturally stopped)',es:'<strong>Registro grave:</strong> pleno y cálido, menos proyectado'})),
    li(p({fr:'<strong>Registre médium :</strong> zone idéale de projection et d\'endurance — à privilégier pour les passages longs',en:'<strong>Medium register:</strong> ideal projection & endurance — preferred for long passages',es:'<strong>Registro medio:</strong> zona ideal de proyección y resistencia'})),
    li(p({fr:'<strong>Registre aigu :</strong> brillant mais plus exigeant — prévoir des pauses ou relèves entre instruments',en:'<strong>High register:</strong> brilliant but demanding — plan rests or relay between instruments',es:'<strong>Registro agudo:</strong> brillante pero exigente — prever pausas o relevos'})),
    li(p({fr:'<strong>Registre extrême :</strong> à éviter sur de longues durées. Réserver aux climax dramatiques',en:'<strong>Extreme register:</strong> avoid for long durations. Reserve for dramatic climaxes',es:'<strong>Registro extremo:</strong> evitar en largas duraciones. Reservar para climax dramáticos'})),
    li(p({fr:'<strong>Tuba :</strong> éviter de dépasser Do3 (MIDI 48) régulièrement — grande dépense d\'air',en:'<strong>Tuba:</strong> avoid exceeding C3 regularly — high air consumption',es:'<strong>Tuba:</strong> evitar sobrepasar Do3 regularmente — gran consumo de aire'})),
    li(p({fr:'<strong>Cors 1-2 :</strong> écrits dans l\'aigu ; <strong>Cors 3-4 :</strong> écrits dans le grave — respecter les paires',en:'<strong>Horns 1-2:</strong> written high; <strong>3-4:</strong> low — respect the pairing',es:'<strong>Trompas 1-2:</strong> escritas en agudo; <strong>3-4:</strong> en grave — respetar los pares'}))
  ].join(''));

  /* 3. Transpositions */
  h += section(p({fr:'Transpositions pratiques',en:'Practical transpositions',es:'Transposiciones prácticas'}), [
    li(p({fr:'<strong>Cor en Fa :</strong> note écrite Do4 → son Sol3 (quinte basse). Armure : 1♭ de moins que la tonalité réelle',en:'<strong>Horn in F:</strong> written C4 → sounds G3 (P5 down). Key sig: 1♭ fewer than concert pitch',es:'<strong>Trompa en Fa:</strong> Do4 escrito → Sol3 sonante (5ª baja)'})),
    li(p({fr:'<strong>Trompette Sib :</strong> note écrite Do4 → son Sib3 (2de majeure basse). Armure : 2♭ de moins',en:'<strong>Trumpet Bb:</strong> written C4 → sounds Bb3 (M2 down). Key sig: 2♭ fewer',es:'<strong>Trompeta Sib:</strong> Do4 escrito → Sib3 sonante (2M abajo)'})),
    li(p({fr:'<strong>Cornet à pistons Sib :</strong> même transposition que la trompette Sib',en:'<strong>Cornet Bb:</strong> same transposition as Bb trumpet',es:'<strong>Corneta Sib:</strong> misma transposición que la trompeta'})),
    li(p({fr:'<strong>Trombone / Tuba :</strong> non transpositeurs — note écrite = note sonnante',en:'<strong>Trombone / Tuba:</strong> concert pitch instruments — written = sounding',es:'<strong>Trombón / Tuba:</strong> instrumentos a tono — escrito = sonante'}))
  ].join(''));

  /* 4. Écriture & équilibre */
  h += section(p({fr:'Principes d\'écriture & équilibre',en:'Writing principles & balance',es:'Principios de escritura & equilibrio'}), [
    li(p({fr:'<strong>Densité :</strong> l\'accord plein 4 cors + 3 trp + 3 trb + tuba produit jusqu\'à ff. Pour pp, réduire à 2 cors + 1 trb',en:'<strong>Density:</strong> full 4 horns + 3 tpt + 3 tbn + tuba yields ff. For pp, reduce to 2 horns + 1 tbn',es:'<strong>Densidad:</strong> 4 trompas + 3 trp + 3 trb + tuba da ff. Para pp, reducir a 2 trompas + 1 trb'})),
    li(p({fr:'<strong>Espacement :</strong> serré dans le grave (tierce ou quarte), ouvert dans l\'aigu (sixte, octave)',en:'<strong>Spacing:</strong> close in bass (thirds/fourths), open in treble (sixths, octaves)',es:'<strong>Espaciado:</strong> cerrado en el grave (3ª/4ª), abierto en el agudo (6ª, octava)'})),
    li(p({fr:'<strong>Doublement :</strong> doubler fondamentale et quinte ; éviter la sensible (jamais doublee)',en:'<strong>Doubling:</strong> double root and fifth; avoid leading tone (never double it)',es:'<strong>Duplicación:</strong> duplicar fundamental y quinta; evitar la sensible (nunca duplicar)'})),
    li(p({fr:'<strong>Cors & bassons :</strong> mélange idéal pour tenir des harmonies longues avec douceur',en:'<strong>Horns & bassoons:</strong> ideal blend for soft sustained harmonies',es:'<strong>Trompas & fagotes:</strong> mezcla ideal para armonías suaves y largas'})),
    li(p({fr:'<strong>Contrapunt cuivres :</strong> quintes et octaves parallèles à éviter strictement (particulièrement Trp-Trp, Cor-Cor)',en:'<strong>Brass counterpoint:</strong> parallel 5ths/8ths strictly forbidden (especially Trp-Trp, Horn-Horn)',es:'<strong>Contrapunto:</strong> quintas y octavas paralelas estrictamente prohibidas'}))
  ].join(''));

  /* 5. Caractères & mélanges */
  h += section(p({fr:'Caractères & mélanges recommandés',en:'Timbres & recommended blends',es:'Caracteres & mezclas recomendadas'}), [
    row('#7C3AED', p({fr:'<strong>Cors :</strong> chaleureux, noble, fondu — le "ciment" des cuivres. Excellent pour tenir un pédale harmonique',en:'<strong>Horns:</strong> warm, noble, blended — the brass "glue". Excellent for harmonic pedals',es:'<strong>Trompas:</strong> cálidas, nobles, fundidas — el "cemento" de los metales'})),
    row('#DB2777', p({fr:'<strong>Trompettes :</strong> brillantes, claires, pénétrantes — fanfares, signaux, mélodies au premier plan',en:'<strong>Trumpets:</strong> bright, clear, piercing — fanfares, signals, foreground melodies',es:'<strong>Trompetas:</strong> brillantes, claras, penetrantes — fanfarrias, señales, melodías'})),
    row('#F43F5E', p({fr:'<strong>Cornet à pistons :</strong> plus doux et rond que la trompette, plus agile dans le style brillant',en:'<strong>Cornet:</strong> softer and rounder than trumpet, more agile in brilliant style',es:'<strong>Corneta:</strong> más suave y redonda que la trompeta, más ágil en estilo brillante'})),
    row('#0369A1', p({fr:'<strong>Trombones :</strong> graves et solennels (tenors), ou massifs et profonds (basse). Excellent en chorale',en:'<strong>Trombones:</strong> solemn (tenor) or massive/deep (bass). Excellent in choral style',es:'<strong>Trombones:</strong> solemnes (tenor) o masivos/profundos (bajo). Excelentes en coral'})),
    row('#374151', p({fr:'<strong>Tuba :</strong> fondement grave indispensable. Renforce la basse des trombones',en:'<strong>Tuba:</strong> essential bass foundation. Reinforces trombone bass',es:'<strong>Tuba:</strong> base grave indispensable. Refuerza el bajo de los trombones'})),
    li(p({fr:'<strong>Cor + Tuba :</strong> grave sombre et enveloppant — atmosphère mystérieuse',en:'<strong>Horn + Tuba:</strong> dark and enveloping bass — mysterious atmosphere',es:'<strong>Trompa + Tuba:</strong> grave oscuro y envolvente — atmósfera misteriosa'})),
    li(p({fr:'<strong>Cor + Trompette (octave) :</strong> brillance chaleureuse — accord triomphant',en:'<strong>Horn + Trumpet (octave):</strong> warm brilliance — triumphant chord',es:'<strong>Trompa + Trompeta (octava):</strong> brillo cálido — acorde triunfante'})),
    li(p({fr:'<strong>Trb. Ténors + Tuba :</strong> masse grave typique de la "chorale de cuivres"',en:'<strong>Tenor Trb. + Tuba:</strong> typical heavy "brass chorale" mass',es:'<strong>Trb. Tenor + Tuba:</strong> masa grave típica del "coral de metales"'})),
    li(p({fr:'<strong>Trompette + Cornet :</strong> dialogue brillant ; le cornet répond avec plus de rondeur',en:'<strong>Trumpet + Cornet:</strong> brilliant dialogue; cornet replies with more roundness',es:'<strong>Trompeta + Corneta:</strong> diálogo brillante; la corneta responde con más redondez'}))
  ].join(''));

  /* 6. Sourdines */
  h += section(p({fr:'Sourdines & effets',en:'Mutes & effects',es:'Sordinas & efectos'}), [
    li(p({fr:'<strong>Sourdine droite (straight) :</strong> timbre nasal et acéré — 3 à 6 dB d\'atténuation',en:'<strong>Straight mute:</strong> nasal and sharp timbre — 3–6 dB attenuation',es:'<strong>Sordina recta:</strong> timbre nasal y agudo — atenuación 3-6 dB'})),
    li(p({fr:'<strong>Cup mute :</strong> son voilé et doux — trompette et trombone surtout',en:'<strong>Cup mute:</strong> veiled and soft sound — trumpet and trombone mainly',es:'<strong>Sordina cup:</strong> sonido velado y suave — trompeta y trombón principalmente'})),
    li(p({fr:'<strong>Harmon mute :</strong> son très isolé et métallique (Miles Davis) — trompette uniquement',en:'<strong>Harmon mute:</strong> very isolated metallic sound (Miles Davis) — trumpet only',es:'<strong>Sordina harmon:</strong> sonido muy aislado y metálico — solo trompeta'})),
    li(p({fr:'<strong>Sons bouchés (cors) :</strong> main dans le pavillon — abaisse la note d\'1 demi-ton, timbre nasillard',en:'<strong>Stopped notes (horns):</strong> hand in bell — lowers pitch by 1 semitone, nasal timbre',es:'<strong>Sonidos tapados (trompas):</strong> mano en el pabellón — baja 1 semitono, timbre nasal'})),
    li(p({fr:'<strong>Cuivré :</strong> son braillard et agressif (cor bouché et fortissimo) — effet dramatique',en:'<strong>Cuivré:</strong> brassy and aggressive (stopped horn at ff) — dramatic effect',es:'<strong>Cuivré:</strong> sonido chillón y agresivo (trompa tapada en ff) — efecto dramático'}))
  ].join(''));

  /* 7. Erreurs courantes */
  h += section(p({fr:'Erreurs courantes à éviter',en:'Common errors to avoid',es:'Errores frecuentes a evitar'}), [
    li(p({fr:'Quintes/octaves parallèles entre instruments de même registre (particulièrement 2 trompettes ou 2 cors)',en:'Parallel 5ths/8ths between same-register instruments (especially 2 trumpets or 2 horns)',es:'Quintas/octavas paralelas entre instrumentos del mismo registro'})),
    li(p({fr:'Sensible doublée dans un accord de dominante — toujours l\'éviter',en:'Doubled leading tone in dominant chord — always avoid',es:'Sensible duplicada en acorde de dominante — evitar siempre'})),
    li(p({fr:'Croisement entre cors 1-2 (aigus) et cors 3-4 (graves) — les paires doivent rester séparées',en:'Crossing between horns 1-2 (high) and 3-4 (low) — pairs must stay separate',es:'Cruce entre trompas 1-2 (agudas) y 3-4 (graves) — los pares deben permanecer separados'})),
    li(p({fr:'Trombone basse au-dessus de Fa3 (MIDI 65) sur de longues durées — extrême fatigue',en:'Bass trombone above F3 for long durations — extreme fatigue',es:'Trombón bajo por encima de Fa3 en largas duraciones — fatiga extrema'})),
    li(p({fr:'Sauts de position trombone > 7 demi-tons — glissando involontaire entre positions',en:'Trombone position leap >7 semitones — involuntary glissando between positions',es:'Salto de posición en trombón >7 semitonos — glissando involuntario entre posiciones'})),
    li(p({fr:'Tuba seul sans trombone basse : grave, mais risque d\'isolement si l\'accord supérieur est trop aigu',en:'Tuba alone without bass trombone: deep, but risks isolation if upper chord is too high',es:'Tuba sola sin trombón bajo: profunda, pero riesgo de aislamiento si el acorde superior es muy agudo'}))
  ].join(''));

  el.innerHTML = h;
}

/* ── Audio (reuse piano chain) ───────────────────────────────────── */
function BRS_playChordAudio(ch, startTime, dur){
  if(typeof _getPianoChain!=='function') return;
  const chain=_getPianoChain(); const actx=chain.ctx;
  const t=startTime||actx.currentTime;
  let i=0;
  BRS_activeInsts.forEach(slot=>{
    const w=ch.notes[slot.slotId]; if(w==null) return;
    const s=BRS_writtenToSounding(w,slot.instId);
    const f=440*Math.pow(2,(s-69)/12);
    if(typeof pianoNote==='function') pianoNote(f,t+(i++)*0.008,dur,actx,chain.dry,chain.wet,0.18);
  });
}
function BRS_playSelected(){
  if(BRS_selChord<0||BRS_selChord>=BRS_chords.length) return;
  const btn=document.getElementById('brs_btnPlaySel');
  if(btn) btn.classList.add('playing');
  BRS_playChordAudio(BRS_chords[BRS_selChord],null,1.5);
  setTimeout(()=>btn&&btn.classList.remove('playing'),1500);
}
function BRS_playAll(){
  if(!BRS_chords.length||typeof _getPianoChain!=='function') return;
  const chain=_getPianoChain(); const actx=chain.ctx;
  const tempo=+(document.getElementById('brs_tempoInput')||{value:72}).value||72;
  const beat=60/tempo;
  const btn=document.getElementById('brs_btnPlayAll');
  if(btn) btn.classList.add('playing');
  const now=actx.currentTime;
  BRS_chords.forEach((ch,i)=>BRS_playChordAudio(ch,now+i*beat,beat*0.9));
  setTimeout(()=>btn&&btn.classList.remove('playing'),BRS_chords.length*beat*1000+400);
}

/* ── PDF Export ──────────────────────────────────────────────────── */
function BRS_exportPDF(){
  const L=(typeof currentLang!=='undefined')?currentLang:'fr';
  const uf=BRS_keyInfo.sharps<0;
  if(!BRS_chords.length){
    alert(L==='en'?'Add chords before exporting.':L==='es'?'Añade acordes antes de exportar.':"Ajoutez des accords avant d'exporter.");
    return;
  }
  const voices=BRS_chordToVoices(null);
  const keyObj=BRS_KEY_LIST.find(k=>k.root===BRS_keyInfo.root&&k.minor===BRS_keyInfo.minor);
  const keyName=keyObj?(L==='en'?keyObj.nameEn:L==='es'?keyObj.nameEs:keyObj.name):'';

  let html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Brass — Contrepoint</title>
  <style>body{font-family:Georgia,serif;margin:20mm;font-size:11pt}
  h1{font-size:16pt}h2{font-size:12pt;margin-top:14px;border-bottom:1px solid #ccc;padding-bottom:3px}
  table{border-collapse:collapse;width:100%;margin-top:8px}td,th{border:1px solid #ccc;padding:4px 8px;font-size:9pt}
  th{background:#f0f0f0}.e{color:#dc2626}.w{color:#d97706}.i{color:#2563eb}</style></head><body>`;
  html+=`<h1>🎺 ${L==='en'?'Brass Analysis':L==='es'?'Análisis de Metales':'Analyse Cuivres'} — Contrepoint</h1>`;
  if(keyName) html+=`<p><strong>${L==='en'?'Key':L==='es'?'Tonalidad':'Tonalité'} :</strong> ${keyName}</p>`;


  if(BRS_errors.length){
    html+=`<h2>${L==='en'?'Errors':L==='es'?'Errores':'Erreurs'}</h2><ul>`;
    BRS_errors.forEach(e=>{ html+=`<li class="${e.type[0]}">${e.msg}</li>`; });
    html+=`</ul>`;
  } else html+=`<p style="color:#16a34a">✓ ${L==='en'?'No errors':L==='es'?'Sin errores':'Aucune erreur'}</p>`;
  html+=`</body></html>`;
  const w=window.open('','_blank');
  if(!w){ alert('Popup bloqué.'); return; }
  w.document.write(html);
  w.document.close();
  setTimeout(()=>{ try{ w.print(); }catch(e){} }, 400);
}

/* ── Init ────────────────────────────────────────────────────────── */
let BRS_initialized = false;
let BRS_dragInited = false;

function BRS_init(){
  if(!BRS_initialized){
    BRS_buildActiveInsts();
    BRS_buildKeySelector();
    BRS_buildConfigPanel();
    BRS_buildInputs();
    BRS_keyInfo = { root:0, minor:false, sharps:0 };
    BRS_initialized = true;
  }
  if(!BRS_dragInited){
    BRS_dragInited = true;
    AH_initCanvasDrag({
      canvasId: 'brs_scoreCanvas',
      getNoteAt(cx, cy){
        return BRS_noteHits.find(h=>Math.hypot(cx-h.x, cy-h.y)<=h.r) || null;
      },
      snapMidi(drag, cy){
        const dy = drag.y - cy;
        const diaSteps = Math.round(dy / (BRS_LS/2));
        const DIA = [0,0,1,1,2,3,3,4,4,5,5,6];
        const CHR = [0,2,4,5,7,9,11];
        function toDia(m){ return Math.floor(m/12)*7 + DIA[m%12]; }
        function fromDia(d){ const o=Math.floor(d/7); const s=((d%7)+7)%7; return o*12+CHR[s]; }
        return Math.max(0, Math.min(127, fromDia(toDia(drag.startMidi)+diaSteps)));
      },
      setMidi(drag, midi, preview){
        if(BRS_chords[drag.chordIdx]) BRS_chords[drag.chordIdx].notes[drag.slotId] = midi;
        const inp = document.getElementById('brs_in_'+drag.slotId);
        if(inp){ inp.value = BRS_midiToName(midi, BRS_keyInfo.sharps<0); }
        BRS_updateRegisterBadge(drag.slotId);
        BRS_analyze(); BRS_render();
        if(!preview) try{window.dispatchEvent(new CustomEvent('contrepoint:chordschange'));}catch(e){}
      },
      onDragEnd(){}
    });
  }
  BRS_renderTheoryPanel();
  BRS_updateChordCounter();
  BRS_analyze();
  BRS_render();
}

/* Rebuild UI on language change */
window.addEventListener('contrepoint:langchange', ()=>{
  if(window.AH_currentMode === 'CUIVRES' && BRS_initialized){
    BRS_buildConfigPanel();
    BRS_buildInputs();
    BRS_renderTheoryPanel();
    BRS_updateChordCounter();
    BRS_activeInsts.forEach(s=>{ BRS_updateTransposeDisplay(s.slotId); BRS_updateRegisterBadge(s.slotId); });
    if(typeof applyI18n==='function') applyI18n(currentLang);
    BRS_analyze(); BRS_render();
  }
});

/* ── Toggle clef ténor pour trombone ──────────────────────────────── */
function BRS_toggleTenorClef(slotId){
  BRS_tenorClef[slotId] = !BRS_tenorClef[slotId];
  if(typeof BRS_render === 'function') BRS_render();
}

/* ── Exports globaux ─────────────────────────────────────────────── */
window.BRS_init               = BRS_init;
window.BRS_onConfigChange     = BRS_onConfigChange;
window.BRS_updateKey          = BRS_updateKey;
window.BRS_onModeChange       = BRS_onModeChange;
window.BRS_onNoteInput        = BRS_onNoteInput;
window.BRS_addChord           = BRS_addChord;
window.BRS_updateChord        = BRS_updateChord;
window.BRS_removeSelected     = BRS_removeSelected;
window.BRS_clearAll           = BRS_clearAll;
window.BRS_selectChord        = BRS_selectChord;
window.BRS_playSelected       = BRS_playSelected;
window.BRS_playAll            = BRS_playAll;
window.BRS_exportPDF          = BRS_exportPDF;
window.BRS_toggleTenorClef    = BRS_toggleTenorClef;
window.BRS_INSTRUMENTS        = BRS_INSTRUMENTS;

/* ███  FIN MODULE CUIVRES  ███████████████████████████████████████ */




/* ███  MODULE CORDES  ████████████████████████████████████████████████
   Pupitres fixes : Violon I, Violon II, Alto, Violoncelle, Contrebasse
   Préfixe : STR_
   Notes sonnantes directes (non transpositrices)
   ████████████████████████████████████████████████████████████████████ */

/* ─── Constantes visuelles (partagées avec VTS/BRS) ─── */
const STR_LS = 7;   // line spacing canvas
const STR_LM = 80;  // left margin
const STR_RM = 20;  // right margin
const STR_MAX_CHORDS = 20;

/* ─── Définition des pupitres ─── */
const STR_INSTRUMENTS = {
  VL1: {
    id:'VL1',
    label:{fr:'Violon I',en:'Violin I',es:'Violín I'},
    short:'Vl.I',
    color:'#1D4ED8',
    clef:'treble',
    midi:{lo:55, hi:100}  // G3–E7
  },
  VL2: {
    id:'VL2',
    label:{fr:'Violon II',en:'Violin II',es:'Violín II'},
    short:'Vl.II',
    color:'#2563EB',
    clef:'treble',
    midi:{lo:55, hi:96}   // G3–C7
  },
  VLA: {
    id:'VLA',
    label:{fr:'Alto',en:'Viola',es:'Viola'},
    short:'Vla.',
    color:'#7C3AED',
    clef:'alto',           // clé d'ut 3e — dessinée comme clé de sol avec offset
    midi:{lo:48, hi:88}    // C3–E6
  },
  VLC: {
    id:'VLC',
    label:{fr:'Violoncelle',en:'Cello',es:'Violonchelo'},
    short:'Vlc.',
    color:'#B45309',
    clef:'bass',
    midi:{lo:36, hi:91}    // C2–G6
  },
  CB: {
    id:'CB',
    label:{fr:'Contrebasse',en:'Double Bass',es:'Contrabajo'},
    short:'Cb.',
    color:'#374151',
    clef:'bass',
    midi:{lo:28, hi:67}    // E1–G4 (son réel; écrit octave au-dessus)
  }
};

/* Ordre canonique de la partition (du plus aigu au plus grave) */
const STR_ORDER = ['VL1','VL2','VLA','VLC','CB'];

/* ─── Registres par pupitre (note sonnante MIDI) ─── */
const STR_REGISTERS = {
  VL1: {low:[55,62], mid:[63,74], high:[75,88], extreme:[89,999]},
  VL2: {low:[55,62], mid:[63,74], high:[75,88], extreme:[89,999]},
  VLA: {low:[48,55], mid:[56,67], high:[68,79], extreme:[80,999]},
  VLC: {low:[36,47], mid:[48,60], high:[61,72], extreme:[73,999]},
  CB:  {low:[28,40], mid:[41,52], high:[53,62], extreme:[63,999]}
};

/* ─── État global du module ─── */
let STR_chords    = [];   // [{notes:{VL1:midi, VL2:midi, ...}}]
let STR_selChord  = -1;
let STR_errors    = [];
let STR_keyInfo   = {root:0, minor:false, sharps:0};
let STR_progMode  = 'single'; // 'single' | 'progression'
let STR_initialized = false;
let STR_tenorClef = {VLC: false}; // clef ténor toggle par instrument
let STR_altClef   = {VLA: false}; // clef d'alto toggle par instrument
let STR_noteHits = []; // pour drag detection

/* ─── Helpers partagés ─── */
const STR_NOTE_NAMES_S = ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
const STR_NOTE_NAMES_F = ['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'];

function STR_midiToName(midi, useFlats){
  const oct = Math.floor(midi/12) - 1;
  const pc  = midi % 12;
  const arr = useFlats ? STR_NOTE_NAMES_F : STR_NOTE_NAMES_S;
  return arr[pc] + oct;
}

function STR_parseNote(str){
  if(!str || !str.trim()) return null;
  const m = str.trim().match(/^([A-Ga-g])(#{1,2}|bb?|[♯♭])?(-?\d)$/);
  if(!m) return null;
  const pc = {C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1].toUpperCase()];
  const acc = {
    '#':1,'##':2,'♯':1,'x':2,
    'b':-1,'bb':-2,'♭':-1
  }[m[2]||''] || 0;
  const oct = parseInt(m[3]);
  const midi = (oct+1)*12 + pc + acc;
  return (midi>=0 && midi<=127) ? midi : null;
}

function STR_inRange(midi, instId){
  const inst = STR_INSTRUMENTS[instId];
  return midi >= inst.midi.lo && midi <= inst.midi.hi;
}

function STR_getRegister(midi, instId){
  const regs = STR_REGISTERS[instId];
  for(const [name, [lo,hi]] of Object.entries(regs)){
    if(midi >= lo && midi <= hi) return name;
  }
  return 'extreme';
}

function STR_interval(a, b){ return Math.abs(a-b) % 12; }
function STR_motionType(a1,a2,b1,b2){
  const da = a2-a1, db = b2-b1;
  if(da===0 && db===0) return 'oblique';
  if(da===0 || db===0) return 'oblique';
  return (da>0)===( db>0) ? 'direct' : 'contrary';
}

/* ─── midiToY pour canvas (portée 5 lignes) ─── */
// treble : ligne 3 = B4 (midi 71), step = LS/2 par demi-degré
// bass   : ligne 3 = D3 (midi 50)
// alto   : ligne 3 = C4 (midi 60)  [clé d'ut 3e ligne]
function STR_midiToY(midi, yTop, clef){
  // référence : note sur la 3e ligne (du bas) de la portée
  // treble: B4(71) sur 3e ligne, bass: D3(50) sur 3e ligne, alto: C4(60) sur 3e ligne, tenor: A3(57) sur 3e ligne
  const ref = clef==='treble' ? 71 : clef==='bass' ? 50 : clef==='alto' ? 60 : clef==='tenor' ? 57 : 50;
  const diatonicSteps = [0,0,1,1,2,3,3,4,4,5,5,6];
  function midiToDiatonic(m){
    const oct = Math.floor(m/12);
    const pc  = m%12;
    return oct*7 + diatonicSteps[pc];
  }
  const dy = midiToDiatonic(ref) - midiToDiatonic(midi);
  return yTop + 2*STR_LS + dy*(STR_LS/2);
}

/* ─── Dessine une clef de ténor (Ut 4e ligne) sur le canvas ─── */
/* ─── Clef de ténor (Ut 4 — Do central sur la 4e ligne) ───
 * Instruments concernés : violoncelle (registre aigu), basson (registre aigu),
 * trombone ténor (registre aigu).
 * Design : deux rectangles verticaux + "C" stylisé pointant sur la 4e ligne.
 */
function STR_drawTenorClef(ctx, x, yTop, ls){
  // Clef de ténor : Do central sur 4e ligne (lineIdx 3),
  // positionnée 1 espace (= 2 tons) au-dessus de la clef d'alto (lineIdx 2)
  // → lineIdx 1 (2e ligne depuis le haut)
  STR_drawCClef(ctx, x, yTop, ls, 1);
}

/* ─── Clef d'alto (Ut 3 — Do central sur la 3e ligne) ───
 * Instruments concernés : alto (violon alto), parfois trombone alto.
 */
function STR_drawAltClef(ctx, x, yTop, ls){
  STR_drawCClef(ctx, x, yTop, ls, 2); // line index 2 = 3e ligne (Ut3)
}

/* ─── Helper : dessin générique d'une clef d'ut (C-clef) ───────────────
 * Copie fidèle du design standard :
 *   - Barre verticale épaisse (gauche), couvrant toute la portée
 *   - Barre verticale fine (droite), côte à côte
 *   - Demi-cercle supérieur : ouvert à droite, entre staffTop et centerY
 *   - Demi-cercle inférieur : ouvert à droite (miroir), entre centerY et staffBot
 *   - Petite pointe horizontale sur centerY (marque le Do)
 * lineIdx : 0=1ère ligne … 4=5e ligne.  Alto=2, Tenor=3
 */
/* ─── Helper : dessin d'une clef d'ut via path SVG vectoriel ───────────
 * SVG source : viewBox "0 0 1318 2048"
 * Le Do central est au milieu vertical du glyphe (y≈1024/2048).
 * lineIdx (0-based depuis le haut) : alto=2 (3e ligne), ténor=1 (4e ligne en notation haut→bas)
 * cy = yTop + lineIdx * ls  →  le Do central s'aligne sur cette ligne.
 */
const _CCLEF_PATH_DATA = "M8.24 13.946c30.649 3.279 63.898 2.71 94.686 2.71q72.012-.28 144.02.263l.046 1579.521.012 339.98c.005 12.4 1.581 96.65-.407 103.31l-1.759.9c-79.42.67-158.843.68-238.262.02-.907-63.02-.327-127.22-.324-190.32l.017-332.41.001-1007.695v-348.459c0-21.788-2.41-134.697 1.97-147.82m416.451 1.487c5.36-.375 11.972-1.102 16.882.922 3.484 4.632 2.351 46.334 2.355 55.023l.011 85.105.002 256.582v1100.895l.01 348.1.005 111.29c-.002 21.09.689 47.23-.895 67.81-14.201-1.19-44.86-.21-60.082-.25-5.091-.06-13.722.12-18.157-1.81-3.761-4.31-1.49-25.69-1.349-32.26.266-15.83.376-31.66.33-47.5l-.027-192.58-.005-1151.261-.02-389.403c-.002-69.413-.794-140.146.203-209.392 19.731-.053 41.18.18 60.737-1.272m57.837 1013.028c4.006-7.58 14.15-20 19.752-27.75a740 740 0 0 0 29.607-44.041c61.446-98.639 107.798-225.464 108.196-342.75.02-5.912-2.459-21.487.21-25.631l1.418-.119c8.383 13.687 17.147 57.541 21.261 73.738a262 262 0 0 0 13.772 39.815c21.487 49.37 58.112 90.116 109.116 110.004 29.298 11.424 58.84 12.461 89.819 12.586 25.563.104 49.124.457 73.002-10.077 47.413-20.917 80.339-68.797 98.459-115.727 50.44-130.673 35.85-377.582-20.9-504.834-22.13-49.633-55.704-109.129-109.258-129.464-19.226-7.3-38.648-7.56-58.971-7.262-54.04.794-104.528 11.16-153.768 33.526-26.006 11.813-49.052 25.524-69.3 45.858-5.709 5.734-11.029 10.629-13.872 18.407-1.642 4.495-3.003 8.637-.837 13.209 5.231 5.475 15.375 4.835 22.292 3.414 49.013-10.068 114.906-17.343 151.886 24.443 26.651 30.115 33.03 76.556 32.658 115.266-1.896 67.682-68.555 116.687-131.672 123.169-42.086 4.111-85.316-17.311-112.647-48.02-30.762-34.565-53.744-89.582-50.859-136.286a218.88 218.88 0 0 1 73.013-151.834c83.745-73.906 204.145-91.938 312.168-92.14 45.028-.084 80.126-1.19 124.027 13.545 169.45 56.882 263.58 237.981 273.76 407.932.14 2.24 1.56 4.244 3.14 5.715v61.539c-.3.281-.61.545-.89.841-2.46 2.594-9.55 69.463-11.01 78.05-30.09 176.813-128.87 331.204-320.998 351.765-76.535 8.191-146.883-8.819-212.03-49.764-17.023-10.699-34.817-27.755-51.367-36.298-28.111 47.051-40.126 92.666-53.847 144.952-10.473 39.913-11.073 44.983.176 85.193 13.752 49.16 25.491 103.04 54.491 146.02l1.098-.67c10.141-6.3 20.069-15.05 29.814-21.95 55.643-39.41 118.239-66.75 186.83-67.94 226.203-3.9 354.423 191.36 371.133 396.62.72 8.82 1.69 32.74 6.6 38.95v61.37c-3.75 3.85-4.45 16.64-4.96 22.38-14.54 164.79-109.59 338.34-274.4 392.06-8.69 2.83-39.967 8.56-44.578 11.73h-152.094c-3.386-2.6-6.831-2.94-10.914-3.41-90.358-10.28-186.665-42.65-248.644-111.95-30.944-34.6-54.986-102.88-50.279-148.94 7.934-74.65 62.339-155.88 141.553-165.5 44.18-5.36 103.543 27.14 130.445 61.86 22.093 27.76 24.779 57.33 21.856 90.25-7.969 89.76-65.531 133.41-153.665 118.8-11.109-1.84-40.34-10.66-49.746-4.04-9.242 6.5 11.583 29.72 17.075 34.42 40.208 35 99.111 61.1 151.244 71.4a390 390 0 0 0 85.307 6.59c34.799-1.02 63.019-11.84 87.16-37.83 100.56-108.24 116.55-293.06 113.77-433.97-3.68-79.71-16.67-168.68-65.14-234.36-21.799-29.54-54.566-52.61-90.735-59.16-20.026-3.63-38.334-1.41-57.652-1.74-98.034-1.64-171.013 59.33-197.048 152.57-7.027 25.17-16.398 66.71-35.035 86.6 16.01-138.89-59.563-315.21-138.948-427.28-3.261-4.6-6.743-9.24-10.044-13.85";

function STR_drawCClef(ctx, x, yTop, ls, lineIdx, color){
  const col = color || '#1e1e2e';

  // Mesures précises du path SVG (viewBox 0 0 1318 2048) :
  //   - La portée (barres verticales) va de y=13.946 à y=1933.447 dans le SVG
  //   - Hauteur de portée SVG : 1919.501 px  (= 4 espaces)
  //   - Do central (milieu symétrique) : y = 973.696 dans le SVG
  const SVG_STAFF_TOP = 13.946;
  const SVG_STAFF_H   = 1919.501;
  const SVG_MID_C     = 973.696;

  // cy = position canvas du Do central voulu
  const cy = yTop + lineIdx * ls;

  // Scale : 4 espaces canvas = SVG_STAFF_H
  const scaleY = (4 * ls) / SVG_STAFF_H;
  const scaleX = scaleY;

  // Aligner la 1re ligne de portée SVG sur yTop :
  //   yTop = svgOriginY + SVG_STAFF_TOP * scaleY
  //   svgOriginY = yTop - SVG_STAFF_TOP * scaleY
  const svgOriginY = yTop - SVG_STAFF_TOP * scaleY;

  ctx.save();
  ctx.fillStyle = col;
  ctx.translate(x, svgOriginY);
  ctx.scale(scaleX, scaleY);
  ctx.fill(new Path2D(_CCLEF_PATH_DATA));
  ctx.restore();
}
/* ─── Construire le sélecteur de tonalité ─── */
function STR_buildKeySelector(){
  const sel = document.getElementById('str_keySel'); if(!sel) return;
  const cur = sel.value;
  sel.innerHTML = AH_KEY_LIST.map((k,i)=>{
    const name = currentLang==='en'?k.nameEn:currentLang==='es'?k.nameEs:k.name;
    return `<option value="${i}">${name}</option>`;
  }).join('');
  if(cur) sel.value = cur;
}

/* ─── Construire les champs de saisie ─── */
function STR_buildInputs(){
  const el = document.getElementById('str_voiceInputs'); if(!el) return;
  const L = currentLang;
  const defaults = {VL1:'B4',VL2:'G4',VLA:'C4',VLC:'G2',CB:'G1'};
  const useFlats = STR_keyInfo ? STR_keyInfo.sharps < 0 : false;
  // Instruments qui ont la clef de ténor disponible
  const tenorClefInsts = {VLC:true, BN_STR:false}; // VLC = violoncelle
  let h = '';
  STR_ORDER.forEach(id=>{
    const inst = STR_INSTRUMENTS[id];
    const label = inst.label[L] || inst.label.fr;
    const defVal = defaults[id];
    const dlId = `str_dl_${id}`;
    const strOpts = AH_buildNoteOptions(inst.midi.lo, inst.midi.hi, useFlats);
    const strDL = `<datalist id="${dlId}">${strOpts.map(o=>`<option value="${o}">`).join('')}</datalist>`;
    // Bouton clef ténor pour VLC
    const hasTenorClef = (id === 'VLC');
    const tenorBtn = hasTenorClef
      ? `<button onclick="STR_toggleTenorClef('${id}')" id="str_tenorbtn_${id}" title="${window.t('str_clef_tenor')||'Clef de ténor'}"
           style="font-size:9px;padding:2px 6px;border-radius:4px;border:1px solid var(--bd);background:${(STR_tenorClef&&STR_tenorClef[id])?'#534AB7':'var(--bg)'};color:${(STR_tenorClef&&STR_tenorClef[id])?'#fff':'var(--t2)'};cursor:pointer;margin-left:2px;font-weight:600" data-i18n="str_clef_tenor">${window.t('str_clef_tenor')||'Clef de ténor'}</button>`
      : '';
    // Bouton clef d'alto / clef de sol pour VLA (par défaut clef d'alto, bouton bascule en treble)
    const hasAltClef = (id === 'VLA');
    const altBtn = hasAltClef
      ? `<button onclick="STR_toggleAltClef('${id}')" id="str_altbtn_${id}" title="${(STR_altClef&&STR_altClef[id])?(window.t('str_clef_treble')||'Clef de sol'):(window.t('str_clef_alto')||"Clef d'alto (par défaut)")}"
           style="font-size:9px;padding:2px 6px;border-radius:4px;border:1px solid var(--bd);background:${(STR_altClef&&STR_altClef[id])?'#534AB7':'var(--bg)'};color:${(STR_altClef&&STR_altClef[id])?'#fff':'var(--t2)'};cursor:pointer;margin-left:2px;font-weight:600">${(STR_altClef&&STR_altClef[id])?(window.t('str_clef_treble')||'Clef de sol'):(window.t('str_clef_alto')||"Clef d'alto")}</button>`
      : '';
    h += `
      <div class="voice-row str-voice-row" style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:5px;background:rgba(0,0,0,0.02);border-left:3px solid ${inst.color}">
        <div class="voice-label" style="font-size:11px;font-weight:600;color:${inst.color};min-width:130px">${label}</div>
        ${strDL}
        <input type="text" class="str-note-input" id="str_in_${id}" value="${defVal}"
               list="${dlId}"
               oninput="STR_onNoteInput('${id}')"
               style="width:70px;padding:3px 6px;font-size:11px;text-align:center;border:1px solid var(--bd);border-radius:4px;font-family:monospace">
        ${tenorBtn}
        ${altBtn}
        <span class="str-register-badge" id="str_reg_${id}" style="font-size:9px;color:var(--t3);margin-left:auto"></span>
      </div>`;
  });
  el.innerHTML = h;
  STR_ORDER.forEach(id=> STR_updateRegisterBadge(id));
}

/* ─── Badge registre ─── */
function STR_updateRegisterBadge(id){
  const inp = document.getElementById('str_in_'+id); if(!inp) return;
  const badge = document.getElementById('str_reg_'+id); if(!badge) return;
  const midi = STR_parseNote(inp.value);
  if(midi==null){ badge.textContent=''; badge.style.cssText=''; return; }
  if(!STR_inRange(midi,id)){
    badge.textContent = '⚠ '+(window.t('str_range_out') || 'hors tessiture');
    badge.style.cssText='background:#fee2e2;color:#dc2626;padding:3px 8px;border-radius:20px;font-weight:700;font-size:9.5px;border:1px solid #fca5a5;letter-spacing:0.3px';
    return;
  }
  const reg = STR_getRegister(midi,id);
  const map = {
    low:    {fr:'♭ grave',  en:'♭ low',     es:'♭ grave',   bg:'#eff6ff',cl:'#1e40af',bd:'#bfdbfe'},
    mid:    {fr:'◆ médium', en:'◆ mid',     es:'◆ medio',   bg:'#f0fdf4',cl:'#166534',bd:'#bbf7d0'},
    high:   {fr:'♯ aigu',  en:'♯ high',    es:'♯ agudo',   bg:'#fffbeb',cl:'#92400e',bd:'#fcd34d'},
    extreme:{fr:'⚡ extrême',en:'⚡ extreme', es:'⚡ extremo', bg:'#fff1f2',cl:'#be123c',bd:'#fda4af'}
  };
  const m = map[reg]; if(!m){badge.textContent='';return;}
  badge.textContent = m[currentLang]||m.fr;
  badge.style.cssText=`background:${m.bg};color:${m.cl};padding:3px 8px;border-radius:20px;font-weight:700;font-size:9.5px;border:1px solid ${m.bd};letter-spacing:0.3px`;
}

/* ─── Handlers UI ─── */
function STR_onNoteInput(id){
  STR_updateRegisterBadge(id);
  STR_analyze();
  STR_render();
}

function STR_onModeChange(){
  const sel = document.getElementById('str_modeSelect'); if(!sel) return;
  STR_progMode = sel.value;
  STR_analyze();
  STR_render();
}

function STR_toggleTenorClef(id){
  STR_tenorClef[id] = !STR_tenorClef[id];
  // Mettre à jour le style du bouton
  const btn = document.getElementById('str_tenorbtn_'+id);
  if(btn){
    btn.style.background = STR_tenorClef[id] ? '#534AB7' : 'var(--bg)';
    btn.style.color = STR_tenorClef[id] ? '#fff' : 'var(--t2)';
  }
  // Propaguer au TUTTI si disponible
  if(typeof TUT_render === 'function') TUT_render();
  STR_render();
}

function STR_toggleAltClef(id){
  STR_altClef[id] = !STR_altClef[id];
  // Re-render des inputs pour mettre à jour le label/titre du bouton (Sol/Ut3)
  if(typeof STR_buildInputs === 'function') STR_buildInputs();
  if(typeof TUT_render === 'function') TUT_render();
  STR_render();
}

function STR_updateKey(){
  const sel = document.getElementById('str_keySel'); if(!sel) return;
  const k = AH_KEY_LIST[+sel.value];
  if(k) STR_keyInfo = {root:k.root, minor:k.minor, sharps:k.sharps};
  STR_analyze();
  STR_render();
}

/* ─── Lire les notes saisies ─── */
function STR_readCurrentNotes(){
  const notes = {};
  STR_ORDER.forEach(id=>{
    const inp = document.getElementById('str_in_'+id);
    const v = inp ? STR_parseNote(inp.value) : null;
    notes[id] = v;
  });
  return notes;
}

/* ─── CRUD accords ─── */
function STR_addChord(){
  if(STR_chords.length >= STR_MAX_CHORDS) return;
  const notes = STR_readCurrentNotes();
  STR_chords.push({notes});
  STR_selChord = STR_chords.length - 1;
  STR_analyze();
  STR_render();
  try{window.dispatchEvent(new CustomEvent('contrepoint:chordschange'));}catch(e){}
}

function STR_updateChord(){
  if(STR_selChord<0||STR_selChord>=STR_chords.length) return;
  STR_chords[STR_selChord].notes = STR_readCurrentNotes();
  STR_analyze();
  STR_render();
  try{window.dispatchEvent(new CustomEvent('contrepoint:chordschange'));}catch(e){}
}

function STR_removeSelected(){
  if(STR_selChord<0||STR_selChord>=STR_chords.length) return;
  STR_chords.splice(STR_selChord,1);
  STR_selChord = Math.min(STR_selChord, STR_chords.length-1);
  STR_analyze();
  STR_render();
  try{window.dispatchEvent(new CustomEvent('contrepoint:chordschange'));}catch(e){}
}

function STR_clearAll(){
  STR_chords=[]; STR_selChord=-1; STR_errors=[];
  STR_analyze();
  STR_render();
  try{window.dispatchEvent(new CustomEvent('contrepoint:chordschange'));}catch(e){}
}

function STR_selectChord(ci){
  STR_selChord = ci;
  // Pré-remplir les inputs avec l'accord sélectionné
  const ch = STR_chords[ci]; if(!ch) return;
  STR_ORDER.forEach(id=>{
    const inp = document.getElementById('str_in_'+id); if(!inp) return;
    const midi = ch.notes[id];
    if(midi!=null) inp.value = STR_midiToName(midi, STR_keyInfo.sharps<0);
    STR_updateRegisterBadge(id);
  });
  STR_render();
}

/* ─── Compteur d'accords ─── */
function STR_updateChordCounter(){
  const el = document.getElementById('str_chordCount'); if(!el) return;
  const span = el.querySelector('span');
  const node = span ? el.childNodes[0] : el;
  if(node && node.nodeType===3) node.nodeValue = `${STR_chords.length} / ${STR_MAX_CHORDS} `;
}

/* ─── Analyse harmonique ─── */
function STR_analyze(){
  STR_errors = [];
  const chordsToAnalyze = STR_progMode==='single'
    ? (STR_selChord>=0 ? [STR_chords[STR_selChord]] : STR_chords.slice(0,1))
    : STR_chords;
  if(!chordsToAnalyze.length){ STR_renderErrors(); return; }

  const useFlats = STR_keyInfo.sharps < 0;

  /* ── Analyse accord par accord ── */
  chordsToAnalyze.forEach((ch, _ci)=>{
    // Index réel dans STR_chords (pour affichage)
    const ci = STR_progMode==='single' && STR_selChord>=0 ? STR_selChord : _ci;
    const voices = STR_ORDER.map(id=>({id, midi:ch.notes[id]})).filter(v=>v.midi!=null);

    voices.forEach(v=>{
      const n = STR_midiToName(v.midi, useFlats);
      // Hors tessiture
      if(!STR_inRange(v.midi, v.id)){
        STR_errors.push({type:'error', chord:ci, instId:v.id,
          rule:window.t('str_range_out')||'Hors tessiture',
          msg:`${STR_INSTRUMENTS[v.id].short}: ${n}`});
        return;
      }
      // Registre extrême
      if(STR_getRegister(v.midi, v.id)==='extreme'){
        STR_errors.push({type:'warn', chord:ci, instId:v.id,
          rule:window.t('str_range_extreme')||'Registre extrême',
          msg:`${STR_INSTRUMENTS[v.id].short}: ${n}`});
      }
      // Contrebasse > Sol3 (MIDI 55) — rare
      if(v.id==='CB' && v.midi > 55){
        STR_errors.push({type:'warn', chord:ci, instId:v.id,
          rule:window.t('str_cb_high')||'Contrebasse : note élevée',
          msg:`${STR_INSTRUMENTS['CB'].short}: ${n}`});
      }
    });

    /* Croisements & trous (entre pupitres adjacents dans l'ordre de partition) */
    for(let i=0; i<voices.length-1; i++){
      const a = voices[i], b = voices[i+1];
      // On s'assure que a et b sont adjacents dans STR_ORDER
      const oi = STR_ORDER.indexOf(a.id), oj = STR_ORDER.indexOf(b.id);
      if(oj !== oi+1) continue;
      // Croisement : voix inférieure (b) plus haute que voix supérieure (a)
      if(b.midi > a.midi){
        STR_errors.push({type:'warn', chord:ci,
          rule:window.t('str_cross')||'Croisement de pupitres',
          msg:`${STR_INSTRUMENTS[b.id].short} > ${STR_INSTRUMENTS[a.id].short}`});
      }
      // Unisson expressif (info)
      if(a.midi === b.midi){
        STR_errors.push({type:'info', chord:ci,
          rule:window.t('str_unison')||'Unisson entre pupitres',
          msg:`${STR_INSTRUMENTS[a.id].short}=${STR_INSTRUMENTS[b.id].short} (${STR_midiToName(a.midi,useFlats)})`});
      }
    }

    /* Doublure sensible */
    const lt = (STR_keyInfo.root + 11) % 12;
    const ltVoices = voices.filter(v=>(v.midi%12)===lt);
    if(ltVoices.length>=2){
      STR_errors.push({type:'error', chord:ci,
        rule:window.t('str_lt_doubled')||'Sensible doublée',
        msg: ltVoices.map(v=>STR_INSTRUMENTS[v.id].short).join(', ')});
    }
  });

  /* ── Parallélismes entre accords consécutifs (mode progression) ── */
  if(STR_progMode==='progression'){
    for(let i=0; i<STR_chords.length-1; i++){
      const chA = STR_chords[i], chB = STR_chords[i+1];
      for(let x=0; x<STR_ORDER.length; x++){
        for(let y=x+1; y<STR_ORDER.length; y++){
          const idA = STR_ORDER[x], idB = STR_ORDER[y];
          const a1=chA.notes[idA], a2=chB.notes[idA];
          const b1=chA.notes[idB], b2=chB.notes[idB];
          if(a1==null||a2==null||b1==null||b2==null) continue;
          const intA = STR_interval(a1,b1), intB = STR_interval(a2,b2);
          const mot  = STR_motionType(a1,a2,b1,b2);
          const lA = STR_INSTRUMENTS[idA].short, lB = STR_INSTRUMENTS[idB].short;
          if(intA===7 && intB===7 && mot==='direct')
            STR_errors.push({type:'error', chord:i,
              rule:window.t('str_p5')||'Quintes //',
              msg:`${lA}–${lB} (${i+1}→${i+2})`});
          if(intA===0 && intB===0 && mot==='direct' && a1!==a2)
            STR_errors.push({type:'error', chord:i,
              rule:window.t('str_p8')||'Octaves //',
              msg:`${lA}–${lB} (${i+1}→${i+2})`});
        }
      }
    }
  }

  STR_renderErrors();
}

/* ─── Afficher les erreurs ─── */
function STR_renderErrors(){
  const el = document.getElementById('str_errList'); if(!el) return;
  const cnt = document.getElementById('str_errCount');

  if(!STR_errors.length){
    if(cnt) cnt.textContent = '0';
    el.innerHTML = `<div style="padding:10px;text-align:center;color:var(--t3);font-size:11px;font-style:italic">${window.t('str_no_errors')||'Aucune erreur détectée'}</div>`;
    return;
  }
  if(cnt) cnt.textContent = STR_errors.length;

  const colorMap = {error:'#dc2626',warn:'#d97706',info:'#2563eb'};
  const iconMap  = {error:'✗',warn:'⚠',info:'ℹ'};
  el.innerHTML = STR_errors.map(e=>`
    <div style="display:flex;align-items:flex-start;gap:8px;padding:5px 8px;border-radius:4px;margin-bottom:3px;background:${e.type==='error'?'#fff5f5':e.type==='warn'?'#fffbeb':'#eff6ff'}">
      <span style="color:${colorMap[e.type]};font-weight:700;font-size:12px;min-width:12px">${iconMap[e.type]}</span>
      <div style="flex:1">
        <div style="font-size:10.5px;font-weight:600;color:${colorMap[e.type]}">${e.rule}</div>
        <div style="font-size:10px;color:var(--t2)">${e.msg}</div>
      </div>
      <span style="font-size:9px;color:var(--t3);white-space:nowrap">#${e.chord+1}</span>
    </div>`).join('');
}

/* ─── Canvas — rendu partition ─── */
function STR_render(){
  STR_updateChordCounter();

  const canvas = document.getElementById('str_scoreCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const staves = STR_ORDER.length; // toujours 5

  const cw = Math.max(900, (canvas.parentElement ? canvas.parentElement.clientWidth - 28 : 900));
  const staveGap  = 18;
  const staveH    = 4 * STR_LS;
  const top       = 26;
  const totalH    = top + staves * (staveH + staveGap) + 30;

  canvas.style.width  = cw + 'px';
  canvas.style.height = totalH + 'px';
  canvas.width  = cw * dpr;
  canvas.height = totalH * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0,0,cw,totalH);

  /* ── Portées ── */
  const stavesData = STR_ORDER.map((id, idx)=>{
    const inst  = STR_INSTRUMENTS[id];
    const yTop  = top + idx * (staveH + staveGap);
    // 5 lignes
    ctx.strokeStyle = '#555'; ctx.lineWidth = 0.8;
    for(let l=0; l<5; l++){
      const y = yTop + l*STR_LS;
      ctx.beginPath(); ctx.moveTo(STR_LM, y); ctx.lineTo(cw-STR_RM, y); ctx.stroke();
    }
    // Barre gauche
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(STR_LM, yTop); ctx.lineTo(STR_LM, yTop+4*STR_LS); ctx.stroke();

    // Étiquette
    ctx.fillStyle = inst.color;
    ctx.font = 'bold 10px "DM Sans",sans-serif';
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    ctx.fillText(inst.short, STR_LM - 8, yTop + 2*STR_LS);

    // Clé
    const fs = STR_LS * 4.2;
    ctx.fillStyle = '#1e1e2e';
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    const useTenor = STR_tenorClef && STR_tenorClef[id];
    const useAlt   = STR_altClef   && STR_altClef[id];
    // VLA : clef d'alto par défaut. Bouton "Sol" (STR_altClef[VLA]=true) → clef de sol.
    // Autres instruments : bouton STR_altClef[id]=true → clef d'alto.
    if(useTenor){
      // Clef de ténor (ut 4e ligne)
      STR_drawTenorClef(ctx, STR_LM + 3, yTop, STR_LS);
    } else if(id === 'VLA' && !useAlt){
      // Alto par défaut : clef d'alto
      STR_drawAltClef(ctx, STR_LM + 3, yTop, STR_LS);
    } else if(useAlt && id !== 'VLA'){
      // Autre instrument basculé en clef d'alto
      STR_drawAltClef(ctx, STR_LM + 3, yTop, STR_LS);
    } else if(inst.clef === 'treble' || inst.clef === 'alto' || (id === 'VLA' && useAlt)){
      // Clef de sol (treble) — y compris VLA basculé manuellement
      ctx.font = `${fs}px "Times New Roman",Georgia,serif`;
      const m = ctx.measureText('\uD834\uDD1E');
      const h = (m.actualBoundingBoxAscent||fs*0.75)+(m.actualBoundingBoxDescent||fs*0.25);
      ctx.fillText('\uD834\uDD1E', STR_LM+3, (yTop+3*STR_LS)+h*0.38-(m.actualBoundingBoxDescent||fs*0.25));
    } else {
      const bfs = fs*0.78;
      ctx.font = `${bfs}px "Times New Roman",Georgia,serif`;
      const m = ctx.measureText('\uD834\uDD22');
      const h = (m.actualBoundingBoxAscent||bfs*0.8)+(m.actualBoundingBoxDescent||bfs*0.1);
      ctx.fillText('\uD834\uDD22', STR_LM+4, (yTop+STR_LS)-h*0.15+(m.actualBoundingBoxAscent||bfs*0.8));
    }

    return {id, inst, yTop};
  });

  /* ── Armure ── */
  const ksN = STR_keyInfo.sharps||0;
  const sharpTP=[0,1.5,-0.5,1,2.5,0.5,2], sharpBP=[1,2.5,0.5,2,3.5,1.5,3];
  const flatTP=[2,0.5,2.5,1,3,1.5,3.5],  flatBP=[3,1.5,3.5,2,4,2.5,4.5];
  let ksX = STR_LM + 38;
  stavesData.forEach(s=>{
    const isBass = s.inst.clef==='bass';
    const tp  = isBass ? sharpBP : sharpTP;
    const tpf = isBass ? flatBP  : flatTP;
    if(ksN>0){
      ctx.font=`${STR_LS*1.5}px "Times New Roman",Georgia,serif`;
      ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillStyle='#1e1e2e';
      for(let i=0;i<ksN&&i<7;i++) ctx.fillText('\u266F', ksX+i*8, s.yTop+tp[i]*STR_LS);
    } else if(ksN<0){
      const c=-ksN;
      ctx.font=`${STR_LS*1.7}px "Times New Roman",Georgia,serif`;
      ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillStyle='#1e1e2e';
      for(let i=0;i<c&&i<7;i++) ctx.fillText('\u266D', ksX+i*8, s.yTop+tpf[i]*STR_LS);
    }
  });
  if(ksN!==0) ksX += Math.abs(ksN)*8+6;

  STR_noteHits = [];
  if(!STR_chords.length) return;

  const startX  = ksX + 14;
  const chW     = Math.min(70, (cw - startX - STR_RM - 10) / STR_chords.length);
  const noteSize= Math.max(4, Math.min(6, 80/STR_chords.length));

  const errSet = new Set(STR_errors.map(e=>e.chord));

  STR_chords.forEach((ch, ci)=>{
    const x = startX + ci*chW + chW/2;
    // Fond erreur
    if(errSet.has(ci)){
      ctx.fillStyle='rgba(239,68,68,0.06)';
      ctx.fillRect(x-chW/2+2, top-6, chW-4, totalH-top-20);
    }
    // Fond sélection
    if(ci===STR_selChord){
      ctx.fillStyle='rgba(83,74,183,0.06)';
      ctx.fillRect(x-chW/2+2, top-6, chW-4, totalH-top-20);
    }

    // Collision detection : notes côte à côte si même Y
    const strNoteData = stavesData.map(s=>{
      const midi = ch.notes[s.id]; if(midi==null) return null;
      // VLA : clef d'alto par défaut, bouton "Sol" la bascule en treble.
      // Autres instruments : par défaut leur clef native, bouton "Ut3"/"Ut4" bascule.
      let effectiveClef;
      if(s.id === 'VLA'){
        effectiveClef = (STR_altClef && STR_altClef[s.id]) ? 'treble' : 'alto';
      } else if(STR_tenorClef && STR_tenorClef[s.id]){
        effectiveClef = 'tenor';
      } else if(STR_altClef && STR_altClef[s.id]){
        effectiveClef = 'alto';
      } else {
        effectiveClef = s.inst.clef;
      }
      const y = STR_midiToY(midi, s.yTop, effectiveClef);
      return {s, midi, y, effectiveClef, xOff:0};
    }).filter(Boolean);
    const strSorted = [...strNoteData].sort((a,b)=>a.y-b.y);
    for(let i=1;i<strSorted.length;i++){
      if(Math.abs(strSorted[i].y - strSorted[i-1].y) < STR_LS*0.9)
        strSorted[i].xOff = (noteSize+2)*2;
    }
    strNoteData.forEach(({s, midi, y, effectiveClef, xOff})=>{
      const nx = x + xOff;
      const yBot = s.yTop + 4*STR_LS;
      ctx.strokeStyle='#888'; ctx.lineWidth=0.8;
      if(y < s.yTop) for(let ly=s.yTop-STR_LS; ly>=y-1; ly-=STR_LS){
        ctx.beginPath(); ctx.moveTo(nx-9,ly); ctx.lineTo(nx+9,ly); ctx.stroke();
      }
      if(y > yBot) for(let ly=yBot+STR_LS; ly<=y+1; ly+=STR_LS){
        ctx.beginPath(); ctx.moveTo(nx-9,ly); ctx.lineTo(nx+9,ly); ctx.stroke();
      }
      ctx.save();
      ctx.translate(nx, y);
      ctx.rotate(-0.18);
      ctx.beginPath();
      ctx.ellipse(0,0, noteSize+1, noteSize-1.5, 0,0,Math.PI*2);
      ctx.fillStyle = s.inst.color;
      ctx.fill();
      ctx.restore();
      STR_noteHits.push({chordIdx:ci, id:s.id, x:nx, y, r:noteSize+4, midi, yTop:s.yTop, inst:s.inst, effectiveClef});
      // Hors tessiture : cercle rouge
      if(!STR_inRange(midi,s.id)){
        ctx.strokeStyle='#dc2626'; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.arc(nx,y,noteSize+3,0,Math.PI*2); ctx.stroke();
      }
    });

    // Barre de mesure
    if(ci<STR_chords.length-1){
      ctx.strokeStyle='#ccc'; ctx.lineWidth=0.5;
      const bx=x+chW/2;
      stavesData.forEach(s=>{
        ctx.beginPath(); ctx.moveTo(bx,s.yTop); ctx.lineTo(bx,s.yTop+4*STR_LS); ctx.stroke();
      });
    }
  });

  // Double barre finale
  if(STR_chords.length){
    const lx = startX+(STR_chords.length-1)*chW+chW/2+chW/2;
    ctx.strokeStyle='#333'; ctx.lineWidth=1;
    stavesData.forEach(s=>{ ctx.beginPath(); ctx.moveTo(lx,s.yTop); ctx.lineTo(lx,s.yTop+4*STR_LS); ctx.stroke(); });
    ctx.lineWidth=3.5;
    stavesData.forEach(s=>{ ctx.beginPath(); ctx.moveTo(lx+5,s.yTop); ctx.lineTo(lx+5,s.yTop+4*STR_LS); ctx.stroke(); });
  }
}

/* ─── Clic canvas pour sélectionner un accord ─── */
function STR_setupCanvasEvents(){
  const canvas = document.getElementById('str_scoreCanvas'); if(!canvas) return;
  canvas.onclick = (e)=>{
    if(!STR_chords.length) return;
    const rect = canvas.getBoundingClientRect();
    const xClick = (e.clientX - rect.left);
    const staves  = STR_ORDER.length;
    const staveGap=18, staveH=4*STR_LS, top=26;
    const cw = rect.width;
    const ksN = Math.abs(STR_keyInfo.sharps||0);
    const startX = STR_LM + 38 + (ksN?ksN*8+6:0) + 14;
    const chW = Math.min(70,(cw-startX-STR_RM-10)/STR_chords.length);
    const idx = Math.floor((xClick - startX) / chW);
    if(idx>=0 && idx<STR_chords.length) STR_selectChord(idx);
  };
  // Drag & drop
  AH_initCanvasDrag({
    canvasId: 'str_scoreCanvas',
    getNoteAt(cx, cy){
      return STR_noteHits.find(h=>Math.hypot(cx-h.x, cy-h.y)<=h.r) || null;
    },
    snapMidi(drag, cy){
      const dy = drag.y - cy;
      const diaSteps = Math.round(dy / (STR_LS/2));
      const DIA = [0,0,1,1,2,3,3,4,4,5,5,6];
      const CHR = [0,2,4,5,7,9,11];
      function toDia(m){ return Math.floor(m/12)*7 + DIA[m%12]; }
      function fromDia(d){ const o=Math.floor(d/7); const s=((d%7)+7)%7; return o*12+CHR[s]; }
      return Math.max(0, Math.min(127, fromDia(toDia(drag.startMidi)+diaSteps)));
    },
    setMidi(drag, midi, preview){
      if(STR_chords[drag.chordIdx]) STR_chords[drag.chordIdx].notes[drag.id] = midi;
      const inp = document.getElementById('str_in_'+drag.id);
      if(inp){ inp.value = STR_midiToName(midi, STR_keyInfo.sharps<0); }
      STR_updateRegisterBadge(drag.id);
      STR_analyze(); STR_render();
      if(!preview) try{window.dispatchEvent(new CustomEvent('contrepoint:chordschange'));}catch(e){}
    },
    onDragEnd(){}
  });
}

/* ─── Audio ─── */
function STR_playChordAudio(ch, startTime, dur){
  if(typeof _getPianoChain!=='function') return;
  const chain=_getPianoChain(), actx=chain.ctx;
  const t=startTime||actx.currentTime;
  let i=0;
  STR_ORDER.forEach(id=>{
    const midi=ch.notes[id]; if(midi==null) return;
    const f=440*Math.pow(2,(midi-69)/12);
    if(typeof pianoNote==='function') pianoNote(f,t+(i++)*0.006,dur,actx,chain.dry,chain.wet,0.20);
  });
}
function STR_playSelected(){
  if(STR_selChord<0||STR_selChord>=STR_chords.length) return;
  const btn=document.getElementById('str_btnPlaySel');
  if(btn) btn.classList.add('playing');
  STR_playChordAudio(STR_chords[STR_selChord],null,1.5);
  setTimeout(()=>{ if(btn) btn.classList.remove('playing'); },1600);
}
function STR_playAll(){
  if(!STR_chords.length) return;
  const btn=document.getElementById('str_btnPlayAll');
  if(btn) btn.classList.add('playing');
  const tmpEl=document.getElementById('str_tempoInput');
  const bpm=tmpEl?Math.max(30,Math.min(200,+tmpEl.value)):72;
  const dur=60/bpm*0.9;
  if(typeof _getPianoChain!=='function') return;
  const chain=_getPianoChain(), actx=chain.ctx;
  let t=actx.currentTime;
  STR_chords.forEach(ch=>{ STR_playChordAudio(ch,t,dur); t+=dur+0.05; });
  const total=STR_chords.length*(dur+0.05)*1000;
  setTimeout(()=>{ if(btn) btn.classList.remove('playing'); }, total);
}

/* ─── Panneau Théorie ─── */
function STR_renderTheoryPanel(){
  const el=document.getElementById('str_theoryPanel'); if(!el) return;
  const L=currentLang;
  const pick=o=>o[L]||o.fr;

  let h=`<div class="vts-theory">`;

  /* 1. Tessitures */
  h+=`<h3 style="font-size:13px;color:#534AB7;margin:0 0 8px;border-bottom:1px solid #e5e7eb;padding-bottom:4px">${window.t('str_th_ranges')||'1. Tessitures'}</h3>`;
  h+=`<table style="width:100%;border-collapse:collapse;font-size:10px;margin-bottom:12px">
    <tr style="background:#f5f3ff">
      <th style="padding:3px 6px;text-align:left;border:1px solid #e5e7eb">${window.t('str_th_inst')||'Instrument'}</th>
      <th style="padding:3px 6px;border:1px solid #e5e7eb">${window.t('str_th_range_lbl')||'Tessiture'}</th>
      <th style="padding:3px 6px;border:1px solid #e5e7eb">${window.t('str_th_clef')||'Clé'}</th>
      <th style="padding:3px 6px;text-align:left;border:1px solid #e5e7eb">${window.t('str_th_notes')||'Registres'}</th>
    </tr>`;
  const rangeRows=[
    {id:'VL1',clef:{fr:'Sol',en:'Treble',es:'Sol'},  notes:{fr:'grave G3–B4 · médium C5–B5 · aigu C6–E7',en:'low G3–B4 · mid C5–B5 · high C6–E7',es:'grave G3–B4 · medio C5–B5 · agudo C6–E7'}},
    {id:'VL2',clef:{fr:'Sol',en:'Treble',es:'Sol'},  notes:{fr:'grave G3–B4 · médium C5–B5 · aigu C6–C7',en:'low G3–B4 · mid C5–B5 · high C6–C7',es:'grave G3–B4 · medio C5–B5 · agudo C6–C7'}},
    {id:'VLA',clef:{fr:'Ut 3e',en:'Alto C',es:'Do 3ª'},notes:{fr:'grave C3–G3 · médium A3–G4 · aigu A4–E6',en:'low C3–G3 · mid A3–G4 · high A4–E6',es:'grave C3–G3 · medio A3–G4 · agudo A4–E6'}},
    {id:'VLC',clef:{fr:'Fa (aigu : Sol)',en:'Bass (high: Treble)',es:'Fa (agudo: Sol)'},notes:{fr:'grave C2–B3 · médium C4–C5 · aigu D5–G6',en:'low C2–B3 · mid C4–C5 · high D5–G6',es:'grave C2–B3 · medio C4–C5 · agudo D5–G6'}},
    {id:'CB', clef:{fr:'Fa',en:'Bass',es:'Fa'},      notes:{fr:'grave E1–C3 · médium D3–Ab3 · aigu A3–G4',en:'low E1–C3 · mid D3–Ab3 · high A3–G4',es:'grave E1–C3 · medio D3–Ab3 · agudo A3–G4'}}
  ];
  rangeRows.forEach(r=>{
    const inst=STR_INSTRUMENTS[r.id];
    const lo=STR_midiToName(inst.midi.lo,false), hi=STR_midiToName(inst.midi.hi,false);
    h+=`<tr>
      <td style="padding:3px 6px;border:1px solid #f0f0f4"><strong style="color:${inst.color}">${pick(inst.label)}</strong></td>
      <td style="padding:3px 6px;border:1px solid #f0f0f4">${lo}–${hi}</td>
      <td style="padding:3px 6px;border:1px solid #f0f0f4">${pick(r.clef)}</td>
      <td style="padding:3px 6px;border:1px solid #f0f0f4;font-size:9.5px">${pick(r.notes)}</td>
    </tr>`;
  });
  h+=`</table>`;

  /* 2. Techniques de jeu */
  const tech=[
    {title:{fr:'Arco',en:'Arco',es:'Arco'},desc:{fr:'Jeu à l\'archet — mode principal, tons chantants et soutenus.',en:'Bowed playing — main mode, singing sustained tones.',es:'Con arco — modo principal, sonidos cantados y sostenidos.'}},
    {title:{fr:'Pizzicato',en:'Pizzicato',es:'Pizzicato'},desc:{fr:'Pizz. — pincement de corde ; sec, attaque nette, decay rapide.',en:'Pizz. — plucking the string; dry, clean attack, fast decay.',es:'Pizz. — punteo de la cuerda; seco, ataque limpio, decaimiento rápido.'}},
    {title:{fr:'Col legno',en:'Col legno',es:'Col legno'},desc:{fr:'Frapper avec le bois de l\'archet — effet percussif spectral.',en:'Strike with the bow wood — spectral percussive effect.',es:'Golpear con la madera del arco — efecto percusivo espectral.'}},
    {title:{fr:'Sul ponticello',en:'Sul ponticello',es:'Sul ponticello'},desc:{fr:'Près du chevalet — son métallique, brillant, légèrement nasal.',en:'Near the bridge — metallic, bright, slightly nasal.',es:'Cerca del puente — sonido metálico, brillante, ligeramente nasal.'}},
    {title:{fr:'Sul tasto',en:'Sul tasto',es:'Sul tasto'},desc:{fr:'Sur la touche — son velouté, doux, peu de projection.',en:'Over the fingerboard — velvety, soft, low projection.',es:'Sobre el diapasón — sonido aterciopelado, suave, poca proyección.'}},
    {title:{fr:'Harmoniques',en:'Harmonics',es:'Armónicos'},desc:{fr:'Flageolets — son cristallin, léger. Naturels (sur corde à vide) ou artificiels (doigté spécial).',en:'Harmonics — crystalline, light sound. Natural (open string) or artificial (special fingering).',es:'Flautados — sonido cristalino, ligero. Naturales (cuerda al aire) o artificiales (digitación especial).'}},
    {title:{fr:'Con sordino',en:'Con sordino',es:'Con sordino'},desc:{fr:'Avec sourdine — son feutré, intimiste, projection réduite.',en:'With mute — muffled, intimate, reduced projection.',es:'Con sordina — sonido apagado, íntimo, proyección reducida.'}}
  ];
  h+=`<h3 style="font-size:13px;color:#534AB7;margin:14px 0 8px;border-bottom:1px solid #e5e7eb;padding-bottom:4px">${window.t('str_th_techniques')||'2. Techniques de jeu'}</h3>`;
  h+=`<ul style="margin:0 0 0 18px;padding:0;font-size:10.5px;line-height:1.8">`;
  tech.forEach(t=>h+=`<li><strong>${pick(t.title)}</strong> — ${pick(t.desc)}</li>`);
  h+=`</ul>`;

  /* 3. Doubles-cordes */
  h+=`<h3 style="font-size:13px;color:#534AB7;margin:14px 0 8px;border-bottom:1px solid #e5e7eb;padding-bottom:4px">${window.t('str_th_doublestop')||'3. Doubles-cordes & accords'}</h3>`;
  h+=`<p style="font-size:10.5px;line-height:1.7;color:var(--t1)">${pick({
    fr:'Tous les instruments à cordes peuvent jouer des doubles-cordes (deux notes simultanées). Les accords de 3 ou 4 sons sont possibles mais nécessitent un arpège rapide ou un archet courbé. Les intervalles les plus jouables sont les tierces, sixtes, octaves et quintes. Les secondes et septièmes sont difficiles et d\'effet tendu.',
    en:'All string instruments can play double-stops (two simultaneous notes). Three- or four-note chords are possible but require a quick arpeggiation or curved bow. The most playable intervals are thirds, sixths, octaves, and fifths. Seconds and sevenths are difficult and create a tense effect.',
    es:'Todos los instrumentos de cuerda pueden tocar dobles cuerdas (dos notas simultáneas). Los acordes de 3 o 4 sonidos son posibles pero requieren un arpegio rápido o un arco curvado. Los intervalos más cómodos son las terceras, sextas, octavas y quintas. Las segundas y séptimas son difíciles y de efecto tenso.'
  })}</p>`;

  /* 4. Équilibre timbral */
  h+=`<h3 style="font-size:13px;color:#534AB7;margin:14px 0 8px;border-bottom:1px solid #e5e7eb;padding-bottom:4px">${window.t('str_th_balance')||'4. Équilibre timbral'}</h3>`;
  const bal=[
    {fr:'Cordes dans l\'aigu (Vl I au-dessus) : brillance, portée. Renforcer si possible par les Vl II.',en:'Strings in the high register (Vl I above): brilliance, projection. Reinforce if possible with Vl II.',es:'Cuerdas en el agudo (Vl I encima): brillantez, proyección. Reforzar si es posible con Vl II.'},
    {fr:'Violoncelle seul dans le grave : fondamental riche, mais attention aux octaves parallèles avec la contrebasse.',en:'Cello alone in the bass: rich fundamental, but beware of parallel octaves with double bass.',es:'Violonchelo solo en el grave: fundamental rico, pero cuidado con las octavas paralelas con el contrabajo.'},
    {fr:'La contrebasse se fond naturellement à l\'octave grave du violoncelle — c\'est une pratique courante.',en:'The double bass naturally blends an octave below the cello — this is common practice.',es:'El contrabajo se funde naturalmente a la octava grave del violonchelo — es una práctica habitual.'},
    {fr:'L\'alto comble le creux entre les violons et le violoncelle — éviter de l\'isoler mélodiquement à moins de vouloir sa couleur distinctive.',en:'The viola fills the gap between violins and cello — avoid isolating it melodically unless its distinctive colour is desired.',es:'La viola llena el hueco entre los violines y el violonchelo — evitar aislarla melódicamente a menos que se desee su color distintivo.'}
  ];
  h+=`<ul style="margin:0 0 0 18px;padding:0;font-size:10.5px;line-height:1.8">`;
  bal.forEach(b=>h+=`<li>${pick(b)}</li>`);
  h+=`</ul>`;

  /* 5. Erreurs courantes */
  h+=`<h3 style="font-size:13px;color:#534AB7;margin:14px 0 8px;border-bottom:1px solid #e5e7eb;padding-bottom:4px">${window.t('str_th_errors')||'5. Erreurs courantes'}</h3>`;
  const errs=[
    {fr:'Contrebasse > Sol3 : note possible mais exceptionnelle — la projection et le timbre se dégradent.',en:'Double bass > G3: possible but exceptional — projection and tone quality degrade.',es:'Contrabajo > Sol3: posible pero excepcional — la proyección y el timbre se degradan.'},
    {fr:'Croisement de pupitres : le Violon II au-dessus du Violon I, ou l\'Alto au-dessus du Violon II — sonne inversé et inconfortable.',en:'Voice crossing: Violin II above Violin I, or Viola above Violin II — sounds inverted and uncomfortable.',es:'Cruce de voces: Violín II por encima del Violín I, o Viola por encima del Violín II — suena invertido e incómodo.'},
    {fr:'Trou d\'octave entre pupitres adjacents : l\'orchestration semble creuse et déséquilibrée.',en:'Octave gap between adjacent desks: the orchestration sounds hollow and unbalanced.',es:'Hueco de octava entre atriles adyacentes: la orquestación suena hueca y desequilibrada.'},
    {fr:'Quintes et octaves parallèles entre voix adjacentes (Vl I–Vl II, Vl II–Alto…) : à proscrire en écriture académique.',en:'Parallel fifths and octaves between adjacent voices (Vl I–Vl II, Vl II–Va…): to be avoided in academic writing.',es:'Quintas y octavas paralelas entre voces adyacentes (Vl I–Vl II, Vl II–Va…): a evitar en escritura académica.'},
    {fr:'Sensible doublée : toujours une faute — la sensible doit rester unique et résoudre sur la tonique.',en:'Doubled leading tone: always an error — the leading tone must remain unique and resolve to the tonic.',es:'Sensible duplicada: siempre un error — la sensible debe ser única y resolver en la tónica.'}
  ];
  h+=`<ul style="margin:0 0 0 18px;padding:0;font-size:10.5px;line-height:1.7">`;
  errs.forEach(e=>h+=`<li style="margin-bottom:4px">${pick(e)}</li>`);
  h+=`</ul>`;

  h+=`</div>`;
  el.innerHTML=h;
}

/* ─── Export PDF ─── */
function STR_exportPDF(){
  const useFlats = STR_keyInfo.sharps<0;
  const L=currentLang;
  const pick=o=>o[L]||o.fr;
  const instLabel=id=>pick(STR_INSTRUMENTS[id].label);

  let body=`<html><head><meta charset="utf-8">
<style>
body{font-family:'DM Sans',sans-serif;font-size:11px;color:#1e1e2e;padding:20px}
h1{font-size:16px;color:#534AB7;border-bottom:2px solid #534AB7;padding-bottom:6px;margin-bottom:16px}
table{width:100%;border-collapse:collapse;font-size:10px;margin-bottom:14px}
th{background:#f5f3ff;padding:4px 8px;border:1px solid #e5e7eb;text-align:left}
td{padding:4px 8px;border:1px solid #f0f0f4}
.err{font-size:10px;margin:3px 0;padding:3px 8px;border-radius:3px}
.error-row{background:#fff5f5;color:#dc2626}
.warn-row{background:#fffbeb;color:#d97706}
.info-row{background:#eff6ff;color:#2563eb}
</style></head><body>`;

  body+=`<h1>${window.t('str_pdf_title')||'Analyse Cordes — Contrepoint'}</h1>`;
  body+=`<p style="font-size:10px;color:#6b7280;margin-bottom:12px">${new Date().toLocaleDateString(L==='fr'?'fr-FR':L==='es'?'es-ES':'en-US')}</p>`;

  if(STR_errors.length){
    body+=`<h2 style="font-size:13px;color:#534AB7;margin:14px 0 8px">${window.t('str_errors_title')||'Erreurs'}</h2>`;
    STR_errors.forEach(e=>{
      body+=`<div class="err ${e.type}-row">[#${e.chord+1}] <strong>${e.rule}</strong> — ${e.msg}</div>`;
    });
  }

  body+=`</body></html>`;
  const w=window.open('','_blank');
  if(w){ w.document.write(body); w.document.close(); w.print(); }
}

/* ─── Init ─── */
function STR_init(){
  if(!STR_initialized){
    STR_buildKeySelector();
    STR_buildInputs();
    STR_renderTheoryPanel();
    STR_keyInfo={root:0,minor:false,sharps:0};
    STR_initialized=true;
  }
  STR_analyze();
  STR_render();
  STR_setupCanvasEvents();
}

/* ─── Langue ─── */
window.addEventListener('contrepoint:langchange',()=>{
  if(window.AH_currentMode==='CORDES' && STR_initialized){
    STR_buildKeySelector();
    STR_buildInputs();
    STR_renderTheoryPanel();
    STR_analyze();
    STR_render();
    STR_ORDER.forEach(id=>{ STR_updateRegisterBadge(id); });
    if(typeof applyI18n==='function') applyI18n(currentLang);
  }
});

/* ─── Redimensionnement ─── */
window.addEventListener('resize',()=>{
  if(window.AH_currentMode==='CORDES' && STR_initialized) STR_render();
});

/* ─── Exports globaux ─── */
window.STR_init            = STR_init;
window.STR_updateKey       = STR_updateKey;
window.STR_onModeChange    = STR_onModeChange;
window.STR_onNoteInput     = STR_onNoteInput;
window.STR_toggleTenorClef = STR_toggleTenorClef;
window.STR_toggleAltClef   = STR_toggleAltClef;
window.STR_addChord        = STR_addChord;
window.STR_updateChord     = STR_updateChord;
window.STR_removeSelected  = STR_removeSelected;
window.STR_clearAll        = STR_clearAll;
window.STR_selectChord     = STR_selectChord;
window.STR_playSelected    = STR_playSelected;
window.STR_playAll         = STR_playAll;
window.STR_exportPDF       = STR_exportPDF;

/* ███  FIN MODULE CORDES  ████████████████████████████████████████████ */

/* ═══════════════════════════════════════════════════════════════════
   END mode switcher — original SATB code follows unchanged
   ═══════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════
   Analyseur harmonique — Vérificateur
   Conduite des voix SATB
   ═══════════════════════════════════════ */

const AH_VCOLORS = {S:'#0077BB', A:'#EE7733', T:'#009988', B:'#CC3311'};
const AH_VNAMES_FR = {S:'Soprano', A:'Alto', T:'Ténor', B:'Basse'};
const AH_VNAMES_EN = {S:'Soprano', A:'Alto', T:'Tenor', B:'Bass'};
const AH_VNAMES_ES = {S:'Soprano', A:'Alto', T:'Tenor', B:'Bajo'};
function AH_VN(v){return (currentLang==='en'?AH_VNAMES_EN:currentLang==='es'?AH_VNAMES_ES:AH_VNAMES_FR)[v];}
const AH_NOTES_S=['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
const AH_NOTES_F=['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'];
const AH_RANGE={S:[60,81],A:[53,74],T:[48,69],B:[40,64]};

const AH_KEY_LIST = [
  {name:'Do majeur',nameEn:'C major',nameEs:'Do mayor',root:0,minor:false,sharps:0},{name:'Sol majeur',nameEn:'G major',nameEs:'Sol mayor',root:7,minor:false,sharps:1},
  {name:'Ré majeur',nameEn:'D major',nameEs:'Re mayor',root:2,minor:false,sharps:2},{name:'La majeur',nameEn:'A major',nameEs:'La mayor',root:9,minor:false,sharps:3},
  {name:'Mi majeur',nameEn:'E major',nameEs:'Mi mayor',root:4,minor:false,sharps:4},{name:'Si majeur',nameEn:'B major',nameEs:'Si mayor',root:11,minor:false,sharps:5},
  {name:'Fa♯ majeur',nameEn:'F♯ major',nameEs:'Fa♯ mayor',root:6,minor:false,sharps:6},{name:'Fa majeur',nameEn:'F major',nameEs:'Fa mayor',root:5,minor:false,sharps:-1},
  {name:'Si♭ majeur',nameEn:'B♭ major',nameEs:'Si♭ mayor',root:10,minor:false,sharps:-2},{name:'Mi♭ majeur',nameEn:'E♭ major',nameEs:'Mi♭ mayor',root:3,minor:false,sharps:-3},
  {name:'La♭ majeur',nameEn:'A♭ major',nameEs:'La♭ mayor',root:8,minor:false,sharps:-4},{name:'Ré♭ majeur',nameEn:'D♭ major',nameEs:'Re♭ mayor',root:1,minor:false,sharps:-5},
  {name:'La mineur',nameEn:'A minor',nameEs:'La menor',root:9,minor:true,sharps:0},{name:'Mi mineur',nameEn:'E minor',nameEs:'Mi menor',root:4,minor:true,sharps:1},
  {name:'Si mineur',nameEn:'B minor',nameEs:'Si menor',root:11,minor:true,sharps:2},{name:'Fa♯ mineur',nameEn:'F♯ minor',nameEs:'Fa♯ menor',root:6,minor:true,sharps:3},
  {name:'Do♯ mineur',nameEn:'C♯ minor',nameEs:'Do♯ menor',root:1,minor:true,sharps:4},{name:'Ré mineur',nameEn:'D minor',nameEs:'Re menor',root:2,minor:true,sharps:-1},
  {name:'Sol mineur',nameEn:'G minor',nameEs:'Sol menor',root:7,minor:true,sharps:-2},{name:'Do mineur',nameEn:'C minor',nameEs:'Do menor',root:0,minor:true,sharps:-3},
  {name:'Fa mineur',nameEn:'F minor',nameEs:'Fa menor',root:5,minor:true,sharps:-4},
];

function AH_getChordTypes(minor){
  const C=currentLang==='en';
  const E=currentLang==='es';
  if(!minor)return[
    {cat:C?'Diatonic triads':E?'Tríadas diatónicas':'Triades diatoniques',items:['I','ii','iii','IV','V','vi','vii°']},
    {cat:C?'Seventh chords':E?'Acordes de séptima':'Accords de septième',items:['I7','ii7','iii7','IV7','V7','vi7','viiø7']},
    {cat:C?'Modal mixture':E?'Mixtura modal':'Mixture modale',items:['i','ii°','II','iv','♭ii','III','VI','VII','vii']},
    {cat:C?'Secondary dominants':E?'Dominantes secundarias':'Dominantes secondaires',items:['V/ii','V/iii','V/IV','V/V','V/vi','V7/ii','V7/iii','V7/IV','V7/V','V7/vi']},
    {cat:C?'Special chords':E?'Acordes especiales':'Accords spéciaux',items:['♭II','N6','♭VI','♭VII','V+']},
    {cat:C?'Augmented sixths':E?'Sextas aumentadas':'Sixtes augmentées',items:['It6','Fr6','Ger6']},
  ];
  return[
    {cat:C?'Diatonic triads':E?'Tríadas diatónicas':'Triades diatoniques',items:['i','ii°','III','iv','v','V','VI','VII','vii°']},
    {cat:C?'Seventh chords':E?'Acordes de séptima':'Accords de septième',items:['i7','iiø7','III7','iv7','v7','V7','VI7','VII7','vii°7']},
    {cat:C?'Modal mixture':E?'Mixtura modal':'Mixture modale',items:['I','ii','II','iii','IV','♭ii','vii']},
    {cat:C?'Secondary dominants':E?'Dominantes secundarias':'Dominantes secondaires',items:['V/ii','V/iii','V/IV','V/V','V/vi','V7/ii','V7/iii','V7/IV','V7/V','V7/vi']},
    {cat:C?'Special chords':E?'Acordes especiales':'Accords spéciaux',items:['♭II','N6','♭VI','♭VII','V+']},
    {cat:C?'Augmented sixths':E?'Sextas aumentadas':'Sixtes augmentées',items:['It6','Fr6','Ger6']},
  ];
}

/* ── Chord building engine ── */
const AH_L7=['C','D','E','F','G','A','B'];
function AH_ni(n){const m=n.replace(/♯/g,'#').replace(/♭/g,'b');const t={'C':0,'C#':1,'Db':1,'D':2,'D#':3,'Eb':3,'E':4,'Fb':4,'E#':5,'F':5,'F#':6,'Gb':6,'G':7,'G#':8,'Ab':8,'A':9,'A#':10,'Bb':10,'B':11,'Cb':11,'B#':0};return t[m]??-1;}
function AH_sIvl(mode){return mode==='major'?[0,2,4,5,7,9,11]:[0,2,3,5,7,8,10];}
function AH_cT(r,q){const m={M:[0,4,7],m:[0,3,7],dim:[0,3,6],aug:[0,4,8],dom7:[0,4,7,10],m7:[0,3,7,10],maj7:[0,4,7,11],dim7:[0,3,6,9],hdim7:[0,3,6,10],N:[0,4,7]};return(m[q]||m.M).map(i=>(r+i)%12);}
function AH_parseRN(raw){
  let s=raw.trim();if(!s)return null;
  if(s==='N'||s==='N6'||s==='♭II6'||s==='bII6')return{deg:1,qual:'N',flat:true,sharp:false,adds:'',sec:null,isMin:false};
  if(/^It\+?6?$/i.test(s))return{deg:-1,qual:'It6',sec:null};
  if(/^Fr\+?6?$/i.test(s))return{deg:-1,qual:'Fr6',sec:null};
  if(/^Ger\+?6?$/i.test(s))return{deg:-1,qual:'Ger6',sec:null};
  let sec=null;const si=s.lastIndexOf('/');
  if(si>0){const a=s.substring(si+1),au=a.toUpperCase().replace(/♭|♯|#|b/g,'');if(['VII','VI','IV','V','III','II','I'].some(r=>au.startsWith(r))){sec=a;s=s.substring(0,si);}}
  let flat=false,sharp=false;
  if(s.startsWith('♭')||s.startsWith('b')){flat=true;s=s.substring(1);}
  else if(s.startsWith('♯')||s.startsWith('#')){sharp=true;s=s.substring(1);}
  let deg=-1,consumed=0,isMin=false;
  for(const[r,d]of[['VII',6],['VI',5],['IV',3],['V',4],['III',2],['II',1],['I',0]]){if(s.toUpperCase().startsWith(r)){deg=d;consumed=r.length;isMin=s.substring(0,consumed)===s.substring(0,consumed).toLowerCase();break;}}
  if(deg===-1)return null;
  let rest=s.substring(consumed),qual=isMin?'m':'M';
  if(rest.startsWith('+')){qual='aug';rest=rest.substring(1);}
  if(rest.startsWith('°')||rest.startsWith('o')){qual='dim';rest=rest.substring(1);if(rest.startsWith('7')){qual='dim7';rest=rest.substring(1);}}
  if(rest.startsWith('ø')||rest.startsWith('Ø')){qual='hdim7';rest=rest.substring(1);if(rest.startsWith('7'))rest=rest.substring(1);}
  let adds=rest;
  if(adds.includes('7')&&qual==='M')qual='dom7';
  if(adds.includes('7')&&qual==='m')qual='m7';
  if(adds==='M7'||adds==='maj7'){qual='maj7';adds='';}
  if(adds==='7'&&['dom7','m7','dim7'].includes(qual))adds='';
  return{deg,qual,isMin,adds,sec,flat,sharp};
}
function AH_buildChordFromSymbol(keyRoot,minor,symbol){
  const p=AH_parseRN(symbol);if(!p)return null;
  const mode=minor?'minor':'major',si=AH_sIvl(mode),ri=keyRoot;
  const nA=(AH_keyInfo.sharps<0)?AH_NOTES_F:AH_NOTES_S;
  if(p.qual==='N'){const sm=(ri+si[1]-1+12)%12;return{name:nA[sm],notes:AH_cT(sm,'M'),root:sm,qual:'M'};}
  if(p.qual==='It6'){const sm=(ri+8)%12;return{name:nA[sm]+' It+6',notes:[sm,(sm+4)%12,(sm+10)%12],root:sm,qual:'It6'};}
  if(p.qual==='Fr6'){const sm=(ri+8)%12;return{name:nA[sm]+' Fr+6',notes:[sm,(sm+4)%12,(sm+6)%12,(sm+10)%12],root:sm,qual:'Fr6'};}
  if(p.qual==='Ger6'){const sm=(ri+8)%12;return{name:nA[sm]+' Ger+6',notes:[sm,(sm+4)%12,(sm+7)%12,(sm+10)%12],root:sm,qual:'Ger6'};}
  let rs;
  if(p.sec){const sp=AH_parseRN(p.sec);if(!sp)return null;let ss=(ri+si[sp.deg])%12;if(sp.flat)ss=(ss-1+12)%12;if(sp.sharp)ss=(ss+1)%12;const ssi=AH_sIvl(sp.isMin?'minor':'major');rs=(ss+ssi[p.deg])%12;}
  else {rs=(ri+si[p.deg])%12;
    // Harmonic minor : vii°/vii°7 are built on the raised 7th (leading tone)
    if(minor && p.deg===6 && (p.qual==='dim' || p.qual==='dim7')) rs=(rs+1)%12;
  }
  if(p.flat)rs=(rs-1+12)%12;if(p.sharp)rs=(rs+1)%12;
  let name=nA[rs],q=p.qual;
  switch(q){case'm':name+='m';break;case'dim':name+='°';break;case'aug':name+='+';break;case'dom7':name+='7';break;case'm7':name+='m7';break;case'maj7':name+='maj7';break;case'dim7':name+='°7';break;case'hdim7':name+='ø7';break;}
  return{name,notes:AH_cT(rs,q),root:rs,qual:q};
}

/* ── State ── */
let AH_chords=[], AH_selChord=-1, AH_keyInfo={root:0,minor:false,sharps:0};
const AH_MAX_CHORDS=20;

function AH_noteName(m){const pc=m%12,oct=Math.floor(m/12)-1;return(AH_keyInfo.sharps>=0?AH_NOTES_S:AH_NOTES_F)[pc]+oct;}

function AH_buildKeySelector(){const sel=document.getElementById('ah_keySel');const cur=sel?sel.value:'';sel.innerHTML=AH_KEY_LIST.map((k,i)=>`<option value="${i}">${currentLang==='en'?k.nameEn:currentLang==='es'?k.nameEs:k.name}</option>`).join('');if(cur)sel.value=cur;}
function AH_buildChordTypeSelector(){
  const sel=document.getElementById('ah_chordTypeSel'),types=AH_getChordTypes(AH_keyInfo.minor);
  let h='';
  types.forEach(cat=>{h+=`<optgroup label="${cat.cat}">`;cat.items.forEach(sym=>{h+=`<option value="${sym}">${sym}</option>`;});h+='</optgroup>';});
  sel.innerHTML=h;
}
function AH_buildInputs(){
  const el=document.getElementById('ah_voiceInputs2');let h='';
  ['S','A','T','B'].forEach(v=>{const[lo,hi]=AH_RANGE[v];
    h+=`<div class="voice-row"><div class="voice-color" style="background:${AH_VCOLORS[v]}"></div><div class="voice-label">${AH_VN(v)}</div><select class="note-sel" id="v${v}">`;
    for(let m=hi;m>=lo;m--){const s=(v==='S'&&m===72)||(v==='A'&&m===64)||(v==='T'&&m===60)||(v==='B'&&m===48);h+=`<option value="${m}"${s?' selected':''}>${AH_noteName(m)}</option>`;}
    h+=`</select></div>`;});
  el.innerHTML=h;
}
function AH_getInputChord(){return{S:+document.getElementById('vS').value,A:+document.getElementById('vA').value,T:+document.getElementById('vT').value,B:+document.getElementById('vB').value,symbol:document.getElementById('ah_chordTypeSel').value||''};}
function AH_setInputChord(ch){['S','A','T','B'].forEach(v=>{document.getElementById('v'+v).value=ch[v];});if(ch.symbol)document.getElementById('ah_chordTypeSel').value=ch.symbol;}

function AH_updateInversionOptions(){
  const sym=document.getElementById('ah_chordTypeSel').value,sel=document.getElementById('ah_inversionSel');
  if(!sym){sel.innerHTML=`<option value="0">${t('ah_rp')}</option>`;sel.disabled=true;return;}
  const chord=AH_buildChordFromSymbol(AH_keyInfo.root,AH_keyInfo.minor,sym);if(!chord){sel.disabled=true;return;}
  sel.disabled=false;const n=chord.notes.length;
  let h=`<option value="0">${tx('Fondamental','Root','Fundamental')}${n===3?' (5)':n===4?' (7)':''}</option>`;
  h+=`<option value="1">${tx('1er renversement','1st inversion','1ª inversión')} (6${n===4?'/5':''})</option>`;
  h+=`<option value="2">${tx('2e renversement','2nd inversion','2ª inversión')} (6/4${n===4?'/3':''})</option>`;
  if(n>=4)h+=`<option value="3">${tx('3e renversement','3rd inversion','3ª inversión')} (+2)</option>`;
  sel.innerHTML=h;
}
function AH_onChordTypeChange(){AH_updateInversionOptions();AH_applyChordToVoices();}
function AH_onInversionChange(){AH_applyChordToVoices();}

function AH_applyChordToVoices(){
  const sym=document.getElementById('ah_chordTypeSel').value;if(!sym)return;
  const chord=AH_buildChordFromSymbol(AH_keyInfo.root,AH_keyInfo.minor,sym);if(!chord)return;
  const inv=+document.getElementById('ah_inversionSel').value;
  let pcs=[...chord.notes];
  // Rotate for inversion: pcs[0] becomes the bass note
  for(let i=0;i<inv&&i<pcs.length;i++)pcs.push(pcs.shift());

  // Helper: find the nearest MIDI note with given pitch class, at or above minMidi, within range
  function findAbove(pc,minMidi,maxMidi){
    for(let m=minMidi;m<=maxMidi;m++){if(m%12===pc)return m;}
    return -1;
  }

  // 1. Bass gets pcs[0] in its comfortable range
  let bassPC=pcs[0];
  let bM=-1;
  // Prefer bass around C3 (48) area
  for(let m=AH_RANGE.B[1];m>=AH_RANGE.B[0];m--){if(m%12===bassPC&&m<=52){bM=m;break;}}
  if(bM<0){for(let m=AH_RANGE.B[0];m<=AH_RANGE.B[1];m++){if(m%12===bassPC){bM=m;break;}}}
  if(bM<0)bM=AH_RANGE.B[0];

  // 2. Determine upper voice pitch classes
  // For triads: 3 upper notes = root, 3rd, 5th (one doubled)
  // For 7ths: 3 upper notes = the 3 remaining chord tones
  let upperPCs;
  if(pcs.length>=4){
    upperPCs=[pcs[1],pcs[2],pcs[3]];
  } else {
    // Triad: upper voices get 5th, root (doubled), 3rd — or similar
    // Standard close position from bass: stack the remaining notes + double
    const fifth=pcs[2]; // 5th of rotated chord
    const third=pcs[1]; // 3rd of rotated chord  
    const doubled=chord.notes[0]; // always double the root
    upperPCs=[fifth, third, doubled];
  }

  // 3. Build voicing bottom-up: find notes in each voice range above previous voice
  // Aim for close position in upper voices (within an octave of each other)
  // Start tenor from a reasonable point above bass
  const tenorMin=Math.max(AH_RANGE.T[0], bM+3);
  let tM=findAbove(upperPCs[0], tenorMin, AH_RANGE.T[1]);
  if(tM<0)tM=findAbove(upperPCs[0], AH_RANGE.T[0], AH_RANGE.T[1]);
  if(tM<0)tM=AH_RANGE.T[0]; // fallback

  // If T-B spacing is too big (>octave between inner voices is ok for T-B), try next occurrence
  // But ensure A-T won't exceed octave: aim tenor high enough
  
  // Alto: above tenor, within octave of tenor ideally
  const altoMin=Math.max(AH_RANGE.A[0], tM+1);
  let aM=findAbove(upperPCs[1], altoMin, Math.min(AH_RANGE.A[1], tM+12));
  if(aM<0)aM=findAbove(upperPCs[1], altoMin, AH_RANGE.A[1]);
  if(aM<0)aM=findAbove(upperPCs[1], AH_RANGE.A[0], AH_RANGE.A[1]);
  if(aM<0)aM=AH_RANGE.A[0];

  // Soprano: above alto, within octave of alto
  const sopMin=Math.max(AH_RANGE.S[0], aM+1);
  let sM=findAbove(upperPCs[2], sopMin, Math.min(AH_RANGE.S[1], aM+12));
  if(sM<0)sM=findAbove(upperPCs[2], sopMin, AH_RANGE.S[1]);
  if(sM<0)sM=findAbove(upperPCs[2], AH_RANGE.S[0], AH_RANGE.S[1]);
  if(sM<0)sM=AH_RANGE.S[0];

  // 4. Validate and fix spacing: S-A ≤ 12, A-T ≤ 12
  // If A-T > 12, push tenor up to close the gap
  if(aM-tM>12){
    const newT=findAbove(upperPCs[0], aM-12, AH_RANGE.T[1]);
    if(newT>0&&newT>bM)tM=newT;
    // If still too far, try pushing alto down
    if(aM-tM>12){
      const newA=findAbove(upperPCs[1], tM+1, Math.min(AH_RANGE.A[1],tM+12));
      if(newA>0)aM=newA;
      // Soprano may need adjustment too
      const newS=findAbove(upperPCs[2], aM+1, Math.min(AH_RANGE.S[1],aM+12));
      if(newS>0)sM=newS;
    }
  }
  if(sM-aM>12){
    const newA=findAbove(upperPCs[1], sM-12, AH_RANGE.A[1]);
    if(newA>0&&newA>tM){
      aM=newA;
      // Re-check A-T after moving alto
      if(aM-tM>12){
        const newT2=findAbove(upperPCs[0], aM-12, AH_RANGE.T[1]);
        if(newT2>0&&newT2>bM)tM=newT2;
      }
    }
  }
  // Final safety: if still bad, try alternative upper note assignments
  if(aM-tM>12||sM-aM>12){
    // Try swapping upper voice assignments for a better spread
    const allUpper=[upperPCs[0],upperPCs[1],upperPCs[2]];
    const perms=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
    let bestSpread=999,bestT=tM,bestA=aM,bestS=sM;
    for(const p of perms){
      const tryT=findAbove(allUpper[p[0]],Math.max(AH_RANGE.T[0],bM+1),AH_RANGE.T[1]);
      if(tryT<0)continue;
      const tryA=findAbove(allUpper[p[1]],tryT+1,Math.min(AH_RANGE.A[1],tryT+12));
      if(tryA<0)continue;
      const tryS=findAbove(allUpper[p[2]],tryA+1,Math.min(AH_RANGE.S[1],tryA+12));
      if(tryS<0)continue;
      const spread=Math.max(tryA-tryT,tryS-tryA);
      if(spread<=12&&spread<bestSpread){bestSpread=spread;bestT=tryT;bestA=tryA;bestS=tryS;}
    }
    if(bestSpread<=12){tM=bestT;aM=bestA;sM=bestS;}
  }

  document.getElementById('vB').value=bM;
  document.getElementById('vT').value=tM;
  document.getElementById('vA').value=aM;
  document.getElementById('vS').value=sM;
}


/* ═══ Voice-Leading Optimizer ═══ */
function AH_optimizeVoicing(chord){
  if(AH_chords.length===0) return chord; /* First chord: keep default voicing */
  var prev=AH_chords[AH_chords.length-1];
  var curr={S:chord.S,A:chord.A,T:chord.T,B:chord.B,symbol:chord.symbol};
  
  /* Get pitch classes of the new chord */
  var pcs=[curr.S%12,curr.A%12,curr.T%12,curr.B%12];
  var bassPC=curr.B%12;
  
  /* Step 1: Keep bass in close range to previous (minimal bass movement) */
  var prevB=prev.B;
  var bestB=curr.B, bestBDist=99;
  for(var m=AH_RANGE.B[0];m<=Math.min(AH_RANGE.B[1],52);m++){
    if(m%12===bassPC){
      var d=Math.abs(m-prevB);
      if(d<bestBDist){bestBDist=d;bestB=m;}
    }
  }
  curr.B=bestB;
  
  /* Step 2: Find closest voicing for upper voices using minimal movement */
  var upperPCs=[curr.T%12,curr.A%12,curr.S%12];
  var prevUpper=[prev.T,prev.A,prev.S];
  var voices=['T','A','S'];
  var ranges=[AH_RANGE.T,AH_RANGE.A,AH_RANGE.S];
  
  /* Leading tone detection */
  var lt=(AH_keyInfo.root+11)%12;
  var ltInChord=upperPCs.indexOf(lt);
  var prevLtVoice=-1;
  for(var vi=0;vi<3;vi++){if(prevUpper[vi]%12===lt)prevLtVoice=vi;}
  
  /* For each upper voice, find closest realization */
  for(var vi=0;vi<3;vi++){
    var pc=upperPCs[vi];
    var prevMidi=prevUpper[vi];
    var lo=Math.max(ranges[vi][0], curr.B+1);
    var hi=ranges[vi][1];
    if(vi>0) lo=Math.max(lo, curr[voices[vi-1]]+1); /* Don't cross below previous voice */
    
    var bestM=-1,bestD=99;
    for(var m=lo;m<=hi;m++){
      if(m%12===pc){
        var d=Math.abs(m-prevMidi);
        /* Penalize large leaps */
        var cost=d;
        /* Bonus for step motion (1-2 semitones) */
        if(d<=2) cost-=1;
        /* Penalty for leading tone not resolving up */
        if(prevUpper[vi]%12===lt && pc===AH_keyInfo.root%12 && m<prevUpper[vi]) cost+=10;
        /* Leading tone should resolve up to tonic */
        if(prevUpper[vi]%12===lt && pc===AH_keyInfo.root%12 && m===prevUpper[vi]+1) cost-=3;
        
        if(cost<bestD){bestD=cost;bestM=m;}
      }
    }
    if(bestM>=0) curr[voices[vi]]=bestM;
  }
  
  /* Step 3: Check for parallel 5ths/8ves and fix */
  var pairs=[['S','A'],['S','T'],['S','B'],['A','T'],['A','B'],['T','B']];
  for(var pi=0;pi<pairs.length;pi++){
    var v1=pairs[pi][0],v2=pairs[pi][1];
    var intPrev=Math.abs(prev[v1]-prev[v2])%12;
    var intCurr=Math.abs(curr[v1]-curr[v2])%12;
    var motion=(curr[v1]-prev[v1])*(curr[v2]-prev[v2]);
    if(motion>0){ /* Direct motion */
      if((intPrev===7&&intCurr===7)||(intPrev===0&&intCurr===0&&curr[v1]!==prev[v1])){
        /* Try moving v1 by step instead */
        var alt=curr[v1]+(curr[v1]>prev[v1]?-1:1);
        if(alt%12===curr[v1]%12||pcs.includes(alt%12)){curr[v1]=alt;}
      }
    }
  }
  
  /* Step 4: Ensure no crossing */
  if(curr.S<curr.A){var tmp=curr.S;curr.S=curr.A;curr.A=tmp;}
  if(curr.A<curr.T){var tmp=curr.A;curr.A=curr.T;curr.T=tmp;}
  if(curr.T<curr.B) curr.T=curr.B+1;
  
  /* Step 5: Check spacing ≤ octave between adjacent upper voices */
  if(curr.S-curr.A>12) curr.A=curr.S-12;
  if(curr.A-curr.T>12) curr.T=curr.A-12;
  
  return curr;
}

function AH_addChord(){if(AH_chords.length>=AH_MAX_CHORDS){alert(`Maximum ${AH_MAX_CHORDS} accords.`);return;}var _raw=AH_getInputChord();var _opt=AH_optimizeVoicing(_raw);AH_chords.push(_opt);AH_setInputChord(_opt);AH_selChord=AH_chords.length-1;AH_analyze();AH_render();}
function AH_updateChord(){if(AH_selChord<0||AH_selChord>=AH_chords.length)return;AH_chords[AH_selChord]=AH_getInputChord();AH_analyze();AH_render();}
function AH_removeSelected(){if(!AH_chords.length)return;const idx=AH_selChord>=0&&AH_selChord<AH_chords.length?AH_selChord:AH_chords.length-1;AH_chords.splice(idx,1);AH_selChord=Math.min(idx,AH_chords.length-1);if(!AH_chords.length)AH_selChord=-1;AH_analyze();AH_render();}
function AH_clearAll(){AH_chords=[];AH_selChord=-1;AH_analyze();AH_render();}
function AH_selectChord(i){AH_selChord=i;if(i>=0&&i<AH_chords.length)AH_setInputChord(AH_chords[i]);document.getElementById('ah_chordNum').textContent=i+1;AH_renderChordLabels();}
function AH_updateKey(){const v=+document.getElementById('ah_keySel').value,k=AH_KEY_LIST[v];AH_keyInfo={root:k.root,minor:k.minor,sharps:k.sharps};AH_buildInputs();AH_buildChordTypeSelector();AH_updateInversionOptions();AH_analyze();AH_render();}
function AH_toggleSection(el){el.classList.toggle('collapsed');el.nextElementSibling.classList.toggle('collapsed');}

/* ═══════════════════════════
   Analysis Engine
   ═══════════════════════════ */
let AH_errors=[];
function AH_interval(a,b){return Math.abs(b-a)%12;}
function AH_motionType(v1a,v1b,v2a,v2b){const d1=v1b-v1a,d2=v2b-v2a;if(d1===0&&d2===0)return'oblique';if(d1===0||d2===0)return'oblique';if((d1>0&&d2>0)||(d1<0&&d2<0))return'direct';return'contrary';}

function AH_analyze(){
  AH_errors=[];if(AH_chords.length<1)return;
  const EN=currentLang==='en';
  const ES=currentLang==='es';
  const L={cross:EN?'Voice crossing':ES?'Cruzamiento':'Croisement', spacing:EN?'Spacing > 8ve':ES?'Espaciado > 8ª':'Espacement > 8ve',
    ltDoubled:EN?'Doubled leading tone':ES?'Sensible duplicada':'Doublure sensible', p5:EN?'Parallel 5ths':ES?'Quintas paralelas':'Quintes //',
    p8:EN?'Parallel 8ves':ES?'Octavas paralelas':'Octaves //', d8:EN?'Direct 8ves':ES?'Octavas directas':'Octaves directes',
    d5:EN?'Direct 5th':ES?'5ª directa':'Quinte directe', ltRes:EN?'Leading tone resolution':ES?'Resolución de la sensible':'Résolution sensible',
    msg5:EN?'Parallel 5ths':ES?'5ªˢ //':'5tes //', msg8:EN?'Parallel 8ves':ES?'8ªˢ //':'8ves //',
    msg8d:EN?'Direct 8ve':ES?'8ª directa':'8ves dir.', msg5d:EN?'Direct 5th S–B':ES?'5ª dir. S–B':'5te dir. S–B',
    msgLt:EN?'leading tone':ES?'Sensible':'Sensible', msgUnres:EN?'unresolved':ES?'sin resolver':'non résolue',
    msgCross:EN?'Crossing':ES?'Cruzamiento':'Croisement', msgSpace:EN?'Spacing':ES?'Espaciado':'Espacement',
    msgLtD:EN?'Doubled leading tone':ES?'Sensible':'Sensible', msgDoubled:EN?'doubled':ES?'duplicada':'doublée'};
  const voices=['S','A','T','B'],pairs=[['S','A'],['S','T'],['S','B'],['A','T'],['A','B'],['T','B']];
  AH_chords.forEach((ch,ci)=>{
    if(ch.S<ch.A)AH_errors.push({type:'error',chord:ci,msg:`${L.msgCross} S(${AH_noteName(ch.S)}) < A(${AH_noteName(ch.A)})`,rule:L.cross});
    if(ch.A<ch.T)AH_errors.push({type:'error',chord:ci,msg:`${L.msgCross} A(${AH_noteName(ch.A)}) < T(${AH_noteName(ch.T)})`,rule:L.cross});
    if(ch.T<ch.B)AH_errors.push({type:'error',chord:ci,msg:`${L.msgCross} T(${AH_noteName(ch.T)}) < B(${AH_noteName(ch.B)})`,rule:L.cross});
    if(ch.S-ch.A>12)AH_errors.push({type:'warn',chord:ci,msg:`${L.msgSpace} S-A: ${ch.S-ch.A}st`,rule:L.spacing});
    if(ch.A-ch.T>12)AH_errors.push({type:'warn',chord:ci,msg:`${L.msgSpace} A-T: ${ch.A-ch.T}st`,rule:L.spacing});
    const lt=(AH_keyInfo.root+11)%12,ltC=voices.filter(v=>(ch[v]%12)===lt).length;
    if(ltC>=2)AH_errors.push({type:'error',chord:ci,msg:`${L.msgLtD} (${AH_NOTES_S[lt]}) ${L.msgDoubled}`,rule:L.ltDoubled});
  });
  for(let i=0;i<AH_chords.length-1;i++){
    const a=AH_chords[i],b=AH_chords[i+1];
    pairs.forEach(([v1,v2])=>{
      const v1a=a[v1],v1b=b[v1],v2a=a[v2],v2b=b[v2];const intA=AH_interval(v1a,v2a),intB=AH_interval(v1b,v2b),motion=AH_motionType(v1a,v1b,v2a,v2b);
      if(intA===7&&intB===7&&motion==='direct')AH_errors.push({type:'error',chord:i,msg:`${L.msg5} ${AH_VN(v1)}–${AH_VN(v2)} (${i+1}→${i+2})`,rule:L.p5});
      if(intA===0&&intB===0&&motion==='direct'&&v1a!==v1b)AH_errors.push({type:'error',chord:i,msg:`${L.msg8} ${AH_VN(v1)}–${AH_VN(v2)} (${i+1}→${i+2})`,rule:L.p8});
      if(intA!==0&&intB===0&&motion==='direct')AH_errors.push({type:'error',chord:i,msg:`${L.msg8d} ${AH_VN(v1)}–${AH_VN(v2)} (${i+1}→${i+2})`,rule:L.d8});
      if(intA!==7&&intB===7&&motion==='direct'&&v1==='S'&&v2==='B')AH_errors.push({type:'warn',chord:i,msg:`${L.msg5d} (${i+1}→${i+2})`,rule:L.d5});
    });
    const lt=(AH_keyInfo.root+11)%12;
    voices.forEach(v=>{if((a[v]%12)===lt&&(b[v]%12)!==AH_keyInfo.root%12&&b[v]!==a[v]&&b[v]<a[v])AH_errors.push({type:'warn',chord:i,msg:`${L.msgLt} ${AH_VN(v)} ${L.msgUnres} (${i+1}→${i+2})`,rule:L.ltRes});});
  }
  AH_renderErrors();
}
function AH_renderErrors(){
  const el=document.getElementById('ah_errList');document.getElementById('ah_errCount').textContent=AH_errors.length;
  if(AH_errors.length===0&&AH_chords.length>=2){el.innerHTML=`<div class="err-item ok"><span class="err-icon">✓</span><div class="err-text"><span class="err-rule">${currentLang==="en"?"No errors":currentLang==="es"?"Sin errores":"Aucune erreur"}</span>${currentLang==="en"?"Voice leading follows classical harmony rules.":currentLang==="es"?"La conducción de las voces respeta las reglas de armonía clásica.":"La conduite des voix respecte les règles d'harmonie classique."}</div></div>`;return;}
  if(AH_chords.length<2){el.innerHTML='<div class="no-errors">'+t('h_2chords')+'</div>';return;}
  el.innerHTML=AH_errors.map(e=>`<div class="err-item ${e.type}" onclick="AH_selectChord(${e.chord})"><span class="err-icon">${e.type==='error'?'✕':'⚠'}</span><div class="err-text"><span class="err-rule">${e.rule}</span>${e.msg}</div></div>`).join('');
}

/* ═══════════════════════════
   Score Rendering
   ═══════════════════════════ */
const AH_DIA=[0,0,1,1,2,3,3,4,4,5,5,6];
const AH_LM=60,AH_RM=20,AH_LS=16;
let AH_trebleTop,AH_bassTop,AH_canvasH;
function AH_calcLayout(){AH_trebleTop=50;AH_bassTop=AH_trebleTop+5*AH_LS+42;AH_canvasH=AH_bassTop+5*AH_LS+46;}

/* ─── SATB Clef toggles (clef d'ut Alto / Ténor) ─── */
window.AH_useAltoClef  = false;
window.AH_useTenorClef = false;
function AH_toggleAltoClef(){
  window.AH_useAltoClef = !window.AH_useAltoClef;
  const btn = document.getElementById('ah_altoClefBtn');
  if(btn) btn.classList.toggle('primary', window.AH_useAltoClef);
  AH_render();
}
function AH_toggleTenorClef(){
  window.AH_useTenorClef = !window.AH_useTenorClef;
  const btn = document.getElementById('ah_tenorClefBtn');
  if(btn) btn.classList.toggle('primary', window.AH_useTenorClef);
  AH_render();
}
window.AH_toggleAltoClef  = AH_toggleAltoClef;
window.AH_toggleTenorClef = AH_toggleTenorClef;

/* ─── Clef d'ut standard SMuFL (glyphe Unicode 𝄡) ───
 *  lineIdx : 2 = clef d'alto (Ut 3e ligne), 3 = clef de ténor (Ut 4e ligne)
 *  Le glyphe Bravura/Times est centré sur sa propre médiane via textBaseline='middle'.
 */
function AH_drawCClef(ctx, x, yTop, ls, lineIdx, color){
  // Délègue à STR_drawCClef pour un rendu canvas unifié et fidèle
  if(typeof STR_drawCClef === 'function'){
    STR_drawCClef(ctx, x, yTop, ls, lineIdx, color);
    return;
  }
  // Fallback : glyphe Unicode si STR_drawCClef indisponible
  const centerY = yTop + lineIdx * ls;
  const fs = ls * 4.6;
  ctx.save();
  ctx.fillStyle = color || '#1e1e2e';
  ctx.font = `${fs}px "Times New Roman",Bravura,Georgia,serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('\uD834\uDD21', x, centerY);
  ctx.restore();
}
window.AH_drawCClef = AH_drawCClef;
function AH_midiToY(midi){
  const oct=Math.floor(midi/12)-1,pc=midi%12,diaPos=oct*7+AH_DIA[pc];
  const trebleRef=34,trebleRefY=AH_trebleTop+2*AH_LS,bassRef=22,bassRefY=AH_bassTop+2*AH_LS;
  if(midi>=57)return{y:trebleRefY-(diaPos-trebleRef)*(AH_LS/2),staff:'treble'};
  return{y:bassRefY-(diaPos-bassRef)*(AH_LS/2),staff:'bass'};
}

/* Drag & Drop */
let AH_dragState=null;
function AH_getCanvasPos(e){const c=document.getElementById('ah_scoreCanvas'),r=c.getBoundingClientRect(),d=window.devicePixelRatio||1;return{x:(e.clientX-r.left)*c.width/d/r.width,y:(e.clientY-r.top)*c.height/d/r.height};}
function AH_findNoteAt(x,y){
  if(!AH_chords.length)return null;const cE=document.getElementById('ah_scoreCanvas'),cw=cE.parentElement.clientWidth-28;
  const csX=(window._ksEndX||AH_LM+40)+10,chW=Math.min(80,(cw-csX-AH_RM-10)/AH_chords.length);
  for(let ci=0;ci<AH_chords.length;ci++){const cx=csX+ci*chW+chW/2;for(const v of['S','A','T','B']){const{y:ny}=AH_midiToY(AH_chords[ci][v]);if(Math.abs(x-cx)<14&&Math.abs(y-ny)<10)return{chordIdx:ci,voice:v,midi:AH_chords[ci][v]};}}return null;
}
function AH_yToMidi(y,voice){const[lo,hi]=AH_RANGE[voice];let best=lo,bd=999;for(let m=lo;m<=hi;m++){const d=Math.abs(y-AH_midiToY(m).y);if(d<bd){bd=d;best=m;}}return best;}
function AH_setupCanvasEvents(){
  const c=document.getElementById('ah_scoreCanvas');
  c.addEventListener('mousedown',e=>{const p=AH_getCanvasPos(e),h=AH_findNoteAt(p.x,p.y);if(h){AH_dragState={chordIdx:h.chordIdx,voice:h.voice};c.style.cursor='ns-resize';e.preventDefault();}});
  c.addEventListener('mousemove',e=>{if(!AH_dragState){const p=AH_getCanvasPos(e);c.style.cursor=AH_findNoteAt(p.x,p.y)?'ns-resize':'default';return;}const p=AH_getCanvasPos(e),nm=AH_yToMidi(p.y,AH_dragState.voice);if(nm!==AH_chords[AH_dragState.chordIdx][AH_dragState.voice]){AH_chords[AH_dragState.chordIdx][AH_dragState.voice]=nm;AH_analyze();AH_render();}});
  c.addEventListener('mouseup',()=>{AH_dragState=null;document.getElementById('ah_scoreCanvas').style.cursor='default';});
  c.addEventListener('mouseleave',()=>{AH_dragState=null;});
  c.addEventListener('touchstart',e=>{const p=AH_getCanvasPos(e.touches[0]),h=AH_findNoteAt(p.x,p.y);if(h){AH_dragState={chordIdx:h.chordIdx,voice:h.voice};e.preventDefault();}},{passive:false});
  c.addEventListener('touchmove',e=>{if(!AH_dragState)return;e.preventDefault();const p=AH_getCanvasPos(e.touches[0]),nm=AH_yToMidi(p.y,AH_dragState.voice);if(nm!==AH_chords[AH_dragState.chordIdx][AH_dragState.voice]){AH_chords[AH_dragState.chordIdx][AH_dragState.voice]=nm;AH_analyze();AH_render();}},{passive:false});
  c.addEventListener('touchend',()=>{AH_dragState=null;});
}

function AH_drawNotehead(ctx,x,y,color,size){ctx.save();ctx.translate(x,y);ctx.rotate(-12*Math.PI/180);ctx.beginPath();ctx.ellipse(0,0,size+1.5,size-1,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();ctx.restore();}

function AH_render(){
  // Check for incoming sequence import from Sequences module
  try {
    const imp = sessionStorage.getItem('pc_analyzer_import');
    if(imp){
      sessionStorage.removeItem('pc_analyzer_import');
      const data = JSON.parse(imp);
      if(data && data.chords && data.chords.length){
        // Convert SATB midi array [B,T,A,S] to {S,A,T,B,symbol}
        AH_chords = data.chords.slice(0, AH_MAX_CHORDS).map(c => ({
          B: c.midi[0], T: c.midi[1], A: c.midi[2], S: c.midi[3],
          symbol: c.rootName + (c.quality==='M'?'':c.quality==='m'?'m':c.quality==='dim'?'dim':c.quality==='7'?'7':c.quality||'')
        }));
        AH_selChord = 0;
        if(AH_chords.length) AH_setInputChord(AH_chords[0]);
        AH_analyze();
      }
    }
  } catch(e){ console.error('Import from Sequences failed:', e); }
  AH_renderScore();AH_renderChordLabels();document.getElementById('ah_chordNum').textContent=(AH_selChord>=0?AH_selChord+1:AH_chords.length+1);document.getElementById('ah_chordCount').textContent=`${AH_chords.length} / ${AH_MAX_CHORDS} ${t('ah_ch')}`;
}
function AH_renderChordLabels(){
  const el=document.getElementById('ah_chordLabels');if(!AH_chords.length){el.innerHTML='';return;}
  const csX=window._AH_csX||(AH_LM+40+10),chW=window._AH_chW||60;
  el.style.position='relative';el.style.height='20px';
  el.innerHTML=AH_chords.map((c,i)=>{
    const cx=csX+i*chW+chW/2;
    return `<div class="chord-lbl${i===AH_selChord?' sel':''}" onclick="AH_selectChord(${i})" style="position:absolute;left:${cx}px;transform:translateX(-50%);white-space:nowrap;font-size:9px;line-height:1.2;">${i+1}${c.symbol?' · '+c.symbol:''}</div>`;
  }).join('');
}

function AH_renderScore(){
  AH_calcLayout();const canvas=document.getElementById('ah_scoreCanvas'),ctx=canvas.getContext('2d'),dpr=window.devicePixelRatio||1;
  const cw=canvas.parentElement.clientWidth-28;canvas.style.width=cw+'px';canvas.style.height=AH_canvasH+'px';canvas.width=cw*dpr;canvas.height=AH_canvasH*dpr;ctx.scale(dpr,dpr);ctx.clearRect(0,0,cw,AH_canvasH);

  // Staff lines — style générateur séquentiel
  ctx.strokeStyle='#555';ctx.lineWidth=0.8;
  for(let s=0;s<2;s++){const top=s===0?AH_trebleTop:AH_bassTop;for(let l=0;l<5;l++){const y=top+l*AH_LS;ctx.beginPath();ctx.moveTo(AH_LM,y);ctx.lineTo(cw-AH_RM,y);ctx.stroke();}}
  // Left barline
  ctx.strokeStyle='#333';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(AH_LM,AH_trebleTop);ctx.lineTo(AH_LM,AH_bassTop+4*AH_LS);ctx.stroke();

  // Accolade — déborde au-dessus et en-dessous des portées (comme partition réelle)
  // Accolade — Bravura SMuFL path (identique à sequences.js)
  {const bT=AH_trebleTop,bB=AH_bassTop+4*AH_LS;
  const braceH=bB-bT,brSy=braceH/997,brSx=brSy*0.85,bX=AH_LM-8;
  ctx.save();ctx.fillStyle='#333';
  ctx.translate(bX-82*brSx,bB);ctx.scale(brSx,-brSy);
  ctx.fill(new Path2D("M20 498Q43 514 62 557Q81 600 82 646Q82 650 82 654Q82 658 81 662Q74 709 60 768Q46 826 44 869Q45 909 56 941Q67 972 72 980Q74 984 76 986Q77 988 77 990Q77 992 75 995Q73 997 71 997Q70 997 68 995Q66 994 63 990Q23 943 11 870Q0 798 2 737Q3 689 12 639Q22 589 22 548Q22 537 21 527Q20 516 18 506Q17 501 15 499Q14 498 11 498Q7 498 5 495Q2 493 2 490Q2 491 5 487Q7 484 11 483Q14 483 15 482Q17 480 18 476Q20 466 21 453Q22 440 22 431Q22 391 12 342Q3 293 2 244Q0 183 11 111Q23 39 63 -9Q66 -13 68 -14Q70 -16 71 -16Q73 -16 75 -14Q77 -11 77 -9Q77 -7 76 -5Q74 -3 72 1Q67 9 56 40Q45 72 44 112Q46 155 60 213Q74 272 81 319Q82 323 82 327Q82 331 82 335Q81 381 62 424Q43 467 20 483Q18 486 18 491Q18 496 20 498Z"));
  ctx.restore();}

  // Clefs — Times New Roman, proportional to AH_LS, style séquentiel
  const trebleFS=AH_LS*5.4;
  ctx.fillStyle='#1e1e2e';ctx.textAlign='left';ctx.textBaseline='alphabetic';
  // Clef de sol (portée du haut) — sauf si clef d'alto activée
  if(!window.AH_useAltoClef){
    ctx.font=`${trebleFS}px "Times New Roman",Georgia,serif`;
    const tM=ctx.measureText('\uD834\uDD1E');
    const tH=(tM.actualBoundingBoxAscent||trebleFS*0.75)+(tM.actualBoundingBoxDescent||trebleFS*0.25);
    ctx.fillText('\uD834\uDD1E',AH_LM+3,(AH_trebleTop+3*AH_LS)+tH*0.38-(tM.actualBoundingBoxDescent||trebleFS*0.25));
  }

  const bassFS=trebleFS*0.75;
  // Clef de fa (portée du bas) — sauf si clef de ténor activée
  if(!window.AH_useTenorClef){
    ctx.font=`${bassFS}px "Times New Roman",Georgia,serif`;
    const bM=ctx.measureText('\uD834\uDD22');
    const bH=(bM.actualBoundingBoxAscent||bassFS*0.8)+(bM.actualBoundingBoxDescent||bassFS*0.1);
    ctx.fillText('\uD834\uDD22',AH_LM+4,(AH_bassTop+AH_LS)-bH*0.15+(bM.actualBoundingBoxAscent||bassFS*0.8));
  }

  // Time signature — after clef (use max of both clef widths to avoid overlap)
  const ts=document.getElementById('ah_timeSigSel').value.split('/');
  ctx.font=`${trebleFS}px "Times New Roman",Georgia,serif`;
  const trebleClefWidth=ctx.measureText('\uD834\uDD1E').width;
  ctx.font=`${bassFS}px "Times New Roman",Georgia,serif`;
  const bassClefWidth=ctx.measureText('\uD834\uDD22').width;
  const maxClefWidth=Math.max(trebleClefWidth, bassClefWidth);
  const tsX=AH_LM + maxClefWidth + 10;
  ctx.fillStyle='#1e1e2e';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font=`bold ${AH_LS*2.2}px "Times New Roman",Georgia,serif`;
  ctx.fillText(ts[0],tsX,AH_trebleTop+1*AH_LS);ctx.fillText(ts[1],tsX,AH_trebleTop+3*AH_LS);
  ctx.fillText(ts[0],tsX,AH_bassTop+1*AH_LS);ctx.fillText(ts[1],tsX,AH_bassTop+3*AH_LS);

  // Key signature — after time signature
  const tsWidth=ctx.measureText('12').width;
  const clefEndX=tsX+tsWidth/2+8;
  const ksN=AH_keyInfo.sharps;
  const sharpTP=[0,1.5,-0.5,1,2.5,0.5,2],sharpBP=[1,2.5,0.5,2,3.5,1.5,3];
  const flatTP=[2,0.5,2.5,1,3,1.5,3.5],flatBP=[3,1.5,3.5,2,4,2.5,4.5];
  let ksX=clefEndX;ctx.fillStyle='#1e1e2e';ctx.textAlign='center';
  if(ksN>0){ctx.font=`${AH_LS*1.6}px "Times New Roman",Georgia,serif`;ctx.textBaseline='middle';for(let i=0;i<ksN&&i<7;i++){ctx.fillText('\u266F',ksX+i*9,AH_trebleTop+sharpTP[i]*AH_LS);ctx.fillText('\u266F',ksX+i*9,AH_bassTop+sharpBP[i]*AH_LS);}ksX+=ksN*9+4;}
  else if(ksN<0){const c=-ksN;ctx.font=`${AH_LS*1.8}px "Times New Roman",Georgia,serif`;ctx.textBaseline='middle';for(let i=0;i<c&&i<7;i++){ctx.fillText('\u266D',ksX+i*9,AH_trebleTop+flatTP[i]*AH_LS);ctx.fillText('\u266D',ksX+i*9,AH_bassTop+flatBP[i]*AH_LS);}ksX+=c*9+4;}
  window._ksEndX=ksX;

  // ── Clef d'ut (Alto = Ut3, Ténor = Ut4) si activé ──
  if(window.AH_useAltoClef){
    // Remplace la clef de sol sur la portée du haut → Ut 3e ligne
    AH_drawCClef(ctx, AH_LM+4, AH_trebleTop, AH_LS, 2);
  }
  if(window.AH_useTenorClef){
    // Remplace la clef de fa sur la portée du bas → Ut 4e ligne
    AH_drawCClef(ctx, AH_LM+4, AH_bassTop, AH_LS, 1);
  }

  if(!AH_chords.length) return;

  const csX=(window._ksEndX||AH_LM+50)+14,chW=Math.max(42,Math.min(90,(cw-csX-AH_RM-10)/AH_chords.length)),startX=csX;
  window._AH_csX=csX;window._AH_chW=chW;window._AH_cw=cw;
  const noteSize=Math.max(6,Math.min(9,130/AH_chords.length));
  const errSet=new Set(AH_errors.map(e=>e.chord)),errSet2=new Set(AH_errors.map(e=>e.chord+1));

  AH_chords.forEach((ch,ci)=>{
    const x=startX+ci*chW+chW/2;
    if(errSet.has(ci)||errSet2.has(ci)){ctx.fillStyle='rgba(239,68,68,0.06)';ctx.fillRect(x-chW/2+2,AH_trebleTop-8,chW-4,AH_bassTop+4*AH_LS-AH_trebleTop+16);}
    if(ci===AH_selChord){ctx.fillStyle='rgba(83,74,183,0.06)';ctx.fillRect(x-chW/2+2,AH_trebleTop-8,chW-4,AH_bassTop+4*AH_LS-AH_trebleTop+16);}

    // Compute Y positions for all 4 voices, then displace seconds/unisons
    const voiceData=['S','A','T','B'].map(v=>{
      const midi=ch[v],{y,staff}=AH_midiToY(midi);
      return{v,midi,y,staff,color:AH_VCOLORS[v],xOff:0};
    });
    // Sort by Y to detect close notes
    const sorted=[...voiceData].sort((a,b)=>a.y-b.y);
    // Displace notes within AH_LS*0.9 — shift right to avoid overlap
    for(let i=1;i<sorted.length;i++){
      if(Math.abs(sorted[i].y-sorted[i-1].y)<AH_LS*0.9){
        sorted[i].xOff=(noteSize+3)*2;
      }
    }

    voiceData.forEach(({v,midi,y,staff,color,xOff})=>{
      const nx=x+xOff;
      const tl=staff==='treble'?AH_trebleTop:AH_bassTop,bl=tl+4*AH_LS;
      ctx.strokeStyle='#888';ctx.lineWidth=0.9;
      if(y<tl)for(let ly=tl-AH_LS;ly>=y-1;ly-=AH_LS){ctx.beginPath();ctx.moveTo(nx-noteSize-3,ly);ctx.lineTo(nx+noteSize+3,ly);ctx.stroke();}
      if(y>bl)for(let ly=bl+AH_LS;ly<=y+1;ly+=AH_LS){ctx.beginPath();ctx.moveTo(nx-noteSize-3,ly);ctx.lineTo(nx+noteSize+3,ly);ctx.stroke();}
      if(staff==='treble'){const mcY=AH_midiToY(60).y;if(midi<=60&&mcY>=bl+AH_LS*0.8){ctx.beginPath();ctx.moveTo(nx-noteSize-3,mcY);ctx.lineTo(nx+noteSize+3,mcY);ctx.stroke();}}
      AH_drawNotehead(ctx,nx,y,color,noteSize);
      // Nom de note entre les lignes (au centre de l'espace inter-ligne le plus proche)
      const noteLabelY = y - AH_LS * 0.55; // légèrement au-dessus, entre deux lignes
      ctx.font=`bold ${Math.max(9,AH_LS*0.75)}px "DM Sans",sans-serif`;ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(AH_noteName(midi),nx,noteLabelY);
    });
    if(ci<AH_chords.length-1){ctx.strokeStyle='#ccc';ctx.lineWidth=0.5;const bx=x+chW/2;ctx.beginPath();ctx.moveTo(bx,AH_trebleTop);ctx.lineTo(bx,AH_trebleTop+4*AH_LS);ctx.stroke();ctx.beginPath();ctx.moveTo(bx,AH_bassTop);ctx.lineTo(bx,AH_bassTop+4*AH_LS);ctx.stroke();}
    if(ci<AH_chords.length-1){const nx=startX+(ci+1)*chW+chW/2;if(AH_errors.filter(e=>e.chord===ci&&e.type==='error').length>0){ctx.strokeStyle='rgba(239,68,68,0.4)';ctx.lineWidth=2;ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(x+8,AH_bassTop+4*AH_LS+8);ctx.lineTo(nx-8,AH_bassTop+4*AH_LS+8);ctx.stroke();ctx.setLineDash([]);}}
  });
  if(AH_chords.length>0){const lx=startX+(AH_chords.length-1)*chW+chW/2+chW/2;ctx.strokeStyle='#333';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(lx,AH_trebleTop);ctx.lineTo(lx,AH_trebleTop+4*AH_LS);ctx.stroke();ctx.beginPath();ctx.moveTo(lx,AH_bassTop);ctx.lineTo(lx,AH_bassTop+4*AH_LS);ctx.stroke();ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(lx+5,AH_trebleTop);ctx.lineTo(lx+5,AH_trebleTop+4*AH_LS);ctx.stroke();ctx.beginPath();ctx.moveTo(lx+5,AH_bassTop);ctx.lineTo(lx+5,AH_bassTop+4*AH_LS);ctx.stroke();}
}

/* ═══════════════════════════
   Audio Engine
   ═══════════════════════════ */
let AH_audioCtx=null;
function AH_getAudioCtx(){return _getPianoCtx();}
function AH_midi2freq(m){return 440*Math.pow(2,(m-69)/12);}

function AH_playChordAudio(ch,startTime,dur){
  const chain=_getPianoChain();
  const ctx=chain.ctx,t=startTime||ctx.currentTime;
  ['S','A','T','B'].forEach(function(v,i){
    pianoNote(AH_midi2freq(ch[v]),t+i*0.006,dur,ctx,chain.dry,chain.wet,0.22);
  });
}

function AH_playSelected(){
  if(AH_selChord<0||AH_selChord>=AH_chords.length)return;
  const btn=document.getElementById('ah_btnPlaySel');btn.classList.add('playing');
  AH_playChordAudio(AH_chords[AH_selChord],null,1.5);
  setTimeout(()=>btn.classList.remove('playing'),1500);
}

function AH_playAll(){
  if(!AH_chords.length)return;
  const ctx=AH_getAudioCtx(),tempo=+(document.getElementById('ah_tempoInput').value)||72;
  const beatDur=60/tempo;const btn=document.getElementById('ah_btnPlayAll');btn.classList.add('playing');
  const now=ctx.currentTime;
  AH_chords.forEach((ch,i)=>{AH_playChordAudio(ch,now+i*beatDur,beatDur*0.9);});
  setTimeout(()=>btn.classList.remove('playing'),AH_chords.length*beatDur*1000+500);
}

/* ═══════════════════════════
   PDF Export — Canvas rendered, embedded as image in real PDF
   ═══════════════════════════ */
function AH_exportPDF(){
  if(!AH_chords.length){alert(tx('Ajoutez des accords avant d\'exporter.','Add chords before exporting.','Añade acordes antes de exportar.'));return;}

  // Render partition on a high-res offscreen canvas (title goes in HTML, not on canvas)
  const W=2480,H=1400;
  const c=document.createElement('canvas');c.width=W;c.height=H;
  const ctx=c.getContext('2d');
  ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);

  const pLM=180,pRM=80,pLS=42,pTT=110;
  const pBT=pTT+5*pLS+110;  // espace augmenté entre portées (110 au lieu de 55)

  const keyEntry=AH_KEY_LIST[+document.getElementById('ah_keySel').value];
  const keyName=currentLang==='en'?keyEntry.nameEn:currentLang==='es'?keyEntry.nameEs:keyEntry.name;
  const tsVal=document.getElementById('ah_timeSigSel').value;

  // Staff lines
  ctx.strokeStyle='#000';ctx.lineWidth=2;
  for(let s=0;s<2;s++){const top=s===0?pTT:pBT;for(let l=0;l<5;l++){const y=top+l*pLS;ctx.beginPath();ctx.moveTo(pLM,y);ctx.lineTo(W-pRM,y);ctx.stroke();}}
  // Left barline
  ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(pLM,pTT);ctx.lineTo(pLM,pBT+4*pLS);ctx.stroke();

  // Brace — Bravura SMuFL path (identique à sequences.js)
  {const bT=pTT,bB=pBT+4*pLS;
  const braceH=bB-bT,brSy=braceH/997,brSx=brSy*0.85,bX=pLM-8;
  ctx.save();ctx.fillStyle='#000';
  ctx.translate(bX-82*brSx,bB);ctx.scale(brSx,-brSy);
  ctx.fill(new Path2D("M20 498Q43 514 62 557Q81 600 82 646Q82 650 82 654Q82 658 81 662Q74 709 60 768Q46 826 44 869Q45 909 56 941Q67 972 72 980Q74 984 76 986Q77 988 77 990Q77 992 75 995Q73 997 71 997Q70 997 68 995Q66 994 63 990Q23 943 11 870Q0 798 2 737Q3 689 12 639Q22 589 22 548Q22 537 21 527Q20 516 18 506Q17 501 15 499Q14 498 11 498Q7 498 5 495Q2 493 2 490Q2 491 5 487Q7 484 11 483Q14 483 15 482Q17 480 18 476Q20 466 21 453Q22 440 22 431Q22 391 12 342Q3 293 2 244Q0 183 11 111Q23 39 63 -9Q66 -13 68 -14Q70 -16 71 -16Q73 -16 75 -14Q77 -11 77 -9Q77 -7 76 -5Q74 -3 72 1Q67 9 56 40Q45 72 44 112Q46 155 60 213Q74 272 81 319Q82 323 82 327Q82 331 82 335Q81 381 62 424Q43 467 20 483Q18 486 18 491Q18 496 20 498Z"));
  ctx.restore();}

  // Clefs — soit Sol/Fa par défaut, soit Ut3/Ut4 si toggles activés
  ctx.fillStyle='#000';ctx.textAlign='left';ctx.textBaseline='alphabetic';
  const pTFS=pLS*5.6;
  let clefWidth = 0;
  if(window.AH_useAltoClef){
    AH_drawCClef(ctx, pLM+10, pTT, pLS, 2, '#000');
    clefWidth = pLS * 2.4;
  } else {
    ctx.font=pTFS+'px "Times New Roman",Georgia,serif';
    const ptM=ctx.measureText('\uD834\uDD1E'),ptH=(ptM.actualBoundingBoxAscent||pTFS*0.75)+(ptM.actualBoundingBoxDescent||pTFS*0.25);
    ctx.fillText('\uD834\uDD1E',pLM+8,(pTT+3*pLS)+ptH*0.38-(ptM.actualBoundingBoxDescent||pTFS*0.25));
    clefWidth = ptM.width;
  }
  const pBFS=pTFS*0.75;
  if(window.AH_useTenorClef){
    AH_drawCClef(ctx, pLM+10, pBT, pLS, 1, '#000');
  } else {
    ctx.font=pBFS+'px "Times New Roman",Georgia,serif';
    const pbM=ctx.measureText('\uD834\uDD22'),pbH=(pbM.actualBoundingBoxAscent||pBFS*0.8)+(pbM.actualBoundingBoxDescent||pBFS*0.1);
    ctx.fillText('\uD834\uDD22',pLM+10,(pBT+pLS)-pbH*0.15+(pbM.actualBoundingBoxAscent||pBFS*0.8));
  }

  // Time signature — after clef
  const tsP=tsVal.split('/');
  const tsX=pLM+Math.max(clefWidth, pLS*2.4)+30;
  ctx.font='bold '+(pLS*2.4)+'px "Times New Roman",Georgia,serif';
  ctx.fillStyle='#000';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText(tsP[0],tsX,pTT+1*pLS);ctx.fillText(tsP[1],tsX,pTT+3*pLS);
  ctx.fillText(tsP[0],tsX,pBT+1*pLS);ctx.fillText(tsP[1],tsX,pBT+3*pLS);

  // Key signature — after time signature
  const tsW=ctx.measureText('12').width;
  let pKsX=tsX+tsW/2+16;
  const ksN=AH_keyInfo.sharps;
  const shTP=[0,1.5,-0.5,1,2.5,0.5,2],shBP=[1,2.5,0.5,2,3.5,1.5,3];
  const flTP=[2,0.5,2.5,1,3,1.5,3.5],flBP=[3,1.5,3.5,2,4,2.5,4.5];
  if(ksN>0){ctx.font=(pLS*1.8)+'px "Times New Roman",Georgia,serif';ctx.textBaseline='middle';for(let i=0;i<ksN&&i<7;i++){ctx.fillText('\u266F',pKsX+i*24,pTT+shTP[i]*pLS);ctx.fillText('\u266F',pKsX+i*24,pBT+shBP[i]*pLS);}pKsX+=ksN*24+12;}
  else if(ksN<0){const cnt=-ksN;ctx.font=(pLS*2)+'px "Times New Roman",Georgia,serif';ctx.textBaseline='middle';for(let i=0;i<cnt&&i<7;i++){ctx.fillText('\u266D',pKsX+i*24,pTT+flTP[i]*pLS);ctx.fillText('\u266D',pKsX+i*24,pBT+flBP[i]*pLS);}pKsX+=cnt*24+12;}

  // Notes — largeur minimum garantie pour éviter chevauchements
  const noteStart=pKsX+50;
  const chW=Math.max(140,Math.min(260,(W-noteStart-pRM-30)/AH_chords.length));
  const pNS=18;  // taille note augmentée (14 → 18)

  function pMY(midi){
    const oct=Math.floor(midi/12)-1,pc=midi%12,dp=oct*7+AH_DIA[pc];
    if(midi>=57)return{y:pTT+2*pLS-(dp-34)*(pLS/2),staff:'treble'};
    return{y:pBT+2*pLS-(dp-22)*(pLS/2),staff:'bass'};
  }

  AH_chords.forEach((ch,ci)=>{
    const x=noteStart+ci*chW+chW/2;

    // Calculer toutes les positions Y puis décaler les secondes/unissons
    const vd=['S','A','T','B'].map(v=>{
      const midi=ch[v],{y,staff}=pMY(midi);
      return {v,midi,y,staff,xOff:0,color:AH_VCOLORS[v]};
    });
    const sortedV=[...vd].sort((a,b)=>a.y-b.y);
    for(let i=1;i<sortedV.length;i++){
      if(Math.abs(sortedV[i].y-sortedV[i-1].y) < pLS*0.9){
        sortedV[i].xOff = (pNS+5)*2;
      }
    }

    vd.forEach(({v,midi,y,staff,xOff,color})=>{
      const nx=x+xOff;
      const tl=staff==='treble'?pTT:pBT,bl=tl+4*pLS;
      ctx.strokeStyle='#000';ctx.lineWidth=2;
      if(y<tl)for(let ly=tl-pLS;ly>=y-2;ly-=pLS){ctx.beginPath();ctx.moveTo(nx-pNS-6,ly);ctx.lineTo(nx+pNS+6,ly);ctx.stroke();}
      if(y>bl)for(let ly=bl+pLS;ly<=y+2;ly+=pLS){ctx.beginPath();ctx.moveTo(nx-pNS-6,ly);ctx.lineTo(nx+pNS+6,ly);ctx.stroke();}
      if(staff==='treble'){const mcY=pMY(60).y;if(midi<=60&&mcY>=bl+pLS*0.8){ctx.beginPath();ctx.moveTo(nx-pNS-6,mcY);ctx.lineTo(nx+pNS+6,mcY);ctx.stroke();}}
      // Notehead — filled with voice color
      ctx.save();ctx.translate(nx,y);ctx.rotate(-0.18);ctx.beginPath();ctx.ellipse(0,0,pNS+3,pNS-4,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();ctx.restore();
      // Nom de note ENTRE les lignes (au-dessus de la note, jamais sur une ligne)
      const labelY = y - pLS * 0.55;
      ctx.font=`bold ${Math.max(14,pLS*0.65)}px "DM Sans",sans-serif`;
      ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(AH_noteName(midi), nx, labelY);
    });

    if(ci<AH_chords.length-1){ctx.strokeStyle='#000';ctx.lineWidth=2;const bx=x+chW/2;ctx.beginPath();ctx.moveTo(bx,pTT);ctx.lineTo(bx,pTT+4*pLS);ctx.stroke();ctx.beginPath();ctx.moveTo(bx,pBT);ctx.lineTo(bx,pBT+4*pLS);ctx.stroke();}
    // Chord symbol below — always show
    ctx.font='bold 26px "DM Sans",sans-serif';ctx.fillStyle='#000';ctx.textAlign='center';ctx.textBaseline='top';
    const label=ch.symbol||((tx('acc.','ch.','ac.'))+(ci+1));
    ctx.fillText(label,x,pBT+4*pLS+20);
  });
  // Final double barline
  if(AH_chords.length){const lx=noteStart+(AH_chords.length-1)*chW+chW/2+chW/2;ctx.strokeStyle='#000';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(lx,pTT);ctx.lineTo(lx,pTT+4*pLS);ctx.stroke();ctx.beginPath();ctx.moveTo(lx,pBT);ctx.lineTo(lx,pBT+4*pLS);ctx.stroke();ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(lx+8,pTT);ctx.lineTo(lx+8,pTT+4*pLS);ctx.stroke();ctx.beginPath();ctx.moveTo(lx+8,pBT);ctx.lineTo(lx+8,pBT+4*pLS);ctx.stroke();}

  // Convert canvas to PNG data URL — embedded in print-friendly HTML (SEQ pattern)
  const pngData=c.toDataURL('image/png');

  const lblTitle=tx('Analyse harmonique','Harmonic Analysis','Análisis armónico');
  const lblS=t('ah_s'),lblA=t('ah_a'),lblT=t('ah_t'),lblB=t('ah_b');

  const w=window.open('','_blank');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
@page{size:letter landscape;margin:0.6in 0.7in}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'DM Sans',sans-serif;color:#111827}
h1{font-size:20px;font-weight:700;color:#534AB7;margin-bottom:3px}
.sub{font-size:12px;color:#6b7280;margin-bottom:12px}
.staff-container{width:100%;overflow:visible}
.staff-container img{width:100%;height:auto;max-height:65vh;display:block}
.legend{display:flex;gap:16px;margin-top:10px;font-size:10px;color:#6b7280}
.legend span{display:inline-flex;align-items:center;gap:4px}
.legend .dot{width:7px;height:7px;border-radius:50%;display:inline-block}
@media print{
  body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .staff-container img{width:100%;height:auto}
}
</style></head><body>
<h1>${lblTitle} : ${keyName}</h1>
<div class="sub">${tsVal}</div>
<div class="staff-container"><img src="${pngData}" alt="${lblTitle}"></div>
<div class="legend">
  <span><span class="dot" style="background:${AH_VCOLORS.S}"></span> ${lblS}</span>
  <span><span class="dot" style="background:${AH_VCOLORS.A}"></span> ${lblA}</span>
  <span><span class="dot" style="background:${AH_VCOLORS.T}"></span> ${lblT}</span>
  <span><span class="dot" style="background:${AH_VCOLORS.B}"></span> ${lblB}</span>
</div>
</body></html>`);
  w.document.close();
  setTimeout(()=>w.print(),500);
}

/* ═══════════════════════════
   MIDI Export — Standard MIDI File (Format 1)
   ═══════════════════════════ */
function AH_exportMIDI(){
  if(!AH_chords.length){alert(tx('Ajoutez des accords avant d\'exporter.','Add chords before exporting.','Añade acordes antes de exportar.'));return;}
  const tempo=+(document.getElementById('ah_tempoInput').value)||72;
  const tsSel=document.getElementById('ah_timeSigSel').value.split('/');
  const tsNum=+tsSel[0],tsDen=+tsSel[1];
  const PPQ=480;
  const beatTicks=PPQ*4; // whole note = 4 beats

  function vlq(val){if(val<0)val=0;const b=[];b.push(val&0x7F);val>>=7;while(val>0){b.push((val&0x7F)|0x80);val>>=7;}return b.reverse();}
  function s2b(s){return Array.from(s).map(c=>c.charCodeAt(0));}
  function i16(v){return[(v>>8)&0xFF,v&0xFF];}
  function i32(v){return[(v>>24)&0xFF,(v>>16)&0xFF,(v>>8)&0xFF,v&0xFF];}

  function tempoTrack(){
    const ev=[];
    const uspb=Math.round(60000000/tempo);
    ev.push(...vlq(0),0xFF,0x51,0x03,(uspb>>16)&0xFF,(uspb>>8)&0xFF,uspb&0xFF);
    const dd=Math.max(0,Math.round(Math.log2(tsDen)));
    ev.push(...vlq(0),0xFF,0x58,0x04,tsNum,dd,24,8);
    const ks=AH_keyInfo.sharps||0;
    ev.push(...vlq(0),0xFF,0x59,0x02,(ks+256)&0xFF,AH_keyInfo.minor?1:0);
    const nm=s2b('Tempo');
    ev.push(...vlq(0),0xFF,0x03,nm.length,...nm);
    ev.push(...vlq(0),0xFF,0x2F,0x00);
    return ev;
  }

  function voiceTrack(name,vKey,ch){
    const ev=[];
    const nm=s2b(name);
    ev.push(...vlq(0),0xFF,0x03,nm.length,...nm);
    ev.push(...vlq(0),0xC0|ch,0); // piano

    AH_chords.forEach((chord,i)=>{
      const m=chord[vKey],vel=80;
      ev.push(...vlq(0),0x90|ch,m,vel); // note on
      ev.push(...vlq(beatTicks),0x80|ch,m,0); // note off
    });
    ev.push(...vlq(0),0xFF,0x2F,0x00);
    return ev;
  }

  function chunk(data){return[...s2b('MTrk'),...i32(data.length),...data];}

  const tracks=[
    tempoTrack(),
    voiceTrack('Soprano','S',0),
    voiceTrack('Alto','A',1),
    voiceTrack('Tenor','T',2),
    voiceTrack('Bass','B',3),
  ];

  const out=[];
  out.push(...s2b('MThd'),...i32(6),...i16(1),...i16(tracks.length),...i16(PPQ));
  tracks.forEach(t=>out.push(...chunk(t)));

  const arr=new Uint8Array(out);
  const blob=new Blob([arr],{type:'audio/midi'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='harmonie.mid';
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ── Init ── */
AH_buildKeySelector();AH_buildChordTypeSelector();AH_updateInversionOptions();AH_buildInputs();AH_calcLayout();AH_analyze();AH_render();AH_setupCanvasEvents();
window.addEventListener('resize',AH_render);


/* ═══════════════════════════════════════════════════════════════════
   ███  TUTTI MODULE  ████████████████████████████████████████████████
   Vue globale orchestrale : agrège VTS_chords + BRS_chords + STR_chords
   en "moments" alignés par position. Drag & drop vertical pour modifier
   une note (snap diatonique) qui réécrit dans le tableau source.
   Aucune saisie propre — tout vient des sections.
   ═══════════════════════════════════════════════════════════════════ */

const TUT_LS = 7;     // line spacing canvas (cohérent avec STR)
const TUT_LM = 110;   // left margin (plus large pour étiquettes longues)
const TUT_RM = 24;    // right margin
const TUT_STAVE_GAP = 16;
const TUT_GROUP_GAP = 22; // gap supplémentaire entre familles
const TUT_TOP = 28;

let TUT_selMoment = -1;
let TUT_initialized = false;
let TUT_keyInfo = { root:0, minor:false, sharps:0 };

// État du drag
let TUT_drag = null; // {staffData, momentIdx, startY, startMidi, currentMidi}

/* ─── Helpers nom de note (utilise dièses/bémols selon armure) ─── */
const TUT_NOTE_NAMES_S = ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
const TUT_NOTE_NAMES_F = ['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'];
function TUT_midiToName(midi, useFlats){
  if(midi==null||!isFinite(midi)) return '';
  const arr = useFlats ? TUT_NOTE_NAMES_F : TUT_NOTE_NAMES_S;
  const oct = Math.floor(midi/12) - 1;
  return arr[midi%12] + oct;
}

/* ─── Conversion MIDI → degré diatonique (pour snap drag) ─── */
const TUT_DIA = [0,0,1,1,2,3,3,4,4,5,5,6]; // chromatique → degré dans l'octave
function TUT_midiToDiatonic(m){
  return Math.floor(m/12)*7 + TUT_DIA[m%12];
}
function TUT_diatonicToMidi(d, useFlats){
  // map degré → semitone (avec choix dièse/bémol selon armure)
  const oct = Math.floor(d/7);
  const deg = ((d%7)+7)%7;
  const semis = [0,2,4,5,7,9,11];
  return oct*12 + semis[deg];
}

/* ─── midiToY (identique aux modules source) ─── */
function TUT_midiToY(midi, yTop, clef){
  // treble: B4(71), bass: D3(50), alto: C4(60), tenor: A3(57)
  const ref = clef==='treble' ? 71 : clef==='bass' ? 50 : clef==='alto' ? 60 : clef==='tenor' ? 57 : 50;
  const dy = TUT_midiToDiatonic(ref) - TUT_midiToDiatonic(midi);
  return yTop + 2*TUT_LS + dy*(TUT_LS/2);
}
function TUT_yToMidi(y, yTop, clef){
  const ref = clef==='treble' ? 71 : clef==='bass' ? 50 : clef==='alto' ? 60 : clef==='tenor' ? 57 : 50;
  const dy = (y - (yTop + 2*TUT_LS)) / (TUT_LS/2);
  const refDia = TUT_midiToDiatonic(ref);
  const d = Math.round(refDia - dy);
  return TUT_diatonicToMidi(d);
}

/* ═══════════════════════════════════════════════════════════════════
   TUT_PERC — Percussions (section indépendante du Tutti)
   Instruments à hauteur indéterminée : clé de percussion, 1 ligne.
   Instruments à hauteur déterminée : portée 5 lignes normale.
   ═══════════════════════════════════════════════════════════════════ */

const TUT_PERC_INSTRUMENTS = {
  timbales:    { label:{fr:'Timbales',en:'Timpani',es:'Timbales'},         short:'Timb.', pitched:true,  midi:{lo:41,hi:77},  color:'#7C3AED', lines:5, clef:'bass'  },
  glockenspiel:{ label:{fr:'Glockenspiel',en:'Glockenspiel',es:'Glockenspiel'}, short:'Glock.',pitched:true,  midi:{lo:72,hi:101}, color:'#0891B2', lines:5, clef:'treble'},
  xylophone:   { label:{fr:'Xylophone',en:'Xylophone',es:'Xilófono'},      short:'Xylo.', pitched:true,  midi:{lo:53,hi:89},  color:'#059669', lines:5, clef:'treble'},
  celesta:     { label:{fr:'Célesta',en:'Celesta',es:'Celesta'},            short:'Cel.',  pitched:true,  midi:{lo:60,hi:96},  color:'#DB2777', lines:5, clef:'treble'},
  grossecaisse:{ label:{fr:'Grosse caisse',en:'Bass Drum',es:'Bombo'},      short:'G.C.',  pitched:false, midi:null,           color:'#78350F', lines:1, clef:'perc'  },
  caisseclaire:{ label:{fr:'Caisse claire',en:'Snare Drum',es:'Caja'},      short:'C.Cl.', pitched:false, midi:null,           color:'#92400E', lines:1, clef:'perc'  },
  cymbales:    { label:{fr:'Cymbales',en:'Cymbals',es:'Platillos'},         short:'Cymb.', pitched:false, midi:null,           color:'#B45309', lines:1, clef:'perc'  },
  triangle:    { label:{fr:'Triangle',en:'Triangle',es:'Triángulo'},        short:'Tri.',  pitched:false, midi:null,           color:'#0369A1', lines:1, clef:'perc'  },
  tamtam:      { label:{fr:'Tam-tam',en:'Tam-tam',es:'Tam-tam'},            short:'T-t.',  pitched:false, midi:null,           color:'#1D4ED8', lines:1, clef:'perc'  }
};

// Ordre canonique d'affichage (du plus grave au plus aigu pour pitched, puis unpitched)
const TUT_PERC_ORDER = ['timbales','glockenspiel','xylophone','celesta','grossecaisse','caisseclaire','cymbales','triangle','tamtam'];

// Config : quels instruments sont actifs
window.TUT_percConfig = {
  timbales:false, glockenspiel:false, xylophone:false, celesta:false,
  grossecaisse:false, caisseclaire:false, cymbales:false, triangle:false, tamtam:false
};

// Moments percussions : tableau parallèle aux autres sections
// Chaque moment : { [instId]: midiNote|true|null }
// pitched → midiNote (number) | null ; unpitched → true|false
let TUT_PERC_chords = [];

/* ─── Synchroniser la longueur de TUT_PERC_chords avec les autres sections ─── */
function TUT_PERC_syncLength(){
  const n = TUT_momentCount();
  while(TUT_PERC_chords.length < n) TUT_PERC_chords.push({});
  if(TUT_PERC_chords.length > n) TUT_PERC_chords.length = n;
}

/* ─── Panel de configuration percussions ─── */
function TUT_PERC_buildPanel(){
  const el = document.getElementById('tut_percPanel'); if(!el) return;
  const L = (typeof currentLang!=='undefined') ? currentLang : 'fr';
  const tx2 = (o) => typeof o==='object' ? (o[L]||o.fr) : o;
  const cfg = window.TUT_percConfig;
  const moments = TUT_momentCount();

  let h = `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:6px;margin-bottom:8px">`;
  TUT_PERC_ORDER.forEach(id=>{
    const inst = TUT_PERC_INSTRUMENTS[id];
    h += `<label style="display:flex;align-items:center;gap:5px;font-size:10.5px;padding:4px 8px;border-radius:5px;background:${inst.color}12;border:1px solid ${inst.color}30;cursor:pointer">
      <input type="checkbox" id="tut_perc_ck_${id}" ${cfg[id]?'checked':''} onchange="TUT_PERC_onToggle('${id}')">
      <span style="color:${inst.color};font-weight:600">${tx2(inst.label)}</span>
    </label>`;
  });
  h += `</div>`;

  // Section saisie pour le moment sélectionné
  const ci = TUT_selMoment;
  const activeInsts = TUT_PERC_ORDER.filter(id=>cfg[id]);
  if(activeInsts.length && moments > 0){
    TUT_PERC_syncLength();
    const moment = (ci>=0 && ci<TUT_PERC_chords.length) ? TUT_PERC_chords[ci] : null;
    const mLabel = ci>=0 ? `${tx2({fr:'Moment',en:'Moment',es:'Momento'})} ${ci+1}` : tx2({fr:'(aucun moment sélectionné)',en:'(no moment selected)',es:'(ningún momento seleccionado)'});
    h += `<div style="border-top:1px solid var(--bd);padding-top:8px;margin-top:4px">
      <div style="font-size:10.5px;font-weight:600;color:var(--t2);margin-bottom:6px">${mLabel}</div>`;
    if(ci>=0){
      h += `<div style="display:flex;flex-wrap:wrap;gap:6px">`;
      activeInsts.forEach(id=>{
        const inst = TUT_PERC_INSTRUMENTS[id];
        const val  = moment ? moment[id] : null;
        if(inst.pitched){
          const defName = val!=null ? TUT_midiToName(val, TUT_keyInfo.sharps<0) : '';
          h += `<div style="display:flex;align-items:center;gap:4px;font-size:10px">
            <span style="color:${inst.color};font-weight:600;min-width:40px">${inst.short}</span>
            <input type="text" id="tut_perc_in_${id}" value="${defName}" placeholder="C4"
              style="width:52px;padding:2px 5px;font-size:10px;border:1px solid var(--bd);border-radius:4px;font-family:monospace"
              oninput="TUT_PERC_onNoteInput('${id}')">
          </div>`;
        } else {
          const checked = val===true;
          h += `<label style="display:flex;align-items:center;gap:4px;font-size:10px;cursor:pointer">
            <input type="checkbox" id="tut_perc_hit_${id}" ${checked?'checked':''} onchange="TUT_PERC_onHitToggle('${id}')">
            <span style="color:${inst.color};font-weight:600">${inst.short}</span>
          </label>`;
        }
      });
      h += `</div>`;
    }
    h += `</div>`;
  } else if(!activeInsts.length){
    h += `<div style="font-size:10px;color:var(--t3);font-style:italic">${tx2({fr:'Cochez les instruments à inclure dans le Tutti.',en:'Check the instruments to include in the Tutti.',es:'Marca los instrumentos a incluir en el Tutti.'})}</div>`;
  }
  el.innerHTML = h;
}

/* ─── Handlers UI percussions ─── */
function TUT_PERC_onToggle(id){
  const ck = document.getElementById('tut_perc_ck_'+id);
  if(ck) window.TUT_percConfig[id] = ck.checked;
  TUT_PERC_buildPanel();
  TUT_render();
}
function TUT_PERC_onNoteInput(id){
  const ci = TUT_selMoment; if(ci<0) return;
  TUT_PERC_syncLength();
  const inp = document.getElementById('tut_perc_in_'+id); if(!inp) return;
  const midi = TUT_PERC_parseNote(inp.value);
  if(!TUT_PERC_chords[ci]) TUT_PERC_chords[ci]={};
  TUT_PERC_chords[ci][id] = (midi!=null) ? midi : null;
  TUT_render();
}
function TUT_PERC_onHitToggle(id){
  const ci = TUT_selMoment; if(ci<0) return;
  TUT_PERC_syncLength();
  const ck = document.getElementById('tut_perc_hit_'+id); if(!ck) return;
  if(!TUT_PERC_chords[ci]) TUT_PERC_chords[ci]={};
  TUT_PERC_chords[ci][id] = ck.checked ? true : false;
  TUT_render();
}
window.TUT_PERC_onToggle    = TUT_PERC_onToggle;
window.TUT_PERC_onNoteInput = TUT_PERC_onNoteInput;
window.TUT_PERC_onHitToggle = TUT_PERC_onHitToggle;

/* ─── Parser note texte → MIDI (même logique que VTS_parseNote) ─── */
function TUT_PERC_parseNote(str){
  if(!str) return null;
  const s = str.trim().replace(/♯/g,'#').replace(/♭/g,'b');
  const m = s.match(/^([A-Ga-g])([#b]?)(-?\d{1,2})$/);
  if(!m) return null;
  const base={C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1].toUpperCase()];
  const acc = m[2]==='#'?1:m[2]==='b'?-1:0;
  const midi = (parseInt(m[3],10)+1)*12 + base + acc;
  return (midi>=0&&midi<=127) ? midi : null;
}

/* ─── Construire les portées de percussion pour TUT_buildStaves ─── */
function TUT_PERC_buildStaves(){
  const cfg = window.TUT_percConfig;
  const out = [];
  TUT_PERC_syncLength();

  TUT_PERC_ORDER.forEach(id=>{
    if(!cfg[id]) return;
    const inst = TUT_PERC_INSTRUMENTS[id];
    out.push({
      id: 'perc_'+id,
      kind: 'solo',
      section: 'PERC',
      family: 'perc',
      color: inst.color,
      label: inst.short,
      clef: inst.clef,
      percLines: inst.lines,
      pitched: inst.pitched,
      slots: [{slotId:id, instId:id}],
      getMidi(ci){
        const ch = TUT_PERC_chords[ci]; if(!ch) return null;
        const v = ch[id];
        if(inst.pitched) return (typeof v==='number') ? v : null;
        return (v===true) ? 60 : null; // 60 = C4, position centrale pour unpitched
      },
      setMidi(ci, _si, midi){
        if(!TUT_PERC_chords[ci]) TUT_PERC_chords[ci]={};
        TUT_PERC_chords[ci][id] = inst.pitched ? midi : true;
        TUT_PERC_buildPanel();
      }
    });
  });
  return out;
}


function TUT_buildStaves(){
  const out = [];

  /* ─── 1) BOIS (VENTS) — un slot par portée ─── */
  const vtsList = (typeof VTS_activeInsts!=='undefined' && VTS_activeInsts.length)
                  ? VTS_activeInsts : [];
  vtsList.forEach(slot=>{
    const inst = (typeof VTS_INSTRUMENTS!=='undefined') ? VTS_INSTRUMENTS[slot.instId] : null;
    if(!inst) return;
    const lab = inst.short + (slot.isAux ? '' : (vtsList.filter(s=>s.family===slot.family).length>1 ? ' '+slot.idx : ''));
    const vtsEffClef = (typeof VTS_tenorClef!=='undefined' && VTS_tenorClef[slot.slotId]) ? 'tenor' : inst.clef;
    out.push({
      id: 'vts_'+slot.slotId,
      kind: 'solo',
      section: 'VTS',
      family: slot.family,
      color: inst.color,
      label: lab,
      clef: vtsEffClef,
      slots: [slot],
      getMidi(ci, _si){
        const ch = (typeof VTS_chords!=='undefined' ? VTS_chords : [])[ci]; if(!ch) return null;
        const w = ch.notes ? ch.notes[slot.slotId] : null;
        if(w==null) return null;
        return (typeof VTS_writtenToSounding==='function') ? VTS_writtenToSounding(w, slot.instId) : w;
      },
      setMidi(ci, _si, midiSounding){
        const ch = (typeof VTS_chords!=='undefined' ? VTS_chords : [])[ci]; if(!ch || !ch.notes) return;
        let w = midiSounding;
        if(typeof VTS_soundingToWritten==='function') w = VTS_soundingToWritten(midiSounding, slot.instId);
        ch.notes[slot.slotId] = w;
        const inp = document.getElementById('vts_in_'+slot.slotId);
        if(inp){
          const useFlats = (typeof VTS_keyInfo!=='undefined' && VTS_keyInfo.sharps<0);
          inp.value = (typeof VTS_midiToName==='function') ? VTS_midiToName(w, useFlats) : '';
          if(typeof VTS_updateTransposeDisplay==='function') VTS_updateTransposeDisplay(slot.slotId);
          if(typeof VTS_updateRegisterBadge==='function')   VTS_updateRegisterBadge(slot.slotId);
        }
      }
    });
  });

  /* ─── 2) CUIVRES (BRS) — cors par paires, reste solo ─── */
  try{ if(typeof BRS_buildActiveInsts==='function') BRS_buildActiveInsts(); }catch(e){}
  const brsList = (typeof BRS_activeInsts!=='undefined' ? BRS_activeInsts : []) || [];
  const cors = brsList.filter(s=>s.family==='cors');
  const trps = brsList.filter(s=>s.family==='trp');
  const trbs = brsList.filter(s=>s.family==='trombones');
  const tubs = brsList.filter(s=>s.family==='tuba');

  const brsBuildAccessor = (slot)=>({
    getMidi: (ci)=>{
      const ch = (typeof BRS_chords!=='undefined' ? BRS_chords : [])[ci]; if(!ch || !ch.notes) return null;
      const w = ch.notes[slot.slotId];
      if(w==null) return null;
      return (typeof BRS_writtenToSounding==='function') ? BRS_writtenToSounding(w, slot.instId) : w;
    },
    setMidi: (ci, midiSounding)=>{
      const ch = (typeof BRS_chords!=='undefined' ? BRS_chords : [])[ci]; if(!ch || !ch.notes) return;
      const inst = (typeof BRS_INSTRUMENTS!=='undefined') ? BRS_INSTRUMENTS[slot.instId] : null;
      const w = inst ? (midiSounding - inst.transpose) : midiSounding;
      ch.notes[slot.slotId] = w;
      const inp = document.getElementById('brs_in_'+slot.slotId);
      if(inp){
        const useFlats = (typeof BRS_keyInfo!=='undefined' && BRS_keyInfo.sharps<0);
        inp.value = (typeof BRS_midiToName==='function') ? BRS_midiToName(w, useFlats) : '';
        if(typeof BRS_updateTransposeDisplay==='function') BRS_updateTransposeDisplay(slot.slotId);
        if(typeof BRS_updateRegisterBadge==='function')    BRS_updateRegisterBadge(slot.slotId);
      }
    }
  });

  // Cors : par paires (1+2 sur une portée, 3+4 sur la suivante)
  for(let p=0; p<Math.ceil(cors.length/2); p++){
    const s1 = cors[p*2];
    const s2 = cors[p*2+1] || null;
    const inst = (typeof BRS_INSTRUMENTS!=='undefined') ? BRS_INSTRUMENTS[s1.instId] : null;
    if(!inst) continue;
    const acc1 = brsBuildAccessor(s1);
    const acc2 = s2 ? brsBuildAccessor(s2) : null;
    out.push({
      id: 'brs_corpair_'+p,
      kind: s2 ? 'paired' : 'solo',
      section: 'BRS',
      family: 'cors',
      color: inst.color,
      label: 'Cor '+ (s2 ? (p*2+1)+'+'+(p*2+2) : ''+(p*2+1)),
      clef: inst.clef,
      slots: s2 ? [s1, s2] : [s1],
      getMidi(ci, si){ return si===1 ? (acc2 && acc2.getMidi(ci)) : acc1.getMidi(ci); },
      setMidi(ci, si, midi){ if(si===1 && acc2) acc2.setMidi(ci, midi); else acc1.setMidi(ci, midi); }
    });
  }

  // Trompettes/cornet — solo
  trps.forEach((slot,i)=>{
    const inst = (typeof BRS_INSTRUMENTS!=='undefined') ? BRS_INSTRUMENTS[slot.instId] : null;
    if(!inst) return;
    const acc = brsBuildAccessor(slot);
    out.push({
      id: 'brs_trp_'+i, kind:'solo', section:'BRS', family:'trp',
      color: inst.color, label: inst.short + (trps.length>1?' '+slot.idx:''),
      clef: inst.clef, slots:[slot],
      getMidi(ci){ return acc.getMidi(ci); },
      setMidi(ci, _si, midi){ acc.setMidi(ci, midi); }
    });
  });

  // Trombones — solo
  trbs.forEach((slot,i)=>{
    const inst = (typeof BRS_INSTRUMENTS!=='undefined') ? BRS_INSTRUMENTS[slot.instId] : null;
    if(!inst) return;
    const acc = brsBuildAccessor(slot);
    const trbEffClef = (typeof BRS_tenorClef!=='undefined' && BRS_tenorClef[slot.slotId]) ? 'tenor' : inst.clef;
    out.push({
      id:'brs_trb_'+i, kind:'solo', section:'BRS', family:'trombones',
      color: inst.color, label: inst.short + (trbs.length>1?' '+slot.idx:''),
      clef: trbEffClef, slots:[slot],
      getMidi(ci){ return acc.getMidi(ci); },
      setMidi(ci, _si, midi){ acc.setMidi(ci, midi); }
    });
  });

  // Tuba
  tubs.forEach((slot,i)=>{
    const inst = (typeof BRS_INSTRUMENTS!=='undefined') ? BRS_INSTRUMENTS[slot.instId] : null;
    if(!inst) return;
    const acc = brsBuildAccessor(slot);
    out.push({
      id:'brs_tuba_'+i, kind:'solo', section:'BRS', family:'tuba',
      color: inst.color, label: inst.short + (tubs.length>1?' '+slot.idx:''),
      clef: inst.clef, slots:[slot],
      getMidi(ci){ return acc.getMidi(ci); },
      setMidi(ci, _si, midi){ acc.setMidi(ci, midi); }
    });
  });

  /* ─── 3) CORDES (STR) — 5 portées fixes ─── */
  const strOrder = (typeof STR_ORDER!=='undefined') ? STR_ORDER : ['VL1','VL2','VLA','VLC','CB'];
  strOrder.forEach(id=>{
    const inst = (typeof STR_INSTRUMENTS!=='undefined') ? STR_INSTRUMENTS[id] : null;
    if(!inst) return;
    // Clef de ténor si activée dans STR
    const useTenorClef = (typeof STR_tenorClef!=='undefined' && STR_tenorClef && STR_tenorClef[id]);
    const useAltoClef  = (typeof STR_altClef!=='undefined'   && STR_altClef   && STR_altClef[id]);
    const effectiveClef = useTenorClef ? 'tenor' : useAltoClef ? 'alto' : inst.clef;
    out.push({
      id:'str_'+id, kind:'solo', section:'STR', family:'strings',
      color: inst.color, label: inst.short, clef: effectiveClef,
      slots:[{slotId:id, instId:id}],
      getMidi(ci){
        const ch = (typeof STR_chords!=='undefined' ? STR_chords : [])[ci];
        if(!ch || !ch.notes) return null;
        return ch.notes[id] ?? null;
      },
      setMidi(ci, _si, midi){
        const ch = (typeof STR_chords!=='undefined' ? STR_chords : [])[ci];
        if(!ch || !ch.notes) return;
        ch.notes[id] = midi;
        const inp = document.getElementById('str_in_'+id);
        if(inp){
          const useFlats = (typeof STR_keyInfo!=='undefined' && STR_keyInfo.sharps<0);
          inp.value = (typeof STR_midiToName==='function') ? STR_midiToName(midi, useFlats) : '';
          if(typeof STR_updateRegisterBadge==='function') STR_updateRegisterBadge(id);
        }
      }
    });
  });

  /* ─── 4) PERCUSSIONS ─── */
  const percStaves = TUT_PERC_buildStaves();
  percStaves.forEach(s => out.push(s));

  return out;
}
function TUT_momentCount(){
  const v = (typeof VTS_chords!=='undefined' ? VTS_chords : []).length;
  const b = (typeof BRS_chords!=='undefined' ? BRS_chords : []).length;
  const s = (typeof STR_chords!=='undefined' ? STR_chords : []).length;
  const p = TUT_PERC_chords.length;
  return Math.max(v,b,s,p);
}

/* ═══ RENDU CANVAS ════════════════════════════════════════════════ */
function TUT_render(){
  const canvas = document.getElementById('tut_scoreCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  const staves = TUT_buildStaves();
  const moments = TUT_momentCount();

  // Dimensions
  const cw = Math.max(900, (canvas.parentElement ? canvas.parentElement.clientWidth - 28 : 900));

  // Calcul positions Y avec gaps entre sections
  const staveH = 4 * TUT_LS;
  let y = TUT_TOP;
  const stavesY = [];
  let prevSection = null;
  staves.forEach(s=>{
    if(prevSection && prevSection !== s.section){
      y += TUT_GROUP_GAP;
    }
    stavesY.push({ ...s, yTop: y });
    y += staveH + TUT_STAVE_GAP;
    prevSection = s.section;
  });
  const totalH = y + 20;

  canvas.style.width  = cw + 'px';
  canvas.style.height = totalH + 'px';
  canvas.width  = cw * dpr;
  canvas.height = totalH * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0,0,cw,totalH);

  if(!stavesY.length){
    ctx.fillStyle = '#888';
    ctx.font = '14px "DM Sans",sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText((typeof window.t==='function')
      ? window.t('tut_empty')
      : 'Activez au moins une section (Vents, Cuivres ou Cordes) pour voir le Tutti.',
      cw/2, totalH/2);
    return;
  }

  /* ─── Portées ─── */
  stavesY.forEach(s=>{
    ctx.strokeStyle = '#555'; ctx.lineWidth = 0.8;
    if(s.clef === 'perc' && s.percLines === 1){
      // Portée à 1 ligne centrale pour percussions indéterminées
      const yy = s.yTop + 2*TUT_LS;
      ctx.beginPath(); ctx.moveTo(TUT_LM, yy); ctx.lineTo(cw-TUT_RM, yy); ctx.stroke();
    } else {
      for(let l=0; l<5; l++){
        const yy = s.yTop + l*TUT_LS;
        ctx.beginPath(); ctx.moveTo(TUT_LM, yy); ctx.lineTo(cw-TUT_RM, yy); ctx.stroke();
      }
    }
    // Barre gauche
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5;
    const barTop = (s.clef==='perc'&&s.percLines===1) ? s.yTop+TUT_LS : s.yTop;
    const barBot = (s.clef==='perc'&&s.percLines===1) ? s.yTop+3*TUT_LS : s.yTop+4*TUT_LS;
    ctx.beginPath(); ctx.moveTo(TUT_LM, barTop); ctx.lineTo(TUT_LM, barBot); ctx.stroke();

    // Étiquette
    ctx.fillStyle = s.color;
    ctx.font = 'bold 10px "DM Sans",sans-serif';
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    ctx.fillText(s.label, TUT_LM - 8, s.yTop + 2*TUT_LS);

    // Clé
    const fs = TUT_LS * 4.2;
    ctx.fillStyle = '#1e1e2e';
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    if(s.clef === 'perc'){
      // Clé de percussion : double barre verticale épaisse
      ctx.strokeStyle = '#555'; ctx.lineWidth = 2.5;
      const px = TUT_LM + 6;
      const py1 = s.yTop + TUT_LS;
      const py2 = s.yTop + 3*TUT_LS;
      ctx.beginPath(); ctx.moveTo(px,   py1); ctx.lineTo(px,   py2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px+5, py1); ctx.lineTo(px+5, py2); ctx.stroke();
    } else if(s.clef === 'tenor'){
      if(typeof STR_drawTenorClef === 'function') STR_drawTenorClef(ctx, TUT_LM+3, s.yTop, TUT_LS);
    } else if(s.clef === 'treble' || s.clef === 'alto'){
      ctx.font = `${fs}px "Times New Roman",Georgia,serif`;
      const m = ctx.measureText('\uD834\uDD1E');
      const h = (m.actualBoundingBoxAscent||fs*0.75)+(m.actualBoundingBoxDescent||fs*0.25);
      ctx.fillText('\uD834\uDD1E', TUT_LM+3, (s.yTop+3*TUT_LS)+h*0.38-(m.actualBoundingBoxDescent||fs*0.25));
    } else {
      const bfs = fs*0.78;
      ctx.font = `${bfs}px "Times New Roman",Georgia,serif`;
      const m = ctx.measureText('\uD834\uDD22');
      const h = (m.actualBoundingBoxAscent||bfs*0.8)+(m.actualBoundingBoxDescent||bfs*0.1);
      ctx.fillText('\uD834\uDD22', TUT_LM+4, (s.yTop+TUT_LS)-h*0.15+(m.actualBoundingBoxAscent||bfs*0.8));
    }
  });

  /* ─── Armure ─── */
  const ksN = TUT_keyInfo.sharps||0;
  const sharpTP=[0,1.5,-0.5,1,2.5,0.5,2], sharpBP=[1,2.5,0.5,2,3.5,1.5,3];
  const flatTP=[2,0.5,2.5,1,3,1.5,3.5],   flatBP=[3,1.5,3.5,2,4,2.5,4.5];
  let ksX = TUT_LM + 38;
  stavesY.forEach(s=>{
    const isBass = s.clef==='bass';
    const tp  = isBass ? sharpBP : sharpTP;
    const tpf = isBass ? flatBP  : flatTP;
    if(ksN>0){
      ctx.font=`${TUT_LS*1.5}px "Times New Roman",Georgia,serif`;
      ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillStyle='#1e1e2e';
      for(let i=0;i<ksN&&i<7;i++) ctx.fillText('\u266F', ksX+i*8, s.yTop+tp[i]*TUT_LS);
    } else if(ksN<0){
      const c=-ksN;
      ctx.font=`${TUT_LS*1.7}px "Times New Roman",Georgia,serif`;
      ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillStyle='#1e1e2e';
      for(let i=0;i<c&&i<7;i++) ctx.fillText('\u266D', ksX+i*8, s.yTop+tpf[i]*TUT_LS);
    }
  });
  if(ksN!==0) ksX += Math.abs(ksN)*8+6;

  // Mémoriser pour le clic/drag
  window.TUT_lastLayout = { stavesY, cw, totalH, ksX, momentCount: moments };

  if(!moments){
    ctx.fillStyle = '#999'; ctx.font='12px "DM Sans",sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText((typeof window.t==='function')
      ? window.t('tut_no_moment')
      : 'Aucun moment — ajoutez des accords dans les sections.',
      cw/2, totalH-30);
    return;
  }

  const startX = ksX + 14;
  const chW    = Math.min(70, (cw - startX - TUT_RM - 10) / moments);
  const noteSize = Math.max(4, Math.min(6, 80/Math.max(1,moments)));
  window.TUT_lastLayout.startX = startX;
  window.TUT_lastLayout.chW    = chW;
  window.TUT_lastLayout.noteSize = noteSize;

  /* ─── Moments ─── */
  for(let ci=0; ci<moments; ci++){
    const x = startX + ci*chW + chW/2;
    // Fond sélection
    if(ci===TUT_selMoment){
      ctx.fillStyle='rgba(83,74,183,0.08)';
      ctx.fillRect(x-chW/2+2, TUT_TOP-6, chW-4, totalH-TUT_TOP-20);
    }

    stavesY.forEach(s=>{
      // Calculer toutes les notes de cette portée et détecter collisions
      const tutNotes = [];
      for(let si=0; si<s.slots.length; si++){
        const midi = s.getMidi(ci, si); if(midi==null) continue;
        let displayMidi = midi;
        if(TUT_drag && TUT_drag.staffId===s.id && TUT_drag.slotIdx===si && TUT_drag.momentIdx===ci)
          displayMidi = TUT_drag.currentMidi;
        const y = TUT_midiToY(displayMidi, s.yTop, s.clef);
        tutNotes.push({si, midi, displayMidi, y, xOff:0});
      }
      // Trier et décaler notes trop proches
      const tutSorted = [...tutNotes].sort((a,b)=>a.y-b.y);
      for(let i=1;i<tutSorted.length;i++){
        if(Math.abs(tutSorted[i].y - tutSorted[i-1].y) < TUT_LS*0.9)
          tutSorted[i].xOff = (noteSize+2)*2;
      }

      tutNotes.forEach(({si, midi, displayMidi, y, xOff})=>{
        const nx = x + xOff;
        const yBot = s.yTop + 4*TUT_LS;

        // Lignes supplémentaires
        ctx.strokeStyle='#888'; ctx.lineWidth=0.8;
        if(y < s.yTop) for(let ly=s.yTop-TUT_LS; ly>=y-1; ly-=TUT_LS){
          ctx.beginPath(); ctx.moveTo(nx-9,ly); ctx.lineTo(nx+9,ly); ctx.stroke();
        }
        if(y > yBot) for(let ly=yBot+TUT_LS; ly<=y+1; ly+=TUT_LS){
          ctx.beginPath(); ctx.moveTo(nx-9,ly); ctx.lineTo(nx+9,ly); ctx.stroke();
        }

        // Tête de note
        ctx.save();
        ctx.translate(nx, y);
        if(s.clef === 'perc' && !s.pitched){
          // Notehead en X pour percussions indéterminées
          const xs = noteSize - 1;
          ctx.strokeStyle = s.color; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(-xs,-xs); ctx.lineTo(xs,xs); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(xs,-xs); ctx.lineTo(-xs,xs); ctx.stroke();
        } else {
          ctx.rotate(-0.18);
          ctx.beginPath();
          ctx.ellipse(0,0, noteSize+1, noteSize-1.5, 0,0,Math.PI*2);
          ctx.fillStyle = s.color;
          ctx.fill();
        }
        ctx.restore();

        // Highlight drag
        if(TUT_drag && TUT_drag.staffId===s.id && TUT_drag.slotIdx===si && TUT_drag.momentIdx===ci){
          ctx.strokeStyle='#534ab7'; ctx.lineWidth=2;
          ctx.beginPath(); ctx.arc(nx,y,noteSize+4,0,Math.PI*2); ctx.stroke();
        }
      });
    });

    // Barre de mesure
    if(ci<moments-1){
      ctx.strokeStyle='#ccc'; ctx.lineWidth=0.5;
      const bx=x+chW/2;
      stavesY.forEach(s=>{
        ctx.beginPath(); ctx.moveTo(bx,s.yTop); ctx.lineTo(bx,s.yTop+4*TUT_LS); ctx.stroke();
      });
    }
  }

  // Double barre finale
  if(moments){
    const lx = startX + (moments-1)*chW + chW/2 + chW/2;
    ctx.strokeStyle='#333'; ctx.lineWidth=1;
    stavesY.forEach(s=>{ ctx.beginPath(); ctx.moveTo(lx,s.yTop); ctx.lineTo(lx,s.yTop+4*TUT_LS); ctx.stroke(); });
    ctx.lineWidth=3.5;
    stavesY.forEach(s=>{ ctx.beginPath(); ctx.moveTo(lx+5,s.yTop); ctx.lineTo(lx+5,s.yTop+4*TUT_LS); ctx.stroke(); });
  }

  // MAJ panneau résumé
  TUT_renderSummary(stavesY, moments);
}

/* ═══ PANNEAU RÉSUMÉ "INSTRUMENTS ACTIFS" ════════════════════════ */
function TUT_renderSummary(stavesY, moments){
  const el = document.getElementById('tut_summary');
  if(!el) return;
  if(!stavesY || !stavesY.length){
    el.innerHTML = '<div style="color:#888;font-size:11px;padding:8px">'
      + ((typeof window.t==='function') ? window.t('tut_empty') : 'Aucune section active.')
      + '</div>';
    return;
  }
  const ci = (TUT_selMoment>=0 && TUT_selMoment<moments) ? TUT_selMoment : -1;
  const L = (typeof currentLang!=='undefined')?currentLang:'fr';
  const useFlats = TUT_keyInfo.sharps<0;
  const head = (typeof window.t==='function')
    ? window.t('tut_summary_title').replace('{n}', ci>=0 ? (ci+1) : '–')
    : ('Moment '+(ci>=0 ? (ci+1) : '–'));

  let h = `<div style="font-weight:700;font-size:11px;color:var(--t2);margin-bottom:6px">${head}</div>`;
  h += '<div style="display:flex;flex-wrap:wrap;gap:6px">';

  stavesY.forEach(s=>{
    for(let si=0; si<s.slots.length; si++){
      const midi = (ci>=0) ? s.getMidi(ci, si) : null;
      const name = midi==null ? '—' : TUT_midiToName(midi, useFlats);
      const lbl = (s.slots.length>1) ? `${s.label.split(' ')[0]} ${s.slots[si].idx||(si+1)}` : s.label;
      h += `<span style="display:inline-flex;align-items:center;gap:4px;font-size:10px;padding:3px 7px;border-radius:10px;background:${s.color}15;border:1px solid ${s.color}40;color:${s.color};white-space:nowrap">
        <strong style="font-weight:700">${lbl}</strong>
        <span style="color:#1e1e2e;font-family:monospace">${name}</span>
      </span>`;
    }
  });
  h += '</div>';
  el.innerHTML = h;
}

/* ═══ INTERACTION : clic moment + drag note ══════════════════════ */
function TUT_setupCanvasEvents(){
  const canvas = document.getElementById('tut_scoreCanvas'); if(!canvas) return;
  if(canvas._tutBound) return; canvas._tutBound = true;

  const getMouseXY = (e)=>{
    const rect = canvas.getBoundingClientRect();
    const t = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]) || e;
    return { x: t.clientX - rect.left, y: t.clientY - rect.top };
  };

  // Helper : trouver tête de note sous (x,y), tolérance ±6 px
  function hitTestNote(x, y){
    const L = window.TUT_lastLayout; if(!L || !L.chW) return null;
    const { startX, chW, stavesY, momentCount, noteSize } = L;
    if(x < startX) return null;
    const ci = Math.floor((x - startX) / chW);
    if(ci<0 || ci>=momentCount) return null;
    const xCenter = startX + ci*chW + chW/2;
    if(Math.abs(x - xCenter) > Math.max(8, noteSize+3)) return null;

    // Chercher la portée et le slot
    for(const s of stavesY){
      for(let si=0; si<s.slots.length; si++){
        const midi = s.getMidi(ci, si);
        if(midi==null) continue;
        const ny = TUT_midiToY(midi, s.yTop, s.clef);
        if(Math.abs(y - ny) <= Math.max(6, noteSize+2)){
          return { staff:s, slotIdx:si, momentIdx:ci, currentMidi:midi };
        }
      }
    }
    return null;
  }

  const onDown = (e)=>{
    const { x, y } = getMouseXY(e);
    const hit = hitTestNote(x, y);
    if(hit){
      e.preventDefault();
      TUT_drag = {
        staffId: hit.staff.id,
        staff:   hit.staff,
        slotIdx: hit.slotIdx,
        momentIdx: hit.momentIdx,
        startY: y,
        startMidi: hit.currentMidi,
        currentMidi: hit.currentMidi
      };
      TUT_selMoment = hit.momentIdx;
      canvas.style.cursor = 'ns-resize';
      TUT_PERC_buildPanel();
      TUT_render();
    } else {
      // Clic moment (sélection)
      const L = window.TUT_lastLayout; if(!L || !L.chW) return;
      const ci = Math.floor((x - L.startX) / L.chW);
      if(ci>=0 && ci<L.momentCount){
        TUT_selMoment = ci;
        TUT_PERC_buildPanel();
        TUT_render();
      }
    }
  };

  const onMove = (e)=>{
    if(!TUT_drag){
      const { x, y } = getMouseXY(e);
      const hit = hitTestNote(x, y);
      canvas.style.cursor = hit ? 'ns-resize' : 'default';
      return;
    }
    e.preventDefault();
    const { y } = getMouseXY(e);
    const dy = TUT_drag.startY - y;
    // dy positif → on monte → +1 degré diatonique tous les 4-6 px
    const stepPx = TUT_LS/2 + 1; // sensibilité similaire au snap diatonique
    const diaSteps = Math.round(dy / stepPx);
    const startDia = TUT_midiToDiatonic(TUT_drag.startMidi);
    const newDia = startDia + diaSteps;
    const newMidi = Math.max(0, Math.min(127, TUT_diatonicToMidi(newDia)));
    if(newMidi !== TUT_drag.currentMidi){
      TUT_drag.currentMidi = newMidi;
      TUT_render();
    }
  };

  const onUp = (e)=>{
    if(!TUT_drag){ return; }
    e.preventDefault();
    const finalMidi = TUT_drag.currentMidi;
    if(finalMidi !== TUT_drag.startMidi){
      // Écrire dans la source
      try{ TUT_drag.staff.setMidi(TUT_drag.momentIdx, TUT_drag.slotIdx, finalMidi); }catch(err){ console.error('TUT setMidi', err); }
      // Note : on n'appelle PAS VTS_render/BRS_render/STR_render pour éviter les boucles
      // mais on émet l'événement pour cohérence (les autres TUT recevront mais on est seuls)
      // try{window.dispatchEvent(new CustomEvent('contrepoint:chordschange'));}catch(e){}
      // → désactivé volontairement pour éviter double-render
    }
    TUT_drag = null;
    canvas.style.cursor = 'default';
    TUT_render();
  };

  canvas.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
  // Touch
  canvas.addEventListener('touchstart', onDown, {passive:false});
  window.addEventListener('touchmove', onMove, {passive:false});
  window.addEventListener('touchend', onUp);
}

/* ═══ TONALITÉ ═══════════════════════════════════════════════════ */
function TUT_buildKeySelector(){
  const sel = document.getElementById('tut_keySel'); if(!sel) return;
  if(typeof AH_KEY_LIST==='undefined') return;
  const cur = sel.value;
  const L = (typeof currentLang!=='undefined')?currentLang:'fr';
  sel.innerHTML = AH_KEY_LIST.map((k,i)=>{
    const name = L==='en'?k.nameEn:L==='es'?k.nameEs:k.name;
    return `<option value="${i}">${name}</option>`;
  }).join('');
  if(cur) sel.value = cur;
}
function TUT_updateKey(){
  const sel = document.getElementById('tut_keySel'); if(!sel) return;
  if(typeof AH_KEY_LIST==='undefined') return;
  const v = +sel.value;
  const k = AH_KEY_LIST[v]; if(!k) return;
  TUT_keyInfo = { root:k.root, minor:k.minor, sharps:k.sharps };
  TUT_render();
}
function TUT_inheritKey(){
  // Hérite de la dernière section qui a une tonalité définie : STR > BRS > VTS
  let k = null;
  if(typeof STR_keyInfo!=='undefined' && STR_keyInfo) k = STR_keyInfo;
  else if(typeof BRS_keyInfo!=='undefined' && BRS_keyInfo) k = BRS_keyInfo;
  else if(typeof VTS_keyInfo!=='undefined' && VTS_keyInfo) k = VTS_keyInfo;
  if(k) TUT_keyInfo = {root:k.root, minor:k.minor, sharps:k.sharps};
  // Repositionner le selector
  const sel = document.getElementById('tut_keySel');
  if(sel && typeof AH_KEY_LIST!=='undefined'){
    const idx = AH_KEY_LIST.findIndex(e=>e.root===TUT_keyInfo.root && e.minor===TUT_keyInfo.minor);
    if(idx>=0) sel.value = idx;
  }
}

/* ═══ AUDIO ══════════════════════════════════════════════════════ */
function TUT_playMoment(ci){
  if(typeof _getPianoChain!=='function') return;
  const staves = TUT_buildStaves();
  const moments = TUT_momentCount();
  if(ci<0 || ci>=moments) return;
  const chain = _getPianoChain(); const actx = chain.ctx;
  const t = actx.currentTime;
  let i = 0;
  staves.forEach(s=>{
    for(let si=0; si<s.slots.length; si++){
      const midi = s.getMidi(ci, si);
      if(midi==null) continue;
      const f = 440*Math.pow(2,(midi-69)/12);
      if(typeof pianoNote==='function') pianoNote(f, t+(i++)*0.005, 1.5, actx, chain.dry, chain.wet, 0.18);
    }
  });
}
function TUT_playSelected(){
  if(TUT_selMoment<0) return;
  const btn = document.getElementById('tut_btnPlaySel');
  if(btn) btn.classList.add('playing');
  TUT_playMoment(TUT_selMoment);
  setTimeout(()=>{ if(btn) btn.classList.remove('playing'); },1600);
}
function TUT_playAll(){
  const moments = TUT_momentCount();
  if(!moments) return;
  if(typeof _getPianoChain!=='function') return;
  const btn = document.getElementById('tut_btnPlayAll');
  if(btn) btn.classList.add('playing');
  const tmpEl = document.getElementById('tut_tempoInput');
  const bpm = tmpEl ? Math.max(30, Math.min(200, +tmpEl.value)) : 72;
  const dur = 60/bpm * 0.9;
  const chain = _getPianoChain(); const actx = chain.ctx;
  const staves = TUT_buildStaves();
  for(let ci=0; ci<moments; ci++){
    const t = actx.currentTime + ci*(60/bpm);
    let i = 0;
    staves.forEach(s=>{
      for(let si=0; si<s.slots.length; si++){
        const midi = s.getMidi(ci, si);
        if(midi==null) continue;
        const f = 440*Math.pow(2,(midi-69)/12);
        if(typeof pianoNote==='function') pianoNote(f, t+(i++)*0.004, dur, actx, chain.dry, chain.wet, 0.18);
      }
    });
  }
  setTimeout(()=>{ if(btn) btn.classList.remove('playing'); }, moments*(60/bpm)*1000 + 200);
}

/* ═══ EXPORT PDF ═════════════════════════════════════════════════ */
function TUT_exportPDF(){
  const canvas = document.getElementById('tut_scoreCanvas');
  if(!canvas){ return; }
  const L = (typeof currentLang!=='undefined')?currentLang:'fr';
  const tx = (typeof window.t==='function') ? window.t : (k)=>k;

  const staves = TUT_buildStaves();
  const moments = TUT_momentCount();
  const useFlats = TUT_keyInfo.sharps<0;

  // Image canvas
  const imgData = canvas.toDataURL('image/png');

  const title = tx('tut_pdf_title') || 'Contrepoint — Tutti orchestral';
  const html = `<!DOCTYPE html><html lang="${L}"><head><meta charset="utf-8"><title>${title}</title>
<style>
body{font-family:'DM Sans',Arial,sans-serif;color:#1e1e2e;padding:24px;margin:0}
h1{font-size:18px;margin:0 0 6px 0}
.sub{font-size:11px;color:#666;margin-bottom:14px}
img{max-width:100%;border:1px solid #ddd;border-radius:4px}
</style></head><body>
<h1>${title}</h1>
<div class="sub">${new Date().toLocaleDateString(L==='en'?'en-US':L==='es'?'es-ES':'fr-FR')} — ${moments} ${tx('tut_pdf_moments')||'moment(s)'} — ${staves.length} ${tx('tut_pdf_staves')||'portée(s)'}</div>
<img src="${imgData}" alt="score"/>
</body></html>`;

  const w = window.open('', '_blank');
  if(!w){ alert(tx('vts_pdf_popup_blocked')||'Popup bloqué.'); return; }
  w.document.write(html);
  w.document.close();
  setTimeout(()=>{ try{ w.print(); }catch(e){} }, 400);
}

/* ═══════════════════════════════════════════════════════════════════
   TUT_exportReduction — PDF Réduction (grand portée sol+fa)
   Notes colorées par famille : bleu=cordes, jaune=vents, rouge=cuivres, noir=perc
   Acronymes avec flèches, 8va/8vb pour piccolo/contrebasse
   ═══════════════════════════════════════════════════════════════════ */
function TUT_exportReduction(){
  const L = (typeof currentLang!=='undefined') ? currentLang : 'fr';
  const tx2 = (o) => typeof o==='object' ? (o[L]||o.fr) : o;
  const moments = TUT_momentCount();
  if(!moments){
    alert(tx2({fr:"Ajoutez des accords avant d'exporter.",en:'Add chords before exporting.',es:'Añade acordes antes de exportar.'}));
    return;
  }

  const staves = TUT_buildStaves();
  const useFlats = TUT_keyInfo.sharps < 0;

  // ─── Couleurs PAR FAMILLE (palette riche, chaque section distincte) ───
  // Les bassons reçoivent un brun-ambré pour ne PAS être confondus avec le rouge des trompettes.
  const FAM_COLOR = {
    // Bois
    flutes:    '#4F46E5',  // indigo
    oboes:     '#059669',  // émeraude
    clarinets: '#D97706',  // orange
    bassoons:  '#92400E',  // brun ambré (distinct du rouge)
    // Cuivres
    cors:      '#7C3AED',  // violet
    trp:       '#DC2626',  // rouge
    trombones: '#0369A1',  // bleu acier
    tuba:      '#44403C',  // gris foncé chaud
    // Cordes (sera surchargé par couleur du pupitre si disponible)
    strings:   '#1D6FC4',
    // Percussions
    perc:      '#4B5563'   // gris ardoise
  };
  function familyColor(s){
    // Si le staff a déjà une couleur d'instrument définie, on la respecte
    // SAUF pour bassons (clash avec rouge cuivres) → on force le brun ambré
    if(s.family === 'bassoons') return FAM_COLOR.bassoons;
    if(s.color && /^#[0-9A-Fa-f]{6}$/.test(s.color)) return s.color;
    if(s.family && FAM_COLOR[s.family]) return FAM_COLOR[s.family];
    if(s.section==='STR')  return FAM_COLOR.strings;
    if(s.section==='VTS')  return FAM_COLOR.clarinets;
    if(s.section==='BRS')  return FAM_COLOR.trp;
    if(s.section==='PERC') return FAM_COLOR.perc;
    return '#555';
  }

  // 8va/8vb instruments (piccolo sonne 8ve aigu, contrebasse 8ve grave)
  const OCTAVE_UP_INSTS   = ['PICC','PICC_DES'];   // sons 8ve plus haut qu'écrit → afficher 8vb (sonore = écrit-12)
  const OCTAVE_DOWN_INSTS = ['CB'];                  // sons 8ve plus bas qu'écrit → afficher 8va

  // Canvas dimensions — plus haute pour loger les labels sans chevauchement
  const W = 3300, H = 2550;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);

  const pLM = 220, pRM = 160, pLS = 56;
  const pTT = 220;
  const pBT = pTT + 5*pLS + 160;

  // Helper: note name from midi
  const NOTE_NAMES_S = ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
  const NOTE_NAMES_F = ['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'];
  function midiToName(midi){
    const oct = Math.floor(midi/12)-1;
    const pc = midi%12;
    return (useFlats ? NOTE_NAMES_F : NOTE_NAMES_S)[pc] + oct;
  }

  // DIA array for staff position
  const DIA = [0,0,1,1,2,3,3,4,4,5,5,6];

  function staffY(midi){
    // Returns {y, staff:'treble'|'bass', display8va, display8vb}
    let displayMidi = midi;
    let display8va = false, display8vb = false;
    // For reduction: piccolo sounds 8ve up → draw at concert pitch, mark 8vb above
    // Contrebasse sounds 8ve down → draw at concert pitch, mark 8va below
    // We assume midi is already sounding pitch (TUT_buildStaves returns sounding)
    const oct = Math.floor(displayMidi/12)-1;
    const pc  = displayMidi%12;
    const dp  = oct*7 + DIA[pc];
    // Assign to treble or bass staff
    if(displayMidi >= 57) {
      return { y: pTT + 2*pLS - (dp-34)*(pLS/2), staff:'treble', display8va, display8vb };
    } else {
      return { y: pBT + 2*pLS - (dp-22)*(pLS/2), staff:'bass', display8va, display8vb };
    }
  }

  // Draw grand staff
  ctx.strokeStyle = '#000'; ctx.lineWidth = 2.5;
  for(let s=0; s<2; s++){
    const top = s===0 ? pTT : pBT;
    for(let l=0; l<5; l++){
      const y = top + l*pLS;
      ctx.beginPath(); ctx.moveTo(pLM, y); ctx.lineTo(W-pRM, y); ctx.stroke();
    }
  }
  // Left barline spanning both staves
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(pLM, pTT); ctx.lineTo(pLM, pBT+4*pLS); ctx.stroke();

  // Brace
  {
    const bT=pTT, bB=pBT+4*pLS;
    const braceH=bB-bT, brSy=braceH/997, brSx=brSy*0.85, bX=pLM-8;
    ctx.save(); ctx.fillStyle='#000';
    ctx.translate(bX-82*brSx, bB); ctx.scale(brSx, -brSy);
    ctx.fill(new Path2D("M20 498Q43 514 62 557Q81 600 82 646Q82 650 82 654Q82 658 81 662Q74 709 60 768Q46 826 44 869Q45 909 56 941Q67 972 72 980Q74 984 76 986Q77 988 77 990Q77 992 75 995Q73 997 71 997Q70 997 68 995Q66 994 63 990Q23 943 11 870Q0 798 2 737Q3 689 12 639Q22 589 22 548Q22 537 21 527Q20 516 18 506Q17 501 15 499Q14 498 11 498Q7 498 5 495Q2 493 2 490Q2 491 5 487Q7 484 11 483Q14 483 15 482Q17 480 18 476Q20 466 21 453Q22 440 22 431Q22 391 12 342Q3 293 2 244Q0 183 11 111Q23 39 63 -9Q66 -13 68 -14Q70 -16 71 -16Q73 -16 75 -14Q77 -11 77 -9Q77 -7 76 -5Q74 -3 72 1Q67 9 56 40Q45 72 44 112Q46 155 60 213Q74 272 81 319Q82 323 82 327Q82 331 82 335Q81 381 62 424Q43 467 20 483Q18 486 18 491Q18 496 20 498Z"));
    ctx.restore();
  }

  // Clefs
  ctx.fillStyle='#000'; ctx.textAlign='left'; ctx.textBaseline='alphabetic';
  const tFS = pLS * 5.6;
  ctx.font = tFS+'px "Times New Roman",Georgia,serif';
  const tM = ctx.measureText('\uD834\uDD1E');
  const tH = (tM.actualBoundingBoxAscent||tFS*0.75)+(tM.actualBoundingBoxDescent||tFS*0.25);
  ctx.fillText('\uD834\uDD1E', pLM+8, (pTT+3*pLS)+tH*0.38-(tM.actualBoundingBoxDescent||tFS*0.25));
  const bFS = tFS*0.75;
  ctx.font = bFS+'px "Times New Roman",Georgia,serif';
  const bM = ctx.measureText('\uD834\uDD22');
  ctx.fillText('\uD834\uDD22', pLM+10, (pBT+pLS)-0+(bM.actualBoundingBoxAscent||bFS*0.8));

  // Key signature
  const ksN = TUT_keyInfo.sharps || 0;
  const shTP=[0,1.5,-0.5,1,2.5,0.5,2], shBP=[1,2.5,0.5,2,3.5,1.5,3];
  const flTP=[2,0.5,2.5,1,3,1.5,3.5], flBP=[3,1.5,3.5,2,4,2.5,4.5];
  let pKsX = pLM + ctx.measureText('\uD834\uDD22').width + 36;
  if(ksN>0){
    ctx.font=(pLS*1.8)+'px "Times New Roman",Georgia,serif'; ctx.textBaseline='middle';
    for(let i=0;i<ksN&&i<7;i++){
      ctx.fillText('\u266F', pKsX+i*28, pTT+shTP[i]*pLS);
      ctx.fillText('\u266F', pKsX+i*28, pBT+shBP[i]*pLS);
    }
    pKsX += ksN*28+16;
  } else if(ksN<0){
    const cnt=-ksN;
    ctx.font=(pLS*2)+'px "Times New Roman",Georgia,serif'; ctx.textBaseline='middle';
    for(let i=0;i<cnt&&i<7;i++){
      ctx.fillText('\u266D', pKsX+i*28, pTT+flTP[i]*pLS);
      ctx.fillText('\u266D', pKsX+i*28, pBT+flBP[i]*pLS);
    }
    pKsX += cnt*28+16;
  }

  const noteStart = pKsX + 60;
  const chW = Math.min(340, (W - noteStart - pRM - 80) / moments);
  const pNS = 20; // noteHead radius

  // For each moment, collect all sounding notes grouped by family, draw and annotate
  for(let ci=0; ci<moments; ci++){
    const x = noteStart + ci*chW + chW/2;

    // Collect notes from all staves
    const notesAtMoment = []; // {midi, label, color, section, instId}
    staves.forEach(s=>{
      const midi = s.getMidi(ci, 0);
      if(midi == null) return;
      const col = familyColor(s);
      notesAtMoment.push({ midi, label: s.label, color: col, section: s.section, family: s.family, instId: s.slots[0]?.instId });
    });

    // ── 1. Calcul Y + collision notes (N notes côte à côte, décalage cumulatif) ──
    const noteStep = (pNS + 5) * 2;
    const allNotes = notesAtMoment.map(n => {
      const {y, staff} = staffY(n.midi);
      return { ...n, y, staff, xOff: 0 };
    });
    const notesSorted = [...allNotes].sort((a,b) => a.y - b.y);
    for(let i = 1; i < notesSorted.length; i++){
      if(Math.abs(notesSorted[i].y - notesSorted[i-1].y) < pLS * 0.85){
        let maxOff = notesSorted[i-1].xOff;
        for(let j = i-2; j >= 0; j--){
          if(Math.abs(notesSorted[i].y - notesSorted[j].y) < pLS * 0.85)
            maxOff = Math.max(maxOff, notesSorted[j].xOff);
          else break;
        }
        notesSorted[i].xOff = maxOff + noteStep;
      }
    }
    notesSorted.forEach(ns => {
      const orig = allNotes.find(a => a.midi === ns.midi && a.label === ns.label);
      if(orig) orig.xOff = ns.xOff;
    });

    // ── 2. Lignes supplémentaires + têtes de notes ──
    allNotes.forEach(n => {
      const nx  = x + n.xOff;
      const top = n.staff === 'treble' ? pTT : pBT;
      const bot = top + 4 * pLS;
      ctx.strokeStyle = '#000'; ctx.lineWidth = 2.5;
      if(n.y < top) for(let ly = top-pLS; ly >= n.y-2; ly -= pLS){
        ctx.beginPath(); ctx.moveTo(nx-34,ly); ctx.lineTo(nx+34,ly); ctx.stroke();
      }
      if(n.y > bot) for(let ly = bot+pLS; ly <= n.y+2; ly += pLS){
        ctx.beginPath(); ctx.moveTo(nx-34,ly); ctx.lineTo(nx+34,ly); ctx.stroke();
      }
      if(n.staff === 'treble'){
        const c4y = pTT + 2*pLS - ((4*7+DIA[0]) - 34)*(pLS/2);
        if(n.midi <= 60 && c4y >= bot+pLS*0.8){
          ctx.beginPath(); ctx.moveTo(nx-34,c4y); ctx.lineTo(nx+34,c4y); ctx.stroke();
        }
      }
      ctx.save(); ctx.translate(nx, n.y); ctx.rotate(-0.18);
      ctx.beginPath(); ctx.ellipse(0, 0, pNS+4, pNS-3, 0, 0, Math.PI*2);
      ctx.fillStyle = n.color; ctx.fill();
      ctx.restore();
    });

    // ── 3. Labels + flèches : anti-overlap garanti (zéro chevauchement) ──
    if(allNotes.length){
      const labelFontSz = 30;
      // Gap minimum entre labels = hauteur de police × 1.55 (générous pour ascendants/descendants)
      const minLabelGap = Math.ceil(labelFontSz * 1.55);
      const maxXOff = Math.max(...allNotes.map(n => n.xOff));
      const labelX  = x + maxXOff + pNS + 32;

      ctx.font = `bold ${labelFontSz}px "DM Sans",sans-serif`;
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';

      // Trier du plus aigu (y petit) au plus grave (y grand)
      const labelItems = [...allNotes]
        .sort((a,b) => a.y - b.y)
        .map(n => ({ ...n, labelY: n.y }));

      // ── Distribution par "stack" : empilement strict avec gap garanti ──
      // Étape 1 : forcer un espacement minimum entre voisins consécutifs (passe descendante)
      for(let i = 1; i < labelItems.length; i++){
        const prev = labelItems[i-1].labelY;
        if(labelItems[i].labelY < prev + minLabelGap){
          labelItems[i].labelY = prev + minLabelGap;
        }
      }
      // Étape 2 : centrer le stack autour de la médiane des notes (passe remontante symétrique)
      // Si le stack dépasse vers le bas, on remonte l'ensemble pour rester centré
      const noteYs = labelItems.map(n => n.y);
      const noteCenter = (Math.min(...noteYs) + Math.max(...noteYs)) / 2;
      const stackCenter = (labelItems[0].labelY + labelItems[labelItems.length-1].labelY) / 2;
      const shift = noteCenter - stackCenter;
      if(Math.abs(shift) > 1){
        labelItems.forEach(n => { n.labelY += shift; });
      }
      // Étape 3 : re-vérifier le gap après le shift (sécurité)
      for(let i = 1; i < labelItems.length; i++){
        const prev = labelItems[i-1].labelY;
        if(labelItems[i].labelY < prev + minLabelGap){
          labelItems[i].labelY = prev + minLabelGap;
        }
      }
      // Étape 4 : si le stack sort par le haut, le redescendre sans casser l'écartement
      const topLimit = pTT - pLS * 3;   // marge raisonnable au-dessus de la portée
      if(labelItems[0].labelY < topLimit){
        const dy = topLimit - labelItems[0].labelY;
        labelItems.forEach(n => { n.labelY += dy; });
      }

      // Dessin flèches coudées + labels (les positions sont maintenant garanties non-chevauchantes)
      labelItems.forEach(n => {
        const anchorX = x + n.xOff + pNS + 5;
        const elbowX  = labelX - 22;
        const ly      = n.labelY;

        ctx.strokeStyle = n.color; ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(anchorX, n.y);
        ctx.lineTo(elbowX,  n.y);
        ctx.lineTo(elbowX,  ly);
        ctx.lineTo(labelX - 6, ly);
        ctx.stroke();

        // Pointe de flèche
        ctx.beginPath();
        ctx.moveTo(labelX - 6, ly);
        ctx.lineTo(labelX - 18, ly - 8);
        ctx.lineTo(labelX - 18, ly + 8);
        ctx.closePath();
        ctx.fillStyle = n.color; ctx.fill();

        // Texte
        ctx.font = `bold ${labelFontSz}px "DM Sans",sans-serif`;
        ctx.fillStyle = n.color;
        ctx.fillText(n.label, labelX, ly);

        // 8vb / 8va
        const instId = n.instId || '';
        if(OCTAVE_UP_INSTS.includes(instId)){
          ctx.font = `italic ${labelFontSz-7}px "Times New Roman",Georgia,serif`;
          ctx.fillText('8vb', labelX + ctx.measureText(n.label).width + 8, ly);
        } else if(OCTAVE_DOWN_INSTS.includes(instId)){
          ctx.font = `italic ${labelFontSz-7}px "Times New Roman",Georgia,serif`;
          ctx.fillText('8va', labelX + ctx.measureText(n.label).width + 8, ly);
        }
      });
    }

    // Barlines between moments
    if(ci < moments-1){
      ctx.strokeStyle='#000'; ctx.lineWidth=2;
      const bx = x + chW/2;
      ctx.beginPath(); ctx.moveTo(bx, pTT); ctx.lineTo(bx, pTT+4*pLS); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(bx, pBT); ctx.lineTo(bx, pBT+4*pLS); ctx.stroke();
    }
  }

  // Final double barline
  if(moments){
    const lx = noteStart + (moments-1)*chW + chW;
    ctx.strokeStyle='#000'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(lx, pTT); ctx.lineTo(lx, pTT+4*pLS); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(lx, pBT); ctx.lineTo(lx, pBT+4*pLS); ctx.stroke();
    ctx.lineWidth=7;
    ctx.beginPath(); ctx.moveTo(lx+8, pTT); ctx.lineTo(lx+8, pTT+4*pLS); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(lx+8, pBT); ctx.lineTo(lx+8, pBT+4*pLS); ctx.stroke();
  }

  const pngData = c.toDataURL('image/png');

  // ─── Légende colorée : seulement les familles RÉELLEMENT présentes dans cette réduction ───
  // On collecte les familles uniques des portées actives
  const presentFamilies = new Set();
  staves.forEach(s => {
    if(s.family) presentFamilies.add(s.family);
    else if(s.section) presentFamilies.add(s.section.toLowerCase());
  });

  const ALL_LEGEND = [
    {fam:'flutes',    color: FAM_COLOR.flutes,    label:{fr:'Flûtes',        en:'Flutes',           es:'Flautas'}},
    {fam:'oboes',     color: FAM_COLOR.oboes,     label:{fr:'Hautbois',      en:'Oboes',            es:'Oboes'}},
    {fam:'clarinets', color: FAM_COLOR.clarinets, label:{fr:'Clarinettes',   en:'Clarinets',        es:'Clarinetes'}},
    {fam:'bassoons',  color: FAM_COLOR.bassoons,  label:{fr:'Bassons',       en:'Bassoons',         es:'Fagotes'}},
    {fam:'cors',      color: FAM_COLOR.cors,      label:{fr:'Cors',          en:'Horns',            es:'Trompas'}},
    {fam:'trp',       color: FAM_COLOR.trp,       label:{fr:'Trompettes',    en:'Trumpets',         es:'Trompetas'}},
    {fam:'trombones', color: FAM_COLOR.trombones, label:{fr:'Trombones',     en:'Trombones',        es:'Trombones'}},
    {fam:'tuba',      color: FAM_COLOR.tuba,      label:{fr:'Tuba',          en:'Tuba',             es:'Tuba'}},
    {fam:'strings',   color: FAM_COLOR.strings,   label:{fr:'Cordes',        en:'Strings',          es:'Cuerdas'}},
    {fam:'perc',      color: FAM_COLOR.perc,      label:{fr:'Percussions',   en:'Percussion',       es:'Percusión'}}
  ];

  // Si la section STR est présente, ajoute "strings" à la liste de familles affichées
  if(staves.some(s => s.section==='STR')) presentFamilies.add('strings');
  if(staves.some(s => s.section==='PERC')) presentFamilies.add('perc');

  const legendItems = ALL_LEGEND.filter(it => presentFamilies.has(it.fam));
  // Fallback : si rien ne matche (sécurité), affiche les 4 sections génériques
  if(!legendItems.length){
    legendItems.push(
      {color: FAM_COLOR.strings,   label: tx2({fr:'Cordes',      en:'Strings',     es:'Cuerdas'})},
      {color: FAM_COLOR.clarinets, label: tx2({fr:'Bois',        en:'Woodwinds',   es:'Maderas'})},
      {color: FAM_COLOR.trp,       label: tx2({fr:'Cuivres',     en:'Brass',       es:'Metales'})},
      {color: FAM_COLOR.perc,      label: tx2({fr:'Percussions', en:'Percussion',  es:'Percusión'})}
    );
  }
  const legendHtml = legendItems.map(li=>{
    const lab = (typeof li.label === 'object') ? tx2(li.label) : li.label;
    return `<span style="display:inline-flex;align-items:center;gap:6px;margin:0 14px 4px 0">
      <span style="width:11px;height:11px;border-radius:50%;background:${li.color};display:inline-block;border:1px solid rgba(0,0,0,0.1)"></span>
      <span style="color:${li.color};font-weight:600">${lab}</span>
    </span>`;
  }).join('');

  const titleStr = tx2({fr:'PDF Réduction — Tutti orchestral',en:'Reduction Score — Orchestral Tutti',es:'Reducción — Tutti orquestal'});

  const w = window.open('', '_blank');
  if(!w){ alert(tx2({fr:'Popup bloqué.',en:'Popup blocked.',es:'Popup bloqueado.'})); return; }
  w.document.write(`<!DOCTYPE html><html lang="${L}"><head><meta charset="utf-8"><title>${titleStr}</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<style>
@page{size:letter landscape;margin:0.5in 0.6in}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'DM Sans',sans-serif;color:#111827}
h1{font-size:18px;font-weight:700;color:#534AB7;margin-bottom:3px}
.sub{font-size:11px;color:#6b7280;margin-bottom:10px}
.staff-container img{width:100%;height:auto;display:block}
.legend{display:flex;flex-wrap:wrap;margin-top:10px;font-size:11px}
.conv{font-size:9.5px;color:#9ca3af;margin-top:6px;line-height:1.6}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<h1>${titleStr}</h1>
<div class="sub">${new Date().toLocaleDateString(L==='en'?'en-US':L==='es'?'es-ES':'fr-FR')} — ${moments} ${tx2({fr:'moment(s)',en:'moment(s)',es:'momento(s)'})}</div>
<div class="staff-container"><img src="${pngData}" alt="${titleStr}"></div>
<div class="legend">${legendHtml}</div>
<div class="conv">${tx2({
  fr:'Convention : les notes sonnent comme écrites sauf <em>8vb</em> (piccolo : sonnent 1 octave plus bas) et <em>8va</em> (contrebasse : sonne 1 octave plus bas).',
  en:'Convention: notes sound as written except <em>8vb</em> (piccolo: sounds 1 octave lower) and <em>8va</em> (contrabass: sounds 1 octave lower).',
  es:'Convención: las notas suenan como están escritas excepto <em>8vb</em> (flautín: suena 1 octava abajo) y <em>8va</em> (contrabajo: suena 1 octava abajo).'
})}</div>
</body></html>`);
  w.document.close();
  setTimeout(()=>{ try{ w.print(); }catch(e){} }, 500);
}
window.TUT_exportReduction = TUT_exportReduction;

/* ═══ INIT + ÉCOUTE ÉVÉNEMENTS ═══════════════════════════════════ */
function TUT_init(){
  if(!TUT_initialized){
    TUT_buildKeySelector();
    TUT_inheritKey();
    TUT_PERC_buildPanel();
    TUT_setupCanvasEvents();
    // Écouter les changements de chords dans les autres modules
    window.addEventListener('contrepoint:chordschange', ()=>{
      if(window.AH_currentMode==='TUTTI'){ TUT_PERC_syncLength(); TUT_render(); }
    });
    // Re-render quand la langue change
    window.addEventListener('contrepoint:langchange', ()=>{
      if(window.AH_currentMode==='TUTTI'){
        TUT_buildKeySelector();
        TUT_PERC_buildPanel();
        TUT_render();
      }
    });
    TUT_initialized = true;
  } else {
    TUT_buildKeySelector();
    TUT_inheritKey();
    TUT_PERC_buildPanel();
  }
  TUT_render();
}

/* ═══ EXPORTS GLOBAUX ═══════════════════════════════════════════ */
window.TUT_init         = TUT_init;
window.TUT_render       = TUT_render;
window.TUT_updateKey    = TUT_updateKey;
window.TUT_playSelected = TUT_playSelected;
window.TUT_playAll      = TUT_playAll;
window.TUT_exportPDF    = TUT_exportPDF;
window.TUT_exportReduction = TUT_exportReduction;

/* ═══ INIT ═══ */

try{ AH_buildKeySelector();AH_buildChordTypeSelector();AH_updateInversionOptions();AH_buildInputs();AH_calcLayout();AH_analyze();AH_render();AH_setupCanvasEvents();window.addEventListener('resize',AH_render); }catch(e){console.error('AH:',e)}

/* ═══ Init mode selector (Chat 1 — multi-section architecture) ═══ */
try{ AH_setMode(window.AH_currentMode || 'SATB'); } catch(e){ console.error('AH mode init:', e); }


/* ═══ Apply detected language (always — ensures lang selector + html lang + storage are coherent) ═══ */
try{ setLang(currentLang); } catch(e){}

/* ═══ SELF-REPAIR: ensure active panel is visible ═══ */
(function(){
  // Run immediately and also after a delay
  function repair(){
    var panels = document.querySelectorAll('.pc-panel');
    if(!panels.length) return;
    var anyVisible = false;
    panels.forEach(function(p){
      if(p.classList.contains('active')){
        // Force display
        p.style.display = 'block';
        anyVisible = true;
      } else {
        p.style.display = 'none';
      }
    });
    if(!anyVisible && panels[0]){
      panels[0].classList.add('active');
      panels[0].style.display = 'block';
    }
  }
  repair();
  setTimeout(repair, 100);
  setTimeout(repair, 500);
  setTimeout(repair, 1500);
})();

