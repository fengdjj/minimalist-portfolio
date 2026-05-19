document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. Dark / Light Theme Manager
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Retrieve saved theme preference, or fallback to system preference
    const getInitialTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;

        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return systemPrefersDark ? 'dark' : 'light';
    };

    const setTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update aria label for accessibility
        const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
        themeToggleBtn.setAttribute('aria-label', label);
    };

    // Initialize theme
    const currentTheme = getInitialTheme();
    setTheme(currentTheme);

    // Event listener for theme toggle
    themeToggleBtn.addEventListener('click', () => {
        const activeTheme = htmlElement.getAttribute('data-theme');
        const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
    });

    // Listen for OS system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // ==========================================================================
    // 2. Mobile Menu Toggle
    // ==========================================================================
    const mobileToggleBtn = document.getElementById('mobile-toggle');
    const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
    const iconHamburger = mobileToggleBtn.querySelector('.icon-hamburger');
    const iconClose = mobileToggleBtn.querySelector('.icon-close');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    const toggleMobileMenu = () => {
        const isOpen = mobileMenuDrawer.classList.toggle('open');
        
        // Toggle hamburger and close icon svgs
        if (isOpen) {
            iconHamburger.style.display = 'none';
            iconClose.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Lock body scroll when menu is open
        } else {
            iconHamburger.style.display = 'block';
            iconClose.style.display = 'none';
            document.body.style.overflow = ''; // Restore scroll
        }
    };

    mobileToggleBtn.addEventListener('click', toggleMobileMenu);

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenuDrawer.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });

    // ==========================================================================
    // 3. Scroll Reveal Animation (Intersection Observer)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.15 // trigger when 15% of element is visible
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ==========================================================================
    // 4. Smart Header Hide/Show on Scroll & Active Section Highlighting
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let lastScrollY = window.scrollY;
    const scrollThreshold = 100;

    const handleScrollEffects = () => {
        const currentScrollY = window.scrollY;
        
        // 4a. Hide/Show Header
        if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
            // Scrolling down and past navbar -> Hide header
            navbar.classList.add('nav-hidden');
        } else {
            // Scrolling up -> Show header
            navbar.classList.remove('nav-hidden');
        }
        lastScrollY = currentScrollY;

        // 4b. Active Navigation Link Highlighting based on scroll position
        let currentActiveSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - varHeaderHeightOffset();
            const sectionHeight = section.clientHeight;
            
            if (currentScrollY >= sectionTop && currentScrollY < sectionTop + sectionHeight) {
                currentActiveSectionId = section.getAttribute('id');
            }
        });

        if (currentActiveSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentActiveSectionId}`) {
                    link.classList.add('active');
                }
            });
        }

        // 4c. Back to Top Button Visibility
        const backToTopBtn = document.getElementById('back-to-top');
        if (currentScrollY > 600) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.pointerEvents = 'all';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.pointerEvents = 'none';
        }
    };

    const varHeaderHeightOffset = () => {
        return navbar.clientHeight + 10;
    };

    window.addEventListener('scroll', handleScrollEffects, { passive: true });
    
    // Back to top click event
    document.getElementById('back-to-top').addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ==========================================================================
    // 5. Contact Form Submission & Toast Notifications
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const toastContainer = document.getElementById('toast-container');

    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Success or Error Icons
        const iconSvg = type === 'success' 
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;

        toast.innerHTML = `
            ${iconSvg}
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);

        // Slide out and remove toast after 4 seconds
        setTimeout(() => {
            toast.classList.add('toast-out');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 4000);
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalBtnHTML = submitBtn.innerHTML;
            
            // Disable submit button and show visual loading state
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            submitBtn.innerHTML = `
                <span>Sending...</span>
                <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M6.34 17.66l2.83-2.83M17.66 6.34l-2.83 2.83"></path>
                </svg>
            `;

            // Simulate API Request duration
            setTimeout(() => {
                // Restore button
                submitBtn.disabled = false;
                submitBtn.style.opacity = '';
                submitBtn.innerHTML = originalBtnHTML;
                
                // Clear form
                contactForm.reset();
                
                // Show successful response toast
                showToast('Thank you! Your message has been sent successfully.');
            }, 1500);
        });
    }

    // ==========================================================================
    // 6. Current Year Helper
    // ==========================================================================
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ==========================================================================
    // 7. Blog Category Tabs & Navigation Links Hook
    // ==========================================================================
    const blogTabs = document.querySelectorAll('.blog-tab');
    const blogCards = document.querySelectorAll('.blog-preview-card');
    
    // Function to filter blogs
    const filterBlogs = (category) => {
        // Toggle active status of tab buttons
        blogTabs.forEach(tab => {
            if (tab.getAttribute('data-category') === category) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Filter cards
        blogCards.forEach(card => {
            const cardCat = card.getAttribute('data-category');
            if (category === 'all' || cardCat === category) {
                card.classList.remove('hidden-blog');
                card.classList.add('show-anim');
                // Remove animation class after it completes to prevent styling issues on hover
                setTimeout(() => {
                    card.classList.remove('show-anim');
                }, 500);
            } else {
                card.classList.add('hidden-blog');
                card.classList.remove('show-anim');
            }
        });
    };

    // Register tab click handlers
    blogTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const category = tab.getAttribute('data-category');
            filterBlogs(category);
        });
    });

    // Reset filter to 'all' when clicking the blog nav links (desktop/mobile header navigation)
    const blogNavLinks = document.querySelectorAll('a[href="#blog"], a[href="#/blog"]');
    blogNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            filterBlogs('all');
        });
    });
});
