document.addEventListener('DOMContentLoaded', () => {
    const typeSelect = document.getElementById('type');
    const caseStudySections = document.getElementById('caseStudySections');
    const templateSelect = document.getElementById('template');
    const form = document.getElementById('projectForm');
    const submitBtn = document.getElementById('submitBtn');
    const statusMessage = document.getElementById('statusMessage');

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

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Publishing...';
        statusMessage.textContent = '';
        statusMessage.className = 'status-message';

        try {
            // Get next ID
            const res = await fetch('/api/projects');
            const data = await res.json();
            const nextId = (data.maxId || 0) + 1;

            // Build Project Object
            const type = document.getElementById('type').value;
            const isCaseStudy = type === 'case-study';

            // Helper to clean array from comma separated string
            const getArray = (str) => str.split(',').map(s => s.trim()).filter(s => s);

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
                    behance: document.getElementById('behanceLink').value || '',
                    dribbble: document.getElementById('dribbbleLink').value || ''
                },
                seoMeta: {
                    title: document.getElementById('seoTitle').value,
                    description: document.getElementById('seoDescription').value
                }
            };

            // Add Case Study Sections if applicable
            if (isCaseStudy) {
                newProject.sections = {
                    overview: true,
                    problem: true,
                    research: true
                };

                newProject.sectionContent = {
                    overview: {
                        title: 'Project Overview',
                        text: document.getElementById('csOverviewText').value,
                        role: newProject.role,
                        tools: getArray(document.getElementById('csOverviewTools').value),
                        responsibilities: getArray(document.getElementById('csOverviewResponsibilities').value)
                    },
                    problem: {
                        label: 'The Challenge',
                        headline: document.getElementById('csProblemHeadline').value,
                        text: document.getElementById('csProblemText').value
                    },
                    research: {
                        title: 'Research & Discovery',
                        text: document.getElementById('csResearchText').value,
                        images: getArray(document.getElementById('csResearchImages').value),
                        layout: 'grid-2'
                    }
                };
            }

            // POST to API
            const saveRes = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProject)
            });

            const saveData = await saveRes.json();

            if (saveData.success) {
                statusMessage.textContent = 'Project published successfully!';
                statusMessage.classList.add('success');
                form.reset();
                if (typeSelect.value === 'case-study') {
                    caseStudySections.style.display = 'block';
                }
            } else {
                throw new Error(saveData.error || 'Failed to save project');
            }

        } catch (err) {
            console.error(err);
            statusMessage.textContent = 'Error: ' + err.message;
            statusMessage.classList.add('error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Publish Project';
        }
    });
});
