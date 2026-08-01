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

  // Fullscreen buttons on photos in the "Some of our work" gallery
  document.querySelectorAll('.fullscreen-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const img = btn.previousElementSibling;
      if (img && img.requestFullscreen) {
        img.requestFullscreen().catch(() => {});
      }
    });
  });

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
