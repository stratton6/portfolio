/**
 * ════════════════════════════════════════════════════════════
 *  ELISHA STRATON KIMARIO — PORTFOLIO MASTER SCRIPT
 *  Dark Mode · Horizontal Nav · Particles · 3D Tilt · Forms
 * ════════════════════════════════════════════════════════════
 */

;(function () {
  'use strict';

  /* ─── State ──────────────────────────────────────────────── */
  let current = 0;
  const TOTAL = 6;
  let rafId   = null;

  /* ─── Selectors ──────────────────────────────────────────── */
  const $ = id => document.getElementById(id);
  const $$ = sel => document.querySelectorAll(sel);

  /* ═══════════════════════════════════════════════════════════
     DARK MODE TOGGLE
  ═══════════════════════════════════════════════════════════ */
  function initTheme() {
    const btn  = $('theme-btn');
    const root = document.documentElement;
    const icon = btn ? btn.querySelector('i') : null;

    /* Load saved preference */
    const saved = localStorage.getItem('esk-theme') || 'light';
    applyTheme(saved);

    if (btn) {
      btn.addEventListener('click', () => {
        const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('esk-theme', next);
        /* Spring bounce animation */
        btn.style.transform = 'scale(1.35) rotate(30deg)';
        setTimeout(() => { btn.style.transform = ''; }, 280);
      });
    }

    function applyTheme(theme) {
      root.dataset.theme = theme;
      if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    }
  }

  /* ═══════════════════════════════════════════════════════════
     HORIZONTAL PAGE NAVIGATION
  ═══════════════════════════════════════════════════════════ */
  function goTo(idx, instant = false) {
    if (idx < 0 || idx >= TOTAL) return;
    current = idx;

    const wrapper = $('pages-wrapper');
    if (wrapper) {
      wrapper.style.transition = instant
        ? 'none'
        : 'transform .95s cubic-bezier(.76,0,.24,1)';
      wrapper.style.transform = `translateX(-${current * 100}vw)`;
    }

    /* Pages */
    $$('.page').forEach((p, i) => {
      const active = i === current;
      p.classList.toggle('active', active);
      if (!active) p.scrollTop = 0;
    });

    /* Nav links */
    $$('.nav-link').forEach((l, i) => l.classList.toggle('active', i === current));

    /* Dots */
    $$('.page-dot').forEach((d, i) => d.classList.toggle('active', i === current));

    /* Progress bar */
    const prog = $('nav-progress');
    if (prog) prog.style.width = `${((current + 1) / TOTAL) * 100}%`;

    /* Arrows */
    const aL = $('arrow-left'), aR = $('arrow-right');
    if (aL) aL.classList.toggle('show', current > 0);
    if (aR) aR.classList.toggle('show', current < TOTAL - 1);

    /* Per-page effects */
    if (idx === 2) animateSkillBars(); else resetSkillBars();
    if (idx === 0) restartHeroAnimations();
  }

  /* ─── Bind nav ───────────────────────────────────────────── */
  function bindNav() {
    $$('.nav-link').forEach((link, i) => {
      link.addEventListener('click', e => {
        e.preventDefault();
        goTo(i);
        closeMobileMenu();
      });
    });

    $$('.page-dot').forEach((dot, i) => {
      dot.addEventListener('click', () => goTo(i));
    });

    const aL = $('arrow-left'), aR = $('arrow-right');
    if (aL) aL.addEventListener('click', () => goTo(current - 1));
    if (aR) aR.addEventListener('click', () => goTo(current + 1));

    /* Keyboard */
    document.addEventListener('keydown', e => {
      const tag = document.activeElement.tagName;
      if (['INPUT','TEXTAREA','SELECT'].includes(tag)) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); goTo(current + 1); }
      if (e.key === 'ArrowLeft'  || e.key === 'PageUp')   { e.preventDefault(); goTo(current - 1); }
      if (e.key === 'Home') goTo(0);
      if (e.key === 'End')  goTo(TOTAL - 1);
    });

    /* Touch / swipe */
    let tx0 = 0, ty0 = 0;
    document.addEventListener('touchstart', e => {
      tx0 = e.touches[0].clientX;
      ty0 = e.touches[0].clientY;
    }, { passive: true });
    document.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - tx0;
      const dy = Math.abs(e.changedTouches[0].clientY - ty0);
      if (Math.abs(dx) > 65 && dy < 80) {
        dx < 0 ? goTo(current + 1) : goTo(current - 1);
      }
    }, { passive: true });

    /* Mouse wheel (horizontal) */
    let wheelCooldown = false;
    document.addEventListener('wheel', e => {
      if (wheelCooldown) return;
      const tag = document.activeElement.tagName;
      if (['INPUT','TEXTAREA'].includes(tag)) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.deltaX > 30  ? goTo(current + 1) : e.deltaX < -30 && goTo(current - 1);
        wheelCooldown = true;
        setTimeout(() => { wheelCooldown = false; }, 850);
      } else if (Math.abs(e.deltaY) > 60) {
        /* Vertical scroll on outer body — treat as page switch */
        const page = $$('.page')[current];
        const atTop    = page.scrollTop === 0;
        const atBottom = page.scrollTop + page.clientHeight >= page.scrollHeight - 2;
        if (e.deltaY > 0 && atBottom) { goTo(current + 1); wheelCooldown = true; setTimeout(() => { wheelCooldown = false; }, 900); }
        if (e.deltaY < 0 && atTop)    { goTo(current - 1); wheelCooldown = true; setTimeout(() => { wheelCooldown = false; }, 900); }
      }
    }, { passive: true });
  }

  /* ─── Mobile menu ────────────────────────────────────────── */
  function bindMobileMenu() {
    const btn  = $('menu-btn');
    const menu = $('nav-menu');
    if (!btn || !menu) return;
    btn.addEventListener('click', () => {
      const open = btn.classList.toggle('open');
      menu.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
    });
  }
  function closeMobileMenu() {
    const btn = $('menu-btn'), menu = $('nav-menu');
    if (!btn || !menu) return;
    btn.classList.remove('open');
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', false);
  }

  /* ═══════════════════════════════════════════════════════════
     TYPEWRITER EFFECT
  ═══════════════════════════════════════════════════════════ */
  function initTypewriter() {
    const el = $('type-text');
    if (!el) return;
    const phrases = [
      'Software Developer',
      'Full-Stack Engineer',
      'Systems Learner',
      'Git Workflow Expert',
      'Web Craftsman',
    ];
    let pi = 0, ci = 0, deleting = false;
    function tick() {
      const phrase = phrases[pi];
      el.textContent = deleting ? phrase.slice(0, ci - 1) : phrase.slice(0, ci + 1);
      deleting ? ci-- : ci++;
      let delay = deleting ? 44 : 98;
      if (!deleting && ci === phrase.length) { deleting = true; delay = 2200; }
      else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 380; }
      setTimeout(tick, delay);
    }
    setTimeout(tick, 1000);
  }

  /* ═══════════════════════════════════════════════════════════
     SKILL BARS
  ═══════════════════════════════════════════════════════════ */
  let barsAnimated = false;
  function animateSkillBars() {
    if (barsAnimated) return;
    barsAnimated = true;
    $$('.bar-fill').forEach((bar, i) => {
      setTimeout(() => {
        bar.style.width = bar.dataset.pct || '0%';
      }, i * 80);
    });
  }
  function resetSkillBars() {
    if (!barsAnimated) return;
    barsAnimated = false;
    $$('.bar-fill').forEach(bar => {
      bar.style.transition = 'none';
      bar.style.width = '0%';
      requestAnimationFrame(() => { bar.style.transition = ''; });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     PROJECT FILTER
  ═══════════════════════════════════════════════════════════ */
  function initFilter() {
    const pills = $$('.f-pill');
    const cards = $$('.proj-card');
    if (!pills.length) return;

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const cat = pill.dataset.filter;
        cards.forEach(c => {
          const show = cat === 'all' || c.dataset.cat === cat;
          c.style.opacity    = show ? '1' : '0';
          c.style.transform  = show ? '' : 'scale(0.88)';
          c.style.pointerEvents = show ? '' : 'none';
          c.style.transition = 'opacity .4s ease, transform .4s ease';
        });
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     3D CARD TILT (magnetic hover)
  ═══════════════════════════════════════════════════════════ */
  function initCardTilt() {
    $$('.proj-card, .glass-card, .comp-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const cx = r.width  / 2;
        const cy = r.height / 2;
        const rotX = ((y - cy) / cy) * -7;
        const rotY = ((x - cx) / cx) *  7;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale(1.01)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform .55s cubic-bezier(.34,1.56,.64,1)';
        setTimeout(() => { card.style.transition = ''; }, 600);
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     MAGNETIC BUTTONS
  ═══════════════════════════════════════════════════════════ */
  function initMagneticBtns() {
    $$('.btn-primary, .page-arrow').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r   = btn.getBoundingClientRect();
        const cx  = r.left + r.width  / 2;
        const cy  = r.top  + r.height / 2;
        const dx  = (e.clientX - cx) * 0.35;
        const dy  = (e.clientY - cy) * 0.35;
        btn.style.transform = `translate(${dx}px, ${dy}px) scale(1.05)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform .45s cubic-bezier(.34,1.56,.64,1)';
        setTimeout(() => { btn.style.transition = ''; }, 500);
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     PARTICLE CANVAS — Aurora floating nodes
  ═══════════════════════════════════════════════════════════ */
  function initParticles() {
    const canvas = $('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (rafId) cancelAnimationFrame(rafId);

    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      rebuild();
    }, { passive: true });

    const COLORS = [
      [99,102,241],   /* indigo  */
      [6,182,212],    /* cyan    */
      [139,92,246],   /* violet  */
      [244,63,94],    /* rose    */
      [245,158,11],   /* amber   */
    ];

    const COUNT = Math.min(Math.floor(W * H / 11000), 95);
    const LINK  = 140;

    const mouse = { x: null, y: null };
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; }, { passive: true });

    class Dot {
      constructor() { this.init(); }
      init() {
        this.x    = Math.random() * W;
        this.y    = Math.random() * H;
        this.vx   = (Math.random() - .5) * .5;
        this.vy   = (Math.random() - .5) * .5;
        this.r    = Math.random() * 2.2 + .8;
        this.col  = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.alpha = Math.random() * .35 + .1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
        if (mouse.x !== null) {
          const dx = this.x - mouse.x, dy = this.y - mouse.y;
          const d  = Math.hypot(dx, dy);
          if (d < 130) {
            const force = (130 - d) / 130;
            this.x += (dx / d) * force * 1.5;
            this.y += (dy / d) * force * 1.5;
          }
        }
      }
      draw() {
        const [r, g, b] = this.col;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${this.alpha})`;
        ctx.fill();
      }
    }

    let dots = [];
    function rebuild() { dots = Array.from({ length: COUNT }, () => new Dot()); }
    rebuild();

    function frame() {
      ctx.clearRect(0, 0, W, H);
      dots.forEach(d => { d.update(); d.draw(); });
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i], b = dots[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINK) {
            const op = (1 - dist / LINK) * .22;
            ctx.strokeStyle = `rgba(99,102,241,${op})`;
            ctx.lineWidth   = .8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      rafId = requestAnimationFrame(frame);
    }
    frame();
  }

  /* ═══════════════════════════════════════════════════════════
     ANIMATED COUNTER (hero stats)
  ═══════════════════════════════════════════════════════════ */
  function restartHeroAnimations() {
    /* No numeric counters needed but hook reserved */
  }

  /* ═══════════════════════════════════════════════════════════
     SCROLL REVEAL (within inner page)
  ═══════════════════════════════════════════════════════════ */
  function initReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity    = '1';
          entry.target.style.transform  = 'translateY(0)';
          entry.target.style.transition = 'opacity .6s ease, transform .6s ease';
        }
      });
    }, { threshold: 0.08 });

    $$('.tl-item, .cert-card, .comp-card, .proj-card, .a-pill').forEach(el => {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(22px)';
      observer.observe(el);
    });
  }

  /* ═══════════════════════════════════════════════════════════
     CONTACT FORM
  ═══════════════════════════════════════════════════════════ */
  function initForm() {
    const form = $('contact-form');
    if (!form) return;
    const name  = $('f-name');
    const email = $('f-email');
    const msg   = $('f-msg');
    const fb    = $('form-feedback');

    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      [name, email, msg].forEach(f => clearErr(f));
      fb.className = 'form-fb';

      if (!name.value.trim())  { setErr(name,  'Name is required.'); valid = false; }
      const rx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim())    { setErr(email, 'Email is required.'); valid = false; }
      else if (!rx.test(email.value)) { setErr(email, 'Enter a valid email.'); valid = false; }
      if (!msg.value.trim())   { setErr(msg,   'Message cannot be empty.'); valid = false; }
      if (!valid) return;

      const submitBtn = form.querySelector('[type="submit"]');
      const orig = submitBtn.innerHTML;
      submitBtn.disabled  = true;
      submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending…';

      setTimeout(() => {
        submitBtn.disabled  = false;
        submitBtn.innerHTML = orig;
        fb.textContent = '✓ Message sent! I\'ll get back to you soon.';
        fb.classList.add('ok');
        form.reset();
      }, 1500);
    });

    function setErr(el, txt) {
      el.classList.add('invalid');
      const span = el.nextElementSibling;
      if (span?.classList.contains('err-msg')) { span.textContent = txt; span.style.display = 'block'; }
    }
    function clearErr(el) {
      el.classList.remove('invalid');
      const span = el.nextElementSibling;
      if (span?.classList.contains('err-msg')) span.style.display = 'none';
    }
  }

  /* ═══════════════════════════════════════════════════════════
     HERO CTA BUTTONS — data-page attribute routing
  ═══════════════════════════════════════════════════════════ */
  function bindHeroCTAs() {
    $$('[data-page]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        goTo(parseInt(btn.dataset.page, 10));
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     CURSOR GLOW (desktop)
  ═══════════════════════════════════════════════════════════ */
  function initCursorGlow() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const glow = document.createElement('div');
    glow.style.cssText = `
      position:fixed;pointer-events:none;z-index:9999;
      width:280px;height:280px;border-radius:50%;
      background:radial-gradient(circle,rgba(99,102,241,.08),transparent 70%);
      transform:translate(-50%,-50%);
      transition:opacity .4s;
    `;
    document.body.appendChild(glow);
    document.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    }, { passive: true });
    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
  }

  /* ═══════════════════════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    bindMobileMenu();
    bindNav();
    bindHeroCTAs();
    initTypewriter();
    initParticles();
    initFilter();
    initForm();
    initCardTilt();
    initMagneticBtns();
    initCursorGlow();
    initReveal();
    goTo(0, true);
  });

})();
