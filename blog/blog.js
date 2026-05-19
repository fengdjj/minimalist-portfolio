/**
 * blog.js - Interaction behavior for Personal Blog Subpages
 * - Shared theme preference synchronization
 * - TOC active item tracker using IntersectionObserver
 * - Copy code block function with success UI animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. Dark / Light Theme Manager & Synced State
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Retrieve theme from localStorage (shared with home page)
    const getInitialTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;

        // Fallback to system preference
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return systemPrefersDark ? 'dark' : 'light';
    };

    const setTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update accessibility tags
        const label = theme === 'dark' ? '切换为浅色模式' : '切换为暗色模式';
        if (themeToggleBtn) {
            themeToggleBtn.setAttribute('aria-label', label);
        }
    };

    // Apply synced theme immediately on load
    const currentTheme = getInitialTheme();
    setTheme(currentTheme);

    // Click handler
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const activeTheme = htmlElement.getAttribute('data-theme');
            const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
            setTheme(nextTheme);
        });
    }

    // Listen for OS changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // ==========================================================================
    // 2. Table of Contents (TOC) Active Highlighter
    // ==========================================================================
    const tocLinks = document.querySelectorAll('.toc-link');
    const articleHeadings = document.querySelectorAll('.blog-content h2, .blog-content h3');

    if (tocLinks.length > 0 && articleHeadings.length > 0) {
        const headingObserverCallback = (entries) => {
            let activeId = '';
            
            // Find headings that are intersecting
            const intersectingHeadings = entries.filter(entry => entry.isIntersecting);
            
            if (intersectingHeadings.length > 0) {
                // Pick the first heading that enters the active tracking region
                activeId = intersectingHeadings[0].target.id;
            } else {
                // If scrolling between sections, fallback to finding the heading above current scroll position
                const scrollPosition = window.scrollY || window.pageYOffset;
                
                let currentHeading = articleHeadings[0];
                for (const heading of articleHeadings) {
                    if (heading.offsetTop - 180 < scrollPosition) {
                        currentHeading = heading;
                    } else {
                        break;
                    }
                }
                if (currentHeading) {
                    activeId = currentHeading.id;
                }
            }

            // Apply active class to the corresponding TOC list link
            if (activeId) {
                tocLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        };

        // Track when headings cross the top third of the viewport
        const headingObserver = new IntersectionObserver(headingObserverCallback, {
            root: null,
            rootMargin: '-100px 0px -75% 0px',
            threshold: 0
        });

        articleHeadings.forEach(heading => {
            headingObserver.observe(heading);
        });
    }

    // ==========================================================================
    // 3. Copy Code Blocks
    // ==========================================================================
    const copyButtons = document.querySelectorAll('.btn-copy');

    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const codeWindow = btn.closest('.code-window');
            if (!codeWindow) return;

            const codeElement = codeWindow.querySelector('pre code');
            if (!codeElement) return;

            // Extract the raw text to copy
            const codeText = codeElement.innerText;

            const fallbackCopy = (text) => {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.top = '0';
                textArea.style.left = '0';
                textArea.style.position = 'fixed';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                    showSuccessState();
                } catch (err) {
                    console.error('Fallback copy failed:', err);
                }
                document.body.removeChild(textArea);
            };

            const showSuccessState = () => {
                const originalHTML = btn.innerHTML;
                
                // Set green success checkmark UI
                btn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Copied!</span>
                `;
                btn.style.borderColor = '#10b981';
                btn.style.color = '#10b981';

                // Reset after delay
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.borderColor = '';
                    btn.style.color = '';
                }, 2000);
            };

            // Clipboard API usage with fallback
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(codeText)
                    .then(showSuccessState)
                    .catch(() => fallbackCopy(codeText));
            } else {
                fallbackCopy(codeText);
            }
        });
    });

    // ==========================================================================
    // 4. Modification History Dropdown Toggler
    // ==========================================================================
    const historyToggle = document.getElementById('history-toggle');
    const historyMenu = document.getElementById('history-menu');

    if (historyToggle && historyMenu) {
        historyToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isShown = historyMenu.classList.toggle('show');
            historyToggle.classList.toggle('active');
            historyToggle.setAttribute('aria-expanded', isShown);
        });

        // Close when clicking elsewhere
        document.addEventListener('click', (e) => {
            if (!historyToggle.contains(e.target) && !historyMenu.contains(e.target)) {
                historyMenu.classList.remove('show');
                historyToggle.classList.remove('active');
                historyToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ==========================================================================
    // 5. Blog Hub Dynamic Rendering & Filtering System
    // ==========================================================================
    const categoryGrid = document.getElementById('categoryGrid');
    const postsGrid = document.getElementById('postsGrid');
    const searchInput = document.getElementById('searchInput');
    const filterChipsContainer = document.getElementById('filterChips');
    const emptyState = document.getElementById('emptyState');
    const postsTitle = document.getElementById('postsTitle');

    // Only run Blog Hub logic if we are on the Hub page (checking postsGrid presence)
    if (postsGrid && window.blogCategories) {
        const runBlogHubPipeline = () => {
            let activeCategory = 'all';
        let searchQuery = '';

        // Dynamic post counter helper
        const getPostCountForCategory = (catId) => {
            return window.blogPosts.filter(post => post.categoryId === catId).length;
        };

        // Render Category Cards
        const renderCategories = () => {
            if (!categoryGrid) return;
            categoryGrid.innerHTML = window.blogCategories.map(cat => {
                const count = getPostCountForCategory(cat.id);
                return `
                    <div class="category-card" data-category="${cat.id}">
                        <div class="category-card-header">
                            <div class="category-icon">
                                ${cat.icon}
                            </div>
                            <span class="category-count">${count} 篇</span>
                        </div>
                        <div class="category-info">
                            <h3>${cat.name}</h3>
                            <p class="cat-description">${cat.description}</p>
                        </div>
                    </div>
                `;
            }).join('');

            // Add click events to category cards
            const catCards = categoryGrid.querySelectorAll('.category-card');
            catCards.forEach(card => {
                card.addEventListener('click', () => {
                    const catId = card.getAttribute('data-category');
                    activateCategoryFilter(catId);
                    
                    // Smooth scroll to posts section
                    const filterSection = document.querySelector('.filter-section');
                    if (filterSection) {
                        filterSection.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });
        };

        // Render Posts Grid
        const renderPosts = () => {
            const filtered = window.blogPosts.filter(post => {
                const matchesCategory = activeCategory === 'all' || post.categoryId === activeCategory;
                const searchLower = searchQuery.toLowerCase();
                const matchesSearch = searchQuery === '' || 
                    post.title.toLowerCase().includes(searchLower) ||
                    post.excerpt.toLowerCase().includes(searchLower) ||
                    post.category.toLowerCase().includes(searchLower) ||
                    post.tags.some(tag => tag.toLowerCase().includes(searchLower));
                return matchesCategory && matchesSearch;
            });

            if (filtered.length === 0) {
                postsGrid.style.display = 'none';
                if (emptyState) emptyState.style.display = 'flex';
            } else {
                if (emptyState) emptyState.style.display = 'none';
                postsGrid.style.display = 'grid';
                
                postsGrid.innerHTML = filtered.map(post => {
                    const tagsHtml = post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('');
                    const statusClass = `status-${post.status.toLowerCase()}`;
                    return `
                        <a href="${post.url}" class="post-card">
                            <div class="post-card-header">
                                <span class="post-card-category">${post.category}</span>
                                <span class="status-badge ${statusClass}">${post.status}</span>
                            </div>
                            <h3 class="post-card-title">${post.title}</h3>
                            <p class="post-card-excerpt">${post.excerpt}</p>
                            <div class="post-tags">
                                ${tagsHtml}
                            </div>
                            <div class="post-card-footer">
                                <div class="post-card-meta">
                                    <span class="meta-left">📅 ${post.date}</span>
                                    <span class="meta-right">⏱️ ${post.readTime}</span>
                                </div>
                                <div class="post-card-actions">
                                    <span class="difficulty-badge">${post.difficulty}</span>
                                    <span class="btn-read-more">阅读全文 &rarr;</span>
                                </div>
                            </div>
                        </a>
                    `;
                }).join('');
            }
        };

        // Filter Activation Helper
        const activateCategoryFilter = (catId) => {
            activeCategory = catId;
            
            // Sync filter chips UI
            if (filterChipsContainer) {
                const chips = filterChipsContainer.querySelectorAll('.filter-chip');
                chips.forEach(chip => {
                    if (chip.getAttribute('data-category') === catId) {
                        chip.classList.add('active');
                    } else {
                        chip.classList.remove('active');
                    }
                });
            }

            // Update title text to indicate active filter
            if (postsTitle) {
                if (catId === 'all') {
                    postsTitle.innerHTML = '文章列表 / Articles';
                } else {
                    const catObj = window.blogCategories.find(c => c.id === catId);
                    const catName = catObj ? catObj.name : catId;
                    postsTitle.innerHTML = `分类: ${catName} / Articles`;
                }
            }

            renderPosts();
        };

        // Initialize Filter Chips click listeners
        const initFilterChips = () => {
            if (!filterChipsContainer) return;
            const chips = filterChipsContainer.querySelectorAll('.filter-chip');
            chips.forEach(chip => {
                chip.addEventListener('click', () => {
                    const catId = chip.getAttribute('data-category');
                    activateCategoryFilter(catId);
                });
            });
        };

        // Initialize Search input listener
        const initSearch = () => {
            if (!searchInput) return;
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value.trim();
                renderPosts();
            });
        };

        // Route URL category queries (e.g. ?category=python-notes)
        const handleUrlQuery = () => {
            const params = new URLSearchParams(window.location.search);
            const categoryParam = params.get('category');
            if (categoryParam) {
                const exists = window.blogCategories.some(c => c.id === categoryParam);
                if (exists) {
                    activateCategoryFilter(categoryParam);
                }
            }
        };

        // Run Hub render pipeline
        renderCategories();
        initFilterChips();
        initSearch();
        renderPosts();
        handleUrlQuery();
        };

        // Fetch posts.json asynchronously, fallback to window.blogPosts if not loaded
        fetch('./posts.json')
            .then(res => {
                if (!res.ok) throw new Error("Failed to load posts.json");
                return res.json();
            })
            .then(data => {
                window.blogPosts = data;
                runBlogHubPipeline();
            })
            .catch(err => {
                console.warn("posts.json load failed, using blog-data.js fallback:", err);
                if (window.blogPosts) {
                    runBlogHubPipeline();
                }
            });
    }

    // ==========================================================================
    // 6. Back To Top Button Behavior
    // ==========================================================================
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.pointerEvents = 'all';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.pointerEvents = 'none';
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
