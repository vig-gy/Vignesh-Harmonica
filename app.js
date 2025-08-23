// Vignesh Chandrasekaran Harmonica Website - Single Page Scrolling JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initSmoothScrolling();
    initActiveNavigation();
    initMobileMenu();
    initVideoCards();
    initServiceInteractions();
    initScrollAnimations();
    initNavbarScroll();
    initWhatsAppIntegration();
    initSocialLinks();
    
    console.log('All JavaScript components initialized successfully');
});

// Smooth scrolling navigation - FIXED
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Calculate proper scroll position
                const navbarHeight = 85; // Fixed navbar height
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (window.closeMobileMenu) {
                    window.closeMobileMenu();
                }
                
                console.log('✅ Navigated to section:', targetId);
            } else {
                console.error('❌ Target section not found:', targetId);
            }
        });
    });
    
    console.log('✅ Smooth scrolling initialized for', navLinks.length, 'links');
}

// Active navigation highlighting based on scroll position
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    if (sections.length === 0) {
        console.error('❌ No sections found for active navigation');
        return;
    }
    
    function updateActiveNav() {
        const currentScrollY = window.scrollY;
        const navbarHeight = 85;
        const offset = 150;
        
        let currentSection = 'home'; // Default to home
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - offset;
            const sectionHeight = section.offsetHeight;
            
            if (currentScrollY >= sectionTop && currentScrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update nav link states
        navLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            if (href === currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Throttled scroll event listener
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateActiveNav, 10);
    });
    
    // Initial call
    updateActiveNav();
    
    console.log('✅ Active navigation initialized for', sections.length, 'sections');
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (!mobileToggle || !mobileOverlay) {
        console.log('ℹ️ Mobile menu elements not found (desktop view)');
        return;
    }
    
    // Toggle mobile menu
    mobileToggle.addEventListener('click', function(e) {
        e.preventDefault();
        const isActive = mobileToggle.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
    
    // Close menu when clicking overlay
    mobileOverlay.addEventListener('click', function(e) {
        if (e.target === mobileOverlay) {
            closeMobileMenu();
        }
    });
    
    // Close menu when clicking nav links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            setTimeout(closeMobileMenu, 300);
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileToggle.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    function openMobileMenu() {
        mobileToggle.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('📱 Mobile menu opened');
    }
    
    function closeMobileMenu() {
        mobileToggle.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
        console.log('📱 Mobile menu closed');
    }
    
    // Make closeMobileMenu globally available
    window.closeMobileMenu = closeMobileMenu;
    
    console.log('✅ Mobile menu initialized');
}

// Video card interactions - FIXED
function initVideoCards() {
    const videoCards = document.querySelectorAll('.video-card[data-video-url]');
    
    videoCards.forEach((card, index) => {
        const videoUrl = card.getAttribute('data-video-url');
        const videoTitle = card.querySelector('.video-title')?.textContent?.trim() || `Performance ${index + 1}`;
        
        // Add click event
        card.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🎬 Video card clicked:', videoTitle, videoUrl);
            
            if (videoUrl && videoUrl.trim() !== '') {
                try {
                    // Force open in new tab
                    const newWindow = window.open(videoUrl, '_blank', 'noopener,noreferrer');
                    if (!newWindow) {
                        // Fallback if popup blocked
                        window.location.href = videoUrl;
                    }
                    console.log('✅ Opened video:', videoUrl);
                } catch (error) {
                    console.error('❌ Error opening video:', error);
                    // Fallback to YouTube channel
                    window.open('https://www.youtube.com/@vig_gy', '_blank', 'noopener,noreferrer');
                }
            } else {
                console.warn('⚠️ No video URL found, opening YouTube channel');
                window.open('https://www.youtube.com/@vig_gy', '_blank', 'noopener,noreferrer');
            }
        });
        
        // Add proper cursor and accessibility
        card.style.cursor = 'pointer';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('title', `Watch ${videoTitle} on YouTube`);
        
        // Keyboard support
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            const playBtn = this.querySelector('.play-button');
            if (playBtn) {
                playBtn.style.transform = 'translate(-50%, -50%) scale(1.15)';
                playBtn.style.background = '#8B1538';
            }
            this.style.transform = 'translateY(-6px)';
        });
        
        card.addEventListener('mouseleave', function() {
            const playBtn = this.querySelector('.play-button');
            if (playBtn) {
                playBtn.style.transform = 'translate(-50%, -50%) scale(1)';
                playBtn.style.background = 'rgba(114, 47, 55, 0.9)';
            }
            this.style.transform = 'translateY(0)';
        });
    });
    
    console.log('✅ Video cards initialized:', videoCards.length, 'cards');
    
    // Log video URLs for debugging
    videoCards.forEach((card, index) => {
        const url = card.getAttribute('data-video-url');
        console.log(`Video ${index + 1}: ${url}`);
    });
}

// Service card interactions
function initServiceInteractions() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking on interactive elements within the card
            if (e.target.closest('.offering-item') || e.target.closest('.feature-item')) {
                return;
            }
            
            // Navigate to contact section for service inquiries
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const navbarHeight = 85;
                const targetPosition = contactSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
                
                console.log('✅ Navigated to contact for service inquiry');
            }
        });
        
        // Add visual feedback
        card.style.cursor = 'pointer';
        card.setAttribute('title', 'Click to inquire about this service');
    });
    
    // Handle offering items within service cards
    const offeringItems = document.querySelectorAll('.offering-item');
    offeringItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const offeringName = this.querySelector('h5')?.textContent?.trim();
            
            // Navigate to contact section
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const navbarHeight = 85;
                const targetPosition = contactSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
            }
            
            console.log('✅ Lesson offering selected:', offeringName);
        });
    });
    
    console.log('✅ Service interactions initialized for', serviceCards.length, 'service cards');
}

