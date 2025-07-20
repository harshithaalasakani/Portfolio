// Portfolio JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initThemeToggle();
    initNavigation();
    initScrollAnimations();
    initContactForm();
    initImageLoading();
    initActiveNavigation();
    
    // Add smooth scrolling to all navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    if (!themeToggle) return;
    
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        html.classList.toggle('dark', savedTheme === 'dark');
    } else {
        html.classList.toggle('dark', systemPrefersDark);
    }
    
    // Update toggle button icon
    updateThemeIcon();
    
    themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        html.classList.toggle('dark');
        const isDark = html.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon();
        
        // Add a subtle animation to the button
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
    
    function updateThemeIcon() {
        const moonIcon = themeToggle.querySelector('.fa-moon');
        const sunIcon = themeToggle.querySelector('.fa-sun');
        const isDark = html.classList.contains('dark');
        
        if (moonIcon && sunIcon) {
            if (isDark) {
                moonIcon.classList.add('hidden');
                sunIcon.classList.remove('hidden');
            } else {
                moonIcon.classList.remove('hidden');
                sunIcon.classList.add('hidden');
            }
        }
    }
}

// Navigation Functionality
function initNavigation() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    // Handle navigation background on scroll
    function updateNav() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateNav);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Active Navigation Link Highlighting
function initActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    if (!navLinks.length || !sections.length) return;
    
    function updateActiveLink() {
        let currentSection = '';
        const scrollY = window.scrollY;
        const navHeight = document.querySelector('nav')?.offsetHeight || 64;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 50;
            const sectionHeight = section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Throttled scroll listener
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial check
    setTimeout(updateActiveLink, 100);
}

// Scroll Animations using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for multiple elements
                if (entry.target.classList.contains('stagger')) {
                    const children = entry.target.querySelectorAll('.stagger-child');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Add fade-in classes and observe elements
    const animateElements = [
        { selector: '#home .order-1', class: 'fade-in-right' },
        { selector: '#home .order-2', class: 'fade-in-left' },
        { selector: '#about h2', class: 'fade-in' },
        { selector: '#about .grid > div', class: 'fade-in' },
        { selector: '#projects h2', class: 'fade-in' },
        { selector: '.project-card', class: 'fade-in' },
        { selector: '#certifications h2', class: 'fade-in' },
        { selector: '.timeline-item', class: 'fade-in-left' },
        { selector: '#contact h2', class: 'fade-in' },
        { selector: '#contact .grid > div', class: 'fade-in' }
    ];
    
    animateElements.forEach(({ selector, class: className }) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            if (el) {
                el.classList.add(className);
                // Add staggered delay for multiple similar elements
                if (elements.length > 1) {
                    el.style.transitionDelay = `${index * 0.1}s`;
                }
                observer.observe(el);
            }
        });
    });
    
    // Special handling for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.15}s`;
    });
}

