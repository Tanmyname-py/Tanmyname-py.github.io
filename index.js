/**
 * K-ON! Portfolio - Main JavaScript
 * Structure: Utilities > Navigation > Animations > Music Player > Effects
 */

// ============================================
// CONFIGURATION & DATA
// ============================================

const CONFIG = {
  particles: {
    interval: 300, // ms
    colors: [
      "rgba(124, 240, 61, 0.9)",
      "rgba(65, 154, 255, 0.9)",
      "rgba(140, 0, 210, 0.9)",
      "rgba(255, 200, 0, 0.9)"
    ]
  },
  gallery: {
    animationDuration: "30s"
  },
  intersection: {
    threshold: 0.2
  }
};

const SONGS = [
  {
    name: "Tenshi ni Fureta yo!",
    artist: "Hōkago Tea Time",
    img: "album",
    audio: "Tenshi-ni-fureta",
    description: "A heartfelt ballad about cherished memories"
  },
  {
    name: "Watashi no Koi wa Hotch Kiss",
    artist: "Hōkago Tea Time",
    img: "album-2",
    audio: "watashi-no-koi",
    description: "An energetic love song"
  },
  {
    name: "Fuwa Fuwa Time",
    artist: "Hōkago Tea Time",
    img: "album-3",
    audio: "fuwa-fuwa-time",
    description: "The band's signature sweet song"
  },
  {
    name: "Pure Pure Heart",
    artist: "Hōkago Tea Time",
    img: "album-4",
    audio: "kon-pich-daisuki",
    description: "An upbeat tune celebrating youth"
  }
];

// ============================================
// DOM ELEMENTS
// ============================================

const DOM = {
  // Navigation
  nav: document.querySelector('.navbar'),
  toggle: document.querySelector('.toggle'),
  navLinks: document.querySelectorAll('.nav-link'),
  
  // Fade elements
  faders: document.querySelectorAll('.fade'),
  
  // Gallery
  gallery: document.querySelector('.memories-galery'),
  galleryReverse: document.querySelector('.memories-galery-reverse'),
  
  // Albums
  albumList: document.querySelector('.list-album'),
  
  // Music Player
  musicContainer: document.querySelector('.music-container'),
  musicPlayer: document.querySelector('.music-player'),
  playImg: document.querySelector('.music-image img'),
  musicName: document.querySelector('.music-titles .name'),
  musicArtist: document.querySelector('.music-titles .artist'),
  audio: document.querySelector('.main-songs'),
  playBtn: document.querySelector('.play-pause'),
  playBtnIcon: document.querySelector('.play-pause span'),
  prevBtn: document.querySelector('#prev'),
  nextBtn: document.querySelector('#next'),
  progressBar: document.querySelector('.progress-bar span'),
  progressDetails: document.querySelector('.progress-details'),
  repeatBtn: document.querySelector('#repeat'),
  closeModal: document.querySelector('.close-modal'),
  
  // Effects
  bubble: document.querySelector('.light-bubble'),
  particlesContainer: document.getElementById('particles')
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

const utils = {
  /**
   * Format time in seconds to MM:SS
   */
  formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  },
  
  /**
   * Debounce function for performance
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  /**
   * Random number generator
   */
  random(min, max) {
    return Math.random() * (max - min) + min;
  },
  
  /**
   * Random array element
   */
  randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
};

// ============================================
// NAVIGATION MODULE
// ============================================

const Navigation = {
  init() {
    this.setupToggle();
    this.setupScroll();
    this.setupSmoothScroll();
  },
  
  setupToggle() {
    DOM.toggle?.addEventListener('click', () => {
      DOM.toggle.classList.toggle('active');
      DOM.nav.classList.toggle('show');
    });
    
    // Close menu when clicking nav link
    DOM.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        DOM.toggle?.classList.remove('active');
        DOM.nav.classList.remove('show');
      });
    });
  },
  
  setupScroll() {
    let lastScroll = 0;
    const handleScroll = utils.debounce(() => {
      const scrollY = window.scrollY;
      
      if (scrollY > 80) {
        DOM.nav.classList.add('scrolling');
      } else {
        DOM.nav.classList.remove('scrolling');
      }
      
      lastScroll = scrollY;
    }, 10);
    
    window.addEventListener('scroll', handleScroll);
  },
  
  setupSmoothScroll() {
    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    const highlightNav = () => {
      const scrollY = window.scrollY;
      
      sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink?.classList.add('active');
        } else {
          navLink?.classList.remove('active');
        }
      });
    };
    
    window.addEventListener('scroll', utils.debounce(highlightNav, 10));
  }
};

// ============================================
// ANIMATION MODULE
// ============================================

