/**
 * ════════════════════════════════════════════════════════════
 *  ELISHA STRATON KIMARIO — PORTFOLIO MASTER SCRIPT v3
 *  Dark Mode · Horizontal Nav · FormSubmit Email · 3D Effects
 * ════════════════════════════════════════════════════════════
 */

;(function () {
  'use strict';

  /* ── State ─────────────────────────────────────────────── */
  let current = 0;
  const TOTAL = 6;
  let rafId   = null;

  const $ = id => document.getElementById(id);
  const $$ = sel => document.querySelectorAll(sel);

  /* ════════════════════════════════════════════════════════
     DARK MODE TOGGLE
  ════════════════════════════════════════════════════════ */
  function initTheme() {
    const btn  = $('theme-btn');
    const html = document.documentElement;
    const icon = btn?.querySelector('i');

    const saved = localStorage.getItem('esk-theme') || 'light';
    applyTheme(saved, false);

    if (btn) {
      btn.addEventListener('click', () => {
        const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
        applyTheme(next, true);
        localStorage.setItem('esk-theme', next);
      });
    }

    function applyTheme(theme, animate) {
      html.dataset.theme = theme;
      if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      if (animate && btn) {
        btn.style.transition = 'none';
        btn.style.transform  = 'scale(1.4) rotate(25deg)';
        setTimeout(() => {
          btn.style.transform  = '';
          btn.style.transition = '';
        }, 260);
      }
    }
  }

  /* ════════════════════════════════════════════════════════
     HORIZONTAL PAGE NAVIGATION
  ════════════════════════════════════════════════════════ */
  function goTo(idx, instant) {
    if (idx < 0 || idx >= TOTAL) return;
    current = idx;

    const wrapper = $('pages-wrapper');
    if (wrapper) {
      wrapper.style.transition = instant ? 'none' : 'transform .95s cubic-bezier(.76,0,.24,1)';
      wrapper.style.transform  = `translateX(-${current * 100}vw)`;
    }

    $$('.page').forEach((p, i) => {
      const active = i === current;
      p.classList.toggle('active', active);
      if (!active) p.scrollTop = 0;
    });

    $$('.nav-link').forEach((l, i) => l.classList.toggle('active', i === current));
    $$('.page-dot').forEach((d, i) => d.classList.toggle('active', i === current));

    const prog = $('nav-progress');
    if (prog) prog.style.width = `${((current + 1) / TOTAL) * 100}%`;

    const aL = $('arrow-left'), aR = $('arrow-right');
    if (aL) aL.classList.toggle('show', current > 0);
    if (aR) aR.classList.toggle('show', current < TOTAL - 1);

    if (idx === 2) animateSkillBars(); else resetSkillBars();
  }

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

    /* Touch swipe */
    let tx0 = 0, ty0 = 0;
    document.addEventListener('touchstart', e => { tx0 = e.touches[0].clientX; ty0 = e.touches[0].clientY; }, { passive: true });
    document.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - tx0;
      const dy = Math.abs(e.changedTouches[0].clientY - ty0);
      if (Math.abs(dx) > 65 && dy < 80) dx < 0 ? goTo(current + 1) : goTo(current - 1);
    }, { passive: true });

    /* Wheel-to-navigate */
    let wcd = false;
    document.addEventListener('wheel', e => {
      if (wcd) return;
      if (['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return;
      const page = $$('.page')[current];
      const atTop    = page.scrollTop <= 1;
      const atBottom = page.scrollTop + page.clientHeight >= page.scrollHeight - 2;
      if (Math.abs(e.deltaX) > 40) {
        e.deltaX > 0 ? goTo(current + 1) : goTo(current - 1);
        wcd = true; setTimeout(() => { wcd = false; }, 900);
      } else if (Math.abs(e.deltaY) > 65) {
        if (e.deltaY > 0 && atBottom) { goTo(current + 1); wcd = true; setTimeout(() => { wcd = false; }, 900); }
        if (e.deltaY < 0 && atTop)    { goTo(current - 1); wcd = true; setTimeout(() => { wcd = false; }, 900); }
      }
    }, { passive: true });
  }

  /* ─── Mobile Menu ────────────────────────────────────── */
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
    btn.classList.remove('open'); menu.classList.remove('open');
    btn.setAttribute('aria-expanded', false);
  }

  /* ════════════════════════════════════════════════════════
     HERO CTA DATA-PAGE ROUTING
  ════════════════════════════════════════════════════════ */
  function bindHeroCTAs() {
    $$('[data-page]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        goTo(parseInt(btn.dataset.page, 10));
      });
    });
  }

  /* ════════════════════════════════════════════════════════
     TYPEWRITER
  ════════════════════════════════════════════════════════ */
  function initTypewriter() {
    const el = $('type-text');
    if (!el) return;
    const phrases = ['Software Developer', 'Full-Stack Engineer', 'Systems Learner', 'Git Workflow Expert', 'Web Craftsman'];
    let pi = 0, ci = 0, del = false;
    function tick() {
      const p = phrases[pi];
      el.textContent = del ? p.slice(0, ci - 1) : p.slice(0, ci + 1);
      del ? ci-- : ci++;
      let ms = del ? 44 : 98;
      if (!del && ci === p.length)  { del = true;  ms = 2200; }
      else if (del && ci === 0)     { del = false; pi = (pi + 1) % phrases.length; ms = 380; }
      setTimeout(tick, ms);
    }
    setTimeout(tick, 1000);
  }

  /* ════════════════════════════════════════════════════════
     SKILL BARS
  ════════════════════════════════════════════════════════ */
  let barsOn = false;
  function animateSkillBars() {
    if (barsOn) return; barsOn = true;
    $$('.bar-fill').forEach((b, i) => {
      setTimeout(() => { b.style.width = b.dataset.pct || '0%'; }, i * 75);
    });
  }
  function resetSkillBars() {
    if (!barsOn) return; barsOn = false;
    $$('.bar-fill').forEach(b => {
      b.style.transition = 'none';
      b.style.width = '0%';
      requestAnimationFrame(() => { b.style.transition = ''; });
    });
  }

  /* ════════════════════════════════════════════════════════
     PROJECT FILTER
  ════════════════════════════════════════════════════════ */
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
          c.style.opacity       = show ? '1'   : '0';
          c.style.transform     = show ? ''    : 'scale(0.88)';
          c.style.pointerEvents = show ? ''    : 'none';
          c.style.transition    = 'opacity .4s ease, transform .4s ease';
        });
      });
    });
  }

  /* ════════════════════════════════════════════════════════
     3-D CARD TILT
  ════════════════════════════════════════════════════════ */
  function initCardTilt() {
    $$('.proj-card, .glass-card, .comp-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -7;
        const ry = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  7;
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale(1.01)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform  = '';
        card.style.transition = 'transform .55s cubic-bezier(.34,1.56,.64,1)';
        setTimeout(() => { card.style.transition = ''; }, 600);
      });
    });
  }

  /* ════════════════════════════════════════════════════════
     MAGNETIC BUTTONS
  ════════════════════════════════════════════════════════ */
  function initMagnetic() {
    $$('.btn-primary, .page-arrow').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r  = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width  / 2)) * .38;
        const dy = (e.clientY - (r.top  + r.height / 2)) * .38;
        btn.style.transform = `translate(${dx}px,${dy}px) scale(1.05)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform  = '';
        btn.style.transition = 'transform .45s cubic-bezier(.34,1.56,.64,1)';
        setTimeout(() => { btn.style.transition = ''; }, 500);
      });
    });
  }

  /* ════════════════════════════════════════════════════════
     PARTICLES — Aurora Network
  ════════════════════════════════════════════════════════ */
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

    const PALETTE = [[99,102,241],[6,182,212],[139,92,246],[244,63,94],[245,158,11]];
    const COUNT = Math.min(Math.floor(W * H / 11000), 90);
    const LINK  = 145;
    const mouse = { x: null, y: null };
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; }, { passive: true });

    class Dot {
      constructor() { this.init(); }
      init() {
        this.x  = Math.random() * W; this.y = Math.random() * H;
        this.vx = (Math.random() - .5) * .52; this.vy = (Math.random() - .5) * .52;
        this.r  = Math.random() * 2.2 + .8;
        this.col = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        this.alpha = Math.random() * .38 + .1;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
        if (mouse.x !== null) {
          const dx = this.x - mouse.x, dy = this.y - mouse.y;
          const d  = Math.hypot(dx, dy);
          if (d < 130) { const f = (130 - d) / 130; this.x += (dx / d) * f * 1.6; this.y += (dy / d) * f * 1.6; }
        }
      }
      draw() {
        const [r,g,b] = this.col;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${this.alpha})`; ctx.fill();
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
            ctx.strokeStyle = `rgba(99,102,241,${(1 - dist / LINK) * .22})`;
            ctx.lineWidth = .75;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      rafId = requestAnimationFrame(frame);
    }
    frame();
  }

  /* ════════════════════════════════════════════════════════
     CURSOR GLOW
  ════════════════════════════════════════════════════════ */
  function initCursorGlow() {
    if (window.matchMedia('(pointer:coarse)').matches) return;
    const glow = document.createElement('div');
    glow.style.cssText = 'position:fixed;pointer-events:none;z-index:9999;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,rgba(99,102,241,.09),transparent 70%);transform:translate(-50%,-50%);transition:opacity .4s;';
    document.body.appendChild(glow);
    document.addEventListener('mousemove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; }, { passive: true });
    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
  }

  /* ════════════════════════════════════════════════════════
     SCROLL REVEAL (within page)
  ════════════════════════════════════════════════════════ */
  function initReveal() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.style.opacity   = '1';
          en.target.style.transform = 'translateY(0)';
          en.target.style.transition = 'opacity .6s ease, transform .6s ease';
        }
      });
    }, { threshold: 0.08 });

    $$('.tl-item, .cert-card, .comp-card, .proj-card, .a-pill, .ci-row').forEach(el => {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(22px)';
      obs.observe(el);
    });
  }

  /* ════════════════════════════════════════════════════════
     CONTACT FORM — FormSubmit AJAX → elishastraton1@gmail.com
  ════════════════════════════════════════════════════════ */
  function initForm() {
    const form = $('contact-form');
    if (!form) return;
    const fName  = $('f-name');
    const fEmail = $('f-email');
    const fMsg   = $('f-msg');
    const fb     = $('form-feedback');

    form.addEventListener('submit', async e => {
      e.preventDefault();
      let valid = true;
      [fName, fEmail, fMsg].forEach(f => clearErr(f));
      fb.className = 'form-fb';

      if (!fName.value.trim())  { setErr(fName,  'Name is required.'); valid = false; }
      if (!fEmail.value.trim()) { setErr(fEmail, 'Email is required.'); valid = false; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fEmail.value)) { setErr(fEmail, 'Enter a valid email.'); valid = false; }
      if (!fMsg.value.trim())   { setErr(fMsg,   'Message cannot be empty.'); valid = false; }
      if (!valid) return;

      const submitBtn = form.querySelector('[type="submit"]');
      const orig = submitBtn.innerHTML;
      submitBtn.disabled  = true;
      submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>&nbsp; Sending…';

      try {
        const res = await fetch('https://formsubmit.co/ajax/elishastraton1@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            name:    fName.value.trim(),
            email:   fEmail.value.trim(),
            message: fMsg.value.trim(),
            _subject: `Portfolio Contact from ${fName.value.trim()}`,
          }),
        });

        const data = await res.json();

        if (data.success === 'true' || data.success === true) {
          fb.textContent = '✓ Message sent! Elisha will reply soon.';
          fb.classList.add('ok');
          form.reset();
        } else {
          throw new Error('FormSubmit returned failure');
        }
      } catch {
        fb.textContent = '✗ Could not send. Please email directly: elishastraton1@gmail.com';
        fb.classList.add('err');
      } finally {
        submitBtn.disabled  = false;
        submitBtn.innerHTML = orig;
      }
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

  /* ════════════════════════════════════════════════════════
     INIT
  ════════════════════════════════════════════════════════ */
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
    initMagnetic();
    initCursorGlow();
    initReveal();
    goTo(0, true);
  });

})();
