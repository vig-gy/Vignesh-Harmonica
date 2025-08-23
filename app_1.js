// Vignesh Chandrasekaran Harmonica Website JavaScript - Fixed for Netlify

document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('Initializing website...');
        
        // Initialize all features with error handling
        initSmoothScrolling();
        initActiveNavigation();
        initMobileMenu();
        initVideoInteractions();
        initServiceCardInteractions();
        initAnimations();
        initHashNavigation();
        
        console.log('Website initialized successfully');
    } catch (error) {
        console.error('Error initializing website:', error);
    }
});

// Fixed smooth scrolling navigation
function initSmoothScrolling() {
    try {
        const navLinks = document.querySelectorAll('.nav-link');
        console.log('Found nav links:', navLinks.length);
        
        navLinks.forEach((link, index) => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Nav link clicked:', this.getAttribute('href'));
                
                const targetHash = this.getAttribute('href');
                
                // Ensure hash starts with #
                if (!targetHash || !targetHash.startsWith('#')) {
                    console.warn('Invalid hash:', targetHash);
                    return;
                }
                
                const targetSection = document.querySelector(targetHash);
                console.log('Target section found:', !!targetSection);
                
                if (targetSection) {
                    // Close mobile menu if open
                    closeMobileMenu();
                    
                    // Update active nav state immediately
                    navLinks.forEach(navLink => navLink.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Calculate scroll position with offset for fixed header
                    const headerHeight = 120; // Fixed header + ribbon height
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    // Smooth scroll to section
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL hash
                    if (history.pushState) {
                        history.pushState(null, null, targetHash);
                    } else {
                        window.location.hash = targetHash;
                    }
                    
                    console.log('Scrolled to:', targetHash);
                } else {
                    console.error('Section not found for hash:', targetHash);
                }
            });
        });
        
        console.log('Smooth scrolling initialized');
    } catch (error) {
        console.error('Error initializing smooth scrolling:', error);
    }
}

// Active navigation based on scroll position - fixed
function initActiveNavigation() {
    try {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        console.log('Found sections for navigation:', sections.length);
        
        if (sections.length === 0 || navLinks.length === 0) {
            console.warn('No sections or nav links found for active navigation');
            return;
        }

        let isScrolling = false;
        
        window.addEventListener('scroll', function() {
            if (isScrolling) return;
            
            isScrolling = true;
            requestAnimationFrame(() => {
                const scrollPosition = window.scrollY + 150; // Offset for header
                let currentSection = '';
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        currentSection = section.getAttribute('id');
                    }
                });
                
                if (currentSection) {
                    updateActiveNavLink(currentSection);
                }
                
                isScrolling = false;
            });
        });

        function updateActiveNavLink(activeSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                const linkHref = link.getAttribute('href');
                if (linkHref === '#' + activeSectionId) {
                    link.classList.add('active');
                }
            });
        }
        
        // Set initial active state
        updateActiveNavLink('home');
        
        console.log('Active navigation initialized');
    } catch (error) {
        console.error('Error initializing active navigation:', error);
    }
}

// Fixed mobile menu functionality
function initMobileMenu() {
    try {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!hamburger || !navMenu) {
            console.warn('Mobile menu elements not found');
            return;
        }

        // Toggle menu on hamburger click
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            toggleMobileMenu();
            console.log('Mobile menu toggled');
        });

        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });

        // Close menu on window resize to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        });
        
        console.log('Mobile menu initialized');
    } catch (error) {
        console.error('Error initializing mobile menu:', error);
    }
}

function toggleMobileMenu() {
    try {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            const isActive = hamburger.classList.contains('active');
            
            if (isActive) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            } else {
                hamburger.classList.add('active');
                navMenu.classList.add('active');
            }
            
            console.log('Mobile menu is now:', isActive ? 'closed' : 'open');
        }
    } catch (error) {
        console.error('Error toggling mobile menu:', error);
    }
}

function closeMobileMenu() {
    try {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    } catch (error) {
        console.error('Error closing mobile menu:', error);
    }
}

