// ==========================================================================
// script.js — Portfolio Website Logic
// ==========================================================================

// Global data store
let portfolioData = null;

// DOM Elements
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const appEl = document.getElementById('app');

// Cache-busting parameter to avoid stale data
const CACHE_BUST = 'v=' + Date.now();

/**
 * Fetch portfolio data from data.json
 */
async function fetchPortfolioData() {
    try {
        const response = await fetch('data.json?' + CACHE_BUST, {
            cache: 'no-store',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status} — ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Failed to fetch data.json:', err);
        throw err;
    }
}

/**
 * Render all sections from portfolio data
 */
function renderPortfolio(data) {
    portfolioData = data;
    renderHeader(data.header);
    renderEducation(data.education);
    renderSkills(data.skills);
    renderWorkExperience(data.workExperience);
    renderProjects(data.projects);
    renderResearch(data.research);
    renderAchievements(data.achievements);
    renderCoursework(data.coursework);
    renderFooter(data.header);
    setupNavigation();
}

/* --------------------------------------------------------------------------
   Header / Hero Section
   -------------------------------------------------------------------------- */
function renderHeader(header) {
    if (!header) return;

    document.getElementById('hero-name').textContent = header.name || 'Your Name';
    document.getElementById('nav-brand').textContent =
        header.name ? header.name.split(' ')[0] + "'s Portfolio" : 'Portfolio';

    const contactEl = document.getElementById('hero-contact');
    contactEl.innerHTML = '';

    const items = [];
    if (header.phone) {
        items.push(`<span>📞 ${header.phone}</span>`);
    }
    if (header.email) {
        items.push(`<a href="mailto:${header.email}">✉️ ${header.email}</a>`);
    }
    if (header.linkedin) {
        items.push(`<a href="${header.linkedin}" target="_blank" rel="noopener noreferrer">💼 LinkedIn</a>`);
    }
    if (header.github) {
        items.push(`<a href="${header.github}" target="_blank" rel="noopener noreferrer">🐙 GitHub</a>`);
    }

    contactEl.innerHTML = items
        .map((item, i) => `${i > 0 ? '<span class="dot-separator">•</span>' : ''}${item}`)
        .join('');
}

/* --------------------------------------------------------------------------
   Education
   -------------------------------------------------------------------------- */
function renderEducation(education) {
    const container = document.getElementById('education-content');
    if (!education || education.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);">No education data available.</p>';
        return;
    }

    container.innerHTML = '<div class="education-grid"></div>';
    const grid = container.querySelector('.education-grid');

    education.forEach((edu) => {
        const card = document.createElement('div');
        card.className = 'education-card';
        card.innerHTML = `
            <div class="degree">${escapeHtml(edu.degree || 'Degree')}</div>
            <div class="institute">${escapeHtml(edu.institute || '')}</div>
            <div class="details">
                <span>${escapeHtml(edu.year || '')}</span>
                ${edu.score ? `<span class="score">${escapeHtml(edu.score)}</span>` : ''}
            </div>
        `;
        grid.appendChild(card);
    });
}

/* --------------------------------------------------------------------------
   Technical Skills
   -------------------------------------------------------------------------- */
function renderSkills(skills) {
    const container = document.getElementById('skills-content');
    if (!skills || skills.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);">No skills data available.</p>';
        return;
    }

    container.innerHTML = '<div class="skills-grid"></div>';
    const grid = container.querySelector('.skills-grid');

    skills.forEach((skillGroup) => {
        const category = document.createElement('div');
        category.className = 'skill-category';
        const items = (skillGroup.items || [])
            .map((item) => `<span class="skill-tag">${escapeHtml(item)}</span>`)
            .join('');
        category.innerHTML = `
            <div class="category-name">${escapeHtml(skillGroup.category || 'Skills')}</div>
            <div class="skill-tags">${items}</div>
        `;
        grid.appendChild(category);
    });
}

/* --------------------------------------------------------------------------
   Work Experience
   -------------------------------------------------------------------------- */
function renderWorkExperience(experience) {
    const container = document.getElementById('experience-content');
    if (!experience || experience.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);">No work experience data available.</p>';
        return;
    }

    container.innerHTML = '';
    experience.forEach((job) => {
        const card = document.createElement('div');
        card.className = 'experience-card';

        const bullets = (job.bullets || [])
            .map((bullet) => `<li>${formatBulletText(bullet)}</li>`)
            .join('');

        card.innerHTML = `
            <div class="card-header">
                <div class="left">
                    <span class="company-name">${escapeHtml(job.company || '')}</span>
                    <span class="role"> — ${escapeHtml(job.title || '')}</span>
                </div>
                <div class="right">
                    <span class="duration">${escapeHtml(job.duration || '')}</span>
                    <span class="location">${escapeHtml(job.location || '')}</span>
                </div>
            </div>
            <ul class="bullet-list">${bullets}</ul>
        `;
        container.appendChild(card);
    });
}

