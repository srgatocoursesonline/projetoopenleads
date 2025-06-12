// Variáveis globais
let countdown;
let menuOpen = false;

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeComponents();
    setupEventListeners();
    startCountdown();
    initScrollAnimations();
});

// Inicializar componentes
function initializeComponents() {
    // Adicionar classe de animação aos elementos
    addScrollAnimationClasses();
    
    // Configurar navegação suave
    setupSmoothScrolling();
    
    // Inicializar efeitos visuais
    initVisualEffects();
}

// Configurar event listeners
function setupEventListeners() {
    // Menu hamburger
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        toggleMobileMenu();
    });
    
    // CTAs principais
    const ctaPrimary = document.getElementById('ctaPrimary');
    const ctaFinal = document.getElementById('ctaFinal');
    const planCtas = document.querySelectorAll('.plan-cta');
    
    ctaPrimary.addEventListener('click', function() {
        handleCTAClick('primary');
    });
    
    ctaFinal.addEventListener('click', function() {
        handleCTAClick('final');
    });
    
    planCtas.forEach(cta => {
        cta.addEventListener('click', function() {
            handlePlanSelection(this);
        });
    });
    
    // Scroll tracking
    window.addEventListener('scroll', function() {
        handleScroll();
    });
    
    // Resize handling
    window.addEventListener('resize', function() {
        handleResize();
    });
}

// Toggle do menu mobile
function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    menuOpen = !menuOpen;
    
    if (menuOpen) {
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.backgroundColor = 'rgba(47, 79, 79, 0.98)';
        navMenu.style.padding = '20px';
        navMenu.style.borderRadius = '0 0 10px 10px';
        
        hamburger.classList.add('active');
    } else {
        navMenu.style.display = '';
        navMenu.style.flexDirection = '';
        navMenu.style.position = '';
        navMenu.style.top = '';
        navMenu.style.left = '';
        navMenu.style.width = '';
        navMenu.style.backgroundColor = '';
        navMenu.style.padding = '';
        navMenu.style.borderRadius = '';
        
        hamburger.classList.remove('active');
    }
}

// Countdown timer
function startCountdown() {
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    let hours = 23;
    let minutes = 59;
    let seconds = 47;
    
    countdown = setInterval(function() {
        // Atualizar segundos
        seconds--;
        
        if (seconds < 0) {
            seconds = 59;
            minutes--;
            
            if (minutes < 0) {
                minutes = 59;
                hours--;
                
                if (hours < 0) {
                    // Resetar quando chegar a zero
                    hours = 23;
                    minutes = 59;
                    seconds = 47;
                }
            }
        }
        
        // Atualizar display
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        // Adicionar efeito de urgência quando tempo baixo
        if (hours === 0 && minutes < 5) {
            document.querySelector('.countdown').style.animation = 'pulse 1s infinite';
        }
    }, 1000);
}

// Animações de scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Adicionar delay escalonado para múltiplos elementos
                const delay = entry.target.dataset.delay || 0;
                entry.target.style.animationDelay = delay + 'ms';
                
                entry.target.classList.add('animate-slide-up');
            }
        });
    }, observerOptions);
    
    // Observar elementos que devem animar
    const animateElements = document.querySelectorAll('.benefit-card, .pricing-card, .testimonial-card');
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 0.8s ease';
        el.dataset.delay = index * 100; // Delay escalonado
        observer.observe(el);
    });
}

// Adicionar classes de animação
function addScrollAnimationClasses() {
    const elements = document.querySelectorAll('.benefit-card, .pricing-card, .testimonial-card');
    elements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });
}

// Scroll suave
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Fechar menu mobile se estiver aberto
                if (menuOpen) {
                    toggleMobileMenu();
                }
            }
        });
    });
}

