// Helper function to get appropriate zoom level based on screen size
function getMetarZoomLevel() {
    const width = window.innerWidth;
    if (width < 480) return 50;      // Mobile phones
    if (width < 768) return 60;      // Small tablets
    if (width < 1024) return 70;     // Tablets
    return 79;                        // Desktop
}

// Track last access time for metar-taf live page
let lastMetarLiveAccess = null;
const METAR_LIVE_COOLDOWN = 60 * 60 * 1000; // 1 hour in milliseconds
let metarLinksInitialized = false; // Prevent duplicate event listeners

// Helper function to update metar-taf links with dynamic zoom and targets
function updateMetarLinks() {
    const zoom = getMetarZoomLevel();
    
    // Update live LGLR links with specific target and cooldown check
    const metarLiveLinks = document.querySelectorAll('a[href*="metar-taf.com/live/LGLR"]');
    metarLiveLinks.forEach(link => {
        link.href = `https://metar-taf.com/live/LGLR?zoom=${zoom}`;
        link.target = 'metar_live_window';
        
        // Only add event listener once
        if (!metarLinksInitialized) {
            link.addEventListener('click', function(e) {
                const now = Date.now();
                if (lastMetarLiveAccess && (now - lastMetarLiveAccess) < METAR_LIVE_COOLDOWN) {
                    // Within cooldown period - just focus existing window without refreshing
                    e.preventDefault();
                    const existingWindow = window.open('', 'metar_live_window');
                    if (existingWindow && !existingWindow.closed) {
                        existingWindow.focus();
                    }
                    return false;
                }
                lastMetarLiveAccess = now;
            });
        }
    });
    
    // Update general metar-taf.com links with different target
    const metarGeneralLinks = document.querySelectorAll('a[href="https://metar-taf.com/"]');
    metarGeneralLinks.forEach(link => {
        link.target = 'metar_general_window';
    });
    
    metarLinksInitialized = true;
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollEffects();
    initContactForm();
    initCopyEmail();
    initAnimations();
    initMobileMenu();
    initWeatherWidget();
    initPhotoGallery();
    initBannerToggle();
    updateMetarLinks();
});

// Update zoom on window resize
let resizeTimeout;
window.addEventListener('resize', function() {
    // Debounce resize events to avoid multiple calls
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Only update href, don't re-add event listeners
        const zoom = getMetarZoomLevel();
        const metarLiveLinks = document.querySelectorAll('a[href*="metar-taf.com/live/LGLR"]');
        metarLiveLinks.forEach(link => {
            link.href = `https://metar-taf.com/live/LGLR?zoom=${zoom}`;
        });
    }, 250);
});

// Navigation functionality
function initNavigation() {
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.classList.remove('scrolled');
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
    
    // Active navigation link based on scroll position
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu if open
            const navMenu = document.querySelector('.nav-menu');
            const hamburger = document.querySelector('.hamburger');
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
}

// Copy contact values (email/phone) to clipboard
function initCopyEmail() {
    const buttons = document.querySelectorAll('.copy-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', async function() {
            const val = this.dataset.copy || this.dataset.email || this.closest('.contact-details')?.querySelector('.contact-value')?.textContent?.trim();
            if (!val) return;
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(val);
                } else {
                    const ta = document.createElement('textarea');
                    ta.value = val;
                    ta.style.position = 'fixed';
                    ta.style.left = '-9999px';
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand('copy');
                    ta.remove();
                }

                const isEmail = val.includes('@');
                showNotification(isEmail ? 'Η διεύθυνση email αντιγράφηκε στο πρόχειρο.' : 'Ο αριθμός τηλεφώνου αντιγράφηκε στο πρόχειρο.', 'success');

                // temporary visual feedback
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i>';
                setTimeout(() => { this.innerHTML = originalHTML; }, 2000);
            } catch (err) {
                console.error('Copy failed', err);
                showNotification('Δεν ήταν δυνατή η αντιγραφή. Αντιγράψτε χειροκίνητα.', 'error');
            }
        });
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        const bars = hamburger.querySelectorAll('.bar');
        if (hamburger.classList.contains('active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-4px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-4px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            
            const bars = hamburger.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });
}

