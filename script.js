/**
 * TECHFEST 2026 — OFFICIAL LANDING PAGE ENGINE
 * Zero external frameworks; written in pure vanilla JavaScript.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Clear initial load state
  document.body.classList.remove('loading');

  initNavbarScroll();
  initCustomCursor();
  initParallax();
  initScrollObserver();
  initEventCardTilt();
  initMagneticButtons();
});

/**
 * 1. HEADER OPACITY CONTROLLER
 * Adjusts border & backdrop intensity as page scrolls.
 */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * 2. FLUID DUAL-STAGE MOUSE CURSOR
 * Implements linear interpolation (lerp) on outer ring with precision inner point.
 */
function initCustomCursor() {
  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursor-dot');
  if (!cursor || !dot) return;

  // Don't initialize on touch devices
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    return;
  }

  let mouseX = -100, mouseY = -100;
  let cursorX = -100, cursorY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Dot sticks instantly to hardware cursor
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  // Smooth lerp loop for outer orbital ring
  const renderCursor = () => {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  };
  requestAnimationFrame(renderCursor);

  // Dynamic interactive element hover behaviors
  const interactiveTargets = document.querySelectorAll(
    'a, button, [data-cursor="btn"], [data-cursor="link"], [data-cursor="expand"], [data-cursor="hover"]'
  );

  interactiveTargets.forEach((target) => {
    target.addEventListener('mouseenter', () => cursor.classList.add('active'));
    target.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
}

/**
 * 3. HERO & ORBITAL PARALLAX SYSTEM
 * Coordinates subtle 3D rotational tilt and orbital translation.
 */
function initParallax() {
  const heroSection = document.getElementById('hero');
  const orbitalParallax = document.getElementById('orbital-parallax');
  if (!heroSection || !orbitalParallax) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let currentX = 0, currentY = 0;
  let targetX = 0, targetY = 0;

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const xRel = (e.clientX - rect.left) / rect.width - 0.5;
    const yRel = (e.clientY - rect.top) / rect.height - 0.5;
    targetX = xRel * 35;
    targetY = yRel * 35;
  });

  const renderParallax = () => {
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;
    orbitalParallax.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;
    requestAnimationFrame(renderParallax);
  };
  requestAnimationFrame(renderParallax);
}

/**
 * 4. INTERSECTION OBSERVER
 * Handles typography reveal triggers & telemetry metric counter rolls.
 */
function initScrollObserver() {
  const revealElements = document.querySelectorAll('.section-reveal');
  const statCounters = document.querySelectorAll('.counter');

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  // Numerical counter animator
  let statsTriggered = false;
  const statsObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !statsTriggered) {
        statsTriggered = true;
        statCounters.forEach(counter => animateCounter(counter));
        obs.disconnect();
      }
    });
  }, { threshold: 0.2 });

  const statsMatrix = document.querySelector('.stats-matrix');
  if (statsMatrix) {
    statsObserver.observe(statsMatrix);
  }
}

/**
 * Performs accurate numerical counts honoring floating point decimals.
 */
function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target'));
  const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
  const duration = 2000;
  const startTime = performance.now();

  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Quintic ease-out curve
    const easeProgress = 1 - Math.pow(1 - progress, 5);
    const currentVal = progress * target;

    el.textContent = decimals > 0 
      ? currentVal.toFixed(decimals) 
      : Math.floor(currentVal).toString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = decimals > 0 ? target.toFixed(decimals) : target.toString();
    }
  };

  requestAnimationFrame(update);
}

/**
 * 5. INTERACTIVE EVENT CARD 3D TILT
 * Calculates mouse offset relative to card bounding box.
 */
function initEventCardTilt() {
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.magnetic-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const tiltX = (centerY - y) / 18;
      const tiltY = (x - centerX) / 18;

      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/**
 * 6. MAGNETIC BUTTON INTERACTION
 * Pulls primary buttons toward pointer within a localized proximity radius.
 */
function initMagneticButtons() {
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const magneticElements = document.querySelectorAll('.magnetic');

  magneticElements.forEach((elem) => {
    elem.addEventListener('mousemove', (e) => {
      const rect = elem.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      elem.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
    });

    elem.addEventListener('mouseleave', () => {
      elem.style.transform = 'translate(0px, 0px)';
    });
  });
}