// Handle CTA clicks
function handleCTAClick(type) {
    // Animação de feedback
    const button = type === 'primary' ? document.getElementById('ctaPrimary') : document.getElementById('ctaFinal');
    
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
    
    // Tracking de evento (opcional - integrar com Google Analytics)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'cta_click', {
            'event_category': 'engagement',
            'event_label': type,
            'value': 1
        });
    }
    
    // Scroll para seção de preços ou abrir modal
    scrollToPricing();
    
    // Feedback visual
    showSuccessMessage('Direcionando para a oferta...');
}

// Handle plan selection
function handlePlanSelection(button) {
    // Remover seleção anterior
    document.querySelectorAll('.pricing-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Adicionar seleção atual
    const card = button.closest('.pricing-card');
    card.classList.add('selected');
    
    // Animação do botão
    button.style.transform = 'scale(0.95)';
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    
    setTimeout(() => {
        button.style.transform = '';
        button.innerHTML = 'PLANO SELECIONADO ✓';
        button.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
    }, 1500);
    
    // Simular processo de checkout
    setTimeout(() => {
        showCheckoutModal(card.querySelector('h3').textContent);
    }, 2000);
    
    // Tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'plan_selection', {
            'event_category': 'conversion',
            'event_label': card.querySelector('h3').textContent,
            'value': parseInt(card.querySelector('.amount').textContent)
        });
    }
}

// Scroll para seção de preços
function scrollToPricing() {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
        pricingSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Mostrar modal de checkout (simulado)
function showCheckoutModal(planName) {
    // Criar modal dinamicamente
    const modal = document.createElement('div');
    modal.className = 'checkout-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>🎉 Parabéns!</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p>Você selecionou o plano <strong>${planName}</strong></p>
                <p>Para finalizar sua assinatura, entre em contato:</p>
                <div class="contact-info">
                    <p>📱 WhatsApp: <a href="https://wa.me/5511999999999" target="_blank">(11) 99999-9999</a></p>
                    <p>📧 Email: <a href="mailto:contato@iptvpremium.com">contato@iptvpremium.com</a></p>
                </div>
                <button class="whatsapp-btn" onclick="openWhatsApp('${planName}')">
                    <i class="fab fa-whatsapp"></i>
                    Finalizar no WhatsApp
                </button>
            </div>
        </div>
    `;
    
    // Adicionar estilos do modal
    const style = document.createElement('style');
    style.textContent = `
        .checkout-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
            background: white;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            animation: slideInUp 0.3s ease;
        }
        
        .modal-header {
            padding: 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .close-modal {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
        }
        
        .modal-body {
            padding: 20px;
            text-align: center;
        }
        
        .contact-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        
        .whatsapp-btn {
            background: #25d366;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 0 auto;
            transition: all 0.3s ease;
        }
        
        .whatsapp-btn:hover {
            background: #1fb855;
            transform: translateY(-2px);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideInUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Fechar modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
        style.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            style.remove();
        }
    });
}