// Scroll animations
function initScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements
    const elementsToAnimate = document.querySelectorAll(
        '.service-card, .training-card, .aircraft-card, .contact-item, .about-text, .about-image'
    );
    
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Validate form
            if (validateForm(formObject)) {
                // Show loading state
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Αποστολή...';
                submitButton.classList.add('loading');
                
                // Simulate form submission (replace with actual form handling)
                setTimeout(() => {
                    showNotification('Το μήνυμα στάλθηκε επιτυχώς! Θα επικοινωνήσουμε μαζί σας σύντομα.', 'success');
                    this.reset();
                    submitButton.textContent = originalText;
                    submitButton.classList.remove('loading');
                }, 2000);
            }
        });
    }
}

// Form validation
function validateForm(formData) {
    const errors = [];
    
    if (!formData.firstName || formData.firstName.trim().length < 2) {
        errors.push('Παρακαλώ εισάγετε έγκυρο όνομα');
    }
    
    if (!formData.lastName || formData.lastName.trim().length < 2) {
        errors.push('Παρακαλώ εισάγετε έγκυρο επώνυμο');
    }
    
    if (!formData.email || !isValidEmail(formData.email)) {
        errors.push('Παρακαλώ εισάγετε έγκυρη διεύθυνση email');
    }
    
    if (!formData.service) {
        errors.push('Παρακαλώ επιλέξτε υπηρεσία');
    }
    
    if (!formData.message || formData.message.trim().length < 10) {
        errors.push('Παρακαλώ εισάγετε μήνυμα (τουλάχιστον 10 χαρακτήρες)');
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="btn-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 10000;
        width: 272px;
        background: ${type === 'success' ? '#00000080' : type === 'error' ? '#ef4444' : '#2563eb'};
        color: white;
        padding: 1rem;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    const closeButton = notification.querySelector('.btn-close');
    closeButton.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Additional animations
function initAnimations() {
    // Counter animation for hero stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            const increment = target / 50;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = counter.textContent.replace(/\d+/, target);
                    clearInterval(timer);
                } else {
                    counter.textContent = counter.textContent.replace(/\d+/, Math.floor(current));
                }
            }, 40);
        });
    }
    
    // Trigger counter animation when hero section is visible
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    heroObserver.unobserve(entry.target);
                }
            });
        });
        
        heroObserver.observe(heroSection);
    }
    
    // Card hover effects
    const cards = document.querySelectorAll('.service-card, .training-card, .aircraft-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Utility functions
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

// Smooth reveal animation for elements
function revealElement(element, delay = 0) {
    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, delay);
}

// Contact form functionality (placeholder)
function contactForInfo(subject) {
    const message = `Θα ήθελα περισσότερες πληροφορίες για ${subject}. Παρακαλώ επικοινωνήστε μαζί μου.`;
    
    // Scroll to contact form and pre-fill message
    const contactForm = document.querySelector('.contact-form');
    const messageField = document.querySelector('#message');
    
    if (contactForm && messageField) {
        messageField.value = message;
        
        contactForm.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Highlight the form briefly
        setTimeout(() => {
            contactForm.style.boxShadow = '0 0 20px rgba(37, 99, 235, 0.3)';
            setTimeout(() => {
                contactForm.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
            }, 2000);
        }, 500);
    }
}

