/* home.js — Animation hero canvas */
(function(){
  function HOME_initCanvas(){
    const canvas = document.getElementById('homeHeroCanvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf, running = false;

    function resize(){
      const p = canvas.parentElement;
      if(!p) return;
      canvas.width  = p.clientWidth;
      canvas.height = p.clientHeight;
    }

    // ── Easing exponentiel : très lent au début et à la fin ──
    function easeInOutExpo(t) {
      if(t===0) return 0;
      if(t===1) return 1;
      if(t<0.5) return Math.pow(2, 20*t-10)/2;
      return (2-Math.pow(2,-20*t+10))/2;
    }

    // Easing encore plus doux : puissance 5 — quasi invisible au début
    function easeInOutQuint(t) {
      return t<0.5 ? 16*t*t*t*t*t : 1-Math.pow(-2*t+2,5)/2;
    }

    // ── Cycle clé de sol (16s total) ──
    //  0.00–0.35 : apparition très progressive (easeInOutQuint)
    //  0.35–0.72 : présence stable, respiration ultra-douce
    //  0.72–0.94 : disparition lente (easeInOutQuint)
    //  0.94–1.00 : silence absolu
    const CYCLE = 16000;

    function getClefAlpha(ts) {
      const phase = (ts % CYCLE) / CYCLE;
      if(phase < 0.35) {
        return easeInOutQuint(phase / 0.35) * 0.68;
      } else if(phase < 0.72) {
        const p = (phase - 0.35) / 0.37;
        // Respiration ultra-lente : ±3%
        return 0.68 - 0.03 * Math.sin(p * Math.PI * 1.5);
      } else if(phase < 0.94) {
        return easeInOutQuint(1 - (phase - 0.72) / 0.22) * 0.68;
      }
      return 0;
    }

    function draw(ts){
      const W = canvas.width, H = canvas.height;
      if(!W || !H) return;
      ctx.clearRect(0,0,W,H);

      // ── Portée musicale ──
      const ls       = Math.min(H * 0.098, 13);
      const staffMY  = H * 0.54;
      const staffTop = staffMY - 2 * ls;
      const staffX   = 20;
      const staffW   = Math.min(W * 0.26, 190);

      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.10)';
      ctx.lineWidth = 0.55;
      for(let l=0;l<5;l++){
        const ly = staffTop + l*ls + Math.sin(ts*0.00035+l*0.5)*0.8;
        ctx.beginPath();
        ctx.moveTo(staffX, ly);
        ctx.lineTo(staffX + staffW, ly);
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(staffX, staffTop);
      ctx.lineTo(staffX, staffTop + 4*ls);
      ctx.stroke();
      ctx.restore();

      // ── Ondes sinusoïdales — toute la largeur, opacité test ──
      ctx.save();
      for(let w=0;w<3;w++){
        const freq  = 0.018 - w*0.003;
        const amp   = 12 - w*3;
        const speed = 0.0009 + w*0.00025;
        const offY  = H*0.78 + w*14;
        const wW    = W; // toute la largeur
        ctx.beginPath();
        ctx.globalAlpha = 0.09 - w*0.02;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth   = 1.0 - w*0.25;
        ctx.lineJoin    = 'round';
        for(let x=0;x<=wW;x+=2){
          const y = offY + Math.sin(x*freq + ts*speed)*amp;
          x===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.restore();

      // ── Particules dorées très discrètes ──
      for(let i=0;i<16;i++){
        const px = (Math.sin(i*2.3+7)*0.5+0.5)*W;
        const py = (Math.cos(i*1.7+3)*0.5+0.5)*H;
        const drift = Math.sin(ts*0.00035+i*0.9)*4;
        const alpha = 0.04 + 0.03*Math.sin(ts*0.0004+i*1.3);
        ctx.beginPath();
        ctx.arc(px, py+drift, 1.0+Math.sin(i*1.2)*0.7, 0, Math.PI*2);
        ctx.fillStyle = `rgba(200,164,68,${alpha})`;
        ctx.fill();
      }

      // ── Clé de sol 𝄞 — fondu pro ──
      const clefAlpha = getClefAlpha(ts);
      if(clefAlpha > 0.002){
        const clefFS = ls * 7.2;
        const clefY  = staffTop + 3*ls + clefFS * 0.13;

        ctx.save();

        // Glow multicouche : 3 passes avec blur décroissant
        // Pass 1 — halo large très doux
        ctx.globalAlpha = clefAlpha * 0.18;
        ctx.fillStyle   = '#C8A444';
        ctx.shadowColor = 'rgba(200,164,68,0.6)';
        ctx.shadowBlur  = 28;
        ctx.font = `${clefFS.toFixed(1)}px "Times New Roman",Georgia,serif`;
        ctx.textAlign    = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText('\uD834\uDD1E', staffX+6, clefY);

        // Pass 2 — halo moyen
        ctx.globalAlpha = clefAlpha * 0.30;
        ctx.shadowBlur  = 12;
        ctx.fillText('\uD834\uDD1E', staffX+6, clefY);

        // Pass 3 — glyphe final net
        ctx.globalAlpha  = clefAlpha;
        ctx.fillStyle    = '#C8A444';
        ctx.shadowColor  = 'rgba(200,164,68,0.20)';
        ctx.shadowBlur   = 4;
        ctx.fillText('\uD834\uDD1E', staffX+6, clefY);

        ctx.restore();
      }
    }

    function loop(ts){
      draw(ts);
      raf = requestAnimationFrame(loop);
    }

    function start(){
      if(running) return;
      running = true;
      resize();
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize);
    start();
  }

  window.HOME_init = function(){
    requestAnimationFrame(HOME_initCanvas);
  };
})();
