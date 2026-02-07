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

  /**
   * Detect which template HTML file we're on
   */
  detectTemplate() {
    const path = window.location.pathname;
    if (path.includes('case-study-default')) return 'case-study-default';
    if (path.includes('case-study-visual')) return 'case-study-visual';
    if (path.includes('case-study-deep')) return 'case-study-deep';
    if (path.includes('project-showcase')) return 'project-showcase';
    return null;
  }

  /**
   * Initialize loader
   */
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.loadProject());
    } else {
      this.loadProject();
    }
  }

  /**
   * Get slug from URL query parameter
   */
  getSlugFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('slug');
  }

  /**
   * Main load function
   */
  async loadProject() {
    const slug = this.getSlugFromURL();

    if (!slug) {
      this.show404('No project slug in URL');
      return;
    }

    // Find project
    const project = getProjectBySlug(slug);

    if (!project) {
      this.show404(`Project "${slug}" not found`);
      return;
    }

    // Verify template matches
    if (project.template !== this.currentTemplate) {
      console.warn(`Template mismatch: project uses "${project.template}" but loaded "${this.currentTemplate}"`);
      // Redirect to correct template
      window.location.href = `${project.template}.html?slug=${slug}`;
      return;
    }

    // Update SEO
    this.updateSEO(project);

    // Render content based on template type
    if (this.currentTemplate === 'project-showcase') {
      this.renderShowcase(project);
    } else {
      // All case study templates
      this.renderCaseStudy(project);
    }

    // Hide loading, show content
    this.hideLoading();
    this.showContent();

    // Initialize interactions
    this.initializeAnimations();
  }

  /**
   * Update SEO meta tags
   */
  updateSEO(project) {
    document.getElementById('page-title').textContent = project.seoMeta.title;
    document.getElementById('page-description').content = project.seoMeta.description;
    document.getElementById('og-title').content = project.seoMeta.title;
    document.getElementById('og-description').content = project.seoMeta.description;
    // Fix image path for projects subdirectory
    const heroImage = project.heroPlaceholderImage.startsWith('http')
      ? project.heroPlaceholderImage
      : `../${project.heroPlaceholderImage}`;
    document.getElementById('og-image').content = heroImage;
    document.title = project.seoMeta.title;
  }

  /**
   * Render Case Study content (All new Behance-style modular system)
   */
  renderCaseStudy(project) {
    // Set page background to dark for premium aesthetic
    document.body.style.backgroundColor = '#0a0a0a';
    document.body.style.color = '#f5f5f7';

    // 1. Render Header
    document.getElementById('project-title').textContent = project.title;
    document.getElementById('project-description').textContent = project.shortDescription;

    // Render Behance CTA
    const behanceCta = document.getElementById('behance-cta');
    if (project.externalLinks && project.externalLinks.behance) {
      behanceCta.href = project.externalLinks.behance;
      behanceCta.style.display = 'inline-flex';
    } else {
      behanceCta.style.display = 'none';
    }

    // 2. Render Meta Info
    document.getElementById('meta-role').textContent = project.role || '—';
    document.getElementById('meta-platform').textContent = project.platform || '—';
    document.getElementById('meta-timeline').textContent = project.timeline || '—';
    document.getElementById('meta-team').textContent = project.team || '—';

    // 3. Render Dynamic Sections
    const sectionsContainer = document.getElementById('case-study-sections');
    sectionsContainer.innerHTML = ''; // Clear existing

    const sections = project.sections;
    const content = project.sectionContent;

    if (!sections || !content) {
      console.error('Missing sections or sectionContent in project data');
      return;
    }

    // Iterate through sections in a specific order
    const sectionOrder = [
      'overview',
      'competitiveAnalysis',
      'userFlow',
      'wireframes',
      'highFidelity',
      'outcomes'
    ];

    sectionOrder.forEach(sectionKey => {
      if (sections[sectionKey] && content[sectionKey]) {
        const sectionData = content[sectionKey];
        const sectionEl = this.createSection(sectionKey, sectionData, project);
        sectionsContainer.appendChild(sectionEl);
      }
    });
  }

  /**
   * Helper to create a modular section
   */
  createSection(key, data, project) {
    const section = document.createElement('section');
    section.className = `case-section section-${key}`;

    // Section Title & Description (if not outcome)
    if (key !== 'outcomes' && key !== 'overview') {
      const headerHtml = `
                <div class="section-container">
                    <h2 class="section-title">${data.title || ''}</h2>
                    ${data.description ? `<p class="section-description">${data.description}</p>` : ''}
                </div>
            `;
      section.insertAdjacentHTML('beforeend', headerHtml);
    }

    // Section Content based on type
    if (key === 'overview') {
      section.innerHTML = `
                <div class="section-overview">
                    <h2 class="section-title">${data.title}</h2>
                    <p class="overview-text">${data.text}</p>
                </div>
            `;
      if (data.images) {
        section.appendChild(this.renderImageLayout(data.images, data.layout, project.title));
      }
    }
    else if (key === 'outcomes') {
      const outcomesHtml = `
                <div class="section-container">
                    <h2 class="section-title">${data.title || 'Outcomes'}</h2>
                    <div class="outcomes-grid">
                        ${data.metrics.map(m => `
                            <div class="outcome-card">
                                <div class="outcome-metric">${m.value}</div>
                                <div class="outcome-label">${m.label}</div>
                            </div>
                        `).join('')}
                    </div>
                    ${data.testimonial ? `
                        <div class="testimonial">
                            <blockquote class="testimonial-quote">"${data.testimonial.quote}"</blockquote>
                            <cite class="testimonial-author">— ${data.testimonial.author}</cite>
                        </div>
                    ` : ''}
                </div>
            `;
      section.insertAdjacentHTML('beforeend', outcomesHtml);
    }
    else if (data.images) {
      section.appendChild(this.renderImageLayout(data.images, data.layout, project.title));
    }

    return section;
  }

  /**
   * Helper to render image layouts (stacked, grid, full-width)
   */
  renderImageLayout(images, layout, projectTitle) {
    const wrap = document.createElement('div');

    // Fix image paths
    const fixedImages = images.map(img => img.startsWith('http') ? img : `../${img}`);

    switch (layout) {
      case 'full-width':
        wrap.className = 'full-width-image';
        wrap.innerHTML = `<img src="${fixedImages[0]}" alt="${projectTitle}" loading="lazy">`;
        break;
      case 'grid-2':
        wrap.className = 'image-grid-2';
        wrap.innerHTML = fixedImages.map(img => `<img src="${img}" alt="${projectTitle}" loading="lazy">`).join('');
        break;
      case 'grid-3':
        wrap.className = 'image-grid-3';
        wrap.innerHTML = fixedImages.map(img => `<img src="${img}" alt="${projectTitle}" loading="lazy">`).join('');
        break;
      case 'constrained':
        wrap.className = 'constrained-image';
        wrap.innerHTML = `<img src="${fixedImages[0]}" alt="${projectTitle}" loading="lazy">`;
        break;
      case 'stacked':
      default:
        wrap.className = 'stacked-images';
        wrap.innerHTML = fixedImages.map(img => `<img src="${img}" alt="${projectTitle}" loading="lazy">`).join('');
        break;
    }
    return wrap;
  }

  /**
   * Render Showcase content
   */
  renderShowcase(project) {
    // Hero
    document.getElementById('project-category').textContent = project.category.toUpperCase();
    document.getElementById('project-title').textContent = project.title;
    document.getElementById('project-description').textContent = project.shortDescription;

    const heroImg = document.getElementById('hero-image');
    // Fix path for subdirectory
    heroImg.src = project.heroPlaceholderImage.startsWith('http')
      ? project.heroPlaceholderImage
      : `../${project.heroPlaceholderImage}`;
    heroImg.alt = `${project.title} hero image`;

    // Meta
    document.getElementById('meta-role').textContent = project.role;
    document.getElementById('meta-platform').textContent = project.platform;
    document.getElementById('meta-timeline').textContent = project.timeline;
    document.getElementById('meta-team').textContent = project.team;

    // External Links
    const linksContainer = document.getElementById('external-links-container');
    if (project.externalLinks.behance || project.externalLinks.dribbble) {
      linksContainer.innerHTML = `
        <div class="external-links">
          <h4 class="links-heading">View Project</h4>
          ${project.externalLinks.behance ? `
            <a href="${project.externalLinks.behance}" target="_blank" rel="noopener" class="external-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/>
              </svg>
              <span>View on Behance</span>
            </a>
          ` : ''}
          ${project.externalLinks.dribbble ? `
            <a href="${project.externalLinks.dribbble}" target="_blank" rel="noopener" class="external-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z"/>
              </svg>
              <span>View on Dribbble</span>
            </a>
          ` : ''}
        </div>
      `;
    }

    // Gallery
    const galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid) {
      galleryGrid.innerHTML = project.galleryPlaceholderImages.map((img, i) => {
        // Fix path for subdirectory
        const imgSrc = img.startsWith('http') ? img : `../${img}`;
        return `
        <div class="gallery-item">
          <img src="${imgSrc}" alt="${project.title} design ${i + 1}" loading="lazy">
        </div>
      `;
      }).join('');
    }
  }

  /**
   * Show 404 error
   */
  show404(message) {
    console.error('404:', message);
    this.hideLoading();
    const errorEl = document.getElementById('error-404');
    if (errorEl) errorEl.style.display = 'flex';
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.style.opacity = '0';
      setTimeout(() => loading.style.display = 'none', 300);
    }
  }

  /**
   * Show content
   */
  showContent() {
    // Try both IDs to be safe, but prioritize template-specific one
    const content = document.getElementById('case-study-content') || document.getElementById('project-content');
    if (content) {
      content.style.display = 'block';
      setTimeout(() => content.classList.add('fade-in'), 100);
    }
  }

  /**
   * Initialize animations
   */
  initializeAnimations() {
    // Sticky nav
    const backNav = document.getElementById('backNav');
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 100) {
        backNav.classList.add('scrolled');
      } else {
        backNav.classList.remove('scrolled');
      }
    });

    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    document.querySelectorAll('.section').forEach(el => observer.observe(el));
  }
}

// Initialize
new ProjectPageLoader();
