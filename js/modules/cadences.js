/* ═══ cadences.js — Module Cadences ═══ */
/* ═══════════════════════════════
   CADENCES MODULE
   ═══════════════════════════════ */
(function(){
/* ═══ Data ═══ */
const CAD_NOTE_S = ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
const CAD_NOTE_F = ['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'];

const CAD_KEY_PAIRS = [
  {maj:'C',min:'A'},{maj:'G',min:'E'},{maj:'D',min:'B'},{maj:'A',min:'F♯'},
  {maj:'E',min:'C♯'},{maj:'B',min:'G♯'},{maj:'F♯',min:'D♯'},
  {maj:'G♭',min:'E♭'},{maj:'D♭',min:'B♭'},{maj:'A♭',min:'F'},
  {maj:'E♭',min:'C'},{maj:'B♭',min:'G'},{maj:'F',min:'D'}
];

const CAD_KS_MAJ = {'C':0,'G':1,'D':2,'A':3,'E':4,'B':5,'F♯':6,'G♭':-6,'D♭':-5,'A♭':-4,'E♭':-3,'B♭':-2,'F':-1};
const CAD_KS_MIN = {'A':0,'E':1,'B':2,'F♯':3,'C♯':4,'G♯':5,'D♯':6,'E♭':-6,'B♭':-5,'F':-4,'C':-3,'G':-2,'D':-1};

/* ═══ State ═══ */
const CAD_S = { key:'C', mode:'major', cadId:'pac_A', pm:'chord' };

function CAD_useFlats(k){ return ['F','B♭','E♭','A♭','D♭','G♭','D','G','C','F','B♭','E♭'].includes(k); }
function CAD_pcToName(pc,key){ return (CAD_useFlats(key)?CAD_NOTE_F:CAD_NOTE_S)[((pc%12)+12)%12]; }

function CAD_getScale(key, mode){
  const roots = {'C':0,'C♯':1,'D♭':1,'D':2,'D♯':3,'E♭':3,'E':4,'F':5,'F♯':6,'G♭':6,'G':7,'G♯':8,'A♭':8,'A':9,'A♯':10,'B♭':10,'B':11};
  const r = roots[key] || 0;
  const pattern = mode === 'major' ? [0,2,4,5,7,9,11] : [0,2,3,5,7,8,11];
  return pattern.map(p => (r + p) % 12);
}

function CAD_place(pc, targetOct, lo, hi){
  let midi = pc + (targetOct + 1) * 12;
  while(midi < lo) midi += 12;
  while(midi > hi) midi -= 12;
  return midi;
}

// Voice ranges: Bass C2(36)-E4(64), Tenor C3(48)-A4(69), Alto F3(53)-E5(76), Soprano C4(60)-A5(81)
function CAD_chord(sc, degs, octHints){
  const ranges = [[36,64],[48,69],[53,76],[60,81]];
  const pcs = degs.map(d => sc[d - 1]);
  return CAD_voicePlace(pcs, octHints, ranges);
}
function CAD_chordPC(pcs, octHints){
  const ranges = [[36,64],[48,69],[53,76],[60,81]];
  return CAD_voicePlace(pcs, octHints, ranges);
}

function CAD_voicePlace(pcs, octHints, ranges){
  function attempt(midi0Override){
    const midi = [];
    for(let i = 0; i < 4; i++){
      const pc = pcs[i];
      const lo = Math.max(ranges[i][0], i > 0 ? midi[i-1] : 0);
      const hi = ranges[i][1];
      let m = (i === 1 && midi0Override !== undefined) ? midi0Override : pc + (octHints[i] + 1) * 12;
      if(i === 1 && midi0Override !== undefined){ /* set */ }
      else { while(m < lo) m += 12; while(m > hi) m -= 12; if(m < lo) m += 12; }
      midi.push(m);
    }
    return midi;
  }
  let midi = attempt();
  const altoOK = midi[2] >= midi[1] && midi[2] <= ranges[2][1];
  const sopOK = midi[3] >= midi[2] && midi[3] <= ranges[3][1];
  if(!altoOK || !sopOK){
    const lowerTenor = midi[1] - 12;
    if(lowerTenor >= midi[0] && lowerTenor >= ranges[1][0]){
      midi = attempt(lowerTenor);
    }
  }
  if(midi[3] > ranges[3][1] || midi[3] < midi[2]){
    for(let v = 2; v >= 1; v--){
      const lower = midi[v] - 12;
      if(lower >= midi[v-1] && lower >= ranges[v][0]){
        midi[v] = lower;
        for(let j = v+1; j < 4; j++){
          const pc2 = pcs[j];
          const lo2 = Math.max(ranges[j][0], midi[j-1]);
          let m2 = pc2 + (octHints[j] + 1) * 12;
          while(m2 < lo2) m2 += 12;
          while(m2 > ranges[j][1]) m2 -= 12;
          if(m2 < lo2) m2 += 12;
          midi[j] = m2;
        }
        if(midi[3] <= ranges[3][1]) break;
      }
    }
  }
  return midi;
}

const CAD_DB = [
  // ── Cadences authentiques parfaites (PAC) ──
  { id:'pac_A', cat:'auth',
    name:{fr:'PAC — 2̂–1̂ au soprano',en:'PAC — 2̂–1̂ in soprano',es:'CAP — 2̂–1̂ en el soprano'},
    desc:{fr:'V → I : soprano 2̂→1̂, basse 5̂→1̂. Résolution par mouvement conjoint.',en:'V → I: soprano 2̂→1̂, bass 5̂→1̂. Resolution by step in soprano.',es:'V → I: soprano 2̂→1̂, bajo 5̂→1̂. Resolución por movimiento conjunto.'},
    build(sc){
      return [
        { roman:'V', midi: CAD_chord(sc, [5,7,5,2], [3,3,4,5]) },
        { roman:'I', midi: CAD_chord(sc, [1,5,3,1], [3,4,4,5]) }
      ];
    }
  },
  { id:'pac_B', cat:'auth',
    name:{fr:'PAC — 7̂–1̂ au soprano',en:'PAC — 7̂–1̂ in soprano',es:'CAP — 7̂–1̂ en el soprano'},
    desc:{fr:'V → I : soprano 7̂→1̂, basse 5̂→1̂. La sensible monte à la tonique.',en:'V → I: soprano 7̂→1̂, bass 5̂→1̂. Leading tone rises to tonic.',es:'V → I: soprano 7̂→1̂, bajo 5̂→1̂. La sensible asciende a la tónica.'},
    build(sc){
      return [
        { roman:'V', midi: CAD_chord(sc, [5,2,5,7], [3,4,4,4]) },
        { roman:'I', midi: CAD_chord(sc, [1,3,5,1], [3,4,4,5]) }
      ];
    }
  },
  { id:'pac7', cat:'auth',
    name:{fr:'PAC — V⁷ → I',en:'PAC — V⁷ → I',es:'CAP — V⁷ → I'},
    desc:{fr:'V⁷ → I : la septième (4̂) descend à 3̂, renforçant la résolution.',en:'V⁷ → I: the seventh (4̂) descends to 3̂, strengthening resolution.',es:'V⁷ → I: la séptima (4̂) desciende a 3̂, reforzando la resolución.'},
    build(sc){
      return [
        { roman:'V⁷', midi: CAD_chord(sc, [5,7,2,4], [3,3,4,4]) },
        { roman:'I', midi: CAD_chord(sc, [1,5,1,3], [3,3,4,5]) }
      ];
    }
  },

  // ── Cadences authentiques imparfaites (IAC) ──
  { id:'iac_C', cat:'auth',
    name:{fr:'IAC — 5̂–5̂ au soprano',en:'IAC — 5̂–5̂ in soprano',es:'CAI — 5̂–5̂ en el soprano'},
    desc:{fr:'V → I : soprano reste sur 5̂. Moins conclusif.',en:'V → I: soprano stays on 5̂. Less conclusive.',es:'V → I: el soprano permanece en 5̂. Menos conclusiva.'},
    build(sc){
      return [
        { roman:'V', midi: CAD_chord(sc, [5,7,2,5], [3,3,4,4]) },
        { roman:'I', midi: CAD_chord(sc, [1,3,1,5], [3,3,4,4]) }
      ];
    }
  },
  { id:'iac_D', cat:'auth',
    name:{fr:'IAC — 2̂–3̂ au soprano',en:'IAC — 2̂–3̂ in soprano',es:'CAI — 2̂–3̂ en el soprano'},
    desc:{fr:'V → I : soprano 2̂→3̂. La tierce au soprano affaiblit la conclusion.',en:'V → I: soprano 2̂→3̂. Third in soprano weakens the conclusion.',es:'V → I: soprano 2̂→3̂. La tercera en el soprano debilita la conclusión.'},
    build(sc){
      return [
        { roman:'V', midi: CAD_chord(sc, [5,7,5,2], [3,3,4,5]) },
        { roman:'I', midi: CAD_chord(sc, [1,5,1,3], [3,4,4,5]) }
      ];
    }
  },
  { id:'iac_E', cat:'auth',
    name:{fr:'IAC contrapuntique — 7̂–1̂ à la basse',en:'Contrapuntal IAC — 7̂–1̂ in bass',es:'CAI contrapuntística — 7̂–1̂ en el bajo'},
    desc:{fr:'V⁶ → I : la sensible à la basse (7̂→1̂), soprano 2̂→1̂.',en:'V⁶ → I: leading tone in bass (7̂→1̂), soprano 2̂→1̂.',es:'V⁶ → I: la sensible en el bajo (7̂→1̂), soprano 2̂→1̂.'},
    build(sc){
      return [
        { roman:'V⁶', midi: CAD_chord(sc, [7,2,5,2], [3,4,4,5]) },
        { roman:'I', midi: CAD_chord(sc, [1,3,5,1], [4,4,4,5]) }
      ];
    }
  },
  { id:'iac_F', cat:'auth',
    name:{fr:'IAC contrapuntique — 2̂–1̂ à la basse',en:'Contrapuntal IAC — 2̂–1̂ in bass',es:'CAI contrapuntística — 2̂–1̂ en el bajo'},
    desc:{fr:'vii°⁶ → I : basse 2̂→1̂, soprano 7̂→1̂. Voix extérieures convergent.',en:'vii°⁶ → I: bass 2̂→1̂, soprano 7̂→1̂. Outer voices converge.',es:'vii°⁶ → I: bajo 2̂→1̂, soprano 7̂→1̂. Las voces extremas convergen.'},
    build(sc){
      return [
        { roman:'vii°⁶', midi: CAD_chord(sc, [2,7,4,7], [3,3,4,4]) },
        { roman:'I', midi: CAD_chord(sc, [1,3,5,1], [3,4,4,5]) }
      ];
    }
  },

  // ── Demi-cadences (HC) ──
  { id:'hc_G', cat:'half',
    name:{fr:'HC — I → V, soprano 3̂–2̂',en:'HC — I → V, soprano 3̂–2̂',es:'SC — I → V, soprano 3̂–2̂'},
    desc:{fr:'Repos sur la dominante. Basse 1̂→5̂, soprano 3̂→2̂.',en:'Pauses on the dominant. Bass 1̂→5̂, soprano 3̂→2̂.',es:'Reposo sobre la dominante. Bajo 1̂→5̂, soprano 3̂→2̂.'},
    build(sc){
      return [
        { roman:'I', midi: CAD_chord(sc, [1,5,1,3], [3,3,4,5]) },
        { roman:'V', midi: CAD_chord(sc, [5,7,5,2], [3,3,4,5]) }
      ];
    }
  },
  { id:'hc_H', cat:'half',
    name:{fr:'HC — I⁶ → V, soprano 1̂–7̂',en:'HC — I⁶ → V, soprano 1̂–7̂',es:'SC — I⁶ → V, soprano 1̂–7̂'},
    desc:{fr:'Repos sur la dominante depuis I⁶. Basse 3̂→5̂, soprano 1̂→7̂.',en:'Pauses on the dominant from I⁶. Bass 3̂→5̂, soprano 1̂→7̂.',es:'Reposo sobre la dominante desde I⁶. Bajo 3̂→5̂, soprano 1̂→7̂.'},
    build(sc){
      return [
        { roman:'I⁶', midi: CAD_chord(sc, [3,1,5,1], [3,4,4,5]) },
        { roman:'V', midi: CAD_chord(sc, [5,2,5,7], [3,4,4,4]) }
      ];
    }
  },
  { id:'hc_I', cat:'half',
    name:{fr:'HC — I → V, soprano 5̂–5̂',en:'HC — I → V, soprano 5̂–5̂',es:'SC — I → V, soprano 5̂–5̂'},
    desc:{fr:'Repos sur la dominante. Le soprano reste sur 5̂. Basse 1̂→5̂.',en:'Rests on dominant. Soprano stays on 5̂. Bass 1̂→5̂.',es:'Reposo sobre la dominante. El soprano permanece en 5̂. Bajo 1̂→5̂.'},
    build(sc){
      return [
        { roman:'I', midi: CAD_chord(sc, [1,3,1,5], [3,4,4,4]) },
        { roman:'V', midi: CAD_chord(sc, [5,7,2,5], [2,3,4,4]) }
      ];
    }
  },
  { id:'hc2', cat:'half',
    name:{fr:'HC — ii → V',en:'HC — ii → V',es:'SC — ii → V'},
    desc:{fr:'Le ii (ou ii° en mineur) prépare la dominante.',en:'The ii (or ii° in minor) prepares the dominant.',es:'El ii (o ii° en menor) prepara la dominante.'},
    build(sc,key,mode){
      return [
        { roman: mode==='minor'?'ii°':'ii', midi: CAD_chord(sc, [2,4,6,2], [3,4,4,5]) },
        { roman:'V', midi: CAD_chord(sc, [5,7,5,2], [3,3,4,5]) }
      ];
    }
  },
  { id:'hc_iv', cat:'half',
    name:{fr:'HC — IV → V',en:'HC — IV → V',es:'SC — IV → V'},
    desc:{fr:'La sous-dominante mène à la dominante.',en:'The subdominant leads to the dominant.',es:'La subdominante conduce a la dominante.'},
    build(sc){
      return [
        { roman:'IV', midi: CAD_chord(sc, [4,1,4,6], [3,4,4,4]) },
        { roman:'V', midi: CAD_chord(sc, [5,7,2,5], [3,3,4,4]) }
      ];
    }
  },
  { id:'hc_phryg', cat:'half',
    name:{fr:'Demi-cadence phrygienne',en:'Phrygian Half Cadence',es:'Semicadencia frigia'},
    desc:{fr:'iv⁶ → V en mineur : basse ♭6̂ → 5̂ par demi-ton. Style baroque.',en:'iv⁶ → V in minor: bass ♭6̂ → 5̂ by semitone. Baroque style.',es:'iv⁶ → V en menor: bajo ♭6̂ → 5̂ por semitono. Estilo barroco.'},
    forceMode:'minor',
    build(sc){
      return [
        { roman:'iv⁶', midi: CAD_chord(sc, [6,1,4,1], [3,4,4,5]) },
        { roman:'V', midi: CAD_chord(sc, [5,7,5,7], [3,3,4,4]) }
      ];
    }
  },

  // ── En mineur ──
  { id:'pac_J', cat:'auth',
    name:{fr:'PAC en mineur — 7̂–1̂',en:'PAC in minor — 7̂–1̂',es:'CAP en menor — 7̂–1̂'},
    desc:{fr:'V → i : soprano ♯7̂→1̂, basse 5̂→1̂.',en:'V → i: soprano ♯7̂→1̂, bass 5̂→1̂.',es:'V → i: soprano ♯7̂→1̂, bajo 5̂→1̂.'},
    forceMode:'minor',
    build(sc){
      return [
        { roman:'V', midi: CAD_chord(sc, [5,7,2,7], [3,3,4,4]) },
        { roman:'i', midi: CAD_chord(sc, [1,3,5,1], [3,4,4,5]) }
      ];
    }
  },
  { id:'iac_K', cat:'special',
    name:{fr:'Tierce Picarde — 2̂–♯3̂',en:'Picardy Third — 2̂–♯3̂',es:'Tercera de Picardía — 2̂–♯3̂'},
    desc:{fr:'V → I en mineur avec tierce picarde : accord final majeur.',en:'V → I in minor with Picardy third: the final chord is major.',es:'V → I en menor con tercera de Picardía: el acorde final es mayor.'},
    forceMode:'minor',
    build(sc){
      const majorThird = (sc[0]+4)%12;
      return [
        { roman:'V', midi: CAD_chord(sc, [5,7,5,2], [3,3,4,5]) },
        { roman:'I', midi: CAD_chordPC([sc[0], sc[4], sc[0], majorThird], [3,4,4,5]) }
      ];
    }
  },

  // ── Cadences plagales ──
  { id:'plag', cat:'plagal',
    name:{fr:'Cadence plagale IV → I',en:'Plagal Cadence IV → I',es:'Cadencia plagal IV → I'},
    desc:{fr:'Sous-dominante résout sur la tonique. Finale religieuse.',en:'Subdominant resolves to the tonic. Hymn-like ending.',es:'La subdominante resuelve en la tónica. Final con carácter himno.'},
    build(sc){
      return [
        { roman:'IV', midi: CAD_chord(sc, [4,1,4,6], [3,4,4,4]) },
        { roman:'I', midi: CAD_chord(sc, [1,3,1,5], [3,3,4,4]) }
      ];
    }
  },
  { id:'plag_iv', cat:'plagal',
    name:{fr:'Cadence plagale iv → I (mineure)',en:'Plagal Cadence iv → I (minor)',es:'Cadencia plagal iv → I (menor)'},
    desc:{fr:'iv mineur résout sur I majeur. Emprunt au mode mineur.',en:'A minor iv resolves to a major I. Borrowed from the minor mode.',es:'Un iv menor resuelve en un I mayor. Préstamo del modo menor.'},
    build(sc){
      const b6 = (sc[5]-1+12)%12;
      return [
        { roman:'iv', midi: CAD_chordPC([sc[3], sc[0], b6, sc[3]], [3,4,4,5]) },
        { roman:'I', midi: CAD_chord(sc, [1,3,1,5], [3,3,4,4]) }
      ];
    }
  },

  // ── Cadences rompues ──
  { id:'dec_vi', cat:'deceptive',
    name:{fr:'Cadence rompue V⁷ → vi',en:'Deceptive Cadence V⁷ → vi',es:'Cadencia rota V⁷ → vi'},
    desc:{fr:'La résolution sur I est remplacée par vi.',en:'The expected resolution to I is replaced by vi.',es:'La resolución esperada sobre I se sustituye por vi.'},
    build(sc,key,mode){
      const target = mode==='minor' ? 'VI' : 'vi';
      return [
        { roman:'V⁷', midi: CAD_chord(sc, [5,7,2,4], [3,3,4,4]) },
        { roman:target, midi: CAD_chord(sc, [6,1,3,1], [3,4,4,5]) }
      ];
    }
  },
  { id:'dec_IV', cat:'deceptive',
    name:{fr:'Cadence rompue V → IV⁶',en:'Deceptive Cadence V → IV⁶',es:'Cadencia rota V → IV⁶'},
    desc:{fr:'La dominante résout sur IV⁶.',en:'The dominant resolves to IV⁶.',es:'La dominante resuelve en IV⁶.'},
    build(sc){
      return [
        { roman:'V', midi: CAD_chord(sc, [5,7,2,5], [3,3,4,4]) },
        { roman:'IV⁶', midi: CAD_chord(sc, [6,1,4,6], [3,4,4,5]) }
      ];
    }
  },

  // ── Cadences évitées & interrompues ──
  { id:'evit', cat:'avoided',
    name:{fr:'Cadence évitée V⁷ → V⁷/IV',en:'Avoided Cadence V⁷ → V⁷/IV',es:'Cadencia evitada V⁷ → V⁷/IV'},
    desc:{fr:'Tonique devient dominante, septièmes descendant par quintes.',en:'The tonic becomes a dominant, with sevenths descending by fifths.',es:'La tónica se convierte en dominante, con séptimas descendiendo por quintas.'},
    build(sc){
      const b7 = (sc[0]+10)%12;
      return [
        { roman:'V⁷', midi: CAD_chord(sc, [5,7,2,4], [3,3,4,4]) },
        { roman:'V⁷/IV', midi: CAD_chordPC([sc[0], sc[2], sc[4], b7], [3,4,4,4]) }
      ];
    }
  },
  { id:'interr', cat:'avoided',
    name:{fr:'Cadence interrompue V⁷ → V⁷/vi',en:'Interrupted Cadence V⁷ → V⁷/vi',es:'Cadencia interrumpida V⁷ → V⁷/vi'},
    desc:{fr:'Septième dominante suivie d\'une autre une tierce au-dessous.',en:'A dominant seventh is followed by another a third below.',es:'Una séptima de dominante seguida de otra una tercera por debajo.'},
    build(sc){
      const sh5 = (sc[2]+4)%12;
      const m7 = (sc[2]+10)%12;
      return [
        { roman:'V⁷', midi: CAD_chord(sc, [5,7,2,4], [3,3,4,4]) },
        { roman:'V⁷/vi', midi: CAD_chordPC([sc[2], m7, sh5, sc[1]], [3,4,4,5]) }
      ];
    }
  },

  // ── Cadences spéciales ──
  { id:'vii_dim', cat:'special',
    name:{fr:'Cadence par 7e diminuée → I',en:'Diminished 7th → I Cadence',es:'Cadencia por 7ª disminuida → I'},
    desc:{fr:'Résolution de la septième diminuée sur la tonique.',en:'The diminished seventh resolves to the tonic.',es:'La séptima disminuida resuelve en la tónica.'},
    build(sc){
      return [
        { roman:'vii°⁷', midi: CAD_chord(sc, [7,2,4,6], [3,4,4,4]) },
        { roman:'I', midi: CAD_chord(sc, [1,3,5,1], [3,4,4,5]) }
      ];
    }
  }
];

const CAD_CATS = [
  { id:'auth', name:{fr:'Cadences authentiques',en:'Authentic Cadences',es:'Cadencias auténticas'} },
  { id:'half', name:{fr:'Demi-cadences',en:'Half Cadences',es:'Semicadencias'} },
  { id:'plagal', name:{fr:'Cadences plagales',en:'Plagal Cadences',es:'Cadencias plagales'} },
  { id:'deceptive', name:{fr:'Cadences rompues',en:'Deceptive Cadences',es:'Cadencias rotas'} },
  { id:'avoided', name:{fr:'Cadences évitées / interrompues',en:'Avoided / Interrupted Cadences',es:'Cadencias evitadas / interrumpidas'} },
  { id:'special', name:{fr:'Cadences spéciales',en:'Special Cadences',es:'Cadencias especiales'} }
];

function CAD_computeChords(){
  const cad = CAD_DB.find(c => c.id === CAD_S.cadId);
  if(!cad) return [];
  const effMode = cad.forceMode || CAD_S.mode;
  const effKey = cad.forceMode && cad.forceMode !== CAD_S.mode
    ? (cad.forceMode==='minor' ? CAD_KEY_PAIRS.find(p=>p.maj===CAD_S.key)?.min || 'A' : CAD_S.key)
    : CAD_S.key;
  const sc = CAD_getScale(effKey, effMode);
  const chords = cad.build(sc, effKey, effMode);

  if(chords.length === 2){
    const s0 = chords[0].midi[3], s1 = chords[1].midi[3];
    const d0 = CAD_midiToDeg(s0, sc), d1 = CAD_midiToDeg(s1, sc);
    let expectDown = null;
    if(d0 !== d1){
      const diff = d1 - d0;
      if(diff === 1 || diff === -6) expectDown = false;
      else if(diff === -1 || diff === 6) expectDown = true;
      else if(diff > 1) expectDown = false;
      else if(diff < -1) expectDown = true;
    }
    if(expectDown === true && s1 > s0){
      chords[1].midi[3] -= 12;
      if(chords[1].midi[3] < 48) chords[1].midi[3] += 12;
    } else if(expectDown === false && s1 < s0){
      chords[1].midi[3] += 12;
      if(chords[1].midi[3] > 84) chords[1].midi[3] -= 12;
    }
    const b0 = chords[0].midi[0], b1 = chords[1].midi[0];
    const bd0 = CAD_midiToDeg(b0, sc), bd1 = CAD_midiToDeg(b1, sc);
    if(bd0 !== bd1){
      const bdiff = bd1 - bd0;
      let bassDown = null;
      if(bdiff === 1 || bdiff === -6) bassDown = false;
      else if(bdiff === -1 || bdiff === 6) bassDown = true;
      else if(bdiff > 1) bassDown = false;
      else if(bdiff < -1) bassDown = true;
      if(bassDown === true && b1 > b0){
        chords[1].midi[0] -= 12;
        if(chords[1].midi[0] < 36) chords[1].midi[0] += 12;
      } else if(bassDown === false && b1 < b0){
        chords[1].midi[0] += 12;
        if(chords[1].midi[0] > 64) chords[1].midi[0] -= 12;
      }
    }
  }

  chords.forEach(ch => {
    // ══ STRICT RULE: B ≤ T ≤ A ≤ S ══
    const maxes = [64, 69, 76, 84];
    for(let pass = 0; pass < 4; pass++){
      let fixed = true;
      for(let i = 1; i < 4; i++){
        if(ch.midi[i] < ch.midi[i-1]){
          let candidate = ch.midi[i];
          while(candidate < ch.midi[i-1]) candidate += 12;
          if(candidate <= maxes[i]){
            ch.midi[i] = candidate;
          } else {
            let prev = ch.midi[i-1];
            while(prev > ch.midi[i]) prev -= 12;
            if(prev >= (i > 1 ? ch.midi[i-2] : 36)){
              ch.midi[i-1] = prev;
            } else {
              ch.midi[i] = ch.midi[i-1];
            }
          }
          fixed = false;
        }
      }
      if(fixed) break;
    }
    ch.names = ch.midi.map(m => {
      const pc = ((m%12)+12)%12;
      return CAD_pcToName(pc, effKey);
    });
    ch.degBass = CAD_midiToDeg(ch.midi[0], sc);
    ch.degSop = CAD_midiToDeg(ch.midi[3], sc);
  });
  return chords;
}

function CAD_midiToDeg(midi, scale){
  const pc = ((midi % 12) + 12) % 12;
  for(let i = 0; i < 7; i++){
    if(scale[i] === pc) return i + 1;
  }
  for(let i = 0; i < 7; i++){
    if(Math.abs(scale[i] - pc) <= 1 || Math.abs(scale[i] - pc) === 11) return i + 1;
  }
  return 1;
}

/* ── Staff SVG ── */
function CAD_renderStaffSVG(){
  const chords = CAD_computeChords();
  if(!chords.length) return '<div class="staff-empty">'+tx('Sélectionnez une cadence','Select a cadence','Selecciona una cadencia')+'</div>';

  const LS = 11;
  const gapBetweenStaves = 26;
  const tTop = 46;
  const bTop = tTop + 4*LS + gapBetweenStaves;
  const H = bTop + 4*LS + 105;
  const leftMargin = 70;
  const chordSpacing = 80;
  const W = leftMargin + chords.length * chordSpacing + 60;
  const tY = i => tTop + i * LS;
  const bY = i => bTop + i * LS;

  const cad = CAD_DB.find(c=>c.id===CAD_S.cadId)||{};
  const effMode = cad.forceMode || CAD_S.mode;
  const effKey = cad.forceMode && cad.forceMode !== CAD_S.mode
    ? (effMode==='minor' ? CAD_KEY_PAIRS.find(p=>p.maj===CAD_S.key)?.min || 'A' : CAD_S.key)
    : CAD_S.key;
  const ksN = (effMode === 'major' ? CAD_KS_MAJ[effKey] : CAD_KS_MIN[effKey]) || 0;
  const shOrder = [3,0,4,1,5,2,6];
  const flOrder = [6,2,5,1,4,0,3];

  const sharpDiaPC = [0,0,1,1,2,3,3,4,4,5,5,6];
  const flatDiaPC  = [0,1,1,2,2,3,4,4,5,5,6,6];
  const diaMap = ksN > 0 ? sharpDiaPC : flatDiaPC;

  function midiToDia(midi){
    const pc = ((midi%12)+12)%12;
    const oct = Math.floor(midi/12) - 1;
    return oct * 7 + diaMap[pc];
  }
  function midiToTrebleY(midi){
    const d = midiToDia(midi) - midiToDia(60);
    return tY(4) - (d - 2) * (LS/2);
  }
  function midiToBassY(midi){
    const d = midiToDia(midi) - midiToDia(40);
    return bY(4) - (d - 2) * (LS/2);
  }

  const tSharpY = [tY(0), tY(1)+LS/2, tY(0)-LS/2, tY(1), tY(2)+LS/2, tY(1)-LS/2, tY(2)];
  const tFlatY = [tY(2), tY(0)+LS/2, tY(2)+LS/2, tY(1), tY(3)+LS/2, tY(1)+LS/2, tY(3)];
  const bSharpY = tSharpY.map(y => y + (bTop - tTop) + LS);
  const bFlatY = tFlatY.map(y => y + (bTop - tTop) + LS);

  const SC = '#1e1e2e';
  const BBOT = bY(4);
  let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:${W}px;height:${H}px;display:block">`;

  const bT = tY(0), bB = BBOT;
  const braceH = bB - bT;
  const brSy = braceH / 997;
  const brSx = brSy * 0.85;
  const bX = 16;
  svg += `<g transform="translate(${bX - 82*brSx}, ${bB}) scale(${brSx}, ${-brSy})">`;
  svg += `<path d="M20 498Q43 514 62 557Q81 600 82 646Q82 650 82 654Q82 658 81 662Q74 709 60 768Q46 826 44 869Q45 909 56 941Q67 972 72 980Q74 984 76 986Q77 988 77 990Q77 992 75 995Q73 997 71 997Q70 997 68 995Q66 994 63 990Q23 943 11 870Q0 798 2 737Q3 689 12 639Q22 589 22 548Q22 537 21 527Q20 516 18 506Q17 501 15 499Q14 498 11 498Q7 498 5 495Q2 493 2 490Q2 491 5 487Q7 484 11 483Q14 483 15 482Q17 480 18 476Q20 466 21 453Q22 440 22 431Q22 391 12 342Q3 293 2 244Q0 183 11 111Q23 39 63 -9Q66 -13 68 -14Q70 -16 71 -16Q73 -16 75 -14Q77 -11 77 -9Q77 -7 76 -5Q74 -3 72 1Q67 9 56 40Q45 72 44 112Q46 155 60 213Q74 272 81 319Q82 323 82 327Q82 331 82 335Q81 381 62 424Q43 467 20 483Q18 486 18 491Q18 496 20 498Z" fill="${SC}"/>`;
  svg += `</g>`;

  const sX1 = bX + 8, sX2 = W - 14;
  for(let i=0;i<5;i++) svg += `<line x1="${sX1}" y1="${tY(i)}" x2="${sX2}" y2="${tY(i)}" stroke="${SC}" stroke-width="0.7" opacity="0.4"/>`;
  for(let i=0;i<5;i++) svg += `<line x1="${sX1}" y1="${bY(i)}" x2="${sX2}" y2="${bY(i)}" stroke="${SC}" stroke-width="0.7" opacity="0.4"/>`;
  svg += `<line x1="${sX1}" y1="${tY(0)}" x2="${sX1}" y2="${BBOT}" stroke="${SC}" stroke-width="1" opacity="0.5"/>`;

  // Treble clef
  {
    const s = LS / 250;
    const cx = sX1 + 3;
    const gLineY = tY(3);
    svg += `<g transform="translate(${cx}, ${gLineY}) scale(${s}, ${-s})">`;
    svg += `<path d="M376 415Q375 424 376 427Q378 430 382 434Q465 510 518 605Q570 700 572 815Q572 881 555 942Q538 1002 507 1048Q495 1066 480 1081Q464 1097 455 1098Q444 1097 425 1082Q406 1067 390 1050Q335 987 313 903Q291 819 292 739Q292 695 296 651Q301 607 306 575Q308 567 307 562Q306 558 297 551Q184 463 95 350Q5 237 0 87Q0 -48 90 -148Q180 -247 364 -252Q382 -252 400 -250Q418 -249 433 -246Q441 -244 444 -245Q447 -246 448 -255Q458 -307 466 -363Q474 -419 475 -456Q471 -563 418 -594Q365 -625 316 -622Q276 -621 256 -612Q236 -603 236 -593Q236 -588 243 -584Q251 -581 268 -576Q293 -570 313 -547Q334 -525 335 -482Q335 -440 310 -410Q285 -381 239 -380Q188 -381 160 -414Q132 -447 132 -495Q130 -548 170 -601Q211 -654 322 -658Q378 -661 446 -622Q513 -582 519 -458Q518 -413 509 -353Q499 -293 490 -244Q488 -236 491 -233Q493 -231 503 -227Q580 -196 625 -135Q670 -74 671 11Q670 110 606 180Q542 249 430 252Q411 251 407 254Q402 257 401 270ZM470 943Q495 943 512 923Q529 902 530 861Q527 778 473 710Q419 643 356 591Q351 586 348 588Q344 589 343 599Q340 619 339 643Q337 667 337 691Q340 809 381 876Q422 942 470 943ZM361 262Q364 249 361 245Q359 242 346 238Q279 214 241 162Q202 109 201 44Q202 -24 233 -70Q264 -115 316 -133Q322 -135 330 -137Q337 -139 343 -139Q349 -139 352 -136Q355 -133 355 -128Q355 -123 350 -120Q346 -117 340 -115Q308 -101 288 -72Q269 -43 268 -8Q269 35 295 66Q322 96 368 109Q380 112 383 111Q387 109 388 101L438 -197Q440 -205 437 -207Q435 -209 424 -211Q412 -213 398 -215Q383 -216 368 -216Q235 -214 158 -150Q82 -86 80 20Q78 64 95 123Q113 181 173 252Q218 301 254 334Q291 366 326 394Q333 400 336 399Q339 398 340 390ZM430 103Q428 112 430 115Q432 118 441 117Q503 110 545 66Q587 21 589 -46Q588 -94 563 -130Q538 -167 495 -188Q486 -193 483 -192Q480 -191 479 -182Z" fill="${SC}"/>`;
    svg += `</g>`;
  }

  // Bass clef
  {
    const sy = (LS/250)*1.35;
    const sx = sy*1.15;
    const cx = sX1 + 2;
    const fLineY = bY(1);
    svg += `<g transform="translate(${cx}, ${fLineY}) scale(${sx}, ${-sy})">`;
    svg += `<path d="M162 170Q78 165 39 111Q0 56 0 6Q0 2 1 -3Q7 -48 31 -71Q55 -94 84 -94H88Q119 -92 144 -67Q168 -41 169 -10Q167 33 140 47Q112 60 89 59H70Q60 59 57 64Q54 68 54 73Q54 75 55 76Q55 77 55 77Q74 115 98 126Q122 137 137 136Q189 134 208 99Q227 63 231 17Q231 16 232 15Q232 13 232 9Q233 0 234 -9Q234 -19 234 -28Q235 -120 203 -195Q171 -270 98 -327Q75 -345 49 -358Q24 -371 -2 -385Q-9 -390 -12 -395Q-15 -400 -15 -403Q-15 -407 -10 -410Q-5 -414 -2 -414Q57 -411 117 -373Q176 -335 215 -295Q267 -244 307 -170Q348 -97 350 -22V-18Q348 34 331 68Q313 102 288 122Q245 154 207 163Q169 171 166 170ZM418 127Q399 127 387 115Q374 102 374 84Q374 65 387 52Q399 39 418 39Q437 39 449 52Q462 65 462 84Q462 102 449 115Q437 127 418 127ZM418 -41Q400 -41 388 -54Q376 -66 375 -85Q376 -103 388 -116Q400 -128 418 -129Q437 -128 450 -116Q463 -103 463 -85Q463 -66 450 -54Q437 -41 418 -41Z" fill="${SC}"/>`;
    svg += `</g>`;
  }

  // Key signature
  const clefEndX = sX1 + 2 + Math.ceil(463*(LS/250)*1.35*1.15) + 4;
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

  const startX = ksX + 10;
  const ksSet = new Set();
  if(ksN > 0) for(let i=0;i<ksN;i++) ksSet.add(shOrder[i]);
  if(ksN < 0) for(let i=0;i<-ksN;i++) ksSet.add(flOrder[i]);

  function needAcc(midi){
    const pc = ((midi%12)+12)%12;
    const dia = diaMap[pc];
    const nat = [0,2,4,5,7,9,11][dia];
    const d = ((pc - nat)+12)%12;
    if(d===0){
      if(ksN > 0 && ksSet.has(dia)) return '♮';
      if(ksN < 0 && ksSet.has(dia)) return '♮';
      return null;
    }
    if(d===1) return (ksN>0&&ksSet.has(dia))?null:'♯';
    if(d===11) return (ksN<0&&ksSet.has(dia))?null:'♭';
    if(d===2) return '𝄪';
    if(d===10) return '𝄫';
    return null;
  }

  const nX0 = startX + 30;
  const nR = 6.5, nRy = 4.5;
  const colors = ['#e74c3c','#e67e22','#2ecc71','#3498db'];

  if(chords.length === 2){
    const x1 = nX0 + chordSpacing*0.35;
    const x2 = nX0 + chordSpacing*0.65;
    const ay = bY(4) + 52;
    svg += `<line x1="${x1}" y1="${ay}" x2="${x2}" y2="${ay}" stroke="#534AB7" stroke-width="1.5" opacity="0.5"/>`;
    svg += `<polygon points="${x2},${ay} ${x2-5},${ay-3} ${x2-5},${ay+3}" fill="#534AB7" opacity="0.5"/>`;
  }

  chords.forEach((ch, idx) => {
    const x = nX0 + idx * chordSpacing;
    const bassY = midiToBassY(ch.midi[0]);
    drawNote(x, bassY, bY, ch.midi[0], 0);
    const tenorY = midiToBassY(ch.midi[1]);
    const tx = x + (Math.abs(tenorY - bassY) < 3 ? 14 : 0);
    drawNote(tx, tenorY, bY, ch.midi[1], 1);
    const altoY = midiToTrebleY(ch.midi[2]);
    drawNote(x, altoY, tY, ch.midi[2], 2);
    const sopY = midiToTrebleY(ch.midi[3]);
    const sx = x + (Math.abs(sopY - altoY) < 3 ? 14 : 0);
    drawNote(sx, sopY, tY, ch.midi[3], 3);
    svg += `<text x="${x}" y="${bY(4)+68}" font-size="14" fill="#534AB7" font-weight="700" font-family="'DM Sans',serif" text-anchor="middle">${ch.roman}</text>`;
    if(ch.degSop){
      const sdx = (Math.abs(sopY - altoY) < 3) ? sx : x;
      const sdy = Math.min(sopY, tY(0)) - 14;
      svg += `<text x="${sdx}" y="${sdy+5}" font-size="12" fill="#111827" font-weight="600" font-family="'DM Sans',sans-serif" text-anchor="middle">${ch.degSop}</text>`;
      svg += `<path d="M${sdx-4} ${sdy-5}L${sdx} ${sdy-9}L${sdx+4} ${sdy-5}" fill="none" stroke="#111827" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    if(ch.degBass){
      const bdy = Math.max(bassY, bY(4)) + 16;
      svg += `<text x="${x}" y="${bdy+6}" font-size="12" fill="#111827" font-weight="600" font-family="'DM Sans',sans-serif" text-anchor="middle">${ch.degBass}</text>`;
      svg += `<path d="M${x-4} ${bdy-4}L${x} ${bdy-8}L${x+4} ${bdy-4}" fill="none" stroke="#111827" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
  });

  const endX = nX0 + (chords.length-1)*chordSpacing + 26;
  svg += `<line x1="${endX}" y1="${tY(0)}" x2="${endX}" y2="${BBOT}" stroke="${SC}" stroke-width="0.8" opacity="0.35"/>`;
  svg += `<line x1="${endX+3}" y1="${tY(0)}" x2="${endX+3}" y2="${BBOT}" stroke="${SC}" stroke-width="2.2" opacity="0.4"/>`;

  svg += '</svg>';
  return svg;

  function drawNote(nx, ny, lineY, midi, voiceIdx){
    if(ny > lineY(4)+1){
      let count = 0;
      for(let ly=lineY(4)+LS; ly<=ny+1 && count<3; ly+=LS, count++)
        svg += `<line x1="${nx-12}" y1="${ly}" x2="${nx+12}" y2="${ly}" stroke="${SC}" stroke-width="0.8" opacity="0.5"/>`;
    }
    if(ny < lineY(0)-1){
      let count = 0;
      for(let ly=lineY(0)-LS; ly>=ny-1 && count<3; ly-=LS, count++)
        svg += `<line x1="${nx-12}" y1="${ly}" x2="${nx+12}" y2="${ly}" stroke="${SC}" stroke-width="0.8" opacity="0.5"/>`;
    }
    const acc = needAcc(midi);
    if(acc) svg += `<text x="${nx-14}" y="${ny+5}" font-size="14" fill="${SC}" font-family="serif" text-anchor="middle">${acc}</text>`;
    svg += `<ellipse cx="${nx}" cy="${ny}" rx="${nR}" ry="${nRy}" fill="${colors[voiceIdx]}" transform="rotate(-12 ${nx} ${ny})"/>`;
  }
}

/* ── Piano Audio Engine ── */
var _cadPianoChain = null;

function _cadMkReverb(ctx){
  var len=Math.floor(ctx.sampleRate*1.0), buf=ctx.createBuffer(2,len,ctx.sampleRate);
  for(var ch=0;ch<2;ch++){
    var d=buf.getChannelData(ch);
    for(var i=0;i<len;i++){
      var t=i/ctx.sampleRate;
      var early=0;
      if(t>0.008&&t<0.04) early=(Math.random()*2-1)*0.22*Math.exp(-(t-0.008)/0.012);
      var late=(t>0.04)?(Math.random()*2-1)*Math.exp(-t/0.25)*0.12:0;
      var spread=(ch===0)?Math.sin(t*800):Math.cos(t*800);
      d[i]=(early+late)*(1+spread*0.08);
    }
  }
  var c=ctx.createConvolver(); c.buffer=buf; return c;
}

function _cadGetChain(){
  var ctx=_getPianoCtx();
  if(!_cadPianoChain){
    var master=ctx.createGain(); master.gain.value=0.65;
    var comp=ctx.createDynamicsCompressor();
    comp.threshold.value=-24; comp.ratio.value=2.5;
    comp.attack.value=0.008; comp.release.value=0.3; comp.knee.value=15;
    master.connect(comp); comp.connect(ctx.destination);
    var rev=_cadMkReverb(ctx);
    var wet=ctx.createGain(); wet.gain.value=0.18;
    rev.connect(wet); wet.connect(master);
    var dry=ctx.createGain(); dry.gain.value=0.82;
    dry.connect(master);
    _cadPianoChain={ctx:ctx, dry:dry, wet:rev, master:master};
  }
  return _cadPianoChain;
}

function CAD_m2f(m){ return 440 * Math.pow(2, (m-69)/12); }

function CAD_pianoNote(freq, startTime, duration, ctx, dryNode, wetNode, velocity){
  var vel=velocity||0.28, st=startTime, dur=duration;
  var B=0.0003*Math.pow(freq/261,1.4);
  function pH(n){return freq*n*Math.sqrt(1+B*n*n);}
  var brightness=0.6+vel*1.4;
  var noteGain=ctx.createGain();

  var numStrings=freq<250?2:3;
  var stringDetune=freq<250?[-0.8,0.8]:[-1.0,0,1.0];

  for(var s=0;s<numStrings;s++){
    var stringGain=ctx.createGain();
    var sAmp=vel*(0.22/numStrings);
    var stage1=0.08+Math.random()*0.02;
    var stage2=dur+1.0+(261/freq)*0.5;
    stage2=Math.min(stage2,4.0);

    stringGain.gain.setValueAtTime(sAmp,st);
    stringGain.gain.exponentialRampToValueAtTime(sAmp*0.45,st+stage1);
    stringGain.gain.exponentialRampToValueAtTime(sAmp*0.18,st+stage2*0.4);
    stringGain.gain.exponentialRampToValueAtTime(0.001,st+stage2);

    var oF=ctx.createOscillator();
    oF.type='sine'; oF.frequency.value=pH(1); oF.detune.value=stringDetune[s];
    oF.frequency.setValueAtTime(pH(1)*1.002,st);
    oF.frequency.exponentialRampToValueAtTime(pH(1),st+0.025);
    var gF=ctx.createGain(); gF.gain.value=1.0;
    oF.connect(gF); gF.connect(stringGain);
    oF.start(st); oF.stop(st+stage2+0.1);

    var partials=[
      {n:2,a:0.85},{n:3,a:0.45},{n:4,a:0.30},
      {n:5,a:0.15},{n:6,a:0.08},{n:7,a:0.05},
      {n:8,a:0.03},{n:9,a:0.015},{n:10,a:0.008}
    ];
    partials.forEach(function(p){
      var f=pH(p.n); if(f>17000)return;
      var o=ctx.createOscillator();
      o.type='sine'; o.frequency.value=f;
      o.detune.value=stringDetune[s]*(1+p.n*0.1);
      var g=ctx.createGain();
      var hDecay=stage2*(0.15+0.85/(1+p.n*0.3));
      var hAmp=p.a*brightness;
      g.gain.setValueAtTime(hAmp,st);
      g.gain.exponentialRampToValueAtTime(hAmp*0.2,st+stage1*1.5);
      g.gain.exponentialRampToValueAtTime(0.001,st+hDecay);
      o.connect(g); g.connect(stringGain);
      o.start(st); o.stop(st+hDecay+0.05);
    });
    stringGain.connect(noteGain);
  }

  var hammerLen=Math.floor(ctx.sampleRate*0.018);
  var hammerBuf=ctx.createBuffer(1,hammerLen,ctx.sampleRate);
  var hd=hammerBuf.getChannelData(0);
  for(var i=0;i<hammerLen;i++){
    var t=i/ctx.sampleRate;
    var rise=Math.min(t/0.001,1.0);
    var decay=Math.exp(-t/0.004);
    var noise=(Math.random()*2-1);
    var ring=Math.sin(2*Math.PI*freq*3.7*t);
    hd[i]=rise*decay*(noise*0.7+ring*0.3)*0.08;
  }
  var hammerSrc=ctx.createBufferSource(); hammerSrc.buffer=hammerBuf;
  var hBP=ctx.createBiquadFilter();
  hBP.type='bandpass'; hBP.frequency.value=Math.min(freq*4,8000); hBP.Q.value=0.4;
  var hGain=ctx.createGain(); hGain.gain.value=vel*brightness*0.12;
  hammerSrc.connect(hBP); hBP.connect(hGain); hGain.connect(noteGain);
  hammerSrc.start(st);

  var sbFilter=ctx.createBiquadFilter();
  sbFilter.type='peaking'; sbFilter.frequency.value=420; sbFilter.Q.value=2.0; sbFilter.gain.value=3;

  var lp=ctx.createBiquadFilter(); lp.type='lowpass';
  var lpStart=Math.min(freq*brightness*8,16000);
  var lpEnd=Math.max(freq*2,400);
  lp.frequency.setValueAtTime(lpStart,st);
  lp.frequency.exponentialRampToValueAtTime(lpStart*0.6,st+0.05);
  lp.frequency.exponentialRampToValueAtTime(lpEnd,st+dur+1.0);
  lp.Q.value=0.4;

  var hs=ctx.createBiquadFilter();
  hs.type='highshelf'; hs.frequency.value=5000; hs.gain.value=-2.5;

  var env=noteGain.gain;
  env.setValueAtTime(0,st);
  env.linearRampToValueAtTime(1.0,st+0.003);
  env.exponentialRampToValueAtTime(0.55,st+0.05);
  env.exponentialRampToValueAtTime(0.38,st+0.25);
  env.exponentialRampToValueAtTime(0.20,st+dur*0.65);
  env.setTargetAtTime(0.001,st+dur+0.15,0.22);

  noteGain.connect(sbFilter); sbFilter.connect(lp); lp.connect(hs);
  hs.connect(dryNode); hs.connect(wetNode);
}

function CAD_playSequence(){
  const chords = CAD_computeChords();
  if(!chords.length) return;
  const chain = _cadGetChain();
  const ctx = chain.ctx;
  const now = ctx.currentTime + 0.05;
  const isArp = CAD_S.pm === 'arp';

  chords.forEach((ch, ci) => {
    const t0 = now + ci * 1.4;
    if(isArp){
      ch.midi.forEach((m, ni) => {
        CAD_pianoNote(CAD_m2f(m), t0 + ni * 0.15, 1.2, ctx, chain.dry, chain.wet, 0.22 + Math.random()*0.04);
      });
    } else {
      ch.midi.forEach((m, ni) => {
        CAD_pianoNote(CAD_m2f(m), t0 + ni * 0.006 * (0.8 + Math.random()*0.4), 1.8, ctx, chain.dry, chain.wet, 0.25 + Math.random()*0.05);
      });
    }
  });

  const btn = document.getElementById('cad_playBtn');
  if(btn){ btn.classList.add('playing'); setTimeout(()=>btn.classList.remove('playing'), chords.length*1400+800); }
}

/* ── Main render ── */
function CAD_render(){
  const target = document.getElementById('cad_app');
  if(!target) return;
  let h = '';

  h += `<div class="card"><div class="ctrl-row">`;
  h += `<div class="ctrl-col"><label>${t("t_key")}</label><select onchange="CAD_S.key=window.CAD_KEY_PAIRS[this.value][CAD_S.mode==='major'?'maj':'min'];CAD_render()" id="cad_keySel">`;
  CAD_KEY_PAIRS.forEach((p,i) => {
    const k = CAD_S.mode === 'major' ? p.maj : p.min;
    h += `<option value="${i}"${k === CAD_S.key ? ' selected' : ''}>${p.maj} / ${p.min}m</option>`;
  });
  h += `</select></div>`;
  h += `<div class="ctrl-col"><label>Mode</label><div class="pills">`;
  h += `<button class="pill${CAD_S.mode==='major'?' on':''}" onclick="CAD_S.mode='major';CAD_S.key=window.CAD_KEY_PAIRS[document.getElementById('cad_keySel').value].maj;CAD_render()">${t("Major")}</button>`;
  h += `<button class="pill${CAD_S.mode==='minor'?' on':''}" onclick="CAD_S.mode='minor';CAD_S.key=window.CAD_KEY_PAIRS[document.getElementById('cad_keySel').value].min;CAD_render()">${t('Minor')}</button>`;
  h += `</div></div>`;
  h += `</div></div>`;

  h += `<div class="card"><div class="card-title">${tx('CADENCES','CADENCES','CADENCIAS')}</div><div class="cad-list">`;
  CAD_CATS.forEach(cat => {
    const items = CAD_DB.filter(c => c.cat === cat.id);
    if(!items.length) return;
    h += `<div style="width:100%;margin-top:4px"><span style="font-size:11px;font-weight:700;color:#534AB7">${cat.name[currentLang]||cat.name.fr}</span></div>`;
    items.forEach(c => {
      h += `<button class="cad-btn${c.id===CAD_S.cadId?' on':''}" onclick="CAD_S.cadId='${c.id}';CAD_render()">${c.name[currentLang]||c.name.fr}</button>`;
    });
  });
  h += `</div></div>`;

  const cad = CAD_DB.find(c => c.id === CAD_S.cadId);
  if(cad){
    const infoLbl = tx('Info','Info','Info');
    h += `<div class="info-badge"><span class="ib-label">${infoLbl}</span> ${cad.desc[currentLang]||cad.desc.fr}</div>`;
    if(cad.forceMode && cad.forceMode !== CAD_S.mode){
      const noteLbl = tx('Note','Note','Nota');
      const modeLabelEN = cad.forceMode === 'minor' ? 'minor' : 'major';
      const modeLabelFR = cad.forceMode === 'minor' ? 'mineur' : 'majeur';
      const modeLabelES = cad.forceMode === 'minor' ? 'menor' : 'mayor';
      const msg = tx(
        `Cette cadence est spécifique au mode ${modeLabelFR}`,
        `This cadence is specific to ${modeLabelEN} mode`,
        `Esta cadencia es específica del modo ${modeLabelES}`
      );
      h += `<div class="info-badge" style="background:#fef3c7;border-color:#fde68a;color:#92400e"><span class="ib-label">${noteLbl}</span> ${msg}</div>`;
    }
  }

  h += `<div class="staff-wrap" id="cad_staffArea">${CAD_renderStaffSVG()}</div>`;

  h += `<div class="legend">`;
  h += `<div class="legend-item"><div class="legend-dot" style="background:#3498db"></div>Soprano</div>`;
  h += `<div class="legend-item"><div class="legend-dot" style="background:#2ecc71"></div>Alto</div>`;
  h += `<div class="legend-item"><div class="legend-dot" style="background:#e67e22"></div>${tx('Ténor','Tenor','Tenor')}</div>`;
  h += `<div class="legend-item"><div class="legend-dot" style="background:#e74c3c"></div>${tx('Basse','Bass','Bajo')}</div>`;
  h += `</div>`;

  h += `<div class="play-row">`;
  h += `<button class="play-btn" id="cad_playBtn" onclick="CAD_playSequence()">▶ ${t("btn_listen")}</button>`;
  h += `<div class="pm"><button class="${CAD_S.pm==='chord'?'on':''}" onclick="CAD_S.pm='chord';CAD_render()">${t('btn_chord')}</button><button class="${CAD_S.pm==='arp'?'on':''}" onclick="CAD_S.pm='arp';CAD_render()">${t('btn_arp')}</button></div>`;
  h += `</div>`;

  target.innerHTML = h;
}

/* Expose globals */
window.CAD_S = CAD_S;
window.CAD_KEY_PAIRS = CAD_KEY_PAIRS;
window.CAD_render = CAD_render;
window.CAD_playSequence = CAD_playSequence;

/* Init on DOMContentLoaded */
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', CAD_render);
} else {
  CAD_render();
}
})();

/* ── Init auto ── */
try{CAD_render()}catch(e){console.error('CAD:',e)}
