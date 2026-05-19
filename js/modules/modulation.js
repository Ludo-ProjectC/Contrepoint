/* ═══ modulation.js — Module Modulation ═══ */
/* ═══ TAB 8: MODULATION ═══ */

const MOD_SH=['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'],MOD_FL=['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'],MOD_LT=['C','D','E','F','G','A','B'];
const MOD_KM={C:0,G:1,D:2,A:3,E:4,B:5,'F♯':6,'G♭':-6,'D♭':-5,'A♭':-4,'E♭':-3,'B♭':-2,F:-1,'C♯':7};
const MOD_Km={A:0,E:1,B:2,'F♯':3,'C♯':4,'G♯':5,'D♯':6,'E♭':-6,'B♭':-5,F:-4,C:-3,G:-2,D:-1,'A♯':7};
const MOD_EM={'F♯':'G♭','G♭':'F♯','D♭':'C♯','C♯':'D♭'},MOD_Em={'D♯':'E♭','E♭':'D♯','G♯':'A♭','A♭':'G♯','A♯':'B♭','B♭':'A♯'};
const MOD_KP=[{m:'C',n:'A'},{m:'G',n:'E'},{m:'D',n:'B'},{m:'A',n:'F♯'},{m:'E',n:'C♯'},{m:'B',n:'G♯'},{m:'F♯',n:'D♯'},{m:'G♭',n:'E♭'},{m:'D♭',n:'B♭'},{m:'A♭',n:'F'},{m:'E♭',n:'C'},{m:'B♭',n:'G'},{m:'F',n:'D'}];
const MOD_MK=MOD_KP.map(p=>p.m),MS=[0,2,4,5,7,9,11],MN=[0,2,3,5,7,8,10],MH=[0,2,3,5,7,8,11];
const MOD_QS={M:'',m:'m',dim:'°',aug:'+',dom7:'7',m7:'m7',maj7:'M7',dim7:'°7',hdim7:'ø7'};
const MOD_RN=['I','II','III','IV','V','VI','VII'];
const MOD_INV_LABELS=['Fond.','1er renv.','2e renv.','3e renv.'];

function MOD_ni(n){const m=n.replace(/♯/g,'#').replace(/♭/g,'b');const t={C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,Fb:4,'E#':5,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11,Cb:11,'B#':0};return t[m]??-1;}
function MOD_uf(k){if(k.includes('♭'))return true;const a=MOD_KM[k],b=MOD_Km[k];return(a!==undefined&&a<0)||(b!==undefined&&b<0);}
function MOD_nn(pc,k){return(MOD_uf(k)?MOD_FL:MOD_SH)[((pc%12)+12)%12];}
function MOD_li(n){return MOD_LT.indexOf(n.replace(/♯|♭/g,'').charAt(0));}
function eL(k,mode){const e=mode==='major'?MOD_EM[k]:MOD_Em[k];return e?`${k}/${e}`:k;}
function oL(mk){const p=MOD_KP.find(x=>x.m===mk);return`${mk}${MOD_EM[mk]?'/'+MOD_EM[mk]:''} / ${p.n}${MOD_Em[p.n]?'/'+MOD_Em[p.n]:''}m`;}
function ivN(st,fK,tK){const fi=MOD_li(fK),ti=MOD_li(tK);let d=((ti-fi)+7)%7;st=((st%12)+12)%12;if(d===0&&st===0)return tx('unisson','unison','unísono');const num=d+1;const NM=currentLang==='en'?{1:'unison',2:'second',3:'third',4:'fourth',5:'fifth',6:'sixth',7:'seventh'}:currentLang==='es'?{1:'unísono',2:'segunda',3:'tercera',4:'cuarta',5:'quinta',6:'sexta',7:'séptima'}:{1:'unisson',2:'seconde',3:'tierce',4:'quarte',5:'quinte',6:'sixte',7:'septième'};const pf={1:0,4:5,5:7};const mj={2:2,3:4,6:9,7:11};let q;if(pf[num]!==undefined){const x=st-pf[num];q=x===0?(tx('juste','perfect','justa')):x===1?(tx('augmentée','augmented','aumentada')):(x===-1||x===11)?(tx('diminuée','diminished','disminuida')):(tx('doublement aug.','doubly aug.','doblemente aum.'));}else{const exp=mj[num];if(exp===undefined)return st+(tx(' dt',' st',' st'));const x=st-exp;q=x===0?(tx('majeure','major','mayor')):(x===-1||x===11)?(tx('mineure','minor','menor')):x===1?(tx('augmentée','augmented','aumentada')):(x===-2||x===10)?(tx('diminuée','diminished','disminuida')):(tx('doub. aug.','doubly aug.','doblemente aum.'));}return`${NM[num]||num+(tx('e','th','ª'))} ${q}`;}
function gTQ(iv,d){const r=iv[d],t=iv[(d+2)%7],f=iv[(d+4)%7];const i3=((t-r)+12)%12,i5=((f-r)+12)%12;if(i3===4&&i5===7)return'M';if(i3===3&&i5===7)return'm';if(i3===3&&i5===6)return'dim';if(i3===4&&i5===8)return'aug';return'M';}
function g7Q(iv,d){const r=iv[d],t=iv[(d+2)%7],f=iv[(d+4)%7],s=iv[(d+6)%7];const i3=((t-r)+12)%12,i5=((f-r)+12)%12,i7=((s-r)+12)%12;if(i3===4&&i5===7&&i7===11)return'maj7';if(i3===4&&i5===7&&i7===10)return'dom7';if(i3===3&&i5===7&&i7===10)return'm7';if(i3===3&&i5===6&&i7===10)return'hdim7';if(i3===3&&i5===6&&i7===9)return'dim7';return'dom7';}
function rnS(d,q){const r=MOD_RN[d];const im=['m','dim','m7','hdim7','dim7'].includes(q);let b=im?r.toLowerCase():r;if(q==='dim')b+='°';if(q==='aug')b+='+';if(q==='dom7')b+='⁷';if(q==='m7')b+='⁷';if(q==='maj7')b+='ᴹ⁷';if(q==='hdim7')b+='ø⁷';if(q==='dim7')b+='°⁷';return b;}
function bN(rpc,q){const p={M:[0,4,7],m:[0,3,7],dim:[0,3,6],aug:[0,4,8],dom7:[0,4,7,10],m7:[0,3,7,10],maj7:[0,4,7,11],dim7:[0,3,6,9],hdim7:[0,3,6,10]};return(p[q]||p.M).map(i=>(rpc+i)%12);}
function gDC(k,mode){const root=MOD_ni(k);const sc=mode==='major'?[MS]:[MN,MH];const ch=[],seen=new Set();sc.forEach(s=>{for(let d=0;d<7;d++){const tq=gTQ(s,d),tr=(root+s[d])%12,tk=`t_${tr}_${tq}`;if(!seen.has(tk)){seen.add(tk);ch.push({rpc:tr,q:tq,rn:rnS(d,tq),d:d,n:bN(tr,tq),tp:'triad',nm:MOD_nn(tr,k)+MOD_QS[tq]});}const sq=g7Q(s,d),sr=(root+s[d])%12,sk=`s_${sr}_${sq}`;if(!seen.has(sk)){seen.add(sk);ch.push({rpc:sr,q:sq,rn:rnS(d,sq),d:d,n:bN(sr,sq),tp:'seventh',nm:MOD_nn(sr,k)+MOD_QS[sq]});}}});return ch;}
function gMC(k,mode){const root=MOD_ni(k),ch=[];const par=mode==='major'?MN:MS;const dia=gDC(k,mode);const dK=new Set(dia.map(c=>`${c.rpc}_${c.q}`));const home=mode==='major'?MS:MN;const seen=new Set();for(let d=0;d<7;d++){const tq=gTQ(par,d),tr=(root+par[d])%12,ck=`${tr}_${tq}`;if(dK.has(ck)||seen.has(ck))continue;seen.add(ck);let rn=rnS(d,tq);const mr=(root+home[d])%12;if(tr!==mr){const df=((tr-mr)+12)%12;if(df===11)rn='♭'+rn;if(df===1)rn='♯'+rn;}ch.push({rpc:tr,q:tq,rn,d,n:bN(tr,tq),tp:'mixture',nm:MOD_nn(tr,k)+MOD_QS[tq]});}return ch;}
function aC(k,m){return[...gDC(k,m),...gMC(k,m)];}
function fP(fK,fM,tK,tM){const fc=aC(fK,fM),tc=aC(tK,tM),pv=[];fc.forEach(f=>{tc.forEach(t=>{const fs=[...f.n].sort((a,b)=>a-b).join(','),ts=[...t.n].sort((a,b)=>a-b).join(',');if(fs===ts){let pt='triad';if(f.tp==='seventh'||t.tp==='seventh')pt='seventh';if(f.tp==='mixture'||t.tp==='mixture')pt='mixture';pv.push({nm:f.nm,n:f.n,fRN:f.rn,tRN:t.rn,tp:pt,q:f.q,rpc:f.rpc});}});});const u=[],sp=new Set();pv.forEach(p=>{const k=`${p.fRN}|${p.tRN}|${[...p.n].sort().join(',')}`;if(!sp.has(k)){sp.add(k);u.push(p);}});u.sort((a,b)=>({triad:0,seventh:1,mixture:2}[a.tp]||0)-({triad:0,seventh:1,mixture:2}[b.tp]||0));return u;}
function ksN(k,m){return m==='major'?(MOD_KM[k]||0):(MOD_Km[k]||0);}
function ksT(k,m){const n=ksN(k,m);if(n===0)return'0';if(n>0)return n+'♯';return(-n)+'♭';}
function gIvl(fK,fM,tK,tM){const r1=MOD_ni(fK),r2=MOD_ni(tK),st=((r2-r1)+12)%12;if(st===0&&fM===tM)return tx('unisson','unison','unísono');if(st===0)return fM==='major'?(tx('parallèle mineur','parallel minor','homónimo menor')):(tx('parallèle majeur','parallel major','homónimo mayor'));return ivN(st,fK,tK);}

/* ═══ Inversion logic ═══ */
function MOD_invertChord(notes, inv) {
  // notes = array of PC [root, 3rd, 5th, (7th)]
  // inv = 0 (root), 1, 2, 3
  if (inv === 0 || inv >= notes.length) return notes;
  return [...notes.slice(inv), ...notes.slice(0, inv)];
}
function MOD_maxInv(qual) {
  const is7 = ['dom7','m7','maj7','dim7','hdim7'].includes(qual);
  return is7 ? 3 : 2;
}

/* ═══ MIDI voicing from PC array (SATB) ═══ */
function MOD_voiceSATB(pcs) {
  // Bass: place root PC in bass register (MIDI ~36-52)
  const bassPC = ((pcs[0] % 12) + 12) % 12;
  let b = 36 + bassPC;
  if (b > 52) b -= 12;
  let midis = [b];
  // Inner voices: find correct PC above previous note
  for (let i = 1; i < pcs.length; i++) {
    const pc = ((pcs[i] % 12) + 12) % 12;
    let prev = midis[midis.length - 1];
    const diff = ((pc - (prev + 1) % 12) % 12 + 12) % 12;
    let m = prev + 1 + diff;
    if (m > 84) m -= 12;
    midis.push(m);
  }
  // Pad to 4 voices with root doublings if chord has fewer than 4 notes
  while (midis.length < 4) {
    const pc = ((pcs[0] % 12) + 12) % 12;
    let prev = midis[midis.length - 1];
    const diff = ((pc - (prev + 1) % 12) % 12 + 12) % 12;
    let m = prev + 1 + diff;
    if (m > 84) m -= 12;
    midis.push(m);
  }
  midis.sort((a, c) => a - c);
  if (midis[3] - midis[0] < 10 && midis[3] < 79) midis[3] += 12;
  return { B: midis[0], T: midis[1], A: midis[2], S: midis[3] };
}

/* ═══ Canvas Staff ═══ */
const MOD_DIA=[0,0,1,1,2,3,3,4,4,5,5,6];
const MOD_LM=50;
const MOD_LS=11;
const MOD_trebleTop=30;
const MOD_bassTop=MOD_trebleTop+4*MOD_LS+26;
const MOD_canvasH=MOD_bassTop+4*MOD_LS+90;

function MOD_m2y(midi){
  const oct=Math.floor(midi/12)-1,pc=midi%12,dp=oct*7+MOD_DIA[pc];
  if(midi>=60)return MOD_trebleTop+2*MOD_LS-(dp-34)*(MOD_LS/2);
  return MOD_bassTop+2*MOD_LS-(dp-22)*(MOD_LS/2);
}

function MOD_needAcc(midi, useFlat){
  const pc=((midi%12)+12)%12,dia=MOD_DIA[pc],nat=[0,2,4,5,7,9,11][dia];
  const d=((pc-nat)+12)%12;
  if(d===0)return null;
  // Default heuristic when no context given
  if(useFlat===undefined){
    if(d===1)return'♯';if(d===11)return'♭';if(d===2)return'𝄪';if(d===10)return'𝄫';return null;
  }
  // With context: re-spell based on flat/sharp preference
  // useFlat=true → prefer ♭/𝄫, false → prefer ♯/𝄪
  if(useFlat){
    // Spell as flat: use the upper diatonic letter
    const upperDia=(dia+1)%7;const upperNat=[0,2,4,5,7,9,11][upperDia];
    const dFlat=((upperNat-pc)+12)%12;
    if(dFlat===1)return'♭';
    if(dFlat===2)return'𝄫';
    // Fallback to sharp
    if(d===1)return'♯';if(d===11)return'♭';if(d===2)return'𝄪';if(d===10)return'𝄫';
  } else {
    if(d===1)return'♯';if(d===11)return'♭';if(d===2)return'𝄪';if(d===10)return'𝄫';
  }
  return null;
}

