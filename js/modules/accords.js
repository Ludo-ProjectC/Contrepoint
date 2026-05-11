/* ═══════════════════════════════════════════════════════════════════
   accords.js — Module accords
   Chargé dynamiquement par main.js lors du premier accès à l'onglet.
   Toutes les fonctions/variables avec préfixe majuscule (T1, MOD, etc.)
   sont exposées sur window pour rétro-compat avec onclick="..."
   ═══════════════════════════════════════════════════════════════════ */
/* ═══ ACCORDS ═══ */
const TA=(function(){

/* ── Note data ── */
const S=["C","C♯","D","D♯","E","F","F♯","G","G♯","A","A♯","B"];
const F=["C","D♭","D","E♭","E","F","G♭","G","A♭","A","B♭","B"];
const L7=["C","D","E","F","G","A","B"];

/* Key signature map for major keys */
const TA_KS={"C":0,"G":1,"D":2,"A":3,"E":4,"B":5,"F♯":6,"C♯":7,"G♭":-6,"D♭":-5,"A♭":-4,"E♭":-3,"B♭":-2,"F":-1,"G♯":8,"D♯":9,"A♯":10};
function taMiniKs(name,w,h){
  const n=TA_KS[name]||0;
  const sTop=6,lG=5,lY=i=>sTop+i*lG;
  let svg=`<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">`;
  for(let i=0;i<5;i++)svg+=`<line x1="0" y1="${lY(i)}" x2="${w}" y2="${lY(i)}" stroke="#d1cfe6" stroke-width="0.7"/>`;
  if(n===0){svg+='</svg>';return svg;}
  const sYs=[lY(0),lY(1)+lG/2,lY(0)-lG/2,lY(1),lY(2)+lG/2,lY(1)-lG/2,lY(2)];
  const fYs=[lY(2),lY(0)+lG/2,lY(2)+lG/2,lY(1),lY(3)+lG/2,lY(1)+lG/2,lY(3)];
  const cnt=Math.min(Math.abs(n),7),sp=7;
  if(n>0)for(let i=0;i<cnt;i++)svg+=`<text x="${3+i*sp}" y="${sYs[i%7]+4}" font-size="10" fill="#534AB7" font-family="serif" text-anchor="middle">♯</text>`;
  else for(let i=0;i<cnt;i++)svg+=`<text x="${3+i*sp}" y="${fYs[i%7]+4}" font-size="10" fill="#534AB7" font-family="serif" text-anchor="middle">♭</text>`;
  svg+='</svg>';
  return svg;
}
function taKsW(name){const n=Math.min(Math.abs(TA_KS[name]||0),7);return Math.max(20,n*7+6);}

/* Root dropdown: 12 chromatic notes with both ♯ and ♭ name */
const ROOTS=[
  {pc:0, sharp:"C",   flat:"C",   label:"C"},
  {pc:1, sharp:"C♯",  flat:"D♭",  label:"C♯ / D♭"},
  {pc:2, sharp:"D",   flat:"D",   label:"D"},
  {pc:3, sharp:"D♯",  flat:"E♭",  label:"D♯ / E♭"},
  {pc:4, sharp:"E",   flat:"E",   label:"E"},
  {pc:5, sharp:"F",   flat:"F",   label:"F"},
  {pc:6, sharp:"F♯",  flat:"G♭",  label:"F♯ / G♭"},
  {pc:7, sharp:"G",   flat:"G",   label:"G"},
  {pc:8, sharp:"G♯",  flat:"A♭",  label:"G♯ / A♭"},
  {pc:9, sharp:"A",   flat:"A",   label:"A"},
  {pc:10,sharp:"A♯",  flat:"B♭",  label:"A♯ / B♭"},
  {pc:11,sharp:"B",   flat:"B",   label:"B"},
];

/* ── Chord types (like pianochord.org) ── */
const CHORD_TYPES=[
  /* Triades */
  {cat:"Triades", catEn:"Triads", catEs:"Tríadas", items:[
    {id:"maj",  label:"Majeur",    labelEn:"Major",     labelEs:"Mayor",      abbr:"",     st:[0,4,7],    deg:[0,2,4]},
    {id:"min",  label:"Mineur",    labelEn:"Minor",     labelEs:"Menor",      abbr:"m",    st:[0,3,7],    deg:[0,2,4]},
    {id:"dim",  label:"Diminué",   labelEn:"Diminished",labelEs:"Disminuida", abbr:"dim",  st:[0,3,6],    deg:[0,2,4]},
    {id:"aug",  label:"Augmenté",  labelEn:"Augmented", labelEs:"Aumentada",  abbr:"aug",  st:[0,4,8],    deg:[0,2,4]},
    {id:"sus2", label:"Sus2",      labelEn:"Sus2",      labelEs:"Sus2",       abbr:"sus2", st:[0,2,7],    deg:[0,1,4]},
    {id:"sus4", label:"Sus4",      labelEn:"Sus4",      labelEs:"Sus4",       abbr:"sus4", st:[0,5,7],    deg:[0,3,4]},
  ]},
  /* Septièmes */
  {cat:"Accords de septième", catEn:"Seventh Chords", catEs:"Acordes de séptima", items:[
    {id:"7",     label:"7 (dom.)",     labelEn:"7 (dom.)",     labelEs:"7 (dom.)",      abbr:"7",     st:[0,4,7,10],  deg:[0,2,4,6]},
    {id:"maj7",  label:"Maj7",         labelEn:"Maj7",         labelEs:"Maj7",          abbr:"maj7",  st:[0,4,7,11],  deg:[0,2,4,6]},
    {id:"m7",    label:"Min7",         labelEn:"Min7",         labelEs:"Min7",          abbr:"m7",    st:[0,3,7,10],  deg:[0,2,4,6]},
    {id:"mMaj7", label:"Min/Maj7",     labelEn:"Min/Maj7",     labelEs:"Min/Maj7",      abbr:"m(maj7)",st:[0,3,7,11], deg:[0,2,4,6]},
    {id:"dim7",  label:"Dim7",         labelEn:"Dim7",         labelEs:"Dim7",          abbr:"°7",    st:[0,3,6,9],   deg:[0,2,4,6]},
    {id:"hdim7", label:"Semi-dim (ø7)",labelEn:"Half-dim (ø7)",labelEs:"Semidism. (ø7)",abbr:"ø7",    st:[0,3,6,10],  deg:[0,2,4,6]},
    {id:"aug7",  label:"Aug7",         labelEn:"Aug7",         labelEs:"Aug7",          abbr:"aug7",  st:[0,4,8,10],  deg:[0,2,4,6]},
    {id:"7sus4", label:"7sus4",        labelEn:"7sus4",        labelEs:"7sus4",         abbr:"7sus4", st:[0,5,7,10],  deg:[0,3,4,6]},
  ]},
  /* Sixtes */
  {cat:"Accords de sixte", catEn:"Sixth Chords", catEs:"Acordes de sexta", items:[
    {id:"6",   label:"Sixte maj.",  labelEn:"Maj. Sixth",  labelEs:"Sexta may.",  abbr:"6",   st:[0,4,7,9],  deg:[0,2,4,5]},
    {id:"m6",  label:"Sixte min.",  labelEn:"Min. Sixth",  labelEs:"Sexta men.",  abbr:"m6",  st:[0,3,7,9],  deg:[0,2,4,5]},
  ]},
  /* Neuvièmes */
  {cat:"Accords de neuvième", catEn:"Ninth Chords", catEs:"Acordes de novena", items:[
    {id:"9",     label:"9",        labelEn:"9",        labelEs:"9",        abbr:"9",      st:[0,4,7,10,14], deg:[0,2,4,6,1]},
    {id:"maj9",  label:"Maj9",     labelEn:"Maj9",     labelEs:"Maj9",     abbr:"maj9",   st:[0,4,7,11,14], deg:[0,2,4,6,1]},
    {id:"m9",    label:"Min9",     labelEn:"Min9",     labelEs:"Min9",     abbr:"m9",     st:[0,3,7,10,14], deg:[0,2,4,6,1]},
    {id:"add9",  label:"Add9",     labelEn:"Add9",     labelEs:"Add9",     abbr:"add9",   st:[0,4,7,14],    deg:[0,2,4,1]},
    {id:"madd9", label:"m(add9)",  labelEn:"m(add9)",  labelEs:"m(add9)",  abbr:"m(add9)",st:[0,3,7,14],    deg:[0,2,4,1]},
  ]},
  /* Onzièmes */
  {cat:"Accords de onzième", catEn:"Eleventh Chords", catEs:"Acordes de oncena", items:[
    {id:"11",    label:"11",       labelEn:"11",       labelEs:"11",       abbr:"11",     st:[0,4,7,10,14,17], deg:[0,2,4,6,1,3]},
    {id:"m11",   label:"Min11",    labelEn:"Min11",    labelEs:"Min11",    abbr:"m11",    st:[0,3,7,10,14,17], deg:[0,2,4,6,1,3]},
  ]},
  /* Treizièmes */
  {cat:"Accords de treizième", catEn:"Thirteenth Chords", catEs:"Acordes de trecena", items:[
    {id:"13",    label:"13",       labelEn:"13",       labelEs:"13",       abbr:"13",     st:[0,4,7,10,14,17,21], deg:[0,2,4,6,1,3,5]},
    {id:"m13",   label:"Min13",    labelEn:"Min13",    labelEs:"Min13",    abbr:"m13",    st:[0,3,7,10,14,17,21], deg:[0,2,4,6,1,3,5]},
  ]},
  /* Power & autres */
  {cat:"Autres", catEn:"Other", catEs:"Otros", items:[
    {id:"5",     label:"Power (5)", labelEn:"Power (5)", labelEs:"Power (5)", abbr:"5",    st:[0,7],       deg:[0,4]},
    {id:"7b5",   label:"7♭5",       labelEn:"7♭5",       labelEs:"7♭5",       abbr:"7♭5",  st:[0,4,6,10],  deg:[0,2,4,6]},
    {id:"7s5",   label:"7♯5",       labelEn:"7♯5",       labelEs:"7♯5",       abbr:"7♯5",  st:[0,4,8,10],  deg:[0,2,4,6]},
    {id:"7b9",   label:"7♭9",       labelEn:"7♭9",       labelEs:"7♭9",       abbr:"7♭9",  st:[0,4,7,10,13],deg:[0,2,4,6,1]},
    {id:"7s9",   label:"7♯9",       labelEn:"7♯9",       labelEs:"7♯9",       abbr:"7♯9",  st:[0,4,7,10,15],deg:[0,2,4,6,1]},
    {id:"9b5",   label:"9♭5",       labelEn:"9♭5",       labelEs:"9♭5",       abbr:"9♭5",  st:[0,4,6,10,14],deg:[0,2,4,6,1]},
    {id:"9s5",   label:"9♯5",       labelEn:"9♯5",       labelEs:"9♯5",       abbr:"9♯5",  st:[0,4,8,10,14],deg:[0,2,4,6,1]},
  ]},
];

let rootIdx=0, selChord=null, lastChord=null, playMode='chord', forceSpelling=null;

/* i18n helpers for chord categories and labels */
function tCat(cat){
  if(currentLang==='en') return cat.catEn||cat.cat;
  if(currentLang==='es') return cat.catEs||cat.cat;
  return cat.cat;
}
function tLbl(ch){
  if(currentLang==='en') return ch.labelEn||ch.label;
  if(currentLang==='es') return ch.labelEs||ch.label;
  return ch.label;
}
function fmtAcc(s){return s.replace(/𝄪/g,'<span class="ta-dblsharp">𝄪</span>').replace(/𝄫/g,'<span class="ta-dblsharp">𝄫</span>');}
let audioCtx=null, reverbNode=null;

/* ── Helpers ── */
function ni(n){const m=n.replace(/♯/g,"#").replace(/♭/g,"b");const t={"C":0,"C#":1,"Db":1,"D":2,"D#":3,"Eb":3,"E":4,"F":5,"F#":6,"Gb":6,"G":7,"G#":8,"Ab":8,"A":9,"A#":10,"Bb":10,"B":11};return t[m]??-1;}

/* Choose ♯ or ♭ spelling based on root context */
function useFlats(rootPC){return [1,3,5,8,10].includes(rootPC);}
function nn(pc,rootPC){
  pc=((pc%12)+12)%12;
  return(useFlats(rootPC)?F:S)[pc];
}

/* Spell note with proper letter name */
function spellNote(pc,letter){
  pc=((pc%12)+12)%12;
  const nat={"C":0,"D":2,"E":4,"F":5,"G":7,"A":9,"B":11}[letter];
  if(nat===undefined)return(useFlats(pc)?F:S)[pc];
  const d=((pc-nat)+12)%12;
  if(d===0)return letter;
  if(d===1)return letter+"♯";
  if(d===11)return letter+"♭";
  if(d===2)return letter+"𝄪";
  if(d===10)return letter+"𝄫";
  return S[pc];
}

function rootName(){
  const r=ROOTS[rootIdx];
  if(forceSpelling==='sharp')return r.sharp;
  if(forceSpelling==='flat')return r.flat;
  return useFlats(r.pc)?r.flat:r.sharp;
}

/* Build chord from root + chord type */
function buildChordData(chordType){
  const r=ROOTS[rootIdx];
  const rPC=r.pc;
  const rLetter=rootName().charAt(0);
  const rLI=L7.indexOf(rLetter);

  const notes=chordType.st.map(s=>(rPC+s)%12);
  const noteNames=chordType.st.map((s,i)=>{
    const pc=(rPC+s)%12;
    const letter=L7[(rLI+chordType.deg[i])%7];
    return spellNote(pc,letter);
  });

  const rn=rootName();
  const name=rn+chordType.abbr;
  return{name,notes,noteNames,root:rPC,qual:chordType.id,st:chordType.st};
}

/* ── SVG Staff (no key signature) ── */
function staffSVG(chord,displayName){
  if(!chord)return'';
  const W=340,H=150,sTop=28,lG=11;
  const lY=i=>sTop+i*lG;
  const letterDia={"C":0,"D":1,"E":2,"F":3,"G":4,"A":5,"B":6};
  const names=chord.noteNames;

  const rLetter=names[0].charAt(0),rDia=letterDia[rLetter];
  let rOct=4;if(rDia>=5)rOct=3;
  const rAbsDia=rOct*7+rDia;
  let prevAbs=rAbsDia-1;
  const noteData=chord.notes.map((pc,i)=>{
    const nName=names[i],letter=nName.charAt(0),dia=letterDia[letter];
    let abs=rOct*7+dia;
    while(abs<=prevAbs)abs+=7;
    prevAbs=abs;
    const dFC4=abs-28;
    const y=lY(4)-(dFC4-2)*(lG/2);
    const accStr=nName.substring(1);
    return{pc,y,dia,name:nName,accStr};
  });

  let svg=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">`;
  for(let i=0;i<5;i++)svg+=`<line x1="16" y1="${lY(i)}" x2="${W-16}" y2="${lY(i)}" stroke="#d1cfe6" stroke-width="1"/>`;
  svg+=`<text x="30" y="${lY(3)+2}" font-size="48" fill="#534AB7" font-family="serif" text-anchor="middle">𝄞</text>`;

  const nX0=68,nSp=30,nR=5.5;
  noteData.forEach((n,idx)=>{const x=nX0+idx*nSp,y=n.y;
    if(y>lY(4)+1)for(let ly=lY(4)+lG;ly<=y+1;ly+=lG)svg+=`<line x1="${x-10}" y1="${ly}" x2="${x+10}" y2="${ly}" stroke="#d1cfe6" stroke-width="1"/>`;
    if(y<lY(0)-1)for(let ly=lY(0)-lG;ly>=y-1;ly-=lG)svg+=`<line x1="${x-10}" y1="${ly}" x2="${x+10}" y2="${ly}" stroke="#d1cfe6" stroke-width="1"/>`;
    const acc=n.accStr;
    if(acc){const isDb=acc==='𝄪'||acc==='𝄫';const fs=isDb?18:14;svg+=`<text x="${x-13}" y="${y+5}" font-size="${fs}" fill="#1e1e2e" font-family="serif" text-anchor="middle">${acc}</text>`;}
    svg+=`<ellipse cx="${x}" cy="${y}" rx="${nR}" ry="${nR-1.5}" fill="#1e1e2e" transform="rotate(-12 ${x} ${y})"/>`;
    svg+=`<text x="${x}" y="${lY(4)+26}" font-size="11" fill="${idx===0?'#534AB7':'#6b7280'}" font-weight="${idx===0?'700':'500'}" font-family="DM Sans,sans-serif" text-anchor="middle">${n.name.replace(/𝄪/g,'').replace(/𝄫/g,'')}</text>`;
    const nAcc=n.name.substring(1);if(nAcc==='𝄪'||nAcc==='𝄫')svg+=`<text x="${x+12}" y="${lY(4)+26}" font-size="15" fill="${idx===0?'#534AB7':'#6b7280'}" font-family="serif" text-anchor="middle">${nAcc}</text>`;
  });
  svg+=`<text x="${W/2}" y="${H-6}" font-size="15" fill="#534AB7" font-weight="700" font-family="DM Sans,serif" text-anchor="middle">${displayName}</text>`;
  svg+='</svg>';return svg;
}

/* ── Piano HTML ── */
function pianoHTML(chord){
  const rPC=chord.root%12;
  /* Build ascending midi set */
  const chordSemis=[0];
  for(let i=1;i<chord.st.length;i++){
    let s=chord.st[i];
    while(s<=chordSemis[chordSemis.length-1])s+=12;
    chordSemis.push(s);
  }
  const rootMidi=60+rPC,absMidis=chordSemis.map(s=>rootMidi+s);
  const names=chord.noteNames;
  const midiToName={};
  absMidis.forEach((m,i)=>{midiToName[m]=names[i];});

  const minChord=Math.min(...absMidis),maxChord=Math.max(...absMidis);
  const isBK=m=>[1,3,6,8,10].includes(((m%12)+12)%12);

  let chordWhites=0;
  for(let m=minChord;m<=maxChord;m++){if(!isBK(m))chordWhites++;}
  const padEach=Math.max(3,Math.min(5,Math.floor((12-chordWhites)/2)));

  let kbS=minChord;
  if(isBK(kbS))kbS--;
  let counted=0;
  while(counted<padEach){kbS--;if(!isBK(kbS))counted++;}

  let kbE=maxChord;
  if(isBK(kbE))kbE++;
  counted=0;
  while(counted<padEach){kbE++;if(!isBK(kbE))counted++;}

  let whites=[],blacks=[];
  for(let m=kbS;m<=kbE;m++){if(!isBK(m))whites.push(m);else blacks.push(m);}

  const midiSet=new Set(absMidis);
  const nW=whites.length;
  const wPct=100/nW;
  const gap=0.3;
  const bkW=wPct*0.58;

  let h='';
  whites.forEach((m,i)=>{
    const pc=((m%12)+12)%12;
    const isR=midiSet.has(m)&&m===absMidis[0];
    const isH=midiSet.has(m)&&!isR;
    const lbl=midiToName[m]||nn(pc,rPC);
    h+=`<div class="ta-wk${isR?' hl':isH?' hl2':''}" style="position:absolute;left:${(i*wPct+gap/2).toFixed(2)}%;width:${(wPct-gap).toFixed(2)}%">${lbl}</div>`;
  });
  blacks.forEach(m=>{
    const pc=((m%12)+12)%12;
    const isR=midiSet.has(m)&&m===absMidis[0];
    const isH=midiSet.has(m)&&!isR;
    const wb=whites.filter(w=>w<m).length;
    h+=`<div class="ta-bk${isR?' hl':isH?' hl2':''}" style="left:${(wb*wPct-bkW/2).toFixed(2)}%;width:${bkW.toFixed(2)}%"></div>`;
  });
  return`<div style="position:relative;width:100%;height:80px">${h}</div>`;
}

/* ── Audio (same engine as T3) ── */
function m2f(midi){return 440*Math.pow(2,(midi-69)/12);}

function playChordAudio(chord){
  if(!chord||!chord.notes||!chord.notes.length)return;
  const chain=_getPianoChain();
  const ctx=chain.ctx, dG=chain.dry, rev=chain.wet;
  const rPC=chord.root%12;
  const midis=[60+rPC];
  for(let i=1;i<chord.st.length;i++){
    let m=60+rPC+chord.st[i];
    midis.push(m);
  }
  const now=ctx.currentTime;
  if(playMode==='chord'){midis.forEach((m,i)=>{pianoNote(m2f(m),now+i*0.008*(0.8+Math.random()*0.4),1.8,ctx,dG,rev,0.28+Math.random()*0.06);});}
  else{const bd=0.18;midis.forEach((m,i)=>{pianoNote(m2f(m),now+i*(bd+Math.random()*0.025),1.8,ctx,dG,rev,0.25+Math.random()*0.05);});}
  const btn=document.getElementById('tabtnPlay');
  if(btn){btn.classList.add('playing');setTimeout(()=>btn.classList.remove('playing'),playMode==='chord'?500:midis.length*200+400);}
}

/* ── Dropdown ── */
function isEnharmonic(r){return r.sharp!==r.flat;}
function buildDD(){
  const list=document.getElementById('takddList');
  list.innerHTML=ROOTS.map((r,i)=>{
    if(isEnharmonic(r)){
      const selS=i===rootIdx&&forceSpelling==='sharp';
      const selF=i===rootIdx&&forceSpelling==='flat';
      return `<div class="ta-kdd-item ta-kdd-enhar"><span class="ta-enh-opt${selS?' sel':''}" onclick="event.stopPropagation();TA.pickRoot(${i},'sharp')">${r.sharp}</span><span class="ta-enh-sep">/</span><span class="ta-enh-opt${selF?' sel':''}" onclick="event.stopPropagation();TA.pickRoot(${i},'flat')">${r.flat}</span></div>`;
    }
    return `<div class="ta-kdd-item${i===rootIdx?' sel':''}" onclick="TA.pickRoot(${i})">${r.label}</div>`;
  }).join('');
  const r=ROOTS[rootIdx];
  const rn=rootName();
  document.getElementById('takddBtn').innerHTML=`<span>${isEnharmonic(r)?rn:r.label}</span>`;
}

/* ── Chord buttons ── */
function renderChords(){
  const rn=rootName();
  document.getElementById('tasC').innerHTML='<div class="ta-title">'+(tx('Accords','Chords','Acordes'))+'</div>'+CHORD_TYPES.map(cat=>{
    return `<div class="ta-sg"><div class="ta-sg-t">${tCat(cat)}</div><div class="ta-sg-r">${cat.items.map(ch=>{
      const display=rn+ch.abbr;
      const isOn=selChord&&selChord.id===ch.id;
      return `<button class="ta-sb${isOn?' on':''}" onclick="TA.doSelect('${ch.id}')">${display}</button>`;
    }).join('')}</div></div>`;
  }).join('');
}

/* ── Select a chord ── */
function findChordType(id){
  for(const cat of CHORD_TYPES)for(const ch of cat.items)if(ch.id===id)return ch;
  return null;
}

function doSelect(id){
  const ct=findChordType(id);
  if(!ct)return;
  selChord=ct;
  const chord=buildChordData(ct);
  lastChord=chord;

  const rn=rootName();
  const displayName=rn+ct.abbr;

  /* Badge */
  document.getElementById('tabadge').innerHTML=`<strong>${fmtAcc(displayName)}</strong> — ${tLbl(ct)}`;

  /* Staff box */
  const box=document.getElementById('tasB');
  const svg=staffSVG(chord,displayName);
  const pn=pianoHTML(chord);
  const ctEl=chord.noteNames.map((name,i)=>`<span class="${i===0?'rt':''}">${fmtAcc(name)}</span>`).join('<span class="sp">–</span>');

  var cfgFg=_fgGetChord(ROOTS[rootIdx].pc, ct.id);
  var cfgHTML=cfgFg?_fgRenderHTML(cfgFg, chord.noteNames, t('fg_bl')):'';
  var arpFg=_fgGetArp(ROOTS[rootIdx].pc, ct.id);
  var arpHTML='';
  if(arpFg){
    /* Build arpeggio note names: for a triad, root-3rd-5th-octave */
    var arpNotes=chord.noteNames.slice();
    arpNotes.push(chord.noteNames[0]);
    arpHTML=_fgRenderHTML(arpFg, arpNotes, t('btn_arp'));
  }
  box.innerHTML=svg
    +`<div class="ta-chord-lbl"><span class="rn">${displayName}</span></div>`
    +`<div class="ta-pw">${pn}</div>`
    +`<div class="ta-ct">${ctEl}</div>`
    +cfgHTML
    +arpHTML
    +`<div class="ta-play-row">`
    +`<button class="ta-btn-play" id="tabtnPlay" onclick="TA.play()"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>${t("btn_listen")}</button>`
    +`<div class="ta-pm"><button class="ta-pm-btn${playMode==='chord'?' on':''}" onclick="TA.setPM('chord')">${t('btn_chord')}</button><button class="ta-pm-btn${playMode==='arp'?' on':''}" onclick="TA.setPM('arp')">${t('btn_arp')}</button></div>`
    +`</div>`;

  /* Update buttons */
  document.querySelectorAll('.ta-sb').forEach(b=>b.classList.toggle('on',b.textContent===displayName));
}

/* ── Render ── */
function render(){
  buildDD();
  const rn=rootName();
  document.getElementById('tabadge').innerHTML=selChord?`<strong>${fmtAcc(rn+selChord.abbr)}</strong> — ${tLbl(selChord)}`:`<strong>${fmtAcc(rn)}</strong>`;
  renderChords();
  if(selChord)doSelect(selChord.id);
  else document.getElementById('tasB').innerHTML='<div class="ta-empty">'+t('h_chord')+'</div>';
}

/* Close dropdown on outside click */
document.addEventListener('click',function(e){
  const dd=document.getElementById('takdd');
  if(dd&&!dd.contains(e.target))dd.classList.remove('open');
});

return{
  toggleDD(){document.getElementById('takdd').classList.toggle('open');},
  pickRoot(i,spelling){rootIdx=i;forceSpelling=spelling||null;document.getElementById('takdd').classList.remove('open');render();},
  doSelect:doSelect,
  play(){if(lastChord)playChordAudio(lastChord);},
  setPM(m){playMode=m;document.querySelectorAll('.ta-pm-btn').forEach(b=>{const txt=b.textContent;b.classList.toggle('on',(m==='chord'&&(txt==='Accord'||txt==='Chord'))||(m==='arp'&&(txt==='Arpège'||txt==='Arpeggio')));});},
  init(){render();}
};
})();

/* ── Init auto ── */
try{TA.init()}catch(e){console.error('TA:',e)}
