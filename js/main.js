(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Nav background swap once page is scrolled past the hero
  const siteNav = document.querySelector('.site-nav');
  const hero = document.getElementById('hero');
  if (siteNav && hero) {
    const navObserver = new IntersectionObserver(
      ([entry]) => siteNav.classList.toggle('scrolled', !entry.isIntersecting),
      { rootMargin: `-${siteNav.offsetHeight}px 0px 0px 0px`, threshold: 0 }
    );
    navObserver.observe(hero);
  }

  // Projects gallery — circular prev/next arrows scroll the horizontal strip
  const gallery = document.getElementById('projectsGallery');
  const galleryPrev = document.getElementById('galleryPrev');
  const galleryNext = document.getElementById('galleryNext');
  if (gallery && galleryPrev && galleryNext) {
    const scrollByCard = (direction) => {
      const card = gallery.querySelector('.project-card');
      const step = card ? card.getBoundingClientRect().width + 24 : 360;
      gallery.scrollBy({ left: direction * step, behavior: 'smooth' });
    };
    galleryPrev.addEventListener('click', () => scrollByCard(-1));
    galleryNext.addEventListener('click', () => scrollByCard(1));
  }

  // Fullscreen buttons on photos in the "Some of our work" gallery.
  // Uses a custom lightbox rather than the Fullscreen API — iOS Safari
  // doesn't support requestFullscreen() on <img> elements (only <video>),
  // so a lightbox is the only approach that works consistently on both
  // desktop and mobile.
  const photoLightbox = document.getElementById('photoLightbox');
  const photoLightboxImg = document.getElementById('photoLightboxImg');
  if (photoLightbox && photoLightboxImg) {
    const openLightbox = (img) => {
      photoLightboxImg.src = img.src;
      photoLightboxImg.alt = img.alt;
      photoLightbox.hidden = false;
      document.body.style.overflow = 'hidden';
    };
    const closeLightbox = () => {
      photoLightbox.hidden = true;
      document.body.style.overflow = '';
      photoLightboxImg.src = '';
    };
    document.querySelectorAll('.fullscreen-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const img = btn.previousElementSibling;
        if (img) openLightbox(img);
      });
    });
    photoLightbox.querySelectorAll('[data-close]').forEach((el) => {
      el.addEventListener('click', closeLightbox);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !photoLightbox.hidden) closeLightbox();
    });
  }

  // Résumé preview modal
  const resumeOpenBtn = document.getElementById('resumeOpenBtn');
  const resumeModal = document.getElementById('resumeModal');
  const resumeFrame = document.getElementById('resumeFrame');
  const RESUME_SRC = 'assets/resume/Steven_Santos_Resume.pdf';
  if (resumeOpenBtn && resumeModal && resumeFrame) {
    const openResume = () => {
      if (!resumeFrame.src) resumeFrame.src = RESUME_SRC;
      resumeModal.hidden = false;
      document.body.style.overflow = 'hidden';
    };
    const closeResume = () => {
      resumeModal.hidden = true;
      document.body.style.overflow = '';
    };
    resumeOpenBtn.addEventListener('click', openResume);
    resumeModal.querySelectorAll('[data-close]').forEach((el) => {
      el.addEventListener('click', closeResume);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !resumeModal.hidden) closeResume();
    });
  }

  // Scroll-reveal for elements marked .reveal
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }
})();
