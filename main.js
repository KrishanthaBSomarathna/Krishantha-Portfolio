/* ═══════════════════════════════════════════════════════
   KRISHANTHA SOMARATHNA — PORTFOLIO
   main.js · Three.js 3D Background + All Interactivity
═══════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════
   THREE.JS — ANIMATED PARTICLE BACKGROUND
══════════════════════════════════════════ */
(function initThree() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  /* ── Particle Field ── */
  const PARTICLE_COUNT = 1800;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors    = new Float32Array(PARTICLE_COUNT * 3);
  const sizes     = new Float32Array(PARTICLE_COUNT);

  const palette = [
    new THREE.Color(0x3b82f6),  // blue
    new THREE.Color(0x8b5cf6),  // purple
    new THREE.Color(0x06b6d4),  // cyan
    new THREE.Color(0xec4899),  // pink
    new THREE.Color(0x60a5fa),  // light blue
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    positions[i3]     = (Math.random() - 0.5) * 30;
    positions[i3 + 1] = (Math.random() - 0.5) * 20;
    positions[i3 + 2] = (Math.random() - 0.5) * 15;

    const col = palette[Math.floor(Math.random() * palette.length)];
    colors[i3]     = col.r;
    colors[i3 + 1] = col.g;
    colors[i3 + 2] = col.b;

    sizes[i] = Math.random() * 2.5 + 0.5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color',    new THREE.BufferAttribute(colors,    3));
  geometry.setAttribute('size',     new THREE.BufferAttribute(sizes,     1));

  const material = new THREE.PointsMaterial({
    size: 0.06,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  /* ── Floating Wireframe Geometries ── */
  function createFloat(geo, color, x, y, z) {
    const mat = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.12 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    return mesh;
  }

  const floaters = [
    createFloat(new THREE.IcosahedronGeometry(1.2, 1),  0x3b82f6, -6,  2,  -2),
    createFloat(new THREE.OctahedronGeometry(0.9, 0),   0x8b5cf6,  6, -1,  -3),
    createFloat(new THREE.TorusGeometry(1, 0.3, 8, 20), 0x06b6d4,  0,  3.5, -4),
    createFloat(new THREE.TetrahedronGeometry(0.8, 0),  0xec4899, -4, -3,  -2),
    createFloat(new THREE.OctahedronGeometry(0.6, 0),   0x60a5fa,  5,  4,  -5),
  ];

  /* ── Mouse Parallax ── */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.tx = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ── Resize ── */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ── Animate ── */
  let clock = 0;
  function animate() {
    requestAnimationFrame(animate);
    clock += 0.004;

    // Smooth mouse parallax
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;
    camera.position.x = mouse.x * 0.8;
    camera.position.y = -mouse.y * 0.5;

    // Rotate particle field gently
    particles.rotation.y = clock * 0.06;
    particles.rotation.x = clock * 0.02;

    // Animate floaters
    floaters.forEach((f, i) => {
      const speed = 0.003 + i * 0.001;
      f.rotation.x += speed;
      f.rotation.y += speed * 1.3;
      f.position.y += Math.sin(clock + i) * 0.002;
    });

    renderer.render(scene, camera);
  }
  animate();
})();


/* ══════════════════════════════════════════
   TYPING ANIMATION
══════════════════════════════════════════ */
(function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const words = ['Developer', 'Architect', 'AI Builder', 'Team Lead'];
  let wi = 0, ci = 0, deleting = false;

  function tick() {
    const word = words[wi];
    if (deleting) {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; setTimeout(tick, 400); return; }
      setTimeout(tick, 60);
    } else {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(tick, 2000); return; }
      setTimeout(tick, 90);
    }
  }
  setTimeout(tick, 800);
})();


