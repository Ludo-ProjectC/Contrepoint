const MODULES = ['home', 'transposeur', 'intervalles', 'harmonie', 'accords', 'modes', 'cadences', 'metronome', 'rythme', 'formes', 'modulation', 'sequences', 'analyseur', 'faq'];
const LOADED = new Set();
const LOADING = new Map();
const RENDER_FNS = {6: () => window.CAD_render && window.CAD_render(), 9: () => window.FM_render && window.FM_render(), 10: () => window.MOD_R && window.MOD_R(), 11: () => window.SEQ_render && window.SEQ_render(), 12: () => window.AH_render && window.AH_render()};

function loadHtmlXHR(name) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `js/modules/${name}.html`, true);
    xhr.onload = () => xhr.status === 200 ? resolve(xhr.responseText) : reject(new Error(`HTTP ${xhr.status}`));
    xhr.onerror = () => reject(new Error(`Load ${name}.html failed`));
    xhr.send();
  });
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.onload = () => resolve(); s.onerror = () => reject(new Error(`Script ${src} failed`));
    document.head.appendChild(s);
  });
}

async function loadModule(idx) {
  const name = MODULES[idx];
  if (!name || LOADED.has(name)) return;
  if (LOADING.has(name)) return LOADING.get(name);
  const promise = (async () => {
    const html = await loadHtmlXHR(name);
    document.getElementById('app').insertAdjacentHTML('beforeend', html);
    await loadScript(`js/modules/${name}.js`);
    LOADED.add(name);
    if (typeof window.applyI18n === 'function') window.applyI18n();
    const initFn = window[`${name.toUpperCase()}_init`];
    if (typeof initFn === 'function') { try { initFn(); } catch(e){ console.error(`Init ${name}:`, e); } }
  })();
  LOADING.set(name, promise);
  return promise;
}

window.switchTab = async function(i) {
  if (window._premiumGate && !window._premiumGate(i)) return;
  if (!LOADED.has(MODULES[i])) {
    document.body.classList.add('loading-module');
    try { await loadModule(i); } catch(e) { console.error('Module load failed:', e); document.body.classList.remove('loading-module'); return; }
    document.body.classList.remove('loading-module');
  }
  document.querySelectorAll('.tab').forEach((t, j) => { t.classList.toggle('on', j === i); t.setAttribute('aria-selected', j === i ? 'true' : 'false'); });
  document.querySelectorAll('.pc-panel').forEach(p => { const isTarget = p.id === panelIdFor(i); p.classList.toggle('active', isTarget); p.style.display = isTarget ? 'block' : 'none'; });
  try { if (RENDER_FNS[i]) RENDER_FNS[i](); } catch(e){}
  try { const url = new URL(location.href); url.searchParams.set('tab', MODULES[i]); history.replaceState(null, '', url); } catch(e){}
};

function panelIdFor(i) {
  const MAP = ['panHome','panTranspo','panIntervalles','panHarmonie','panAccords','panModes','panCadences','panMetro','panRythme','panFormes','panModulation','panSequences','panAnalyseur','panFaq'];
  return MAP[i];
}

async function bootstrap() {
  await loadModule(0);
  const params = new URLSearchParams(location.search);
  const wantedTab = params.get('tab');
  let initialIdx = 0;
  if (wantedTab) { const idx = MODULES.indexOf(wantedTab); if (idx >= 0) initialIdx = idx; }
  // CORRECTION BUG 1 : Toujours appeler switchTab pour afficher le panel (home ou autre)
  await window.switchTab(initialIdx);
}

document.addEventListener('DOMContentLoaded', bootstrap);
window._MODULES = MODULES;
window._LOADED = LOADED;
