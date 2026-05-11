/* ═══════════════════════════════════════════════════════════════════
   rythme.js — Module rythme
   Chargé dynamiquement par main.js lors du premier accès à l'onglet.
   Toutes les fonctions/variables avec préfixe majuscule (T1, MOD, etc.)
   sont exposées sur window pour rétro-compat avec onclick="..."
   ═══════════════════════════════════════════════════════════════════ */
/* ═══ RYTHME ═══ */
/* ── Section switching ── */
function switchSec(i){
  document.querySelectorAll('.sec-btn').forEach((b,j)=>b.classList.toggle('on',j===i));
  document.querySelectorAll('.section').forEach((s,j)=>s.classList.toggle('active',j===i));
}

/* ══════════════════════════════════════
   SECTION 1 — Indication de mesure
   ══════════════════════════════════════ */
const TR=(function(){
  const SYM={whole:'𝅝',dWhole:'𝅝·',half:'𝅗𝅥',dHalf:'𝅗𝅥·',quarter:'♩',dQuarter:'♩·',eighth:'♪',dEighth:'♪·',sixteenth:'𝅘𝅥𝅯',dSixteenth:'𝅘𝅥𝅯·',thirtysecond:'𝅘𝅥𝅰',sixtyfourth:'𝅘𝅥𝅱'};
  const NF={whole:'Ronde',dWhole:'Ronde ·',half:'Blanche',dHalf:'Blanche ·',quarter:'Noire',dQuarter:'Noire ·',eighth:'Croche',dEighth:'Croche ·',sixteenth:'Dble croche',dSixteenth:'Dble croche ·',thirtysecond:'Trpl. croche',sixtyfourth:'Quadr. croche'};
  const NF_EN={whole:'Whole',dWhole:'Dotted whole',half:'Half',dHalf:'Dotted half',quarter:'Quarter',dQuarter:'Dotted quarter',eighth:'Eighth',dEighth:'Dotted eighth',sixteenth:'16th',dSixteenth:'Dotted 16th',thirtysecond:'32nd',sixtyfourth:'64th'};
  const NF_ES={whole:'Redonda',dWhole:'Redonda ·',half:'Blanca',dHalf:'Blanca ·',quarter:'Negra',dQuarter:'Negra ·',eighth:'Corchea',dEighth:'Corchea ·',sixteenth:'Semicorchea',dSixteenth:'Semicorchea ·',thirtysecond:'Fusa',sixtyfourth:'Semifusa'};
  function nfT(k){
    if(currentLang==='en') return NF_EN[k]||NF[k]||k;
    if(currentLang==='es') return NF_ES[k]||NF[k]||k;
    return NF[k]||k;
  }

  const SIMPLE=[
    {ts:'1/1',top:1,bot:1,beat:'whole',accent:'single'},{ts:'2/1',top:2,bot:1,beat:'whole',accent:'duple'},{ts:'3/1',top:3,bot:1,beat:'whole',accent:'triple'},{ts:'4/1',top:4,bot:1,beat:'whole',accent:'quadruple'},{ts:'5/1',top:5,bot:1,beat:'whole',accent:'quintuple'},
    {ts:'1/2',top:1,bot:2,beat:'half',accent:'single'},{ts:'2/2',top:2,bot:2,beat:'half',accent:'duple'},{ts:'3/2',top:3,bot:2,beat:'half',accent:'triple'},{ts:'4/2',top:4,bot:2,beat:'half',accent:'quadruple'},{ts:'5/2',top:5,bot:2,beat:'half',accent:'quintuple'},
    {ts:'1/4',top:1,bot:4,beat:'quarter',accent:'single'},{ts:'2/4',top:2,bot:4,beat:'quarter',accent:'duple'},{ts:'3/4',top:3,bot:4,beat:'quarter',accent:'triple'},{ts:'4/4',top:4,bot:4,beat:'quarter',accent:'quadruple'},{ts:'5/4',top:5,bot:4,beat:'quarter',accent:'quintuple'},
    {ts:'1/8',top:1,bot:8,beat:'eighth',accent:'single'},{ts:'2/8',top:2,bot:8,beat:'eighth',accent:'duple'},{ts:'3/8',top:3,bot:8,beat:'eighth',accent:'triple'},{ts:'4/8',top:4,bot:8,beat:'eighth',accent:'quadruple'},{ts:'5/8',top:5,bot:8,beat:'eighth',accent:'quintuple'},
  ];
  const COMPOUND=[
    {ts:'6/2',top:6,bot:2,beats:2,beat:'dWhole',div:'half',accent:'duple'},{ts:'9/2',top:9,bot:2,beats:3,beat:'dWhole',div:'half',accent:'triple'},{ts:'12/2',top:12,bot:2,beats:4,beat:'dWhole',div:'half',accent:'quadruple'},{ts:'15/2',top:15,bot:2,beats:5,beat:'dWhole',div:'half',accent:'quintuple'},
    {ts:'6/4',top:6,bot:4,beats:2,beat:'dHalf',div:'quarter',accent:'duple'},{ts:'9/4',top:9,bot:4,beats:3,beat:'dHalf',div:'quarter',accent:'triple'},{ts:'12/4',top:12,bot:4,beats:4,beat:'dHalf',div:'quarter',accent:'quadruple'},{ts:'15/4',top:15,bot:4,beats:5,beat:'dHalf',div:'quarter',accent:'quintuple'},
    {ts:'6/8',top:6,bot:8,beats:2,beat:'dQuarter',div:'eighth',accent:'duple'},{ts:'9/8',top:9,bot:8,beats:3,beat:'dQuarter',div:'eighth',accent:'triple'},{ts:'12/8',top:12,bot:8,beats:4,beat:'dQuarter',div:'eighth',accent:'quadruple'},{ts:'15/8',top:15,bot:8,beats:5,beat:'dQuarter',div:'eighth',accent:'quintuple'},
    {ts:'6/16',top:6,bot:16,beats:2,beat:'dEighth',div:'sixteenth',accent:'duple'},{ts:'9/16',top:9,bot:16,beats:3,beat:'dEighth',div:'sixteenth',accent:'triple'},{ts:'12/16',top:12,bot:16,beats:4,beat:'dEighth',div:'sixteenth',accent:'quadruple'},{ts:'15/16',top:15,bot:16,beats:5,beat:'dEighth',div:'sixteenth',accent:'quintuple'},
  ];

  let mType='simple',selIdx=12,hlLayer=-1;
  function ms(){return mType==='simple'?SIMPLE:COMPOUND;}
  function cur(){return ms()[selIdx];}
  function nB(m){if(mType==='compound'&&m.top===6&&grp6==='3x2')return 3;return mType==='compound'?m.beats:m.top;}

  const HLV={whole:'half',half:'quarter',quarter:'eighth',eighth:'sixteenth',sixteenth:'thirtysecond',thirtysecond:'sixtyfourth',dWhole:'dHalf',dHalf:'dQuarter',dQuarter:'dEighth',dEighth:'dSixteenth'};

  function buildLayers(m){
    const isS=mType==='simple',n=nB(m),ch=[];
    if(isS){
      const mNoteS=sMN(m.beat,n);if(mNoteS&&mNoteS!==m.beat&&NF[mNoteS])ch.push({note:mNoteS,count:1,name:tx('Mesure','Bar','Compás')});
      if(n===4&&ch[0]){const h=HLV[ch[0].note];if(h&&NF[h])ch.push({note:h,count:2,name:tx('Demi-mesure','Half-bar','Medio compás')});}
      ch.push({note:m.beat,count:n,name:tx('Temps','Beat','Pulso')});
      const d1=HLV[m.beat];if(d1&&NF[d1])ch.push({note:d1,count:n*2,name:tx('Division','Division','División')});
      const d2=d1?HLV[d1]:null;if(d2&&NF[d2])ch.push({note:d2,count:n*4,name:tx('Subdivision','Subdivision','Subdivisión')});
      const d3=d2?HLV[d2]:null;if(d3&&NF[d3]&&n*8<=32)ch.push({note:d3,count:n*8,name:tx('Sous-subdiv.','Sub-subdiv.','Sub-subdiv.')});
    } else {
      if(m.top===6 && grp6==='3x2'){
        /* 3×2 grouping: 3 beats, each divided into 2 */
        /* Mesure row: use sMN (simple logic) since 3 equal beats; only show if result differs from beat */
        const mNote3=sMN(m.div,3);if(mNote3&&mNote3!==m.div&&NF[mNote3])ch.push({note:mNote3,count:1,name:tx('Mesure','Bar','Compás')});
        ch.push({note:m.div,count:3,name:tx('Temps','Beat','Pulso')});
        ch.push({note:HLV[m.div]||m.div,count:6,name:tx('Division (×2)','Division (×2)','División (×2)')});
        const s1=HLV[HLV[m.div]];if(s1&&NF[s1])ch.push({note:s1,count:12,name:tx('Subdivision','Subdivision','Subdivisión')});
      } else {
        /* Mesure row: only show when cMN returns a note longer than the beat */
        const mNote=cMN(m.beat,n);if(mNote&&mNote!==m.beat&&NF[mNote])ch.push({note:mNote,count:1,name:tx('Mesure','Bar','Compás')});
        ch.push({note:m.beat,count:n,name:tx('Temps','Beat','Pulso')});
        ch.push({note:m.div,count:n*3,name:tx('Division (×3)','Division (×3)','División (×3)')});
        const s1=HLV[m.div];if(s1&&NF[s1])ch.push({note:s1,count:n*6,name:tx('Subdivision','Subdivision','Subdivisión')});
        const s2=s1?HLV[s1]:null;if(s2&&NF[s2]&&n*12<=32)ch.push({note:s2,count:n*12,name:tx('Sous-subdiv.','Sub-subdiv.','Sub-subdiv.')});
      }
    }
    return ch;
  }
  function sMN(b,n){return{whole:{1:'whole'},half:{1:'half',2:'whole',3:'dWhole'},quarter:{1:'quarter',2:'half',3:'dHalf',4:'whole'},eighth:{1:'eighth',2:'quarter',3:'dQuarter',4:'half'}}[b]?.[n]||b;}
  /* cMN: only 2 dotted beats = 1 longer dotted note; n>=3 returns beat (no single-note representation) */
  function cMN(b,n){if(n!==2)return b;return{dWhole:'dWhole',dHalf:'dWhole',dQuarter:'dHalf',dEighth:'dQuarter',dSixteenth:'dEighth'}[b]||b;}

  /* 6/x grouping mode: '2x3' (compound duple, default) or '3x2' (simple triple) */
  var grp6='2x3';

  function getAcc(count,level,m){
    const n=nB(m);
    if(count===1)return['s'];
    /* Special handling for 6/x meters with 3x2 grouping */
    if(m.top===6 && grp6==='3x2' && mType==='compound'){
      const nb=3; /* 3 beats of 2 */
      if(level==='beat') return['s','w','ss'];
      const ba=['s','w','ss'];
      const per=Math.round(count/nb),r=[];
      for(let b=0;b<nb;b++)for(let s=0;s<per;s++)r.push(s===0?ba[b]:'w');
      return r;
    }
    if(level==='beat'){
      if(n<=1)return['s'];if(n===2)return['s','w'];if(n===3)return['s','w','w'];if(n===4)return['s','w','ss','w'];if(n===5)return['s','w','w','ss','w'];
      return Array.from({length:n},(_,i)=>i===0?'s':'w');
    }
    const ba=getAcc(n,'beat',m),per=Math.round(count/n),r=[];
    for(let b=0;b<n;b++)for(let s=0;s<per;s++)r.push(s===0?ba[b]:'w');
    return r;
  }
  function lLevel(ch,i){if(i===0)return'measure';if(ch[i].count===nB(cur()))return'beat';if(ch[i].count<nB(cur()))return'group';return'sub';}

  function renderSel(){
    const m=ms(),sel=document.getElementById('meterSel');
    const isS=mType==='simple';
    const groups={};
    m.forEach((x,i)=>{
      const nb=isS?x.top:x.beats||Math.round(x.top/3);
      const g=nb;
      if(!groups[g])groups[g]=[];
      groups[g].push({x,i});
    });
    let h='';
    const sorted=Object.keys(groups).sort((a,b)=>a-b);
    sorted.forEach(g=>{
      h+=`<optgroup label="${currentLang==='en'?g+'-beat meters':currentLang==='es'?'Compases de '+g+' pulsos':'Mesures à '+g+' temps'}">`;
      groups[g].forEach(({x,i})=>{h+=`<option value="${i}"${i===selIdx?' selected':''}>${x.ts}</option>`;});
      h+=`</optgroup>`;
    });
    sel.innerHTML=h;
    document.getElementById('typeP').children[0].className='pill'+(mType==='simple'?' on':'');
    document.getElementById('typeP').children[1].className='pill'+(mType==='compound'?' on':'');
  }

  function renderInfo(){
    const m=cur(),n=nB(m);
    const af=currentLang==='en'?{single:'1 beat',duple:'Duple',triple:'Triple',quadruple:'Quadruple',quintuple:'Quintuple'}:currentLang==='es'?{single:'1 pulso',duple:'Binario',triple:'Ternario',quadruple:'Cuaternario',quintuple:'Quinario'}:{single:'1 temps',duple:'Duple',triple:'Triple',quadruple:'Quadruple',quintuple:'Quintuple'};
    const acName = (m.top===6 && mType==='compound' && grp6==='3x2') ? af['triple'] : af[m.accent];
    let grpToggle='';
    if(m.top===6 && mType==='compound'){
      const tt23 = tx('Grouper en 2 temps de 3 (composée duple)','Group as 2 beats of 3 (compound duple)','Agrupar en 2 pulsos de 3 (compuesto binario)');
      const tt32 = tx('Grouper en 3 temps de 2 (simple triple)','Group as 3 beats of 2 (simple triple)','Agrupar en 3 pulsos de 2 (simple ternario)');
      grpToggle=` <span style="margin-left:8px;display:inline-flex;gap:2px;background:#eae8f4;border-radius:6px;padding:2px;vertical-align:middle"><button class="pill${grp6==='2x3'?' on':''}" style="padding:4px 10px;font-size:11px;font-weight:600;min-width:0;letter-spacing:.02em" onclick="TR.setGrp6('2x3')" title="${tt23}">2×3</button><button class="pill${grp6==='3x2'?' on':''}" style="padding:4px 10px;font-size:11px;font-weight:600;min-width:0;letter-spacing:.02em" onclick="TR.setGrp6('3x2')" title="${tt32}">3×2</button></span>`;
    }
    const beatNote = (m.top===6 && grp6==='3x2' && mType==='compound') ? m.div : m.beat;
    document.getElementById('infoBadge').innerHTML=`<span style="font-size:14px">𝄞</span> <strong>${m.ts}</strong> — ${mType==='simple'?(tx('Simple','Simple','Simple')):(tx('Composée','Compound','Compuesto'))} ${acName} · ${n} ${tx('temps','beats','pulsos')} · ${tx('Temps','Beat','Pulso')} = ${nfT(beatNote)}${grpToggle} · ${tx('Division','Division','División')} ${mType==='simple'?(tx('en 2 (binaire)','by 2 (binary)','por 2 (binario)')):(tx('en 3 (ternaire)','by 3 (ternary)','por 3 (ternario)'))}`;
  }

  function renderHier(){
    const m=cur(),ch=buildLayers(m);let h='';
    ch.forEach((l,li)=>{
      const lvl=lLevel(ch,li),accs=l.count===1?['s']:getAcc(l.count,lvl==='beat'?'beat':'sub',m);
      let cls='layer';if(hlLayer>=0&&hlLayer!==li)cls+=' dim';if(hlLayer===li)cls+=' hl';
      h+=`<div class="${cls}" onclick="TR.toggleHL(${li})"><div class="layer-lbl">${l.name}<span class="ll-v">${l.count}× ${nfT(l.note)}</span></div><div class="layer-beats">`;
      for(let i=0;i<Math.min(l.count,32);i++){const a=accs[i]||'w';h+=`<div class="beat"><div class="note-sym">${SYM[l.note]||'●'}</div>`;if(l.count>1)h+=`<div class="acc ${a==='s'?'s':a==='ss'?'ss':'w'}">${a==='s'?t('str'):a==='ss'?t('med'):t('wk')}</div>`;h+=`</div>`;}
      h+=`</div></div>`;
    });
    document.getElementById('hierContent').innerHTML=h;
  }

  function renderPulse(){
    const m=cur(),n=nB(m),ch=buildLayers(m),nM=1;
    let bI=-1,dI=-1;for(let i=0;i<ch.length;i++){if(lLevel(ch,i)==='beat'){bI=i;break;}}if(bI<0)bI=0;if(bI+1<ch.length)dI=bI+1;else dI=bI;
    const bC=ch[bI].count,dC=ch[dI].count,bA=getAcc(bC,'beat',m),per=Math.round(dC/bC);
    const am={single:'fort',duple:'fort – faible',triple:'fort – faible – faible',quadruple:'fort – faible – semi-fort – faible',quintuple:'fort – faible – faible – semi-fort – faible'};
    const amEs={single:'fuerte',duple:'fuerte – débil',triple:'fuerte – débil – débil',quadruple:'fuerte – débil – semifuerte – débil',quintuple:'fuerte – débil – débil – semifuerte – débil'};
    const amEn={single:'strong',duple:'strong – weak',triple:'strong – weak – weak',quadruple:'strong – weak – medium – weak',quintuple:'strong – weak – weak – medium – weak'};
    document.getElementById('pulseDesc').innerHTML=currentLang==='en'?`The ${m.accent} meter groups beats as <strong>${amEn[m.accent]}</strong>. Beat pulse = ${nfT(ch[bI]?.note)||''}, divided ${mType==='simple'?'in 2':'in 3'}.`:currentLang==='es'?`El compás ${m.accent==='single'?'de 1 pulso':m.accent} agrupa los pulsos en patrón <strong>${amEs[m.accent]}</strong>. Pulso = ${nfT(ch[bI]?.note)||''}, dividido ${mType==='simple'?'en 2':'en 3'}.`:`Le mètre ${m.accent==='single'?'à 1 temps':m.accent} regroupe les temps en pattern <strong>${am[m.accent]}</strong>. Pulse du temps = ${nfT(ch[bI]?.note)||''}, divisé ${mType==='simple'?'en 2':'en 3'}.`;
    let h='';
    h+=pLine(tx('Rythme','Rhythm','Ritmo'),nfT(ch[dI]?.note)||'',nM,dC,()=>'<div class="pdot-i"></div>');
    h+=pLine(tx('Pulse','Pulse','Pulso'),nfT(ch[bI]?.note)||'',nM,dC,(i)=>{if(i%per!==0)return'';const a=bA[Math.floor(i/per)]||'w';return`<div class="pdot-i ${a==='s'?'big':a==='ss'?'med':''}"></div>`;});
    h+=pLine(tx('Mesure','Bar','Compás'),nfT(ch[0]?.note)||'',nM,dC,(i)=>i===0?'<div class="pdot-i big"></div>':'');
    h+=`<div class="pulse-row" style="border:none;padding-top:0"><div class="pulse-lbl" style="font-size:9px;color:#b0aec4">${tx('Accent','Accent','Acento')}</div><div class="pulse-dots">`;
    for(let ms=0;ms<nM;ms++){if(ms>0)h+=`<div class="barline" style="visibility:hidden"></div>`;for(let i=0;i<dC;i++){if(i%per===0){const bi=Math.floor(i/per),a=bA[bi]||'w',l=a==='s'?t('str'):a==='ss'?t('med_s'):t('wk'),c=a==='s'?'#534AB7':a==='ss'?'#7F77DD':'#c4c2d6';h+=`<div class="pdot" style="font-size:9px;font-weight:700;color:${c}">${l}</div>`;}else h+=`<div class="pdot"></div>`;}}
    h+=`</div></div>`;
    document.getElementById('pulseContent').innerHTML=h;
  }
  function pLine(lbl,sub,nM,dC,fn){let h=`<div class="pulse-row"><div class="pulse-lbl">${lbl}<br><span style="font-size:9px;font-weight:400;color:#b0aec4">${sub}</span></div><div class="pulse-dots">`;for(let m=0;m<nM;m++){if(m>0)h+=`<div class="barline"></div>`;for(let i=0;i<dC;i++)h+=`<div class="pdot">${fn(i)}</div>`;}h+=`</div></div>`;return h;}

  function render(){renderSel();renderInfo();renderHier();renderPulse();}

  return{
    setType(t){mType=t;selIdx=(t==='simple'?12:4);hlLayer=-1;render();},
    selMeter(i){selIdx=i;hlLayer=-1;render();},
    setGrp6(g){grp6=g;render();},
    toggleHL(i){hlLayer=(hlLayer===i)?-1:i;renderHier();},
    init(){render();}
  };
})();

