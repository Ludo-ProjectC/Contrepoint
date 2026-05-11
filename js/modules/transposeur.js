/* ═══════════════════════════════════════════════════════════════════
   transposeur.js — Module transposeur
   Chargé dynamiquement par main.js lors du premier accès à l'onglet.
   Toutes les fonctions/variables avec préfixe majuscule (T1, MOD, etc.)
   sont exposées sur window pour rétro-compat avec onclick="..."
   ═══════════════════════════════════════════════════════════════════ */
/* ═══ TRANSPOSEUR ═══ */
/* ══════════════════════════════════════
   Transposeur d'instruments
   ══════════════════════════════════════ */
const T1=(function(){
  const SH=['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
  const FL=['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'];

  const INSTR=[
    {n:'Piccolo (en Ré♭)',c:'Bois',g:'flûtes',o:13,i:'9e mineure ascendante',r:[74,108]},
    {n:'Flûte alto (en Sol)',c:'Bois',g:'flûtes',o:-5,i:'4e juste descendante',r:[60,96]},
    {n:"Hautbois d'amour (en La)",c:'Bois',g:'hautbois',o:-3,i:'3e mineure descendante',r:[58,90]},
    {n:'Cor anglais (en Fa)',c:'Bois',g:'hautbois',o:-7,i:'5e juste descendante',r:[52,84]},
    {n:'Petite clarinette en Ré',c:'Bois',g:'clarinettes',o:2,i:'2e majeure ascendante',r:[52,91]},
    {n:'Petite clarinette en Mi♭',c:'Bois',g:'clarinettes',o:3,i:'3e mineure ascendante',r:[52,91]},
    {n:'Clarinette en Si♭',c:'Bois',g:'clarinettes',o:-2,i:'2e majeure descendante',r:[52,91]},
    {n:'Clarinette en La',c:'Bois',g:'clarinettes',o:-3,i:'3e mineure descendante',r:[52,91]},
    {n:'Clarinette basse Si♭ (clé de sol)',c:'Bois',g:'clarinettes',o:-14,i:'9e majeure descendante',r:[52,84]},
    {n:'Clarinette basse Si♭ (clé de fa)',c:'Bois',g:'clarinettes',o:-2,i:'2e majeure descendante',r:[40,72]},
    {n:'Saxophone soprano (Si♭)',c:'Bois',g:'saxophones',o:-2,i:'2e majeure descendante',r:[56,88]},
    {n:'Saxophone alto (Mi♭)',c:'Bois',g:'saxophones',o:-9,i:'6e majeure descendante',r:[56,88]},
    {n:'Saxophone ténor (Si♭)',c:'Bois',g:'saxophones',o:-14,i:'9e majeure descendante',r:[56,88]},
    {n:'Saxophone baryton (Mi♭)',c:'Bois',g:'saxophones',o:-21,i:'13e majeure descendante',r:[56,87]},
    {n:'Cor en Ré',c:'Cuivres',g:'cors',o:-10,i:'7e mineure descendante',r:[42,84]},
    {n:'Cor en Mi♭',c:'Cuivres',g:'cors',o:-9,i:'6e majeure descendante',r:[42,84]},
    {n:'Cor en Mi',c:'Cuivres',g:'cors',o:-8,i:'6e mineure descendante',r:[42,84]},
    {n:'Cor en Fa',c:'Cuivres',g:'cors',o:-7,i:'5e juste descendante',r:[42,84]},
    {n:'Cor en La',c:'Cuivres',g:'cors',o:-3,i:'3e mineure descendante',r:[42,84]},
    {n:'Cor en Si♭',c:'Cuivres',g:'cors',o:-2,i:'2e majeure descendante',r:[42,84]},
    {n:'Petite trompette en Ré',c:'Cuivres',g:'trompettes',o:2,i:'2e majeure ascendante',r:[54,82]},
    {n:'Trompette en Mi♭',c:'Cuivres',g:'trompettes',o:3,i:'3e mineure ascendante',r:[54,82]},
    {n:'Trompette en Fa',c:'Cuivres',g:'trompettes',o:5,i:'4e juste ascendante',r:[54,82]},
    {n:'Trompette en Si♭',c:'Cuivres',g:'trompettes',o:-2,i:'2e majeure descendante',r:[54,84]},
    {n:'Cornet à pistons (Si♭)',c:'Cuivres',g:'trompettes',o:-2,i:'2e majeure descendante',r:[54,84]},
    {n:'Trombone à pistons (Si♭)',c:'Cuivres',g:'trombones',o:-2,i:'2e majeure descendante',r:[40,72]},
    {n:'Saxhorn basse (Si♭)',c:'Cuivres',g:'saxhorns',o:-2,i:'2e majeure descendante',r:[36,65]},
    {n:'Euphonium Si♭ (clé de sol)',c:'Cuivres',g:'saxhorns',o:-14,i:'9e majeure descendante',r:[54,84]},
    {n:'Saxhorn contrebasse (Mi♭)',c:'Cuivres',g:'saxhorns',o:-9,i:'6e majeure descendante',r:[36,60]},
    {n:'Tuba en Fa',c:'Cuivres',g:'tubas',o:-19,i:'12e juste descendante',r:[28,60]},
    {n:'Saxhorn contrebasse (Si♭)',c:'Cuivres',g:'saxhorns',o:-14,i:'9e majeure descendante',r:[36,60]},
  ];

  let inst=null, note=9, oct=4, dir='w', acc='s', q='';
  function nn(i){return(acc==='s'?SH:FL)[i]}
  function sa(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'');}

  /* === Clavier T2-style 3 octaves ===
     Le clavier visible montre 3 octaves : oct visuel 0=oct-1, 1=oct, 2=oct+1
     L'utilisateur clique sur une touche → on met à jour note (pc) et oct si nécessaire */
  const W_PAT_T1=[0,2,4,5,7,9,11];
  const WN_T1=['C','D','E','F','G','A','B'];
  const BN_S_T1=['C♯','D♯','','F♯','G♯','A♯',''];
  const BN_F_T1=['D♭','E♭','','G♭','A♭','B♭',''];
  const BI_PAT_T1=[1,3,null,6,8,10,null];

  function bldPiano(){
    const el=document.getElementById('piano1');if(!el)return;
    const bn=acc==='s'?BN_S_T1:BN_F_T1;
    const wn=acc==='s'?WN_T1:WN_T1; // labels constants for whites
    const totalW=21, ww=100/totalW, g=0.3;
    let h='';
    /* White keys — 3 octaves */
    for(let o=0;o<3;o++){
      for(let i=0;i<7;i++){
        const pc=W_PAT_T1[i];
        const isSel=(pc===note&&o===1); /* central octave is the one selected */
        const idx=o*7+i;
        h+=`<div class="wkey2${isSel?' sel':''}" data-pc="${pc}" data-o="${o}" style="left:${idx*ww+g/2}%;width:${ww-g}%" onclick="T1.sNoteO(${pc},${o})">${WN_T1[i]}</div>`;
      }
    }
    /* Black keys — 3 octaves */
    for(let o=0;o<3;o++){
      for(let i=0;i<7;i++){
        if(BI_PAT_T1[i]===null)continue;
        const pc=BI_PAT_T1[i];
        const lbl=bn[i];
        const idx=o*7+i;
        const bw=3.2;
        const left=(idx+1)*ww-bw/2;
        const isSel=(pc===note&&o===1);
        h+=`<div class="bkey2${isSel?' sel':''}" data-pc="${pc}" data-o="${o}" style="left:${left}%;width:${bw}%" onclick="T1.sNoteO(${pc},${o})">${lbl}</div>`;
      }
    }
    el.innerHTML=h;
    hlResult();
  }

  /* Highlight transposed result note in orange — show REAL result on the keyboard */
  function hlResult(){
    const el=document.getElementById('piano1');if(!el)return;
    /* Clear previous result highlights */
    el.querySelectorAll('.wkey2.inv,.bkey2.inv').forEach(k=>k.classList.remove('inv'));
    /* No instrument selected = nothing to compute */
    if(!inst) return;
    /* Compute the transposed semitone offset relative to the selected note */
    const offset=inst.o;
    /* dir==='w' : written → concert (real sounding) = note + offset
       dir==='c' : concert → written = note - offset */
    const semis=(dir==='w'?offset:-offset);
    /* Selected note is on visual octave 1 (the central row of the 3-octave keyboard).
       Compute the result's absolute semitone position relative to that. */
    const sourceAbs=12+note; /* selected note at visual octave 1 */
    const resultAbs=sourceAbs+semis;
    const resultPc=((resultAbs%12)+12)%12;
    const resultO=Math.floor(resultAbs/12); /* 0, 1, or 2 if visible */
    /* Q2 case A : if result = selected note (same pc & octave 1), no orange */
    if(resultPc===note && resultO===1) return;
    /* Q3 option A : if result is outside visible 3 octaves (0..2), don't show anything */
    if(resultO<0 || resultO>2) return;
    /* Apply orange .inv class on the matching key */
    const sel=`[data-pc="${resultPc}"][data-o="${resultO}"]`;
    el.querySelectorAll(sel).forEach(k=>{
      if(!k.classList.contains('sel')) k.classList.add('inv');
    });
  }

  function bldList(){
    const filt=INSTR.filter(x=>{
      const s=sa(q.toLowerCase());
      if(sa(x.n.toLowerCase()).includes(s)||sa(x.c.toLowerCase()).includes(s))return true;
      if(currentLang==='en'||currentLang==='es'){if(sa(tI(x.n).toLowerCase()).includes(s)||sa(tIC(x.c).toLowerCase()).includes(s))return true;}
      return false;
    });
    const cats=[...new Set(filt.map(x=>x.c))];
    let h='';
    cats.forEach(cat=>{
      h+=`<div class="cath">${tIC(cat)}</div>`;
      filt.filter(x=>x.c===cat).forEach(x=>{
        const idx=INSTR.indexOf(x);
        h+=`<div class="irow${inst===x?' sel':''}" onclick="T1.sInst(${idx})"><div>${tI(x.n)}</div><div class="iiv">${tIv(x.i)}</div></div>`;
      });
    });
    document.getElementById('ilist').innerHTML=h||`<div style="padding:12px;font-size:12px;color:#9ca3af;text-align:center">${t("h_none")}</div>`;
  }

  function transp(ni,oc,sem){
    const t=ni+oc*12+sem;
    return{idx:((t%12)+12)%12,oct:Math.floor(t/12)};
  }

  /* ── SVG Staff for tessiture ── */
  // MIDI to staff position: C4=60 → staffPos 0 (middle C), each diatonic step = 1
  // We use: staffPos = octave*7 + diatonicStep, where C=0,D=1,E=2,F=3,G=4,A=5,B=6
  const MIDI_TO_DIA=[0,0,1,1,2,3,3,4,4,5,5,6]; // C,C#,D,D#,E,F,F#,G,G#,A,A#,B
  function midiToStaffPos(m){
    const oct=Math.floor(m/12)-1; // MIDI oct: 60=C4 → oct 4
    const pc=m%12;
    return oct*7+MIDI_TO_DIA[pc];
  }
  // staffPos where B4=34 (treble bottom line E4=30+2=32... let me recalc)
  // C4=60 → oct=4, dia=0 → pos=28. E4=64→pos=30. F4=65→pos=31. B4=71→pos=34.
  // Treble clef lines: E4(30),G4(32),B4(34),D5(36),F5(38)
  // Bass clef lines:   G2(16),B2(18),D3(22),F3(24),A3(26)  wait let me be precise
  // G2=43midi→oct=2,dia=4→pos=18. B2=47→oct=2,dia=6→pos=20. D3=50→oct=3,dia=1→pos=22. F3=53→oct=3,dia=3→pos=24. A3=57→oct=3,dia=5→pos=26.
  const TREBLE_LINES=[30,32,34,36,38]; // E4,G4,B4,D5,F5
  const BASS_LINES=[18,20,22,24,26];   // G2,B2,D3,F3,A3

  function buildStaffSVG(writtenMidi, rangeLow, rangeHigh){
    if(!inst||!inst.r) return '';

    const rLowPos=midiToStaffPos(rangeLow);
    const rHighPos=midiToStaffPos(rangeHigh);
    const notePos=midiToStaffPos(writtenMidi);
    const minPos=Math.min(rLowPos, notePos)-2;
    const maxPos=Math.max(rHighPos, notePos)+2;
    const posSpan=maxPos-minPos;

    const SP=Math.min(9, Math.max(5, 130/(posSpan||1)));
    const H=Math.max(120, posSpan*SP/2+60);
    const W=420, LM=50, RM=26;

    const rangeCenter=(rangeLow+rangeHigh)/2;
    const useBass=midiToStaffPos(rangeCenter)<28;
    const lines=useBass?BASS_LINES:TREBLE_LINES;
    const refPos=useBass?22:34;
    const staffCY=H/2+6;

    function posToY(sp){ return staffCY-(sp-refPos)*SP/2; }

    function addLedgers(sp, xc, w, col){
      const c=col||'#c0c0c0';
      const topLine=lines[lines.length-1], botLine=lines[0];
      let s='';
      for(let l=topLine+2;l<=sp;l+=2){ s+=`<line x1="${xc-w/2}" y1="${posToY(l)}" x2="${xc+w/2}" y2="${posToY(l)}" stroke="${c}" stroke-width="0.8"/>`; }
      for(let l=botLine-2;l>=sp;l-=2){ s+=`<line x1="${xc-w/2}" y1="${posToY(l)}" x2="${xc+w/2}" y2="${posToY(l)}" stroke="${c}" stroke-width="0.8"/>`; }
      return s;
    }

    const rY1=posToY(rHighPos);
    const rY2=posToY(rLowPos);

    let svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;display:block;margin:4px auto 0">`;

    // Title
    svg+=`<text x="${W/2}" y="13" font-size="9.5" font-weight="700" fill="#7c7a9a" font-family="sans-serif" letter-spacing="0.06em" text-anchor="middle">${t('lbl_range')} — ${tI(inst.n).toUpperCase()}</text>`;

    // Staff lines
    lines.forEach(lp=>{
      const y=posToY(lp);
      svg+=`<line x1="${LM}" y1="${y}" x2="${W-RM}" y2="${y}" stroke="#b8b8c0" stroke-width="1"/>`;
    });

    // Clef
    const clefX=LM+14;
    if(useBass){
      // Bass clef: Unicode glyph positioned so the two dots straddle the F3 line (pos 24)
      // Offset = font-size × 0.38 aligns the dots on the 4th line across font sizes
      const fSize=Math.max(32, SP*4.5);
      svg+=`<text x="${clefX}" y="${posToY(24)+fSize*0.38}" font-size="${fSize}" font-family="serif" fill="#4b5563" text-anchor="middle">𝄢</text>`;
    } else {
      svg+=`<text x="${clefX}" y="${posToY(34)+4}" font-size="42" font-family="serif" fill="#4b5563" text-anchor="middle">𝄞</text>`;
    }

    // ── Three notes grouped: low extreme, transposed, high extreme ──
    const centerX=W/2+20;
    const exLowX=centerX-50;
    const tNoteX=centerX;
    const exHighX=centerX+50;

    // Low extreme — subtle gray
    svg+=addLedgers(rLowPos, exLowX, 18, '#d0d0d0');
    svg+=`<ellipse cx="${exLowX}" cy="${rY2}" rx="5.5" ry="4" fill="#c0bdd0" opacity="0.7" transform="rotate(-10,${exLowX},${rY2})"/>`;
    const lowName=nn(rangeLow%12)+(Math.floor(rangeLow/12)-1);
    svg+=`<text x="${exLowX}" y="${rY2+14}" font-size="9" font-weight="500" fill="#a8a6b8" font-family="sans-serif" text-anchor="middle">${lowName}</text>`;

    // High extreme — subtle gray
    svg+=addLedgers(rHighPos, exHighX, 18, '#d0d0d0');
    svg+=`<ellipse cx="${exHighX}" cy="${rY1}" rx="5.5" ry="4" fill="#c0bdd0" opacity="0.7" transform="rotate(-10,${exHighX},${rY1})"/>`;
    const highName=nn(rangeHigh%12)+(Math.floor(rangeHigh/12)-1);
    svg+=`<text x="${exHighX}" y="${rY1-8}" font-size="9" font-weight="500" fill="#a8a6b8" font-family="sans-serif" text-anchor="middle">${highName}</text>`;

    // ── Transposed note — colored, prominent, centered ──
    const tNoteY=posToY(notePos);

    let noteColor='#22c55e';
    if(writtenMidi<rangeLow||writtenMidi>rangeHigh) noteColor='#ef4444';
    else if(writtenMidi<=rangeLow+2||writtenMidi>=rangeHigh-2) noteColor='#f59e0b';

    svg+=addLedgers(notePos, tNoteX, 22, '#bbb');

    // Stem
    const stemDir=notePos<refPos?1:-1;
    svg+=`<line x1="${tNoteX+(stemDir>0?6.5:-6.5)}" y1="${tNoteY}" x2="${tNoteX+(stemDir>0?6.5:-6.5)}" y2="${tNoteY-stemDir*26}" stroke="${noteColor}" stroke-width="1.5"/>`;

    // Notehead
    svg+=`<ellipse cx="${tNoteX}" cy="${tNoteY}" rx="7" ry="5" fill="${noteColor}" transform="rotate(-10,${tNoteX},${tNoteY})"/>`;

    // Note label
    const noteLbl=nn(writtenMidi%12)+(Math.floor(writtenMidi/12)-1);
    svg+=`<text x="${tNoteX}" y="${tNoteY+((stemDir>0)?17:-20)}" font-size="11" font-weight="700" fill="${noteColor}" font-family="sans-serif" text-anchor="middle">${noteLbl}</text>`;

    // Status
    let statusText='';
    if(writtenMidi<rangeLow||writtenMidi>rangeHigh) statusText=t('rng_out');
    else if(writtenMidi<=rangeLow+2||writtenMidi>=rangeHigh-2) statusText=t('rng_lim');
    else statusText=t('rng_in');
    svg+=`<text x="${tNoteX}" y="${H-4}" font-size="9" font-weight="600" fill="${noteColor}" font-family="sans-serif" text-anchor="middle">${statusText}</text>`;

    svg+=`</svg>`;
    return svg;
  }

  function bldResult(){
    const el=document.getElementById('rzone');
    if(!inst){el.innerHTML=`<div style="text-align:center;padding:20px;font-size:13px;color:#9ca3af">${t("h_instr")}</div>`;return;}
    const off=dir==='w'?inst.o:-inst.o;
    const res=transp(note,oct,off);
    const inN=nn(note),outN=nn(res.idx);
    const lbIn=dir==='w'?t('lbl_written'):t('lbl_concert');
    const lbOut=dir==='w'?t('lbl_concert'):t('lbl_written');
    // Compute written MIDI (in standard MIDI, C4=60) for tessiture display.
    // Internal pitch convention is C0=0 (note+oct*12), but `inst.r` and the
    // staff renderer's midiToStaffPos both expect standard MIDI. So we shift
    // by +12 here. Mode 'c': written = concert - inst.o (since o is added
    // going written→concert, so subtract going concert→written).
    const inputMidiStd=note+oct*12+12;
    const writtenMidi=dir==='w'?inputMidiStd:inputMidiStd-inst.o;
    const staffSVG=inst.r?buildStaffSVG(writtenMidi,inst.r[0],inst.r[1]):'';
    el.innerHTML=`
    <div class="sbar">
      <div>
        <div style="font-size:10px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em">${lbIn}</div>
        <div style="font-size:24px;font-weight:600;color:#111827;line-height:1.1">${inN}<span style="font-size:13px;color:#9ca3af"> oct.${oct}</span></div>
      </div>
      <div style="flex:1;text-align:center;font-size:20px;color:#d1d5db">→</div>
      <div style="text-align:right">
        <div style="font-size:10px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em">${lbOut}</div>
        <div style="font-size:24px;font-weight:600;color:#534AB7;line-height:1.1">${outN}<span style="font-size:13px;color:#7F77DD"> oct.${res.oct}</span></div>
      </div>
    </div>
    <div class="rcard">
      <div style="font-size:10px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px">${lbOut}</div>
      <div style="font-size:40px;font-weight:700;color:#111827;line-height:1">${outN}</div>
      <div style="font-size:13px;color:#9ca3af;margin-bottom:6px">${t('lbl_octave')} ${res.oct}</div>
      <span style="display:inline-block;padding:3px 12px;background:#f5f3ff;border:1.5px solid #e5e7eb;border-radius:20px;font-size:11px;color:#6b7280">${tIv(inst.i)}</span>
      <div style="margin-top:4px;font-size:11px;color:#9ca3af">${tI(inst.n)}</div>
    </div>
    ${staffSVG?`<div class="rcard" style="padding:10px 8px">${staffSVG}</div>`:''}`;
  }

  function render(){bldPiano();bldList();bldResult();document.getElementById('nlbl').textContent=dir==='w'?t("lbl_written_note"):t("lbl_concert_note");if(typeof XI!=='undefined')XI.refresh();}

  /* ── Adjust octave so that the WRITTEN note (the one constrained by
        inst.r = [low,high] in standard-MIDI, C4=60) stays within the
        instrument's playable range. Internal pitch convention is C0=0,
        so to compare with r (standard MIDI) we shift by +12.

        Mode 'w' (written → concert) : the entry IS the written note,
                                       so the entry must be in r.
        Mode 'c' (concert → written) : the result IS the written note,
                                       so we compute it via -inst.o.

        If the current octave violates the range, walk it up or down by
        whole octaves until it fits (or hit the [0..8] octave bounds). */
  function adjOctForRange(targetNote, targetOct){
    if(!inst||!inst.r) return targetOct;
    const lo=inst.r[0], hi=inst.r[1];
    function wmStd(o){
      const internal = (dir==='w') ? targetNote+o*12 : targetNote+o*12-inst.o;
      return internal+12; /* convert internal (C0=0) to standard MIDI (C4=60) */
    }
    let o=targetOct;
    while(wmStd(o)<lo && o<8) o++;
    while(wmStd(o)>hi && o>0) o--;
    return o;
  }

  document.getElementById('srch').addEventListener('input',function(){q=this.value;bldList();});

  return{
    sNote(i){note=i;render();},
    sNoteO(pc,o){
      /* Click on 3-octave keyboard:
         o=1 (centre) → just update pc
         o=0 (lower)  → pc + descend octave reelle de 1
         o=2 (upper)  → pc + monte d'une octave reelle
         Then auto-adjust octave so result stays within instrument range. */
      note=pc;
      if(o===0)oct=Math.max(0,oct-1);
      else if(o===2)oct=Math.min(8,oct+1);
      oct=adjOctForRange(note,oct);
      const onum=document.getElementById('onum');if(onum)onum.textContent=oct;
      render();
    },
    langUpdate(){bldList();bldPiano();bldResult();try{CLEF.init()}catch(e){}},
    sInst(i){
      inst=INSTR[i];
      /* Auto-adjust octave for the new instrument's range */
      oct=adjOctForRange(note,oct);
      const onum=document.getElementById('onum');if(onum)onum.textContent=oct;
      render();
    },
    setDir(d){
      dir=d;
      document.getElementById('bW').classList.toggle('on',d==='w');
      document.getElementById('bC').classList.toggle('on',d==='c');
      /* Direction flip changes which side (entry vs result) is the written note,
         so re-check the range constraint */
      oct=adjOctForRange(note,oct);
      const onum=document.getElementById('onum');if(onum)onum.textContent=oct;
      render();
    },
    setAcc(a){acc=a;document.getElementById('pS').classList.toggle('on',a==='s');document.getElementById('pF').classList.toggle('on',a==='f');render();},
    chOct(d){oct=Math.max(0,Math.min(8,oct+d));document.getElementById('onum').textContent=oct;bldResult();if(typeof XI!=='undefined')XI.refresh();},
    setOct(o){oct=Math.max(0,Math.min(8,o));document.getElementById('onum').textContent=oct;bldResult();if(typeof XI!=='undefined')XI.refresh();},
    getInstr(){return INSTR;},
    getState(){return{inst,note,oct,acc};},
    nn,
    init(){render();}
  };
})();

