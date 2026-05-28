let fileHandle;
let projectsArray = [];
let fileContentBefore = '';
let fileContentAfter = '';
let currentEditId = null;

// The exact toolbars we'll use in the system
const CMS = {
    // Arrays to hold dynamic cards
    strategyCards: [],
    uxDecisionCards: [],
    impactHighlightCards: [],
    learningCards: []
};

// Global reference for CMS functions to be accessible from inline event handlers
window.CMS = CMS;

document.addEventListener('DOMContentLoaded', () => {
    const connectBtn = document.getElementById('connectBtn');
    const connectionSection = document.getElementById('connectionSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const form = document.getElementById('projectForm');
    
    const typeSelect = document.getElementById('type');
    const caseStudySections = document.getElementById('caseStudySections');
    const templateSelect = document.getElementById('template');
    const submitBtn = document.getElementById('submitBtn');
    const statusMessage = document.getElementById('statusMessage');

    // Section Toggles
    const toggles = document.querySelectorAll('.section-toggle');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const targetId = e.target.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            if(targetEl) {
                targetEl.style.display = e.target.checked ? 'block' : 'none';
            }
        });
    });

    // Initialize Rich Text Areas
    initRichTextEditors();

    // Connect to File
    connectBtn.addEventListener('click', async () => {
        try {
            if (!window.showOpenFilePicker) {
                alert('Your browser does not support the File System Access API. Please use a recent version of Chrome, Edge, or Opera on desktop.');
                return;
            }

            [fileHandle] = await window.showOpenFilePicker({
                types: [
                    {
                        description: 'JavaScript Files',
                        accept: {
                            'text/javascript': ['.js'],
                        },
                    },
                ],
                multiple: false
            });

            const file = await fileHandle.getFile();
            if (!file.name.includes('selectedWorkProjects.js')) {
                const proceed = confirm(`You selected "${file.name}" instead of "selectedWorkProjects.js". Are you sure you want to proceed?`);
                if (!proceed) {
                    fileHandle = null;
                    return;
                }
            }

            // Parse file
            const content = await file.text();
            
            const markerStart = 'export const selectedWorkProjects = ';
            const startIdx = content.indexOf(markerStart);
            if (startIdx === -1) throw new Error("Could not find 'export const selectedWorkProjects ='");
            
            fileContentBefore = content.substring(0, startIdx + markerStart.length);
            
            const markerEnd = '];\n\n// Helper function';
            const endIdx = content.indexOf(markerEnd);
            if (endIdx === -1) throw new Error("Could not find array end marker");
            
            // Includes the closing bracket and everything after
            fileContentAfter = content.substring(endIdx + 1); 
            
            const arrayString = content.substring(startIdx + markerStart.length, endIdx + 1);
            
            // Parse securely locally
            projectsArray = new Function(`return ${arrayString};`)();

            renderDashboard();

            connectionSection.style.display = 'none';
            dashboardSection.style.display = 'block';

        } catch (error) {
            console.error(error);
            if (error.name !== 'AbortError') {
                alert('Failed to open file: ' + error.message);
            }
        }
    });

    // Toggle Case Study Sections
    typeSelect.addEventListener('change', (e) => {
        if (e.target.value === 'case-study') {
            caseStudySections.style.display = 'block';
            templateSelect.value = 'case-study-default';
        } else {
            caseStudySections.style.display = 'none';
            templateSelect.value = 'project-showcase';
        }
    });

    // Navigation Buttons
    document.getElementById('addNewBtn').addEventListener('click', () => {
        currentEditId = null;
        form.reset();
        
        // Reset rich text areas and dynamic cards
        document.querySelectorAll('.rich-text-area').forEach(el => el.innerHTML = '');
        CMS.strategyCards = [];
        CMS.uxDecisionCards = [];
        CMS.impactHighlightCards = [];
        CMS.learningCards = [];
        renderDynamicCards();

        document.getElementById('formTitle').textContent = 'Add New Project';
        dashboardSection.style.display = 'none';
        form.style.display = 'flex';
        caseStudySections.style.display = 'none';
        // Initialize dynamic areas with at least 1 card if case study is selected
        if(typeSelect.value === 'case-study') {
           setTimeout(() => {
                if (CMS.strategyCards.length === 0) CMS.addStrategyCard();
                if (CMS.uxDecisionCards.length === 0) CMS.addUxDecisionCard();
                if (CMS.impactHighlightCards.length === 0) CMS.addImpactHighlightCard();
                if (CMS.learningCards.length === 0) CMS.addLearningCard();
           }, 100);
        }
    });

    document.getElementById('cancelBtn').addEventListener('click', () => {
        form.style.display = 'none';
        dashboardSection.style.display = 'block';
        statusMessage.textContent = '';
        closeAllColorPickers();
    });

    // Handle Clicks outside color picker
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.toolbar-color-wrapper')) {
            closeAllColorPickers();
        }
    });

    // Build Project Object and Save
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!fileHandle) {
            alert('Please connect to the data file first.');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';
        statusMessage.textContent = '';
        statusMessage.className = 'status-message';

        try {
            const nextId = currentEditId ? currentEditId : (projectsArray.length > 0 ? Math.max(...projectsArray.map(p => p.id)) + 1 : 1);

            const type = document.getElementById('type').value;
            const isCaseStudy = type === 'case-study';
            const getArray = (str, separator = ',') => str ? str.split(separator).map(s => s.trim()).filter(s => s) : [];
            const getRichHtml = (id) => {
                const html = document.getElementById(id).innerHTML.trim();
                return html === '<br>' ? '' : html;
            };

            const newProject = {
                id: nextId,
                title: document.getElementById('title').value,
                slug: document.getElementById('slug').value,
                category: document.getElementById('category').value,
                type: type,
                template: document.getElementById('template').value,
                shortDescription: document.getElementById('shortDescription').value,
                heroPlaceholderImage: document.getElementById('heroPlaceholderImage').value,
                galleryPlaceholderImages: getArray(document.getElementById('galleryPlaceholderImages').value),
                role: document.getElementById('role').value,
                platform: document.getElementById('platform').value,
                timeline: document.getElementById('timeline').value,
                team: document.getElementById('team').value,
                externalLinks: {
                    behance: document.getElementById('behanceLink').value || null,
                    dribbble: document.getElementById('dribbbleLink').value || null
                },
                seoMeta: {
                    title: document.getElementById('seoTitle').value,
                    description: document.getElementById('seoDescription').value
                }
            };

            if (isCaseStudy) {
                newProject.sections = {
                    overview: document.getElementById('toggle-overview').checked,
                    problem: document.getElementById('toggle-problem').checked,
                    goals: document.getElementById('toggle-goals').checked,
                    research: document.getElementById('toggle-research').checked,
                    strategy: document.getElementById('toggle-strategy').checked,
                    wireframes: document.getElementById('toggle-wireframes').checked,
                    finalDesign: document.getElementById('toggle-finalDesign').checked,
                    uxDecisions: document.getElementById('toggle-uxDecisions').checked,
                    impact: document.getElementById('toggle-impact').checked,
                    learnings: document.getElementById('toggle-learnings').checked
                };

                newProject.sectionContent = {};

                if (newProject.sections.overview) {
                    newProject.sectionContent.overview = {
                        title: document.getElementById('csOverviewTitle').value,
                        text: getRichHtml('csOverviewText'),
                        role: newProject.role,
                        tools: getArray(document.getElementById('csOverviewTools').value),
                        responsibilities: getArray(document.getElementById('csOverviewResponsibilities').value)
                    };
                }

                if (newProject.sections.problem) {
                    newProject.sectionContent.problem = {
                        label: document.getElementById('csProblemLabel').value,
                        headline: getRichHtml('csProblemHeadline'),
                        text: getRichHtml('csProblemText')
                    };
                }

                if (newProject.sections.goals) {
                    const businessItems = getArray(document.getElementById('csGoalsBusiness').value, '\n');
                    const userItems = getArray(document.getElementById('csGoalsUser').value, '\n');
                    newProject.sectionContent.goals = {
                        title: document.getElementById('csGoalsTitle').value,
                        categories: []
                    };
                    if (businessItems.length) {
                        newProject.sectionContent.goals.categories.push({ icon: '📋', title: 'Business Goals', items: businessItems });
                    }
                    if (userItems.length) {
                        newProject.sectionContent.goals.categories.push({ icon: '❤️', title: 'User Goals', items: userItems });
                    }
                }

                if (newProject.sections.research) {
                    newProject.sectionContent.research = {
                        title: document.getElementById('csResearchTitle').value,
                        text: getRichHtml('csResearchText'),
                        images: getArray(document.getElementById('csResearchImages').value),
                        layout: 'grid-2'
                    };
                }

                if (newProject.sections.strategy) {
                    const mappedStrategy = CMS.strategyCards.map(c => ({
                        title: document.getElementById(`strategy-title-${c.id}`).value,
                        text: getRichHtml(`strategy-text-${c.id}`)
                    })).filter(c => c.title || c.text);

                    newProject.sectionContent.strategy = {
                        title: document.getElementById('csStrategyTitle').value,
                        items: mappedStrategy
                    };
                }

                if (newProject.sections.wireframes) {
                    newProject.sectionContent.wireframes = {
                        title: document.getElementById('csWireframesTitle').value,
                        description: getRichHtml('csWireframesDesc'),
                        images: getArray(document.getElementById('csWireframesImages').value),
                        layout: 'grid-2'
                    };
                }

                if (newProject.sections.finalDesign) {
                    newProject.sectionContent.finalDesign = {
                        title: document.getElementById('csFinalDesignTitle').value,
                        description: getRichHtml('csFinalDesignDesc'),
                        images: getArray(document.getElementById('csFinalDesignImages').value),
                        layout: 'stacked'
                    };
                }

                if (newProject.sections.uxDecisions) {
                    const mappedUx = CMS.uxDecisionCards.map(c => ({
                        title: document.getElementById(`ux-title-${c.id}`).value,
                        text: getRichHtml(`ux-text-${c.id}`),
                        image: document.getElementById(`ux-image-${c.id}`).value || null
                    })).filter(c => c.title || c.text);

                    newProject.sectionContent.uxDecisions = {
                        title: document.getElementById('csUxDecisionsTitle').value,
                        items: mappedUx
                    };
                }

                if (newProject.sections.impact) {
                    const mappedImpacts = CMS.impactHighlightCards.map(c => ({
                        icon: document.getElementById(`impact-icon-${c.id}`).value || '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
                        title: document.getElementById(`impact-title-${c.id}`).value,
                        text: getRichHtml(`impact-text-${c.id}`)
                    })).filter(c => c.title || c.text);

                    newProject.sectionContent.impact = {
                        title: document.getElementById('csImpactTitle').value,
                        headline: getRichHtml('csImpactHeadline'),
                        text: getRichHtml('csImpactText'),
                        highlights: mappedImpacts
                    };
                }

                if (newProject.sections.learnings) {
                    const mappedLearnings = CMS.learningCards.map(c => getRichHtml(`learning-text-${c.id}`))
                        .filter(text => text !== '');

                    newProject.sectionContent.learnings = {
                        title: document.getElementById('csLearningsTitle').value,
                        items: mappedLearnings
                    };
                }
            }

            // Update array
            if (currentEditId) {
                const index = projectsArray.findIndex(p => p.id === currentEditId);
                if (index !== -1) projectsArray[index] = newProject;
            } else {
                projectsArray.push(newProject);
            }

            // Save to File
            await saveToFile();

            statusMessage.textContent = 'Project saved successfully!';
            statusMessage.classList.add('success');
            
            // Go back to dashboard after brief pause
            setTimeout(() => {
                form.style.display = 'none';
                dashboardSection.style.display = 'block';
                renderDashboard();
            }, 1000);

        } catch (err) {
            console.error(err);
            statusMessage.textContent = 'Error: ' + err.message;
            statusMessage.classList.add('error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save Project';
        }
    });
});

