/**
 * K-ON! Portfolio — Modern Edition
 * Fixed: loading screen bug, added dark/light theme toggle
 */

// ============================================
// CONFIG & DATA
// ============================================

const CONFIG = {
  particles: { interval: 350, colors: ['#a855f7','#60a5fa','#f472b6','#34d399','#fbbf24'] },
  loadingDuration: 2600
};

const SONGS = [
  { name: "Tenshi ni Fureta yo!", artist: "Hōkago Tea Time", img: "album", audio: "Tenshi-ni-fureta" },
  { name: "Watashi no Koi wa Hotch Kiss", artist: "Hōkago Tea Time", img: "album-2", audio: "watashi-no-koi" },
  { name: "Fuwa Fuwa Time", artist: "Hōkago Tea Time", img: "album-3", audio: "fuwa-fuwa-time" },
  { name: "Pure Pure Heart", artist: "Hōkago Tea Time", img: "album-4", audio: "kon-pich-daisuki" }
];

// ============================================
// UTILS
// ============================================

const utils = {
  formatTime(s) {
    if (isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  },
  debounce(fn, ms) {
    let t;
    return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
  },
  rand(min, max) { return Math.random() * (max - min) + min; },
  randEl(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
};

// ============================================
// THEME MODULE
// ============================================

const Theme = {
  current: 'dark',

  init() {
    // Load saved preference
    const saved = localStorage.getItem('kon-theme') || 'dark';
    this.apply(saved);

    const btn = document.getElementById('themeToggle');
    btn?.addEventListener('click', () => this.toggle());
  },

  toggle() {
    this.apply(this.current === 'dark' ? 'light' : 'dark');
  },

  apply(theme) {
    this.current = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kon-theme', theme);

    const icon = document.getElementById('themeIcon');
    if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';
  }
};

// ============================================
// LOADING SCREEN — FIXED
// ============================================

const LoadingScreen = {
  init() {
    const screen = document.getElementById('loadingScreen');
    const bars = document.getElementById('barsAnimation');
    const navbar = document.getElementById('navbar');
    const homeInfo = document.getElementById('homeInfo');
    const homeImg = document.getElementById('homeImg');

    const reveal = () => {
      // 1. Hide loading screen with fade
      if (screen) screen.classList.add('hidden');

      // 2. Hide bars with fade
      if (bars) bars.classList.add('done');

      // 3. Show navbar
      if (navbar) navbar.classList.remove('hidden-init');

      // 4. Animate hero content in (slight delay for polish)
      setTimeout(() => {
        if (homeInfo) homeInfo.classList.add('visible');
        if (homeImg) homeImg.classList.add('visible');
      }, 150);
    };

    // Trigger after animation + small buffer
    if (document.readyState === 'complete') {
      setTimeout(reveal, CONFIG.loadingDuration);
    } else {
      window.addEventListener('load', () => {
        setTimeout(reveal, CONFIG.loadingDuration);
      });
    }
  }
};

// ============================================
// NAVIGATION
// ============================================

const Navigation = {
  init() {
    this.setupToggle();
    this.setupScroll();
    this.setupActiveLinks();
  },

  setupToggle() {
    const toggle = document.querySelector('.toggle');
    const nav = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    toggle?.addEventListener('click', () => {
      toggle.classList.toggle('active');
      nav.classList.toggle('show');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggle?.classList.remove('active');
        nav?.classList.remove('show');
      });
    });
  },

  setupScroll() {
    const nav = document.getElementById('navbar');
    const scrollTopBtn = document.getElementById('scrollTop');

    const onScroll = utils.debounce(() => {
      const y = window.scrollY;
      nav?.classList.toggle('scrolling', y > 70);
      scrollTopBtn?.classList.toggle('visible', y > 400);
    }, 10);

    window.addEventListener('scroll', onScroll);

    scrollTopBtn?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },

  setupActiveLinks() {
    const sections = document.querySelectorAll('section[id]');
    const onScroll = utils.debounce(() => {
      const y = window.scrollY;
      sections.forEach(sec => {
        const top = sec.offsetTop - 120;
        const bottom = top + sec.offsetHeight;
        const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
        link?.classList.toggle('active', y >= top && y < bottom);
      });
    }, 10);
    window.addEventListener('scroll', onScroll);
  }
};

