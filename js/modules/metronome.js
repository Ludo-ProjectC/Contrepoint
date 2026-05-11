/* ═══════════════════════════════════════════════════════════════════
   metronome.js — Module metronome
   Chargé dynamiquement par main.js lors du premier accès à l'onglet.
   Toutes les fonctions/variables avec préfixe majuscule (T1, MOD, etc.)
   sont exposées sur window pour rétro-compat avec onclick="..."
   ═══════════════════════════════════════════════════════════════════ */
/* ═══ MÉTRONOME ═══ */
const M=(function(){

const TEMPOS=[
  {name:'Larghissimo',desc:'Très, très lent',descEn:'Very, very slow',min:20,max:24},
  {name:'Grave',desc:'Très lent, solennel',descEn:'Very slow, solemn',min:25,max:45},
  {name:'Largo',desc:'Large, ample',descEn:'Broad, expansive',min:40,max:60},
  {name:'Lento',desc:'Lent',descEn:'Slow',min:45,max:60},
  {name:'Larghetto',desc:'Assez large',descEn:'Rather broad',min:60,max:66},
  {name:'Sostenuto',desc:'Soutenu',descEn:'Sustained',min:60,max:66},
  {name:'Adagio',desc:'Lent et majestueux',descEn:'Slow and stately',min:66,max:76},
  {name:'Adagietto',desc:'Un peu moins lent qu\'adagio',descEn:'Slightly faster than adagio',min:72,max:76},
  {name:'Andante',desc:'Allure de marche',descEn:'Walking pace',min:76,max:108},
  {name:'Andantino',desc:'Un peu plus vite qu\'andante',descEn:'Slightly faster than andante',min:80,max:108},
  {name:'Maestoso',desc:'Majestueux, noble',descEn:'Majestic, noble',min:80,max:92},
  {name:'Comodo',desc:'Confortable, sans hâte',descEn:'Comfortable, unhurried',min:76,max:100},
  {name:'Marcia moderato',desc:'Modéré, style marche',descEn:'Moderate, march-like',min:83,max:85},
  {name:'Tempo di Valse',desc:'Tempo de valse',descEn:'Waltz tempo',min:84,max:96},
  {name:'Andante moderato',desc:'Entre andante et moderato',descEn:'Between andante and moderato',min:92,max:112},
  {name:'Tempo di Marcia',desc:'Tempo de marche',descEn:'March tempo',min:100,max:120},
  {name:'Tempo di Minuetto',desc:'Tempo de menuet',descEn:'Minuet tempo',min:100,max:120},
  {name:'Moderato',desc:'Modéré',descEn:'Moderate',min:108,max:120},
  {name:'Allegretto',desc:'Modérément rapide',descEn:'Moderately fast',min:112,max:120},
  {name:'Allegro moderato',desc:'Presque allegro',descEn:'Almost allegro',min:116,max:120},
  {name:'Allegro',desc:'Rapide, vif et brillant',descEn:'Fast, lively and bright',min:120,max:168},
  {name:'Allegro con brio',desc:'Rapide avec éclat',descEn:'Fast with brilliance',min:120,max:168},
  {name:'Allegro con fuoco',desc:'Rapide avec feu',descEn:'Fast with fire',min:132,max:168},
  {name:'Allegro vivace',desc:'Rapide et vif',descEn:'Fast and lively',min:144,max:176},
  {name:'Vivace',desc:'Vif et rapide',descEn:'Lively and fast',min:168,max:176},
  {name:'Vivacissimo',desc:'Très vif',descEn:'Very lively',min:172,max:176},
  {name:'Allegrissimo',desc:'Très rapide',descEn:'Very fast',min:172,max:176},
  {name:'Presto',desc:'Très, très rapide',descEn:'Very, very fast',min:168,max:200},
  {name:'Prestissimo',desc:'Aussi vite que possible',descEn:'As fast as possible',min:200,max:300},
];

const NV=[
  {id:'whole',label:'Ronde',labelEn:'Whole',labelEs:'Redonda',mult:4,sym:'𝅝'},
  {id:'half',label:'Blanche',labelEn:'Half',labelEs:'Blanca',mult:2,sym:'𝅗𝅥'},
  {id:'quarter',label:'Noire',labelEn:'Quarter',labelEs:'Negra',mult:1,sym:'♩'},
  {id:'eighth',label:'Croche',labelEn:'Eighth',labelEs:'Corchea',mult:0.5,sym:'♪'},
  {id:'16th',label:'Dble croche',labelEn:'16th',labelEs:'Semicorchea',mult:0.25,sym:'𝅘𝅥𝅯'},
];
const SUBS=[
  {id:'none',label:'Aucune',labelEn:'None',labelEs:'Ninguna',div:1},
  {id:'dup',label:'Duolet',labelEn:'Duplet',labelEs:'Dosillo',div:2},
  {id:'tri',label:'Triolet',labelEn:'Triplet',labelEs:'Tresillo',div:3},
  {id:'quad',label:'Quartolet',labelEn:'Quadruplet',labelEs:'Cuatrillo',div:4},
  {id:'quin',label:'Quintolet',labelEn:'Quintuplet',labelEs:'Quintillo',div:5},
  {id:'sept',label:'Septolet',labelEn:'Septuplet',labelEs:'Septillo',div:7},
];
const ASYM={
  5:[[3,2],[2,3]],
  7:[[2,2,3],[3,2,2],[2,3,2]],
  8:[[3,3,2],[3,2,3],[2,3,3]],
  9:[[2,2,2,3],[3,3,3],[3,2,2,2]],
  10:[[3,3,2,2],[2,3,2,3]],
  11:[[3,3,3,2],[2,3,3,3],[3,2,3,3]],
  12:[[3,3,3,3],[2,2,2,3,3]],
  13:[[3,3,3,2,2],[2,3,3,3,2]],
};

let bpm=120,tsNum=4,tsDen=4,noteIdx=2,subIdx=0,swing=0;
let accents=[],grp=null;
let polyOn=false,polyA=4,polyB=3;
let playing=false,audioCtx=null,timerID=null;
let nextTime=0,beatIdx=-1;
let nextTimePoly=0,beatIdxPoly=-1;
let ringBeats=[],ringBeatsPoly=[];
const schedAhead=0.12,lookMs=20;
let tapTimes=[];
let snd={t1:'click',v1:0.8,p1:0,t2:'wood',v2:0.65,p2:0.4,vSub:0.35};
let ringRAF=null;

function ctx(){
  if(!audioCtx) audioCtx=new(window.AudioContext||window.webkitAudioContext)();
  if(audioCtx.state==='suspended') audioCtx.resume();
  return audioCtx;
}

function synth(time,timbre,vol,pan,isAccent,isSub){
  const c=ctx(),v=vol*(isAccent?1:isSub?0.5:0.7);
  const g=c.createGain(),p=c.createStereoPanner();
  p.pan.value=pan;g.connect(p);p.connect(c.destination);

  if(timbre==='click'){
    const o=c.createOscillator();o.type='triangle';
    o.frequency.value=isAccent?1200:isSub?600:800;
    g.gain.setValueAtTime(v,time);g.gain.exponentialRampToValueAtTime(0.001,time+0.05);
    o.connect(g);o.start(time);o.stop(time+0.06);
  } else if(timbre==='wood'){
    const o=c.createOscillator();o.type='sine';
    o.frequency.value=isAccent?900:isSub?500:700;
    o.frequency.exponentialRampToValueAtTime(200,time+0.04);
    const bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1200;bp.Q.value=3;
    g.gain.setValueAtTime(v*0.9,time);g.gain.exponentialRampToValueAtTime(0.001,time+0.06);
    o.connect(bp);bp.connect(g);o.start(time);o.stop(time+0.07);
  } else if(timbre==='beep'){
    const o=c.createOscillator();o.type='sine';
    o.frequency.value=isAccent?1500:isSub?700:1000;
    g.gain.setValueAtTime(v*0.6,time);g.gain.exponentialRampToValueAtTime(0.001,time+0.08);
    o.connect(g);o.start(time);o.stop(time+0.09);
  } else if(timbre==='hihat'){
    const len=Math.floor(c.sampleRate*0.04),buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0);
    for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.exp(-i/(len*0.12));
    const s=c.createBufferSource();s.buffer=buf;
    const hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=isAccent?7000:isSub?9000:8000;
    g.gain.setValueAtTime(v*0.7,time);g.gain.exponentialRampToValueAtTime(0.001,time+0.05);
    s.connect(hp);hp.connect(g);s.start(time);
  } else if(timbre==='rim'){
    const o=c.createOscillator();o.type='triangle';
    o.frequency.value=isAccent?1800:isSub?1000:1400;
    o.frequency.exponentialRampToValueAtTime(300,time+0.015);
    g.gain.setValueAtTime(v*0.8,time);g.gain.exponentialRampToValueAtTime(0.001,time+0.04);
    o.connect(g);o.start(time);o.stop(time+0.05);
    const len=Math.floor(c.sampleRate*0.015),buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0);
    for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.exp(-i/(len*0.05));
    const s=c.createBufferSource();s.buffer=buf;
    const g2=c.createGain();g2.gain.setValueAtTime(v*0.3,time);g2.gain.exponentialRampToValueAtTime(0.001,time+0.02);
    s.connect(g2);g2.connect(p);s.start(time);
  }
}

