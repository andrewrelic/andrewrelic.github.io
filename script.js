let allPosts = []; // Global store for modal access

document.addEventListener('DOMContentLoaded', function() {
    
    // ------------------------------------
    // 1. Mobile Menu Toggle
    // ------------------------------------
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('mainNav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true' || false;
            mainNav.classList.toggle('active');
            this.setAttribute('aria-expanded', !isExpanded);
            const icon = this.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
    }

    // ------------------------------------
    // 2. Featured Content Carousel
    // ------------------------------------
    const carouselInner = document.getElementById('carouselInner');
    if (carouselInner) {
        const panels = carouselInner.querySelectorAll('.carousel-panel');
        const totalPanels = panels.length;
        let currentIndex = 0;
        const intervalTime = 5000;

        function showPanel(index) {
            panels.forEach(panel => panel.classList.remove('active'));
            panels[index].classList.add('active');
        }

        function nextPanel() {
            currentIndex = (currentIndex + 1) % totalPanels;
            showPanel(currentIndex);
        }

        let rotationInterval = setInterval(nextPanel, intervalTime);

        const prevButton = document.querySelector('.carousel-nav .prev');
        const nextButton = document.querySelector('.carousel-nav .next');

        if (prevButton && nextButton) {
            function handleManualNav(direction) {
                clearInterval(rotationInterval);
                if (direction === 'next') {
                    currentIndex = (currentIndex + 1) % totalPanels;
                } else {
                    currentIndex = (currentIndex - 1 + totalPanels) % totalPanels;
                }
                showPanel(currentIndex);
                rotationInterval = setInterval(nextPanel, intervalTime);
            }
            nextButton.addEventListener('click', () => handleManualNav('next'));
            prevButton.addEventListener('click', () => handleManualNav('prev'));
        }
        showPanel(currentIndex);
    }

    // ------------------------------------
    // 3. Dynamic Blog & CSV Logic (NEW)
    // ------------------------------------
    const blogContainer = document.getElementById('blog-container');

    if (blogContainer) {
        fetch('blog_posts.csv')
            .then(response => {
                if (!response.ok) throw new Error("CSV file not found");
                return response.text();
            })
            .then(csvText => {
                allPosts = parseCSV(csvText);
                // Reverse so bottom of CSV (newest) is at the top of the page
                renderPosts(allPosts.slice().reverse()); 
            })
            .catch(err => {
                blogContainer.innerHTML = `<div class="p-8 glass rounded-2xl text-red-400 text-center">Error: ${err.message}. Make sure to use a local server!</div>`;
            });
    }

    function parseCSV(text) {
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
        if (lines.length === 0) return [];
        
        const headers = lines[0].split(',').map(h => h.trim());
        return lines.slice(1).map(line => {
            // regex to handle commas inside quotes
            const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
            let post = {};
            headers.forEach((header, i) => {
                post[header] = values[i] ? values[i].replace(/"/g, "").trim() : "";
            });
            return post;
        });
    }

    function renderPosts(posts) {
        if (posts.length === 0) {
            blogContainer.innerHTML = "<p class='text-slate-500'>No posts found.</p>";
            return;
        }

        blogContainer.innerHTML = posts.map((post, index) => `
            <article class="article-card glass p-1 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl mb-6 cursor-pointer" onclick="openPost(${index})">
                <div class="md:w-48 h-48 md:h-auto bg-cover bg-center rounded-xl m-2" style="background-image: url('${post.image || 'https://via.placeholder.com/400x300'}')"></div>
                <div class="p-6 flex-1 text-left">
                    <span class="text-xs font-bold uppercase tracking-widest text-sky-400">${post.category}</span>
                    <h2 class="text-xl font-bold mt-2 mb-3 text-white">${post.title}</h2>
                    <p class="text-slate-400 text-sm mb-4 line-clamp-3">${post.excerpt}</p>
                    <div class="flex items-center text-xs text-slate-500 gap-4">
                        <span><i class="far fa-calendar mr-1"></i> ${post.date}</span>
                        <span><i class="far fa-user mr-1"></i> ${post.author}</span>
                    </div>
                </div>
            </article>
        `).join('');
    }
});

// ------------------------------------
// 4. Modal Functions (Global Scope)
// ------------------------------------
function openPost(reversedIndex) {
    // Find original post from the global array
    const post = allPosts[allPosts.length - 1 - reversedIndex];
    const modal = document.getElementById('postModal');
    const content = document.getElementById('modalContent');

    if (!post || !modal) return;

    content.innerHTML = `
        <span class="text-sky-400 font-bold uppercase tracking-tighter text-sm">${post.category}</span>
        <h1 class="text-3xl md:text-4xl font-extrabold mt-2 mb-6 text-white">${post.title}</h1>
        <div class="flex items-center gap-4 mb-8 text-slate-400 text-sm border-b border-slate-800 pb-6">
            <span><i class="far fa-user mr-2"></i>By ${post.author}</span>
            <span><i class="far fa-calendar mr-2"></i>${post.date}</span>
        </div>
        <div class="prose prose-invert max-w-none text-slate-300 leading-relaxed text-lg whitespace-pre-wrap font-sans">
            ${post.excerpt}
        </div>
    `;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; 
}

function closeModal() {
    const modal = document.getElementById('postModal');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = 'auto'; 
}
