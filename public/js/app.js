// GameStat — Client JS

// Mobile nav toggle
function toggleNav() {
  const links = document.querySelector('.nav-links');
  if (links) links.classList.toggle('open');
}

// Auto-close flash messages
document.querySelectorAll('.alert').forEach(el => {
  setTimeout(() => {
    el.style.transition = 'opacity 0.5s';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 500);
  }, 4000);
});

// Active nav link highlight
(function () {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a, .admin-nav-item').forEach(a => {
    if (a.getAttribute('href') === path) {
      a.style.color = 'var(--accent-light)';
      a.style.background = 'rgba(124,58,237,0.1)';
    }
  });
})();

// Animate stat numbers on scroll
function animateNumbers() {
  document.querySelectorAll('.stat-number, .stat-card-value, .admin-stat-val').forEach(el => {
    const target = parseFloat(el.textContent.replace(/[^0-9.]/g, ''));
    if (isNaN(target) || target === 0) return;
    if (el.dataset.animated) return;
    el.dataset.animated = '1';
    const suffix = el.textContent.replace(/[\d.,]/g, '');
    const duration = 800;
    const start = performance.now();
    const from = 0;
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val = from + (target - from) * ease;
      el.textContent = (Number.isInteger(target) ? Math.round(val).toLocaleString() : val.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

// IntersectionObserver for animation trigger
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) animateNumbers(); });
}, { threshold: 0.1 });
document.querySelectorAll('.stats-bar, .stats-cards, .admin-stats-grid').forEach(el => obs.observe(el));

// Search input — focus on "/" key
document.addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
    e.preventDefault();
    const inp = document.querySelector('.hero-search-input, .search-input');
    if (inp) inp.focus();
  }
});

// Confirm delete forms (backup, already in HTML)
document.querySelectorAll('form[data-confirm]').forEach(form => {
  form.addEventListener('submit', e => {
    if (!confirm(form.dataset.confirm)) e.preventDefault();
  });
});

// Tooltip on WN8 color badges
document.querySelectorAll('[data-tooltip]').forEach(el => {
  el.title = el.dataset.tooltip;
});