// Add click handlers for external links
document.addEventListener('DOMContentLoaded', function() {
    const externalLinks = document.querySelectorAll('.link-item[target="_blank"]');
    const openTabs = new Map(); // Store references to opened tabs by URL
    
    externalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default behavior
            
            const url = this.href;
            const linkName = this.classList.contains('link-name') 
                ? (this.textContent || this.href) 
                : (this.querySelector('.link-name')?.textContent || 'External Link');
            
            // Special handling for Facebook and other social media sites that block tab management
            const isFacebook = url.includes('facebook.com');
            const isBlockedSite = isFacebook || url.includes('twitter.com') || url.includes('instagram.com');
            
            if (isBlockedSite) {
                // For blocked sites, we can't reliably manage tabs, so we use a simpler approach
                console.log('Opening social media link (tab management limited):', linkName);
                window.open(url, '_blank');
                return;
            }
            
            // Create a unique window name based on the URL for other sites
            const windowName = 'external_' + btoa(url).replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
            
            // Check if we already have a tab open for this URL
            if (openTabs.has(url)) {
                const existingTab = openTabs.get(url);
                
                // Check if the tab is still open and focus it
                if (existingTab && !existingTab.closed) {
                    existingTab.focus();
                    console.log('Focusing existing tab for:', linkName);
                } else {
                    // Tab was closed, open a new one
                    const newTab = window.open(url, windowName);
                    openTabs.set(url, newTab);
                    console.log('Reopening tab for:', linkName);
                }
            } else {
                // Open new tab and store reference
                const newTab = window.open(url, windowName);
                openTabs.set(url, newTab);
                console.log('Opening new tab for:', linkName);
            }
        });
    });
});

// Service performance optimization
function optimizePerformance() {
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Preload critical resources
    const preloadLinks = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
    ];
    
    preloadLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', optimizePerformance);

// Banner collapse/expand functionality
function initBannerToggle() {
    const banner = document.querySelector('.container-banner');
    if (!banner) return;

    const closeBtn = banner.querySelector('.btn-close');

    const handle = banner.querySelector('.banner-handle');

    function expand() {
        banner.classList.remove('banner-collapsed');
        banner.setAttribute('aria-hidden', 'false');
        banner.setAttribute('aria-expanded', 'true');
        try { localStorage.setItem('bannerCollapsed', 'false'); } catch (e) {}
    }

    function collapse() {
        banner.classList.add('banner-collapsed');
        banner.setAttribute('aria-hidden', 'true');
        banner.setAttribute('aria-expanded', 'false');
        try { localStorage.setItem('bannerCollapsed', 'true'); } catch (e) {}
    }

    // Close button collapses the banner (stop propagation so outer click doesn't toggle immediately)
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            collapse();
        });
    }

    // When collapsed, clicking the visible part expands it
    // Click on the whole banner should expand only when collapsed; clicking inner controls should not bubble
    banner.addEventListener('click', function(e) {
        if (banner.classList.contains('banner-collapsed')) {
            expand();
        }
    });

    // Make the slim handle keyboard-accessible and clickable
    if (handle) {
        handle.addEventListener('click', function(e) {
            e.stopPropagation();
            expand();
        });
        handle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                expand();
            }
        });
    }

    // Allow keyboard escape to expand if collapsed
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && banner.classList.contains('banner-collapsed')) {
            expand();
        }
    });

    // Initialize state from localStorage
    try {
        const stored = localStorage.getItem('bannerCollapsed');
        if (stored === 'true') {
            collapse();
        } else if (stored === 'false') {
            expand();
        }
    } catch (e) {
        // ignore storage errors
    }
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You could send this to an error tracking service
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Weather Widget Integration
function initWeatherWidget() {
    fetchWeatherData();
    
    // Refresh data every 30 minutes
    setInterval(fetchWeatherData, 30 * 60 * 1000);
}

async function fetchWeatherData() {
    try {
        // Use OpenMeteo for general weather data
        await fetchFromOpenMeteoAPI();
    } catch (error) {
        console.error('Weather API failed:', error);
        showWeatherFallback();
    }
}


// OpenMeteo API for weather data
async function fetchFromOpenMeteoAPI() {
    try {
        // Coordinates for Larissa Airport: 39.65, 22.465
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=39.65&longitude=22.465&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,winddirection_10m,visibility,cloudcover&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum&timezone=Europe/Athens');
        
        if (response.ok) {
            const data = await response.json();
            displaySimpleWeatherData(data);
        }
    } catch (error) {
        console.log('OpenMeteo API failed');
        throw error;
    }
}