function beatInterval(){return(60/bpm)*NV[noteIdx].mult;}

function swingOffset(subI){
  if(swing===0||SUBS[subIdx].div===1)return 0;
  if(SUBS[subIdx].div%2!==0)return 0;
  if(subI%2===1)return(swing/100)*(beatInterval()/SUBS[subIdx].div);
  return 0;
}

function scheduler(){
  const c=ctx();
  while(nextTime<c.currentTime+schedAhead){
    beatIdx=(beatIdx+1)%tsNum;
    const isAcc=accents[beatIdx],bi=beatIdx,bt=nextTime;
    synth(bt,snd.t1,snd.v1,snd.p1,isAcc,false);
    const subDiv=SUBS[subIdx].div;
    if(subDiv>1){
      const subInt=beatInterval()/subDiv;
      for(let s=1;s<subDiv;s++) synth(bt+s*subInt+swingOffset(s),snd.t1,snd.vSub,snd.p1,false,true);
    }
    const delay=(bt-c.currentTime)*1000;
    setTimeout(()=>{ringBeats.push({idx:bi,t:performance.now(),acc:isAcc});},Math.max(0,delay));
    nextTime+=beatInterval();
  }
  if(polyOn){
    const cycleDur=beatInterval()*polyA,polyInt=cycleDur/polyB;
    while(nextTimePoly<c.currentTime+schedAhead){
      beatIdxPoly=(beatIdxPoly+1)%polyB;
      const bip=beatIdxPoly,btp=nextTimePoly;
      synth(btp,snd.t2,snd.v2,snd.p2,bip===0,false);
      const delay=(btp-c.currentTime)*1000;
      setTimeout(()=>{ringBeatsPoly.push({idx:bip,t:performance.now(),acc:bip===0});},Math.max(0,delay));
      nextTimePoly+=polyInt;
    }
  }
  timerID=setTimeout(scheduler,lookMs);
}