// ============================================
// ANIMATIONS — FADE IN
// ============================================

const Animations = {
  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('show');
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade').forEach(el => observer.observe(el));
  }
};

// ============================================
// GALLERY — seamless scroll duplication
// ============================================

const Gallery = {
  init() {
    ['.memories-galery', '.memories-galery-reverse'].forEach(sel => {
      const el = document.querySelector(sel);
      if (!el) return;
      const items = [...el.children];
      items.forEach(item => el.appendChild(item.cloneNode(true)));
    });
  }
};

// ============================================
// MUSIC PLAYER
// ============================================

const MusicPlayer = {
  idx: 0,
  isPlaying: false,

  get audio() { return document.getElementById('mainAudio'); },
  get container() { return document.getElementById('musicContainer'); },
  get player() { return document.getElementById('musicPlayer'); },

  init() {
    this.bindEvents();
    this.loadSong(0, false);
  },

  bindEvents() {
    document.getElementById('playPause')?.addEventListener('click', () => this.togglePlay());
    document.getElementById('next')?.addEventListener('click', () => this.next());
    document.getElementById('prev')?.addEventListener('click', () => this.prev());
    document.getElementById('repeat')?.addEventListener('click', () => { this.audio.currentTime = 0; if (this.isPlaying) this.audio.play(); });
    document.getElementById('closeModal')?.addEventListener('click', () => this.close());

    this.audio?.addEventListener('timeupdate', () => this.updateProgress());
    this.audio?.addEventListener('loadedmetadata', () => this.updateDuration());
    this.audio?.addEventListener('ended', () => this.next());

    document.getElementById('progressDetails')?.addEventListener('click', e => {
      const bar = e.currentTarget;
      const pct = e.offsetX / bar.clientWidth;
      if (!isNaN(this.audio.duration)) this.audio.currentTime = pct * this.audio.duration;
    });

    // Album click
    document.querySelector('.list-album')?.addEventListener('click', e => {
      const img = e.target.closest('.album-body img');
      if (!img) return;
      const cls = ['album-1','album-2','album-3','album-4'];
      const i = cls.findIndex(c => img.classList.contains(c));
      if (i !== -1) this.open(i);
    });
  },

  loadSong(i, autoPlay = false) {
    const song = SONGS[i];
    if (!song) return;
    this.idx = i;

    const nameEl = document.getElementById('musicName');
    const artistEl = document.getElementById('musicArtist');
    const imgEl = document.getElementById('playImg');

    if (nameEl) nameEl.textContent = song.name;
    if (artistEl) artistEl.textContent = song.artist;
    if (imgEl) imgEl.src = `/images/${song.img}.jpeg`;
    if (this.audio) this.audio.src = `/songs/${song.audio}.mp3`;

    if (autoPlay) this.play();
  },

  play() {
    this.isPlaying = true;
    this.player?.classList.add('paused');
    const icon = document.getElementById('playIcon');
    if (icon) icon.textContent = 'pause';
    this.audio?.play().catch(() => {});
  },

  pause() {
    this.isPlaying = false;
    this.player?.classList.remove('paused');
    const icon = document.getElementById('playIcon');
    if (icon) icon.textContent = 'play_arrow';
    this.audio?.pause();
  },

  togglePlay() { this.isPlaying ? this.pause() : this.play(); },

  next() {
    this.loadSong((this.idx + 1) % SONGS.length, true);
  },

  prev() {
    this.loadSong((this.idx - 1 + SONGS.length) % SONGS.length, true);
  },

  open(i) {
    this.loadSong(i, true);
    this.container?.classList.add('show');
  },

  close() {
    this.pause();
    this.container?.classList.remove('show');
  },

  updateProgress() {
    const cur = this.audio?.currentTime;
    const dur = this.audio?.duration;
    if (isNaN(dur)) return;

    const pct = (cur / dur) * 100;
    const bar = document.getElementById('progressBar');
    if (bar) bar.style.width = `${pct}%`;

    const curEl = document.getElementById('currentTime');
    if (curEl) curEl.textContent = utils.formatTime(cur);
  },

  updateDuration() {
    const durEl = document.getElementById('finalTime');
    if (durEl && !isNaN(this.audio.duration)) {
      durEl.textContent = utils.formatTime(this.audio.duration);
    }
  }
};