// Display simplified weather data from OpenMeteo
function displaySimpleWeatherData(data) {
    const weatherElement = document.getElementById('weather-content');
    const timestamp = new Date().toLocaleString('el-GR');
    
    const current = data.current_weather;
    const daily = data.daily;
    const hourly = data.hourly;
    
    // Current conditions
    const temp = Math.round(current.temperature);
    const windSpeed = Math.round(current.windspeed);
    const windDir = Math.round(current.winddirection);
    const windSpeedKts = Math.round(current.windspeed * 1.94384); // m/s to knots
    
    // Today's forecast
    const todayMax = Math.round(daily.temperature_2m_max[0]);
    const todayMin = Math.round(daily.temperature_2m_min[0]);
    const precipitation = daily.precipitation_sum[0];
    const sunrise = new Date(daily.sunrise[0]).toLocaleTimeString('el-GR', {hour: '2-digit', minute: '2-digit'});
    const sunset = new Date(daily.sunset[0]).toLocaleTimeString('el-GR', {hour: '2-digit', minute: '2-digit'});
    
    // Weather condition interpretation
    const weatherCode = current.weathercode;
    const weatherDescription = getWeatherDescription(weatherCode);
    
    weatherElement.innerHTML = `
        <div class="weather-header">
            <div class="weather-timestamp">
                <i class="fas fa-clock"></i>
                Ενημέρωση: ${timestamp}
            </div>
        </div>
        
        <div class="weather-current">
            <div class="weather-main">
                <div class="temperature-display">
                    <span class="temp-current">${temp}°C</span>
                    <div class="temp-range">
                        <span class="temp-min">↓ ${todayMin}°</span>
                        <span class="temp-max">↑ ${todayMax}°</span>
                    </div>
                </div>
                <div class="weather-description">
                    ${weatherDescription}
                </div>
            </div>
            
            <div class="weather-details">
                <div class="detail-row">
                    <div class="detail-item">
                        <i class="fas fa-wind"></i>
                        <span class="label">Άνεμος</span>
                        <span class="value">${windDir}° ${windSpeed} m/s (${windSpeedKts} kts)</span>
                    </div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-item">
                        <i class="fas fa-eye"></i>
                        <span class="label">Ορατότητα</span>
                        <span class="value">Καλή</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-tint"></i>
                        <span class="label">Βροχόπτωση</span>
                        <span class="value">${precipitation} mm</span>
                    </div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-item">
                        <i class="fas fa-sun"></i>
                        <span class="label">Ανατολή</span>
                        <span class="value">${sunrise}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-moon"></i>
                        <span class="label">Δύση</span>
                        <span class="value">${sunset}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="weather-source">
            <i class="fas fa-info-circle"></i>
            Πηγή: OpenMeteo Weather API (Γενικές καιρικές συνθήκες)
        </div>
    `;
    
    // Update weather summary with basic VFR info
    updateBasicWeatherSummary(data);
}


// Helper functions for CheckWX data
function formatCheckWXWind(wind) {
    if (!wind) return 'Άνεμος δεν αναφέρεται';
    
    const dir = wind.degrees || wind.direction;
    const speed = wind.speed_kts || wind.speed;
    
    if (dir && speed) {
        return `${dir}° στους ${speed} kts`;
    }
    return 'Άνεμος δεν διαθέσιμος';
}

function formatCheckWXVisibility(visibility) {
    if (!visibility) return 'N/A';
    
    if (visibility.miles_float && visibility.miles_float >= 6) {
        return '10+ km';
    } else if (visibility.miles_float) {
        return `${(visibility.miles_float * 1.609).toFixed(1)} km`;
    }
    
    return 'Ορατότητα δεν διαθέσιμη';
}

// AVWX Data Formatting Functions
function formatAVWXWind(metarData) {
    if (metarData.wind_direction && metarData.wind_speed) {
        const direction = metarData.wind_direction;
        const speed = metarData.wind_speed;
        const gust = metarData.wind_gust;
        
        let windStr = '';
        
        if (direction.repr === 'VRB' || direction.value === null) {
            windStr = `Μεταβλητός στους ${speed.value || speed.repr} kts`;
        } else {
            windStr = `${direction.value || direction.repr}° στους ${speed.value || speed.repr} kts`;
        }
        
        if (gust && gust.value) {
            windStr += ` (ριπές ${gust.value} kts)`;
        }
        
        return windStr;
    }
    return 'Άνεμος δεν αναφέρεται';
}