function start(){
  const c=ctx();playing=true;beatIdx=-1;beatIdxPoly=-1;
  nextTime=c.currentTime+0.05;nextTimePoly=c.currentTime+0.05;
  ringBeats=[];ringBeatsPoly=[];
  scheduler();updatePlayBtn();startRing();
}
function stop(){
  playing=false;clearTimeout(timerID);timerID=null;
  beatIdx=-1;beatIdxPoly=-1;updatePlayBtn();
}
function updatePlayBtn(){
  const b=document.getElementById('playBtn'),ic=document.getElementById('playIcon');
  b.classList.toggle('on',playing);
  ic.innerHTML=playing
    ?'<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>'
    :'<path d="M8 5v14l11-7z"/>';
}

/* ── Ring ── */
function startRing(){if(!ringRAF)drawRing();}
function drawRing(){
  const cv=document.getElementById('ringCanvas'),c=cv.getContext('2d');
  const W=cv.width,H=cv.height,cx=W/2,cy=H/2,R=W/2-30,r2=R-22;
  const now=performance.now();
  c.clearRect(0,0,W,H);

  // Outer ring
  c.beginPath();c.arc(cx,cy,R,0,Math.PI*2);c.strokeStyle='#d1cfe6';c.lineWidth=3;c.stroke();

  // Layer A markers
  for(let i=0;i<tsNum;i++){
    const a=-Math.PI/2+(i/tsNum)*Math.PI*2;
    const x=cx+Math.cos(a)*R,y=cy+Math.sin(a)*R;
    const isAcc=accents[i];
    const hit=ringBeats.find(b=>b.idx===i&&(now-b.t)<450);
    const sz=isAcc?9:6;
    if(hit){
      const p=1-(now-hit.t)/450;
      const ep=p<0.3?p/0.3:1; // quick attack
      const dp=p>0.3?(p-0.3)/0.7:0; // slow decay for glow
      // Outer expanding ring
      c.beginPath();c.arc(x,y,sz+18*p,0,Math.PI*2);
      c.strokeStyle=`rgba(83,74,183,${0.35*p})`;c.lineWidth=2*p;c.stroke();
      // Soft glow
      c.save();c.shadowColor='rgba(83,74,183,0.7)';c.shadowBlur=20*ep;
      // Scaled-up dot
      const hitSz=sz+4*ep;
      c.beginPath();c.arc(x,y,hitSz,0,Math.PI*2);
      c.fillStyle=`rgba(83,74,183,${0.6+0.4*ep})`;c.fill();
      c.restore();
      // Bright white core flash
      if(p>0.5){
        const fp=(p-0.5)/0.5;
        c.beginPath();c.arc(x,y,hitSz*0.5,0,Math.PI*2);
        c.fillStyle=`rgba(255,255,255,${0.7*fp})`;c.fill();
      }
    } else {
      c.beginPath();c.arc(x,y,sz,0,Math.PI*2);
      c.fillStyle=isAcc?'#b0aec4':'#d1cfe6';c.fill();
    }
  }

  // Layer B (poly)
  if(polyOn){
    c.beginPath();c.arc(cx,cy,r2,0,Math.PI*2);c.strokeStyle='#e5e0d0';c.lineWidth=1.5;c.stroke();
    for(let i=0;i<polyB;i++){
      const a=-Math.PI/2+(i/polyB)*Math.PI*2;
      const x=cx+Math.cos(a)*r2,y=cy+Math.sin(a)*r2;
      const hit=ringBeatsPoly.find(b=>b.idx===i&&(now-b.t)<450);
      if(hit){
        const p=1-(now-hit.t)/450;
        const ep=p<0.3?p/0.3:1;
        // Expanding ring
        c.beginPath();c.arc(x,y,5+14*p,0,Math.PI*2);
        c.strokeStyle=`rgba(217,119,6,${0.3*p})`;c.lineWidth=1.5*p;c.stroke();
        // Glow + scaled dot
        c.save();c.shadowColor='rgba(217,119,6,0.6)';c.shadowBlur=16*ep;
        const hitSz=5+3*ep;
        c.beginPath();c.arc(x,y,hitSz,0,Math.PI*2);
        c.fillStyle=`rgba(217,119,6,${0.6+0.4*ep})`;c.fill();
        c.restore();
        // White core
        if(p>0.5){
          const fp=(p-0.5)/0.5;
          c.beginPath();c.arc(x,y,hitSz*0.45,0,Math.PI*2);
          c.fillStyle=`rgba(255,255,255,${0.6*fp})`;c.fill();
        }
      } else {
        c.beginPath();c.arc(x,y,4,0,Math.PI*2);
        c.fillStyle='#e5d8c0';c.fill();
      }
    }
  }

  // Pendulum A
  if(playing&&ringBeats.length>0){
    const last=ringBeats[ringBeats.length-1];
    const elapsed=(now-last.t)/1000;
    const frac=(last.idx+Math.min(elapsed/beatInterval(),1))/tsNum;
    const a=-Math.PI/2+frac*Math.PI*2;
    const px=cx+Math.cos(a)*(R-16),py=cy+Math.sin(a)*(R-16);
    c.beginPath();c.moveTo(cx,cy);c.lineTo(px,py);
    c.strokeStyle='rgba(83,74,183,0.25)';c.lineWidth=2;c.stroke();
    c.beginPath();c.arc(px,py,6,0,Math.PI*2);
    c.fillStyle='#534AB7';c.fill();
    c.shadowColor='rgba(83,74,183,0.35)';c.shadowBlur=10;
    c.beginPath();c.arc(px,py,6,0,Math.PI*2);c.fill();
    c.shadowBlur=0;
  }

  // Pendulum B
  if(playing&&polyOn&&ringBeatsPoly.length>0){
    const last=ringBeatsPoly[ringBeatsPoly.length-1];
    const elapsed=(now-last.t)/1000;
    const cycleDur=beatInterval()*polyA,polyInt=cycleDur/polyB;
    const frac=(last.idx+Math.min(elapsed/polyInt,1))/polyB;
    const a=-Math.PI/2+frac*Math.PI*2;
    const px=cx+Math.cos(a)*(r2-12),py=cy+Math.sin(a)*(r2-12);
    c.beginPath();c.moveTo(cx,cy);c.lineTo(px,py);
    c.strokeStyle='rgba(217,119,6,0.2)';c.lineWidth=1.5;c.stroke();
    c.beginPath();c.arc(px,py,5,0,Math.PI*2);
    c.fillStyle='#d97706';c.fill();
  }

  while(ringBeats.length>0&&now-ringBeats[0].t>2000) ringBeats.shift();
  while(ringBeatsPoly.length>0&&now-ringBeatsPoly[0].t>2000) ringBeatsPoly.shift();

  if(playing) ringRAF=requestAnimationFrame(drawRing);
  else ringRAF=null;
}