const Animations = {
  init() {
    this.setupFadeInObserver();
  },
  
  setupFadeInObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        } else {
          // Optional: remove class when scrolling away
          // entry.target.classList.remove('show');
        }
      });
    }, {
      threshold: CONFIG.intersection.threshold,
      rootMargin: '0px 0px -50px 0px'
    });
    
    DOM.faders.forEach(fade => observer.observe(fade));
  }
};

// ============================================
// GALLERY MODULE
// ============================================

const Gallery = {
  init() {
    this.duplicateItems();
  },
  
  duplicateItems() {
    // Duplicate for seamless loop
    if (DOM.gallery) {
      const items = [...DOM.gallery.children];
      items.forEach(item => {
        const clone = item.cloneNode(true);
        DOM.gallery.appendChild(clone);
      });
    }
    
    if (DOM.galleryReverse) {
      const itemsReverse = [...DOM.galleryReverse.children];
      itemsReverse.forEach(item => {
        const clone = item.cloneNode(true);
        DOM.galleryReverse.appendChild(clone);
      });
    }
  }
};

// ============================================
// MUSIC PLAYER MODULE
// ============================================

const MusicPlayer = {
  currentIndex: 0,
  
  init() {
    this.setupEventListeners();
    this.loadSong(0);
  },
  
  setupEventListeners() {
    // Play/Pause
    DOM.playBtn?.addEventListener('click', () => this.togglePlay());
    
    // Navigation
    DOM.nextBtn?.addEventListener('click', () => this.nextSong());
    DOM.prevBtn?.addEventListener('click', () => this.prevSong());
    
    // Repeat
    DOM.repeatBtn?.addEventListener('click', () => this.repeatSong());
    
    // Progress
    DOM.audio?.addEventListener('timeupdate', () => this.updateProgress());
    DOM.audio?.addEventListener('loadeddata', () => this.updateDuration());
    DOM.progressDetails?.addEventListener('click', (e) => this.seekTo(e));
    
    // Album clicks
    this.setupAlbumClicks();
    
    // Close modal
    DOM.closeModal?.addEventListener('click', () => this.closePlayer());
  },
  
  loadSong(index) {
    if (!SONGS[index]) return;
    
    const song = SONGS[index];
    this.currentIndex = index;
    
    DOM.musicName.textContent = song.name;
    DOM.musicArtist.textContent = song.artist;
    DOM.playImg.src = `/images/${song.img}.jpeg`;
    DOM.audio.src = `/songs/${song.audio}.mp3`;
  },
  
  togglePlay() {
    const isPaused = !DOM.musicPlayer.classList.contains('paused');
    
    if (isPaused) {
      this.play();
    } else {
      this.pause();
    }
  },
  
  play() {
    DOM.musicPlayer.classList.add('paused');
    DOM.playBtnIcon.textContent = 'pause';
    DOM.audio.play();
  },
  
  pause() {
    DOM.musicPlayer.classList.remove('paused');
    DOM.playBtnIcon.textContent = 'play_arrow';
    DOM.audio.pause();
  },
  
  nextSong() {
    this.currentIndex++;
    if (this.currentIndex >= SONGS.length) {
      this.currentIndex = 0;
    }
    this.loadSong(this.currentIndex);
    this.play();
  },
  
  prevSong() {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = SONGS.length - 1;
    }
    this.loadSong(this.currentIndex);
    this.play();
  },
  
  repeatSong() {
    DOM.audio.currentTime = 0;
    this.play();
  },
  
  updateProgress() {
    const currentTime = DOM.audio.currentTime;
    const duration = DOM.audio.duration;
    
    if (!isNaN(duration)) {
      const progressPercent = (currentTime / duration) * 100;
      DOM.progressBar.style.width = `${progressPercent}%`;
      
      // Update current time display
      const currentTimeDisplay = document.querySelector('.time .current');
      if (currentTimeDisplay) {
        currentTimeDisplay.textContent = utils.formatTime(currentTime);
      }
    }
  },
  
  updateDuration() {
    const duration = DOM.audio.duration;
    const finalTimeDisplay = document.querySelector('.time .final');
    
    if (finalTimeDisplay && !isNaN(duration)) {
      finalTimeDisplay.textContent = utils.formatTime(duration);
    }
  },
  
  seekTo(e) {
    const progressWidth = DOM.progressDetails.clientWidth;
    const clickX = e.offsetX;
    const duration = DOM.audio.duration;
    
    if (!isNaN(duration)) {
      DOM.audio.currentTime = (clickX / progressWidth) * duration;
    }
  },
  
  setupAlbumClicks() {
    DOM.albumList?.addEventListener('click', (e) => {
      const albumImg = e.target.closest('.album-body img');
      if (!albumImg) return;
      
      // Find which album was clicked
      const albumClasses = ['album-1', 'album-2', 'album-3', 'album-4'];
      const clickedIndex = albumClasses.findIndex(cls => albumImg.classList.contains(cls));
      
      if (clickedIndex !== -1) {
        this.openPlayer(clickedIndex);
      }
    });
  },
  
  openPlayer(songIndex) {
    this.loadSong(songIndex);
    DOM.musicContainer.classList.add('show');
    this.play();
  },
  
  closePlayer() {
    this.pause();
    DOM.musicContainer.classList.remove('show');
  }
};