function formatAVWXVisibility(metarData) {
    if (metarData.visibility) {
        const vis = metarData.visibility;
        if (vis.repr === 'CAVOK' || (vis.value && vis.value >= 9999)) {
            return '10+ km (CAVOK)';
        } else if (vis.value) {
            // AVWX returns visibility in statute miles
            const km = vis.value * 1.609344; // Convert miles to km
            return `${km.toFixed(1)} km`;
        }
    }
    return 'N/A';
}

function formatAVWXClouds(metarData) {
    if (!metarData.clouds || metarData.clouds.length === 0) return 'Καθαρός ουρανός';
    
    const cloudTypes = {
        'FEW': 'Λίγα νέφη',
        'SCT': 'Διάσπαρτα νέφη', 
        'BKN': 'Σπασμένα νέφη',
        'OVC': 'Συνεχής νεφοκάλυψη'
    };
    
    return metarData.clouds.map(cloud => {
        const type = cloudTypes[cloud.type] || cloud.type;
        const altitude = cloud.altitude ? `${cloud.altitude} ft` : '';
        return `${type} ${altitude}`;
    }).join(', ');
}

function formatAVWXTemperature(metarData) {
    const temp = metarData.temperature;
    const dewpoint = metarData.dewpoint;
    
    let tempStr = '';
    if (temp && temp.celsius !== null) {
        tempStr += `${temp.celsius}°C`;
    }
    if (dewpoint && dewpoint.celsius !== null) {
        tempStr += ` / Σημείο δρόσου: ${dewpoint.celsius}°C`;
    }
    
    return tempStr || 'N/A';
}

function formatAVWXPressure(metarData) {
    if (metarData.altimeter && metarData.altimeter.hpa) {
        return `${metarData.altimeter.hpa} hPa`;
    } else if (metarData.altimeter && metarData.altimeter.value) {
        // Convert inHg to hPa if needed
        const hpa = Math.round(metarData.altimeter.value * 33.8639);
        return `${hpa} hPa`;
    }
    return 'N/A';
}

function translateFlightRules(flightRules) {
    const translations = {
        'VFR': 'VFR - Οπτικές πτήσεις εφικτές',
        'MVFR': 'MVFR - Οριακές VFR συνθήκες',
        'IFR': 'IFR - Απαιτείται πτητικό σχέδιο',
        'LIFR': 'LIFR - Χαμηλές IFR συνθήκες'
    };
    return translations[flightRules] || flightRules;
}

function getWeatherDescription(weatherCode) {
    const descriptions = {
        0: '<i class="fas fa-sun" style="color: #FFD700; font-size: 1.5em;"></i> Καθαρός ουρανός',
        1: '<i class="fas fa-sun" style="color: #FFA500; font-size: 1.5em;"></i> Κυρίως καθαρός',
        2: '<i class="fas fa-cloud-sun" style="color: #87CEEB; font-size: 1.5em;"></i> Μερικώς συννεφιασμένος',
        3: '<i class="fas fa-cloud" style="color: #B0C4DE; font-size: 1.5em;"></i> Συννεφιασμένος',
        45: '<i class="fas fa-smog" style="color: #A9A9A9; font-size: 1.5em;"></i> Ομίχλη',
        48: '<i class="fas fa-smog" style="color: #778899; font-size: 1.5em;"></i> Παγωμένη ομίχλη',
        51: '<i class="fas fa-cloud-drizzle" style="color: #4682B4; font-size: 1.5em;"></i> Ελαφριά ψιλή βροχή',
        53: '<i class="fas fa-cloud-rain" style="color: #4169E1; font-size: 1.5em;"></i> Μέτρια ψιλή βροχή',
        55: '<i class="fas fa-cloud-showers-heavy" style="color: #0000FF; font-size: 1.5em;"></i> Έντονη ψιλή βροχή',
        61: '<i class="fas fa-cloud-rain" style="color: #4682B4; font-size: 1.5em;"></i> Ελαφριά βροχή',
        63: '<i class="fas fa-cloud-rain" style="color: #4169E1; font-size: 1.5em;"></i> Μέτρια βροχή',
        65: '<i class="fas fa-cloud-showers-heavy" style="color: #0000FF; font-size: 1.5em;"></i> Έντονη βροχή',
        80: '<i class="fas fa-cloud-sun-rain" style="color: #6495ED; font-size: 1.5em;"></i> Ελαφριοί όμβροι',
        81: '<i class="fas fa-cloud-showers-heavy" style="color: #4169E1; font-size: 1.5em;"></i> Μέτριοι όμβροι',
        82: '<i class="fas fa-poo-storm" style="color: #800080; font-size: 1.5em;"></i> Έντονοι όμβροι',
        95: '<i class="fas fa-bolt" style="color: #FFD700; font-size: 1.5em;"></i> Καταιγίδα',
        96: '<i class="fas fa-bolt" style="color: #FF4500; font-size: 1.5em;"></i> Καταιγίδα με χαλάζι',
        99: '<i class="fas fa-bolt" style="color: #DC143C; font-size: 1.5em;"></i> Έντονη καταιγίδα με χαλάζι'
    };
    return descriptions[weatherCode] || '<i class="fas fa-cloud-sun" style="color: #87CEEB; font-size: 1.5em;"></i> Μεταβλητές συνθήκες';
}

