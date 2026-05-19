(function(){
  // ─── FAQ thématique — SEO optimisé pour compositeurs & musiciens ───────────
  // 25 questions réparties en 6 groupes thématiques
  var PAIRS = [
    // Général
    ['faq.q1','faq.a1'],
    ['faq.q2','faq.a2'],
    ['faq.q3','faq.a3'],
    ['faq.q4','faq.a4'],
    // Transposeur & intervalles
    ['faq.q5','faq.a5'],
    ['faq.q6','faq.a6'],
    // Harmonie & accords
    ['faq.q7','faq.a7'],
    ['faq.q8','faq.a8'],
    ['faq.q9','faq.a9'],
    // Cadences & modes
    ['faq.q10','faq.a10'],
    ['faq.q11','faq.a11'],
    ['faq.q12','faq.a12'],
    // Analyseur SATB & conduite des voix
    ['faq.q13','faq.a13'],
    ['faq.q14','faq.a14'],
    ['faq.q15','faq.a15'],
    ['faq.q16','faq.a16'],
    // Modulation & séquences
    ['faq.q17','faq.a17'],
    ['faq.q18','faq.a18'],
    ['faq.q19','faq.a19'],
    ['faq.q20','faq.a20'],
    // Formes & composition
    ['faq.q21','faq.a21'],
    ['faq.q22','faq.a22'],
    // Technique & pratique
    ['faq.q23','faq.a23'],
    ['faq.q24','faq.a24'],
    ['faq.q25','faq.a25'],
    // Analyseur orchestral & Tutti
    ['faq.q26','faq.a26'],
    ['faq.q27','faq.a27'],
    ['faq.q28','faq.a28'],
    ['faq.q29','faq.a29'],
    ['faq.q30','faq.a30']
  ];

  var GROUPS = [
    { key: 'faq.group.general',    pairs: PAIRS.slice(0, 4)   },
    { key: 'faq.group.transposeur',pairs: PAIRS.slice(4, 6)   },
    { key: 'faq.group.harmonie',   pairs: PAIRS.slice(6, 9)   },
    { key: 'faq.group.cadences',   pairs: PAIRS.slice(9, 12)  },
    { key: 'faq.group.satb',       pairs: PAIRS.slice(12, 16) },
    { key: 'faq.group.modulation', pairs: PAIRS.slice(16, 20) },
    { key: 'faq.group.formes',     pairs: PAIRS.slice(20, 22) },
    { key: 'faq.group.pratique',   pairs: PAIRS.slice(22, 25) },
    { key: 'faq.group.orchestration', pairs: PAIRS.slice(25, 30) }
  ];

  function buildFaq(){
    var list = document.getElementById('faqPanelList');
    if(!list) return;
    list.innerHTML = '';

    GROUPS.forEach(function(group){
      // Group heading
      var heading = document.createElement('h3');
      heading.className = 'faq-group-title';
      heading.textContent = window.t ? window.t(group.key) : group.key;
      list.appendChild(heading);

      group.pairs.forEach(function(pair){
        var q = window.t ? window.t(pair[0]) : pair[0];
        var a = window.t ? window.t(pair[1]) : pair[1];
        var item = document.createElement('div');
        item.className = 'faq-item';
        item.innerHTML =
          '<button class="faq-q" aria-expanded="false">' +
            '<span class="faq-q-text">' + q + '</span>' +
            '<span class="faq-q-icon"><svg viewBox="0 0 10 6"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg></span>' +
          '</button>' +
          '<div class="faq-a"><p>' + a + '</p></div>';
        item.querySelector('.faq-q').addEventListener('click', function(){
          var open = item.classList.toggle('open');
          this.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        list.appendChild(item);
      });
    });
  }

  buildFaq();

  var origSetLang = window.setLang;
  if(origSetLang){
    window.setLang = function(l){
      origSetLang(l);
      buildFaq();
    };
  }
})();
