// Landing Page Interactive Features
class LandingPage {
    constructor() {
        this.isDarkMode = false;
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupSmoothScroll();
        this.setupAnimations();
        this.setupCounters();
        this.setupFormHandling();
        this.setupProgressBars();
        this.setupMobileMenu();
    }

    setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        const html = document.documentElement;
        const themeIcon = document.getElementById('theme-icon');

        // Check saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            html.classList.add('dark');
            themeIcon.className = 'fas fa-sun';
            this.isDarkMode = true;
        }

        themeToggle?.addEventListener('click', () => {
            html.classList.toggle('dark');
            this.isDarkMode = html.classList.contains('dark');
            themeIcon.className = this.isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
            localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
        });
    }

    setupSmoothScroll() {
        // Handle navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Handle CTA buttons
        window.scrollToSection = (sectionId) => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        };
    }

    setupAnimations() {
        if (typeof gsap === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        // Reveal animations
        gsap.utils.toArray('.reveal-element').forEach(element => {
            gsap.fromTo(element, 
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 95%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Floating animation for hero image
        gsap.to('.floating-element', {
            y: -20,
            duration: 3,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1
        });

        // Pulse animation for badge
        gsap.to('.pulse-element', {
            scale: 1.05,
            duration: 1.5,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1
        });
    }

    setupCounters() {
        if (typeof gsap === 'undefined') return;

        const counters = document.querySelectorAll('.stats-counter');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            
            ScrollTrigger.create({
                trigger: counter,
                start: "top 95%",
                onEnter: () => this.animateCounter(counter, target),
                once: true
            });
        });
    }

    animateCounter(element, target) {
        const obj = { value: 0 };
        
        gsap.to(obj, {
            value: target,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
                element.textContent = Math.ceil(obj.value);
            }
        });
    }

    setupFormHandling() {
        // Purchase functionality
        window.comprarEbook = () => {
            this.showPurchaseModal();
        };
    }

    showPurchaseModal() {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full transform scale-100 transition-all">
                <div class="text-center">
                    <div class="text-coral-500 text-6xl mb-4">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                        Quase lá!
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">
                        Você está sendo redirecionado para nossa página segura de checkout...
                    </p>
                    <div class="space-y-4">
                        <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                                class="w-full bg-coral-500 text-white py-3 rounded-full font-semibold hover:bg-coral-600 transition-colors">
                            Continuar para o Checkout
                        </button>
                        <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                                class="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-full font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                            Voltar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (modal.parentElement) {
                modal.remove();
            }
        }, 5000);
    }

    setupProgressBars() {
        // Animate progress bars when visible
        const progressBars = document.querySelectorAll('.progress-fill');
        
        progressBars.forEach(bar => {
            ScrollTrigger.create({
                trigger: bar,
                start: "top 95%",
                onEnter: () => {
                    const width = bar.style.width || '0%';
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                },
                once: true
            });
        });
    }

    setupMobileMenu() {
        // Add mobile menu functionality if needed
        const mobileMenuButton = document.querySelector('.mobile-menu-button');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LandingPage();
});

// Utility functions
const utils = {
    // Debounce function for scroll events
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Format currency
    formatCurrency: (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },

    // Show notification
    showNotification: (message, type = 'info') => {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 transform translate-x-full transition-transform duration-300 ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 
            'bg-blue-500'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Slide in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Slide out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
};

// Export for global access
window.utils = utils;