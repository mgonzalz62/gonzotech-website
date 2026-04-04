/**
 * GonzoTech — Core JS
 * Tab navigation · Data injection · Contact form
 */

// --- Tab Navigation ---
function showTab(id, btn) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    const target = document.getElementById(id);
    if (target) target.classList.add('active');

    const activeBtn = btn || (event && event.currentTarget);
    if (activeBtn) activeBtn.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Badge helper ---
function badge(status) {
    const map = {
        complete: ['badge-green',  '✓ Complete'],
        active:   ['badge-green',  '● Active'],
        wip:      ['badge-amber',  '◐ In Progress'],
        planned:  ['badge-blue',   '○ Planned'],
        offline:  ['badge-purple', '✕ Offline'],
    };
    const key = (status || '').toLowerCase().replace(/[\s-]/g, '');
    const [cls, label] = map[key] || ['badge-blue', status];
    return `<span class="badge ${cls}">${label}</span>`;
}

// --- Load data.json ---
async function loadData() {
    try {
        const res = await fetch('./data.json');
        if (!res.ok) throw new Error('Could not load data.json');
        const data = await res.json();

        // Projects
        const projBox = document.getElementById('project-list');
        if (projBox && data.projects) {
            projBox.innerHTML = data.projects.map(p => `
                <div class="proj-card">
                    <div class="proj-card-top">
                        <div class="proj-title">${p.name}</div>
                        ${badge(p.status)}
                    </div>
                    <div class="proj-body">${p.description}</div>
                </div>
            `).join('');
        }

        // Automation
        const autoBox = document.getElementById('automation-list');
        if (autoBox && data.automation) {
            autoBox.innerHTML = data.automation.map(a => `
                <div class="proj-card">
                    <div class="proj-card-top">
                        <div class="proj-title">${a.name}</div>
                        ${badge(a.status)}
                    </div>
                    <div class="proj-body">${a.description}</div>
                </div>
            `).join('');
        }

    } catch (err) {
        console.error('GonzoTech: failed to load data —', err);
    }
}

// --- Contact form ---
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('.btn-submit');
        if (!btn) return;
        btn.textContent = 'Message sent!';
        btn.style.background = 'var(--green)';
        setTimeout(() => {
            btn.textContent = 'Send Message';
            btn.style.background = '';
            form.reset();
        }, 3000);
    });
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initContactForm();
});