// Determine if a chord's key uses flats (for spelling)
function MOD_chordUseFlat(key, mode, qual){
  // Flat keys: Bb, Eb, Ab, Db, Gb, Cb (major) and their minors
  const flatMajors=['F','B♭','Bb','E♭','Eb','A♭','Ab','D♭','Db','G♭','Gb','C♭','Cb'];
  const flatMinors=['d','g','c','f','b♭','bb','e♭','eb','a♭','ab'];
  if(flatMajors.includes(key))return true;
  if(mode==='minor'){
    // Minor keys with flat key sig
    const flatMinorRoots=['D','G','C','F','B♭','Bb','E♭','Eb','A♭','Ab'];
    if(flatMinorRoots.includes(key))return true;
  }
  return false;
}

/* ── SVG Staff Renderer (Bravura glyphs, matching Séquences) ── */
function MOD_renderScoreCanvas(chords,pedalVoice){
  const N=chords.length;
  if(!N){const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('width','1');s.setAttribute('height','1');return{canvas:s,noteStart:0,cW:0,N:0,W:0};}
  const noteStart=MOD_LM+44;
  const cW=Math.max(68,Math.min(100,(740-noteStart)/N));
  const sRight=noteStart+N*cW+16;
  const W=sRight+8;
  const H=MOD_canvasH;
  const LS=MOD_LS;
  const SC='#1e1e2e';
  const VC={S:'#3498db',A:'#2ecc71',T:'#e67e22',B:'#e74c3c'};
  const tY=i=>MOD_trebleTop+i*LS;
  const bY=i=>MOD_bassTop+i*LS;
  const tBot=tY(4),bBot=bY(4);

  let svg=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:${W}px;height:${H}px;display:block;cursor:default">`;

  /* ── Bravura Brace ── */
  const braceH=bBot-tY(0),brSy=braceH/997,brSx=brSy*0.85,bX=16;
  svg+=`<g transform="translate(${bX-82*brSx},${bBot}) scale(${brSx},${-brSy})">`;
  svg+=`<path d="M20 498Q43 514 62 557Q81 600 82 646Q82 650 82 654Q82 658 81 662Q74 709 60 768Q46 826 44 869Q45 909 56 941Q67 972 72 980Q74 984 76 986Q77 988 77 990Q77 992 75 995Q73 997 71 997Q70 997 68 995Q66 994 63 990Q23 943 11 870Q0 798 2 737Q3 689 12 639Q22 589 22 548Q22 537 21 527Q20 516 18 506Q17 501 15 499Q14 498 11 498Q7 498 5 495Q2 493 2 490Q2 491 5 487Q7 484 11 483Q14 483 15 482Q17 480 18 476Q20 466 21 453Q22 440 22 431Q22 391 12 342Q3 293 2 244Q0 183 11 111Q23 39 63 -9Q66 -13 68 -14Q70 -16 71 -16Q73 -16 75 -14Q77 -11 77 -9Q77 -7 76 -5Q74 -3 72 1Q67 9 56 40Q45 72 44 112Q46 155 60 213Q74 272 81 319Q82 323 82 327Q82 331 82 335Q81 381 62 424Q43 467 20 483Q18 486 18 491Q18 496 20 498Z" fill="${SC}"/></g>`;

  /* ── Staff lines ── */
  const sX1=bX+8;
  for(let i=0;i<5;i++)svg+=`<line x1="${sX1}" y1="${tY(i)}" x2="${sRight}" y2="${tY(i)}" stroke="${SC}" stroke-width="0.7" opacity="0.4"/>`;
  for(let i=0;i<5;i++)svg+=`<line x1="${sX1}" y1="${bY(i)}" x2="${sRight}" y2="${bY(i)}" stroke="${SC}" stroke-width="0.7" opacity="0.4"/>`;
  svg+=`<line x1="${sX1}" y1="${tY(0)}" x2="${sX1}" y2="${bBot}" stroke="${SC}" stroke-width="1" opacity="0.5"/>`;

  /* ── Bravura Treble Clef ── */
  {const s=LS/250,cx=sX1+3,gY=tY(3);
  svg+=`<g transform="translate(${cx},${gY}) scale(${s},${-s})"><path d="M376 415Q375 424 376 427Q378 430 382 434Q465 510 518 605Q570 700 572 815Q572 881 555 942Q538 1002 507 1048Q495 1066 480 1081Q464 1097 455 1098Q444 1097 425 1082Q406 1067 390 1050Q335 987 313 903Q291 819 292 739Q292 695 296 651Q301 607 306 575Q308 567 307 562Q306 558 297 551Q184 463 95 350Q5 237 0 87Q0 -48 90 -148Q180 -247 364 -252Q382 -252 400 -250Q418 -249 433 -246Q441 -244 444 -245Q447 -246 448 -255Q458 -307 466 -363Q474 -419 475 -456Q471 -563 418 -594Q365 -625 316 -622Q276 -621 256 -612Q236 -603 236 -593Q236 -588 243 -584Q251 -581 268 -576Q293 -570 313 -547Q334 -525 335 -482Q335 -440 310 -410Q285 -381 239 -380Q188 -381 160 -414Q132 -447 132 -495Q130 -548 170 -601Q211 -654 322 -658Q378 -661 446 -622Q513 -582 519 -458Q518 -413 509 -353Q499 -293 490 -244Q488 -236 491 -233Q493 -231 503 -227Q580 -196 625 -135Q670 -74 671 11Q670 110 606 180Q542 249 430 252Q411 251 407 254Q402 257 401 270ZM470 943Q495 943 512 923Q529 902 530 861Q527 778 473 710Q419 643 356 591Q351 586 348 588Q344 589 343 599Q340 619 339 643Q337 667 337 691Q340 809 381 876Q422 942 470 943ZM361 262Q364 249 361 245Q359 242 346 238Q279 214 241 162Q202 109 201 44Q202 -24 233 -70Q264 -115 316 -133Q322 -135 330 -137Q337 -139 343 -139Q349 -139 352 -136Q355 -133 355 -128Q355 -123 350 -120Q346 -117 340 -115Q308 -101 288 -72Q269 -43 268 -8Q269 35 295 66Q322 96 368 109Q380 112 383 111Q387 109 388 101L438 -197Q440 -205 437 -207Q435 -209 424 -211Q412 -213 398 -215Q383 -216 368 -216Q235 -214 158 -150Q82 -86 80 20Q78 64 95 123Q113 181 173 252Q218 301 254 334Q291 366 326 394Q333 400 336 399Q339 398 340 390ZM430 103Q428 112 430 115Q432 118 441 117Q503 110 545 66Q587 21 589 -46Q588 -94 563 -130Q538 -167 495 -188Q486 -193 483 -192Q480 -191 479 -182Z" fill="${SC}"/></g>`;}

  /* ── Bravura Bass Clef ── */
  {const sy=(LS/250)*1.35,sx=sy*1.15,cx=sX1+2,fY=bY(1);
  svg+=`<g transform="translate(${cx},${fY}) scale(${sx},${-sy})"><path d="M162 170Q78 165 39 111Q0 56 0 6Q0 2 1 -3Q7 -48 31 -71Q55 -94 84 -94H88Q119 -92 144 -67Q168 -41 169 -10Q167 33 140 47Q112 60 89 59H70Q60 59 57 64Q54 68 54 73Q54 75 55 76Q55 77 55 77Q74 115 98 126Q122 137 137 136Q189 134 208 99Q227 63 231 17Q231 16 232 15Q232 13 232 9Q233 0 234 -9Q234 -19 234 -28Q235 -120 203 -195Q171 -270 98 -327Q75 -345 49 -358Q24 -371 -2 -385Q-9 -390 -12 -395Q-15 -400 -15 -403Q-15 -407 -10 -410Q-5 -414 -2 -414Q57 -411 117 -373Q176 -335 215 -295Q267 -244 307 -170Q348 -97 350 -22V-18Q348 34 331 68Q313 102 288 122Q245 154 207 163Q169 171 166 170ZM418 127Q399 127 387 115Q374 102 374 84Q374 65 387 52Q399 39 418 39Q437 39 449 52Q462 65 462 84Q462 102 449 115Q437 127 418 127ZM418 -41Q400 -41 388 -54Q376 -66 375 -85Q376 -103 388 -116Q400 -128 418 -129Q437 -128 450 -116Q463 -103 463 -85Q463 -66 450 -54Q437 -41 418 -41Z" fill="${SC}"/></g>`;}

  /* ── Final double barline ── */
  svg+=`<line x1="${sRight-5}" y1="${tY(0)}" x2="${sRight-5}" y2="${bBot}" stroke="${SC}" stroke-width="0.8" opacity="0.35"/>`;
  svg+=`<line x1="${sRight}" y1="${tY(0)}" x2="${sRight}" y2="${bBot}" stroke="${SC}" stroke-width="2.2" opacity="0.4"/>`;

  /* ── Pedal line ── */
  if(pedalVoice&&N>1){
    const pM=chords[0][pedalVoice];
    if(pM){const py=MOD_m2y(pM);
    svg+=`<line x1="${noteStart+cW/2-10}" y1="${py}" x2="${noteStart+(N-1)*cW+cW/2+10}" y2="${py}" stroke="${VC[pedalVoice]}" stroke-width="3" stroke-linecap="round" opacity="0.22"/>`;}
  }

  /* ── Barlines ── */
  for(let ci=1;ci<N;ci++){
    const bx=noteStart+ci*cW;
    svg+=`<line x1="${bx}" y1="${tY(0)}" x2="${bx}" y2="${tBot}" stroke="${SC}" stroke-width="0.5" opacity="0.15"/>`;
    svg+=`<line x1="${bx}" y1="${bY(0)}" x2="${bx}" y2="${bBot}" stroke="${SC}" stroke-width="0.5" opacity="0.15"/>`;
  }

  /* ── Notes ── */
  chords.forEach((ch,ci)=>{
    const cx=noteStart+ci*cW+cW/2;
    // Determine flat preference for this chord based on its key context
    const chKey=ch._key||ch.key;
    const chMode=ch._mode||ch.mode;
    const chQual=ch.q;
    const useFlat=chKey?MOD_chordUseFlat(chKey,chMode,chQual):undefined;
    const vData=['S','A','T','B'].map(v=>({v,midi:ch[v],y:ch[v]?MOD_m2y(ch[v]):null})).filter(d=>d.midi);
    vData.sort((a,b)=>a.y-b.y);
    const offsets={};
    for(let j=0;j<vData.length;j++){offsets[vData[j].v]=0;for(let k=0;k<j;k++){if(Math.abs(vData[j].y-vData[k].y)<LS+1){offsets[vData[j].v]=12;break;}}}

    vData.forEach(({v,midi,y})=>{
      const col=VC[v],xOff=offsets[v]||0,nx=cx+xOff;
      /* Ledger lines */
      if(y>tBot+1&&y<bY(0)-1){for(let ly=tBot+LS;ly<=y+1;ly+=LS)svg+=`<line x1="${cx-10}" y1="${ly}" x2="${cx+10+xOff}" y2="${ly}" stroke="#888" stroke-width="0.8"/>`;}
      if(y<tY(0)-1){for(let ly=tY(0)-LS;ly>=y-1;ly-=LS)svg+=`<line x1="${cx-10}" y1="${ly}" x2="${cx+10+xOff}" y2="${ly}" stroke="#888" stroke-width="0.8"/>`;}
      if(y>bBot+1){for(let ly=bBot+LS;ly<=y+1;ly+=LS)svg+=`<line x1="${cx-10}" y1="${ly}" x2="${cx+10+xOff}" y2="${ly}" stroke="#888" stroke-width="0.8"/>`;}
      /* Middle C ledger */
      if(midi===60){const mcy=MOD_m2y(60);svg+=`<line x1="${cx-10}" y1="${mcy}" x2="${cx+10+xOff}" y2="${mcy}" stroke="#888" stroke-width="0.8"/>`;}
      /* Accidental */
      const acc=MOD_needAcc(midi,useFlat);
      if(acc)svg+=`<text x="${nx-13}" y="${y+5}" font-size="13" fill="${col}" font-family="serif" text-anchor="middle">${acc}</text>`;
      /* Notehead */
      svg+=`<ellipse cx="${nx}" cy="${y}" rx="6.5" ry="4.5" fill="${col}" transform="rotate(-12 ${nx} ${y})"/>`;
      /* Pedal halo */
      if(pedalVoice===v)svg+=`<ellipse cx="${nx}" cy="${y}" rx="9" ry="6.5" fill="none" stroke="${col}" stroke-width="1.5" opacity="0.3" transform="rotate(-12 ${nx} ${y})"/>`;
    });
  });

  svg+=`</svg>`;

  /* Build DOM element */
  const wrap=document.createElement('div');wrap.innerHTML=svg;
  const svgEl=wrap.firstChild;

  return{canvas:svgEl,noteStart,cW,N,W};
}
/* ═══ Techniques ═══ */
function MOD_dT(fK,fM,tK,tM,pivots){
  const techs=[],fR=MOD_ni(fK),tR=MOD_ni(tK),st=((tR-fR)+12)%12;
  const fAll=aC(fK,fM),tAll=aC(tK,tM);
  const fOpts=fAll.map(c=>({rn:c.rn,nm:c.nm,q:c.q,n:c.n,rpc:c.rpc}));
  const tOpts=tAll.map(c=>({rn:c.rn,nm:c.nm,q:c.q,n:c.n,rpc:c.rpc}));
  const diaPiv=pivots.filter(p=>p.tp==='triad'||p.tp==='seventh');
  const pivOpts=pivots.map(p=>({rn:`${p.fRN}=${p.tRN}`,nm:p.nm,q:p.q,n:p.n,rpc:p.rpc}));

  const defI=fM==='major'?'I':'i', defIV=fM==='major'?'IV':'iv', defii=tM==='major'?'ii':'ii°', defIt=tM==='major'?'I':'i';
  const defPiv=pivOpts.length>0?pivOpts[0].rn:null;

  function mkSlot(label,options,zone,fixed,defaultRN){return{label,options:options.map(o=>typeof o==='string'?{rn:o,nm:o}:o),zone,fixed:!!fixed,defaultRN:defaultRN||null};}

  if(diaPiv.length>0)techs.push({id:'pivot',nm:tMod('Accord pivot'),badge:'dia',desc:currentLang==='en'?`${diaPiv.length} pivot${diaPiv.length>1?'s':''}. Prepared with ii → V⁷ for a smooth cadence.`:currentLang==='es'?`${diaPiv.length} pivote${diaPiv.length>1?'s':''}. Preparado con ii → V⁷ para una cadencia suave.`:`${diaPiv.length} pivot${diaPiv.length>1?'s':''}. Préparé par ii → V⁷ pour une cadence douce.`,
    slots:[mkSlot('I',fOpts,'f',false,defI),mkSlot(tx('Pré','Pre','Pre'),fOpts,'f',false,defIV),mkSlot('Pivot',pivOpts,'p',false,defPiv),mkSlot('ii',tOpts,'t',false,defii),mkSlot('V⁷',[{rn:'V⁷',nm:'V⁷',q:'dom7'}],'t',true),mkSlot('I',[{rn:tM==='major'?'I':'i',nm:tM==='major'?'I':'i',q:tM==='major'?'M':'m'}],'t',true)]});

  techs.push({id:'secdom',nm:tMod('Dom. secondaire'),badge:'chr',desc:tx('V⁷ de l\'arrivée introduite. Adoucie par ii → V⁷.','V⁷ of target key introduced. Smoothed with ii → V⁷.','V⁷ de la tonalidad de llegada introducida. Suavizada con ii → V⁷.'),
    slots:[mkSlot('I',fOpts,'f',false,defI),mkSlot('IV',fOpts,'f',false,defIV),mkSlot('V⁷/X',[{rn:'V⁷',nm:'V⁷',q:'dom7'}],'p',true),mkSlot('ii',tOpts,'t',false,defii),mkSlot('V⁷',[{rn:'V⁷',nm:'V⁷',q:'dom7'}],'t',true),mkSlot('I',[{rn:tM==='major'?'I':'i',nm:tM==='major'?'I':'i',q:tM==='major'?'M':'m'}],'t',true)]});

  techs.push({id:'nap',nm:tMod('Napolitain (♭II)'),badge:'chr',desc:tx('♭II → ii → V⁷ → I. Approche par demi-ton adoucie. Ex. pivot : IV⁶/VI (en Do m, Ré♭/Fa = IV⁶ de La♭).','♭II → ii → V⁷ → I. Chromatic approach smoothed. Pivot example: IV⁶/VI (in Cm, D♭/F = IV⁶ of A♭).','♭II → ii → V⁷ → I. Aproximación cromática suavizada. Ej. pivote: IV⁶/VI (en Do m, Re♭/Fa = IV⁶ de La♭).'),
    slots:[mkSlot('I',fOpts,'f',false,defI),mkSlot('IV',fOpts,'f',false,defIV),mkSlot('♭II',[{rn:'♭II',nm:'♭II',q:'M'}],'p',true),mkSlot('ii',tOpts,'t',false,defii),mkSlot('V⁷',[{rn:'V⁷',nm:'V⁷',q:'dom7'}],'t',true),mkSlot('I',[{rn:tM==='major'?'I':'i',nm:tM==='major'?'I':'i',q:tM==='major'?'M':'m'}],'t',true)]});

  techs.push({id:'chrom',nm:tMod('Chromatique'),badge:'chr',desc:tx('Altération chromatique d\'une voix. Ex : Do m → Do M : Mi♭ → Mi m → V/Mi m → Mi m tonicisé → Mi m (pivot = iii de Do) → PD → Sol⁷ → Do.','Chromatic alteration of a voice. Ex: Cm → C: E♭ → Em → V/Em → Em tonicized → Em (pivot = iii of C) → PD → G⁷ → C.','Alteración cromática de una voz. Ej: Do m → Do M: Mi♭ → Mi m → V/Mi m → Mi m tonificado → Mi m (pivote = iii de Do) → PD → Sol⁷ → Do.'),
    slots:[mkSlot(tx('Départ','Start','Origen'),fOpts,'f',false,defI),mkSlot(tx('Pré','Pre','Pre'),fOpts,'f',false,defIV),mkSlot('Chrom.',tOpts,'t',false,defii),mkSlot('V⁷',[{rn:'V⁷',nm:'V⁷',q:'dom7'}],'t',true),mkSlot('I',[{rn:tM==='major'?'I':'i',nm:tM==='major'?'I':'i',q:tM==='major'?'M':'m'}],'t',true)]});

  techs.push({id:'ger6',nm:tMod('Ger⁺⁶ enharmonique'),badge:'enh',desc:tx('Ger⁺⁶ ≡ V⁷ → I⁶₄ → V⁷ → I. La Ger⁺⁶ réinterprétée comme V⁷ d\'une tonalité éloignée.','Ger⁺⁶ ≡ V⁷ → I⁶₄ → V⁷ → I. Ger⁺⁶ reinterpreted as V⁷ of a distant key.','Ger⁺⁶ ≡ V⁷ → I⁶₄ → V⁷ → I. La Ger⁺⁶ se reinterpreta como V⁷ de una tonalidad lejana.'),
    slots:[mkSlot('I',fOpts,'f',false,defI),mkSlot('IV',fOpts,'f',false,defIV),mkSlot('Ger⁺⁶',[{rn:'Ger⁺⁶',nm:'Ger⁺⁶',q:'dom7'}],'p',true),mkSlot('I⁶₄',[{rn:'I⁶₄',nm:'I⁶₄',q:tM==='major'?'M':'m'}],'t',true),mkSlot('V⁷',[{rn:'V⁷',nm:'V⁷',q:'dom7'}],'t',true),mkSlot('I',[{rn:tM==='major'?'I':'i',nm:tM==='major'?'I':'i',q:tM==='major'?'M':'m'}],'t',true)]});

  techs.push({id:'dim7',nm:tMod('7ᵉ dim. enharmonique'),badge:'enh',desc:'vii°⁷ respelled',
    slots:[mkSlot(tx('Départ','Start','Origen'),fOpts,'f',false,defI),mkSlot(tx('Pré','Pre','Pre'),fOpts,'f',false,defIV),mkSlot('vii°⁷',[{rn:'vii°⁷',nm:'vii°⁷',q:'dim7'}],'p',true),mkSlot('V⁷',[{rn:'V⁷',nm:'V⁷',q:'dom7'}],'t',true),mkSlot('I',[{rn:tM==='major'?'I':'i',nm:tM==='major'?'I':'i',q:tM==='major'?'M':'m'}],'t',true)]});

  const vOfF=(fR+7)%12;
  techs.push({id:'pedal',nm:`${tx('Pédale','Pedal','Pedal')} (${MOD_nn(vOfF,fK)})`,badge:'dia',desc:`${tx('Pédale sur','Pedal on','Pedal en')} ${MOD_nn(vOfF,fK)} ${tx('tenue dans une voix','held in a voice','mantenida en una voz')}`,hasPedal:true,
    slots:[mkSlot('I',fOpts,'f',false,defI),mkSlot('IV',fOpts,'f',false,defIV),mkSlot('V⁷',[{rn:'V⁷',nm:'V⁷',q:'dom7'}],'p',true),mkSlot(tx('I arrivée','I arrival','I llegada'),[{rn:tM==='major'?'I':'i',nm:tM==='major'?'I':'i',q:tM==='major'?'M':'m'}],'t',true),mkSlot(tx('Confirm.','Confirm','Confirmar'),tOpts,'t',false,defii)]});

  techs.push({id:'direct',nm:tMod('Directe'),badge:'dir',desc:tx('Changement abrupt après cadence. Nouvelle tonalité sans préparation.','Abrupt change after cadence. New key stated without preparation.','Cambio abrupto tras la cadencia. La nueva tonalidad se establece sin preparación.'),
    slots:[mkSlot(tx('Départ','Start','Origen'),fOpts,'f',false,defI),mkSlot('IV',fOpts,'f',false,defIV),mkSlot('V⁷',[{rn:'V⁷',nm:'V⁷',q:'dom7'}],'f',true),mkSlot('CAP',[{rn:fM==='major'?'I':'i',nm:fM==='major'?'I':'i',q:fM==='major'?'M':'m'}],'f',true),mkSlot(tx('I arrivée','I arrival','I llegada'),[{rn:tM==='major'?'I':'i',nm:tM==='major'?'I':'i',q:tM==='major'?'M':'m'}],'t',true),mkSlot(tx('Confirm.','Confirm','Confirmar'),tOpts,'t',false,defii)]});

  // ═══ NEW: Chain of dominants ═══
  // I → IV → V⁷/V → V⁷(target) → ii(target) → V⁷(target) → I(target)
  techs.push({id:'domchain',nm:tMod('Chaîne de dominantes'),badge:'chr',
    desc:tx('Suite de V⁷ descendant par quintes. Adoucie par IV et ii de préparation.','Chain of V⁷ descending by fifths. Smoothed with IV and ii preparation.','Cadena de V⁷ descendiendo por quintas. Suavizada con preparación de IV y ii.'),
    slots:[
      mkSlot('I',fOpts,'f',false,defI),
      mkSlot('IV',fOpts,'f',false,defIV),
      mkSlot('V⁷/V',[{rn:'V⁷/V',nm:'V⁷/V',q:'dom7'}],'p',true),
      mkSlot('V⁷',[{rn:'V⁷',nm:'V⁷',q:'dom7'}],'t',true),
      mkSlot('ii',tOpts,'t',false,defii),
      mkSlot('V⁷',[{rn:'V⁷',nm:'V⁷',q:'dom7'}],'t',true),
      mkSlot('I',[{rn:tM==='major'?'I':'i',nm:tM==='major'?'I':'i',q:tM==='major'?'M':'m'}],'t',true)
    ]});

  // ═══ NEW: Double modulation (via intermediate key) ═══
  // Compute intermediate key: halfway on circle of fifths
  const midKey = MOD_nn((fR+((st<=6?st:12-st)/2*7+fR)%12)%12, fK);
  // Simplified: use the dominant as intermediate for close keys, or relative for far keys
  const midPC = st<=6 ? (fR+Math.round(st/2))%12 : (fR+Math.round((12-st)/2)*5)%12;
  const midName = MOD_nn(midPC, fK);
  const midOpts = aC(midName,'major').map(c=>({rn:c.rn,nm:c.nm,q:c.q,n:c.n,rpc:c.rpc}));
  techs.push({id:'double',nm:`${tx('Double mod.','Double Mod.','Mod. doble')} (${tx('via','via','vía')} ${midName})`,badge:'chr',
    desc:currentLang==='en'?`2-step modulation via intermediate key (${midName} major) to smooth the distance. Each step uses ii → V⁷ → I.`:currentLang==='es'?`Modulación en 2 pasos vía una tonalidad intermedia (${midName} mayor) para suavizar la distancia. Cada paso usa ii → V⁷ → I.`:`Modulation en 2 étapes via un ton intermédiaire (${midName} majeur) pour adoucir la distance. Chaque étape utilise ii → V⁷ → I.`,
    slots:[
      mkSlot(tx('I départ','I start','I origen'),fOpts,'f',false,defI),
      mkSlot('ii',fOpts,'f'),
      mkSlot('V⁷→mid',[{rn:'V⁷',nm:'V⁷',q:'dom7'}],'p',true),
      mkSlot('I mid',[{rn:'I',nm:midName,q:'M',rpc:midPC}],'p',true),
      mkSlot('ii mid',midOpts,'p',false,'ii'),
      mkSlot('V⁷',[{rn:'V⁷',nm:'V⁷',q:'dom7'}],'t',true),
      mkSlot(tx('I arrivée','I arrival','I llegada'),[{rn:tM==='major'?'I':'i',nm:tM==='major'?'I':'i',q:tM==='major'?'M':'m'}],'t',true)
    ]});

  // ═══ NEW: Deceptive cadence modulation ═══
  // I → IV → V⁷ → ♭VI (surprise!) → ii(new) → V⁷(new) → I(new)
  const decVI_pc = (fR+8)%12; // ♭VI = 8 semitones above root
  techs.push({id:'deceptive',nm:tx('Cadence évitée modulante','Modulating Deceptive Cad.','Cadencia evitada modulante'),badge:'chr',
    desc:tx('Le V⁷ résout sur ♭VI au lieu de I (cadence rompue). Ce ♭VI est réinterprété dans la nouvelle tonalité.','V⁷ resolves to ♭VI instead of I (deceptive cadence). The ♭VI is reinterpreted in the new key.','El V⁷ resuelve en ♭VI en lugar de I (cadencia rota). El ♭VI se reinterpreta en la nueva tonalidad.'),
    slots:[
      mkSlot('I',fOpts,'f',false,defI),
      mkSlot('IV',fOpts,'f',false,defIV),
      mkSlot('V⁷',[{rn:'V⁷',nm:'V⁷',q:'dom7'}],'f',true),
      mkSlot('♭VI',[{rn:'♭VI',nm:'♭VI',q:'M',rpc:decVI_pc}],'p',true),
      mkSlot('ii',tOpts,'t',false,defii),
      mkSlot('V⁷',[{rn:'V⁷',nm:'V⁷',q:'dom7'}],'t',true),
      mkSlot('I',[{rn:tM==='major'?'I':'i',nm:tM==='major'?'I':'i',q:tM==='major'?'M':'m'}],'t',true)
    ]});

  return techs;
}

