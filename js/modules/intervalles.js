/* ═══════════════════════════════════════════════════════════════════
   intervalles.js — Module intervalles
   Chargé dynamiquement par main.js lors du premier accès à l'onglet.
   Toutes les fonctions/variables avec préfixe majuscule (T1, MOD, etc.)
   sont exposées sur window pour rétro-compat avec onclick="..."
   ═══════════════════════════════════════════════════════════════════ */
/* ═══ INTERVALLES ═══ */
const T2=(function(){
  const NS=['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
  const NF=['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'];
  const W_PAT=[0,2,4,5,7,9,11];
  const WN=['C','D','E','F','G','A','B'];
  const BN_S=['C♯','D♯','','F♯','G♯','A♯',''];
  const BN_F=['D♭','E♭','','G♭','A♭','B♭',''];
  const BI_PAT=[1,3,null,6,8,10,null];

  const IV=[
    {st:0,abr:'P1',nom:'Perfect Unison',gen:0},
    {st:1,abr:'m2',nom:'Minor 2nd',gen:1},
    {st:2,abr:'M2',nom:'Major 2nd',gen:1},
    {st:1,abr:'A1',nom:'Augmented Unison',gen:0},
    {st:2,abr:'d3',nom:'Diminished 3rd',gen:2},
    {st:3,abr:'A2',nom:'Augmented 2nd',gen:1},
    {st:3,abr:'m3',nom:'Minor 3rd',gen:2},
    {st:4,abr:'M3',nom:'Major 3rd',gen:2},
    {st:4,abr:'d4',nom:'Diminished 4th',gen:3},
    {st:5,abr:'A3',nom:'Augmented 3rd',gen:2},
    {st:5,abr:'P4',nom:'Perfect 4th',gen:3},
    {st:6,abr:'A4',nom:'Augmented 4th',gen:3},
    {st:6,abr:'d5',nom:'Diminished 5th',gen:4},
    {st:7,abr:'P5',nom:'Perfect 5th',gen:4},
    {st:7,abr:'d6',nom:'Diminished 6th',gen:5},
    {st:8,abr:'A5',nom:'Augmented 5th',gen:4},
    {st:8,abr:'m6',nom:'Minor 6th',gen:5},
    {st:9,abr:'M6',nom:'Major 6th',gen:5},
    {st:9,abr:'d7',nom:'Diminished 7th',gen:6},
    {st:10,abr:'A6',nom:'Augmented 6th',gen:5},
    {st:10,abr:'m7',nom:'Minor 7th',gen:6},
    {st:11,abr:'M7',nom:'Major 7th',gen:6},
    {st:11,abr:'d8',nom:'Diminished 8ve',gen:7},
    {st:12,abr:'A7',nom:'Augmented 7th',gen:6},
    {st:12,abr:'P8',nom:'Perfect 8ve',gen:7},
    {st:13,abr:'A8',nom:'Augmented 8ve',gen:7},
    {st:12,abr:'d9',nom:'Diminished 9th',gen:8},
    {st:13,abr:'m9',nom:'Minor 9th',gen:8},
    {st:14,abr:'M9',nom:'Major 9th',gen:8},
    {st:15,abr:'A9',nom:'Augmented 9th',gen:8},
    {st:14,abr:'d10',nom:'Diminished 10th',gen:9},
    {st:15,abr:'m10',nom:'Minor 10th',gen:9},
    {st:16,abr:'M10',nom:'Major 10th',gen:9},
    {st:17,abr:'A10',nom:'Augmented 10th',gen:9},
  ];

  let note=0, noteOct=1, dir='up', acc='s', selIv=13, showInv=false;
  function nn(n){return(acc==='s'?NS:NF)[n]}

  /* ── Enharmonic-correct interval spelling ── */
  /* pc2dia: pitch class → diatonic letter index (with accidental context) */
  function pc2dia(pc){
    const map=[0,0,1,1,2,3,3,4,4,5,5,6]; /* C=0 C♯/D♭=0or1 D=1 ... */
    return map[pc];
  }
  /* Get the letter index for a starting note considering accidental preference */
  function startLetterIdx(pc){
    /* Natural notes */
    const natMap={0:0,2:1,4:2,5:3,7:4,9:5,11:6};
    if(natMap[pc]!==undefined)return natMap[pc];
    /* Sharps: C♯→0, D♯→1, F♯→3, G♯→4, A♯→5 */
    if(acc==='s')return{1:0,3:1,6:3,8:4,10:5}[pc]||0;
    /* Flats: D♭→1, E♭→2, G♭→4, A♭→5, B♭→6 */
    return{1:1,3:2,6:4,8:5,10:6}[pc]||0;
  }
  /* Get the correct starting note name (letter + accidental) */
  function startNoteName(pc){
    const li=startLetterIdx(pc);
    const natPC=W_PAT[li];
    const diff=((pc-natPC)+12)%12;
    if(diff===0)return WN[li];
    if(diff===1)return WN[li]+'♯';
    if(diff===11)return WN[li]+'♭';
    if(diff===2)return WN[li]+'𝄪';
    if(diff===10)return WN[li]+'𝄫';
    return WN[li];
  }
  /* Spell the target note based on interval generic number and semitones */
  function spellTarget(startPC,genInterval,semiDir){
    const sLI=startLetterIdx(startPC);
    const targetLI=((sLI+(dir==='up'?genInterval:-genInterval))%7+7)%7;
    const targetNatPC=W_PAT[targetLI];
    const targetPC=((startPC+semiDir)%12+12)%12;
    const diff=((targetPC-targetNatPC)+12)%12;
    let accStr='';
    if(diff===0)accStr='';
    else if(diff===1)accStr='♯';
    else if(diff===11)accStr='♭';
    else if(diff===2)accStr='𝄪';
    else if(diff===10)accStr='𝄫';
    return WN[targetLI]+accStr;
  }

  /* Inversion map: quality inversions */
  const INV_MAP={
    'P1':'P8','P8':'P1',
    'm2':'M7','M7':'m2',
    'M2':'m7','m7':'M2',
    'A1':'d8','d8':'A1',
    'd3':'A6','A6':'d3',
    'A2':'d7','d7':'A2',
    'm3':'M6','M6':'m3',
    'M3':'m6','m6':'M3',
    'd4':'A5','A5':'d4',
    'A3':'d6','d6':'A3',
    'P4':'P5','P5':'P4',
    'A4':'d5','d5':'A4',
    'A7':'d2','d2':'A7',
    'A8':'d1','d1':'A8',
    'd9':'A7','A9':'d2',
    'm9':'M7','M9':'m7',
    'd10':'A6','m10':'M6','M10':'m6','A10':'d6'
  };

  function findIvByAbr(abr){
    for(let i=0;i<IV.length;i++) if(IV[i].abr===abr) return i;
    return -1;
  }

  function bldPiano(){
    const el=document.getElementById('piano2');
    const bn=acc==='s'?BN_S:BN_F;
    const totalW=21, ww=100/totalW, g=0.3;
    let h='';
    for(let o=0;o<3;o++){
      for(let i=0;i<7;i++){
        const midi=W_PAT[i];
        const isSel=(midi===note&&o===noteOct);
        const idx=o*7+i;
        h+=`<div class="wkey2${isSel?' sel':''}" data-midi="${midi}" data-oct="${o}" style="left:${idx*ww+g/2}%;width:${ww-g}%" onclick="T2.sN(${midi},${o})">${WN[i]}</div>`;
      }
    }
    for(let o=0;o<3;o++){
      for(let i=0;i<7;i++){
        if(BI_PAT[i]===null)continue;
        const midi=BI_PAT[i];
        const lbl=bn[i];
        const idx=o*7+i;
        const bw=3.2;
        const left=(idx+1)*ww-bw/2;
        const isSel=(midi===note&&o===noteOct);
        h+=`<div class="bkey2${isSel?' sel':''}" data-midi="${midi}" data-oct="${o}" style="left:${left}%;width:${bw}%" onclick="T2.sN(${midi},${o})">${lbl}</div>`;
      }
    }
    el.innerHTML=h;
  }

  function bldIv(){
    document.getElementById('ivGrid2').innerHTML=IV.map((v,i)=>{
      const cls=selIv===i?'iv-btn2 on':'iv-btn2';
      return `<button class="${cls}" onclick="T2.sIv(${i})">${v.abr}<span class="sub2">${v.st}st</span></button>`;
    }).join('');
  }

  function compute(){
    const v=IV[selIv];
    const startMidi=noteOct*12+note;
    const endMidi=dir==='up'?startMidi+v.st:startMidi-v.st;
    const n2=((endMidi%12)+12)%12;
    const pianoOct=Math.floor(endMidi/12);
    const realBase=dir==='up'?4:5;
    const absStart=realBase*12+note;
    const absEnd=dir==='up'?absStart+v.st:absStart-v.st;
    /* Spell target note correctly */
    const semiDir=dir==='up'?v.st:-v.st;
    const targetName=spellTarget(note,v.gen,semiDir);
    const startName=startNoteName(note);
    return{n2,realOct:Math.floor(absEnd/12),pianoOct,iv:v,targetName,startName};
  }

  function hlPiano(){
    const el=document.getElementById('piano2');
    el.querySelectorAll('.sel2,.inv').forEach(k=>{k.classList.remove('sel2');k.classList.remove('inv');});
    const r=compute();
    const tOct=r.pianoOct;
    if(tOct<0||tOct>2)return;
    if(r.n2===note&&tOct===noteOct&&IV[selIv].st===0)return;
    el.querySelectorAll('.wkey2,.bkey2').forEach(k=>{
      if(parseInt(k.dataset.midi)===r.n2&&parseInt(k.dataset.oct)===tOct&&!k.classList.contains('sel')){
        k.classList.add('sel2');
      }
    });
    /* Inversion highlight */
    if(showInv){
      const invAbr=INV_MAP[IV[selIv].abr];
      if(invAbr){
        const invIdx=findIvByAbr(invAbr);
        if(invIdx>=0){
          const origSt=IV[selIv].st;
          const invSemi=origSt<=12?12-origSt:24-origSt;
          const startMidi=noteOct*12+note;
          const invNoteMidi=dir==='up'?startMidi-invSemi:startMidi+invSemi;
          const invNotePC=((invNoteMidi%12)+12)%12;
          const invNoteOct=Math.floor(invNoteMidi/12);
          if(invNoteOct>=0&&invNoteOct<=2){
            el.querySelectorAll('.wkey2,.bkey2').forEach(k=>{
              if(parseInt(k.dataset.midi)===invNotePC&&parseInt(k.dataset.oct)===invNoteOct&&!k.classList.contains('sel')&&!k.classList.contains('sel2')){
                k.classList.add('inv');
              }
            });
          }
        }
      }
    }
  }

  function renderRes(){
    const el=document.getElementById('result2'),r=compute();
    const realStartOct=dir==='up'?4:5;
    if(r.realOct<0||r.realOct>9){el.innerHTML='<div style="color:#9ca3af;font-size:13px">'+t('iv_oor')+'</div>';return;}

    /* Summary bar */
    let h=`<div class="sbar" style="margin-bottom:0">
      <div>
        <div style="font-size:10px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em">${t('iv_s')}</div>
        <div style="font-size:24px;font-weight:600;color:#111827;line-height:1.1">${r.startName}<span style="font-size:13px;color:#9ca3af"> oct.${realStartOct}</span></div>
      </div>
      <div style="flex:0 0 auto;text-align:center;padding:4px 14px;background:#f5f3ff;border-radius:10px">
        <div style="font-size:16px;font-weight:700;color:#534AB7;line-height:1">${r.iv.abr}</div>
        <div style="font-size:9px;color:#7F77DD;margin-top:2px">${tIv(r.iv.nom)} ${dir==='up'?'↑':'↓'}</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:10px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em">${t('iv_i')}</div>
        <div style="font-size:24px;font-weight:600;color:#534AB7;line-height:1.1">${r.targetName}<span style="font-size:13px;color:#7F77DD"> oct.${r.realOct}</span></div>
      </div>
    </div>`;

    /* Inversion button */
    const invAbr=INV_MAP[r.iv.abr];
    if(invAbr){
      const invIdx=findIvByAbr(invAbr);
      if(invIdx>=0){
        const invIv=IV[invIdx];
        h+=`<div style="text-align:center;margin-top:8px">`;
        h+=`<button class="inv-toggle${showInv?' on':''}" onclick="T2.toggleInv()"><svg viewBox="0 0 24 24"><path d="M7.5 21.5c-.3 0-.5-.1-.7-.3s-.3-.5-.3-.7V14c0-.3.1-.5.3-.7s.4-.3.7-.3.5.1.7.3.3.4.3.7v2.6l7.1-7.1c.2-.2.4-.3.7-.3s.5.1.7.3.3.4.3.7-.1.5-.3.7l-7.1 7.1H12c.3 0 .5.1.7.3s.3.4.3.7-.1.5-.3.7-.4.3-.7.3H7.5zm9-12c-.3 0-.5-.1-.7-.3s-.3-.5-.3-.7V5.9L8.4 13c-.2.2-.4.3-.7.3s-.5-.1-.7-.3-.3-.4-.3-.7.1-.5.3-.7l7.1-7.1H12c-.3 0-.5-.1-.7-.3S11 3.8 11 3.5s.1-.5.3-.7.4-.3.7-.3h4.5c.3 0 .5.1.7.3s.3.5.3.7V8.5c0 .3-.1.5-.3.7s-.4.3-.7.3z"/></svg>${t('iv_r')}</button>`;
        if(showInv){
          const invSemi=r.iv.st<=12?12-r.iv.st:24-r.iv.st;
          const invDir=dir==='up'?'↓':'↑';
          const invSemiDir=dir==='up'?-invSemi:invSemi;
          const invTargetName=spellTarget(note,invIv.gen,invSemiDir);
          const invMidi=dir==='up'?(realStartOct*12+note-invSemi):(realStartOct*12+note+invSemi);
          const invOct=Math.floor(invMidi/12);
          h+=`<div class="inv-box"><div class="inv-res">`;
          h+=`<div class="inv-note"><div class="n">${invTargetName}</div><div class="o">oct. ${invOct}</div></div>`;
          h+=`<div style="text-align:center"><div class="inv-name">${invAbr}</div><div class="inv-detail">${tIv(invIv.nom)} ${invDir}</div></div>`;
          h+=`<div class="res-note"><div class="n">${r.startName}</div><div class="o">oct. ${realStartOct}</div></div>`;
          h+=`</div>`;
          h+=`<div class="inv-legend"><span><span class="dot c1"></span>${t("iv_s")}</span><span><span class="dot c2"></span>${t("iv_i")}</span><span><span class="dot c3"></span>${t("iv_r")}</span></div>`;
          h+=`</div>`;
        }
        h+=`</div>`;
      }
    }

    el.innerHTML=h;
  }

  const IV_FR={'Perfect Unison':'Unisson juste','Minor 2nd':'2de mineure','Major 2nd':'2de majeure','Augmented Unison':'Unisson augmenté','Diminished 3rd':'3ce diminuée','Augmented 2nd':'2de augmentée','Minor 3rd':'3ce mineure','Major 3rd':'3ce majeure','Diminished 4th':'4te diminuée','Augmented 3rd':'3ce augmentée','Perfect 4th':'4te juste','Augmented 4th':'4te augmentée','Diminished 5th':'5te diminuée','Perfect 5th':'5te juste','Diminished 6th':'6te diminuée','Augmented 5th':'5te augmentée','Minor 6th':'6te mineure','Major 6th':'6te majeure','Diminished 7th':'7e diminuée','Augmented 6th':'6te augmentée','Minor 7th':'7e mineure','Major 7th':'7e majeure','Diminished 8ve':'8ve diminuée','Augmented 7th':'7e augmentée','Perfect 8ve':'8ve juste','Augmented 8ve':'8ve augmentée','Diminished 9th':'9e diminuée','Minor 9th':'9e mineure','Major 9th':'9e majeure','Augmented 9th':'9e augmentée','Diminished 10th':'10e diminuée','Minor 10th':'10e mineure','Major 10th':'10e majeure','Augmented 10th':'10e augmentée'};
  function tIv(nom){return currentLang==='en'?nom:(IV_FR[nom]||nom);}

  function render(){bldPiano();bldIv();renderRes();hlPiano();}

  return{
    sN(n,oct){note=n;if(oct!==undefined)noteOct=oct;render();},
    sIv(i){selIv=i;render();},
    setDir(d){dir=d;document.getElementById('dirUp2').classList.toggle('on',d==='up');document.getElementById('dirDn2').classList.toggle('on',d==='down');render();},
    setAcc(a){acc=a;document.getElementById('prefS2').classList.toggle('on',a==='s');document.getElementById('prefF2').classList.toggle('on',a==='f');render();},
    toggleInv(){showInv=!showInv;render();},
    init(){render();}
  };
})();

/* ══════════════════════════════════════
   TAB 3 — Analyse Harmonique
   ══════════════════════════════════════ */

/* ── Init auto ── */
try{T2.init()}catch(e){console.error('T2:',e)}