/* ══════════════════════════════════════════
   NAVBAR — SCROLL + MOBILE
══════════════════════════════════════════ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  hamburger && hamburger.addEventListener('click', () => {
    document.body.classList.toggle('nav-open');
  });

  // Close menu on link click
  document.querySelectorAll('.nav-links a').forEach(a =>
    a.addEventListener('click', () => document.body.classList.remove('nav-open'))
  );

  // Active nav highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => obs.observe(s));
})();


/* ══════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════ */
(function initReveal() {
  const revealTargets = [
    '.section-header',
    '.about-text', '.about-cards',
    '.skill-category',
    '.timeline-item',
    '.edu-card',
    '.project-card', '.other-project-card',
    '.contact-info', '.contact-form',
    '.info-card',
  ];

  revealTargets.forEach(sel =>
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.07}s`;
    })
  );

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();


/* ══════════════════════════════════════════
   SMOOTH SCROLL
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});


/* ══════════════════════════════════════════
   TOAST NOTIFICATION
══════════════════════════════════════════ */
const Toast = (() => {
  const el    = document.getElementById('toast');
  const icon  = document.getElementById('toastIcon');
  const title = document.getElementById('toastTitle');
  const msg   = document.getElementById('toastMsg');
  const close = document.getElementById('toastClose');
  let timer;

  close && close.addEventListener('click', hide);

  function show(type, t, m) {
    clearTimeout(timer);
    title.textContent = t;
    msg.textContent   = m;
    icon.innerHTML    = type === 'success'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    el.className = `toast toast-${type} toast-visible`;
    timer = setTimeout(hide, 5000);
  }

  function hide() {
    el.classList.remove('toast-visible');
  }

  return { show };
})();


/* ══════════════════════════════════════════
   CONTACT FORM — EmailJS
   Setup steps (one-time, ~2 min):
   1. Go to https://www.emailjs.com and sign up (free)
   2. Add Email Service → Gmail → connect info.krishantha.b@gmail.com → copy Service ID
   3. Create Email Template with variables: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
      → copy Template ID
   4. Go to Account → API Keys → copy Public Key
   5. Replace the three placeholder strings below with your real IDs
══════════════════════════════════════════ */
(function initForm() {
  const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // ← replace
  const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // ← replace
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // ← replace

  // Init EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Client-side validation
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const subject = form.subject.value.trim() || 'Portfolio Contact';
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      Toast.show('error', 'Missing fields', 'Please fill in all required fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Toast.show('error', 'Invalid email', 'Please enter a valid email address.');
      return;
    }

    const btn  = form.querySelector('.form-submit');
    const span = btn.querySelector('span');

    btn.disabled = true;
    btn.style.opacity = '0.7';
    span.textContent = 'Sending…';

    // Guard: if EmailJS keys not set yet, show instructions
    if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      setTimeout(() => {
        Toast.show('error', 'EmailJS not configured', 'Add your EmailJS keys in main.js to enable sending.');
        span.textContent = 'Send Message';
        btn.disabled = false;
        btn.style.opacity = '';
      }, 800);
      return;
    }

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name:  name,
        from_email: email,
        subject,
        message,
        reply_to:   email,
      });

      Toast.show('success', 'Message sent!', "Thanks " + name + ", I'll get back to you soon.");
      form.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      Toast.show('error', 'Failed to send', 'Something went wrong. Try emailing me directly.');
    } finally {
      span.textContent = 'Send Message';
      btn.disabled = false;
      btn.style.opacity = '';
    }
  });
})();


/* ══════════════════════════════════════════
   CURSOR GLOW EFFECT
══════════════════════════════════════════ */
(function initCursorGlow() {
  if (window.innerWidth < 768) return; // Skip on mobile

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.style.opacity = '1';
  });

  window.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });

  (function moveGlow() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';
    requestAnimationFrame(moveGlow);
  })();
})();


/* ══════════════════════════════════════════
   SKILL TAG HOVER SPARKLE
══════════════════════════════════════════ */
(function initSkillSparkle() {
  document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.08) translateY(-2px)';
    });
    tag.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });
})();


/* ══════════════════════════════════════════
   STAT COUNTER ANIMATION
══════════════════════════════════════════ */
(function initCounters() {
  const stats = document.querySelectorAll('.stat-num');
  const targets = [];

  stats.forEach(el => {
    const text = el.textContent;
    const num  = parseFloat(text);
    const suffix = text.replace(String(num), '');
    targets.push({ el, num, suffix, done: false });
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const t = targets.find(x => x.el === entry.target);
      if (!t || t.done) return;
      t.done = true;
      obs.unobserve(entry.target);

      let start = 0;
      const duration = 1500;
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
        const current = t.num * ease;
        t.el.textContent = (Number.isInteger(t.num) ? Math.round(current) : current.toFixed(1)) + t.suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => obs.observe(el));
})();


/* ══════════════════════════════════════════
   ACTIVE NAV LINK STYLE
══════════════════════════════════════════ */
(function () {
  const style = document.createElement('style');
  style.textContent = `.nav-links a.active { color: var(--accent-light) !important; background: rgba(59,130,246,0.1) !important; }`;
  document.head.appendChild(style);
})();
