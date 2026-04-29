document.addEventListener('DOMContentLoaded', () => {
    const blogContainer = document.getElementById('blog-container');

    // 1. Fetch the CSV file
    fetch('blog_posts.csv')
        .then(response => {
            if (!response.ok) throw new Error("CSV not found");
            return response.text();
        })
        .then(csvText => {
            const posts = parseCSV(csvText);
            renderPosts(posts);
        })
        .catch(err => {
            blogContainer.innerHTML = `<p style="padding:20px; color:red;">Error: ${err.message}. Make sure you are using a local server.</p>`;
        });

    // 2. CSV Parser (Handles quoted strings and commas)
    function parseCSV(text) {
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
        const headers = lines[0].split(',').map(h => h.trim());
        
        return lines.slice(1).map(line => {
            // Regex to split by comma but ignore commas inside quotes
            const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
            let post = {};
            headers.forEach((header, i) => {
                let val = values[i] ? values[i].replace(/"/g, "").trim() : "";
                post[header] = val;
            });
            return post;
        });
    }

    // 3. Render HTML
    function renderPosts(posts) {
        if (posts.length === 0) {
            blogContainer.innerHTML = "<p>No posts found.</p>";
            return;
        }

        blogContainer.innerHTML = posts.map(post => `
            <article class="article-card">
                <div class="article-image" style="background-image: url('${post.image || 'https://via.placeholder.com/600x400'}');">
                    <span class="category-pill">${post.category}</span>
                </div>
                <div class="article-body">
                    <h2><a href="${post.link}">${post.title}</a></h2>
                    <p class="article-excerpt">${post.excerpt}</p>
                    <div class="article-meta">
                        <span><i class="far fa-user"></i> ${post.author}</span>
                        <span style="margin: 0 10px;">•</span>
                        <span><i class="far fa-calendar"></i> ${post.date}</span>
                    </div>
                </div>
            </article>
        `).join('');
    }
});
