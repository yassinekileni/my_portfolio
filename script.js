// ============================================================
//  Mohamed Yassine Kilani — Portfolio Interactive JS
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // --- 0. Dynamic Interactive Custom Cursor & Motion Particle Trail ---
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (cursorDot && cursorRing) {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;
    let lastParticleX = -100;
    let lastParticleY = -100;
    let lastParticleTime = 0;

    // Smooth physics lerp loop for the outer cursor ring
    function updateCursorRing() {
      if (isVisible) {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
      }
      requestAnimationFrame(updateCursorRing);
    }
    requestAnimationFrame(updateCursorRing);

    // Spawns a glowing micro-particle as cursor moves across the screen
    function createTrailParticle(x, y) {
      const particle = document.createElement('div');
      particle.className = 'cursor-trail-particle';
      const size = Math.random() * 4 + 4; // 4px to 8px
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      const offsetX = (Math.random() - 0.5) * 6;
      const offsetY = (Math.random() - 0.5) * 6;
      particle.style.left = `${x + offsetX}px`;
      particle.style.top = `${y + offsetY}px`;
      document.body.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 650);
    }

    window.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        ringX = mouseX;
        ringY = mouseY;
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
      }

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;

      // Emit particle trail when mouse moves beyond threshold
      const dx = mouseX - lastParticleX;
      const dy = mouseY - lastParticleY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const now = performance.now();

      if (dist > 12 && now - lastParticleTime > 22) {
        createTrailParticle(mouseX, mouseY);
        lastParticleX = mouseX;
        lastParticleY = mouseY;
        lastParticleTime = now;
      }
    });

    window.addEventListener('mouseleave', () => {
      isVisible = false;
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });

    window.addEventListener('mouseenter', () => {
      isVisible = true;
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    });

    window.addEventListener('mousedown', () => {
      cursorRing.classList.add('cursor-click');
    });

    window.addEventListener('mouseup', () => {
      cursorRing.classList.remove('cursor-click');
    });

    // Reactive hover expansion on interactive elements
    const interactiveSelectors = 'a, button, input, textarea, .tilt-card, .clickable-card, .clickable-design, .tech-chip, .behance-btn, .nav-item, .stat-box, .info-card';
    document.querySelectorAll(interactiveSelectors).forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-hover'));
    });
  }

  // --- 1. Mobile Navigation Toggle ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }

  // --- 2. Scroll Reveal Observer ---
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // --- 3. ScrollSpy Active Nav Link Highlight ---
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll);

  // --- 4. Interactive 3D Card Tilt Effect ---
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // --- 5. Lightbox Modal for Design & Certification Cards ---
  const modalBackdrop = document.getElementById('lightboxModal');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');

  function openModal(contentHtml) {
    if (modalBackdrop && modalBody) {
      modalBody.innerHTML = contentHtml;
      modalBackdrop.classList.add('active');
      modalBackdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
      modalBackdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', e => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // Clickable Photoshop Design Cards -> Open High-Res PNG Modal
  document.querySelectorAll('.clickable-design').forEach(card => {
    card.addEventListener('click', () => {
      const imgSrc = card.getAttribute('data-img');
      const title = card.getAttribute('data-title');
      const tool = card.getAttribute('data-tool');

      const html = `
        <img src="${imgSrc}" alt="${title}" class="modal-body-img"/>
        <h3 class="modal-title">${title}</h3>
        <p class="modal-subtitle">Created with ${tool}</p>
        <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:1rem;">
          <a href="${imgSrc}" target="_blank" class="btn btn-primary btn-sm">
            🔎 Open Full HD Image in New Tab ↗
          </a>
          <a href="https://www.behance.net/gallery/215406723/Designs-that-speak-First-ever-designs-in-my-lab" target="_blank" class="btn btn-outline btn-sm">
            🎨 View Behance Project ↗
          </a>
        </div>
      `;
      openModal(html);
    });
  });

  // Clickable Certification Cards -> Open Certificate Preview Modal
  document.querySelectorAll('.clickable-card[data-modal]').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-title');
      const issuer = card.getAttribute('data-issuer');
      const tag = card.getAttribute('data-tag');
      const icon = card.getAttribute('data-icon') || '📜';
      const desc = card.getAttribute('data-desc');

      const html = `
        <div style="text-align:center; padding:1rem 0;">
          <div style="font-size:3.5rem; margin-bottom:1rem;">${icon}</div>
          <h3 class="modal-title">${title}</h3>
          <p class="modal-subtitle">${issuer} · <span class="cert-tag">${tag}</span></p>
          <p class="modal-desc" style="max-width:600px; margin:1rem auto 1.5rem;">${desc}</p>
          <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
            <a href="https://www.linkedin.com/in/yassine-kilani-9496892b5/?locale=fr" target="_blank" rel="noopener" class="btn btn-primary">
              💼 View Certification on LinkedIn Profile ↗
            </a>
          </div>
        </div>
      `;
      openModal(html);
    });
  });

  // --- 6. Background Particle Canvas with Mouse Constellation ---
  const canvas = document.getElementById('bgCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H;
    let stars = [];
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', () => { resize(); init(); });

    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    function init() {
      // Twinkling background stars
      stars = Array.from({ length: 140 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3,
        speed: Math.random() * 0.004 + 0.001,
        phase: Math.random() * Math.PI * 2
      }));

      // Floating ambient particles for constellation net
      particles = Array.from({ length: 45 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 2 + 1
      }));
    }

    init();
    let frame = 0;

    function renderCanvas() {
      ctx.clearRect(0, 0, W, H);

      frame++;

      // Draw stars
      stars.forEach(s => {
        const a = 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(frame * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(215, 230, 255, ${a})`;
        ctx.fill();
      });

      // Update & draw particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(74, 144, 226, 0.45)';
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(74, 144, 226, ${0.25 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Mouse interaction line
        if (mouse.x && mouse.y) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < mouse.radius) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(74, 144, 226, ${0.45 * (1 - mdist / mouse.radius)})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(renderCanvas);
    }

    renderCanvas();
  }

  // --- 7. Static Client-Side Contact Form Handler ---
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('formName').value;
      const email = document.getElementById('formEmail').value;
      const subject = document.getElementById('formSubject').value || 'Portfolio Contact';
      const message = document.getElementById('formMessage').value;

      formStatus.style.color = '#4A90E2';
      formStatus.innerHTML = '⏳ Opening your email application...';

      // Construct mailto URI
      const mailtoSubject = encodeURIComponent(`[Portfolio] ${subject} - from ${name}`);
      const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      const mailtoUrl = `mailto:yassinekilenii@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

      setTimeout(() => {
        window.location.href = mailtoUrl;
        formStatus.style.color = '#10b981';
        formStatus.innerHTML = `✅ Thank you, <strong>${name}</strong>! Email client launched. You can also reach me directly at <a href="mailto:yassinekilenii@gmail.com" style="color:#4A90E2;">yassinekilenii@gmail.com</a>.`;
        contactForm.reset();
      }, 600);
    });
  }

});