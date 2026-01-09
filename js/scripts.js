/**
 * GIS Portfolio - Master Orchestration Script
 * Version: 2.0.0
 * Features: Dynamic Data Fetching, Global UI Injection, Interactive Filters
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Global UI (Nav & Footer)
    renderGlobalUI();
    
    // 2. Conditional Component Initialization
    const containers = {
        projects: document.getElementById('project-container'),
        certs: document.getElementById('cert-container'),
        carousel: document.querySelector('.cert-slide')
    };

    if (containers.projects) initProjectSystem();
    if (containers.certs) initCertSystem();
    if (containers.carousel) initCarousel();
});

/**
 * Renders consistent Navigation and Footer across all portfolio pages.
 * Ensures the 'Exquisite Technical Theme' is preserved globally.
 */
function renderGlobalUI() {
    const navHTML = `
    <nav class="bg-slate-900/90 text-white sticky top-0 z-50 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div class="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <a href="index.html" class="text-xl font-bold tracking-tight hover:text-emerald-400 transition">GIS<span class="text-emerald-400">PRO</span></a>
            <div class="hidden md:flex space-x-6 text-sm font-medium text-slate-300">
                <a href="index.html" class="hover:text-emerald-400 transition-colors">Home</a>
                <a href="projects.html" class="hover:text-emerald-400 transition-colors">Projects</a>
                <a href="skills-certifications.html" class="hover:text-emerald-400 transition-colors">Skills</a>
                <a href="journals-conferences.html" class="hover:text-emerald-400 transition-colors">Research</a>
                <a href="contact.html" class="hover:text-emerald-400 transition-colors">Contact</a>
            </div>
        </div>
    </nav>`;

    const footerHTML = `
    <footer class="bg-slate-900 py-12 text-slate-500 border-t border-white/5 relative z-10">
        <div class="max-w-6xl mx-auto px-4 text-center">
            <p class="text-sm tracking-widest uppercase font-bold text-slate-400 mb-2">Senior Geospatial Solutions Architect</p>
            <p class="text-xs">&copy; 2026 GIS Professional Portfolio | All Rights Reserved</p>
        </div>
    </footer>`;

    document.body.insertAdjacentHTML('afterbegin', navHTML);
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

/**
 * Projects System: Fetches projects.json and handles search/filter logic.
 */
async function initProjectSystem() {
    const container = document.getElementById('project-container');
    const searchInput = document.getElementById('project-search');
    const filterBtns = document.querySelectorAll('.filter-btn');

    try {
        const response = await fetch('./js/projects.json');
        if (!response.ok) throw new Error('Data Load Error');
        const projects = await response.json();

        const render = (yearFilter = 'all', searchQuery = '') => {
            container.innerHTML = '';
            const query = searchQuery.toLowerCase();

            const filtered = projects.filter(p => {
                const matchesYear = yearFilter === 'all' || p.year === yearFilter;
                const matchesSearch = p.title.toLowerCase().includes(query) || 
                                     p.description.toLowerCase().includes(query) ||
                                     p.tools.some(t => t.toLowerCase().includes(query));
                return matchesYear && matchesSearch;
            });

            if (!filtered.length) {
                container.innerHTML = `<div class="col-span-full py-20 text-center text-slate-500 italic uppercase tracking-widest text-xs">No matching geospatial data found</div>`;
                return;
            }

            filtered.forEach((p, i) => {
                const id = `details-${i}`;
                container.innerHTML += `
                <div class="glass-card p-6 flex flex-col h-full border border-white/10 hover:border-emerald-500/50 transition-all group">
                    <div class="flex justify-between items-center mb-4">
                        <span class="bg-emerald-500/20 text-emerald-400 font-mono text-[10px] px-2 py-1 rounded border border-emerald-500/30 font-bold uppercase tracking-wider">${p.year}</span>
                        <span class="text-sky-400 text-[10px] uppercase font-bold tracking-widest">${p.role}</span>
                    </div>
                    <h3 class="font-bold text-xl text-white mb-2 group-hover:text-emerald-400 transition-colors">${p.title}</h3>
                    <p class="text-slate-400 text-sm mb-4 leading-relaxed line-clamp-3">${p.description}</p>
                    
                    <div id="${id}" class="hidden mb-6 mt-2 p-4 bg-black/40 rounded-xl border-l-2 border-emerald-500">
                        <ul class="text-[11px] text-slate-300 space-y-2 list-disc list-inside">
                            ${p.fullDetails ? p.fullDetails.map(d => `<li>${d}</li>`).join('') : '<li>Technical documentation available.</li>'}
                        </ul>
                    </div>

                    <button onclick="toggleDetails('${id}')" class="text-emerald-500 text-xs font-bold hover:text-emerald-400 transition-colors text-left mb-6 focus:outline-none uppercase tracking-wide">
                        + View Technical Scope
                    </button>

                    <div class="mt-auto pt-4 border-t border-white/5 flex flex-wrap gap-2">
                        ${p.tools.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                    </div>
                </div>`;
            });
        };

        // Listeners
        filterBtns.forEach(btn => btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active-filter'));
            btn.classList.add('active-filter');
            render(btn.dataset.year, searchInput?.value);
        }));

        searchInput?.addEventListener('input', (e) => {
            const activeYear = document.querySelector('.active-filter')?.dataset.year || 'all';
            render(activeYear, e.target.value);
        });

        render(); 
    } catch (err) {
        container.innerHTML = `<p class="text-red-400 text-center py-20 font-mono text-xs">Error 500: Geospatial Database Offline</p>`;
    }
}

