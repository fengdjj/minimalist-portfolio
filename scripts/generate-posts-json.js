const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '../content/posts');
const outputJson = path.join(__dirname, '../blog/posts.json');

function parseYamlFrontmatter(content) {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return { metadata: {}, body: content };
    const yamlBlock = match[1];
    const body = content.slice(match[0].length);
    const metadata = {};
    
    // Simple YAML parser
    const lines = yamlBlock.split('\n');
    let currentKey = null;
    let listItems = null;
    
    for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        
        // Check if list item
        if (line.startsWith('-') && currentKey) {
            const val = line.substring(1).trim().replace(/^['"]|['"]$/g, '');
            if (listItems) {
                listItems.push(val);
            }
            continue;
        }
        
        const colIdx = line.indexOf(':');
        if (colIdx !== -1) {
            const key = line.substring(0, colIdx).trim();
            const val = line.substring(colIdx + 1).trim().replace(/^['"]|['"]$/g, '');
            
            if (val === '') {
                currentKey = key;
                listItems = [];
                metadata[key] = listItems;
            } else {
                currentKey = key;
                listItems = null;
                metadata[key] = val;
            }
        }
    }
    
    return { metadata, body };
}

try {
    if (!fs.existsSync(postsDir)) {
        console.error(`Posts directory does not exist at: ${postsDir}`);
        process.exit(1);
    }
    
    const files = fs.readdirSync(postsDir);
    const posts = [];
    
    for (let file of files) {
        if (path.extname(file) === '.md') {
            const filePath = path.join(postsDir, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const { metadata } = parseYamlFrontmatter(content);
            
            if (!metadata.slug || !metadata.title) {
                console.warn(`Warning: Missing slug or title in ${file}. Skipping.`);
                continue;
            }
            
            // Format tags if it's a string instead of an array
            let tags = metadata.tags || [];
            if (typeof tags === 'string') {
                tags = tags.split(',').map(t => t.trim());
            }
            
            posts.push({
                id: 1, // Will be reassigned after sorting
                slug: metadata.slug,
                title: metadata.title,
                excerpt: metadata.excerpt || '',
                category: metadata.category || '',
                categoryId: metadata.categoryId || '',
                tags: tags,
                date: metadata.date || '',
                readTime: metadata.readTime || '5 min read',
                difficulty: metadata.difficulty || 'Beginner',
                status: metadata.status || 'Published',
                url: `./post.html?post=${metadata.slug}`,
                source: `../content/posts/${metadata.slug}.md`
            });
        }
    }
    
    // Sort by date descending
    posts.sort((a, b) => new Date(b.date.replace(/-/g, '/')) - new Date(a.date.replace(/-/g, '/')));
    // Wait, let's reverse so newest is first. b - a sorts descending (newest first)
    posts.sort((a, b) => {
        const dateA = new Date(a.date.replace(/-/g, '/'));
        const dateB = new Date(b.date.replace(/-/g, '/'));
        return dateB - dateA;
    });
    
    // Re-assign sequential IDs after sorting to maintain 1-based order
    posts.forEach((post, index) => {
        post.id = index + 1;
    });
    
    // Ensure parent directory exists for output
    const outputDir = path.dirname(outputJson);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputJson, JSON.stringify(posts, null, 2), 'utf-8');
    console.log(`Successfully generated posts.json at ${outputJson}`);
    console.log(`Total posts indexed: ${posts.length}`);
} catch (err) {
    console.error(`Error generating posts.json:`, err);
    process.exit(1);
}
