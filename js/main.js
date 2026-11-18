(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement;
  const themeBtn = $('#themeToggle');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    try { localStorage.setItem('theme', theme); } catch (e) {}
  }
  applyTheme(root.getAttribute('data-theme') || 'light');
  themeBtn.addEventListener('click', () =>
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

  /* ---------- Mobile menu ---------- */
  const burger = $('#burger');
  const nav = $('#nav');

  function setMenu(open) {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  $$('.nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Scroll: progress bar, header shadow, back-to-top ---------- */
  const progress = $('#progress');
  const header = $('#header');
  const toTop = $('#toTop');
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    header.classList.toggle('scrolled', y > 10);
    toTop.classList.toggle('show', y > 500);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Reveal on scroll (with small stagger) ---------- */
  $$('.reveal').forEach((el, i) => {
    el.style.setProperty('--delay', `${(i % 4) * 0.08}s`);
  });

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  $$('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------- Animated counters ---------- */
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function countUp(el) {
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = target.toLocaleString('en-IN') + suffix; return; }
    const duration = 1600;
    const start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-IN') + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { countUp(entry.target); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.6 });
  $$('[data-target]').forEach(el => counterObserver.observe(el));

  /* ---------- Active nav link on scroll ---------- */
  const navLinks = $$('.nav .nav-list a');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a =>
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => sectionObserver.observe(s));

  /* ---------- Product filter ---------- */
  const chips = $$('.chip');
  const cards = $$('.card');
  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const f = chip.dataset.filter;
    cards.forEach(card => {
      const show = f === 'all' || card.dataset.category === f;
      card.classList.toggle('hide', !show);
      if (show) {
        card.classList.remove('pop');
        void card.offsetWidth;            // restart animation
        card.classList.add('pop');
        card.classList.add('visible');
      }
    });
  }));

  /* ---------- Cart + toast ---------- */
  const cartCount = $('#cartCount');
  const toast = $('#toast');
  let count = 0, toastTimer;

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  $$('.add').forEach(btn => btn.addEventListener('click', () => {
    count++;
    cartCount.textContent = count;
    cartCount.classList.remove('bump');
    void cartCount.offsetWidth;
    cartCount.classList.add('bump');
    showToast(`${btn.dataset.name} added to bag ✔`);
  }));

  /* ---------- Newsletter validation ---------- */
  const form = $('#newsletter');
  const email = $('#email');
  const msg = $('#formMsg');
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const value = email.value.trim();
    email.classList.remove('invalid');
    msg.className = 'form-msg';

    if (!emailRe.test(value)) {
      void email.offsetWidth;
      email.classList.add('invalid');
      msg.classList.add('error');
      msg.textContent = 'Please enter a valid email address.';
      email.focus();
      return;
    }
    msg.classList.add('ok');
    msg.textContent = 'Thanks! Check your inbox for your 10% code.';
    form.reset();
  });
  email.addEventListener('input', () => {
    email.classList.remove('invalid');
    msg.textContent = '';
  });
})();