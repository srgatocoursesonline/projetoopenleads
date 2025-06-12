// OpenLeads Strategy - Interactive JavaScript

// Utility functions
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
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
};

// DOM Elements
const header = document.querySelector('.header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav__link');
const heroSection = document.querySelector('.hero');
const metricsSection = document.querySelector('.metrics');
const servicesSection = document.querySelector('.services');
const successCasesSection = document.querySelector('.success-cases');
const methodologySection = document.querySelector('.methodology');
const teamSection = document.querySelector('.team');
const blogSection = document.querySelector('.blog');

// Header functionality
class HeaderController {
  constructor() {
    this.init();
  }

  init() {
    this.handleScroll();
    this.handleMobileMenu();
    this.handleNavigation();
  }

  handleScroll() {
    const scrollHandler = throttle(() => {
      const scrollY = window.scrollY;
      
      if (scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
      } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
      }
    }, 16);

    window.addEventListener('scroll', scrollHandler);
  }

  handleMobileMenu() {
    menuToggle?.addEventListener('click', () => {
      nav.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
      }
    });
  }

  handleNavigation() {
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }

        // Close mobile menu
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }
}

// Animation Controller
class AnimationController {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.animateHeroElements();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateSection(entry.target);
        }
      });
    }, this.observerOptions);

    // Observe sections
    const sections = [
      metricsSection,
      servicesSection,
      successCasesSection,
      methodologySection,
      teamSection,
      blogSection
    ];

    sections.forEach(section => {
      if (section) observer.observe(section);
    });
  }

  animateHeroElements() {
    const heroElements = document.querySelectorAll('.hero .fade-in');
    heroElements.forEach((element, index) => {
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, index * 200);
    });
  }

  animateSection(section) {
    const animatableElements = section.querySelectorAll(
      '.service-card, .success-case, .timeline-step, .team-member, .blog-post, .metric-item'
    );

    animatableElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('slide-in-up');
      }, index * 100);
    });

    // Special animations for specific sections
    if (section.classList.contains('metrics')) {
      this.animateCounters();
    }

    if (section.classList.contains('methodology')) {
      this.animateTimeline();
    }
  }

  animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count') || counter.textContent);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      updateCounter();
    });
  }

  animateTimeline() {
    const timelineSteps = document.querySelectorAll('.timeline-step');
    timelineSteps.forEach((step, index) => {
      setTimeout(() => {
        step.style.opacity = '1';
        step.style.transform = 'translateY(0) scale(1)';
      }, index * 300);
    });
  }
}