// Contact Form Functionality
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;
    
    const originalText = submitBtn.innerHTML;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const name = formData.get('name')?.trim();
        const email = formData.get('email')?.trim();
        const message = formData.get('message')?.trim();
        
        // Clear previous validation
        clearAllValidations();
        
        // Validate form
        let isValid = true;
        
        if (!name) {
            showInputError(form.querySelector('#name'), 'Please enter your name.');
            isValid = false;
        }
        
        if (!email) {
            showInputError(form.querySelector('#email'), 'Please enter your email.');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showInputError(form.querySelector('#email'), 'Please enter a valid email address.');
            isValid = false;
        }
        
        if (!message) {
            showInputError(form.querySelector('#message'), 'Please enter your message.');
            isValid = false;
        }
        
        if (!isValid) {
            showNotification('Please fix the errors above.', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Preparing email...';
        submitBtn.disabled = true;
        
        // Create mailto link with proper encoding
        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const bodyText = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
        const body = encodeURIComponent(bodyText);
        const mailtoLink = `mailto:harshitha@example.com?subject=${subject}&body=${body}`;
        
        // Simulate processing time for better UX
        setTimeout(() => {
            try {
                // Open mailto link
                window.location.href = mailtoLink;
                
                // Reset form and button after short delay
                setTimeout(() => {
                    form.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    clearAllValidations();
                    showNotification('Email client opened! Thank you for reaching out.', 'success');
                }, 500);
                
            } catch (error) {
                console.error('Error opening email client:', error);
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                showNotification('Unable to open email client. Please contact harshitha@example.com directly.', 'error');
            }
        }, 1000);
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', function(e) {
            clearValidation(e.target);
        });
    });
    
    function validateInput(e) {
        const input = e.target;
        const value = input.value.trim();
        
        clearValidation(input);
        
        if (!value) {
            showInputError(input, 'This field is required.');
            return false;
        }
        
        if (input.type === 'email' && !isValidEmail(value)) {
            showInputError(input, 'Please enter a valid email address.');
            return false;
        }
        
        showInputSuccess(input);
        return true;
    }
    
    function clearValidation(input) {
        input.classList.remove('border-red-500', 'border-green-500');
        const errorMsg = input.parentNode.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    }
    
    function clearAllValidations() {
        inputs.forEach(input => clearValidation(input));
    }
    
    function showInputError(input, message) {
        input.classList.add('border-red-500');
        input.classList.remove('border-green-500');
        
        // Remove existing error message
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-500 text-sm mt-1';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
    }
    
    function showInputSuccess(input) {
        input.classList.add('border-green-500');
        input.classList.remove('border-red-500');
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Image Loading Animation
function initImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        if (img.complete && img.naturalHeight !== 0) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
            img.addEventListener('error', function() {
                console.warn('Failed to load image:', this.src);
                this.classList.add('loaded'); // Show even if failed
            });
        }
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 max-w-sm`;
    
    // Set notification style based on type
    switch (type) {
        case 'success':
            notification.classList.add('bg-green-500', 'text-white');
            notification.innerHTML = `<div class="flex items-center"><i class="fas fa-check-circle mr-2"></i><span>${message}</span></div>`;
            break;
        case 'error':
            notification.classList.add('bg-red-500', 'text-white');
            notification.innerHTML = `<div class="flex items-center"><i class="fas fa-exclamation-circle mr-2"></i><span>${message}</span></div>`;
            break;
        default:
            notification.classList.add('bg-blue-500', 'text-white');
            notification.innerHTML = `<div class="flex items-center"><i class="fas fa-info-circle mr-2"></i><span>${message}</span></div>`;
    }
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'ml-4 text-white hover:text-gray-200 transition-colors';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.addEventListener('click', closeNotification);
    notification.appendChild(closeBtn);
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    const autoCloseTimeout = setTimeout(closeNotification, 5000);
    
    function closeNotification() {
        clearTimeout(autoCloseTimeout);
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }
    
    // Click to dismiss (excluding close button)
    notification.addEventListener('click', function(e) {
        if (e.target !== closeBtn && !closeBtn.contains(e.target)) {
            closeNotification();
        }
    });
}

// Add interactive hover effects
document.addEventListener('DOMContentLoaded', function() {
    // Add tilt effect to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) rotateX(2deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0)';
        });
    });
    
    // Add floating animation to hero image
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        let floatAnimation;
        
        function startFloating() {
            let start = null;
            function animate(timestamp) {
                if (!start) start = timestamp;
                const progress = (timestamp - start) / 4000; // 4 second cycle
                const y = Math.sin(progress * Math.PI * 2) * 8;
                heroImage.style.transform = `translateY(${y}px)`;
                floatAnimation = requestAnimationFrame(animate);
            }
            floatAnimation = requestAnimationFrame(animate);
        }
        
        // Start floating animation after page load
        setTimeout(startFloating, 2000);
        
        // Pause animation on hover
        heroImage.addEventListener('mouseenter', () => {
            if (floatAnimation) {
                cancelAnimationFrame(floatAnimation);
            }
        });
        
        heroImage.addEventListener('mouseleave', startFloating);
    }
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key to close notifications
    if (e.key === 'Escape') {
        const notification = document.querySelector('.notification');
        if (notification) {
            const closeBtn = notification.querySelector('button');
            if (closeBtn) {
                closeBtn.click();
            }
        }
    }
});

// Utility Functions
function throttle(func, wait) {
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

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}