/* ══════════════════════════════════════
   XI — Transposition entre instruments
   ══════════════════════════════════════ */
const XI=(function(){
  let targetIdx=-1;

  function ivName(semis){
    const abs=Math.abs(semis);
    if(semis===0) return tx('Unisson (même transposition)','Unison (same transposition)','Unísono (misma transposición)');
    const namesFr={
      1:'2e mineure',2:'2e majeure',3:'3e mineure',4:'3e majeure',
      5:'4e juste',6:'triton',7:'5e juste',8:'6e mineure',
      9:'6e majeure',10:'7e mineure',11:'7e majeure',12:'octave',
      13:'9e mineure',14:'9e majeure',15:'9e augmentée',16:'10e mineure',
      17:'10e majeure',18:'11e juste',19:'11e augmentée',20:'12e mineure',
      21:'12e juste',22:'13e mineure',23:'13e majeure',24:'double octave'
    };
    const namesEn={
      1:'minor 2nd',2:'major 2nd',3:'minor 3rd',4:'major 3rd',
      5:'perfect 4th',6:'tritone',7:'perfect 5th',8:'minor 6th',
      9:'major 6th',10:'minor 7th',11:'major 7th',12:'octave',
      13:'minor 9th',14:'major 9th',15:'augmented 9th',16:'minor 10th',
      17:'major 10th',18:'perfect 11th',19:'augmented 11th',20:'minor 12th',
      21:'perfect 12th',22:'minor 13th',23:'major 13th',24:'double octave'
    };
    const namesEs={
      1:'2ª menor',2:'2ª mayor',3:'3ª menor',4:'3ª mayor',
      5:'4ª justa',6:'tritono',7:'5ª justa',8:'6ª menor',
      9:'6ª mayor',10:'7ª menor',11:'7ª mayor',12:'octava',
      13:'9ª menor',14:'9ª mayor',15:'9ª aumentada',16:'10ª menor',
      17:'10ª mayor',18:'11ª justa',19:'11ª aumentada',20:'12ª menor',
      21:'12ª justa',22:'13ª menor',23:'13ª mayor',24:'doble octava'
    };
    const names=currentLang==='en'?namesEn:currentLang==='es'?namesEs:namesFr;
    const fallback=currentLang==='en'?(abs+' semitones'):currentLang==='es'?(abs+' semitonos'):(abs+' demi-tons');
    const n=names[abs]||fallback;
    const suffix=currentLang==='en'?(semis>0?' ascending':' descending'):currentLang==='es'?(semis>0?' ascendente':' descendente'):(semis>0?' ascendante':' descendante');
    return n+suffix;
  }

  function refresh(){
    const el=document.getElementById('xizone');
    const INSTR=T1.getInstr();
    const st=T1.getState();
    if(!st.inst){el.innerHTML='';return;}

    /* Get same-family instruments */
    const family=INSTR.filter(x=>x.g===st.inst.g && x!==st.inst);
    if(family.length===0){el.innerHTML='';return;}

    /* Validate targetIdx */
    const familyIdxs=family.map(x=>INSTR.indexOf(x));
    if(!familyIdxs.includes(targetIdx)) targetIdx=familyIdxs[0];

    const target=INSTR[targetIdx];

    const netOffset=st.inst.o-target.o;
    const srcMidi=st.note+st.oct*12;
    const dstMidi=srcMidi+netOffset;
    const dstNote=((dstMidi%12)+12)%12;
    const dstOct=Math.floor(dstMidi/12);
    const srcName=T1.nn(st.note);
    const dstName=T1.nn(dstNote);

    const opts=family.map(x=>{
      const idx=INSTR.indexOf(x);
      return `<option value="${idx}"${idx===targetIdx?' selected':''}>${tI(x.n)}</option>`;
    }).join('');

    const groupLabel=st.inst.g.charAt(0).toUpperCase()+st.inst.g.slice(1);
    const titleLbl=tx('Transposition entre','Transposition between','Transposición entre');
    const onLbl=tx('sur','on','en');
    const offsetLbl=tx('Décalage','Offset','Desplazamiento');

    el.innerHTML=`
      <div class="xi-box">
        <div class="xi-title">${titleLbl} ${groupLabel}</div>
        <div class="xi-row">
          <div class="xi-from">${tI(st.inst.n)}</div>
          <div class="xi-arrow">→</div>
          <select class="xi-sel" id="xiSel" onchange="XI.pick(parseInt(this.value))">${opts}</select>
        </div>
        <div class="xi-res">
          <div class="xi-res-main">
            <strong>${srcName}${st.oct}</strong> ${onLbl} ${tI(st.inst.n)}
          </div>
          <div style="font-size:16px;color:#d1d5db;margin:4px 0">↓</div>
          <div class="xi-res-note">${dstName}<span style="font-size:16px;color:#7F77DD"> oct.${dstOct}</span></div>
          <div class="xi-res-main">${onLbl} <strong>${tI(target.n)}</strong></div>
          <div class="xi-res-sub" style="margin-top:8px">${offsetLbl} : ${ivName(netOffset)}</div>
        </div>
      </div>`;
  }

  return{
    pick(idx){targetIdx=idx;refresh();},
    refresh,
    init(){refresh();}
  };
})();

