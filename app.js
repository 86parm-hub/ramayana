/* ==========================================================================
   RAMAYANA (2026) - STUDIO CINEMA MAX OTT ENGINE
   Multi-Page Switching, High-Resolution Carousel, Player & Touch Seeking
   ========================================================================== */

// Global Page Switcher Function
function switchPage(pageKey) {
  const pageMap = {
    'home': 'home-view',
    'watch': 'watch-view',
    'gallery': 'gallery-view',
    'cast': 'cast-view',
    'specs': 'specs-view'
  };

  const targetId = pageMap[pageKey] || 'home-view';

  // Toggle active view
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.remove('active');
  });

  const activeView = document.getElementById(targetId);
  if (activeView) {
    activeView.classList.add('active');
  }

  // Update tabs
  document.querySelectorAll('.tab-link').forEach(tab => {
    if (tab.getAttribute('data-target') === targetId) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Scroll to top of the page smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update URL hash without jumping
  if (history.pushState) {
    history.pushState(null, null, `#${pageKey}`);
  }
}

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

  // Spinner on buffer & Error handling
  video.addEventListener('waiting', () => {
    if (!video.src && (!video.currentSrc || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE)) {
      streamSpinnerVeil.classList.remove('active');
      offlineFileModal.classList.add('visible');
      return;
    }
    streamSpinnerVeil.classList.add('active');
  });
  video.addEventListener('canplay', () => streamSpinnerVeil.classList.remove('active'));
  video.addEventListener('playing', () => {
    streamSpinnerVeil.classList.remove('active');
    offlineFileModal.classList.remove('visible');
  });
  video.addEventListener('error', (e) => {
    console.warn('Video source error:', e);
    streamSpinnerVeil.classList.remove('active');
    offlineFileModal.classList.add('visible');
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
  window.toggleCinemaAmbient = function() {
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

  window.toggleLightsOut = function() {
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
    fileNote.textContent = `Streaming file: ${file.name} (${(file.size / (1024*1024*1024)).toFixed(2)} GB)`;
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

  // URL Hash Routing on page load
  const hash = window.location.hash.replace('#', '');
  if (hash && ['home', 'watch', 'gallery', 'cast', 'specs'].includes(hash)) {
    switchPage(hash);
  }
});