/* ============================================================================
   RICH TEXT EDITING
   ============================================================================ */

const SVG_ICONS = {
    bold: '<svg viewBox="0 0 24 24"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>',
    italic: '<svg viewBox="0 0 24 24"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>',
    underline: '<svg viewBox="0 0 24 24"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>',
    largeText: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"/><path d="M12 4v16"/><path d="M9 20h6"/></svg>',
    highlight: '<svg viewBox="0 0 24 24"><path d="M9 11l-6 6v3h9l3-3"/><path d="M22 12l-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>',
    clear: '<svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>'
};

function initRichTextEditors() {
    // Initial static rich text areas
    const areas = ['csOverviewText', 'csProblemHeadline', 'csProblemText', 'csResearchText', 'csWireframesDesc', 'csFinalDesignDesc', 'csImpactHeadline', 'csImpactText'];
    areas.forEach(id => {
        const area = document.getElementById(id);
        const toolbar = document.getElementById(`toolbar-${id}`);
        if(area && toolbar) buildToolbar(toolbar, area);
    });
}

function buildToolbar(toolbarContainer, contentArea) {
    toolbarContainer.innerHTML = ''; // Clear just in case
    
    const cmds = [
        { id: 'bold', icon: SVG_ICONS.bold, title: 'Bold (Ctrl+B)' },
        { id: 'italic', icon: SVG_ICONS.italic, title: 'Italic (Ctrl+I)' },
        { id: 'underline', icon: SVG_ICONS.underline, title: 'Underline (Ctrl+U)' },
        { separator: true },
        { id: 'largeText', icon: SVG_ICONS.largeText, title: 'Large Text' },
        { id: 'highlight', icon: SVG_ICONS.highlight, title: 'Accent Highlight' },
        { id: 'color', icon: '', title: 'Text Color' },
        { separator: true },
        { id: 'removeFormat', icon: SVG_ICONS.clear, title: 'Clear Formatting' }
    ];

    cmds.forEach(cmd => {
        if (cmd.separator) {
            const sep = document.createElement('div');
            sep.className = 'toolbar-separator';
            toolbarContainer.appendChild(sep);
            return;
        }

        if (cmd.id === 'color') {
            const wrapper = document.createElement('div');
            wrapper.className = 'toolbar-color-wrapper';
            
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'toolbar-color-btn';
            btn.title = cmd.title;
            btn.innerHTML = `<span class="toolbar-color-swatch" style="background: #ffffff"></span> <svg viewBox="0 0 24 24" style="width:12px;height:12px;margin-left:2px"><path d="M6 9l6 6 6-6"/></svg>`;
            
            const popup = document.createElement('div');
            popup.className = 'color-picker-popup';
            popup.innerHTML = `
                <div class="color-picker-label">Theme Colors</div>
                <div class="color-picker-swatches">
                    <div class="color-swatch active" style="background: #ffffff" data-color="#ffffff"></div>
                    <div class="color-swatch" style="background: #a0a0a0" data-color="#a0a0a0"></div>
                    <div class="color-swatch" style="background: #4a90e2" data-color="#4a90e2"></div>
                    <div class="color-swatch" style="background: #e24a4a" data-color="#e24a4a"></div>
                    <div class="color-swatch" style="background: #4ae27b" data-color="#4ae27b"></div>
                    <div class="color-swatch" style="background: #f5a623" data-color="#f5a623"></div>
                    <div class="color-swatch" style="background: #bd10e0" data-color="#bd10e0"></div>
                </div>
                <div class="color-picker-custom">
                    <input type="color" value="#ffffff" id="customColor-${contentArea.id}">
                    <span>Custom</span>
                </div>
            `;

            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation(); // prevent document click listener
                const isShowing = popup.classList.contains('show');
                closeAllColorPickers();
                if (!isShowing) popup.classList.add('show');
            };

            const applyColor = (color) => {
                btn.querySelector('.toolbar-color-swatch').style.background = color;
                contentArea.focus();
                
                cleanupHighlightSpans(contentArea);
                
                // Force inline styles for colors so they override classes like .highlight
                document.execCommand('styleWithCSS', false, true);
                
                // Bypass Chrome's default color stripping by making white slightly off-white
                if (color.toLowerCase() === '#ffffff') color = '#fffffe';
                document.execCommand('foreColor', false, color);
                popup.classList.remove('show');
            };

            popup.querySelectorAll('.color-swatch').forEach(swatch => {
                swatch.onclick = (e) => {
                    e.stopPropagation(); // Prevent bubble up
                    applyColor(e.target.dataset.color);
                    popup.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                    e.target.classList.add('active');
                };
            });

            const customPicker = popup.querySelector('input[type="color"]');
            customPicker.addEventListener('change', (e) => {
                applyColor(e.target.value);
            });
            customPicker.onclick = e => e.stopPropagation();

            wrapper.appendChild(btn);
            wrapper.appendChild(popup);
            toolbarContainer.appendChild(wrapper);
            return;
        }

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.innerHTML = cmd.icon;
        btn.title = cmd.title;

        btn.onclick = (e) => {
            e.preventDefault(); // Don't steal focus from editor
            contentArea.focus();
            
            if (cmd.id === 'highlight') {
                cleanupHighlightSpans(contentArea);
                document.execCommand('styleWithCSS', false, true);
                const currentColor = document.queryCommandValue('foreColor');
                if (currentColor === 'rgb(74, 144, 226)') {
                    document.execCommand('foreColor', false, '#fffffe'); // Toggle to white
                } else {
                    document.execCommand('foreColor', false, '#4a90e2'); // Apply Accent Blue
                }
            } else if (cmd.id === 'largeText') {
                document.execCommand('styleWithCSS', false, true);
                const currentSize = document.queryCommandValue('fontSize');
                // Toggle size: 6/xx-large -> 3/medium (default)
                if (currentSize === '6' || currentSize === '7' || currentSize === 'xx-large' || currentSize === '32px') {
                    document.execCommand('fontSize', false, '3');
                } else {
                    document.execCommand('fontSize', false, '6');
                }
            } else if (cmd.id === 'removeFormat') {
                cleanupHighlightSpans(contentArea);
                // Remove standard formatting
                document.execCommand('removeFormat', false, null);
                
                // Also manually remove any inline color styles
                document.execCommand('styleWithCSS', false, true);
                document.execCommand('foreColor', false, 'inherit');
            } else {
                document.execCommand(cmd.id, false, null);
            }
            updateToolbarState(toolbarContainer);
        };

        toolbarContainer.appendChild(btn);
    });

    // Update active states on typing/selection
    contentArea.addEventListener('keyup', () => updateToolbarState(toolbarContainer));
    contentArea.addEventListener('mouseup', () => updateToolbarState(toolbarContainer));
}

