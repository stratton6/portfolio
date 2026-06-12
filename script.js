/**
 * ════════════════════════════════════════════════════════════
 *  ELISHA STRATON KIMARIO — PORTFOLIO MASTER CONTROLLER
 *  Horizontal Book Navigation · Particles · Skills · Forms
 * ════════════════════════════════════════════════════════════
 */

;(function () {
  'use strict';

  /* ── State ──────────────────────────────────────────────── */
  let current    = 0;
  const TOTAL    = 6;
  let particleId = null;

  /* ── DOM refs ───────────────────────────────────────────── */
  const wrapper   = () => document.getElementById('pages-wrapper');
  const pages     = () => document.querySelectorAll('.page');
  const navLinks  = () => document.querySelectorAll('.nav-link');
  const dots      = () => document.querySelectorAll('.page-dot');
  const arrowL    = () => document.getElementById('arrow-left');
  const arrowR    = () => document.getElementById('arrow-right');
  const progress  = () => document.getElementById('nav-progress');

  /* ════════════════════════════════════════════════════════
     HORIZONTAL PAGE NAVIGATION
  ════════════════════════════════════════════════════════ */
  function goTo(idx, skipTransition = false) {
    if (idx < 0 || idx >= TOTAL) return;
    current = idx;

    /* Slide wrapper */
    const w = wrapper();
    if (w) {
      w.style.transition = skipTransition
        ? 'none'
        : 'transform .9s cubic-bezier(.76,0,.24,1)';
      w.style.transform = `translateX(-${current * 100}vw)`;
    }

    /* Page active class + reset inner scroll */
    pages().forEach((p, i) => {
      const isActive = i === current;
      p.classList.toggle('active', isActive);
      if (!isActive) p.scrollTop = 0;
    });

    /* Nav links */
    navLinks().forEach((l, i) => l.classList.toggle('active', i === current));

    /* Dots */
    dots().forEach((d, i) => d.classList.toggle('active', i === current));

    /* Progress bar */
    const prog = progress();
    if (prog) prog.style.width = `${((current + 1) / TOTAL) * 100}%`;

    /* Arrows */
    const aL = arrowL(), aR = arrowR();
    if (aL) aL.classList.toggle('show', current > 0);
    if (aR) aR.classList.toggle('show', current < TOTAL - 1);

    /* Side‑effects per page */
    handlePageEffects(current);
  }

  function handlePageEffects(idx) {
    /* Skills — page 2 (0-indexed) */
    if (idx === 2) {
      triggerSkillBars(true);
    } else {
      /* Reset bars when leaving so they re-animate on return */
      resetSkillBars();
    }
  }

  /* ════════════════════════════════════════════════════════
     EVENT LISTENERS — nav, arrows, keyboard, dots
  ════════════════════════════════════════════════════════ */
  function bindNav() {
    /* Navbar links */
    navLinks().forEach((link, i) => {
      link.addEventListener('click', e => {
        e.preventDefault();
        goTo(i);
        closeMobileMenu();
      });
    });

    /* Dots */
    dots().forEach((dot, i) => {
      dot.addEventListener('click', () => goTo(i));
    });

    /* Arrow buttons */
    const al = arrowL(), ar = arrowR();
    if (al) al.addEventListener('click', () => goTo(current - 1));
    if (ar) ar.addEventListener('click', () => goTo(current + 1));

    /* Keyboard */
    document.addEventListener('keydown', e => {
      const tag = document.activeElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowRight') goTo(current + 1);
      if (e.key === 'ArrowLeft')  goTo(current - 1);
    });

    /* Touch / Swipe */
    let touchStartX = 0;
    document.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    document.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 60) {
        dx < 0 ? goTo(current + 1) : goTo(current - 1);
      }
    }, { passive: true });

    /* Header scroll class */
    window.addEventListener('scroll', () => {
      const h = document.querySelector('header');
      if (h) h.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ════════════════════════════════════════════════════════
     MOBILE MENU
  ════════════════════════════════════════════════════════ */
  function bindMobileMenu() {
    const btn  = document.getElementById('menu-btn');
    const menu = document.getElementById('nav-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
      const open = btn.classList.toggle('open');
      menu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  function closeMobileMenu() {
    const btn  = document.getElementById('menu-btn');
    const menu = document.getElementById('nav-menu');
    if (!btn || !menu) return;
    btn.classList.remove('open');
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ════════════════════════════════════════════════════════
     HERO TYPEWRITER
  ════════════════════════════════════════════════════════ */
  function initTypewriter() {
    const el = document.getElementById('hero-subtitle');
    if (!el) return;

    const phrases = [
      'Software Developer',
      'Full-Stack Enthusiast',
      'Systems Engineering Learner',
      'Git & GitHub Workflow Advocate',
    ];

    let pi = 0, ci = 0, deleting = false;

    function tick() {
      const phrase = phrases[pi];
      el.textContent = deleting
        ? phrase.slice(0, ci - 1)
        : phrase.slice(0, ci + 1);

      deleting ? ci-- : ci++;

      let next = deleting ? 48 : 95;
      if (!deleting && ci === phrase.length) { deleting = true; next = 2200; }
      else if (deleting && ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        next = 400;
      }
      setTimeout(tick, next);
    }
    setTimeout(tick, 900);
  }

  /* ════════════════════════════════════════════════════════
     SKILL BARS
  ════════════════════════════════════════════════════════ */
  function triggerSkillBars(animate) {
    document.querySelectorAll('.bar-fill').forEach(bar => {
      bar.style.width = animate ? (bar.dataset.pct || '0%') : '0%';
    });
  }
  function resetSkillBars() {
    document.querySelectorAll('.bar-fill').forEach(bar => {
      bar.style.transition = 'none';
      bar.style.width = '0%';
      /* Allow re-transition next time */
      requestAnimationFrame(() => {
        bar.style.transition = '';
      });
    });
  }

  /* ════════════════════════════════════════════════════════
     PROJECT FILTER
  ════════════════════════════════════════════════════════ */
  function initFilter() {
    const pills = document.querySelectorAll('.filter-pill');
    const cards = document.querySelectorAll('.proj-card');
    if (!pills.length) return;

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const cat = pill.dataset.filter;
        cards.forEach(c => {
          c.classList.toggle('hidden', cat !== 'all' && c.dataset.cat !== cat);
        });
      });
    });
  }

  /* ════════════════════════════════════════════════════════
     CONTACT FORM VALIDATION
  ════════════════════════════════════════════════════════ */
  function initForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const fields = {
      name:    document.getElementById('f-name'),
      email:   document.getElementById('f-email'),
      message: document.getElementById('f-msg'),
    };
    const feedback = document.getElementById('form-feedback');

    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      Object.values(fields).forEach(f => clearErr(f));
      feedback.className = 'form-feedback';

      if (!fields.name.value.trim()) {
        setErr(fields.name, 'Name is required.');
        valid = false;
      }
      const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!fields.email.value.trim()) {
        setErr(fields.email, 'Email is required.');
        valid = false;
      } else if (!emailRx.test(fields.email.value)) {
        setErr(fields.email, 'Please enter a valid email address.');
        valid = false;
      }
      if (!fields.message.value.trim()) {
        setErr(fields.message, 'Message cannot be empty.');
        valid = false;
      }

      if (!valid) return;

      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = orig;
        feedback.textContent = '✓ Message sent! I\'ll be in touch soon.';
        feedback.classList.add('success');
        form.reset();
      }, 1400);
    });

    function setErr(el, msg) {
      el.classList.add('invalid');
      const span = el.nextElementSibling;
      if (span?.classList.contains('err')) {
        span.textContent = msg;
        span.style.display = 'block';
      }
    }
    function clearErr(el) {
      el.classList.remove('invalid');
      const span = el.nextElementSibling;
      if (span?.classList.contains('err')) span.style.display = 'none';
    }
  }

  /* ════════════════════════════════════════════════════════
     PARTICLES CANVAS — Bright aurora nodes
  ════════════════════════════════════════════════════════ */
  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (particleId) cancelAnimationFrame(particleId);

    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const resizeObs = new ResizeObserver(() => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    });
    resizeObs.observe(document.body);

    /* Config */
    const COUNT  = Math.min(Math.floor(W * H / 12000), 90);
    const LINK   = 130;

    /* Colors — soft aurora palette */
    const COLORS = [
      'rgba(99,102,241,',   /* indigo  */
      'rgba(6,182,212,',    /* cyan    */
      'rgba(139,92,246,',   /* violet  */
      'rgba(244,63,94,',    /* rose    */
    ];

    const mouse = { x: null, y: null };
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; }, { passive: true });

    class Dot {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.vx = (Math.random() - .5) * .42;
        this.vy = (Math.random() - .5) * .42;
        this.r  = Math.random() * 2.5 + 1;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;

        if (mouse.x !== null) {
          const dx = this.x - mouse.x, dy = this.y - mouse.y;
          const d  = Math.hypot(dx, dy);
          if (d < 140) {
            const f = (140 - d) / 140;
            this.x += (dx / d) * f * 1.3;
            this.y += (dy / d) * f * 1.3;
          }
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color + '.28)';
        ctx.fill();
      }
    }

    const dots = Array.from({ length: COUNT }, () => new Dot());

    function frame() {
      ctx.clearRect(0, 0, W, H);

      dots.forEach(d => { d.update(); d.draw(); });

      /* Connections */
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i], b = dots[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINK) {
            const alpha = (1 - dist / LINK) * .28;
            ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
            ctx.lineWidth = .7;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      particleId = requestAnimationFrame(frame);
    }
    frame();
  }

  /* ════════════════════════════════════════════════════════
     INIT
  ════════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    bindMobileMenu();
    bindNav();
    initTypewriter();
    initParticles();
    initFilter();
    initForm();
    goTo(0, true); /* Set initial state without animation */
  });

})();