function updateBasicWeatherSummary(data) {
    const summaryElement = document.getElementById('weather-summary');
    const current = data.current_weather;
    const daily = data.daily;
    
    const temp = Math.round(current.temperature);
    const windSpeed = Math.round(current.windspeed * 1.94384); // m/s to knots
    const sunrise = new Date(daily.sunrise[0]).toLocaleTimeString('el-GR', {hour: '2-digit', minute: '2-digit'});
    const sunset = new Date(daily.sunset[0]).toLocaleTimeString('el-GR', {hour: '2-digit', minute: '2-digit'});
    
    // Calculate if it's daytime
    const now = new Date();
    const sunriseTime = new Date(daily.sunrise[0]);
    const sunsetTime = new Date(daily.sunset[0]);
    const isDaylight = now >= sunriseTime && now <= sunsetTime;
    
    // Basic VFR assessment
    let vfrStatus = 'unknown';
    let vfrText = 'Άγνωστο';
    let vfrDetails = 'Χρησιμοποιήστε επίσημα METAR/TAF για ακριβή ανάλυση';
    
    if (!isDaylight) {
        vfrStatus = 'night';
        vfrText = 'Μη Εφικτές (Νύχτα)';
        vfrDetails = `Νυχτερινές συνθήκες - VFR δεν επιτρέπονται μετά τη δύση (${sunset})`;
    } else if (windSpeed > 25) {
        vfrStatus = 'marginal';
        vfrText = 'Οριακές';
        vfrDetails = 'Ισχυροί άνεμοι - Προσοχή για VFR πτήσεις';
    } else {
        vfrStatus = 'check-required';
        vfrText = 'Απαιτείται Έλεγχος';
        vfrDetails = 'Ελέγξτε επίσημα METAR/TAF για ορατότητα και νεφοκάλυψη';
    }
    
    summaryElement.innerHTML = `
        <div class="vfr-status-basic ${vfrStatus}">
            <div class="vfr-status-header">
                <i class="fas ${isDaylight ? 'fa-sun' : 'fa-moon'}"></i>
                <span class="vfr-status-title">VFR Πτήσεις</span>
            </div>
            <div class="vfr-status-result">${vfrText}</div>
            <div class="vfr-status-details">${vfrDetails}</div>
        </div>
        <!--
        <div class="basic-conditions">
            <div class="condition-item">
                <i class="fas fa-thermometer-half"></i>
                <span class="label">Θερμοκρασία:</span>
                <span class="value">${temp}°C</span>
            </div>
            <div class="condition-item">
                <i class="fas fa-wind"></i>
                <span class="label">Άνεμος:</span>
                <span class="value">${windSpeed} kts</span>
            </div>
            <div class="condition-item">
                <i class="fas fa-sun"></i>
                <span class="label">Ανατολή:</span>
                <span class="value">${sunrise}</span>
            </div>
            <div class="condition-item">
                <i class="fas fa-moon"></i>
                <span class="label">Δύση:</span>
                <span class="value">${sunset}</span>
            </div>
        </div>
        
        <div class="important-notice">
            <i class="fas fa-exclamation-triangle"></i>
            <strong>Σημαντικό:</strong> Για επίσημη αξιολόγηση VFR/IFR, χρησιμοποιήστε πάντα επίσημα METAR/TAF δεδομένα.
        </div>
        -->
        
    `;
}