function cleanupHighlightSpans(editor) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    
    // 1. If cursor is inside a highlight span, unwrap it
    let node = sel.anchorNode;
    while (node && node !== editor && node.nodeType !== 9) {
        if (node.nodeType === 1 && node.classList.contains('highlight')) {
            const p = node.parentNode;
            while(node.firstChild) p.insertBefore(node.firstChild, node);
            p.removeChild(node);
            break; // Done with local unwrapping
        }
        node = node.parentNode;
    }
    
    // 2. Unspool any highlight spans captured inside a text selection
    if (!sel.isCollapsed) {
        const spans = editor.querySelectorAll('.highlight');
        spans.forEach(span => {
            if (sel.containsNode(span, true)) {
                const p = span.parentNode;
                while(span.firstChild) p.insertBefore(span.firstChild, span);
                p.removeChild(span);
            }
        });
    }
}

function updateToolbarState(toolbar) {
    const btns = toolbar.querySelectorAll('button:not(.toolbar-color-btn)');
    btns.forEach(btn => {
        const title = btn.title.toLowerCase();
        if (title.includes('bold') && document.queryCommandState('bold')) btn.classList.add('active');
        else if (title.includes('italic') && document.queryCommandState('italic')) btn.classList.add('active');
        else if (title.includes('underline') && document.queryCommandState('underline')) btn.classList.add('active');
        else if (title.includes('large text')) {
            const size = document.queryCommandValue('fontSize');
            if (size === '6' || size === '7' || size === 'xx-large' || size === '32px') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        }
        else btn.classList.remove('active');
    });

    // Check color
    const colorBtn = toolbar.querySelector('.toolbar-color-btn');
    if (colorBtn) {
        let color = document.queryCommandValue('foreColor');
        if (color) {
            // Document color may return rgb
            colorBtn.querySelector('.toolbar-color-swatch').style.background = color;
        }
    }
}