/* --------------------------------------------------------------------------
   Projects
   -------------------------------------------------------------------------- */
function renderProjects(projects) {
    const container = document.getElementById('projects-content');
    if (!projects || projects.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);">No project data available.</p>';
        return;
    }

    container.innerHTML = '';
    projects.forEach((project) => {
        const card = document.createElement('div');
        card.className = 'project-card';

        const bullets = (project.bullets || [])
            .map((bullet) => `<li>${formatBulletText(bullet)}</li>`)
            .join('');

        card.innerHTML = `
            <div class="card-header">
                <div class="left">
                    <span class="project-name">${escapeHtml(project.name || '')}</span>
                    ${project.technologies ? `<span class="tech-tag"> — ${escapeHtml(project.technologies)}</span>` : ''}
                </div>
                <div class="right">
                    <span class="duration">${escapeHtml(project.duration || '')}</span>
                </div>
            </div>
            <ul class="bullet-list">${bullets}</ul>
        `;
        container.appendChild(card);
    });
}

/* --------------------------------------------------------------------------
   Research Experience
   -------------------------------------------------------------------------- */
function renderResearch(research) {
    const container = document.getElementById('research-content');
    if (!research || research.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);">No research data available.</p>';
        return;
    }

    container.innerHTML = '';
    research.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'research-card';

        const bullets = (item.bullets || [])
            .map((bullet) => `<li>${formatBulletText(bullet)}</li>`)
            .join('');

        card.innerHTML = `
            <div class="card-header">
                <div class="left">
                    <span class="research-title">${escapeHtml(item.title || '')}</span>
                    ${item.technologies ? `<span class="tech-tag"> — ${escapeHtml(item.technologies)}</span>` : ''}
                </div>
                <div class="right">
                    ${item.duration ? `<span class="duration">${escapeHtml(item.duration)}</span>` : ''}
                </div>
            </div>
            ${bullets ? `<ul class="bullet-list">${bullets}</ul>` : ''}
        `;
        container.appendChild(card);
    });
}

/* --------------------------------------------------------------------------
   Achievements
   -------------------------------------------------------------------------- */
function renderAchievements(achievements) {
    const container = document.getElementById('achievements-content');
    if (!achievements || achievements.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);">No achievements listed.</p>';
        return;
    }

    container.innerHTML = '<div class="achievements-list"></div>';
    const list = container.querySelector('.achievements-list');

    achievements.forEach((achievement, index) => {
        const item = document.createElement('div');
        item.className = 'achievement-item';
        item.innerHTML = `
            <div class="icon">${index + 1}</div>
            <div>${formatBulletText(achievement)}</div>
        `;
        list.appendChild(item);
    });
}

/* --------------------------------------------------------------------------
   Coursework
   -------------------------------------------------------------------------- */
function renderCoursework(coursework) {
    const container = document.getElementById('coursework-content');
    if (!coursework || coursework.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);">No coursework data available.</p>';
        return;
    }

    const items = coursework
        .map((course) => `<span class="coursework-tag">${escapeHtml(course)}</span>`)
        .join('');

    container.innerHTML = `
        <div class="coursework-container">
            <div class="coursework-tags">${items}</div>
        </div>
    `;
}

/* --------------------------------------------------------------------------
   Footer
   -------------------------------------------------------------------------- */
function renderFooter(header) {
    document.getElementById('footer-year').textContent = new Date().getFullYear();
    document.getElementById('footer-name').textContent = header?.name || 'Portfolio';
}

/* --------------------------------------------------------------------------
   Navigation Setup
   -------------------------------------------------------------------------- */
function setupNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    // Scroll shadow on navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile nav toggle
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    // Close mobile nav when a link is clicked
    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
        });
    });

    // Theme toggle
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    if (theme === 'dark') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }
}

/* --------------------------------------------------------------------------
   Utility Functions
   -------------------------------------------------------------------------- */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatBulletText(text) {
    if (!text) return '';
    // Escape HTML first, then restore <strong> tags
    // We'll use a placeholder approach to safely handle bold formatting
    const escaped = escapeHtml(text);
    // Convert **bold** markdown to <strong>
    return escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

/* --------------------------------------------------------------------------
   Initialize
   -------------------------------------------------------------------------- */
async function init() {
    try {
        const data = await fetchPortfolioData();
        loadingEl.style.display = 'none';
        appEl.style.display = 'block';
        renderPortfolio(data);
    } catch (err) {
        loadingEl.style.display = 'none';
        errorEl.style.display = 'flex';
        console.error('Portfolio initialization failed:', err);
    }
}

// Start
document.addEventListener('DOMContentLoaded', init);
