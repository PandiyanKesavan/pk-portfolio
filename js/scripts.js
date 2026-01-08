/**
 * GIS Portfolio Main Script
 * Handles Navigation, Footer, Project System, Certificate System, and Carousel.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Shared components rendered on every page load
    renderComponents();
    
    // Page-specific initializations based on element presence
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

// 1. Inject Navigation and Footer (Shared across all pages)
function renderComponents() {
    const navHTML = `
    <nav class="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
        <div class="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <a href="index.html" class="text-xl font-bold tracking-tight">GIS<span class="text-blue-400">PRO</span></a>
            <div class="hidden md:flex space-x-6 text-sm font-medium">
                <a href="index.html" class="hover:text-blue-400 transition">Home</a>
                <a href="projects.html" class="hover:text-blue-400 transition">Projects</a>
                <a href="skills-certifications.html" class="hover:text-blue-400 transition">Skills</a>
                <a href="journals-conferences.html" class="hover:text-blue-400 transition">Research</a>
                <a href="contact.html" class="hover:text-blue-400 transition">Contact</a>
            </div>
        </div>
    </nav>`;
    
    const footerHTML = `
    <footer class="bg-slate-900 text-slate-400 py-8 mt-12 text-center text-sm">
        <p>&copy; 2026 GIS Professional Portfolio</p>
    </footer>`;

    document.body.insertAdjacentHTML('afterbegin', navHTML);
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

// 2. Project System (Logic for projects.html)
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
                container.innerHTML = '<p class="text-slate-400 col-span-full text-center py-10">No projects found matching your criteria.</p>';
                return;
            }

            filtered.forEach((p, index) => {
                const detailId = `details-${index}`;
                // Use the exquisite glass-card class for the theme
                container.innerHTML += `
                <div class="glass-card p-6 flex flex-col h-full">
                    <div class="flex justify-between items-start mb-3">
                        <span class="text-emerald-400 font-mono text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">${p.year}</span>
                        <span class="text-sky-400 text-[10px] uppercase font-bold tracking-widest">${p.role || 'Professional'}</span>
                    </div>
                    <h3 class="font-bold text-lg text-white mb-2 leading-tight">${p.title}</h3>
                    <p class="text-slate-300 text-sm mb-4">${p.description}</p>
                    
                    <div id="${detailId}" class="hidden mb-6 mt-2 p-4 bg-slate-800/50 rounded-xl border-l-4 border-emerald-400">
                        <ul class="text-xs text-slate-300 space-y-2 list-disc list-inside">
                            ${p.fullDetails ? p.fullDetails.map(detail => `<li>${detail}</li>`).join('') : '<li>Detailed information coming soon.</li>'}
                        </ul>
                    </div>

                    <button onclick="toggleDetails('${detailId}')" class="text-emerald-400 text-xs font-bold hover:underline text-left mb-6 focus:outline-none">
                        + View Project Details
                    </button>

                    <div class="flex flex-wrap gap-2 pt-4 border-t border-white/10 mt-auto">
                        ${p.tools ? p.tools.map(t => `<span class="bg-white/5 text-slate-300 text-[10px] px-2 py-1 rounded border border-white/10 font-semibold">${t}</span>`).join('') : ''}
                    </div>
                </div>`;
            });
        };

        renderProjects();

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => {
                    b.classList.remove('bg-blue-600', 'text-white');
                    b.classList.add('bg-white', 'text-slate-600');
                });
                btn.classList.add('bg-blue-600', 'text-white');
                btn.classList.remove('bg-white');
                renderProjects(btn.dataset.year, searchInput ? searchInput.value : '');
            });
        });

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const activeBtn = document.querySelector('.filter-btn.bg-blue-600');
                const currentYear = activeBtn ? activeBtn.dataset.year : 'all';
                renderProjects(currentYear, e.target.value);
            });
        }

    } catch (e) { 
        container.innerHTML = "<p class='text-red-400 text-center py-10'>Error loading the project database.</p>"; 
    }
}

// 3. Certificate System (Logic for skills-certifications.html)
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
                container.innerHTML = '<p class="text-slate-400 col-span-full text-center py-10">No certificates found for this year.</p>';
                return;
            }

            filtered.forEach(c => {
                container.innerHTML += `
                <div class="glass-card overflow-hidden flex flex-col h-full">
                    <div class="h-48 bg-slate-800/50 overflow-hidden group relative">
                        <img src="${c.image}" alt="${c.title}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500" onerror="this.src='https://via.placeholder.com/400x300?text=Certificate+Image'">
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <a href="${c.image}" target="_blank" class="bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition shadow-lg">View Full Certificate</a>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-2">
                            <span class="text-emerald-400 font-mono text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">${c.year}</span>
                            <span class="text-sky-400 text-[10px] uppercase font-bold tracking-widest">${c.category || 'Certification'}</span>
                        </div>
                        <h3 class="font-bold text-lg text-white leading-tight">${c.title}</h3>
                        <p class="text-slate-400 text-sm mt-1">${c.issuer}</p>
                    </div>
                </div>`;
            });
        };

        renderCerts();

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => {
                    b.classList.remove('bg-blue-600', 'text-white');
                    b.classList.add('bg-white', 'text-slate-600');
                });
                btn.classList.add('bg-blue-600', 'text-white');
                btn.classList.remove('bg-white');
                renderCerts(btn.dataset.year);
            });
        });

    } catch (e) {
        container.innerHTML = "<p class='text-red-400 text-center py-10'>Error loading certificates.</p>";
    }
}

// 4. Global Toggle Function for Project Details
window.toggleDetails = function(id) {
    const element = document.getElementById(id);
    const button = element.target || event.target;
    
    if (element.classList.contains('hidden')) {
        element.classList.remove('hidden');
        button.innerText = "- Hide Project Details";
    } else {
        element.classList.add('hidden');
        button.innerText = "+ View Project Details";
    }
};

// 5. Certification Carousel Logic
function initCarousel() {
    const slides = document.querySelectorAll('.cert-slide');
    if (slides.length <= 1) return;
    
    let i = 0;
    setInterval(() => {
        slides[i].classList.add('hidden');
        i = (i + 1) % slides.length;
        slides[i].classList.remove('hidden');
    }, 4000); // 4 seconds interval for better readability
}
