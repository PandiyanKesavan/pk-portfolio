/**
 * GIS Portfolio Main Script
 * Integrated System for Navigation, Projects, and Certifications
 * Optimized for: High-Contrast Technical Theme
 */

document.addEventListener('DOMContentLoaded', () => {
    // Shared components rendered on every page load
    renderComponents();
    
    // Page-specific initializations
    // Only runs if the specific container exists on the current page
    if (document.getElementById('project-container')) {
        initProjectSystem();
    }
    
    if (document.getElementById('cert-container')) {
        initCertSystem();
    }
    
    if (document.querySelector('.cert-slide')) {
        initCarousel();
    }
});

// --- 1. SHARED UI COMPONENTS ---
function renderComponents() {
    const navHTML = `
    <nav class="bg-slate-900/90 text-white sticky top-0 z-50 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div class="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <a href="index.html" class="text-xl font-bold tracking-tight">GIS<span class="text-emerald-400">PRO</span></a>
            <div class="hidden md:flex space-x-6 text-sm font-medium">
                <a href="index.html" class="hover:text-emerald-400 transition-colors">Home</a>
                <a href="projects.html" class="hover:text-emerald-400 transition-colors">Projects</a>
                <a href="skills-certifications.html" class="hover:text-emerald-400 transition-colors">Skills</a>
                <a href="journals-conferences.html" class="hover:text-emerald-400 transition-colors">Research</a>
                <a href="contact.html" class="hover:text-emerald-400 transition-colors">Contact</a>
            </div>
        </div>
    </nav>`;
    
    const footerHTML = `
    <footer class="bg-slate-900/80 text-slate-400 py-8 mt-12 text-center text-sm backdrop-blur-sm border-t border-white/5">
        <p>&copy; 2026 GIS Professional Portfolio | Senior Geospatial Solutions Architect</p>
    </footer>`;

    document.body.insertAdjacentHTML('afterbegin', navHTML);
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

// --- 2. PROJECT PORTFOLIO SYSTEM ---
async function initProjectSystem() {
    const container = document.getElementById('project-container');
    const searchInput = document.getElementById('project-search');
    const filterButtons = document.querySelectorAll('.filter-btn');

    try {
        const response = await fetch('./js/projects.json');
        const projects = await response.json();

        const renderProjects = (year = 'all', query = '') => {
            container.innerHTML = '';
            const searchStr = query.toLowerCase();

            const filtered = projects.filter(p => {
                const matchesYear = year === 'all' || p.year === String(year);
                const matchesSearch = p.title.toLowerCase().includes(searchStr) || 
                                    p.description.toLowerCase().includes(searchStr) ||
                                    (p.tools && p.tools.some(t => t.toLowerCase().includes(searchStr)));
                return matchesYear && matchesSearch;
            });

            if (filtered.length === 0) {
                container.innerHTML = '<p class="text-slate-400 col-span-full text-center py-20 uppercase tracking-widest text-xs">No matching projects found</p>';
                return;
            }

            filtered.forEach((p, index) => {
                const detailId = `details-${index}`;
                // Exquisite Glass Card Generation
                container.innerHTML += `
                <div class="glass-card p-6 flex flex-col h-full border border-white/10">
                    <div class="flex justify-between items-start mb-4">
                        <span class="bg-emerald-500/10 text-emerald-400 font-mono text-xs px-2 py-1 rounded border border-emerald-500/20">${p.year}</span>
                        <span class="text-slate-500 text-[10px] uppercase font-bold tracking-widest">${p.role || 'Professional'}</span>
                    </div>
                    
                    <h3 class="font-bold text-xl text-white mb-2 leading-tight">${p.title}</h3>
                    <p class="text-slate-400 text-sm mb-4 leading-relaxed">${p.description}</p>
                    
                    <div id="${detailId}" class="hidden mb-6 mt-2 p-4 bg-black/30 rounded-xl border-l-2 border-emerald-500">
                        <ul class="text-xs text-slate-300 space-y-2 list-disc list-inside">
                            ${p.fullDetails ? p.fullDetails.map(detail => `<li>${detail}</li>`).join('') : '<li>Advanced technical details available upon request.</li>'}
                        </ul>
                    </div>

                    <button onclick="toggleDetails('${detailId}')" class="text-emerald-400 text-xs font-bold hover:text-emerald-300 transition-colors text-left mb-6 focus:outline-none">
                        + View Project Details
                    </button>

                    <div class="flex flex-wrap gap-2 pt-4 border-t border-white/5 mt-auto">
                        ${p.tools ? p.tools.map(t => `<span class="bg-sky-500/10 text-sky-400 text-[10px] px-2 py-1 rounded border border-sky-400/20 font-semibold">${t}</span>`).join('') : ''}
                    </div>
                </div>`;
            });
        };

        renderProjects();

        // Filter Logic
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => {
                    b.classList.remove('bg-emerald-600', 'text-white');
                    b.classList.add('bg-white/5', 'text-slate-400');
                });
                btn.classList.add('bg-emerald-600', 'text-white');
                btn.classList.remove('bg-white/5', 'text-slate-400');
                renderProjects(btn.dataset.year, searchInput ? searchInput.value : '');
            });
        });

        // Search Logic
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const activeBtn = document.querySelector('.filter-btn.bg-emerald-600') || { dataset: { year: 'all' } };
                renderProjects(activeBtn.dataset.year, e.target.value);
            });
        }

    } catch (e) { 
        container.innerHTML = "<p class='text-red-400 text-center py-20'>Database Connection Error</p>"; 
    }
}