function formatWind(direction, speed, gust) {
    if (!direction || !speed) return 'Άνεμος δεν αναφέρεται';
    
    let windStr = `${direction.value}° στους ${speed.value} kts`;
    if (gust && gust.value) {
        windStr += ` (ριπές ${gust.value} kts)`;
    }
    if (direction.repr === 'VRB') {
        windStr = `Μεταβλητός στους ${speed.value} kts`;
    }
    return windStr;
}

function formatVisibility(visibility) {
    if (!visibility) return 'N/A';
    
    if (visibility.repr === 'CAVOK' || visibility.value >= 9999) {
        return '10+ km (CAVOK)';
    }
    
    const km = visibility.value / 1000;
    return `${km.toFixed(1)} km`;
}

function formatClouds(clouds) {
    if (!clouds || clouds.length === 0) return 'Καθαρός ουρανός';
    
    const cloudTypes = {
        'FEW': 'Λίγα νέφη',
        'SCT': 'Διάσπαρτα νέφη',
        'BKN': 'Σπασμένα νέφη',
        'OVC': 'Συνεχής νεφοκάλυψη'
    };
    
    return clouds.map(cloud => {
        const type = cloudTypes[cloud.type] || cloud.type;
        const altitude = cloud.altitude ? `${cloud.altitude} ft` : '';
        return `${type} ${altitude}`;
    }).join(', ');
}

function formatTAFTime(timeStr) {
    if (!timeStr) return 'N/A';
    
    const date = new Date(timeStr + 'Z');
    return date.toLocaleString('el-GR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
        timeZoneName: 'short'
    });
}


function showWeatherFallback() {
    const weatherCurrentElement = document.getElementById('weather-current');
    
    const fallbackContent = `
        <div class="weather-fallback">
            <div class="fallback-header">
                <i class="fas fa-exclamation-triangle"></i>
                <h4>Καιρικά δεδομένα δεν διαθέσιμα</h4>
            </div>
            <div class="fallback-message">
                <p>Για επίσημα αεροναυτικά δεδομένα METAR/TAF:</p>
                <a href="https://metar-taf.com/live/LGLR?zoom=79" target="metar_taf_window" class="metar-link">
                    <i class="fas fa-external-link-alt"></i>
                    <div class="link-info">
                        <span class="link-title">METAR-TAF.com</span>
                        <span class="link-desc">Επίσημα δεδομένα για LGLR</span>
                    </div>
                </a>
            </div>
        </div>
    `;
    
    if (weatherCurrentElement) {
        weatherCurrentElement.innerHTML = fallbackContent;
    }
}

// Photo Gallery functionality
function initPhotoGallery() {
    // Check if Fancybox is loaded
    if (typeof Fancybox !== 'undefined') {
        // Initialize Fancybox with custom options
        Fancybox.bind("[data-fancybox='gallery']", {
            // UI options
            Toolbar: {
                display: {
                    left: ["infobar"],
                    middle: [],
                    right: ["slideshow", "thumbs", "close"]
                }
            },
            
            // Thumbnails
            Thumbs: {
                autoStart: false,   // Don't show thumbs by default
                axis: "x"          // Horizontal thumbnail strip
            },
            
            // Navigation
            Carousel: {
                infinite: true,     // Loop through images
                preload: 3         // Preload next/previous images
            },
            
            // Animation
            showClass: "f-fadeIn",
            hideClass: "f-fadeOut",
            
            // Custom options
            dragToClose: true,
            wheel: "zoom",
            
            // Captions
            caption: function (fancybox, slide) {
                return slide.caption || slide.alt || "";
            }
        });
        
        console.log("Photo gallery initialized successfully!");
    } else {
        console.warn("Fancybox library not loaded. Photo gallery will not work.");
    }
}