/* ── UI ── */
function renderAccents(){
  document.getElementById('accRow').innerHTML=Array.from({length:tsNum},(_,i)=>
    `<button class="acc-btn${accents[i]?' on':''}" onclick="M.toggleAcc(${i})">${i+1}</button>`
  ).join('');
}
function renderGroupings(){
  const el=document.getElementById('grpZone'),presets=ASYM[tsNum];
  if(!presets){el.innerHTML='';grp=null;return;}
  const gs=grp?grp.join('+'):'';
  el.innerHTML='<div style="margin-top:8px;display:flex;align-items:center;gap:6px;flex-wrap:wrap"><span class="ts-lbl">'+t('lbl_grp')+'</span>'
    +presets.map(p=>{const s=p.join('+');return `<button class="grp-chip${s===gs?' on':''}" onclick="M.setGrp([${p}])">${s}</button>`;}).join('')
    +`<button class="grp-chip${!grp?' on':''}" onclick="M.setGrp(null)">${t('btn_regular')}</button></div>`;
}
function applyGroupAccents(){
  if(!grp){accents=Array.from({length:tsNum},(_,i)=>i===0);renderAccents();return;}
  accents=Array(tsNum).fill(false);
  let pos=0;for(const g of grp){if(pos<tsNum)accents[pos]=true;pos+=g;}
  renderAccents();
}
function renderNV(){
  document.getElementById('nvGrid').innerHTML=NV.map((n,i)=>
    `<button class="nv-btn${noteIdx===i?' on':''}" onclick="M.setNV(${i})"><span class="sym">${n.sym}</span><span class="lbl">${currentLang==='en'?(n.labelEn||n.label):currentLang==='es'?(n.labelEs||n.label):n.label}</span></button>`
  ).join('');
}
function renderSubs(){
  document.getElementById('subGrid').innerHTML=SUBS.map((s,i)=>
    `<button class="sub-btn${subIdx===i?' on':''}" onclick="M.setSub(${i})">${currentLang==='en'?(s.labelEn||s.label):currentLang==='es'?(s.labelEs||s.label):s.label}</button>`
  ).join('');
}
function updateBpm(){
  document.getElementById('bpmVal').textContent=bpm;
  document.getElementById('bpmSlider').value=bpm;
  // Sync tempo preset range slider if visible
  const row=document.getElementById('tempoRangeRow');
  if(!row.classList.contains('hidden')){
    const sl=document.getElementById('tempoRangeSlider');
    const mn=+sl.min,mx=+sl.max;
    sl.value=Math.max(mn,Math.min(mx,bpm));
  }
}
function panLabel(v){return v===0?'C':v<0?Math.abs(v)+'L':v+'R';}
function updateSndUI(){
  document.getElementById('sndVol1V').textContent=Math.round(snd.v1*100);
  document.getElementById('sndPan1V').textContent=panLabel(Math.round(snd.p1*100));
  document.getElementById('sndVol2V').textContent=Math.round(snd.v2*100);
  document.getElementById('sndPan2V').textContent=panLabel(Math.round(snd.p2*100));
  document.getElementById('sndVolSubV').textContent=Math.round(snd.vSub*100);
}
function render(){updateBpm();renderAccents();renderGroupings();renderNV();renderSubs();updateSndUI();if(!playing)drawRing();}

