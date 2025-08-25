// Vignesh Chandrasekaran Harmonica Website - Updated for Scrolling Layout
// All sections visible on scroll - Traditional single-page scrolling experience

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎵 Harmonica Website Loading...');
    
    // Initialize all components with comprehensive error handling
    try {
        initSmoothScrollNavigation();
        initMobileMenu();
        initVideoCards();
        initWhatsAppButtons();
        initSocialLinks();
        initScrollAnimations();
        initActiveNavHighlighting();
        initKeyboardShortcuts();
        
        console.log('✅ All components initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
        fallbackInit();
    }
});

// Smooth scroll navigation - Updated for scrolling layout
function initSmoothScrollNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .footer-nav');
    
    console.log('Found navigation links:', navLinks.length);
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    console.log('Scrolling to section:', targetId);
                    
                    // Calculate offset for fixed navbar
                    const navbarHeight = document.querySelector('.navbar').offsetHeight + 4; // +4 for ribbon
                    const targetPosition = targetSection.offsetTop - navbarHeight;
                    
                    // Smooth scroll to target
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    closeMobileMenu();
                    
                    // Update URL hash
                    history.pushState(null, null, href);
                    
                    console.log('✅ Successfully scrolled to:', targetId);
                } else {
                    console.error('Target section not found:', targetId);
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
                const navbarHeight = document.querySelector('.navbar').offsetHeight + 4;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        } else {
            // Scroll to top for home
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    
    console.log('✅ Smooth scroll navigation initialized');
}

// Active navigation highlighting based on scroll position
function initActiveNavHighlighting() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!('IntersectionObserver' in window)) {
        console.log('IntersectionObserver not supported - using scroll fallback');
        initScrollBasedNavigation();
        return;
    }
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-80px 0px -50% 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const sectionId = entry.target.id;
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (entry.isIntersecting && navLink) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                // Add active class to current nav link
                navLink.classList.add('active');
                
                // Update mobile nav too
                const mobileNavLink = document.querySelector(`.mobile-nav-links .nav-link[href="#${sectionId}"]`);
                if (mobileNavLink) {
                    document.querySelectorAll('.mobile-nav-links .nav-link').forEach(link => 
                        link.classList.remove('active'));
                    mobileNavLink.classList.add('active');
                }
                
                console.log('Active section:', sectionId);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
    
    console.log('✅ Active navigation highlighting initialized');
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
    
    console.log('✅ Scroll-based navigation fallback initialized');
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (!mobileMenuToggle || !mobileNav) {
        console.log('Mobile menu elements not found');
        return;
    }
    
    mobileMenuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
        console.log('Mobile menu toggled');
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
    
    console.log('✅ Mobile menu initialized');
}

function toggleMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.classList.toggle('active');
        mobileNav.classList.toggle('hidden');
        
        // Prevent body scroll when menu is open
        if (!mobileNav.classList.contains('hidden')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

function closeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.classList.remove('active');
        mobileNav.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Video card interactions with guaranteed YouTube opening
function initVideoCards() {
    const videoCards = document.querySelectorAll('.video-card');
    console.log('Found video cards:', videoCards.length);
    
    videoCards.forEach((card, index) => {
        const videoUrl = card.getAttribute('data-video-url');
        
        if (!videoUrl) {
            console.error('Video card missing URL:', index);
            return;
        }
        
        console.log(`Video card ${index + 1} URL:`, videoUrl);
        
        // Multiple event listeners for maximum compatibility
        card.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🎬 Video card clicked:', videoUrl);
            
            // Guaranteed YouTube opening
            const openVideo = () => {
                try {
                    // Method 1: Standard window.open
                    const newWindow = window.open(videoUrl, '_blank', 'noopener,noreferrer');
                    
                    // Method 2: If blocked, try direct assignment
                    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                        console.log('Pop-up blocked, trying alternative method...');
                        window.location.href = videoUrl;
                        return;
                    }
                    
                    // Method 3: Focus the new window
                    if (newWindow) {
                        newWindow.focus();
                    }
                    
                    console.log('✅ YouTube video opened successfully');
                    
                } catch (error) {
                    console.error('Primary video open failed:', error);
                    // Final fallback
                    try {
                        window.location.href = videoUrl;
                    } catch (finalError) {
                        console.error('All video open methods failed:', finalError);
                    }
                }
            };
            
            // Execute with slight delay for better compatibility
            setTimeout(openVideo, 50);
            
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            this.style.transition = 'transform 0.2s ease';
            
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
        
        // Alternative click handler for play button
        const playButton = card.querySelector('.play-button');
        if (playButton) {
            playButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('🎬 Play button clicked directly');
                
                // Direct window.open call
                try {
                    window.open(videoUrl, '_blank', 'noopener,noreferrer');
                    console.log('✅ Video opened via play button');
                } catch (error) {
                    console.error('Play button video open failed:', error);
                    window.location.href = videoUrl;
                }
            });
        }
        
        // Keyboard accessibility
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Play harmonica performance video ${index + 1}`);
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                console.log('⌨️ Video card keyboard activation');
                this.click();
            }
        });
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Handle thumbnail load errors
        const thumbnailImage = card.querySelector('.thumbnail-image');
        if (thumbnailImage) {
            thumbnailImage.addEventListener('error', function() {
                console.log('Thumbnail failed to load, creating fallback for:', videoUrl);
                createThumbnailFallback(this, index + 1);
            });
            
            thumbnailImage.addEventListener('load', function() {
                console.log('✅ Thumbnail loaded for video', index + 1);
            });
        }
    });
    
    console.log('✅ Video cards initialized with GUARANTEED YouTube functionality');
}

// WhatsApp button functionality
function initWhatsAppButtons() {
    const whatsappButtons = document.querySelectorAll('a[href*="wa.me"], .whatsapp-button, .whatsapp-cta, .whatsapp-main');
    console.log('Found WhatsApp buttons:', whatsappButtons.length);
    
    whatsappButtons.forEach((button, index) => {
        // Ensure proper WhatsApp URL format
        if (!button.href || !button.href.includes('wa.me')) {
            const defaultMessage = 'Hi%20Vignesh%2C%20I%27m%20interested%20in%20your%20harmonica%20services.%20Could%20you%20tell%20me%20more%3F';
            button.href = `https://wa.me/6594559418?text=${defaultMessage}`;
        }
        
        // Ensure external link attributes
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
        
        button.addEventListener('click', function(e) {
            console.log('💬 WhatsApp button clicked:', this.href);
            
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            this.style.transition = 'transform 0.2s ease';
            
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // Success feedback
            showWhatsAppFeedback(this);
            
            console.log('✅ WhatsApp button clicked successfully');
        });
        
        // Enhanced floating button effects
        if (button.classList.contains('whatsapp-button')) {
            // Pulse animation every 10 seconds
            setInterval(() => {
                if (!button.matches(':hover') && document.hasFocus()) {
                    button.style.animation = 'pulse 2s ease-in-out';
                    setTimeout(() => {
                        button.style.animation = '';
                    }, 2000);
                }
            }, 10000);
        }
    });
    
    console.log('✅ WhatsApp buttons initialized');
}

// Social media links
function initSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    console.log('Found social links:', socialLinks.length);
    
    socialLinks.forEach(link => {
        // Ensure external links open securely
        if (link.href && link.href.startsWith('http')) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }
        
        link.addEventListener('click', function(e) {
            const platform = this.href.includes('instagram') ? 'Instagram' : 
                           this.href.includes('facebook') ? 'Facebook' : 
                           this.href.includes('youtube') ? 'YouTube' : 'Social';
            
            console.log('🔗 Social media clicked:', platform, this.href);
            
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    console.log('✅ Social media links initialized');
}

// Scroll animations
function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
        console.log('IntersectionObserver not supported - skipping animations');
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Find and observe animated elements
    const animatedElements = document.querySelectorAll(
        '.video-card, .service-card, .teacher-card, .contact-card, .overview-card, .stat-item'
    );
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
    
    console.log('✅ Scroll animations initialized for', animatedElements.length, 'elements');
}

// Keyboard shortcuts
function initKeyboardShortcuts() {
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
        
        switch(e.key.toLowerCase()) {
            case 'w':
                e.preventDefault();
                const whatsappButton = document.querySelector('a[href*="wa.me"]');
                if (whatsappButton) {
                    whatsappButton.click();
                    console.log('⌨️ WhatsApp shortcut activated');
                }
                break;
            case '1':
                e.preventDefault();
                scrollToSection('home');
                break;
            case '2':
                e.preventDefault();
                scrollToSection('about');
                break;
            case '3':
                e.preventDefault();
                scrollToSection('mentors');
                break;
            case '4':
                e.preventDefault();
                scrollToSection('performances');
                break;
            case '5':
                e.preventDefault();
                scrollToSection('services');
                break;
            case '6':
                e.preventDefault();
                scrollToSection('contact');
                break;
        }
    });
    
    console.log('✅ Keyboard shortcuts initialized (W=WhatsApp, 1-6=Sections)');
}

