// js/google-drive.js
// Intégration Google Drive — OAuth2 PKCE, scope limité drive.file
// Sécurité : token uniquement en mémoire (jamais localStorage), clientId seul exposé
// ⚠️  Remplacer GDRIVE_CLIENT_ID par votre vrai Client ID Google Cloud Console

(function(global){
  'use strict';

  /* ══════════════════════════════════════════════════════════════
     CONFIG — à remplacer après création du projet Google Cloud
     ══════════════════════════════════════════════════════════════ */
  var GDRIVE_CLIENT_ID = 'VOTRE_CLIENT_ID.apps.googleusercontent.com';
  var GDRIVE_SCOPE     = 'https://www.googleapis.com/auth/drive.file';
  var GDRIVE_FOLDER    = 'Contrepoint';

  /* ══════════════════════════════════════════════════════════════
     ÉTAT — token en mémoire uniquement (pas de localStorage)
     ══════════════════════════════════════════════════════════════ */
  var _token      = null;   // { access_token, expires_at }
  var _gapiReady  = false;
  var _gapiLoading = false;
  var _gapiCallbacks = [];

  /* ══════════════════════════════════════════════════════════════
     CHARGEMENT GAPI (lazy, une seule fois)
     ══════════════════════════════════════════════════════════════ */
  function _loadGapi(cb) {
    if (_gapiReady) { cb(null); return; }
    _gapiCallbacks.push(cb);
    if (_gapiLoading) return;
    _gapiLoading = true;
    var s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onerror = function() {
      _gapiLoading = false;
      _gapiCallbacks.forEach(function(fn){ fn(new Error('GAPI load failed')); });
      _gapiCallbacks = [];
    };
    s.onload = function() {
      _gapiReady = true;
      _gapiCallbacks.forEach(function(fn){ fn(null); });
      _gapiCallbacks = [];
    };
    document.head.appendChild(s);
  }

  /* ══════════════════════════════════════════════════════════════
     AUTHENTIFICATION — Google Identity Services (popup)
     ══════════════════════════════════════════════════════════════ */
  function _authenticate() {
    return new Promise(function(resolve, reject) {
      _loadGapi(function(err) {
        if (err) { reject(err); return; }
        // Vérifier si token encore valide (marge 60s)
        if (_token && Date.now() < _token.expires_at - 60000) {
          resolve(_token.access_token);
          return;
        }
        try {
          var client = google.accounts.oauth2.initTokenClient({
            client_id: GDRIVE_CLIENT_ID,
            scope: GDRIVE_SCOPE,
            callback: function(resp) {
              if (resp.error) {
                reject(new Error(resp.error));
                return;
              }
              // Stocker uniquement en mémoire — jamais en localStorage
              _token = {
                access_token: resp.access_token,
                expires_at:   Date.now() + (resp.expires_in || 3600) * 1000
              };
              resolve(_token.access_token);
            }
          });
          client.requestAccessToken({ prompt: '' });
        } catch(e) {
          reject(e);
        }
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════
     TROUVER / CRÉER dossier « Contrepoint » dans Drive
     ══════════════════════════════════════════════════════════════ */
  function _getOrCreateFolder(accessToken) {
    return fetch(
      'https://www.googleapis.com/drive/v3/files?q=' +
      encodeURIComponent("name='" + GDRIVE_FOLDER + "' and mimeType='application/vnd.google-apps.folder' and trashed=false") +
      '&fields=files(id,name)&spaces=drive',
      { headers: { Authorization: 'Bearer ' + accessToken } }
    )
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.files && data.files.length > 0) {
        return data.files[0].id;
      }
      // Créer le dossier
      return fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: GDRIVE_FOLDER,
          mimeType: 'application/vnd.google-apps.folder'
        })
      })
      .then(function(r) { return r.json(); })
      .then(function(f) { return f.id; });
    });
  }

  /* ══════════════════════════════════════════════════════════════
     UPLOAD fichier JSON dans le dossier
     ══════════════════════════════════════════════════════════════ */
  function _uploadFile(accessToken, folderId, filename, jsonContent) {
    var boundary = 'contrepoint_boundary_' + Date.now();
    var metadata = JSON.stringify({
      name: filename,
      parents: [folderId],
      mimeType: 'application/json'
    });
    var body = [
      '--' + boundary,
      'Content-Type: application/json; charset=UTF-8',
      '',
      metadata,
      '--' + boundary,
      'Content-Type: application/json',
      '',
      jsonContent,
      '--' + boundary + '--'
    ].join('\r\n');

    return fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'multipart/related; boundary=' + boundary
      },
      body: body
    })
    .then(function(r) { return r.json(); });
  }

  /* ══════════════════════════════════════════════════════════════
     FONCTION PRINCIPALE — exportToGoogleDrive
     tab       : 'formes' | 'sequences' | 'analyseur'
     content   : objet JS (données du module)
     metadata  : { title, description, tonalite }
     onSuccess : function(link) — lien Drive shareable
     onError   : function(err)
     ══════════════════════════════════════════════════════════════ */
  function exportToGoogleDrive(tab, content, metadata, onSuccess, onError) {
    var lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';
    var date = new Date().toISOString().slice(0, 10);
    var filename = 'Contrepoint_' + tab + '_' + date + '.json';

    var composition = {
      timestamp: Date.now(),
      tab:       tab,
      lang:      lang,
      content:   content,
      metadata:  metadata || {}
    };
    var jsonContent = JSON.stringify(composition, null, 2);

    _authenticate()
      .then(function(accessToken) {
        return _getOrCreateFolder(accessToken)
          .then(function(folderId) {
            return _uploadFile(accessToken, folderId, filename, jsonContent);
          });
      })
      .then(function(file) {
        var link = file.webViewLink || ('https://drive.google.com/file/d/' + file.id + '/view');
        if (typeof onSuccess === 'function') onSuccess(link);
      })
      .catch(function(err) {
        console.error('[GoogleDrive] Erreur:', err);
        if (typeof onError === 'function') onError(err);
      });
  }

  /* ══════════════════════════════════════════════════════════════
     DÉCONNEXION (révoque le token mémoire)
     ══════════════════════════════════════════════════════════════ */
  function signOut() {
    if (_token && global.google && google.accounts && google.accounts.oauth2) {
      google.accounts.oauth2.revoke(_token.access_token);
    }
    _token = null;
  }

  /* ══════════════════════════════════════════════════════════════
     HELPERS UI — notification toast
     ══════════════════════════════════════════════════════════════ */
  function _showDriveToast(msg, isError) {
    var el = document.getElementById('gdriveToast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'gdriveToast';
      el.style.cssText = [
        'position:fixed;bottom:24px;right:24px;z-index:9999',
        'padding:12px 18px;border-radius:10px;font-size:13px;font-weight:500',
        'box-shadow:0 4px 20px rgba(0,0,0,.18);transition:opacity .3s',
        'max-width:320px;line-height:1.5'
      ].join(';');
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.background = isError ? '#fee2e2' : '#d1fae5';
    el.style.color       = isError ? '#991b1b' : '#065f46';
    el.style.border      = '1px solid ' + (isError ? '#fca5a5' : '#6ee7b7');
    el.style.opacity     = '1';
    clearTimeout(el._timeout);
    el._timeout = setTimeout(function() { el.style.opacity = '0'; }, 4000);
  }

  /* ══════════════════════════════════════════════════════════════
     BOUTON HELPER — affiche spinner + gère callback
     ══════════════════════════════════════════════════════════════ */
  function handleDriveButtonClick(btn, tab, getContent, getMetadata) {
    var lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';
    var labels = {
      fr: { saving: '⏳ Connexion…', ok: '✅ Sauvegardé !', err: '❌ Erreur Drive' },
      en: { saving: '⏳ Connecting…', ok: '✅ Saved!',        err: '❌ Drive Error' },
      es: { saving: '⏳ Conectando…', ok: '✅ ¡Guardado!',    err: '❌ Error Drive' }
    };
    var L = labels[lang] || labels.fr;
    var origText = btn.textContent;
    btn.disabled = true;
    btn.textContent = L.saving;

    exportToGoogleDrive(
      tab,
      getContent(),
      getMetadata(),
      function(link) {
        btn.textContent = L.ok;
        btn.disabled = false;
        _showDriveToast(L.ok + ' → ' + link);
        setTimeout(function() { btn.textContent = origText; }, 2500);
      },
      function() {
        btn.textContent = L.err;
        btn.disabled = false;
        _showDriveToast(L.err, true);
        setTimeout(function() { btn.textContent = origText; }, 2500);
      }
    );
  }

  /* ══════════════════════════════════════════════════════════════
     WRAPPERS PAR MODULE (appelés depuis les onclick HTML)
     ══════════════════════════════════════════════════════════════ */

  global.FM_exportToGoogleDrive = function(btn) {
    handleDriveButtonClick(btn, 'formes',
      function() {
        // Récupérer l'état du module Formes
        try {
          return typeof FM_getState === 'function' ? FM_getState() : { raw: true };
        } catch(e) { return {}; }
      },
      function() {
        var nameEl = document.getElementById('fm_projName');
        return {
          title:       nameEl ? nameEl.value : 'Projet Formes',
          description: 'Export Formes musicales',
          tonalite:    (function(){
            var k = document.getElementById('fm_globalKey');
            var m = document.getElementById('fm_globalMode');
            return (k ? k.value : '') + ' ' + (m ? m.value : '');
          })()
        };
      }
    );
  };

  global.SEQ_exportToGoogleDrive = function(btn) {
    handleDriveButtonClick(btn, 'sequences',
      function() {
        try {
          return typeof SEQ_getState === 'function' ? SEQ_getState() : { raw: true };
        } catch(e) { return {}; }
      },
      function() {
        return {
          title:       'Séquences harmoniques',
          description: 'Export Séquences',
          tonalite:    ''
        };
      }
    );
  };

  global.AH_exportToGoogleDrive = function(btn) {
    handleDriveButtonClick(btn, 'analyseur',
      function() {
        try {
          return typeof AH_getState === 'function' ? AH_getState() : { raw: true };
        } catch(e) { return {}; }
      },
      function() {
        return {
          title:       'Analyse SATB',
          description: 'Export Analyseur SATB',
          tonalite:    ''
        };
      }
    );
  };

  global.GDrive = { exportToGoogleDrive: exportToGoogleDrive, signOut: signOut };

})(window);