// WhatsApp integration
function initWhatsAppIntegration() {
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]');
    
    whatsappLinks.forEach(link => {
        // Ensure proper target and rel attributes
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        link.addEventListener('click', function(e) {
            console.log('💬 WhatsApp link clicked');
        });
        
        // Enhanced hover effects for floating button
        if (link.closest('.whatsapp-float')) {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.1)';
                const icon = this.querySelector('.whatsapp-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1)';
                }
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                const icon = this.querySelector('.whatsapp-icon');
                if (icon) {
                    icon.style.transform = 'scale(1)';
                }
            });
        }
    });
    
    console.log('✅ WhatsApp integration initialized for', whatsappLinks.length, 'links');
}

// Social media links
function initSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link[href], .footer-social a[href]');
    
    socialLinks.forEach(link => {
        // Ensure external links open in new tab
        if (link.href && link.href.startsWith('http')) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }
        
        // Add click tracking
        link.addEventListener('click', function() {
            const platform = this.href.includes('instagram') ? 'Instagram' : 
                           this.href.includes('facebook') ? 'Facebook' : 
                           this.href.includes('youtube') ? 'YouTube' : 'Social';
            console.log('🔗 Social media clicked:', platform);
        });
        
        // Enhanced hover effects
        link.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.social-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.social-icon');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
    
    console.log('✅ Social media links initialized:', socialLinks.length, 'links');
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) {
        console.error('❌ Navbar not found');
        return;
    }
    
    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(114, 47, 55, 0.08)';
            navbar.style.backdropFilter = 'blur(12px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
            navbar.style.backdropFilter = 'blur(8px)';
        }
    };
    
    window.addEventListener('scroll', debounce(handleScroll, 10));
    handleScroll(); // Initial call
    
    console.log('✅ Navbar scroll effect initialized');
}

// Scroll animations
function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
        console.log('ℹ️ IntersectionObserver not supported, skipping animations');
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
                
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.video-card, .service-card, .mentor-card');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
    
    console.log('✅ Scroll animations initialized for', animatedElements.length, 'elements');
}

// Utility function for throttling scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle external links with security
document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href^="http"]');
    if (link && !link.target) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    }
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Performance optimization: Preload critical images
function preloadImages() {
    const criticalImages = [
        'https://img.youtube.com/vi/iW6HxhuOQCk/maxresdefault.jpg',
        'https://img.youtube.com/vi/osmTrsUlij4/maxresdefault.jpg',
        'https://img.youtube.com/vi/Kz13tEwMlP4/maxresdefault.jpg',
        'https://img.youtube.com/vi/FYjHUsvXVWg/maxresdefault.jpg',
        'https://img.youtube.com/vi/Hn0Xu6r8UpQ/maxresdefault.jpg',
        'https://img.youtube.com/vi/xuZyAfae33Q/maxresdefault.jpg'
    ];
    
    criticalImages.forEach((src, index) => {
        setTimeout(() => {
            const img = new Image();
            img.src = src;
            console.log(`🖼️ Preloading image ${index + 1}:`, src);
        }, index * 200);
    });
}

// Initialize preloading after page load
window.addEventListener('load', function() {
    setTimeout(preloadImages, 1000);
});

// Error handling for failed image loads
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        console.warn('⚠️ Image failed to load:', e.target.src);
    }
}, true);

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('👁️ Page hidden - pausing animations');
        document.body.style.animationPlayState = 'paused';
    } else {
        console.log('👁️ Page visible - resuming animations');
        document.body.style.animationPlayState = 'running';
    }
});

// Export functions for potential external use
window.HarmonicaWebsite = {
    scrollToSection: function(sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            const navbarHeight = 85;
            const targetPosition = targetSection.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: 'smooth'
            });
            
            console.log('🎯 External scroll to:', sectionId);
        }
    },
    closeMobileMenu: function() {
        if (window.closeMobileMenu) {
            window.closeMobileMenu();
        }
    },
    testNavigation: function() {
        console.log('🧪 Testing navigation...');
        const sections = ['home', 'about', 'mentors', 'performances', 'services', 'contact'];
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            console.log(`Section ${sectionId}:`, section ? '✅ Found' : '❌ Missing');
        });
    },
    testVideos: function() {
        console.log('🧪 Testing video cards...');
        const videos = document.querySelectorAll('.video-card[data-video-url]');
        videos.forEach((card, index) => {
            const url = card.getAttribute('data-video-url');
            console.log(`Video ${index + 1}: ${url ? '✅ Has URL' : '❌ No URL'} - ${url}`);
        });
    }
};

console.log('✅ Harmonica Website JavaScript - All functionality enabled for single-page scrolling experience');

// Debug mode - run tests automatically in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🔧 Development mode detected - running tests');
    setTimeout(() => {
        if (window.HarmonicaWebsite) {
            window.HarmonicaWebsite.testNavigation();
            window.HarmonicaWebsite.testVideos();
        }
    }, 2000);
}