/* ══════════════════════════════════════
   SECTION 2 — Division du temps
   ══════════════════════════════════════ */
const DIV=(function(){
  // Note figures: name, symbol, rest symbol, french name, french rest name
  const NOTES=[
    {id:'whole',    sym:'𝅝',  rest:'𝄻', name:'Ronde',         nameEn:'Whole note',     nameEs:'Redonda',        rname:'Pause',           rnameEn:'Whole rest',    rnameEs:'Silencio de redonda',     div:'half'},
    {id:'half',     sym:'𝅗𝅥', rest:'𝄼', name:'Blanche',       nameEn:'Half note',      nameEs:'Blanca',         rname:'Demi-pause',      rnameEn:'Half rest',     rnameEs:'Silencio de blanca',      div:'quarter'},
    {id:'quarter',  sym:'♩',  rest:'𝄽', name:'Noire',         nameEn:'Quarter note',   nameEs:'Negra',          rname:'Soupir',          rnameEn:'Quarter rest',  rnameEs:'Silencio de negra',       div:'eighth'},
    {id:'eighth',   sym:'♪',  rest:'𝄾', name:'Croche',        nameEn:'Eighth note',    nameEs:'Corchea',        rname:'Demi-soupir',     rnameEn:'Eighth rest',   rnameEs:'Silencio de corchea',     div:'sixteenth'},
    {id:'sixteenth',sym:'𝅘𝅥𝅯',rest:'𝄿', name:'Double croche', nameEn:'16th note',      nameEs:'Semicorchea',    rname:'Quart de soupir', rnameEn:'16th rest',     rnameEs:'Silencio de semicorchea', div:'thirtysecond'},
    {id:'thirtysecond',sym:'𝅘𝅥𝅰',rest:'𝅀',name:'Triple croche',nameEn:'32nd note',     nameEs:'Fusa',           rname:'8e de soupir',    rnameEn:'32nd rest',     rnameEs:'Silencio de fusa',        div:'sixtyfourth'},
  ];

  const NOTE_SYM={whole:'𝅝',half:'𝅗𝅥',quarter:'♩',eighth:'♪',sixteenth:'𝅘𝅥𝅯',thirtysecond:'𝅘𝅥𝅰',sixtyfourth:'𝅘𝅥𝅱'};
  const NOTE_NAME={whole:'Ronde',half:'Blanche',quarter:'Noire',eighth:'Croche',sixteenth:'Dble croche',thirtysecond:'Trpl. croche',sixtyfourth:'Quadr. croche'};
  const NOTE_NAME_EN={whole:'Whole',half:'Half',quarter:'Quarter',eighth:'Eighth',sixteenth:'16th',thirtysecond:'32nd',sixtyfourth:'64th'};
  const NOTE_NAME_ES={whole:'Redonda',half:'Blanca',quarter:'Negra',eighth:'Corchea',sixteenth:'Semicorchea',thirtysecond:'Fusa',sixtyfourth:'Semifusa'};
  function nnT(k){
    if(currentLang==='en') return NOTE_NAME_EN[k]||NOTE_NAME[k]||k;
    if(currentLang==='es') return NOTE_NAME_ES[k]||NOTE_NAME[k]||k;
    return NOTE_NAME[k]||k;
  }
  function nN(n){
    if(currentLang==='en') return n.nameEn||n.name;
    if(currentLang==='es') return n.nameEs||n.name;
    return n.name;
  }
  function rN(n){
    if(currentLang==='en') return n.rnameEn||n.rname;
    if(currentLang==='es') return n.rnameEs||n.rname;
    return n.rname;
  }
  const REST_SYM={whole:'𝄻',half:'𝄼',quarter:'𝄽',eighth:'𝄾',sixteenth:'𝄿',thirtysecond:'𝅀'};
  const HALVES={whole:'half',half:'quarter',quarter:'eighth',eighth:'sixteenth',sixteenth:'thirtysecond',thirtysecond:'sixtyfourth'};

  // Tuplets
  const TUPLETS=[
    {n:2,name:'Duolet',nameEn:'Duplet',nameEs:'Dosillo',replaces:3,desc:'2 au lieu de 3 (mesure composée)',descEn:'2 instead of 3 (compound meter)',descEs:'2 en lugar de 3 (compás compuesto)'},
    {n:3,name:'Triolet',nameEn:'Triplet',nameEs:'Tresillo',replaces:2,desc:'3 au lieu de 2',descEn:'3 instead of 2',descEs:'3 en lugar de 2'},
    {n:4,name:'Quartolet',nameEn:'Quadruplet',nameEs:'Cuatrillo',replaces:3,desc:'4 au lieu de 3',descEn:'4 instead of 3',descEs:'4 en lugar de 3'},
    {n:5,name:'Quintolet',nameEn:'Quintuplet',nameEs:'Quintillo',replaces:4,desc:'5 au lieu de 4',descEn:'5 instead of 4',descEs:'5 en lugar de 4'},
    {n:6,name:'Sextolet',nameEn:'Sextuplet',nameEs:'Seisillo',replaces:4,desc:'6 au lieu de 4',descEn:'6 instead of 4',descEs:'6 en lugar de 4'},
    {n:7,name:'Septolet',nameEn:'Septuplet',nameEs:'Septillo',replaces:4,desc:'7 au lieu de 4',descEn:'7 instead of 4',descEs:'7 en lugar de 4'},
    {n:9,name:'Nonolet',nameEn:'Nonuplet',nameEs:'Novenillo',replaces:8,desc:'9 au lieu de 8',descEn:'9 instead of 8',descEs:'9 en lugar de 8'},
  ];
  function tupN(t){
    if(currentLang==='en') return t.nameEn||t.name;
    if(currentLang==='es') return t.nameEs||t.name;
    return t.name;
  }
  function tupD(t){
    if(currentLang==='en') return t.descEn||t.desc;
    if(currentLang==='es') return t.descEs||t.desc;
    return t.desc;
  }

  let selNote=2, selTup=1; // default: Noire, Triolet

  function renderNoteSel(){
    document.getElementById('noteSelRow').innerHTML=NOTES.map((n,i)=>
      `<button class="note-sel-btn${i===selNote?' on':''}" onclick="DIV.selNote(${i})"><span class="ns-sym">${n.sym}<span class="ns-rest-sym">${n.rest}</span></span><span class="ns-name">${nN(n)}</span><span class="ns-rest">${rN(n)}</span></button>`
    ).join('');
  }

  function renderEq(){
    const n=NOTES[selNote];
    const divNote=n.div;
    const subDiv=HALVES[divNote];

    let h='<table class="eq-table">';
    h+=`<tr><th></th><th>${tx('Figure de note','Note figure','Figura de nota')}</th><th>${tx('Silence équivalent','Equivalent rest','Silencio equivalente')}</th></tr>`;

    // Unit row
    h+=`<tr><td>${tx('Unité [1]','Unit [1]','Unidad [1]')}</td><td><span class="eq-sym accent">${n.sym}</span><div class="eq-lbl">${nN(n)}</div></td><td><span class="eq-rest">${n.rest}</span><div class="eq-lbl">${rN(n)}</div></td></tr>`;

    // Division naturelle (÷2)
    if(divNote && NOTE_SYM[divNote]){
      const dn=NOTES.find(x=>x.id===divNote);
      h+=`<tr><td>Division [½ + ½]</td><td><span class="eq-sym">${NOTE_SYM[divNote]} ${NOTE_SYM[divNote]}</span><div class="eq-lbl">2 × ${nnT(divNote)}</div></td>`;
      h+=`<td><span class="eq-rest">${REST_SYM[divNote]||''} ${REST_SYM[divNote]||''}</span><div class="eq-lbl">2 × ${dn?rN(dn):''}</div></td></tr>`;
    }

    // Subdivision (÷4)
    if(subDiv && NOTE_SYM[subDiv]){
      const sn=NOTES.find(x=>x.id===subDiv);
      h+=`<tr><td>Subdivision [¼ × 4]</td><td><span class="eq-sym">${NOTE_SYM[subDiv]} ${NOTE_SYM[subDiv]} ${NOTE_SYM[subDiv]} ${NOTE_SYM[subDiv]}</span><div class="eq-lbl">4 × ${nnT(subDiv)}</div></td>`;
      h+=`<td><span class="eq-rest">${REST_SYM[subDiv]||''} ${REST_SYM[subDiv]||''} ${REST_SYM[subDiv]||''} ${REST_SYM[subDiv]||''}</span><div class="eq-lbl">4 × ${sn?rN(sn):''}</div></td></tr>`;
    }

    // Dotted note equivalence
    if(divNote && NOTE_SYM[divNote]){
      const dn=NOTES.find(x=>x.id===divNote);
      h+=`<tr><td>${tx('Note pointée','Dotted note','Nota con puntillo')}</td><td><span class="eq-sym accent">${n.sym}·</span> = <span class="eq-sym">${NOTE_SYM[divNote]} ${NOTE_SYM[divNote]} ${NOTE_SYM[divNote]}</span><div class="eq-lbl">${nN(n)} ${tx('pointée','dotted','con puntillo')} = 3 × ${nnT(divNote)}</div></td><td><span class="eq-rest">${n.rest}·</span><div class="eq-lbl">${rN(n)} ${tx('pointé(e)','dotted','con puntillo')}</div></td></tr>`;
    }

    // Dotted division: dotted note = 2 × dotted subdivisions (compound meter division)
    if(divNote && NOTE_SYM[divNote]){
      h+=`<tr><td>${tx('Div. pointée [½ + ½]','Dotted div. [½ + ½]','Div. con puntillo [½ + ½]')}</td><td><span class="eq-sym accent">${n.sym}·</span> = <span class="eq-sym">${NOTE_SYM[divNote]}· ${NOTE_SYM[divNote]}·</span><div class="eq-lbl">${nN(n)} ${tx('pointée','dotted','con puntillo')} = 2 × ${nnT(divNote)} ${tx('pointée','dotted','con puntillo')}</div></td><td><span class="eq-rest">${REST_SYM[divNote]||''}· ${REST_SYM[divNote]||''}·</span><div class="eq-lbl">2 × ${NOTES.find(x=>x.id===divNote)?rN(NOTES.find(x=>x.id===divNote)):''} ${tx('pointé(e)','dotted','con puntillo')}</div></td></tr>`;
    }

    h+='</table>';
    document.getElementById('eqContent').innerHTML=h;
  }

  function renderTupTabs(){
    document.getElementById('tupTabs').innerHTML=TUPLETS.map((t,i)=>
      `<button class="tup-tab${i===selTup?' on':''}" onclick="DIV.selTup(${i})">${tupN(t)} (${t.n})</button>`
    ).join('');
  }

  function renderTupContent(){
    const n=NOTES[selNote];
    const tup=TUPLETS[selTup];
    const divNote=n.div;
    if(!divNote||!NOTE_SYM[divNote]){document.getElementById('tupContent').innerHTML='<div style="color:#9ca3af;font-size:12px;text-align:center;padding:12px">'+(tx('Pas de subdivision disponible pour cette figure','No subdivision available for this note figure','Sin subdivisión disponible para esta figura'))+'</div>';return;}
    const tupNote=divNote;

    let h='';

    // Equivalence row (compact)
    h+='<div class="tup-grid">';
    h+=`<div class="tup-cell"><div class="tup-cell-t">${tx('Unité [1]','Unit [1]','Unidad [1]')}</div><div style="font-size:22px;color:#111827;padding:4px 0">${n.sym}</div><div class="tup-eq">${nN(n)}</div></div>`;
    h+=`<div class="tup-cell"><div class="tup-cell-t">Division [½ + ½]</div><div style="font-size:22px;color:#111827;letter-spacing:6px;padding:4px 0">${NOTE_SYM[divNote]} ${NOTE_SYM[divNote]}</div><div class="tup-eq">2 × ${nnT(divNote)}</div></div>`;
    const tupNotes=Array(tup.n).fill(NOTE_SYM[tupNote]).join(' ');
    h+=`<div class="tup-cell" style="border-color:#534AB7;background:#faf8ff"><div class="tup-cell-t" style="color:#534AB7">${tupN(tup).toUpperCase()} [${tupD(tup)}]</div>${mkBracket(tup.n, tupNotes)}<div class="tup-eq">${tup.n} × ${nnT(tupNote)}</div></div>`;
    h+='</div>';

    // Variants
    h+=`<div class="tup-var-title">${currentLang==='en'?'Content variants of the '+tupN(tup).toLowerCase():currentLang==='es'?'Variantes de contenido del '+tupN(tup).toLowerCase():'Variantes de contenu du '+tupN(tup).toLowerCase()}</div>`;
    h+='<div class="tup-var-grid">';
    const variants=getTupVariants(tup.n, tupNote, divNote);
    variants.forEach(v=>{
      h+=`<div class="tup-var">${mkBracket(tup.n, v.display)}<div class="tup-var-desc">${v.desc}</div></div>`;
    });
    h+='</div>';
    document.getElementById('tupContent').innerHTML=h;
  }

  function mkBracket(n, content){
    return `<div class="tup-bracket">
      <svg viewBox="0 0 100 10" preserveAspectRatio="none">
        <path d="M2,9 Q2,1 50,1 Q98,1 98,9" fill="none" stroke="#534AB7" stroke-width="1.5" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
      </svg>
      <div class="tup-num">${n}</div>
      <div class="tup-syms">${content}</div>
    </div>`;
  }

  function getTupVariants(n, tupNote, divNote){
    const s=NOTE_SYM[tupNote]||'●';
    const r=REST_SYM[tupNote]||'𝄽';
    const ds=NOTE_SYM[HALVES[tupNote]]||'';
    const lg=NOTE_SYM[divNote]||s;
    const dr=REST_SYM[divNote]||'';
    const v=[];
    /* vd: bilingual variant description (uses EN for ES as fallback) */
    function vd(fr,en,es){
      if(currentLang==='en') return en;
      if(currentLang==='es') return (es!==undefined?es:fr);
      return fr;
    }

    if(n===2){
      v.push({display:`${s} ${s}`, desc:vd('2 notes égales','2 equal notes','2 notas iguales')});
      v.push({display:`${s} ${r}`, desc:vd('Note + silence','Note + rest','Nota + silencio')});
      v.push({display:`${r} ${s}`, desc:vd('Silence + note','Rest + note','Silencio + nota')});
      v.push({display:`${s}<span class="dot">·</span> ${ds}`, desc:vd('Pointée + sub.','Dotted + sub.','Puntillo + sub.')});
      v.push({display:`${ds} ${s}<span class="dot">·</span>`, desc:vd('Sub. + pointée','Sub. + dotted','Sub. + puntillo')});
      v.push({display:`<span class="long">${lg}</span>`, desc:vd('Note liée (valeur totale)','Tied note (total value)','Nota ligada (valor total)')});
    } else if(n===3){
      v.push({display:`${s} ${s} ${s}`, desc:vd('3 notes égales','3 equal notes','3 notas iguales')});
      v.push({display:`${s} ${r} ${s}`, desc:vd('Note · silence · note','Note · rest · note','Nota · silencio · nota')});
      v.push({display:`${r} ${s} ${s}`, desc:vd('Silence + 2 notes','Rest + 2 notes','Silencio + 2 notas')});
      v.push({display:`${s} ${s} ${r}`, desc:vd('2 notes + silence','2 notes + rest','2 notas + silencio')});
      v.push({display:`${r} ${r} ${s}`, desc:vd('2 silences + note','2 rests + note','2 silencios + nota')});
      v.push({display:`${r} ${s} ${r}`, desc:vd('Silence · note · silence','Rest · note · rest','Silencio · nota · silencio')});
      v.push({display:`<span class="long">${lg}</span> ${s}`, desc:vd('Longue + courte','Long + short','Larga + corta')});
      v.push({display:`${s} <span class="long">${lg}</span>`, desc:vd('Courte + longue','Short + long','Corta + larga')});
      v.push({display:`${s}<span class="dot">·</span> ${ds}`, desc:vd('Pointée + sub.','Dotted + sub.','Puntillo + sub.')});
      v.push({display:`${ds} ${s}<span class="dot">·</span>`, desc:vd('Sub. + pointée','Sub. + dotted','Sub. + puntillo')});
      v.push({display:`${ds}${ds} ${s} ${s}`, desc:vd('2 sub. + 2 notes','2 sub. + 2 notes','2 sub. + 2 notas')});
      v.push({display:`${s} ${ds}${ds} ${s}`, desc:vd('Note + 2 sub. + note','Note + 2 sub. + note','Nota + 2 sub. + nota')});
      v.push({display:`${s} ${s} ${ds}${ds}`, desc:vd('2 notes + 2 sub.','2 notes + 2 sub.','2 notas + 2 sub.')});
      v.push({display:`<span class="rest">${dr}</span> ${s}`, desc:vd('Silence long + courte','Long rest + short','Silencio largo + corta')});
      v.push({display:`${s} <span class="rest">${dr}</span>`, desc:vd('Courte + silence long','Short + long rest','Corta + silencio largo')});
    } else if(n===4){
      v.push({display:`${s} ${s} ${s} ${s}`, desc:vd('4 notes égales','4 equal notes','4 notas iguales')});
      v.push({display:`${s} ${r} ${s} ${s}`, desc:vd('Silence au 2e temps','Rest on 2nd beat','Silencio en el 2.º pulso')});
      v.push({display:`${r} ${s} ${s} ${s}`, desc:vd('Silence initial','Initial rest','Silencio inicial')});
      v.push({display:`${s} ${s} ${s} ${r}`, desc:vd('Silence final','Final rest','Silencio final')});
      v.push({display:`${s} ${r} ${r} ${s}`, desc:vd('2 silences centraux','2 central rests','2 silencios centrales')});
      v.push({display:`<span class="long">${lg}</span> ${s} ${s}`, desc:vd('Longue + 2 courtes','Long + 2 shorts','Larga + 2 cortas')});
      v.push({display:`${s} ${s} <span class="long">${lg}</span>`, desc:vd('2 courtes + longue','2 shorts + long','2 cortas + larga')});
      v.push({display:`${s} <span class="long">${lg}</span> ${s}`, desc:vd('Courte · longue · courte','Short · long · short','Corta · larga · corta')});
      v.push({display:`<span class="long">${lg}</span> <span class="long">${lg}</span>`, desc:vd('2 longues','2 longs','2 largas')});
      v.push({display:`${s}<span class="dot">·</span> ${ds} ${s} ${s}`, desc:vd('Pointée + 3 notes','Dotted + 3 notes','Puntillo + 3 notas')});
    } else if(n===5){
      v.push({display:`${s} ${s} ${s} ${s} ${s}`, desc:vd('5 notes égales','5 equal notes','5 notas iguales')});
      v.push({display:`${r} ${s} ${s} ${s} ${s}`, desc:vd('Silence initial','Initial rest','Silencio inicial')});
      v.push({display:`${s} ${s} ${s} ${s} ${r}`, desc:vd('Silence final','Final rest','Silencio final')});
      v.push({display:`${s} ${r} ${s} ${s} ${s}`, desc:vd('Silence au 2e','Rest on 2nd','Silencio en el 2.º')});
      v.push({display:`<span class="long">${lg}</span> ${s} ${s} ${s}`, desc:vd('Longue + 3 courtes','Long + 3 shorts','Larga + 3 cortas')});
      v.push({display:`${s} ${s} ${s} <span class="long">${lg}</span>`, desc:vd('3 courtes + longue','3 shorts + long','3 cortas + larga')});
      v.push({display:`<span class="long">${lg}</span> <span class="long">${lg}</span> ${s}`, desc:vd('2 longues + courte','2 longs + short','2 largas + corta')});
      v.push({display:`${s}<span class="dot">·</span> ${ds} ${s} ${s} ${s}`, desc:vd('Pointée + sub. + 3','Dotted + sub. + 3','Puntillo + sub. + 3')});
    } else if(n===6){
      v.push({display:`${s} ${s} ${s} ${s} ${s} ${s}`, desc:vd('6 notes égales','6 equal notes','6 notas iguales')});
      v.push({display:`${r} ${s} ${s} ${s} ${s} ${s}`, desc:vd('Silence initial','Initial rest','Silencio inicial')});
      v.push({display:`${s} ${s} ${s} ${s} ${s} ${r}`, desc:vd('Silence final','Final rest','Silencio final')});
      v.push({display:`<span class="long">${lg}</span> ${s} <span class="long">${lg}</span> ${s}`, desc:vd('Alternance long/court','Long/short alternation','Alternancia largo/corto')});
      v.push({display:`<span class="long">${lg}</span> <span class="long">${lg}</span> <span class="long">${lg}</span>`, desc:vd('3 longues','3 longs','3 largas')});
      v.push({display:`${s}<span class="dot">·</span> ${ds} ${s}<span class="dot">·</span> ${ds} ${s} ${s}`, desc:vd('2 pointées + 2','2 dotted + 2','2 con puntillo + 2')});
      v.push({display:`<span class="long">${lg}</span> ${s} ${s} ${s} ${s}`, desc:vd('Longue + 4 courtes','Long + 4 shorts','Larga + 4 cortas')});
      v.push({display:`${s} ${r} ${s} ${s} ${r} ${s}`, desc:vd('Silences alternés','Alternating rests','Silencios alternados')});
    } else if(n===7){
      v.push({display:`${s} ${s} ${s} ${s} ${s} ${s} ${s}`, desc:vd('7 notes égales','7 equal notes','7 notas iguales')});
      v.push({display:`${r} ${s} ${s} ${s} ${s} ${s} ${s}`, desc:vd('Silence initial','Initial rest','Silencio inicial')});
      v.push({display:`<span class="long">${lg}</span> ${s} ${s} ${s} ${s} ${s}`, desc:vd('Longue + 5 courtes','Long + 5 shorts','Larga + 5 cortas')});
      v.push({display:`${s} ${s} ${s} <span class="long">${lg}</span> ${s} ${s}`, desc:vd('Longue centrale','Central long','Larga central')});
      v.push({display:`<span class="long">${lg}</span> <span class="long">${lg}</span> ${s} ${s} ${s}`, desc:vd('2 longues + 3 courtes','2 longs + 3 shorts','2 largas + 3 cortas')});
      v.push({display:`${s} ${s} ${s} ${s} ${s} ${s} ${r}`, desc:vd('Silence final','Final rest','Silencio final')});
    } else if(n===9){
      v.push({display:`${s} ${s} ${s} ${s} ${s} ${s} ${s} ${s} ${s}`, desc:vd('9 notes égales','9 equal notes','9 notas iguales')});
      v.push({display:`${r} ${s} ${s} ${s} ${s} ${s} ${s} ${s} ${s}`, desc:vd('Silence initial','Initial rest','Silencio inicial')});
      v.push({display:`<span class="long">${lg}</span> ${s} <span class="long">${lg}</span> ${s} <span class="long">${lg}</span> ${s} ${s}`, desc:vd('Longues alternées','Alternating longs','Largas alternadas')});
      v.push({display:`${s} ${s} ${s} ${r} ${r} ${r} ${s} ${s} ${s}`, desc:vd('3 · 3 silences · 3','3 · 3 rests · 3','3 · 3 silencios · 3')});
      v.push({display:`<span class="long">${lg}</span> <span class="long">${lg}</span> <span class="long">${lg}</span> ${s} ${s} ${s}`, desc:vd('3 longues + 3 courtes','3 longs + 3 shorts','3 largas + 3 cortas')});
    }

    if(v.length===0) v.push({display:Array(n).fill(s).join(' '), desc:vd(`${n} notes égales`,`${n} equal notes`,`${n} notas iguales`)});
    return v;
  }

  function render(){renderNoteSel();renderEq();renderTupTabs();renderTupContent();}

  return{
    selNote(i){selNote=i;render();},
    selTup(i){selTup=i;renderTupTabs();renderTupContent();},
    init(){render();}
  };
})();

/* ── Init ── */

/* ── Init auto ── */
try{TR.init()}catch(e){console.error('TR:',e)}
try{DIV.init()}catch(e){console.error('DIV:',e)}
