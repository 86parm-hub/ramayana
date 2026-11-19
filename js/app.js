/* ==========================================================================
   RAMAYANA (2026) - STUDIO CINEMA MAX OTT ENGINE
   Multi-Page Switching, High-Resolution Carousel, Player & Touch Seeking
   ========================================================================== */

// ==========================================================================
// SANDFLIX ADVANCED AD-SHIELD & LINK NEUTRALIZER (Strict Ad Protection)
// ==========================================================================
(function() {
  // Override window.open globally to prevent popup ad screens
  if (!window._adShieldActive) {
    window._adShieldActive = true;
    const _origOpen = window.open;
    window.open = function(url, target, features) {
      console.warn('[Sandflix AdShield] Blocked popup window.open attempt:', url);
      return null;
    };

    // Unlink all ad anchors
    window.unlinkAdElements = function() {
      const adKeywords = [
        'ad.', 'ads.', 'adserver', 'doubleclick', 'googleadservices', 'histats', 
        'propellerads', 'adsterra', 'popads', 'popcash', 'exoclick', 'clickadu',
        'hilltopads', 'juicyads', 'trafficjunky', 'betting', 'casino', 'redirect',
        'syndication', 'gussiessmutchy', 'outbrain', 'taboola', 'asb.html', 'popunder'
      ];
      try {
        const anchors = document.querySelectorAll('a[href]');
        anchors.forEach(a => {
          const href = (a.getAttribute('href') || '').toLowerCase();
          if (href && !href.startsWith('javascript:') && href !== '#') {
            if (adKeywords.some(k => href.includes(k))) {
              a.setAttribute('data-original-href', href);
              a.setAttribute('href', 'javascript:void(0);');
              a.removeAttribute('target');
              a.setAttribute('data-ad-blocked', 'true');
              a.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }, true);
            }
          }
        });
      } catch(e) {}
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', window.unlinkAdElements);
    } else {
      window.unlinkAdElements();
    }
  }
})();

// ==========================================================================
// UNIFIED HISTORY & DEVICE BACK NAVIGATION ENGINE (Mobile / Tablet / Desktop)
// ==========================================================================

function pushAppState(stateObj, url) {
  try {
    if (window.history && window.history.pushState) {
      window.history.pushState(stateObj, '', url || window.location.href);
    }
  } catch (e) {
    try {
      if (url && url.startsWith('#')) {
        window.location.hash = url;
      }
    } catch (err) {}
  }
}

function replaceAppState(stateObj, url) {
  try {
    if (window.history && window.history.replaceState) {
      window.history.replaceState(stateObj, '', url || window.location.href);
    }
  } catch (e) {}
}

function getCurrentActivePage() {
  const activeView = document.querySelector('.page-view.active');
  if (!activeView) return 'home';
  if (activeView.id === 'movies-view') return 'movies';
  if (activeView.id === 'gallery-view') return 'gallery';
  if (activeView.id === 'search-view') return 'search';
  return 'home';
}

// Global Page Switcher Function
function switchPage(pageKey, fromHistory) {
  if (pageKey === 'watch') {
    openNetflixBlackPlayer('act1');
    return;
  }
  if (pageKey === 'trailer') {
    openNetflixBlackPlayer('trailer');
    return;
  }
  const pageMap = {
    'home': 'home-view',
    'movies': 'movies-view',
    'gallery': 'gallery-view',
    'search': 'search-view'
  };

  const targetId = pageMap[pageKey] || 'home-view';

  // Pause trailer video if leaving trailer page
  const trailerVideo = document.getElementById('trailerVideo');
  if (trailerVideo && pageKey !== 'trailer' && !trailerVideo.paused) {
    try { trailerVideo.pause(); } catch(e){}
  }

  // Toggle active view
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.remove('active');
  });

  const activeView = document.getElementById(targetId);
  const homeBbVideo = document.getElementById('homeBillboardVideo');
  const moviesBbVideo = document.getElementById('moviesBillboardVideo');

  if (pageKey === 'home') {
    if (typeof initHomeBillboard === 'function') initHomeBillboard();
    if (moviesBbVideo && !moviesBbVideo.paused) moviesBbVideo.pause();
  } else if (pageKey === 'movies') {
    if (typeof initMoviesBillboard === 'function') initMoviesBillboard();
    if (homeBbVideo && !homeBbVideo.paused) homeBbVideo.pause();
  } else if (pageKey === 'search') {
    if (homeBbVideo && !homeBbVideo.paused) homeBbVideo.pause();
    if (moviesBbVideo && !moviesBbVideo.paused) moviesBbVideo.pause();
    const dWidget = document.getElementById('netflixSearchWidget');
    if (dWidget) dWidget.classList.add('open');
    const dInput = document.getElementById('desktopSearchInput');
    if (dInput && window.innerWidth > 768) {
      setTimeout(() => dInput.focus(), 80);
    }
    if (typeof applyDesktopSearchFilter === 'function') applyDesktopSearchFilter();
  } else {
    if (homeBbVideo && !homeBbVideo.paused) homeBbVideo.pause();
    if (moviesBbVideo && !moviesBbVideo.paused) moviesBbVideo.pause();
  }
  if (activeView) {
    activeView.classList.add('active');
  }

  // Update desktop navigation tabs
  document.querySelectorAll('.tab-link').forEach(tab => {
    if (tab.getAttribute('data-target') === targetId) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Update mobile bottom navigation bar items
  document.querySelectorAll('.mobile-nav-item').forEach(item => {
    if (item.getAttribute('data-target') === targetId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Scroll to top of the page smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update URL hash & push state if not from history popstate
  if (!fromHistory) {
    const currentState = window.history.state;
    if (!currentState || currentState.page !== pageKey || currentState.type !== 'page') {
      pushAppState({ type: 'page', page: pageKey }, `#${pageKey}`);
    }
  }
}
window.switchPage = switchPage;

// Act Switcher Engine (Act 1: 01:30:07 | Act 2: 01:30:16)
const ACT_CONFIG = {
  act1: {
    title: 'Part 1: Act 1 (The Divine Beginning)',
    duration: '01:30:07',
    startOffset: 3.0,
    cloudUrl: 'https://github.com/86parm-hub/ramayana/releases/download/v1.0/Ramayana.Part1.Act1.mp4#t=3',
    localUrl: 'Ramayana.Part1.Act1.mp4'
  },
  act2: {
    title: 'Part 1: Act 2 (The Forest Exile & Awakening)',
    duration: '01:30:16',
    startOffset: 0,
    cloudUrl: 'https://github.com/86parm-hub/ramayana/releases/download/v1.0/Ramayana.Part1.Act2.mp4',
    localUrl: 'Ramayana.Part1.Act2.mp4'
  }
};

let activeActKey = 'act1';

// Outro Card Handlers
window.closeOutroCard = function () {
  const card = document.getElementById('theaterOutroCard');
  if (card) card.classList.remove('active');
};

window.handleOutroNext = function () {
  window.closeOutroCard();
  if (activeActKey === 'act1') {
    window.selectAct('act2');
  } else {
    window.selectAct('act1');
  }
};

window.handleOutroReplay = function () {
  window.closeOutroCard();
  const video = document.getElementById('videoPlayer');
  if (video) {
    const isLocal = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const offset = (!isLocal && activeActKey === 'act1') ? 3.0 : 0;
    video.currentTime = offset;
    video.play().catch(e => console.log('Replay deferred:', e));
  }
};

window.selectAct = function (actKey) {
  activeActKey = 'act1';
  if (typeof openNetflixBlackPlayer === 'function') {
    openNetflixBlackPlayer('act1');
  }
};

// Global Quick Stream Trigger
function startCinemaStream() {
  openNetflixBlackPlayer('act1');
}
window.startCinemaStream = startCinemaStream;

// Section Switch Helper
function scrollToChapters() {
  switchPage('home');
}

// Global Trilogy Data for Coming Soon Modal
const trilogyData = {
  2: {
    part: "PART TWO",
    year: "Diwali 2028",
    title: "RAMAYANA: PART TWO",
    subtitle: "The Divine Quest & The Exile",
    timeline: "COMING SOON 2028",
    statusBadge: "IN PRE-PRODUCTION • RELEASING 2028",
    description: "Witness the monumental saga continue. Lord Rama, Mata Sita, and Lakshmana journey deep into Panchavati. From the fateful deception of the Golden Deer to the supreme devotion of Lord Hanuman in Kishkindha, the stage is set for the epic crossing of the southern ocean.",
    cast: "Ranbir Kapoor (Lord Rama) • Sai Pallavi (Mata Sita) • Yash (Ravana) • Sunny Deol (Lord Hanuman) • Directed by Nitesh Tiwari",
    image: "assets/images/feature_banner_hd.jpg"
  },
  3: {
    part: "PART THREE",
    year: "Diwali 2029",
    title: "RAMAYANA: PART THREE",
    subtitle: "The Dharma Yuddha & Grand Coronation",
    timeline: "COMING SOON 2029",
    statusBadge: "IN CONCEPT & VFX • RELEASING 2029",
    description: "The grand cinematic climax. The architectural miracle of Ram Setu across the vast ocean, the fierce cosmic clash between the Vanara Sena and the legions of Lanka, the historic destruction of Dashanana Ravana, and the celestial coronation of Lord Rama in Ayodhya.",
    cast: "Ranbir Kapoor (Lord Rama) • Yash (Ravana) • Sai Pallavi (Mata Sita) • Sunny Deol (Lord Hanuman) • Music by A.R. Rahman & Hans Zimmer",
    image: "assets/images/movie_poster_hd.jpg"
  }
};

let currentModalPart = 2;

function openComingSoonModal(partNum, fromHistory) {
  const modal = document.getElementById('comingSoonModal');
  if (!modal) return;

  currentModalPart = partNum;
  const data = trilogyData[partNum] || trilogyData[2];

  const badgeEl = document.getElementById('modalPartBadge');
  const titleEl = document.getElementById('modalPartTitle');
  const subEl = document.getElementById('modalPartSubtitle');
  const descEl = document.getElementById('modalPartDesc');
  const castEl = document.getElementById('modalPartCast');
  const statusEl = document.getElementById('modalPartStatus');
  const yearEl = document.getElementById('modalReleaseYear');
  const imgEl = document.getElementById('modalBannerImg');
  const notifyTextEl = document.getElementById('notifyBtnText');

  if (badgeEl) {
    badgeEl.textContent = data.timeline;
    if (partNum === 3) {
      badgeEl.className = 'modal-status-badge saffron';
    } else {
      badgeEl.className = 'modal-status-badge';
    }
  }
  if (titleEl) titleEl.textContent = data.title;
  if (subEl) subEl.textContent = data.subtitle;
  if (descEl) descEl.textContent = data.description;
  if (castEl) castEl.textContent = data.cast;
  if (statusEl) statusEl.textContent = data.statusBadge;
  if (yearEl) yearEl.textContent = data.year;
  if (imgEl) imgEl.src = data.image;
  if (notifyTextEl) notifyTextEl.textContent = `Get Notified for Part ${partNum} Release`;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  if (!fromHistory) {
    const curPage = getCurrentActivePage();
    pushAppState({ type: 'coming-soon', partNum: partNum, prevPage: curPage }, '#coming-soon');
  }
}

function closeComingSoonModal(fromHistory) {
  if (!fromHistory && window.history && window.history.state && window.history.state.type === 'coming-soon') {
    window.history.back();
    return;
  }

  const modal = document.getElementById('comingSoonModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (!fromHistory && window.location.hash === '#coming-soon') {
    const prevPage = (window.history.state && window.history.state.prevPage) || getCurrentActivePage();
    replaceAppState({ type: 'page', page: prevPage }, '#' + prevPage);
  }
}
window.openComingSoonModal = openComingSoonModal;
window.closeComingSoonModal = closeComingSoonModal;

function notifyMeAlert() {
  const btn = document.getElementById('modalNotifyBtn');
  const txt = document.getElementById('notifyBtnText');
  if (btn && txt) {
    btn.classList.add('success');
    txt.textContent = `✓ Watchlist Added! Notified for Part ${currentModalPart} (${currentModalPart === 2 ? '2028' : '2029'})`;
    setTimeout(() => {
      txt.textContent = `Get Notified for Part ${currentModalPart} Release`;
      btn.classList.remove('success');
      closeComingSoonModal();
    }, 1800);
  }
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeComingSoonModal();
  }
});

// Hero Carousel cleaned (replaced by Netflix Billboard)

// DOM Ready Handlers
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const video = document.getElementById('videoPlayer');
  const videoChassis = document.getElementById('videoChassis');
  const screenAmbientGlow = document.getElementById('screenAmbientGlow');
  const centerPlayVeil = document.getElementById('centerPlayVeil');
  const centerPlayOrb = document.getElementById('centerPlayOrb');
  const btnPlayPause = document.getElementById('btnPlayPause');
  const btnRewind10 = document.getElementById('btnRewind10');
  const btnForward10 = document.getElementById('btnForward10');
  const btnSoundToggle = document.getElementById('btnSoundToggle');
  const volSlider = document.getElementById('volSlider');
  const txtCurrentTime = document.getElementById('txtCurrentTime');
  const txtDurationTime = document.getElementById('txtDurationTime');
  const scrubberBar = document.getElementById('scrubberBar');
  const scrubPlayedFill = document.getElementById('scrubPlayedFill');
  const scrubHoverFill = document.getElementById('scrubHoverFill');
  const scrubBufferFill = document.getElementById('scrubBufferFill');
  const scrubTooltip = document.getElementById('scrubTooltip');
  const btnPlaybackRate = document.getElementById('btnPlaybackRate');
  const speedPanel = document.getElementById('speedPanel');
  const speedChoices = document.querySelectorAll('.speed-choice');
  const btnPiP = document.getElementById('btnPiP');
  const btnFullscreen = document.getElementById('btnFullscreen');
  const streamSpinnerVeil = document.getElementById('streamSpinnerVeil');
  const offlineFileModal = document.getElementById('offlineFileModal');
  const localFileInput = document.getElementById('localFileInput');
  const fileNote = document.getElementById('fileNote');

  let controlsHideTimer = null;
  let isDraggingScrub = false;

  // Permanent Official GitHub CDN Stream Endpoints (100% Autonomous, No PC Needed)
  const CLOUD_STREAM_URL = 'https://github.com/86parm-hub/ramayana/releases/download/v1.0/Ramayana.Part1.Act1.mp4';
  const LOCAL_STREAM_URL = 'Ramayana.Part1.Act1.mp4';

  const isLocal = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  function getStartOffset() {
    return (!isLocal && activeActKey === 'act1') ? 3.0 : 0;
  }

  video.src = isLocal ? LOCAL_STREAM_URL : CLOUD_STREAM_URL;
  video.poster = 'assets/images/movie_cover_hd.jpg';
  video.load();

  // Auto carousel interval removed (Billboard is active)

  // Time Formatter
  function formatTime(sec) {
    if (isNaN(sec) || sec === Infinity) return '00:00:00';
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  // Play / Pause Logic
  function togglePlay() {
    if (video.paused || video.ended) {
      streamSpinnerVeil.classList.add('active');
      const offset = getStartOffset();
      if (offset > 0 && video.currentTime < offset) {
        video.currentTime = offset;
      }
      video.play().then(() => {
        if (offset > 0 && video.currentTime < offset) {
          video.currentTime = offset;
        }
        videoChassis.classList.add('is-playing');
        if (offlineFileModal) offlineFileModal.classList.remove('visible');
        streamSpinnerVeil.classList.remove('active');
        resetHideTimer();
      }).catch(err => {
        streamSpinnerVeil.classList.remove('active');
        console.warn('Playback error / User interaction needed:', err);
      });
    } else {
      video.pause();
      videoChassis.classList.remove('is-playing');
      streamSpinnerVeil.classList.remove('active');
      showControls();
    }
  }

  function syncPlayUI() {
    if (video.paused) {
      videoChassis.classList.remove('is-playing');
      showControls();
    } else {
      videoChassis.classList.add('is-playing');
      resetHideTimer();
    }
  }

  video.addEventListener('play', () => {
    syncPlayUI();
    const offset = getStartOffset();
    if (offset > 0 && video.currentTime < offset) {
      video.currentTime = offset;
    }
  });
  video.addEventListener('pause', syncPlayUI);
  centerPlayOrb.addEventListener('click', togglePlay);
  btnPlayPause.addEventListener('click', togglePlay);
  video.addEventListener('click', togglePlay);

  // Rewind & Fast Forward 10s
  btnRewind10.addEventListener('click', () => {
    const offset = getStartOffset();
    video.currentTime = Math.max(offset, video.currentTime - 10);
    resetHideTimer();
  });

  btnForward10.addEventListener('click', () => {
    video.currentTime = Math.min(video.duration || 0, video.currentTime + 10);
    resetHideTimer();
  });

  // Sound Controls
  function applyVolume(vol) {
    video.volume = vol;
    video.muted = (vol === 0);
    volSlider.value = vol;
    if (video.muted || vol === 0) {
      videoChassis.classList.add('is-muted');
    } else {
      videoChassis.classList.remove('is-muted');
    }
  }

  btnSoundToggle.addEventListener('click', () => {
    video.muted = !video.muted;
    if (video.muted) {
      videoChassis.classList.add('is-muted');
    } else {
      videoChassis.classList.remove('is-muted');
      if (video.volume === 0) video.volume = 0.5;
      volSlider.value = video.volume;
    }
    resetHideTimer();
  });

  volSlider.addEventListener('input', (e) => {
    applyVolume(parseFloat(e.target.value));
  });

  // Time & Buffer Tracking
  video.addEventListener('timeupdate', () => {
    const offset = getStartOffset();
    if (offset > 0 && video.currentTime < (offset - 0.1) && !video.paused) {
      video.currentTime = offset;
    }
    const curTime = Math.max(0, (video.currentTime || 0) - offset);
    const durTime = Math.max(0, (video.duration || 0) - offset);
    if (!isDraggingScrub) {
      txtCurrentTime.textContent = formatTime(curTime);
      if (durTime > 0) {
        const pct = Math.min(100, Math.max(0, (curTime / durTime) * 100));
        scrubPlayedFill.style.width = `${pct}%`;
      }
    }
    updateBufferDisplay();
  });

  video.addEventListener('loadedmetadata', () => {
    const offset = getStartOffset();
    const durTime = Math.max(0, (video.duration || 0) - offset);
    txtDurationTime.textContent = formatTime(durTime);
    offlineFileModal.classList.remove('visible');
    if (offset > 0 && video.currentTime < offset) {
      video.currentTime = offset;
    }
  });

  video.addEventListener('durationchange', () => {
    const offset = getStartOffset();
    const durTime = Math.max(0, (video.duration || 0) - offset);
    txtDurationTime.textContent = formatTime(durTime);
  });

  function updateBufferDisplay() {
    const offset = getStartOffset();
    const durTime = Math.max(0, (video.duration || 0) - offset);
    if (video.buffered.length > 0 && durTime > 0) {
      const rawEnd = video.buffered.end(video.buffered.length - 1);
      const end = Math.max(0, rawEnd - offset);
      const pct = Math.min(100, (end / durTime) * 100);
      scrubBufferFill.style.width = `${pct}%`;
    }
  }
  video.addEventListener('progress', updateBufferDisplay);

  // Netflix Spinner on buffer, seek & Stream Resilience
  video.addEventListener('waiting', () => {
    streamSpinnerVeil.classList.add('active');
  });
  video.addEventListener('seeking', () => {
    streamSpinnerVeil.classList.add('active');
  });
  video.addEventListener('seeked', () => {
    streamSpinnerVeil.classList.remove('active');
  });
  video.addEventListener('canplay', () => {
    streamSpinnerVeil.classList.remove('active');
    if (offlineFileModal) offlineFileModal.classList.remove('visible');
  });
  video.addEventListener('playing', () => {
    streamSpinnerVeil.classList.remove('active');
    if (offlineFileModal) offlineFileModal.classList.remove('visible');
  });
  video.addEventListener('error', (e) => {
    console.warn('Video stream error/check:', e);
    streamSpinnerVeil.classList.remove('active');
  });

  // Trailer Player Netflix Spinner Wiring
  const trailerVideo = document.getElementById('trailerVideo');
  const trailerSpinnerVeil = document.getElementById('trailerSpinnerVeil');
  if (trailerVideo && trailerSpinnerVeil) {
    trailerVideo.addEventListener('waiting', () => trailerSpinnerVeil.classList.add('active'));
    trailerVideo.addEventListener('seeking', () => trailerSpinnerVeil.classList.add('active'));
    trailerVideo.addEventListener('seeked', () => trailerSpinnerVeil.classList.remove('active'));
    trailerVideo.addEventListener('playing', () => trailerSpinnerVeil.classList.remove('active'));
    trailerVideo.addEventListener('canplay', () => trailerSpinnerVeil.classList.remove('active'));
    trailerVideo.addEventListener('error', () => trailerSpinnerVeil.classList.remove('active'));
  }

  // Cinematic Ending: AI SYNDICAT Outro Branding Card
  video.addEventListener('ended', () => {
    const outroCard = document.getElementById('theaterOutroCard');
    const title = document.getElementById('outroTitle');
    const sub = document.getElementById('outroSubtitle');
    const nextBtnTxt = document.getElementById('btnOutroNextText');

    if (outroCard) {
      if (activeActKey === 'act1') {
        if (title) title.textContent = "RAMAYANA: PART ONE";
        if (sub) sub.textContent = "Act 1: The Divine Beginning Complete • Ready for Act 2!";
        if (nextBtnTxt) nextBtnTxt.textContent = "Play Act 2 Now (Forest Exile)";
      } else {
        if (title) title.textContent = "RAMAYANA: PART ONE (COMPLETE)";
        if (sub) sub.textContent = "Part 1 Complete • Part 2 Coming Soon (Diwali 2028)";
        if (nextBtnTxt) nextBtnTxt.textContent = "Replay Full Movie (Act 1)";
      }
      outroCard.classList.add('active');
    }
  });

  // Seeking Logic (Smooth for Touch & Mouse)
  function seekToX(clientX) {
    const rect = scrubberBar.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    scrubPlayedFill.style.width = `${pos * 100}%`;
    const offset = getStartOffset();
    const durTime = Math.max(0, (video.duration || 0) - offset);
    if (durTime > 0) {
      video.currentTime = offset + (pos * durTime);
      txtCurrentTime.textContent = formatTime(pos * durTime);
    }
  }

  scrubberBar.addEventListener('mousedown', (e) => {
    isDraggingScrub = true;
    seekToX(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (isDraggingScrub) seekToX(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    if (isDraggingScrub) isDraggingScrub = false;
  });

  // Mobile Touch Seeking
  scrubberBar.addEventListener('touchstart', (e) => {
    isDraggingScrub = true;
    if (e.touches && e.touches[0]) seekToX(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (isDraggingScrub && e.touches && e.touches[0]) seekToX(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    if (isDraggingScrub) isDraggingScrub = false;
  });

  // Scrubber Hover Tooltip
  scrubberBar.addEventListener('mousemove', (e) => {
    const rect = scrubberBar.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    scrubHoverFill.style.width = `${pos * 100}%`;
    scrubTooltip.style.left = `${pos * 100}%`;
    const offset = getStartOffset();
    const durTime = Math.max(0, (video.duration || 0) - offset);
    if (durTime > 0) {
      scrubTooltip.textContent = formatTime(pos * durTime);
    }
  });

  // Playback Rate
  btnPlaybackRate.addEventListener('click', (e) => {
    e.stopPropagation();
    speedPanel.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    speedPanel.classList.remove('show');
  });

  speedChoices.forEach(choice => {
    choice.addEventListener('click', (e) => {
      e.stopPropagation();
      const rate = parseFloat(choice.getAttribute('data-rate'));
      video.playbackRate = rate;
      btnPlaybackRate.textContent = (rate === 1 ? '1.0x' : `${rate}x`);
      speedChoices.forEach(c => c.classList.remove('active'));
      choice.classList.add('active');
      speedPanel.classList.remove('show');
    });
  });

  // Picture in Picture
  btnPiP.addEventListener('click', async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await video.requestPictureInPicture();
      }
    } catch (e) {
      console.warn('PiP restricted:', e);
    }
  });

  // Fullscreen
  btnFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      if (videoChassis.requestFullscreen) {
        videoChassis.requestFullscreen();
      } else if (videoChassis.webkitRequestFullscreen) {
        videoChassis.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  });

  // Auto Hide Controls
  function showControls() {
    videoChassis.classList.remove('hide-controls');
    clearTimeout(controlsHideTimer);
  }

  function resetHideTimer() {
    showControls();
    if (!video.paused) {
      controlsHideTimer = setTimeout(() => {
        videoChassis.classList.add('hide-controls');
      }, 2800);
    }
  }

  videoChassis.addEventListener('mousemove', resetHideTimer);
  videoChassis.addEventListener('touchstart', resetHideTimer, { passive: true });
  videoChassis.addEventListener('mouseleave', () => {
    if (!video.paused) videoChassis.classList.add('hide-controls');
  });

  // Ambient Glow & Lights Out
  window.toggleCinemaAmbient = function () {
    screenAmbientGlow.classList.toggle('hidden');
    const glowBtn = document.getElementById('theaterGlowBtn');
    const status = glowBtn.querySelector('.toggle-status');
    if (screenAmbientGlow.classList.contains('hidden')) {
      status.textContent = 'OFF';
      status.style.background = '#64748b';
    } else {
      status.textContent = 'ON';
      status.style.background = 'var(--gold-pri)';
    }
  };

  window.toggleLightsOut = function () {
    document.body.classList.toggle('lights-out');
    const btn = document.getElementById('theaterLightsBtn');
    if (document.body.classList.contains('lights-out')) {
      btn.style.background = 'var(--gold-pri)';
      btn.style.color = '#000';
    } else {
      btn.style.background = '';
      btn.style.color = '';
    }
  };

  // Keyboard Shortcuts (Space, Left, Right, Up, Down, M, F, P, 0-9)
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key.toLowerCase()) {
      case ' ':
      case 'k':
        e.preventDefault();
        togglePlay();
        break;
      case 'arrowleft':
      case 'j':
        e.preventDefault();
        video.currentTime = Math.max(getStartOffset(), video.currentTime - 10);
        resetHideTimer();
        break;
      case 'arrowright':
      case 'l':
        e.preventDefault();
        video.currentTime = Math.min(video.duration || 0, video.currentTime + 10);
        resetHideTimer();
        break;
      case 'arrowup':
        e.preventDefault();
        applyVolume(Math.min(1, video.volume + 0.05));
        resetHideTimer();
        break;
      case 'arrowdown':
        e.preventDefault();
        applyVolume(Math.max(0, video.volume - 0.05));
        resetHideTimer();
        break;
      case 'm':
        e.preventDefault();
        btnSoundToggle.click();
        break;
      case 'f':
        e.preventDefault();
        btnFullscreen.click();
        break;
      case 'p':
        e.preventDefault();
        btnPiP.click();
        break;
      default:
        if (e.key >= '0' && e.key <= '9' && video.duration) {
          e.preventDefault();
          const pct = parseInt(e.key) / 10;
          const offset = getStartOffset();
          const durTime = Math.max(0, (video.duration || 0) - offset);
          video.currentTime = offset + (pct * durTime);
          resetHideTimer();
        }
        break;
    }
  });

  // Local File Selector
  function handleChosenFile(file) {
    if (!file) return;
    streamSpinnerVeil.classList.remove('active');
    offlineFileModal.classList.remove('visible');
    const blobURL = URL.createObjectURL(file);
    video.src = blobURL;
    video.load();
    fileNote.textContent = `Streaming file: ${file.name} (${(file.size / (1024 * 1024 * 1024)).toFixed(2)} GB)`;
    switchPage('watch');
    setTimeout(() => {
      video.play().then(() => {
        videoChassis.classList.add('is-playing');
        resetHideTimer();
      }).catch(err => {
        console.warn('Playback error:', err);
      });
    }, 200);
  }

  if (localFileInput) {
    localFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) handleChosenFile(e.target.files[0]);
    });
  }

  // Drag and drop into chassis
  videoChassis.addEventListener('dragover', (e) => {
    e.preventDefault();
    videoChassis.style.outline = '2px dashed var(--gold-pri)';
  });
  videoChassis.addEventListener('dragleave', (e) => {
    e.preventDefault();
    videoChassis.style.outline = 'none';
  });
  videoChassis.addEventListener('drop', (e) => {
    e.preventDefault();
    videoChassis.style.outline = 'none';
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleChosenFile(e.dataTransfer.files[0]);
    }
  });

  // Initialize Dedicated Movie Trailer Player
  initTrailerPlayer();

  // URL Hash Routing on page load
  const hash = window.location.hash.replace('#', '');
  if (hash && ['home', 'movies', 'trailer', 'watch', 'gallery', 'search'].includes(hash)) {
    switchPage(hash);
  }
});

/* ==========================================================================
   DEDICATED MOVIE TRAILER ENGINE
   ========================================================================== */
function initTrailerPlayer() {
  const video = document.getElementById('trailerVideo');
  const playOverlay = document.getElementById('trailerPlayOverlay');
  const playIcon = document.getElementById('trailerPlayIcon');
  const pauseIcon = document.getElementById('trailerPauseIcon');
  const muteBtn = document.getElementById('trailerMuteBtn');
  const volIcon = document.getElementById('trailerVolIcon');
  const timeDisplay = document.getElementById('trailerTimeDisplay');
  const scrubTrack = document.getElementById('trailerScrubTrack');
  const scrubFill = document.getElementById('trailerScrubFill');
  const scrubLoaded = document.getElementById('trailerScrubLoaded');
  const chassis = document.getElementById('trailerChassis');
  if (!video) return;

  window.toggleTrailerPlayback = function () {
    if (video.paused || video.ended) {
      video.play().catch(e => console.log('Autoplay prevented', e));
    } else {
      video.pause();
    }
  };

  window.toggleTrailerMute = function () {
    video.muted = !video.muted;
    if (volIcon) {
      if (video.muted) {
        volIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
      } else {
        volIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
      }
    }
  };

  window.toggleTrailerFullscreen = function () {
    if (!document.fullscreenElement) {
      if (chassis && chassis.requestFullscreen) {
        chassis.requestFullscreen();
      } else if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  window.seekTrailer = function (timeInSec, cardEl) {
    if (video) {
      video.currentTime = timeInSec;
      video.play().catch(() => { });
      if (cardEl) {
        document.querySelectorAll('.trailer-cut-card').forEach(c => c.classList.remove('active'));
        cardEl.classList.add('active');
      }
    }
  };

  video.addEventListener('play', () => {
    if (playOverlay) playOverlay.classList.add('hidden');
    if (playIcon) playIcon.style.display = 'none';
    if (pauseIcon) pauseIcon.style.display = 'block';
  });

  video.addEventListener('pause', () => {
    if (playOverlay) playOverlay.classList.remove('hidden');
    if (playIcon) playIcon.style.display = 'block';
    if (pauseIcon) pauseIcon.style.display = 'none';
  });

  video.addEventListener('ended', () => {
    if (playOverlay) playOverlay.classList.remove('hidden');
    if (playIcon) playIcon.style.display = 'block';
    if (pauseIcon) pauseIcon.style.display = 'none';
  });

  video.addEventListener('timeupdate', () => {
    const cur = video.currentTime || 0;
    const dur = video.duration || 241;
    const pct = (cur / dur) * 100;
    if (scrubFill) scrubFill.style.width = `${pct}%`;
    if (timeDisplay) {
      const curStr = formatTimeSecTrailer(cur);
      const durStr = formatTimeSecTrailer(dur);
      timeDisplay.textContent = `${curStr} / ${durStr}`;
    }
  });

  video.addEventListener('progress', () => {
    if (video.buffered.length > 0 && scrubLoaded) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      const dur = video.duration || 241;
      scrubLoaded.style.width = `${(bufferedEnd / dur) * 100}%`;
    }
  });

  if (scrubTrack) {
    scrubTrack.addEventListener('click', (e) => {
      const rect = scrubTrack.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const dur = video.duration || 241;
      video.currentTime = Math.max(0, Math.min(dur, pos * dur));
    });
  }
}

function formatTimeSecTrailer(sec) {
  if (isNaN(sec) || !isFinite(sec)) return "00:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
}


/* ==========================================================================
   RAMAYANA OFFICIAL ORIGINAL MOTION PICTURE SOUNDTRACK (OST) AUDIO ENGINE
   Composed by A.R. Rahman & Hans Zimmer
   ========================================================================== */

const OST_TRACKS = [
  {
    id: 1,
    num: "01",
    title: "Dharthi Hai Ambar",
    subtitle: "Ramayana Introduction Theme & Chants",
    tag: "TITLE THEME",
    artist: "A.R. Rahman × Hans Zimmer",
    duration: "01:13",
    durationSec: 73,
    src: "audio/01_dharthi_hai_ambar_intro.m4a",
    banner: "assets/images/tracks/track_01.jpg",
    desc: "Celestial Sanskrit chants & divine symphony heralding the birth of Sri Rama."
  },
  {
    id: 2,
    num: "02",
    title: "Sita's Aspiration (Lyrical)",
    subtitle: "Valmiki Ramayana Sanskrit Shloka",
    tag: "SANSKRIT SHLOKA",
    artist: "A.R. Rahman • Dr. Kumar Vishwas",
    duration: "02:40",
    durationSec: 160,
    src: "audio/02_sitas_aspiration_lyrical.m4a",
    banner: "assets/images/tracks/track_02.jpg",
    desc: "Sacred Sanskrit verses from Valmiki Ramayana depicting Princess Sita's devotion."
  },
  {
    id: 3,
    num: "03",
    title: "Jai Jai Ram (Orchestral Theme)",
    subtitle: "Hollywood Symphony & Celestial Choral Harmony",
    tag: "HOLLYWOOD SYMPHONY",
    artist: "Hans Zimmer × A.R. Rahman",
    duration: "03:02",
    durationSec: 182,
    src: "audio/03_jai_jai_ram_orchestral.m4a",
    banner: "assets/images/tracks/track_03.jpg",
    desc: "Monumental symphonic score performed by world-class strings & choir."
  },
  {
    id: 4,
    num: "04",
    title: "Sita's Aspiration (Divine Flute)",
    subtitle: "Bamboo Flute, Sitar & Ethereal Choral Resonance",
    tag: "ACOUSTIC MELODY",
    artist: "A.R. Ameen, Vaishali Samant, Rakshita Suresh",
    duration: "02:42",
    durationSec: 162,
    src: "audio/04_sitas_aspiration_divine.m4a",
    banner: "assets/images/tracks/track_04.jpg",
    desc: "Serene Indian acoustic instruments celebrating the quiet sanctity of Dandakaranya."
  },
  {
    id: 5,
    num: "05",
    title: "Ravana Tandav (Shiv Tandav Anthem)",
    subtitle: "Lankan War Drums & Lord Shiva's Tandav Stotram",
    tag: "WAR ANTHEM",
    artist: "A.R. Rahman, Vishal Dadlani, Kumar Vishwas",
    duration: "03:14",
    durationSec: 194,
    src: "audio/05_ravana_tandav.m4a",
    banner: "assets/images/tracks/track_05.jpg",
    desc: "High-octane war anthem encapsulating the unstoppable might and devotion of the Lankan King."
  },
  {
    id: 6,
    num: "06",
    title: "Jai Jai Ram (Meri Pooja Mere Ram)",
    subtitle: "Monumental Devotional Anthem & Achyutam Keshavam",
    tag: "DEVOTIONAL CLIMAX",
    artist: "A.R. Rahman, Arijit Singh, Shreya Ghoshal, Kumar Vishwas",
    duration: "05:20",
    durationSec: 320,
    src: "audio/06_jai_jai_ram_meri_pooja.m4a",
    banner: "assets/images/tracks/track_06.jpg",
    desc: "The monumental heart-touching devotional anthem with Achyutam Keshavam shlokas."
  },
  {
    id: 7,
    num: "07",
    title: "Shree Hanuman Chalisa",
    subtitle: "Sacred Hymn of Celestial Power & Protection",
    tag: "SACRED CHANTS",
    artist: "A.R. Rahman &times; Shankar Mahadevan &times; Sukhwinder Singh",
    duration: "06:58",
    durationSec: 418,
    src: "audio/07_hanuman_chalisa_divine.mp3",
    fallbackSrc: "audio/07_hanuman_chalisa_divine.m4a",
    banner: "assets/images/tracks/track_07.jpg",
    desc: "Divine Sanskrit and Awadhi recitations of Sri Hanuman Chalisa invoking cosmic strength, devotion, and protection."
  },
  {
    id: 8,
    num: "08",
    title: "Main Ram - Dasharath Suta",
    subtitle: "The Divine Vow of Lord Rama & Cosmic Symphony",
    tag: "DIVINE ANTHEM",
    artist: "JAM8 • Sachet Tandon • Kumar Vishwas",
    duration: "03:41",
    durationSec: 221,
    src: "audio/08_main_ram_dasharath_suta.mp3",
    fallbackSrc: "audio/08_main_ram_dasharath_suta.m4a",
    banner: "assets/images/tracks/track_08.jpg",
    desc: "Soul-stirring divine anthem of Maryada Purushottam Lord Rama upholding supreme Dharma and eternal vows."
  },
  {
    id: 9,
    num: "01",
    album: "hanuman-divine",
    title: "Balwan Hanuman",
    subtitle: "Sacred Bhajans & Devotional Chants",
    tag: "DEVOTIONAL BHAJAN",
    artist: "Jai Jai Bhajans • Devotional Folk",
    duration: "02:40",
    durationSec: 160,
    src: "audio/09_balwan_hanuman.m4a",
    banner: "assets/images/tracks/track_09.jpg",
    desc: "Soul-stirring divine chants of Balwan Hanuman praising the supreme strength and humility of Bajrangbali."
  },
  {
    id: 10,
    num: "02",
    album: "hanuman-divine",
    title: "Shendur Laal Chadhayo (Aarti)",
    subtitle: "Auspicious Ganesha Aarti & Divine Rhythms",
    tag: "GANPATI AARTI",
    artist: "Ravindra Sathe • Jatin-Lalit • Sameer",
    duration: "03:12",
    durationSec: 192,
    src: "audio/10_shendur_laal_chadhayo.m4a",
    banner: "assets/images/tracks/track_10.jpg",
    desc: "The sacred Ganpati Aarti with traditional dhol-tasha rhythms invoking prosperity and removing all obstacles."
  },
  {
    id: 11,
    num: "03",
    album: "hanuman-divine",
    title: "Mahabharat Story Rap",
    subtitle: "High-Octane Narrative Rap of the Great Epic",
    tag: "EPIC WAR RAP",
    artist: "Abby Viral",
    duration: "03:58",
    durationSec: 238,
    src: "audio/11_mahabharat_story_rap.m4a",
    banner: "assets/images/tracks/track_11.jpg",
    desc: "Powerful storytelling rap narrating the Kurukshetra war, Dharma, and the eternal teachings of the Bhagavad Gita."
  },
  {
    id: 12,
    num: "04",
    album: "hanuman-divine",
    title: "Shoorveer 3 - Chhatrapati Shivaji Maharaj",
    subtitle: "Grand Historic Anthem of Valor & Swarajya",
    tag: "WAR ANTHEM",
    artist: "Rapperiya Baalam • Shambho • Meetu Solanki",
    duration: "03:29",
    durationSec: 209,
    src: "audio/12_shoorveer_3_shivaji_maharaj.m4a",
    banner: "assets/images/tracks/track_12.jpg",
    desc: "Electrifying patriotic tribute commemorating the valor, vision, and immortal glory of Chhatrapati Shivaji Maharaj."
  },
  {
    id: 13,
    num: "05",
    album: "hanuman-divine",
    title: "Gajanana (Shree Ganesha)",
    subtitle: "Majestic Divine Invocation of Vighnaharta",
    tag: "DEVOTIONAL ANTHEM",
    artist: "Sukhwinder Singh • Traditional Choral",
    duration: "03:34",
    durationSec: 214,
    src: "audio/13_gajanana_shree_ganesha.m4a",
    banner: "assets/images/tracks/track_13.jpg",
    desc: "Thunderous, heart-racing celebratory ode to Lord Ganesha with high brass, traditional shankh, and folk drums."
  },
  {
    id: 14,
    num: "06",
    album: "hanuman-divine",
    title: "Bolo Har Har Har (Shivaay)",
    subtitle: "Monumental Tandav Anthem of Mahadev",
    tag: "SHIVA TANDAV",
    artist: "Mithoon • Mohit Chauhan • Badshah • Sukhwinder",
    duration: "03:29",
    durationSec: 209,
    src: "audio/14_bolo_har_har_har_shivaay.m4a",
    banner: "assets/images/tracks/track_14.jpg",
    desc: "A roaring, cosmic fusion of ancient Sanskrit Rudrastakam with modern bass honoring Lord Shiva the Supreme Destroyer."
  },
  {
    id: 15,
    num: "07",
    album: "hanuman-divine",
    title: "Babam Bam",
    subtitle: "Sacred Shiv Tandav Rap & High Energy Chants",
    tag: "SHIVA HIP-HOP",
    artist: "Paradox • Aditya Pushkarna",
    duration: "02:17",
    durationSec: 137,
    src: "audio/15_babam_bam.m4a",
    banner: "assets/images/tracks/track_15.jpg",
    desc: "Explosive devotional hip-hop tribute praising Mahadev's infinite glory with thunderous beats and raw energy."
  },
  {
    id: 16,
    num: "08",
    album: "hanuman-divine",
    title: "Bhagwadhari",
    subtitle: "Valor of Sanatana Dharma & Saffron Anthem",
    tag: "DHARMA ANTHEM",
    artist: "Bucks Boy • Sudarshan Jagdish",
    duration: "03:18",
    durationSec: 198,
    src: "audio/16_bhagwadhari.m4a",
    banner: "assets/images/tracks/track_16.jpg",
    desc: "Fierce anthem celebrating the eternal spirit of Sanatan Dharma, strength, and unwavering devotion."
  },
  {
    id: 17,
    num: "09",
    album: "hanuman-divine",
    title: "Kalki",
    subtitle: "Prophecy of the Tenth Avatar & End of Kaliyuga",
    tag: "AVATAR THEME",
    artist: "Lucke • Dean Music",
    duration: "03:49",
    durationSec: 229,
    src: "audio/17_kalki.m4a",
    banner: "assets/images/tracks/track_17.jpg",
    desc: "Hypnotic cinematic score capturing the prophesied awakening of Lord Kalki to restore righteousness."
  },
  {
    id: 18,
    num: "10",
    album: "hanuman-divine",
    title: "Aathma Raama",
    subtitle: "Classical Carnatic Meets Underground Hip-Hop",
    tag: "CARNATIC RAP",
    artist: "Brodha V • Vighnesh S",
    duration: "03:54",
    durationSec: 235,
    src: "audio/18_aathma_raama.m4a",
    banner: "assets/images/tracks/track_18.jpg",
    desc: "Legendary blend of sacred Carnatic classical vocals with hard-hitting conscious lyricism and flow."
  },
  {
    id: 19,
    num: "11",
    album: "hanuman-divine",
    title: "Shoorveer - Maharana Pratap",
    subtitle: "Legendary Tribute to the Immortal Rajput Warrior",
    tag: "HISTORIC ANTHEM",
    artist: "Rapperiya Baalam • Rajneesh Jaipuri",
    duration: "03:58",
    durationSec: 238,
    src: "audio/19_shoorveer.m4a",
    banner: "assets/images/tracks/track_19.jpg",
    desc: "Stirring historic war ballad honoring the unyielding pride and freedom of Maharana Pratap."
  },
  {
    id: 20,
    num: "12",
    album: "hanuman-divine",
    title: "Aigiri Nandini",
    subtitle: "Mahishasura Mardini Stotram Fusion",
    tag: "SHAKTI ANTHEM",
    artist: "Brodha V",
    duration: "04:00",
    durationSec: 240,
    src: "audio/20_aigiri_nandini.m4a",
    banner: "assets/images/tracks/track_20.jpg",
    desc: "Adrenaline-fueled rendition of Adi Shankaracharya's sacred verses invoking Goddess Durga's cosmic power."
  },
  {
    id: 21,
    num: "13",
    album: "hanuman-divine",
    title: "Danveer Karna Mahabharat",
    subtitle: "Tragic Glory & Supreme Valor of Angaraj Karna",
    tag: "EPIC WAR RAP",
    artist: "Abby Viral",
    duration: "04:51",
    durationSec: 291,
    src: "audio/21_danveer_karna.m4a",
    banner: "assets/images/tracks/track_21.jpg",
    desc: "A stirring, raw lyrical tribute to the legendary archer and tragic hero Angaraj Karna, recounting his valor and supreme sacrifice."
  },
  {
    id: 22,
    num: "14",
    album: "hanuman-divine",
    title: "Rudra Shiva Stuti",
    subtitle: "Cosmic Vedic Invocations & Supreme Tandav Chants",
    tag: "SHIVA STUTI",
    artist: "Anubhav Mishra • Abhishek Prajapati • Siddharth Dwivedi",
    duration: "08:29",
    durationSec: 509,
    src: "audio/22_rudra_shiva_stuti.m4a",
    banner: "assets/images/tracks/track_22.jpg",
    desc: "Monumental 8-minute cosmic Vedic chant honoring Lord Shiva's fierce Rudra avatar with thundering dhol, bells, and sacred mantras."
  },
  {
    id: 23,
    num: "15",
    album: "hanuman-divine",
    title: "Jai Shri Ram",
    subtitle: "High-Energy Sanatan Rap & Ram Navami Anthem",
    tag: "RAM NAVAMI RAP",
    artist: "Bucks Boy • TMT Productions",
    duration: "03:40",
    durationSec: 221,
    src: "audio/23_jai_shri_ram_bucks_boy.m4a",
    banner: "assets/images/tracks/track_23.jpg",
    desc: "Hard-hitting energetic devotional hip-hop honoring Lord Rama with modern beats and thunderous flow."
  },
  {
    id: 24,
    num: "16",
    album: "hanuman-divine",
    title: "Breathless Hanuman Chalisa",
    subtitle: "Unstoppable One-Breath Celestial Recitation",
    tag: "SACRED CHANTS",
    artist: "Shankar Mahadevan",
    duration: "01:27",
    durationSec: 88,
    src: "audio/24_breathless_hanuman_chalisa.m4a",
    banner: "assets/images/tracks/track_24.jpg",
    desc: "A legendary, high-tempo breathless rendition of Sri Hanuman Chalisa recited with unmatched lung power and precision."
  },
  {
    id: 25,
    num: "17",
    album: "hanuman-divine",
    title: "Aarambh Hai Prachand",
    subtitle: "Immortal Battle Cry & Philosophy of Kurukshetra",
    tag: "WAR ANTHEM",
    artist: "Piyush Mishra • Gulaal",
    duration: "04:55",
    durationSec: 296,
    src: "audio/25_aarambh_hai_prachand.m4a",
    banner: "assets/images/tracks/track_25.jpg",
    desc: "Iconic historic battle anthem invoking valor, destiny, and the uncompromising spirit of ancient warriors."
  },
  {
    id: 26,
    num: "18",
    album: "hanuman-divine",
    title: "BamBholle",
    subtitle: "Thunderous Shiv Tandav Energy & Dhol Beats",
    tag: "SHIVA TANDAV",
    artist: "Viruss • Ullumanati • Akshay Kumar",
    duration: "03:45",
    durationSec: 226,
    src: "audio/26_bambholle_laxmii.m4a",
    banner: "assets/images/tracks/track_26.jpg",
    desc: "Electrifying explosive dance anthem celebrating Mahadev with infectious rhythm and roaring chants."
  },
  {
    id: 27,
    num: "19",
    album: "hanuman-divine",
    title: "Jai Bhavani Jai Shivaji",
    subtitle: "Maratha Swarajya War Cry & Heroic Ballad",
    tag: "SWARAJYA ANTHEM",
    artist: "Memento Mori",
    duration: "03:30",
    durationSec: 210,
    src: "audio/27_jai_bhavani_jai_shivaji.m4a",
    banner: "assets/images/tracks/track_27.jpg",
    desc: "Stirring patriotic anthem dedicated to the heroic ideals and indomitable courage of Chhatrapati Shivaji Maharaj."
  },
  {
    id: 28,
    num: "20",
    album: "hanuman-divine",
    title: "Kaalbhairav Ashtakam",
    subtitle: "Fierce Sanskrit Stotram to the Lord of Time",
    tag: "DEVOTIONAL CHANTS",
    artist: "Agam Aggarwal",
    duration: "04:34",
    durationSec: 275,
    src: "audio/28_kaalbhairav_ashtakam_agam.m4a",
    banner: "assets/images/tracks/track_28.jpg",
    desc: "Sacred Adi Shankaracharya composition glorifying Lord Kaal Bhairav, warding off fear, illusions, and negative energies."
  },
  {
    id: 29,
    num: "21",
    album: "hanuman-divine",
    title: "Kalyug vs Bhagwaan",
    subtitle: "Philosophical Rap Dialogue on Morality & Faith",
    tag: "CONSCIOUS RAP",
    artist: "Abby Viral • Mr. $even",
    duration: "05:16",
    durationSec: 316,
    src: "audio/29_kalyug_vs_bhagwaan.m4a",
    banner: "assets/images/tracks/track_29.jpg",
    desc: "Thought-provoking spiritual hip-hop track debating human folly in the Kali Yuga versus divine cosmic justice."
  },
  {
    id: 30,
    num: "22",
    album: "hanuman-divine",
    title: "Maay Bhavani",
    subtitle: "Auspicious Goddess Bhavani Invocation from Tanhaji",
    tag: "DEVI AARTI",
    artist: "Sukhwinder Singh • Shreya Ghoshal • Ajay-Atul",
    duration: "04:18",
    durationSec: 259,
    src: "audio/30_maay_bhavani_tanhaji.m4a",
    banner: "assets/images/tracks/track_30.jpg",
    desc: "Grand celebratory folk composition invoking Mata Bhavani with rich dhol-tashe and soaring classical vocals."
  },
  {
    id: 31,
    num: "23",
    album: "hanuman-divine",
    title: "Mahishasura Mardini (Droplex Remix)",
    subtitle: "Global Psytrance & Ancient Vedic Chants",
    tag: "PSYTRANCE FUSION",
    artist: "Shanti People • Droplex",
    duration: "06:38",
    durationSec: 399,
    src: "audio/31_mahishasura_mardini_droplex.m4a",
    banner: "assets/images/tracks/track_31.jpg",
    desc: "Hypnotic electronic fusion blending the sacred Sanskrit hymn of Mahishasura Mardini with heavy minimal psytrance."
  },
  {
    id: 32,
    num: "24",
    album: "hanuman-divine",
    title: "Shiv Tandav Stotram (16D Audio)",
    subtitle: "Immersive 360° Spatial Sound & Mahadev Chants",
    tag: "16D SPATIAL AUDIO",
    artist: "Musirhythm • Sacred Mantras",
    duration: "09:13",
    durationSec: 553,
    src: "audio/32_shiv_tandav_stotram_16d.m4a",
    banner: "assets/images/tracks/track_32.jpg",
    desc: "Transcendental 360-degree immersive audio journey through the sacred verses of Ravana’s Shiv Tandav Stotram."
  },
  {
    id: 33,
    num: "01",
    album: "moosetape",
    title: "295",
    subtitle: "The Historic Global Anthem of Freedom & Truth",
    tag: "PUNJABI DRILL",
    artist: "Sidhu Moose Wala • The Kidd",
    duration: "04:30",
    durationSec: 270,
    src: "audio/33_295.m4a",
    banner: "assets/images/tracks/track_33.jpg",
    desc: "The monumental global Punjabi hip-hop anthem written and performed by Sidhu Moose Wala addressing reality, society, and resilience."
  },
  {
    id: 34,
    num: "02",
    album: "moosetape",
    title: "Bitch I'm Back",
    subtitle: "The Roaring Album Opening Declaration",
    tag: "HIP-HOP ANTHEM",
    artist: "Sidhu Moose Wala • The Kidd",
    duration: "03:50",
    durationSec: 231,
    src: "audio/34_bitch_im_back.m4a",
    banner: "assets/images/tracks/track_34.jpg",
    desc: "Sidhu Moose Wala returns with signature swag, unyielding cadence, and thunderous 808 bass."
  },
  {
    id: 35,
    num: "03",
    album: "moosetape",
    title: "Burberry",
    subtitle: "High-Fashion Trap & Hard Lyrical Flow",
    tag: "DESI TRAP",
    artist: "Sidhu Moose Wala • The Kidd",
    duration: "03:23",
    durationSec: 204,
    src: "audio/35_burberry.m4a",
    banner: "assets/images/tracks/track_35.jpg",
    desc: "Sleek luxury trap anthem blending high-fashion references with raw street authority and punchy rhythm."
  },
  {
    id: 36,
    num: "04",
    album: "moosetape",
    title: "Racks and Rounds",
    subtitle: "Underground Drill Power Collab",
    tag: "HARDCORE DRILL",
    artist: "Sidhu Moose Wala • Sikander Kahlon",
    duration: "03:49",
    durationSec: 230,
    src: "audio/36_racks_and_rounds.m4a",
    banner: "assets/images/tracks/track_36.jpg",
    desc: "Aggressive UK drill collaboration pairing Sidhu Moose Wala with Sikander Kahlon in peak form."
  },
  {
    id: 37,
    num: "05",
    album: "moosetape",
    title: "US",
    subtitle: "Sensational Cross-Cultural Hip-Hop Fusion",
    tag: "GLOBAL FUSION",
    artist: "Sidhu Moose Wala • Raja Kumari",
    duration: "04:15",
    durationSec: 255,
    src: "audio/37_us_raja_kumari.m4a",
    banner: "assets/images/tracks/track_37.jpg",
    desc: "Electrifying collaboration between Sidhu Moose Wala and Grammy-nominated Indian-American rapper Raja Kumari."
  },
  {
    id: 38,
    num: "06",
    album: "moosetape",
    title: "Moosedrilla",
    subtitle: "Punjab Meets Mumbai Gullies Drill Blockbuster",
    tag: "STREET DRILL",
    artist: "Sidhu Moose Wala • DIVINE",
    duration: "03:52",
    durationSec: 232,
    src: "audio/38_moosedrilla_divine.m4a",
    banner: "assets/images/tracks/track_38.jpg",
    desc: "Historic union of North and West Indian rap giants Sidhu Moose Wala and DIVINE over chilling drill production."
  },
  {
    id: 39,
    num: "07",
    album: "moosetape",
    title: "Brown Shortie",
    subtitle: "Celebratory Rhythmic Anthem featuring Sonam Bajwa",
    tag: "UPBEAT TRAP",
    artist: "Sidhu Moose Wala • Sonam Bajwa",
    duration: "03:52",
    durationSec: 232,
    src: "audio/39_brown_shortie.m4a",
    banner: "assets/images/tracks/track_39.jpg",
    desc: "Bouncy, hook-laden Punjabi party anthem featuring popular Punjabi superstar Sonam Bajwa."
  },
  {
    id: 40,
    num: "08",
    album: "moosetape",
    title: "These Days",
    subtitle: "The Pioneer & The King of Desi Hip-Hop",
    tag: "LEGENDARY COLLAB",
    artist: "Sidhu Moose Wala • Bohemia",
    duration: "03:29",
    durationSec: 209,
    src: "audio/40_these_days_bohemia.m4a",
    banner: "assets/images/tracks/track_40.jpg",
    desc: "Monolithic collaboration between Punjabi rap originator Bohemia and generational icon Sidhu Moose Wala."
  },
  {
    id: 41,
    num: "09",
    album: "moosetape",
    title: "Sidhu Son",
    subtitle: "Honoring Roots, Family Honor & Legacy",
    tag: "AUTOBIOGRAPHICAL",
    artist: "Sidhu Moose Wala • The Kidd",
    duration: "03:37",
    durationSec: 217,
    src: "audio/41_sidhu_son.m4a",
    banner: "assets/images/tracks/track_41.jpg",
    desc: "Deeply personal homage to family heritage, fatherhood, and unwavering self-respect from village Moosa to the world."
  },
  {
    id: 42,
    num: "10",
    album: "moosetape",
    title: "Aroma",
    subtitle: "Soulful Acoustic Melodies & Poetic Musings",
    tag: "MELODIC TRAP",
    artist: "Sidhu Moose Wala • The Kidd",
    duration: "04:16",
    durationSec: 257,
    src: "audio/42_aroma.m4a",
    banner: "assets/images/tracks/track_42.jpg",
    desc: "A poignant acoustic-infused reflection showcasing Sidhu’s versatile vocal range, delicate hooks, and lyrical depth."
  },
  {
    id: 43,
    num: "11",
    album: "moosetape",
    title: "GOAT",
    subtitle: "Greatest Of All Time Folk Drill Anthem",
    tag: "FOLK DRILL",
    artist: "Sidhu Moose Wala • Wazir Patar",
    duration: "03:34",
    durationSec: 215,
    src: "audio/43_goat_wazir_patar.m4a",
    banner: "assets/images/tracks/track_43.jpg",
    desc: "Wazir Patar’s traditional Majha folk cadence paired with Sidhu Moose Wala’s thunderous vocal proclamation of greatness."
  },
  {
    id: 44,
    num: "12",
    album: "moosetape",
    title: "Celebrity Killer",
    subtitle: "UK Drill Meets North India Superhit",
    tag: "INTERNATIONAL DRILL",
    artist: "Sidhu Moose Wala • Tion Wayne",
    duration: "03:23",
    durationSec: 203,
    src: "audio/44_celebrity_killer_tion_wayne.m4a",
    banner: "assets/images/tracks/track_44.jpg",
    desc: "Global international drill crossover featuring British rap star Tion Wayne alongside Sidhu Moose Wala."
  },
  {
    id: 45,
    num: "13",
    album: "moosetape",
    title: "Invincible",
    subtitle: "Global Dancehall & Punjabi Trap Masterpiece",
    tag: "GLOBAL ANTHEM",
    artist: "Sidhu Moose Wala • Stefflon Don • Steel Banglez",
    duration: "04:12",
    durationSec: 252,
    src: "audio/45_invincible_stefflon_don.m4a",
    banner: "assets/images/tracks/track_45.jpg",
    desc: "British superstar Stefflon Don joins Sidhu Moose Wala with Steel Banglez producing an unbeatable global crossover."
  },
  {
    id: 46,
    num: "14",
    album: "moosetape",
    title: "B & W",
    subtitle: "Black and White Classic Storytelling",
    tag: "CLASSIC HIP-HOP",
    artist: "Sidhu Moose Wala • The Kidd",
    duration: "04:05",
    durationSec: 246,
    src: "audio/46_b_and_w.m4a",
    banner: "assets/images/tracks/track_46.jpg",
    desc: "Contemplative narrative track exploring the dualities of fame, betrayal, and unyielding principles in a monochrome world."
  },
  {
    id: 47,
    num: "15",
    album: "moosetape",
    title: "Malwa Block",
    subtitle: "The Pride and Sound of the Malwa Heartland",
    tag: "FOLK DRILL",
    artist: "Sidhu Moose Wala • Wazir Patar",
    duration: "03:59",
    durationSec: 239,
    src: "audio/47_malwa_block.m4a",
    banner: "assets/images/tracks/track_47.jpg",
    desc: "Authentic Punjabi folk poetry intertwined with dark, driving bass honoring the rural belt of Malwa."
  },
  {
    id: 48,
    num: "16",
    album: "moosetape",
    title: "G-Shit",
    subtitle: "Raw Street Narrative & Unfiltered Lyricism",
    tag: "STREET RAP",
    artist: "Sidhu Moose Wala • Blockboi Twitch",
    duration: "03:53",
    durationSec: 234,
    src: "audio/48_g_shit.m4a",
    banner: "assets/images/tracks/track_48.jpg",
    desc: "International collaboration with Blockboi Twitch diving deep into authentic street experiences and survival."
  },
  {
    id: 49,
    num: "17",
    album: "moosetape",
    title: "Built Different",
    subtitle: "Unapologetic Defiance & Supreme Confidence",
    tag: "POWER TRAP",
    artist: "Sidhu Moose Wala • The Kidd",
    duration: "04:07",
    durationSec: 248,
    src: "audio/49_built_different.m4a",
    banner: "assets/images/tracks/track_49.jpg",
    desc: "Thunderous flex anthem showcasing why Sidhu Moose Wala remains singular, unique, and built unlike anyone else."
  },
  {
    id: 50,
    num: "18",
    album: "moosetape",
    title: "Calaboose",
    subtitle: "Western Outlaw Vibes & Raw Punjabi Lyricism",
    tag: "WESTERN TRAP",
    artist: "Sidhu Moose Wala • Snappy",
    duration: "04:03",
    durationSec: 243,
    src: "audio/50_calaboose.m4a",
    banner: "assets/images/tracks/track_50.jpg",
    desc: "Wild West inspired outlaw narrative featuring dark acoustic guitar strums and Sidhu’s evocative imagery."
  },
  {
    id: 51,
    num: "19",
    album: "moosetape",
    title: "Me and My Girlfriend",
    subtitle: "Metaphoric Ode to the 9mm Companion",
    tag: "METAPHORIC TRAP",
    artist: "Sidhu Moose Wala • The Kidd",
    duration: "03:23",
    durationSec: 204,
    src: "audio/51_me_and_my_girlfriend.m4a",
    banner: "assets/images/tracks/track_51.jpg",
    desc: "Cleverly written Tupac-inspired tribute that treats Sidhu’s trusted weapon as his closest, most loyal companion."
  },
  {
    id: 52,
    num: "20",
    album: "moosetape",
    title: "Signed to God",
    subtitle: "Divine Faith, Spiritual Shelter & Humility",
    tag: "SPIRITUAL DRILL",
    artist: "Sidhu Moose Wala • The Kidd",
    duration: "02:27",
    durationSec: 148,
    src: "audio/52_signed_to_god.m4a",
    banner: "assets/images/tracks/track_52.jpg",
    desc: "Sidhu declares that he answers to no mortal masters or corporate labels—his contract is only with the Almighty God."
  },
  {
    id: 53,
    num: "21",
    album: "moosetape",
    title: "IDGAF",
    subtitle: "Defiant Anthem with British Rapper Morrisson",
    tag: "UK DRILL",
    artist: "Sidhu Moose Wala • Morrisson • Steel Banglez",
    duration: "03:32",
    durationSec: 212,
    src: "audio/53_idgaf_morrisson.m4a",
    banner: "assets/images/tracks/track_53.jpg",
    desc: "Hard-edged UK drill banger featuring legendary UK artist Morrisson, giving zero care to naysayers and critics."
  },
  {
    id: 54,
    num: "22",
    album: "moosetape",
    title: "Power",
    subtitle: "Political Realism & Commanding Influence",
    tag: "HEAVY BASS TRAP",
    artist: "Sidhu Moose Wala • The Kidd",
    duration: "03:48",
    durationSec: 228,
    src: "audio/54_power.m4a",
    banner: "assets/images/tracks/track_54.jpg",
    desc: "Dark, heavy-hitting exploration of institutional power, street influence, and moral fortitude."
  },
  {
    id: 55,
    num: "23",
    album: "moosetape",
    title: "Regret",
    subtitle: "Emotional Reflection & The Weight of Stardom",
    tag: "SOULFUL HIP-HOP",
    artist: "Sidhu Moose Wala • The Kidd",
    duration: "05:11",
    durationSec: 312,
    src: "audio/55_regret.m4a",
    banner: "assets/images/tracks/track_55.jpg",
    desc: "One of the most emotional songs on Moosetape, reflecting on lost friendships, trust, and the painful costs of fame."
  },
  {
    id: 56,
    num: "24",
    album: "moosetape",
    title: "Chosen",
    subtitle: "Soulful Melody & Destiny with Sunny Malton",
    tag: "MELODIC DRILL",
    artist: "Sidhu Moose Wala • Sunny Malton",
    duration: "04:24",
    durationSec: 264,
    src: "audio/56_chosen_sunny_malton.m4a",
    banner: "assets/images/tracks/track_56.jpg",
    desc: "Nostalgic collaboration reuniting Sidhu Moose Wala with longtime partner Sunny Malton singing about their chosen fate."
  },
  {
    id: 57,
    num: "25",
    album: "moosetape",
    title: "East Side Flow",
    subtitle: "Classic Byg Byrd Sound & Flow Masterclass",
    tag: "CLASSIC BOOM BAP",
    artist: "Sidhu Moose Wala • Byg Byrd",
    duration: "03:44",
    durationSec: 224,
    src: "audio/57_east_side_flow.m4a",
    banner: "assets/images/tracks/track_57.jpg",
    desc: "The iconic, effortless flow over Byg Byrd production that solidified Sidhu’s legacy in Canadian and global hip-hop."
  },
  {
    id: 58,
    num: "26",
    album: "moosetape",
    title: "Just Listen",
    subtitle: "The Historic Breakthrough Anthem",
    tag: "TIMELESS CLASSIC",
    artist: "Sidhu Moose Wala • Sunny Malton • Byg Byrd",
    duration: "04:43",
    durationSec: 284,
    src: "audio/58_just_listen.m4a",
    banner: "assets/images/tracks/track_58.jpg",
    desc: "The revolutionary track that changed the Punjabi music industry forever, telling listeners to just listen to true artistry."
  },
  {
    id: 59,
    num: "27",
    album: "moosetape",
    title: "Scapegoat",
    subtitle: "Unfiltered Truth on Politics & Betrayal",
    tag: "CONSCIOUS DRILL",
    artist: "Sidhu Moose Wala • The Kidd",
    duration: "03:57",
    durationSec: 237,
    src: "audio/59_scapegoat.m4a",
    banner: "assets/images/tracks/track_59.jpg",
    desc: "Raw, hard-hitting truth addressing the political arena, double standards, and being unfairly targeted."
  },
  {
    id: 60,
    num: "28",
    album: "moosetape",
    title: "Who's Bad",
    subtitle: "Michael Jackson Inspired Energy & Swag",
    tag: "BOUNCE TRAP",
    artist: "Sidhu Moose Wala • The Kidd",
    duration: "02:42",
    durationSec: 163,
    src: "audio/60_whos_bad.m4a",
    banner: "assets/images/tracks/track_60.jpg",
    desc: "High-energy celebration of bad-boy swagger, drawing inspiration from legendary pop and hip-hop influences."
  },
  {
    id: 61,
    num: "29",
    album: "moosetape",
    title: "Devil (Skit)",
    subtitle: "Cinematic Spoken Monologue on Morality",
    tag: "CINEMATIC SKIT",
    artist: "Sidhu Moose Wala",
    duration: "01:18",
    durationSec: 79,
    src: "audio/61_devil_skit.m4a",
    banner: "assets/images/tracks/track_61.jpg",
    desc: "Dark, atmospheric monologue confronting the inner devils and societal wolves surrounding rising stars."
  },
  {
    id: 62,
    num: "30",
    album: "moosetape",
    title: "Ultimatum (Intro)",
    subtitle: "The Official Grand Prologue to Moosetape",
    tag: "ALBUM INTRO",
    artist: "Sidhu Moose Wala",
    duration: "01:30",
    durationSec: 90,
    src: "audio/62_ultimatum_intro.m4a",
    banner: "assets/images/tracks/track_62.jpg",
    desc: "The spine-chilling official spoken prologue setting the stage for the groundbreaking Moosetape era."
  },
  {
    id: 63,
    num: "31",
    album: "moosetape",
    title: "ALL OUT (Moosetape)",
    subtitle: "Grand Extended Instrumental Mashup & Finale",
    tag: "ORCHESTRAL DRILL",
    artist: "Mahi Music • Sidhu Moose Wala",
    duration: "02:16",
    durationSec: 136,
    src: "audio/63_all_out_moosetape.m4a",
    banner: "assets/images/tracks/track_63.jpg",
    desc: "Heavy-hitting celebratory compilation and finale tribute celebrating the global triumph of Moosetape."
  },
  {
    id: 64,
    num: "01",
    album: "sidhu-classics",
    title: "So High",
    subtitle: "Breakthrough Punjabi Drill & Global Cult Anthem",
    tag: "GLOBAL SMASH",
    artist: "Sidhu Moose Wala \u2022 Byg Byrd",
    duration: "03:33",
    durationSec: 213,
    src: "audio2/64_so_high.m4a",
    banner: "assets/images/tracks/track_64.jpg",
    desc: "The explosive global chart-topping phenomenon that catapulted Sidhu Moose Wala into global superstardom with Byg Byrd's iconic drill beat."
  },
  {
    id: 65,
    num: "02",
    album: "sidhu-classics",
    title: "Legend",
    subtitle: "Historic Statement of Unmatched Dominance",
    tag: "ICONIC ANTHEM",
    artist: "Sidhu Moose Wala",
    duration: "04:38",
    durationSec: 278,
    src: "audio2/65_legend.m4a",
    banner: "assets/images/tracks/track_65.jpg",
    desc: "An uncompromising roar of raw power and grit, defining the very essence of Sidhu Moose Wala's legendary musical empire."
  },
  {
    id: 66,
    num: "03",
    album: "sidhu-classics",
    title: "The Last Ride",
    subtitle: "Tupac Tribute & Prophetic Hip-Hop Masterpiece",
    tag: "HISTORIC CLASSIC",
    artist: "Sidhu Moose Wala \u2022 Wazir Patar",
    duration: "04:22",
    durationSec: 262,
    src: "audio2/66_the_last_ride.m4a",
    banner: "assets/images/tracks/track_66.jpg",
    desc: "An unforgettable, haunting, and soulful hip-hop tribute paying homage to Tupac Shakur with profound lyricism and Wazir Patar's timeless production."
  },
  {
    id: 67,
    num: "04",
    album: "sidhu-classics",
    title: "Levels",
    subtitle: "Peak Punjabi Trap & Swagger Anthem",
    tag: "CHART TOPPER",
    artist: "Sidhu Moose Wala \u2022 Sunny Malton \u2022 The Kidd",
    duration: "03:48",
    durationSec: 228,
    src: "audio2/67_levels.m4a",
    banner: "assets/images/tracks/track_67.jpg",
    desc: "A relentless high-energy trap anthem asserting undisputed lyrical superiority and supreme authority in the music industry."
  },
  {
    id: 68,
    num: "05",
    album: "sidhu-classics",
    title: "Bambiha Bole",
    subtitle: "Colossal Desi Folk Battle & Folk Anthem",
    tag: "FOLK EXPLOSION",
    artist: "Amrit Maan \u2022 Sidhu Moose Wala",
    duration: "05:01",
    durationSec: 301,
    src: "audio2/68_bambiha_bole.m4a",
    banner: "assets/images/tracks/track_68.jpg",
    desc: "The thunderous blockbuster folk collaboration between Amrit Maan and Sidhu Moose Wala with monumental Punjabi energy."
  },
  {
    id: 69,
    num: "06",
    album: "sidhu-classics",
    title: "Issa Jatt",
    subtitle: "Definitive Desi West Coast Anthem",
    tag: "CULT ANTHEM",
    artist: "Sidhu Moose Wala \u2022 Sunny Malton \u2022 Byg Byrd",
    duration: "03:52",
    durationSec: 232,
    src: "audio2/69_issa_jatt.m4a",
    banner: "assets/images/tracks/track_69.jpg",
    desc: "The timeless cult classic that solidified the raw underground West Coast fusion sound of Sidhu Moose Wala and Sunny Malton."
  },
  {
    id: 70,
    num: "07",
    album: "sidhu-classics",
    title: "Selfmade",
    subtitle: "Inspirational Biography & Struggle Narrative",
    tag: "AUTOBIOGRAPHICAL",
    artist: "Sidhu Moose Wala \u2022 Byg Byrd",
    duration: "02:59",
    durationSec: 179,
    src: "audio2/70_selfmade.m4a",
    banner: "assets/images/tracks/track_70.jpg",
    desc: "Sidhu's deeply personal and motivational story recounting his journey from rural Punjab humble beginnings to worldwide royalty."
  },
  {
    id: 71,
    num: "08",
    album: "sidhu-classics",
    title: "Never Fold",
    subtitle: "Resilient Drill Manifesto & No-Surrender Anthem",
    tag: "STREET DRILL",
    artist: "Sidhu Moose Wala \u2022 Sunny Malton",
    duration: "03:00",
    durationSec: 180,
    src: "audio2/71_never_fold.m4a",
    banner: "assets/images/tracks/track_71.jpg",
    desc: "An iron-willed street battle cry about unwavering resilience, loyalty, and standing tall against all odds."
  },
  {
    id: 72,
    num: "09",
    album: "sidhu-classics",
    title: "B-Town",
    subtitle: "Brampton Brotherhood & Heavy Trap Anthems",
    tag: "BRAMPTON DRILL",
    artist: "Sidhu Moose Wala \u2022 Sunny Malton \u2022 Byg Byrd",
    duration: "03:02",
    durationSec: 182,
    src: "audio2/72_b_town.m4a",
    banner: "assets/images/tracks/track_72.jpg",
    desc: "Dedicated to Brampton, Ontario - celebrating brotherly camaraderie and immigrant grit with crushing basslines."
  },
  {
    id: 73,
    num: "10",
    album: "sidhu-classics",
    title: "G. Wagon",
    subtitle: "High-Octane Desi Duet & Luxury Beats",
    tag: "DESI DUET",
    artist: "Sidhu Moose Wala \u2022 Gurlej Akhtar \u2022 Deep Jandu",
    duration: "03:33",
    durationSec: 213,
    src: "audio2/73_g_wagon.m4a",
    banner: "assets/images/tracks/track_73.jpg",
    desc: "A fiery and infectious Punjabi duet featuring Gurlej Akhtar and Deep Jandu's signature bass heavy beat."
  },
  {
    id: 74,
    num: "11",
    album: "sidhu-classics",
    title: "Athra Style",
    subtitle: "Swaggering Punjabi Swagger & Cinematic Vibes",
    tag: "DESI BEATS",
    artist: "Sidhu Moose Wala \u2022 Jenny Johal",
    duration: "04:00",
    durationSec: 240,
    src: "audio2/74_athra_style.m4a",
    banner: "assets/images/tracks/track_74.jpg",
    desc: "High-attitude swagger track filled with classic rustic wordplay and explosive Punjabi tempo."
  },
  {
    id: 75,
    num: "12",
    album: "sidhu-classics",
    title: "410",
    subtitle: "Highway 410 Trap Anthem & Street Poetry",
    tag: "TRAP / DRILL",
    artist: "Sidhu Moose Wala \u2022 Sunny Malton \u2022 Offgrid",
    duration: "03:54",
    durationSec: 234,
    src: "audio2/75_410.m4a",
    banner: "assets/images/tracks/track_75.jpg",
    desc: "A tribute to Ontario's Highway 410, featuring cold drill beats, sharp storytelling, and legendary flow."
  },
  {
    id: 76,
    num: "13",
    album: "sidhu-classics",
    title: "Barota",
    subtitle: "Roots, Rural Heritage & Ancestral Pride",
    tag: "RURAL DRILL",
    artist: "Sidhu Moose Wala \u2022 The Kidd",
    duration: "04:03",
    durationSec: 243,
    src: "audio2/76_barota.m4a",
    banner: "assets/images/tracks/track_76.jpg",
    desc: "A tribute to Punjabi village heritage and the age-old banyan tree representing deep roots and grounded pride."
  },
  {
    id: 77,
    num: "14",
    album: "sidhu-classics",
    title: "Lock",
    subtitle: "Gritty Underground Trap & Defiance",
    tag: "HARD DRILL",
    artist: "Sidhu Moose Wala \u2022 The Kidd",
    duration: "02:55",
    durationSec: 175,
    src: "audio2/77_lock.m4a",
    banner: "assets/images/tracks/track_77.jpg",
    desc: "Dark, heavy-hitting bars addressing rivals and reaffirming unwavering street authority."
  },
  {
    id: 78,
    num: "15",
    album: "sidhu-classics",
    title: "Eyes On Me",
    subtitle: "Global Stardom & Spotlight Reflections",
    tag: "HIP HOP",
    artist: "Sidhu Moose Wala \u2022 The Kidd",
    duration: "02:49",
    durationSec: 169,
    src: "audio2/78_eyes_on_me.m4a",
    banner: "assets/images/tracks/track_78.jpg",
    desc: "Reflecting on immense fame, the intense gaze of the world, and navigating the spotlight with pride."
  },
  {
    id: 79,
    num: "16",
    album: "sidhu-classics",
    title: "Watch Out",
    subtitle: "Hardcore Bar-for-Bar Rap Masterclass",
    tag: "HIP HOP LYRICISM",
    artist: "Sidhu Moose Wala \u2022 Sikander Kahlon",
    duration: "03:51",
    durationSec: 231,
    src: "audio2/79_watch_out.m4a",
    banner: "assets/images/tracks/track_79.jpg",
    desc: "A heavyweight collaboration with Sikander Kahlon delivering relentless lyricism and dark menacing production."
  },
  {
    id: 80,
    num: "17",
    album: "sidhu-classics",
    title: "Mustang",
    subtitle: "High-Speed Cruising & Roaring Muscle Car Vibes",
    tag: "HIGH OCTANE",
    artist: "Sidhu Moose Wala \u2022 Banka",
    duration: "03:29",
    durationSec: 209,
    src: "audio2/80_mustang.m4a",
    banner: "assets/images/tracks/track_80.jpg",
    desc: "Classic horsepower anthem evoking fast night rides and carefree freedom."
  },
  {
    id: 81,
    num: "18",
    album: "sidhu-classics",
    title: "Pittal",
    subtitle: "Short, Sharp Warning Shot & Raw Rap",
    tag: "RAW FREESTYLE",
    artist: "Sidhu Moose Wala",
    duration: "01:37",
    durationSec: 97,
    src: "audio2/81_pittal.m4a",
    banner: "assets/images/tracks/track_81.jpg",
    desc: "A high-intensity, razor-sharp freestyle track delivering raw punchlines and undeniable energy."
  },
  {
    id: 82,
    num: "19",
    album: "sidhu-classics",
    title: "Neal",
    subtitle: "Atmospheric Punjabi Melodies & Soulful Beats",
    tag: "VIBE TRACK",
    artist: "Sidhu Moose Wala \u2022 Mxrci",
    duration: "03:20",
    durationSec: 200,
    src: "audio2/82_neal.m4a",
    banner: "assets/images/tracks/track_82.jpg",
    desc: "Captivating vocal melodies interwoven with Mxrci's lush, textured soundscape."
  },
  {
    id: 83,
    num: "20",
    album: "sidhu-classics",
    title: "Ghostface Killah",
    subtitle: "Wu-Tang Inspired East Coast Energy",
    tag: "BOOM BAP DRILL",
    artist: "Sidhu Moose Wala \u2022 Mxrci",
    duration: "02:17",
    durationSec: 137,
    src: "audio2/83_ghostface_killah.m4a",
    banner: "assets/images/tracks/track_83.jpg",
    desc: "Hard-hitting East Coast hip-hop flavors combined with signature Punjabi flow and aggressive rhymes."
  },
  {
    id: 84,
    num: "21",
    album: "sidhu-classics",
    title: "Outlaw (Studio Version)",
    subtitle: "Definitive Rebellious Gangsta Anthem",
    tag: "REBEL CLASSIC",
    artist: "Sidhu Moose Wala \u2022 Byg Byrd",
    duration: "03:00",
    durationSec: 180,
    src: "audio2/84_outlaw_studio.m4a",
    banner: "assets/images/tracks/track_84.jpg",
    desc: "The iconic rebel anthem celebrated by millions worldwide - pure, uncut studio audio mastering."
  },
  {
    id: 85,
    num: "22",
    album: "sidhu-classics",
    title: "Outlaw (Cinematic Cut)",
    subtitle: "Extended Music Video Audio & Dramatic Intro",
    tag: "CINEMATIC DRILL",
    artist: "Sidhu Moose Wala \u2022 Byg Byrd",
    duration: "03:37",
    durationSec: 217,
    src: "audio2/85_outlaw_extended.m4a",
    banner: "assets/images/tracks/track_85.jpg",
    desc: "Special cinematic cut featuring the iconic dialogue prelude and extended atmospheric intro."
  },
  {
    id: 86,
    num: "23",
    album: "sidhu-classics",
    title: "Trend",
    subtitle: "Trendsetter Statement & Slick Punjabi Bounce",
    tag: "BOUNCE / DRILL",
    artist: "Sidhu Moose Wala \u2022 Snappy",
    duration: "03:41",
    durationSec: 221,
    src: "audio2/86_trend.m4a",
    banner: "assets/images/tracks/track_86.jpg",
    desc: "Snappy's infectious, bouncy groove paired with Sidhu's declaration that he creates trends rather than following them."
  },
  {
    id: 87,
    num: "24",
    album: "sidhu-classics",
    title: "0008",
    subtitle: "Fast-Flow Duet & Modern Punjabi Swagger",
    tag: "SPEED FLOW",
    artist: "Sidhu Moose Wala \u2022 Jenny Johal \u2022 The Kidd",
    duration: "02:09",
    durationSec: 129,
    src: "audio2/87_0008.m4a",
    banner: "assets/images/tracks/track_87.jpg",
    desc: "High-octane rhythmic chemistry featuring Jenny Johal and The Kidd's punchy contemporary sound."
  },
  {
    id: 88,
    num: "25",
    album: "sidhu-classics",
    title: "Take Notes",
    subtitle: "Lyrical Lecture & Precision Hip-Hop",
    tag: "LESSON IN FLOW",
    artist: "Sidhu Moose Wala \u2022 JayB Singh",
    duration: "03:36",
    durationSec: 216,
    src: "audio2/88_take_notes.m4a",
    banner: "assets/images/tracks/track_88.jpg",
    desc: "An authoritative rap masterclass instructing the game on authentic substance and genuine lyricism."
  },
  {
    id: 89,
    num: "26",
    album: "sidhu-classics",
    title: "Phantom Ferrari",
    subtitle: "Sleek Luxury Ride & Unreleased Heat",
    tag: "EXCLUSIVE DROP",
    artist: "Sidhu Moose Wala \u2022 Intense",
    duration: "04:20",
    durationSec: 260,
    src: "audio2/89_phantom_ferrari.m4a",
    banner: "assets/images/tracks/track_89.jpg",
    desc: "An exclusive high-luxury vibe celebrating sleek rides, timeless style, and unmatched confidence."
  },
  {
    id: 90,
    num: "27",
    album: "sidhu-classics",
    title: "Kaali Hoodie",
    subtitle: "Legendary Collab with The Pioneer of Desi Hip-Hop",
    tag: "DESI HIP HOP",
    artist: "Sidhu Moose Wala \u2022 Bohemia \u2022 The Kidd",
    duration: "02:47",
    durationSec: 167,
    src: "audio2/90_kaali_hoodie.m4a",
    banner: "assets/images/tracks/track_90.jpg",
    desc: "The historic, dream collaboration uniting Sidhu Moose Wala with Bohemia - the undisputed Godfather of Desi Hip-Hop."
  },
  {
    id: 91,
    num: "28",
    album: "sidhu-classics",
    title: "Kali Hoodie (Bohemia Special)",
    subtitle: "Rap Star Reloaded Solo Showcase & Extended Bars",
    tag: "RAP STAR RELOADED",
    artist: "Bohemia \u2022 The Kidd",
    duration: "03:03",
    durationSec: 183,
    src: "audio2/91_kali_hoodie_bohemia.m4a",
    banner: "assets/images/tracks/track_91.jpg",
    desc: "Bohemia's powerhouse Rap Star Reloaded rendition delivering signature deep vocal grit and pioneering delivery."
  },
  {
    id: 92,
    num: "01",
    album: "arijit-singh",
    title: "Channa Mereya",
    subtitle: "Soul-Stirring Heartbreak Anthem from Ae Dil Hai Mushkil",
    tag: "TIMELESS CLASSIC",
    artist: "Pritam \u2022 Arijit Singh",
    duration: "04:49",
    durationSec: 289,
    src: "arijit_singh_tracks/92_channa_mereya.m4a",
    banner: "assets/images/tracks/track_92.jpg",
    desc: "The defining heartbreak anthem of a generation - Arijit Singh pours his soul into Pritam's immortal composition."
  },
  {
    id: 93,
    num: "02",
    album: "arijit-singh",
    title: "Ae Dil Hai Mushkil (Title Track)",
    subtitle: "Monumental Anthem of Unrequited Passion & Love",
    tag: "ICONIC TITLE TRACK",
    artist: "Pritam \u2022 Arijit Singh",
    duration: "05:00",
    durationSec: 300,
    src: "arijit_singh_tracks/93_ae_dil_hai_mushkil.m4a",
    banner: "assets/images/tracks/track_93.jpg",
    desc: "A volcanic vocal tour-de-force encapsulating the agony, ecstasy, and beauty of one-sided love."
  },
  {
    id: 94,
    num: "03",
    album: "arijit-singh",
    title: "Enna Sona",
    subtitle: "Enchanting Punjabi Sufi Romance from OK Jaanu",
    tag: "SUFI ROMANCE",
    artist: "A.R. Rahman \u2022 Arijit Singh",
    duration: "03:40",
    durationSec: 220,
    src: "arijit_singh_tracks/94_enna_sona.m4a",
    banner: "assets/images/tracks/track_94.jpg",
    desc: "The historic collaboration between maestro A.R. Rahman and Arijit Singh delivering celestial Punjabi romance."
  },
  {
    id: 95,
    num: "04",
    album: "arijit-singh",
    title: "Hawayein",
    subtitle: "Breezy Acoustic Love Anthem from Jab Harry Met Sejal",
    tag: "BREEZY ROMANCE",
    artist: "Pritam \u2022 Arijit Singh",
    duration: "04:51",
    durationSec: 291,
    src: "arijit_singh_tracks/95_hawayein.m4a",
    banner: "assets/images/tracks/track_95.jpg",
    desc: "Gentle acoustic guitar strums and airy romantic vocals that evoke effortless love like a gentle breeze."
  },
  {
    id: 96,
    num: "05",
    album: "arijit-singh",
    title: "Kalank (Title Track)",
    subtitle: "Grand Sufi Classical Love Symphony",
    tag: "ORCHESTRAL SUFI",
    artist: "Pritam \u2022 Arijit Singh",
    duration: "05:11",
    durationSec: 311,
    src: "arijit_singh_tracks/96_kalank.m4a",
    banner: "assets/images/tracks/track_96.jpg",
    desc: "A cinematic, opulent orchestral masterpiece woven with classical ragas and soaring romantic poetry."
  },
  {
    id: 97,
    num: "06",
    album: "arijit-singh",
    title: "Hamari Adhuri Kahani",
    subtitle: "Haunting Tale of Incomplete Love & Destiny",
    tag: "HAUNTING BALLAD",
    artist: "Jeet Gannguli \u2022 Arijit Singh",
    duration: "06:45",
    durationSec: 405,
    src: "arijit_singh_tracks/97_hamari_adhuri_kahani.m4a",
    banner: "assets/images/tracks/track_97.jpg",
    desc: "Deeply emotional, melancholy melody expressing the profound beauty and ache of an unfulfilled love story."
  },
  {
    id: 98,
    num: "07",
    album: "arijit-singh",
    title: "Humdard",
    subtitle: "Deep Comfort, Healing & Solace from Ek Villain",
    tag: "HEALING MELODY",
    artist: "Mithoon \u2022 Arijit Singh",
    duration: "04:20",
    durationSec: 260,
    src: "arijit_singh_tracks/98_humdard.m4a",
    banner: "assets/images/tracks/track_98.jpg",
    desc: "Mithoon's warm, comforting ballad about finding salvation and solace in someone's unconditional presence."
  },
  {
    id: 99,
    num: "08",
    album: "arijit-singh",
    title: "Heeriye",
    subtitle: "Global Viral Romantic Chart-Topper",
    tag: "GLOBAL VIRAL",
    artist: "Jasleen Royal \u2022 Arijit Singh",
    duration: "03:19",
    durationSec: 199,
    src: "arijit_singh_tracks/99_heeriye.m4a",
    banner: "assets/images/tracks/track_99.jpg",
    desc: "The modern viral sensation uniting Jasleen Royal and Arijit Singh in a fairy-tale folk-pop dream."
  },
  {
    id: 100,
    num: "09",
    album: "arijit-singh",
    title: "O Maahi",
    subtitle: "Soulful Longing & Devotion from Dunki",
    tag: "SOULFUL DEVOTION",
    artist: "Pritam \u2022 Arijit Singh",
    duration: "03:53",
    durationSec: 233,
    src: "arijit_singh_tracks/100_o_maahi.m4a",
    banner: "assets/images/tracks/track_100.jpg",
    desc: "Pure, unadulterated dedication and longing set against sweeping desert landscapes and deep strings."
  },
  {
    id: 101,
    num: "10",
    album: "arijit-singh",
    title: "Qaafirana",
    subtitle: "Pristine Himalayan Romance from Kedarnath",
    tag: "SERENE ROMANCE",
    artist: "Amit Trivedi \u2022 Arijit Singh \u2022 Nikhita Gandhi",
    duration: "05:41",
    durationSec: 341,
    src: "arijit_singh_tracks/101_qaafirana.m4a",
    banner: "assets/images/tracks/track_101.jpg",
    desc: "Breathtaking acoustic serenity capturing the sacred charm of love amidst the snowcapped peaks of Kedarnath."
  },
  {
    id: 102,
    num: "11",
    album: "arijit-singh",
    title: "Tainu Khabar Nahi",
    subtitle: "Sweet Confessions & Gentle Beats from Munjya",
    tag: "SWEET ROMANCE",
    artist: "Sachin-Jigar \u2022 Arijit Singh",
    duration: "03:08",
    durationSec: 188,
    src: "arijit_singh_tracks/102_tainu_khabar_nahi.m4a",
    banner: "assets/images/tracks/track_102.jpg",
    desc: "A delightfully infectious, tender love confession with rhythmic contemporary production by Sachin-Jigar."
  },
  {
    id: 103,
    num: "12",
    album: "arijit-singh",
    title: "Ve Kamleya",
    subtitle: "Tearful Sufi Duet from Rocky Aur Rani",
    tag: "SUFI DUET",
    artist: "Pritam \u2022 Arijit Singh \u2022 Shreya Ghoshal",
    duration: "04:07",
    durationSec: 247,
    src: "arijit_singh_tracks/103_ve_kamleya.m4a",
    banner: "assets/images/tracks/track_103.jpg",
    desc: "An emotional powerhouse duet uniting Arijit Singh and Shreya Ghoshal in timeless Sufi grandeur."
  },
  {
    id: 104,
    num: "13",
    album: "arijit-singh",
    title: "Yeh Fitoor Mera",
    subtitle: "Dark Obsession & Epic Orchestration from Fitoor",
    tag: "EPIC PASSION",
    artist: "Amit Trivedi \u2022 Arijit Singh",
    duration: "04:43",
    durationSec: 283,
    src: "arijit_singh_tracks/104_yeh_fitoor_mera.m4a",
    banner: "assets/images/tracks/track_104.jpg",
    desc: "Amit Trivedi's gothic orchestral epic where Arijit's fiery vocals embody an all-consuming passion."
  },
  {
    id: 105,
    num: "14",
    album: "arijit-singh",
    title: "Khamoshiyan",
    subtitle: "Atmospheric Melodic Mystery & Deep Passion",
    tag: "MYSTIC ROMANCE",
    artist: "Jeet Gannguli \u2022 Arijit Singh",
    duration: "03:16",
    durationSec: 196,
    src: "arijit_singh_tracks/105_khamoshiyan.m4a",
    banner: "assets/images/tracks/track_105.jpg",
    desc: "Intoxicating acoustic mystery exploring unspoken emotions and dark romantic longing."
  },
  {
    id: 106,
    num: "15",
    album: "arijit-singh",
    title: "Phir Se",
    subtitle: "Rising Passion & Resilient Hope from Dhurandhar",
    tag: "POWER BALLAD",
    artist: "Shashwat Sachdev \u2022 Arijit Singh",
    duration: "05:54",
    durationSec: 354,
    src: "arijit_singh_tracks/106_phir_se.m4a",
    banner: "assets/images/tracks/track_106.jpg",
    desc: "A stirring cinematic ballad about rising from heartbreak and finding strength to love again."
  },
  {
    id: 107,
    num: "16",
    album: "arijit-singh",
    title: "Tu Hi Wajah",
    subtitle: "Bhoomi 2026 Celebration of Divine Devotion",
    tag: "DEVOTIONAL POP",
    artist: "Salim-Sulaiman \u2022 Shreya Ghoshal",
    duration: "04:33",
    durationSec: 273,
    src: "arijit_singh_tracks/107_tu_hi_wajah.m4a",
    banner: "assets/images/tracks/track_107.jpg",
    desc: "A vibrant celebration of universal divine gratitude and love composed by Salim-Sulaiman."
  },
  {
    id: 108,
    num: "17",
    album: "arijit-singh",
    title: "Channa Ve",
    subtitle: "Acoustic Folk Romance & Emotional Warmth",
    tag: "FOLK ACOUSTIC",
    artist: "Akhil Sachdeva \u2022 Mansheel Gujral",
    duration: "03:31",
    durationSec: 211,
    src: "arijit_singh_tracks/108_channa_ve.m4a",
    banner: "assets/images/tracks/track_108.jpg",
    desc: "A heartwarming, rustic Punjabi love melody celebrating soulmate bonding and companionship."
  },
  {
    id: 109,
    num: "18",
    album: "arijit-singh",
    title: "Dizzy",
    subtitle: "Modern Urban Punjabi Beat & Breezy Grooves",
    tag: "URBAN POP",
    artist: "Raghav Chaitanya \u2022 Simran Choudhary \u2022 Showkidd",
    duration: "02:54",
    durationSec: 174,
    src: "arijit_singh_tracks/109_dizzy.m4a",
    banner: "assets/images/tracks/track_109.jpg",
    desc: "Urban, contemporary beats infused with traditional folk flair and modern pop groove."
  },
  {
    id: 110,
    num: "19",
    album: "arijit-singh",
    title: "Tera Mera Rishta Continues",
    subtitle: "Awarapan 2 Nostalgic Ballad of Eternal Ties",
    tag: "NOSTALGIC BALLAD",
    artist: "Mithoon \u2022 Saaj Bhatt \u2022 Subodhh Sharma",
    duration: "06:05",
    durationSec: 365,
    src: "arijit_singh_tracks/110_tera_mera_rishta_continues.m4a",
    banner: "assets/images/tracks/track_110.jpg",
    desc: "The return of an iconic melody, reimagined with tragic passion and soaring violins."
  },
  {
    id: 111,
    num: "20",
    album: "arijit-singh",
    title: "Yeh Prem Mol Liya",
    subtitle: "Grand Festive Barjatya Melodic Romance",
    tag: "CLASSICAL ROMANCE",
    artist: "Himesh Reshammiya \u2022 Shreya Ghoshal",
    duration: "05:07",
    durationSec: 307,
    src: "arijit_singh_tracks/111_yeh_prem_mol_liya.m4a",
    banner: "assets/images/tracks/track_111.jpg",
    desc: "Lavish traditional strings, joyous flutes, and celebrating the innocence of true romance."
  },
  {
    id: 112,
    num: "21",
    album: "arijit-singh",
    title: "Vaaroon",
    subtitle: "Passionate Folk Energy & Wedding Revelry",
    tag: "FOLK CELEBRATION",
    artist: "Anand Bhaskar \u2022 Romy",
    duration: "05:50",
    durationSec: 350,
    src: "arijit_singh_tracks/112_vaaroon.m4a",
    banner: "assets/images/tracks/track_112.jpg",
    desc: "Rousing folk percussion, celebratory brass, and electrifying celebration vibes."
  },
  {
    id: 113,
    num: "22",
    album: "arijit-singh",
    title: "Banjaare (2026 Mashup Mix)",
    subtitle: "Barsaat \u00d7 Kitab \u00d7 Bairan High-Energy Dance Mashup",
    tag: "CLUB MASHUP",
    artist: "DJ ANUJ",
    duration: "02:58",
    durationSec: 178,
    src: "arijit_singh_tracks/113_banjaare_mashup_2026.m4a",
    banner: "assets/images/tracks/track_113.jpg",
    desc: "Electrifying club basslines, vocal drops, and nonstop dance floor energy."
  },
  {
    id: 114,
    num: "23",
    album: "arijit-singh",
    title: "Intezaar",
    subtitle: "Single",
    tag: "SOULFUL MELODY",
    artist: "Arijit Singh, Asees Kaur, Mithoon",
    duration: "03:05",
    durationSec: 185,
    src: "arijit_singh_tracks/114_intezaar.m4a",
    banner: "assets/images/tracks/track_114.jpg",
    desc: "Deeply emotional romantic single produced and composed by Mithoon."
  },
  {
    id: 115,
    num: "24",
    album: "arijit-singh",
    title: "Kabhi Jo Badal Barse (Progressive Mix)",
    subtitle: "Jackpot",
    tag: "CHILL HOUSE HIT",
    artist: "Arijit Singh, Sharib-Toshi",
    duration: "05:27",
    durationSec: 327,
    src: "arijit_singh_tracks/115_kabhi_jo_badal_barse_progressi.m4a",
    banner: "assets/images/tracks/track_115.jpg",
    desc: "Hypnotic progressive reimagining of the classic rain hit."
  },
  {
    id: 116,
    num: "25",
    album: "arijit-singh",
    title: "Murshida",
    subtitle: "Begum Jaan",
    tag: "SUFI SOUL",
    artist: "Arijit Singh, Anu Malik",
    duration: "02:16",
    durationSec: 136,
    src: "arijit_singh_tracks/116_murshida.m4a",
    banner: "assets/images/tracks/track_116.jpg",
    desc: "Intense spiritual Sufi ghazal from Begum Jaan."
  },
  {
    id: 117,
    num: "26",
    album: "arijit-singh",
    title: "Kasturi (Ek Jaisa Haal)",
    subtitle: "Amar Prem Ki Prem Kahani",
    tag: "ROMANTIC HIT",
    artist: "Arijit Singh, Prasad S",
    duration: "04:12",
    durationSec: 252,
    src: "arijit_singh_tracks/117_kasturi_ek_jaisa_haal.m4a",
    banner: "assets/images/tracks/track_117.jpg",
    desc: "Melodic contemporary romantic track with soulful vocals."
  },
  {
    id: 118,
    num: "27",
    album: "arijit-singh",
    title: "Tu Hi Yaar Mera",
    subtitle: "Pati Patni Aur Woh",
    tag: "UPBEAT CELEBRATION",
    artist: "Arijit Singh, Neha Kakkar, Rochak Kohli",
    duration: "03:51",
    durationSec: 231,
    src: "arijit_singh_tracks/118_tu_hi_yaar_mera.m4a",
    banner: "assets/images/tracks/track_118.jpg",
    desc: "Joyful friendship and love celebration anthem."
  },
  {
    id: 119,
    num: "28",
    album: "arijit-singh",
    title: "Aaj Se Teri",
    subtitle: "Pad Man",
    tag: "ROMANTIC HIT",
    artist: "Arijit Singh, Amit Trivedi",
    duration: "05:12",
    durationSec: 312,
    src: "arijit_singh_tracks/119_aaj_se_teri.m4a",
    banner: "assets/images/tracks/track_119.jpg",
    desc: "Heartwarming romantic anthem from Pad Man composed by Amit Trivedi."
  },
  {
    id: 120,
    num: "29",
    album: "arijit-singh",
    title: "Chahun Main Ya Naa",
    subtitle: "Aashiqui 2",
    tag: "BLOCKBUSTER LOVE",
    artist: "Arijit Singh, Palak Muchhal",
    duration: "05:17",
    durationSec: 317,
    src: "arijit_singh_tracks/120_chahun_main_ya_naa.m4a",
    banner: "assets/images/tracks/track_120.jpg",
    desc: "Iconic romantic duet from Aashiqui 2 by Jeet Gannguli."
  },
  {
    id: 121,
    num: "30",
    album: "arijit-singh",
    title: "Apna Bana Le",
    subtitle: "Bhediya",
    tag: "SOULFUL ROMANCE",
    artist: "Arijit Singh, Sachin-Jigar",
    duration: "04:21",
    durationSec: 261,
    src: "arijit_singh_tracks/121_apna_bana_le.m4a",
    banner: "assets/images/tracks/track_121.jpg",
    desc: "Enchanting melodic ballad from Bhediya starring Varun & Kriti."
  },
  {
    id: 122,
    num: "31",
    album: "arijit-singh",
    title: "Bad Boy",
    subtitle: "Saaho",
    tag: "CLUB PARTY",
    artist: "Badshah, Neeti Mohan",
    duration: "02:58",
    durationSec: 178,
    src: "arijit_singh_tracks/122_bad_boy.m4a",
    banner: "assets/images/tracks/track_122.jpg",
    desc: "High octane party track featuring Prabhas and Jacqueline Fernandez."
  },
  {
    id: 123,
    num: "32",
    album: "arijit-singh",
    title: "Bairaagi",
    subtitle: "Bareilly Ki Barfi",
    tag: "SWEET MELODY",
    artist: "Samira Koppikar, Arijit Singh",
    duration: "04:12",
    durationSec: 252,
    src: "arijit_singh_tracks/123_bairaagi.m4a",
    banner: "assets/images/tracks/track_123.jpg",
    desc: "Gentle acoustic romance with traditional Indian touches."
  },
  {
    id: 124,
    num: "33",
    album: "arijit-singh",
    title: "Bandeya",
    subtitle: "Dil Juunglee",
    tag: "EMOTIVE BALLAD",
    artist: "Arijit Singh, Shaarib-Toshi",
    duration: "03:04",
    durationSec: 184,
    src: "arijit_singh_tracks/124_bandeya.m4a",
    banner: "assets/images/tracks/track_124.jpg",
    desc: "Emotional ballad depicting separation and love."
  },
  {
    id: 125,
    num: "34",
    album: "arijit-singh",
    title: "Bekhayali",
    subtitle: "Kabir Singh",
    tag: "PASSIONATE HEARTBREAK",
    artist: "Arijit Singh, Sachet-Parampara",
    duration: "06:11",
    durationSec: 371,
    src: "arijit_singh_tracks/125_bekhayali.m4a",
    banner: "assets/images/tracks/track_125.jpg",
    desc: "Raw emotional heartbreak anthem from Kabir Singh."
  },
  {
    id: 126,
    num: "35",
    album: "arijit-singh",
    title: "O Rangrez",
    subtitle: "Bhaag Milkha Bhaag",
    tag: "SUFI CLASSIC",
    artist: "Shreya Ghoshal, Javed Bashir, Shankar-Ehsaan-Loy",
    duration: "03:26",
    durationSec: 206,
    src: "arijit_singh_tracks/126_o_rangrez.m4a",
    banner: "assets/images/tracks/track_126.jpg",
    desc: "Traditional semi-classical Sufi romantic gem."
  },
  {
    id: 127,
    num: "36",
    album: "arijit-singh",
    title: "Bolna",
    subtitle: "Kapoor & Sons",
    tag: "SOULFUL MELODY",
    artist: "Arijit Singh, Asees Kaur",
    duration: "03:32",
    durationSec: 212,
    src: "arijit_singh_tracks/127_bolna.m4a",
    banner: "assets/images/tracks/track_127.jpg",
    desc: "Delicate and tender romantic acoustic ballad from Kapoor & Sons."
  },
  {
    id: 128,
    num: "37",
    album: "arijit-singh",
    title: "Chaleya",
    subtitle: "Jawan",
    tag: "VIRAL CHARTBUSTER",
    artist: "Arijit Singh, Shilpa Rao, Anirudh",
    duration: "03:20",
    durationSec: 200,
    src: "arijit_singh_tracks/128_chaleya.m4a",
    banner: "assets/images/tracks/track_128.jpg",
    desc: "Groovy energetic chartbuster from Jawan starring Shah Rukh Khan."
  },
  {
    id: 129,
    num: "38",
    album: "arijit-singh",
    title: "Dangal",
    subtitle: "Dangal",
    tag: "MOTIVATIONAL ANTHEM",
    artist: "Daler Mehndi, Pritam",
    duration: "05:07",
    durationSec: 307,
    src: "arijit_singh_tracks/129_dangal.m4a",
    banner: "assets/images/tracks/track_129.jpg",
    desc: "Roaring title track from Dangal starring Aamir Khan."
  },
  {
    id: 130,
    num: "39",
    album: "arijit-singh",
    title: "Dariya",
    subtitle: "Baar Baar Dekho",
    tag: "FOLK ROMANCE",
    artist: "Arko",
    duration: "03:38",
    durationSec: 218,
    src: "arijit_singh_tracks/130_dariya.m4a",
    banner: "assets/images/tracks/track_130.jpg",
    desc: "Mellow Punjabi folk love ballad with acoustic guitar."
  },
  {
    id: 131,
    num: "40",
    album: "arijit-singh",
    title: "Deva Deva",
    subtitle: "Brahmāstra",
    tag: "SPIRITUAL DEVOTION",
    artist: "Arijit Singh, Jonita Gandhi, Pritam",
    duration: "03:11",
    durationSec: 191,
    src: "arijit_singh_tracks/131_deva_deva.m4a",
    banner: "assets/images/tracks/track_131.jpg",
    desc: "Soul-stirring fire devotion anthem from Brahmāstra: Part One."
  },
  {
    id: 132,
    num: "41",
    album: "arijit-singh",
    title: "Dhokha Dhadi",
    subtitle: "R... Rajkumar",
    tag: "PLAYFUL ROMANCE",
    artist: "Arijit Singh, Palak Muchhal, Pritam",
    duration: "04:09",
    durationSec: 249,
    src: "arijit_singh_tracks/132_dhokha_dhadi.m4a",
    banner: "assets/images/tracks/track_132.jpg",
    desc: "Charming breezy romance from R... Rajkumar."
  },
  {
    id: 133,
    num: "42",
    album: "arijit-singh",
    title: "Dhoonde Akhiyaan",
    subtitle: "Jabariya Jodi",
    tag: "SAD ROMANTIC",
    artist: "Yasser Desai, Altamash Faridi, Tanishk Bagchi",
    duration: "04:35",
    durationSec: 275,
    src: "arijit_singh_tracks/133_dhoonde_akhiyaan.m4a",
    banner: "assets/images/tracks/track_133.jpg",
    desc: "Melodic Punjabi romantic track with emotive strings."
  },
  {
    id: 134,
    num: "43",
    album: "arijit-singh",
    title: "Dil Mera",
    subtitle: "Guest Iin London",
    tag: "SWEET ROMANCE",
    artist: "Ash King, Prakriti Kakar, Raghav Sachar",
    duration: "03:15",
    durationSec: 195,
    src: "arijit_singh_tracks/134_dil_mera.m4a",
    banner: "assets/images/tracks/track_134.jpg",
    desc: "Lighthearted romantic track with acoustic guitar."
  },
  {
    id: 135,
    num: "44",
    album: "arijit-singh",
    title: "Ghungroo",
    subtitle: "WAR",
    tag: "PARTY ANTHEM",
    artist: "Arijit Singh, Shilpa Rao, Vishal-Shekhar",
    duration: "02:25",
    durationSec: 145,
    src: "arijit_singh_tracks/135_ghungroo.m4a",
    banner: "assets/images/tracks/track_135.jpg",
    desc: "Breezy dance celebration featuring Hrithik Roshan and Vaani Kapoor."
  },
  {
    id: 136,
    num: "45",
    album: "arijit-singh",
    title: "Ilahi",
    subtitle: "Yeh Jawaani Hai Deewani",
    tag: "WANDERLUST ANTHEM",
    artist: "Arijit Singh, Pritam",
    duration: "03:49",
    durationSec: 229,
    src: "arijit_singh_tracks/136_ilahi.m4a",
    banner: "assets/images/tracks/track_136.jpg",
    desc: "Carefree, wanderlust spirit anthem from Yeh Jawaani Hai Deewani."
  },
  {
    id: 137,
    num: "46",
    album: "arijit-singh",
    title: "Judaai",
    subtitle: "Badlapur",
    tag: "HEARTBREAK HIT",
    artist: "Arijit Singh, Rekha Bhardwaj, Sachin-Jigar",
    duration: "04:32",
    durationSec: 272,
    src: "arijit_singh_tracks/137_judaai.m4a",
    banner: "assets/images/tracks/track_137.jpg",
    desc: "Haunting and melancholic lamentation ballad from Badlapur."
  },
  {
    id: 138,
    num: "47",
    album: "arijit-singh",
    title: "Kesariya",
    subtitle: "Brahmāstra",
    tag: "BLOCKBUSTER ROMANCE",
    artist: "Arijit Singh, Pritam, Amitabh Bhattacharya",
    duration: "04:28",
    durationSec: 268,
    src: "arijit_singh_tracks/138_kesariya.m4a",
    banner: "assets/images/tracks/track_138.jpg",
    desc: "Mega blockbuster love anthem of the decade from Brahmāstra."
  },
  {
    id: 139,
    num: "48",
    album: "arijit-singh",
    title: "Khairiyat",
    subtitle: "Chhichhore",
    tag: "EMOTIONAL BALLAD",
    artist: "Arijit Singh, Pritam",
    duration: "04:40",
    durationSec: 280,
    src: "arijit_singh_tracks/139_khairiyat.m4a",
    banner: "assets/images/tracks/track_139.jpg",
    desc: "Touching melody celebrating unconditional love and care from Chhichhore."
  },
  {
    id: 140,
    num: "49",
    album: "arijit-singh",
    title: "Dil Haareya",
    subtitle: "Dharma 2.0",
    tag: "ROMANTIC HIT",
    artist: "Arijit Singh, Vivian Richard",
    duration: "05:08",
    durationSec: 308,
    src: "arijit_singh_tracks/140_dil_haareya.m4a",
    banner: "assets/images/tracks/track_140.jpg",
    desc: "Sweet acoustic romantic confession ballad."
  },
  {
    id: 141,
    num: "50",
    album: "arijit-singh",
    title: "Main Agar",
    subtitle: "Tubelight",
    tag: "SOULFUL BALLAD",
    artist: "Arijit Singh, Pritam",
    duration: "04:39",
    durationSec: 279,
    src: "arijit_singh_tracks/141_main_agar.m4a",
    banner: "assets/images/tracks/track_141.jpg",
    desc: "Gentle heartfelt ballad featuring Salman Khan from Tubelight."
  },
  {
    id: 142,
    num: "51",
    album: "arijit-singh",
    title: "Main Dhoondne Ko Zamaane Mein",
    subtitle: "Heartless",
    tag: "MELANCHOLIC HIT",
    artist: "Arijit Singh, Gaurav Dagaonkar",
    duration: "04:23",
    durationSec: 263,
    src: "arijit_singh_tracks/142_main_dhoondne_ko_zamaane_mein.m4a",
    banner: "assets/images/tracks/track_142.jpg",
    desc: "Soulful sad ballad that established Arijit’s emotive signature."
  },
  {
    id: 143,
    num: "52",
    album: "arijit-singh",
    title: "Mast Magan",
    subtitle: "2 States",
    tag: "SUFI ROMANCE",
    artist: "Arijit Singh, Chinmayi Sripada, Shankar-Ehsaan-Loy",
    duration: "04:40",
    durationSec: 280,
    src: "arijit_singh_tracks/143_mast_magan.m4a",
    banner: "assets/images/tracks/track_143.jpg",
    desc: "Devotional Sufi romantic masterpiece from 2 States."
  },
  {
    id: 144,
    num: "53",
    album: "arijit-singh",
    title: "Mere Yaaraa",
    subtitle: "Sooryavanshi",
    tag: "WEDDING LOVE",
    artist: "Arijit Singh, Neeti Mohan, JAM8",
    duration: "04:45",
    durationSec: 285,
    src: "arijit_singh_tracks/144_mere_yaaraa.m4a",
    banner: "assets/images/tracks/track_144.jpg",
    desc: "Gentle celebratory wedding love anthem from Sooryavanshi."
  },
  {
    id: 145,
    num: "54",
    album: "arijit-singh",
    title: "Milne Hai Mujhse Aayi",
    subtitle: "Aashiqui 2",
    tag: "PASSIONATE ROCK",
    artist: "Arijit Singh, Jeet Gannguli",
    duration: "04:55",
    durationSec: 295,
    src: "arijit_singh_tracks/145_milne_hai_mujhse_aayi.m4a",
    banner: "assets/images/tracks/track_145.jpg",
    desc: "Intense electric guitar-driven love confession from Aashiqui 2."
  },
  {
    id: 146,
    num: "55",
    album: "arijit-singh",
    title: "Naina",
    subtitle: "Dangal",
    tag: "EMOTIONAL MELODY",
    artist: "Arijit Singh, Pritam",
    duration: "03:45",
    durationSec: 225,
    src: "arijit_singh_tracks/146_naina.m4a",
    banner: "assets/images/tracks/track_146.jpg",
    desc: "Subtle poignant ballad depicting emotional vulnerability from Dangal."
  },
  {
    id: 147,
    num: "56",
    album: "arijit-singh",
    title: "Nazm Nazm",
    subtitle: "Bareilly Ki Barfi",
    tag: "ROMANTIC ACOUSTIC",
    artist: "Arko, Arijit Singh",
    duration: "03:46",
    durationSec: 226,
    src: "arijit_singh_tracks/147_nazm_nazm.m4a",
    banner: "assets/images/tracks/track_147.jpg",
    desc: "Acoustic poetic romance from Bareilly Ki Barfi."
  },
  {
    id: 148,
    num: "57",
    album: "arijit-singh",
    title: "O Meri Laila",
    subtitle: "Laila Majnu",
    tag: "FOLK PASSION",
    artist: "Atif Aslam, Jyotica Tangri, Joi Barua",
    duration: "04:41",
    durationSec: 281,
    src: "arijit_singh_tracks/148_o_meri_laila.m4a",
    banner: "assets/images/tracks/track_148.jpg",
    desc: "Kashmiri folk-infused passionate romance from Laila Majnu."
  },
  {
    id: 149,
    num: "58",
    album: "arijit-singh",
    title: "Phir Kabhi",
    subtitle: "M.S. Dhoni: The Untold Story",
    tag: "HEART TOUCHING",
    artist: "Arijit Singh, Amaal Mallik",
    duration: "04:47",
    durationSec: 287,
    src: "arijit_singh_tracks/149_phir_kabhi.m4a",
    banner: "assets/images/tracks/track_149.jpg",
    desc: "Subtle romantic yearning ballad from M.S. Dhoni: The Untold Story."
  },
  {
    id: 150,
    num: "59",
    album: "arijit-singh",
    title: "Pachtaoge",
    subtitle: "Jaani Ve",
    tag: "HEARTBREAK ANTHEM",
    artist: "Arijit Singh, B Praak, Jaani",
    duration: "03:46",
    durationSec: 226,
    src: "arijit_singh_tracks/150_pachtaoge.m4a",
    banner: "assets/images/tracks/track_150.jpg",
    desc: "Chart-topping emotional heartbreak ballad starring Vicky Kaushal."
  },
  {
    id: 151,
    num: "60",
    album: "arijit-singh",
    title: "Pyaar Hota Kayi Baar Hai",
    subtitle: "Tu Jhoothi Main Makkaar",
    tag: "UPBEAT GROOVE",
    artist: "Arijit Singh, Pritam",
    duration: "03:36",
    durationSec: 216,
    src: "arijit_singh_tracks/151_pyaar_hota_kayi_baar_hai.m4a",
    banner: "assets/images/tracks/track_151.jpg",
    desc: "Fun high-energy club groove starring Ranbir Kapoor."
  },
  {
    id: 152,
    num: "61",
    album: "arijit-singh",
    title: "Raabta (Night In A Motel)",
    subtitle: "Agent Vinod",
    tag: "CLASSIC ROMANCE",
    artist: "Arijit Singh, Hamsika Iyer, Pritam",
    duration: "04:03",
    durationSec: 243,
    src: "arijit_singh_tracks/152_raabta_night_in_a_motel.m4a",
    banner: "assets/images/tracks/track_152.jpg",
    desc: "Timeless romantic connection melody composed by Pritam."
  },
  {
    id: 153,
    num: "62",
    album: "arijit-singh",
    title: "Rait Zara Si",
    subtitle: "Atrangi Re",
    tag: "A.R. RAHMAN MAGIC",
    artist: "Arijit Singh, Shashaa Tirupati, A.R. Rahman",
    duration: "04:51",
    durationSec: 291,
    src: "arijit_singh_tracks/153_rait_zara_si.m4a",
    banner: "assets/images/tracks/track_153.jpg",
    desc: "Exquisite classical romantic fusion composed by A.R. Rahman."
  },
  {
    id: 154,
    num: "63",
    album: "arijit-singh",
    title: "Tere Ho Ke Rahenge",
    subtitle: "Raja Natwarlal",
    tag: "HEARTFELT DEVOTION",
    artist: "Arijit Singh, Yuvan Shankar Raja",
    duration: "03:01",
    durationSec: 181,
    src: "arijit_singh_tracks/154_tere_ho_ke_rahenge.m4a",
    banner: "assets/images/tracks/track_154.jpg",
    desc: "Soulful romantic dedication from Raja Natwarlal."
  },
  {
    id: 155,
    num: "64",
    album: "arijit-singh",
    title: "Ruaan",
    subtitle: "Tiger 3",
    tag: "PASSIONATE SOUL",
    artist: "Arijit Singh, Pritam",
    duration: "03:06",
    durationSec: 186,
    src: "arijit_singh_tracks/155_ruaan.m4a",
    banner: "assets/images/tracks/track_155.jpg",
    desc: "Lyrical romantic serenade featuring Salman Khan from Tiger 3."
  },
  {
    id: 156,
    num: "65",
    album: "arijit-singh",
    title: "Safar",
    subtitle: "Jab Harry Met Sejal",
    tag: "LIFE JOURNEY",
    artist: "Arijit Singh, Pritam",
    duration: "03:36",
    durationSec: 216,
    src: "arijit_singh_tracks/156_safar.m4a",
    banner: "assets/images/tracks/track_156.jpg",
    desc: "Philosophical introspective travel anthem from Jab Harry Met Sejal."
  },
  {
    id: 157,
    num: "66",
    album: "arijit-singh",
    title: "Dhun",
    subtitle: "Saiyaara",
    tag: "SOULFUL ROMANCE",
    artist: "Arijit Singh, Mithoon",
    duration: "03:32",
    durationSec: 212,
    src: "arijit_singh_tracks/157_dhun.m4a",
    banner: "assets/images/tracks/track_157.jpg",
    desc: "Romantic melody composed by Mithoon."
  },
  {
    id: 158,
    num: "67",
    album: "arijit-singh",
    title: "Sajni",
    subtitle: "Laapataa Ladies",
    tag: "PURE ROMANCE",
    artist: "Arijit Singh, Ram Sampath",
    duration: "02:50",
    durationSec: 170,
    src: "arijit_singh_tracks/158_sajni.m4a",
    banner: "assets/images/tracks/track_158.jpg",
    desc: "Timeless sweet acoustic viral romance from Laapataa Ladies."
  },
  {
    id: 159,
    num: "68",
    album: "arijit-singh",
    title: "Satranga",
    subtitle: "Animal",
    tag: "INTENSE LOVE",
    artist: "Arijit Singh, Shreyas Puranik",
    duration: "04:31",
    durationSec: 271,
    src: "arijit_singh_tracks/159_satranga.m4a",
    banner: "assets/images/tracks/track_159.jpg",
    desc: "Deep emotional marital ballad from Animal starring Ranbir & Rashmika."
  },
  {
    id: 160,
    num: "69",
    album: "arijit-singh",
    title: "Soch Na Sake",
    subtitle: "Airlift",
    tag: "ROMANTIC BALLAD",
    artist: "Arijit Singh, Tulsi Kumar, Amaal Mallik",
    duration: "04:43",
    durationSec: 283,
    src: "arijit_singh_tracks/160_soch_na_sake.m4a",
    banner: "assets/images/tracks/track_160.jpg",
    desc: "Beloved soulful romantic duet from Airlift."
  },
  {
    id: 161,
    num: "70",
    album: "arijit-singh",
    title: "Sun Saathiya",
    subtitle: "ABCD 2",
    tag: "SOULFUL DANCE",
    artist: "Priya Saraiya, Divya Kumar, Sachin-Jigar",
    duration: "03:38",
    durationSec: 218,
    src: "arijit_singh_tracks/161_sun_saathiya.m4a",
    banner: "assets/images/tracks/track_161.jpg",
    desc: "Melodious dance love song with pristine vocals."
  },
  {
    id: 162,
    num: "71",
    album: "arijit-singh",
    title: "Tera Chehra",
    subtitle: "Sanam Teri Kasam",
    tag: "DEVOTIONAL LOVE",
    artist: "Arijit Singh, Himesh Reshammiya",
    duration: "04:34",
    durationSec: 274,
    src: "arijit_singh_tracks/162_tera_chehra.m4a",
    banner: "assets/images/tracks/track_162.jpg",
    desc: "Heart-touching melody from Sanam Teri Kasam."
  },
  {
    id: 163,
    num: "72",
    album: "arijit-singh",
    title: "Tera Fitoor",
    subtitle: "Genius",
    tag: "YOUTHFUL ROMANCE",
    artist: "Arijit Singh, Himesh Reshammiya",
    duration: "05:10",
    durationSec: 310,
    src: "arijit_singh_tracks/163_tera_fitoor.m4a",
    banner: "assets/images/tracks/track_163.jpg",
    desc: "Passionate romantic anthem with grand orchestral strings."
  },
  {
    id: 164,
    num: "73",
    album: "arijit-singh",
    title: "Tere Liye",
    subtitle: "Namaste England",
    tag: "ROMANTIC DUET",
    artist: "Atif Aslam, Akanksha Bhandari, Mannan Shaah",
    duration: "04:39",
    durationSec: 279,
    src: "arijit_singh_tracks/164_tere_liye.m4a",
    banner: "assets/images/tracks/track_164.jpg",
    desc: "Gentle soaring love ballad from Namaste England."
  },
  {
    id: 165,
    num: "74",
    album: "arijit-singh",
    title: "Tere Pyaar Mein",
    subtitle: "Tu Jhoothi Main Makkaar",
    tag: "EURO-POP DANCE",
    artist: "Arijit Singh, Nikhita Gandhi, Pritam",
    duration: "04:26",
    durationSec: 266,
    src: "arijit_singh_tracks/165_tere_pyaar_mein.m4a",
    banner: "assets/images/tracks/track_165.jpg",
    desc: "Breezy vibrant Mediterranean pop romance from TJMM."
  },
  {
    id: 166,
    num: "75",
    album: "arijit-singh",
    title: "Tere Sang Yaara",
    subtitle: "Rustom",
    tag: "ROMANTIC HIT",
    artist: "Atif Aslam, Arko",
    duration: "04:46",
    durationSec: 286,
    src: "arijit_singh_tracks/166_tere_sang_yaara.m4a",
    banner: "assets/images/tracks/track_166.jpg",
    desc: "Timeless melodic love promise from Rustom."
  },
  {
    id: 167,
    num: "76",
    album: "arijit-singh",
    title: "Teri Meri Kahaani",
    subtitle: "Gabbar Is Back",
    tag: "POWERFUL DUET",
    artist: "Arijit Singh, Palak Muchhal, Chirantan Bhatt",
    duration: "05:31",
    durationSec: 331,
    src: "arijit_singh_tracks/167_teri_meri_kahaani.m4a",
    banner: "assets/images/tracks/track_167.jpg",
    desc: "Grand emotional romantic duet from Gabbar Is Back."
  },
  {
    id: 168,
    num: "77",
    album: "arijit-singh",
    title: "Teri Ore",
    subtitle: "Singh Is Kinng",
    tag: "TIMELESS CLASSIC",
    artist: "Rahat Fateh Ali Khan, Shreya Ghoshal, Pritam",
    duration: "05:39",
    durationSec: 339,
    src: "arijit_singh_tracks/168_teri_ore.m4a",
    banner: "assets/images/tracks/track_168.jpg",
    desc: "Evergreen romantic duet composed by Pritam."
  },
  {
    id: 169,
    num: "78",
    album: "arijit-singh",
    title: "Toota Jo Kabhi Tara",
    subtitle: "A Flying Jatt",
    tag: "DREAMY ROMANCE",
    artist: "Atif Aslam, Sumedha Karmahe, Sachin-Jigar",
    duration: "05:05",
    durationSec: 305,
    src: "arijit_singh_tracks/169_toota_jo_kabhi_tara.m4a",
    banner: "assets/images/tracks/track_169.jpg",
    desc: "Ethereal fairytale love melody from A Flying Jatt."
  },
  {
    id: 170,
    num: "79",
    album: "arijit-singh",
    title: "Tujhe Kitna Chahne Lage",
    subtitle: "Kabir Singh",
    tag: "PURE DEVOTION",
    artist: "Arijit Singh, Mithoon",
    duration: "04:44",
    durationSec: 284,
    src: "arijit_singh_tracks/170_tujhe_kitna_chahne_lage.m4a",
    banner: "assets/images/tracks/track_170.jpg",
    desc: "Iconic immortal love ballad from Kabir Singh composed by Mithoon."
  },
  {
    id: 171,
    num: "80",
    album: "arijit-singh",
    title: "Ve Maahi",
    subtitle: "Kesari",
    tag: "PUNJABI ROMANCE",
    artist: "Arijit Singh, Asees Kaur, Tanishk Bagchi",
    duration: "03:44",
    durationSec: 224,
    src: "arijit_singh_tracks/171_ve_maahi.m4a",
    banner: "assets/images/tracks/track_171.jpg",
    desc: "Beautiful rustic Punjabi love ballad from Kesari."
  },
  {
    id: 172,
    num: "81",
    album: "arijit-singh",
    title: "What Jhumka ?",
    subtitle: "Rocky Aur Rani Kii Prem Kahaani",
    tag: "DESI PARTY DANCE",
    artist: "Arijit Singh, Jonita Gandhi, Pritam",
    duration: "03:33",
    durationSec: 213,
    src: "arijit_singh_tracks/172_what_jhumka.m4a",
    banner: "assets/images/tracks/track_172.jpg",
    desc: "Electrifying party banger from Rocky Aur Rani Kii Prem Kahaani."
  },
  {
    id: 173,
    num: "82",
    album: "arijit-singh",
    title: "Chamka Chamka",
    subtitle: "Shannon K",
    tag: "SOULFUL HIT",
    artist: "Shannon K",
    duration: "03:10",
    durationSec: 190,
    src: "arijit_singh_tracks/173_chamka_chamka.m4a",
    banner: "assets/images/tracks/track_173.jpg",
    desc: "Captivating Bollywood melody featuring Chamka Chamka."
  },
  {
    id: 174,
    num: "83",
    album: "arijit-singh",
    title: "तेरा आख़िरी तोहफ़ा संभाल रखा है 💔",
    subtitle: "Tera Aakhri Tohfa",
    tag: "SOULFUL HIT",
    artist: "Suron Ka Jadu",
    duration: "06:00",
    durationSec: 360,
    src: "arijit_singh_tracks/174_.m4a",
    banner: "assets/images/tracks/track_174.jpg",
    desc: "Captivating Bollywood melody featuring तेरा आख़िरी तोहफ़ा संभाल रखा है 💔."
  },
  {
    id: 175,
    num: "84",
    album: "arijit-singh",
    title: "Sirf tum - Darshan raval",
    subtitle: "the everafter",
    tag: "SOULFUL HIT",
    artist: "Ly Music",
    duration: "03:43",
    durationSec: 223,
    src: "arijit_singh_tracks/175_sirf_tum_darshan_raval.m4a",
    banner: "assets/images/tracks/track_175.jpg",
    desc: "Captivating Bollywood melody featuring Sirf tum - Darshan raval."
  },
  {
    id: 176,
    num: "85",
    album: "arijit-singh",
    title: "Afsaana Banaaya Aapne  (Resonance)",
    subtitle: "Single",
    tag: "SOULFUL HIT",
    artist: "Himesh Reshammiya",
    duration: "00:49",
    durationSec: 49,
    src: "arijit_singh_tracks/176_afsaana_banaaya_aapne_resonanc.m4a",
    banner: "assets/images/tracks/track_176.jpg",
    desc: "Captivating Bollywood melody featuring Afsaana Banaaya Aapne  (Resonance)."
  },
  {
    id: 177,
    num: "86",
    album: "arijit-singh",
    title: "Arijit Singh - Apna Bana Le",
    subtitle: "Varun Dhawan & Kriti Sanon",
    tag: "SOULFUL HIT",
    artist: "Dil Se Bollywood 24x7",
    duration: "03:23",
    durationSec: 203,
    src: "arijit_singh_tracks/177_arijit_singh_apna_bana_le.m4a",
    banner: "assets/images/tracks/track_177.jpg",
    desc: "Captivating Bollywood melody featuring Arijit Singh - Apna Bana Le."
  },
  {
    id: 178,
    num: "87",
    album: "arijit-singh",
    title: "BEKHUDI",
    subtitle: "Single",
    tag: "SOULFUL HIT",
    artist: "DARSHAN RAVAL, ADITI SINGH SHARMA, HIMESH RESHAMMIYA",
    duration: "05:47",
    durationSec: 347,
    src: "arijit_singh_tracks/178_bekhudi.m4a",
    banner: "assets/images/tracks/track_178.jpg",
    desc: "Captivating Bollywood melody featuring BEKHUDI."
  },
  {
    id: 179,
    num: "88",
    album: "arijit-singh",
    title: "Bebo",
    subtitle: "Single",
    tag: "SOULFUL HIT",
    artist: "Alfaaz, Yo Yo Honey Singh",
    duration: "03:55",
    durationSec: 235,
    src: "arijit_singh_tracks/179_bebo.m4a",
    banner: "assets/images/tracks/track_179.jpg",
    desc: "Captivating Bollywood melody featuring Bebo."
  },
  {
    id: 180,
    num: "89",
    album: "arijit-singh",
    title: "Jaan Le Gayi - Bhoomi 2024",
    subtitle: "Sonu Nigam, Vishal Dadlani",
    tag: "SOULFUL HIT",
    artist: "Salim Sulaiman Music",
    duration: "05:24",
    durationSec: 324,
    src: "arijit_singh_tracks/180_jaan_le_gayi_bhoomi_2024.m4a",
    banner: "assets/images/tracks/track_180.jpg",
    desc: "Captivating Bollywood melody featuring Jaan Le Gayi - Bhoomi 2024."
  },
  {
    id: 181,
    num: "90",
    album: "arijit-singh",
    title: "Chandu Ki Girl Friend",
    subtitle: "Single",
    tag: "SOULFUL HIT",
    artist: "Sachin-Jigar, Raman Mahadevan, Jigar Saraiya, Divya Pushkarna, Sagar Kendurkar, Madhav Krishna",
    duration: "03:16",
    durationSec: 196,
    src: "arijit_singh_tracks/181_chandu_ki_girl_friend.m4a",
    banner: "assets/images/tracks/track_181.jpg",
    desc: "Captivating Bollywood melody featuring Chandu Ki Girl Friend."
  },
  {
    id: 182,
    num: "91",
    album: "arijit-singh",
    title: "Chhod Diya",
    subtitle: "Single",
    tag: "SOULFUL HIT",
    artist: "Arijit Singh",
    duration: "05:19",
    durationSec: 319,
    src: "arijit_singh_tracks/182_chhod_diya.m4a",
    banner: "assets/images/tracks/track_182.jpg",
    desc: "Captivating Bollywood melody featuring Chhod Diya."
  },
  {
    id: 183,
    num: "92",
    album: "arijit-singh",
    title: "Sirf Tum  - Darshan Raval",
    subtitle: "Barkha Singh",
    tag: "SOULFUL HIT",
    artist: "DarshanRavalDZ",
    duration: "06:57",
    durationSec: 417,
    src: "arijit_singh_tracks/183_sirf_tum_darshan_raval.m4a",
    banner: "assets/images/tracks/track_183.jpg",
    desc: "Captivating Bollywood melody featuring Sirf Tum  - Darshan Raval."
  },
  {
    id: 184,
    num: "93",
    album: "arijit-singh",
    title: "Kasturi - Ek Jaisa Haal",
    subtitle: "Arijit Singh",
    tag: "SOULFUL HIT",
    artist: "X1X Song🎵",
    duration: "04:26",
    durationSec: 266,
    src: "arijit_singh_tracks/184_kasturi_ek_jaisa_haal.m4a",
    banner: "assets/images/tracks/track_184.jpg",
    desc: "Captivating Bollywood melody featuring Kasturi - Ek Jaisa Haal."
  },
  {
    id: 185,
    num: "94",
    album: "arijit-singh",
    title: "G Who",
    subtitle: "Single",
    tag: "SOULFUL HIT",
    artist: "NIJJAR, Jazz Dee",
    duration: "02:57",
    durationSec: 177,
    src: "arijit_singh_tracks/185_g_who.m4a",
    banner: "assets/images/tracks/track_185.jpg",
    desc: "Captivating Bollywood melody featuring G Who."
  },
  {
    id: 186,
    num: "95",
    album: "arijit-singh",
    title: "Afsaana Banaaya Aapne",
    subtitle: "Gunmaaster G9",
    tag: "SOULFUL HIT",
    artist: "Himesh Reshammiya Melodies",
    duration: "03:32",
    durationSec: 212,
    src: "arijit_singh_tracks/186_afsaana_banaaya_aapne.m4a",
    banner: "assets/images/tracks/track_186.jpg",
    desc: "Captivating Bollywood melody featuring Afsaana Banaaya Aapne."
  },
  {
    id: 187,
    num: "96",
    album: "arijit-singh",
    title: "NI SOHNIYE - HARKIRAT SANGHA (Ft. ROACH KILLA)",
    subtitle: "STARBOY X",
    tag: "SOULFUL HIT",
    artist: "Harkirat Sangha",
    duration: "03:00",
    durationSec: 180,
    src: "arijit_singh_tracks/187_ni_sohniye_harkirat_sangha_ft_.m4a",
    banner: "assets/images/tracks/track_187.jpg",
    desc: "Captivating Bollywood melody featuring NI SOHNIYE - HARKIRAT SANGHA (Ft. ROACH KILLA)."
  },
  {
    id: 188,
    num: "97",
    album: "arijit-singh",
    title: "Pyara Pyara",
    subtitle: "Juss",
    tag: "SOULFUL HIT",
    artist: "Saregama Punjabi, Pragati Nagpal, Juss",
    duration: "03:38",
    durationSec: 218,
    src: "arijit_singh_tracks/188_pyara_pyara.m4a",
    banner: "assets/images/tracks/track_188.jpg",
    desc: "Captivating Bollywood melody featuring Pyara Pyara."
  },
  {
    id: 189,
    num: "98",
    album: "arijit-singh",
    title: "Kasturi",
    subtitle: "Single",
    tag: "SOULFUL HIT",
    artist: "Arijit Singh, Prasad S, Kunaal Vermaa",
    duration: "03:52",
    durationSec: 232,
    src: "arijit_singh_tracks/189_kasturi.m4a",
    banner: "assets/images/tracks/track_189.jpg",
    desc: "Captivating Bollywood melody featuring Kasturi."
  },
  {
    id: 190,
    num: "99",
    album: "arijit-singh",
    title: "Laila Main Laila",
    subtitle: "Single",
    tag: "SOULFUL HIT",
    artist: "Pawni Pandey",
    duration: "05:06",
    durationSec: 306,
    src: "arijit_singh_tracks/190_laila_main_laila.m4a",
    banner: "assets/images/tracks/track_190.jpg",
    desc: "Captivating Bollywood melody featuring Laila Main Laila."
  },
  {
    id: 191,
    num: "100",
    album: "arijit-singh",
    title: "Maang Loon x Kasturi (Mashup)",
    subtitle: "Single",
    tag: "SOULFUL HIT",
    artist: "OyeEditorrAnna, Romy, Arijit Singh",
    duration: "04:07",
    durationSec: 247,
    src: "arijit_singh_tracks/191_maang_loon_x_kasturi_mashup.m4a",
    banner: "assets/images/tracks/track_191.jpg",
    desc: "Captivating Bollywood melody featuring Maang Loon x Kasturi (Mashup)."
  },
  {
    id: 192,
    num: "101",
    album: "arijit-singh",
    title: "Sabar सबर",
    subtitle: "McDonald's Bhoomi 2026",
    tag: "SOULFUL HIT",
    artist: "Salim Sulaiman Music, Armaan Malik",
    duration: "04:44",
    durationSec: 284,
    src: "arijit_singh_tracks/192_sabar.m4a",
    banner: "assets/images/tracks/track_192.jpg",
    desc: "Captivating Bollywood melody featuring Sabar सबर."
  },
  {
    id: 193,
    num: "102",
    album: "arijit-singh",
    title: "Paagal पागल",
    subtitle: "McDonald's Bhoomi 2026",
    tag: "SOULFUL HIT",
    artist: "Salim Sulaiman Music, Sonu Nigam",
    duration: "03:12",
    durationSec: 192,
    src: "arijit_singh_tracks/193_paagal.m4a",
    banner: "assets/images/tracks/track_193.jpg",
    desc: "Captivating Bollywood melody featuring Paagal पागल."
  },
  {
    id: 194,
    num: "103",
    album: "arijit-singh",
    title: "Nafrat Official Music Video",
    subtitle: "Darshan Raval",
    tag: "SOULFUL HIT",
    artist: "Indie Music Label, DarshanRavalDZ",
    duration: "03:37",
    durationSec: 217,
    src: "arijit_singh_tracks/194_nafrat_official_music_video.m4a",
    banner: "assets/images/tracks/track_194.jpg",
    desc: "Captivating Bollywood melody featuring Nafrat Official Music Video."
  },
  {
    id: 195,
    num: "104",
    album: "arijit-singh",
    title: "Gal Naal",
    subtitle: "Neha Kakkar x Chetanya Vaish",
    tag: "SOULFUL HIT",
    artist: "Saregama Music",
    duration: "03:52",
    durationSec: 232,
    src: "arijit_singh_tracks/195_gal_naal.m4a",
    banner: "assets/images/tracks/track_195.jpg",
    desc: "Captivating Bollywood melody featuring Gal Naal."
  },
  {
    id: 196,
    num: "105",
    album: "arijit-singh",
    title: "Only Mine",
    subtitle: "Single",
    tag: "SOULFUL HIT",
    artist: "Darshan Raval, Siddharth Amit Bhavsar, Youngveer",
    duration: "04:41",
    durationSec: 281,
    src: "arijit_singh_tracks/196_only_mine.m4a",
    banner: "assets/images/tracks/track_196.jpg",
    desc: "Captivating Bollywood melody featuring Only Mine."
  },
  {
    id: 197,
    num: "106",
    album: "arijit-singh",
    title: "Oonchi Oonchi Deewarein",
    subtitle: "Single",
    tag: "SOULFUL HIT",
    artist: "Arijit Singh, Manan Bhardwaj, Manan Bhardwaj, Manan Bhardwaj",
    duration: "04:11",
    durationSec: 251,
    src: "arijit_singh_tracks/197_oonchi_oonchi_deewarein.m4a",
    banner: "assets/images/tracks/track_197.jpg",
    desc: "Captivating Bollywood melody featuring Oonchi Oonchi Deewarein."
  },
  {
    id: 198,
    num: "107",
    album: "arijit-singh",
    title: "ఈ నాటి నుంచే నీ E Naati Nunche Ni - Padman",
    subtitle: "Akshay Kumar & Radhika Apte",
    tag: "SOULFUL HIT",
    artist: "Zee Music South",
    duration: "02:56",
    durationSec: 176,
    src: "arijit_singh_tracks/198_e_naati_nunche_ni_padman.m4a",
    banner: "assets/images/tracks/track_198.jpg",
    desc: "Captivating Bollywood melody featuring ఈ నాటి నుంచే నీ E Naati Nunche Ni - Padman."
  },
  {
    id: 199,
    num: "108",
    album: "arijit-singh",
    title: "Rim Jhim (feat. Pav Dharia)",
    subtitle: "Single",
    tag: "SOULFUL HIT",
    artist: "Khan Saab, Pav Dharia",
    duration: "05:00",
    durationSec: 300,
    src: "arijit_singh_tracks/199_rim_jhim_feat_pav_dharia.m4a",
    banner: "assets/images/tracks/track_199.jpg",
    desc: "Captivating Bollywood melody featuring Rim Jhim (feat. Pav Dharia)."
  },
  {
    id: 200,
    num: "109",
    album: "arijit-singh",
    title: "Sachha Ishq",
    subtitle: "Single",
    tag: "SOULFUL HIT",
    artist: "Nikhil Verma, Nikhil Verma, Kshl Music, Shreyas Puranik, Nikhil Verma",
    duration: "03:22",
    durationSec: 202,
    src: "arijit_singh_tracks/200_sachha_ishq.m4a",
    banner: "assets/images/tracks/track_200.jpg",
    desc: "Captivating Bollywood melody featuring Sachha Ishq."
  },
  {
    id: 201,
    num: "110",
    album: "arijit-singh",
    title: "Story Of Kakkars (MTV UNPLUGGED) (LIVE)",
    subtitle: "Single",
    tag: "SOULFUL HIT",
    artist: "Tony Kakkar, Neha Kakkar, Sonu Kakkar",
    duration: "04:27",
    durationSec: 267,
    src: "arijit_singh_tracks/201_story_of_kakkars_mtv_unplugged.m4a",
    banner: "assets/images/tracks/track_201.jpg",
    desc: "Captivating Bollywood melody featuring Story Of Kakkars (MTV UNPLUGGED) (LIVE)."
  },
  {
    id: 202,
    num: "111",
    album: "arijit-singh",
    title: "Tere Hoke Rehengay",
    subtitle: "Single",
    tag: "SOULFUL HIT",
    artist: "Arijit Singh",
    duration: "04:04",
    durationSec: 244,
    src: "arijit_singh_tracks/202_tere_hoke_rehengay.m4a",
    banner: "assets/images/tracks/track_202.jpg",
    desc: "Captivating Bollywood melody featuring Tere Hoke Rehengay."
  },
  {
    id: 203,
    num: "112",
    album: "arijit-singh",
    title: "Nakhre",
    subtitle: "Tum Mere Ho",
    tag: "SOULFUL HIT",
    artist: "Saregama Music, Saregama Marathi, Reva Creative House, Debgurufilms",
    duration: "02:41",
    durationSec: 161,
    src: "arijit_singh_tracks/203_nakhre.m4a",
    banner: "assets/images/tracks/track_203.jpg",
    desc: "Captivating Bollywood melody featuring Nakhre."
  },
  {
    id: 204,
    num: "113",
    album: "arijit-singh",
    title: "Ucha Lamba Kad",
    subtitle: "Single",
    tag: "SOULFUL HIT",
    artist: "Anand Raj Anand， Chorus",
    duration: "04:39",
    durationSec: 279,
    src: "arijit_singh_tracks/204_ucha_lamba_kad.m4a",
    banner: "assets/images/tracks/track_204.jpg",
    desc: "Captivating Bollywood melody featuring Ucha Lamba Kad."
  },
  {
    id: 205,
    num: "114",
    album: "arijit-singh",
    title: "Vaa Daa Inge - ABCD 2",
    subtitle: "Single",
    tag: "SOULFUL HIT",
    artist: "Sachin-Jigar, Denniz Joseph, Nincy Vincent, Rajesh G",
    duration: "03:37",
    durationSec: 217,
    src: "arijit_singh_tracks/205_vaa_daa_inge_abcd_2.m4a",
    banner: "assets/images/tracks/track_205.jpg",
    desc: "Captivating Bollywood melody featuring Vaa Daa Inge - ABCD 2."
  },
  {
    id: 206,
    num: "115",
    album: "arijit-singh",
    title: "Vaaroon Forever (From “Mirzapur The Movie”)",
    subtitle: "Single",
    tag: "SOULFUL HIT",
    artist: "Anand Bhaskar, Romy, Shreya Ghoshal, Ginny Diwan",
    duration: "04:12",
    durationSec: 252,
    src: "arijit_singh_tracks/206_vaaroon_forever_from_mirzapur_.m4a",
    banner: "assets/images/tracks/track_206.jpg",
    desc: "Captivating Bollywood melody featuring Vaaroon Forever (From “Mirzapur The Movie”)."
  },
  {
    id: 207,
    num: "116",
    album: "arijit-singh",
    title: "Zaroorat Se Zyada - Duet",
    subtitle: "Single",
    tag: "SOULFUL HIT",
    artist: "Amaal Mallik, Arijit Singh, Shreya Ghoshal, Kunaal Vermaa",
    duration: "03:52",
    durationSec: 232,
    src: "arijit_singh_tracks/207_zaroorat_se_zyada_duet.m4a",
    banner: "assets/images/tracks/track_207.jpg",
    desc: "Captivating Bollywood melody featuring Zaroorat Se Zyada - Duet."
  },
  {
    id: 208,
    num: "117",
    album: "arijit-singh",
    title: "Kasturi (LoFi Version By Raahi)",
    subtitle: "Single",
    tag: "SOULFUL HIT",
    artist: "Arijit Singh",
    duration: "02:57",
    durationSec: 177,
    src: "arijit_singh_tracks/208_kasturi_lofi_version_by_raahi.m4a",
    banner: "assets/images/tracks/track_208.jpg",
    desc: "Captivating Bollywood melody featuring Kasturi (LoFi Version By Raahi)."
  },
  {
    id: 209,
    num: "118",
    album: "arijit-singh",
    title: "💔 Tohfa-e-Saeed Nahi",
    subtitle: "दर्द भरा Sad Song 2026",
    tag: "SOULFUL HIT",
    artist: "AlfazEGhamStudio",
    duration: "04:45",
    durationSec: 285,
    src: "arijit_singh_tracks/209_tohfa_e_saeed_nahi.m4a",
    banner: "assets/images/tracks/track_209.jpg",
    desc: "Captivating Bollywood melody featuring 💔 Tohfa-e-Saeed Nahi."
  },
  {
    id: 210,
    num: "119",
    album: "arijit-singh",
    title: "Madhubanti Bagchi",
    subtitle: "Mudd Na Sajna",
    tag: "SOULFUL HIT",
    artist: "Madhubanti Bagchi",
    duration: "04:05",
    durationSec: 245,
    src: "arijit_singh_tracks/210_madhubanti_bagchi.m4a",
    banner: "assets/images/tracks/track_210.jpg",
    desc: "Captivating Bollywood melody featuring Madhubanti Bagchi."
  },
  {
    id: 211,
    num: "120",
    album: "arijit-singh",
    title: "Etni Si baat hai Mujhe tumse pyar hai Video edit By Tresh Gill 😊",
    subtitle: "Single",
    tag: "SOULFUL HIT",
    artist: "Whats app status",
    duration: "04:57",
    durationSec: 297,
    src: "arijit_singh_tracks/211_etni_si_baat_hai_mujhe_tumse_p.m4a",
    banner: "assets/images/tracks/track_211.jpg",
    desc: "Captivating Bollywood melody featuring Etni Si baat hai Mujhe tumse pyar hai Video edit By Tresh Gill 😊."
  },
  {
    id: 212,
    num: "121",
    album: "arijit-singh",
    title: "Mere Yaara Lyrics - Sooryavanshi",
    subtitle: "Arijit Singh",
    tag: "SOULFUL HIT",
    artist: "24X7HindiSongs",
    duration: "03:36",
    durationSec: 216,
    src: "arijit_singh_tracks/212_mere_yaara_lyrics_sooryavanshi.m4a",
    banner: "assets/images/tracks/track_212.jpg",
    desc: "Captivating Bollywood melody featuring Mere Yaara Lyrics - Sooryavanshi."
  },
  {
    id: 213,
    num: "122",
    album: "arijit-singh",
    title: "Sajna Ve Sajna Gurdas Mann",
    subtitle: "Punjabi Song",
    tag: "SOULFUL HIT",
    artist: "Humara Music",
    duration: "06:11",
    durationSec: 371,
    src: "arijit_singh_tracks/213_sajna_ve_sajna_gurdas_mann.m4a",
    banner: "assets/images/tracks/track_213.jpg",
    desc: "Captivating Bollywood melody featuring Sajna Ve Sajna Gurdas Mann."
  },
  {
    id: 214,
    num: "123",
    album: "arijit-singh",
    title: "aakhri tohfa",
    subtitle: "Single",
    tag: "SOULFUL HIT",
    artist: "Sagar Verma",
    duration: "02:49",
    durationSec: 169,
    src: "arijit_singh_tracks/214_aakhri_tohfa.m4a",
    banner: "assets/images/tracks/track_214.jpg",
    desc: "Captivating Bollywood melody featuring aakhri tohfa."
  },
  {
    id: 215,
    num: "124",
    album: "arijit-singh",
    title: "Itni Si Baat Hain Video Song",
    subtitle: "AZHAR",
    tag: "SOULFUL HIT",
    artist: "Viren K",
    duration: "02:23",
    durationSec: 143,
    src: "arijit_singh_tracks/215_itni_si_baat_hain_video_song.m4a",
    banner: "assets/images/tracks/track_215.jpg",
    desc: "Captivating Bollywood melody featuring Itni Si Baat Hain Video Song."
  }
];

let ostAudio = new Audio();
let currentOSTIndex = 0;
let isOSTPlaying = false;
let isOSTLoop = false;
let isOSTMuted = false;
let ostSavedVolume = 0.9;

ostAudio.volume = ostSavedVolume;
ostAudio.preload = 'auto';

// Global error listener for fallback audio loading
ostAudio.addEventListener('error', (e) => {
  const track = OST_TRACKS[currentOSTIndex];
  if (track && track.fallbackSrc && ostAudio.src.indexOf(track.fallbackSrc) === -1) {
    console.log('Main audio failed, trying fallback source:', track.fallbackSrc);
    ostAudio.src = track.fallbackSrc;
    ostAudio.play().catch(err => console.warn('Fallback play error:', err));
  }
});

// Format seconds into MM:SS
function formatOSTTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
}

// Pause any active video player before playing music
function pauseActiveVideosForAudio() {
  const trailerVid = document.getElementById('trailerVideo');
  if (trailerVid && !trailerVid.paused) {
    trailerVid.pause();
  }
  const cinemaVid = document.getElementById('videoPlayer');
  if (cinemaVid && !cinemaVid.paused) {
    cinemaVid.pause();
  }
}

// Play specific track by 1-based ID
function playOSTTrack(trackId) {
  const targetIndex = OST_TRACKS.findIndex(t => t.id === trackId);
  if (targetIndex === -1) return;

  pauseActiveVideosForAudio();

  // If already playing this track, toggle play/pause
  if (currentOSTIndex === targetIndex && ostAudio.src && (ostAudio.src.endsWith(OST_TRACKS[targetIndex].src) || ostAudio.src.includes(encodeURI(OST_TRACKS[targetIndex].src)) || (OST_TRACKS[targetIndex].fallbackSrc && ostAudio.src.endsWith(OST_TRACKS[targetIndex].fallbackSrc)))) {
    if (ostAudio.paused) {
      const p = ostAudio.play();
      if (p !== undefined) p.catch(e => console.warn('Audio play error:', e));
    } else {
      ostAudio.pause();
    }
    return;
  }

  // Switch to new track synchronously inside user click gesture
  currentOSTIndex = targetIndex;
  const track = OST_TRACKS[currentOSTIndex];

  try {
    ostAudio.setAttribute('controlsList', 'nodownload noplaybackrate');
    ostAudio.setAttribute('disableRemotePlayback', '');
  } catch(e) {}

  ostAudio.src = track.src;
  const playPromise = ostAudio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      isOSTPlaying = true;
    }).catch(e => {
      console.warn('Audio play rejected by browser:', e);
      if (track.fallbackSrc && ostAudio.src.indexOf(track.fallbackSrc) === -1) {
        ostAudio.src = track.fallbackSrc;
        ostAudio.play().catch(err => console.warn('Fallback play error:', err));
      }
    });
  }

  updateFloatingPlayerUI();
  updateMediaSession(track);
}

// Play/Pause Current Track (From floating player or banner)
function toggleCurrentOSTTrack() {
  pauseActiveVideosForAudio();
  if (!ostAudio.src || ostAudio.src === '') {
    playOSTTrack(OST_TRACKS[currentOSTIndex].id);
    return;
  }
  if (ostAudio.paused) {
    ostAudio.play().catch(e => console.warn('Audio play prevented:', e));
  } else {
    ostAudio.pause();
  }
}

// Play All Tracks from start or resume
function togglePlayAllOST() {
  pauseActiveVideosForAudio();
  if (isOSTPlaying) {
    ostAudio.pause();
  } else {
    if (!ostAudio.src || ostAudio.src === '') {
      const album = SANDIFY_ALBUMS[currentActiveAlbumKey];
      const startId = (album && album.startTrack) ? album.startTrack : 1;
      playOSTTrack(startId);
    } else {
      ostAudio.play().catch(e => console.warn('Audio play prevented:', e));
    }
  }
}

// Shuffle Play
function shufflePlayOST() {
  pauseActiveVideosForAudio();
  // Filter tracks to current active album
  const currentAlbumTracks = OST_TRACKS.filter(t => (t.album || 'divine-symphony') === currentActiveAlbumKey);
  const pool = currentAlbumTracks.length > 0 ? currentAlbumTracks : OST_TRACKS;

  let nextTrack;
  if (pool.length > 1) {
    const currentId = OST_TRACKS[currentOSTIndex] ? OST_TRACKS[currentOSTIndex].id : -1;
    const candidates = pool.filter(t => t.id !== currentId);
    nextTrack = candidates[Math.floor(Math.random() * candidates.length)];
  } else {
    nextTrack = pool[0];
  }
  if (nextTrack) playOSTTrack(nextTrack.id);
}

// Previous Track
function prevOSTTrack() {
  pauseActiveVideosForAudio();
  if (ostAudio.currentTime > 3) {
    ostAudio.currentTime = 0;
    return;
  }
  currentOSTIndex = (currentOSTIndex - 1 + OST_TRACKS.length) % OST_TRACKS.length;
  playOSTTrack(OST_TRACKS[currentOSTIndex].id);
}

// Next Track
function nextOSTTrack() {
  pauseActiveVideosForAudio();
  currentOSTIndex = (currentOSTIndex + 1) % OST_TRACKS.length;
  playOSTTrack(OST_TRACKS[currentOSTIndex].id);
}

// Loop Toggle
function toggleOSTLoop() {
  isOSTLoop = !isOSTLoop;
  ostAudio.loop = isOSTLoop;
  const loopBtn = document.getElementById('ostFpLoopBtn');
  if (loopBtn) {
    loopBtn.classList.toggle('active', isOSTLoop);
    loopBtn.title = isOSTLoop ? 'Repeat Track: ON' : 'Repeat Track: OFF';
  }
}

// Mute / Unmute
function toggleOSTMute() {
  isOSTMuted = !isOSTMuted;
  ostAudio.muted = isOSTMuted;
  const volOn = document.getElementById('fpVolOn');
  const volOff = document.getElementById('fpVolOff');
  const volSlider = document.getElementById('ostFpVolume');
  if (volOn && volOff) {
    volOn.style.display = isOSTMuted ? 'none' : 'block';
    volOff.style.display = isOSTMuted ? 'block' : 'none';
  }
  if (volSlider) {
    volSlider.value = isOSTMuted ? 0 : ostAudio.volume;
  }
}

// Volume Slider
function setOSTVolume(val) {
  const v = parseFloat(val);
  ostAudio.volume = v;
  if (v === 0) {
    isOSTMuted = true;
    ostAudio.muted = true;
  } else {
    isOSTMuted = false;
    ostAudio.muted = false;
  }
  const volOn = document.getElementById('fpVolOn');
  const volOff = document.getElementById('fpVolOff');
  if (volOn && volOff) {
    volOn.style.display = isOSTMuted ? 'none' : 'block';
    volOff.style.display = isOSTMuted ? 'block' : 'none';
  }
  const volSlider = document.getElementById('ostFpVolume');
  if (volSlider) {
    const pct = v * 100;
    volSlider.style.background = `linear-gradient(to right, #ffffff ${pct}%, #4d4d4d ${pct}%)`;
  }
}

// Card Scrubber Seek
function seekOSTCard(trackId, event) {
  if (currentOSTIndex !== trackId - 1 || !ostAudio.src) {
    playOSTTrack(trackId);
    return;
  }
  const rect = event.currentTarget.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
  if (ostAudio.duration) {
    ostAudio.currentTime = ratio * ostAudio.duration;
  }
}

// Floating Player Scrubber Seek
function seekOSTScrubber(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
  if (ostAudio.duration) {
    ostAudio.currentTime = ratio * ostAudio.duration;
  }
}

// Mobile Spotify Border Scrubber Seek (Runs along player bottom border)
function seekOSTMobile(event) {
  if (!ostAudio || !ostAudio.duration) return;
  if (event) event.stopPropagation();
  const target = event.currentTarget;
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const clientX = (event.touches && event.touches[0]) ? event.touches[0].clientX : event.clientX;
  const clickX = clientX - rect.left;
  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
  ostAudio.currentTime = ratio * ostAudio.duration;

  const fpMobBar = document.getElementById('ostFpMobileProgressBar');
  if (fpMobBar) fpMobBar.style.width = `${ratio * 100}%`;
  const fpBar = document.getElementById('ostFpProgressBar');
  if (fpBar) fpBar.style.width = `${ratio * 100}%`;
}

// Minimize Floating Player Bar with smooth zoom out
function minimizeFloatingPlayer(event) {
  if (event) event.stopPropagation();
  const fp = document.getElementById('ostFloatingPlayer');
  const restorePill = document.getElementById('ostRestorePill');
  const pillTitle = document.getElementById('ostRestorePillTitle');

  if (fp) {
    fp.classList.add('minimized');
  }

  if (restorePill) {
    if (pillTitle && OST_TRACKS[currentOSTIndex]) {
      pillTitle.textContent = OST_TRACKS[currentOSTIndex].title;
    }
    if (isOSTPlaying && ostAudio && !ostAudio.paused) {
      restorePill.classList.add('is-playing');
    } else {
      restorePill.classList.remove('is-playing');
    }
    restorePill.classList.add('visible');
  }
}

// Restore / Expand Floating Player Bar with zoom in
function restoreFloatingPlayer(event) {
  if (event) event.stopPropagation();
  const fp = document.getElementById('ostFloatingPlayer');
  const restorePill = document.getElementById('ostRestorePill');

  if (fp) {
    fp.classList.remove('is-hidden');
    fp.classList.remove('minimized');
  }

  if (restorePill) {
    restorePill.classList.remove('visible');
  }
}

function closeFloatingPlayer(event) {
  minimizeFloatingPlayer(event);
}

// Scroll page to current active card
function scrollToActiveTrack() {
  const card = document.getElementById(`ostCard${currentOSTIndex + 1}`);
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Update Floating Player DOM
function updateFloatingPlayerUI() {
  const track = OST_TRACKS[currentOSTIndex];
  if (!track) return;

  const fp = document.getElementById('ostFloatingPlayer');
  const restorePill = document.getElementById('ostRestorePill');
  const pillTitle = document.getElementById('ostRestorePillTitle');

  if (pillTitle) {
    pillTitle.textContent = track.title;
  }

  const isPlayingNow = isOSTPlaying && ostAudio && !ostAudio.paused;
  if (restorePill) {
    if (isPlayingNow) {
      restorePill.classList.add('is-playing');
    } else {
      restorePill.classList.remove('is-playing');
    }
  }

  if (fp && !fp.classList.contains('minimized')) {
    fp.classList.remove('is-hidden');
    if (restorePill) {
      restorePill.classList.remove('visible');
    }
  }

  const thumb = document.getElementById('ostFpThumb');
  const title = document.getElementById('ostFpTitle');
  const tag = document.getElementById('ostFpTag');
  const artist = document.getElementById('ostFpArtist');
  const dur = document.getElementById('ostFpDuration');
  
  if (thumb) thumb.src = track.banner;
  if (title) title.textContent = track.title;
  if (tag) tag.textContent = track.tag || '';
  if (artist) artist.innerHTML = track.artist;
  if (dur) dur.textContent = track.duration;
  const mobBar = document.getElementById('ostFpMobileProgressBar');
  if (mobBar) mobBar.style.width = '0%';
  // Anti-download: direct download link removed
}

// Web Media Session API for Lock Screen & Bluetooth Headsets

// Spotify / YouTube Music Filter Chips
function filterSandifyTracks(category, btn) {
  document.querySelectorAll('.ytm-chip').forEach(c => c.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const rows = document.querySelectorAll('.spotify-row');
  rows.forEach(r => {
    const rowAlbum = r.getAttribute('data-album') || 'divine-symphony';
    // Only filter tracks of currently active album
    if (rowAlbum !== currentActiveAlbumKey) {
      r.style.display = 'none';
      return;
    }
    const cat = r.getAttribute('data-cat') || '';
    if (category === 'all' || cat === category || cat.split(' ').indexOf(category) !== -1) {
      r.style.display = 'grid';
    } else {
      r.style.display = 'none';
    }
  });
}
window.filterSandifyTracks = filterSandifyTracks;

function toggleSpotifyHeart(btn) {
  if (!btn) return;
  btn.classList.toggle('active');
  const isFilled = btn.classList.contains('active');
  btn.style.color = isFilled ? '#e50914' : '';
  showToast(isFilled ? 'Saved to Your Library ❤️' : 'Removed from Library');
}
window.toggleSpotifyHeart = toggleSpotifyHeart;

function toggleFpHeart(btn) {
  if (!btn) return;
  btn.classList.toggle('active');
  const isFilled = btn.classList.contains('active');
  btn.style.color = isFilled ? '#e50914' : '';
  const svg = btn.querySelector('svg');
  if (svg) {
    svg.setAttribute('fill', isFilled ? '#e50914' : 'none');
  }
  showToast(isFilled ? 'Added to Liked Songs ❤️' : 'Removed from Liked Songs');
}
window.toggleFpHeart = toggleFpHeart;

function toggleRowHeart(btn) {
  if (!btn) return;
  btn.classList.toggle('active');
  const isFilled = btn.classList.contains('active');
  btn.style.color = isFilled ? '#e50914' : '';
}
window.toggleRowHeart = toggleRowHeart;

function updateMediaSession(track) {
  if ('mediaSession' in navigator) {
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist.replace(/<[^>]*>?/gm, '').replace('&times;', 'x'),
        album: 'Ramayana: The Divine Symphony (Sandify Tracks)',
        artwork: [
          { src: track.banner, sizes: '512x512', type: 'image/jpeg' },
          { src: 'assets/images/movie_poster_hd.jpg', sizes: '256x256', type: 'image/jpeg' },
          { src: 'assets/images/sandflix_icon.png', sizes: '192x192', type: 'image/png' }
        ]
      });

      navigator.mediaSession.playbackState = isOSTPlaying ? 'playing' : 'paused';

      navigator.mediaSession.setActionHandler('play', () => toggleCurrentOSTTrack());
      navigator.mediaSession.setActionHandler('pause', () => toggleCurrentOSTTrack());
      navigator.mediaSession.setActionHandler('previoustrack', () => prevOSTTrack());
      navigator.mediaSession.setActionHandler('nexttrack', () => nextOSTTrack());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime && ostAudio.duration) {
          ostAudio.currentTime = details.seekTime;
        }
      });
    } catch (e) {
      console.log('MediaSession setup:', e);
    }
  }
}

// Audio Event Listeners
ostAudio.addEventListener('play', () => {
  isOSTPlaying = true;

  // Mobile background mediaSession playbackState
  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = 'playing';
  }

  // Update Spotify Album Master Play Button
  const spotPlay = document.getElementById('spotifyMasterPlayIcon');
  const spotPause = document.getElementById('spotifyMasterPauseIcon');
  if (spotPlay) spotPlay.style.display = 'none';
  if (spotPause) spotPause.style.display = 'block';

  // Update Spotify Vinyl peeking
  const spotVinyl = document.getElementById('spotifyVinylPeeking');
  if (spotVinyl) spotVinyl.classList.add('spinning');

  // Update Spotify Table Rows
  OST_TRACKS.forEach((t, idx) => {
    const row = document.getElementById(`sRow${t.id}`);
    if (row) {
      if (idx === currentOSTIndex) {
        row.classList.add('active', 'playing');
      } else {
        row.classList.remove('active', 'playing');
      }
    }
  });

  // Update Vinyl Spin
  const vinyl = document.getElementById('ostVinylDisc');
  if (vinyl) vinyl.classList.add('playing');

  // Update Banner Play All Button
  const playAllIcon = document.getElementById('ostPlayAllIcon');
  const playAllLabel = document.getElementById('ostPlayAllLabel');
  if (playAllIcon) {
    playAllIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
  }
  if (playAllLabel) playAllLabel.textContent = 'Pause Music';

  // Update Floating Player Play/Pause Icon
  const fpPlay = document.getElementById('fpIconPlay');
  const fpPause = document.getElementById('fpIconPause');
  if (fpPlay) fpPlay.style.display = 'none';
  if (fpPause) fpPause.style.display = 'block';

  // Update Floating Equalizer
  const fpEq = document.getElementById('ostFpEqualizer');
  if (fpEq) fpEq.classList.add('playing');

  // Update Mini Restore Pill (Red circle spinning symbol)
  const restorePill = document.getElementById('ostRestorePill');
  if (restorePill) restorePill.classList.add('is-playing');

  // Update Cards UI
  OST_TRACKS.forEach((t, idx) => {
    const card = document.getElementById(`ostCard${t.id}`);
    const playBtn = card ? card.querySelector('.ost-card-play-btn') : null;
    const viz = document.getElementById(`ostCardViz${t.id}`);

    if (idx === currentOSTIndex) {
      if (card) card.classList.add('active-playing');
      if (viz) viz.classList.add('playing');
      if (playBtn) {
        playBtn.querySelector('.icon-play').style.display = 'none';
        playBtn.querySelector('.icon-pause').style.display = 'block';
      }
    } else {
      if (card) card.classList.remove('active-playing');
      if (viz) viz.classList.remove('playing');
      if (playBtn) {
        playBtn.querySelector('.icon-play').style.display = 'block';
        playBtn.querySelector('.icon-pause').style.display = 'none';
      }
    }
  });

  updateFloatingPlayerUI();
});

ostAudio.addEventListener('pause', () => {
  isOSTPlaying = false;

  // Mini Restore Pill stop rotation
  const restorePill = document.getElementById('ostRestorePill');
  if (restorePill) restorePill.classList.remove('is-playing');

  // Mobile background mediaSession playbackState
  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = 'paused';
  }

  // Update Spotify Album Master Play Button
  const spotPlay = document.getElementById('spotifyMasterPlayIcon');
  const spotPause = document.getElementById('spotifyMasterPauseIcon');
  if (spotPlay) spotPlay.style.display = 'block';
  if (spotPause) spotPause.style.display = 'none';

  // Update Spotify Vinyl peeking
  const spotVinyl = document.getElementById('spotifyVinylPeeking');
  if (spotVinyl) spotVinyl.classList.remove('spinning');

  // Update Spotify Table Rows (keep active, remove playing animation)
  OST_TRACKS.forEach((t) => {
    const row = document.getElementById(`sRow${t.id}`);
    if (row) row.classList.remove('playing');
  });

  // Pause Vinyl Spin
  const vinyl = document.getElementById('ostVinylDisc');
  if (vinyl) vinyl.classList.remove('playing');

  // Banner button
  const playAllIcon = document.getElementById('ostPlayAllIcon');
  const playAllLabel = document.getElementById('ostPlayAllLabel');
  if (playAllIcon) {
    playAllIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
  }
  if (playAllLabel) playAllLabel.textContent = 'Play All Tracks';

  // Floating button
  const fpPlay = document.getElementById('fpIconPlay');
  const fpPause = document.getElementById('fpIconPause');
  if (fpPlay) fpPlay.style.display = 'block';
  if (fpPause) fpPause.style.display = 'none';

  // Equalizers stop
  const fpEq = document.getElementById('ostFpEqualizer');
  if (fpEq) fpEq.classList.remove('playing');

  OST_TRACKS.forEach((t) => {
    const card = document.getElementById(`ostCard${t.id}`);
    const playBtn = card ? card.querySelector('.ost-card-play-btn') : null;
    const viz = document.getElementById(`ostCardViz${t.id}`);

    if (viz) viz.classList.remove('playing');
    if (playBtn) {
      playBtn.querySelector('.icon-play').style.display = 'block';
      playBtn.querySelector('.icon-pause').style.display = 'none';
    }
  });
});

ostAudio.addEventListener('timeupdate', () => {
  if (!ostAudio.duration) return;
  const curTime = ostAudio.currentTime;
  const durTime = ostAudio.duration;
  const pct = (curTime / durTime) * 100;

  // Update floating player scrubber
  const fpBar = document.getElementById('ostFpProgressBar');
  const fpCur = document.getElementById('ostFpCurrentTime');
  const fpDur = document.getElementById('ostFpDuration');
  if (fpBar) fpBar.style.width = `${pct}%`;
  if (fpCur) fpCur.textContent = formatOSTTime(curTime);
  if (fpDur && !isNaN(durTime)) fpDur.textContent = formatOSTTime(durTime);

  // Update mobile border progress bar (Spotify mobile style)
  const fpMobBar = document.getElementById('ostFpMobileProgressBar');
  if (fpMobBar) fpMobBar.style.width = `${pct}%`;

  // Update active card progress bar
  const activeCardId = OST_TRACKS[currentOSTIndex].id;
  const cardBar = document.getElementById(`ostCardBar${activeCardId}`);
  const cardCur = document.getElementById(`ostCardCur${activeCardId}`);
  if (cardBar) cardBar.style.width = `${pct}%`;
  if (cardCur) cardCur.textContent = formatOSTTime(curTime);
});

ostAudio.addEventListener('ended', () => {
  if (isOSTLoop) {
    ostAudio.currentTime = 0;
    ostAudio.play().catch(e => console.warn(e));
  } else {
    // Auto-advance to next track
    nextOSTTrack();
  }
});

// Auto-pause audio if user starts watching movie trailer or cinema video
window.addEventListener('DOMContentLoaded', () => {
  const trailerVid = document.getElementById('trailerVideo');
  if (trailerVid) {
    trailerVid.addEventListener('play', () => {
      if (isOSTPlaying) ostAudio.pause();
    });
  }
  const cinemaVid = document.getElementById('videoPlayer');
  if (cinemaVid) {
    cinemaVid.addEventListener('play', () => {
      if (isOSTPlaying) ostAudio.pause();
    });
  }
});

// Expose functions globally for HTML onclick handlers
window.playOSTTrack = playOSTTrack;
window.toggleCurrentOSTTrack = toggleCurrentOSTTrack;
window.togglePlayAllOST = togglePlayAllOST;
window.shufflePlayOST = shufflePlayOST;
window.prevOSTTrack = prevOSTTrack;
window.nextOSTTrack = nextOSTTrack;
window.toggleOSTLoop = toggleOSTLoop;
window.toggleOSTMute = toggleOSTMute;
window.setOSTVolume = setOSTVolume;
window.seekOSTCard = seekOSTCard;
window.seekOSTScrubber = seekOSTScrubber;
window.seekOSTMobile = seekOSTMobile;
window.closeFloatingPlayer = closeFloatingPlayer;
window.minimizeFloatingPlayer = minimizeFloatingPlayer;
window.restoreFloatingPlayer = restoreFloatingPlayer;
window.scrollToActiveTrack = scrollToActiveTrack;

/* ==========================================================================
   SANDIFY TRACKS: SUB-PAGE (BRAND LOGO THEME) NAVIGATION CONTROLLER
   ========================================================================== */

const SANDIFY_ALBUMS = {
  'divine-symphony': {
    title: 'Ramayana: The Divine Symphony',
    subtitle: 'The celestial orchestral masterpiece and sacred Sanskrit hymns orchestrated by dual Academy Award winners <strong>A.R. Rahman</strong> &amp; <strong>Hans Zimmer</strong>.',
    artist1: 'A.R. Rahman',
    artist2: 'Hans Zimmer',
    meta: '2026 • 8 songs, 28 min 50 sec',
    cover: 'assets/images/movie_poster_hd.jpg',
    category: 'all',
    startTrack: 1
  },
    'moosetape': {
    title: 'Moosetape: The Immortal Legacy',
    subtitle: 'The historic magnum opus of Punjabi Hip-Hop and global drill featuring <strong>Sidhu Moose Wala</strong> with iconic collaborations including <strong>Bohemia</strong>, <strong>DIVINE</strong>, <strong>Tion Wayne</strong> &amp; <strong>Stefflon Don</strong>.',
    artist1: 'Sidhu Moose Wala',
    artist2: 'The Kidd • Wazir Patar • Bohemia',
    meta: '2021 • 31 songs, 1 hr 53 min',
    cover: 'assets/images/moosetape_cover_hd.jpg',
    category: 'action',
    startTrack: 33
  },
  'arijit-singh': {
    title: 'Arijit Singh: Soulful Melodies & Anthems',
    subtitle: 'The golden voice of romance, longing, and heartbreak featuring <strong>Arijit Singh</strong> with timeless masterworks composed by <strong>Pritam</strong>, <strong>A.R. Rahman</strong>, <strong>Mithoon</strong>, <strong>Amit Trivedi</strong> &amp; <strong>Sachin-Jigar</strong>.',
    artist1: 'Arijit Singh',
    artist2: 'Pritam • A.R. Rahman • Mithoon',
    meta: '124 songs • 8 hrs 38 mins',
    cover: 'assets/images/arijit_singh_hd.jpg',
    category: 'all',
    startTrack: 92
  },
  'sidhu-classics': {
    title: 'Sidhu Moose Wala: Immortal Classics',
    subtitle: 'The timeless anthems, legendary blockbusters, and historic catalog hits by <strong>Sidhu Moose Wala</strong> with revolutionary music from <strong>Byg Byrd</strong>, <strong>The Kidd</strong>, <strong>Wazir Patar</strong>, <strong>Snappy</strong> &amp; <strong>Sunny Malton</strong>.',
    artist1: 'Sidhu Moose Wala',
    artist2: 'Byg Byrd • The Kidd • Wazir Patar',
    meta: '2024 • 28 songs, 1 hr 36 min',
    cover: 'assets/images/sidhu_hits_hd.jpg',
    category: 'action',
    startTrack: 64
  },
  'hanuman-divine': {
    title: 'Hanuman & Shiv Shakti: Divine Warriors',
    subtitle: 'Thunderous devotional anthems, sacred stotrams, epic war rap, and timeless invocations to <strong>Bajrangbali</strong> and <strong>Lord Shiva</strong>.',
    artist1: 'Devotional Folk • Piyush Mishra',
    artist2: 'Shankar Mahadevan • Abby Viral • Ajay-Atul',
    meta: '2026 • 24 songs, 1 hr 42 min',
    cover: 'assets/images/hanuman_meditation_hd.jpg',
    category: 'all',
    startTrack: 9
  },
  'sacred-shlokas': {
    title: 'Sacred Shlokas & Vedic Chants',
    subtitle: 'Sacred Sanskrit verses from Valmiki Ramayana depicting devotion, purity, and the eternal spiritual essence of Ayodhya.',
    artist1: 'A.R. Rahman',
    artist2: 'Dr. Kumar Vishwas',
    cover: 'assets/images/feature_banner_hd.jpg',
    category: 'devotional'
  },
  'battle-anthems': {
    title: 'Lanka Kanda: Battle Anthems',
    subtitle: 'Thunderous war percussion, Ravana’s Tandav Stotram, and high-octane orchestral battle themes for the supreme clash.',
    artist1: 'Hans Zimmer',
    artist2: 'A.R. Rahman',
    cover: 'assets/images/hero_banner_hd.jpg',
    category: 'action'
  },
  'sita-rama': {
    title: 'Sita Rama Vivaha & Themes',
    subtitle: 'Soulful choral harmonies, acoustic strings, and divine romance reflecting the auspicious wedding of Sri Rama and Mata Sita.',
    artist1: 'A.R. Rahman',
    artist2: 'Celestial Choirs',
    cover: 'assets/images/movie_poster_hd.jpg',
    category: 'devotional'
  },
  'hans-zimmer': {
    title: 'Hans Zimmer: Grand Orchestration',
    subtitle: 'Hollywood legendary symphonic suites with monumental brass, sweeping strings, and primal rhythm by Hans Zimmer.',
    artist1: 'Hans Zimmer',
    artist2: 'Symphonic Orchestra',
    cover: 'assets/images/feature_banner_hd.jpg',
    category: 'symphony'
  },
  'ar-rahman': {
    title: 'A.R. Rahman: Sacred Melodies',
    subtitle: 'Soul-stirring classical ragas, devotional choirs, and sacred hymns composed by maestro A.R. Rahman.',
    artist1: 'A.R. Rahman',
    artist2: 'Devotional Choir',
    cover: 'assets/images/hero_banner_hd.jpg',
    category: 'score'
  }
};

let currentActiveAlbumKey = 'divine-symphony';

function openSandifySubpage(albumKey, fromHistory) {
  albumKey = albumKey || 'divine-symphony';
  currentActiveAlbumKey = albumKey;
  const album = SANDIFY_ALBUMS[albumKey] || SANDIFY_ALBUMS['divine-symphony'];

  const titleEl = document.querySelector('.subpage-main-title');
  const descEl = document.querySelector('.subpage-main-desc');
  const coverEl = document.getElementById('subpageCoverImg');
  const creditsLineEl = document.querySelector('.subpage-credits-line');
  const playBtnEl = document.querySelector('.subpage-btn-play');

  if (titleEl && album.title) titleEl.textContent = album.title;
  if (descEl && album.subtitle) descEl.innerHTML = album.subtitle;
  if (coverEl && album.cover) coverEl.src = album.cover;
  if (creditsLineEl) {
    creditsLineEl.innerHTML = `
      <span class="subpage-artist">${album.artist1 || 'Devotional'}</span>
      <span class="subpage-dot">&bull;</span>
      <span class="subpage-artist">${album.artist2 || 'Traditional'}</span>
      <span class="subpage-dot">&bull;</span>
      <span class="subpage-meta-dim">${album.meta || '2026'}</span>
    `;
  }
  if (playBtnEl && album.startTrack) {
    playBtnEl.setAttribute('onclick', `playOSTTrack(${album.startTrack})`);
  }

  // Filter tracklist rows to display only tracks belonging to this album
  const allRows = document.querySelectorAll('.spotify-row');
  allRows.forEach(row => {
    const rowAlbum = row.getAttribute('data-album') || 'divine-symphony';
    if (rowAlbum === albumKey) {
      row.style.display = 'grid';
    } else {
      row.style.display = 'none';
    }
  });

  // Reset mood chips to 'All Tracks'
  const chips = document.querySelectorAll('.subpage-chips .ytm-chip');
  chips.forEach((c, idx) => {
    if (idx === 0) c.classList.add('active');
    else c.classList.remove('active');
  });

  const mainView = document.getElementById('sandifyMainView');
  const subpageView = document.getElementById('sandifySubpageView');
  if (mainView && subpageView) {
    mainView.style.display = 'none';
    subpageView.style.display = 'block';
    subpageView.classList.add('fade-in-active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (!fromHistory) {
    pushAppState({ type: 'sandify-subpage', page: 'gallery', albumKey: albumKey }, '#sandify-tracks');
  }
}

function closeSandifySubpage(fromHistory) {
  if (!fromHistory && window.history && window.history.state && window.history.state.type === 'sandify-subpage') {
    window.history.back();
    return;
  }

  const mainView = document.getElementById('sandifyMainView');
  const subpageView = document.getElementById('sandifySubpageView');
  if (mainView && subpageView) {
    subpageView.style.display = 'none';
    subpageView.classList.remove('fade-in-active');
    mainView.style.display = 'block';
    const cardSec = document.querySelector('.sandify-cards-section');
    if (cardSec) {
      cardSec.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  if (!fromHistory && window.location.hash === '#sandify-tracks') {
    replaceAppState({ type: 'page', page: 'gallery' }, '#gallery');
  }
}

// Global escape key listener to close subpage
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const subpageView = document.getElementById('sandifySubpageView');
    if (subpageView && subpageView.style.display !== 'none') {
      closeSandifySubpage();
    }
  }
});

window.openSandifySubpage = openSandifySubpage;
window.closeSandifySubpage = closeSandifySubpage;



/* ==========================================================================
   SANDFLIX MOVIES CATALOG LOGIC & PLAY INTEGRATION
   ========================================================================== */

function playMovieInCinema(actKey) {
  actKey = actKey || 'act1';
  openNetflixBlackPlayer(actKey);
}
window.playMovieInCinema = playMovieInCinema;
window.filterMoviesCatalog = filterMoviesCatalog;

/* ==========================================================================
   NETFLIX ROW CAROUSEL SMOOTH SLIDER & INFINITE LOOP CONTROLS
   ========================================================================== */
function slideNetflixRow(trackId, direction) {
  const track = document.getElementById(trackId);
  if (!track) return;
  const firstCard = track.querySelector('.n-card') || track.firstElementChild;
  const cardWidth = firstCard ? firstCard.offsetWidth : 240;
  const gap = 6;
  const visibleCards = Math.max(1, Math.floor(track.clientWidth / (cardWidth + gap))) || 2;
  const scrollDistance = (cardWidth + gap) * Math.min(visibleCards, 3);
  const maxScroll = track.scrollWidth - track.clientWidth;

  if (direction > 0) {
    // Scroll Right: if at or near the end, loop smoothly to start
    if (track.scrollLeft >= maxScroll - 20) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: scrollDistance, behavior: 'smooth' });
    }
  } else {
    // Scroll Left: if at start, loop smoothly to the very end
    if (track.scrollLeft <= 20) {
      track.scrollTo({ left: maxScroll, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: -scrollDistance, behavior: 'smooth' });
    }
  }
}
window.slideNetflixRow = slideNetflixRow;

// Automatic Scrolling Disabled: Rows only move on user interaction (arrow click, swipe, or drag)
function initNetflixCarouselAutoLoop() {
  // Intentionally disabled: automatic movement removed per user preference.
}
window.initNetflixCarouselAutoLoop = initNetflixCarouselAutoLoop;


/* ==========================================================================
   NETFLIX GENRE BROWSE INTERACTIVITY
   ========================================================================== */
function toggleGenreDropdown() {
  const menu = document.getElementById('genreDropdownMenu');
  if (menu) menu.classList.toggle('show');
}

function selectMovieGenre(catKey, catLabel, pillBtn) {
  // Update dropdown label
  const labelEl = document.getElementById('currentGenreLabel');
  if (labelEl && catLabel) labelEl.textContent = catLabel;

  const menu = document.getElementById('genreDropdownMenu');
  if (menu) menu.classList.remove('show');

  // Update pills
  const pills = document.querySelectorAll('.netflix-genre-pills .n-pill');
  pills.forEach(p => p.classList.remove('active'));
  if (pillBtn) {
    pillBtn.classList.add('active');
  }

  // Filter or scroll rows
  const rows = document.querySelectorAll('.netflix-rows-container .netflix-row');
  rows.forEach(row => {
    const rowCat = row.getAttribute('data-genre-category');
    if (catKey === 'all' || rowCat === catKey) {
      row.style.display = 'block';
    } else {
      row.style.display = 'none';
    }
  });

  // Smooth scroll down to rows if a specific genre picked
  if (catKey !== 'all') {
    const targetRow = document.getElementById('row-' + catKey);
    if (targetRow) {
      targetRow.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

// Close dropdown on outside click
document.addEventListener('click', function(e) {
  const dropdown = document.querySelector('.netflix-genre-dropdown');
  const menu = document.getElementById('genreDropdownMenu');
  if (menu && dropdown && !dropdown.contains(e.target)) {
    menu.classList.remove('show');
  }
});

window.toggleGenreDropdown = toggleGenreDropdown;
window.selectMovieGenre = selectMovieGenre;




/* ==========================================================================
   AUTHENTIC NETFLIX WEB CINEMA ENGINE (SEAMLESS CONTINUOUS FULL-MOVIE)
   Plays as 1 single 3-hour movie on screen while backend chains Act 1 & 2
   ========================================================================== */
const NBP_ACT1_DUR = 5407; // 01:30:07
const NBP_ACT2_DUR = 5416; // 01:30:16
const NBP_TOTAL_DUR = NBP_ACT1_DUR + NBP_ACT2_DUR; // 10823s -> 03:00:23

let nbpCurrentAct = 1; // 1 or 2
let nbpIdleTimer = null;
let nbpIsSeeking = false;
let nbpShowRemaining = false;
let nbpActiveSub = 'off';
let nbpSubInterval = null;

const NBP_SOURCES = {
  act1: {
    cloud: 'https://github.com/86parm-hub/ramayana/releases/download/v1.0/Ramayana.Part1.Act1.mp4#t=3',
    local: 'Ramayana.Part1.Act1.mp4',
    dur: NBP_ACT1_DUR
  },
  act2: {
    cloud: 'https://github.com/86parm-hub/ramayana/releases/download/v1.0/Ramayana.Part1.Act2.mp4',
    local: 'Ramayana.Part1.Act2.mp4',
    dur: NBP_ACT2_DUR
  }
};

// Subtitles mapping over the continuous timeline
const NBP_CONTINUOUS_SUBS = [
  { start: 3, end: 9, en: "In the golden age of Treta Yuga, Ayodhya stands in divine majesty.", hi: "त्रेतायुग के स्वर्ण काल में, अयोध्या दिव्य महिमा में विराजमान है।" },
  { start: 10, end: 18, en: "King Dasharatha performs the sacred Putrakameshti Yajna.", hi: "महाराज दशरथ ने पवित्र पुत्रकामेष्टि यज्ञ संपन्न किया।" },
  { start: 20, end: 32, en: "From the sacred flames, Lord Vishnu descends as Maryada Purushottam Rama.", hi: "पवित्र अग्नि से मर्यादा पुरुषोत्तम श्रीराम का दिव्य प्राकट्य हुआ।" },
  { start: 35, end: 50, en: "Sage Vishwamitra arrives at the court seeking Prince Rama's protection.", hi: "महर्षि विश्वामित्र अयोध्या की सभा में श्रीराम की रक्षा मांगने पधारे।" },
  { start: 55, end: 85, en: "With divine Astras, Sri Rama vanquishes Tadaka and restores Dharma.", hi: "दिव्य अस्त्रों से श्रीराम ने ताड़का का वध कर धर्म की रक्षा की।" },
  { start: 90, end: 120, en: "In the court of Mithila, Sri Rama strings the unyielding Shiva Dhanush Pinaka.", hi: "मिथिला की राजसभा में श्रीराम ने भगवान शिव के पिनाक धनुष पर प्रत्यंचा चढ़ाई।" },
  // Act 2 continuous timeline (starts after 5407s)
  { start: 5410, end: 5425, en: "The 14-year sacred exile begins as Sri Rama, Sita, and Lakshmana depart Ayodhya.", hi: "श्रीराम, जानकी और लक्ष्मण का 14 वर्ष का पवित्र वनवास प्रारंभ हुआ।" },
  { start: 5430, end: 5450, en: "Deep in Dandakaranya, the hermits find divine refuge in the presence of Rama.", hi: "दंडकारण्य के ऋषि-मुनि श्रीराम की छत्रछाया में अभय प्राप्त करते हैं।" },
  { start: 5455, end: 5490, en: "At Panchavati, the cosmic clash of Dharma and Adharma takes its initial sparks.", hi: "पंचवटी में धर्म और अधर्म के महायुद्ध की दिव्य चिंगारी सुलगी।" }
];

let nbpIsTrailerMode = false;
let nbpIsEmbedMode = false;

function playTrailerInNetflixPlayer(startSec) {
  openNetflixBlackPlayer(typeof startSec === 'number' ? startSec : 'trailer');
}
window.playTrailerInNetflixPlayer = playTrailerInNetflixPlayer;

function openNetflixBlackPlayer(targetTime, fromHistory) {
  const modal = document.getElementById('netflixBlackPlayerModal');
  const video = document.getElementById('nbpVideo');
  const spinner = document.getElementById('nbpSpinner');
  const embedIframe = document.getElementById('nbpEmbedIframe');

  // Close any open info/coming-soon modals cleanly without popping history
  const infoModal = document.getElementById('netflixMoreInfoModal');
  if (infoModal && infoModal.classList.contains('active')) {
    infoModal.classList.remove('active');
    infoModal.setAttribute('aria-hidden', 'true');
  }
  const csModal = document.getElementById('comingSoonModal');
  if (csModal && csModal.classList.contains('active')) {
    csModal.classList.remove('active');
  }

  // Pause billboard videos, trailer and OST
  const bbVideo = document.getElementById('homeBillboardVideo');
  if (bbVideo && !bbVideo.paused) bbVideo.pause();
  const moviesBbVideo = document.getElementById('moviesBillboardVideo');
  if (moviesBbVideo && !moviesBbVideo.paused) moviesBbVideo.pause();

  const trailerVideo = document.getElementById('trailerVideo');
  if (trailerVideo && !trailerVideo.paused) trailerVideo.pause();
  if (typeof ostAudio !== 'undefined' && !ostAudio.paused) ostAudio.pause();

  const cinemaVideo = document.getElementById('videoPlayer');
  if (cinemaVideo && !cinemaVideo.paused) cinemaVideo.pause();

  if (!modal) return;

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  closeAllNbpPopovers();

  // Push or replace history state for mobile/tablet back button
  if (!fromHistory) {
    const curPage = getCurrentActivePage();
    if (window.history && window.history.state && (window.history.state.type === 'movie-details' || window.history.state.type === 'coming-soon')) {
      replaceAppState({ type: 'netflix-player', targetTime: targetTime, prevPage: curPage }, '#player');
    } else {
      pushAppState({ type: 'netflix-player', targetTime: targetTime, prevPage: curPage }, '#player');
    }
  }

  // Handle Embed Movie Mode (e.g. Ranabaali TMDB 1389379 via Peachify)
  if (targetTime === 'ranabaali' || targetTime === '1389379') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Ranabaali • TMDB 1389379';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1389379';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode: Never Surrender (2026 / Netflix Original / TMDB 1616687)
  if (targetTime === 'never-surrender' || targetTime === 'never_surrender' || targetTime === 'neversurrender' || targetTime === '1616687' || targetTime === '81996126' || targetTime === '81958252' || targetTime === 'seranganbalik' || targetTime === 'akka' || targetTime === '243555') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Never Surrender (2026) • A Netflix Original Film';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1616687';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (The Paradise TMDB 1376856 via Peachify)
  if (targetTime === 'paradise' || targetTime === 'theparadise' || targetTime === '1376856') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'The Paradise • TMDB 1376856';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1376856';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Alpha TMDB 1122030 via Peachify)
  if (targetTime === 'alpha' || targetTime === '1122030') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Alpha • TMDB 1122030 (YRF Spy Universe)';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1122030';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Tere Ishk Mein TMDB 1142921 via Peachify)
  if (targetTime === 'tereishkmein' || targetTime === 'tere_ishk_mein' || targetTime === '1142921') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Tere Ishk Mein • TMDB 1142921';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1142921';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Pushpa 2: The Rule TMDB 857598 via Peachify)
  if (targetTime === 'pushpa2' || targetTime === 'pushpa_2' || targetTime === 'pushpa' || targetTime === '857598') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Pushpa 2: The Rule • TMDB 857598';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/857598';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Dorothy TMDB 1578079 via Peachify)
  if (targetTime === 'dorothy' || targetTime === 'dorothi' || targetTime === '1578079') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Dorothy • TMDB 1578079';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1578079';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (A Dog's Perfect Christmas TMDB 1570488 via Peachify)
  if (targetTime === 'dogs_christmas' || targetTime === 'dogschristmas' || targetTime === '1570488' || targetTime === 'adogsperfectchristmas') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = "A Dog's Perfect Christmas • TMDB 1570488";

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1570488';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Jurassic World Rebirth TMDB 1234821 via Peachify)
  if (targetTime === 'jurassic_rebirth' || targetTime === 'jurassicworld' || targetTime === 'jurassic' || targetTime === '1234821' || targetTime === 'jurassicworldrebirth') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = "Jurassic World Rebirth • TMDB 1234821";

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1234821';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Adipurush TMDB 734253 via Peachify)
  if (targetTime === 'adipurush' || targetTime === '734253' || targetTime === 'prabhas_adipurush') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = "Adipurush • TMDB 734253";

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/734253';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Don't Trouble the Trouble TMDB 1261763 via Peachify)
  if (targetTime === 'dont_trouble' || targetTime === 'donttrouble' || targetTime === '1261763' || targetTime === 'donttroublethetrouble') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = "Don't Trouble the Trouble • TMDB 1261763";

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1261763';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Maharaj TMDB 1171099 via Peachify)
  if (targetTime === 'maharaj' || targetTime === '1171099' || targetTime === 'junaid_maharaj') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = "Maharaj • TMDB 1171099";

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1171099';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (With Love TMDB 1508564 via Peachify)
  if (targetTime === 'with_love' || targetTime === 'withlove' || targetTime === '1508564' || targetTime === 'withlovetamil') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = "With Love • TMDB 1508564";

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1508564';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Never Surrender TMDB 1616687 via Peachify)
  if (targetTime === 'never_surrender' || targetTime === 'never-surrender' || targetTime === 'neversurrender' || targetTime === '1616687' || targetTime === '81996126' || targetTime === '81958252' || targetTime === 'seranganbalik') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Never Surrender (2026) • A Netflix Original Film';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1616687';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Made in Korea IMDb tt38674977 / Peachify Ad-Free)
  if (targetTime === 'made_in_korea' || targetTime === 'madeinkorea' || targetTime === 'tt38674977' || targetTime === '1561687' || targetTime === 'priyanka_korea') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = "Made in Korea • Priyanka Arul Mohan • IMDb tt38674977";

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1561687';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Peddi TMDB 1057265 / Peachify)
  if (targetTime === 'peddi' || targetTime === '1057265' || targetTime === 'tt23865918' || targetTime === 'ramcharan_peddi') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = "Peddi • Ram Charan • TMDB 1057265";

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1057265';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Cocktail 2 TMDB 1392469 / Peachify)
  if (targetTime === 'cocktail2' || targetTime === 'cocktail_2' || targetTime === '1392469' || targetTime === 'shahid_cocktail2') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = "Cocktail 2 • Shahid Kapoor • TMDB 1392469";

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1392469';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Avaraachan & Sons TMDB 1290035 / Peachify)
  if (targetTime === 'avarachan' || targetTime === 'avarachan_sons' || targetTime === '1290035' || targetTime === 'bijumenon_avarachan') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = "Avaraachan & Sons • Biju Menon • TMDB 1290035";

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1290035';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Reporting Live TMDB 1389172 / Peachify)
  if (targetTime === 'reporting_live' || targetTime === 'reportinglive' || targetTime === '1389172' || targetTime === 'parineeti_reporting') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = "Reporting Live • Parineeti Chopra • TMDB 1389172";

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1389172';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Heartland TMDB 1543469 / Peachify)
  if (targetTime === 'heartland' || targetTime === '1543469' || targetTime === 'jessica_heartland') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = "Heartland • Jessica Chastain • TMDB 1543469";

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1543469';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (One Year to Live, Buy a Man TMDB 1654940 / Peachify)
  if (targetTime === 'one_year_to_live' || targetTime === 'oneyeartolive' || targetTime === '1654940' || targetTime === 'buy_a_man') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = "One Year to Live, Buy a Man • Ko Shibasaki • TMDB 1654940";

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1654940';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Allen TMDB 1518204 / Peachify)
  if (targetTime === 'allen' || targetTime === '1518204' || targetTime === 'allen_alien') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = "Allen • T.J. Power • TMDB 1518204";

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1518204';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Jolly LLB 3 TMDB 1015981 / Peachify)
  if (targetTime === 'jolly_llb_3' || targetTime === 'jollyllb3' || targetTime === '1015981' || targetTime === 'akshay_jolly') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = "Jolly LLB 3 • Akshay Kumar & Arshad Warsi • TMDB 1015981";

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1015981';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Saiyaara TMDB 1241634 / Peachify)
  if (targetTime === 'saiyaara' || targetTime === '1241634' || targetTime === 'ahaan_saiyaara') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = "Saiyaara • Ahaan Panday & Aneet Padda • TMDB 1241634";

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1241634';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (The Last House TMDB 1284041 / Peachify)
  if (targetTime === 'the_last_house' || targetTime === 'thelasthouse' || targetTime === '1284041' || targetTime === 'greta_lasthouse') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = "The Last House • Greta Lee & Wagner Moura • TMDB 1284041";

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1284041';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Brawlers TMDB 1418709 / Peachify)
  if (targetTime === 'brawlers' || targetTime === 'bagarre' || targetTime === '1418709' || targetTime === 'nassim_brawlers') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = "Brawlers (Bagarre) • Nassim Lyes • TMDB 1418709";

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1418709';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Dhadak 2 TMDB 1213777 / CodeSpecters API DEMO_36da8c77)
  if (targetTime === 'dhadak2' || targetTime === 'dhadak_2' || targetTime === '1213777' || targetTime === 'tt13451410' || targetTime === 'siddhant_dhadak2') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = "Dhadak 2 • Siddhant Chaturvedi & Triptii Dimri • CodeSpecters 1213777";

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const embedUrl = 'https://api.codespecters.com/embed/movie/1213777?apikey=DEMO_36da8c77';
      if (embedIframe.src !== embedUrl) {
        embedIframe.src = embedUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Demon Slayer: Kimetsu no Yaiba – Infinity Castle TMDB 1311031)
  if (targetTime === 'demon_slayer' || targetTime === 'demonslayer' || targetTime === 'infinity_castle' || targetTime === '1311031' || targetTime === 'kimetsu_no_yaiba') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = "Demon Slayer: Kimetsu no Yaiba – Infinity Castle (2025) • TMDB 1311031";

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const embedUrl = 'https://peachify.net/movie/1311031';
      if (embedIframe.src !== embedUrl) {
        embedIframe.src = embedUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Hi Papa TMDB 1068452 / Peachify)
  if (targetTime === 'hi_papa' || targetTime === 'hipapa' || targetTime === 'hi_nanna' || targetTime === 'hinanna' || targetTime === '1068452' || targetTime === 'nani_hipapa') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = "Hi Papa • Nani & Mrunal Thakur • TMDB 1068452";

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const embedUrl = 'https://peachify.net/movie/1068452';
      if (embedIframe.src !== embedUrl) {
        embedIframe.src = embedUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Dragon TMDB 1273049 / Peachify)
  if (targetTime === 'dragon' || targetTime === 'dragon_2025' || targetTime === '1273049' || targetTime === 'pradeep_dragon') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = "Dragon • Pradeep Ranganathan • TMDB 1273049";

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const embedUrl = 'https://peachify.net/movie/1273049';
      if (embedIframe.src !== embedUrl) {
        embedIframe.src = embedUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Youth TMDB 1542352 / Peachify)
  if (targetTime === 'youth' || targetTime === 'youth_2026' || targetTime === '1542352' || targetTime === 'ken_youth' || targetTime === 'ken_karunas') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = "Youth (2026) • Ken Karunas • TMDB 1542352";

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const embedUrl = 'https://peachify.net/movie/1542352';
      if (embedIframe.src !== embedUrl) {
        embedIframe.src = embedUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Chhaava TMDB 1196943 / Peachify)
  if (targetTime === 'chhaava' || targetTime === 'chhava' || targetTime === '1196943' || targetTime === 'vicky_chhaava') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = "Chhaava (2025) • Vicky Kaushal & Rashmika Mandanna • TMDB 1196943";

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const embedUrl = 'https://peachify.net/movie/1196943';
      if (embedIframe.src !== embedUrl) {
        embedIframe.src = embedUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Maa TMDB 1389158 / Peachify)
  if (targetTime === 'maa' || targetTime === 'maa_2025' || targetTime === '1389158' || targetTime === 'kajol_maa') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = "Maa (2025) • Kajol & Ronit Roy • TMDB 1389158";

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const embedUrl = 'https://peachify.net/movie/1389158';
      if (embedIframe.src !== embedUrl) {
        embedIframe.src = embedUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Retro TMDB 1265827 / Peachify)
  if (targetTime === 'retro' || targetTime === 'retro_2025' || targetTime === '1265827' || targetTime === 'suriya_retro' || targetTime === 'suriya44') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = "Retro (Suriya 44) (2025) • Suriya & Pooja Hegde • TMDB 1265827";

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const embedUrl = 'https://peachify.net/movie/1265827';
      if (embedIframe.src !== embedUrl) {
        embedIframe.src = embedUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (The Odyssey TMDB 1368337 via Peachify)
  if (targetTime === 'the_odyssey' || targetTime === 'odyssey' || targetTime === '1368337') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'The Odyssey (2026) • TMDB 1368337 (Christopher Nolan)';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1368337';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (GOAT TMDB 1297842 via Peachify)
  if (targetTime === 'goat' || targetTime === 'goat_2026' || targetTime === '1297842') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'GOAT (2026) • TMDB 1297842 (Sony Pictures Animation)';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1297842';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Scary Movie 6 TMDB 1273221 via Peachify)
  if (targetTime === 'scary_movie_6' || targetTime === 'scarymovie6' || targetTime === '1273221') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Scary Movie 6 (2026) • TMDB 1273221 (Wayans Brothers)';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1273221';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Coolie TMDB 1153399 via Peachify)
  if (targetTime === 'coolie' || targetTime === '1153399') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Coolie (2025) • TMDB 1153399 (Superstar Rajinikanth / Lokesh Kanagaraj)';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1153399';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Dhurandhar TMDB 1291608 via Peachify)
  if (targetTime === 'dhurandhar' || targetTime === '1291608') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Dhurandhar (2025) • TMDB 1291608 (Ranveer Singh / Aditya Dhar)';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1291608';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Jailer 2 TMDB 1234139 via Peachify)
  if (targetTime === 'jailer_2' || targetTime === 'jailer2' || targetTime === '1234139') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Jailer 2 (2026) • TMDB 1234139 (Superstar Rajinikanth / Nelson)';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1234139';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Disclosure Day TMDB 1275779 via Peachify)
  if (targetTime === 'disclosure_day' || targetTime === 'disclosureday' || targetTime === '1275779') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Disclosure Day (2026) • TMDB 1275779 (Steven Spielberg / Universal)';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1275779';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Wuthering Heights TMDB 1316092 via Peachify)
  if (targetTime === 'wuthering_heights' || targetTime === 'wutheringheights' || targetTime === '1316092') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Wuthering Heights (2026) • TMDB 1316092 (Emerald Fennell / Warner Bros)';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1316092';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Hoppers TMDB 1327819 via Peachify)
  if (targetTime === 'hoppers' || targetTime === '1327819') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Hoppers (2026) • TMDB 1327819 (Disney & Pixar Animation)';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1327819';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Michael TMDB 936075 via Peachify)
  if (targetTime === 'michael' || targetTime === '936075') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Michael (2026) • TMDB 936075 (Antoine Fuqua / Lionsgate)';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/936075';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (The Super Mario Galaxy Movie TMDB 1226863 via Peachify)
  if (targetTime === 'mario_galaxy' || targetTime === 'super_mario' || targetTime === '1226863') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'The Super Mario Galaxy Movie (2026) • TMDB 1226863 (Nintendo / Illumination)';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1226863';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Minions & Monsters TMDB 1315772 via Peachify)
  if (targetTime === 'minions_monsters' || targetTime === 'minions' || targetTime === '1315772') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Minions & Monsters (2026) • TMDB 1315772 (Illumination / Universal)';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1315772';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Mortal Kombat II TMDB 931285 via Peachify)
  if (targetTime === 'mortal_kombat_2' || targetTime === 'mortalkombat2' || targetTime === '931285') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Mortal Kombat II (2026) • TMDB 931285 (New Line Cinema / Warner Bros)';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/931285';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Kartavya TMDB 1628367 via Peachify)
  if (targetTime === 'kartavya' || targetTime === 'kartavya_2026' || targetTime === '1628367') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Kartavya (2026) • TMDB 1628367 (Saif Ali Khan & Red Chillies)';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1628367';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Gandhari TMDB 1355228 via Peachify)
  if (targetTime === 'gandhari' || targetTime === 'gandhari_2026' || targetTime === '1355228') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Gandhari (2026) • TMDB 1355228 (Taapsee Pannu & Kanika Dhillon)';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1355228';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Handle Embed Movie Mode (Toaster TMDB 1416391 via Peachify)
  if (targetTime === 'toaster' || targetTime === 'toaster_2026' || targetTime === '1416391') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Toaster (2026) • TMDB 1416391 (Rajkummar Rao & Sanya Malhotra)';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1416391';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // =========================================================================
  // EMBED MOVIE HANDLERS: ROW 7 (MOST ANTICIPATED 2026 FRANCHISE BLOCKBUSTERS)
  // =========================================================================

  // Spider-Man: Brand New Day (TMDB 969681 via Peachify)
  if (targetTime === 'spiderman_brand_new_day' || targetTime === 'spiderman' || targetTime === 'spiderman_2026' || targetTime === '969681') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Spider-Man: Brand New Day (2026) • TMDB 969681';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/969681';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Clayface (TMDB 1400940 via Peachify)
  if (targetTime === 'clayface' || targetTime === 'clay_face' || targetTime === 'clayface_2026' || targetTime === '1400940') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Clayface (2026) • TMDB 1400940';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1400940';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Resident Evil (TMDB 1423191 via Peachify)
  if (targetTime === 'resident_evil_2026' || targetTime === 'resident_evil' || targetTime === 'residentevil' || targetTime === '1423191') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Resident Evil (2026) • TMDB 1423191';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1423191';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Street Fighter (TMDB 1153576 via Peachify)
  if (targetTime === 'street_fighter' || targetTime === 'streetfighter' || targetTime === 'street_fighter_2026' || targetTime === '1153576') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Street Fighter (2026) • TMDB 1153576';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1153576';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Toy Story 5 (TMDB 1084244 via Peachify)
  if (targetTime === 'toy_story_5' || targetTime === 'toystory5' || targetTime === 'toy_story' || targetTime === '1084244') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Toy Story 5 (2026) • TMDB 1084244';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1084244';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Supergirl: Woman of Tomorrow (TMDB 1081003 via Peachify)
  if (targetTime === 'supergirl_woman_of_tomorrow' || targetTime === 'supergirl' || targetTime === 'supergirl_2026' || targetTime === '1081003') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Supergirl: Woman of Tomorrow (2026) • TMDB 1081003';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1081003';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Star Wars: The Mandalorian and Grogu (TMDB 1228710 via Peachify)
  if (targetTime === 'mandalorian_and_grogu' || targetTime === 'mandalorian' || targetTime === 'the_mandalorian' || targetTime === '1228710') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Star Wars: The Mandalorian & Grogu (2026) • TMDB 1228710';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1228710';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Godzilla Minus Zero (TMDB 1381071 via Peachify)
  if (targetTime === 'godzilla_minus_zero' || targetTime === 'godzilla' || targetTime === 'godzilla_2026' || targetTime === '1381071') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Godzilla Minus Zero (2026) • TMDB 1381071';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/1381071';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  // Project Hail Mary (TMDB 687163 via Peachify)
  if (targetTime === 'project_hail_mary' || targetTime === 'projecthailmary' || targetTime === 'project_hail_mary_2026' || targetTime === '687163') {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Project Hail Mary (2026) • TMDB 687163';

    if (embedIframe) {
      embedIframe.style.display = 'block';
      const peachifyUrl = 'https://peachify.net/movie/687163';
      if (embedIframe.src !== peachifyUrl) {
        embedIframe.src = peachifyUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }


  // Generalized CodeSpecters / Custom Embed Routing
  if (typeof targetTime === 'string' && (targetTime.startsWith('codespecters:') || targetTime.startsWith('cs:') || targetTime.startsWith('https://api.codespecters.com/'))) {
    nbpIsEmbedMode = true;
    nbpIsTrailerMode = false;
    modal.classList.add('is-embed-active');
    if (video && !video.paused) video.pause();
    if (video) video.style.display = 'none';

    const rawId = targetTime.replace(/^(codespecters:|cs:)/, '').trim();
    const targetUrl = targetTime.startsWith('https://') ? targetTime : `https://api.codespecters.com/embed/movie/${rawId}?apikey=DEMO_36da8c77`;

    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = `Streaming via CodeSpecters • ${rawId}`;

    if (embedIframe) {
      embedIframe.style.display = 'block';
      if (embedIframe.src !== targetUrl) {
        embedIframe.src = targetUrl;
      }
    }
    if (spinner) spinner.classList.remove('active');
    return;
  }

  if (nbpIsEmbedMode) {
    nbpIsEmbedMode = false;
    modal.classList.remove('is-embed-active');
    if (embedIframe) {
      embedIframe.style.display = 'none';
      embedIframe.removeAttribute('src');
    }
    if (video) video.style.display = 'block';
  }

  // Handle trailer mode
  if (targetTime === 'trailer' || (typeof targetTime === 'number' && nbpIsTrailerMode)) {
    nbpIsTrailerMode = true;
    const offset = (typeof targetTime === 'number') ? targetTime : 0;
    loadAndPlayTrailerInNbp(offset);
  } else {
    nbpIsTrailerMode = false;
    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Ramayana: Part One';
    const startSec = (typeof targetTime === 'number') ? targetTime : 0;
    loadAndPlayContinuous(startSec);
  }

  startSubtitleEngine();
  resetNbpIdleTimer();
}

function closeNetflixBlackPlayer(fromHistory) {
  const modal = document.getElementById('netflixBlackPlayerModal');
  const video = document.getElementById('nbpVideo');
  const embedIframe = document.getElementById('nbpEmbedIframe');

  // 1. Immediately close modal and hide elements to guarantee ZERO white flash or blank screen
  if (modal) {
    modal.classList.remove('is-embed-active');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  if (embedIframe) {
    embedIframe.style.display = 'none';
    embedIframe.removeAttribute('src');
  }

  if (video) {
    video.style.display = 'block';
    try {
      if (!video.paused) video.pause();
    } catch (e) {}
  }

  nbpIsEmbedMode = false;
  document.body.style.overflow = '';
  closeAllNbpPopovers();
  stopSubtitleEngine();

  if (nbpIsTrailerMode) {
    nbpIsTrailerMode = false;
    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Ramayana: Part One';
  }

  if (document.fullscreenElement) {
    try { document.exitFullscreen(); } catch (e) {}
  }

  // 2. Clean URL hash & history state safely without getting trapped by iframe navigation history
  try {
    if (!fromHistory) {
      const prevPage = (window.history.state && window.history.state.prevPage) || getCurrentActivePage() || 'home';
      if (window.location.hash === '#player') {
        replaceAppState({ type: 'page', page: prevPage }, '#' + prevPage);
      }
    }
  } catch (err) {
    console.warn('History clean error on close:', err);
  }
}
window.closeNetflixBlackPlayer = closeNetflixBlackPlayer;

function loadAndPlayTrailerInNbp(startOffset) {
  const video = document.getElementById('nbpVideo');
  const spinner = document.getElementById('nbpSpinner');
  const titleDisplay = document.getElementById('nbpCenterTitle');
  if (titleDisplay) {
    titleDisplay.textContent = 'Ramayana: Part One • Official Theatrical Trailer (Full HD)';
  }
  if (!video) return;

  const trailerUrl = 'assets/videos/move_trailer_hd.mp4';
  if (video.getAttribute('data-loaded-src') !== trailerUrl) {
    video.src = trailerUrl;
    video.setAttribute('data-loaded-src', trailerUrl);
    video.load();
  }

  if (spinner) spinner.classList.add('active');
  if (startOffset > 0) video.currentTime = startOffset;

  video.play().then(() => {
    if (spinner) spinner.classList.remove('active');
    updateNbpPlayButton(true);
  }).catch(e => {
    if (spinner) spinner.classList.remove('active');
    updateNbpPlayButton(false);
  });
}

function loadAndPlayContinuous(globalSec) {
  const video = document.getElementById('nbpVideo');
  const spinner = document.getElementById('nbpSpinner');
  if (!video) return;

  const isLocal = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // Determine act and internal offset
  if (globalSec < NBP_ACT1_DUR) {
    nbpCurrentAct = 1;
    const internalOffset = Math.max(0, globalSec);
    const targetUrl = isLocal ? NBP_SOURCES.act1.local : NBP_SOURCES.act1.cloud;

    if (video.getAttribute('data-loaded-src') !== targetUrl) {
      video.src = targetUrl;
      video.setAttribute('data-loaded-src', targetUrl);
      video.load();
    }

    if (spinner) spinner.classList.add('active');
    const offset = (!isLocal && internalOffset < 3.0) ? 3.0 : internalOffset;
    if (offset > 0) video.currentTime = offset;

    video.play().then(() => {
      if (spinner) spinner.classList.remove('active');
      updateNbpPlayButton(true);
    }).catch(e => {
      if (spinner) spinner.classList.remove('active');
      updateNbpPlayButton(false);
    });

  } else {
    nbpCurrentAct = 2;
    const internalOffset = Math.max(0, globalSec - NBP_ACT1_DUR);
    const targetUrl = isLocal ? NBP_SOURCES.act2.local : NBP_SOURCES.act2.cloud;

    if (video.getAttribute('data-loaded-src') !== targetUrl) {
      video.src = targetUrl;
      video.setAttribute('data-loaded-src', targetUrl);
      video.load();
    }

    if (spinner) spinner.classList.add('active');
    video.currentTime = internalOffset;

    video.play().then(() => {
      if (spinner) spinner.classList.remove('active');
      updateNbpPlayButton(true);
    }).catch(e => {
      if (spinner) spinner.classList.remove('active');
      updateNbpPlayButton(false);
    });
  }
}



// Double Click & Tap Handlers
let nbpLastTapLeft = 0;
let nbpLastTapRight = 0;

function handleNbpZoneClick(side, e) {
  const now = Date.now();
  if (side === 'left') {
    if (now - nbpLastTapLeft < 300) {
      nbpSeekRelative(-10);
      flashNbpRipple('left');
      nbpLastTapLeft = 0;
    } else {
      nbpLastTapLeft = now;
      setTimeout(() => {
        if (nbpLastTapLeft === now) toggleNbpPlayPause();
      }, 300);
    }
  } else if (side === 'right') {
    if (now - nbpLastTapRight < 300) {
      nbpSeekRelative(10);
      flashNbpRipple('right');
      nbpLastTapRight = 0;
    } else {
      nbpLastTapRight = now;
      setTimeout(() => {
        if (nbpLastTapRight === now) toggleNbpPlayPause();
      }, 300);
    }
  }
}

function handleNbpCenterClick(e) {
  const modal = document.getElementById('netflixBlackPlayerModal');
  if (!modal) return;

  // On touch / mobile devices, if idle, tap wakes up controls
  if (modal.classList.contains('is-idle')) {
    resetNbpIdleTimer();
    return;
  }

  // If already visible on touch device, tapping video hides controls for immersion
  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (isTouch) {
    modal.classList.add('is-idle');
    closeAllNbpPopovers();
  } else {
    toggleNbpPlayPause();
  }
}

function flashNbpRipple(side) {
  const rip = document.getElementById(side === 'left' ? 'nbpRippleLeft' : 'nbpRippleRight');
  if (!rip) return;
  rip.classList.add('show');
  setTimeout(() => rip.classList.remove('show'), 500);
}

function toggleNbpPlayPause() {
  const video = document.getElementById('nbpVideo');
  if (!video) return;
  if (video.paused) {
    video.play();
    flashNbpIcon('play');
    updateNbpPlayButton(true);
  } else {
    video.pause();
    flashNbpIcon('pause');
    updateNbpPlayButton(false);
  }
  resetNbpIdleTimer();
}

function updateNbpPlayButton(isPlaying) {
  const playIcon = document.getElementById('nbpPlayIcon');
  const pauseIcon = document.getElementById('nbpPauseIcon');
  if (playIcon && pauseIcon) {
    playIcon.style.display = isPlaying ? 'none' : 'block';
    pauseIcon.style.display = isPlaying ? 'block' : 'none';
  }
}

function flashNbpIcon(type) {
  const flash = document.getElementById('nbpFlashIcon');
  const play = document.getElementById('nbpFlashPlay');
  const pause = document.getElementById('nbpFlashPause');
  if (!flash) return;
  if (type === 'play') {
    if (play) play.style.display = 'block';
    if (pause) pause.style.display = 'none';
  } else {
    if (play) play.style.display = 'none';
    if (pause) pause.style.display = 'block';
  }
  flash.classList.add('show');
  setTimeout(() => flash.classList.remove('show'), 400);
}

function getCurrentGlobalTime() {
  const video = document.getElementById('nbpVideo');
  if (!video) return 0;
  if (nbpIsTrailerMode) {
    return video.currentTime || 0;
  }
  return (nbpCurrentAct === 1) ? video.currentTime : (NBP_ACT1_DUR + video.currentTime);
}

function nbpSeekRelative(seconds) {
  const video = document.getElementById('nbpVideo');
  if (nbpIsTrailerMode && video) {
    const cur = video.currentTime || 0;
    const maxDur = video.duration || 241;
    video.currentTime = Math.max(0, Math.min(maxDur, cur + seconds));
    resetNbpIdleTimer();
    return;
  }
  const curGlobal = getCurrentGlobalTime();
  const target = Math.max(0, Math.min(NBP_TOTAL_DUR, curGlobal + seconds));
  seekGlobal(target);
  resetNbpIdleTimer();
}

function seekGlobal(targetSec) {
  const video = document.getElementById('nbpVideo');
  const spinner = document.getElementById('nbpSpinner');
  if (!video) return;

  if (nbpIsTrailerMode) {
    const maxDur = video.duration || 241;
    video.currentTime = Math.max(0, Math.min(maxDur, targetSec));
    resetNbpIdleTimer();
    return;
  }

  if (spinner) spinner.classList.add('active');

  if (targetSec < NBP_ACT1_DUR) {
    if (nbpCurrentAct === 1) {
      video.currentTime = targetSec;
    } else {
      loadAndPlayContinuous(targetSec);
    }
  } else {
    if (nbpCurrentAct === 2) {
      video.currentTime = targetSec - NBP_ACT1_DUR;
    } else {
      loadAndPlayContinuous(targetSec);
    }
  }
}

function toggleNbpMute() {
  const video = document.getElementById('nbpVideo');
  const volHigh = document.getElementById('nbpVolHigh');
  const volMute = document.getElementById('nbpVolMute');
  const slider = document.getElementById('nbpVolumeSlider');
  if (!video) return;
  video.muted = !video.muted;
  if (volHigh && volMute) {
    volHigh.style.display = video.muted ? 'none' : 'block';
    volMute.style.display = video.muted ? 'block' : 'none';
  }
  if (slider) slider.value = video.muted ? 0 : video.volume;
}

// Popovers
function toggleNbpAudioPopover() {
  const pop = document.getElementById('nbpAudioPopover');
  if (!pop) return;
  const isShown = pop.classList.contains('show');
  closeAllNbpPopovers();
  if (!isShown) pop.classList.add('show');
}

function toggleNbpSpeedPopover() {
  const pop = document.getElementById('nbpSpeedPopover');
  if (!pop) return;
  const isShown = pop.classList.contains('show');
  closeAllNbpPopovers();
  if (!isShown) pop.classList.add('show');
}

function closeAllNbpPopovers() {
  const a = document.getElementById('nbpAudioPopover');
  const s = document.getElementById('nbpSpeedPopover');
  if (a) a.classList.remove('show');
  if (s) s.classList.remove('show');
}

function setNbpAudio(audioKey) {
  const h51 = document.getElementById('nbpAudHindi51');
  const h20 = document.getElementById('nbpAudHindi20');
  if (h51) h51.classList.toggle('active', audioKey === 'hindi51');
  if (h20) h20.classList.toggle('active', audioKey === 'hindi20');
  closeAllNbpPopovers();
}

function setNbpSubtitle(subKey) {
  nbpActiveSub = subKey;
  const sOff = document.getElementById('nbpSubOff');
  const sEn = document.getElementById('nbpSubEn');
  const sHi = document.getElementById('nbpSubHi');
  if (sOff) sOff.classList.toggle('active', subKey === 'off');
  if (sEn) sEn.classList.toggle('active', subKey === 'en');
  if (sHi) sHi.classList.toggle('active', subKey === 'hi');
  const subText = document.getElementById('nbpSubtitleText');
  if (subKey === 'off' && subText) subText.classList.remove('visible');
  closeAllNbpPopovers();
}

function setNbpSpeed(speed, optEl) {
  const video = document.getElementById('nbpVideo');
  if (!video) return;
  video.playbackRate = speed;

  document.querySelectorAll('.nbp-speed-opt').forEach(el => el.classList.remove('active'));
  if (optEl) optEl.classList.add('active');
  closeAllNbpPopovers();
}

function toggleNbpTimeFormat() {
  nbpShowRemaining = !nbpShowRemaining;
  const curGlobal = getCurrentGlobalTime();
  const durGlobal = NBP_TOTAL_DUR;
  const timeRemaining = document.getElementById('nbpTimeRemaining');
  if (timeRemaining) {
    if (nbpShowRemaining) {
      const rem = Math.max(0, durGlobal - curGlobal);
      timeRemaining.textContent = formatNbpTime(rem);
    } else {
      timeRemaining.textContent = formatNbpTime(curGlobal);
    }
  }
}

function toggleNbpPiP() {
  const video = document.getElementById('nbpVideo');
  if (!video) return;
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture().catch(e => {});
  } else if (video.requestPictureInPicture) {
    video.requestPictureInPicture().catch(e => console.log('PiP Error:', e));
  }
}

function toggleNbpFullscreen() {
  const modal = document.getElementById('netflixBlackPlayerModal');
  const video = document.getElementById('nbpVideo');
  const fsEnter = document.getElementById('nbpFsEnter');
  const fsExit = document.getElementById('nbpFsExit');
  if (!modal || !video) return;

  const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
  if (!isFullscreen) {
    if (modal.requestFullscreen) {
      modal.requestFullscreen().then(() => {
        if (fsEnter) fsEnter.style.display = 'none';
        if (fsExit) fsExit.style.display = 'block';
      }).catch(err => {
        if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
      });
    } else if (modal.webkitRequestFullscreen) {
      modal.webkitRequestFullscreen();
      if (fsEnter) fsEnter.style.display = 'none';
      if (fsExit) fsExit.style.display = 'block';
    } else if (video.webkitEnterFullscreen) {
      // iOS Safari on iPhone
      video.webkitEnterFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        if (fsEnter) fsEnter.style.display = 'block';
        if (fsExit) fsExit.style.display = 'none';
      }).catch(err => {});
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
      if (fsEnter) fsEnter.style.display = 'block';
      if (fsExit) fsExit.style.display = 'none';
    }
  }
}

function startSubtitleEngine() {
  stopSubtitleEngine();
  const subText = document.getElementById('nbpSubtitleText');
  if (!subText) return;

  nbpSubInterval = setInterval(() => {
    if (nbpActiveSub === 'off') {
      subText.classList.remove('visible');
      return;
    }
    const curGlobal = getCurrentGlobalTime();
    let match = null;
    for (let i = 0; i < NBP_CONTINUOUS_SUBS.length; i++) {
      if (curGlobal >= NBP_CONTINUOUS_SUBS[i].start && curGlobal <= NBP_CONTINUOUS_SUBS[i].end) {
        match = NBP_CONTINUOUS_SUBS[i];
        break;
      }
    }
    if (match) {
      subText.textContent = nbpActiveSub === 'hi' ? match.hi : match.en;
      subText.classList.add('visible');
    } else {
      subText.classList.remove('visible');
    }
  }, 250);
}

function stopSubtitleEngine() {
  if (nbpSubInterval) {
    clearInterval(nbpSubInterval);
    nbpSubInterval = null;
  }
  const subText = document.getElementById('nbpSubtitleText');
  if (subText) subText.classList.remove('visible');
}

function resetNbpIdleTimer() {
  const modal = document.getElementById('netflixBlackPlayerModal');
  if (!modal) return;
  modal.classList.remove('is-idle');
  clearTimeout(nbpIdleTimer);
  nbpIdleTimer = setTimeout(() => {
    const video = document.getElementById('nbpVideo');
    if (video && !video.paused && !nbpIsSeeking) {
      modal.classList.add('is-idle');
      closeAllNbpPopovers();
    }
  }, 3500);
}

function formatNbpTime(sec) {
  sec = Math.max(0, Math.floor(sec || 0));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Scrubber & Event Wiring
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('netflixBlackPlayerModal');
  const video = document.getElementById('nbpVideo');
  const spinner = document.getElementById('nbpSpinner');
  const progFill = document.getElementById('nbpProgressFill');
  const buffFill = document.getElementById('nbpBufferFill');
  const thumb = document.getElementById('nbpScrubberThumb');
  const txtCurrent = document.getElementById('nbpCurrentTime');
  const txtDuration = document.getElementById('nbpDurationTime');
  const scrubWrap = document.getElementById('nbpScrubberWrap');
  const tooltip = document.getElementById('nbpScrubberTooltip');
  const tooltipTime = document.getElementById('nbpTooltipTime');
  const volSlider = document.getElementById('nbpVolumeSlider');

  if (!video) return;

  // Seamless auto-transition from Part 1 to Part 2 on ended
  video.addEventListener('ended', () => {
    if (nbpCurrentAct === 1) {
      console.log('Act 1 ended, seamlessly continuing to Act 2...');
      loadAndPlayContinuous(NBP_ACT1_DUR);
    }
  });

  // Real-time Netflix Loading & Buffering Spinner Events
  video.addEventListener('waiting', () => {
    if (spinner) spinner.classList.add('active');
  });

  video.addEventListener('seeking', () => {
    if (spinner) spinner.classList.add('active');
  });

  video.addEventListener('loadstart', () => {
    if (spinner) spinner.classList.add('active');
  });

  video.addEventListener('canplay', () => {
    if (spinner) spinner.classList.remove('active');
  });

  video.addEventListener('canplaythrough', () => {
    if (spinner) spinner.classList.remove('active');
  });

  video.addEventListener('seeked', () => {
    if (spinner) spinner.classList.remove('active');
  });

  video.addEventListener('playing', () => {
    if (spinner) spinner.classList.remove('active');
    updateNbpPlayButton(true);
  });

  video.addEventListener('pause', () => {
    updateNbpPlayButton(false);
    if (modal) modal.classList.remove('is-idle');
  });

  video.addEventListener('timeupdate', () => {
    if (nbpIsSeeking) return;
    const curGlobal = getCurrentGlobalTime();
    const durGlobal = nbpIsTrailerMode ? (video.duration || 241) : NBP_TOTAL_DUR;
    const pct = (curGlobal / durGlobal) * 100;
    if (progFill) progFill.style.width = pct + '%';
    if (thumb) thumb.style.left = pct + '%';
    
    const timeRemaining = document.getElementById('nbpTimeRemaining');
    if (timeRemaining) {
      if (nbpShowRemaining) {
        const rem = Math.max(0, durGlobal - curGlobal);
        timeRemaining.textContent = formatNbpTime(rem);
      } else {
        timeRemaining.textContent = formatNbpTime(curGlobal);
      }
    }
    if (txtCurrent && txtDuration) {
      txtCurrent.textContent = formatNbpTime(curGlobal);
      txtDuration.textContent = formatNbpTime(durGlobal);
    }

    // Buffer calculation
    if (video.buffered.length > 0 && buffFill) {
      const actOffset = (nbpCurrentAct === 1) ? 0 : NBP_ACT1_DUR;
      for (let i = 0; i < video.buffered.length; i++) {
        if (video.buffered.start(i) <= video.currentTime && video.currentTime <= video.buffered.end(i)) {
          const globalBufferEnd = actOffset + video.buffered.end(i);
          buffFill.style.width = ((globalBufferEnd / durGlobal) * 100) + '%';
          break;
        }
      }
    }
  });

  // Scrubber Seeking over full continuous duration (Mouse + Touch Support for iOS/Android)
  function getEventClientX(e) {
    if (e.touches && e.touches.length > 0) return e.touches[0].clientX;
    if (e.changedTouches && e.changedTouches.length > 0) return e.changedTouches[0].clientX;
    return e.clientX || 0;
  }

  function seekToPosition(e) {
    if (!scrubWrap) return;
    const rect = scrubWrap.getBoundingClientRect();
    const clientX = getEventClientX(e);
    const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const targetGlobalSec = pos * NBP_TOTAL_DUR;
    seekGlobal(targetGlobalSec);
    if (progFill) progFill.style.width = (pos * 100) + '%';
    if (thumb) thumb.style.left = (pos * 100) + '%';
  }

  if (scrubWrap) {
    // Mouse Support
    scrubWrap.addEventListener('mousedown', (e) => {
      nbpIsSeeking = true;
      seekToPosition(e);
      const onMove = (ev) => seekToPosition(ev);
      const onUp = () => {
        nbpIsSeeking = false;
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    });

    scrubWrap.addEventListener('mousemove', (e) => {
      const rect = scrubWrap.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const targetSec = pos * NBP_TOTAL_DUR;
      if (tooltip) {
        tooltip.style.left = (pos * 100) + '%';
      }
      if (tooltipTime) {
        tooltipTime.textContent = formatNbpTime(targetSec);
      }
    });

    // Touch Support for Android & iOS
    scrubWrap.addEventListener('touchstart', (e) => {
      nbpIsSeeking = true;
      resetNbpIdleTimer();
      seekToPosition(e);
      const onTouchMove = (ev) => {
        seekToPosition(ev);
      };
      const onTouchEnd = () => {
        nbpIsSeeking = false;
        resetNbpIdleTimer();
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
        window.removeEventListener('touchcancel', onTouchEnd);
      };
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      window.addEventListener('touchend', onTouchEnd, { passive: true });
      window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    }, { passive: true });
  }

  // Volume Slider
  if (volSlider) {
    volSlider.addEventListener('input', (e) => {
      video.volume = parseFloat(e.target.value);
      video.muted = (video.volume === 0);
      const volHigh = document.getElementById('nbpVolHigh');
      const volMute = document.getElementById('nbpVolMute');
      if (volHigh && volMute) {
        volHigh.style.display = video.muted ? 'none' : 'block';
        volMute.style.display = video.muted ? 'block' : 'none';
      }
    });
  }

  // Mouse Movement
  if (modal) {
    modal.addEventListener('mousemove', resetNbpIdleTimer);
    modal.addEventListener('touchstart', resetNbpIdleTimer);
  }

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (!modal || !modal.classList.contains('active')) return;
    if (e.key === 'Escape') {
      closeNetflixBlackPlayer();
    } else if (e.key === ' ' || e.key === 'k' || e.key === 'K') {
      e.preventDefault();
      toggleNbpPlayPause();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      nbpSeekRelative(-10);
      flashNbpRipple('left');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nbpSeekRelative(10);
      flashNbpRipple('right');
    } else if (e.key === 'm' || e.key === 'M') {
      toggleNbpMute();
    } else if (e.key === 'f' || e.key === 'F') {
      toggleNbpFullscreen();
    }
  });
});

function playMovieInCinema() {
  openNetflixBlackPlayer(0);
}
window.playMovieInCinema = playMovieInCinema;

function startCinemaStream() {
  openNetflixBlackPlayer(0);
}
window.startCinemaStream = startCinemaStream;

window.__realOpenNetflixBlackPlayer = openNetflixBlackPlayer;
window.openNetflixBlackPlayer = openNetflixBlackPlayer;
window.closeNetflixBlackPlayer = closeNetflixBlackPlayer;
window.handleNbpZoneClick = handleNbpZoneClick;
window.handleNbpCenterClick = handleNbpCenterClick;
window.toggleNbpPlayPause = toggleNbpPlayPause;
window.nbpSeekRelative = nbpSeekRelative;
window.toggleNbpMute = toggleNbpMute;
window.toggleNbpAudioPopover = toggleNbpAudioPopover;
window.toggleNbpSpeedPopover = toggleNbpSpeedPopover;
window.setNbpAudio = setNbpAudio;
window.setNbpSubtitle = setNbpSubtitle;
window.setNbpSpeed = setNbpSpeed;
window.toggleNbpTimeFormat = toggleNbpTimeFormat;
window.toggleNbpPiP = toggleNbpPiP;
window.toggleNbpFullscreen = toggleNbpFullscreen;

/* ==========================================================================
   NETFLIX HOME BROWSE CONTROLLER (Billboard Hover Video, Carousel & Modals)
   ========================================================================== */

let isHomeBillboardAudioEnabled = false;

function initHomeBillboard() {
  const billboard = document.getElementById('homeHeroBillboard');
  const video = document.getElementById('homeBillboardVideo');
  const videoWrap = document.getElementById('homeBillboardVideoWrap');

  if (!billboard || !video || !videoWrap) return;

  function playBillboardPreview() {
    video.muted = !isHomeBillboardAudioEnabled;
    video.volume = 1.0;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        videoWrap.classList.add('playing');
      }).catch(err => {
        console.log('Billboard preview waiting for user interaction:', err);
      });
    }
  }

  function pauseBillboardPreview() {
    videoWrap.classList.remove('playing');
    if (!video.paused) {
      video.pause();
    }
  }

  // 1. Jab banner par cursor hover ho, tabhi video play ho
  billboard.addEventListener('mouseenter', () => {
    playBillboardPreview();
  });

  // 2. Jab banner par se cursor hate, tab video turant ruk jaye (pause)
  billboard.addEventListener('mouseleave', () => {
    pauseBillboardPreview();
  });
}

function toggleBillboardAudio(event) {
  if (event) event.stopPropagation();
  const video = document.getElementById('homeBillboardVideo');
  const muteIcon = document.getElementById('homeBBAudioMute');
  const unmuteIcon = document.getElementById('homeBBAudioUnmute');
  const videoWrap = document.getElementById('homeBillboardVideoWrap');

  if (!video) return;

  isHomeBillboardAudioEnabled = !isHomeBillboardAudioEnabled;
  video.muted = !isHomeBillboardAudioEnabled;
  video.volume = 1.0;

  if (video.paused) {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        if (videoWrap) videoWrap.classList.add('playing');
      }).catch(err => console.log('Home billboard play error:', err));
    }
  } else {
    if (videoWrap) videoWrap.classList.add('playing');
  }

  if (video.muted) {
    if (muteIcon) muteIcon.style.display = 'block';
    if (unmuteIcon) unmuteIcon.style.display = 'none';
  } else {
    if (muteIcon) muteIcon.style.display = 'none';
    if (unmuteIcon) unmuteIcon.style.display = 'block';
  }
}

function scrollNetflixRow(trackId, direction) {
  const track = document.getElementById(trackId);
  if (!track) return;
  const scrollDistance = (track.clientWidth * 0.75) * direction;
  track.scrollBy({ left: scrollDistance, behavior: 'smooth' });
}

function toggleMyList(btn) {
  if (!btn) return;
  const isAdded = btn.getAttribute('data-added') === 'true';
  if (isAdded) {
    btn.setAttribute('data-added', 'false');
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
    showToast('Removed from My List');
  } else {
    btn.setAttribute('data-added', 'true');
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#46d369" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    showToast('Saved to My List');
  }
}

function showToast(message) {
  let toast = document.getElementById('nToastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'nToastNotification';
    toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(20px);background:rgba(20,20,20,0.95);color:#fff;padding:12px 24px;border-radius:6px;font-size:14px;font-weight:700;z-index:999999;border:1px solid rgba(255,255,255,0.2);box-shadow:0 10px 30px rgba(0,0,0,0.8);backdrop-filter:blur(10px);opacity:0;transition:all 0.3s ease;pointer-events:none;';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 2200);
}

let currentModalMovieKey = 'part1';

function playCurrentModalMovie() {
  const targetKey = currentModalMovieKey || 'part1';
  closeMovieDetailsModal(true);
  openNetflixBlackPlayer(targetKey);
}
window.playCurrentModalMovie = playCurrentModalMovie;

function openMovieDetailsModal(movieKey, fromHistory) {
  const modal = document.getElementById('netflixMoreInfoModal');
  if (!modal) return;

  currentModalMovieKey = movieKey || 'part1';

  const data = {
    'part1': {
      title: 'RAMAYANA: PART ONE',
      hero: 'assets/images/hero_banner_hd.jpg',
      year: '2026',
      age: 'U/A 13+',
      dur: '3h 12m',
      desc: "Witness Maryada Purushottam Lord Rama\'s supreme vow to uphold Dharma. From the golden halls of Ayodhya to the divine breaking of Lord Shiva\'s Pinaka bow, and the epic journey through the mystic Dandakaranya forest. Complete 3-hour saga available in full 1080P HEVC."
    },
    'ranabaali': {
      title: 'RANABAALI',
      hero: 'assets/images/ranabaali_landscape.jpg',
      year: '2026',
      age: 'U/A 16+',
      dur: '2h 59m',
      desc: "Set in 19th-century British India, a fierce leader rises from a drought-stricken land to fight colonial oppression and brutal injustice. Starring Vijay Deverakonda, Rashmika Mandanna, directed by Rahul Sankrityan. Streamed in 1080P HEVC via Peachify TMDB 1389379."
    },
    'never-surrender': {
      title: 'NEVER SURRENDER',
      hero: 'assets/images/never_surrender_landscape.jpg?v=20261119_v105_real_nflx',
      poster: 'assets/images/never_surrender_poster.jpg?v=20261119_v105_real_nflx',
      year: '2026',
      age: 'TV-MA 18+',
      dur: '2h 17m',
      desc: "Hari (Lukman Sardi), an aging former special forces veteran living in a remote village, must protect his estranged grandchildren when a ruthless Jakarta crime syndicate storms their home seeking crucial evidence. Forced into survival, Hari unleashes his dormant combat skills to turn the house into an impenetrable fortress. Directed by Sidharta Tata, produced by Kimo Stamboel. Starring Lukman Sardi, Callista Arum, Donny Alamsyah, Derby Romero. Streamed in 4K UHD via Netflix / Peachify.",
      cast: 'Lukman Sardi, Callista Arum, Sulthan Hamonangan, Derby Romero, Donny Alamsyah',
      director: 'Sidharta Tata (Produced by Kimo Stamboel & Edwin Nazir)',
      genres: 'Action, Crime, Thriller, Special Forces'
    },
    'neversurrender': {
      title: 'NEVER SURRENDER',
      hero: 'assets/images/never_surrender_landscape.jpg?v=20261119_v105_real_nflx',
      poster: 'assets/images/never_surrender_poster.jpg?v=20261119_v105_real_nflx',
      year: '2026',
      age: 'TV-MA 18+',
      dur: '2h 17m',
      desc: "Hari (Lukman Sardi), an aging former special forces veteran living in a remote village, must protect his estranged grandchildren when a ruthless Jakarta crime syndicate storms their home seeking crucial evidence. Forced into survival, Hari unleashes his dormant combat skills to turn the house into an impenetrable fortress. Directed by Sidharta Tata, produced by Kimo Stamboel. Starring Lukman Sardi, Callista Arum, Donny Alamsyah, Derby Romero. Streamed in 4K UHD via Netflix / Peachify.",
      cast: 'Lukman Sardi, Callista Arum, Sulthan Hamonangan, Derby Romero, Donny Alamsyah',
      director: 'Sidharta Tata (Produced by Kimo Stamboel & Edwin Nazir)',
      genres: 'Action, Crime, Thriller, Special Forces'
    },
    'akka': {
      title: 'NEVER SURRENDER',
      hero: 'assets/images/never_surrender_landscape.jpg?v=20261119_v105_real_nflx',
      poster: 'assets/images/never_surrender_poster.jpg?v=20261119_v105_real_nflx',
      year: '2026',
      age: 'TV-MA 18+',
      dur: '2h 17m',
      desc: "Hari (Lukman Sardi), an aging former special forces veteran living in a remote village, must protect his estranged grandchildren when a ruthless Jakarta crime syndicate storms their home seeking crucial evidence. Forced into survival, Hari unleashes his dormant combat skills to turn the house into an impenetrable fortress. Directed by Sidharta Tata, produced by Kimo Stamboel. Starring Lukman Sardi, Callista Arum, Donny Alamsyah, Derby Romero. Streamed in 4K UHD via Netflix / Peachify.",
      cast: 'Lukman Sardi, Callista Arum, Sulthan Hamonangan, Derby Romero, Donny Alamsyah',
      director: 'Sidharta Tata (Produced by Kimo Stamboel & Edwin Nazir)',
      genres: 'Action, Crime, Thriller, Special Forces'
    },
    'paradise': {
      title: 'THE PARADISE',
      hero: 'assets/images/the_paradise_landscape.jpg',
      year: '2026',
      age: 'U/A 16+',
      dur: '2h 45m',
      desc: "Set in 1980s Secunderabad, a marginalized group rises to fight against systemic oppression, discrimination, and brutal injustice for their identity and citizenship. Starring Nani, Mohan Babu, Kayadu Lohar, Sonali Kulkarni. Directed by Srikanth Odela. Streamed in 1080P HEVC via Peachify TMDB 1376856."
    },
    'alpha': {
      title: 'ALPHA',
      hero: 'assets/images/alpha_landscape.jpg',
      year: '2026',
      age: 'U/A 16+',
      dur: '2h 38m',
      desc: "Two elite female super-agents unite in the lethal espionage world of the YRF Spy Universe to execute a covert global counter-strike against a ruthless criminal cabal. Starring Alia Bhatt, Sharvari, Bobby Deol, Anil Kapoor. Directed by Shiv Rawail. Streamed in 1080P HEVC via Peachify TMDB 1122030."
    },
    'tereishkmein': {
      title: 'TERE ISHK MEIN',
      hero: 'assets/images/tere_ishk_mein_landscape.jpg',
      year: '2025',
      age: 'U/A 16+',
      dur: '2h 42m',
      desc: "From the world of Raanjhanaa, a fiery, unyielding saga of intense love, rebellion, and sacrifice in Varanasi. Shankar wages an all-consuming battle against destiny and societal divides for an eternal romance. Starring Dhanush, Kriti Sanon. Directed by Aanand L. Rai, music by A.R. Rahman. Streamed in 1080P HEVC via Peachify TMDB 1142921."
    },
    'pushpa2': {
      title: 'PUSHPA 2: THE RULE',
      hero: 'assets/images/pushpa2_landscape.jpg',
      year: '2024',
      age: 'U/A 16+',
      dur: '3h 21m',
      desc: "Pushpa Raj expands his red sandalwood smuggling empire across borders while fiercely defending his reign against SP Bhanwar Singh Shekhawat and rival syndicates in an explosive clash of power and dominance. Starring Allu Arjun, Rashmika Mandanna, Fahadh Faasil. Directed by Sukumar, music by Devi Sri Prasad. Streamed in 1080P HEVC via Peachify TMDB 857598."
    },
    'dorothy': {
      title: 'DOROTHY',
      hero: 'assets/images/dorothy_landscape.jpg',
      year: '2026',
      age: 'U/A 16+',
      dur: '2h 28m',
      desc: "In a rural Tamil Nadu village shaped by traditional norms and toxic masculinity, the unexpected arrival of Dorothy (Keerthy Suresh) — a bold, independent woman — transforms the lives and worldview of two inseparable friends. Directed by Karthik Subbaraj with music by Maestro Ilaiyaraaja. World premiered at TIFF 2026. Streamed in 1080P HEVC via Peachify TMDB 1578079."
    },
    'dogs_christmas': {
      title: "A DOG'S PERFECT CHRISTMAS",
      hero: 'assets/images/dogs_christmas_landscape.jpg',
      year: '2026',
      age: 'U/A 7+',
      dur: '1h 48m',
      desc: "Based on W. Bruce Cameron's bestselling novel, the Goss family faces mounting chaos and hardship when an unexpected crisis strikes during the holidays. Their loyal basset hound Winstead and an energetic corgi puppy Ruby embark on an unforgettable mission to heal the family and bring them home for Christmas Eve. Starring Dennis Quaid, Milo Ventimiglia, Jennifer Tilly, Mary Steenburgen. Streamed in 1080P HEVC via Peachify TMDB 1570488."
    },
    'jurassic_rebirth': {
      title: 'JURASSIC WORLD REBIRTH',
      hero: 'assets/images/jurassic_rebirth_landscape.jpg',
      year: '2025',
      age: 'U/A 13+',
      dur: '2h 14m',
      desc: "Five years after Jurassic World Dominion, covert operations expert Zora Bennett (Scarlett Johansson) leads an elite expedition into isolated equatorial biomes to extract genetic material from the planet's three most colossal surviving prehistoric titans. When their mission crosses paths with a shipwrecked civilian family, they unearth a sinister conspiracy hidden from humanity for decades. Directed by Gareth Edwards, starring Scarlett Johansson, Mahershala Ali, Jonathan Bailey, Rupert Friend. Streamed in 4K / 1080P HEVC via Peachify TMDB 1234821."
    },
    'adipurush': {
      title: 'ADIPURUSH',
      hero: 'assets/images/adipurush_landscape.jpg',
      year: '2023',
      age: 'U/A 13+',
      dur: '2h 59m',
      desc: "7,000 years ago, Ayodhya's righteous Prince Raghava and Prince Sesh, accompanied by the mighty Vanara Sena led by Sugriva and Bajrang, march across the ocean to the golden island citadel of Lanka to rescue Janaki from the clutches of the ten-headed demon king Lankesh. Starring Prabhas, Kriti Sanon, Saif Ali Khan, Sunny Singh, Devdatta Nage. Directed by Om Raut, music by Ajay-Atul and Sachet-Parampara. Streamed in 1080P HEVC via Peachify TMDB 734253."
    },
    'dont_trouble': {
      title: "DON'T TROUBLE THE TROUBLE",
      hero: 'assets/images/dont_trouble_landscape.jpg',
      year: '2026',
      age: 'U/A 7+',
      dur: '2h 36m',
      desc: "Suri (Fahadh Faasil), a down-on-his-luck street magician, accidentally casts an ancient spell that makes an enigmatic young girl vanish. But when she re-emerges as a powerful, wish-granting genie who wanders the nocturnal city streets and unleashes reality-bending magic whenever angered, Suri must navigate high-stakes chaos to protect her and set things right. Directed by Shashank Yeleti, produced by Arka Media Works. Streamed in 1080P HEVC via Peachify TMDB 1261763."
    },
    'maharaj': {
      title: 'MAHARAJ',
      hero: 'assets/images/maharaj_landscape.jpg',
      year: '2024',
      age: 'U/A 16+',
      dur: '2h 12m',
      desc: "Set in pre-independence 1862 Bombay and based on the historic Maharaj Libel Case, fearless reformer and journalist Karsandas Mulji (Junaid Khan) bravely challenges the exploitation of female devotees by the venerated, untouchable religious figure Jadunath Maharaj (Jaideep Ahlawat) in an epic courtroom reckoning. Directed by Siddharth P. Malhotra, starring Junaid Khan, Jaideep Ahlawat, Sharvari, Shalini Pandey. Streamed in 1080P HEVC via Peachify TMDB 1171099."
    },
    'with_love': {
      title: 'WITH LOVE',
      hero: 'assets/images/with_love_landscape.jpg',
      year: '2026',
      age: 'U/A 13+',
      dur: '2h 21m',
      desc: "Sathya reluctantly agrees to a blind date arranged by his sister and meets Monisha. To their astonishment, they discover they attended the same high school years ago. Reminiscing over teenage crushes and nostalgia, their past sparks an endearing modern connection. Starring Abishan Jeevinth, Anaswara Rajan, Harish Kumar. Directed by Madhan. Streamed in 1080P HEVC via Peachify TMDB 1508564."
    },
    'never_surrender': {
      title: 'NEVER SURRENDER',
      hero: 'assets/images/never_surrender_landscape.jpg?v=20261119_v105_real_nflx',
      poster: 'assets/images/never_surrender_poster.jpg?v=20261119_v105_real_nflx',
      year: '2026',
      age: 'U/A 16+',
      dur: '2h 20m',
      desc: "When a ruthless mercenary syndicate descends upon a remote mountain homestead, an estranged veteran with a haunted past and his grandchildren must unite their survival instincts to wage an uncompromising counter-offensive. Starring Lukman Sardi, Callista Arum, Sulthan Hamonangan, Derby Romero, Donny Alamsyah. Directed by Sidharta Tata. Streamed in 1080P HEVC via Peachify TMDB 1616687."
    },
    'made_in_korea': {
      title: 'MADE IN KOREA',
      hero: 'assets/images/made_in_korea_landscape.jpg',
      year: '2026',
      age: 'U/A 13+',
      dur: '1h 53m',
      desc: "An ambitious and spirited young woman from a small town in Tamil Nadu embarks on a life-changing journey to Seoul, South Korea — a land she has passionately dreamed of for years. Navigating language barriers, cultural shocks, and emotional highs, she discovers resilience, unexpected friendship, and belonging in an unfamiliar world. Starring Priyanka Arul Mohan, Rishikanth, Park Hye-jin, Baek Si-hun. Directed by Ra. Karthik. Streamed in 1080P HEVC via Autoembed IMDb tt38674977."
    },
    'peddi': {
      title: 'PEDDI',
      hero: 'assets/images/peddi_landscape.jpg',
      year: '2026',
      age: 'U/A 16+',
      dur: '3h 09m',
      desc: "In an isolated, unmapped rural hinterland that does not officially exist on government records, a fierce laborer's unmatched athletic prowess and wrestling talent become his ultimate weapon. Rising against oppressive exploitation, he wages an uncompromising battle for his community's dignity, identity, and right to be recognized. Starring Mega Power Star Ram Charan as Peddi Pehelwan, Janhvi Kapoor as Achiyyamma, Shiva Rajkumar, Jagapati Babu, Divyendu Sharma, Boman Irani, Ravi Kishan. Directed by Buchi Babu Sana. Music by A. R. Rahman. Streamed in 1080P HEVC via Peachify TMDB 1057265."
    },
    'cocktail2': {
      title: 'COCKTAIL 2',
      hero: 'assets/images/cocktail2_landscape.jpg',
      year: '2026',
      age: 'U/A 16+',
      dur: '2h 30m',
      desc: "A bold, modern romantic dramedy exploring turbulent friendships, love triangles, and emotional vulnerabilities amidst high-stakes metropolitan life. Starring Shahid Kapoor, Kriti Sanon, Rashmika Mandanna. Directed by Homi Adajania, written by Imtiaz Ali. Streamed in 1080P HEVC via Peachify TMDB 1392469."
    },
    'avarachan': {
      title: 'AVARAACHAN & SONS',
      hero: 'assets/images/avarachan_landscape.jpg',
      year: '2026',
      age: 'U/A 13+',
      dur: '2h 30m',
      desc: "A humorous and heartwarming family drama chronicling the quirks, squabbles, and unyielding bonds within a traditional family business in Kerala. Starring Biju Menon, Sreenath Bhasi, Vinay Forrt, Grace Antony. Directed by Thamby. Streamed in 1080P HEVC via Peachify TMDB 1290035."
    },
    'reporting_live': {
      title: 'REPORTING LIVE',
      hero: 'assets/images/reporting_live_landscape.jpg',
      year: '2026',
      age: 'U/A 16+',
      dur: '1h 56m',
      desc: "A gritty investigative crime thriller following an ambitious young reporter and her cynical cameraman whose routine coverage spirals into perilous territory when they uncover an illicit sand-mining cartel governed by dangerous political figures. Starring Parineeti Chopra, Deven Bhojani, Adil Hussain, Shekhar Suman, Amol Palekar, Nassar. Directed by Dhruv Tripathi. Streamed in 1080P HEVC via Peachify TMDB 1389172."
    },
    'heartland': {
      title: 'HEARTLAND',
      hero: 'assets/images/heartland_landscape.jpg',
      year: '2026',
      age: 'U/A 16+',
      dur: '1h 54m',
      desc: "Former country music icon Misty Jones travels back into the intense Nashville music scene determined to unravel the elusive truth behind the sudden and mysterious disappearance of her rising-star niece. Starring Jessica Chastain, Carter Faith, Ross Lynch, John Hawkes, Garrett Hedlund, Norbert Leo Butz. Directed by Shana Feste. Streamed in 1080P HEVC via Peachify TMDB 1543469."
    },
    'one_year_to_live': {
      title: 'ONE YEAR TO LIVE, BUY A MAN',
      hero: 'assets/images/one_year_to_live_landscape.jpg',
      year: '2026',
      age: 'U/A 16+',
      dur: '1h 49m',
      desc: "Given only a single year left to live, an intensely frugal 40-year-old woman decides to spend her hard-earned life savings on hiring a popular nightclub host Sena, sparking a profound emotional transformation that challenges both of their worlds. Starring Ko Shibasaki, Eiji Akaso, Michitaka Tsutsui, Naomi Nishida, Yui Narumi. Directed by Hiroki Kazama. Streamed in 1080P HEVC via Peachify TMDB 1654940."
    },
    'allen': {
      title: 'ALLEN',
      hero: 'assets/images/allen_landscape.jpg',
      year: '2026',
      age: 'U/A 13+',
      dur: '1h 47m',
      desc: "Twenty years following a bizarre childhood encounter with an extra-terrestrial, Petey's routine life is upended when his eccentric alien friend abruptly resurfaces with a wildly unexpected mission. Starring T.J. Power, Charlotte Nicdao, Josh Helman, Emily Barclay, Benedict Hardie, Elijah Tamati. Directed by Daley Pearson and Jeffrey Walker. Streamed in 1080P HEVC via Peachify TMDB 1518204."
    },
    'jolly_llb_3': {
      title: 'JOLLY LLB 3',
      hero: 'assets/images/jolly_llb_3_landscape.jpg',
      year: '2025',
      age: 'U/A 13+',
      dur: '2h 36m',
      desc: "The third part of the Jolly LLB trilogy brings back Jagdish Tyagi and Jagdishwar Mishra for the biggest courtroom showdown as penurious widow Janki Devi Solanki seeks justice against an arrogant industrialist in a sharp satire on the judiciary and social disparity. Starring Akshay Kumar, Arshad Warsi, Saurabh Shukla, Gajraj Rao, Amrita Rao, Huma Qureshi. Directed by Subhash Kapoor. Streamed in 1080P HEVC via Peachify TMDB 1015981."
    },
    'saiyaara': {
      title: 'SAIYAARA',
      hero: 'assets/images/saiyaara_landscape.jpg',
      year: '2025',
      age: 'U/A 13+',
      dur: '2h 30m',
      desc: "Two artistic souls find soulful harmony through musical expression despite their starkly contrasting social backgrounds. As emotional bonds deepen, unexpected circumstances and social expectations test their connection. Starring Ahaan Panday, Aneet Padda, Alam Khan, Rajesh Kumar, Geeta Agrawal Sharma. Directed by Mohit Suri. Streamed in 1080P HEVC via Peachify TMDB 1241634."
    },
    'the_last_house': {
      title: 'THE LAST HOUSE',
      hero: 'assets/images/the_last_house_landscape.jpg',
      year: '2026',
      age: 'U/A 16+',
      dur: '1h 50m',
      desc: "A family suddenly sealed inside their high-tech home must work together to survive against dwindling food, psychological tension, and the ominous menace keeping them trapped. Starring Greta Lee, Wagner Moura, Riley Chung, Noah Alexander Sosnowski, Emma Ho. Directed by Louis Leterrier. Streamed in 1080P HEVC via Peachify TMDB 1284041."
    },
    'brawlers': {
      title: 'BRAWLERS (BAGARRE)',
      hero: 'assets/images/brawlers_landscape.jpg',
      year: '2026',
      age: 'U/A 16+',
      dur: '1h 38m',
      desc: "Naïm is gentle and warm in ordinary life, but possesses beast-like martial fury in combat. Desperate to finance medical care for his aging dog, he joins 'Hello Brawl', a clandestine underground service resolving high-stakes disputes with fists. Starring Nassim Lyes, Anaïde Rozam, Ramzy Bedia, Hedi Bouchenafa, Arriles Amrani. Directed by Julien Royal. Streamed in 1080P HEVC via Peachify TMDB 1418709."
    },
    'dhadak2': {
      title: 'DHADAK 2',
      hero: 'assets/images/dhadak2_landscape.jpg',
      year: '2025',
      age: 'U/A 16+',
      dur: '2h 26m',
      desc: "When Neelesh, an idealistic law student from an oppressed social background, enters an elite academic institution, he is confronted with institutional prejudice and systemic hierarchies. His profound relationship with Vidhi challenges caste divisions in a powerful fight for love and equality. Starring Siddhant Chaturvedi, Triptii Dimri, Saad Bilgrami, Saurabh Sachdeva, Vipin Sharma, Zakir Hussain. Directed by Shazia Iqbal, produced by Dharma Productions. Streamed in 1080P HEVC via CodeSpecters TMDB 1213777."
    },
    'demon_slayer': {
      title: 'DEMON SLAYER: KIMETSU NO YAIBA – INFINITY CASTLE',
      hero: 'assets/images/demon_slayer_landscape.jpg',
      year: '2025',
      age: 'U/A 16+',
      dur: '2h 15m',
      desc: "The Demon Slayer Corps plunges into the terrifying, dimension-warping Infinity Castle to confront Muzan Kibutsuji and the deadly Upper Rank demons in the climactic war of survival. Spectacular animation by ufotable, directed by Haruo Sotozaki, music by Yuki Kajiura and Go Shiina. Streamed in 4K UHD via Peachify TMDB 1311031."
    },
    'hi_papa': {
      title: 'HI PAPA (HI NANNA)',
      hero: 'assets/images/hi_papa_landscape.jpg',
      year: '2023',
      age: 'U/A 13+',
      dur: '2h 35m',
      desc: "A doting single father raising his precocious daughter begins narrating stories of her absent mother, unaware that serendipitous encounters with a compassionate woman are about to unravel buried memories and destiny. Starring Nani, Mrunal Thakur, Baby Kiara Khanna, Jayaram, Priyadarshi Pulikonda. Directed by Shouryuv, music by Hesham Abdul Wahab. Streamed in 4K UHD via Peachify TMDB 1068452."
    },
    'dragon': {
      title: 'DRAGON',
      hero: 'assets/images/dragon_landscape.jpg',
      year: '2025',
      age: 'U/A 16+',
      dur: '2h 32m',
      desc: "A carefree, backbencher college student dubbed 'Dragon' seeks shortcuts to success and wealth, sparking hilarious chaos, unexpected romance, and heartfelt coming-of-age life lessons. Starring Pradeep Ranganathan, Anupama Parameswaran, Kayadu Lohar, Mysskin, Gautham Vasudev Menon. Directed by Ashwath Marimuthu, produced by AGS Entertainment. Streamed in 1080P HEVC via Peachify TMDB 1273049."
    },
    'youth': {
      title: 'YOUTH',
      hero: 'assets/images/youth_landscape.jpg',
      year: '2026',
      age: 'U/A 13+',
      dur: '2h 10m',
      desc: "A fun-filled coming-of-age romantic comedy following 16-year-old carefree schoolboy Praveen and his tight-knit gang as they navigate school life, friendship, teenage romance, and heartfelt life lessons. Written, directed by, and starring Ken Karunas, alongside Anishma Anilkumar, Suraj Venjaramoodu, Devadarshini, Meenakshi Dinesh, Priyanshi Yadav. Music by G. V. Prakash Kumar. Streamed in 1080P HEVC via Peachify TMDB 1542352."
    },
    'chhaava': {
      title: 'CHHAAVA',
      hero: 'assets/images/chhaava_landscape.jpg',
      year: '2025',
      age: 'U/A 16+',
      dur: '2h 41m',
      desc: "An epic historical action saga chronicling the valiant life and fearless battles of Chhatrapati Sambhaji Maharaj, the lion of the Maratha Empire, as he fiercely defends Swarajya against Mughal Emperor Aurangzeb. Starring Vicky Kaushal, Rashmika Mandanna, Akshaye Khanna, Ashutosh Rana, Divya Dutta, Vineet Kumar Singh. Directed by Laxman Utekar, produced by Dinesh Vijan, music by A. R. Rahman. Streamed in 4K UHD via Peachify TMDB 1196943."
    },
    'maa': {
      title: 'MAA',
      hero: 'assets/images/maa_landscape.jpg',
      year: '2025',
      age: 'U/A 16+',
      dur: '2h 13m',
      desc: "In a cursed remote village shadowed by ancient demonic forces, a determined mother unleashes the fierce divine wrath of Goddess Kali to rescue her abducted daughter from a child-devouring entity. Starring Kajol, Ronit Roy, Indraneil Sengupta, Kherin Sharma, Jitin Gulati. Directed by Vishal Furia, produced by Ajay Devgn and Jyoti Deshpande. Streamed in 1080P HEVC via Peachify TMDB 1389158."
    },
    'retro': {
      title: 'RETRO (SURIYA 44)',
      hero: 'assets/images/retro_landscape.jpg',
      year: '2025',
      age: 'U/A 16+',
      dur: '2h 38m',
      desc: "A stylized retro action-gangster romance following a ruthless yet charismatic lone wolf driven by love, laughter, and relentless war. Starring Suriya, Pooja Hegde, Jayaram, Karunakaran, Joju George. Directed by Karthik Subbaraj, music composed by Santhosh Narayanan, produced by 2D Entertainment. Streamed in 4K UHD via Peachify TMDB 1265827."
    },
    'the_odyssey': {
      title: 'THE ODYSSEY',
      hero: 'assets/images/the_odyssey_landscape.jpg',
      year: '2026',
      age: 'U/A 16+',
      dur: '3h 10m',
      desc: "Christopher Nolan's monumental cinematic vision of Homer's ancient Greek mythological epic. Odysseus, King of Ithaca, embarks on a treacherous, decade-long voyage home across perilous seas following the fall of Troy, confronting mythical beasts, seductive enchantresses, and the wrath of Poseidon. Produced by Universal Pictures and Syncopy. Streamed in 4K UHD via Peachify TMDB 1368337."
    },
    'goat': {
      title: 'GOAT (2026)',
      hero: 'assets/images/goat_landscape.jpg',
      year: '2026',
      age: 'U/A 7+',
      dur: '1h 45m',
      desc: "A groundbreaking animated sports adventure comedy produced by Sony Pictures Animation and Stephen Curry's Unanimous Media. A small, underdog kid with oversized hoop dreams overcomes massive odds to rise through the ranks of streetball and prove greatness comes from heart and grit. Directed by Tyree Dillihay. Streamed in 4K UHD via Peachify TMDB 1297842."
    },
    'scary_movie_6': {
      title: 'SCARY MOVIE 6',
      hero: 'assets/images/scary_movie_6_landscape.jpg',
      year: '2026',
      age: 'A 18+',
      dur: '1h 36m',
      desc: "The legendary Wayans Brothers (Marlon, Shawn, and Keenen Ivory Wayans) reunite alongside franchise icons Anna Faris (Cindy Campbell) and Regina Hall (Brenda Meeks) to resurrect the premier horror parody franchise. Skewering modern horror sensations (M3GAN, Smile, Longlegs, Talk to Me, Hereditary), Scary Movie 6 unleashes side-splitting, unfiltered slapstick mayhem. Produced by Miramax. Streamed in 1080P HEVC via Peachify TMDB 1273221."
    },
    'coolie': {
      title: 'COOLIE',
      hero: 'assets/images/coolie_landscape.jpg',
      year: '2025',
      age: 'U/A 16+',
      dur: '2h 50m',
      desc: "Superstar Rajinikanth stars as Deva, a legendary harbor kingpin and gold smuggler in an adrenaline-charged action crime thriller set against Chennai's port underworld. Directed by Lokesh Kanagaraj, featuring an ensemble cast including Nagarjuna, Soubin Shahir, Shruti Haasan, Sathyaraj, and Upendra, with explosive musical score by Anirudh Ravichander. Produced by Sun Pictures. Streamed in 4K UHD via Peachify TMDB 1153399."
    },
    'dhurandhar': {
      title: 'DHURANDHAR',
      hero: 'assets/images/dhurandhar_landscape.jpg',
      year: '2025',
      age: 'U/A 16+',
      dur: '2h 45m',
      desc: "National Award-winning director Aditya Dhar (Uri: The Surgical Strike) helms a high-octane geopolitical spy action saga based on real covert espionage missions conducted by Indian intelligence. Starring Ranveer Singh as a daring undercover operative, alongside Sanjay Dutt, R. Madhavan, Akshaye Khanna, and Arjun Rampal. Produced by Jio Studios and B62 Studios. Streamed in 4K UHD via Peachify TMDB 1291608."
    },
    'jailer_2': {
      title: 'JAILER 2 (HUKUM)',
      hero: 'assets/images/jailer_2_landscape.jpg',
      year: '2026',
      age: 'U/A 16+',
      dur: '2h 55m',
      desc: "Tiger Muthuvel Pandian (Superstar Rajinikanth) returns in Nelson Dilipkumar's high-octane sequel to the global blockbuster Jailer. Forced out of retirement when an international syndicate targets his family and alliances, the lethal retired jailer unleashes his trademark calm ruthlessness to dismantle criminal syndicates across borders. Music by Anirudh Ravichander, produced by Sun Pictures. Streamed in 4K UHD via Peachify TMDB 1234139."
    },
    'disclosure_day': {
      title: 'DISCLOSURE DAY',
      hero: 'assets/images/disclosure_day_landscape.jpg',
      year: '2026',
      age: 'U/A 16+',
      dur: '2h 35m',
      desc: "A gripping science-fiction thriller directed by Steven Spielberg and written by David Koepp. When undeniable proof of extraterrestrial existence surfaces, a resilient television meteorologist and an intrepid cybersecurity analyst brave a deadly government pursuit to disclose the epochal truth to seven billion people. Starring Emily Blunt, Josh O'Connor, Colin Firth, Eve Hewson, Colman Domingo. Universal Pictures & Amblin. Streamed in 4K UHD via Peachify TMDB 1275779."
    },
    'wuthering_heights': {
      title: 'WUTHERING HEIGHTS',
      hero: 'assets/images/wuthering_heights_landscape.jpg',
      year: '2026',
      age: 'U/A 16+',
      dur: '2h 25m',
      desc: "Academy Award winner Emerald Fennell directs a visceral, intoxicating reimagining of Emily Brontë's immortal gothic romance on the wind-swept Yorkshire moors. Catherine Earnshaw and Heathcliff's obsessive, all-consuming passion defies social hierarchy, vengeance, and mortality itself. Starring Margot Robbie and Jacob Elordi. Produced by LuckyChap Entertainment and Warner Bros. Pictures. Streamed in 4K UHD via Peachify TMDB 1316092."
    },
    'hoppers': {
      title: 'HOPPERS (2026)',
      hero: 'assets/images/hoppers_landscape.jpg',
      year: '2026',
      age: 'U/A 7+',
      dur: '1h 42m',
      desc: "A witty, heartwarming sci-fi comedy adventure from Disney and Pixar Animation Studios. An animal-loving college student Mabel utilizes revolutionary neuro-link science to hop her consciousness into an ultra-realistic robotic beaver. Infiltrating the wilderness, she befriends charismatic woodland creatures to protect their forest realm from ruthless urban expansion. Directed by Daniel Chong. Voices by Piper Curda, Bobby Moynihan, Jon Hamm. Streamed in 4K UHD via Peachify TMDB 1327819."
    },
    'michael': {
      title: 'MICHAEL (THE KING OF POP)',
      hero: 'assets/images/michael_landscape.jpg',
      year: '2026',
      age: 'U/A 16+',
      dur: '2h 50m',
      desc: "The monumental biographical musical drama directed by Antoine Fuqua and produced by Graham King (Bohemian Rhapsody). Chronicling the triumphant yet turbulent life and enduring legacy of global music icon Michael Jackson, from child prodigy in the Jackson 5 to the undisputed King of Pop. Starring nephew Jaafar Jackson in an electric tour-de-force performance alongside Colman Domingo, Nia Long, Miles Teller. Lionsgate & Universal Pictures. Streamed in 4K UHD via Peachify TMDB 936075."
    },
    'mario_galaxy': {
      title: 'THE SUPER MARIO GALAXY MOVIE',
      hero: 'assets/images/mario_galaxy_landscape.jpg',
      year: '2026',
      age: 'U/A 7+',
      dur: '1h 40m',
      desc: "Nintendo and Illumination reunite for the spectacular galactic sequel to the billion-dollar blockbuster. Mario, Luigi, Princess Peach, and Toad launch into deep cosmos to protect Rosalina's Comet Observatory and rescue celestial Lumas from Bowser's cosmic conquest. Directed by Aaron Horvath and Michael Jelenic. Starring Chris Pratt, Charlie Day, Anya Taylor-Joy, Jack Black, Keegan-Michael Key. Streamed in 4K UHD via Peachify TMDB 1226863."
    },
    'minions_monsters': {
      title: 'MINIONS & MONSTERS',
      hero: 'assets/images/minions_monsters_landscape.jpg',
      year: '2026',
      age: 'U/A 7+',
      dur: '1h 35m',
      desc: "In 1920s Hollywood's golden age, Kevin, Stuart, and Bob set out to produce their own classic creature feature. Armed with hilarious makeshift special effects and slapstick chaos, the mischievous yellow henchmen accidentally awaken genuine mythical monsters across the movie backlot. Directed by Pierre Coffin. Produced by Chris Meledandri and Illumination. Streamed in 4K UHD via Peachify TMDB 1315772."
    },
    'mortal_kombat_2': {
      title: 'MORTAL KOMBAT II',
      hero: 'assets/images/mortal_kombat_2_landscape.jpg',
      year: '2026',
      age: 'A 18+',
      dur: '2h 05m',
      desc: "The ultimate martial arts tournament erupts as Earthrealm's champions stand on the precipice of obliteration against the menacing warlord Shao Kahn and Outworld forces. Cole Young, Sonya Blade, and Jax recruit arrogant action icon Johnny Cage to unleash his martial prowess alongside legendary rival warriors Scorpion and Sub-Zero. Directed by Simon McQuoid. Starring Karl Urban, Hiroyuki Sanada, Joe Taslim, Jessica McNamee, Lewis Tan. New Line Cinema & Warner Bros. Streamed in 4K UHD via Peachify TMDB 931285."
    },
    'kartavya': {
      title: 'KARTAVYA',
      hero: 'assets/images/kartavya_landscape.jpg',
      year: '2026',
      age: 'U/A 16+',
      dur: '1h 49m',
      desc: "Local police officer Inspector Pawan Malik (Saif Ali Khan) is assigned to guard a fearless investigative journalist exposing a high-profile corruption racket tied to an influential spiritual cult. When the journalist is assassinated on his watch, Pawan must risk everything against political pressure and family threats to fulfill his sworn duty. Produced by Gauri Khan (Red Chillies Entertainment), directed by Pulkit. Starring Saif Ali Khan, Rasika Dugal, Sanjay Mishra. Streamed in 4K UHD via Peachify TMDB 1628367.",
      cast: 'Saif Ali Khan, Rasika Dugal, Sanjay Mishra, Zakir Hussain',
      director: 'Pulkit (Red Chillies Entertainment)',
      music: 'Shankar-Ehsaan-Loy',
      genres: 'Crime, Police Procedural, Drama, Thriller'
    },
    'gandhari': {
      title: 'GANDHARI',
      hero: 'assets/images/gandhari_landscape.jpg',
      year: '2026',
      age: 'A 18+',
      dur: '2h 10m',
      desc: "When her young daughter is abducted from a crowded railway platform, mother Bani (Taapsee Pannu) is left temporarily blinded in the assault. Channeling the fierce mythical spirit of Gandhari, she transforms into an unstoppable lethal force of maternal vengeance to crush an interstate child trafficking syndicate and reclaim her child. Written & produced by Kanika Dhillon, directed by Devashish Makhija. Starring Taapsee Pannu, Ishwak Singh, Swastika Mukherjee. Streamed in 4K UHD via Peachify TMDB 1355228.",
      cast: 'Taapsee Pannu, Ishwak Singh, Swastika Mukherjee, Chhaya Kadam',
      director: 'Devashish Makhija (Written by Kanika Dhillon)',
      music: 'Amit Trivedi',
      genres: 'Action, Maternal Revenge Thriller'
    },
    'toaster': {
      title: 'TOASTER',
      hero: 'assets/images/toaster_landscape.jpg',
      year: '2026',
      age: 'U/A 16+',
      dur: '1h 55m',
      desc: "A hilarious and dark comic thriller following Ramakant (Rajkummar Rao), a hilariously stingy man who goes to absurdly extreme lengths to retrieve a luxury toaster he gifted after a wedding is suddenly called off. His relentless obsession inadvertently lands him straight into a chaotic web of murder, extortion, and absurd criminal mayhem. Produced by Patralekhaa & Rajkummar Rao, directed by Vivek Das Chaudhary. Starring Rajkummar Rao, Sanya Malhotra, Abhishek Banerjee, Farah Khan. Streamed in 4K UHD via Peachify TMDB 1416391.",
      cast: 'Rajkummar Rao, Sanya Malhotra, Abhishek Banerjee, Farah Khan',
      director: 'Vivek Das Chaudhary (Produced by Patralekhaa)',
      music: 'Sachin-Jigar',
      genres: 'Dark Comedy, Crime, Mystery'
    },
    'shiva': {
      title: 'SHIVA DHANUSH: THE SACRED PINAKA',
      hero: 'assets/images/feature_banner_hd.jpg',
      year: '2026',
      age: 'U/A 13+',
      dur: 'Chapter 2',
      desc: "In the grand court of King Janaka at Mithila, mighty warriors fail to lift the celestial bow of Lord Shiva. Prince Rama effortlessly strings Pinaka, breaking it into two halves to fulfill the sacred prophecy."
    },
    'exile': {
      title: 'THE FOREST EXILE & PANCHAVATI',
      hero: 'assets/images/movie_cover_hd.jpg',
      year: '2026',
      age: 'U/A 13+',
      dur: 'Chapter 3',
      desc: "Lord Rama, Mata Sita, and Lakshmana begin their sacred 14-year exile in the mystical forests of Dandakaranya, establishing peace among hermits and confronting primeval demonic forces."
    }
,
    'spiderman_brand_new_day': {
      title: 'SPIDER-MAN: BRAND NEW DAY',
      hero: 'assets/images/spiderman_brand_new_day_landscape.jpg?v=20261119_v102_no_server_bar',
      year: '2026',
      age: 'PG-13',
      dur: 'Summer 2026',
      desc: 'Peter Parker begins a brand-new chapter navigating life after the worldwide memory wipe erased his civilian identity. As street-level crime escalates across New York City and formidable new adversaries emerge from the shadows, Spider-Man must forge unexpected alliances and discover what it truly costs to be a standalone hero. TMDB ID 969681.'
    },
    'clayface': {
      title: 'CLAYFACE',
      hero: 'assets/images/clayface_landscape.jpg?v=20261119_v102_no_server_bar',
      year: '2026',
      age: 'R',
      dur: 'Fall 2026',
      desc: 'A body-horror psychological noir exploring the tragic descent of Basil Karlo, a once-revered B-movie actor whose desperate quest for vanity and youth leads him to an experimental chemical treatment. Mutating into a monstrous, shape-shifting entity consumed by identity dysphoria, he wages a horrifying war against Gotham City\'s elite. TMDB ID 1400940.'
    },
    'resident_evil_2026': {
      title: 'RESIDENT EVIL',
      hero: 'assets/images/resident_evil_2026_landscape.jpg?v=20261119_v102_no_server_bar',
      year: '2026',
      age: 'R',
      dur: 'Fall 2026',
      desc: 'A terrifying cinematic reboot returning to the claustrophobic survival-horror roots of Capcom\'s iconic franchise. Trapped deep inside the infected bio-weapons research complex of the Arklay Mountains, a specialized tactical team faces grotesque viral mutations and Umbrella Corporation\'s catastrophic bio-hazard cover-up. TMDB ID 1423191.'
    },
    'street_fighter': {
      title: 'STREET FIGHTER',
      hero: 'assets/images/street_fighter_landscape.jpg?v=20261119_v102_no_server_bar',
      year: '2026',
      age: 'PG-13',
      dur: 'March 2026',
      desc: 'Legendary martial artists from across the globe converge to battle in the shadowy World Warrior Tournament orchestrated by M. Bison\'s Shadaloo syndicate. Ryu and Ken Masters must master the ancient power of Ansatsuken and overcome dark Hadou energy to prevent worldwide devastation. TMDB ID 1153576.'
    },
    'toy_story_5': {
      title: 'TOY STORY 5',
      hero: 'assets/images/toy_story_5_landscape.jpg?v=20261119_v102_no_server_bar',
      year: '2026',
      age: 'G',
      dur: 'June 2026',
      desc: 'Woody, Buzz Lightyear, and the beloved toy crew face their ultimate 21st-century existential challenge: competing for children\'s devotion against modern digital screens, tablets, and interactive electronics. Together, they embark on a hilarious, heartwarming quest to prove the enduring magic of imagination and playtime. TMDB ID 1084244.'
    },
    'supergirl_woman_of_tomorrow': {
      title: 'SUPERGIRL: WOMAN OF TOMORROW',
      hero: 'assets/images/supergirl_woman_of_tomorrow_landscape.jpg?v=20261119_v102_no_server_bar',
      year: '2026',
      age: 'PG-13',
      dur: 'June 2026',
      desc: 'Unlike her cousin Superman who was raised on Earth by loving parents, Kara Zor-El grew up on a chipped-off rock of Krypton, witnessing everyone around her die tragically. Hardened and accompanied by Krypto the Superdog, she embarks on an epic, interstellar revenge quest across the cosmos with an alien girl named Ruthye. TMDB ID 1081003.'
    },
    'mandalorian_and_grogu': {
      title: 'STAR WARS: THE MANDALORIAN AND GROGU',
      hero: 'assets/images/mandalorian_and_grogu_landscape.jpg?v=20261119_v102_no_server_bar',
      year: '2026',
      age: 'PG-13',
      dur: 'May 2026',
      desc: 'The legendary Mandalorian bounty hunter Din Djarin and his Force-sensitive apprentice Grogu transition to the grand theatrical big screen. Partnering with the fledgling New Republic, they hunt Imperial remnants scheming in the dark corners of the outer rim galaxy to protect the fragile peace. TMDB ID 1228710.'
    },
    'godzilla_minus_zero': {
      title: 'GODZILLA MINUS ZERO',
      hero: 'assets/images/godzilla_minus_zero_landscape.jpg?v=20261119_v102_no_server_bar',
      year: '2026',
      age: 'PG-13',
      dur: 'November 2026',
      desc: 'Following the Academy Award-winning global triumph of Godzilla Minus One, visionary director Takashi Yamazaki returns with the next colossal chapter in the Toho kaiju saga. As postwar Japan strives to rebuild, a terrifying atomic terror re-emerges from the oceanic abyss with catastrophic destructive fury. TMDB ID 1381071.'
    },
    'project_hail_mary': {
      title: 'PROJECT HAIL MARY',
      hero: 'assets/images/project_hail_mary_landscape.jpg?v=20261119_v102_no_server_bar',
      year: '2026',
      age: 'PG-13',
      dur: 'March 2026',
      desc: 'Ryland Grace, a middle-school science teacher turned lone survivor of an interstellar desperate mission, awakens from a coma with amnesia light-years from Earth. As our sun dies from an alien microbe, Grace must combine scientific deduction and an extraordinary interspecies friendship with an alien named Rocky to save humanity. TMDB ID 687163.'
    }
  };

  const item = data[movieKey] || data['part1'];
  const titleEl = document.getElementById('nModalTitle');
  const heroImg = document.getElementById('nModalHeroImg');
  const yearEl = document.getElementById('nModalYear');
  const ageEl = document.getElementById('nModalAge');
  const durEl = document.getElementById('nModalDur');
  const descEl = document.getElementById('nModalDesc');

  if (titleEl) titleEl.textContent = item.title;
  if (heroImg) heroImg.src = item.hero;
  if (yearEl) yearEl.textContent = item.year;
  if (ageEl) ageEl.textContent = item.age;
  if (durEl) durEl.textContent = item.dur;
  if (descEl) descEl.textContent = item.desc;

  const castEl = document.getElementById('nModalCast');
  const dirEl = document.getElementById('nModalDirector');
  const musicEl = document.getElementById('nModalMusic');
  const genEl = document.getElementById('nModalGenres');

  if (castEl) castEl.textContent = item.cast || (item.title === 'RAMAYANA: PART ONE' ? 'Ranbir Kapoor, Sai Pallavi, Yash, Sunny Deol' : 'Ensemble Cast');
  if (dirEl) dirEl.textContent = item.director || (item.title === 'RAMAYANA: PART ONE' ? 'Nitesh Tiwari' : 'Acclaimed Director');
  if (musicEl) musicEl.textContent = item.music || (item.title === 'RAMAYANA: PART ONE' ? 'Hans Zimmer & A. R. Rahman' : 'Original Motion Picture Score');
  if (genEl) genEl.textContent = item.genres || (item.title === 'RAMAYANA: PART ONE' ? 'Mythology, Action & Adventure, Period Drama' : 'Cinema, Drama');

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  if (!fromHistory) {
    const curPage = getCurrentActivePage();
    pushAppState({ type: 'movie-details', movieKey: movieKey, prevPage: curPage }, '#movie-info');
  }
}

function closeMovieDetailsModal(fromHistory) {
  if (!fromHistory && window.history && window.history.state && window.history.state.type === 'movie-details') {
    window.history.back();
    return;
  }

  const modal = document.getElementById('netflixMoreInfoModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  const blackModal = document.getElementById('netflixBlackPlayerModal');
  if (!blackModal || !blackModal.classList.contains('active')) {
    document.body.style.overflow = '';
  }

  if (!fromHistory && window.location.hash === '#movie-info') {
    const prevPage = (window.history.state && window.history.state.prevPage) || getCurrentActivePage();
    replaceAppState({ type: 'page', page: prevPage }, '#' + prevPage);
  }
}

window.initHomeBillboard = initHomeBillboard;
window.toggleBillboardAudio = toggleBillboardAudio;

// ============================================================================
// MOVIES PAGE BILLBOARD (Identical to Home Billboard)
// ============================================================================
let isMoviesBillboardAudioEnabled = false;

function initMoviesBillboard() {
  const billboard = document.getElementById('moviesHeroBillboard');
  const video = document.getElementById('moviesBillboardVideo');
  const videoWrap = document.getElementById('moviesBillboardVideoWrap');

  if (!billboard || !video || !videoWrap) return;

  function playMoviesBillboardPreview() {
    video.muted = !isMoviesBillboardAudioEnabled;
    video.volume = 1.0;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        videoWrap.classList.add('playing');
      }).catch(err => {
        console.log('Movies billboard preview waiting for interaction:', err);
      });
    }
  }

  function pauseMoviesBillboardPreview() {
    videoWrap.classList.remove('playing');
    if (!video.paused) {
      video.pause();
    }
  }

  billboard.addEventListener('mouseenter', () => {
    playMoviesBillboardPreview();
  });

  billboard.addEventListener('mouseleave', () => {
    pauseMoviesBillboardPreview();
  });
}
window.initMoviesBillboard = initMoviesBillboard;

function toggleMoviesBillboardAudio(event) {
  if (event) event.stopPropagation();
  const video = document.getElementById('moviesBillboardVideo');
  const muteIcon = document.getElementById('moviesBBAudioMute');
  const unmuteIcon = document.getElementById('moviesBBAudioUnmute');
  const videoWrap = document.getElementById('moviesBillboardVideoWrap');

  if (!video) return;

  isMoviesBillboardAudioEnabled = !isMoviesBillboardAudioEnabled;
  video.muted = !isMoviesBillboardAudioEnabled;
  video.volume = 1.0;

  if (video.paused) {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        if (videoWrap) videoWrap.classList.add('playing');
      }).catch(err => console.log('Movies billboard play error:', err));
    }
  } else {
    if (videoWrap) videoWrap.classList.add('playing');
  }

  if (video.muted) {
    if (muteIcon) muteIcon.style.display = 'block';
    if (unmuteIcon) unmuteIcon.style.display = 'none';
  } else {
    if (muteIcon) muteIcon.style.display = 'none';
    if (unmuteIcon) unmuteIcon.style.display = 'block';
  }
}
window.toggleMoviesBillboardAudio = toggleMoviesBillboardAudio;

window.scrollNetflixRow = scrollNetflixRow;
window.toggleMyList = toggleMyList;
window.openMovieDetailsModal = openMovieDetailsModal;
window.closeMovieDetailsModal = closeMovieDetailsModal;

// Auto-initialize on load
function initAllBillboards() {
  initHomeBillboard();
  initMoviesBillboard();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllBillboards);
} else {
  initAllBillboards();
}

// ============================================================================
// GLOBAL POPSTATE & DEVICE/HARDWARE BACK BUTTON NAVIGATION ENGINE
// Supports mobile phones (Android, iOS), tablets (iPad, Galaxy Tab) & desktop
// ============================================================================

window.addEventListener('popstate', function (event) {
  const state = event.state;

  // 1. Netflix Black Player Modal has highest priority
  const playerModal = document.getElementById('netflixBlackPlayerModal');
  if (playerModal && playerModal.classList.contains('active')) {
    closeNetflixBlackPlayer(true);
    return;
  }

  // 2. Movie Details / More Info Modal
  const movieDetailsModal = document.getElementById('netflixMoreInfoModal');
  if (movieDetailsModal && movieDetailsModal.classList.contains('active')) {
    closeMovieDetailsModal(true);
    return;
  }

  // 3. Coming Soon Trilogy Modal
  const comingSoonModal = document.getElementById('comingSoonModal');
  if (comingSoonModal && comingSoonModal.classList.contains('active')) {
    closeComingSoonModal(true);
    return;
  }

  // 4. Sandify Tracks Sub-page
  const sandifySubpage = document.getElementById('sandifySubpageView');
  if (sandifySubpage && sandifySubpage.style.display !== 'none') {
    if (!state || state.type !== 'sandify-subpage') {
      closeSandifySubpage(true);
      return;
    }
  }

  // 5. If state specifically says open a modal or subpage (Forward navigation or direct pop)
  if (state) {
    if (state.type === 'sandify-subpage') {
      switchPage('gallery', true);
      openSandifySubpage(state.albumKey || 'divine-symphony', true);
      return;
    }
    if (state.type === 'netflix-player') {
      openNetflixBlackPlayer(state.targetTime || 'act1', true);
      return;
    }
    if (state.type === 'movie-details') {
      openMovieDetailsModal(state.movieKey || 'part1', true);
      return;
    }
    if (state.type === 'coming-soon') {
      openComingSoonModal(state.partNum || 2, true);
      return;
    }
    if (state.type === 'page' && state.page) {
      switchPage(state.page, true);
      return;
    }
  }

  // 6. Fallback based on URL hash
  const hash = (window.location.hash || '').replace('#', '');
  if (hash === 'movies' || hash === 'gallery' || hash === 'home') {
    switchPage(hash, true);
  } else if (hash === 'sandify-tracks') {
    switchPage('gallery', true);
    openSandifySubpage('divine-symphony', true);
  } else {
    switchPage('home', true);
  }
});

// Initialize base state on load if not present
function initHistoryBaseState() {
  const hash = (window.location.hash || '').replace('#', '');
  if (!window.history.state) {
    if (hash === 'sandify-tracks') {
      replaceAppState({ type: 'page', page: 'gallery' }, '#gallery');
      pushAppState({ type: 'sandify-subpage', page: 'gallery', albumKey: 'divine-symphony' }, '#sandify-tracks');
    } else if (hash === 'movies' || hash === 'gallery') {
      replaceAppState({ type: 'page', page: hash }, '#' + hash);
    } else {
      replaceAppState({ type: 'page', page: 'home' }, '#home');
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initHistoryBaseState();
    initNetflixCarouselAutoLoop();
  });
} else {
  initHistoryBaseState();
  initNetflixCarouselAutoLoop();
}

// =========================================================================
// AUTHENTIC NETFLIX HOVER EXPANSION (0.5-SECOND INTENTIONAL DWELL DELAY)
// Hovering a movie card waits exactly 0.5 seconds (500ms) before expanding.
// Moving cursor away before 0.5s cancels expansion immediately.
// When moving away after expansion, the card smoothly collapses.
// =========================================================================
(function initNetflixHover05sDelay() {
  let hoverTimer = null;
  let activeExpandedCard = null;
  const HOVER_DELAY_MS = 500; // Exact 0.5-second (500ms) gap requested by user

  function updateTransformOrigin(card) {
    if (!card) return;
    try {
      const rect = card.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      if (rect.left < 140) {
        card.style.transformOrigin = 'left center';
      } else if (windowWidth - rect.right < 140) {
        card.style.transformOrigin = 'right center';
      } else {
        card.style.transformOrigin = 'center center';
      }
    } catch (e) {}
  }

  document.addEventListener('mouseover', function(e) {
    const card = e.target.closest && e.target.closest('.n-card.compact, .n-card.official-master-card');
    if (!card) return;

    // If mouse is already within the expanded card, keep it active
    if (activeExpandedCard === card) return;

    // Set origin early so any transition uses the correct focal point
    updateTransformOrigin(card);

    // If moving between different cards, cancel pending timer for previous card
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      hoverTimer = null;
    }

    // Collapse any previously expanded card when moving onto a new one
    if (activeExpandedCard && activeExpandedCard !== card) {
      activeExpandedCard.classList.remove('is-hovered');
      activeExpandedCard = null;
    }

    // Start 3-second intentional hover countdown
    hoverTimer = setTimeout(function() {
      // Confirm the cursor is still hovering this card after 3 seconds
      if (card.matches(':hover')) {
        updateTransformOrigin(card);
        card.classList.add('is-hovered');
        activeExpandedCard = card;
      }
    }, HOVER_DELAY_MS);
  });

  document.addEventListener('mouseout', function(e) {
    const card = e.target.closest && e.target.closest('.n-card.compact, .n-card.official-master-card');
    if (!card) return;

    // If moving into a child element of the same card (buttons, overlay, tags), stay expanded
    if (e.relatedTarget && card.contains(e.relatedTarget)) {
      return;
    }

    // Cursor exited card boundary: cancel pending 3s timer
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      hoverTimer = null;
    }

    // If card was expanded, collapse it back to normal immediately
    if (card.classList.contains('is-hovered')) {
      card.classList.remove('is-hovered');
    }
    if (activeExpandedCard === card) {
      activeExpandedCard = null;
    }
  });

  // Cancel pending timers when user scrolls so cards don't pop open while scrolling
  window.addEventListener('scroll', function() {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      hoverTimer = null;
    }
  }, { passive: true });
})();




/* =========================================================================
   OFFICIAL NETFLIX REAL-TIME SEARCH ENGINE (DESKTOP & MOBILE)
   ========================================================================= */

const sandflixCatalog = [
  {
    "key": "part1",
    "title": "RAMAYANA: PART ONE",
    "year": "2026",
    "age": "U/A 13+",
    "dur": "3h 12m",
    "desc": "Witness Maryada Purushottam Lord Rama\\",
    "hero": "assets/images/feature_banner_hd.jpg",
    "poster": "assets/images/hero_banner_hd.jpg",
    "genres": [
      "Cinema",
      "Drama"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  },
  {
    "key": "ranabaali",
    "title": "RANABAALI",
    "year": "2026",
    "age": "U/A 16+",
    "dur": "2h 59m",
    "desc": "Set in 19th-century British India, a fierce leader rises from a drought-stricken land to fight colonial oppression and brutal injustice. Starring Vijay Deverakonda, Rashmika Mandanna, directed by Rahul Sankrityan. Streamed in 1080P HEVC via Peachify TMDB 1389379.",
    "hero": "assets/images/ranabaali_landscape.jpg",
    "poster": "assets/images/ranabaali_poster.jpg",
    "genres": [
      "Action"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  },
  {
    "key": "never-surrender",
    "title": "Never Surrender",
    "year": "2026",
    "age": "TV-MA",
    "dur": "2h 17m",
    "desc": "Hari (Lukman Sardi), an aging former special forces veteran living in a remote village, must protect his estranged grandchildren when a ruthless Jakarta crime syndicate storms their home seeking crucial evidence. Forced into survival, Hari unleashes his dormant combat skills to turn the house into an impenetrable fortress. Directed by Sidharta Tata, produced by Kimo Stamboel. Starring Lukman Sardi, Callista Arum, Donny Alamsyah, Derby Romero.",
    "hero": "assets/images/never_surrender_landscape.jpg?v=20261119_v105_real_nflx",
    "poster": "assets/images/never_surrender_poster.jpg?v=20261119_v105_real_nflx",
    "genres": [
      "Action",
      "Crime",
      "Thriller"
    ],
    "industry": "Hollywood",
    "quality": "4K UHD"
  },
  {
    "key": "paradise",
    "title": "THE PARADISE",
    "year": "2026",
    "age": "U/A 16+",
    "dur": "2h 45m",
    "desc": "Set in 1980s Secunderabad, a marginalized group rises to fight against systemic oppression, discrimination, and brutal injustice for their identity and citizenship. Starring Nani, Mohan Babu, Kayadu Lohar, Sonali Kulkarni. Directed by Srikanth Odela. Streamed in 1080P HEVC via Peachify TMDB 1376856.",
    "hero": "assets/images/the_paradise_landscape.jpg",
    "poster": "assets/images/the_paradise_poster.jpg",
    "genres": [
      "Action"
    ],
    "industry": "South Indian",
    "quality": "4K UHD"
  },
  {
    "key": "alpha",
    "title": "ALPHA",
    "year": "2026",
    "age": "U/A 16+",
    "dur": "2h 38m",
    "desc": "Two elite female super-agents unite in the lethal espionage world of the YRF Spy Universe to execute a covert global counter-strike against a ruthless criminal cabal. Starring Alia Bhatt, Sharvari, Bobby Deol, Anil Kapoor. Directed by Shiv Rawail. Streamed in 1080P HEVC via Peachify TMDB 1122030.",
    "hero": "assets/images/alpha_landscape.jpg",
    "poster": "assets/images/alpha_poster.jpg",
    "genres": [
      "Thriller"
    ],
    "industry": "Bollywood",
    "quality": "4K UHD"
  },
  {
    "key": "tereishkmein",
    "title": "TERE ISHK MEIN",
    "year": "2025",
    "age": "U/A 16+",
    "dur": "2h 42m",
    "desc": "From the world of Raanjhanaa, a fiery, unyielding saga of intense love, rebellion, and sacrifice in Varanasi. Shankar wages an all-consuming battle against destiny and societal divides for an eternal romance. Starring Dhanush, Kriti Sanon. Directed by Aanand L. Rai, music by A.R. Rahman. Streamed in 1080P HEVC via Peachify TMDB 1142921.",
    "hero": "assets/images/tere_ishk_mein_landscape.jpg",
    "poster": "assets/images/tere_ishk_mein_poster.jpg",
    "genres": [
      "Romance",
      "Musical"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  },
  {
    "key": "pushpa2",
    "title": "PUSHPA 2: THE RULE",
    "year": "2024",
    "age": "U/A 16+",
    "dur": "3h 21m",
    "desc": "Pushpa Raj expands his red sandalwood smuggling empire across borders while fiercely defending his reign against SP Bhanwar Singh Shekhawat and rival syndicates in an explosive clash of power and dominance. Starring Allu Arjun, Rashmika Mandanna, Fahadh Faasil. Directed by Sukumar, music by Devi Sri Prasad. Streamed in 1080P HEVC via Peachify TMDB 857598.",
    "hero": "assets/images/pushpa2_landscape.jpg",
    "poster": "assets/images/pushpa2_poster.jpg",
    "genres": [
      "Action",
      "Musical"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  },
  {
    "key": "dorothy",
    "title": "DOROTHY",
    "year": "2026",
    "age": "U/A 16+",
    "dur": "2h 28m",
    "desc": "In a rural Tamil Nadu village shaped by traditional norms and toxic masculinity, the unexpected arrival of Dorothy (Keerthy Suresh) \u2014 a bold, independent woman \u2014 transforms the lives and worldview of two inseparable friends. Directed by Karthik Subbaraj with music by Maestro Ilaiyaraaja. World premiered at TIFF 2026. Streamed in 1080P HEVC via Peachify TMDB 1578079.",
    "hero": "assets/images/dorothy_landscape.jpg",
    "poster": "assets/images/dorothy_poster.jpg",
    "genres": [
      "Musical"
    ],
    "industry": "South Indian",
    "quality": "4K UHD"
  },
  {
    "key": "jurassic_rebirth",
    "title": "JURASSIC WORLD REBIRTH",
    "year": "2025",
    "age": "U/A 13+",
    "dur": "2h 14m",
    "desc": "Five years after Jurassic World Dominion, covert operations expert Zora Bennett (Scarlett Johansson) leads an elite expedition into isolated equatorial biomes to extract genetic material from the planet",
    "hero": "assets/images/jurassic_rebirth_landscape.jpg",
    "poster": "assets/images/jurassic_rebirth_poster.jpg",
    "genres": [
      "Cinema",
      "Drama"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  },
  {
    "key": "adipurush",
    "title": "ADIPURUSH",
    "year": "2023",
    "age": "U/A 13+",
    "dur": "2h 59m",
    "desc": "7,000 years ago, Ayodhya",
    "hero": "assets/images/adipurush_landscape.jpg",
    "poster": "assets/images/adipurush_poster.jpg",
    "genres": [
      "Cinema",
      "Drama"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  },
  {
    "key": "maharaj",
    "title": "MAHARAJ",
    "year": "2024",
    "age": "U/A 16+",
    "dur": "2h 12m",
    "desc": "Set in pre-independence 1862 Bombay and based on the historic Maharaj Libel Case, fearless reformer and journalist Karsandas Mulji (Junaid Khan) bravely challenges the exploitation of female devotees by the venerated, untouchable religious figure Jadunath Maharaj (Jaideep Ahlawat) in an epic courtroom reckoning. Directed by Siddharth P. Malhotra, starring Junaid Khan, Jaideep Ahlawat, Sharvari, Shalini Pandey. Streamed in 1080P HEVC via Peachify TMDB 1171099.",
    "hero": "assets/images/maharaj_landscape.jpg",
    "poster": "assets/images/maharaj_poster.jpg",
    "genres": [
      "Cinema",
      "Drama"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  },
  {
    "key": "with_love",
    "title": "WITH LOVE",
    "year": "2026",
    "age": "U/A 13+",
    "dur": "2h 21m",
    "desc": "Sathya reluctantly agrees to a blind date arranged by his sister and meets Monisha. To their astonishment, they discover they attended the same high school years ago. Reminiscing over teenage crushes and nostalgia, their past sparks an endearing modern connection. Starring Abishan Jeevinth, Anaswara Rajan, Harish Kumar. Directed by Madhan. Streamed in 1080P HEVC via Peachify TMDB 1508564.",
    "hero": "assets/images/with_love_landscape.jpg",
    "poster": "assets/images/with_love_poster.jpg",
    "genres": [
      "Action"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  },
  {
    "key": "never_surrender",
    "title": "NEVER SURRENDER",
    "year": "2026",
    "age": "U/A 16+",
    "dur": "2h 20m",
    "desc": "When a ruthless mercenary syndicate descends upon a remote mountain homestead, an estranged veteran with a haunted past and his grandchildren must unite their survival instincts to wage an uncompromising counter-offensive. Starring Lukman Sardi, Callista Arum, Sulthan Hamonangan, Derby Romero, Donny Alamsyah. Directed by Sidharta Tata. Streamed in 1080P HEVC via Peachify TMDB 1616687.",
    "hero": "assets/images/never_surrender_landscape.jpg?v=20261119_v105_real_nflx",
    "poster": "assets/images/never_surrender_poster.jpg?v=20261119_v105_real_nflx",
    "genres": [
      "Cinema",
      "Drama"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  },
  {
    "key": "made_in_korea",
    "title": "MADE IN KOREA",
    "year": "2026",
    "age": "U/A 13+",
    "dur": "1h 53m",
    "desc": "An ambitious and spirited young woman from a small town in Tamil Nadu embarks on a life-changing journey to Seoul, South Korea \u2014 a land she has passionately dreamed of for years. Navigating language barriers, cultural shocks, and emotional highs, she discovers resilience, unexpected friendship, and belonging in an unfamiliar world. Starring Priyanka Arul Mohan, Rishikanth, Park Hye-jin, Baek Si-hun. Directed by Ra. Karthik. Streamed in 1080P HEVC via Autoembed IMDb tt38674977.",
    "hero": "assets/images/made_in_korea_landscape.jpg",
    "poster": "assets/images/made_in_korea_poster.jpg",
    "genres": [
      "Cinema",
      "Drama"
    ],
    "industry": "South Indian",
    "quality": "4K UHD"
  },
  {
    "key": "peddi",
    "title": "PEDDI",
    "year": "2026",
    "age": "U/A 16+",
    "dur": "3h 09m",
    "desc": "In an isolated, unmapped rural hinterland that does not officially exist on government records, a fierce laborer",
    "hero": "assets/images/peddi_landscape.jpg",
    "poster": "assets/images/peddi_poster.jpg",
    "genres": [
      "Cinema",
      "Drama"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  },
  {
    "key": "cocktail2",
    "title": "COCKTAIL 2",
    "year": "2026",
    "age": "U/A 16+",
    "dur": "2h 30m",
    "desc": "A bold, modern romantic dramedy exploring turbulent friendships, love triangles, and emotional vulnerabilities amidst high-stakes metropolitan life. Starring Shahid Kapoor, Kriti Sanon, Rashmika Mandanna. Directed by Homi Adajania, written by Imtiaz Ali. Streamed in 1080P HEVC via Peachify TMDB 1392469.",
    "hero": "assets/images/cocktail2_landscape.jpg",
    "poster": "assets/images/cocktail2_poster.jpg",
    "genres": [
      "Romance"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  },
  {
    "key": "avarachan",
    "title": "AVARAACHAN & SONS",
    "year": "2026",
    "age": "U/A 13+",
    "dur": "2h 30m",
    "desc": "A humorous and heartwarming family drama chronicling the quirks, squabbles, and unyielding bonds within a traditional family business in Kerala. Starring Biju Menon, Sreenath Bhasi, Vinay Forrt, Grace Antony. Directed by Thamby. Streamed in 1080P HEVC via Peachify TMDB 1290035.",
    "hero": "assets/images/avarachan_landscape.jpg",
    "poster": "assets/images/avarachan_poster.jpg",
    "genres": [
      "Action",
      "Comedy",
      "Drama"
    ],
    "industry": "South Indian",
    "quality": "4K UHD"
  },
  {
    "key": "reporting_live",
    "title": "REPORTING LIVE",
    "year": "2026",
    "age": "U/A 16+",
    "dur": "1h 56m",
    "desc": "A gritty investigative crime thriller following an ambitious young reporter and her cynical cameraman whose routine coverage spirals into perilous territory when they uncover an illicit sand-mining cartel governed by dangerous political figures. Starring Parineeti Chopra, Deven Bhojani, Adil Hussain, Shekhar Suman, Amol Palekar, Nassar. Directed by Dhruv Tripathi. Streamed in 1080P HEVC via Peachify TMDB 1389172.",
    "hero": "assets/images/reporting_live_landscape.jpg",
    "poster": "assets/images/reporting_live_poster.jpg",
    "genres": [
      "Thriller"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  },
  {
    "key": "heartland",
    "title": "HEARTLAND",
    "year": "2026",
    "age": "U/A 16+",
    "dur": "1h 54m",
    "desc": "Former country music icon Misty Jones travels back into the intense Nashville music scene determined to unravel the elusive truth behind the sudden and mysterious disappearance of her rising-star niece. Starring Jessica Chastain, Carter Faith, Ross Lynch, John Hawkes, Garrett Hedlund, Norbert Leo Butz. Directed by Shana Feste. Streamed in 1080P HEVC via Peachify TMDB 1543469.",
    "hero": "assets/images/heartland_landscape.jpg",
    "poster": "assets/images/heartland_poster.jpg",
    "genres": [
      "Musical"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  },
  {
    "key": "one_year_to_live",
    "title": "ONE YEAR TO LIVE, BUY A MAN",
    "year": "2026",
    "age": "U/A 16+",
    "dur": "1h 49m",
    "desc": "Given only a single year left to live, an intensely frugal 40-year-old woman decides to spend her hard-earned life savings on hiring a popular nightclub host Sena, sparking a profound emotional transformation that challenges both of their worlds. Starring Ko Shibasaki, Eiji Akaso, Michitaka Tsutsui, Naomi Nishida, Yui Narumi. Directed by Hiroki Kazama. Streamed in 1080P HEVC via Peachify TMDB 1654940.",
    "hero": "assets/images/one_year_to_live_landscape.jpg",
    "poster": "assets/images/one_year_to_live_poster.jpg",
    "genres": [
      "Cinema",
      "Drama"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  },
  {
    "key": "allen",
    "title": "ALLEN",
    "year": "2026",
    "age": "U/A 13+",
    "dur": "1h 47m",
    "desc": "Twenty years following a bizarre childhood encounter with an extra-terrestrial, Petey",
    "hero": "assets/images/allen_landscape.jpg",
    "poster": "assets/images/allen_poster.jpg",
    "genres": [
      "Cinema",
      "Drama"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  },
  {
    "key": "jolly_llb_3",
    "title": "JOLLY LLB 3",
    "year": "2025",
    "age": "U/A 13+",
    "dur": "2h 36m",
    "desc": "The third part of the Jolly LLB trilogy brings back Jagdish Tyagi and Jagdishwar Mishra for the biggest courtroom showdown as penurious widow Janki Devi Solanki seeks justice against an arrogant industrialist in a sharp satire on the judiciary and social disparity. Starring Akshay Kumar, Arshad Warsi, Saurabh Shukla, Gajraj Rao, Amrita Rao, Huma Qureshi. Directed by Subhash Kapoor. Streamed in 1080P HEVC via Peachify TMDB 1015981.",
    "hero": "assets/images/jolly_llb_3_landscape.jpg",
    "poster": "assets/images/jolly_llb_3_poster.jpg",
    "genres": [
      "Action"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  },
  {
    "key": "saiyaara",
    "title": "SAIYAARA",
    "year": "2025",
    "age": "U/A 13+",
    "dur": "2h 30m",
    "desc": "Two artistic souls find soulful harmony through musical expression despite their starkly contrasting social backgrounds. As emotional bonds deepen, unexpected circumstances and social expectations test their connection. Starring Ahaan Panday, Aneet Padda, Alam Khan, Rajesh Kumar, Geeta Agrawal Sharma. Directed by Mohit Suri. Streamed in 1080P HEVC via Peachify TMDB 1241634.",
    "hero": "assets/images/saiyaara_landscape.jpg",
    "poster": "assets/images/saiyaara_poster.jpg",
    "genres": [
      "Musical"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  },
  {
    "key": "the_last_house",
    "title": "THE LAST HOUSE",
    "year": "2026",
    "age": "U/A 16+",
    "dur": "1h 50m",
    "desc": "A family suddenly sealed inside their high-tech home must work together to survive against dwindling food, psychological tension, and the ominous menace keeping them trapped. Starring Greta Lee, Wagner Moura, Riley Chung, Noah Alexander Sosnowski, Emma Ho. Directed by Louis Leterrier. Streamed in 1080P HEVC via Peachify TMDB 1284041.",
    "hero": "assets/images/the_last_house_landscape.jpg",
    "poster": "assets/images/the_last_house_poster.jpg",
    "genres": [
      "Cinema",
      "Drama"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  },
  {
    "key": "brawlers",
    "title": "BRAWLERS (BAGARRE)",
    "year": "2026",
    "age": "U/A 16+",
    "dur": "1h 38m",
    "desc": "Na\u00efm is gentle and warm in ordinary life, but possesses beast-like martial fury in combat. Desperate to finance medical care for his aging dog, he joins ",
    "hero": "assets/images/brawlers_landscape.jpg",
    "poster": "assets/images/brawlers_poster.jpg",
    "genres": [
      "Action"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  },
  {
    "key": "dhadak2",
    "title": "DHADAK 2",
    "year": "2025",
    "age": "U/A 16+",
    "dur": "2h 26m",
    "desc": "When Neelesh, an idealistic law student from an oppressed social background, enters an elite academic institution, he is confronted with institutional prejudice and systemic hierarchies. His profound relationship with Vidhi challenges caste divisions in a powerful fight for love and equality. Starring Siddhant Chaturvedi, Triptii Dimri, Saad Bilgrami, Saurabh Sachdeva, Vipin Sharma, Zakir Hussain. Directed by Shazia Iqbal, produced by Dharma Productions. Streamed in 1080P HEVC via CodeSpecters TMDB 1213777.",
    "hero": "assets/images/dhadak2_landscape.jpg",
    "poster": "assets/images/dhadak2_poster.jpg",
    "genres": [
      "Action",
      "Romance"
    ],
    "industry": "Bollywood",
    "quality": "4K UHD"
  },
  {
    "key": "demon_slayer",
    "title": "DEMON SLAYER: KIMETSU NO YAIBA \u2013 INFINITY CASTLE",
    "year": "2025",
    "age": "U/A 16+",
    "dur": "2h 15m",
    "desc": "The Demon Slayer Corps plunges into the terrifying, dimension-warping Infinity Castle to confront Muzan Kibutsuji and the deadly Upper Rank demons in the climactic war of survival. Spectacular animation by ufotable, directed by Haruo Sotozaki, music by Yuki Kajiura and Go Shiina. Streamed in 4K UHD via Peachify TMDB 1311031.",
    "hero": "assets/images/demon_slayer_landscape.jpg",
    "poster": "assets/images/demon_slayer_poster.jpg",
    "genres": [
      "Action",
      "Animation",
      "Musical"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  },
  {
    "key": "hi_papa",
    "title": "HI PAPA (HI NANNA)",
    "year": "2023",
    "age": "U/A 13+",
    "dur": "2h 35m",
    "desc": "A doting single father raising his precocious daughter begins narrating stories of her absent mother, unaware that serendipitous encounters with a compassionate woman are about to unravel buried memories and destiny. Starring Nani, Mrunal Thakur, Baby Kiara Khanna, Jayaram, Priyadarshi Pulikonda. Directed by Shouryuv, music by Hesham Abdul Wahab. Streamed in 4K UHD via Peachify TMDB 1068452.",
    "hero": "assets/images/hi_papa_landscape.jpg",
    "poster": "assets/images/hi_papa_poster.jpg",
    "genres": [
      "Action",
      "Musical"
    ],
    "industry": "South Indian",
    "quality": "4K UHD"
  },
  {
    "key": "dragon",
    "title": "DRAGON",
    "year": "2025",
    "age": "U/A 16+",
    "dur": "2h 32m",
    "desc": "A carefree, backbencher college student dubbed ",
    "hero": "assets/images/dragon_landscape.jpg",
    "poster": "assets/images/dragon_poster.jpg",
    "genres": [
      "Cinema",
      "Drama"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  },
  {
    "key": "youth",
    "title": "YOUTH",
    "year": "2026",
    "age": "U/A 13+",
    "dur": "2h 10m",
    "desc": "A fun-filled coming-of-age romantic comedy following 16-year-old carefree schoolboy Praveen and his tight-knit gang as they navigate school life, friendship, teenage romance, and heartfelt life lessons. Written, directed by, and starring Ken Karunas, alongside Anishma Anilkumar, Suraj Venjaramoodu, Devadarshini, Meenakshi Dinesh, Priyanshi Yadav. Music by G. V. Prakash Kumar. Streamed in 1080P HEVC via Peachify TMDB 1542352.",
    "hero": "assets/images/youth_landscape.jpg",
    "poster": "assets/images/youth_poster.jpg",
    "genres": [
      "Comedy",
      "Romance",
      "Musical"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  },
  {
    "key": "chhaava",
    "title": "CHHAAVA",
    "year": "2025",
    "age": "U/A 16+",
    "dur": "2h 41m",
    "desc": "An epic historical action saga chronicling the valiant life and fearless battles of Chhatrapati Sambhaji Maharaj, the lion of the Maratha Empire, as he fiercely defends Swarajya against Mughal Emperor Aurangzeb. Starring Vicky Kaushal, Rashmika Mandanna, Akshaye Khanna, Ashutosh Rana, Divya Dutta, Vineet Kumar Singh. Directed by Laxman Utekar, produced by Dinesh Vijan, music by A. R. Rahman. Streamed in 4K UHD via Peachify TMDB 1196943.",
    "hero": "assets/images/chhaava_landscape.jpg",
    "poster": "assets/images/chhaava_poster.jpg",
    "genres": [
      "Action",
      "Musical"
    ],
    "industry": "Bollywood",
    "quality": "4K UHD"
  },
  {
    "key": "maa",
    "title": "MAA",
    "year": "2025",
    "age": "U/A 16+",
    "dur": "2h 13m",
    "desc": "In a cursed remote village shadowed by ancient demonic forces, a determined mother unleashes the fierce divine wrath of Goddess Kali to rescue her abducted daughter from a child-devouring entity. Starring Kajol, Ronit Roy, Indraneil Sengupta, Kherin Sharma, Jitin Gulati. Directed by Vishal Furia, produced by Ajay Devgn and Jyoti Deshpande. Streamed in 1080P HEVC via Peachify TMDB 1389158.",
    "hero": "assets/images/maa_landscape.jpg",
    "poster": "assets/images/maa_poster.jpg",
    "genres": [
      "Cinema",
      "Drama"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  },
  {
    "key": "retro",
    "title": "RETRO (SURIYA 44)",
    "year": "2025",
    "age": "U/A 16+",
    "dur": "2h 38m",
    "desc": "A stylized retro action-gangster romance following a ruthless yet charismatic lone wolf driven by love, laughter, and relentless war. Starring Suriya, Pooja Hegde, Jayaram, Karunakaran, Joju George. Directed by Karthik Subbaraj, music composed by Santhosh Narayanan, produced by 2D Entertainment. Streamed in 4K UHD via Peachify TMDB 1265827.",
    "hero": "assets/images/retro_landscape.jpg",
    "poster": "assets/images/retro_poster.jpg",
    "genres": [
      "Action",
      "Romance",
      "Musical"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  },
  {
    "key": "the_odyssey",
    "title": "THE ODYSSEY",
    "year": "2026",
    "age": "U/A 16+",
    "dur": "3h 10m",
    "desc": "Christopher Nolan",
    "hero": "assets/images/the_odyssey_landscape.jpg",
    "poster": "assets/images/the_odyssey_poster.jpg",
    "genres": [
      "Cinema",
      "Drama"
    ],
    "industry": "Hollywood",
    "quality": "4K UHD"
  },
  {
    "key": "goat",
    "title": "GOAT (2026)",
    "year": "2026",
    "age": "U/A 7+",
    "dur": "1h 45m",
    "desc": "A groundbreaking animated sports adventure comedy produced by Sony Pictures Animation and Stephen Curry",
    "hero": "assets/images/goat_landscape.jpg",
    "poster": "assets/images/goat_poster.jpg",
    "genres": [
      "Comedy",
      "Animation"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  },
  {
    "key": "scary_movie_6",
    "title": "SCARY MOVIE 6",
    "year": "2026",
    "age": "A 18+",
    "dur": "1h 36m",
    "desc": "The legendary Wayans Brothers (Marlon, Shawn, and Keenen Ivory Wayans) reunite alongside franchise icons Anna Faris (Cindy Campbell) and Regina Hall (Brenda Meeks) to resurrect the premier horror parody franchise. Skewering modern horror sensations (M3GAN, Smile, Longlegs, Talk to Me, Hereditary), Scary Movie 6 unleashes side-splitting, unfiltered slapstick mayhem. Produced by Miramax. Streamed in 1080P HEVC via Peachify TMDB 1273221.",
    "hero": "assets/images/scary_movie_6_landscape.jpg",
    "poster": "assets/images/scary_movie_6_poster.jpg",
    "genres": [
      "Horror"
    ],
    "industry": "Hollywood",
    "quality": "4K UHD"
  },
  {
    "key": "coolie",
    "title": "COOLIE",
    "year": "2025",
    "age": "U/A 16+",
    "dur": "2h 50m",
    "desc": "Superstar Rajinikanth stars as Deva, a legendary harbor kingpin and gold smuggler in an adrenaline-charged action crime thriller set against Chennai",
    "hero": "assets/images/coolie_landscape.jpg",
    "poster": "assets/images/coolie_poster.jpg",
    "genres": [
      "Action",
      "Thriller"
    ],
    "industry": "South Indian",
    "quality": "4K UHD"
  },
  {
    "key": "dhurandhar",
    "title": "DHURANDHAR",
    "year": "2025",
    "age": "U/A 16+",
    "dur": "2h 45m",
    "desc": "National Award-winning director Aditya Dhar (Uri: The Surgical Strike) helms a high-octane geopolitical spy action saga based on real covert espionage missions conducted by Indian intelligence. Starring Ranveer Singh as a daring undercover operative, alongside Sanjay Dutt, R. Madhavan, Akshaye Khanna, and Arjun Rampal. Produced by Jio Studios and B62 Studios. Streamed in 4K UHD via Peachify TMDB 1291608.",
    "hero": "assets/images/dhurandhar_landscape.jpg",
    "poster": "assets/images/dhurandhar_poster.jpg",
    "genres": [
      "Action",
      "Thriller"
    ],
    "industry": "Bollywood",
    "quality": "4K UHD"
  },
  {
    "key": "jailer_2",
    "title": "JAILER 2 (HUKUM)",
    "year": "2026",
    "age": "U/A 16+",
    "dur": "2h 55m",
    "desc": "Tiger Muthuvel Pandian (Superstar Rajinikanth) returns in Nelson Dilipkumar",
    "hero": "assets/images/jailer_2_landscape.jpg",
    "poster": "assets/images/jailer_2_poster.jpg",
    "genres": [
      "Cinema",
      "Drama"
    ],
    "industry": "South Indian",
    "quality": "4K UHD"
  },
  {
    "key": "disclosure_day",
    "title": "DISCLOSURE DAY",
    "year": "2026",
    "age": "U/A 16+",
    "dur": "2h 35m",
    "desc": "A gripping science-fiction thriller directed by Steven Spielberg and written by David Koepp. When undeniable proof of extraterrestrial existence surfaces, a resilient television meteorologist and an intrepid cybersecurity analyst brave a deadly government pursuit to disclose the epochal truth to seven billion people. Starring Emily Blunt, Josh O",
    "hero": "assets/images/disclosure_day_landscape.jpg",
    "poster": "assets/images/disclosure_day_poster.jpg",
    "genres": [
      "Thriller",
      "Sci-Fi"
    ],
    "industry": "Hollywood",
    "quality": "4K UHD"
  },
  {
    "key": "wuthering_heights",
    "title": "WUTHERING HEIGHTS",
    "year": "2026",
    "age": "U/A 16+",
    "dur": "2h 25m",
    "desc": "Academy Award winner Emerald Fennell directs a visceral, intoxicating reimagining of Emily Bront\u00eb",
    "hero": "assets/images/wuthering_heights_landscape.jpg",
    "poster": "assets/images/wuthering_heights_poster.jpg",
    "genres": [
      "Action"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  },
  {
    "key": "hoppers",
    "title": "HOPPERS (2026)",
    "year": "2026",
    "age": "U/A 7+",
    "dur": "1h 42m",
    "desc": "A witty, heartwarming sci-fi comedy adventure from Disney and Pixar Animation Studios. An animal-loving college student Mabel utilizes revolutionary neuro-link science to hop her consciousness into an ultra-realistic robotic beaver. Infiltrating the wilderness, she befriends charismatic woodland creatures to protect their forest realm from ruthless urban expansion. Directed by Daniel Chong. Voices by Piper Curda, Bobby Moynihan, Jon Hamm. Streamed in 4K UHD via Peachify TMDB 1327819.",
    "hero": "assets/images/hoppers_landscape.jpg",
    "poster": "assets/images/hoppers_poster.jpg",
    "genres": [
      "Action",
      "Comedy",
      "Animation"
    ],
    "industry": "Hollywood",
    "quality": "4K UHD"
  },
  {
    "key": "michael",
    "title": "MICHAEL (THE KING OF POP)",
    "year": "2026",
    "age": "U/A 16+",
    "dur": "2h 50m",
    "desc": "The monumental biographical musical drama directed by Antoine Fuqua and produced by Graham King (Bohemian Rhapsody). Chronicling the triumphant yet turbulent life and enduring legacy of global music icon Michael Jackson, from child prodigy in the Jackson 5 to the undisputed King of Pop. Starring nephew Jaafar Jackson in an electric tour-de-force performance alongside Colman Domingo, Nia Long, Miles Teller. Lionsgate & Universal Pictures. Streamed in 4K UHD via Peachify TMDB 936075.",
    "hero": "assets/images/michael_landscape.jpg",
    "poster": "assets/images/michael_poster.jpg",
    "genres": [
      "Drama",
      "Musical"
    ],
    "industry": "Hollywood",
    "quality": "4K UHD"
  },
  {
    "key": "mario_galaxy",
    "title": "THE SUPER MARIO GALAXY MOVIE",
    "year": "2026",
    "age": "U/A 7+",
    "dur": "1h 40m",
    "desc": "Nintendo and Illumination reunite for the spectacular galactic sequel to the billion-dollar blockbuster. Mario, Luigi, Princess Peach, and Toad launch into deep cosmos to protect Rosalina",
    "hero": "assets/images/mario_galaxy_landscape.jpg",
    "poster": "assets/images/mario_galaxy_poster.jpg",
    "genres": [
      "Animation"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  },
  {
    "key": "minions_monsters",
    "title": "MINIONS & MONSTERS",
    "year": "2026",
    "age": "U/A 7+",
    "dur": "1h 35m",
    "desc": "In 1920s Hollywood",
    "hero": "assets/images/minions_monsters_landscape.jpg",
    "poster": "assets/images/minions_monsters_poster.jpg",
    "genres": [
      "Cinema",
      "Drama"
    ],
    "industry": "Hollywood",
    "quality": "4K UHD"
  },
  {
    "key": "mortal_kombat_2",
    "title": "MORTAL KOMBAT II",
    "year": "2026",
    "age": "A 18+",
    "dur": "2h 05m",
    "desc": "The ultimate martial arts tournament erupts as Earthrealm",
    "hero": "assets/images/mortal_kombat_2_landscape.jpg",
    "poster": "assets/images/mortal_kombat_2_poster.jpg",
    "genres": [
      "Action"
    ],
    "industry": "Hollywood",
    "quality": "4K UHD"
  },
  {
    "key": "kartavya",
    "title": "KARTAVYA",
    "year": "2026",
    "age": "U/A 16+",
    "dur": "1h 49m",
    "desc": "Local police officer Inspector Pawan Malik (Saif Ali Khan) is assigned to guard a fearless investigative journalist exposing a high-profile corruption racket tied to an influential spiritual cult. When the journalist is assassinated on his watch, Pawan must risk everything to fulfill his sworn duty. Produced by Red Chillies Entertainment.",
    "hero": "assets/images/kartavya_landscape.jpg",
    "poster": "assets/images/kartavya_poster.jpg",
    "genres": [
      "Action",
      "Crime",
      "Drama",
      "Thriller"
    ],
    "industry": "Bollywood",
    "quality": "4K UHD"
  },
  {
    "key": "gandhari",
    "title": "GANDHARI",
    "year": "2026",
    "age": "A 18+",
    "dur": "2h 10m",
    "desc": "When her daughter is abducted from a railway platform and she is blinded in the assault, mother Bani (Taapsee Pannu) transforms into an unstoppable lethal force of maternal vengeance to crush a child trafficking syndicate. Written & produced by Kanika Dhillon, directed by Devashish Makhija.",
    "hero": "assets/images/gandhari_landscape.jpg",
    "poster": "assets/images/gandhari_poster.jpg",
    "genres": [
      "Action",
      "Thriller"
    ],
    "industry": "Bollywood",
    "quality": "4K UHD"
  },
  {
    "key": "toaster",
    "title": "TOASTER",
    "year": "2026",
    "age": "U/A 16+",
    "dur": "1h 55m",
    "desc": "A hilarious dark comic thriller following Ramakant (Rajkummar Rao), a stingy man whose desperate quest to retrieve a luxury wedding toaster accidentally drags him into murder, blackmail, and criminal chaos. Starring Rajkummar Rao and Sanya Malhotra.",
    "hero": "assets/images/toaster_landscape.jpg",
    "poster": "assets/images/toaster_poster.jpg",
    "genres": [
      "Comedy",
      "Crime",
      "Thriller"
    ],
    "industry": "Bollywood",
    "quality": "4K UHD"
  },
  {
    "key": "shiva",
    "title": "SHIVA DHANUSH: THE SACRED PINAKA",
    "year": "2026",
    "age": "U/A 13+",
    "dur": "Chapter 2",
    "desc": "In the grand court of King Janaka at Mithila, mighty warriors fail to lift the celestial bow of Lord Shiva. Prince Rama effortlessly strings Pinaka, breaking it into two halves to fulfill the sacred prophecy.",
    "hero": "assets/images/feature_banner_hd.jpg",
    "poster": "assets/images/feature_banner_hd.jpg",
    "genres": [
      "Action",
      "Mythology"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  },
  {
    "key": "exile",
    "title": "THE FOREST EXILE & PANCHAVATI",
    "year": "2026",
    "age": "U/A 13+",
    "dur": "Chapter 3",
    "desc": "Lord Rama, Mata Sita, and Lakshmana begin their sacred 14-year exile in the mystical forests of Dandakaranya, establishing peace among hermits and confronting primeval demonic forces.",
    "hero": "assets/images/movie_cover_hd.jpg",
    "poster": "assets/images/movie_cover_hd.jpg",
    "genres": [
      "Cinema",
      "Drama"
    ],
    "industry": "Indian Cinema",
    "quality": "4K UHD"
  }
,
  {
      "key": "spiderman_brand_new_day",
      "title": "Spider-Man: Brand New Day",
      "year": "2026",
      "age": "PG-13",
      "dur": "Summer 2026",
      "desc": "Peter Parker begins a brand-new chapter navigating life after the worldwide memory wipe erased his civilian identity. As street-level crime escalates across New York City and formidable new adversaries emerge from the shadows, Spider-Man must forge unexpected alliances and discover what it truly costs to be a standalone hero. TMDB ID 969681.",
      "hero": "assets/images/spiderman_brand_new_day_landscape.jpg?v=20261119_v102_no_server_bar",
      "poster": "assets/images/spiderman_brand_new_day_poster.jpg?v=20261119_v102_no_server_bar",
      "genres": [
          "Action",
          "Sci-Fi",
          "Superhero"
      ],
      "industry": "Hollywood Cinema",
      "quality": "4K UHD"
  },
  {
      "key": "clayface",
      "title": "Clayface",
      "year": "2026",
      "age": "R",
      "dur": "Fall 2026",
      "desc": "A body-horror psychological noir exploring the tragic descent of Basil Karlo, a once-revered B-movie actor whose desperate quest for vanity and youth leads him to an experimental chemical treatment. Mutating into a monstrous, shape-shifting entity consumed by identity dysphoria, he wages a horrifying war against Gotham City's elite. TMDB ID 1400940.",
      "hero": "assets/images/clayface_landscape.jpg?v=20261119_v102_no_server_bar",
      "poster": "assets/images/clayface_poster.jpg?v=20261119_v102_no_server_bar",
      "genres": [
          "Horror",
          "Thriller",
          "DC Universe"
      ],
      "industry": "Hollywood Cinema",
      "quality": "4K UHD"
  },
  {
      "key": "resident_evil_2026",
      "title": "Resident Evil",
      "year": "2026",
      "age": "R",
      "dur": "Fall 2026",
      "desc": "A terrifying cinematic reboot returning to the claustrophobic survival-horror roots of Capcom's iconic franchise. Trapped deep inside the infected bio-weapons research complex of the Arklay Mountains, a specialized tactical team faces grotesque viral mutations and Umbrella Corporation's catastrophic bio-hazard cover-up. TMDB ID 1423191.",
      "hero": "assets/images/resident_evil_2026_landscape.jpg?v=20261119_v102_no_server_bar",
      "poster": "assets/images/resident_evil_2026_poster.jpg?v=20261119_v102_no_server_bar",
      "genres": [
          "Horror",
          "Action",
          "Sci-Fi"
      ],
      "industry": "Hollywood Cinema",
      "quality": "4K UHD"
  },
  {
      "key": "street_fighter",
      "title": "Street Fighter",
      "year": "2026",
      "age": "PG-13",
      "dur": "March 2026",
      "desc": "Legendary martial artists from across the globe converge to battle in the shadowy World Warrior Tournament orchestrated by M. Bison's Shadaloo syndicate. Ryu and Ken Masters must master the ancient power of Ansatsuken and overcome dark Hadou energy to prevent worldwide devastation. TMDB ID 1153576.",
      "hero": "assets/images/street_fighter_landscape.jpg?v=20261119_v102_no_server_bar",
      "poster": "assets/images/street_fighter_poster.jpg?v=20261119_v102_no_server_bar",
      "genres": [
          "Action",
          "Martial Arts"
      ],
      "industry": "Hollywood Cinema",
      "quality": "4K UHD"
  },
  {
      "key": "toy_story_5",
      "title": "Toy Story 5",
      "year": "2026",
      "age": "G",
      "dur": "June 2026",
      "desc": "Woody, Buzz Lightyear, and the beloved toy crew face their ultimate 21st-century existential challenge: competing for children's devotion against modern digital screens, tablets, and interactive electronics. Together, they embark on a hilarious, heartwarming quest to prove the enduring magic of imagination and playtime. TMDB ID 1084244.",
      "hero": "assets/images/toy_story_5_landscape.jpg?v=20261119_v102_no_server_bar",
      "poster": "assets/images/toy_story_5_poster.jpg?v=20261119_v102_no_server_bar",
      "genres": [
          "Animation",
          "Family",
          "Comedy"
      ],
      "industry": "Hollywood Cinema",
      "quality": "4K UHD"
  },
  {
      "key": "supergirl_woman_of_tomorrow",
      "title": "Supergirl: Woman of Tomorrow",
      "year": "2026",
      "age": "PG-13",
      "dur": "June 2026",
      "desc": "Unlike her cousin Superman who was raised on Earth by loving parents, Kara Zor-El grew up on a chipped-off rock of Krypton, witnessing everyone around her die tragically. Hardened and accompanied by Krypto the Superdog, she embarks on an epic, interstellar revenge quest across the cosmos with an alien girl named Ruthye. TMDB ID 1081003.",
      "hero": "assets/images/supergirl_woman_of_tomorrow_landscape.jpg?v=20261119_v102_no_server_bar",
      "poster": "assets/images/supergirl_woman_of_tomorrow_poster.jpg?v=20261119_v102_no_server_bar",
      "genres": [
          "Action",
          "Sci-Fi",
          "Superhero"
      ],
      "industry": "Hollywood Cinema",
      "quality": "4K UHD"
  },
  {
      "key": "mandalorian_and_grogu",
      "title": "Star Wars: The Mandalorian and Grogu",
      "year": "2026",
      "age": "PG-13",
      "dur": "May 2026",
      "desc": "The legendary Mandalorian bounty hunter Din Djarin and his Force-sensitive apprentice Grogu transition to the grand theatrical big screen. Partnering with the fledgling New Republic, they hunt Imperial remnants scheming in the dark corners of the outer rim galaxy to protect the fragile peace. TMDB ID 1228710.",
      "hero": "assets/images/mandalorian_and_grogu_landscape.jpg?v=20261119_v102_no_server_bar",
      "poster": "assets/images/mandalorian_and_grogu_poster.jpg?v=20261119_v102_no_server_bar",
      "genres": [
          "Action",
          "Sci-Fi",
          "Adventure"
      ],
      "industry": "Hollywood Cinema",
      "quality": "4K UHD"
  },
  {
      "key": "godzilla_minus_zero",
      "title": "Godzilla Minus Zero",
      "year": "2026",
      "age": "PG-13",
      "dur": "November 2026",
      "desc": "Following the Academy Award-winning global triumph of Godzilla Minus One, visionary director Takashi Yamazaki returns with the next colossal chapter in the Toho kaiju saga. As postwar Japan strives to rebuild, a terrifying atomic terror re-emerges from the oceanic abyss with catastrophic destructive fury. TMDB ID 1381071.",
      "hero": "assets/images/godzilla_minus_zero_landscape.jpg?v=20261119_v102_no_server_bar",
      "poster": "assets/images/godzilla_minus_zero_poster.jpg?v=20261119_v102_no_server_bar",
      "genres": [
          "Action",
          "Sci-Fi",
          "Drama"
      ],
      "industry": "International Cinema",
      "quality": "4K UHD"
  },
  {
      "key": "project_hail_mary",
      "title": "Project Hail Mary",
      "year": "2026",
      "age": "PG-13",
      "dur": "March 2026",
      "desc": "Ryland Grace, a middle-school science teacher turned lone survivor of an interstellar desperate mission, awakens from a coma with amnesia light-years from Earth. As our sun dies from an alien microbe, Grace must combine scientific deduction and an extraordinary interspecies friendship with an alien named Rocky to save humanity. TMDB ID 687163.",
      "hero": "assets/images/project_hail_mary_landscape.jpg?v=20261119_v102_no_server_bar",
      "poster": "assets/images/project_hail_mary_poster.jpg?v=20261119_v102_no_server_bar",
      "genres": [
          "Sci-Fi",
          "Adventure",
          "Drama"
      ],
      "industry": "Hollywood Cinema",
      "quality": "4K UHD"
  }
];

/* =========================================================================
   SANDFLIX INDEPENDENT DUAL SEARCH ENGINES (PC & MOBILE)
   PC/Laptop: Official Netflix Navbar Search Widget + Expandable Canvas
   Mobile: Dedicated Mobile Search Page with Sticky Hero Bar & Instant 2-Col Grid
   ========================================================================= */

// --- Shared Search Card HTML Builder ---
function buildSearchCardHtml(item) {
  return `
    <article class="n-card compact search-card official-master-card" onclick="openNetflixBlackPlayer('${item.key}')" title="Play ${item.title} (${item.year})">
      <div class="n-card-thumb">
        <img src="${item.hero}" data-poster="${item.poster}" alt="${item.title}" loading="lazy" />
        <span class="n-card-quality-tag">${item.quality}</span>

        <div class="n-card-overlay">
          <div class="n-card-actions">
            <button class="n-btn-circle play" onclick="event.stopPropagation(); openNetflixBlackPlayer('${item.key}');" title="Play Movie">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
            </button>
            <button class="n-btn-circle" onclick="event.stopPropagation(); toggleMyList(this);" title="My List">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
            <button class="n-btn-circle" onclick="event.stopPropagation(); alert('Added to Liked list!');" title="Like">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
            </button>
            <button class="n-btn-circle chevron" onclick="event.stopPropagation(); openMovieDetailsModal('${item.key}');" title="More Info">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
          </div>
          <div class="n-card-info">
            <h4 class="n-movie-name">${item.title}</h4>
            <p class="n-card-genres">${item.genres.join(' • ')} &bull; ${item.year}</p>
          </div>
        </div>
      </div>
    </article>
  `;
}

// --- DESKTOP SEARCH STATE & FUNCTIONS ---
let desktopSearchQuery = '';
let desktopSearchPill = 'all';
let prevPageBeforeDesktopSearch = 'home';

function filterMoviesList(catalog, query, category) {
  let list = catalog;
  if (category === 'trending') {
    list = list.filter(m => [
      'part1', 'coolie', 'dhurandhar', 'jailer_2', 'the_odyssey', 
      'michael', 'mario_galaxy', 'minions_monsters', 'mortal_kombat_2',
      'kartavya', 'gandhari', 'toaster',
      'disclosure_day', 'pushpa2', 'chhaava'
    ].includes(m.key));
  } else if (category === 'action') {
    list = list.filter(m => m.genres.includes('Action') || m.desc.toLowerCase().includes('action') || m.desc.toLowerCase().includes('mass'));
  } else if (category === 'hollywood') {
    list = list.filter(m => m.industry === 'Hollywood' || m.desc.toLowerCase().includes('hollywood') || m.desc.toLowerCase().includes('universal') || m.desc.toLowerCase().includes('warner'));
  } else if (category === 'south') {
    list = list.filter(m => m.industry === 'South Indian' || m.desc.toLowerCase().includes('south indian') || m.desc.toLowerCase().includes('tamil') || m.desc.toLowerCase().includes('telugu'));
  } else if (category === '4k') {
    list = list.filter(m => m.quality === '4K UHD' || m.desc.toLowerCase().includes('4k'));
  } else if (category === 'animation') {
    list = list.filter(m => m.genres.includes('Animation') || m.desc.toLowerCase().includes('animation') || m.desc.toLowerCase().includes('pixar') || m.desc.toLowerCase().includes('nintendo'));
  } else if (category === 'comedy') {
    list = list.filter(m => m.genres.includes('Comedy') || m.desc.toLowerCase().includes('comedy'));
  }

  if (query) {
    const q = query.toLowerCase();
    list = list.filter(m => {
      return m.title.toLowerCase().includes(q) ||
             m.desc.toLowerCase().includes(q) ||
             m.genres.some(g => g.toLowerCase().includes(q)) ||
             m.year.includes(q) ||
             m.industry.toLowerCase().includes(q);
    });
  }
  return list;
}

function handleDesktopSearchInput(val) {
  desktopSearchQuery = (val || '').trim();

  const dInput = document.getElementById('desktopSearchInput');
  const dClear = document.getElementById('desktopSearchClear');

  const hasVal = desktopSearchQuery.length > 0;
  if (dClear) dClear.style.display = hasVal ? 'flex' : 'none';

  // If user types on desktop navbar, open search view
  if (hasVal) {
    const cur = getCurrentActivePage();
    if (cur !== 'search') {
      prevPageBeforeDesktopSearch = cur;
      switchPage('search');
      if (dInput) setTimeout(() => dInput.focus(), 60);
    }
  }

  applyDesktopSearchFilter();
}

function clearDesktopSearch() {
  desktopSearchQuery = '';
  const dInput = document.getElementById('desktopSearchInput');
  const dClear = document.getElementById('desktopSearchClear');

  if (dInput) {
    dInput.value = '';
    dInput.focus();
  }
  if (dClear) dClear.style.display = 'none';

  applyDesktopSearchFilter();
}

function filterDesktopSearchByPill(pill, btnEl) {
  desktopSearchPill = pill;
  document.querySelectorAll('#desktopSearchFilterPills .n-search-pill').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  applyDesktopSearchFilter();
}

function quickDesktopSearchTag(tagName) {
  const dInput = document.getElementById('desktopSearchInput');
  if (dInput) dInput.value = tagName;
  handleDesktopSearchInput(tagName);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function applyDesktopSearchFilter() {
  const results = filterMoviesList(sandflixCatalog, desktopSearchQuery, desktopSearchPill);
  renderDesktopSearchResults(results, desktopSearchQuery);
}

function renderDesktopSearchResults(results, query) {
  const grid = document.getElementById('desktopSearchResultsGrid');
  const heading = document.getElementById('desktopSearchResultsHeading');
  const badge = document.getElementById('desktopSearchResultsBadge');
  const emptyState = document.getElementById('desktopSearchEmptyState');
  const highlight = document.getElementById('desktopEmptyQueryHighlight');

  if (heading && badge) {
    if (query) {
      heading.textContent = `Results for "${query}"`;
      badge.textContent = `${results.length} ${results.length === 1 ? 'Title' : 'Titles'}`;
    } else {
      heading.textContent = desktopSearchPill === 'all' ? 'All Titles' : `${desktopSearchPill.toUpperCase()} Titles`;
      badge.textContent = `${results.length} Titles`;
    }
  }

  if (results.length === 0) {
    if (grid) grid.style.display = 'none';
    if (emptyState) {
      emptyState.style.display = 'flex';
      if (highlight) highlight.textContent = `"${query}"`;
    }
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (grid) {
    grid.style.display = 'grid';
    grid.innerHTML = results.map(item => buildSearchCardHtml(item)).join('');
  }
}

function toggleNetflixSearch(event) {
  if (event) event.stopPropagation();
  const widget = document.getElementById('netflixSearchWidget');
  const dInput = document.getElementById('desktopSearchInput');
  if (!widget) return;

  if (widget.classList.contains('open')) {
    if (dInput && dInput.value.trim() !== '') {
      switchPage('search');
    } else {
      widget.classList.remove('open');
    }
  } else {
    widget.classList.add('open');
    if (dInput) {
      setTimeout(() => dInput.focus(), 150);
    }
    const curActive = getCurrentActivePage();
    if (curActive !== 'search') prevPageBeforeDesktopSearch = curActive;
  }
}

function handleDesktopSearchKeyDown(event) {
  if (event.key === 'Escape') {
    const widget = document.getElementById('netflixSearchWidget');
    const dInput = document.getElementById('desktopSearchInput');
    if (dInput) dInput.value = '';
    if (widget) widget.classList.remove('open');
    clearDesktopSearch();
    if (prevPageBeforeDesktopSearch && prevPageBeforeDesktopSearch !== 'search') {
      switchPage(prevPageBeforeDesktopSearch);
    }
  } else if (event.key === 'Enter') {
    event.preventDefault();
    switchPage('search');
  }
}

// --- MOBILE SEARCH STATE & FUNCTIONS ---
let mobileSearchQuery = '';
let mobileSearchCategory = 'all';

function handleMobileSearchInput(val) {
  mobileSearchQuery = (val || '').trim();
  const mClear = document.getElementById('mobileSearchClear');
  if (mClear) mClear.style.display = mobileSearchQuery ? 'flex' : 'none';
  applyMobileSearchFilter();
}

function clearMobileSearch() {
  mobileSearchQuery = '';
  const mInput = document.getElementById('mobileSearchInput');
  const mClear = document.getElementById('mobileSearchClear');
  if (mInput) {
    mInput.value = '';
    mInput.focus();
  }
  if (mClear) mClear.style.display = 'none';
  applyMobileSearchFilter();
}

function filterMobileSearchCategory(cat, btnEl) {
  mobileSearchCategory = cat;
  document.querySelectorAll('#mobileSearchFilterPills .s-pill').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  applyMobileSearchFilter();
}

function applyMobileSearchFilter() {
  const results = filterMoviesList(sandflixCatalog, mobileSearchQuery, mobileSearchCategory);
  renderMobileSearchResults(results, mobileSearchQuery);
}

function renderMobileSearchResults(results, query) {
  const grid = document.getElementById('mobileSearchResultsGrid');
  const title = document.getElementById('mobileSearchStatusTitle');
  const badge = document.getElementById('mobileSearchStatusBadge');
  const emptyState = document.getElementById('mobileSearchEmptyState');
  const emptyHeading = document.getElementById('mobileSearchEmptyHeading');
  const emptyText = document.getElementById('mobileSearchEmptyText');

  if (title && badge) {
    if (query) {
      title.textContent = `Results for "${query}"`;
      badge.textContent = `${results.length} ${results.length === 1 ? 'Title' : 'Titles'}`;
    } else {
      if (mobileSearchCategory === 'all') {
        title.textContent = 'All Available Movies & Sagas';
      } else if (mobileSearchCategory === 'trending') {
        title.textContent = '🔥 Trending Searches';
      } else {
        title.textContent = mobileSearchCategory.toUpperCase() + ' Cinema';
      }
      badge.textContent = `${results.length} Titles`;
    }
  }

  if (results.length === 0) {
    if (grid) grid.style.display = 'none';
    if (emptyState) {
      emptyState.style.display = 'flex';
      if (emptyHeading) emptyHeading.textContent = `No movies found matching "${query}"`;
      if (emptyText) emptyText.textContent = 'Try searching by title (e.g. Ramayana, Coolie, Dhurandhar, The Odyssey) or actor name.';
    }
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (grid) {
    grid.style.display = 'grid';
    grid.innerHTML = results.map(item => buildSearchCardHtml(item)).join('');
  }
}

// --- MASTER INITIALIZATION ---
function initDualSearchEngines() {
  // Render full catalog on both Desktop & Mobile immediately
  applyDesktopSearchFilter();
  applyMobileSearchFilter();

  // Desktop click outside listener to collapse search bar if empty (keeps open if on search page)
  document.addEventListener('click', function(e) {
    const widget = document.getElementById('netflixSearchWidget');
    const dInput = document.getElementById('desktopSearchInput');
    if (widget && !widget.contains(e.target)) {
      if (dInput && dInput.value.trim() === '') {
        const curActive = typeof getCurrentActivePage === 'function' ? getCurrentActivePage() : '';
        if (curActive !== 'search') {
          widget.classList.remove('open');
        }
      }
    }
  });

  // Shortcut '/' for PC desktop search
  document.addEventListener('keydown', function(e) {
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      const widget = document.getElementById('netflixSearchWidget');
      const dInput = document.getElementById('desktopSearchInput');
      if (widget) widget.classList.add('open');
      if (dInput) dInput.focus();
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initDualSearchEngines();
});

// Compatibility Aliases so no external call can fail
function handleNetflixSearchInput(val, src) {
  if (src === 'desktop') handleDesktopSearchInput(val);
  else handleMobileSearchInput(val);
}
function clearNetflixSearch(src) {
  if (src === 'desktop') clearDesktopSearch();
  else clearMobileSearch();
}
function filterSearchByPill(cat, el) { filterDesktopSearchByPill(cat, el); }
function handleNetflixSearchKeyDown(e) { handleDesktopSearchKeyDown(e); }
function handleUnifiedSearch(val, src) { handleNetflixSearchInput(val, src); }
function clearUnifiedSearch(src) { clearNetflixSearch(src); }
function filterSearchCategory(cat, el) { filterMobileSearchCategory(cat, el); }
function initUnifiedSearchEngine() { initDualSearchEngines(); }
function initNetflixSearch() { initDualSearchEngines(); }
