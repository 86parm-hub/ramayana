/* ==========================================================================
   RAMAYANA (2026) - STUDIO CINEMA MAX OTT ENGINE
   Multi-Page Switching, High-Resolution Carousel, Player & Touch Seeking
   ========================================================================== */

// Global Page Switcher Function
function switchPage(pageKey) {
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
    'gallery': 'gallery-view'
  };

  const targetId = pageMap[pageKey] || 'home-view';

  // Pause trailer video if leaving trailer page
  const trailerVideo = document.getElementById('trailerVideo');
  if (trailerVideo && pageKey !== 'trailer' && !trailerVideo.paused) {
    trailerVideo.pause();
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

  // Update URL hash without jumping
  if (history.pushState) {
    history.pushState(null, null, `#${pageKey}`);
  }
}

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
    image: "feature_banner_hd.jpg"
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
    image: "movie_poster_hd.jpg"
  }
};

let currentModalPart = 2;

function openComingSoonModal(partNum) {
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
}

function closeComingSoonModal() {
  const modal = document.getElementById('comingSoonModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

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
  video.poster = 'movie_cover_hd.jpg';
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
  if (hash && ['home', 'movies', 'trailer', 'watch', 'gallery'].includes(hash)) {
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
    banner: "hero_banner_hd.jpg",
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
    banner: "feature_banner_hd.jpg",
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
    banner: "movie_poster_hd.jpg",
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
    banner: "movie_cover_hd.jpg",
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
    banner: "teaser_lanka_hd.jpg",
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
    banner: "teaser_archer_hd.jpg",
    desc: "The monumental heart-touching devotional anthem with Achyutam Keshavam shlokas."
  }
];

let ostAudio = new Audio();
let currentOSTIndex = 0;
let isOSTPlaying = false;
let isOSTLoop = false;
let isOSTMuted = false;
let ostSavedVolume = 0.9;

ostAudio.volume = ostSavedVolume;
ostAudio.preload = 'metadata';

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
  if (currentOSTIndex === targetIndex && ostAudio.src && (ostAudio.src.endsWith(OST_TRACKS[targetIndex].src) || ostAudio.src.includes(encodeURI(OST_TRACKS[targetIndex].src)))) {
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
  ostAudio.load();
  const playPromise = ostAudio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      isOSTPlaying = true;
    }).catch(e => {
      console.warn('Audio play rejected by browser:', e);
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
      playOSTTrack(1);
    } else {
      ostAudio.play().catch(e => console.warn('Audio play prevented:', e));
    }
  }
}