function closeAllColorPickers() {
    document.querySelectorAll('.color-picker-popup.show').forEach(p => p.classList.remove('show'));
}

/* ============================================================================
   DYNAMIC CARD CRUD
   ============================================================================ */

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

CMS.addStrategyCard = (data = null) => {
    const id = generateId();
    CMS.strategyCards.push({ id, ...data });
    renderDynamicCards('strategy');
};

CMS.removeStrategyCard = (id) => {
    CMS.strategyCards = CMS.strategyCards.filter(c => c.id !== id);
    renderDynamicCards('strategy');
};

CMS.addUxDecisionCard = (data = null) => {
    const id = generateId();
    CMS.uxDecisionCards.push({ id, ...data });
    renderDynamicCards('uxDecisions');
};

CMS.removeUxDecisionCard = (id) => {
    CMS.uxDecisionCards = CMS.uxDecisionCards.filter(c => c.id !== id);
    renderDynamicCards('uxDecisions');
};

CMS.addImpactHighlightCard = (data = null) => {
    const id = generateId();
    CMS.impactHighlightCards.push({ id, ...data });
    renderDynamicCards('impactHighlights');
};

CMS.removeImpactHighlightCard = (id) => {
    CMS.impactHighlightCards = CMS.impactHighlightCards.filter(c => c.id !== id);
    renderDynamicCards('impactHighlights');
};

