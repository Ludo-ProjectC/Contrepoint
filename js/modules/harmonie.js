/* ═══════════════════════════════════════════════════════════════════
   harmonie.js — Module harmonie
   Chargé dynamiquement par main.js lors du premier accès à l'onglet.
   Toutes les fonctions/variables avec préfixe majuscule (T1, MOD, etc.)
   sont exposées sur window pour rétro-compat avec onclick="..."
   ═══════════════════════════════════════════════════════════════════ */
/* ═══ HARMONIE ═══ */
const T3=(function(){
const S3=["C","C♯","D","D♯","E","F","F♯","G","G♯","A","A♯","B"];
const FL3=["C","D♭","D","E♭","E","F","G♭","G","A♭","A","B♭","B"];
const L73=["C","D","E","F","G","A","B"];
const UF3={"C":0,"G":0,"D":0,"A":0,"E":0,"B":0,"F♯":0,"C♯":0,"G♯":0,"F":1,"B♭":1,"E♭":1,"A♭":1,"D♭":1,"G♭":1};
const KP=[{maj:"C",min:"A"},{maj:"G",min:"E"},{maj:"D",min:"B"},{maj:"A",min:"F♯"},{maj:"E",min:"C♯"},{maj:"B",min:"G♯"},{maj:"F♯",min:"D♯"},{maj:"G♭",min:"E♭"},{maj:"D♭",min:"B♭"},{maj:"A♭",min:"F"},{maj:"E♭",min:"C"},{maj:"B♭",min:"G"},{maj:"F",min:"D"}];
const RU3=["I","II","III","IV","V","VI","VII"],RL3=["i","ii","iii","iv","v","vi","vii"];
const KSM3={"C":0,"G":1,"D":2,"A":3,"E":4,"B":5,"F♯":6,"G♭":-6,"D♭":-5,"A♭":-4,"E♭":-3,"B♭":-2,"F":-1};
const KSm3={"A":0,"E":1,"B":2,"F♯":3,"C♯":4,"G♯":5,"D♯":6,"E♭":-6,"B♭":-5,"F":-4,"C":-3,"G":-2,"D":-1};

let st3={key:"C",mode:"major",sel:null,pairIdx:0,lastChord:null};
let audioCtx=null, reverbNode=null, playMode='chord';

function ni(n){const m=n.replace(/♯/g,"#").replace(/♭/g,"b").replace(/𝄪/g,"##").replace(/𝄫/g,"bb");const t={"C":0,"C#":1,"C##":2,"Dbb":0,"Db":1,"D":2,"D#":3,"D##":4,"Ebb":2,"Eb":3,"E":4,"E#":5,"E##":6,"Fb":4,"F":5,"F#":6,"F##":7,"Gbb":5,"Gb":6,"G":7,"G#":8,"G##":9,"Abb":7,"Ab":8,"A":9,"A#":10,"A##":11,"Bbb":9,"Bb":10,"B":11,"B#":0,"B##":1,"Cb":11};return(t[m]??-1+12)%12;}
function uf(k){return UF3[k]??(k.includes("♭")?1:0);}
function nn(s,k){return(uf(k)?FL3:S3)[((s%12)+12)%12];}
function sIvl(m){return m==="major"?[0,2,4,5,7,9,11]:[0,2,3,5,7,8,10];}

function spellNote(pc, letter){
  const natPC={"C":0,"D":2,"E":4,"F":5,"G":7,"A":9,"B":11};
  const nat=natPC[letter];
  if(nat===undefined)return nn(pc,st3.key);
  const d=((pc-nat)+12)%12;
  if(d===0) return letter;
  if(d===1) return letter+"♯";
  if(d===11) return letter+"♭";
  if(d===2) return letter+"𝄪";
  if(d===10) return letter+"𝄫";
  return nn(pc,st3.key);
}

function getScaleNames(key,mode){
  const iv=sIvl(mode),ri=ni(key),rli=L73.indexOf(key.charAt(0));
  return iv.map((interval,deg)=>{
    const semi=(ri+interval)%12;
    const letter=L73[(rli+deg)%7];
    return spellNote(semi,letter);
  });
}

function scN(root,mode){return getScaleNames(root,mode);}

function parseRN(raw){
  let s=raw.trim();if(!s)return null;
  if(s==="N"||s==="N6"||s==="♭II6"||s==="bII6")return{deg:1,qual:"N",flat:true,sharp:false,adds:"",sec:null,isMin:false};
  if(/^It\+?6?$/i.test(s))return{deg:-1,qual:"It6",sec:null};
  if(/^Fr\+?6?$/i.test(s))return{deg:-1,qual:"Fr6",sec:null};
  if(/^Ger\+?6?$/i.test(s))return{deg:-1,qual:"Ger6",sec:null};
  let sec=null;const si=s.lastIndexOf("/");
  if(si>0){const a=s.substring(si+1),au=a.toUpperCase().replace(/♭|♯|#|b/g,"");if(["VII","VI","IV","V","III","II","I"].some(r=>au.startsWith(r))){sec=a;s=s.substring(0,si);}}
  let flat=false,sharp=false;
  if(s.startsWith("♭")||s.startsWith("b")){flat=true;s=s.substring(1);}
  else if(s.startsWith("♯")||s.startsWith("#")){sharp=true;s=s.substring(1);}
  let deg=-1,consumed=0,isMin=false;
  for(const[r,d]of[["VII",6],["VI",5],["IV",3],["V",4],["III",2],["II",1],["I",0]]){if(s.toUpperCase().startsWith(r)){deg=d;consumed=r.length;isMin=s.substring(0,consumed)===s.substring(0,consumed).toLowerCase();break;}}
  if(deg===-1)return null;
  let rest=s.substring(consumed),qual=isMin?"m":"M";
  if(rest.startsWith("+")){qual="aug";rest=rest.substring(1);}
  if(rest.startsWith("°")||rest.startsWith("o")){qual="dim";rest=rest.substring(1);if(rest.startsWith("7")){qual="dim7";rest=rest.substring(1);}}
  if(rest.startsWith("ø")||rest.startsWith("Ø")){qual="hdim7";rest=rest.substring(1);if(rest.startsWith("7"))rest=rest.substring(1);}
  let adds=rest;
  if(adds.includes("7")&&qual==="M")qual="dom7";
  if(adds.includes("7")&&qual==="m")qual="m7";
  if(adds==="M7"||adds==="maj7"){qual="maj7";adds="";}
  if(adds==="7"&&["dom7","m7","dim7"].includes(qual))adds="";
  return{deg,qual,isMin,adds,sec,flat,sharp};
}

function cTones(r,q){
  const m={
    M:   {st:[0,4,7],     deg:[0,2,4]},
    m:   {st:[0,3,7],     deg:[0,2,4]},
    dim: {st:[0,3,6],     deg:[0,2,4]},
    aug: {st:[0,4,8],     deg:[0,2,4]},
    dom7:{st:[0,4,7,10],  deg:[0,2,4,6]},
    m7:  {st:[0,3,7,10],  deg:[0,2,4,6]},
    maj7:{st:[0,4,7,11],  deg:[0,2,4,6]},
    dim7:{st:[0,3,6,9],   deg:[0,2,4,6]},
    hdim7:{st:[0,3,6,10], deg:[0,2,4,6]},
  };
  const info=m[q]||m.M;
  return {
    notes: info.st.map(i=>(r+i)%12),
    degOffsets: info.deg
  };
}

function buildChord(key,mode,p){
  if(!p)return null;
  const si=sIvl(mode),ri=ni(key),rli=L73.indexOf(key.charAt(0));
  const scNames=getScaleNames(key,mode);

  if(p.qual==="N"){
    const deg2letter=L73[(rli+1)%7];
    const rootPC=(ri+si[1]-1+12)%12;
    const rootName=spellNote(rootPC,deg2letter);
    const rootLI=L73.indexOf(deg2letter);
    const thirdPC=(rootPC+4)%12;
    const fifthPC=(rootPC+7)%12;
    const thirdName=spellNote(thirdPC,L73[(rootLI+2)%7]);
    const fifthName=spellNote(fifthPC,L73[(rootLI+4)%7]);
    return{name:rootName,notes:[thirdPC,fifthPC,rootPC],noteNames:[thirdName,fifthName,rootName],root:thirdPC,qual:"M"};
  }

  if(p.qual==="It6"||p.qual==="Fr6"||p.qual==="Ger6"){
    const deg6letter=L73[(rli+5)%7];
    const b6PC=(ri+8)%12;
    const b6Name=spellNote(b6PC,deg6letter);
    const tonicPC=ri;
    const tonicName=scNames[0];
    const deg4letter=L73[(rli+3)%7];
    const s4PC=(ri+6)%12;
    const s4Name=spellNote(s4PC,deg4letter);

    if(p.qual==="It6"){
      return{name:b6Name+" It+6",notes:[b6PC,tonicPC,s4PC],noteNames:[b6Name,tonicName,s4Name],root:b6PC,qual:"It6"};
    }
    if(p.qual==="Fr6"){
      const deg2PC=(ri+si[1])%12;
      const deg2Name=scNames[1];
      return{name:b6Name+" Fr+6",notes:[b6PC,tonicPC,deg2PC,s4PC],noteNames:[b6Name,tonicName,deg2Name,s4Name],root:b6PC,qual:"Fr6"};
    }
    if(p.qual==="Ger6"){
      const deg3letter=L73[(rli+2)%7];
      const b3PC=(ri+3)%12;
      const b3Name=spellNote(b3PC,deg3letter);
      return{name:b6Name+" Ger+6",notes:[b6PC,tonicPC,b3PC,s4PC],noteNames:[b6Name,tonicName,b3Name,s4Name],root:b6PC,qual:"Ger6"};
    }
  }

  let rootDeg, rs;
  if(p.sec){
    const sp=parseRN(p.sec);if(!sp)return null;
    let ss=(ri+si[sp.deg])%12;
    if(sp.flat)ss=(ss-1+12)%12;
    if(sp.sharp)ss=(ss+1)%12;
    const ssi=sIvl(sp.isMin?"minor":"major");
    rs=(ss+ssi[p.deg])%12;
    rootDeg=(sp.deg+p.deg)%7;
  } else {
    rs=(ri+si[p.deg])%12;
    rootDeg=p.deg;
    // Harmonic minor : vii°/vii°7 are built on the raised 7th (leading tone).
    // Natural minor's 7th degree is a whole step below tonic (VII major), but the
    // diminished chord on that degree only exists when the 7th is raised a half-step.
    if(mode==='minor' && p.deg===6 && (p.qual==='dim' || p.qual==='dim7')) rs=(rs+1)%12;
  }
  if(p.flat)rs=(rs-1+12)%12;
  if(p.sharp)rs=(rs+1)%12;

  const rootLetter=L73[(rli+rootDeg)%7];
  const rootName=spellNote(rs,rootLetter);
  const rootLI=L73.indexOf(rootLetter);

  let q=p.qual;
  const ct=cTones(rs,q);
  const noteNames=ct.notes.map((pc,i)=>{
    const letter=L73[(rootLI+ct.degOffsets[i])%7];
    return spellNote(pc,letter);
  });

  let name=rootName;
  switch(q){case"m":name+="m";break;case"dim":name+="°";break;case"aug":name+="+";break;case"dom7":name+="7";break;case"m7":name+="m7";break;case"maj7":name+="maj7";break;case"dim7":name+="°7";break;case"hdim7":name+="ø7";break;}
  return{name,notes:ct.notes,noteNames,root:rs,qual:q};
}

function ksInfo(key,mode){
  const n=(mode==="major"?KSM3[key]:KSm3[key])||0;
  if(n===0)return{text:t("ks0")};
  const sN=["F♯","C♯","G♯","D♯","A♯","E♯","B♯"],fN=["B♭","E♭","A♭","D♭","G♭","C♭","F♭"];
  if(n>0)return{text:`${n} ${n>1?t("ks_ss"):t("ks_s")} : ${sN.slice(0,n).join(" ")}`};
  const c=-n;return{text:`${c} ${c>1?t("ks_ff"):t("ks_f")} : ${fN.slice(0,c).join(" ")}`};
}

// ── SVG Staff ──
function staffSVG(chord,key,mode,symbol){
  if(!chord)return'';
  const W=340,sTop=28,lG=11;
  const lY=i=>sTop+i*lG;
  const letterDia={"C":0,"D":1,"E":2,"F":3,"G":4,"A":5,"B":6};
  const names=chord.noteNames||chord.notes.map(pc=>nn(pc,key));

  const rName=names[0], rLetter=rName.charAt(0), rDia=letterDia[rLetter];
  let rOct=4;if(rDia>=5)rOct=3;
  const rAbsDia=rOct*7+rDia;
  let prevAbs=rAbsDia-1;
  const notes=chord.notes.map((pc,i)=>{
    const nName=names[i], letter=nName.charAt(0), dia=letterDia[letter];
    let abs=rOct*7+dia;
    while(abs<=prevAbs)abs+=7;
    prevAbs=abs;
    const dFC4=abs-28;
    const y=lY(4)-(dFC4-2)*(lG/2);
    const accStr=nName.substring(1);
    return{pc,y,dia,name:nName,accStr};
  });

  // Dynamic label Y: always below the lowest note with enough margin
  const maxNoteY=Math.max(...notes.map(n=>n.y));
  const labelY=Math.max(lY(4)+26, maxNoteY+18);
  const symbolY=labelY+22;
  const H=Math.max(150, symbolY+10);

  const ksN=(mode==="major"?KSM3[key]:KSm3[key])||0;
  const sYs=[lY(0),lY(1)+lG/2,lY(0)-lG/2,lY(1),lY(2)+lG/2,lY(1)-lG/2,lY(2)];
  const fYs=[lY(2),lY(0)+lG/2,lY(2)+lG/2,lY(1),lY(3)+lG/2,lY(1)+lG/2,lY(3)];
  const shO=[3,0,4,1,5,2,6],flO=[6,2,5,1,4,0,3];
  const ksSet=new Map();
  if(ksN>0)for(let i=0;i<ksN;i++)ksSet.set(shO[i],'sharp');
  if(ksN<0)for(let i=0;i<-ksN;i++)ksSet.set(flO[i],'flat');

  function needAcc(noteObj){
    const dia=noteObj.dia, accStr=noteObj.accStr;
    const ksAcc=ksSet.get(dia);
    if(accStr===''||accStr===undefined){return ksAcc?'♮':null;}
    if(accStr==='♯'){return(ksAcc==='sharp')?null:'♯';}
    if(accStr==='♭'){return(ksAcc==='flat')?null:'♭';}
    if(accStr==='𝄪')return '𝄪';
    if(accStr==='𝄫')return '𝄫';
    return accStr||null;
  }

  let svg=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">`;
  for(let i=0;i<5;i++)svg+=`<line x1="16" y1="${lY(i)}" x2="${W-16}" y2="${lY(i)}" stroke="#d1cfe6" stroke-width="1"/>`;
  svg+=`<text x="30" y="${lY(3)+2}" font-size="48" fill="#534AB7" font-family="serif" text-anchor="middle">𝄞</text>`;
  let ksX=50;
  if(ksN>0)for(let i=0;i<ksN;i++){svg+=`<text x="${ksX}" y="${sYs[i]+5}" font-size="15" fill="#1e1e2e" font-family="serif" text-anchor="middle">♯</text>`;ksX+=9;}
  else if(ksN<0)for(let i=0;i<-ksN;i++){svg+=`<text x="${ksX}" y="${fYs[i]+5}" font-size="15" fill="#1e1e2e" font-family="serif" text-anchor="middle">♭</text>`;ksX+=9;}
  const nX0=ksX+28,nSp=30,nR=5.5;
  notes.forEach((n,idx)=>{const x=nX0+idx*nSp,y=n.y;
    if(y>lY(4)+1)for(let ly=lY(4)+lG;ly<=y+1;ly+=lG)svg+=`<line x1="${x-10}" y1="${ly}" x2="${x+10}" y2="${ly}" stroke="#d1cfe6" stroke-width="1"/>`;
    if(y<lY(0)-1)for(let ly=lY(0)-lG;ly>=y-1;ly-=lG)svg+=`<line x1="${x-10}" y1="${ly}" x2="${x+10}" y2="${ly}" stroke="#d1cfe6" stroke-width="1"/>`;
    const acc=needAcc(n);if(acc)svg+=`<text x="${x-13}" y="${y+5}" font-size="14" fill="#1e1e2e" font-family="serif" text-anchor="middle">${acc}</text>`;
    svg+=`<ellipse cx="${x}" cy="${y}" rx="${nR}" ry="${nR-1.5}" fill="#1e1e2e" transform="rotate(-12 ${x} ${y})"/>`;
    svg+=`<text x="${x}" y="${labelY}" font-size="11" fill="${idx===0?'#534AB7':'#6b7280'}" font-weight="${idx===0?'700':'500'}" font-family="DM Sans,sans-serif" text-anchor="middle">${n.name}</text>`;
  });
  svg+=`<text x="${W/2}" y="${symbolY}" font-size="15" fill="#534AB7" font-weight="700" font-family="DM Sans,serif" text-anchor="middle">${symbol}</text>`;
  svg+='</svg>';return svg;
}

// ── Piano ──
function pianoHTML(chord){
  const rPC=chord.root%12;
  const chordSemis=[0];
  for(let i=1;i<chord.notes.length;i++){let semi=((chord.notes[i]%12)-rPC+12)%12;while(semi<=chordSemis[chordSemis.length-1])semi+=12;chordSemis.push(semi);}
  const rootMidi=60+rPC,absMidis=chordSemis.map(s=>rootMidi+s);
  const names=chord.noteNames||chord.notes.map(pc=>nn(pc,st3.key));
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
    const lbl=midiToName[m]||nn(pc,st3.key);
    h+=`<div class="t3-wk${isR?' hl':isH?' hl2':''}" style="position:absolute;left:${(i*wPct+gap/2).toFixed(2)}%;width:${(wPct-gap).toFixed(2)}%">${lbl}</div>`;
  });
  blacks.forEach(m=>{
    const pc=((m%12)+12)%12;
    const isR=midiSet.has(m)&&m===absMidis[0];
    const isH=midiSet.has(m)&&!isR;
    const wb=whites.filter(w=>w<m).length;
    h+=`<div class="t3-bk${isR?' hl':isH?' hl2':''}" style="left:${(wb*wPct-bkW/2).toFixed(2)}%;width:${bkW.toFixed(2)}%"></div>`;
  });
  return`<div style="position:relative;width:100%;height:80px">${h}</div>`;
}

// ── Audio ──
function m2f(midi){return 440*Math.pow(2,(midi-69)/12);}

function playChordAudio(chord){
  if(!chord||!chord.notes||!chord.notes.length)return;
  const chain=_getPianoChain();
  const ctx=chain.ctx, dG=chain.dry, rev=chain.wet;
  const rPC=chord.root%12,midis=[60+rPC];
  for(let i=1;i<chord.notes.length;i++){let m=60+(chord.notes[i]%12);while(m<=midis[midis.length-1])m+=12;midis.push(m);}
  const now=ctx.currentTime;
  if(playMode==='chord'){midis.forEach((m,i)=>{pianoNote(m2f(m),now+i*0.008*(0.8+Math.random()*0.4),1.8,ctx,dG,rev,0.28+Math.random()*0.06);});}
  else{const bd=0.18;midis.forEach((m,i)=>{pianoNote(m2f(m),now+i*(bd+Math.random()*0.025),1.8,ctx,dG,rev,0.25+Math.random()*0.05);});}
  const btn=document.getElementById('t3btnPlay');
  if(btn){btn.classList.add('playing');setTimeout(()=>btn.classList.remove('playing'),playMode==='chord'?500:midis.length*200+400);}
}

/* ── Mini key-signature SVG for dropdown ── */
function miniKsSVG(keyName,w,h){
  const n=KSM3[keyName]||0;
  const sTop=6,lG=5,lY=i=>sTop+i*lG;
  let svg=`<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">`;
  for(let i=0;i<5;i++)svg+=`<line x1="0" y1="${lY(i)}" x2="${w}" y2="${lY(i)}" stroke="#d1cfe6" stroke-width="0.7"/>`;
  if(n===0){svg+='</svg>';return svg;}
  const sYs=[lY(0),lY(1)+lG/2,lY(0)-lG/2,lY(1),lY(2)+lG/2,lY(1)-lG/2,lY(2)];
  const fYs=[lY(2),lY(0)+lG/2,lY(2)+lG/2,lY(1),lY(3)+lG/2,lY(1)+lG/2,lY(3)];
  const cnt=Math.abs(n),sp=7;
  if(n>0)for(let i=0;i<cnt;i++)svg+=`<text x="${3+i*sp}" y="${sYs[i]+4}" font-size="10" fill="#534AB7" font-family="serif" text-anchor="middle">♯</text>`;
  else for(let i=0;i<cnt;i++)svg+=`<text x="${3+i*sp}" y="${fYs[i]+4}" font-size="10" fill="#534AB7" font-family="serif" text-anchor="middle">♭</text>`;
  svg+='</svg>';
  return svg;
}

function buildDD(){
  const list=document.getElementById('t3kddList');
  const svgW=i=>{const n=Math.abs(KSM3[KP[i].maj]||0);return Math.max(20,n*7+6);};
  list.innerHTML=KP.map((p,i)=>{
    const n=KSM3[p.maj]||0;
    const w=svgW(i);
    const ksLabel=n===0?'':n>0?`${n}♯`:`${Math.abs(n)}♭`;
    return `<div class="t3-kdd-item${i===st3.pairIdx?' sel':''}" onclick="T3.pickKey(${i})">
      ${miniKsSVG(p.maj,w,32)}
      <span class="kdd-label">${p.maj} / ${p.min}m</span>
      <span style="margin-left:auto;font-size:10px;color:#9ca3af">${ksLabel}</span>
    </div>`;
  }).join('');

  const cur=KP[st3.pairIdx];
  const n=KSM3[cur.maj]||0;
  const w=Math.max(20,Math.abs(n)*7+6);
  document.getElementById('t3kddBtn').innerHTML=miniKsSVG(cur.maj,w,32)+`<span>${cur.maj} / ${cur.min}m</span>`;
}

// ── UI ──
function render(){
  buildDD();
  const pair=KP[st3.pairIdx];
  st3.key=st3.mode==="major"?pair.maj:pair.min;
  const b=document.getElementById("t3mP").children;
  b[0].className="t3-pill"+(st3.mode==="major"?" on":"");
  b[1].className="t3-pill"+(st3.mode==="minor"?" on":"");
  const ks=ksInfo(st3.key,st3.mode);
  document.getElementById("t3ksBadge").innerHTML=`<span class="ks-icon">𝄞</span> <strong>${st3.key} ${st3.mode==="major"?t("major"):t("minor")}</strong> — ${ks.text}`;
  renderSymbols();
  if(st3.sel)doSelect(st3.sel,false);
  else document.getElementById("t3sB").innerHTML=`<div class="t3-empty">${t("h_sym")}</div>`;
}

function renderSymbols(){
  const isMaj=st3.mode==="major";
  const sec=[
    {t:t("c_dt"),items:isMaj?["I","ii","iii","IV","V","vi","vii°"]:["i","ii°","III","iv","v","V","VI","VII","vii°"]},
    {t:t("c_7"),items:isMaj?["I7","ii7","iii7","IV7","V7","vi7","viiø7"]:["i7","iiø7","III7","iv7","v7","V7","VI7","VII7","vii°7"]},
    {t:t("c_mix"),items:isMaj?["i","ii°","II","ii","♭ii","♭III","iv","III","VI","♭VI","VII","♭VII","vii","♭II","N6","♭iii","♭vi","V+"]:["I","ii","II","iii","IV","♭ii","vii","♭II","N6","♭III","♭vi","♭VI","♭VII","V+"]},
    {t:t("c_sec"),items:["V/ii","V/iii","V/IV","V/V","V/vi","V7/ii","V7/iii","V7/IV","V7/V","V7/vi","vii°/V","vii°/ii","vii°/IV"]},
    {t:t("c_a6"),items:["It6","Fr6","Ger6"]},
  ];
  document.getElementById("t3sC").innerHTML='<div class="t3-title">'+t("t_sym")+'</div>'+sec.map(s=>`<div class="t3-sg"><div class="t3-sg-t">${s.t}</div><div class="t3-sg-r">${s.items.map(i=>`<button class="t3-sb${st3.sel===i?' on':''}" onclick="T3.doSelect('${i.replace(/'/g,"\\'")}')">${i}</button>`).join("")}</div></div>`).join("");
}

function doSelect(symbol,updateBtns){
  if(updateBtns===undefined)updateBtns=true;
  st3.sel=symbol;
  const p=parseRN(symbol),chord=buildChord(st3.key,st3.mode,p);
  const box=document.getElementById("t3sB");
  if(!chord){box.innerHTML=`<div class="t3-empty">${t("h_sym_err")}</div>`;return;}
  st3.lastChord=chord;

  const ks=ksInfo(st3.key,st3.mode);
  const degNames=["1","2","3","4","5","6","7"];
  const isMaj=st3.mode==="major";
  const mixMaj=["i","ii°","II","ii","♭ii","♭III","iv","III","VI","♭VI","VII","♭VII","vii","♭II","N6","♭iii","♭vi","V+"];
  const mixMin=["I","ii","II","iii","IV","♭ii","vii","♭II","N6","♭III","♭vi","♭VI","♭VII","V+"];
  const augSix=["It6","Fr6","Ger6"];
  const isMix=(isMaj?mixMaj:mixMin).includes(symbol);
  const isAug6=augSix.includes(symbol);

  let altText='';
  if(isMix||isAug6){
    const scNames=getScaleNames(st3.key,st3.mode);
    const names=chord.noteNames||chord.notes.map(pc=>nn(pc,st3.key));
    const alterations=[];
    const seen=new Set();
    names.forEach(noteName=>{
      const letter=noteName.charAt(0);
      const acc=noteName.substring(1);
      for(let d=0;d<7;d++){
        if(scNames[d].charAt(0)===letter){
          const scaleAcc=scNames[d].substring(1);
          if(acc!==scaleAcc){
            const label=(acc.includes('♭')||acc===''&&scaleAcc.includes('♯'))?'♭':'♯';
            const key=label+(d+1);
            if(!seen.has(key)){seen.add(key);alterations.push(key);}
          }
          break;
        }
      }
    });
    if(alterations.length>0){
      altText=' · '+(alterations.length>1?t('c_alts'):t('c_alt'))+' : '+alterations.join(', ');
    }
  }

  const badgeInfo=altText?altText.substring(3):ks.text;
  document.getElementById("t3ksBadge").innerHTML=`<span class="ks-icon">𝄞</span> <strong>${st3.key} ${st3.mode==="major"?t("major"):t("minor")}</strong> — ${badgeInfo}`;

  const svg=staffSVG(chord,st3.key,st3.mode,symbol);
  const pn=pianoHTML(chord);
  const ct=(chord.noteNames||chord.notes.map(pc=>nn(pc,st3.key))).map((name,i)=>`<span class="${i===0?'rt':''}">${name}</span>`).join('<span class="sp">–</span>');
  box.innerHTML=svg
    +`<div class="t3-chord-lbl"><span class="rn">${symbol}</span><span class="ar">→</span>${chord.name}</div>`
    +`<div class="t3-pw">${pn}</div>`
    +`<div class="t3-ct">${ct}</div>`
    +`<div class="t3-play-row">`
    +`<button class="t3-btn-play" id="t3btnPlay" onclick="T3.play()"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>${t("btn_listen")}</button>`
    +`<div class="t3-pm"><button class="t3-pm-btn${playMode==='chord'?' on':''}" onclick="T3.setPM('chord')">${t('btn_chord')}</button><button class="t3-pm-btn${playMode==='arp'?' on':''}" onclick="T3.setPM('arp')">${t('btn_arp')}</button></div>`
    +`</div>`;
  if(updateBtns)document.querySelectorAll('.t3-sb').forEach(b=>{b.classList.toggle('on',b.textContent===symbol);});
}

document.addEventListener('click',function(e){
  const dd=document.getElementById('t3kdd');
  if(dd&&!dd.contains(e.target))dd.classList.remove('open');
});

/* ── Cercle des Quintes ── */
(function(){
  // Labels trilingues par tonalité
  const LABELS_MAJ={
    fr:['Do','Sol','Ré','La','Mi','Si','Fa♯','Ré♭','La♭','Mi♭','Si♭','Fa'],
    en:['C','G','D','A','E','B','F♯','D♭','A♭','E♭','B♭','F'],
    es:['Do','Sol','Re','La','Mi','Si','Fa♯','Re♭','La♭','Mi♭','Si♭','Fa'],
  };
  const LABELS_MIN={
    fr:['La m','Mi m','Si m','Fa♯m','Do♯m','Sol♯m','Ré♯m','Si♭m','Fa m','Do m','Sol m','Ré m'],
    en:['Am','Em','Bm','F♯m','C♯m','G♯m','D♯m','B♭m','Fm','Cm','Gm','Dm'],
    es:['La m','Mi m','Si m','Fa♯m','Do♯m','Sol♯m','Re♯m','Si♭m','Fa m','Do m','Sol m','Re m'],
  };

  const COF_MAJOR=[
    {key:'C',  angle:0},  {key:'G',  angle:30}, {key:'D',  angle:60},
    {key:'A',  angle:90}, {key:'E',  angle:120},{key:'B',  angle:150},
    {key:'F♯', angle:180},{key:'D♭', angle:210},{key:'A♭', angle:240},
    {key:'E♭', angle:270},{key:'B♭', angle:300},{key:'F',  angle:330},
  ];
  const COF_MINOR=[
    {key:'A',  angle:0},  {key:'E',  angle:30}, {key:'B',  angle:60},
    {key:'F♯', angle:90}, {key:'C♯', angle:120},{key:'G♯', angle:150},
    {key:'D♯', angle:180},{key:'B♭', angle:210},{key:'F',  angle:240},
    {key:'C',  angle:270},{key:'G',  angle:300}, {key:'D',  angle:330},
  ];

  const CHORD_MAJOR={
    'C':'C | F | G7','G':'G | C | D7','D':'D | G | A7','A':'A | D | E7',
    'E':'E | A | B7','B':'B | E | F♯7','F♯':'F♯ | B | C♯7','D♭':'D♭ | G♭ | A♭7',
    'A♭':'A♭ | D♭ | E♭7','E♭':'E♭ | A♭ | B♭7','B♭':'B♭ | E♭ | F7','F':'F | B♭ | C7'
  };
  const CHORD_MINOR={
    'A':'Am | Dm | Em','E':'Em | Am | Bm','B':'Bm | Em | F♯m','F♯':'F♯m | Bm | C♯m',
    'C♯':'C♯m | F♯m | G♯m','G♯':'G♯m | C♯m | D♯m','D♯':'D♯m | G♯m | A♯m',
    'B♭':'B♭m | E♭m | Fm','F':'Fm | B♭m | Cm','C':'Cm | Fm | Gm',
    'G':'Gm | Cm | Dm','D':'Dm | Gm | Am'
  };

  let selectedKey=null, selectedMode=null;

  function toRad(deg){return deg*Math.PI/180;}

  // Palette majeur : dégradé violet → indigo → bleu → teal → vert → or → orange → rouge → rose — cycle chromatique
  const MAJ_COLORS=[
    {fill:'#6366f1',hover:'#818cf8',text:'#fff'},  // C  — indigo
    {fill:'#8b5cf6',hover:'#a78bfa',text:'#fff'},  // G  — violet
    {fill:'#a855f7',hover:'#c084fc',text:'#fff'},  // D  — purple
    {fill:'#ec4899',hover:'#f472b6',text:'#fff'},  // A  — pink
    {fill:'#ef4444',hover:'#f87171',text:'#fff'},  // E  — red
    {fill:'#f97316',hover:'#fb923c',text:'#fff'},  // B  — orange
    {fill:'#eab308',hover:'#facc15',text:'#fff'},  // F# — yellow
    {fill:'#84cc16',hover:'#a3e635',text:'#fff'},  // Db — lime
    {fill:'#22c55e',hover:'#4ade80',text:'#fff'},  // Ab — green
    {fill:'#14b8a6',hover:'#2dd4bf',text:'#fff'},  // Eb — teal
    {fill:'#06b6d4',hover:'#22d3ee',text:'#fff'},  // Bb — cyan
    {fill:'#3b82f6',hover:'#60a5fa',text:'#fff'},  // F  — blue
  ];
  // Palette mineur : versions plus sombres/désaturées des mêmes teintes
  const MIN_COLORS=[
    {fill:'#312e81',hover:'#3730a3',text:'#e0e7ff'}, // Am
    {fill:'#4c1d95',hover:'#5b21b6',text:'#ede9fe'}, // Em
    {fill:'#6b21a8',hover:'#7e22ce',text:'#f3e8ff'}, // Bm
    {fill:'#831843',hover:'#9d174d',text:'#fce7f3'}, // F#m
    {fill:'#7f1d1d',hover:'#991b1b',text:'#fee2e2'}, // C#m
    {fill:'#7c2d12',hover:'#9a3412',text:'#ffedd5'}, // G#m
    {fill:'#713f12',hover:'#854d0e',text:'#fef9c3'}, // D#m
    {fill:'#365314',hover:'#3f6212',text:'#f7fee7'}, // Bbm
    {fill:'#14532d',hover:'#166534',text:'#dcfce7'}, // Fm
    {fill:'#134e4a',hover:'#115e59',text:'#ccfbf1'}, // Cm
    {fill:'#164e63',hover:'#155e75',text:'#cffafe'}, // Gm
    {fill:'#1e3a8a',hover:'#1e40af',text:'#dbeafe'}, // Dm
  ];

  function getLang(){return(typeof window.currentLang!=='undefined'?window.currentLang:null)||(document.documentElement.lang)||'fr';}

  function drawCircle(){
    const svg=document.getElementById('circleOfFifths');
    if(!svg)return;
    const lang=getLang(); 
    const lMaj=LABELS_MAJ[lang]||LABELS_MAJ.fr;
    const lMin=LABELS_MIN[lang]||LABELS_MIN.fr;
    const cx=200,cy=200;
    const rOut=192, rMid=128, rIn=72;
    const gap=1.2;
    let html='';

    html+=`<defs>
      <filter id="cof-shadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#0002"/>
      </filter>
    </defs>`;
    html+=`<circle cx="${cx}" cy="${cy}" r="${rOut+4}" fill="#fff"/>`;

    function sector(r1,r2,aDeg,palette,idx,key,mode,label,bold){
      const isSel=selectedKey===key&&selectedMode===mode;
      const a1=toRad(aDeg-15+gap-90);
      const a2=toRad(aDeg+15-gap-90);
      const p=(a)=>({x:cx+r2*Math.cos(a),y:cy+r2*Math.sin(a)});
      const q=(a)=>({x:cx+r1*Math.cos(a),y:cy+r1*Math.sin(a)});
      const P1=p(a1),P2=p(a2),Q1=q(a1),Q2=q(a2);
      const col=palette[idx];
      const fill=isSel?col.hover:col.fill;
      const opacity=isSel?1:0.88;
      const sw=isSel?2.5:0;
      const sCol='#fff';
      html+=`<path d="M${Q1.x},${Q1.y} A${r1},${r1} 0 0,1 ${Q2.x},${Q2.y} L${P2.x},${P2.y} A${r2},${r2} 0 0,0 ${P1.x},${P1.y} Z"
        fill="${fill}" opacity="${opacity}" stroke="${sCol}" stroke-width="${sw}"
        style="cursor:pointer;transition:opacity .15s"
        onclick="T3.selectCircle('${key}','${mode}')"
        onmouseenter="this.style.opacity=1" onmouseleave="this.style.opacity='${isSel?1:0.88}'"/>`;
      const rTxt=(r1+r2)/2;
      const tx=cx+rTxt*Math.cos(toRad(aDeg-90));
      const ty=cy+rTxt*Math.sin(toRad(aDeg-90));
      // Sépare accidentel pour rendu en exposant
      const accMatch=label.match(/(♯|♭)/);
      const accTxt=accMatch?accMatch[1]:'';
      const mainTxt=accTxt?label.replace(accTxt,''):label;
      const fs=bold?(isSel?14:13):(isSel?11:10);
      const fw=isSel?'700':'600';
      if(accTxt){
        // Lettre principale
        html+=`<text x="${tx}" y="${ty+1}" text-anchor="middle" dominant-baseline="middle"
          font-size="${fs}" font-weight="${fw}" fill="${col.text}"
          font-family="system-ui,sans-serif" style="pointer-events:none">${mainTxt}</text>`;
        // Accidentel en exposant décalé
        const offX=bold?8:6, offY=bold?-6:-4;
        html+=`<text x="${tx+offX}" y="${ty+offY}" text-anchor="middle" dominant-baseline="middle"
          font-size="${fs-3}" font-weight="${fw}" fill="${col.text}"
          font-family="system-ui,sans-serif" style="pointer-events:none">${accTxt}</text>`;
      } else {
        html+=`<text x="${tx}" y="${ty+1}" text-anchor="middle" dominant-baseline="middle"
          font-size="${fs}" font-weight="${fw}" fill="${col.text}"
          font-family="system-ui,sans-serif" style="pointer-events:none">${label}</text>`;
      }
    }

    COF_MAJOR.forEach((item,i)=>{
      sector(rMid+1,rOut,item.angle,MAJ_COLORS,i,item.key,'major',lMaj[i],true);
    });
    COF_MINOR.forEach((item,i)=>{
      sector(rIn+1,rMid,item.angle,MIN_COLORS,i,item.key,'minor',lMin[i],false);
    });

    html+=`<circle cx="${cx}" cy="${cy}" r="${rMid}" fill="none" stroke="#ffffff" stroke-width="2.5"/>`;
    html+=`<circle cx="${cx}" cy="${cy}" r="${rOut}" fill="none" stroke="#ffffff" stroke-width="2"/>`;
    html+=`<circle cx="${cx}" cy="${cy}" r="${rIn+1}" fill="none" stroke="#ffffff" stroke-width="2"/>`;

    html+=`<circle cx="${cx}" cy="${cy}" r="${rIn}" fill="#fff" filter="url(#cof-shadow)"/>`;
    const centreLabel=lang==='en'?'Circle of':'Cercle';
    const centreLabel2=lang==='en'?'Fifths':lang==='es'?'de Quintas':'des Quintes';
    html+=`<text x="${cx}" y="${cy-9}" text-anchor="middle" dominant-baseline="middle" font-size="12" font-weight="700" fill="#1e1e2e" font-family="system-ui,sans-serif" letter-spacing="-0.4">${centreLabel}</text>`;
    html+=`<text x="${cx}" y="${cy+8}" text-anchor="middle" dominant-baseline="middle" font-size="10" font-weight="500" fill="#6b7280" font-family="system-ui,sans-serif">${centreLabel2}</text>`;

    svg.innerHTML=html;
  }

  window._cofDraw=drawCircle;
  window._cofSelect=function(key,mode){
    selectedKey=key; selectedMode=mode;
    const lang=getLang();
    const nameEl=document.getElementById('tonalityName');
    const chordsEl=document.getElementById('tonalityChords');
    if(nameEl){
      const idx=mode==='major'?COF_MAJOR.findIndex(x=>x.key===key):COF_MINOR.findIndex(x=>x.key===key);
      const lbl=mode==='major'?(LABELS_MAJ[lang]||LABELS_MAJ.fr)[idx]:(LABELS_MIN[lang]||LABELS_MIN.fr)[idx];
      nameEl.textContent=lbl||key;
    }
    if(chordsEl){
      chordsEl.textContent=(mode==='major'?(CHORD_MAJOR[key]||'—'):(CHORD_MINOR[key]||'—'));
    }
    drawCircle();
    // Sync avec le sélecteur principal
    const kp=window._COF_KP||(window._COF_KP=[{maj:'C',min:'A'},{maj:'G',min:'E'},{maj:'D',min:'B'},{maj:'A',min:'F♯'},{maj:'E',min:'C♯'},{maj:'B',min:'G♯'},{maj:'F♯',min:'D♯'},{maj:'G♭',min:'E♭'},{maj:'D♭',min:'B♭'},{maj:'A♭',min:'F'},{maj:'E♭',min:'C'},{maj:'B♭',min:'G'},{maj:'F',min:'D'}]);
    const idx=kp.findIndex(p=>p.maj===key||p.min===key);
    if(idx>=0)try{T3.pickKey(idx);T3.setMode(mode);}catch(e){}
  };
})();

return{
  langUpdate(){render();const c=document.getElementById('circleContainer');if(c&&c.style.display!=='none')try{window._cofDraw();}catch(e){}},
  setMode(m){st3.mode=m;st3.sel=null;render();},
  doSelect:doSelect,
  toggleDD(){document.getElementById('t3kdd').classList.toggle('open');},
  pickKey(i){st3.pairIdx=i;document.getElementById('t3kdd').classList.remove('open');render();},
  play(){if(st3.lastChord)playChordAudio(st3.lastChord);},
  setPM(m){playMode=m;document.querySelectorAll('.t3-pm-btn').forEach(b=>{const txt=b.textContent;b.classList.toggle('on',(m==='chord'&&(txt==='Accord'||txt==='Chord'))||(m==='arp'&&(txt==='Arpège'||txt==='Arpeggio')));});},
  toggleCircle(){
    const c=document.getElementById('circleContainer');
    if(!c)return;
    const shown=c.style.display!=='none';
    c.style.display=shown?'none':'block';
    if(!shown)try{window._cofDraw();}catch(e){}
  },
  selectCircle(key,mode){try{window._cofSelect(key,mode);}catch(e){}},
  init(){render();}
};
})();

/* ── Init auto ── */
try{T3.init()}catch(e){console.error('T3:',e)}
