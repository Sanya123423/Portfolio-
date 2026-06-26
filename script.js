/* =========================================================
   SANYA SHARMA — PORTFOLIO SCRIPT
   Handles: theme toggle, navbar scroll state, hamburger menu,
   typed text animation, scroll-reveal, skill bar animation,
   profile photo fallback, contact form validation,
   scroll-to-top button, active nav link, footer year.
   ========================================================= */

'use strict';

/* ---- Helpers ---- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* =================================================================
   1. THEME TOGGLE
   ================================================================= */
(function initTheme() {
  const btn       = $('#themeToggle');
  const iconMoon  = $('#iconMoon');
  const iconSun   = $('#iconSun');
  const KEY       = 'portfolio-theme';

  const stored = localStorage.getItem(KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = stored ? stored === 'dark' : prefersDark;

  if (isDark) applyDark();

  btn.addEventListener('click', () => {
    const currentlyDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (currentlyDark) {
      applyLight();
      localStorage.setItem(KEY, 'light');
    } else {
      applyDark();
      localStorage.setItem(KEY, 'dark');
    }
  });

  function applyDark() {
    document.documentElement.setAttribute('data-theme', 'dark');
    iconMoon.classList.add('hidden');
    iconSun.classList.remove('hidden');
    btn.setAttribute('aria-label', 'Switch to light mode');
  }
  function applyLight() {
    document.documentElement.removeAttribute('data-theme');
    iconSun.classList.add('hidden');
    iconMoon.classList.remove('hidden');
    btn.setAttribute('aria-label', 'Switch to dark mode');
  }
})();

/* =================================================================
   2. NAVBAR SCROLL STATE
   ================================================================= */
(function initNavbar() {
  const navbar = $('#navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* =================================================================
   3. HAMBURGER MENU
   ================================================================= */
(function initHamburger() {
  const btn      = $('#hamburger');
  const navLinks = $('#navLinks');

  btn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    btn.classList.toggle('active', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a nav link is clicked
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      btn.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !btn.contains(e.target)) {
      navLinks.classList.remove('open');
      btn.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* =================================================================
   4. TYPED TEXT ANIMATION
   ================================================================= */
(function initTyped() {
  const el = $('#typedText');
  if (!el) return;

  const phrases = [
    'Aspiring Frontend Developer',
    'B.Tech Final Year Student',
    'HTML · CSS · JavaScript',
    'Building Clean Interfaces',
    'Open to Internship Opportunities',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let pause     = false;

  const TYPE_SPEED   = 65;
  const DELETE_SPEED = 35;
  const PAUSE_MS     = 1800;

  function tick() {
    const phrase = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) {
        pause = true;
        setTimeout(() => { pause = false; deleting = true; tick(); }, PAUSE_MS);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }

    setTimeout(tick, deleting ? DELETE_SPEED : TYPE_SPEED);
  }

  // Small initial delay before typing starts
  setTimeout(tick, 500);
})();

/* =================================================================
   5. SCROLL REVEAL
   ================================================================= */
(function initReveal() {
  const items = $$('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings inside the same parent
        const siblings = $$('.reveal', entry.target.parentElement);
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 80}ms`;
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => observer.observe(el));
})();

/* =================================================================
   6. SKILL BAR ANIMATION
   ================================================================= */
(function initSkillBars() {
  const items = $$('.skill-item');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill    = entry.target.querySelector('.skill-fill');
        const percent = entry.target.getAttribute('data-percent') || 0;
        fill.style.width = percent + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  items.forEach(el => observer.observe(el));
})();

/* =================================================================
   7. PROFILE PHOTO FALLBACK
   ================================================================= */
(function initPhotoFallback() {
  const img      = $('#profilePhoto');
  const fallback = $('#avatarFallback');
  if (!img || !fallback) return;

  function showFallback() {
    img.style.display     = 'none';
    fallback.style.display = 'flex';
  }

  img.addEventListener('error', showFallback);

  // If the image has already failed (cached error) before the listener was attached
  if (img.complete && img.naturalWidth === 0) showFallback();
})();

/* =================================================================
   8. CONTACT FORM VALIDATION
   ================================================================= */
(function initContactForm() {
  const form   = $('#contactForm');
  const status = $('#formStatus');
  const btn    = $('#formSubmitBtn');
  if (!form) return;

  const fields = [
    { id: 'name',    errorId: 'nameError',    validate: v => v.trim().length >= 2 ? '' : 'Please enter your full name.' },
    { id: 'email',   errorId: 'emailError',   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.' },
    { id: 'subject', errorId: 'subjectError', validate: v => v.trim().length >= 3 ? '' : 'Please add a subject.' },
    { id: 'message', errorId: 'messageError', validate: v => v.trim().length >= 10 ? '' : 'Your message must be at least 10 characters.' },
  ];

  function setError(field, message) {
    const input = $('#' + field.id, form);
    const errEl = $('#' + field.errorId, form);
    errEl.textContent = message;
    input.classList.toggle('invalid', !!message);
  }

  function clearStatus() {
    status.textContent = '';
    status.className   = 'form-status';
  }

  // Live validation: clear error as soon as the field becomes valid
  fields.forEach(f => {
    const input = $('#' + f.id, form);
    input.addEventListener('input', () => {
      const err = f.validate(input.value);
      if (!err) setError(f, '');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearStatus();

    let valid = true;
    fields.forEach(f => {
      const val = $('#' + f.id, form).value;
      const err = f.validate(val);
      setError(f, err);
      if (err) valid = false;
    });

    if (!valid) return;

    // Simulate submission (replace with real backend or Formspree endpoint)
    btn.disabled       = true;
    btn.textContent    = 'Sending…';

    setTimeout(() => {
      btn.disabled    = false;
      btn.textContent = 'Send Message';
      form.reset();
      status.textContent = '✓ Your message has been sent. I\'ll be in touch soon!';
      status.className   = 'form-status success';
      setTimeout(clearStatus, 6000);
    }, 1400);
  });
})();

/* =================================================================
   9. SCROLL TO TOP BUTTON
   ================================================================= */
(function initScrollTop() {
  const btn = $('#scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* =================================================================
   10. ACTIVE NAV LINK (IntersectionObserver approach)
   ================================================================= */
(function initActiveNav() {
  const sections = $$('section[id]');
  const links    = $$('.nav-link[data-link]');
  if (!sections.length || !links.length) return;

  const map = {};
  links.forEach(l => {
    const href = l.getAttribute('href');
    if (href && href.startsWith('#')) map[href.slice(1)] = l;
  });

  let activeId = '';

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        if (id !== activeId) {
          activeId = id;
          links.forEach(l => l.classList.remove('active'));
          if (map[id]) map[id].classList.add('active');
        }
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
})();

/* =================================================================
   11. FOOTER YEAR
   ================================================================= */
(function initYear() {
  const el = $('#year');
  if (el) el.textContent = new Date().getFullYear();
})();
