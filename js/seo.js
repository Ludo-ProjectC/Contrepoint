(function(){
  function getCurrentLang(){
    return (typeof currentLang !== 'undefined') ? currentLang : 'fr';
  }

  function getCanonicalUrl(){
    // Use canonical link if defined, otherwise current location
    var canon = document.querySelector('link[rel="canonical"]');
    return canon ? canon.href : window.location.href;
  }

  function getShareText(){
    var lang = getCurrentLang();
    var v = (typeof I18N !== 'undefined' && I18N['share.text']) ? I18N['share.text'] : null;
    if(v) return v[lang] || v.fr;
    return 'Contrepoint — Free interactive music theory tools';
  }

  function getShareTitle(){
    return 'Contrepoint — Music Theory Tools';
  }

  // Open & close modal
  window.openShareModal = function(){
    var bg = document.getElementById('shareModal');
    if(!bg) return;
    var urlEl = document.getElementById('shareUrlText');
    if(urlEl) urlEl.textContent = getCanonicalUrl();
    bg.classList.add('show');
  };
  window.closeShareModal = function(){
    var bg = document.getElementById('shareModal');
    if(bg) bg.classList.remove('show');
  };

  // Toast feedback
  function showToast(){
    var t = document.getElementById('shareToast');
    if(!t) return;
    t.classList.add('show');
    setTimeout(function(){ t.classList.remove('show'); }, 2200);
  }

  // Copy to clipboard with fallback
  function copyToClipboard(text){
    if(navigator.clipboard && navigator.clipboard.writeText){
      return navigator.clipboard.writeText(text);
    }
    // Fallback for older browsers
    return new Promise(function(resolve, reject){
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        resolve();
      } catch(e){ reject(e); }
    });
  }

  // Main share dispatcher
  window.shareTo = function(network){
    var url = getCanonicalUrl();
    var text = getShareText();
    var title = getShareTitle();
    var encUrl = encodeURIComponent(url);
    var encText = encodeURIComponent(text);
    var encTitle = encodeURIComponent(title);
    var shareUrl = '';

    switch(network){
      case 'x':
        shareUrl = 'https://x.com/intent/tweet?url=' + encUrl + '&text=' + encText;
        break;
      case 'facebook':
        shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encUrl + '&quote=' + encText;
        break;
      case 'reddit':
        shareUrl = 'https://www.reddit.com/submit?url=' + encUrl + '&title=' + encTitle;
        break;
      case 'linkedin':
        shareUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encUrl;
        break;
      case 'whatsapp':
        shareUrl = 'https://api.whatsapp.com/send?text=' + encText + '%20' + encUrl;
        break;
      case 'pinterest':
        // Pinterest needs an image; use og:image if available
        var ogImg = document.querySelector('meta[property="og:image"]');
        var imgUrl = ogImg ? ogImg.getAttribute('content') : '';
        shareUrl = 'https://pinterest.com/pin/create/button/?url=' + encUrl
          + '&description=' + encText
          + (imgUrl ? '&media=' + encodeURIComponent(imgUrl) : '');
        break;
      case 'email':
        shareUrl = 'mailto:?subject=' + encTitle + '&body=' + encText + '%0A%0A' + encUrl;
        break;
      case 'copy':
        copyToClipboard(url).then(function(){
          showToast();
          // Visual feedback on the copy button if visible
          var btn = document.getElementById('shareUrlCopy');
          if(btn){
            var origLang = getCurrentLang();
            var copiedTxt = {fr:'Copié !', en:'Copied!', es:'¡Copiado!'}[origLang] || 'Copied!';
            var origText = btn.textContent;
            btn.textContent = copiedTxt;
            btn.classList.add('copied');
            setTimeout(function(){
              btn.textContent = origText;
              btn.classList.remove('copied');
            }, 1800);
          }
        }).catch(function(){
          // Fallback: just show the URL
          alert(url);
        });
        return;
      default:
        return;
    }

    if(network === 'email'){
      window.location.href = shareUrl;
    } else {
      var w = 600, h = 540;
      var left = (window.innerWidth - w) / 2 + (window.screenX || 0);
      var top = (window.innerHeight - h) / 2 + (window.screenY || 0);
      window.open(shareUrl, 'share-window',
        'width=' + w + ',height=' + h + ',left=' + left + ',top=' + top + ',resizable=yes,scrollbars=yes');
    }
  };

  // Update share modal URL display when language changes (URLs may have ?lang=)
  var _origSetLang3 = window.setLang;
  if(typeof _origSetLang3 === 'function'){
    window.setLang = function(lang){
      _origSetLang3(lang);
      var urlEl = document.getElementById('shareUrlText');
      if(urlEl) urlEl.textContent = getCanonicalUrl();
    };
  }

  // Aliases for compatibility with pre-existing footer markup
  window.shareNet = window.shareTo;
  window.copyAppLink = function(){ return window.shareTo('copy'); };

  // ESC key closes modal
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      var bg = document.getElementById('shareModal');
      if(bg && bg.classList.contains('show')) closeShareModal();
    }
  });
})();