// Helper function for keyboard navigation
function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        const navbarHeight = document.querySelector('.navbar').offsetHeight + 4;
        const targetPosition = targetSection.offsetTop - navbarHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Update URL
        history.pushState(null, null, `#${sectionId}`);
        
        console.log('⌨️ Keyboard navigated to:', sectionId);
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

function showWhatsAppFeedback(button) {
    const originalText = button.textContent;
    
    // Temporary success feedback
    if (button.textContent.includes('Message') || button.textContent.includes('WhatsApp')) {
        button.textContent = 'Opening WhatsApp...';
        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
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

// Enhanced fallback initialization
function fallbackInit() {
    console.log('🔄 Running ENHANCED fallback initialization...');
    
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
                console.log('Fallback navigation to:', targetId);
            }
        });
    });
    
    // Enhanced WhatsApp button fallback
    document.querySelectorAll('a[href*="wa.me"]').forEach(button => {
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
        button.addEventListener('click', function() {
            console.log('Fallback WhatsApp click:', this.href);
        });
    });
    
    // Enhanced video card fallback
    document.querySelectorAll('.video-card').forEach(card => {
        const videoUrl = card.getAttribute('data-video-url');
        if (videoUrl) {
            card.addEventListener('click', function() {
                console.log('🎬 Fallback video click:', videoUrl);
                
                try {
                    const newWindow = window.open(videoUrl, '_blank', 'noopener,noreferrer');
                    if (newWindow) {
                        newWindow.focus();
                        console.log('✅ Fallback method 1 success');
                    } else {
                        throw new Error('Window blocked');
                    }
                } catch (error) {
                    try {
                        window.location.href = videoUrl;
                        console.log('✅ Fallback method 2 used');
                    } catch (error2) {
                        console.error('All fallback methods failed');
                    }
                }
            });
        }
    });
    
    console.log('✅ Enhanced fallback initialization complete');
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    console.log('Attempting graceful degradation...');
    fallbackInit();
});

// Ensure external links are secure
document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href^="http"]');
    if (link && !link.target) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    }
});

// Performance monitoring and final setup
window.addEventListener('load', function() {
    console.log('🎵 Harmonica Website Fully Loaded!');
    
    setTimeout(() => {
        const validation = {
            sections: document.querySelectorAll('.section').length,
            navLinks: document.querySelectorAll('.nav-link').length,
            videoCards: document.querySelectorAll('.video-card').length,
            whatsappButtons: document.querySelectorAll('a[href*="wa.me"]').length,
            mobileMenu: !!document.querySelector('.mobile-menu-toggle')
        };
        
        console.log('✅ Final Validation:', validation);
        
        // Test first video card functionality
        const firstVideoCard = document.querySelector('.video-card');
        if (firstVideoCard) {
            const testUrl = firstVideoCard.getAttribute('data-video-url');
            console.log('🎬 Video card test URL ready:', testUrl);
        }
        
        console.log('✅ All functionality ready - Scrolling layout active!');
        
        // Highlight WhatsApp button
        setTimeout(() => {
            const whatsappFloat = document.querySelector('.whatsapp-button');
            if (whatsappFloat) {
                whatsappFloat.style.animation = 'bounce 1s ease-in-out 2';
                setTimeout(() => {
                    whatsappFloat.style.animation = '';
                }, 2000);
            }
        }, 3000);
        
    }, 500);
});

console.log('🎵 Harmonica Website JavaScript - SCROLLING LAYOUT VERSION Ready!');