CMS.addLearningCard = (data = null) => {
    const id = generateId();
    CMS.learningCards.push({ id, ...data });
    renderDynamicCards('learnings');
};

CMS.removeLearningCard = (id) => {
    CMS.learningCards = CMS.learningCards.filter(c => c.id !== id);
    renderDynamicCards('learnings');
};

function renderDynamicCards(specificType = null) {
    if (!specificType || specificType === 'strategy') {
        const container = document.getElementById('strategyCardsContainer');
        if (container) {
            container.innerHTML = '';
            CMS.strategyCards.forEach((card, i) => {
                const el = document.createElement('div');
                el.className = 'dynamic-card';
                el.innerHTML = `
                    <div class="dynamic-card-header">
                        <span class="dynamic-card-number">Item ${i + 1}</span>
                        <button type="button" class="dynamic-card-delete" onclick="CMS.removeStrategyCard('${card.id}')">×</button>
                    </div>
                    <div class="form-group">
                        <label>Item Title</label>
                        <input type="text" id="strategy-title-${card.id}" value="${escapeHtml(card.title || '')}" placeholder="e.g. Discovery Before Intent">
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <div class="rich-text-wrapper">
                            <div class="rich-text-toolbar" id="toolbar-strategy-text-${card.id}"></div>
                            <div class="rich-text-area" contenteditable="true" id="strategy-text-${card.id}" data-placeholder="Describe the strategy...">${card.text || ''}</div>
                        </div>
                    </div>
                `;
                container.appendChild(el);
                buildToolbar(el.querySelector('.rich-text-toolbar'), el.querySelector('.rich-text-area'));
            });
        }
    }

    if (!specificType || specificType === 'uxDecisions') {
        const container = document.getElementById('uxDecisionCardsContainer');
        if (container) {
            container.innerHTML = '';
            CMS.uxDecisionCards.forEach((card, i) => {
                const el = document.createElement('div');
                el.className = 'dynamic-card';
                el.innerHTML = `
                    <div class="dynamic-card-header">
                        <span class="dynamic-card-number">Decision ${i + 1}</span>
                        <button type="button" class="dynamic-card-delete" onclick="CMS.removeUxDecisionCard('${card.id}')">×</button>
                    </div>
                    <div class="form-group">
                        <label>Decision Title</label>
                        <input type="text" id="ux-title-${card.id}" value="${escapeHtml(card.title || '')}" placeholder="e.g. Segmented Tabs">
                    </div>
                    <div class="form-group">
                        <label>Image Path (Optional)</label>
                        <input type="text" id="ux-image-${card.id}" value="${escapeHtml(card.image || '')}" placeholder="e.g. Assets/Segmented.webp">
                    </div>
                    <div class="form-group">
                        <label>Rationale/Description</label>
                        <div class="rich-text-wrapper">
                            <div class="rich-text-toolbar" id="toolbar-ux-text-${card.id}"></div>
                            <div class="rich-text-area" contenteditable="true" id="ux-text-${card.id}" data-placeholder="Describe the UX decision...">${card.text || ''}</div>
                        </div>
                    </div>
                `;
                container.appendChild(el);
                buildToolbar(el.querySelector('.rich-text-toolbar'), el.querySelector('.rich-text-area'));
            });
        }
    }

    if (!specificType || specificType === 'impactHighlights') {
        const container = document.getElementById('impactHighlightCardsContainer');
        if (container) {
            container.innerHTML = '';
            CMS.impactHighlightCards.forEach((card, i) => {
                const el = document.createElement('div');
                el.className = 'dynamic-card';
                el.innerHTML = `
                    <div class="dynamic-card-header">
                        <span class="dynamic-card-number">Highlight ${i + 1}</span>
                        <button type="button" class="dynamic-card-delete" onclick="CMS.removeImpactHighlightCard('${card.id}')">×</button>
                    </div>
                    <div class="form-group">
                        <label>Highlight Title</label>
                        <input type="text" id="impact-title-${card.id}" value="${escapeHtml(card.title || '')}" placeholder="e.g. Research Backed">
                    </div>
                    <div class="form-group">
                        <label>Icon (SVG HTML)</label>
                        <input type="text" id="impact-icon-${card.id}" value="${escapeHtml(card.icon || '')}" placeholder="e.g. <svg>...</svg>">
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <div class="rich-text-wrapper">
                            <div class="rich-text-toolbar" id="toolbar-impact-text-${card.id}"></div>
                            <div class="rich-text-area" contenteditable="true" id="impact-text-${card.id}" data-placeholder="Describe the highlight...">${card.text || ''}</div>
                        </div>
                    </div>
                `;
                container.appendChild(el);
                buildToolbar(el.querySelector('.rich-text-toolbar'), el.querySelector('.rich-text-area'));
            });
        }
    }

    if (!specificType || specificType === 'learnings') {
        const container = document.getElementById('learningCardsContainer');
        if (container) {
            container.innerHTML = '';
            CMS.learningCards.forEach((card, i) => {
                const el = document.createElement('div');
                el.className = 'dynamic-card';
                el.innerHTML = `
                    <div class="dynamic-card-header">
                        <span class="dynamic-card-number">Learning ${i + 1}</span>
                        <button type="button" class="dynamic-card-delete" onclick="CMS.removeLearningCard('${card.id}')">×</button>
                    </div>
                    <div class="form-group">
                        <label>Learning Content</label>
                        <div class="rich-text-wrapper">
                            <div class="rich-text-toolbar" id="toolbar-learning-text-${card.id}"></div>
                            <div class="rich-text-area" contenteditable="true" id="learning-text-${card.id}" data-placeholder="What was the key learning?">${card.text || ''}</div>
                        </div>
                    </div>
                `;
                container.appendChild(el);
                buildToolbar(el.querySelector('.rich-text-toolbar'), el.querySelector('.rich-text-area'));
            });
        }
    }
}

