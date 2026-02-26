// script.js
// Vanilla JS for infinite scrolling portfolio strip and lightbox gallery
// Commented for clarity

// Import projects from centralized data file
import { selectedWorkProjects } from './data/selectedWorkProjects.js';

document.addEventListener('DOMContentLoaded', () => {
  // Animate heading by splitting text into spans for per-letter stagger
  const nameEl = document.querySelector('.name');
  if (nameEl) {
    const txt = nameEl.textContent.trim();
    nameEl.innerHTML = '';
    Array.from(txt).forEach((ch, i) => {
      const span = document.createElement('span');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.setProperty('--i', i);
      span.style.animationDelay = `${i * 0.03}s`;
      nameEl.appendChild(span);
    });
  }

  // Animate subtitle by words
  const sub = document.querySelector('.subtitle');
  if (sub) {
    const words = sub.textContent.trim().split(/\s+/);
    sub.innerHTML = '';
    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.textContent = w; // spacing handled via CSS margin to avoid collapsing issues
      span.style.animationDelay = `${0.12 + i * 0.06}s`;
      sub.appendChild(span);
    });
  }
  const track = document.getElementById('track');
  const cards = Array.from(track.children);
  // Selected Work: data-driven grid
  const projectsGrid = document.getElementById('projectsGrid');

  // Projects now imported from data/selectedWorkProjects.js
  const projects = selectedWorkProjects;

  function buildCard(p) {
    const a = document.createElement('a');
    a.className = 'project-card project-item';
    // Link to template-specific HTML file with slug query parameter
    a.href = `projects/${p.template}.html?slug=${p.slug}`;
    a.setAttribute('data-id', p.id);
    // Open in same tab for internal project pages
    a.target = '_self';

    // 1. Image Wrap
    const imgWrap = document.createElement('div');
    imgWrap.className = 'img-wrap';

    // Case Study Tag (using type from data)
    if (p.type === 'case-study') {
      const tag = document.createElement('span');
      tag.className = 'case-tag';
      tag.textContent = 'Case Study';
      imgWrap.appendChild(tag);
    }

    const img = document.createElement('img');
    img.src = p.heroPlaceholderImage;
    img.alt = `${p.title} - ${p.category}`;
    img.setAttribute('loading', 'lazy');
    imgWrap.appendChild(img);

    const viewBtn = document.createElement('div');
    viewBtn.className = 'view-btn';
    // Match the premium arrow-up-right icon
    viewBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    imgWrap.appendChild(viewBtn);

    // 2. Info Section
    const info = document.createElement('div');
    info.className = 'info';

    const categoryEl = document.createElement('div');
    categoryEl.className = 'category';
    categoryEl.textContent = p.category.toUpperCase();

    const titleEl = document.createElement('div');
    titleEl.className = 'title';
    titleEl.textContent = p.title;

    const descEl = document.createElement('p');
    descEl.className = 'description';
    descEl.textContent = p.shortDescription;

    info.appendChild(categoryEl);
    info.appendChild(titleEl);
    info.appendChild(descEl);

    a.appendChild(imgWrap);
    a.appendChild(info);

    return a;
  }

  let projectsEntered = false;
  let isShowingAllProjects = false;
  const viewMoreWrap = document.getElementById('viewMoreWrap');
  const viewMoreBtn = document.getElementById('viewMoreBtn');

  function renderProjects(filter = 'All') {
    if (!projectsGrid) return;

    // animate out existing
    const existing = Array.from(projectsGrid.children);
    // Faster stagger out (20ms) but longer total time (400ms) for a cleaner clear
    existing.forEach((el, i) => {
      el.classList.remove('is-visible');
      el.style.transitionDelay = `${i * 20}ms`;
    });

    setTimeout(() => {
      projectsGrid.innerHTML = '';
      const filtered = projects.filter(p => filter === 'All' ? true : p.category === filter);

      // Limiting logic
      const limit = 8;
      const shouldShowViewMore = filtered.length > limit;

      if (viewMoreWrap) {
        viewMoreWrap.style.display = (shouldShowViewMore && !isShowingAllProjects) ? 'flex' : 'none';
      }

      const projectsToDisplay = isShowingAllProjects ? filtered : filtered.slice(0, limit);
      const frag = document.createDocumentFragment();

      projectsToDisplay.forEach((p, i) => {
        const el = buildCard(p);
        // Slightly slower entry stagger (80ms) for a high-end feel
        el.style.transitionDelay = `${i * 80}ms`;
        frag.appendChild(el);
      });

      projectsGrid.appendChild(frag);

      // Trigger the enter animation
      requestAnimationFrame(() => {
        if (projectsEntered) {
          // Use a tiny timeout to ensure DOM is ready and transition-delay is respected
          setTimeout(() => {
            Array.from(projectsGrid.children).forEach((c) => c.classList.add('is-visible'));
          }, 20);
        }
      });
    }, 400); // Increased from 200ms to allow smooth fade out
  }

  // filters
  const filterBtns = document.querySelectorAll('.selected-work .filter');
  filterBtns.forEach(btn => btn.addEventListener('click', (e) => {
    filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    const b = e.currentTarget; b.classList.add('active'); b.setAttribute('aria-pressed', 'true');
    isShowingAllProjects = false; // Reset to limited view when filter changes
    renderProjects(b.getAttribute('data-filter'));
  }));

  // View More Projects Click Handler
  if (viewMoreBtn) {
    viewMoreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      isShowingAllProjects = true;
      const activeFilter = document.querySelector('.selected-work .filter.active')?.getAttribute('data-filter') || 'All';
      renderProjects(activeFilter);
    });
  }

  // Initial render
  renderProjects('All');

  // Intersection Observer for Selected Work Section
  const selectedWorkSection = document.getElementById('selected-work');
  if (selectedWorkSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          projectsEntered = true;
          // Trigger animation for cards currently in grid
          const items = projectsGrid.querySelectorAll('.project-item');
          items.forEach((item, i) => {
            // Re-apply delay in case they were rendered before scroll
            item.style.transitionDelay = `${i * 80}ms`;
            requestAnimationFrame(() => item.classList.add('is-visible'));
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    observer.observe(selectedWorkSection);
  }

  const lightbox = document.getElementById('lightbox');
  const lbImg = document.querySelector('.lb-img');
  const lbClose = document.querySelector('.lb-close');
  const lbNext = document.querySelector('.lb-next');
  const lbPrev = document.querySelector('.lb-prev');

  // Stagger entrance for initial cards
  Array.from(track.children).forEach((c, i) => {
    c.style.animationDelay = `${i * 60}ms`;
  });

  // Event Delegation for 3D Tilt Effect (works on originals and clones)
  track.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Ambient glow gradient center
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    // Tilt Calculation
    const tiltX = (y / rect.height - 0.5) * -12;
    const tiltY = (x / rect.width - 0.5) * 12;

    card.style.setProperty('--mouse-x', `${percentX}%`);
    card.style.setProperty('--mouse-y', `${percentY}%`);
    card.style.transform = `translateY(-20px) translateZ(50px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  }, { passive: true });

  track.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.card');
    if (!card || card.contains(e.relatedTarget)) return;
    card.style.transform = '';
  });

  // ensure we have enough items for seamless scroll by cloning until width > 2x container
  const ensureLoop = () => {
    // 1. Pre-measure all card widths ONCE to avoid layout thrashing
    const gap = parseFloat(getComputedStyle(track).gap || 16);
    const cardWidths = cards.map(c => c.getBoundingClientRect().width);
    let originalW = 0;
    cardWidths.forEach(w => originalW += w + gap);

    // 2. Clone until total length covers at least (original width + viewport width)
    const containerWidth = window.innerWidth;
    let totalW = originalW;
    let idx = 0;

    while (totalW < originalW + containerWidth) {
      const clone = cards[idx % cards.length].cloneNode(true);
      track.appendChild(clone);
      // Use pre-measured width instead of forcing layout recalc
      totalW += cardWidths[idx % cards.length] + gap;
      idx++;
      if (idx > 50) break; // safety
    }

    return originalW;
  };

  let loopWidth = ensureLoop();

  // Scrolling using requestAnimationFrame with delta-time for "liquid" smoothness
  let px = 0; // current translation
  const speedScale = 0.05; // speed factor (px per ms)
  let lastTime = performance.now();
  let paused = false;

  // On small screens, disable auto-scroll (allow manual swipe). Threshold: 420px
  // Enable auto-scroll on all devices for "super smooth" feel
  const isAutoScrollEnabled = () => true;

  // Re-calibrate on resize for butter-smooth continuity
  window.addEventListener('resize', () => {
    // Clear clones and re-run ensureLoop for correct measurements on new width
    const allItems = Array.from(track.children);
    allItems.forEach((item, i) => {
      if (i >= cards.length) item.remove();
    });
    loopWidth = ensureLoop();
  });

  function step(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    if (!paused && isAutoScrollEnabled() && deltaTime < 100) {
      px += speedScale * deltaTime;
      if (px >= loopWidth) px = px - loopWidth;
      // Use raw floats for flawlessly smooth browser interpolation
      track.style.transform = `translate3d(${-px}px, 0, 0)`;
    }
    raf = requestAnimationFrame(step);
  }

  // Defer strip animation to after full page load to reduce TBT
  let raf;
  window.addEventListener('load', () => {
    lastTime = performance.now();
    raf = requestAnimationFrame(step);
  });

  // Pause on hover/focus
  track.addEventListener('mouseenter', () => paused = true);
  track.addEventListener('mouseleave', () => paused = false);

  // Manual drag/swipe logic with momentum
  let isDragging = false;
  let dragStartX = 0;
  let dragStartPx = 0;
  let lastDragX = 0;
  let velocity = 0;

  track.addEventListener('touchstart', (e) => {
    paused = true;
    isDragging = true;
    dragStartX = e.touches[0].clientX;
    lastDragX = dragStartX;
    dragStartPx = px;
    velocity = 0;
    track.style.cursor = 'grabbing';
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const deltaX = dragStartX - currentX;

    // Smooth velocity tracking
    velocity = (lastDragX - currentX) * 0.8 + (velocity * 0.2);
    lastDragX = currentX;

    px = dragStartPx + deltaX;

    // Bounds wrapping
    if (px >= loopWidth) {
      px -= loopWidth;
      dragStartX -= loopWidth;
    } else if (px < 0) {
      px += loopWidth;
      dragStartX += loopWidth;
    }

    track.style.transform = `translate3d(${-px}px, 0, 0)`;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    isDragging = false;
    track.style.cursor = 'grab';

    const applyMomentum = () => {
      if (Math.abs(velocity) < 0.1 || isDragging) {
        paused = false;
        return;
      }
      px += velocity;
      velocity *= 0.95; // Friction

      if (px >= loopWidth) px -= loopWidth;
      else if (px < 0) px += loopWidth;

      track.style.transform = `translate3d(${-px}px, 0, 0)`;
      requestAnimationFrame(applyMomentum);
    };
    applyMomentum();
  });

  // Mouse drag for desktop
  track.addEventListener('mousedown', (e) => {
    paused = true;
    isDragging = true;
    dragStartX = e.clientX;
    lastDragX = dragStartX;
    dragStartPx = px;
    velocity = 0;
    track.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = dragStartX - e.clientX;
    velocity = (lastDragX - e.clientX) * 0.8 + (velocity * 0.2);
    lastDragX = e.clientX;
    px = dragStartPx + deltaX;

    if (px >= loopWidth) {
      px -= loopWidth;
      dragStartX -= loopWidth;
    } else if (px < 0) {
      px += loopWidth;
      dragStartX += loopWidth;
    }
    track.style.transform = `translate3d(${-px}px, 0, 0)`;
  }, { passive: true });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.cursor = 'grab';

    const applyMomentum = () => {
      if (Math.abs(velocity) < 0.1 || isDragging) {
        paused = false;
        return;
      }
      px += velocity;
      velocity *= 0.95;
      if (px >= loopWidth) px -= loopWidth;
      else if (px < 0) px += loopWidth;
      track.style.transform = `translate3d(${-px}px, 0, 0)`;
      requestAnimationFrame(applyMomentum);
    };
    applyMomentum();
  });

  // Recompute sizes on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      loopWidth = originalWidth();
      // If auto-scroll now disabled, ensure track transform is reset
      if (!isAutoScrollEnabled()) track.style.transform = '';
    }, 120);
  });

  // Premium Lightbox behavior
  const lbBackdrop = lightbox.querySelector('.lb-backdrop');
  const lbMetaCategory = lightbox.querySelector('.lb-meta-category');
  const lbMetaTitle = lightbox.querySelector('.lb-meta-title');
  const lbMetaYear = lightbox.querySelector('.lb-meta-year');

  const openLightbox = (cardEl) => {
    const cardImg = cardEl.querySelector('img');
    const allCards = Array.from(track.querySelectorAll('.card'));
    const idx = allCards.indexOf(cardEl);

    // Prep metadata
    lbMetaTitle.textContent = cardEl.getAttribute('data-title') || '';
    lbMetaCategory.textContent = cardEl.getAttribute('data-role') || '';
    lbMetaYear.textContent = cardEl.getAttribute('data-year') || '';

    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.dataset.index = idx;
    lbImg.src = cardImg.src;
    lbImg.alt = cardImg.alt || '';

    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      lbImg.src = '';
    }, 300);
    document.body.style.overflow = '';
  };

  const updateLightboxContent = (idx) => {
    const allCards = Array.from(track.querySelectorAll('.card'));
    const cardEl = allCards[idx];
    if (!cardEl) return;

    const cardImg = cardEl.querySelector('img');
    lightbox.dataset.index = idx;

    // Crossfade effect: briefly lower opacity
    lbImg.style.opacity = '0';
    setTimeout(() => {
      lbImg.src = cardImg.src;
      lbImg.alt = cardImg.alt || '';
      lbMetaTitle.textContent = cardEl.getAttribute('data-title') || '';
      lbMetaCategory.textContent = cardEl.getAttribute('data-role') || '';
      lbMetaYear.textContent = cardEl.getAttribute('data-year') || '';
      lbImg.style.opacity = '1';
    }, 150);
  };

  const showByOffset = (offset) => {
    const allCards = Array.from(track.querySelectorAll('.card'));
    let idx = parseInt(lightbox.dataset.index || 0, 10);
    idx = (idx + offset + allCards.length) % allCards.length;
    updateLightboxContent(idx);
  };

  // Click on cards to open lightbox (bubbling handler for cloned items)
  track.addEventListener('click', (e) => {
    // If we're dragging, don't open lightbox
    if (Math.abs(velocity) > 0.5 || isDragging) return;

    const card = e.target.closest('.card');
    if (!card) return;
    openLightbox(card);
  });

  lbClose.addEventListener('click', closeLightbox);
  lbNext.addEventListener('click', () => showByOffset(1));
  lbPrev.addEventListener('click', () => showByOffset(-1));

  // click outside image closes
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lbBackdrop || e.target.classList.contains('lb-stage')) {
      closeLightbox();
    }
  });

  // ESC to close, arrow keys for nav
  document.addEventListener('keydown', (e) => {
    if (lightbox.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showByOffset(1);
      if (e.key === 'ArrowLeft') showByOffset(-1);
    }
  });

  // Touch/Trackpad swipe for lightbox
  let lbStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    lbStartX = e.touches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const deltaX = lbStartX - e.changedTouches[0].clientX;
    if (Math.abs(deltaX) > 60) {
      showByOffset(deltaX > 0 ? 1 : -1);
    }
  }, { passive: true });

  // Mouse movement close button fade-in logic
  let closeBtnTimer;
  lightbox.addEventListener('mousemove', () => {
    lbClose.style.opacity = '1';
    lbNext.style.opacity = '1';
    lbPrev.style.opacity = '1';
    clearTimeout(closeBtnTimer);
    closeBtnTimer = setTimeout(() => {
      if (lightbox.getAttribute('aria-hidden') === 'false') {
        lbClose.style.opacity = '0.3';
        lbNext.style.opacity = '0.3';
        lbPrev.style.opacity = '0.3';
      }
    }, 2000);
  }, { passive: true });

  // Cleanup when unloading
  window.addEventListener('beforeunload', () => cancelAnimationFrame(raf));

  // Mobile navigation: hamburger toggle
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('mobileMenu');
  // Top navigation scroll behavior: add scrolled class for glass effect
  const topnav = document.querySelector('.topnav');
  // Top navigation: make sticky + change background on scroll.
  // Behavior:
  // - Default: transparent background so hero content shows through.
  // - When user scrolls even 1px, add `.scrolled` to make background solid black (#000).
  // Implementation uses IntersectionObserver to avoid scroll jank. Falls back to
  // an optimized requestAnimationFrame-based scroll listener when IO isn't available.
  if (topnav) {
    const onScroll = () => {
      if (window.scrollY > 1) {
        topnav.classList.add('scrolled');
      } else {
        topnav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // Run once on load
    onScroll();
  }
  if (navToggle && mobileMenu) {
    const closeBtn = mobileMenu.querySelector('.mobile-close');

    function openMenu() {
      navToggle.setAttribute('aria-expanded', 'true');
      mobileMenu.classList.add('open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Prevent scroll when menu is open
    }

    function closeMenu() {
      navToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      if (expanded) closeMenu(); else openMenu();
    });

    closeBtn.addEventListener('click', closeMenu);

    // Close menu when clicking on a link
    mobileMenu.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        closeMenu();
      }
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMenu();
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && !navToggle.contains(e.target)) {
        closeMenu();
      }
    });
  }

  // Smooth scroll for all anchor links with offset for sticky header
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 90; // Adjust based on topnav height
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  const revealTexts = document.querySelectorAll('.reveal-text[data-reveal]');
  revealTexts.forEach(el => {
    // Preserve <br> by splitting around them and spaces
    const content = el.innerHTML.trim();
    const parts = content.split(/(\s+|<br\s*\/?>)/i);
    el.innerHTML = '';

    parts.forEach((part) => {
      if (!part) return;

      if (part.toLowerCase().startsWith('<br')) {
        el.innerHTML += part;
      } else if (part.trim() === '') {
        // Use a single regular space to separate words
        el.innerHTML += ' ';
      } else {
        const span = document.createElement('span');
        span.textContent = part;
        el.appendChild(span);
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    observer.observe(el);
  });

  // --- About Me Section Logic ---

  // 1. Tool Marquee Cloning for seamless loop
  const toolsMarquee = document.getElementById('toolsMarquee');
  if (toolsMarquee) {
    const items = Array.from(toolsMarquee.children);
    // Duplicate twice for safety and smoothness
    items.forEach(item => {
      const clone = item.cloneNode(true);
      toolsMarquee.appendChild(clone);
    });
  }

  // 2. Intersection Observer for About Cards
  const aboutCards = document.querySelectorAll('.about-card');
  if (aboutCards.length > 0) {
    const aboutObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          aboutObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    aboutCards.forEach((card, i) => {
      // Set staggered transition delay
      card.style.transitionDelay = `${i * 100}ms`;
      aboutObserver.observe(card);

      // Magnetic 3D Tilt & Spotlight Logic
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate percentage for spotlight
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;

        // Calculate tilt (max 10 degrees)
        const tiltX = (y / rect.height - 0.5) * -15; // Inverted for natural feel
        const tiltY = (x / rect.width - 0.5) * 15;

        card.style.setProperty('--mouse-x', `${percentX}%`);
        card.style.setProperty('--mouse-y', `${percentY}%`);
        card.style.setProperty('--tilt-x', `${tiltX}deg`);
        card.style.setProperty('--tilt-y', `${tiltY}deg`);
      });

      card.addEventListener('mouseleave', () => {
        // Smoothly reset tilt
        card.style.setProperty('--tilt-x', `0deg`);
        card.style.setProperty('--tilt-y', `0deg`);
      });
    });
  }

  // --- Capabilities Section Logic (Horizontal Scroll & Hover Preview) ---
  const capabilitySect = document.getElementById('capabilities');
  const capSpacer = document.querySelector('.capabilities-spacer');
  const capSticky = document.querySelector('.capabilities-sticky');
  const capRail = document.getElementById('capabilitiesRail');
  const capIntro = document.getElementById('capabilitiesIntro');
  const capPanelsWrapper = document.querySelector('.capabilities-panels-wrapper');
  const hoverPreview = document.getElementById('hover-preview');

  if (capabilitySect && capSpacer && capRail && capIntro && capPanelsWrapper) {
    const panels = document.querySelectorAll('.service-panel');
    const panelCount = panels.length;

    // Calculate and set spacer height
    const calculateSpacerHeight = () => {
      if (window.innerWidth > 768) {
        // Extra 100vh for intro slide + 150vh per panel for scroll
        const spacerHeight = 100 + (panelCount * 150);
        capSpacer.style.height = `${spacerHeight}vh`;
      } else {
        capSpacer.style.height = 'auto';
      }
    };

    calculateSpacerHeight();

    // Handle scroll transitions
    const handleScroll = () => {
      if (window.innerWidth > 768) {
        const spacerRect = capSpacer.getBoundingClientRect();
        const spacerTop = spacerRect.top;
        const spacerHeight = spacerRect.height;
        const viewportHeight = window.innerHeight;

        // Calculate overall progress (0 to 1)
        const scrollableDistance = spacerHeight - viewportHeight;
        const scrolled = -spacerTop;
        const overallProgress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

        // Intro fade threshold: 0-15% of total scroll
        const introFadeThreshold = 0.15;

        if (overallProgress < introFadeThreshold) {
          // Show intro, hide panels
          const introOpacity = 1 - (overallProgress / introFadeThreshold);
          capIntro.style.opacity = introOpacity;
          capPanelsWrapper.classList.remove('active');
        } else {
          // Hide intro, show panels
          capIntro.classList.add('fade-out');
          capPanelsWrapper.classList.add('active');

          // Calculate panels scroll progress (15% onwards)
          const panelsStartProgress = introFadeThreshold;
          const panelsProgress = (overallProgress - panelsStartProgress) / (1 - panelsStartProgress);
          const clampedPanelsProgress = Math.max(0, Math.min(1, panelsProgress));

          // Horizontal translation
          const railWidth = capRail.scrollWidth;
          const viewportWidth = window.innerWidth;
          const maxScroll = railWidth - viewportWidth;

          const translateX = clampedPanelsProgress * maxScroll;

          // Use combined transform for GPU acceleration (translateX + centering translateY)
          capRail.style.transform = `translate3d(${-translateX}px, -50%, 0)`;
          capRail.style.webkitTransform = `translate3d(${-translateX}px, -50%, 0)`;
        }
      } else {
        // Mobile: Reset all inline styles to let CSS take over
        capIntro.style.opacity = '';
        capIntro.classList.remove('fade-out');
        capPanelsWrapper.classList.add('active');
        capRail.style.transform = '';
        capRail.style.webkitTransform = '';
      }
    };

    // Throttled scroll handler for performance
    let scrollTicking = false;
    const onScroll = () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          handleScroll();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      calculateSpacerHeight();
      handleScroll();
    });

    // Initial call
    handleScroll();

    // 2. Hover Image Preview Logic (Desktop Only)
    let mouseX = 0;
    let mouseY = 0;
    let previewX = 0;
    let previewY = 0;
    let currentImages = [];
    let imageIdx = 0;
    let imageInterval;

    // Follow mouse with delay (lerp) — only runs while a panel is hovered
    let previewRaf = null;
    const animatePreview = () => {
      if (window.innerWidth <= 768) {
        previewRaf = null;
        return; // Never run on mobile
      }
      const ease = 0.12; // 120ms-ish delay feel
      previewX += (mouseX - previewX) * ease;
      previewY += (mouseY - previewY) * ease;

      // Offset preview from cursor
      hoverPreview.style.left = `${previewX + 24}px`;
      hoverPreview.style.top = `${previewY - 120}px`;
      previewRaf = requestAnimationFrame(animatePreview);
    };

    const startPreviewLoop = () => {
      if (!previewRaf && window.innerWidth > 768) {
        previewRaf = requestAnimationFrame(animatePreview);
      }
    };
    const stopPreviewLoop = () => {
      if (previewRaf) {
        cancelAnimationFrame(previewRaf);
        previewRaf = null;
      }
    };

    const switchPreviewImage = () => {
      if (currentImages.length <= 1) return;

      const activeImg = hoverPreview.querySelector('.preview-img.active');
      const nextImg = hoverPreview.querySelector('.preview-img:not(.active)');

      imageIdx = (imageIdx + 1) % currentImages.length;
      nextImg.src = currentImages[imageIdx];

      // Crossfade
      nextImg.classList.add('active');
      activeImg.classList.remove('active');
    };

    panels.forEach(panel => {
      panel.addEventListener('mouseenter', (e) => {
        if (window.innerWidth <= 768) {
          // Mobile: Reveal on tap
          panels.forEach(p => p.classList.remove('active'));
          panel.classList.add('active');
          return;
        }

        hoverPreview.classList.add('active');
        startPreviewLoop(); // Start RAF loop on hover

        const imagesStr = panel.getAttribute('data-images');
        currentImages = imagesStr ? imagesStr.split(',') : [];
        imageIdx = 0;

        if (currentImages.length > 0) {
          const activeImg = hoverPreview.querySelector('.preview-img.active');
          activeImg.src = currentImages[0];

          if (currentImages.length > 1) {
            clearInterval(imageInterval);
            imageInterval = setInterval(switchPreviewImage, 2000);
          }
        }
      });

      panel.addEventListener('mouseleave', () => {
        if (window.innerWidth <= 768) return;

        hoverPreview.classList.remove('active');
        clearInterval(imageInterval);
        stopPreviewLoop(); // Stop RAF loop when not hovering
      });
    });

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    // Mobile: Toggle panel on tap
    if (window.innerWidth <= 768) {
      capabilitySect.addEventListener('click', (e) => {
        const panel = e.target.closest('.service-panel');
        if (panel) {
          const isActive = panel.classList.contains('active');
          panels.forEach(p => p.classList.remove('active'));
          if (!isActive) panel.classList.add('active');
        }
      });
    }
  }

  // --- Generic Intersection Observer for Section Reveals ---
  const revealSections = document.querySelectorAll('.contact-cta, .footer-premium');
  if (revealSections.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealSections.forEach(section => sectionObserver.observe(section));
  }

  // --- Click-to-Copy Email Functionality ---
  const emailLink = document.querySelector('.email-link');
  if (emailLink) {
    emailLink.addEventListener('click', (e) => {
      // If user wants normal mailto behavior, we don't preventDefault
      // But we always copy the text
      const emailToCopy = emailLink.getAttribute('data-copy');
      if (emailToCopy) {
        navigator.clipboard.writeText(emailToCopy).then(() => {
          const feedback = emailLink.querySelector('.copy-feedback');
          if (feedback) {
            feedback.classList.add('show');
            setTimeout(() => {
              feedback.classList.remove('show');
            }, 2000);
          }
        });
      }
    });
  }
});
