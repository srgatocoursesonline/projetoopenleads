// OpenLeads Strategy - Interactive JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const primaryNavigation = document.getElementById('primary-navigation');
    
    if (menuToggle && primaryNavigation) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            primaryNavigation.classList.toggle('active');
            
            // Toggle hamburger animation
            const hamburger = menuToggle.querySelector('.hamburger');
            hamburger.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(45deg)';
        });
        
        // Close menu when clicking on a menu link
        const menuLinks = primaryNavigation.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.setAttribute('aria-expanded', 'false');
                primaryNavigation.classList.remove('active');
                
                const hamburger = menuToggle.querySelector('.hamburger');
                hamburger.style.transform = 'rotate(0deg)';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && !primaryNavigation.contains(event.target)) {
                menuToggle.setAttribute('aria-expanded', 'false');
                primaryNavigation.classList.remove('active');
                
                const hamburger = menuToggle.querySelector('.hamburger');
                hamburger.style.transform = 'rotate(0deg)';
            }
        });
    }
    
    // Performance Chart
    const performanceChart = document.getElementById('performanceChart');
    if (performanceChart) {
        const ctx = performanceChart.getContext('2d');
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [
                    {
                        label: 'Geração de Leads (%)',
                        data: [100, 180, 220, 280, 340, 380],
                        borderColor: '#3E2723',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Taxa de Conversão (%)',
                        data: [12, 15, 18, 22, 28, 32],
                        borderColor: '#2D2D2D',
                        backgroundColor: 'rgba(45, 45, 45, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'ROI (%)',
                        data: [150, 220, 280, 350, 420, 480],
                        borderColor: '#545454',
                        backgroundColor: 'rgba(84, 84, 84, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                accessibility: {
                    enabled: true
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Performance Média dos Clientes - Últimos 6 Meses',
                        font: {
                            size: 16,
                            weight: '600'
                        },
                        color: '#ffffff'
                    },
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            font: {
                                size: 14
                            },
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(18, 18, 18, 0.9)',
                        titleColor: '#FFFFFF',
                        bodyColor: '#FFFFFF',
                        borderColor: '#3E2723',
                        borderWidth: 2,
                        cornerRadius: 8,
                        displayColors: true
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(115, 115, 115, 0.2)'
                        },
                        ticks: {
                            color: '#545454',
                            font: {
                                size: 12
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(115, 115, 115, 0.2)'
                        },
                        ticks: {
                            color: '#545454',
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                elements: {
                    point: {
                        radius: 6,
                        hoverRadius: 8,
                        borderWidth: 2,
                        hoverBorderWidth: 3
                    }
                }
            }
        });
    }
    
    // Form Validation Functions
    function validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }
    
    function validatePhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }
    
    function showError(inputId, message) {
        const input = document.getElementById(inputId);
        const errorElement = document.getElementById(inputId + '-error');
        
        if (input && errorElement) {
            input.classList.add('error');
            errorElement.textContent = message;
            errorElement.classList.add('show');
            
            // Set focus for accessibility
            input.setAttribute('aria-invalid', 'true');
            input.setAttribute('aria-describedby', inputId + '-error');
        }
    }
    
    function clearError(inputId) {
        const input = document.getElementById(inputId);
        const errorElement = document.getElementById(inputId + '-error');
        
        if (input && errorElement) {
            input.classList.remove('error');
            errorElement.textContent = '';
            errorElement.classList.remove('show');
            
            input.setAttribute('aria-invalid', 'false');
            input.removeAttribute('aria-describedby');
        }
    }
    
    function validateForm(formId) {
        let isValid = true;
        const form = document.getElementById(formId);
        
        if (!form) return false;
        
        // Get form elements
        const nameInput = form.querySelector('[name="name"]');
        const emailInput = form.querySelector('[name="email"]');
        const companyInput = form.querySelector('[name="company"]');
        const phoneInput = form.querySelector('[name="phone"]');
        
        // Clear previous errors
        if (nameInput) clearError(nameInput.id);
        if (emailInput) clearError(emailInput.id);
        if (companyInput) clearError(companyInput.id);
        if (phoneInput) clearError(phoneInput.id);
        
        // Validate name - Always validate if field exists
        if (nameInput) {
            if (!nameInput.value.trim()) {
                showError(nameInput.id, 'Nome é obrigatório');
                isValid = false;
            } else if (nameInput.value.trim().length < 2) {
                showError(nameInput.id, 'Nome deve ter pelo menos 2 caracteres');
                isValid = false;
            }
        }
        
        // Validate email - Always validate if field exists
        if (emailInput) {
            if (!emailInput.value.trim()) {
                showError(emailInput.id, 'Email é obrigatório');
                isValid = false;
            } else if (!validateEmail(emailInput.value.trim())) {
                showError(emailInput.id, 'Email inválido');
                isValid = false;
            }
        }
        
        // Validate company - Always validate if field exists
        if (companyInput) {
            if (!companyInput.value.trim()) {
                showError(companyInput.id, 'Nome da empresa é obrigatório');
                isValid = false;
            } else if (companyInput.value.trim().length < 2) {
                showError(companyInput.id, 'Nome da empresa deve ter pelo menos 2 caracteres');
                isValid = false;
            }
        }
        
        // Validate phone (if present)
        if (phoneInput) {
            if (!phoneInput.value.trim()) {
                showError(phoneInput.id, 'Telefone é obrigatório');
                isValid = false;
            } else if (!validatePhone(phoneInput.value.trim())) {
                showError(phoneInput.id, 'Telefone inválido');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    // Real-time validation
    function setupRealTimeValidation(formId) {
        const form = document.getElementById(formId);
        if (!form) return;
        
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                const inputId = this.id;
                const value = this.value.trim();
                
                // Clear error first
                clearError(inputId);
                
                // Only validate if field has content or is required
                if (this.hasAttribute('required') || value) {
                    // Validate based on input type
                    if (this.name === 'name') {
                        if (!value) {
                            showError(inputId, 'Nome é obrigatório');
                        } else if (value.length < 2) {
                            showError(inputId, 'Nome deve ter pelo menos 2 caracteres');
                        }
                    } else if (this.name === 'email') {
                        if (!value) {
                            showError(inputId, 'Email é obrigatório');
                        } else if (!validateEmail(value)) {
                            showError(inputId, 'Email inválido');
                        }
                    } else if (this.name === 'company') {
                        if (!value) {
                            showError(inputId, 'Nome da empresa é obrigatório');
                        } else if (value.length < 2) {
                            showError(inputId, 'Nome da empresa deve ter pelo menos 2 caracteres');
                        }
                    } else if (this.name === 'phone') {
                        if (!value) {
                            showError(inputId, 'Telefone é obrigatório');
                        } else if (!validatePhone(value)) {
                            showError(inputId, 'Telefone inválido');
                        }
                    }
                }
            });
            
            // Clear error on input
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    clearError(this.id);
                }
            });
        });
    }
    
    // Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        setupRealTimeValidation('contact-form');
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm('contact-form')) {
                // Simulate form submission
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                
                submitButton.textContent = 'Enviando...';
                submitButton.disabled = true;
                
                setTimeout(() => {
                    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                    this.reset();
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 2000);
            }
        });
    }
    
    // Schedule Form Handler
    const scheduleForm = document.getElementById('schedule-form');
    if (scheduleForm) {
        setupRealTimeValidation('schedule-form');
        
        scheduleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm('schedule-form')) {
                // Simulate form submission
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                
                submitButton.textContent = 'Agendando...';
                submitButton.disabled = true;
                
                setTimeout(() => {
                    alert('Consultoria agendada com sucesso! Você receberá um email de confirmação em breve.');
                    this.reset();
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 2000);
            }
        });
    }
    
    // Enhanced Smooth Scrolling for Anchor Links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip empty hash or just "#"
            if (!href || href === '#') return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculate header height for offset
                const header = document.querySelector('.site-header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                // Check for reduced motion preference
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                
                if (prefersReducedMotion) {
                    window.scrollTo(0, targetPosition);
                } else {
                    // Custom smooth scroll implementation for better control
                    const startPosition = window.pageYOffset;
                    const distance = targetPosition - startPosition;
                    const duration = 800;
                    let start = null;
                    
                    function step(timestamp) {
                        if (!start) start = timestamp;
                        const progress = timestamp - start;
                        const percent = Math.min(progress / duration, 1);
                        
                        // Easing function
                        const easeInOutCubic = percent < 0.5 
                            ? 4 * percent * percent * percent 
                            : (percent - 1) * (2 * percent - 2) * (2 * percent - 2) + 1;
                        
                        window.scrollTo(0, startPosition + distance * easeInOutCubic);
                        
                        if (progress < duration) {
                            window.requestAnimationFrame(step);
                        }
                    }
                    
                    window.requestAnimationFrame(step);
                }
                
                // Set focus for accessibility after a short delay
                setTimeout(() => {
                    targetElement.focus({ preventScroll: true });
                }, prefersReducedMotion ? 0 : 300);
            }
        });
    });
    
    // Intersection Observer for Animation on Scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!prefersReducedMotion) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .case-study-card, .testimonial-card');
    animatedElements.forEach(el => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!prefersReducedMotion) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
        
        observer.observe(el);
    });
    
    // Keyboard Navigation Enhancement
    document.addEventListener('keydown', function(e) {
        // Enhanced keyboard navigation for mobile menu
        if (e.key === 'Escape') {
            const activeMenu = document.querySelector('.primary-navigation.active');
            if (activeMenu) {
                menuToggle.setAttribute('aria-expanded', 'false');
                activeMenu.classList.remove('active');
                menuToggle.focus();
                
                const hamburger = menuToggle.querySelector('.hamburger');
                hamburger.style.transform = 'rotate(0deg)';
            }
        }
        
        // Skip link activation
        if (e.key === 'Tab' && e.shiftKey === false) {
            const skipLink = document.querySelector('.skip-link');
            if (document.activeElement === skipLink) {
                skipLink.style.top = '6px';
            }
        }
    });
    
    // Hide skip link when not focused
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });
    }
    
    // Form Accessibility Enhancements
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(control => {
        // Add required indicator for screen readers
        if (control.hasAttribute('required')) {
            const label = document.querySelector(`label[for="${control.id}"]`);
            if (label && !label.textContent.includes('*')) {
                label.innerHTML += ' <span aria-label="obrigatório">*</span>';
            }
        }
        
        // Enhanced focus indicators
        control.addEventListener('focus', function() {
            this.style.boxShadow = '0 0 0 3px rgba(62, 39, 35, 0.4)';
        });
        
        control.addEventListener('blur', function() {
            if (!this.classList.contains('error')) {
                this.style.boxShadow = '';
            }
        });
    });
    
    // Service Card Hover Effects (respecting reduced motion)
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!prefersReducedMotion) {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        }
    });
    
    // Case Study Card Hover Effects
    const caseStudyCards = document.querySelectorAll('.case-study-card');
    caseStudyCards.forEach(card => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!prefersReducedMotion) {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        }
    });
    
    // Load Detection for Performance
    window.addEventListener('load', function() {
        // Add loaded class for any final animations
        document.body.classList.add('loaded');
        
        // Initialize any lazy-loaded content
        const lazyImages = document.querySelectorAll('img[data-src]');
        if ('IntersectionObserver' in window && lazyImages.length > 0) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    });
    
    // Resize Handler for Responsive Adjustments
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Close mobile menu on resize to desktop
            if (window.innerWidth > 768) {
                const activeMenu = document.querySelector('.primary-navigation.active');
                if (activeMenu) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    activeMenu.classList.remove('active');
                    
                    const hamburger = menuToggle.querySelector('.hamburger');
                    hamburger.style.transform = 'rotate(0deg)';
                }
            }
        }, 250);
    });
    
    // Console welcome message
    console.log('🚀 OpenLeads Strategy - Website carregado com sucesso!');
    console.log('📊 Especialistas em Geração de Leads B2B e OSINT');
    
});