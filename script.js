/* Living Hope Chaplaincy — homepage v2 interactions (vanilla JS, no dependencies) */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var header = document.getElementById('site-header');
  var intro = document.querySelector('.intro');
  var tree = document.querySelector('.intro-tree');
  var zooms = document.querySelectorAll('.zoom');

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('primary-nav');
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
  }
  toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // Subscribe form: not connected yet (see README TODO)
  var form = document.querySelector('.subscribe-form');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    document.querySelector('.form-msg').textContent = 'Thank you! (Sign-up is not connected yet in this preview.)';
  });

  // Gentle reveal as each section enters
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce.matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  function clamp(v) { return Math.max(0, Math.min(1, v)); }
  function ease(t) { return t * t * t; } // slow start, then rushes in

  var ticking = false;
  function update() {
    ticking = false;
    var vh = window.innerHeight;
    var sy = window.scrollY;

    if (reduce.matches) { header.classList.add('is-visible'); return; }

    // Opening: pinned, scroll-scrubbed push into the tree
    var p = 0;
    if (intro) {
      var total = intro.offsetHeight - vh;
      p = clamp(sy / total);
      intro.style.setProperty('--p', p.toFixed(4));
      // zoom: up to ~14x over the first 85% of the pin, eased so the start feels calm
      var zp = clamp(p / 0.85);
      tree.style.setProperty('--z', (ease(zp) * 13).toFixed(3));
      // the tree dissolves while the mission section rises over it
      tree.style.setProperty('--fade', clamp((p - 0.55) / 0.3).toFixed(3));
      intro.style.setProperty('--veil', clamp((p - 0.7) / 0.3).toFixed(3));
      intro.classList.toggle('is-moving', p > 0.02);
    }

    // Header slides in once the opening is done
    header.classList.toggle('is-visible', intro ? sy > (intro.offsetHeight - vh) * 0.95 : sy > 40);

    // Photos gently settle (zoom out) as they move through the viewport
    zooms.forEach(function (img) {
      var r = img.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      img.style.setProperty('--zz', clamp((vh - r.top) / (vh + r.height)).toFixed(3));
    });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  reduce.addEventListener && reduce.addEventListener('change', onScroll);
  update();
})();
