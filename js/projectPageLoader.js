/**
 * PROJECT PAGE LOADER - Template-Agnostic
 * Works with all template HTML files
 * Loads project data and injects into placeholders
 */

import { selectedWorkProjects, getProjectBySlug } from '../data/selectedWorkProjects.js';

class ProjectPageLoader {
  constructor() {
    this.currentTemplate = this.detectTemplate();
    this.init();
  }

  detectTemplate() {
    const path = window.location.pathname;
    if (path.includes('case-study-default')) return 'case-study-default';
    if (path.includes('case-study-visual')) return 'case-study-visual';
    if (path.includes('case-study-deep')) return 'case-study-deep';
    if (path.includes('project-showcase')) return 'project-showcase';
    return null;
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.loadProject());
    } else {
      this.loadProject();
    }
  }

  getSlugFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('slug');
  }

  async loadProject() {
    const slug = this.getSlugFromURL();

    if (!slug) {
      this.show404('No project slug in URL');
      return;
    }

    const project = getProjectBySlug(slug);

    if (!project) {
      this.show404(`Project "${slug}" not found`);
      return;
    }

    if (project.template !== this.currentTemplate) {
      console.warn(`Template mismatch: project uses "${project.template}" but loaded "${this.currentTemplate}"`);
      window.location.href = `${project.template}.html?slug=${slug}`;
      return;
    }

    this.updateSEO(project);

    if (this.currentTemplate === 'project-showcase') {
      this.renderShowcase(project);
    } else {
      this.renderCaseStudy(project);
    }

    this.hideLoading();
    this.showContent();
    this.initializeAnimations();
  }

  updateSEO(project) {
    document.getElementById('page-title').textContent = project.seoMeta.title;
    document.getElementById('page-description').content = project.seoMeta.description;
    document.getElementById('og-title').content = project.seoMeta.title;
    document.getElementById('og-description').content = project.seoMeta.description;
    const heroImage = project.heroPlaceholderImage.startsWith('http')
      ? project.heroPlaceholderImage
      : `../${project.heroPlaceholderImage}`;
    document.getElementById('og-image').content = heroImage;
    document.title = project.seoMeta.title;
  }

  // ==================================================================
  // CASE STUDY RENDERER (11 Modular Sections)
  // ==================================================================

  renderCaseStudy(project) {
    document.body.style.backgroundColor = '#0a0a0a';
    document.body.style.color = '#f5f5f7';

    // 1. Header
    document.getElementById('project-title').textContent = project.title;
    document.getElementById('project-description').textContent = project.shortDescription;

    // 2. Category Badge
    const categorySpan = document.querySelector('#project-category span:last-child');
    if (categorySpan) categorySpan.textContent = (project.category || '').toUpperCase();

    // 3. Hero Image
    const heroImg = document.getElementById('hero-image');
    heroImg.src = this.fixImagePath(project.heroPlaceholderImage);
    heroImg.alt = `${project.title} hero image`;

    // 4. Meta Pills (role, platform, timeline)
    const pillsContainer = document.getElementById('hero-meta-pills');
    const pillData = [project.role, project.timeline, project.platform].filter(Boolean);
    pillsContainer.innerHTML = pillData.map(p => `<span class="hero-pill">${p}</span>`).join('');

    // 5. Hero CTAs (Sync with Showcase style)
    const ctasContainer = document.getElementById('hero-ctas');
    if (ctasContainer && project.externalLinks) {
      const { behance, dribbble } = project.externalLinks;
      let ctasHtml = '';

      if (behance) {
        ctasHtml += `
          <a href="${behance}" target="_blank" rel="noopener" class="primary-cta">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/>
            </svg>
            <span>View on Behance</span>
          </a>`;
      }

      if (dribbble) {
        ctasHtml += `
          <a href="${dribbble}" target="_blank" rel="noopener" class="secondary-cta">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z"/>
            </svg>
            <span>Dribbble</span>
          </a>`;
      }
      ctasContainer.innerHTML = ctasHtml;
    }

    // 3. Dynamic Sections
    const sectionsContainer = document.getElementById('case-study-sections');
    sectionsContainer.innerHTML = '';

    const sections = project.sections;
    const content = project.sectionContent;

    if (!sections || !content) {
      console.error('Missing sections or sectionContent in project data');
      return;
    }

    const sectionOrder = [
      'overview', 'problem', 'goals', 'research', 'strategy',
      'wireframes', 'finalDesign', 'uxDecisions', 'impact', 'learnings'
    ];

    sectionOrder.forEach(key => {
      if (sections[key] && content[key]) {
        const el = this.createSection(key, content[key], project);
        if (el) sectionsContainer.appendChild(el);
      }
    });
  }

  // ==================================================================
  // SECTION FACTORY
  // ==================================================================

  createSection(key, data, project) {
    const section = document.createElement('section');
    section.className = `case-section section-${key}`;

    switch (key) {
      case 'overview':
        section.innerHTML = this.buildOverview(data);
        break;
      case 'problem':
        section.innerHTML = this.buildProblem(data, project);
        break;
      case 'goals':
        section.innerHTML = this.buildGoals(data);
        break;
      case 'research':
        section.innerHTML = this.buildResearch(data, project);
        break;
      case 'strategy':
        section.innerHTML = this.buildStrategy(data);
        break;
      case 'wireframes':
        section.innerHTML = this.buildWireframes(data, project);
        break;
      case 'finalDesign':
        section.innerHTML = this.buildFinalDesign(data, project);
        break;
      case 'uxDecisions':
        section.innerHTML = this.buildUxDecisions(data, project);
        break;
      case 'impact':
        section.innerHTML = this.buildImpact(data);
        break;
      case 'learnings':
        section.innerHTML = this.buildLearnings(data);
        break;
      default:
        return null;
    }

    return section;
  }

  // ==================================================================
  // SECTION BUILDERS
  // ==================================================================

  buildOverview(data) {
    const toolsHtml = data.tools
      ? data.tools.map(t => `<span class="detail-tag">${t}</span>`).join('')
      : '';

    const responsibilitiesHtml = data.responsibilities
      ? data.responsibilities.map(r => `<span class="detail-tag">${r}</span>`).join('')
      : '';

    return `
      <div class="section-container">
        <h2 class="section-title">${data.title || 'Project Overview'}</h2>
        ${data.text ? `<p class="section-description">${data.text}</p>` : ''}
        <div class="overview-details">
          <div class="overview-detail-item">
            <h3 class="detail-label">Role</h3>
            <p class="detail-value">${data.role || '—'}</p>
          </div>
          <div class="overview-detail-item">
            <h3 class="detail-label">Tools</h3>
            <div class="detail-tags">${toolsHtml || '<p class="detail-value">—</p>'}</div>
          </div>
          <div class="overview-detail-item overview-detail-full">
            <h3 class="detail-label">Responsibilities</h3>
            <div class="detail-tags">${responsibilitiesHtml || '<p class="detail-value">—</p>'}</div>
          </div>
        </div>
      </div>`;
  }

  buildProblem(data, project) {
    // Support rich format: headline (with <span class="highlight">), body text
    const label = data.label || 'The Challenge';
    const headline = data.headline || '';
    const body = data.text || '';

    return `
      <div class="section-container">
        <div class="problem-container">
          <p class="problem-label">${label}</p>
          ${headline ? `<h2 class="problem-headline">${headline}</h2>` : ''}
          ${body ? `<div class="problem-body">${body}</div>` : ''}
        </div>
      </div>`;
  }

  buildGoals(data) {
    // Support rich format: categories array with icon/title/items
    if (data.categories && data.categories.length) {
      const cardsHtml = data.categories.map(cat => {
        const itemsHtml = cat.items.map(item =>
          `<li><span class="goal-check"></span>${item}</li>`
        ).join('');
        return `
          <div class="goal-card">
            <div class="goal-card-icon">${cat.icon || '🎯'}</div>
            <h4 class="goal-card-title">${cat.title}</h4>
            <ul class="goal-card-items">${itemsHtml}</ul>
          </div>`;
      }).join('');

      return `
        <div class="section-container">
          <div class="goals-layout">
            <h2 class="goals-section-title">${data.title || 'Goals'}</h2>
            <div class="goals-cards">${cardsHtml}</div>
          </div>
        </div>`;
    }

    // Fallback: simple list
    const itemsHtml = data.items
      ? data.items.map(g => `<li><span class="goal-check"></span>${g}</li>`).join('')
      : '';
    return `
      <div class="section-container">
        <div class="goals-layout">
          <h2 class="goals-section-title">${data.title || 'Goals'}</h2>
          <div class="goals-cards">
            <div class="goal-card">
              <ul class="goal-card-items">${itemsHtml}</ul>
            </div>
          </div>
        </div>
      </div>`;
  }

  buildResearch(data, project) {
    const imagesHtml = data.images
      ? this.getImageLayoutHtml(data.images, data.layout || 'grid-2', project.title)
      : '';

    return `
      <div class="section-container">
        <h2 class="section-title">${data.title || 'Research & Discovery'}</h2>
        <div class="section-text-block">
          <p>${data.text || ''}</p>
        </div>
      </div>
      ${imagesHtml}`;
  }

  buildStrategy(data) {
    // Support rich format: items array with title/text
    if (data.items && data.items.length) {
      const itemsHtml = data.items.map((item, i) => `
        <div class="strategy-item">
          <div class="strategy-number">${i + 1}</div>
          <div>
            <h4 class="strategy-item-title">${item.title}</h4>
            <p class="strategy-item-text">${item.text}</p>
          </div>
        </div>`).join('');

      return `
        <div class="section-container">
          <div class="strategy-layout">
            <h2 class="strategy-section-title">${data.title || 'Strategy'}</h2>
            <div class="strategy-items">${itemsHtml}</div>
          </div>
        </div>`;
    }

    // Fallback: simple text
    return `
      <div class="section-container">
        <h2 class="section-title">${data.title || 'Strategy'}</h2>
        <div class="section-text-block">
          <p>${data.text || ''}</p>
        </div>
      </div>`;
  }

  buildWireframes(data, project) {
    const imagesHtml = data.images
      ? this.getImageLayoutHtml(data.images, data.layout || 'grid-2', project.title)
      : '';

    return `
      <div class="section-container">
        <h2 class="section-title">${data.title || 'Wireframes & Iterations'}</h2>
        ${data.description ? `<p class="section-description">${data.description}</p>` : ''}
      </div>
      ${imagesHtml}`;
  }

  buildFinalDesign(data, project) {
    const imagesHtml = data.images
      ? this.getImageLayoutHtml(data.images, data.layout || 'stacked', project.title)
      : '';

    return `
      <div class="section-container">
        <h2 class="section-title">${data.title || 'Final Design'}</h2>
        ${data.description ? `<p class="section-description">${data.description}</p>` : ''}
      </div>
      ${imagesHtml}`;
  }

  buildUxDecisions(data, project) {
    const itemsHtml = data.items
      ? data.items.map(item => {
        const hasImage = item.image;
        const imageHtml = hasImage
          ? `<div class="ux-decision-image"><img src="${this.fixImagePath(item.image)}" alt="${item.title}" loading="lazy"></div>`
          : '';
        return `
          <div class="ux-decision-card${hasImage ? '' : ' text-only'}">
            <div class="ux-decision-content">
              <h3 class="ux-decision-title">${item.title}</h3>
              <p class="ux-decision-text">${item.text}</p>
            </div>
            ${imageHtml}
          </div>`;
      }).join('')
      : '';

    return `
      <div class="section-container">
        <h2 class="section-title">${data.title || 'Key UX Decisions'}</h2>
        <div class="ux-decisions-grid">${itemsHtml}</div>
      </div>`;
  }

  buildImpact(data) {
    const metricsHtml = data.metrics
      ? `<div class="outcomes-grid">
           ${data.metrics.map(m => `
             <div class="outcome-card">
               <div class="outcome-metric">${m.value}</div>
               <div class="outcome-label">${m.label}</div>
             </div>`).join('')}
         </div>`
      : '';

    const testimonialHtml = data.testimonial
      ? `<div class="testimonial">
           <blockquote class="testimonial-quote">"${data.testimonial.quote}"</blockquote>
           <cite class="testimonial-author">— ${data.testimonial.author}</cite>
         </div>`
      : '';

    return `
      <div class="section-container">
        <h2 class="section-title">${data.title || 'Impact & Results'}</h2>
        ${data.text ? `<div class="section-text-block"><p>${data.text}</p></div>` : ''}
        ${metricsHtml}
        ${testimonialHtml}
      </div>`;
  }

  buildLearnings(data) {
    const itemsHtml = data.items
      ? data.items.map((item, index) => `
          <div class="learning-card">
            <div class="learning-index">${(index + 1).toString().padStart(2, '0')}</div>
            <p class="learning-text">${item}</p>
          </div>`).join('')
      : '';

    return `
      <div class="section-container">
        <div class="learnings-layout">
          <h2 class="section-title">${data.title || 'Key Learnings'}</h2>
          <div class="learnings-grid">${itemsHtml}</div>
        </div>
      </div>`;
  }

  // ==================================================================
  // IMAGE LAYOUT HELPER (returns HTML string)
  // ==================================================================

  getImageLayoutHtml(images, layout, projectTitle) {
    const fixed = images.map(img => this.fixImagePath(img));

    switch (layout) {
      case 'full-width':
        return `<div class="full-width-image"><img src="${fixed[0]}" alt="${projectTitle}" loading="lazy"></div>`;
      case 'grid-2':
        return `<div class="image-grid-2">${fixed.map(img => `<img src="${img}" alt="${projectTitle}" loading="lazy">`).join('')}</div>`;
      case 'grid-3':
        return `<div class="image-grid-3">${fixed.map(img => `<img src="${img}" alt="${projectTitle}" loading="lazy">`).join('')}</div>`;
      case 'constrained':
        return `<div class="constrained-image"><img src="${fixed[0]}" alt="${projectTitle}" loading="lazy"></div>`;
      case 'stacked':
      default:
        return `<div class="stacked-images">${fixed.map(img => `<img src="${img}" alt="${projectTitle}" loading="lazy">`).join('')}</div>`;
    }
  }

  // ==================================================================
  // PROJECT SHOWCASE RENDERER (unchanged)
  // ==================================================================

  renderShowcase(project) {
    // 1. Hero Content
    const projectCategory = document.getElementById('project-category');
    if (projectCategory) {
      projectCategory.innerHTML = `<span class="category-dot"></span><span>${(project.category || 'PROJECT').toUpperCase()}</span>`;
    }

    const titleEl = document.getElementById('project-title');
    if (titleEl) titleEl.textContent = project.title;

    const descEl = document.getElementById('project-description');
    if (descEl) descEl.textContent = project.shortDescription;

    const heroImg = document.getElementById('hero-image');
    if (heroImg) {
      heroImg.src = this.fixImagePath(project.heroPlaceholderImage);
      heroImg.alt = `${project.title} Hero Image`;
    }

    // 2. Hero Meta Pills (Replaces Sidebar)
    const pillsContainer = document.getElementById('hero-meta-pills');
    if (pillsContainer) {
      const pills = [
        project.role,
        project.platform,
        project.timeline,
        project.team
      ].filter(Boolean);

      pillsContainer.innerHTML = pills.map(p => `<span class="hero-pill">${p}</span>`).join('');
    }

    // 3. Hero CTAs (Behance / Dribbble)
    const ctasContainer = document.getElementById('hero-ctas');
    if (ctasContainer && project.externalLinks) {
      const { behance, dribbble } = project.externalLinks;
      let ctasHtml = '';

      if (behance) {
        ctasHtml += `
          <a href="${behance}" target="_blank" rel="noopener" class="primary-cta">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/>
            </svg>
            <span>View on Behance</span>
          </a>`;
      }

      if (dribbble) {
        ctasHtml += `
          <a href="${dribbble}" target="_blank" rel="noopener" class="secondary-cta">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z"/>
            </svg>
            <span>Dribbble</span>
          </a>`;
      }

      ctasContainer.innerHTML = ctasHtml;
    }

    // 4. Visual Gallery
    const galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid && project.galleryPlaceholderImages) {
      galleryGrid.innerHTML = project.galleryPlaceholderImages.map((img, i) => {
        const imgSrc = this.fixImagePath(img);
        return `
        <div class="gallery-item">
          <img src="${imgSrc}" alt="${project.title} design ${i + 1}" loading="lazy">
        </div>`;
      }).join('');
    }
  }

  // ==================================================================
  // UTILITIES
  // ==================================================================

  fixImagePath(img) {
    return img.startsWith('http') ? img : `../${img}`;
  }

  show404(message) {
    console.error('404:', message);
    this.hideLoading();
    const errorEl = document.getElementById('error-404');
    if (errorEl) errorEl.style.display = 'flex';
  }

  hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.style.opacity = '0';
      setTimeout(() => loading.style.display = 'none', 300);
    }
  }

  showContent() {
    const content = document.getElementById('case-study-content') || document.getElementById('project-content');
    if (content) {
      content.style.display = 'block';
      setTimeout(() => content.classList.add('fade-in'), 100);
    }
  }

  initializeAnimations() {
    // Scroll-triggered section reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -80px 0px'
    });

    document.querySelectorAll('.case-section').forEach(el => observer.observe(el));
  }
}

// Initialize
new ProjectPageLoader();
