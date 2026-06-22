/* ===== TMW - Thalia Metal Works | script.js ===== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Scroll progress bar ── */
  const bar = document.querySelector('.scroll-line');
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });

  /* ── Nav shrink on scroll ── */
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── Mobile hamburger ── */
  const ham = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');
  ham.addEventListener('click', () => {
    links.classList.toggle('open');
    const [a, b, c] = ham.querySelectorAll('span');
    if (links.classList.contains('open')) {
      a.style.transform = 'rotate(45deg) translate(5px,5px)';
      b.style.opacity   = '0';
      c.style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      a.style.transform = b.style.opacity = c.style.transform = '';
    }
  });

  /* Close mobile menu on link click */
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      ham.querySelectorAll('span').forEach(s => s.style = '');
    });
  });

  /* ── Fade-up on scroll ── */
  const fadeEls = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => observer.observe(el));

  /* ── Animated counters ── */
  function animateCount(el, target, duration = 1800) {
    const start = performance.now();
    const update = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(ease * target);
      if (t < 1) requestAnimationFrame(update);
      else el.textContent = target;
    };
    requestAnimationFrame(update);
  }

  const statsObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const nums = e.target.querySelectorAll('[data-count]');
        nums.forEach(n => animateCount(n, +n.dataset.count));
        statsObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.hero-stats').forEach(el => statsObs.observe(el));

  /* ── Contact form submit ── */
  const form = document.getElementById('contactForm');
  form && form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    const original = btn.innerHTML;
    btn.innerHTML = '✔ Message Sent';
    btn.style.background = '#2a9d4e';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3500);
  });

  /* ── Subtle parallax on hero logo ── */
  const logoWrap = document.querySelector('.hero-logo-wrap');
  if (logoWrap) {
    document.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      logoWrap.style.transform = `translate(${dx * 10}px, ${dy * 8}px)`;
    });
  }

  /* ── Service card tilt ── */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 8;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * -8;
      card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });

  /* ── Typing animation in hero ── */
  const typingEl = document.getElementById('typingText');
  const phrases = ['Precision Fabrication', 'Industrial Welding', 'Structural Steel', 'Custom Metal Work'];
  let pi = 0, ci = 0, deleting = false;
  function type() {
    const phrase = phrases[pi];
    if (!deleting) {
      typingEl.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      typingEl.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(type, deleting ? 45 : 85);
  }
  if (typingEl) type();

  /* ── Active nav link highlight ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const secObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => {
          a.style.color = a.getAttribute('href') === '#' + e.target.id
            ? 'var(--orange)' : '';
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => secObs.observe(s));

});
