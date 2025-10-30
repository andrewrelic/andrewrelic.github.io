// A conceptual Node.js script (generate.js)

const fs = require('fs');
const csv = require('csv-parser');

// 1. Define the HTML structure for a single article card
const ARTICLE_TEMPLATE = (post) => `
    <article class="article-card">
        <div class="article-image-wrap">
            <div class="article-image" style="background-image: url('${post.image_url}');"></div>
            <p class="category-pill">${post.category}</p>
        </div>
        <div class="article-body">
            <h2><a href="#">${post.title}</a></h2>
            <p class="article-excerpt">
                ${post.excerpt}
            </p>
            <div class="article-meta">
                <span><i class="fas fa-user"></i> ${post.author}</span>
                <span class="dot-separator">·</span>
                <span><i class="fas fa-calendar-alt"></i> ${post.date}</span>
            </div>
            <a href="#" class="read-more-link">Read More <i class="fas fa-arrow-right"></i></a>
        </div>
    </article>
`;

// 2. Define the main structure of your page (simplified)
const PAGE_TEMPLATE_START = `
    <div class="container main-content-grid">
        <main class="main-articles">
`;

const PAGE_TEMPLATE_END = `
        </main>
        </div>
    `;


// 3. Core function to read the CSV and generate the final HTML
function generateBlog() {
    const posts = [];

    // Read the CSV file
    fs.createReadStream('blog_posts.csv')
        .pipe(csv())
        .on('data', (data) => posts.push(data)) // Collect all post data
        .on('end', () => {
            // Generate all article HTML strings
            const articlesHtml = posts.map(post => ARTICLE_TEMPLATE(post)).join('\n');

            // Assemble the final page content
            const finalHtml = PAGE_TEMPLATE_START + articlesHtml + PAGE_TEMPLATE_END;

            // Output the result (in a real scenario, you'd write this to index.html)
            console.log('--- Generated Articles HTML Block ---');
            console.log(articlesHtml);
            console.log('--- Process Complete: Final HTML Ready for Insertion ---');
            
            // In a real setup, you would replace the placeholder block in your actual HTML file:
            // fs.writeFileSync('index_final.html', finalHtml);
        });
}

generateBlog();
