/* ═══════════════════════════════
   PREMIUM LOCK/UNLOCK SYSTEM
   ═══════════════════════════════ */
(function(){
  // Composer Mode tab indices
  var PREMIUM_TABS = [9, 10, 11, 12];
  // Panel IDs matching those indices
  var PANEL_IDS = ['panFormes','panModulation','panSequences','panAnalyseur'];

  // i18n for license modal
  var LIC_I18N = {
    fr: {
      title: 'Débloquer le Mode compositeur',
      sub: 'Entrez votre clé de licence pour débloquer toutes les fonctionnalités du mode compositeur à vie.',
      btn: 'Activer ma licence',
      btnLoading: 'Vérification...',
      buy: 'Acheter une licence →',
      price: 'Achat unique — Accès à vie',
      errInvalid: 'Clé de licence invalide. Vérifiez votre email.',
      errNetwork: 'Erreur de connexion. Réessayez.',
      errEmpty: 'Veuillez entrer une clé de licence.',
      success: 'Mode compositeur activé avec succès ! 🎉',
      overlayTitle: 'Mode compositeur',
      overlayDesc: 'Cet outil fait partie du mode compositeur. Débloquez-le avec une clé de licence pour un accès à vie.',
      overlayBtn: 'Débloquer le mode compositeur',
      overlayLink: 'J\'ai déjà une clé de licence'
    },
    en: {
      title: 'Unlock Composer Mode',
      sub: 'Enter your license key to unlock all Composer Mode features for life.',
      btn: 'Activate my license',
      btnLoading: 'Verifying...',
      buy: 'Buy a license →',
      price: 'One-time purchase — Lifetime access',
      errInvalid: 'Invalid license key. Please check your email.',
      errNetwork: 'Connection error. Please try again.',
      errEmpty: 'Please enter a license key.',
      success: 'Composer Mode activated successfully! 🎉',
      overlayTitle: 'Composer Mode',
      overlayDesc: 'This tool is part of Composer Mode. Unlock it with a license key for lifetime access.',
      overlayBtn: 'Unlock Composer Mode',
      overlayLink: 'I already have a license key'
    },
    es: {
      title: 'Desbloquear el Modo compositor',
      sub: 'Introduce tu clave de licencia para desbloquear todas las funcionalidades del modo compositor de por vida.',
      btn: 'Activar mi licencia',
      btnLoading: 'Verificando...',
      buy: 'Comprar una licencia →',
      price: 'Compra única — Acceso de por vida',
      errInvalid: 'Clave de licencia inválida. Comprueba tu correo.',
      errNetwork: 'Error de conexión. Inténtalo de nuevo.',
      errEmpty: 'Por favor, introduce una clave de licencia.',
      success: '¡Modo compositor activado con éxito! 🎉',
      overlayTitle: 'Modo compositor',
      overlayDesc: 'Esta herramienta forma parte del modo compositor. Desbloquéala con una clave de licencia para acceso de por vida.',
      overlayBtn: 'Desbloquear el modo compositor',
      overlayLink: 'Ya tengo una clave de licencia'
    }
  };

  function getLang(){ return (typeof currentLang !== 'undefined' ? currentLang : 'fr'); }
  function t(key){ var l = getLang(); return (LIC_I18N[l] && LIC_I18N[l][key]) || LIC_I18N.fr[key] || key; }

  // Check Composer Mode status
  function isPremium(){ return localStorage.getItem('pc_premium') === 'true'; }

  // Add overlays to Composer Mode panels
  function addOverlays(){
    PANEL_IDS.forEach(function(id){
      var panel = document.getElementById(id);
      if(!panel) return;
      // Remove existing overlay if any
      var existing = panel.querySelector('.premium-overlay');
      if(existing) existing.remove();

      if(!isPremium()){
        var ov = document.createElement('div');
        ov.className = 'premium-overlay';
        ov.innerHTML = '<div class="po-content">'
          + '<div class="po-icon">🔒</div>'
          + '<div class="po-title">' + t('overlayTitle') + '</div>'
          + '<div class="po-desc">' + t('overlayDesc') + '</div>'
          + '<button class="po-btn" onclick="openLicModal()">' + t('overlayBtn') + '</button>'
          + '<span class="po-link" onclick="openLicModal()">' + t('overlayLink') + '</span>'
          + '</div>';
        panel.appendChild(ov);
      }
    });
  }

  // Update tab lock icons
  function updateTabs(){
    var tabs = document.querySelectorAll('.tab[data-premium]');
    tabs.forEach(function(tab){
      if(isPremium()){
        tab.classList.remove('premium-locked');
        tab.classList.add('premium-unlocked');
      } else {
        tab.classList.add('premium-locked');
        tab.classList.remove('premium-unlocked');
      }
    });
  }

  // Update modal text for current language
  function updateModalLang(){
    var el;
    el = document.getElementById('lmTitle'); if(el) el.textContent = t('title');
    el = document.getElementById('lmSub'); if(el) el.textContent = t('sub');
    el = document.getElementById('lmBtnText'); if(el) el.textContent = t('btn');
    el = document.getElementById('lmBuyLink'); if(el) el.textContent = t('buy');
    el = document.getElementById('lmPrice'); if(el) el.textContent = t('price');
  }

  // Open / close modal
  window.openLicModal = function(){
    updateModalLang();
    document.getElementById('licModalBg').style.display = 'flex';
    document.getElementById('lmInput').focus();
  };

  window.closeLicModal = function(){
    document.getElementById('licModalBg').style.display = 'none';
    document.getElementById('lmInput').value = '';
    document.getElementById('lmMsg').textContent = '';
  };

  // Validate license
  window.validateLicense = function(){
    var key = document.getElementById('lmInput').value.trim();
    var msgEl = document.getElementById('lmMsg');
    var btnEl = document.querySelector('.lm-modal button:last-of-type');
    
    if(!key){ 
      if(msgEl) msgEl.textContent = t('errEmpty'); 
      return; 
    }
    
    if(msgEl) msgEl.textContent = '';
    if(btnEl) {
      btnEl.textContent = t('btnLoading');
      btnEl.disabled = true;
    }
    
    fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ license_key: key })
    })
    .then(r => r.json())
    .then(data => {
      if(data.valid || data.license_key){
        localStorage.setItem('pc_premium', 'true');
        localStorage.setItem('pc_license_key', key);
        msgEl.textContent = t('success');
        msgEl.style.color = '#10b981';
        updateTabs();
        addOverlays();
        setTimeout(() => window.closeLicModal(), 1000);
      } else {
        msgEl.textContent = t('errInvalid');
        msgEl.style.color = '#ef4444';
      }
    })
    .catch(e => {
      msgEl.textContent = t('errNetwork');
      msgEl.style.color = '#ef4444';
    })
    .finally(() => {
      if(btnEl) {
        btnEl.textContent = t('btn');
        btnEl.disabled = false;
      }
    });
  };

  // Premium gate for switchTab
  window._premiumGate = function(tabIdx){
    if(PREMIUM_TABS.indexOf(tabIdx) === -1) return true;
    if(isPremium()) return true;
    openLicModal();
    return false;
  };

  // Validate license on load (only if already licensed)
  function validateOnLoad(){
    var key = localStorage.getItem('pc_license_key');
    if(!key) return;
    fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ license_key: key })
    })
    .then(r => r.json())
    .then(data => {
      if(!(data.valid || data.license_key)){
        localStorage.removeItem('pc_premium');
        localStorage.removeItem('pc_license_key');
        updateTabs();
        addOverlays();
      }
    })
    .catch(() => {});
  }

  // Hook setLang to update premium UI on language change
  if(typeof window.setLang === 'function'){
    var _origSetLang = window.setLang;
    window.setLang = function(lang){
      _origSetLang(lang);
      setTimeout(function(){
        addOverlays();
        updateTabs();
      }, 50);
    };
  }

  // CORRECTION BUG 2 : Init on load — VALIDATION STRICTE
  // Les onglets premium doivent TOUJOURS être verrouillés au startup si pas de licence valide
  document.addEventListener('DOMContentLoaded', function(){
    updateTabs();    // Cela ajoute la classe 'premium-locked' si isPremium() === false
    addOverlays();   // Cela ajoute les overlays si isPremium() === false
    // Valider uniquement si une clé est présente (déjà sauvegardée)
    if(isPremium()) validateOnLoad();
  });

  // Also run after a short delay in case DOM isn't fully ready
  setTimeout(function(){
    updateTabs();    // Garantir que les onglets sont bien verrouillés
    addOverlays();
    if(isPremium()) validateOnLoad();
  }, 500);

  // ═══ LIGHTBOX FOR IMAGE ZOOM ═══
  window.openLightbox = function(imgEl){
    var lb = document.getElementById('lightboxBg');
    var lbImg = document.getElementById('lightboxImg');
    lbImg.src = imgEl.dataset.full || imgEl.src;
    lb.classList.add('show');
  };

  // ═══ CGV CONTENT (Quebec-compliant) ═══
  var CGV = {
    fr: '<h2>Mentions légales et conditions de vente</h2>'
      +'<h3>1. Identification du vendeur</h3>'
      +'<p>Contrepoint est une application de théorie musicale interactive développée et exploitée par un développeur indépendant basé au Québec, Canada. Pour toute question, veuillez utiliser le formulaire de contact intégré à l\'application.</p>'
      +'<h3>2. Objet</h3>'
      +'<p>Les présentes conditions générales de vente (CGV) régissent l\'achat de la licence Mode compositeur de l\'application Contrepoint. En effectuant un achat, vous acceptez sans réserve les présentes CGV. Ces conditions sont conformes à la Loi sur la protection du consommateur du Québec (LPC), au Code civil du Québec, et à la Loi 25 sur la protection des renseignements personnels.</p>'
      +'<h3>3. Description du produit</h3>'
      +'<p>La licence Mode compositeur donne accès à l\'ensemble des fonctionnalités du mode compositeur de l\'application, incluant : Formes musicales, Modulation, Séquences harmoniques et Analyseur harmonique. L\'achat est unique et donne un accès à vie aux fonctionnalités du mode compositeur. Les outils gratuits (Transposeur, Intervalles, Harmonie, Accords, Gammes & Modes, Métronome, Rythme) restent accessibles sans achat.</p>'
      +'<h3>4. Prix et paiement</h3>'
      +'<p>Le prix de la licence Mode compositeur est indiqué sur la page de paiement au moment de l\'achat, taxes applicables incluses. Le paiement est traité de manière sécurisée par notre prestataire de paiement LemonSqueezy pour la version web, ou par Apple/Google pour les versions mobiles. Aucun abonnement n\'est requis. Il s\'agit d\'un paiement unique.</p>'
      +'<h3>5. Livraison</h3>'
      +'<p>Après paiement, une clé de licence est envoyée par courriel à l\'adresse fournie lors de l\'achat. La livraison est immédiate et électronique. La clé de licence permet d\'activer les fonctionnalités du mode compositeur directement dans l\'application.</p>'
      +'<h3>6. Droit de rétractation et remboursement</h3>'
      +'<p>Conformément à la Loi sur la protection du consommateur du Québec, vous disposez d\'un droit de rétractation. Étant donné que le produit est un bien numérique livré immédiatement, le remboursement peut être demandé dans les 30 jours suivant l\'achat si les fonctionnalités du mode compositeur ne correspondent pas à la description annoncée. Pour toute demande de remboursement, contactez-nous via le formulaire de contact de l\'application en fournissant votre clé de licence.</p>'
      +'<h3>7. Licence d\'utilisation</h3>'
      +'<p>L\'achat confère une licence d\'utilisation personnelle, non exclusive et non transférable. La clé de licence est destinée à un usage individuel et peut être activée sur un nombre limité d\'appareils (maximum 3). La revente, le partage ou la distribution de la clé de licence est interdit.</p>'
      +'<h3>8. Protection des renseignements personnels</h3>'
      +'<p>Conformément à la Loi 25 du Québec sur la protection des renseignements personnels dans le secteur privé et au Règlement général sur la protection des données (RGPD) de l\'Union européenne :</p>'
      +'<ul><li>Seules les données strictement nécessaires au traitement de votre commande sont collectées (adresse courriel pour la livraison de la clé de licence).</li>'
      +'<li>Aucune donnée personnelle n\'est vendue, louée ou partagée à des tiers à des fins commerciales.</li>'
      +'<li>Le traitement des paiements est effectué par LemonSqueezy, Apple ou Google selon la plateforme. Nous n\'avons pas accès à vos données bancaires.</li>'
      +'<li>Vous pouvez exercer vos droits d\'accès, de rectification et de suppression de vos données en nous contactant.</li>'
      +'<li>L\'application ne collecte aucune donnée d\'utilisation et ne contient aucun traceur publicitaire.</li></ul>'
      +'<h3>9. Propriété intellectuelle</h3>'
      +'<p>L\'ensemble du contenu de l\'application (code source, interface, design, algorithmes) est protégé par le droit d\'auteur. Toute reproduction, modification, décompilation ou ingénierie inverse est strictement interdite.</p>'
      +'<h3>10. Limitation de responsabilité</h3>'
      +'<p>L\'application est fournie « telle quelle ». Bien que tous les efforts soient faits pour assurer l\'exactitude des informations musicales, l\'application ne saurait se substituer à l\'enseignement professionnel de la théorie musicale.</p>'
      +'<h3>11. Droit applicable et juridiction</h3>'
      +'<p>Les présentes CGV sont régies par les lois de la province de Québec et les lois fédérales du Canada qui s\'y appliquent. Tout litige sera soumis à la compétence exclusive des tribunaux du district judiciaire de Montréal, Québec, Canada.</p>'
      +'<h3>12. Modification des CGV</h3>'
      +'<p>Nous nous réservons le droit de modifier les présentes CGV à tout moment. Les modifications entrent en vigueur dès leur publication dans l\'application. Les achats effectués avant la modification restent soumis aux CGV en vigueur au moment de l\'achat.</p>'
      +'<p class="cgv-update">Dernière mise à jour : avril 2026</p>',

    en: '<h2>Legal Notices & Terms of Sale</h2>'
      +'<h3>1. Seller Identification</h3>'
      +'<p>Contrepoint is an interactive music theory application developed and operated by an independent developer based in Quebec, Canada. For any inquiries, please use the contact form integrated within the application.</p>'
      +'<h3>2. Purpose</h3>'
      +'<p>These Terms of Sale govern the purchase of the Composer Mode license for the Contrepoint application. By making a purchase, you unconditionally accept these Terms. These terms comply with Quebec\'s Consumer Protection Act (CPA), the Civil Code of Quebec, and Quebec\'s Act respecting the protection of personal information in the private sector (Law 25).</p>'
      +'<h3>3. Product Description</h3>'
      +'<p>The Composer Mode license provides access to all Composer Mode features of the application, including: Musical Forms, Modulation, Harmonic Sequences, and Harmonic Analyzer. The purchase is a one-time payment granting lifetime access to Composer Mode features. Free tools (Transposer, Intervals, Harmony, Chords, Modes, Metronome, Rhythm) remain accessible without purchase.</p>'
      +'<h3>4. Price and Payment</h3>'
      +'<p>The Composer Mode license price is displayed on the payment page at the time of purchase, applicable taxes included. Payment is processed securely by our payment provider LemonSqueezy for the web version, or by Apple/Google for mobile versions. No subscription is required. This is a one-time payment.</p>'
      +'<h3>5. Delivery</h3>'
      +'<p>After payment, a license key is sent by email to the address provided at purchase. Delivery is immediate and electronic. The license key activates Composer Mode features directly within the application.</p>'
      +'<h3>6. Right of Withdrawal and Refund</h3>'
      +'<p>In accordance with Quebec\'s Consumer Protection Act, you have a right of withdrawal. As the product is a digital good delivered immediately, a refund may be requested within 30 days of purchase if the Composer Mode features do not match the advertised description. For any refund request, contact us through the application\'s contact form with your license key.</p>'
      +'<h3>7. License of Use</h3>'
      +'<p>The purchase grants a personal, non-exclusive, non-transferable license of use. The license key is intended for individual use and may be activated on a limited number of devices (maximum 3). Resale, sharing, or distribution of the license key is prohibited.</p>'
      +'<h3>8. Protection of Personal Information</h3>'
      +'<p>In accordance with Quebec\'s Law 25 on the protection of personal information in the private sector and the European Union\'s General Data Protection Regulation (GDPR):</p>'
      +'<ul><li>Only data strictly necessary to process your order is collected (email address for license key delivery).</li>'
      +'<li>No personal data is sold, rented, or shared with third parties for commercial purposes.</li>'
      +'<li>Payment processing is handled by LemonSqueezy, Apple, or Google depending on the platform. We do not have access to your banking information.</li>'
      +'<li>You may exercise your rights of access, rectification, and deletion of your data by contacting us.</li>'
      +'<li>The application does not collect any usage data and contains no advertising trackers.</li></ul>'
      +'<h3>9. Intellectual Property</h3>'
      +'<p>All application content (source code, interface, design, algorithms) is protected by copyright. Any reproduction, modification, decompilation, or reverse engineering is strictly prohibited.</p>'
      +'<h3>10. Limitation of Liability</h3>'
      +'<p>The application is provided "as is." While every effort is made to ensure the accuracy of musical information, the application is not a substitute for professional music theory instruction.</p>'
      +'<h3>11. Governing Law and Jurisdiction</h3>'
      +'<p>These Terms are governed by the laws of the Province of Quebec and the federal laws of Canada applicable therein. Any dispute shall be subject to the exclusive jurisdiction of the courts of the judicial district of Montreal, Quebec, Canada.</p>'
      +'<h3>12. Amendment of Terms</h3>'
      +'<p>We reserve the right to modify these Terms at any time. Modifications take effect upon publication within the application. Purchases made before the modification remain subject to the Terms in effect at the time of purchase.</p>'
      +'<p class="cgv-update">Last updated: April 2026</p>'
  };

  // Render CGV content based on current language
  function renderCGV(){
    var el = document.getElementById('cgvContent');
    if(el) el.innerHTML = CGV[getLang()] || CGV.fr;
  }
  document.addEventListener('DOMContentLoaded', renderCGV);
  // Also update on language change
  var _origSetLang2 = window.setLang;
  if(typeof _origSetLang2 === 'function'){
    window.setLang = function(lang){
      _origSetLang2(lang);
      setTimeout(function(){
        addOverlays();
        updateTabs();
        renderCGV();
      }, 50);
    };
  }

})();
