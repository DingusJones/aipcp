/* ============================================
   AIPCP — Interactions
   ============================================ */

(function () {
  'use strict';

  /* ---------- Loading Spinner ---------- */
  function initLoadingSpinner() {
    var overlay = document.querySelector('.loading-overlay');
    if (!overlay) return;

    // Only show once per session
    if (sessionStorage.getItem('aipcp-loaded')) {
      overlay.style.display = 'none';
      return;
    }

    // Intentionally slow — 2.5 seconds
    setTimeout(function () {
      overlay.classList.add('hidden');
      sessionStorage.setItem('aipcp-loaded', '1');
      setTimeout(function () {
        overlay.style.display = 'none';
      }, 800);
    }, 2500);
  }

  /* ---------- Cookie Banner ---------- */
  function initCookieBanner() {
    var banner = document.querySelector('.cookie-banner');
    if (!banner) return;

    if (localStorage.getItem('aipcp-cookies')) {
      banner.style.display = 'none';
      return;
    }

    setTimeout(function () {
      banner.classList.add('visible');
    }, 1500);

    var btn = banner.querySelector('button');
    if (btn) {
      btn.addEventListener('click', function () {
        localStorage.setItem('aipcp-cookies', '1');
        banner.classList.remove('visible');
        setTimeout(function () {
          banner.style.display = 'none';
        }, 600);
      });
    }
  }

  /* ---------- Mobile Nav Toggle ---------- */
  function initNavToggle() {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  /* ---------- Lazy Fade-In ---------- */
  function initLazyFadeIn() {
    var cards = document.querySelectorAll('.artwork-card, .merch-card, .tier-card, .press-card');
    if (!cards.length) return;

    if (!('IntersectionObserver' in window)) {
      cards.forEach(function (c) { c.classList.add('fade-in'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    cards.forEach(function (card) {
      card.style.opacity = '0';
      observer.observe(card);
    });
  }

  /* ---------- Acquire Button Hover Text ---------- */
  function initAcquireButtons() {
    var buttons = document.querySelectorAll('.acquire-btn');
    buttons.forEach(function (btn) {
      var hoverText = btn.getAttribute('data-hover-text');
      if (!hoverText) return;
      var originalText = btn.textContent;

      btn.addEventListener('mouseenter', function () {
        btn.textContent = hoverText;
      });
      btn.addEventListener('mouseleave', function () {
        btn.textContent = originalText;
      });

      // Touch support
      btn.addEventListener('touchstart', function () {
        if (btn.textContent === originalText) {
          btn.textContent = hoverText;
        } else {
          btn.textContent = originalText;
        }
      });
    });
  }

  /* ---------- Purchase Button Alert ---------- */
  function initPurchaseButtons() {
    var buttons = document.querySelectorAll('.purchase-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        alert('This item is curatorial. It cannot be purchased. That is the point.');
      });
    });
  }

  /* ---------- Submission Form ---------- */
  function initSubmissionForm() {
    var form = document.querySelector('.submission-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = form.querySelector('.form-message');
      if (msg) {
        msg.classList.add('visible');
        form.querySelectorAll('input, textarea, select').forEach(function (el) {
          el.value = '';
        });
      }
    });
  }

  /* ---------- Back to Top (Slow) ---------- */
  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      var scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent > 0.5) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', function () {
      // Intentionally slow — "the descent from art should be gradual"
      var duration = 4000;
      var start = window.scrollY;
      var startTime = performance.now();

      function scrollStep(currentTime) {
        var elapsed = currentTime - startTime;
        var progress = Math.min(elapsed / duration, 1);
        // ease-in-out cubic
        var eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        window.scrollTo(0, start * (1 - eased));

        if (progress < 1) {
          requestAnimationFrame(scrollStep);
        }
      }

      requestAnimationFrame(scrollStep);
    });
  }

  /* ---------- Tooltips ---------- */
  function initTooltips() {
    var titles = document.querySelectorAll('[data-tooltip]');
    if (!titles.length) return;

    var tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);

    titles.forEach(function (el) {
      el.addEventListener('mouseenter', function (e) {
        tooltip.textContent = el.getAttribute('data-tooltip');
        tooltip.classList.add('visible');
        var rect = el.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.bottom + 8) + 'px';
      });

      el.addEventListener('mouseleave', function () {
        tooltip.classList.remove('visible');
      });
    });
  }

  /* ---------- Init All ---------- */
  function init() {
    initLoadingSpinner();
    initCookieBanner();
    initNavToggle();
    initLazyFadeIn();
    initAcquireButtons();
    initPurchaseButtons();
    initSubmissionForm();
    initBackToTop();
    initTooltips();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();