// ============================================
// EFFECTS
// ============================================

const Effects = {
  init() {
    this.bubble();
    this.particles();
  },

  bubble() {
    const b = document.getElementById('lightBubble');
    if (!b) return;
    document.addEventListener('mousemove', utils.debounce(e => {
      b.style.backgroundPosition = `${e.clientX - 140}px ${e.clientY - 140}px`;
    }, 12));
  },

  particles() {
    const container = document.getElementById('particles');
    if (!container) return;

    setInterval(() => {
      const p = document.createElement('div');
      p.classList.add('particle');
      p.style.cssText = `
        left: ${utils.rand(0, 100)}vw;
        bottom: -10px;
        width: ${utils.rand(3, 8)}px;
        height: ${utils.rand(3, 8)}px;
        background: radial-gradient(circle, ${utils.randEl(CONFIG.particles.colors)}, transparent);
        animation-duration: ${utils.rand(6, 11)}s;
      `;
      container.appendChild(p);
      setTimeout(() => p.remove(), 11000);
    }, CONFIG.particles.interval);
  }
};

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

const Keys = {
  init() {
    document.addEventListener('keydown', e => {
      const open = document.getElementById('musicContainer')?.classList.contains('show');
      if (!open) return;
      switch (e.key) {
        case ' ': e.preventDefault(); MusicPlayer.togglePlay(); break;
        case 'ArrowRight': e.preventDefault(); MusicPlayer.next(); break;
        case 'ArrowLeft': e.preventDefault(); MusicPlayer.prev(); break;
        case 'Escape': MusicPlayer.close(); break;
      }
    });
  }
};

// ============================================
// CONTACT FORM
// ============================================

const ContactForm = {
  init() {
    document.getElementById('sendBtn')?.addEventListener('click', () => {
      const name = document.getElementById('contactName')?.value.trim();
      const email = document.getElementById('contactEmail')?.value.trim();
      const msg = document.getElementById('contactMessage')?.value.trim();

      if (!name || !email || !msg) {
        alert('Please fill in all fields!');
        return;
      }

      alert(`Thank you, ${name}! Your message has been received. We'll get back to you soon. 🎵`);
      document.getElementById('contactName').value = '';
      document.getElementById('contactEmail').value = '';
      document.getElementById('contactMessage').value = '';
    });
  }
};

// ============================================
// ACCESSIBILITY — skip link
// ============================================

const A11y = {
  init() {
    const skip = document.createElement('a');
    skip.href = '#home';
    skip.textContent = 'Skip to main content';
    skip.style.cssText = 'position:absolute;top:-40px;left:0;background:#a855f7;color:#fff;padding:8px 14px;z-index:10000;border-radius:0 0 6px 6px;font-size:14px;transition:top 0.2s';
    skip.addEventListener('focus', () => skip.style.top = '0');
    skip.addEventListener('blur', () => skip.style.top = '-40px');
    document.body.insertBefore(skip, document.body.firstChild);
  }
};

// ============================================
// INIT
// ============================================

function start() {
  console.log('🎵 K-ON! Portfolio — Elegant Edition');

  Theme.init();
  LoadingScreen.init();
  Navigation.init();
  Animations.init();
  Gallery.init();
  MusicPlayer.init();
  Effects.init();
  Keys.init();
  ContactForm.init();
  A11y.init();

  console.log('✨ All modules ready!');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