/* ═══ State ═══ */
let MOD_S={fK:'C',fM:'major',tK:'G',tM:'major',fl:{triad:true,seventh:true,mixture:true},sel:null,ps:{},prog:null,pm:'chord',pedV:'B'};
let MOD_actx=null;

function popSel(){const f=document.getElementById('mod_fK'),t=document.getElementById('mod_tK');[f,t].forEach(s=>{s.innerHTML=MOD_KP.map(p=>`<option value="${p.m}">${oL(p.m)}</option>`).join('');});f.value=MOD_S.fK;t.value=MOD_S.tK;f.onchange=()=>{MOD_S.fK=f.value;MOD_S.sel=null;MOD_S.prog=null;MOD_R();};t.onchange=()=>{MOD_S.tK=t.value;MOD_S.sel=null;MOD_S.prog=null;MOD_R();};}
function setMode(w,m){if(w==='f')MOD_S.fM=m;else MOD_S.tM=m;const c=document.getElementById('mod_'+w+'M');c.children[0].classList.toggle('on',m==='major');c.children[1].classList.toggle('on',m==='minor');MOD_S.sel=null;MOD_S.prog=null;MOD_R();}
function swapKeys(){[MOD_S.fK,MOD_S.tK]=[MOD_S.tK,MOD_S.fK];[MOD_S.fM,MOD_S.tM]=[MOD_S.tM,MOD_S.fM];document.getElementById('mod_fK').value=MOD_S.fK;document.getElementById('mod_tK').value=MOD_S.tK;['f','t'].forEach(w=>{const m=w==='f'?MOD_S.fM:MOD_S.tM;const c=document.getElementById('mod_'+w+'M');c.children[0].classList.toggle('on',m==='major');c.children[1].classList.toggle('on',m==='minor');});MOD_S.sel=null;MOD_S.prog=null;MOD_R();}
function tgF(b){MOD_S.fl[b.dataset.f]=!MOD_S.fl[b.dataset.f];b.classList.toggle('on');MOD_R();}
function selT(id){MOD_S.sel=MOD_S.sel===id?null:id;MOD_S.prog=null;MOD_S.ps={};MOD_R();if(MOD_S.sel)setTimeout(()=>document.getElementById('mod_sA').scrollIntoView({behavior:'smooth',block:'center'}),50);}
function onSC(tid,idx,val){if(!MOD_S.ps[tid])MOD_S.ps[tid]={};MOD_S.ps[tid][idx]=val;MOD_S.ps[tid]['inv_'+idx]=0;MOD_R();}
function onIC(tid,idx,val){if(!MOD_S.ps[tid])MOD_S.ps[tid]={};MOD_S.ps[tid]['inv_'+idx]=parseInt(val);}

