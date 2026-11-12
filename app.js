/* ==========================================================================
   RAMAYANA (2026) - STUDIO CINEMA MAX OTT ENGINE
   Multi-Page Switching, High-Resolution Carousel, Player & Touch Seeking
   ========================================================================== */

// Global Page Switcher Function
function switchPage(pageKey) {
  const pageMap = {
    'home': 'home-view',
    'trailer': 'trailer-view',
    'watch': 'watch-view',
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

// Act Switcher Engine (Act 1: 01:30:15 | Act 2: 01:30:16)
const ACT_CONFIG = {
  act1: {
    title: 'Part 1: Act 1 (The Divine Beginning)',
    duration: '01:30:15',
    cloudUrl: 'https://github.com/86parm-hub/ramayana/releases/download/v1.0/Ramayana.Part1.Act1.mp4',
    localUrl: 'Ramayana.Part1.Act1.mp4'
  },
  act2: {
    title: 'Part 1: Act 2 (The Forest Exile & Awakening)',
    duration: '01:30:16',
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
    video.currentTime = 0;
    video.play().catch(e => console.log('Replay deferred:', e));
  }
};

window.selectAct = function (actKey) {
  if (!ACT_CONFIG[actKey]) return;
  activeActKey = actKey;
  const cfg = ACT_CONFIG[actKey];
  const video = document.getElementById('videoPlayer');
  const btn1 = document.getElementById('btnAct1');
  const btn2 = document.getElementById('btnAct2');
  const card1 = document.getElementById('actCard1');
  const card2 = document.getElementById('actCard2');
  const badge1 = document.getElementById('actBadge1');
  const badge2 = document.getElementById('actBadge2');
  const streamBtn1 = document.getElementById('btnStreamAct1');
  const streamBtn2 = document.getElementById('btnStreamAct2');
  const watermarkTag = document.getElementById('watermarkActTag');
  const modal = document.getElementById('offlineFileModal');
  const spinner = document.getElementById('streamSpinnerVeil');
  const outroCard = document.getElementById('theaterOutroCard');

  // Update Top Quick Buttons
  if (btn1) btn1.classList.toggle('active', actKey === 'act1');
  if (btn2) btn2.classList.toggle('active', actKey === 'act2');

  // Update Bottom Showcase Feature Cards & Badges
  if (card1) card1.classList.toggle('active', actKey === 'act1');
  if (card2) card2.classList.toggle('active', actKey === 'act2');

  if (badge1) {
    if (actKey === 'act1') {
      badge1.textContent = '● NOW PLAYING';
      badge1.className = 'act-badge-pill live';
    } else {
      badge1.textContent = 'ACT 1';
      badge1.className = 'act-badge-pill';
    }
  }

  if (badge2) {
    if (actKey === 'act2') {
      badge2.textContent = '● NOW PLAYING';
      badge2.className = 'act-badge-pill live';
    } else {
      badge2.textContent = 'ACT 2';
      badge2.className = 'act-badge-pill';
    }
  }

  if (streamBtn1) {
    streamBtn1.innerHTML = actKey === 'act1'
      ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg><span>✓ Streaming Act 1</span>'
      : '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg><span>Play Act 1 (01:30:15)</span>';
  }

  if (streamBtn2) {
    streamBtn2.innerHTML = actKey === 'act2'
      ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg><span>✓ Streaming Act 2</span>'
      : '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg><span>Play Act 2 (01:30:16)</span>';
  }

  // Update On-Screen Upper Right Watermark Tag
  if (watermarkTag) {
    watermarkTag.textContent = actKey === 'act1' ? 'ACT 1 STREAMING' : 'ACT 2 STREAMING';
  }

  if (modal) modal.classList.remove('visible');
  if (outroCard) outroCard.classList.remove('active');
  if (spinner) spinner.classList.add('active');

  if (video) {
    const isLocal = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const targetUrl = isLocal ? cfg.localUrl : cfg.cloudUrl;
    video.src = targetUrl;
    video.load();
    video.play().then(() => {
      if (spinner) spinner.classList.remove('active');
    }).catch(err => {
      console.log('Playback deferred until user interaction:', err);
    });
  }
};

// Global Quick Stream Trigger
function startCinemaStream() {
  switchPage('watch');
  const video = document.getElementById('videoPlayer');
  const modal = document.getElementById('offlineFileModal');
  const spinner = document.getElementById('streamSpinnerVeil');
  if (video) {
    if (modal) modal.classList.remove('visible');
    setTimeout(() => {
      video.play().then(() => {
        if (modal) modal.classList.remove('visible');
        if (spinner) spinner.classList.remove('active');
      }).catch(e => {
        console.log('Playback policy/source check:', e);
      });
    }, 300);
  }
}

// Chapters Section Scroll Helper
function scrollToChapters() {
  switchPage('home');
  setTimeout(() => {
    const sec = document.getElementById('chaptersRow');
    if (sec) {
      sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
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

// Hero Carousel Global Variables & Function
let currentSlideIdx = 0;
let carouselInterval = null;

function gotoSlide(idx) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slide-dot');
  if (!slides.length) return;

  slides.forEach((s, i) => {
    s.classList.toggle('active', i === idx);
  });

  dots.forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });

  currentSlideIdx = idx;
}

function nextSlide() {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  const nextIdx = (currentSlideIdx + 1) % slides.length;
  gotoSlide(nextIdx);
}

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
  const directPickerInput = document.getElementById('directPickerInput');
  const fileNote = document.getElementById('fileNote');

  let controlsHideTimer = null;
  let isDraggingScrub = false;

  // Permanent Official GitHub CDN Stream Endpoints (100% Autonomous, No PC Needed)
  const CLOUD_STREAM_URL = 'https://github.com/86parm-hub/ramayana/releases/download/v1.0/Ramayana.Part1.Act1.mp4';
  const LOCAL_STREAM_URL = 'Ramayana.Part1.Act1.mp4';

  const isLocal = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  video.src = isLocal ? LOCAL_STREAM_URL : CLOUD_STREAM_URL;
  video.load();

  // Start Hero Auto Carousel
  carouselInterval = setInterval(() => {
    // Only auto-advance if user is viewing Home
    const homeView = document.getElementById('home-view');
    if (homeView && homeView.classList.contains('active')) {
      nextSlide();
    }
  }, 7000);

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
      video.play().then(() => {
        videoChassis.classList.add('is-playing');
        offlineFileModal.classList.remove('visible');
        streamSpinnerVeil.classList.remove('active');
        resetHideTimer();
      }).catch(err => {
        console.warn('Playback error / User interaction needed:', err);
      });
    } else {
      video.pause();
      videoChassis.classList.remove('is-playing');
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

  video.addEventListener('play', syncPlayUI);
  video.addEventListener('pause', syncPlayUI);
  centerPlayOrb.addEventListener('click', togglePlay);
  btnPlayPause.addEventListener('click', togglePlay);
  video.addEventListener('click', togglePlay);

  // Rewind & Fast Forward 10s
  btnRewind10.addEventListener('click', () => {
    video.currentTime = Math.max(0, video.currentTime - 10);
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
    if (!isDraggingScrub) {
      txtCurrentTime.textContent = formatTime(video.currentTime);
      if (video.duration) {
        const pct = (video.currentTime / video.duration) * 100;
        scrubPlayedFill.style.width = `${pct}%`;
      }
    }
    updateBufferDisplay();
  });

  video.addEventListener('loadedmetadata', () => {
    txtDurationTime.textContent = formatTime(video.duration);
    offlineFileModal.classList.remove('visible');
  });

  video.addEventListener('durationchange', () => {
    txtDurationTime.textContent = formatTime(video.duration);
  });

  function updateBufferDisplay() {
    if (video.buffered.length > 0 && video.duration) {
      const end = video.buffered.end(video.buffered.length - 1);
      const pct = (end / video.duration) * 100;
      scrubBufferFill.style.width = `${pct}%`;
    }
  }
  video.addEventListener('progress', updateBufferDisplay);

  // Spinner on buffer & Stream Resilience
  video.addEventListener('waiting', () => {
    streamSpinnerVeil.classList.add('active');
  });
  video.addEventListener('canplay', () => {
    streamSpinnerVeil.classList.remove('active');
    offlineFileModal.classList.remove('visible');
  });
  video.addEventListener('playing', () => {
    streamSpinnerVeil.classList.remove('active');
    offlineFileModal.classList.remove('visible');
  });
  video.addEventListener('error', (e) => {
    console.warn('Video stream error/check:', e);
    streamSpinnerVeil.classList.remove('active');
  });

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
    if (video.duration) {
      video.currentTime = pos * video.duration;
      txtCurrentTime.textContent = formatTime(video.currentTime);
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
    if (video.duration) {
      scrubTooltip.textContent = formatTime(pos * video.duration);
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
        video.currentTime = Math.max(0, video.currentTime - 10);
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
          video.currentTime = pct * video.duration;
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

  localFileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) handleChosenFile(e.target.files[0]);
  });

  directPickerInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) handleChosenFile(e.target.files[0]);
  });

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
  if (hash && ['home', 'trailer', 'watch', 'gallery'].includes(hash)) {
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

  window.toggleTrailerPlayback = function() {
    if (video.paused || video.ended) {
      video.play().catch(e => console.log('Autoplay prevented', e));
    } else {
      video.pause();
    }
  };

  window.toggleTrailerMute = function() {
    video.muted = !video.muted;
    if (volIcon) {
      if (video.muted) {
        volIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
      } else {
        volIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
      }
    }
  };

  window.toggleTrailerFullscreen = function() {
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

  window.seekTrailer = function(timeInSec, cardEl) {
    if (video) {
      video.currentTime = timeInSec;
      video.play().catch(() => {});
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
    const dur = video.duration || 120;
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
      const dur = video.duration || 120;
      scrubLoaded.style.width = `${(bufferedEnd / dur) * 100}%`;
    }
  });

  if (scrubTrack) {
    scrubTrack.addEventListener('click', (e) => {
      const rect = scrubTrack.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const dur = video.duration || 120;
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
