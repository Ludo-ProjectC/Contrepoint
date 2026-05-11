/* ═══════════════════════════════════════════════════════════════════
   analyseur.js — Module analyseur
   Chargé dynamiquement par main.js lors du premier accès à l'onglet.
   Toutes les fonctions/variables avec préfixe majuscule (T1, MOD, etc.)
   sont exposées sur window pour rétro-compat avec onclick="..."
   ═══════════════════════════════════════════════════════════════════ */
/* ═══ TAB 10: ANALYSEUR HARMONIQUE ═══ */

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
  let h=`<option value="">${t('ah_mn')}</option>`;
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
const AH_LM=50,AH_RM=20,AH_LS=11;
let AH_trebleTop,AH_bassTop,AH_canvasH;
function AH_calcLayout(){AH_trebleTop=42;AH_bassTop=AH_trebleTop+5*AH_LS+20;AH_canvasH=AH_bassTop+5*AH_LS+34;}
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
  el.innerHTML=AH_chords.map((c,i)=>`<div class="chord-lbl${i===AH_selChord?' sel':''}" onclick="AH_selectChord(${i})">${i+1}${c.symbol?' · '+c.symbol:''}</div>`).join('');
}

function AH_renderScore(){
  AH_calcLayout();const canvas=document.getElementById('ah_scoreCanvas'),ctx=canvas.getContext('2d'),dpr=window.devicePixelRatio||1;
  const cw=canvas.parentElement.clientWidth-28;canvas.style.width=cw+'px';canvas.style.height=AH_canvasH+'px';canvas.width=cw*dpr;canvas.height=AH_canvasH*dpr;ctx.scale(dpr,dpr);ctx.clearRect(0,0,cw,AH_canvasH);

  // Staff lines — style générateur séquentiel
  ctx.strokeStyle='#555';ctx.lineWidth=0.8;
  for(let s=0;s<2;s++){const top=s===0?AH_trebleTop:AH_bassTop;for(let l=0;l<5;l++){const y=top+l*AH_LS;ctx.beginPath();ctx.moveTo(AH_LM,y);ctx.lineTo(cw-AH_RM,y);ctx.stroke();}}
  // Left barline
  ctx.strokeStyle='#333';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(AH_LM,AH_trebleTop);ctx.lineTo(AH_LM,AH_bassTop+4*AH_LS);ctx.stroke();

  // Accolade — professional brace shape
  const brT=AH_trebleTop, brB=AH_bassTop+4*AH_LS, brM=(brT+brB)/2;
  const brX=AH_LM-3;
  ctx.fillStyle='#333';
  ctx.beginPath();
  // Top half: from top, curves left to the center point
  ctx.moveTo(brX, brT);
  ctx.bezierCurveTo(brX-8, brT, brX-12, brT+8, brX-12, brT+20);
  ctx.bezierCurveTo(brX-12, brM-15, brX-8, brM-8, brX-16, brM);
  // Bottom half: from center point, curves back right then down
  ctx.bezierCurveTo(brX-8, brM+8, brX-12, brM+15, brX-12, brB-20);
  ctx.bezierCurveTo(brX-12, brB-8, brX-8, brB, brX, brB);
  // Right side (thinner, return path)
  ctx.bezierCurveTo(brX-6, brB, brX-9, brB-10, brX-9, brB-22);
  ctx.bezierCurveTo(brX-9, brM+12, brX-5, brM+5, brX-13, brM);
  ctx.bezierCurveTo(brX-5, brM-5, brX-9, brM-12, brX-9, brT+22);
  ctx.bezierCurveTo(brX-9, brT+10, brX-6, brT, brX, brT);
  ctx.closePath();
  ctx.fill();

  // Clefs — Times New Roman, proportional to AH_LS, style séquentiel
  const trebleFS=AH_LS*5.4;
  ctx.fillStyle='#1e1e2e';ctx.textAlign='left';ctx.textBaseline='alphabetic';
  ctx.font=`${trebleFS}px "Times New Roman",Georgia,serif`;
  const tM=ctx.measureText('\uD834\uDD1E');
  const tH=(tM.actualBoundingBoxAscent||trebleFS*0.75)+(tM.actualBoundingBoxDescent||trebleFS*0.25);
  ctx.fillText('\uD834\uDD1E',AH_LM+3,(AH_trebleTop+3*AH_LS)+tH*0.38-(tM.actualBoundingBoxDescent||trebleFS*0.25));

  const bassFS=trebleFS*0.75;
  ctx.font=`${bassFS}px "Times New Roman",Georgia,serif`;
  const bM=ctx.measureText('\uD834\uDD22');
  const bH=(bM.actualBoundingBoxAscent||bassFS*0.8)+(bM.actualBoundingBoxDescent||bassFS*0.1);
  ctx.fillText('\uD834\uDD22',AH_LM+4,(AH_bassTop+AH_LS)-bH*0.15+(bM.actualBoundingBoxAscent||bassFS*0.8));

  // Time signature — after clef
  const ts=document.getElementById('ah_timeSigSel').value.split('/');
  ctx.font=`${trebleFS}px "Times New Roman",Georgia,serif`;
  const clefWidth=ctx.measureText('\uD834\uDD1E').width;
  const tsX=AH_LM + clefWidth + 12;
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

  if(!AH_chords.length) return;

  const csX=(window._ksEndX||AH_LM+40)+10,chW=Math.min(80,(cw-csX-AH_RM-10)/AH_chords.length),startX=csX;
  const noteSize=Math.max(4,Math.min(6,100/AH_chords.length));
  const errSet=new Set(AH_errors.map(e=>e.chord)),errSet2=new Set(AH_errors.map(e=>e.chord+1));

  AH_chords.forEach((ch,ci)=>{
    const x=startX+ci*chW+chW/2;
    if(errSet.has(ci)||errSet2.has(ci)){ctx.fillStyle='rgba(239,68,68,0.06)';ctx.fillRect(x-chW/2+2,AH_trebleTop-6,chW-4,AH_bassTop+4*AH_LS-AH_trebleTop+12);}
    if(ci===AH_selChord){ctx.fillStyle='rgba(83,74,183,0.06)';ctx.fillRect(x-chW/2+2,AH_trebleTop-6,chW-4,AH_bassTop+4*AH_LS-AH_trebleTop+12);}

    // Compute Y positions for all 4 voices, then displace seconds/unisons
    const voiceData=['S','A','T','B'].map(v=>{
      const midi=ch[v],{y,staff}=AH_midiToY(midi);
      return{v,midi,y,staff,color:AH_VCOLORS[v],xOff:0};
    });
    // Sort by Y (top to bottom = lowest Y first) to detect close notes
    const sorted=[...voiceData].sort((a,b)=>a.y-b.y);
    // Displace notes that are within AH_LS (a second apart or unison) — shift right
    for(let i=1;i<sorted.length;i++){
      if(Math.abs(sorted[i].y-sorted[i-1].y)<AH_LS*0.9){
        // Second or unison: offset the upper note to the right
        sorted[i].xOff=(noteSize+2)*2;
      }
    }

    voiceData.forEach(({v,midi,y,staff,color,xOff})=>{
      const nx=x+xOff;
      const tl=staff==='treble'?AH_trebleTop:AH_bassTop,bl=tl+4*AH_LS;
      ctx.strokeStyle='#888';ctx.lineWidth=0.8;
      if(y<tl)for(let ly=tl-AH_LS;ly>=y-1;ly-=AH_LS){ctx.beginPath();ctx.moveTo(nx-9,ly);ctx.lineTo(nx+9,ly);ctx.stroke();}
      if(y>bl)for(let ly=bl+AH_LS;ly<=y+1;ly+=AH_LS){ctx.beginPath();ctx.moveTo(nx-9,ly);ctx.lineTo(nx+9,ly);ctx.stroke();}
      if(staff==='treble'){const mcY=AH_midiToY(60).y;if(midi<=60&&mcY>=bl+AH_LS*0.8){ctx.beginPath();ctx.moveTo(nx-9,mcY);ctx.lineTo(nx+9,mcY);ctx.stroke();}}
      AH_drawNotehead(ctx,nx,y,color,noteSize);
      ctx.font=`${Math.max(7,9-AH_chords.length*0.15)}px "DM Sans",sans-serif`;ctx.fillStyle=color;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(AH_noteName(midi),nx+noteSize+5,y);
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
  const W=2480,H=1200;
  const c=document.createElement('canvas');c.width=W;c.height=H;
  const ctx=c.getContext('2d');
  ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);

  const pLM=160,pRM=80,pLS=30,pTT=80;
  const pBT=pTT+5*pLS+55;

  const keyEntry=AH_KEY_LIST[+document.getElementById('ah_keySel').value];
  const keyName=currentLang==='en'?keyEntry.nameEn:currentLang==='es'?keyEntry.nameEs:keyEntry.name;
  const tsVal=document.getElementById('ah_timeSigSel').value;

  // Staff lines
  ctx.strokeStyle='#000';ctx.lineWidth=2;
  for(let s=0;s<2;s++){const top=s===0?pTT:pBT;for(let l=0;l<5;l++){const y=top+l*pLS;ctx.beginPath();ctx.moveTo(pLM,y);ctx.lineTo(W-pRM,y);ctx.stroke();}}
  // Left barline
  ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(pLM,pTT);ctx.lineTo(pLM,pBT+4*pLS);ctx.stroke();

  // Brace
  ctx.lineWidth=5;ctx.strokeStyle='#000';
  const brX=pLM-25,brTop=pTT,brBot=pBT+4*pLS,brMid=(brTop+brBot)/2;
  ctx.beginPath();ctx.moveTo(brX,brTop);ctx.bezierCurveTo(brX-30,brTop+(brMid-brTop)*0.4,brX-30,brMid-35,brX-10,brMid);ctx.stroke();
  ctx.beginPath();ctx.moveTo(brX,brBot);ctx.bezierCurveTo(brX-30,brBot-(brBot-brMid)*0.4,brX-30,brMid+35,brX-10,brMid);ctx.stroke();

  // Clefs (using same glyph method as screen)
  ctx.fillStyle='#000';ctx.textAlign='left';ctx.textBaseline='alphabetic';
  const pTFS=pLS*5.6;
  ctx.font=pTFS+'px "Times New Roman",Georgia,serif';
  const ptM=ctx.measureText('\uD834\uDD1E'),ptH=(ptM.actualBoundingBoxAscent||pTFS*0.75)+(ptM.actualBoundingBoxDescent||pTFS*0.25);
  ctx.fillText('\uD834\uDD1E',pLM+8,(pTT+3*pLS)+ptH*0.38-(ptM.actualBoundingBoxDescent||pTFS*0.25));
  const pBFS=pTFS*0.75;
  ctx.font=pBFS+'px "Times New Roman",Georgia,serif';
  const pbM=ctx.measureText('\uD834\uDD22'),pbH=(pbM.actualBoundingBoxAscent||pBFS*0.8)+(pbM.actualBoundingBoxDescent||pBFS*0.1);
  ctx.fillText('\uD834\uDD22',pLM+10,(pBT+pLS)-pbH*0.15+(pbM.actualBoundingBoxAscent||pBFS*0.8));

  // Time signature — after clef (measure clef width)
  const tsP=tsVal.split('/');
  ctx.font=pTFS+'px "Times New Roman",Georgia,serif';
  const clefW=ctx.measureText('\uD834\uDD1E').width;
  const tsX=pLM+clefW+20;
  ctx.font='bold '+(pLS*2.4)+'px "Times New Roman",Georgia,serif';
  ctx.fillStyle='#000';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText(tsP[0],tsX,pTT+1*pLS);ctx.fillText(tsP[1],tsX,pTT+3*pLS);
  ctx.fillText(tsP[0],tsX,pBT+1*pLS);ctx.fillText(tsP[1],tsX,pBT+3*pLS);

  // Key signature — after time signature
  ctx.font='bold '+(pLS*2.4)+'px "Times New Roman",Georgia,serif';
  const tsW=ctx.measureText('12').width;
  let pKsX=tsX+tsW/2+16;
  const ksN=AH_keyInfo.sharps;
  const shTP=[0,1.5,-0.5,1,2.5,0.5,2],shBP=[1,2.5,0.5,2,3.5,1.5,3];
  const flTP=[2,0.5,2.5,1,3,1.5,3.5],flBP=[3,1.5,3.5,2,4,2.5,4.5];
  if(ksN>0){ctx.font=(pLS*1.8)+'px "Times New Roman",Georgia,serif';ctx.textBaseline='middle';for(let i=0;i<ksN&&i<7;i++){ctx.fillText('\u266F',pKsX+i*24,pTT+shTP[i]*pLS);ctx.fillText('\u266F',pKsX+i*24,pBT+shBP[i]*pLS);}pKsX+=ksN*24+12;}
  else if(ksN<0){const cnt=-ksN;ctx.font=(pLS*2)+'px "Times New Roman",Georgia,serif';ctx.textBaseline='middle';for(let i=0;i<cnt&&i<7;i++){ctx.fillText('\u266D',pKsX+i*24,pTT+flTP[i]*pLS);ctx.fillText('\u266D',pKsX+i*24,pBT+flBP[i]*pLS);}pKsX+=cnt*24+12;}

  // Notes
  const noteStart=pKsX+40;
  const chW=Math.min(220,(W-noteStart-pRM-30)/AH_chords.length);
  const pNS=14;

  function pMY(midi){
    const oct=Math.floor(midi/12)-1,pc=midi%12,dp=oct*7+AH_DIA[pc];
    if(midi>=57)return{y:pTT+2*pLS-(dp-34)*(pLS/2),staff:'treble'};
    return{y:pBT+2*pLS-(dp-22)*(pLS/2),staff:'bass'};
  }

  AH_chords.forEach((ch,ci)=>{
    const x=noteStart+ci*chW+chW/2;
    ['S','A','T','B'].forEach(v=>{
      const midi=ch[v],{y,staff}=pMY(midi);
      const tl=staff==='treble'?pTT:pBT,bl=tl+4*pLS;
      ctx.strokeStyle='#000';ctx.lineWidth=2;
      if(y<tl)for(let ly=tl-pLS;ly>=y-2;ly-=pLS){ctx.beginPath();ctx.moveTo(x-24,ly);ctx.lineTo(x+24,ly);ctx.stroke();}
      if(y>bl)for(let ly=bl+pLS;ly<=y+2;ly+=pLS){ctx.beginPath();ctx.moveTo(x-24,ly);ctx.lineTo(x+24,ly);ctx.stroke();}
      if(staff==='treble'){const mcY=pMY(60).y;if(midi<=60&&mcY>=bl+pLS*0.8){ctx.beginPath();ctx.moveTo(x-24,mcY);ctx.lineTo(x+24,mcY);ctx.stroke();}}
      // Notehead — filled with voice color (matches on-screen + SEQ aesthetic)
      ctx.save();ctx.translate(x,y);ctx.rotate(-0.18);ctx.beginPath();ctx.ellipse(0,0,pNS+3,pNS-4,0,0,Math.PI*2);ctx.fillStyle=AH_VCOLORS[v];ctx.fill();ctx.restore();
    });
    if(ci<AH_chords.length-1){ctx.strokeStyle='#000';ctx.lineWidth=2;const bx=x+chW/2;ctx.beginPath();ctx.moveTo(bx,pTT);ctx.lineTo(bx,pTT+4*pLS);ctx.stroke();ctx.beginPath();ctx.moveTo(bx,pBT);ctx.lineTo(bx,pBT+4*pLS);ctx.stroke();}
    // Chord symbol below — always show
    ctx.font='bold 22px "DM Sans",sans-serif';ctx.fillStyle='#000';ctx.textAlign='center';ctx.textBaseline='top';
    const label=ch.symbol||((tx('acc.','ch.','ac.'))+(ci+1));
    ctx.fillText(label,x,pBT+4*pLS+16);
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

/* ═══ INIT ═══ */

try{ AH_buildKeySelector();AH_buildChordTypeSelector();AH_updateInversionOptions();AH_buildInputs();AH_calcLayout();AH_analyze();AH_render();AH_setupCanvasEvents();window.addEventListener('resize',AH_render); }catch(e){console.error('AH:',e)}


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

