/**
 * GonzoTech — Core JS
 * Tab navigation · Data injection · Stats animation · Contact form
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

// --- Stats count-up animation ---
function animateStats() {
    const stats = document.querySelectorAll('.stat-val[data-target]');
    if (!stats.length) return;

    const duration = 1400;

    stats.forEach((el, i) => {
        const raw = el.dataset.target;
        const match = raw.match(/^([\d.]+)([A-Za-z]*)$/);
        if (!match) return;

        const num    = parseFloat(match[1]);
        const suffix = match[2] || '';
        const isFloat = match[1].includes('.');

        // Stagger each stat slightly
        const delay = i * 80;

        setTimeout(() => {
            const start = performance.now();

            function update(now) {
                const elapsed  = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased    = 1 - Math.pow(1 - progress, 3);
                const current  = num * eased;

                el.textContent = isFloat
                    ? current.toFixed(1) + suffix
                    : Math.round(current) + suffix;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = raw; // Snap to exact final value
                }
            }

            requestAnimationFrame(update);
        }, delay);
    });
}

// --- Contact form ---
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = form.querySelector('.btn-submit');
        if (!btn) return;

        // Loading state
        const originalText = btn.textContent;
        btn.textContent = 'Sending…';
        btn.disabled = true;
        btn.style.opacity = '0.8';

        try {
            const res = await fetch('/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name:    form.querySelector('[name="name"]').value.trim(),
                    email:   form.querySelector('[name="email"]').value.trim(),
                    message: form.querySelector('[name="message"]').value.trim(),
                }),
            });

            const data = await res.json();

            if (data.success) {
                btn.textContent = '✓ Message sent!';
                btn.style.background = 'var(--green)';
                btn.style.boxShadow = '0 4px 16px rgba(34,197,94,0.3)';
                btn.style.opacity = '1';
                form.reset();
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.style.boxShadow = '';
                }, 4000);
            } else {
                throw new Error(data.error || 'Something went wrong.');
            }

        } catch (err) {
            btn.textContent = '✕ ' + (err.message || 'Failed — try again');
            btn.style.background = 'var(--amber)';
            btn.style.boxShadow = '0 4px 16px rgba(245,158,11,0.3)';
            btn.style.opacity = '1';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.boxShadow = '';
            }, 4000);
        } finally {
            btn.disabled = false;
            btn.style.opacity = '1';
        }
    });
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    animateStats();
    initContactForm();
});