return{
  toggle(){if(playing)stop();else start();},
  setBpm(v){bpm=Math.max(20,Math.min(300,Math.round(v)));updateBpm();},
  nudge(d){this.setBpm(bpm+d);},
  tap(){
    const now=performance.now();tapTimes.push(now);
    tapTimes=tapTimes.filter(t=>now-t<3000);
    if(tapTimes.length>=2){
      const ivs=[];for(let i=1;i<tapTimes.length;i++)ivs.push(tapTimes[i]-tapTimes[i-1]);
      this.setBpm(Math.round(60000/(ivs.reduce((a,b)=>a+b,0)/ivs.length)));
    }
  },
  setTs(){
    tsNum=+document.getElementById('tsNum').value;
    tsDen=+document.getElementById('tsDen').value;
    accents=Array.from({length:tsNum},(_,i)=>i===0);grp=null;render();
  },
  toggleAcc(i){accents[i]=!accents[i];renderAccents();if(!playing)drawRing();},
  setGrp(g){grp=g;applyGroupAccents();renderGroupings();if(!playing)drawRing();},
  setNV(i){noteIdx=i;renderNV();},
  setSub(i){subIdx=i;renderSubs();},
  setSwing(v){swing=v;document.getElementById('swingVal').textContent=v+'%';},
  togglePoly(){
    polyOn=document.getElementById('polyOn').checked;
    document.getElementById('polyCtrl').classList.toggle('show',polyOn);
    document.getElementById('sndLayer2').style.display=polyOn?'block':'none';
    if(!playing)drawRing();
  },
  updatePoly(){
    polyA=Math.max(2,Math.min(16,+document.getElementById('polyA').value));
    polyB=Math.max(2,Math.min(16,+document.getElementById('polyB').value));
    if(!playing)drawRing();
  },
  updateSnd(){
    snd.t1=document.getElementById('sndTimbre1').value;
    snd.v1=+document.getElementById('sndVol1').value/100;
    snd.p1=+document.getElementById('sndPan1').value/100;
    snd.t2=document.getElementById('sndTimbre2').value;
    snd.v2=+document.getElementById('sndVol2').value/100;
    snd.p2=+document.getElementById('sndPan2').value/100;
    snd.vSub=+document.getElementById('sndVolSub').value/100;
    updateSndUI();
  },
  toggleCard(id,e){
    if(e&&(e.target.closest('.card-body')||e.target.tagName==='INPUT'||e.target.tagName==='SELECT'))return;
    document.getElementById(id).classList.toggle('open');
  },
  setPreset(idx){
    const t=TEMPOS[idx];if(!t)return;
    const mid=Math.round((t.min+t.max)/2);
    this.setBpm(mid);
    document.getElementById('tempoInput').value=`${t.name} (${t.min}–${t.max})`;
    document.getElementById('tempoRangeRow').classList.remove('hidden');
    document.getElementById('tempoRangeName').textContent=t.name;
    document.getElementById('tempoRangeMin').textContent=t.min;
    document.getElementById('tempoRangeMax').textContent=t.max;
    const sl=document.getElementById('tempoRangeSlider');
    sl.min=t.min;sl.max=t.max;sl.value=mid;
    this.closeTempoList();
  },
  slidePreset(v){
    this.setBpm(v);
  },
  openTempoList(){
    this.filterTempos(document.getElementById('tempoInput').value);
    document.getElementById('tempoDropdown').classList.add('open');
  },
  closeTempoList(){
    setTimeout(()=>document.getElementById('tempoDropdown').classList.remove('open'),150);
  },
  filterTempos(q){
    const dd=document.getElementById('tempoDropdown');
    const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    const query=norm(q);
    const filtered=TEMPOS.map((t,i)=>({...t,i})).filter(t=>{
      if(!query)return true;
      return norm(t.name).includes(query)||norm(t.desc).includes(query)||(t.descEn&&norm(t.descEn).includes(query));
    });
    dd.innerHTML=filtered.length?filtered.map(t=>{
      const desc=currentLang==='en'?(t.descEn||t.desc):t.desc;
      return `<div class="tempo-opt" onmousedown="M.setPreset(${t.i})">` +
      `<span class="tempo-opt-name">${t.name}</span>` +
      `<span class="tempo-opt-desc">${desc}</span>` +
      `<span class="tempo-opt-bpm">${t.min}–${t.max}</span></div>`;
    }).join(''):'<div style="padding:12px;text-align:center;font-size:11px;color:var(--dim)">'+t('lbl_no_res')+'</div>';
    dd.classList.add('open');
  },
  initPresets(){
    document.getElementById('tempoInput').addEventListener('blur',()=>this.closeTempoList());
  },
  init(){accents=Array.from({length:tsNum},(_,i)=>i===0);this.initPresets();render();}
};
})();

/* ── Init auto ── */
try{M.init()}catch(e){console.error('M:',e)}
