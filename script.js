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
