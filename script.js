// script.js - core UI behaviors for Community Resource Hub
// Includes: mobile nav toggle, stats counter animation, smooth anchor scroll,
// active nav highlighting, and featured carousel behavior.

// Wrap everything to run after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  /* --------------------------
     Mobile Navigation Toggle
     -------------------------- */
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('open');
    });

    // Close menu when any nav link is clicked (useful on mobile)
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('open');
      });
    });
  }

  /* --------------------------
     Animated Counter for Stats
     -------------------------- */
  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'), 10) || 0;
    const duration = 1600; // total time ms
    const frameRate = 60; // approx frames/sec
    const totalFrames = Math.round((duration / 1000) * frameRate);
    let frame = 0;
    const start = 0;
    const easeOutQuad = t => t * (2 - t);

    const counter = setInterval(() => {
      frame++;
      const progress = easeOutQuad(frame / totalFrames);
      const value = Math.round(start + (target - start) * progress);
      element.textContent = value;
      if (frame >= totalFrames) {
        clearInterval(counter);
        element.textContent = target;
      }
    }, duration / totalFrames);
  }

  // Observe stats section once it's visible
  const statsSection = document.querySelector('.stats-section');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statNumbers = statsSection.querySelectorAll('.stat-number');
          statNumbers.forEach(stat => {
            if (!stat.classList.contains('animated')) {
              animateCounter(stat);
              stat.classList.add('animated');
            }
          });
          obs.unobserve(statsSection);
        }
      });
    }, { threshold: 0.4 });
    statsObserver.observe(statsSection);
  } else if (statsSection) {
    // Fallback: animate immediately if observer not supported
    statsSection.querySelectorAll('.stat-number').forEach(stat => animateCounter(stat));
  }

  /* --------------------------
     Smooth Scroll for anchor links
     -------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetSelector = this.getAttribute('href');
      const target = document.querySelector(targetSelector);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* --------------------------
     Add active class to current page nav link
     -------------------------- */
  (function highlightCurrentNav() {
    const links = document.querySelectorAll('.nav-link');
    // Derive current filename (index.html fallback)
    const pathParts = window.location.pathname.split('/');
    let currentFile = pathParts.pop() || pathParts.pop() || 'index.html'; // handle trailing slash
    // If no explicit filename, assume index.html
    if (!currentFile.includes('.html')) {
      currentFile = 'index.html';
    }
    links.forEach(link => {
      const href = link.getAttribute('href') || '';
      // Compare only the filename part of href
      const hrefFile = href.split('/').pop();
      if (hrefFile === currentFile) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  })();

  /* --------------------------
     Featured Resources Carousel
     -------------------------- */
  const carouselSlides = Array.from(document.querySelectorAll('.carousel-slide'));
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const playPauseBtn = document.querySelector('.carousel-btn.play-pause');
  const currentSlideSpan = document.getElementById('currentSlide');
  const totalSlidesSpan = document.getElementById('totalSlides');
  let carouselState = {
    current: 0,
    isPlaying: true,
    autoplayIntervalId: null,
    autoplayDelay: 5000
  };

  function showSlide(index) {
    if (!carouselSlides.length) return;
    carouselSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    carouselState.current = index;
    if (currentSlideSpan) currentSlideSpan.textContent = (index + 1).toString();
  }

  function nextSlide() {
    if (!carouselSlides.length) return;
    const nextIndex = (carouselState.current + 1) % carouselSlides.length;
    showSlide(nextIndex);
  }

  function prevSlide() {
    if (!carouselSlides.length) return;
    const prevIndex = (carouselState.current - 1 + carouselSlides.length) % carouselSlides.length;
    showSlide(prevIndex);
  }

  function startAutoplay() {
    stopAutoplay(); // clear existing
    carouselState.autoplayIntervalId = setInterval(nextSlide, carouselState.autoplayDelay);
    carouselState.isPlaying = true;
    if (playPauseBtn) {
      playPauseBtn.textContent = '❚❚';
      playPauseBtn.setAttribute('aria-label', 'Pause carousel');
    }
  }

  function stopAutoplay() {
    if (carouselState.autoplayIntervalId) {
      clearInterval(carouselState.autoplayIntervalId);
      carouselState.autoplayIntervalId = null;
    }
    carouselState.isPlaying = false;
    if (playPauseBtn) {
      playPauseBtn.textContent = '▶';
      playPauseBtn.setAttribute('aria-label', 'Play carousel');
    }
  }

  if (carouselSlides.length > 0) {
    // Initialize total slides counter
    if (totalSlidesSpan) totalSlidesSpan.textContent = carouselSlides.length.toString();
    // Ensure first slide is visible
    showSlide(0);

    // Buttons
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoplay();
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoplay();
      });
    }
    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', () => {
        if (carouselState.isPlaying) {
          stopAutoplay();
        } else {
          startAutoplay();
        }
      });
    }

    // Start autoplay by default
    startAutoplay();

    // Keyboard support: left/right arrows
    document.addEventListener('keydown', (e) => {
      if (document.activeElement && /input|textarea/i.test(document.activeElement.tagName)) {
        // don't intercept arrow keys while typing
        return;
      }
      if (e.key === 'ArrowLeft') {
        prevSlide();
        stopAutoplay();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        stopAutoplay();
      }
    });
  }

  /* --------------------------
     Utility: close any open dropdowns (if implemented later)
     -------------------------- */
  document.addEventListener('click', (e) => {
    // Placeholder for future global click handlers (e.g., close popovers)
  });

  /* --------------------------
     Small accessibility touch:
     - Ensure carousel controls have role/buttons properties if missing
     -------------------------- */
  [prevBtn, nextBtn, playPauseBtn].forEach(btn => {
    if (btn) {
      btn.setAttribute('role', 'button');
      btn.tabIndex = 0;
    }
  });
});