// Hash navigation for direct links - fixed
function initHashNavigation() {
    try {
        // Handle initial hash on page load
        window.addEventListener('load', function() {
            if (window.location.hash) {
                setTimeout(() => {
                    const targetSection = document.querySelector(window.location.hash);
                    if (targetSection) {
                        const headerHeight = 120;
                        const targetPosition = targetSection.offsetTop - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        console.log('Initial hash navigation to:', window.location.hash);
                    }
                }, 300);
            }
        });

        // Handle browser back/forward navigation
        window.addEventListener('popstate', function() {
            if (window.location.hash) {
                const targetSection = document.querySelector(window.location.hash);
                if (targetSection) {
                    const headerHeight = 120;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            } else {
                // No hash, scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
        
        console.log('Hash navigation initialized');
    } catch (error) {
        console.error('Error initializing hash navigation:', error);
    }
}

// Fixed video interactions
function initVideoInteractions() {
    try {
        const videoCards = document.querySelectorAll('.video-card');
        const videoLinks = document.querySelectorAll('.video-link');
        
        console.log('Found video cards:', videoCards.length);
        console.log('Found video links:', videoLinks.length);
        
        // Ensure all video links open in new tab
        videoLinks.forEach((link, index) => {
            // Make sure target="_blank" is set
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            
            link.addEventListener('click', function(e) {
                console.log('Video link clicked:', this.href);
                
                // Add visual feedback
                const card = this.closest('.video-card');
                if (card) {
                    card.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        card.style.transform = '';
                    }, 150);
                }
                
                // Ensure the link opens in new window/tab
                try {
                    window.open(this.href, '_blank', 'noopener,noreferrer');
                } catch (error) {
                    console.warn('Fallback: setting window location');
                    // Fallback
                    window.open(this.href, '_blank');
                }
            });
        });
        
        // Card hover effects
        videoCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.borderColor = 'var(--color-burgundy-primary)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.borderColor = 'var(--color-card-border)';
            });
        });
        
        console.log('Video interactions initialized');
    } catch (error) {
        console.error('Error initializing video interactions:', error);
    }
}

// Service card interactions
function initServiceCardInteractions() {
    try {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.borderColor = 'var(--color-burgundy-primary)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.borderColor = 'var(--color-card-border)';
            });
        });
        
        console.log('Service card interactions initialized');
    } catch (error) {
        console.error('Error initializing service card interactions:', error);
    }
}

// Initialize animations and interactions
function initAnimations() {
    try {
        // Fixed WhatsApp button interaction
        const whatsappBtns = document.querySelectorAll('.whatsapp-btn, .whatsapp-link');
        
        whatsappBtns.forEach(btn => {
            // Ensure proper WhatsApp URL format
            const href = btn.getAttribute('href');
            if (href && href.includes('wa.me')) {
                btn.setAttribute('target', '_blank');
                btn.setAttribute('rel', 'noopener noreferrer');
                
                btn.addEventListener('click', function(e) {
                    console.log('WhatsApp button clicked:', this.href);
                    
                    // Add click animation
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1.05)';
                        setTimeout(() => {
                            this.style.transform = '';
                        }, 150);
                    }, 100);
                    
                    // Ensure it opens properly
                    try {
                        window.open(this.href, '_blank', 'noopener,noreferrer');
                    } catch (error) {
                        console.warn('WhatsApp fallback');
                        window.open(this.href, '_blank');
                    }
                });
                
                btn.addEventListener('mouseenter', function() {
                    this.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.4)';
                });
                
                btn.addEventListener('mouseleave', function() {
                    this.style.boxShadow = 'var(--shadow-lg)';
                });
            }
        });

        // Initialize other animations
        initMentorCardAnimations();
        initStatisticsAnimation();
        initPhotoPlaceholderInteraction();
        initServiceSectionAnimations();
        initAchievementAnimations();
        initSocialLinkInteractions();
        
        console.log('Animations initialized');
    } catch (error) {
        console.error('Error initializing animations:', error);
    }
}

function initMentorCardAnimations() {
    try {
        const mentorCards = document.querySelectorAll('.mentor-card');
        
        mentorCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.6s ease';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 100);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(card);
        });
    } catch (error) {
        console.error('Error initializing mentor card animations:', error);
    }
}

function initStatisticsAnimation() {
    try {
        const statNumbers = document.querySelectorAll('.stat-number, .stat-number-mini');
        
        const animateNumber = (element) => {
            const target = element.textContent;
            const numericValue = parseInt(target.replace(/[^\d]/g, ''));
            const suffix = target.replace(/[\d,]/g, '');
            
            if (isNaN(numericValue)) return;
            
            let current = 0;
            const increment = numericValue / 30;
            const timer = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    current = numericValue;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current).toLocaleString() + suffix;
            }, 50);
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumber(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    } catch (error) {
        console.error('Error initializing statistics animation:', error);
    }
}

function initPhotoPlaceholderInteraction() {
    try {
        const photoPlaceholder = document.querySelector('.photo-placeholder');
        if (photoPlaceholder) {
            photoPlaceholder.addEventListener('mouseenter', function() {
                this.style.borderColor = 'var(--color-burgundy-primary)';
                this.style.background = 'var(--color-burgundy-light)';
            });
            
            photoPlaceholder.addEventListener('mouseleave', function() {
                this.style.borderColor = 'var(--color-border)';
                this.style.background = 'var(--color-surface)';
            });
        }
    } catch (error) {
        console.error('Error initializing photo placeholder interaction:', error);
    }
}