// ============================================
// EFFECTS MODULE
// ============================================

const Effects = {
  init() {
    this.setupBubble();
    this.startParticles();
  },
  
  setupBubble() {
    document.addEventListener('mousemove', utils.debounce((e) => {
      const x = e.clientX;
      const y = e.clientY;
      DOM.bubble.style.backgroundPosition = `${x - 100}px ${y - 100}px`;
    }, 10));
  },
  
  startParticles() {
    setInterval(() => this.createParticle(), CONFIG.particles.interval);
  },
  
  createParticle() {
    if (!DOM.particlesContainer) return;
    
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random position
    particle.style.left = `${utils.random(0, 100)}vw`;
    particle.style.bottom = '-10px';
    
    // Random size
    const size = utils.random(4, 10);
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random duration
    const duration = utils.random(5, 10);
    particle.style.animationDuration = `${duration}s`;
    
    // Random color
    const color = utils.randomElement(CONFIG.particles.colors);
    particle.style.background = `radial-gradient(circle, ${color}, transparent)`;
    
    DOM.particlesContainer.appendChild(particle);
    
    // Remove after animation
    setTimeout(() => {
      particle.remove();
    }, duration * 1000);
  }
};

// ============================================
// LOADING SCREEN
// ============================================

const LoadingScreen = {
  init() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
          loadingScreen.style.display = 'none';
        }
      }, 2500);
    });
  }
};

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

const KeyboardShortcuts = {
  init() {
    document.addEventListener('keydown', (e) => {
      // Only if music player is open
      if (!DOM.musicContainer.classList.contains('show')) return;
      
      switch(e.key) {
        case ' ': // Space - play/pause
          e.preventDefault();
          MusicPlayer.togglePlay();
          break;
        case 'ArrowRight': // Next song
          e.preventDefault();
          MusicPlayer.nextSong();
          break;
        case 'ArrowLeft': // Previous song
          e.preventDefault();
          MusicPlayer.prevSong();
          break;
        case 'Escape': // Close player
          MusicPlayer.closePlayer();
          break;
      }
    });
  }
};

// ============================================
// CONTACT FORM (Optional Enhancement)
// ============================================

const ContactForm = {
  init() {
    const form = document.querySelector('.contact-form');
    const button = form?.querySelector('button');
    
    button?.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleSubmit(form);
    });
  },
  
  handleSubmit(form) {
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = 'red';
        setTimeout(() => {
          input.style.borderColor = '';
        }, 2000);
      }
    });
    
    if (isValid) {
      // Here you would normally send the data to a server
      alert('Thank you for your message! We\'ll get back to you soon. 🎵');
      form.reset();
    } else {
      alert('Please fill in all fields!');
    }
  }
};

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

const Performance = {
  init() {
    // Lazy load images
    this.lazyLoadImages();
    
    // Preload critical assets
    this.preloadAssets();
  },
  
  lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  },
  
  preloadAssets() {
    // Preload first song
    if (SONGS[0]) {
      const audio = new Audio();
      audio.src = `/songs/${SONGS[0].audio}.mp3`;
      audio.preload = 'metadata';
    }
  }
};

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================

const Accessibility = {
  init() {
    // Skip to content link
    this.addSkipLink();
    
    // Focus management
    this.manageFocus();
  },
  
  addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#home';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 0;
      background: var(--clr-primary);
      color: white;
      padding: 8px;
      z-index: 10000;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '0';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  },
  
  manageFocus() {
    // Trap focus in modal when open
    const modal = DOM.musicContainer;
    
    modal?.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('show')) return;
      
      if (e.key === 'Tab') {
        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }
};

// ============================================
// INITIALIZATION
// ============================================

class App {
  constructor() {
    this.init();
  }
  
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      this.start();
    }
  }
  
  start() {
    console.log('🎵 K-ON! Portfolio Initialized');
    
    // Initialize all modules
    LoadingScreen.init();
    Navigation.init();
    Animations.init();
    Gallery.init();
    MusicPlayer.init();
    Effects.init();
    KeyboardShortcuts.init();
    ContactForm.init();
    Performance.init();
    Accessibility.init();
    
    console.log('✨ All modules loaded successfully!');
  }
}

// Start the application
const app = new App();

// Export for potential future use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { App, MusicPlayer, Navigation, Animations };
}