// Success Cases Slider
class SuccessCasesSlider {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll('.success-case');
    this.prevBtn = document.getElementById('cases-prev');
    this.nextBtn = document.getElementById('cases-next');
    this.indicatorsContainer = document.getElementById('cases-indicators');
    this.autoSlideInterval = null;
    this.init();
  }

  init() {
    if (this.slides.length === 0) return;
    
    this.createIndicators();
    this.setupEventListeners();
    this.showSlide(0);
    this.startAutoSlide();
    this.animateGrowthCharts();
  }

  createIndicators() {
    this.slides.forEach((_, index) => {
      const indicator = document.createElement('div');
      indicator.classList.add('nav-indicator');
      indicator.addEventListener('click', () => this.goToSlide(index));
      this.indicatorsContainer.appendChild(indicator);
    });
  }

  setupEventListeners() {
    this.prevBtn?.addEventListener('click', () => this.prevSlide());
    this.nextBtn?.addEventListener('click', () => this.nextSlide());

    // Pause auto-slide on hover
    const slider = document.querySelector('.success-cases__slider');
    slider?.addEventListener('mouseenter', () => this.stopAutoSlide());
    slider?.addEventListener('mouseleave', () => this.startAutoSlide());
  }

  showSlide(index) {
    this.slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    const indicators = document.querySelectorAll('.nav-indicator');
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === index);
    });

    this.currentSlide = index;
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }

  goToSlide(index) {
    this.showSlide(index);
    this.restartAutoSlide();
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  restartAutoSlide() {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  animateGrowthCharts() {
    const growthCharts = document.querySelectorAll('.growth-chart');
    growthCharts.forEach(chart => {
      const growth = parseInt(chart.getAttribute('data-growth'));
      const percentage = Math.min(growth, 100);
      chart.style.setProperty('--growth-percent', `${percentage}%`);
    });
  }
}

// ROI Calculator
class ROICalculator {
  constructor() {
    this.monthlyVisitors = 10000;
    this.conversionRate = 1;
    this.avgDeal = 10000;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateResults();
  }

  setupEventListeners() {
    const visitorsSlider = document.getElementById('monthly-visitors');
    const conversionSlider = document.getElementById('conversion-rate');
    const dealSlider = document.getElementById('avg-deal');

    visitorsSlider?.addEventListener('input', (e) => {
      this.monthlyVisitors = parseInt(e.target.value);
      document.getElementById('visitors-value').textContent = this.formatNumber(this.monthlyVisitors);
      this.updateResults();
    });

    conversionSlider?.addEventListener('input', (e) => {
      this.conversionRate = parseFloat(e.target.value);
      document.getElementById('conversion-value').textContent = this.conversionRate;
      this.updateResults();
    });

    dealSlider?.addEventListener('input', (e) => {
      this.avgDeal = parseInt(e.target.value);
      document.getElementById('deal-value').textContent = this.formatNumber(this.avgDeal);
      this.updateResults();
    });
  }

  updateResults() {
    const currentLeads = Math.floor(this.monthlyVisitors * (this.conversionRate / 100));
    const projectedLeads = Math.floor(currentLeads * 2.5); // 150% increase assumption
    const increase = Math.floor(((projectedLeads - currentLeads) / currentLeads) * 100);
    const potentialROI = (projectedLeads - currentLeads) * this.avgDeal * 12;

    document.getElementById('current-leads').textContent = this.formatNumber(currentLeads);
    document.getElementById('projected-leads').textContent = this.formatNumber(projectedLeads);
    document.getElementById('leads-increase').textContent = `+${increase}%`;
    document.getElementById('potential-roi').textContent = `R$ ${this.formatCurrency(potentialROI)}`;
  }

  formatNumber(number) {
    return number.toLocaleString('pt-BR');
  }

  formatCurrency(amount) {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return amount.toLocaleString('pt-BR');
  }
}

// Contact Form Handler
class ContactForm {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.init();
  }

  init() {
    if (!this.form) return;
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);

    // Simulate form submission
    this.showLoading();
    
    setTimeout(() => {
      this.showSuccess();
      this.form.reset();
    }, 2000);
  }

  showLoading() {
    const submitBtn = this.form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
  }

  showSuccess() {
    const submitBtn = this.form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Mensagem Enviada!';
    submitBtn.style.background = 'var(--color-success)';
    
    setTimeout(() => {
      submitBtn.textContent = 'Enviar Mensagem';
      submitBtn.disabled = false;
      submitBtn.style.background = '';
    }, 3000);
  }
}

// Newsletter Form
class NewsletterForm {
  constructor() {
    this.form = document.querySelector('.newsletter-form');
    this.init();
  }

  init() {
    if (!this.form) return;
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const email = this.form.querySelector('input[type="email"]').value;
    
    // Simulate subscription
    const submitBtn = this.form.querySelector('button');
    submitBtn.textContent = 'Inscrito!';
    submitBtn.style.background = 'var(--color-success)';
    
    setTimeout(() => {
      submitBtn.textContent = 'Inscrever-se';
      submitBtn.style.background = '';
      this.form.reset();
    }, 3000);
  }
}

// Chatbot
class Chatbot {
  constructor() {
    this.isOpen = false;
    this.toggle = document.getElementById('chatbot-toggle');
    this.container = document.getElementById('chatbot-container');
    this.closeBtn = document.getElementById('chatbot-close');
    this.input = document.getElementById('chatbot-input');
    this.sendBtn = document.getElementById('chatbot-send');
    this.messages = document.getElementById('chatbot-messages');
    this.responses = [
      "Obrigado por entrar em contato! Como posso ajudá-lo hoje?",
      "Ficaria feliz em agendar uma consultoria gratuita para você. Qual é o melhor horário?",
      "Nossos especialistas podem ajudar com estratégias de OSINT e marketing B2B. Gostaria de saber mais?",
      "Vou conectar você com um de nossos especialistas. Pode me fornecer seu email?",
      "Excelente! Nossa equipe entrará em contato em breve. Há mais alguma coisa que posso ajudar?"
    ];
    this.currentResponse = 0;
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.toggle?.addEventListener('click', () => this.toggleChat());
    this.closeBtn?.addEventListener('click', () => this.closeChat());
    this.sendBtn?.addEventListener('click', () => this.sendMessage());
    this.input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !document.getElementById('chatbot').contains(e.target)) {
        this.closeChat();
      }
    });
  }

  toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  openChat() {
    this.container.classList.add('active');
    this.isOpen = true;
    this.input?.focus();
  }

  closeChat() {
    this.container.classList.remove('active');
    this.isOpen = false;
  }

  sendMessage() {
    const message = this.input?.value.trim();
    if (!message) return;

    this.addMessage(message, 'user');
    this.input.value = '';

    // Simulate bot response
    setTimeout(() => {
      const response = this.responses[this.currentResponse % this.responses.length];
      this.addMessage(response, 'bot');
      this.currentResponse++;
    }, 1000);
  }

  addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `message--${sender}`);
    
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message__content');
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    this.messages?.appendChild(messageDiv);
    
    // Scroll to bottom
    this.messages.scrollTop = this.messages.scrollHeight;
  }
}

