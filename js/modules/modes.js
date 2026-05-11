/* ═══════════════════════════════════════════════════════════════════
   modes.js — Module modes
   Chargé dynamiquement par main.js lors du premier accès à l'onglet.
   Toutes les fonctions/variables avec préfixe majuscule (T1, MOD, etc.)
   sont exposées sur window pour rétro-compat avec onclick="..."
   ═══════════════════════════════════════════════════════════════════ */
/* ═══ MODES ═══ */
const TM=(function(){

const SH=["C","C♯","D","D♯","E","F","F♯","G","G♯","A","A♯","B"];
const FL=["C","D♭","D","E♭","E","F","G♭","G","A♭","A","B♭","B"];
const KEYS=["C","C♯ / D♭","D","D♯ / E♭","E","F","F♯ / G♭","G","G♯ / A♭","A","A♯ / B♭","B"];
const KEY_SEMI=[0,1,2,3,4,5,6,7,8,9,10,11];
const FLAT_ROOTS=new Set([1,3,5,6,8,10]);
function nn(semi,root){return(FLAT_ROOTS.has(root)?FL:SH)[((semi%12)+12)%12];}
const pcDia=[0,0,1,1,2,3,3,4,4,5,5,6];

/* ══════════════════════════════════════
   SCALE I18N
   ══════════════════════════════════════ */
var TM_CAT_I18N={
"Modes majeurs":{fr:"Modes majeurs",en:"Major Modes",es:"Modos mayores"},
"Modes mineurs":{fr:"Modes mineurs",en:"Minor Modes",es:"Modos menores"},
"Pentatoniques":{fr:"Pentatoniques",en:"Pentatonic",es:"Pentatónicas"},
"Gammes blues":{fr:"Gammes blues",en:"Blues Scales",es:"Escalas de blues"},
"Gammes diminuées & augmentées":{fr:"Gammes diminuées & augmentées",en:"Diminished & Augmented Scales",es:"Escalas disminuidas y aumentadas"},
"Gammes bebop":{fr:"Gammes bebop",en:"Bebop Scales",es:"Escalas bebop"},
"Autres modes":{fr:"Autres modes",en:"Other Modes",es:"Otros modos"},
"Gammes symétriques":{fr:"Gammes symétriques",en:"Symmetric Scales",es:"Escalas simétricas"},
};
var TM_NM_I18N={
"Ionien (Majeur)":{fr:"Ionien (Majeur)",en:"Ionian (Major)",es:"Jónico (Mayor)"},
"Dorien":{fr:"Dorien",en:"Dorian",es:"Dórico"},
"Phrygien":{fr:"Phrygien",en:"Phrygian",es:"Frigio"},
"Lydien":{fr:"Lydien",en:"Lydian",es:"Lidio"},
"Mixolydien":{fr:"Mixolydien",en:"Mixolydian",es:"Mixolidio"},
"Éolien":{fr:"Éolien",en:"Aeolian",es:"Eólico"},
"Locrien":{fr:"Locrien",en:"Locrian",es:"Locrio"},
"Mineure naturelle (Éolien)":{fr:"Mineure naturelle (Éolien)",en:"Natural Minor (Aeolian)",es:"Menor natural (Eólico)"},
"Mineure harmonique":{fr:"Mineure harmonique",en:"Harmonic Minor",es:"Menor armónica"},
"Mineure mélodique (asc.)":{fr:"Mineure mélodique (asc.)",en:"Melodic Minor (asc.)",es:"Menor melódica (asc.)"},
"Dorien ♭2 (Phrygidorien)":{fr:"Dorien ♭2 (Phrygidorien)",en:"Dorian ♭2 (Phrygidorian)",es:"Dórico ♭2 (Frigidórico)"},
"Lydien augmenté":{fr:"Lydien augmenté",en:"Lydian Augmented",es:"Lidio aumentado"},
"Lydien ♭7 (Bartók)":{fr:"Lydien ♭7 (Bartók)",en:"Lydian ♭7 (Bartók)",es:"Lidio ♭7 (Bartók)"},
"Mixolydien ♭6":{fr:"Mixolydien ♭6",en:"Mixolydian ♭6",es:"Mixolidio ♭6"},
"Locrien ♮2 (Éolien ♭5)":{fr:"Locrien ♮2 (Éolien ♭5)",en:"Locrian ♮2 (Aeolian ♭5)",es:"Locrio ♮2 (Eólico ♭5)"},
"Super Locrien (Altéré)":{fr:"Super Locrien (Altéré)",en:"Super Locrian (Altered)",es:"Súper Locrio (Alterada)"},
"Locrien ♮6":{fr:"Locrien ♮6",en:"Locrian ♮6",es:"Locrio ♮6"},
"Ionien augmenté":{fr:"Ionien augmenté",en:"Ionian Augmented",es:"Jónico aumentado"},
"Dorien ♯4":{fr:"Dorien ♯4",en:"Dorian ♯4",es:"Dórico ♯4"},
"Phrygien dominant":{fr:"Phrygien dominant",en:"Phrygian Dominant",es:"Frigio dominante"},
"Lydien ♯2":{fr:"Lydien ♯2",en:"Lydian ♯2",es:"Lidio ♯2"},
"Ultra Locrien":{fr:"Ultra Locrien",en:"Ultra Locrian",es:"Ultra Locrio"},
"Pentatonique majeure":{fr:"Pentatonique majeure",en:"Major Pentatonic",es:"Pentatónica mayor"},
"Pentatonique mineure":{fr:"Pentatonique mineure",en:"Minor Pentatonic",es:"Pentatónica menor"},
"Blues majeure":{fr:"Blues majeure",en:"Major Blues",es:"Blues mayor"},
"Blues mineure":{fr:"Blues mineure",en:"Minor Blues",es:"Blues menor"},
"Pentatonique sus. égyptienne":{fr:"Pentatonique sus. égyptienne",en:"Suspended Pentatonic (Egyptian)",es:"Pentatónica suspendida (egipcia)"},
"Pentatonique Man Gong":{fr:"Pentatonique Man Gong",en:"Man Gong Pentatonic",es:"Pentatónica Man Gong"},
"Pentatonique Ritusen":{fr:"Pentatonique Ritusen",en:"Ritusen Pentatonic",es:"Pentatónica Ritusen"},
"Pentatonique japonaise (In)":{fr:"Pentatonique japonaise (In)",en:"Japanese Pentatonic (In)",es:"Pentatónica japonesa (In)"},
"Pentatonique Hirajoshi":{fr:"Pentatonique Hirajoshi",en:"Hirajoshi Pentatonic",es:"Pentatónica Hirajoshi"},
"Pentatonique Iwato":{fr:"Pentatonique Iwato",en:"Iwato Pentatonic",es:"Pentatónica Iwato"},
"Pentatonique Kumoi":{fr:"Pentatonique Kumoi",en:"Kumoi Pentatonic",es:"Pentatónica Kumoi"},
"Blues hexatonique":{fr:"Blues hexatonique",en:"Hexatonic Blues",es:"Blues hexatónica"},
"Blues nonatonique":{fr:"Blues nonatonique",en:"Nonatonic Blues",es:"Blues nonatónica"},
"Diminuée ton-½ton":{fr:"Diminuée ton-½ton",en:"Diminished Whole-Half",es:"Disminuida tono-½tono"},
"Diminuée ½ton-ton":{fr:"Diminuée ½ton-ton",en:"Diminished Half-Whole",es:"Disminuida ½tono-tono"},
"Augmentée (tons entiers alt.)":{fr:"Augmentée (tons entiers alt.)",en:"Augmented (alt. Whole Tones)",es:"Aumentada (tonos enteros alt.)"},
"Tons entiers":{fr:"Tons entiers",en:"Whole Tone",es:"Tonos enteros"},
"Bebop dominante":{fr:"Bebop dominante",en:"Bebop Dominant",es:"Bebop dominante"},
"Bebop majeure":{fr:"Bebop majeure",en:"Bebop Major",es:"Bebop mayor"},
"Bebop dorien":{fr:"Bebop dorien",en:"Bebop Dorian",es:"Bebop dórica"},
"Bebop mineure mélodique":{fr:"Bebop mineure mélodique",en:"Bebop Melodic Minor",es:"Bebop menor melódica"},
"Double harmonique":{fr:"Double harmonique",en:"Double Harmonic",es:"Doble armónica"},
"Hongrois mineur":{fr:"Hongrois mineur",en:"Hungarian Minor",es:"Húngara menor"},
"Hongrois majeur":{fr:"Hongrois majeur",en:"Hungarian Major",es:"Húngara mayor"},
"Tzigane (Romaní)":{fr:"Tzigane (Romaní)",en:"Romani (Gypsy)",es:"Gitana (Romaní)"},
"Napolitain majeur":{fr:"Napolitain majeur",en:"Neapolitan Major",es:"Napolitana mayor"},
"Napolitain mineur":{fr:"Napolitain mineur",en:"Neapolitan Minor",es:"Napolitana menor"},
"Persan":{fr:"Persan",en:"Persian",es:"Persa"},
"Oriental":{fr:"Oriental",en:"Oriental",es:"Oriental"},
"Japonais (Yo)":{fr:"Japonais (Yo)",en:"Japanese (Yo)",es:"Japonesa (Yo)"},
"Japonais (In-sen)":{fr:"Japonais (In-sen)",en:"Japanese (In-sen)",es:"Japonesa (In-sen)"},
"Chinois":{fr:"Chinois",en:"Chinese",es:"China"},
"Indien (Raga Bhairav)":{fr:"Indien (Raga Bhairav)",en:"Indian (Raga Bhairav)",es:"Hindú (Raga Bhairav)"},
"Indien (Raga Todi)":{fr:"Indien (Raga Todi)",en:"Indian (Raga Todi)",es:"Hindú (Raga Todi)"},
"Indien (Raga Marwa)":{fr:"Indien (Raga Marwa)",en:"Indian (Raga Marwa)",es:"Hindú (Raga Marwa)"},
"Indien (Raga Purvi)":{fr:"Indien (Raga Purvi)",en:"Indian (Raga Purvi)",es:"Hindú (Raga Purvi)"},
"Balinais (Pelog)":{fr:"Balinais (Pelog)",en:"Balinese (Pelog)",es:"Balinesa (Pelog)"},
"Javanaise (Slendro)":{fr:"Javanaise (Slendro)",en:"Javanese (Slendro)",es:"Javanesa (Slendro)"},
"Éthiopien (Tizita maj.)":{fr:"Éthiopien (Tizita maj.)",en:"Ethiopian (Tizita maj.)",es:"Etíope (Tizita may.)"},
"Éthiopien (Tizita min.)":{fr:"Éthiopien (Tizita min.)",en:"Ethiopian (Tizita min.)",es:"Etíope (Tizita men.)"},
"Algérien":{fr:"Algérien",en:"Algerian",es:"Argelina"},
"Byzantin":{fr:"Byzantin",en:"Byzantine",es:"Bizantina"},
"Ukrainien dorien":{fr:"Ukrainien dorien",en:"Ukrainian Dorian",es:"Ucraniana dórica"},
"Roumain":{fr:"Roumain",en:"Romanian",es:"Rumana"},
"Prometheus":{fr:"Prometheus",en:"Prometheus",es:"Prometheus"},
"Istrien":{fr:"Istrien",en:"Istrian",es:"Istria"},
"Lydien ♭7":{fr:"Lydien ♭7",en:"Lydian ♭7",es:"Lidia ♭7"},
"Triton":{fr:"Triton",en:"Tritone",es:"Tritono"},
"Lydien mineur":{fr:"Lydien mineur",en:"Lydian Minor",es:"Lidia menor"},
"Lydien 6te augmenté":{fr:"Lydien 6te augmenté",en:"Lydian Augmented 6th",es:"Lidio sexta aumentada"},
"Double harmonique majeure":{fr:"Double harmonique majeure",en:"Double Harmonic Major",es:"Doble armónica mayor"},
"Mixolydien ♭2":{fr:"Mixolydien ♭2",en:"Mixolydian ♭2",es:"Mixolidio ♭2"},
"Flamenco":{fr:"Flamenco",en:"Flamenco",es:"Flamenca"},
"Hawaiienne":{fr:"Hawaiienne",en:"Hawaiian",es:"Hawaiana"},
"Asavari (Inde)":{fr:"Asavari (Inde)",en:"Asavari (India)",es:"Asavari (India)"},
"Bilawal (Inde)":{fr:"Bilawal (Inde)",en:"Bilawal (India)",es:"Bilawal (India)"},
"Kafi (Inde)":{fr:"Kafi (Inde)",en:"Kafi (India)",es:"Kafi (India)"},
"Yaman (Inde)":{fr:"Yaman (Inde)",en:"Yaman (India)",es:"Yaman (India)"},
"Khamaj (Inde)":{fr:"Khamaj (Inde)",en:"Khamaj (India)",es:"Khamaj (India)"},
"Bhairavi (Inde)":{fr:"Bhairavi (Inde)",en:"Bhairavi (India)",es:"Bhairavi (India)"},
"Marva (Inde)":{fr:"Marva (Inde)",en:"Marva (India)",es:"Marva (India)"},
"Espagnole 8 tons":{fr:"Espagnole 8 tons",en:"Spanish 8-Tone",es:"Española 8 tonos"},
"Chromatique":{fr:"Chromatique",en:"Chromatic",es:"Cromática"},
"Augmentée":{fr:"Augmentée",en:"Augmented",es:"Aumentada"},
};

/* ══════════════════════════════════════
   SCALE DATABASE
   ══════════════════════════════════════ */
const SCALES={
"Modes majeurs":[
  ["Ionien (Majeur)",[0,2,4,5,7,9,11]],
  ["Dorien",[0,2,3,5,7,9,10]],
  ["Phrygien",[0,1,3,5,7,8,10]],
  ["Lydien",[0,2,4,6,7,9,11]],
  ["Mixolydien",[0,2,4,5,7,9,10]],
  ["Éolien",[0,2,3,5,7,8,10]],
  ["Locrien",[0,1,3,5,6,8,10]],
],
"Modes mineurs":[
  ["Mineure naturelle (Éolien)",[0,2,3,5,7,8,10]],
  ["Mineure harmonique",[0,2,3,5,7,8,11]],
  ["Mineure mélodique (asc.)",[0,2,3,5,7,9,11]],
  ["Dorien ♭2 (Phrygidorien)",[0,1,3,5,7,9,10]],
  ["Lydien augmenté",[0,2,4,6,8,9,11]],
  ["Lydien ♭7 (Bartók)",[0,2,4,6,7,9,10]],
  ["Mixolydien ♭6",[0,2,4,5,7,8,10]],
  ["Locrien ♮2 (Éolien ♭5)",[0,2,3,5,6,8,10]],
  ["Super Locrien (Altéré)",[0,1,3,4,6,8,10]],
  ["Locrien ♮6",[0,1,3,5,6,9,10]],
  ["Ionien augmenté",[0,2,4,5,8,9,11]],
  ["Dorien ♯4",[0,2,3,6,7,9,10]],
  ["Phrygien dominant",[0,1,4,5,7,8,10]],
  ["Lydien ♯2",[0,3,4,6,7,9,11]],
  ["Ultra Locrien",[0,1,3,4,6,8,9]],
],
"Pentatoniques":[
  ["Pentatonique majeure",[0,2,4,7,9]],
  ["Pentatonique mineure",[0,3,5,7,10]],
  ["Blues majeure",[0,2,3,4,7,9]],
  ["Blues mineure",[0,3,5,6,7,10]],
  ["Pentatonique sus. égyptienne",[0,2,5,7,10]],
  ["Pentatonique Man Gong",[0,3,5,8,10]],
  ["Pentatonique Ritusen",[0,2,5,7,9]],
  ["Pentatonique japonaise (In)",[0,1,5,7,8]],
  ["Pentatonique Hirajoshi",[0,2,3,7,8]],
  ["Pentatonique Iwato",[0,1,5,6,10]],
  ["Pentatonique Kumoi",[0,2,3,7,9]],
],
"Gammes blues":[
  ["Blues mineure",[0,3,5,6,7,10]],
  ["Blues majeure",[0,2,3,4,7,9]],
  ["Blues hexatonique",[0,3,4,5,7,10]],
  ["Blues nonatonique",[0,2,3,4,5,6,7,9,10]],
],
"Gammes diminuées & augmentées":[
  ["Diminuée ton-½ton",[0,2,3,5,6,8,9,11]],
  ["Diminuée ½ton-ton",[0,1,3,4,6,7,9,10]],
  ["Augmentée (tons entiers alt.)",[0,3,4,7,8,11]],
  ["Tons entiers",[0,2,4,6,8,10]],
],
"Gammes bebop":[
  ["Bebop dominante",[0,2,4,5,7,9,10,11]],
  ["Bebop majeure",[0,2,4,5,7,8,9,11]],
  ["Bebop dorien",[0,2,3,4,5,7,9,10]],
  ["Bebop mineure mélodique",[0,2,3,5,7,8,9,11]],
],
"Autres modes":[
  ["Double harmonique",[0,1,4,5,7,8,11]],
  ["Hongrois mineur",[0,2,3,6,7,8,11]],
  ["Hongrois majeur",[0,3,4,6,7,9,10]],
  ["Tzigane (Romaní)",[0,2,3,6,7,8,11]],
  ["Napolitain majeur",[0,1,3,5,7,9,11]],
  ["Napolitain mineur",[0,1,3,5,7,8,11]],
  ["Persan",[0,1,4,5,6,8,11]],
  ["Oriental",[0,1,4,5,6,9,10]],
  ["Japonais (Yo)",[0,2,5,7,9]],
  ["Japonais (In-sen)",[0,1,5,7,10]],
  ["Chinois",[0,4,6,7,11]],
  ["Indien (Raga Bhairav)",[0,1,4,5,7,8,11]],
  ["Indien (Raga Todi)",[0,1,3,6,7,8,11]],
  ["Indien (Raga Marwa)",[0,1,4,6,7,9,11]],
  ["Indien (Raga Purvi)",[0,1,4,6,7,8,11]],
  ["Balinais (Pelog)",[0,1,3,7,8]],
  ["Javanaise (Slendro)",[0,2,5,7,9]],
  ["Éthiopien (Tizita maj.)",[0,2,4,7,9]],
  ["Éthiopien (Tizita min.)",[0,2,3,7,8]],
  ["Algérien",[0,2,3,6,7,8,11]],
  ["Byzantin",[0,1,4,5,7,8,11]],
  ["Ukrainien dorien",[0,2,3,6,7,9,10]],
  ["Roumain",[0,2,3,6,7,9,10]],
  ["Prometheus",[0,2,4,6,9,10]],
  ["Istrien",[0,1,3,4,6,7]],
  ["Lydien ♭7",[0,2,4,6,7,9,10]],
  ["Triton",[0,1,4,6,7,10]],
  ["Lydien mineur",[0,2,4,6,7,8,10]],
  ["Lydien 6te augmenté",[0,2,4,6,8,10,11]],
  ["Double harmonique majeure",[0,1,4,5,7,8,11]],
  ["Mixolydien ♭2",[0,1,4,5,7,9,10]],
  ["Flamenco",[0,1,4,5,7,8,11]],
  ["Hawaiienne",[0,2,3,5,7,9,11]],
  ["Asavari (Inde)",[0,2,3,5,7,8,10]],
  ["Bilawal (Inde)",[0,2,4,5,7,9,11]],
  ["Kafi (Inde)",[0,2,3,5,7,9,10]],
  ["Yaman (Inde)",[0,2,4,6,7,9,11]],
  ["Khamaj (Inde)",[0,2,4,5,7,9,10]],
  ["Bhairavi (Inde)",[0,1,3,5,7,8,10]],
  ["Marva (Inde)",[0,1,4,6,7,9,11]],
  ["Espagnole 8 tons",[0,1,3,4,5,6,8,10]],
  ["Phrygien dominant",[0,1,4,5,7,8,10]],
],
"Gammes symétriques":[
  ["Chromatique",[0,1,2,3,4,5,6,7,8,9,10,11]],
  ["Tons entiers",[0,2,4,6,8,10]],
  ["Diminuée ton-½ton",[0,2,3,5,6,8,9,11]],
  ["Diminuée ½ton-ton",[0,1,3,4,6,7,9,10]],
  ["Augmentée",[0,3,4,7,8,11]],
  ["Triton",[0,1,4,6,7,10]],
],
};

/* ── Build flat index of all scales ── */
const CATS=Object.keys(SCALES);
const ALL_SCALES=[];  // [{name, intervals, cat, catIdx, scIdx}]
CATS.forEach((cat,ci)=>{
  SCALES[cat].forEach((sc,si)=>{
    ALL_SCALES.push({name:sc[0], intervals:sc[1], cat, catIdx:ci, scIdx:si});
  });
});

let selKey=0, selEntry=null, playMode='asc';
let audioCtx=null, revNode=null;
let ddOpen=false;

/* ── Key select ── */
function buildKeySelect(){
  const el=document.getElementById('tmkeySel');
  el.innerHTML=KEYS.map((k,i)=>`<option value="${i}">${k}</option>`).join('');
  el.value=selKey;
}

function tmCat(key){var v=TM_CAT_I18N[key];return v?(v[currentLang]||v.fr):key;}
function tmNm(key){var v=TM_NM_I18N[key];return v?(v[currentLang]||v.fr):key;}

/* ── Normalize for search ── */
function norm(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}

/* ── Dropdown ── */
const searchEl=document.getElementById('tmsearch');
const ddEl=document.getElementById('tmdropdown');

function buildDropdown(query){
  const q=norm(query||'');
  let filtered=ALL_SCALES;
  if(q){
    filtered=ALL_SCALES.filter(e=>norm(tmNm(e.name)).includes(q)||norm(tmCat(e.cat)).includes(q)||norm(e.name).includes(q)||norm(e.cat).includes(q));
  }
  if(filtered.length===0){
    ddEl.innerHTML='<div class="tm-dd-empty">'+t('h_none')+'</div>';
    ddEl.classList.add('open');
    ddOpen=true;
    return;
  }
  // Group by category
  let html='';
  let lastCat='';
  filtered.forEach(e=>{
    if(e.cat!==lastCat){
      html+=`<div class="tm-dd-cat">${tmCat(e.cat)}</div>`;
      lastCat=e.cat;
    }
    const isSel=selEntry&&selEntry.catIdx===e.catIdx&&selEntry.scIdx===e.scIdx;
    const globalIdx=ALL_SCALES.indexOf(e);
    html+=`<div class="tm-dd-item${isSel?' sel':''}" data-idx="${globalIdx}" onclick="TM.pick(${globalIdx})">${tmNm(e.name)}</div>`;
  });
  ddEl.innerHTML=html;
  ddEl.classList.add('open');
  ddOpen=true;
}

function closeDropdown(){
  ddEl.classList.remove('open');
  ddOpen=false;
}

function updateBadge(){
  const el=document.getElementById('tmbadge');
  if(!selEntry){el.innerHTML='';return;}
  el.innerHTML=`<div class="tm-sel-badge">${tmNm(selEntry.name)} <span class="cat">· ${tmCat(selEntry.cat)}</span></div>`;
}

searchEl.addEventListener('focus',()=>buildDropdown(searchEl.value));
searchEl.addEventListener('input',()=>buildDropdown(searchEl.value));
document.addEventListener('click',(e)=>{
  if(!e.target.closest('.tm-search-wrap')&&ddOpen) closeDropdown();
});

/* ══════════════════════════════
   Staff SVG
   ══════════════════════════════ */
function staffSVG(intervals, rootSemi, label){
  const nCount=intervals.length;
  const nSp=Math.min(38, Math.max(24,420/nCount));
  const nX0=58;
  const W=Math.max(340, nX0+nCount*nSp+40);
  const H=155, sTop=30, lG=11;
  const lY=i=>sTop+i*lG;

  const rPC=rootSemi%12;
  const rDia=pcDia[rPC];
  let rOct=4;
  if(rDia>=5) rOct=3;
  const rAbsDia=rOct*7+rDia;

  const notes=[];
  for(let idx=0;idx<intervals.length;idx++){
    const pc=(rPC+intervals[idx])%12;
    const absDia=rAbsDia+idx;
    const diaLetter=absDia%7;
    const dFromB4=absDia-34;
    const y=lY(2)-dFromB4*(lG/2);
    notes.push({pc,dia:diaLetter,absDia,y});
  }

  let svg=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">`;
  for(let i=0;i<5;i++) svg+=`<line x1="16" y1="${lY(i)}" x2="${W-16}" y2="${lY(i)}" stroke="#d1cfe6" stroke-width="1"/>`;
  svg+=`<text x="30" y="${lY(3)+2}" font-size="48" fill="#534AB7" font-family="serif" text-anchor="middle">𝄞</text>`;

  const nR=5.5;
  notes.forEach((n,idx)=>{
    const x=nX0+idx*nSp, y=n.y;
    if(y>lY(4)+1) for(let ly=lY(4)+lG;ly<=y+1;ly+=lG)
      svg+=`<line x1="${x-10}" y1="${ly}" x2="${x+10}" y2="${ly}" stroke="#d1cfe6" stroke-width="1"/>`;
    if(y<lY(0)-1) for(let ly=lY(0)-lG;ly>=y-1;ly-=lG)
      svg+=`<line x1="${x-10}" y1="${ly}" x2="${x+10}" y2="${ly}" stroke="#d1cfe6" stroke-width="1"/>`;
    const nat=[0,2,4,5,7,9,11][n.dia];
    const diff=((n.pc-nat)+12)%12;
    let acc=null;
    if(diff===1) acc='♯';
    else if(diff===11) acc='♭';
    else if(diff===2) acc='𝄪';
    else if(diff===10) acc='𝄫';
    if(acc) svg+=`<text x="${x-13}" y="${y+5}" font-size="14" fill="#1e1e2e" font-family="serif" text-anchor="middle">${acc}</text>`;
    const fill=idx===0?'#534AB7':'#1e1e2e';
    svg+=`<ellipse cx="${x}" cy="${y}" rx="${nR}" ry="${nR-1.5}" fill="${fill}" transform="rotate(-12 ${x} ${y})"/>`;
    svg+=`<text x="${x}" y="${lY(4)+28}" font-size="10" fill="${idx===0?'#534AB7':'#6b7280'}" font-weight="${idx===0?'700':'500'}" font-family="DM Sans,sans-serif" text-anchor="middle">${nn(n.pc,rootSemi)}</text>`;
  });
  svg+=`<text x="${W/2}" y="${H-2}" font-size="13" fill="#534AB7" font-weight="700" font-family="DM Sans,sans-serif" text-anchor="middle">${label}</text>`;
  svg+='</svg>';
  return svg;
}

/* ── Piano ── */
function buildPiano(intervals, rootSemi){
  const absMidis=[];
  for(let i=0;i<intervals.length;i++){
    let m=60+((rootSemi+intervals[i])%12);
    if(i>0){while(m<=absMidis[i-1])m+=12;}
    else m=60+rootSemi;
    absMidis.push(m);
  }
  absMidis.push(absMidis[0]+12);
  const midiSet=new Set(absMidis);
  const minM=Math.min(...absMidis),maxM=Math.max(...absMidis);
  const isBK=m=>[1,3,6,8,10].includes(((m%12)+12)%12);
  let kbS=minM-3;kbS-=((kbS%12+12)%12);
  let kbE=maxM+3;const em=((kbE%12)+12)%12;if(em!==11)kbE+=(11-em);
  let whites=[],blacks=[];
  for(let m=kbS;m<=kbE;m++){if(!isBK(m))whites.push(m);else blacks.push(m);}
  while(whites.length<14){kbE+=12;for(let m=kbE-11;m<=kbE;m++){if(!isBK(m))whites.push(m);else blacks.push(m);}whites.sort((a,b)=>a-b);blacks.sort((a,b)=>a-b);}
  const ww=100/whites.length;
  let h='';
  whites.forEach((m,i)=>{
    const pc=((m%12)+12)%12;
    const isRoot=midiSet.has(m)&&m===absMidis[0];
    const isHL=midiSet.has(m)&&!isRoot;
    h+=`<div class="tm-wk${isRoot?' hl':isHL?' hl2':''}" style="left:${(i*ww).toFixed(3)}%;width:${(ww-.3).toFixed(3)}%">${nn(pc,rootSemi)}</div>`;
  });
  blacks.forEach(m=>{
    const pc=((m%12)+12)%12;
    const isRoot=midiSet.has(m)&&m===absMidis[0];
    const isHL=midiSet.has(m)&&!isRoot;
    const wb=whites.filter(w=>w<m).length;
    const bw=ww*.65;
    h+=`<div class="tm-bk${isRoot?' hl':isHL?' hl2':''}" style="left:${(wb*ww-bw/2).toFixed(3)}%;width:${bw.toFixed(3)}%"></div>`;
  });
  return `<div class="tm-piano-inner" style="min-width:${Math.max(500,whites.length*34)}px">${h}</div>`;
}

/* ── Detail ── */
function renderDetail(){
  const el=document.getElementById('tmdetail');
  if(!selEntry){el.innerHTML=`<div class="tm-empty">${t("h_scale")}</div>`;return;}
  const name=tmNm(selEntry.name), iv=selEntry.intervals;
  const rootSemi=KEY_SEMI[selKey];
  const rootName=nn(rootSemi,rootSemi);
  const fullName=rootName+' '+name;

  const noteChips=iv.map((s,i)=>{
    const n=nn((rootSemi+s)%12,rootSemi);
    return `<div class="tm-note-chip${i===0?' root':''}">${n}<span class="deg">${i===0?'R':i+1}</span></div>`;
  }).join('');

  const steps=[];
  for(let i=1;i<iv.length;i++)steps.push(iv[i]-iv[i-1]);
  steps.push(12-iv[iv.length-1]+iv[0]);
  const ivChips=steps.map((s,i)=>{
    const arrow=i<steps.length-1?'<span class="tm-iv-arrow">›</span>':'';
    return `<div class="tm-iv-chip">${s}½t</div>${arrow}`;
  }).join('');
  const formula=steps.slice(0,-1).map(s=>{
    if(s===1)return '½';if(s===2)return '1';if(s===3)return '1½';if(s===4)return '2';return s/2;
  }).join(' – ');

  const staff=staffSVG(iv,rootSemi,fullName);
  const piano=buildPiano(iv,rootSemi);

  /* Fingering lookup */
  const fg=_fgGetScale(rootSemi,iv);
  let fgHTML='';
  if(fg){
    const sn=iv.map(s=>nn((rootSemi+s)%12,rootSemi));
    sn.push(sn[0]);
    fgHTML='<div class="tm-section-lbl">'+t('fg')+'</div>'+_fgRenderHTML(fg,sn,t('fg_m1'));
    /* Chromatic alternative with 4th finger */
    const isChrom=JSON.stringify(iv)==='[0,1,2,3,4,5,6,7,8,9,10,11]';
    if(isChrom&&FINGERING_DB.scales.chromatic2&&FINGERING_DB.scales.chromatic2[rootSemi]){
      fgHTML+=_fgRenderHTML(FINGERING_DB.scales.chromatic2[rootSemi],sn,t('fg_m2'));
    }
  }

  el.innerHTML=`<div class="tm-det-card">
    <div class="tm-det-name">${fullName}</div>
    <div class="tm-det-sub">${iv.length} ${t('tm_nf')} <strong>${formula}</strong></div>
    <div class="tm-section-lbl">${t('tm_notes')}</div>
    <div class="tm-notes-row">${noteChips}</div>
    <div class="tm-section-lbl">${t('tm_siv')}</div>
    <div class="tm-iv-row">${ivChips}</div>
    <div class="tm-section-lbl">${t('tm_staff')}</div>
    <div class="tm-staff-box">${staff}</div>
    <div class="tm-section-lbl">${t('tm_kb')}</div>
    <div class="tm-pw">${piano}</div>
    ${fgHTML}
    <div class="tm-play-row">
      <button class="tm-btn-play" id="tmbtnPlay" onclick="TM.play()"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>${t('tm_listen')}</button>
      <div class="tm-pm">
        <button class="tm-pm-btn${playMode==='asc'?' on':''}" onclick="TM.setPM('asc')">${t('btn_asc')}</button>
        <button class="tm-pm-btn${playMode==='desc'?' on':''}" onclick="TM.setPM('desc')">${t('btn_desc')}</button>
        <button class="tm-pm-btn${playMode==='both'?' on':''}" onclick="TM.setPM('both')">${t('tm_both')}</button>
      </div>
    </div>
  </div>`;
}

function render(){buildKeySelect();updateBadge();renderDetail();}

/* ── Audio ── */
function m2f(midi){return 440*Math.pow(2,(midi-69)/12);}
function playScale(){
  if(!selEntry)return;
  const iv=selEntry.intervals;
  const rootSemi=KEY_SEMI[selKey];
  const chain=_getPianoChain();
  const ctx=chain.ctx, dG=chain.dry, rev=chain.wet;
  let midis=iv.map(s=>60+rootSemi+s);
  midis.push(midis[0]+12);
  let seq=[];
  if(playMode==='asc'||playMode==='both')seq=seq.concat(midis);
  if(playMode==='desc'||playMode==='both')seq=seq.concat([...midis].reverse());
  const now=ctx.currentTime,gap=0.22;
  seq.forEach((m,i)=>{pianoNote(m2f(m),now+i*gap,0.55,ctx,dG,rev,0.26);});
  const btn=document.getElementById('tmbtnPlay');
  if(btn){btn.classList.add('playing');setTimeout(()=>btn.classList.remove('playing'),seq.length*gap*1000+300);}
}

document.getElementById('tmkeySel').addEventListener('change',function(){selKey=parseInt(this.value);renderDetail();});

return{
  openDD(){buildDropdown(searchEl.value);searchEl.focus();},
  pick(globalIdx){
    selEntry=ALL_SCALES[globalIdx];
    searchEl.value=tmNm(selEntry.name);
    closeDropdown();
    updateBadge();
    renderDetail();
  },
  play(){playScale();},
  setPM(m){
    playMode=m;
    renderDetail();
  },
  init(){render();}
};
})();

/* ── Init auto ── */
try{TM.init()}catch(e){console.error('TM:',e)}