function initServiceSectionAnimations() {
    try {
        const serviceSections = document.querySelectorAll('.service-section');
        
        serviceSections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'all 0.8s ease';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 200);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(section);
        });
    } catch (error) {
        console.error('Error initializing service section animations:', error);
    }
}

function initAchievementAnimations() {
    try {
        const achievementItems = document.querySelectorAll('.achievements li');
        
        achievementItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'all 0.5s ease';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateX(0)';
                        }, index * 100);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(item);
        });
    } catch (error) {
        console.error('Error initializing achievement animations:', error);
    }
}

function initSocialLinkInteractions() {
    try {
        const socialLinks = document.querySelectorAll('.social-link');
        
        socialLinks.forEach(link => {
            // Ensure external links open in new tab
            if (link.href && (link.href.includes('youtube.com') || link.href.includes('facebook.com') || link.href.includes('instagram.com'))) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
            
            link.addEventListener('click', function(e) {
                // Add click feedback
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
    } catch (error) {
        console.error('Error initializing social link interactions:', error);
    }
}

// Utility function for debouncing
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

// Enhanced keyboard navigation
document.addEventListener('keydown', function(e) {
    try {
        // Tab navigation enhancement
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
        
        // Number key navigation (1-6 for sections)
        if (e.key >= '1' && e.key <= '6' && !e.ctrlKey && !e.altKey && !e.metaKey) {
            const sectionIds = ['home', 'about', 'mentors', 'performances', 'services', 'contact'];
            const sectionIndex = parseInt(e.key) - 1;
            
            if (sectionIds[sectionIndex]) {
                const targetSection = document.getElementById(sectionIds[sectionIndex]);
                if (targetSection) {
                    const headerHeight = 120;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    if (history.pushState) {
                        history.pushState(null, null, '#' + sectionIds[sectionIndex]);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error handling keyboard navigation:', error);
    }
});

// Remove keyboard navigation class on mouse use
document.addEventListener('mousedown', function() {
    try {
        document.body.classList.remove('keyboard-navigation');
    } catch (error) {
        console.error('Error removing keyboard navigation class:', error);
    }
});

// Global error handlers
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error || e.message);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault(); // Prevent console spam
});

// Create scroll to top button
function createScrollToTopButton() {
    try {
        const scrollButton = document.createElement('button');
        scrollButton.innerHTML = '↑';
        scrollButton.className = 'scroll-to-top';
        scrollButton.setAttribute('aria-label', 'Scroll to top');
        scrollButton.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--color-burgundy-primary);
            color: white;
            border: none;
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
            box-shadow: var(--shadow-md);
        `;
        
        document.body.appendChild(scrollButton);
        
        // Show/hide scroll button based on scroll position
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (window.pageYOffset > 300) {
                    scrollButton.style.opacity = '1';
                    scrollButton.style.visibility = 'visible';
                } else {
                    scrollButton.style.opacity = '0';
                    scrollButton.style.visibility = 'hidden';
                }
            }, 10);
        });
        
        // Scroll to top when clicked
        scrollButton.addEventListener('click', function() {
            window.scrollTo({ 
                top: 0, 
                behavior: 'smooth' 
            });
            
            if (history.pushState) {
                history.pushState(null, null, '#home');
            }
            
            // Update active nav
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#home') {
                    link.classList.add('active');
                }
            });
        });
        
        console.log('Scroll to top button created');
    } catch (error) {
        console.error('Error creating scroll to top button:', error);
    }
}

// Initialize scroll to top button
setTimeout(() => {
    createScrollToTopButton();
}, 1000);

// Debug functions for development
window.debugSections = function() {
    try {
        const sections = document.querySelectorAll('.section');
        console.log('=== Section Debug ===');
        console.log('Total sections found:', sections.length);
        sections.forEach(section => {
            console.log(`${section.id}: top=${section.offsetTop}px, height=${section.offsetHeight}px`);
        });
    } catch (error) {
        console.error('Debug error:', error);
    }
};

window.debugNavigation = function() {
    try {
        const navLinks = document.querySelectorAll('.nav-link');
        console.log('=== Navigation Debug ===');
        console.log('Total nav links:', navLinks.length);
        navLinks.forEach((link, index) => {
            console.log(`${index}: href="${link.getAttribute('href')}", active=${link.classList.contains('active')}`);
        });
    } catch (error) {
        console.error('Debug error:', error);
    }
};

console.log('Harmonica website script loaded successfully');
console.log('Available debug functions: debugSections(), debugNavigation()');