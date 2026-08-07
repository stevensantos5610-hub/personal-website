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

  // Hero bird follow — Torogoz mark trails the cursor over the nature photo
  const heroBird = document.getElementById('heroBird');
  const heroRing = document.getElementById('heroRing');
  const canHoverBird = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  let heroBirdLastPos = null;
  let handoffToTravelBird = null;
  if (hero && heroBird && canHoverBird && !prefersReducedMotion) {
    const birdInner = heroBird.querySelector('.hero-bird-inner');
    const pos = { x: -60, y: -60 };
    const target = { x: -60, y: -60 };
    let lastX = 0;
    let birdRaf = null;
    const LAG = 0.055;

    let ringBounds = null;
    const computeRingBounds = () => {
      if (!heroRing) return;
      const heroRect = hero.getBoundingClientRect();
      const ringRect = heroRing.getBoundingClientRect();
      ringBounds = {
        cx: ringRect.left - heroRect.left + ringRect.width / 2,
        cy: ringRect.top - heroRect.top + ringRect.height / 2,
        rx: ringRect.width / 2,
        ry: ringRect.height / 2,
      };
    };
    computeRingBounds();
    window.addEventListener('resize', computeRingBounds);

    const birdColors = ['#FFFFFF', '#1749B0', '#8E44AD', '#E63946'];
    let colorIndex = -1;
    let wasThroughRing = false;

    const stepBird = () => {
      pos.x += (target.x - pos.x) * LAG;
      pos.y += (target.y - pos.y) * LAG;
      const bob = Math.sin(performance.now() * 0.006) * 2;
      const displayY = pos.y + bob;
      heroBird.style.transform = `translate3d(${pos.x}px, ${displayY}px, 0)`;
      heroBirdLastPos = { x: pos.x, y: displayY };

      if (ringBounds) {
        const nx = (pos.x - ringBounds.cx) / ringBounds.rx;
        const ny = (displayY - ringBounds.cy) / ringBounds.ry;
        const throughRing = nx * nx + ny * ny <= 1;
        if (throughRing && !wasThroughRing) {
          colorIndex = (colorIndex + 1) % birdColors.length;
          // Set on <body>, not just hero — the travel-bird lives outside the
          // hero in the DOM and needs to inherit this too, so its color
          // carries over when it flies off to the branches.
          document.body.style.setProperty('--bird-color', birdColors[colorIndex]);
        }
        wasThroughRing = throughRing;
        if (heroRing) heroRing.classList.toggle('is-lit', throughRing);
      }

      birdRaf = requestAnimationFrame(stepBird);
    };

    hero.addEventListener('mouseenter', (e) => {
      const rect = hero.getBoundingClientRect();
      target.x = lastX = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
      heroBird.classList.add('is-active');
      if (!birdRaf) birdRaf = requestAnimationFrame(stepBird);
    });

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      target.x = x;
      target.y = e.clientY - rect.top;
      if (birdInner) birdInner.classList.toggle('is-flipped', x < lastX);
      lastX = x;
    });

    hero.addEventListener('mouseleave', (e) => {
      heroBird.classList.remove('is-active');
      if (birdRaf) {
        cancelAnimationFrame(birdRaf);
        birdRaf = null;
      }
      const rect = hero.getBoundingClientRect();
      const leftFromBottom = e.clientY >= rect.bottom - 4;
      if (leftFromBottom && handoffToTravelBird) handoffToTravelBird();
    });
  }

  // Traveling bird — once past the hero, hops between each section's branch as you scroll
  const travelBird = document.getElementById('travelBird');
  const sectionBranches = [
    ['story', 'branch-story'],
    ['about-top', 'branch-about-top'],
    ['about', 'branch-about'],
    ['exp-abcd', 'exp-branch-abcd'],
    ['exp-hardwood', 'exp-branch-hardwood'],
    ['exp-digitalready', 'exp-branch-digitalready'],
  ];
  if (travelBird && hero && !prefersReducedMotion) {
    let currentSectionId = null;
    let flyTimeout = null;
    let ticking = false;
    let takeoffInProgress = false;
    const FLIGHT_MS = 1900; // must match the top/left transition duration in styles.css

    const branchAnchor = (branchId) => {
      const branch = document.getElementById(branchId);
      if (!branch) return null;
      const rect = branch.getBoundingClientRect();
      // 4/160, 92/100 — the exact base coordinate of the branch path in its own viewBox
      return {
        x: rect.left + window.scrollX + rect.width * 0.025,
        y: rect.top + window.scrollY + rect.height * 0.92,
      };
    };

    const flyTo = (branchId, instant) => {
      const anchor = branchAnchor(branchId);
      if (!anchor) return;
      if (instant) {
        travelBird.classList.add('is-repositioning');
        travelBird.style.left = `${anchor.x}px`;
        travelBird.style.top = `${anchor.y}px`;
        travelBird.offsetHeight;
        travelBird.classList.remove('is-repositioning');
      } else {
        travelBird.style.left = `${anchor.x}px`;
        travelBird.style.top = `${anchor.y}px`;
        travelBird.classList.add('is-flying');
        if (flyTimeout) clearTimeout(flyTimeout);
        flyTimeout = setTimeout(() => travelBird.classList.remove('is-flying'), FLIGHT_MS);
      }
    };

    // First hand-off from the hero bird — starts exactly where the cursor bird
    // last was (or the hero's center, if it was never hovered), loosely trails
    // the live cursor for a moment so the hand-off doesn't feel like an
    // instant commitment, then peels off and flies the rest of the way to
    // the branch on its own.
    const TRAIL_MS = 450;
    const TRAIL_LAG = 0.14;
    const takeoffAndFly = (branchId) => {
      const anchor = branchAnchor(branchId);
      if (!anchor) return;
      takeoffInProgress = true;
      const heroRect = hero.getBoundingClientRect();
      const heroDocLeft = heroRect.left + window.scrollX;
      const heroDocTop = heroRect.top + window.scrollY;
      const start = heroBirdLastPos
        ? { x: heroDocLeft + heroBirdLastPos.x, y: heroDocTop + heroBirdLastPos.y }
        : { x: heroDocLeft + heroRect.width / 2, y: heroDocTop + heroRect.height / 2 };

      travelBird.classList.add('is-repositioning');
      travelBird.style.left = `${start.x}px`;
      travelBird.style.top = `${start.y}px`;
      travelBird.offsetHeight; // force layout so the start position commits before animating
      travelBird.classList.add('is-visible', 'is-flying');

      let curX = start.x;
      let curY = start.y;
      let liveX = start.x;
      let liveY = start.y;
      const onDocMove = (e) => {
        liveX = e.pageX;
        liveY = e.pageY;
      };
      document.addEventListener('mousemove', onDocMove);

      const trailStart = performance.now();
      const stepTrail = () => {
        curX += (liveX - curX) * TRAIL_LAG;
        curY += (liveY - curY) * TRAIL_LAG;
        travelBird.style.left = `${curX}px`;
        travelBird.style.top = `${curY}px`;
        if (performance.now() - trailStart < TRAIL_MS) {
          requestAnimationFrame(stepTrail);
        } else {
          // Peel off — hand back to the CSS transition to carry it the rest
          // of the way to the branch on its own flight path.
          document.removeEventListener('mousemove', onDocMove);
          travelBird.classList.remove('is-repositioning');
          travelBird.offsetHeight;
          travelBird.style.left = `${anchor.x}px`;
          travelBird.style.top = `${anchor.y}px`;
          if (flyTimeout) clearTimeout(flyTimeout);
          flyTimeout = setTimeout(() => {
            travelBird.classList.remove('is-flying');
            takeoffInProgress = false;
          }, FLIGHT_MS);
        }
      };
      requestAnimationFrame(stepTrail);
    };

    // Hero is included here (with no branch) purely so the reference-line
    // check below can tell "still in the hero" apart from "in the first
    // section" — without it, a hero taller than the viewport could keep
    // matching hero even while the next section is clearly what's on screen.
    const sectionEls = [{ sectionId: 'hero', branchId: null, el: hero }]
      .concat(sectionBranches.map(([sectionId, branchId]) => ({ sectionId, branchId, el: document.getElementById(sectionId) })))
      .filter((s) => s.el);

    const findCurrentMatch = () => {
      const refY = window.innerHeight * 0.4;
      for (const s of sectionEls) {
        const rect = s.el.getBoundingClientRect();
        if (rect.top <= refY && rect.bottom >= refY) return s;
      }
      // Below the last tracked section (scrolled past the end of the
      // feature, e.g. into the testimonial/skills/projects/contact
      // sections) — signal that with null so the bird fades out and stays
      // gone for the rest of the page, rather than sticking to its last spot.
      const last = sectionEls[sectionEls.length - 1];
      if (refY > last.el.getBoundingClientRect().bottom) return null;
      return sectionEls[0]; // above the first tracked section — still "hero"
    };

    let wasPastHero = false;

    const takeoffToSection = (sectionId, branchId) => {
      if (wasPastHero) return;
      wasPastHero = true;
      currentSectionId = sectionId;
      takeoffAndFly(branchId);
    };

    const firstSection = sectionEls.find((s) => s.sectionId !== 'hero');

    // Cursor-driven handoff — crossing the hero's bottom edge (or entering
    // the section right below it) can only ever reveal the section that
    // immediately follows the hero, so both go straight there rather than
    // going through the scroll-based reference-line check, which can still
    // say "hero" if the hero is taller than the viewport.
    handoffToTravelBird = () => {
      if (firstSection) takeoffToSection(firstSection.sectionId, firstSection.branchId);
    };

    if (firstSection) {
      firstSection.el.addEventListener('mouseenter', () => {
        takeoffToSection(firstSection.sectionId, firstSection.branchId);
      });
    }

    const updateActiveSection = () => {
      ticking = false;
      if (takeoffInProgress) return; // a takeoff/trail/flight is already running — don't fight it
      const match = findCurrentMatch();

      if (!match || match.sectionId === 'hero') {
        travelBird.classList.remove('is-visible');
        wasPastHero = false;
        currentSectionId = null;
        return;
      }

      if (!wasPastHero) {
        // Scrolled past without the cursor ever leaving from the bottom
        // (e.g. keyboard/wheel scroll on a device with no live cursor).
        wasPastHero = true;
        currentSectionId = match.sectionId;
        takeoffAndFly(match.branchId);
      } else if (match.sectionId !== currentSectionId) {
        currentSectionId = match.sectionId;
        flyTo(match.branchId, false);
      } else if (!travelBird.classList.contains('is-flying')) {
        // Same section still active and already landed — just keep the bird
        // glued to the branch (e.g. after a resize). Skipped while a flight
        // is still in progress, otherwise every scroll tick during the 1.9s
        // flight would snap it straight to the target and cut it short.
        flyTo(match.branchId, true);
      }
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateActiveSection);
      }
    }, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    updateActiveSection();

    // While perched on a branch (visible, not mid-flight), turn the bird's
    // head to loosely track the cursor — the body stays put on the branch.
    if (canHoverBird) {
      const travelBirdHead = travelBird.querySelector('.travel-bird-head');
      const MAX_TILT = 28;
      document.addEventListener('mousemove', (e) => {
        if (!travelBirdHead) return;
        if (!travelBird.classList.contains('is-visible') || travelBird.classList.contains('is-flying')) return;
        const rect = travelBird.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        // Negated — the bird's SVG is mirrored (scaleX(-1)) to face the
        // other way while perched, which flips how a rotation reads visually.
        const tiltX = Math.max(-1, Math.min(1, -dx / 150));
        const tiltY = Math.max(-1, Math.min(1, dy / 100));
        const tilt = (tiltY * 0.8 + tiltX * 0.2) * MAX_TILT;
        travelBirdHead.style.transform = `rotate(${tilt.toFixed(1)}deg)`;
      });
    }
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