/* ═══ Voice-Leading Engine ═══ */
const MOD_VOICES=['S','A','T','B'];
const MOD_VPAIRS=[['S','A'],['S','T'],['S','B'],['A','T'],['A','B'],['T','B']];
const MOD_VNAMES=currentLang==='en'?{S:'Soprano',A:'Alto',T:'Tenor',B:'Bass'}:currentLang==='es'?{S:'Soprano',A:'Alto',T:'Tenor',B:'Bajo'}:{S:'Soprano',A:'Alto',T:'Ténor',B:'Basse'};
const MOD_NS12=['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];

function MOD_vlInterval(a,b){return((Math.abs(a-b))%12);}
function MOD_vlMotion(a1,a2,b1,b2){
  const d1=a2-a1,d2=b2-b1;
  if(d1===0&&d2===0)return'none';
  if(d1===0||d2===0)return'oblique';
  if((d1>0&&d2>0)||(d1<0&&d2<0))return'direct';
  return'contrary';
}

function MOD_checkVoiceLeading(chords, keyRoot){
  const errors=[];
  if(!chords||chords.length<2)return errors;

  // Per-chord checks
  chords.forEach((ch,ci)=>{
    // Voice crossing
    if(ch.S<ch.A)errors.push({type:'error',chord:ci,msg:`Croisement S-A (accord ${ci+1})`,rule:'Croisement'});
    if(ch.A<ch.T)errors.push({type:'error',chord:ci,msg:`Croisement A-T (accord ${ci+1})`,rule:'Croisement'});
    if(ch.T<ch.B)errors.push({type:'error',chord:ci,msg:`Croisement T-B (accord ${ci+1})`,rule:'Croisement'});
    // Spacing
    if(ch.S-ch.A>12)errors.push({type:'warn',chord:ci,msg:`Espacement S-A > 8ve (accord ${ci+1})`,rule:'Espacement'});
    if(ch.A-ch.T>12)errors.push({type:'warn',chord:ci,msg:`Espacement A-T > 8ve (accord ${ci+1})`,rule:'Espacement'});
    // Leading tone doubled
    if(keyRoot!==undefined){
      const lt=(keyRoot+11)%12;
      const ltC=MOD_VOICES.filter(v=>(ch[v]%12)===lt).length;
      if(ltC>=2)errors.push({type:'error',chord:ci,msg:`Sensible doublée (accord ${ci+1})`,rule:'Doublure sensible'});
    }
  });

  // Between consecutive chords
  for(let i=0;i<chords.length-1;i++){
    const a=chords[i],b=chords[i+1];
    MOD_VPAIRS.forEach(([v1,v2])=>{
      const intA=MOD_vlInterval(a[v1],a[v2]),intB=MOD_vlInterval(b[v1],b[v2]);
      const motion=MOD_vlMotion(a[v1],b[v1],a[v2],b[v2]);
      // Parallel fifths
      if(intA===7&&intB===7&&motion==='direct')
        errors.push({type:'error',chord:i,msg:`${tx('5tes //','Parallel 5ths','5ªˢ paralelas')} ${MOD_VNAMES[v1]}-${MOD_VNAMES[v2]} (${i+1}→${i+2})`,rule:tx('Quintes //','Parallel 5ths','5ªˢ paralelas')});
      // Parallel octaves
      if(intA===0&&intB===0&&motion==='direct'&&a[v1]!==b[v1])
        errors.push({type:'error',chord:i,msg:`${tx('8ves //','Parallel 8ves','8ªˢ paralelas')} ${MOD_VNAMES[v1]}-${MOD_VNAMES[v2]} (${i+1}→${i+2})`,rule:tx('Octaves //','Parallel 8ves','8ªˢ paralelas')});
      // Direct/hidden fifths (outer voices only)
      if(intA!==7&&intB===7&&motion==='direct'&&v1==='S'&&v2==='B')
        errors.push({type:'warn',chord:i,msg:`${tx('5te directe','Direct 5th','5ª directa')} S-B (${i+1}→${i+2})`,rule:tx('Quinte directe','Direct 5th','5ª directa')});
      // Direct/hidden octaves
      if(intA!==0&&intB===0&&motion==='direct')
        errors.push({type:'warn',chord:i,msg:`${tx('8ve directe','Direct 8ve','8ª directa')} ${MOD_VNAMES[v1]}-${MOD_VNAMES[v2]} (${i+1}→${i+2})`,rule:tx('Octave directe','Direct 8ve','8ª directa')});
    });
    // Leading tone resolution
    if(keyRoot!==undefined){
      const lt=(keyRoot+11)%12;
      MOD_VOICES.forEach(v=>{
        if((a[v]%12)===lt&&b[v]<a[v]&&(b[v]%12)!==keyRoot%12)
          errors.push({type:'warn',chord:i,msg:`${tx('Sensible non résolue','Unresolved leading tone','Sensible sin resolver')} (${MOD_VNAMES[v]}, ${i+1}→${i+2})`,rule:tx('Résolution sensible','Leading tone resolution','Resolución de la sensible')});
      });
    }
  }
  return errors;
}

/* ═══ Auto-fix voice leading (brute-force scoring) ═══ */
function MOD_vlScore(satbs, keyRoot){
  // Lower = better. Errors weigh 100, warnings 10, motion cost 1
  const errs=MOD_checkVoiceLeading(satbs,keyRoot);
  let s=0;
  errs.forEach(e=>{s+=e.type==='error'?100:10;});
  // Penalize large voice motion between consecutive chords (smoothness)
  for(let i=0;i<satbs.length-1;i++){
    MOD_VOICES.forEach(v=>{s+=Math.abs(satbs[i+1][v]-satbs[i][v])*0.3;});
  }
  // Penalize bad spacing
  satbs.forEach(c=>{
    if(c.S<c.A||c.A<c.T||c.T<c.B)s+=50;
    if(c.S-c.A>12)s+=8;
    if(c.A-c.T>12)s+=8;
    // Bass too high or soprano too low (rough range checks)
    if(c.B>60)s+=3;
    if(c.S<55)s+=3;
  });
  return s;
}

function MOD_voicingsForChord(notes){
  // Generate all reasonable SATB voicings for the given pitch-classes (notes = array of pc).
  // notes[0] is the root (bass). We allow inner voices to be any chord tone in any octave.
  // Returns array of {S,A,T,B} candidates.
  if(!notes||!notes.length)return[];
  const pcs=[...new Set(notes.map(n=>((n%12)+12)%12))];
  const root=pcs[0];
  const out=[];
  // Bass: root in low register
  for(let bOct=2;bOct<=4;bOct++){
    const B=root+12*bOct;
    if(B<28||B>60)continue;
    // For T,A,S, allow any chord tone, top voice from B+6 to B+36
    const tones=[];
    pcs.forEach(pc=>{
      for(let o=2;o<=6;o++){
        const n=pc+12*o;
        if(n>B&&n<B+40)tones.push(n);
      }
    });
    // Pick T,A,S from tones such that B<T<=A<=S and all chord tones covered (with possible doubling)
    for(let i=0;i<tones.length;i++){
      const T=tones[i];if(T<=B||T-B>24)continue;
      for(let j=0;j<tones.length;j++){
        const A=tones[j];if(A<T||A-T>12)continue;
        for(let k=0;k<tones.length;k++){
          const S=tones[k];if(S<A||S-A>12)continue;
          if(S<55||S>79)continue;
          // Coverage check: all pcs must appear among {B,T,A,S}
          const have=new Set([B%12,T%12,A%12,S%12]);
          if(pcs.every(p=>have.has(p))){
            out.push({S,A,T,B});
            if(out.length>500)return out;
          }
        }
      }
    }
  }
  return out;
}

function MOD_fixVoiceLeading(prog, keyRoot){
  if(!prog||prog.length<2)return;
  // For each chord, generate candidate voicings (keeping its qual/notes pitch-classes + bass = root or current bass pc)
  const candidates=prog.map((ch,ci)=>{
    // Use the original bass pc if available; if forced bass (inversion), keep that pc
    const origBass=ch.satb.B%12;
    const notes=ch.notes||[ch.satb.B%12,ch.satb.T%12,ch.satb.A%12,ch.satb.S%12];
    // Build candidates respecting current bass pc
    const allV=MOD_voicingsForChord(notes);
    const filtered=allV.filter(v=>(v.B%12)===origBass);
    const list=filtered.length?filtered:allV;
    // Keep current voicing as one candidate
    list.unshift({S:ch.satb.S,A:ch.satb.A,T:ch.satb.T,B:ch.satb.B});
    // Limit per-chord candidates to keep search fast
    return list.slice(0,60);
  });

  // Greedy local search: for each chord, try every candidate, keep the one yielding lowest score
  let cur=prog.map(p=>({S:p.satb.S,A:p.satb.A,T:p.satb.T,B:p.satb.B}));
  let bestScore=MOD_vlScore(cur,keyRoot);

  for(let pass=0;pass<3;pass++){
    let improved=false;
    for(let ci=0;ci<prog.length;ci++){
      let bestC=cur[ci],bestS=bestScore;
      candidates[ci].forEach(cand=>{
        const trial=cur.slice();trial[ci]=cand;
        const s=MOD_vlScore(trial,keyRoot);
        if(s<bestS){bestS=s;bestC=cand;}
      });
      if(bestC!==cur[ci]){
        cur[ci]=bestC;bestScore=bestS;improved=true;
      }
    }
    if(!improved)break;
  }

  // Write back
  prog.forEach((p,i)=>{p.satb.S=cur[i].S;p.satb.A=cur[i].A;p.satb.T=cur[i].T;p.satb.B=cur[i].B;});
}

function genProg(tid){
  const fD=MOD_S.fM==='minor'?(MOD_KP.find(p=>p.m===MOD_S.fK)||{}).n||MOD_S.fK:MOD_S.fK;
  const tD=MOD_S.tM==='minor'?(MOD_KP.find(p=>p.m===MOD_S.tK)||{}).n||MOD_S.tK:MOD_S.tK;
  const pivots=fP(fD,MOD_S.fM,tD,MOD_S.tM);
  const techs=MOD_dT(fD,MOD_S.fM,tD,MOD_S.tM,pivots);
  const tech=techs.find(t=>t.id===tid);if(!tech)return;
  const sels=MOD_S.ps[tid]||{};

  const prog=tech.slots.map((slot,i)=>{
    const selRN=sels[i]||slot.options[0].rn;
    const inv=sels['inv_'+i]||0;
    let notes,rpc,qual,rnLabel=selRN;

    // Find the option data
    const opt=slot.options.find(o=>o.rn===selRN)||slot.options[0];

    if(selRN==='V⁷'){const k=slot.zone==='f'?fD:tD;const r=MOD_ni(k);const d=(r+7)%12;notes=bN(d,'dom7');rpc=d;qual='dom7';}
    else if(selRN==='V⁷/V'){const k=slot.zone==='f'?fD:tD;const r=MOD_ni(k);const d=(r+7)%12;const dd=(d+7)%12;notes=bN(dd,'dom7');rpc=dd;qual='dom7';}
    else if(selRN==='♭II'){const r=MOD_ni(tD);const np=(r+1)%12;notes=bN(np,'M');rpc=np;qual='M';}
    else if(selRN==='♭VI'){const r=MOD_ni(fD);const vi=(r+8)%12;notes=bN(vi,'M');rpc=vi;qual='M';}
    else if(selRN==='Ger⁺⁶'){const r=MOD_ni(tD);const g=(r+8)%12;notes=[g,(g+4)%12,(g+7)%12,(g+10)%12];rpc=g;qual='dom7';}
    else if(selRN==='I⁶₄'){const r=MOD_ni(tD);const q=MOD_S.tM==='major'?'M':'m';notes=bN(r,q);rpc=r;qual=q;}
    else if(selRN==='vii°⁷'){const r=MOD_ni(fD);const lt=(r+(MOD_S.fM==='major'?11:MH[6]))%12;notes=bN(lt,'dim7');rpc=lt;qual='dim7';}
    else if(opt.rpc!==undefined&&opt.q){notes=bN(opt.rpc,opt.q);rpc=opt.rpc;qual=opt.q;}
    else if(selRN.includes('=')){
      const piv=pivots.find(p=>`${p.fRN}=${p.tRN}`===selRN);
      if(piv){notes=[...piv.n];rpc=piv.rpc;qual=piv.q;}else{notes=[0,4,7];rpc=0;qual='M';}
    } else {
      const k=slot.zone==='f'?fD:tD;const m=slot.zone==='f'?MOD_S.fM:MOD_S.tM;
      const ch=aC(k,m).find(c=>c.rn===selRN);
      if(ch){notes=[...ch.n];rpc=ch.rpc;qual=ch.q;}else{notes=[0,4,7];rpc=0;qual='M';}
    }

    // Apply inversion
    const invNotes=MOD_invertChord(notes,inv);
    const satb=MOD_voiceSATB(invNotes);
    const key=slot.zone==='f'?fD:tD;

    // Build chord name: always re-derive from rpc + qual + key to get correct spelling
    // (avoids C# in a Db context, etc.)
    const INV_SFX_TRI=['','⁶','⁶₄'];
    const INV_SFX_7TH=['⁷','⁶₅','⁴₃','⁴₂'];
    const is7th=['dom7','m7','maj7','dim7','hdim7'].includes(qual);
    const invSuffix=is7th?(INV_SFX_7TH[Math.min(inv,3)]):(INV_SFX_TRI[Math.min(inv,2)]);
    const rootName=rpc!==undefined?MOD_nn(rpc,key):(opt.nm||rnLabel).replace(/[mM7°+ø⁶⁷₅₄₃₂⁴]+$/,'');
    const qualSym=is7th?'':(MOD_QS[qual]||''); // suffix already encoded in INV_SFX for 7ths
    // For 7th chords, base name has no quality suffix (it's in invSuffix), except dim/hdim
    let nmBase;
    if(is7th){
      const qBase=qual==='dim7'?'°':qual==='hdim7'?'ø':qual==='maj7'?'M':qual==='m7'?'m':'';
      nmBase=rootName+qBase;
    } else {
      nmBase=rootName+(MOD_QS[qual]||'');
    }
    const nm=nmBase+invSuffix;

    return{rn:rnLabel,nm,satb,zone:slot.zone,key,mode:slot.zone==='f'?MOD_S.fM:slot.zone==='t'?MOD_S.tM:(MOD_S.tM),inv,q:qual,notes:invNotes};
  });

  // Apply pedal: force the pedal voice to stay on the same MIDI note throughout
  if(tech.hasPedal && MOD_S.pedV){
    const pedalMidi=prog[0].satb[MOD_S.pedV];
    prog.forEach(ch=>{ch.satb[MOD_S.pedV]=pedalMidi;});
  }

  MOD_S.prog={chords:prog,hasPedal:tech.hasPedal};

  // Anti-repetition rule: never allow two consecutive identical chords in root position (5/3).
  // If detected, force the second occurrence to 1st inversion (6/3) by re-voicing with 3rd in bass.
  for (let i = 1; i < prog.length; i++) {
    const prev = prog[i-1], cur = prog[i];
    // Same pitch class root and same quality, both in root position (inv===0)
    if (prev.inv === 0 && cur.inv === 0 &&
        prev.q === cur.q &&
        (((prev.notes[0] % 12) + 12) % 12) === (((cur.notes[0] % 12) + 12) % 12)) {
      // Force 1st inversion on current: rotate notes so 3rd is in bass
      if (cur.notes.length >= 2) {
        const inv1 = MOD_invertChord(cur.notes, 1);
        cur.notes = inv1;
        cur.inv = 1;
        cur.satb = MOD_voiceSATB(inv1);
        // Recalculate nm with inversion suffix
        const is7th=['dom7','m7','maj7','dim7','hdim7'].includes(cur.q);
        const invSuffix=is7th?'⁶₅':'⁶';
        const nmBase=cur.nm.replace(/[⁶⁷₅₄₃₂⁴]+$/,'');
        cur.nm=nmBase+invSuffix;
      }
    }
  }

  // Voice-leading: auto-fix then analyze
  const fD2=MOD_S.fM==='minor'?(MOD_KP.find(p=>p.m===MOD_S.fK)||{}).n||MOD_S.fK:MOD_S.fK;
  const keyRoot=MOD_ni(fD2);
  MOD_fixVoiceLeading(prog, keyRoot);
  MOD_S.prog.vlErrors=MOD_checkVoiceLeading(prog.map(p=>p.satb), keyRoot);

  renderProg();
}

function renderProg(){
  const el=document.getElementById('mod_sA');
  if(!MOD_S.prog||!MOD_S.prog.chords.length){el.innerHTML='<div class="es">'+(tx('Sélectionner une technique et cliquer « Générer »','Select a technique and click "Generate"','Selecciona una técnica y haz clic en «Generar»'))+'</div>';return;}
  const prog=MOD_S.prog.chords;
  const fD=MOD_S.fM==='minor'?(MOD_KP.find(p=>p.m===MOD_S.fK)||{}).n||MOD_S.fK:MOD_S.fK;
  const tD=MOD_S.tM==='minor'?(MOD_KP.find(p=>p.m===MOD_S.tK)||{}).n||MOD_S.tK:MOD_S.tK;

  // SVG Staff
  const staffData=prog.map(c=>c.satb);
  const scoreInfo=MOD_renderScoreCanvas(staffData, MOD_S.prog.hasPedal?MOD_S.pedV:null);

  // MOD_RN + name labels — absolute positioning centered under each note column
  const N=prog.length;const LMx=scoreInfo.noteStart;const cW=scoreInfo.cW;const scrW=scoreInfo.W;
  let rnHtml='<div class="rn-row">';
  let nmHtml='<div class="name-row">';
  prog.forEach((c,i)=>{
    // Center of note column as % of full SVG width
    const cxPct=((LMx+i*cW+cW/2)/scrW)*100;
    const zc=c.zone==='f'?'zf':c.zone==='t'?'zt':'zp';
    rnHtml+=`<span class="rn-lbl ${zc}" style="left:${cxPct}%">${c.rn}</span>`;
    nmHtml+=`<span class="name-lbl" style="left:${cxPct}%">${c.nm}</span>`;
  });
  rnHtml+='</div>';nmHtml+='</div>';

  let h=`<div class="score-wrap" id="scoreWrap"></div><div style="text-align:center;font-size:10px;color:#b0adc4;margin:3px 0 6px;font-style:italic">↕ Glissez les notes verticalement pour ajuster le voicing</div><div id="rnArea">${rnHtml}${nmHtml}</div>`;
  h+=`<div class="play-row"><button class="play-btn" id="ppB" onclick="playProg()">▶ ${t('btn_listen')}</button><div class="pm"><button class="${MOD_S.pm==='chord'?'on':''}" onclick="MOD_S.pm='chord';renderProg()">${t('btn_chord')}</button><button class="${MOD_S.pm==='arp'?'on':''}" onclick="MOD_S.pm='arp';renderProg()">${t('btn_arp')}</button></div><button class="play-btn" style="background:#1e1e2e;margin-left:auto" onclick="MOD_exportPDF()">⬇ PDF</button><button class="play-btn" style="background:#059669" onclick="MOD_exportMIDI()">🎹 MIDI</button></div>`;

  // Voice-leading analysis panel
  const vle=MOD_S.prog.vlErrors||[];
  const errs=vle.filter(e=>e.type==='error'),warns=vle.filter(e=>e.type==='warn');
  if(errs.length===0&&warns.length===0){
    h+=`<div class="vl-panel vl-ok"><span class="vl-icon">✓</span> Conduite des voix conforme</div>`;
  } else {
    h+=`<div class="vl-panel vl-issues">`;
    h+=`<div class="vl-hdr"><span class="vl-icon">${errs.length?'✕':'⚠'}</span> Conduite des voix : ${errs.length} erreur${errs.length>1?'s':''}, ${warns.length} avertissement${warns.length>1?'s':''}</div>`;
    vle.forEach(e=>{
      h+=`<div class="vl-item ${e.type}"><span class="vl-badge">${e.type==='error'?'✕':'⚠'}</span><span class="vl-rule">${e.rule}</span> ${e.msg}</div>`;
    });
    h+=`</div>`;
  }
  el.innerHTML=h;
  document.getElementById("scoreWrap").appendChild(scoreInfo.canvas);
  MOD_S.prog.si=scoreInfo; // store for drag
  MOD_setupDrag(scoreInfo.canvas);
}

/* ═══ Drag & Drop (from conduite des voix) ═══ */
const MOD_VRANGE={S:[60,84],A:[55,77],T:[48,69],B:[36,60]};
let MOD_dragSt=null;

function MOD_yToMidiDrag(y,voice){
  const[lo,hi]=MOD_VRANGE[voice];
  let best=lo,bd=999;
  for(let m=lo;m<=hi;m++){const my=MOD_m2y(m);const d=Math.abs(y-my);if(d<bd){bd=d;best=m;}}
  return best;
}

function MOD_setupDrag(svgEl){
  function pos(e){
    const r=svgEl.getBoundingClientRect();
    const vb=svgEl.viewBox.baseVal;
    return{x:((e.clientX-r.left)/r.width)*vb.width, y:((e.clientY-r.top)/r.height)*vb.height};
  }
  function findNote(x,y){
    if(!MOD_S.prog||!MOD_S.prog.chords.length)return null;
    const si=MOD_S.prog.si;if(!si)return null;
    const prog=MOD_S.prog.chords;
    for(let ci=0;ci<prog.length;ci++){
      const cx=si.noteStart+ci*si.cW+si.cW/2;
      for(const v of['S','A','T','B']){
        const midi=prog[ci].satb[v];if(!midi)continue;
        const ny=MOD_m2y(midi);
        if(Math.abs(x-cx)<14&&Math.abs(y-ny)<10)return{ci,v,midi};
      }
    }
    return null;
  }

  svgEl.addEventListener('mousedown',e=>{
    const p=pos(e),hit=findNote(p.x,p.y);
    if(hit){MOD_dragSt={ci:hit.ci,v:hit.v};svgEl.style.cursor='ns-resize';e.preventDefault();}
  });
  svgEl.addEventListener('mousemove',e=>{
    if(!MOD_dragSt){const p=pos(e);svgEl.style.cursor=findNote(p.x,p.y)?'pointer':'default';return;}
    const p=pos(e);
    const newMidi=MOD_yToMidiDrag(p.y,MOD_dragSt.v);
    MOD_S.prog.chords[MOD_dragSt.ci].satb[MOD_dragSt.v]=newMidi;
    const staffData=MOD_S.prog.chords.map(c=>c.satb);
    const newInfo=MOD_renderScoreCanvas(staffData,MOD_S.prog.hasPedal?MOD_S.pedV:null);
    const wrap=document.getElementById('scoreWrap');
    if(wrap){wrap.innerHTML='';wrap.appendChild(newInfo.canvas);MOD_S.prog.si=newInfo;MOD_setupDrag(newInfo.canvas);}
  });
  svgEl.addEventListener('mouseup',()=>{
    if(!MOD_dragSt)return;
    svgEl.style.cursor='default';MOD_dragSt=null;
    const fD=MOD_S.fM==='minor'?(MOD_KP.find(p=>p.m===MOD_S.fK)||{}).n||MOD_S.fK:MOD_S.fK;
    MOD_S.prog.vlErrors=MOD_checkVoiceLeading(MOD_S.prog.chords.map(p=>p.satb),MOD_ni(fD));
    renderProg();
  });
  svgEl.addEventListener('mouseleave',()=>{if(MOD_dragSt){MOD_dragSt=null;svgEl.style.cursor='default';}});
  svgEl.addEventListener('touchstart',e=>{
    const t=e.touches[0];const p=pos(t);const hit=findNote(p.x,p.y);
    if(hit){MOD_dragSt={ci:hit.ci,v:hit.v};e.preventDefault();}
  },{passive:false});
  svgEl.addEventListener('touchmove',e=>{
    if(!MOD_dragSt)return;e.preventDefault();
    const t=e.touches[0];const p=pos(t);
    MOD_S.prog.chords[MOD_dragSt.ci].satb[MOD_dragSt.v]=MOD_yToMidiDrag(p.y,MOD_dragSt.v);
    const staffData=MOD_S.prog.chords.map(c=>c.satb);
    const newInfo=MOD_renderScoreCanvas(staffData,MOD_S.prog.hasPedal?MOD_S.pedV:null);
    const wrap=document.getElementById('scoreWrap');
    if(wrap){wrap.innerHTML='';wrap.appendChild(newInfo.canvas);MOD_S.prog.si=newInfo;MOD_setupDrag(newInfo.canvas);}
  },{passive:false});
  svgEl.addEventListener('touchend',()=>{
    if(!MOD_dragSt)return;MOD_dragSt=null;
    const fD=MOD_S.fM==='minor'?(MOD_KP.find(p=>p.m===MOD_S.fK)||{}).n||MOD_S.fK:MOD_S.fK;
    MOD_S.prog.vlErrors=MOD_checkVoiceLeading(MOD_S.prog.chords.map(p=>p.satb),MOD_ni(fD));
    renderProg();
  });
}

/* ═══ Audio ═══ */
function gCtx(){return _getPianoCtx();}
function MOD_m2f(m){return 440*Math.pow(2,(m-69)/12);}
function playProg(){
  if(!MOD_S.prog)return;const chain=_getPianoChain();const ctx=chain.ctx;const now=ctx.currentTime,tempo=0.65;
  const btn=document.getElementById('ppB');btn.classList.add('playing');btn.textContent='▶ …';
  MOD_S.prog.chords.forEach((ch,ci)=>{
    const midis=[ch.satb.B,ch.satb.T,ch.satb.A,ch.satb.S];
    const t=now+ci*tempo;
    if(MOD_S.pm==='chord')midis.forEach((m,j)=>pianoNote(MOD_m2f(m),t+j*0.006,tempo*0.85,ctx,chain.dry,chain.wet,0.22));
    else midis.forEach((m,j)=>pianoNote(MOD_m2f(m),t+j*0.1,tempo*0.55,ctx,chain.dry,chain.wet,0.20));
  });
  setTimeout(()=>{btn.classList.remove('playing');btn.textContent='▶ Écouter';},MOD_S.prog.chords.length*tempo*1000+300);
}
/* MOD_pT removed — using pianoNote via global chain */

/* ═══ Main Render ═══ */
function MOD_R(){
  const fD=MOD_S.fM==='minor'?(MOD_KP.find(p=>p.m===MOD_S.fK)||{}).n||MOD_S.fK:MOD_S.fK;
  const tD=MOD_S.tM==='minor'?(MOD_KP.find(p=>p.m===MOD_S.tK)||{}).n||MOD_S.tK:MOD_S.tK;
  const fF=eL(fD,MOD_S.fM)+(MOD_S.fM==='major'?' maj':' min'),tF=eL(tD,MOD_S.tM)+(MOD_S.tM==='major'?' maj':' min');
  document.getElementById('mod_dR').innerHTML=`<div class="dist-badge">◎ ${gIvl(fD,MOD_S.fM,tD,MOD_S.tM)}</div><div class="ks-badge fb">𝄞 ${fF} — ${ksT(fD,MOD_S.fM)}</div><div class="ks-badge tb">𝄞 ${tF} — ${ksT(tD,MOD_S.tM)}</div>`;

  const fCh=aC(fD,MOD_S.fM),tCh=aC(tD,MOD_S.tM),pvs=fP(fD,MOD_S.fM,tD,MOD_S.tM);
  const pvNK=new Set(pvs.map(p=>[...p.n].sort((a,b)=>a-b).join(',')));

  function rCL(ch,css,kn){const tri=ch.filter(c=>c.tp==='triad'),sev=ch.filter(c=>c.tp==='seventh'),mix=ch.filter(c=>c.tp==='mixture');function g(it,l){if(!it.length)return'';return`<div class="clg">${l==='Triades'?t('m_tri'):l==='Septièmes'?t('m_sev'):l==='Mixture'?t('m_mix'):l}</div>`+it.map(c=>{const nk=[...c.n].sort((a,b)=>a-b).join(',');return`<span class="cli${pvNK.has(nk)?' ip':''}"><span class="rs">${c.rn}</span> <span class="ns">${c.nm}</span></span>`;}).join('');}return`<div class="clc"><div class="clt ${css}">${kn}</div>${g(tri,'Triades')}${g(sev,'Septièmes')}${g(mix,'Mixture')}</div>`;}
  document.getElementById('mod_cL').innerHTML=rCL(fCh,'ft',fF)+rCL(tCh,'tt',tF);

  const fl=pvs.filter(p=>MOD_S.fl[p.tp]);
  document.getElementById('mod_pC').innerHTML=`<strong>${fl.length}</strong> pivot${fl.length>1?'s':''}`;
  if(!fl.length){document.getElementById('mod_pA').innerHTML='<div class="es">'+(tx('Aucun','None','Ninguno'))+'</div>';}
  else{let h=`<table class="pt"><thead><tr><th>${tx('Accord','Chord','Acorde')}</th><th>${fF}</th><th>${tF}</th><th>Type</th></tr></thead><tbody>`;fl.forEach(p=>{h+=`<tr><td><span class="cn">${MOD_nn(p.rpc,fD)}${MOD_QS[p.q]}</span></td><td><span class="rc rf">${p.fRN}</span></td><td><span class="rc rt">${p.tRN}</span></td><td><span class="pty ${p.tp==='triad'?'tri':p.tp==='seventh'?'sev':'mix'}">${p.tp==='triad'?(tx('Triade','Triad','Tríada')):p.tp==='seventh'?(tx('7ème','7th','7ª')):'Mix.'}</span></td></tr>`;});h+='</tbody></table>';document.getElementById('mod_pA').innerHTML=h;}

  // Techniques
  const techs=MOD_dT(fD,MOD_S.fM,tD,MOD_S.tM,pvs);
  document.getElementById('mod_mTA').innerHTML=techs.map(t=>{
    const isSel=MOD_S.sel===t.id;const sels=MOD_S.ps[t.id]||{};
    let slH='';
    if(isSel){
      slH=`<div class="pb"><div class="pbt">${tx('Progression (choisir les degrés + renversements)','Progression (choose degrees + inversions)','Progresión (elige grados + inversiones)')}</div><div class="psl">`;
      t.slots.forEach((s,i)=>{
        const val=sels[i]||(s.defaultRN&&s.options.find(o=>o.rn===s.defaultRN)?s.defaultRN:null)||s.options[0].rn;
        const inv=sels['inv_'+i]||0;
        const lc=s.zone==='f'?'lf':s.zone==='t'?'lt':'lp';
        // Find qual for max inversions
        const opt=s.options.find(o=>o.rn===val)||s.options[0];
        const mxI=MOD_maxInv(opt.q||'M');

        slH+=`<div class="ps"><label class="${lc}">${s.label}</label>`;
        if(s.fixed){slH+=`<div style="padding:4px 6px;font-size:12px;font-weight:700">${s.options[0].rn}</div>`;}
        else{
          slH+=`<select onchange="onSC('${t.id}',${i},this.value)">`;
          // Group by type
          const triads=s.options.filter(o=>!['dom7','m7','maj7','dim7','hdim7'].includes(o.q));
          const sevs=s.options.filter(o=>['dom7','m7','maj7','dim7','hdim7'].includes(o.q));
          if(triads.length)slH+=`<optgroup label="Triades / Mixture">`;
          triads.forEach(o=>{slH+=`<option value="${o.rn}"${o.rn===val?' selected':''}>${o.rn} (${o.nm})</option>`;});
          if(triads.length)slH+=`</optgroup>`;
          if(sevs.length)slH+=`<optgroup label="Septièmes">`;
          sevs.forEach(o=>{slH+=`<option value="${o.rn}"${o.rn===val?' selected':''}>${o.rn} (${o.nm})</option>`;});
          if(sevs.length)slH+=`</optgroup>`;
          slH+=`</select>`;
        }
        // Inversion selector
        slH+=`<select class="inv-sel" onchange="onIC('${t.id}',${i},this.value)">`;
        for(let iv=0;iv<=mxI;iv++){slH+=`<option value="${iv}"${iv===inv?' selected':''}>${MOD_INV_LABELS[iv]}</option>`;}
        slH+=`</select></div>`;
        if(i<t.slots.length-1)slH+='<div class="pa">→</div>';
      });
      slH+=`</div>`;
      // Pedal voice selector
      if(t.hasPedal){
        slH+=`<div class="ped-row"><label>${tx('Voix de pédale :','Pedal voice:','Voz de pedal:')}</label><div class="ped-pills">`;
        ['S','A','T','B'].forEach(v=>{slH+=`<button class="ped-pill${MOD_S.pedV===v?' on':''}" onclick="MOD_S.pedV='${v}';MOD_R()">${v}</button>`;});
        slH+=`</div></div>`;
      }
      slH+=`<button class="pgb" onclick="genProg('${t.id}')">${tx('Générer la progression','Generate progression','Generar progresión')}</button></div>`;
    }
    const bCls=t.badge==='dia'?'dia':t.badge==='chr'?'chr':t.badge==='enh'?'enh':'dir';
    const bLbl=currentLang==='en'?(t.badge==='dia'?'Diatonic':t.badge==='chr'?'Chromatic':t.badge==='enh'?'Enharmonic':'Direct'):currentLang==='es'?(t.badge==='dia'?'Diatónico':t.badge==='chr'?'Cromático':t.badge==='enh'?'Enarmónico':'Directa'):(t.badge==='dia'?'Diatonique':t.badge==='chr'?'Chromatique':t.badge==='enh'?'Enharmonique':'Direct');
    return`<div class="mt${isSel?' sel':''}"><div class="mth" onclick="selT('${t.id}')"><span class="mtn">${t.nm}</span><span class="mtb ${bCls}">${bLbl}</span></div><div class="mtd">${t.desc}</div>${slH}</div>`;
  }).join('');

  renderProg();
}

popSel();MOD_R();

/* ═══════════════════════════════════════════
   #3 — CHAÎNE DE MODULATIONS
   ═══════════════════════════════════════════ */

// State: array of nodes {key, mode} + links [{techId}] between them
// nodes[i] --link[i]--> nodes[i+1]
let MOD_CHAIN={
  nodes:[
    {key:'C',mode:'major'},
    {key:'G',mode:'major'}
  ],
  links:[{techId:'pivot',ps:{}}], // one link per pair
  activeLink:-1 // which link is being edited (-1 = none)
};

function chnSync(){
  // Keep nodes/links in sync with main MOD_S fK/tK
  MOD_CHAIN.nodes[0].key=MOD_S.fK;
  MOD_CHAIN.nodes[0].mode=MOD_S.fM;
  MOD_CHAIN.nodes[MOD_CHAIN.nodes.length-1].key=MOD_S.tK;
  MOD_CHAIN.nodes[MOD_CHAIN.nodes.length-1].mode=MOD_S.tM;
}

function chnGetTechs(li){
  const fN=MOD_CHAIN.nodes[li],tN=MOD_CHAIN.nodes[li+1];
  const fD=fN.mode==='minor'?(MOD_KP.find(p=>p.m===fN.key)||{}).n||fN.key:fN.key;
  const tD=tN.mode==='minor'?(MOD_KP.find(p=>p.m===tN.key)||{}).n||tN.key:tN.key;
  const pvs=fP(fD,fN.mode,tD,tN.mode);
  return MOD_dT(fD,fN.mode,tD,tN.mode,pvs);
}

function chnAddNode(){
  // Insert a new node at the end (before last), copying last key
  const last=MOD_CHAIN.nodes[MOD_CHAIN.nodes.length-1];
  const prev=MOD_CHAIN.nodes[MOD_CHAIN.nodes.length-2];
  // Pick an intermediate key (dominant of destination)
  const newKey=MOD_KP[(MOD_KP.findIndex(p=>p.m===last.key)+1)%MOD_KP.length].m;
  MOD_CHAIN.nodes.splice(MOD_CHAIN.nodes.length-1,0,{key:newKey,mode:'major'});
  MOD_CHAIN.links.push({techId:'pivot',ps:{}});
  renderChain();
}

function chnDelNode(i){
  if(MOD_CHAIN.nodes.length<=2)return;
  // Can't delete first or last node
  if(i===0||i===MOD_CHAIN.nodes.length-1)return;
  MOD_CHAIN.nodes.splice(i,1);
  MOD_CHAIN.links.splice(i-1,1); // remove link before this node
  if(MOD_CHAIN.activeLink>=MOD_CHAIN.links.length)MOD_CHAIN.activeLink=-1;
  renderChain();
}

function chnSetNodeKey(i,key){
  MOD_CHAIN.nodes[i].key=key;
  // Sync first/last with main MOD_S
  if(i===0){MOD_S.fK=key;document.getElementById('mod_fK').value=key;MOD_S.sel=null;MOD_S.prog=null;MOD_R();}
  if(i===MOD_CHAIN.nodes.length-1){MOD_S.tK=key;document.getElementById('mod_tK').value=key;MOD_S.sel=null;MOD_S.prog=null;MOD_R();}
  // Reset tech for affected links
  if(i>0)MOD_CHAIN.links[i-1]={techId:'pivot',ps:{}};
  if(i<MOD_CHAIN.links.length)MOD_CHAIN.links[i]={techId:'pivot',ps:{}};
  renderChain();
}

function chnSetNodeMode(i,mode){
  MOD_CHAIN.nodes[i].mode=mode;
  if(i===0){setMode('f',mode);}
  if(i===MOD_CHAIN.nodes.length-1){setMode('t',mode);}
  if(i>0)MOD_CHAIN.links[i-1]={techId:'pivot',ps:{}};
  if(i<MOD_CHAIN.links.length)MOD_CHAIN.links[i]={techId:'pivot',ps:{}};
  renderChain();
}

function chnSetLinkTech(li,techId){
  MOD_CHAIN.links[li].techId=techId;
  MOD_CHAIN.links[li].ps={};
  MOD_CHAIN.activeLink=li;
  // Load this pair into main MOD_S for slot editing
  const fN=MOD_CHAIN.nodes[li],tN=MOD_CHAIN.nodes[li+1];
  MOD_S.fK=fN.key;MOD_S.fM=fN.mode;MOD_S.tK=tN.key;MOD_S.tM=tN.mode;
  MOD_S.sel=techId;MOD_S.prog=null;MOD_S.ps={};
  document.getElementById('mod_fK').value=fN.key;
  document.getElementById('mod_tK').value=tN.key;
  ['f','t'].forEach(w=>{const m=w==='f'?fN.mode:tN.mode;const c=document.getElementById('mod_'+w+'M');c.children[0].classList.toggle('on',m==='major');c.children[1].classList.toggle('on',m==='minor');});
  MOD_R();
  renderChain();
  setTimeout(()=>document.getElementById('mod_sA').scrollIntoView({behavior:'smooth',block:'center'}),80);
}

function chnGenAll(){
  // Generate progression for each link and concatenate
  const allChords=[];
  let ok=true;
  for(let li=0;li<MOD_CHAIN.links.length;li++){
    const lnk=MOD_CHAIN.links[li];
    const fN=MOD_CHAIN.nodes[li],tN=MOD_CHAIN.nodes[li+1];
    const fD=fN.mode==='minor'?(MOD_KP.find(p=>p.m===fN.key)||{}).n||fN.key:fN.key;
    const tD=tN.mode==='minor'?(MOD_KP.find(p=>p.m===tN.key)||{}).n||tN.key:tN.key;
    const pvs=fP(fD,fN.mode,tD,tN.mode);
    const techs=MOD_dT(fD,fN.mode,tD,tN.mode,pvs);
    const tech=techs.find(t=>t.id===lnk.techId)||techs[0];
    if(!tech){ok=false;continue;}
    // Temporarily set MOD_S for genProg
    const savedS={fK:MOD_S.fK,fM:MOD_S.fM,tK:MOD_S.tK,tM:MOD_S.tM,sel:MOD_S.sel,ps:MOD_S.ps,prog:MOD_S.prog};
    MOD_S.fK=fN.key;MOD_S.fM=fN.mode;MOD_S.tK=tN.key;MOD_S.tM=tN.mode;MOD_S.sel=tech.id;MOD_S.ps=lnk.ps||{};
    genProg(tech.id);
    if(MOD_S.prog&&MOD_S.prog.chords.length){
      // Tag chords with link info for PDF
      MOD_S.prog.chords.forEach(c=>{c._link=li;c._fKey=fN.key;c._tKey=tN.key;});
      allChords.push(...MOD_S.prog.chords);
    }
    // Restore
    MOD_S.fK=savedS.fK;MOD_S.fM=savedS.fM;MOD_S.tK=savedS.tK;MOD_S.tM=savedS.tM;MOD_S.sel=savedS.sel;MOD_S.ps=savedS.ps;
  }
  if(!allChords.length){alert(tx('Impossible de générer la chaîne. Vérifiez les techniques choisies.','Could not generate chain. Check the selected techniques.','No se pudo generar la cadena. Revisa las técnicas elegidas.'));return;}
  // Store as a special chain prog
  MOD_S.prog={chords:allChords,hasPedal:false,vlErrors:[],isChain:true};
  // Auto-fix VL across the whole chain
  MOD_fixVoiceLeading(allChords, MOD_ni(MOD_S.fM==='minor'?(MOD_KP.find(p=>p.m===MOD_S.fK)||{}).n||MOD_S.fK:MOD_S.fK));
  const fD=MOD_S.fM==='minor'?(MOD_KP.find(p=>p.m===MOD_S.fK)||{}).n||MOD_S.fK:MOD_S.fK;
  MOD_S.prog.vlErrors=MOD_checkVoiceLeading(allChords.map(c=>c.satb),MOD_ni(fD));
  renderProg();
  setTimeout(()=>document.getElementById('mod_sA').scrollIntoView({behavior:'smooth',block:'start'}),80);
}

function chnPlayAll(){
  if(!MOD_S.prog||!MOD_S.prog.isChain){chnGenAll();setTimeout(chnPlayAll,200);return;}
  playProg();
}

function renderChain(){
  chnSync();
  const el=document.getElementById('mod_chainUI');
  if(!el)return;
  const nodes=MOD_CHAIN.nodes,links=MOD_CHAIN.links;
  let h='<div id="chn-timeline">';

  nodes.forEach((nd,i)=>{
    const isFirst=i===0,isLast=i===nodes.length-1;
    const canDel=!isFirst&&!isLast&&nodes.length>2;
    h+=`<div class="chn-node${MOD_CHAIN.activeLink===i-1||MOD_CHAIN.activeLink===i?' chn-active':''}">`;
    if(canDel)h+=`<span class="chn-del" onclick="chnDelNode(${i})" title="${tx('Supprimer','Delete','Eliminar')}">✕</span>`;
    // Key label
    h+=`<div class="chn-lbl">${isFirst?tx('Départ','From','Origen'):isLast?tx('Arrivée','To','Destino'):tx('Via','Via','Vía')}</div>`;
    // Key selector
    h+=`<div class="chn-key-row"><select onchange="chnSetNodeKey(${i},this.value)">`;
    MOD_KP.forEach(p=>{h+=`<option value="${p.m}"${p.m===nd.key?' selected':''}>${oL(p.m)}</option>`;});
    h+=`</select></div>`;
    // Mode pills
    h+=`<div class="chn-pills">`;
    h+=`<button class="${nd.mode==='major'?'on':''}" onclick="chnSetNodeMode(${i},'major')">Maj</button>`;
    h+=`<button class="${nd.mode==='minor'?'on':''}" onclick="chnSetNodeMode(${i},'minor')">min</button>`;
    h+=`</div></div>`;

    // Arrow + tech selector (link after this node, if not last)
    if(!isLast){
      const lnk=links[i];
      const techs=chnGetTechs(i);
      const bCls=techs.find(t=>t.id===lnk.techId)?.badge||'chr';
      h+=`<div class="chn-arrow">→</div>`;
      h+=`<div style="display:flex;flex-direction:column;align-items:center;gap:3px;flex-shrink:0">`;
      h+=`<div class="chn-lbl" style="text-align:center">${tx('Technique','Technique','Técnica')}</div>`;
      h+=`<select style="font-size:11px;padding:2px 5px;border-radius:6px;border:1px solid var(--bd);background:#fff;cursor:pointer" onchange="chnSetLinkTech(${i},this.value)">`;
      techs.forEach(tech=>{h+=`<option value="${tech.id}"${tech.id===lnk.techId?' selected':''}>${tech.nm}</option>`;});
      h+=`</select>`;
      h+=`<span class="mtb ${bCls}" style="font-size:9px">${techs.find(t=>t.id===lnk.techId)?.nm||''}</span>`;
      h+=`</div><div class="chn-arrow">→</div>`;
    }
  });

  // Add node button
  h+=`<button class="chn-add" onclick="chnAddNode()" title="${tx('Ajouter une étape','Add step','Agregar paso')}">+</button>`;
  h+='</div>';

  // Action buttons
  h+=`<div class="chn-play-row">`;
  h+=`<button class="play-btn" onclick="chnGenAll()">⚙ ${tx('Générer toute la chaîne','Generate full chain','Generar cadena completa')}</button>`;
  h+=`<button class="play-btn" style="background:#059669" onclick="chnPlayAll()">▶ ${tx('Écouter la chaîne','Play chain','Escuchar cadena')}</button>`;
  h+=`</div>`;

  // Step summary
  h+=`<div style="font-size:11px;color:#888;margin-top:6px">${nodes.map((nd,i)=>{
    const key=nd.mode==='minor'?(MOD_KP.find(p=>p.m===nd.key)||{}).n||nd.key:nd.key;
    const lbl=eL(key,nd.mode)+(nd.mode==='major'?' maj':' min');
    if(i<links.length){
      const tech=chnGetTechs(i).find(t=>t.id===links[i].techId);
      return`<b>${lbl}</b> <span style="color:var(--a)">—[${tech?tech.nm:'?'}]→</span>`;
    }
    return`<b>${lbl}</b>`;
  }).join(' ')}</div>`;

  el.innerHTML=h;
}

/* ═══════════════════════════════════════════
   #4 — BIBLIOTHÈQUE DU RÉPERTOIRE
   ═══════════════════════════════════════════ */

const MOD_LIB=[
  {id:'bach_846',comp:'J.S. Bach',work:{fr:'Prélude en Do M, BWV 846',en:'Prelude in C maj, BWV 846',es:'Preludio en Do M, BWV 846'},era:'baroque',fK:'C',fM:'major',tK:'G',tM:'major',techId:'pivot',mod:'C → G'},
  {id:'pachelbel',comp:'J. Pachelbel',work:{fr:'Canon en Ré',en:'Canon in D',es:'Canon en Re'},era:'baroque',fK:'D',fM:'major',tK:'A',tM:'major',techId:'pivot',mod:'D → A'},
  {id:'mozart_545',comp:'W.A. Mozart',work:{fr:'Sonate K.545, 1ᵉʳ mvt',en:'Sonata K.545, 1st mvt',es:'Sonata K.545, 1er mvto'},era:'classique',fK:'C',fM:'major',tK:'G',tM:'major',techId:'secdom',mod:'C → G'},
  {id:'mozart_331',comp:'W.A. Mozart',work:{fr:'Sonate K.331, Andante',en:'Sonata K.331, Andante',es:'Sonata K.331, Andante'},era:'classique',fK:'A',fM:'major',tK:'A',tM:'minor',techId:'direct',mod:'A → a'},
  {id:'haydn_35',comp:'J. Haydn',work:{fr:'Sonate Hob.XVI:35',en:'Sonata Hob.XVI:35',es:'Sonata Hob.XVI:35'},era:'classique',fK:'C',fM:'major',tK:'F',tM:'minor',techId:'chrom',mod:'C → fm'},
  {id:'beethoven_path',comp:'L.v. Beethoven',work:{fr:'Sonate Pathétique op.13',en:'Pathétique Sonata op.13',es:'Sonata Patética op.13'},era:'classique',fK:'C',fM:'minor',tK:'E♭',tM:'major',techId:'pivot',mod:'cm → E♭'},
  {id:'schubert_op90',comp:'F. Schubert',work:{fr:'Impromptu op.90 n°3',en:'Impromptu op.90 no.3',es:'Impromptu op.90 nº3'},era:'romantique',fK:'G♭',fM:'major',tK:'E',tM:'minor',techId:'ger6',mod:'G♭ → em'},
  {id:'chopin_op28_4',comp:'F. Chopin',work:{fr:'Prélude op.28 n°4',en:'Prelude op.28 no.4',es:'Preludio op.28 nº4'},era:'romantique',fK:'E',fM:'minor',tK:'B',tM:'minor',techId:'chrom',mod:'em → bm'},
  {id:'schumann_traum',comp:'R. Schumann',work:{fr:'Träumerei (Kinderszenen)',en:'Träumerei (Kinderszenen)',es:'Träumerei (Kinderszenen)'},era:'romantique',fK:'F',fM:'major',tK:'D',tM:'minor',techId:'pivot',mod:'F → dm'},
  {id:'brahms_118_2',comp:'J. Brahms',work:{fr:'Intermezzo op.118 n°2',en:'Intermezzo op.118 no.2',es:'Intermezzo op.118 nº2'},era:'romantique',fK:'A',fM:'major',tK:'F♯',tM:'minor',techId:'pivot',mod:'A → f♯m'},
  {id:'liszt_liebes',comp:'F. Liszt',work:{fr:'Liebestraum n°3',en:'Liebestraum no.3',es:'Liebestraum nº3'},era:'romantique',fK:'A♭',fM:'major',tK:'B',tM:'major',techId:'ger6',mod:'A♭ → B'},
  {id:'wagner_tristan',comp:'R. Wagner',work:{fr:'Tristan und Isolde, Prélude',en:'Tristan und Isolde, Prelude',es:'Tristán e Isolda, Preludio'},era:'tardif',fK:'A',fM:'minor',tK:'E♭',tM:'major',techId:'chrom',mod:'am → E♭'},
  {id:'franck_sym',comp:'C. Franck',work:{fr:'Symphonie en ré mineur',en:'Symphony in D minor',es:'Sinfonía en re menor'},era:'tardif',fK:'D',fM:'minor',tK:'F',tM:'major',techId:'pivot',mod:'dm → F'},
  {id:'faure_pavane',comp:'G. Fauré',work:{fr:'Pavane op.50',en:'Pavane op.50',es:'Pavana op.50'},era:'tardif',fK:'F♯',fM:'minor',tK:'A',tM:'major',techId:'pivot',mod:'f♯m → A'},
  {id:'pedago_chrom',comp:tx('Exercice','Exercise','Ejercicio'),work:{fr:'Médiante chromatique (Ger⁺⁶)',en:'Chromatic mediant (Ger⁺⁶)',es:'Mediante cromática (Ger⁺⁶)'},era:'pedago',fK:'C',fM:'major',tK:'E',tM:'major',techId:'ger6',mod:'C → E'}
];

const MOD_LIB_FILTER={q:'',era:'all',tech:'all'};

function libApply(id){
  const ex=MOD_LIB.find(e=>e.id===id);
  if(!ex)return;
  // Find the key in MOD_KP that matches (handles enharmonic spellings)
  const findKey=k=>MOD_KP.find(p=>p.m===k||p.n===k)?.m||k;
  MOD_S.fK=findKey(ex.fK);MOD_S.fM=ex.fM;
  MOD_S.tK=findKey(ex.tK);MOD_S.tM=ex.tM;
  MOD_S.sel=ex.techId;MOD_S.prog=null;MOD_S.ps={};
  document.getElementById('mod_fK').value=MOD_S.fK;
  document.getElementById('mod_tK').value=MOD_S.tK;
  ['f','t'].forEach(w=>{const m=w==='f'?MOD_S.fM:MOD_S.tM;const c=document.getElementById('mod_'+w+'M');c.children[0].classList.toggle('on',m==='major');c.children[1].classList.toggle('on',m==='minor');});
  // Sync chain too
  MOD_CHAIN.nodes=[{key:MOD_S.fK,mode:MOD_S.fM},{key:MOD_S.tK,mode:MOD_S.tM}];
  MOD_CHAIN.links=[{techId:ex.techId,ps:{}}];
  MOD_CHAIN.activeLink=-1;
  MOD_R();
  renderChain();
  // Auto-generate the progression
  setTimeout(()=>{
    try{genProg(ex.techId);}catch(e){console.warn('lib genProg:',e);}
    setTimeout(()=>document.getElementById('mod_sA').scrollIntoView({behavior:'smooth',block:'start'}),120);
  },80);
}

function libSetFilter(k,v){MOD_LIB_FILTER[k]=v;renderLibrary();}

function renderLibrary(){
  const el=document.getElementById('mod_libUI');
  if(!el)return;
  const eraNames={baroque:tx('Baroque','Baroque','Barroco'),classique:tx('Classique','Classical','Clásico'),romantique:tx('Romantique','Romantic','Romántico'),tardif:tx('Post-romantique','Late Romantic','Postromántico'),pedago:tx('Pédagogique','Pedagogical','Pedagógico')};
  const techNames={};
  // Get all unique tech IDs and translate
  const allTechs=MOD_dT('C','major','G','major',fP('C','major','G','major'));
  allTechs.forEach(t=>{techNames[t.id]=t.nm;});
  // Add techs that may not appear in C→G
  ['ger6','dim7','chrom','direct','deceptive','double','domchain'].forEach(tid=>{if(!techNames[tid]){const all=MOD_dT('C','major','E','major',fP('C','major','E','major'));const m=all.find(t=>t.id===tid);if(m)techNames[tid]=m.nm;}});

  const q=MOD_LIB_FILTER.q.toLowerCase().trim();
  const filtered=MOD_LIB.filter(ex=>{
    const work=(ex.work[currentLang]||ex.work.fr).toLowerCase();
    const matchQ=!q||work.includes(q)||ex.comp.toLowerCase().includes(q)||ex.mod.toLowerCase().includes(q);
    const matchE=MOD_LIB_FILTER.era==='all'||ex.era===MOD_LIB_FILTER.era;
    const matchT=MOD_LIB_FILTER.tech==='all'||ex.techId===MOD_LIB_FILTER.tech;
    return matchQ&&matchE&&matchT;
  });

  let h=`<div class="lib-search">`;
  h+=`<input type="text" id="lib-q" placeholder="${tx('Rechercher (compositeur, œuvre…)','Search (composer, work…)','Buscar (compositor, obra…)')}" value="${MOD_LIB_FILTER.q.replace(/"/g,'&quot;')}" oninput="libSetFilter('q',this.value)">`;
  h+=`<select onchange="libSetFilter('era',this.value)"><option value="all">${tx('Toutes époques','All eras','Todas épocas')}</option>`;
  Object.entries(eraNames).forEach(([k,v])=>{h+=`<option value="${k}"${MOD_LIB_FILTER.era===k?' selected':''}>${v}</option>`;});
  h+=`</select>`;
  h+=`<select onchange="libSetFilter('tech',this.value)"><option value="all">${tx('Toutes techniques','All techniques','Todas técnicas')}</option>`;
  Object.entries(techNames).forEach(([k,v])=>{h+=`<option value="${k}"${MOD_LIB_FILTER.tech===k?' selected':''}>${v}</option>`;});
  h+=`</select></div>`;

  if(!filtered.length){h+=`<div class="lib-empty">${tx('Aucun résultat','No results','Sin resultados')}</div>`;}
  else{
    h+=`<div class="lib-list">`;
    filtered.forEach(ex=>{
      const work=ex.work[currentLang]||ex.work.fr;
      const techNm=techNames[ex.techId]||ex.techId;
      h+=`<div class="lib-item" onclick="libApply('${ex.id}')">`;
      h+=`<div class="lib-info"><div class="lib-comp">${ex.comp}</div><div class="lib-work">${work}</div><div class="lib-mod">${ex.mod} · ${techNm}</div></div>`;
      h+=`<div class="lib-tags"><span class="lib-tag era">${eraNames[ex.era]||ex.era}</span></div>`;
      h+=`</div>`;
    });
    h+=`</div>`;
    h+=`<div style="font-size:11px;color:#888;margin-top:8px;font-style:italic">${tx('Cliquez un exemple : la modulation est chargée et générée automatiquement.','Click an example: the modulation is loaded and generated automatically.','Haz clic en un ejemplo: la modulación se carga y genera automáticamente.')}</div>`;
  }

  // Preserve focus on search input
  const wasFocus=document.activeElement&&document.activeElement.id==='lib-q';
  const caret=wasFocus?document.activeElement.selectionStart:null;
  el.innerHTML=h;
  if(wasFocus){const ni=document.getElementById('lib-q');if(ni){ni.focus();if(caret!==null)ni.setSelectionRange(caret,caret);}}
}

/* ═══ PDF Export (print-friendly popup) ═══ */
function MOD_exportPDF(){
  if(!MOD_S.prog||!MOD_S.prog.chords.length){alert(tx('Générer une progression d\'abord','Generate a progression first','Genera primero una progresión'));return;}
  const scoreEl=document.getElementById('scoreWrap');
  if(!scoreEl)return;

  // Capture the SVG (the staff is rendered as <svg>, not <canvas>)
  const svgEl=scoreEl.querySelector('svg');
  if(!svgEl){alert(tx('Partition pas encore affichée','Score not yet rendered','Partitura aún no representada'));return;}
  // Clone so we can strip inline width/height that would otherwise lock the SVG to a fixed pixel size
  const svgClone=svgEl.cloneNode(true);
  svgClone.removeAttribute('style');
  svgClone.removeAttribute('width');
  svgClone.removeAttribute('height');
  const svgContent=svgClone.outerHTML;

  const fD=MOD_S.fM==='minor'?(MOD_KP.find(p=>p.m===MOD_S.fK)||{}).n||MOD_S.fK:MOD_S.fK;
  const tD=MOD_S.tM==='minor'?(MOD_KP.find(p=>p.m===MOD_S.tK)||{}).n||MOD_S.tK:MOD_S.tK;
  const isChainPDF=!!(MOD_S.prog&&MOD_S.prog.isChain);
  const title=isChainPDF
    ?tx('Chaîne de modulations','Modulation Chain','Cadena de modulaciones')+' : '+MOD_CHAIN.nodes.map((nd,i)=>{const k=nd.mode==='minor'?(MOD_KP.find(p=>p.m===nd.key)||{}).n||nd.key:nd.key;return eL(k,nd.mode);}).join(' → ')
    :`Modulation : ${eL(fD,MOD_S.fM)} ${MOD_S.fM==='major'?t('major'):t('minor')} → ${eL(tD,MOD_S.tM)} ${MOD_S.tM==='major'?t('major'):t('minor')}`;
  const chainStepsHtml=isChainPDF?`<div class="chain-steps">`+MOD_CHAIN.links.map((lnk,li)=>{
    const fN=MOD_CHAIN.nodes[li],tN=MOD_CHAIN.nodes[li+1];
    const fk=fN.mode==='minor'?(MOD_KP.find(p=>p.m===fN.key)||{}).n||fN.key:fN.key;
    const tk=tN.mode==='minor'?(MOD_KP.find(p=>p.m===tN.key)||{}).n||tN.key:tN.key;
    const tech=chnGetTechs(li).find(t=>t.id===lnk.techId);
    return`<div class="cs-row"><span class="cs-from">${eL(fk,fN.mode)} ${fN.mode==='major'?t('major'):t('minor')}</span><span class="cs-arrow">→</span><span class="cs-tech">${tech?tech.nm:'?'}</span><span class="cs-arrow">→</span><span class="cs-to">${eL(tk,tN.mode)} ${tN.mode==='major'?t('major'):t('minor')}</span></div>`;
  }).join('')+`</div>`:'';
  const techName=isChainPDF?'':MOD_S.sel?document.querySelector('.mt.sel .mtn')?.textContent||'':'';

  // Build chord labels with percentages so they scale with the SVG
  const si=MOD_S.prog.si;
  const W=(si&&si.W)||740,cW=(si&&si.cW)||0,noteStart=(si&&si.noteStart)||0;
  let rnHtml='<div class="rn-row">';
  let nmHtml='<div class="name-row">';
  MOD_S.prog.chords.forEach((c,i)=>{
    const wPct=(cW/W)*100;
    const mPct=i===0?(noteStart/W)*100:0;
    const zc=c.zone==='f'?'zf':c.zone==='t'?'zt':'zp';
    rnHtml+=`<div class="rn-lbl ${zc}" style="width:${wPct}%;margin-left:${mPct}%">${c.rn}</div>`;
    nmHtml+=`<div class="name-lbl" style="width:${wPct}%;margin-left:${mPct}%">${c.nm}</div>`;
  });
  rnHtml+='</div>';nmHtml+='</div>';

  // i18n voice labels for the legend
  const lblS=t('ah_s'),lblA=t('ah_a'),lblT=t('ah_t'),lblB=t('ah_b');
  const lblFooter=tx('Contrepoint — Outil de modulation','Contrepoint — Modulation Tool','Contrepoint — Herramienta de modulación');
  const dateStr=new Date().toLocaleDateString(tx('fr-CA','en-CA','es-ES'));

  const w=window.open('','_blank','width=900,height=700');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${title}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
@page{size:letter portrait;margin:1.5cm 2cm}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'DM Sans',sans-serif;color:#1e1e2e;padding:40px}
.header{text-align:center;margin-bottom:24px}
.header h1{font-size:18px;font-weight:700;color:#534AB7;margin-bottom:4px}
.header h2{font-size:14px;font-weight:600;color:#6b7280;margin-bottom:2px}
.header .meta{font-size:11px;color:#9ca3af;margin-top:8px}
.score-wrap{background:#fff;padding:20px 10px;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:20px}
.score-wrap svg{width:100%;height:auto;display:block;margin:0 auto}
.rn-row{display:flex;margin-top:8px}
.rn-lbl{text-align:center;font-size:13px;font-weight:700}
.rn-lbl.zf{color:#2563eb}.rn-lbl.zt{color:#dc2626}.rn-lbl.zp{color:#b45309}
.name-row{display:flex;margin-top:2px}
.name-lbl{text-align:center;font-size:10px;color:#6b7280}
.legend{display:flex;gap:16px;justify-content:center;margin-top:18px;font-size:11px;color:#6b7280}
.legend span{display:flex;align-items:center;gap:4px}
.legend .dot{width:8px;height:8px;border-radius:50%}
.footer{text-align:center;font-size:10px;color:#9ca3af;margin-top:40px;padding-top:12px;border-top:1px solid #e5e7eb}
.chain-steps{margin-bottom:18px;padding:12px 16px;background:#f5f3ff;border-radius:8px;border:1px solid #c4b5fd}
.cs-row{display:flex;align-items:center;gap:10px;padding:3px 0;font-size:12px}
.cs-from{color:#2563eb;font-weight:600}.cs-to{color:#dc2626;font-weight:600}.cs-tech{color:#7c3aed;font-style:italic}.cs-arrow{color:#9ca3af}
@media print{
  body{padding:20px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .score-wrap{border:none;box-shadow:none}
}
</style>
</head><body>
<div class="header">
  <h1>${title}</h1>
  <h2>${techName}</h2>
  <div class="meta">${lblFooter} · ${dateStr}</div>
</div>
${chainStepsHtml}
<div class="score-wrap">
  ${svgContent}
  ${rnHtml}
  ${nmHtml}
</div>
<div class="legend">
  <span><div class="dot" style="background:#3498db"></div> ${lblS}</span>
  <span><div class="dot" style="background:#2ecc71"></div> ${lblA}</span>
  <span><div class="dot" style="background:#e67e22"></div> ${lblT}</span>
  <span><div class="dot" style="background:#e74c3c"></div> ${lblB}</span>
</div>
<script>setTimeout(()=>window.print(),400);<\/script>
</body></html>`);
  w.document.close();
}

/* ═══ MIDI Export — Pure JS Standard MIDI File (Format 1) ═══ */
function MOD_exportMIDI(){
  if(!MOD_S.prog||!MOD_S.prog.chords.length){alert(tx('Générer une progression d\'abord','Generate a progression first','Genera primero una progresión'));return;}
  const chords=MOD_S.prog.chords;
  const tempo=72; // BPM
  const PPQ=480;
  const beatTicks=PPQ*4; // whole note per chord

  function toVLQ(val){const b=[];b.push(val&0x7F);val>>=7;while(val>0){b.push((val&0x7F)|0x80);val>>=7;}return b.reverse();}
  function str2b(s){return Array.from(s).map(c=>c.charCodeAt(0));}
  function i16(v){return[(v>>8)&0xFF,v&0xFF];}
  function i32(v){return[(v>>24)&0xFF,(v>>16)&0xFF,(v>>8)&0xFF,v&0xFF];}

  function buildTempoTrack(){
    let ev=[];
    const uspb=Math.round(60000000/tempo);
    ev.push(...toVLQ(0),0xFF,0x51,0x03,(uspb>>16)&0xFF,(uspb>>8)&0xFF,uspb&0xFF);
    ev.push(...toVLQ(0),0xFF,0x58,0x04,4,2,24,8); // 4/4 time
    // Key signature (C major default)
    ev.push(...toVLQ(0),0xFF,0x59,0x02,0x00,0x00);
    const nm=str2b('Tempo');
    ev.push(...toVLQ(0),0xFF,0x03,nm.length,...nm);
    ev.push(...toVLQ(0),0xFF,0x2F,0x00);
    return ev;
  }

  function buildVoiceTrack(voiceName,voiceKey,channel){
    let ev=[];
    const nm=str2b(voiceName);
    ev.push(...toVLQ(0),0xFF,0x03,nm.length,...nm);
    ev.push(...toVLQ(0),0xC0|channel,0); // Piano
    chords.forEach((ch,i)=>{
      const midi=ch.satb[voiceKey];
      if(!midi)return;
      const vel=80;
      const delta=i===0?0:0;
      ev.push(...toVLQ(delta),0x90|channel,midi,vel);
      ev.push(...toVLQ(beatTicks),0x80|channel,midi,0);
    });
    ev.push(...toVLQ(0),0xFF,0x2F,0x00);
    return ev;
  }

  function makeChunk(events){return[...str2b('MTrk'),...i32(events.length),...events];}

  const tracks=[
    buildTempoTrack(),
    buildVoiceTrack('Soprano','S',0),
    buildVoiceTrack('Alto','A',1),
    buildVoiceTrack('Ténor','T',2),
    buildVoiceTrack('Basse','B',3),
  ];

  let midi=[];
  midi.push(...str2b('MThd'),...i32(6),...i16(1),...i16(tracks.length),...i16(PPQ));
  tracks.forEach(t=>midi.push(...makeChunk(t)));

  const blob=new Blob([new Uint8Array(midi)],{type:'audio/midi'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='modulation.mid';a.click();
  URL.revokeObjectURL(url);
}


/* ═══ TAB 9: SÉQUENCES ═══ */

/* ══════════════════════════════════════════════════
   SÉQUENCES HARMONIQUES — Harmonic sequences
   ══════════════════════════════════════════════════ */

/* ── Init auto ── */
try{ popSel(); MOD_R(); renderChain(); renderLibrary(); }catch(e){console.error('MOD:',e)}