function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

/* ============================================================================
   DASHBOARD AND FILE SAVING
   ============================================================================ */

function renderDashboard() {
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = '';
    
    projectsArray.forEach((proj, index) => {
        const card = document.createElement('div');
        card.className = 'project-card';
        const isCaseStudy = proj.type === 'case-study';
        
        card.innerHTML = `
            <div>
                <div class="badge ${isCaseStudy ? 'case-study' : ''}">${isCaseStudy ? 'Case Study' : 'Project'}</div>
                <h3>${proj.title}</h3>
                <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 10px;">Slug: ${proj.slug}</p>
                <p style="font-size: 0.9rem;">${proj.shortDescription}</p>
            </div>
            <div class="project-card-actions">
                <div style="display: flex; gap: 5px;">
                    <button class="btn-secondary" onclick="moveProjectUp(${proj.id})" ${index === 0 ? 'disabled' : ''} title="Move Up">↑</button>
                    <button class="btn-secondary" onclick="moveProjectDown(${proj.id})" ${index === projectsArray.length - 1 ? 'disabled' : ''} title="Move Down">↓</button>
                </div>
                <div style="display: flex; gap: 10px; margin-left: auto;">
                    <button class="btn-secondary" onclick="editProject(${proj.id})">Edit</button>
                    <button class="btn-danger" onclick="deleteProject(${proj.id})">Delete</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

window.moveProjectUp = async (id) => {
    const index = projectsArray.findIndex(p => p.id === id);
    if (index > 0) {
        const temp = projectsArray[index];
        projectsArray[index] = projectsArray[index - 1];
        projectsArray[index - 1] = temp;
        try {
            await saveToFile();
            renderDashboard();
        } catch(err) {
            alert("Failed to save reorder: " + err.message);
        }
    }
};

window.moveProjectDown = async (id) => {
    const index = projectsArray.findIndex(p => p.id === id);
    if (index > -1 && index < projectsArray.length - 1) {
        const temp = projectsArray[index];
        projectsArray[index] = projectsArray[index + 1];
        projectsArray[index + 1] = temp;
        try {
            await saveToFile();
            renderDashboard();
        } catch(err) {
            alert("Failed to save reorder: " + err.message);
        }
    }
};

window.editProject = (id) => {
    currentEditId = id;
    const proj = projectsArray.find(p => p.id === id);
    if (!proj) return;
    
    const form = document.getElementById('projectForm');
    form.reset();
    document.getElementById('formTitle').textContent = 'Edit Project';
    
    // Core
    document.getElementById('title').value = proj.title || '';
    document.getElementById('slug').value = proj.slug || '';
    document.getElementById('category').value = proj.category || '';
    document.getElementById('type').value = proj.type || 'project';
    document.getElementById('template').value = proj.template || 'project-showcase';
    document.getElementById('shortDescription').value = proj.shortDescription || '';
    
    // Media
    document.getElementById('heroPlaceholderImage').value = proj.heroPlaceholderImage || '';
    if (proj.galleryPlaceholderImages) {
        document.getElementById('galleryPlaceholderImages').value = proj.galleryPlaceholderImages.join(', ');
    }
    
    // Links
    if (proj.externalLinks) {
        document.getElementById('behanceLink').value = proj.externalLinks.behance || '';
        document.getElementById('dribbbleLink').value = proj.externalLinks.dribbble || '';
    }
    
    // Details
    document.getElementById('role').value = proj.role || '';
    document.getElementById('platform').value = proj.platform || '';
    document.getElementById('timeline').value = proj.timeline || '';
    document.getElementById('team').value = proj.team || '';
    
    // SEO
    if (proj.seoMeta) {
        document.getElementById('seoTitle').value = proj.seoMeta.title || '';
        document.getElementById('seoDescription').value = proj.seoMeta.description || '';
    }

    // Reset dynamics
    CMS.strategyCards = [];
    CMS.uxDecisionCards = [];
    CMS.impactHighlightCards = [];
    CMS.learningCards = [];

    // Toggle Case Study Form Visibility
    const caseStudySections = document.getElementById('caseStudySections');
    if (proj.type === 'case-study') {
        caseStudySections.style.display = 'block';
        
        if (proj.sections) {
            ['overview', 'problem', 'goals', 'research', 'strategy', 'wireframes', 'finalDesign', 'uxDecisions', 'impact', 'learnings'].forEach(sec => {
                const checked = !!proj.sections[sec];
                document.getElementById('toggle-' + sec).checked = checked;
                document.getElementById('group-' + sec).style.display = checked ? 'block' : 'none';
            });
        }
        
        const content = proj.sectionContent || {};
        const setRichHtml = (id, html) => {
            const el = document.getElementById(id);
            if(el) el.innerHTML = html || '';
        };
        
        if (content.overview) {
            document.getElementById('csOverviewTitle').value = content.overview.title || 'Project Overview';
            setRichHtml('csOverviewText', content.overview.text);
            document.getElementById('csOverviewTools').value = (content.overview.tools || []).join(', ');
            document.getElementById('csOverviewResponsibilities').value = (content.overview.responsibilities || []).join(', ');
        }
        
        if (content.problem) {
            document.getElementById('csProblemLabel').value = content.problem.label || 'The Challenge';
            setRichHtml('csProblemHeadline', content.problem.headline);
            setRichHtml('csProblemText', content.problem.text);
        }

        if (content.goals && content.goals.categories) {
            document.getElementById('csGoalsTitle').value = content.goals.title || 'Goals';
            const biz = content.goals.categories.find(c => c.title.includes('Business'));
            const user = content.goals.categories.find(c => c.title.includes('User'));
            if (biz) document.getElementById('csGoalsBusiness').value = (biz.items || []).join('\n');
            if (user) document.getElementById('csGoalsUser').value = (user.items || []).join('\n');
        }

        if (content.research) {
            document.getElementById('csResearchTitle').value = content.research.title || 'Research & Discovery';
            setRichHtml('csResearchText', content.research.text);
            document.getElementById('csResearchImages').value = (content.research.images || []).join(', ');
        }

        if (content.strategy && content.strategy.items) {
            document.getElementById('csStrategyTitle').value = content.strategy.title || 'Strategy';
            CMS.strategyCards = content.strategy.items.map(item => ({ id: generateId(), title: item.title, text: item.text }));
        }

        if (content.wireframes) {
            document.getElementById('csWireframesTitle').value = content.wireframes.title || 'Userflow & Wireframes';
            setRichHtml('csWireframesDesc', content.wireframes.description);
            document.getElementById('csWireframesImages').value = (content.wireframes.images || []).join(', ');
        }

        if (content.finalDesign) {
            document.getElementById('csFinalDesignTitle').value = content.finalDesign.title || 'Final Design';
            setRichHtml('csFinalDesignDesc', content.finalDesign.description);
            document.getElementById('csFinalDesignImages').value = (content.finalDesign.images || []).join(', ');
        }

        if (content.uxDecisions && content.uxDecisions.items) {
            document.getElementById('csUxDecisionsTitle').value = content.uxDecisions.title || 'Key UX Decisions';
            CMS.uxDecisionCards = content.uxDecisions.items.map(item => ({ id: generateId(), title: item.title, text: item.text, image: item.image }));
        }

        if (content.impact) {
            document.getElementById('csImpactTitle').value = content.impact.title || 'Impact & Results';
            setRichHtml('csImpactHeadline', content.impact.headline);
            setRichHtml('csImpactText', content.impact.text);
            if (content.impact.highlights) {
                CMS.impactHighlightCards = content.impact.highlights.map(item => ({ id: generateId(), title: item.title, text: item.text, icon: item.icon }));
            }
        }

        if (content.learnings && content.learnings.items) {
            document.getElementById('csLearningsTitle').value = content.learnings.title || 'Key Learnings';
            CMS.learningCards = content.learnings.items.map(text => ({ id: generateId(), text }));
        }
        
    } else {
        caseStudySections.style.display = 'none';
    }

    renderDynamicCards();

    document.getElementById('dashboardSection').style.display = 'none';
    form.style.display = 'flex';
};

window.deleteProject = async (id) => {
    if(!confirm("Are you sure you want to permanently delete this project?")) return;
    
    projectsArray = projectsArray.filter(p => p.id !== id);
    try {
        await saveToFile();
        renderDashboard();
    } catch(err) {
        alert("Failed to save deletion: " + err.message);
    }
};

async function saveToFile() {
    const newProjectStr = JSON.stringify(projectsArray, null, 4);
    const newContent = fileContentBefore + newProjectStr + fileContentAfter;
    
    try {
        const writable = await fileHandle.createWritable();
        await writable.write(newContent);
        await writable.close();
    } catch (writeError) {
        console.error('File write error:', writeError);
        const blob = new Blob([newContent], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'selectedWorkProjects.js';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        throw new Error('File was locked by your editor. The updated file has been downloaded instead!');
    }
}