// Shuffle Play
function shufflePlayOST() {
  pauseActiveVideosForAudio();
  let nextIdx;
  if (OST_TRACKS.length > 1) {
    do {
      nextIdx = Math.floor(Math.random() * OST_TRACKS.length);
    } while (nextIdx === currentOSTIndex);
  } else {
    nextIdx = 0;
  }
  playOSTTrack(OST_TRACKS[nextIdx].id);
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

// Close / Hide Floating Player Bar
function closeFloatingPlayer() {
  ostAudio.pause();
  const fp = document.getElementById('ostFloatingPlayer');
  if (fp) fp.style.display = 'none';
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
  if (fp) fp.style.display = 'flex';

  const thumb = document.getElementById('ostFpThumb');
  const title = document.getElementById('ostFpTitle');
  const tag = document.getElementById('ostFpTag');
  const artist = document.getElementById('ostFpArtist');
  const dur = document.getElementById('ostFpDuration');
  
  if (thumb) thumb.src = track.banner;
  if (title) title.textContent = track.title;
  if (tag) tag.textContent = track.tag;
  if (artist) artist.innerHTML = track.artist;
  if (dur) dur.textContent = track.duration;
  // Anti-download: direct download link removed
}

// Web Media Session API for Lock Screen & Bluetooth Headsets

// Spotify / YouTube Music Filter Chips
function filterSandifyTracks(category, btn) {
  document.querySelectorAll('.ytm-chip').forEach(c => c.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const rows = document.querySelectorAll('.spotify-row');
  rows.forEach(r => {
    const cat = r.getAttribute('data-cat');
    if (category === 'all' || cat === category) {
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
          { src: 'movie_poster_hd.jpg', sizes: '256x256', type: 'image/jpeg' },
          { src: 'sandflix_icon.png', sizes: '192x192', type: 'image/png' }
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
window.closeFloatingPlayer = closeFloatingPlayer;
window.scrollToActiveTrack = scrollToActiveTrack;



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

function playTrailerInNetflixPlayer(startSec) {
  openNetflixBlackPlayer(typeof startSec === 'number' ? startSec : 'trailer');
}
window.playTrailerInNetflixPlayer = playTrailerInNetflixPlayer;

function openNetflixBlackPlayer(targetTime) {
  const modal = document.getElementById('netflixBlackPlayerModal');
  const video = document.getElementById('nbpVideo');
  const spinner = document.getElementById('nbpSpinner');

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

  if (!modal || !video) return;

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  closeAllNbpPopovers();

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

function loadAndPlayTrailerInNbp(startOffset) {
  const video = document.getElementById('nbpVideo');
  const spinner = document.getElementById('nbpSpinner');
  const titleDisplay = document.getElementById('nbpCenterTitle');
  if (titleDisplay) {
    titleDisplay.textContent = 'Ramayana: Part One • Official Theatrical Trailer (Full HD)';
  }
  if (!video) return;

  const trailerUrl = 'move_trailer_hd.mp4';
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

function closeNetflixBlackPlayer() {
  const modal = document.getElementById('netflixBlackPlayerModal');
  const video = document.getElementById('nbpVideo');
  if (video && !video.paused) {
    video.pause();
  }
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
  document.body.style.overflow = '';
  closeAllNbpPopovers();
  stopSubtitleEngine();

  if (nbpIsTrailerMode) {
    nbpIsTrailerMode = false;
    const titleDisplay = document.getElementById('nbpCenterTitle');
    if (titleDisplay) titleDisplay.textContent = 'Ramayana: Part One';
  }

  if (document.fullscreenElement) {
    document.exitFullscreen().catch(e => {});
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

function openMovieDetailsModal(movieKey) {
  const modal = document.getElementById('netflixMoreInfoModal');
  if (!modal) return;

  const data = {
    'part1': {
      title: 'RAMAYANA: PART ONE',
      hero: 'hero_banner_hd.jpg',
      year: '2026',
      age: 'U/A 13+',
      dur: '3h 12m',
      desc: "Witness Maryada Purushottam Lord Rama\'s supreme vow to uphold Dharma. From the golden halls of Ayodhya to the divine breaking of Lord Shiva\'s Pinaka bow, and the epic journey through the mystic Dandakaranya forest. Complete 3-hour saga available in full 1080P HEVC."
    },
    'shiva': {
      title: 'SHIVA DHANUSH: THE SACRED PINAKA',
      hero: 'feature_banner_hd.jpg',
      year: '2026',
      age: 'U/A 13+',
      dur: 'Chapter 2',
      desc: "In the grand court of King Janaka at Mithila, mighty warriors fail to lift the celestial bow of Lord Shiva. Prince Rama effortlessly strings Pinaka, breaking it into two halves to fulfill the sacred prophecy."
    },
    'exile': {
      title: 'THE FOREST EXILE & PANCHAVATI',
      hero: 'movie_cover_hd.jpg',
      year: '2026',
      age: 'U/A 13+',
      dur: 'Chapter 3',
      desc: "Lord Rama, Mata Sita, and Lakshmana begin their sacred 14-year exile in the mystical forests of Dandakaranya, establishing peace among hermits and confronting primeval demonic forces."
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

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeMovieDetailsModal() {
  const modal = document.getElementById('netflixMoreInfoModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  const blackModal = document.getElementById('netflixBlackPlayerModal');
  if (!blackModal || !blackModal.classList.contains('active')) {
    document.body.style.overflow = '';
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