/* ══════════════════════════════════════
   Clef — Référence Alto & Ténor
   ══════════════════════════════════════ */
const CLEF=(function(){
  /*
    Alto clef (ut 3e ligne):  Middle C = line 3. Staff shows C3→C6 range.
    Tenor clef (ut 4e ligne): Middle C = line 4. Staff shows B2→E5 range.

    We define notes as {name, midi} where midi is the MIDI number.
    C4 = 60. Each note occupies a diatonic step on the staff.
  */
  const NAMES=['C','D','E','F','G','A','B'];
  const MIDI_BASE={C:0,D:2,E:4,F:5,G:7,A:9,B:11};

  /* Build a range of diatonic notes from startNote/startOct to endNote/endOct */
  function mkRange(sN,sO,eN,eO){
    const out=[];
    let ni=NAMES.indexOf(sN),oc=sO;
    while(true){
      const name=NAMES[ni];
      const midi=(oc+1)*12+MIDI_BASE[name]; /* C4=60 → (4+1)*12+0=60 ✓ */
      out.push({name:name+oc,letter:name,oct:oc,midi});
      if(name===eN&&oc===eO)break;
      ni++;if(ni>=7){ni=0;oc++;}
      if(out.length>40)break;
    }
    return out;
  }

  const CLEFS=[
    {
      id:'alto',
      get name(){return t('cl_a')},
      get sub(){return t('cl_as')},
      /* C4 sits on line 3 (middle line). Staff lines = 1-5 from top.
         Line 3 = C4. Each diatonic step = half a line gap.
         Range: C3 (ledger below) to E5 (a few ledger lines above) */
      c4Line:3,
      notes:mkRange('C',3,'E',5),
      /* SVG clef symbol: alto clef (C-clef centered on line 3) */
      clefSymbol:'𝄡',
      clefY:3 /* which line the clef centers on */
    },
    {
      id:'tenor',
      get name(){return t('cl_t')},
      get sub(){return t('cl_ts')},
      c4Line:4,
      notes:mkRange('B',2,'E',5),
      clefSymbol:'𝄡',
      clefY:4
    }
  ];

  let selClef=null;

  function bldList(){
    let h='';
    CLEFS.forEach((c,i)=>{
      h+=`<div class="irow${selClef===c?' sel':''}" onclick="CLEF.pick(${i})">
        <div>${c.name}</div>
        <div class="iiv">${c.sub}</div>
      </div>`;
    });
    document.getElementById('cleflist').innerHTML=h;
  }

  /* Convert a note to its Y position on staff.
     Staff lines 1-5 from top, gap = G pixels.
     Line 1 = top. C4 sits on c4Line.
     Each diatonic step = G/2.
     diaStepsFromC4 = (oct-4)*7 + NAMES.indexOf(letter)
     y = lineY(c4Line) - diaStepsFromC4 * (G/2)
  */
  function drawStaff(clef){
    const G=13; /* gap between staff lines */
    const notes=clef.notes;

    /* Compute vertical positions relative to C4 = 0 */
    const noteSteps=notes.map(n=>(n.oct-4)*7+NAMES.indexOf(n.letter));
    const minStep=Math.min(...noteSteps);
    const maxStep=Math.max(...noteSteps);

    /* Staff line positions: line 1 (top) to line 5 (bottom).
       C4 sits on clef.c4Line. In staff coords, line i has
       diatonic offset from C4 = (clef.c4Line - i) * 2 steps.
       So line i step = (clef.c4Line - i) * 2 */
    const line1Step=(clef.c4Line-1)*2;
    const line5Step=(clef.c4Line-5)*2;

    /* We need enough room above the highest note and below the lowest.
       Each step = G/2 pixels. We add padding for labels. */
    const topPad=28;  /* space above highest note for margin */
    const botPad=48;  /* space below staff for note labels + "Do central" */

    /* Place line 1 so the highest note has topPad above it */
    const highestNoteOffsetFromLine1=(maxStep-line1Step)*(G/2); /* positive = above line 1 */
    const line1Y=topPad+Math.max(0,highestNoteOffsetFromLine1);

    const lineY=i=>line1Y+(i-1)*G;
    const c4Y=lineY(clef.c4Line);

    function noteY(step){ return c4Y-step*(G/2); }

    /* Total height */
    const lowestNoteY=noteY(minStep);
    const H=Math.max(lowestNoteY+botPad, lineY(5)+botPad);

    /* Horizontal layout */
    const nSp=Math.min(30,Math.max(18,(520-90)/notes.length));
    const x0=65;
    const W=Math.max(520, x0+notes.length*nSp+20);

    /* Label Y: fixed below the lowest element */
    const lblY=Math.max(lineY(5), lowestNoteY)+18;
    const c4LblY=lblY+14;

    let svg=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">`;

    /* Staff lines */
    for(let i=1;i<=5;i++){
      svg+=`<line x1="20" y1="${lineY(i)}" x2="${W-10}" y2="${lineY(i)}" stroke="#d1cfe6" stroke-width="1"/>`;
    }

    /* Clef symbol — Unicode 𝄡 (U+1D121 MUSICAL SYMBOL C CLEF).
       Use dominant-baseline="central" so the glyph's vertical center
       sits on the reference line. The +4 offset compensates for the fact
       that in most fallback fonts the chevron (notch where the line should
       pass through) sits slightly above the geometric center of the em-box.
       Net result: chevron tip lands exactly on line 3 (alto) / line 4 (tenor).
       Font stack prioritises real music fonts when available, with a
       generic serif fallback for systems without them. */
    const clefCY=lineY(clef.clefY);
    svg+=`<text x="34" y="${clefCY+4}" font-size="56" fill="#534AB7" font-family="'Bravura Text','Bravura','Leland','Noto Music',serif" text-anchor="middle" dominant-baseline="central">${clef.clefSymbol}</text>`;

    /* Key signature area offset */
    const ksX=55;

    /* Notes */
    const rX=5,rY=3.8;
    notes.forEach((n,idx)=>{
      const x=x0+idx*nSp;
      const step=noteSteps[idx];
      const y=noteY(step);
      const isC4=(n.letter==='C'&&n.oct===4);

      /* Ledger lines */
      if(y>lineY(5)+1){
        for(let ly=lineY(5)+G;ly<=y+1;ly+=G){
          svg+=`<line x1="${x-9}" y1="${ly}" x2="${x+9}" y2="${ly}" stroke="#d1cfe6" stroke-width="1"/>`;
        }
      }
      if(y<lineY(1)-1){
        for(let ly=lineY(1)-G;ly>=y-1;ly-=G){
          svg+=`<line x1="${x-9}" y1="${ly}" x2="${x+9}" y2="${ly}" stroke="#d1cfe6" stroke-width="1"/>`;
        }
      }

      const fill=isC4?'#e74c3c':'#374151';
      const lFill=isC4?'#e74c3c':'#6b7280';
      const fw=isC4?'700':'500';

      svg+=`<g class="clef-note-hl" onclick="CLEF.clickNote(${n.midi%12},${n.oct})" style="cursor:pointer">`;
      svg+=`<ellipse cx="${x}" cy="${y}" rx="${rX}" ry="${rY}" fill="${fill}" transform="rotate(-12 ${x} ${y})"/>`;
      svg+=`<text class="nlbl" x="${x}" y="${lblY}" font-size="10" fill="${lFill}" font-weight="${fw}" font-family="DM Sans,sans-serif" text-anchor="middle">${n.letter}${n.oct}</text>`;
      svg+=`</g>`;
    });

    /* Middle C label */
    const c4Idx=notes.findIndex(n=>n.letter==='C'&&n.oct===4);
    if(c4Idx>=0){
      const c4x=x0+c4Idx*nSp;
      svg+=`<text x="${c4x}" y="${c4LblY}" font-size="9" fill="#e74c3c" font-weight="600" font-family="DM Sans,sans-serif" text-anchor="middle">${"↑ "+t("lbl_middle_c")}</text>`;
    }

    svg+=`</svg>`;
    return svg;
  }

  function renderClef(){
    const el=document.getElementById('clefzone');
    if(!selClef){el.innerHTML='';return;}
    el.innerHTML=`
      <div class="clef-staff-box">
        <div class="clef-staff-title">${selClef.name} — ${t("lbl_clef_ref")}</div>
        ${drawStaff(selClef)}
      </div>`;
  }

  return{
    pick(i){selClef=selClef===CLEFS[i]?null:CLEFS[i];bldList();renderClef();},
    clickNote(pc,oct){
      T1.sNote(pc);
      T1.setOct(oct);
    },
    init(){bldList();renderClef();}
  };
})();

/* ── Init ── */

/* ── Init auto ── */
try{T1.init()}catch(e){console.error('T1:',e)}
try{XI.init()}catch(e){console.error('XI:',e)}
try{CLEF.init()}catch(e){console.error('CLEF:',e)}