/**
 * Certification System: Fetches certs.json and renders high-contrast cards.
 */
async function initCertSystem() {
    const container = document.getElementById('cert-container');
    const filterBtns = document.querySelectorAll('.filter-btn');

    try {
        const response = await fetch('./js/certs.json');
        const certs = await response.json();

        const render = (year = 'all') => {
            container.innerHTML = '';
            const filtered = certs.filter(c => year === 'all' || c.year === year);

            filtered.forEach(c => {
                container.innerHTML += `
                <div class="glass-card overflow-hidden flex flex-col h-full border border-white/5 group">
                    <div class="h-48 bg-slate-800/50 overflow-hidden relative">
                        <img src="${c.image}" alt="${c.title}" class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" onerror="this.src='https://via.placeholder.com/400x300?text=Credential+Image'">
                        <div class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                             <a href="${c.image}" target="_blank" class="bg-sky-500 text-slate-900 px-5 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-sky-400 transition">Verify Credential</a>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-2">
                            <span class="text-sky-400 font-mono text-xs font-bold bg-sky-500/10 px-2 py-1 rounded border border-sky-400/20">${c.year}</span>
                            <span class="text-slate-500 text-[10px] uppercase font-bold tracking-widest">${c.category}</span>
                        </div>
                        <h3 class="font-bold text-lg text-white leading-tight mb-1">${c.title}</h3>
                        <p class="text-slate-400 text-sm italic">${c.issuer}</p>
                    </div>
                </div>`;
            });
        };

        filterBtns.forEach(btn => btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active-filter'));
            btn.classList.add('active-filter');
            render(btn.dataset.year);
        }));

        render();
    } catch (e) { container.innerHTML = "<p class='text-red-400 text-center py-20 font-mono text-xs'>Credential Verification System Offline</p>"; }
}

/**
 * Utility: Toggle expandable detail boxes.
 */
window.toggleDetails = (id) => {
    const el = document.getElementById(id);
    const btn = event.currentTarget;
    const isHidden = el.classList.contains('hidden');
    
    el.classList.toggle('hidden');
    btn.textContent = isHidden ? "- Collapse Scope" : "+ View Technical Scope";
};

/**
 * Carousel: Smooth headline crossfades for Credentials.
 */
function initCarousel() {
    const slides = document.querySelectorAll('.cert-slide');
    if (slides.length <= 1) return;
    
    let current = 0;
    setInterval(() => {
        // Fade Out
        slides[current].classList.replace('opacity-100', 'opacity-0');
        setTimeout(() => slides[current].classList.add('hidden'), 700);
        
        // Move to next
        current = (current + 1) % slides.length;
        
        // Fade In
        setTimeout(() => {
            slides[current].classList.remove('hidden');
            setTimeout(() => slides[current].classList.replace('opacity-0', 'opacity-100'), 50);
        }, 800);
    }, 5000); 
}