// Service Cards Hover Effects
class ServiceCards {
  constructor() {
    this.cards = document.querySelectorAll('.service-card');
    this.init();
  }

  init() {
    this.cards.forEach(card => {
      card.addEventListener('mouseenter', () => this.handleMouseEnter(card));
      card.addEventListener('mouseleave', () => this.handleMouseLeave(card));
    });
  }

  handleMouseEnter(card) {
    card.style.transform = 'translateY(-8px) scale(1.02)';
    card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
  }

  handleMouseLeave(card) {
    card.style.transform = '';
    card.style.boxShadow = '';
  }
}

// Team Member Effects
class TeamMembers {
  constructor() {
    this.members = document.querySelectorAll('.team-member');
    this.init();
  }

  init() {
    this.members.forEach(member => {
      member.addEventListener('mouseenter', () => this.handleMouseEnter(member));
      member.addEventListener('mouseleave', () => this.handleMouseLeave(member));
    });
  }

  handleMouseEnter(member) {
    const photo = member.querySelector('.team-member__photo');
    photo.style.transform = 'scale(1.1) rotate(5deg)';
  }

  handleMouseLeave(member) {
    const photo = member.querySelector('.team-member__photo');
    photo.style.transform = '';
  }
}

// Blog Post Hover Effects
class BlogPosts {
  constructor() {
    this.posts = document.querySelectorAll('.blog-post');
    this.init();
  }

  init() {
    this.posts.forEach(post => {
      post.addEventListener('mouseenter', () => this.handleMouseEnter(post));
      post.addEventListener('mouseleave', () => this.handleMouseLeave(post));
    });
  }

  handleMouseEnter(post) {
    post.style.transform = 'translateY(-4px) scale(1.02)';
    post.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
  }

  handleMouseLeave(post) {
    post.style.transform = '';
    post.style.boxShadow = '';
  }
}

// Smooth Scrolling for all internal links
class SmoothScrolling {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// Performance optimizations
class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.lazyLoadImages();
    this.prefetchLinks();
  }

  lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  prefetchLinks() {
    const links = document.querySelectorAll('a[href^="http"]');
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = link.href;
        document.head.appendChild(prefetchLink);
      }, { once: true });
    });
  }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  new HeaderController();
  new AnimationController();
  new SuccessCasesSlider();
  new ROICalculator();
  new ContactForm();
  new NewsletterForm();
  new Chatbot();
  new ServiceCards();
  new TeamMembers();
  new BlogPosts();
  new SmoothScrolling();
  new PerformanceOptimizer();

  // Add loading complete class
  document.body.classList.add('loaded');

  // Console log for debugging
  console.log('OpenLeads Strategy website loaded successfully!');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when page is hidden
    document.body.classList.add('paused');
  } else {
    // Resume animations when page is visible
    document.body.classList.remove('paused');
  }
});

// Handle window resize
window.addEventListener('resize', debounce(() => {
  // Recalculate positions and sizes if needed
  const event = new CustomEvent('windowResize');
  document.dispatchEvent(event);
}, 250));

// Export for potential external use
window.OpenLeadsStrategy = {
  HeaderController,
  AnimationController,
  SuccessCasesSlider,
  ROICalculator,
  ContactForm,
  NewsletterForm,
  Chatbot,
  ServiceCards,
  TeamMembers,
  BlogPosts,
  SmoothScrolling,
  PerformanceOptimizer
};