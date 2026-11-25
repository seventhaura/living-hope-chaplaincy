/* Living Hope Chaplaincy — homepage v2 interactions (vanilla JS, no dependencies) */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var header = document.getElementById('site-header');
  var intro = document.querySelector('.intro');
  var tree = document.querySelector('.intro-tree');
  var turn1 = document.querySelector('.turn-1');
  var turn2 = document.querySelector('.turn-2');
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

  // Partners page: "Talk with us" links pre-select the topic; ?about=hospital|church works too
  var about = document.getElementById('pf-about');
  var topics = { hospital: 'Hospital partnership', church: 'Church partnership', visit: 'Request a visit', other: 'Other' };
  if (about) {
    document.querySelectorAll('[data-topic]').forEach(function (a) {
      a.addEventListener('click', function () { about.value = topics[a.getAttribute('data-topic')] || ''; });
    });
    var q = new URLSearchParams(location.search).get('about');
    if (q && topics[q]) about.value = topics[q];
  }

  // Contact forms (partners.html #partner-form, homepage "Get in touch" strip #contact-strip-form).
  // Static site, so each form posts to its data-endpoint if one is set (e.g. Formspree);
  // otherwise it shows its thank-you state and says nothing was sent.
  // Each form: data-contact-form, data-thanks="<id of thank-you element>", optional data-error="<message>".
  // A field with data-validate="email-or-phone" accepts either an email address or a phone number.
  var emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  function fieldOk(f) {
    var v = f.value.trim();
    if (v === '') return false;
    if (f.getAttribute('data-validate') === 'email-or-phone') return emailRe.test(v) || v.replace(/\D/g, '').length >= 7;
    return f.type !== 'email' || emailRe.test(v);
  }
  document.querySelectorAll('form[data-contact-form]').forEach(function (cform) {
    var errBox = cform.querySelector('.form-error');
    var thanks = document.getElementById(cform.getAttribute('data-thanks'));
    var btn = cform.querySelector('button[type="submit"]');
    if (!errBox || !thanks || !btn) return; // incomplete markup: leave the form alone
    var btnLabel = btn.textContent;
    var errMsg = cform.getAttribute('data-error') || 'Please fill in the required fields.';
    function showThanks(note) {
      cform.hidden = true; thanks.hidden = false;
      if (note) {
        var p = document.createElement('p'); p.className = 'form-note'; p.textContent = note; thanks.appendChild(p);
      }
      thanks.focus();
    }
    cform.addEventListener('submit', function (e) {
      e.preventDefault();
      errBox.hidden = true;
      var bad = [];
      cform.querySelectorAll('[required]').forEach(function (f) {
        var ok = fieldOk(f);
        f.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok) bad.push(f);
      });
      if (bad.length) {
        errBox.textContent = errMsg;
        errBox.hidden = false; bad[0].focus(); return;
      }
      var trap = cform.querySelector('[name="_gotcha"]');
      if (trap && trap.value) return; // likely a bot
      var endpoint = cform.getAttribute('data-endpoint');
      if (!endpoint) { showThanks('Preview note: this form is not connected yet, so nothing was sent.'); return; }
      btn.disabled = true; btn.textContent = 'Sending…';
      fetch(endpoint, { method: 'POST', body: new FormData(cform), headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); showThanks(); })
        .catch(function () {
          btn.disabled = false; btn.textContent = btnLabel;
          errBox.textContent = 'Sorry, your message could not be sent. Please try again or call (832) 916-4555.';
          errBox.hidden = false;
        });
    });
  });

  // Partners and volunteer pages: highlight the switcher button for the section in view.
  // On the volunteer page both buttons point into the forms section, so the visible tab wins.
  var switches = Array.prototype.slice.call(document.querySelectorAll('.switch-btn'));
  var currentSec = null;
  function markSwitches() {
    switches.forEach(function (s) {
      var el = document.getElementById(s.getAttribute('href').slice(1));
      var on = !!el && !!currentSec && (el.closest('section.section') || el) === currentSec && !el.hidden;
      s.classList.toggle('is-active', on);
    });
  }
  if (switches.length && 'IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) currentSec = en.target;
        else if (currentSec === en.target) currentSec = null;
      });
      markSwitches();
    }, { rootMargin: '-45% 0px -50% 0px' });
    switches.forEach(function (s) {
      var el = document.getElementById(s.getAttribute('href').slice(1));
      if (el) so.observe(el.closest('section.section') || el);
    });
  }

  // Volunteer page: "Join the team" / "Log a visit" tabs. Without JS both panels simply show.
  // Links to #join or #log-visit (from anywhere on the page or another page) open the right tab.
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.form-tab'));
  if (tabs.length) {
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    var tabWrap = tabs[0].closest('.section');
    tabWrap.classList.add('tabs-ready');
    function selectTab(i, focusTab) {
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      if (focusTab) tabs[i].focus();
      markSwitches();
    }
    function panelIndex(hash) {
      var id = (hash || '').replace('#', '');
      for (var i = 0; i < panels.length; i++) if (panels[i].id === id) return i;
      return -1;
    }
    function openFromHash(hash, smooth) {
      var i = panelIndex(hash);
      if (i < 0) return false;
      selectTab(i);
      panels[i].scrollIntoView({ behavior: smooth && !reduce.matches ? 'smooth' : 'auto', block: 'start' });
      return true;
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { selectTab(i); history.replaceState(null, '', '#' + panels[i].id); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, n = tabs.length, j = -1;
        if (k === 'ArrowRight' || k === 'ArrowDown') j = (i + 1) % n;
        else if (k === 'ArrowLeft' || k === 'ArrowUp') j = (i - 1 + n) % n;
        else if (k === 'Home') j = 0;
        else if (k === 'End') j = n - 1;
        if (j < 0) return;
        e.preventDefault(); selectTab(j, true);
      });
    });
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a || panelIndex(a.getAttribute('href')) < 0) return;
      e.preventDefault();
      history.pushState(null, '', a.getAttribute('href'));
      openFromHash(a.getAttribute('href'), true);
    });
    window.addEventListener('hashchange', function () { openFromHash(location.hash, true); });
    selectTab(Math.max(0, panelIndex(location.hash)));
    if (panelIndex(location.hash) >= 0) {
      // wait for layout (fonts, lazy images) before jumping to the panel
      window.addEventListener('load', function () { openFromHash(location.hash, false); });
    }
  }

  // ===== Trainings page (trainings.html): lazy video players and the certification quiz =====
  // Everything below does nothing on pages without these elements.
  document.querySelectorAll('.video-play[data-video-id]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-video-id');
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0';
      f.title = btn.getAttribute('data-video-title') || 'Lesson video';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      f.allowFullscreen = true;
      f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      btn.replaceWith(f);
      f.focus();
    });
  });

  var quiz = document.getElementById('training-quiz');
  if (quiz) {
    var qs = Array.prototype.slice.call(quiz.querySelectorAll('.quiz-q'));
    var qErr = quiz.querySelector('.form-error');
    var qResult = document.getElementById('quiz-result');
    var qSubmit = quiz.querySelector('.quiz-submit');
    var qName = document.getElementById('tq-name');
    var qEmail = document.getElementById('tq-email');
    function answered(q) {
      if (q.getAttribute('data-type') === 'text') return q.querySelector('textarea').value.trim() !== '';
      return !!q.querySelector('input:checked');
    }
    function lock(on) {
      quiz.querySelectorAll('.quiz-q input, .quiz-q textarea, .quiz-who input').forEach(function (el) {
        if (el.tagName === 'TEXTAREA' || el.type === 'text' || el.type === 'email') el.readOnly = on; else el.disabled = on;
      });
    }
    quiz.addEventListener('change', function (e) {
      var q = e.target.closest('.quiz-q'); if (q && answered(q)) q.classList.remove('is-missing');
    });
    quiz.addEventListener('input', function (e) {
      var q = e.target.closest('.quiz-q'); if (q && answered(q)) q.classList.remove('is-missing');
    });
    quiz.addEventListener('submit', function (e) {
      e.preventDefault();
      qErr.hidden = true;
      var firstBad = null;
      [qName, qEmail].forEach(function (f) {
        var ok = fieldOk(f);
        f.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok && !firstBad) firstBad = f;
      });
      var missing = qs.filter(function (q) { var m = !answered(q); q.classList.toggle('is-missing', m); return m; });
      if (firstBad || missing.length) {
        var parts = [];
        if (firstBad) parts.push('your name and a valid email');
        if (missing.length) parts.push(missing.length === 1 ? 'question ' + missing[0].id.slice(1) : missing.length + ' questions (' + missing.map(function (q) { return q.id.slice(1); }).join(', ') + ')');
        qErr.textContent = 'Please fill in ' + parts.join(' and ') + '.';
        qErr.hidden = false;
        var target = firstBad || missing[0].querySelector('input, textarea');
        target.focus();
        return;
      }
      var right = 0, scored = 0;
      qs.forEach(function (q) {
        var fb = q.querySelector('.q-feedback');
        q.classList.remove('is-right', 'is-wrong', 'is-review');
        q.classList.add('is-done');
        if (q.getAttribute('data-type') === 'text') {
          q.classList.add('is-review');
          fb.innerHTML = '<strong>Thank you.</strong> Written answers are reviewed by our team.';
        } else {
          scored++;
          var ans = q.getAttribute('data-answer');
          var pick = q.querySelector('input:checked').value;
          var ok = pick === ans;
          if (ok) right++;
          q.classList.add(ok ? 'is-right' : 'is-wrong');
          var correct = q.querySelector('input[value="' + ans + '"]');
          if (!ok && correct) correct.closest('.q-option').classList.add('is-answer');
          var label = correct ? correct.nextElementSibling.textContent : '';
          fb.innerHTML = '';
          var strong = document.createElement('strong');
          strong.textContent = ok ? 'That\u2019s right. ' : 'Not quite. The answer is \u201c' + label + '.\u201d ';
          fb.appendChild(strong);
          fb.appendChild(document.createTextNode(q.getAttribute('data-explain') || ''));
        }
        fb.hidden = false;
      });
      lock(true);
      qSubmit.hidden = true;
      qResult.querySelector('.quiz-score').textContent = 'You answered ' + right + ' of ' + scored + ' correctly';
      qResult.querySelector('.quiz-score-note').textContent = (right === scored ? 'Wonderful work. ' : 'Thank you for taking the quiz. ') +
        'Your two written answers will be reviewed by our team, and we\u2019ll follow up with you about next steps. You can scroll up to see feedback on each question.';
      qResult.hidden = false;
      qResult.focus();
      var endpoint = quiz.getAttribute('data-endpoint');
      if (!endpoint) { qResult.querySelector('.quiz-demo-note').hidden = false; return; }
      var data = new FormData();
      data.append('name', qName.value.trim()); data.append('email', qEmail.value.trim());
      data.append('score', right + '/' + scored);
      qs.forEach(function (q) {
        var v = q.getAttribute('data-type') === 'text' ? q.querySelector('textarea').value.trim()
          : q.querySelector('input:checked').nextElementSibling.textContent;
        data.append(q.id + ' ' + q.querySelector('.q-text').textContent, v);
      });
      fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } }).catch(function () {
        var n = qResult.querySelector('.quiz-demo-note');
        n.textContent = 'Sorry, your answers could not be sent. Please call (832) 916-4555.'; n.hidden = false;
      });
    });
    document.getElementById('quiz-retake').addEventListener('click', function () {
      lock(false);
      var keepName = qName.value, keepEmail = qEmail.value;
      quiz.reset();
      qName.value = keepName; qEmail.value = keepEmail; // keep who is taking it
      qs.forEach(function (q) {
        q.classList.remove('is-right', 'is-wrong', 'is-review', 'is-done', 'is-missing');
        q.querySelector('.q-feedback').hidden = true;
        q.querySelectorAll('.is-answer').forEach(function (o) { o.classList.remove('is-answer'); });
      });
      qResult.hidden = true; qSubmit.hidden = false;
      qResult.querySelector('.quiz-demo-note').hidden = true;
      qs[0].scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'center' });
    });
  }

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
    if (!intro) header.classList.add('is-visible');

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
      intro.classList.toggle('is-offscreen', p >= 1);
      // leaves: sway amplitude (degrees) grows with the push-in, then settles
      tree.style.setProperty('--sp', p.toFixed(4));
      tree.style.setProperty('--amp', (Math.min(1, p * 6) * 5).toFixed(2));
      // the open book: two pages turn, one after the other, early in the scroll
      var t1 = clamp((p - 0.04) / 0.24), t2 = clamp((p - 0.16) / 0.24);
      var e1 = t1 * t1 * (3 - 2 * t1), e2 = t2 * t2 * (3 - 2 * t2);
      tree.style.setProperty('--t1', e1.toFixed(4));
      tree.style.setProperty('--t2', e2.toFixed(4));
      turn1.classList.toggle('is-turning', t1 > 0 && t1 < 1);
      turn2.classList.toggle('is-turning', t2 > 0 && t2 < 1);
    }

    // Header slides in once the opening is done
    header.classList.toggle('is-visible', intro ? sy > (intro.offsetHeight - vh) * 0.95 : true);

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
