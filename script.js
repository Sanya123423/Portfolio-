/* =========================================================
   SANYA SHARMA — PORTFOLIO SCRIPT
   Handles: nav behavior, smooth scroll, typing animation,
   theme toggle, profile photo fallback, scroll reveals,
   skill bars, contact form validation, and the
   scroll-to-top button.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. STICKY NAVBAR ON SCROLL ---------- */
  const navbar = document.getElementById('navbar');

  const handleNavbarScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll();

  /* ---------- 2. MOBILE MENU TOGGLE ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close the mobile menu whenever a nav link is clicked
  document.querySelectorAll('[data-link]').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 3. ACTIVE LINK HIGHLIGHT WHILE SCROLLING ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' }); // triggers when section crosses the middle of the viewport

  sections.forEach((section) => sectionObserver.observe(section));

  /* ---------- 4. TYPING ANIMATION IN HERO ---------- */
  const typedTextEl = document.getElementById('typedText');
  const roles = [
    'Frontend Development Intern',
    'Aspiring Web Developer',
    'UI/UX Enthusiast',
    'Lifelong Learner'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    typedTextEl.textContent = currentRole.substring(0, charIndex);

    let delay = isDeleting ? 45 : 90;

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      delay = 1400; // pause at the end of the word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400; // pause before typing the next word
    }

    setTimeout(typeLoop, delay);
  }

  typeLoop();

  /* ---------- 5. DARK / LIGHT MODE TOGGLE ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const iconMoon = document.getElementById('iconMoon');
  const iconSun = document.getElementById('iconSun');
  const root = document.documentElement;

  // Default to the visitor's system preference; falls back to light mode.
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let currentTheme = prefersDark ? 'dark' : 'light';
  applyTheme(currentTheme);

  themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
  });

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      iconMoon.classList.add('hidden');
      iconSun.classList.remove('hidden');
    } else {
      root.removeAttribute('data-theme');
      iconSun.classList.add('hidden');
      iconMoon.classList.remove('hidden');
    }
  }

  /* ---------- 6. PROFILE PHOTO FALLBACK ---------- */
  // If profile.jpg doesn't exist (or fails to load), show an initials avatar instead.
  const profilePhoto = document.getElementById('profilePhoto');
  const avatarFallback = document.getElementById('avatarFallback');

  profilePhoto.addEventListener('error', () => {
    profilePhoto.style.display = 'none';
    avatarFallback.style.display = 'flex';
  });

  /* ---------- 7. SCROLL-REVEAL ANIMATIONS ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- 8. ANIMATED SKILL BARS ---------- */
  const skillItems = document.querySelectorAll('.skill-item');

  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const item = entry.target;
        const percent = item.getAttribute('data-percent');
        const fill = item.querySelector('.skill-fill');
        // Slight delay so the bar animates after it scrolls into view
        requestAnimationFrame(() => {
          fill.style.width = `${percent}%`;
        });
        observer.unobserve(item);
      }
    });
  }, { threshold: 0.4 });

  skillItems.forEach((item) => skillObserver.observe(item));

  /* ---------- 9. SCROLL TO TOP BUTTON ---------- */
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 480);
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 10. CONTACT FORM HANDLING ---------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('formSubmitBtn');
  const originalBtnText = submitBtn.textContent;

  // Validation rules per field: each returns an error string, or '' if valid.
  const validators = {
    name: (value) => {
      if (!value.trim()) return 'Please enter your name.';
      if (value.trim().length < 2) return 'Name should be at least 2 characters.';
      return '';
    },
    email: (value) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) return 'Please enter your email address.';
      if (!emailPattern.test(value.trim())) return 'Please enter a valid email address.';
      return '';
    },
    subject: (value) => {
      if (!value.trim()) return 'Please add a subject.';
      if (value.trim().length < 3) return 'Subject should be at least 3 characters.';
      return '';
    },
    message: (value) => {
      if (!value.trim()) return 'Please write a short message.';
      if (value.trim().length < 10) return 'Message should be at least 10 characters.';
      return '';
    }
  };

  function validateField(field) {
    const errorEl = document.getElementById(`${field.name}Error`);
    const errorMsg = validators[field.name](field.value);

    field.classList.toggle('invalid', Boolean(errorMsg));
    field.setAttribute('aria-invalid', String(Boolean(errorMsg)));
    if (errorEl) errorEl.textContent = errorMsg;

    return errorMsg === '';
  }

  // Validate a field as the user leaves it, and clear its error as they retype.
  ['name', 'email', 'subject', 'message'].forEach((fieldName) => {
    const field = contactForm.elements[fieldName];
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('invalid')) validateField(field);
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const fields = ['name', 'email', 'subject', 'message'].map((name) => contactForm.elements[name]);
    const validations = fields.map(validateField);
    const isFormValid = validations.every(Boolean);

    if (!isFormValid) {
      showFormStatus('Please fix the highlighted fields and try again.', 'error');
      const firstInvalid = fields.find((field) => field.classList.contains('invalid'));
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const name = contactForm.name.value.trim();

    // NOTE: There is no backend wired up here. To actually deliver messages,
    // connect this form to a service like Formspree, EmailJS, or your own
    // server endpoint, then send the request inside this block instead.
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    showFormStatus('', '');

    setTimeout(() => {
      showFormStatus(`Thanks, ${name}! Your message has been noted — I'll get back to you soon.`, 'success');
      contactForm.reset();
      fields.forEach((field) => {
        field.classList.remove('invalid');
        field.removeAttribute('aria-invalid');
      });
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }, 700);
  });

  function showFormStatus(text, type) {
    formStatus.textContent = text;
    formStatus.className = `form-status ${type}`;
  }

  /* ---------- 11. FOOTER YEAR ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

});
