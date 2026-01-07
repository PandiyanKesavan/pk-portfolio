document.addEventListener('DOMContentLoaded', () => {
    renderComponents();
    initProjectSystem();
    initCarousel();
});

function renderComponents() {
    const navHTML = `
    <nav class="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
        <div class="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <a href="index.html" class="text-xl font-bold tracking-tight">GIS<span class="text-blue-400">PRO</span></a>
            <div class="hidden md:flex space-x-6 text-sm font-medium">
                <a href="index.html" class="hover:text-blue-400">Home</a>
                <a href="projects.html" class="hover:text-blue-400">Projects</a>
                <a href="skills-certifications.html" class="hover:text-blue-400">Skills</a>
                <a href="journals-conferences.html" class="hover:text-blue-400">Research</a>
                <a href="contact.html" class="hover:text-blue-400">Contact</a>
            </div>
        </div>
    </nav>`;
    
    const footerHTML = `<footer class="bg-slate-900 text-slate-400 py-8 mt-12 text-center text-sm">
        <p>&copy; 2026 GIS Professional Portfolio</p>
    </footer>`;

    document.body.insertAdjacentHTML('afterbegin', navHTML);
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

async function initProjectSystem() {
    const container = document.getElementById('project-container');
    const searchInput = document.getElementById('project-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!container) return;

    try {
        const response = await fetch('./js/projects.json');
        const projects = await response.json();

        const render = (year = 'all', query = '') => {
            container.innerHTML = '';
            const filtered = projects.filter(p => {
                const matchesYear = year === 'all' || p.year === year;
                const matchesSearch = p.title.toLowerCase().includes(query.toLowerCase()) || 
                                    p.tools.some(t => t.toLowerCase().includes(query.toLowerCase()));
                return matchesYear && matchesSearch;
            });

            filtered.forEach(p => {
                container.innerHTML += `
                <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition">
                    <h3 class="font-bold text-xl mb-1">${p.title}</h3>
                    <p class="text-blue-600 text-xs font-mono mb-3">${p.year} | ${p.role}</p>
                    <p class="text-slate-600 text-sm mb-4">${p.description}</p>
                    <div class="flex flex-wrap gap-2">
                        ${p.tools.map(t => `<span class="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded font-bold">${t}</span>`).join('')}
                    </div>
                </div>`;
            });
        };

        render();

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.replace('bg-blue-600', 'bg-white'));
                btn.classList.replace('bg-white', 'bg-blue-600');
                render(btn.dataset.year, searchInput?.value);
            });
        });

        searchInput?.addEventListener('input', (e) => {
            const activeYear = document.querySelector('.filter-btn.bg-blue-600').dataset.year;
            render(activeYear, e.target.value);
        });

    } catch (e) { container.innerHTML = "Error loading projects."; }
}

function initCarousel() {
    const slides = document.querySelectorAll('.cert-slide');
    if (!slides.length) return;
    let i = 0;
    setInterval(() => {
        slides[i].classList.add('hidden');
        i = (i + 1) % slides.length;
        slides[i].classList.remove('hidden');
    }, 3000);

}

async function initProjectSystem() {
    const container = document.getElementById('project-container');
    const searchInput = document.getElementById('project-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!container) return;

    try {
        const response = await fetch('./js/projects.json');
        const projects = await response.json();

        const render = (year = 'all', query = '') => {
            container.innerHTML = '';
            
            // Comprehensive search across Title, Tools, and Description
            const filtered = projects.filter(p => {
                const matchesYear = year === 'all' || p.year === year;
                const searchStr = query.toLowerCase();
                const matchesSearch = p.title.toLowerCase().includes(searchStr) || 
                                    p.description.toLowerCase().includes(searchStr) ||
                                    p.tools.some(t => t.toLowerCase().includes(searchStr));
                return matchesYear && matchesSearch;
            });

            if (filtered.length === 0) {
                container.innerHTML = '<p class="text-slate-400 col-span-full text-center py-10">No projects found matching your criteria.</p>';
                return;
            }

            filtered.forEach(p => {
                container.innerHTML += `
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                    <div class="flex justify-between items-start mb-3">
                        <span class="text-blue-600 font-mono text-xs font-bold bg-blue-50 px-2 py-1 rounded">${p.year}</span>
                        <span class="text-slate-400 text-[10px] uppercase font-bold tracking-widest">${p.role}</span>
                    </div>
                    <h3 class="font-bold text-lg text-slate-900 mb-2 leading-tight">${p.title}</h3>
                    <p class="text-slate-500 text-sm mb-6 flex-grow">${p.description}</p>
                    <div class="flex flex-wrap gap-2 pt-4 border-t border-slate-50">
                        ${p.tools.map(t => `<span class="bg-slate-50 text-slate-600 text-[10px] px-2 py-1 rounded border border-slate-100 font-semibold">${t}</span>`).join('')}
                    </div>
                </div>`;
            });
        };

        render();

        // Filter Logic
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => {
                    b.classList.remove('bg-blue-600', 'text-white');
                    b.classList.add('bg-white', 'text-slate-600');
                });
                btn.classList.add('bg-blue-600', 'text-white');
                btn.classList.remove('bg-white');
                render(btn.dataset.year, searchInput.value);
            });
        });

        // Search Logic
        searchInput.addEventListener('input', (e) => {
            const activeBtn = document.querySelector('.filter-btn.bg-blue-600');
            render(activeBtn.dataset.year, e.target.value);
        });

    } catch (e) { 
        container.innerHTML = "<p class='text-red-500'>Error loading the project database.</p>"; 
    }
}