// Abrir WhatsApp
function openWhatsApp(planName) {
    const message = `Olá! Tenho interesse no plano ${planName} do IPTV Premium. Gostaria de finalizar minha assinatura.`;
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Mostrar mensagem de sucesso
function showSuccessMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.textContent = message;
    
    // Estilos do toast
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'linear-gradient(45deg, #28a745, #20c997)',
        color: 'white',
        padding: '15px 25px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: '3000',
        animation: 'slideInRight 0.3s ease',
        fontWeight: '600'
    });
    
    document.body.appendChild(toast);
    
    // Remover após 3 segundos
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Handle scroll events
function handleScroll() {
    const navbar = document.querySelector('.navbar');
    const scrollY = window.scrollY;
    
    // Navbar transparency effect
    if (scrollY > 50) {
        navbar.style.background = 'rgba(47, 79, 79, 0.98)';
        navbar.style.backdropFilter = 'blur(15px)';
    } else {
        navbar.style.background = 'rgba(47, 79, 79, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
    
    // Parallax effect for hero background
    const heroBg = document.querySelector('.hero-bg-animation');
    if (heroBg) {
        heroBg.style.transform = `translateY(${scrollY * 0.5}px)`;
    }
}

// Handle resize events
function handleResize() {
    // Fechar menu mobile se a tela for redimensionada
    if (window.innerWidth > 768 && menuOpen) {
        toggleMobileMenu();
    }
    
    // Ajustar countdown em telas pequenas
    const countdown = document.querySelector('.countdown');
    if (countdown) {
        if (window.innerWidth < 480) {
            countdown.style.flexDirection = 'column';
            countdown.style.alignItems = 'center';
        } else {
            countdown.style.flexDirection = 'row';
            countdown.style.alignItems = 'stretch';
        }
    }
}

// Inicializar efeitos visuais
function initVisualEffects() {
    // Efeito de partículas no hero (opcional)
    createParticleEffect();
    
    // Efeito de digitação no título (opcional)
    initTypingEffect();
    
    // Lazy loading para imagens
    initLazyLoading();
}

// Criar efeito de partículas
function createParticleEffect() {
    const hero = document.querySelector('.hero');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        Object.assign(particle.style, {
            position: 'absolute',
            width: '2px',
            height: '2px',
            background: 'rgba(0, 255, 127, 0.3)',
            borderRadius: '50%',
            pointerEvents: 'none',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animation: `particleFloat ${3 + Math.random() * 4}s infinite linear`
        });
        
        hero.appendChild(particle);
    }
    
    // Adicionar keyframes para partículas
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFloat {
            0% {
                transform: translateY(100vh) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) translateX(${Math.random() * 200 - 100}px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Efeito de digitação
function initTypingEffect() {
    const urgencyBanner = document.querySelector('.urgency-banner span');
    if (urgencyBanner) {
        const messages = [
            'Últimas 50 vagas disponíveis!',
            'Oferta por tempo limitado!',
            'Mais de 10.000 clientes satisfeitos!',
            'Instalação gratuita hoje!'
        ];
        
        let messageIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function typeMessage() {
            const currentMessage = messages[messageIndex];
            
            if (isDeleting) {
                urgencyBanner.textContent = currentMessage.substring(0, charIndex - 1);
                charIndex--;
            } else {
                urgencyBanner.textContent = currentMessage.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 100 : 150;
            
            if (!isDeleting && charIndex === currentMessage.length) {
                typeSpeed = 2000; // Pausa no final
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                messageIndex = (messageIndex + 1) % messages.length;
            }
            
            setTimeout(typeMessage, typeSpeed);
        }
        
        typeMessage();
    }
}

// Lazy loading para imagens
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Adicionar estilos adicionais para animações
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .pricing-card.selected {
        border-color: #28a745 !important;
        transform: scale(1.02);
        box-shadow: 0 12px 24px rgba(40, 167, 69, 0.3) !important;
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(6px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(6px, -6px);
    }
    
    .lazy {
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .lazy.loaded {
        opacity: 1;
    }
`;

document.head.appendChild(additionalStyles);

// Performance monitoring
function initPerformanceMonitoring() {
    // Monitorar tempo de carregamento
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Página carregada em ${loadTime.toFixed(2)}ms`);
        
        // Tracking de performance (opcional)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_load_time', {
                'event_category': 'performance',
                'value': Math.round(loadTime)
            });
        }
    });
    
    // Monitorar Core Web Vitals
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log(`${entry.name}: ${entry.value.toFixed(2)}`);
            }
        });
        
        observer.observe({entryTypes: ['measure', 'navigation']});
    }
}

// Inicializar monitoramento de performance
initPerformanceMonitoring();

// Service Worker para cache (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registrado com sucesso:', registration.scope);
            })
            .catch(function(registrationError) {
                console.log('SW falhou ao registrar:', registrationError);
            });
    });
}

// Exportar funções para uso global (se necessário)
window.IPTVLanding = {
    openWhatsApp,
    scrollToPricing,
    handleCTAClick,
    showSuccessMessage
};
