// Vignesh Chandrasekaran Harmonica Website - Scrolling portfolio layout

document.addEventListener('DOMContentLoaded', function() {
    try {
        initSmoothScrollNavigation();
        initMobileMenu();
        initThumbnailFallbacks();
        initExternalLinks();
        initActiveNavHighlighting();
        initKeyboardShortcuts();
        initHeroParallax();
        initNavbarScrollEffect();

        console.log('✅ All components initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
        fallbackInit();
    }
});

// Subtle parallax on the hero photo — desktop only, respects reduced-motion
function initHeroParallax() {
    const heroPhoto = document.querySelector('.hero-photo');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!heroPhoto || prefersReducedMotion || window.innerWidth < 1024) {
        return;
    }

    window.addEventListener('scroll', throttle(() => {
        const offset = Math.min(window.scrollY * 0.15, 40);
        heroPhoto.style.transform = `translateY(${offset}px)`;
    }, 16));
}

// Shrink the navbar once the page has scrolled past the hero
function initNavbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) {
        return;
    }

    window.addEventListener('scroll', throttle(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 80);
    }, 100));
}

// Smooth scroll navigation
function initSmoothScrollNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .footer-nav');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    // Close the mobile menu first — its display:none toggle is a layout
                    // change that, if it happens mid-animation, cancels an in-flight
                    // smooth scroll. Doing it before scrollIntoView avoids that entirely.
                    closeMobileMenu();

                    // Smooth scroll to target using section scroll-margin for fixed header
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Update URL hash
                    history.pushState(null, null, href);
                }
            }
        });
    });

    // Handle browser back/forward
    window.addEventListener('popstate', function() {
        const hash = window.location.hash;
        if (hash && hash !== '#') {
            const targetId = hash.substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        } else {
            // Scroll to top for home
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// Active navigation highlighting based on scroll position
function initActiveNavHighlighting() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!('IntersectionObserver' in window)) {
        initScrollBasedNavigation();
        return;
    }

    // threshold is a fraction of the SECTION's own height, so a 0.3 threshold
    // can never fire for sections much taller than the viewport (Performances,
    // Teaching) — 30% of their height never fits on screen at once. Use
    // threshold: 0 with rootMargin shrunk to a thin band near the top of the
    // viewport instead, so a section counts as "current" as soon as any part
    // of it crosses that band, regardless of the section's own height.
    const observerOptions = {
        threshold: 0,
        rootMargin: '-80px 0px -70% 0px'
    };

    // Track every section currently intersecting rather than reacting to one
    // entry at a time — a batch can report several sections as intersecting
    // simultaneously (short sections, fast scrolls), and blindly activating
    // whichever entry is processed last in the batch means the last section
    // in DOM order (Mentors, then Contact) always wins regardless of what's
    // actually on screen. Instead, always highlight the topmost section
    // (in document order) that's currently intersecting.
    const intersecting = new Set();

    function updateActiveLink() {
        const activeSection = Array.from(sections).find(section => intersecting.has(section));
        if (!activeSection) {
            return;
        }

        const sectionId = activeSection.id;
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                intersecting.add(entry.target);
            } else {
                intersecting.delete(entry.target);
            }
        });
        updateActiveLink();
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

// Fallback scroll-based navigation for older browsers
function initScrollBasedNavigation() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', throttle(() => {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.id;

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));

                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }

                // Update mobile nav
                const mobileActiveLink = document.querySelector(`.mobile-nav-links .nav-link[href="#${sectionId}"]`);
                if (mobileActiveLink) {
                    document.querySelectorAll('.mobile-nav-links .nav-link').forEach(link =>
                        link.classList.remove('active'));
                    mobileActiveLink.classList.add('active');
                }
            }
        });
    }, 100));
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (!mobileMenuToggle || !mobileNav) {
        return;
    }

    mobileMenuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar') && !mobileNav.classList.contains('hidden')) {
            closeMobileMenu();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !mobileNav.classList.contains('hidden')) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('#mobile-nav');

    if (mobileMenuToggle && mobileNav) {
        const isOpen = mobileNav.classList.toggle('hidden') === false;
        mobileMenuToggle.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
        mobileNav.setAttribute('aria-hidden', String(!isOpen));

        // Prevent body scroll when menu is open (preserve scroll position)
        if (isOpen) {
            const currentScrollY = window.scrollY;
            document.body.dataset.scrollY = currentScrollY;
            document.documentElement.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${currentScrollY}px`;
            document.body.style.width = '100%';
        } else {
            // Restore scrolling and return to previous position
            const savedScrollY = parseInt(document.body.dataset.scrollY || '0', 10);
            document.documentElement.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            if (!Number.isNaN(savedScrollY)) {
                window.scrollTo(0, savedScrollY);
            }
        }
    }
}

function closeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('#mobile-nav');

    if (!mobileMenuToggle || !mobileNav || mobileNav.classList.contains('hidden')) {
        // Already closed — bail out without touching the DOM so this is safe
        // to call unconditionally (e.g. from every nav-link click) without
        // interrupting an in-flight smooth scroll.
        return;
    }

    mobileMenuToggle.classList.remove('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.add('hidden');
    mobileNav.setAttribute('aria-hidden', 'true');

    const savedScrollY = parseInt(document.body.dataset.scrollY || '0', 10);
    document.documentElement.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    if (!Number.isNaN(savedScrollY)) {
        window.scrollTo(0, savedScrollY);
    }
}

// Video cards are plain links; just handle thumbnail load failures gracefully
function initThumbnailFallbacks() {
    document.querySelectorAll('.video-card').forEach((card, index) => {
        const thumbnailImage = card.querySelector('.thumbnail-image');
        if (thumbnailImage) {
            thumbnailImage.addEventListener('error', function() {
                createThumbnailFallback(this, index + 1);
            });
        }
    });
}

// Ensure external links open securely in a new tab
function initExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    });
}

// Keyboard shortcuts (1-6 jump between sections)
function initKeyboardShortcuts() {
    const sectionOrder = ['home', 'performances', 'about', 'mentors', 'teaching', 'contact'];

    document.addEventListener('keydown', function(e) {
        // Skip if user is typing in input/textarea
        if (document.activeElement.tagName === 'INPUT' ||
            document.activeElement.tagName === 'TEXTAREA') {
            return;
        }

        // Skip if modifier keys are pressed
        if (e.ctrlKey || e.altKey || e.metaKey) {
            return;
        }

        const sectionIndex = parseInt(e.key, 10) - 1;
        if (sectionIndex >= 0 && sectionIndex < sectionOrder.length) {
            e.preventDefault();
            scrollToSection(sectionOrder[sectionIndex]);
        }
    });
}

// Helper function for keyboard navigation
function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Update URL
        history.pushState(null, null, `#${sectionId}`);
    }
}

// Utility functions
function createThumbnailFallback(img, videoNumber) {
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        font-size: 16px;
        text-align: center;
        border-radius: 4px;
        flex-direction: column;
        gap: 8px;
    `;

    placeholder.innerHTML = `
        <div style="font-size: 2em;">🎵</div>
        <div>Performance ${videoNumber}</div>
    `;

    if (img.parentNode) {
        img.parentNode.replaceChild(placeholder, img);
    }
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Fallback initialization if anything above fails
function fallbackInit() {
    // Basic navigation fallback
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight + 4;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });

    // Ensure external links still open in a new tab
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Ensure dynamically-focused external links are secure
document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href^="http"]');
    if (link && !link.target) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    }
});
