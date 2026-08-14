document.addEventListener('DOMContentLoaded', () => {
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  const rotator = document.getElementById('word-rotator');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (rotator && !prefersReducedMotion) {
    const words = ['customers', 'leads', 'enquiries', 'sales'];
    let index = 0;

    setInterval(() => {
      rotator.classList.add('swap');
      setTimeout(() => {
        index = (index + 1) % words.length;
        rotator.textContent = words[index];
        rotator.classList.remove('swap');
      }, 250);
    }, 2000);
  }

  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const bgGrain = document.createElement('div');
  bgGrain.className = 'bg-grain';
  document.body.appendChild(bgGrain);

  const bgBlob2 = document.createElement('div');
  bgBlob2.className = 'bg-blob-2';
  document.body.appendChild(bgBlob2);

  if (!prefersReducedMotion) {
    const particleField = document.createElement('div');
    particleField.className = 'bg-particles';
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('span');
      particle.className = 'bg-particle';
      const size = (Math.random() * 3 + 3).toFixed(1);
      const duration = (Math.random() * 4 + 3).toFixed(1);
      const delay = (Math.random() * 5).toFixed(1);
      const peak = (Math.random() * 0.3 + 0.7).toFixed(2);

      particle.style.left = `${(Math.random() * 100).toFixed(1)}%`;
      particle.style.top = `${(Math.random() * 100).toFixed(1)}%`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.color = i % 3 === 0 ? 'var(--accent-2)' : 'var(--accent)';
      particle.style.setProperty('--dur', `${duration}s`);
      particle.style.setProperty('--delay', `${delay}s`);
      particle.style.setProperty('--peak', peak);

      particleField.appendChild(particle);
    }

    document.body.appendChild(particleField);

    // Cursor reactivity: the accent blob parallaxes with the pointer, and
    // particles flee (and glow) as the cursor nears them. Pointer-position
    // effects only make sense with a persistent mouse, so gate on hover
    // capability. Repulsion is calculated from each particle's original
    // (%-based) home position rather than its live displaced position, so
    // the math doesn't chase itself once a particle has been pushed.
    if (canHover) {
      bgBlob2.classList.add('is-reactive');

      const interactionRadius = 150;
      const maxPush = 60;

      const homePositions = () => Array.from(particleField.children).map((el) => ({
        el,
        x: (parseFloat(el.style.left) / 100) * window.innerWidth,
        y: (parseFloat(el.style.top) / 100) * window.innerHeight,
      }));

      let particlePositions = homePositions();
      window.addEventListener('resize', () => {
        particlePositions = homePositions();
      });

      let pointerX = window.innerWidth / 2;
      let pointerY = window.innerHeight / 2;
      let frameQueued = false;

      const applyReactiveEffects = () => {
        frameQueued = false;

        const offsetX = ((pointerX / window.innerWidth) - 0.5) * 40;
        const offsetY = ((pointerY / window.innerHeight) - 0.5) * 40;
        bgBlob2.style.transform = `translate(${offsetX.toFixed(1)}px, ${offsetY.toFixed(1)}px)`;

        particlePositions.forEach(({ el, x, y }) => {
          const dx = x - pointerX;
          const dy = y - pointerY;
          const dist = Math.hypot(dx, dy);
          const proximity = Math.max(0, 1 - dist / interactionRadius);
          el.style.setProperty('--proximity', proximity.toFixed(2));

          if (proximity > 0) {
            const angle = Math.atan2(dy, dx);
            const push = proximity * maxPush;
            el.style.transform = `translate(${(Math.cos(angle) * push).toFixed(1)}px, ${(Math.sin(angle) * push).toFixed(1)}px)`;
          } else {
            el.style.transform = '';
          }
        });
      };

      window.addEventListener('mousemove', (e) => {
        pointerX = e.clientX;
        pointerY = e.clientY;
        if (!frameQueued) {
          frameQueued = true;
          requestAnimationFrame(applyReactiveEffects);
        }
      });
    }
  }

  if (!prefersReducedMotion && canHover) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let glowActive = false;
    window.addEventListener('mousemove', (e) => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      if (!glowActive) {
        glow.classList.add('active');
        glowActive = true;
      }
    });
  }

  const scrollHints = document.querySelectorAll('.scroll-hint');

  const closeAllScrollHints = () => {
    scrollHints.forEach((btn) => {
      btn.setAttribute('aria-expanded', 'false');
      document.getElementById(btn.getAttribute('aria-controls')).hidden = true;
    });
  };

  scrollHints.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      closeAllScrollHints();
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
      }
    });
  });

  document.addEventListener('click', closeAllScrollHints);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllScrollHints();
  });

  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    const errorMsg = document.getElementById('form-error');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      errorMsg.hidden = true;
      submitBtn.disabled = true;

      fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      })
        .then((response) => {
          if (response.ok) {
            window.location.href = 'thanks.html';
          } else {
            errorMsg.hidden = false;
            submitBtn.disabled = false;
          }
        })
        .catch(() => {
          errorMsg.hidden = false;
          submitBtn.disabled = false;
        });
    });
  }
});
