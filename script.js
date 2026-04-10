/**
 * GonzoTech — Core JS
 * Updated: 2026-04-10
 */

function showTab(id, btn) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    const target = document.getElementById(id);
    if (target) target.classList.add('active');

    const activeBtn = btn || (event && event.currentTarget);
    if (activeBtn) activeBtn.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function badge(status) {
    const map = {
        complete: ['badge-green',  '✓ Complete'],
        active:   ['badge-green',  '● Active'],
        wip:      ['badge-amber',  '◐ In Progress'],
        planned:  ['badge-blue',   '○ Planned']
    };
    const key = (status || '').toLowerCase().replace(/[\s-]/g, '');
    const [cls, label] = map[key] || ['badge-blue', status];
    return `<span class="badge ${cls}">${label}</span>`;
}

// TEACHING POINT: Using 'async/await' for cleaner network requests
async function loadData() {
    const projBox = document.getElementById('project-list');
    const autoBox = document.getElementById('automation-list');

    // Show a loading state immediately
    if (projBox) projBox.innerHTML = '<div style="color:var(--text-dim)">Fetching the latest lab updates...</div>';

    try {
        const res = await fetch('./data.json');
        if (!res.ok) throw new Error('Data file not found');
        const data = await res.json();

        // Render Projects
        if (projBox && data.projects) {
            projBox.innerHTML = data.projects.map(p => `
            <div class="proj-card">
            <div class="proj-card-top">
            <div class="proj-title">${p.name}</div>
            ${badge(p.status)}
            </div>
            <div class="proj-benefit" style="color:var(--accent); font-size:0.85rem; margin-bottom:8px; font-weight:600;">
            ${p.benefit || ''}
            </div>
            <div class="proj-body">${p.description}</div>
            </div>
            `).join('');
        }

        // Render Automation
        if (autoBox && data.automation) {
            autoBox.innerHTML = data.automation.map(a => `
            <div class="proj-card">
            <div class="proj-card-top">
            <div class="proj-title">${a.name}</div>
            ${badge(a.status)}
            </div>
            <div class="proj-benefit" style="color:var(--accent); font-size:0.85rem; margin-bottom:8px; font-weight:600;">
            ${a.benefit || ''}
            </div>
            <div class="proj-body">${a.description}</div>
            </div>
            `).join('');
        }

    } catch (err) {
        // Professional Error State: Don't leave the user with a blank screen
        if (projBox) projBox.innerHTML = '<div style="color:var(--amber)">Lab stats are currently offline. Check back soon!</div>';
        console.error('Fetch Error:', err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    // animateStats(); // Re-enable if you have the stats logic active
});