// --- 3. CERTIFICATE SYSTEM ---
async function initCertSystem() {
    const container = document.getElementById('cert-container');
    const filterButtons = document.querySelectorAll('.cert-filter-btn');

    try {
        const response = await fetch('./js/certs.json');
        const certs = await response.json();

        const renderCerts = (year = 'all') => {
            container.innerHTML = '';
            const filtered = certs.filter(c => year === 'all' || c.year === String(year));

            if (filtered.length === 0) {
                container.innerHTML = '<p class="text-slate-400 col-span-full text-center py-20">No matching certifications</p>';
                return;
            }

            filtered.forEach(c => {
                container.innerHTML += `
                <div class="glass-card overflow-hidden flex flex-col h-full border border-white/5">
                    <div class="h-48 bg-slate-800/50 overflow-hidden group relative">
                        <img src="${c.image}" alt="${c.title}" class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" onerror="this.src='https://via.placeholder.com/400x300?text=Certification+Preview'">
                        <div class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                             <a href="${c.image}" target="_blank" class="bg-emerald-500 text-slate-900 px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-emerald-400 transition shadow-xl">View Certificate</a>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-2">
                            <span class="text-sky-400 font-mono text-xs font-bold bg-sky-500/10 px-2 py-1 rounded border border-sky-400/20">${c.year}</span>
                            <span class="text-slate-500 text-[10px] uppercase font-bold tracking-widest">${c.category || 'Professional'}</span>
                        </div>
                        <h3 class="font-bold text-lg text-white leading-tight">${c.title}</h3>
                        <p class="text-slate-400 text-sm mt-1 italic">${c.issuer}</p>
                    </div>
                </div>`;
            });
        };

        renderCerts();

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => {
                    b.classList.remove('bg-emerald-600', 'text-white');
                    b.classList.add('bg-white/5', 'text-slate-400');
                });
                btn.classList.add('bg-emerald-600', 'text-white');
                btn.classList.remove('bg-white/5', 'text-slate-400');
                renderCerts(btn.dataset.year);
            });
        });

    } catch (e) {
        container.innerHTML = "<p class='text-red-400 text-center py-20'>Certificate Data Load Failure</p>";
    }
}

// --- 4. UTILITY FUNCTIONS ---

// Expandable Detail Toggle
window.toggleDetails = function(id) {
    const element = document.getElementById(id);
    const button = event.target; 
    
    if (element.classList.contains('hidden')) {
        element.classList.remove('hidden');
        button.innerText = "- Hide Project Details";
        button.classList.add('text-slate-300');
    } else {
        element.classList.add('hidden');
        button.innerText = "+ View Project Details";
        button.classList.remove('text-slate-300');
    }
};

// Certification Headline Carousel
function initCarousel() {
    const slides = document.querySelectorAll('.cert-slide');
    if (slides.length <= 1) return;
    
    let i = 0;
    setInterval(() => {
        slides[i].classList.add('hidden', 'opacity-0');
        slides[i].classList.remove('opacity-100');
        i = (i + 1) % slides.length;
        slides[i].classList.remove('hidden', 'opacity-0');
        slides[i].classList.add('opacity-100');
    }, 4000); 
}

// Update the forEach loop in initProjectSystem inside js/scripts.js
filtered.forEach((p, index) => {
    const detailId = `details-${index}`;
    container.innerHTML += `
    <div class="glass-card flex flex-col h-full">
        <div class="flex justify-between items-start mb-4">
            <span class="bg-blue-500/20 text-blue-400 font-mono text-xs px-2 py-1 rounded border border-blue-500/30">${p.year}</span>
            <span class="text-slate-400 text-[10px] uppercase font-bold tracking-widest">${p.role || 'Professional'}</span>
        </div>
        
        <h3 class="font-bold text-xl text-white mb-2 leading-tight">${p.title}</h3>
        <p class="text-slate-400 text-sm mb-4 leading-relaxed">${p.description}</p>
        
        <div id="${detailId}" class="hidden mb-6 mt-2 p-4 bg-slate-900/50 rounded-xl border-l-2 border-emerald-500">
            <ul class="text-xs text-slate-300 space-y-2 list-disc list-inside">
                ${p.fullDetails ? p.fullDetails.map(detail => `<li>${detail}</li>`).join('') : '<li>Details coming soon.</li>'}
            </ul>
        </div>

        <button onclick="toggleDetails('${detailId}')" class="text-emerald-400 text-xs font-bold hover:text-emerald-300 transition-colors text-left mb-6">
            + View Project Details
        </button>

        <div class="flex flex-wrap gap-2 pt-4 border-t border-white/5 mt-auto">
            ${p.tools ? p.tools.map(t => `<span class="bg-white/5 text-slate-400 text-[10px] px-2 py-1 rounded border border-white/10 font-semibold">${t}</span>`).join('') : ''}
        </div>
    </div>`;
});
