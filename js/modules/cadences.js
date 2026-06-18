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
  ,

  // ══ NOUVELLES CADENCES — PAC avec renversements V7 ══
  { id:'pac_V65', cat:'auth',
    name:{fr:'PAC — V⁶₅ → I (2̂–1̂)',en:'PAC — V⁶₅ → I (2̂–1̂)',es:'CAP — V⁶₅ → I (2̂–1̂)'},
    desc:{fr:'V7 en première renverse : basse ♯7̂→1̂. La septième descend, la sensible monte.',en:'V7 in first inversion: bass ♯7̂→1̂. The seventh descends, the leading tone ascends.',es:'V7 en primera inversión: bajo ♯7̂→1̂. La séptima desciende, la sensible asciende.'},
    build(sc){
      return [
        { roman:'V⁶₅', midi: CAD_chord(sc, [7,4,7,2], [3,4,4,5]) },
        { roman:'I', midi: CAD_chord(sc, [1,3,5,1], [3,4,4,5]) }
      ];
    }
  },
  { id:'pac_V43', cat:'auth',
    name:{fr:'PAC — V⁴₃ → I (2̂–1̂)',en:'PAC — V⁴₃ → I (2̂–1̂)',es:'CAP — V⁴₃ → I (2̂–1̂)'},
    desc:{fr:'V7 en deuxième renverse : basse 2̂→1̂ par degré conjoint descendant.',en:'V7 in second inversion: bass 2̂→1̂ stepwise descent.',es:'V7 en segunda inversión: bajo 2̂→1̂ por grado conjunto descendente.'},
    build(sc){
      return [
        { roman:'V⁴₃', midi: CAD_chord(sc, [2,4,7,2], [3,4,4,5]) },
        { roman:'I', midi: CAD_chord(sc, [1,3,5,1], [3,4,4,5]) }
      ];
    }
  },
  { id:'pac_V2', cat:'auth',
    name:{fr:'PAC — V² → I⁶ (4̂–3̂)',en:'PAC — V² → I⁶ (4̂–3̂)',es:'CAP — V² → I⁶ (4̂–3̂)'},
    desc:{fr:'V7 en troisième renverse : basse 4̂→3̂. La fondamentale de I est à la basse de I⁶.',en:'V7 in third inversion: bass 4̂→3̂. The root of I is in the bass of I⁶.',es:'V7 en tercera inversión: bajo 4̂→3̂. La fundamental de I está en el bajo de I⁶.'},
    build(sc){
      return [
        { roman:'V²', midi: CAD_chord(sc, [4,5,7,2], [3,4,4,5]) },
        { roman:'I⁶', midi: CAD_chord(sc, [3,5,1,3], [3,4,4,5]) }
      ];
    }
  },

  // ══ IAC avec suspension 4-3 au soprano (Catel) ══
  { id:'iac_sus43', cat:'auth',
    name:{fr:'IAC — suspension 4̂–3̂ au soprano',en:'IAC — 4̂–3̂ suspension in soprano',es:'CAI — suspensión 4̂–3̂ en el soprano'},
    desc:{fr:'V → I : le soprano tient la quarte (4̂) sur I avant de résoudre sur la tierce (3̂). Retard classique selon Catel.',en:'V → I: soprano holds the fourth (4̂) over I before resolving to the third (3̂). Classic retardation per Catel.',es:'V → I: el soprano retiene la cuarta (4̂) sobre I antes de resolver en la tercera (3̂). Retardo clásico según Catel.'},
    build(sc){
      return [
        { roman:'V', midi: CAD_chord(sc, [5,7,5,4], [3,3,4,4]) },
        { roman:'I', midi: CAD_chord(sc, [1,3,5,3], [3,4,4,5]) }
      ];
    }
  },

  // ══ Demi-cadence phrygienne variante ══
  { id:'hc_phryg2', cat:'half',
    name:{fr:'HC phrygienne — i–iv⁶–V',en:'Phrygian HC — i–iv⁶–V',es:'SC frigia — i–iv⁶–V'},
    desc:{fr:'Cadence phrygienne complète en mineur : contexte harmonique i–iv⁶–V, basse ♭6̂→5̂ par demi-ton.',en:'Full Phrygian cadence in minor: harmonic context i–iv⁶–V, bass ♭6̂→5̂ by semitone.',es:'Cadencia frigia completa en menor: contexto armónico i–iv⁶–V, bajo ♭6̂→5̂ por semitono.'},
    forceMode:'minor',
    build(sc){
      return [
        { roman:'i', midi: CAD_chord(sc, [1,5,3,1], [3,3,4,5]) },
        { roman:'iv⁶', midi: CAD_chord(sc, [6,1,4,1], [3,4,4,5]) },
        { roman:'V', midi: CAD_chord(sc, [5,7,5,7], [3,3,4,4]) }
      ];
    }
  },

  // ══ Cadence plagale "Amen" IV7 → I ══
  { id:'plag_IV7', cat:'plagal',
    name:{fr:'Cadence plagale IV⁷ → I (Amen)',en:'Plagal Cadence IV⁷ → I (Amen)',es:'Cadencia plagal IV⁷ → I (Amén)'},
    desc:{fr:'La septième de la sous-dominante résout sur la tonique. Cadence d\'église "Amen".',en:'The seventh of the subdominant resolves to the tonic. Church "Amen" cadence.',es:'La séptima de la subdominante resuelve en la tónica. Cadencia litúrgica "Amén".'},
    build(sc){
      const b7 = (sc[3]+10)%12;
      return [
        { roman:'IV⁷', midi: CAD_chordPC([sc[3], sc[5], sc[0], b7], [3,4,4,4]) },
        { roman:'I', midi: CAD_chord(sc, [1,5,3,1], [3,4,4,5]) }
      ];
    }
  },

  // ══ Cadences rompues supplémentaires ══
  { id:'dec_bVII', cat:'deceptive',
    name:{fr:'Cadence rompue V → ♭VII',en:'Deceptive Cadence V → ♭VII',es:'Cadencia rota V → ♭VII'},
    desc:{fr:'La dominante résout sur ♭VII. Fréquent en mineur et dans le style rock.',en:'The dominant resolves to ♭VII. Common in minor keys and rock style.',es:'La dominante resuelve en ♭VII. Frecuente en menor y en el estilo rock.'},
    build(sc, key, mode){
      const b7pc = (sc[0]+10)%12;
      const b7_5 = (sc[0]+5)%12;
      const b7_3 = (sc[0]+2)%12;
      return [
        { roman:'V', midi: CAD_chord(sc, [5,7,5,2], [3,3,4,5]) },
        { roman:'♭VII', midi: CAD_chordPC([b7pc, b7_5, b7_3, b7pc], [3,4,4,5]) }
      ];
    }
  },
  { id:'dec_III6', cat:'deceptive',
    name:{fr:'Cadence rompue V → III⁶ (mineur)',en:'Deceptive Cadence V → III⁶ (minor)',es:'Cadencia rota V → III⁶ (menor)'},
    desc:{fr:'En mineur : la dominante résout sur III⁶. Style baroque.',en:'In minor: the dominant resolves to III⁶. Baroque style.',es:'En menor: la dominante resuelve en III⁶. Estilo barroco.'},
    forceMode:'minor',
    build(sc){
      return [
        { roman:'V', midi: CAD_chord(sc, [5,7,5,2], [3,3,4,5]) },
        { roman:'III⁶', midi: CAD_chord(sc, [5,1,3,5], [3,4,4,4]) }
      ];
    }
  },

  // ══ Cadences spéciales : napolitaine et 6te augmentée ══
  { id:'nap_cad', cat:'special',
    name:{fr:'Cadence napolitaine ♭II⁶ → V → I',en:'Neapolitan Cadence ♭II⁶ → V → I',es:'Cadencia napolitana ♭II⁶ → V → I'},
    desc:{fr:'L\'accord napolitain (♭II⁶) précède la dominante. Très enseigné au conservatoire.',en:'The Neapolitan chord (♭II⁶) precedes the dominant. Standard conservatory cadence.',es:'El acorde napolitano (♭II⁶) precede a la dominante. Cadencia estándar de conservatorio.'},
    build(sc){
      const nap_r = (sc[0]+1)%12;
      const nap_3 = (nap_r+4)%12;
      const nap_5 = (nap_r+7)%12;
      return [
        { roman:'♭II⁶', midi: CAD_chordPC([sc[3], sc[3], nap_5, nap_3], [3,4,4,5]) },
        { roman:'V', midi: CAD_chord(sc, [5,7,2,5], [3,3,4,4]) },
        { roman:'I', midi: CAD_chord(sc, [1,5,1,3], [3,3,4,5]) }
      ];
    }
  },
  { id:'aug6_cad', cat:'special',
    name:{fr:'Cadence avec It⁺⁶ → V → I',en:'Italian Aug. 6th → V → I',es:'It⁺⁶ → V → I'},
    desc:{fr:'Sixte augmentée italienne résolue sur la dominante, puis cadence parfaite.',en:'Italian augmented sixth resolving to the dominant, followed by a perfect cadence.',es:'Sexta aumentada italiana resuelta en la dominante, luego cadencia perfecta.'},
    build(sc){
      const aug6_lo = (sc[0]+8)%12;
      const aug6_hi = (sc[0]+3)%12;
      return [
        { roman:'It⁺⁶', midi: CAD_chordPC([aug6_lo, sc[3], sc[0], aug6_hi], [3,4,4,5]) },
        { roman:'V', midi: CAD_chord(sc, [5,7,2,5], [3,3,4,4]) },
        { roman:'I', midi: CAD_chord(sc, [1,5,1,3], [3,3,4,5]) }
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
  // ══ Onglets navigation ══
  const CAD_activeTab = window._cadTab || 'cadences';
  h += `<div class="cad-tabs" style="display:flex;gap:4px;margin-bottom:8px">`;
  h += `<button class="pill${CAD_activeTab==='cadences'?' on':''}" style="flex:1;padding:8px 4px;font-size:12px" onclick="window._cadTab='cadences';CAD_render()">${tx('Cadences','Cadences','Cadencias')}</button>`;
  h += `<button class="pill${CAD_activeTab==='retards'?' on':''}" style="flex:1;padding:8px 4px;font-size:12px" onclick="window._cadTab='retards';RET_S.key=CAD_S.key;RET_S.mode=CAD_S.mode;RET_render()">${tx('Retards','Retardations','Retardos')}</button>`;
  h += `</div>`;
  if(CAD_activeTab === 'retards'){ RET_render(); return; }


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


/* ═══════════════════════════════════════════════════════
   MODULE RETARDS — Selon le Traité d'Harmonie de Catel (1802)
   Article VII : Passing Notes, Prolongations, Suspensions, Retardations
   ═══════════════════════════════════════════════════════ */

const RET_S = { key:'C', mode:'major', retId:'ret_43_sop' };

/* Retards database — strictement conforme Catel, Traité d'Harmonie (1802), Article VII
   Chaque entrée a 3 moments : préparation (prep), retard (susp), résolution (res)
   Voicing convention : [Basse, Ténor, Alto, Soprano]
   Chiffrage arabe italique (figured) empilé verticalement */
const RET_DB = [

  // ═══════════════════════════════════════════════════════════════
  // ── SUR L'ACCORD PARFAIT (Accord commun) ──
  // Catel Art. VII, p.20-23
  // ═══════════════════════════════════════════════════════════════

  { id:'ret_43_sop', cat:'common',
    name:{fr:'Retard 4–3 au soprano (accord parfait)',en:'4–3 Retardation in soprano (common chord)',es:'Retardo 4–3 en el soprano (acorde perfecto)'},
    figure:'4–3',
    desc:{
      fr:'La tierce de l\'accord parfait est retardée par la quarte (le soprano fait 4 → 3). Préparation : Fa préparé sur IV. Catel Art. VII (dissonance de quarte retardant la tierce dans l\'accord parfait).',
      en:'The third of the common chord is retarded by the fourth (soprano: 4 → 3). Preparation: F prepared on IV. Catel Art. VII.',
      es:'La tercera del acorde perfecto es retardada por la cuarta (soprano: 4 → 3). Preparación: Fa preparado en IV. Catel Art. VII.'
    },
    source:'Catel, Traité d\'Harmonie (1802), Article VII, p.20',
    build(sc){
      // En Do majeur : Sop fait Fa→Mi sur basse Do
      // Prép IV  : B=Fa, T=Do, A=La, S=Fa  → degs=[4,1,6,4]
      // Retard I : B=Do, T=Do, A=Sol, S=Fa → degs=[1,1,5,4]   (Fa = 4 au-dessus de Do)
      // Rés    I : B=Do, T=Do, A=Sol, S=Mi → degs=[1,1,5,3]
      return [
        { figured:'5\n3', label:'Prép.', midi: CAD_chord(sc, [4,1,6,4], [3,3,4,4]) },
        { figured:'5\n4', label:'Retard', midi: CAD_chord(sc, [1,1,5,4], [3,3,4,4]) },
        { figured:'5\n3', label:'Rés.', midi: CAD_chord(sc, [1,1,5,3], [3,3,4,4]) }
      ];
    }
  },

  { id:'ret_98_sop', cat:'common',
    name:{fr:'Retard 9–8 (octave retardée par la 9e)',en:'9–8 Retardation (octave retarded by 9th)',es:'Retardo 9–8 (octava retardada por la 9ª)'},
    figure:'9–8',
    desc:{
      fr:'L\'octave de la basse est retardée par la neuvième au soprano (Ré → Do en Do majeur). Préparation : Ré préparé comme quinte de V. Catel Art. VII (dissonance de neuvième retardant l\'octave).',
      en:'The octave above the bass is retarded by the ninth in soprano (D → C in C major). Preparation: D prepared as fifth of V. Catel Art. VII.',
      es:'La octava sobre el bajo es retardada por la novena en el soprano (Re → Do en Do mayor). Preparación: Re preparado como quinta de V. Catel Art. VII.'
    },
    source:'Catel, Art. VII, p.25 (dissonance de neuvième)',
    build(sc){
      // Prép V : B=Sol, T=Sol, A=Si, S=Ré  → degs=[5,5,7,2]
      // Retard I : B=Do, T=Sol, A=Mi, S=Ré → degs=[1,5,3,2]  (Ré = 9 au-dessus de Do)
      // Rés    I : B=Do, T=Sol, A=Mi, S=Do → degs=[1,5,3,1]
      return [
        { figured:'5\n3', label:'Prép.', midi: CAD_chord(sc, [5,5,7,2], [3,3,4,4]) },
        { figured:'9\n5', label:'Retard', midi: CAD_chord(sc, [1,5,3,2], [3,3,4,4]) },
        { figured:'8\n5\n3', label:'Rés.', midi: CAD_chord(sc, [1,5,3,1], [3,3,4,4]) }
      ];
    }
  },

  { id:'ret_65_sop', cat:'common',
    name:{fr:'Retard 6–5 (quinte retardée par la sixte)',en:'6–5 Retardation (fifth retarded by sixth)',es:'Retardo 6–5 (quinta retardada por sexta)'},
    figure:'6–5',
    desc:{
      fr:'La quinte de l\'accord parfait est retardée par la sixte (La → Sol au soprano en Do majeur). Préparation : La préparé comme tierce de IV. Catel Art. VII.',
      en:'The fifth of the common chord is retarded by the sixth (A → G in soprano in C major). Preparation: A prepared as third of IV. Catel Art. VII.',
      es:'La quinta del acorde perfecto es retardada por la sexta (La → Sol en el soprano). Preparación: La preparado como tercera de IV. Catel Art. VII.'
    },
    source:'Catel, Art. VII, p.25 (retard de sixte par la quinte)',
    build(sc){
      // Prép IV : B=Fa, T=Do, A=Fa, S=La  → degs=[4,1,4,6]
      // Retard I : B=Do, T=Do, A=Mi, S=La → degs=[1,1,3,6]   (La = 6 au-dessus de Do)
      // Rés    I : B=Do, T=Do, A=Mi, S=Sol → degs=[1,1,3,5]
      return [
        { figured:'5\n3', label:'Prép.', midi: CAD_chord(sc, [4,1,4,6], [3,3,4,4]) },
        { figured:'6\n3', label:'Retard', midi: CAD_chord(sc, [1,1,3,6], [3,3,4,4]) },
        { figured:'5\n3', label:'Rés.', midi: CAD_chord(sc, [1,1,3,5], [3,3,4,4]) }
      ];
    }
  },

  { id:'ret_76_alto', cat:'common',
    name:{fr:'Retard 7–6 à l\'alto (sixte retardée)',en:'7–6 Retardation in alto (sixth retarded)',es:'Retardo 7–6 en el alto (sexta retardada)'},
    figure:'7–6',
    desc:{
      fr:'Sur l\'accord de sixte, la sixte au-dessus de la basse est retardée par la septième (Ré → Do au-dessus de Mi). Préparation : Ré préparé comme quinte de V. Catel Ex. illustrant le retard 7–6 sur accord de sixte.',
      en:'On the sixth chord, the sixth above the bass is retarded by the seventh (D → C above E). Preparation: D prepared as fifth of V. Catel Art. VII.',
      es:'Sobre el acorde de sexta, la sexta sobre el bajo retardada por la séptima (Re → Do sobre Mi). Preparación: Re preparado como quinta de V. Catel Art. VII.'
    },
    source:'Catel, Art. VII, p.26 (retard de septième sur accord de sixte)',
    build(sc){
      // Accord de sixte de Do : basse Mi, harmonie Mi-Sol-Do
      // Prép V   : B=Sol, T=Sol, A=Ré, S=Si  → degs=[5,5,2,7]
      // Retard I⁶: B=Mi, T=Sol, A=Ré, S=Sol  → degs=[3,5,2,5]  (Ré = 7 au-dessus de Mi)
      // Rés    I⁶: B=Mi, T=Sol, A=Do, S=Sol  → degs=[3,5,1,5]
      return [
        { figured:'5\n3', label:'Prép.', midi: CAD_chord(sc, [5,5,2,7], [3,3,4,4]) },
        { figured:'7\n3', label:'Retard', midi: CAD_chord(sc, [3,5,2,5], [3,3,4,4]) },
        { figured:'6\n3', label:'Rés.', midi: CAD_chord(sc, [3,5,1,5], [3,3,4,4]) }
      ];
    }
  },

  { id:'ret_23_tenor', cat:'common',
    name:{fr:'Retard ascendant 2–3 (la note monte)',en:'Ascending Retardation 2–3 (rising)',es:'Retardo ascendente 2–3'},
    figure:'2–3',
    desc:{
      fr:'Retard ascendant : la 2e monte vers la 3e (Ré → Mi). Catel note explicitement (Art. VII, p.21) que la résolution peut aller en montant.',
      en:'Ascending retardation: the 2nd rises to the 3rd (D → E). Catel explicitly states (Art. VII, p.21) that resolution may ascend.',
      es:'Retardo ascendente: la 2ª sube a la 3ª (Re → Mi). Catel señala (Art. VII, p.21) que la resolución puede ser ascendente.'
    },
    source:'Catel, Art. VII, p.21 (note de bas de page)',
    build(sc){
      // Prép V : B=Sol, T=Ré, A=Sol, S=Si  → degs=[5,2,5,7]    Ré au ténor = quinte (cons.)
      // Retard I : B=Do, T=Ré, A=Sol, S=Do → degs=[1,2,5,1]    Ré au-dessus de Do = 2 (diss.)
      // Rés    I : B=Do, T=Mi, A=Sol, S=Do → degs=[1,3,5,1]    Ré → Mi (ascendant)
      return [
        { figured:'5\n3', label:'Prép.', midi: CAD_chord(sc, [5,2,5,7], [3,3,4,4]) },
        { figured:'9\n5', label:'Retard', midi: CAD_chord(sc, [1,2,5,1], [3,3,4,4]) },
        { figured:'5\n3', label:'Rés.', midi: CAD_chord(sc, [1,3,5,1], [3,3,4,4]) }
      ];
    }
  },

  { id:'ret_2_under', cat:'common',
    name:{fr:'Retard de seconde sous l\'accord parfait',en:'Second retardation under the common chord',es:'Retardo de segunda bajo el acorde perfecto'},
    figure:'2 (basse)',
    desc:{
      fr:'La basse est retardée : elle tient la note du degré supérieur (Ré) pendant que l\'accord supérieur joue I (Do-Mi-Sol). La basse descend ensuite sur Do. Catel : "la dissonance de seconde, c\'est la note de la basse même qui est dissonante" (Art. VII, p.23).',
      en:'The bass is retarded: it holds the upper-step note (D) while the upper chord plays I (C-E-G). The bass then descends to C. Catel: "the dissonance of the second is the bass note itself that is dissonant" (Art. VII, p.23).',
      es:'El bajo está retardado: mantiene la nota superior (Re) mientras el acorde superior toca I (Do-Mi-Sol). Catel, Art. VII, p.23.'
    },
    source:'Catel, Art. VII, p.23 (dissonance de seconde sous accord parfait)',
    build(sc){
      // Prép ii : B=Ré, T=La, A=Ré, S=Fa  → degs=[2,6,2,4]    Ré basse = consonance (fondamentale de ii)
      // Retard  : B=Ré, T=Sol, A=Do, S=Mi → degs=[2,5,1,3]    Ré basse + accord I sup = dissonance 2
      // Rés    I: B=Do, T=Sol, A=Do, S=Mi → degs=[1,5,1,3]    Ré → Do (basse descend)
      return [
        { figured:'5\n3', label:'Prép.', midi: CAD_chord(sc, [2,6,2,4], [3,3,4,4]) },
        { figured:'9\n6', label:'Retard', midi: CAD_chord(sc, [2,5,1,3], [3,3,4,4]) },
        { figured:'5\n3', label:'Rés.', midi: CAD_chord(sc, [1,5,1,3], [3,3,4,4]) }
      ];
    }
  },

  { id:'ret_2_fond', cat:'common',
    name:{fr:'Retard de la seconde au ténor (2→1)',en:'Second retardation in tenor (2→1)',es:'Retardo de segunda en el tenor (2→1)'},
    figure:'2→1',
    desc:{
      fr:'À une voix intérieure, la fondamentale est retardée par la seconde supérieure (Ré → Do). Différence avec 9–8 : la dissonance est dans une octave plus proche (intervalle de 2 et non de 9).',
      en:'In an inner voice, the root is retarded by the second above (D → C). Difference from 9–8: the dissonance is within one octave.',
      es:'En una voz interior, la fundamental es retardada por la segunda superior (Re → Do). Diferencia con 9–8: la disonancia está dentro de una octava.'
    },
    source:'Catel, Art. VII, p.23',
    build(sc){
      // Prép V : B=Sol, T=Si, A=Ré, S=Sol  → degs=[5,7,2,5]    Ré à l'alto = quinte du V
      // Retard I : B=Do, T=Mi, A=Ré, S=Sol → degs=[1,3,2,5]    Ré tenu à l'alto = 2 (diss.)
      // Rés    I : B=Do, T=Mi, A=Do, S=Sol → degs=[1,3,1,5]    Ré → Do (descendant)
      return [
        { figured:'5\n3', label:'Prép.', midi: CAD_chord(sc, [5,7,2,5], [3,3,4,4]) },
        { figured:'5\n2', label:'Retard', midi: CAD_chord(sc, [1,3,2,5], [3,3,4,4]) },
        { figured:'5\n3', label:'Rés.', midi: CAD_chord(sc, [1,3,1,5], [3,3,4,4]) }
      ];
    }
  },

  { id:'ret_43_dom7', cat:'common',
    name:{fr:'Retard 4–3 sur V⁷ (tierce de la dominante)',en:'4–3 Retardation on V⁷ (third of dominant)',es:'Retardo 4–3 sobre V⁷ (tercera dominante)'},
    figure:'4–3 / 7',
    desc:{
      fr:'La tierce de l\'accord de septième dominante (la note sensible Si) est retardée par la quarte (Do). La septième (Fa) descend normalement à la résolution. Catel Art. VII.',
      en:'The third of the dominant seventh chord (leading tone B) is retarded by the fourth (C). The seventh (F) descends normally at resolution. Catel Art. VII.',
      es:'La tercera del acorde de séptima dominante (sensible Si) es retardada por la cuarta (Do). La séptima (Fa) desciende normalmente. Catel Art. VII.'
    },
    source:'Catel, Art. VII, p.26 (retard de quarte sur septième dominante)',
    build(sc){
      // V⁷ = Sol-Si-Ré-Fa. La 3e (Si) retardée par la 4e (Do) au soprano.
      // Prép I : B=Do, T=Sol, A=Mi, S=Do  → degs=[1,5,3,1]   Do au sop = consonance (fondamentale de I)
      // Retard : B=Sol, T=Ré, A=Fa, S=Do → degs=[5,2,4,1]   Do au sop tenu = 4 au-dessus de Sol-basse
      // Rés V⁷ : B=Sol, T=Ré, A=Fa, S=Si → degs=[5,2,4,7]   Do → Si (4→3)
      return [
        { figured:'5\n3', label:'Prép.', midi: CAD_chord(sc, [1,5,3,1], [3,3,4,4]) },
        { figured:'7\n4', label:'Retard', midi: CAD_chord(sc, [5,2,4,1], [3,3,4,4]) },
        { figured:'7\n3', label:'Rés.', midi: CAD_chord(sc, [5,2,4,7], [3,3,4,4]) }
      ];
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // ── SUR L'ACCORD DE SIXTE ──
  // Catel Art. VII, p.26-27
  // ═══════════════════════════════════════════════════════════════

  { id:'ret_43_six', cat:'sixth',
    name:{fr:'Retard 4–3 sur accord de sixte',en:'4–3 Retardation on sixth chord',es:'Retardo 4–3 sobre acorde de sexta'},
    figure:'6 / 4–3',
    desc:{
      fr:'Sur l\'accord de sixte (basse Mi, harmonie Mi-Sol-Do), la 3e au-dessus de la basse (Sol) est retardée par la 4e (La). Au soprano : La → Sol. Catel Art. VII.',
      en:'On the sixth chord (bass E, chord E-G-C), the 3rd above the bass (G) is retarded by the 4th (A). Soprano: A → G. Catel Art. VII.',
      es:'Sobre el acorde de sexta (bajo Mi, armonía Mi-Sol-Do), la 3ª sobre el bajo (Sol) es retardada por la 4ª (La). Soprano: La → Sol. Catel Art. VII.'
    },
    source:'Catel, Art. VII, p.26 (retard 4-3 sur accord de sixte)',
    build(sc){
      // Prép IV : B=Fa, T=Do, A=Fa, S=La  → degs=[4,1,4,6]    La au sop = tierce de Fa
      // Retard I⁶ : B=Mi, T=Do, A=Mi, S=La → degs=[3,1,3,6]   La au sop = 4 au-dessus de Mi (diss.)
      // Rés    I⁶ : B=Mi, T=Do, A=Mi, S=Sol → degs=[3,1,3,5]  La → Sol
      return [
        { figured:'5\n3', label:'Prép.', midi: CAD_chord(sc, [4,1,4,6], [3,3,4,4]) },
        { figured:'6\n4', label:'Retard', midi: CAD_chord(sc, [3,1,3,6], [3,3,4,4]) },
        { figured:'6\n3', label:'Rés.', midi: CAD_chord(sc, [3,1,3,5], [3,3,4,4]) }
      ];
    }
  },

  { id:'ret_98_six', cat:'sixth',
    name:{fr:'Retard 9–8 sur accord de sixte',en:'9–8 Retardation on sixth chord',es:'Retardo 9–8 sobre acorde de sexta'},
    figure:'6 / 9–8',
    desc:{
      fr:'Sur l\'accord de sixte (basse Mi), l\'octave de la basse est retardée par la neuvième (Fa → Mi au soprano). Préparation : Fa préparé comme fondamentale de IV. Catel Art. VII.',
      en:'On the sixth chord (bass E), the octave above the bass is retarded by the ninth (F → E in soprano). Preparation: F prepared as root of IV. Catel Art. VII.',
      es:'Sobre el acorde de sexta (bajo Mi), la octava sobre el bajo es retardada por la novena (Fa → Mi). Catel Art. VII.'
    },
    source:'Catel, Art. VII, p.27',
    build(sc){
      // Prép IV : B=Fa, T=Do, A=La, S=Fa  → degs=[4,1,6,4]
      // Retard I⁶ : B=Mi, T=Do, A=Sol, S=Fa → degs=[3,1,5,4]  Fa = 9 au-dessus de Mi
      // Rés    I⁶ : B=Mi, T=Do, A=Sol, S=Mi → degs=[3,1,5,3]  Fa → Mi
      return [
        { figured:'5\n3', label:'Prép.', midi: CAD_chord(sc, [4,1,6,4], [3,3,4,4]) },
        { figured:'9\n6', label:'Retard', midi: CAD_chord(sc, [3,1,5,4], [3,3,4,4]) },
        { figured:'6\n3', label:'Rés.', midi: CAD_chord(sc, [3,1,5,3], [3,3,4,4]) }
      ];
    }
  },

  { id:'ret_76_six', cat:'sixth',
    name:{fr:'Retard 7–6 sur accord de sixte',en:'7–6 Retardation on sixth chord',es:'Retardo 7–6 sobre acorde de sexta'},
    figure:'7–6',
    desc:{
      fr:'Sur l\'accord de sixte (basse Mi), la sixte (Do) est retardée par la septième (Ré). C\'est un retard très usité dans la conduite des voix. Catel Art. VII.',
      en:'On the sixth chord (bass E), the sixth (C) is retarded by the seventh (D). Very common in voice leading. Catel Art. VII.',
      es:'Sobre el acorde de sexta (bajo Mi), la sexta (Do) es retardada por la séptima (Re). Catel Art. VII.'
    },
    source:'Catel, Art. VII, p.27',
    build(sc){
      // Prép V : B=Sol, T=Sol, A=Ré, S=Si  → degs=[5,5,2,7]    Ré à l'alto = quinte de V
      // Retard I⁶ : B=Mi, T=Sol, A=Ré, S=Si → degs=[3,5,2,7]   Ré à l'alto tenu = 7 au-dessus de Mi
      // Rés    I⁶ : B=Mi, T=Sol, A=Do, S=Si → degs=[3,5,1,7]   Ré → Do
      // Wait Si au sop, voyons. Rés I⁶ doit être Mi-Sol-Do, donc sop pas Si.
      // Mieux : 
      // Prép V : B=Sol, T=Ré, A=Sol, S=Si  → degs=[5,2,5,7]
      // Retard I⁶ : B=Mi, T=Ré, A=Sol, S=Si → degs=[3,2,5,7]   Si non plus pas dans Mi-Sol-Do
      // Trop compliqué. Revenons : sop Si descend sur Do, et alto Ré (susp 7) descend sur Do.
      // Prép V : B=Sol, T=Sol, A=Ré, S=Si  → degs=[5,5,2,7]
      // Retard I⁶ : B=Mi, T=Sol, A=Ré, S=Si → degs=[3,5,2,7]
      // Rés    I⁶ : B=Mi, T=Sol, A=Do, S=Do → degs=[3,5,1,1]   alto Ré→Do, sop Si→Do
      return [
        { figured:'5\n3', label:'Prép.', midi: CAD_chord(sc, [5,5,2,7], [3,3,4,4]) },
        { figured:'7\n3', label:'Retard', midi: CAD_chord(sc, [3,5,2,7], [3,3,4,4]) },
        { figured:'6\n3', label:'Rés.', midi: CAD_chord(sc, [3,5,1,1], [3,3,4,4]) }
      ];
    }
  },

  { id:'ret_79_six', cat:'sixth',
    name:{fr:'Double retard 7+9 sur accord de sixte',en:'Double Retardation 7+9 on sixth chord',es:'Doble retardo 7+9 sobre acorde de sexta'},
    figure:'9+7 → 8+6',
    desc:{
      fr:'Double dissonance : la sixte ET l\'octave sont retardées simultanément par la 7e et la 9e sur l\'accord de sixte. Catel Art. VII (double dissonance de septième et neuvième).',
      en:'Double dissonance: both sixth and octave are retarded simultaneously by 7th and 9th on the sixth chord. Catel Art. VII.',
      es:'Doble disonancia: sexta y octava retardadas simultáneamente. Catel Art. VII.'
    },
    source:'Catel, Art. VII, p.27 (double dissonance)',
    build(sc){
      // Sur basse Mi (accord de sixte) : 9 (Fa) retarde 8 (Mi), 7 (Ré) retarde 6 (Do)
      // Prép ii⁷ (ré-fa-la-do) : B=Ré, T=La, A=Do, S=Fa  → degs=[2,6,1,4]
      // Retard I⁶ : B=Mi, T=La? Hmm la n'est pas dans Mi-Sol-Do (I⁶).
      // Simplifions : Prép IV: B=Fa, T=Do, A=Ré (préparé comme 9 au sop précédent? Hmm)
      // Préparons via V⁷ qui contient Ré (5) et Fa (7) :
      // Prép V⁷ : B=Sol, T=Ré, A=Fa, S=Si  → degs=[5,2,4,7]    Ré (5e du V) et Fa (7e du V)
      // Retard I⁶ : B=Mi, T=Ré, A=Fa, S=Si → degs=[3,2,4,7]    Ré=7 au-dessus de Mi, Fa=9 au-dessus de Mi
      //   Hmm Si n'est pas dans I⁶ non plus. Mieux : sop = Sol
      // Retard : B=Mi, T=Ré, A=Fa, S=Sol → degs=[3,2,4,5]
      //   Mais alors le 9 = Fa est à l'alto (et pas au soprano), c'est correct.
      // Rés I⁶ : B=Mi, T=Do (Ré→Do), A=Mi (Fa→Mi), S=Sol → degs=[3,1,3,5]
      return [
        { figured:'7\n5\n3', label:'Prép.', midi: CAD_chord(sc, [5,2,4,7], [3,3,4,4]) },
        { figured:'9\n7', label:'Retard', midi: CAD_chord(sc, [3,2,4,5], [3,3,4,4]) },
        { figured:'6\n3', label:'Rés.', midi: CAD_chord(sc, [3,1,3,5], [3,3,4,4]) }
      ];
    }
  },

  { id:'ret_5_six', cat:'sixth',
    name:{fr:'Retard 5–6 (quinte montant sur sixte)',en:'5–6 Retardation (fifth rising to sixth)',es:'Retardo 5–6 (quinta subiendo a sexta)'},
    figure:'5–6',
    desc:{
      fr:'Retard ascendant : la quinte au-dessus de la basse précède la sixte (Si → Do au-dessus de Mi). Forme transitoire 5/3 → 6/3 sur la même basse. Catel Art. VII.',
      en:'Ascending: the fifth above the bass precedes the sixth (B → C above E). Transitional 5/3 → 6/3 over the same bass. Catel Art. VII.',
      es:'Ascendente: la quinta sobre el bajo precede a la sexta (Si → Do sobre Mi). Catel Art. VII.'
    },
    source:'Catel, Art. VII, p.23',
    build(sc){
      // Prép V : B=Sol, T=Ré, A=Sol, S=Si  → degs=[5,2,5,7]
      // Retard 5/3 sur Mi-basse : B=Mi, T=Mi, A=Si, S=Sol → degs=[3,3,7,5]
      //   Mi-Si-Sol = accord de Mi mineur (vrai accord parfait sur médiante)
      // Rés 6/3 sur Mi : B=Mi, T=Do, A=Mi, S=Sol → degs=[3,1,3,5]    Si → Do
      return [
        { figured:'5\n3', label:'Prép.', midi: CAD_chord(sc, [5,2,5,7], [3,3,4,4]) },
        { figured:'5\n3', label:'Retard', midi: CAD_chord(sc, [3,3,7,5], [3,3,4,4]) },
        { figured:'6\n3', label:'Rés.', midi: CAD_chord(sc, [3,1,3,5], [3,3,4,4]) }
      ];
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // ── SUR LA SIX-QUATRE (accord de quarte et sixte) ──
  // Catel Art. VII, p.24-25
  // ═══════════════════════════════════════════════════════════════

  { id:'ret_64_43', cat:'sixfour',
    name:{fr:'Cadence ⁶₄ — retard 4–3 + 6–5',en:'Cadential ⁶₄ — 4–3 + 6–5',es:'Cadencia ⁶₄ — 4–3 + 6–5'},
    figure:'⁶₄ → ⁵₃',
    desc:{
      fr:'Le six-quatre cadentiel : sur la basse de dominante, la 4 et la 6 retardent simultanément la 3 et la 5. Résolution sur l\'accord parfait de dominante. Catel Art. VII.',
      en:'Cadential six-four: on the dominant bass, 4 and 6 simultaneously retard 3 and 5. Resolves to dominant common chord. Catel Art. VII.',
      es:'Seis-cuatro cadencial: sobre el bajo de dominante, 4 y 6 retardan simultáneamente 3 y 5. Catel Art. VII.'
    },
    source:'Catel, Art. VII, p.24 (double dissonance de tierce et quinte)',
    build(sc){
      // Prép I : B=Do, T=Do, A=Mi, S=Sol  → degs=[1,1,3,5]
      // Retard ⁶₄ sur Sol : B=Sol, T=Do, A=Mi, S=Do → degs=[5,1,3,1]   Do=4 et Mi=6 au-dessus de Sol
      // Rés V (⁵₃) : B=Sol, T=Si, A=Ré, S=Si → degs=[5,7,2,7]   Do→Si (4→3), Mi→Ré (6→5)
      return [
        { figured:'5\n3', label:'Prép.', midi: CAD_chord(sc, [1,1,3,5], [3,3,4,4]) },
        { figured:'6\n4', label:'Retard', midi: CAD_chord(sc, [5,1,3,1], [3,3,4,4]) },
        { figured:'5\n3', label:'Rés.', midi: CAD_chord(sc, [5,7,2,7], [3,3,4,4]) }
      ];
    }
  },

  { id:'ret_7_64', cat:'sixfour',
    name:{fr:'Retard 7–6 sur six-quatre',en:'7–6 Retardation on six-four',es:'Retardo 7–6 sobre seis-cuatro'},
    figure:'⁶₄ / 7–6',
    desc:{
      fr:'Sur le six-quatre de dominante, la 7e retarde la 6e (Fa → Mi au-dessus de Sol). Préparation : Fa préparé. Catel Art. VII.',
      en:'On the dominant six-four, the 7th retards the 6th (F → E above G). Preparation: F prepared. Catel Art. VII.',
      es:'Sobre el seis-cuatro de dominante, la 7ª retarda la 6ª (Fa → Mi sobre Sol). Catel Art. VII.'
    },
    source:'Catel, Art. VII, p.24',
    build(sc){
      // Prép V⁷ : B=Sol, T=Do, A=Ré, S=Fa  → degs=[5,1,2,4]   Hmm Do n'est pas dans V⁷
      // Reformulons. Préparons Fa par IV ou V⁷ :
      // Prép IV : B=Fa, T=Do, A=Fa, S=La  → degs=[4,1,4,6]   Fa au ténor = consonance
      // Retard 7/4 sur Sol : B=Sol, T=Do, A=Fa, S=La → degs=[5,1,4,6]
      //   Fa = 7 au-dessus de Sol, Do = 4 au-dessus de Sol, La = 9 ... non, c'est 2.
      // Hmm il faut que La se résolve aussi.
      // Simplifions : juste 7→6 sans le 4 :
      // Prép : B=Fa, T=Do, A=Mi, S=Fa → manque la quinte... → IV: degs=[4,1,3,4]? Non Mi pas dans IV.
      // Bon prép IV : B=Fa, T=Do, A=Fa, S=La → degs=[4,1,4,6]
      // Retard : B=Sol, T=Do, A=Fa (susp 7), S=Do → degs=[5,1,4,1]
      //   La descend sur Sol au sop ?  La → Sol = 6→5, mais on retarde 6 ici, donc sop devrait être Do (= 4)
      // Reformulons clairement :
      // Sur basse Sol (6/4 de Do) : 6 = Mi, 4 = Do
      // Retard 7-6 : 7 = Fa retarde la 6 (Mi)
      // Donc pendant le retard : voicing a Fa (7) au lieu de Mi (6)
      // Retard : B=Sol, T=Do (4), A=Fa (7 susp), S=Do (4) → degs=[5,1,4,1]
      // Rés 6/4 : B=Sol, T=Do (4), A=Mi (6), S=Do (4) → degs=[5,1,3,1]
      return [
        { figured:'5\n3', label:'Prép.', midi: CAD_chord(sc, [4,1,4,6], [3,3,4,4]) },
        { figured:'7\n4', label:'Retard', midi: CAD_chord(sc, [5,1,4,1], [3,3,4,4]) },
        { figured:'6\n4', label:'Rés.', midi: CAD_chord(sc, [5,1,3,1], [3,3,4,4]) }
      ];
    }
  },

  { id:'ret_5_64', cat:'sixfour',
    name:{fr:'Retard 5–4 sur six-quatre',en:'5–4 Retardation on six-four',es:'Retardo 5–4 sobre seis-cuatro'},
    figure:'⁶₅ → ⁶₄',
    desc:{
      fr:'Sur le six-quatre de dominante, la 5e retarde la 4e (Ré → Do au-dessus de Sol). Catel Art. VII.',
      en:'On the dominant six-four, the 5th retards the 4th (D → C above G). Catel Art. VII.',
      es:'Sobre el seis-cuatro de dominante, la 5ª retarda la 4ª (Re → Do sobre Sol). Catel Art. VII.'
    },
    source:'Catel, Art. VII, p.25',
    build(sc){
      // Prép V : B=Sol, T=Si, A=Ré, S=Sol  → degs=[5,7,2,5]
      // Retard 6/5 sur Sol : B=Sol, T=Mi (6), A=Ré (susp 5), S=Sol → degs=[5,3,2,5]
      // Rés 6/4 : B=Sol, T=Mi (6), A=Do (4), S=Sol → degs=[5,3,1,5]   Ré→Do (5→4)
      return [
        { figured:'5\n3', label:'Prép.', midi: CAD_chord(sc, [5,7,2,5], [3,3,4,4]) },
        { figured:'6\n5', label:'Retard', midi: CAD_chord(sc, [5,3,2,5], [3,3,4,4]) },
        { figured:'6\n4', label:'Rés.', midi: CAD_chord(sc, [5,3,1,5], [3,3,4,4]) }
      ];
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // ── DOUBLES & TRIPLES RETARDS ──
  // Catel Art. VII, p.25-28
  // ═══════════════════════════════════════════════════════════════

  { id:'ret_98_43', cat:'double',
    name:{fr:'Double retard 9–8 + 4–3',en:'Double Retardation 9–8 + 4–3',es:'Doble retardo 9–8 + 4–3'},
    figure:'9–8 + 4–3',
    desc:{
      fr:'Sur l\'accord parfait, l\'octave et la tierce sont retardées simultanément par la 9e et la 4e. Préparation : V⁷ (Sol-Si-Ré-Fa) où Ré et Fa sont les 5e et 7e du V. Catel Art. VII.',
      en:'On the common chord, octave and third are simultaneously retarded by 9th and 4th. Preparation: V⁷ (G-B-D-F) where D and F are 5th and 7th of V. Catel Art. VII.',
      es:'En el acorde perfecto, la octava y la tercera retardadas simultáneamente por 9ª y 4ª. Catel Art. VII.'
    },
    source:'Catel, Art. VII, p.27',
    build(sc){
      // Prép V⁷ : B=Sol, T=Si, A=Fa, S=Ré  → degs=[5,7,4,2]   Ré (5 du V) au sop, Fa (7) à l'alto
      // Retard I : B=Do, T=Do (Si→Do), A=Fa (susp 4), S=Ré (susp 9) → degs=[1,1,4,2]
      // Rés    I : B=Do, T=Do, A=Mi (Fa→Mi), S=Do (Ré→Do) → degs=[1,1,3,1]
      return [
        { figured:'7\n5\n3', label:'Prép.', midi: CAD_chord(sc, [5,7,4,2], [3,3,4,4]) },
        { figured:'9\n4', label:'Retard', midi: CAD_chord(sc, [1,1,4,2], [3,3,4,4]) },
        { figured:'5\n3', label:'Rés.', midi: CAD_chord(sc, [1,1,3,1], [3,3,4,4]) }
      ];
    }
  },

  { id:'ret_43_65', cat:'double',
    name:{fr:'Double retard 4–3 + 6–5',en:'Double Retardation 4–3 + 6–5',es:'Doble retardo 4–3 + 6–5'},
    figure:'6–5 + 4–3',
    desc:{
      fr:'Sur l\'accord parfait, la quinte et la tierce sont retardées simultanément par la 6e et la 4e. Produit un accord de six-quatre dissonant qui résout sur l\'accord parfait. Catel Art. VII.',
      en:'On the common chord, fifth and third are simultaneously retarded by 6th and 4th. Produces a dissonant six-four resolving to the common chord. Catel Art. VII.',
      es:'En el acorde perfecto, quinta y tercera retardadas simultáneamente por 6ª y 4ª. Catel Art. VII.'
    },
    source:'Catel, Art. VII, p.24',
    build(sc){
      // Prép IV : B=Fa, T=Do, A=Fa, S=La  → degs=[4,1,4,6]    Fa et La consonances
      // Retard I : B=Do, T=Do, A=Fa (susp 4), S=La (susp 6) → degs=[1,1,4,6]
      // Rés    I : B=Do, T=Do, A=Mi (4→3), S=Sol (6→5) → degs=[1,1,3,5]
      return [
        { figured:'5\n3', label:'Prép.', midi: CAD_chord(sc, [4,1,4,6], [3,3,4,4]) },
        { figured:'6\n4', label:'Retard', midi: CAD_chord(sc, [1,1,4,6], [3,3,4,4]) },
        { figured:'5\n3', label:'Rés.', midi: CAD_chord(sc, [1,1,3,5], [3,3,4,4]) }
      ];
    }
  },

  { id:'ret_76_43', cat:'double',
    name:{fr:'Double retard 7–6 + 4–3',en:'Double Retardation 7–6 + 4–3',es:'Doble retardo 7–6 + 4–3'},
    figure:'7–6 + 4–3',
    desc:{
      fr:'Sur l\'accord de sixte (basse Mi), la 6e (Do) et la 3e (Sol) sont retardées simultanément par la 7e (Ré) et la 4e (La). Catel Art. VII.',
      en:'On the sixth chord (bass E), the 6th (C) and 3rd (G) are simultaneously retarded by the 7th (D) and 4th (A). Catel Art. VII.',
      es:'En el acorde de sexta, la 6ª y la 3ª retardadas simultáneamente por la 7ª y la 4ª. Catel Art. VII.'
    },
    source:'Catel, Art. VII, p.27',
    build(sc){
      // Prép ii (Ré-Fa-La) : B=Ré, T=La, A=Ré, S=Fa  → degs=[2,6,2,4]
      //   Hmm Ré au ténor et basse = doublure. Mieux :
      // Prép ii⁷ : B=Ré, T=Fa, A=La, S=Do → degs=[2,4,6,1]    Ré (basse, fond.) et La (alto, quinte)
      // Retard I⁶ : B=Mi, T=Sol, A=La (susp 4), S=Ré (susp 7) → degs=[3,5,6,2]
      // Rés I⁶ : B=Mi, T=Sol, A=Sol (4→3=Sol au-dessus Mi), S=Do (7→6) → degs=[3,5,5,1]
      return [
        { figured:'7\n5\n3', label:'Prép.', midi: CAD_chord(sc, [2,4,6,1], [3,3,4,4]) },
        { figured:'7\n4', label:'Retard', midi: CAD_chord(sc, [3,5,6,2], [3,3,4,4]) },
        { figured:'6\n3', label:'Rés.', midi: CAD_chord(sc, [3,5,5,1], [3,3,4,4]) }
      ];
    }
  },

  { id:'ret_triple', cat:'double',
    name:{fr:'Triple retard 9–8 + 7–8 + 4–3',en:'Triple Retardation 9–8 + 7–8 + 4–3',es:'Triple retardo 9–8 + 7–8 + 4–3'},
    figure:'9 + 7 + 4',
    desc:{
      fr:'Trois retards simultanés sur l\'accord parfait : la 9e (Ré → Do), la 7e (Si → Do = sensible montant) et la 4e (Fa → Mi). Catel Art. VII (triple dissonance).',
      en:'Three simultaneous retardations on the common chord: 9th (D → C), 7th (B → C = leading tone), and 4th (F → E). Catel Art. VII.',
      es:'Tres retardos simultáneos: 9ª, 7ª (sensible) y 4ª. Catel Art. VII.'
    },
    source:'Catel, Art. VII, p.28 (triple dissonance)',
    build(sc){
      // Préparation V⁷ avec Si, Ré, Fa tous présents :
      // Prép V⁷ : B=Sol, T=Fa, A=Si, S=Ré  → degs=[5,4,7,2]   Fa (7 du V), Si (3 du V), Ré (5 du V)
      // Retard I : B=Do, T=Fa (susp 4), A=Si (susp 7), S=Ré (susp 9) → degs=[1,4,7,2]
      // Rés    I : B=Do, T=Mi (4→3), A=Do (7→8 sensible→tonique), S=Do (9→8) → degs=[1,3,1,1]
      return [
        { figured:'7\n5\n3', label:'Prép.', midi: CAD_chord(sc, [5,4,7,2], [3,3,4,4]) },
        { figured:'9\n7\n4', label:'Retard', midi: CAD_chord(sc, [1,4,7,2], [3,3,4,4]) },
        { figured:'5\n3', label:'Rés.', midi: CAD_chord(sc, [1,3,1,1], [3,3,4,4]) }
      ];
    }
  },

  { id:'ret_26_fond', cat:'double',
    name:{fr:'Double retard basse+sixte (2+6)',en:'Double Retardation bass+6th (2+6)',es:'Doble retardo bajo+6ª (2+6)'},
    figure:'2 (basse) + 6',
    desc:{
      fr:'La fondamentale (basse) est retardée ET la quinte est retardée par la 6e simultanément. Catel Art. VII : "Double dissonance de seconde et sixte, retardant la note fondamentale et l\'octave dans l\'accord parfait" (p.25).',
      en:'The root (bass) is retarded AND the fifth is retarded by the 6th simultaneously. Catel Art. VII p.25.',
      es:'La fundamental (bajo) y la quinta retardadas simultáneamente. Catel Art. VII, p.25.'
    },
    source:'Catel, Art. VII, p.25 (double dissonance de seconde et sixte)',
    build(sc){
      // Prép ii : B=Ré, T=La, A=Ré, S=Fa  → degs=[2,6,2,4]
      // Retard : basse tient Ré (= 2 au-dessus du Do attendu), soprano tient La (= 6 au-dessus de Do)
      //   B=Ré (susp), T=Sol, A=Do, S=La (susp 6) → degs=[2,5,1,6]
      // Rés I : B=Do, T=Mi, A=Do, S=Sol → degs=[1,3,1,5]    Ré→Do (basse), La→Sol (sop), Sol→Mi (ten descend)
      return [
        { figured:'5\n3', label:'Prép.', midi: CAD_chord(sc, [2,6,2,4], [3,3,4,4]) },
        { figured:'6\n5\n2', label:'Retard', midi: CAD_chord(sc, [2,5,1,6], [3,3,4,4]) },
        { figured:'5\n3', label:'Rés.', midi: CAD_chord(sc, [1,3,1,5], [3,3,4,4]) }
      ];
    }
  },

  { id:'ret_43_dim7', cat:'double',
    name:{fr:'Retard 4–3 sur accord de 7e diminuée',en:'4–3 Retardation on diminished 7th',es:'Retardo 4–3 sobre acorde de 7ª disminuida'},
    figure:'°7 / 4–3',
    desc:{
      fr:'En mode mineur, la tierce de la septième diminuée (Ré, au-dessus de la sensible Si) est retardée par la quarte (Mi♭). La 7e dim. agit comme dominante. Catel Art. VII.',
      en:'In minor mode, the third of the diminished seventh (D, above leading tone B) is retarded by the fourth (E♭). The dim.7 acts as dominant. Catel Art. VII.',
      es:'En modo menor, la tercera de la séptima disminuida (Re, sobre la sensible Si) es retardada por la cuarta (Mi♭). Catel Art. VII.'
    },
    source:'Catel, Art. VII, p.28 (Ex. retard 4-3 sur 7e diminuée)',
    build(sc){
      // En Do mineur : vii°⁷ = Si - Ré - Fa - Lab. La 3e (Ré) au-dessus de la basse Si est retardée par Mib (4).
      // Détection mode pour utiliser le bon Mib et Lab :
      const isMinor = ((sc[2] - sc[0] + 12) % 12) === 3;
      const b3 = isMinor ? sc[2] : (sc[2] - 1 + 12) % 12;
      const b6 = isMinor ? sc[5] : (sc[5] - 1 + 12) % 12;
      // Prép i (mineur emprunté ou réel) : B=Do, T=Sol, A=Mib, S=Do
      // Retard vii°⁷ avec Mib retardant Ré : B=Si, T=Fa, A=Mib (susp 4), S=Lab
      // Rés vii°⁷ : B=Si, T=Fa, A=Ré, S=Lab
      return [
        { figured:'5\n3', label:'Prép.', midi: CAD_chordPC([sc[0], sc[4], b3, sc[0]], [3,3,4,4]) },
        { figured:'°7\n4', label:'Retard', midi: CAD_chordPC([sc[6], sc[3], b3, b6], [3,3,4,4]) },
        { figured:'°7\n3', label:'Rés.', midi: CAD_chordPC([sc[6], sc[3], sc[1], b6], [3,3,4,4]) }
      ];
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // ── PROLONGATIONS ENTIÈRES (accord entier prolongé) ──
  // Catel Art. VII, p.29-30
  // ═══════════════════════════════════════════════════════════════

  { id:'ret_v7_sus_tonic', cat:'prolong',
    name:{fr:'V⁷ prolongé sur tonique (onzième tonique)',en:'V⁷ sustained over tonic (11th of tonic)',es:'V⁷ prolongado sobre tónica'},
    figure:'7 sur I',
    desc:{
      fr:'L\'accord de septième dominante entier est prolongé sur la basse de tonique, retardant l\'accord parfait. Catel : "septième superflue" ou "onzième tonique" (Art. VII, p.29).',
      en:'The entire dominant seventh chord is sustained over the tonic bass, retarding the common chord. Catel calls this "superfluous seventh" or "tonic eleventh" (Art. VII, p.29).',
      es:'El acorde de séptima dominante entero prolongado sobre el bajo de tónica. Catel: "séptima superflua" (Art. VII, p.29).'
    },
    source:'Catel, Art. VII, p.29',
    build(sc){
      // Prép V⁷ : B=Sol, T=Ré, A=Fa, S=Si  → degs=[5,2,4,7]
      // Retard : B=Do (basse change), T=Ré, A=Fa, S=Si (toutes les voix supérieures tenues)
      //   → degs=[1,2,4,7]
      // Rés I : B=Do, T=Do (Ré→Do descente conjointe), A=Mi (Fa→Mi), S=Do (Si→Do sensible)
      //   → degs=[1,1,3,1]
      return [
        { figured:'7\n5\n3', label:'Prép.', midi: CAD_chord(sc, [5,2,4,7], [3,3,4,4]) },
        { figured:'7\n5\n3', label:'Retard', midi: CAD_chord(sc, [1,2,4,7], [3,3,4,4]) },
        { figured:'5\n3', label:'Rés.', midi: CAD_chord(sc, [1,1,3,1], [3,3,4,4]) }
      ];
    }
  },

  { id:'ret_v7_sus_med', cat:'prolong',
    name:{fr:'V⁷ prolongé sur médiante (treizième tonique)',en:'V⁷ sustained over mediant',es:'V⁷ prolongado sobre mediante'},
    figure:'V⁷ / III',
    desc:{
      fr:'L\'accord de septième dominante entier est prolongé sur la médiante (3e degré), retardant l\'accord de sixte. Catel : "septième superflue avec sixte majeure" ou "treizième tonique" (Art. VII, p.29).',
      en:'The entire dominant seventh chord is sustained over the mediant (3rd degree). Catel: "superfluous seventh with major sixth" or "tonic thirteenth" (Art. VII, p.29).',
      es:'El V⁷ entero prolongado sobre la mediante. Catel, Art. VII, p.29.'
    },
    source:'Catel, Art. VII, p.29',
    build(sc){
      // Prép V⁷ : B=Sol, T=Ré, A=Fa, S=Si  → degs=[5,2,4,7]
      // Retard : B=Mi, T=Ré, A=Fa, S=Si → degs=[3,2,4,7]    V⁷ tenu au-dessus de Mi basse
      // Rés I⁶ : B=Mi, T=Do, A=Mi, S=Do → degs=[3,1,3,1]    Ré→Do, Fa→Mi, Si→Do
      return [
        { figured:'7\n5\n3', label:'Prép.', midi: CAD_chord(sc, [5,2,4,7], [3,3,4,4]) },
        { figured:'7\n5\n3', label:'Retard', midi: CAD_chord(sc, [3,2,4,7], [3,3,4,4]) },
        { figured:'6\n3', label:'Rés.', midi: CAD_chord(sc, [3,1,3,1], [3,3,4,4]) }
      ];
    }
  },

  { id:'ret_dim7_sus_tonic', cat:'prolong',
    name:{fr:'vii°⁷ prolongé sur tonique (mode mineur)',en:'vii°⁷ sustained over tonic (minor mode)',es:'vii°⁷ prolongado sobre tónica (modo menor)'},
    figure:'°7 sur i',
    desc:{
      fr:'L\'accord de septième diminuée entier est prolongé sur la basse de tonique en mode mineur. Catel : "septième superflue avec sixte mineure" (Art. VII, p.30).',
      en:'The entire diminished seventh chord is sustained over the tonic bass in minor mode. Catel: "superfluous seventh with minor sixth" (Art. VII, p.30).',
      es:'El acorde de séptima disminuida entero prolongado sobre el bajo de tónica en modo menor. Catel, Art. VII, p.30.'
    },
    source:'Catel, Art. VII, p.30',
    build(sc){
      // En Do mineur : vii°⁷ = Si - Ré - Fa - Lab
      const isMinor = ((sc[2] - sc[0] + 12) % 12) === 3;
      const b6 = isMinor ? sc[5] : (sc[5] - 1 + 12) % 12;
      const b3 = isMinor ? sc[2] : (sc[2] - 1 + 12) % 12;
      // Prép vii°⁷ : B=Si, T=Ré, A=Fa, S=Lab  → utilise CAD_chordPC
      // Retard : B=Do (basse change), T=Ré, A=Fa, S=Lab (toutes voix sup. tenues)
      // Rés i mineur : B=Do, T=Do (Ré→Do), A=Mib (Fa→Mib), S=Sol (Lab→Sol)
      return [
        { figured:'°7', label:'Prép.', midi: CAD_chordPC([sc[6], sc[1], sc[3], b6], [3,3,4,4]) },
        { figured:'°7\n/i', label:'Retard', midi: CAD_chordPC([sc[0], sc[1], sc[3], b6], [3,3,4,4]) },
        { figured:'5\n3', label:'Rés.', midi: CAD_chordPC([sc[0], sc[0], b3, sc[4]], [3,3,4,4]) }
      ];
    }
  },

  { id:'ret_dim7_sus_med', cat:'prolong',
    name:{fr:'vii°⁷ prolongé sur médiante (quinte aug.)',en:'vii°⁷ sustained over mediant (aug.5)',es:'vii°⁷ prolongado sobre mediante'},
    figure:'°7 / III',
    desc:{
      fr:'L\'accord de septième diminuée prolongé sur la médiante (Mi♭ en Do mineur). Forme une quinte augmentée entre la médiante et la sensible. Catel Art. VII, p.30.',
      en:'The diminished seventh sustained over the mediant (E♭ in C minor). Forms an augmented fifth between mediant and leading tone. Catel Art. VII, p.30.',
      es:'La séptima disminuida prolongada sobre la mediante (Mi♭ en Do menor). Forma quinta aumentada. Catel Art. VII, p.30.'
    },
    source:'Catel, Art. VII, p.30',
    build(sc){
      const isMinor = ((sc[2] - sc[0] + 12) % 12) === 3;
      const b6 = isMinor ? sc[5] : (sc[5] - 1 + 12) % 12;
      const b3 = isMinor ? sc[2] : (sc[2] - 1 + 12) % 12;
      // Prép vii°⁷ : B=Si, T=Ré, A=Fa, S=Lab
      // Retard : B=Mib (médiante mineure), T=Ré, A=Fa, S=Lab (vii°⁷ tenu sur Mib)
      // Rés i⁶ : B=Mib, T=Do (Ré→Do), A=Mib (Fa→Mib... mais Fa→Mib c'est la note d'arrivée?)
      //   En fait i⁶ = Mib-Sol-Do. Donc B=Mib, harmonie Mib-Sol-Do au-dessus.
      // Rés : B=Mib, T=Do, A=Sol, S=Do → CAD_chordPC([b3, sc[0], sc[4], sc[0]])
      return [
        { figured:'°7', label:'Prép.', midi: CAD_chordPC([sc[6], sc[1], sc[3], b6], [3,3,4,4]) },
        { figured:'°7\n+5', label:'Retard', midi: CAD_chordPC([b3, sc[1], sc[3], b6], [3,3,4,4]) },
        { figured:'6\n3', label:'Rés.', midi: CAD_chordPC([b3, sc[0], sc[4], sc[0]], [3,3,4,4]) }
      ];
    }
  }
];

const RET_CATS = [
  { id:'common',  name:{fr:'Sur accord parfait',en:'On common chord',es:'Sobre acorde perfecto'} },
  { id:'sixth',   name:{fr:'Sur accord de sixte',en:'On sixth chord',es:'Sobre acorde de sexta'} },
  { id:'sixfour', name:{fr:'Sur six-quatre',en:'On six-four chord',es:'Sobre acorde de seis-cuatro'} },
  { id:'double',  name:{fr:'Doubles & Triples retards',en:'Double & Triple retardations',es:'Retardos dobles y triples'} },
  { id:'prolong', name:{fr:'Prolongations entières (Art. VII p.29-30)',en:'Whole-chord prolongations (Art. VII p.29-30)',es:'Prolongaciones enteras (Art. VII p.29-30)'} }
];
function RET_computeChords(){
  const ret = RET_DB.find(r => r.id === RET_S.retId);
  if(!ret) return [];
  const sc = CAD_getScale(RET_S.key, RET_S.mode);
  const chords = ret.build(sc, RET_S.key, RET_S.mode);
  // Apply same voice-order correction as CAD
  const effKey = RET_S.key;
  chords.forEach(ch => {
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
  });
  return chords;
}

function RET_renderStaffSVG(){
  // Reuse CAD staff machinery but for 3 chords with labels
  const retEntry = RET_DB.find(r => r.id === RET_S.retId);
  if(!retEntry) return '';

  // Save state, temporarily hijack CAD for rendering
  const savedId = CAD_S.cadId;
  const savedMode = CAD_S.mode;
  const savedKey = CAD_S.key;

  // Build a temp entry in CAD_DB style
  const sc = CAD_getScale(RET_S.key, RET_S.mode);
  const rawChords = retEntry.build(sc, RET_S.key, RET_S.mode);

  // Render manually using same SVG approach
  const LS = 11;
  const gapBetweenStaves = 26;
  const tTop = 46;
  const bTop = tTop + 4*LS + gapBetweenStaves;
  const H = bTop + 4*LS + 105;
  const leftMargin = 70;
  const chordSpacing = 90;
  const W = leftMargin + rawChords.length * chordSpacing + 60;
  const tY = i => tTop + i * LS;
  const bY = i => bTop + i * LS;
  const BBOT = bY(4);

  const ksN = (RET_S.mode === 'major' ? CAD_KS_MAJ[RET_S.key] : CAD_KS_MIN[RET_S.key]) || 0;
  const sharpDiaPC = [0,0,1,1,2,3,3,4,4,5,5,6];
  const flatDiaPC  = [0,1,1,2,2,3,4,4,5,5,6,6];
  const diaMap = ksN > 0 ? sharpDiaPC : flatDiaPC;
  const shOrder = [3,0,4,1,5,2,6];
  const flOrder = [6,2,5,1,4,0,3];

  function midiToDia(midi){
    const pc = ((midi%12)+12)%12;
    const oct = Math.floor(midi/12) - 1;
    return oct * 7 + diaMap[pc];
  }
  function midiToTrebleY(midi){ const d = midiToDia(midi) - midiToDia(60); return tY(4) - (d - 2) * (LS/2); }
  function midiToBassY(midi){ const d = midiToDia(midi) - midiToDia(40); return bY(4) - (d - 2) * (LS/2); }

  const tSharpY = [tY(0), tY(1)+LS/2, tY(0)-LS/2, tY(1), tY(2)+LS/2, tY(1)-LS/2, tY(2)];
  const tFlatY  = [tY(2), tY(0)+LS/2, tY(2)+LS/2, tY(1), tY(3)+LS/2, tY(1)+LS/2, tY(3)];
  const bSharpY = tSharpY.map(y => y + (bTop - tTop) + LS);
  const bFlatY  = tFlatY.map(y => y + (bTop - tTop) + LS);

  const SC = '#1e1e2e';
  let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:${W}px;height:${H}px;display:block">`;

  // Brace
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
  const s = LS / 250;
  const cx = sX1 + 3;
  svg += `<g transform="translate(${cx}, ${tY(3)}) scale(${s}, ${-s})">`;
  svg += `<path d="M376 415Q375 424 376 427Q378 430 382 434Q465 510 518 605Q570 700 572 815Q572 881 555 942Q538 1002 507 1048Q495 1066 480 1081Q464 1097 455 1098Q444 1097 425 1082Q406 1067 390 1050Q335 987 313 903Q291 819 292 739Q292 695 296 651Q301 607 306 575Q308 567 307 562Q306 558 297 551Q184 463 95 350Q5 237 0 87Q0 -48 90 -148Q180 -247 364 -252Q382 -252 400 -250Q418 -249 433 -246Q441 -244 444 -245Q447 -246 448 -255Q458 -307 466 -363Q474 -419 475 -456Q471 -563 418 -594Q365 -625 316 -622Q276 -621 256 -612Q236 -603 236 -593Q236 -588 243 -584Q251 -581 268 -576Q293 -570 313 -547Q334 -525 335 -482Q335 -440 310 -410Q285 -381 239 -380Q188 -381 160 -414Q132 -447 132 -495Q130 -548 170 -601Q211 -654 322 -658Q378 -661 446 -622Q513 -582 519 -458Q518 -413 509 -353Q499 -293 490 -244Q488 -236 491 -233Q493 -231 503 -227Q580 -196 625 -135Q670 -74 671 11Q670 110 606 180Q542 249 430 252Q411 251 407 254Q402 257 401 270ZM470 943Q495 943 512 923Q529 902 530 861Q527 778 473 710Q419 643 356 591Q351 586 348 588Q344 589 343 599Q340 619 339 643Q337 667 337 691Q340 809 381 876Q422 942 470 943ZM361 262Q364 249 361 245Q359 242 346 238Q279 214 241 162Q202 109 201 44Q202 -24 233 -70Q264 -115 316 -133Q322 -135 330 -137Q337 -139 343 -139Q349 -139 352 -136Q355 -133 355 -128Q355 -123 350 -120Q346 -117 340 -115Q308 -101 288 -72Q269 -43 268 -8Q269 35 295 66Q322 96 368 109Q380 112 383 111Q387 109 388 101L438 -197Q440 -205 437 -207Q435 -209 424 -211Q412 -213 398 -215Q383 -216 368 -216Q235 -214 158 -150Q82 -86 80 20Q78 64 95 123Q113 181 173 252Q218 301 254 334Q291 366 326 394Q333 400 336 399Q339 398 340 390ZM430 103Q428 112 430 115Q432 118 441 117Q503 110 545 66Q587 21 589 -46Q588 -94 563 -130Q538 -167 495 -188Q486 -193 483 -192Q480 -191 479 -182Z" fill="${SC}"/>`;
  svg += `</g>`;

  // Bass clef
  const sy2 = (LS/250)*1.35, sx2 = sy2*1.15;
  svg += `<g transform="translate(${sX1+2}, ${bY(1)}) scale(${sx2}, ${-sy2})">`;
  svg += `<path d="M162 170Q78 165 39 111Q0 56 0 6Q0 2 1 -3Q7 -48 31 -71Q55 -94 84 -94H88Q119 -92 144 -67Q168 -41 169 -10Q167 33 140 47Q112 60 89 59H70Q60 59 57 64Q54 68 54 73Q54 75 55 76Q55 77 55 77Q74 115 98 126Q122 137 137 136Q189 134 208 99Q227 63 231 17Q231 16 232 15Q232 13 232 9Q233 0 234 -9Q234 -19 234 -28Q235 -120 203 -195Q171 -270 98 -327Q75 -345 49 -358Q24 -371 -2 -385Q-9 -390 -12 -395Q-15 -400 -15 -403Q-15 -407 -10 -410Q-5 -414 -2 -414Q57 -411 117 -373Q176 -335 215 -295Q267 -244 307 -170Q348 -97 350 -22V-18Q348 34 331 68Q313 102 288 122Q245 154 207 163Q169 171 166 170ZM418 127Q399 127 387 115Q374 102 374 84Q374 65 387 52Q399 39 418 39Q437 39 449 52Q462 65 462 84Q462 102 449 115Q437 127 418 127ZM418 -41Q400 -41 388 -54Q376 -66 375 -85Q376 -103 388 -116Q400 -128 418 -129Q437 -128 450 -116Q463 -103 463 -85Q463 -66 450 -54Q437 -41 418 -41Z" fill="${SC}"/>`;
  svg += `</g>`;

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
    if(d===0){ if(ksSet.has(dia)) return '♮'; return null; }
    if(d===1) return '♯';
    if(d===11) return '♭';
    if(d===2) return '𝄪';
    if(d===10) return '𝄫';
    return null;
  }

  const colors = ['#e74c3c','#e67e22','#2ecc71','#3498db'];
  const labels_role = ['B','T','A','S'];

  // Draw each chord (3 moments)
  const noteWidth = 7;
  rawChords.forEach((ch, ci) => {
    const x = startX + ci * chordSpacing;

    // (no vertical separator between chords — Catel-style continuous staff)

    // Label (Prép./Retard/Rés.) at top
    const lbl = ch.label || '';
    const isRetard = lbl.includes('Retard') || lbl.includes('Ret');
    const lblColor = isRetard ? '#c0392b' : '#534AB7';
    svg += `<text x="${x}" y="${tY(0)-14}" font-size="9" fill="${lblColor}" font-family="sans-serif" text-anchor="middle" font-weight="${isRetard?'700':'400'}">${lbl}</text>`;

    // Figured bass (Catel-style arabic numerals, e.g. "5-4-3", "9-8", "7-6")
    const fig = ch.figured || '';
    if(fig){
      const figLines = fig.split('\n');
      figLines.forEach((line, fi) => {
        svg += `<text x="${x}" y="${BBOT+14+fi*11}" font-size="10" fill="${SC}" font-family="serif" text-anchor="middle" font-style="italic">${line}</text>`;
      });
    }

    ch.midi.forEach((m, vi) => {
      const isTreble = vi >= 2;
      const fy = isTreble ? midiToTrebleY(m) : midiToBassY(m);
      const col = colors[vi];

      // Ledger lines
      if(isTreble){
        const midC = midiToTrebleY(60);
        if(m < 60){ for(let ly = tY(4)+LS/2; ly <= fy; ly += LS) svg += `<line x1="${x-10}" y1="${ly}" x2="${x+10}" y2="${ly}" stroke="${SC}" stroke-width="0.6" opacity="0.5"/>`; }
        if(fy < tY(0)){ for(let ly = tY(0)-LS/2; ly >= fy; ly -= LS) svg += `<line x1="${x-10}" y1="${ly}" x2="${x+10}" y2="${ly}" stroke="${SC}" stroke-width="0.6" opacity="0.5"/>`; }
      } else {
        if(fy < bY(0)){ for(let ly = bY(0)-LS/2; ly >= fy; ly -= LS) svg += `<line x1="${x-10}" y1="${ly}" x2="${x+10}" y2="${ly}" stroke="${SC}" stroke-width="0.6" opacity="0.5"/>`; }
        if(fy > BBOT){ for(let ly = BBOT+LS/2; ly <= fy; ly += LS) svg += `<line x1="${x-10}" y1="${ly}" x2="${x+10}" y2="${ly}" stroke="${SC}" stroke-width="0.6" opacity="0.5"/>`; }
      }

      // Accidental
      const acc = needAcc(m);
      if(acc) svg += `<text x="${x-noteWidth-5}" y="${fy+4}" font-size="12" fill="${col}" font-family="serif" text-anchor="middle">${acc}</text>`;

      // Note head (half note to show held quality)
      svg += `<ellipse cx="${x}" cy="${fy}" rx="${noteWidth}" ry="${LS*0.38}" fill="${col}" opacity="0.9"/>`;
      svg += `<ellipse cx="${x}" cy="${fy}" rx="${noteWidth-2.5}" ry="${LS*0.22}" fill="${isRetard?'none':'white'}" opacity="${isRetard?0:0.6}"/>`;

      // Note name
      const nname = ch.names ? ch.names[vi] : '';
      svg += `<text x="${x+noteWidth+4}" y="${fy+4}" font-size="8" fill="${col}" opacity="0.7" font-family="sans-serif">${nname}</text>`;
    });

    // Tie lines for retarded notes (connect retard→resolution for same voice)
    if(ci === 1 && ci+1 < rawChords.length){
      const nextCh = rawChords[ci+1];
      ch.midi.forEach((m, vi) => {
        if(m === nextCh.midi[vi] || Math.abs(m - nextCh.midi[vi]) <= 2){
          const isTreble = vi >= 2;
          const y1 = isTreble ? midiToTrebleY(m) : midiToBassY(m);
          const x2 = startX + (ci+1) * chordSpacing;
          const y2 = isTreble ? midiToTrebleY(nextCh.midi[vi]) : midiToBassY(nextCh.midi[vi]);
          const my = (y1+y2)/2 + 6;
          svg += `<path d="M${x+noteWidth} ${y1} Q${(x+x2)/2} ${my} ${x2-noteWidth} ${y2}" fill="none" stroke="${colors[vi]}" stroke-width="1.2" opacity="0.5"/>`;
        }
      });
    }
  });

  // Final barline
  const endX = startX + (rawChords.length-1) * chordSpacing + 30;
  svg += `<line x1="${endX}" y1="${tY(0)}" x2="${endX}" y2="${tY(4)}" stroke="${SC}" stroke-width="0.8" opacity="0.4"/>`;
  svg += `<line x1="${endX}" y1="${bY(0)}" x2="${endX}" y2="${BBOT}" stroke="${SC}" stroke-width="0.8" opacity="0.4"/>`;

  svg += `</svg>`;
  return svg;
}

function RET_playSequence(){
  const chain = _cadGetChain();
  const ctx = chain.ctx;
  const chords = RET_computeChords();
  const now = ctx.currentTime + 0.05;
  chords.forEach((ch, ci) => {
    const t0 = now + ci * 1.4;
    ch.midi.forEach((m, ni) => {
      CAD_pianoNote(CAD_m2f(m), t0 + ni * 0.006 * (0.8 + Math.random()*0.4), 1.8, ctx, chain.dry, chain.wet, 0.25 + Math.random()*0.05);
    });
  });
  const btn = document.getElementById('ret_playBtn');
  if(btn){ btn.classList.add('playing'); setTimeout(()=>btn.classList.remove('playing'), chords.length*1400+800); }
}

function RET_render(){
  const target = document.getElementById('cad_app');
  if(!target) return;
  let h = '';

  // ══ Onglets navigation (même que CAD_render) ══
  h += `<div class="cad-tabs" style="display:flex;gap:4px;margin-bottom:8px">`;
  h += `<button class="pill" style="flex:1;padding:8px 4px;font-size:12px" onclick="window._cadTab='cadences';CAD_render()">${tx('Cadences','Cadences','Cadencias')}</button>`;
  h += `<button class="pill on" style="flex:1;padding:8px 4px;font-size:12px">${tx('Retards','Retardations','Retardos')}</button>`;
  h += `</div>`;

  h += `<div class="card"><div class="ctrl-row">`;
  h += `<div class="ctrl-col"><label>${t('t_key')}</label><select onchange="RET_S.key=window.CAD_KEY_PAIRS[this.value][RET_S.mode==='major'?'maj':'min'];RET_render()" id="ret_keySel">`;
  CAD_KEY_PAIRS.forEach((p,i) => {
    const k = RET_S.mode === 'major' ? p.maj : p.min;
    h += `<option value="${i}"${k === RET_S.key ? ' selected' : ''}>${p.maj} / ${p.min}m</option>`;
  });
  h += `</select></div>`;
  h += `<div class="ctrl-col"><label>Mode</label><div class="pills">`;
  h += `<button class="pill${RET_S.mode==='major'?' on':''}" onclick="RET_S.mode='major';RET_S.key=window.CAD_KEY_PAIRS[document.getElementById('ret_keySel').value].maj;RET_render()">${t('Major')}</button>`;
  h += `<button class="pill${RET_S.mode==='minor'?' on':''}" onclick="RET_S.mode='minor';RET_S.key=window.CAD_KEY_PAIRS[document.getElementById('ret_keySel').value].min;RET_render()">${t('Minor')}</button>`;
  h += `</div></div>`;
  h += `</div></div>`;

  const currentLang = window.currentLang || 'fr';

  h += `<div class="card"><div class="card-title">${tx('RETARDS — Catel Art. VII','RETARDATIONS — Catel Art. VII','RETARDOS — Catel Art. VII')}</div><div class="cad-list">`;
  RET_CATS.forEach(cat => {
    const items = RET_DB.filter(r => r.cat === cat.id);
    if(!items.length) return;
    h += `<div style="width:100%;margin-top:4px"><span style="font-size:11px;font-weight:700;color:#534AB7">${cat.name[currentLang]||cat.name.fr}</span></div>`;
    items.forEach(r => {
      h += `<button class="cad-btn${r.id===RET_S.retId?' on':''}" onclick="RET_S.retId='${r.id}';RET_render()">${r.name[currentLang]||r.name.fr}</button>`;
    });
  });
  h += `</div></div>`;

  const ret = RET_DB.find(r => r.id === RET_S.retId);
  if(ret){
    h += `<div class="info-badge"><span class="ib-label">${tx('Figure','Figure','Figura')} : <strong>${ret.figure}</strong> — ${ret.desc[currentLang]||ret.desc.fr}</span></div>`;
    h += `<div style="font-size:10px;color:#888;margin:4px 8px 0;font-style:italic">${tx('Référence','Reference','Referencia')} : ${ret.source}</div>`;
  }

  h += `<div class="staff-wrap" id="ret_staffArea">${RET_renderStaffSVG()}</div>`;

  h += `<div class="legend">`;
  h += `<div class="legend-item"><div class="legend-dot" style="background:#3498db"></div>Soprano</div>`;
  h += `<div class="legend-item"><div class="legend-dot" style="background:#2ecc71"></div>Alto</div>`;
  h += `<div class="legend-item"><div class="legend-dot" style="background:#e67e22"></div>${tx('Ténor','Tenor','Tenor')}</div>`;
  h += `<div class="legend-item"><div class="legend-dot" style="background:#e74c3c"></div>${tx('Basse','Bass','Bajo')}</div>`;
  h += `</div>`;

  h += `<div class="play-row">`;
  h += `<button class="play-btn" id="ret_playBtn" onclick="RET_playSequence()">▶ ${t('btn_listen')}</button>`;
  h += `<div style="font-size:10px;color:#888;margin-left:8px">${tx('Prép. → Retard → Résolution','Prep. → Retardation → Resolution','Prep. → Retardo → Resolución')}</div>`;
  h += `</div>`;

  target.innerHTML = h;
}

window.RET_S = RET_S;
window.RET_render = RET_render;
window.RET_playSequence = RET_playSequence;

})();

/* ── Init auto ── */
try{CAD_render()}catch(e){console.error('CAD:',e)}
