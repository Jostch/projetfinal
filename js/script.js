// Gestion du thème sombre/clair
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

// Vérifier le thème sauvegardé
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// Animations au scroll améliorées
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animation spéciale pour les barres de progression
            if (entry.target.classList.contains('progress')) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.setProperty('--progress-width', width + '%');
                entry.target.classList.add('animate');
            }
        }
    });
}, observerOptions);

// Observer tous les éléments avec la classe scroll-animate
document.querySelectorAll('.scroll-animate').forEach(el => {
    observer.observe(el);
});

// Navigation fluide améliorée
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        
        if (target) {
            const headerHeight = document.querySelector('.container-1').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Filtrage des projets
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        
        // Mettre à jour les boutons actifs
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filtrer les projets
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                card.classList.remove('hidden');
                setTimeout(() => {
                    card.style.display = 'block';
                }, 300);
            } else {
                card.classList.add('hidden');
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Validation du formulaire en temps réel
const contactForm = document.getElementById('contact-form');
const formInputs = contactForm.querySelectorAll('input, textarea');

// Expressions régulières pour la validation
const validators = {
    name: {
        pattern: /^[a-zA-ZÀ-ÿ\s]{2,50}$/,
        message: 'Le nom doit contenir entre 2 et 50 caractères alphabétiques'
    },
    prenom: {
        pattern: /^[a-zA-ZÀ-ÿ\s]{2,50}$/,
        message: 'Le prénom doit contenir entre 2 et 50 caractères alphabétiques'
    },
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Veuillez entrer une adresse email valide'
    },
    sujet: {
        pattern: /^.{5,100}$/,
        message: 'Le sujet doit contenir entre 5 et 100 caractères'
    },
    message: {
        pattern: /^.{10,1000}$/,
        message: 'Le message doit contenir entre 10 et 1000 caractères'
    }
};

// Validation en temps réel
formInputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
            validateField(input);
        }
    });
});

function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    const errorElement = field.parentNode.querySelector('.error-message');
    
    if (!validators[fieldName]) return;
    
    const validator = validators[fieldName];
    const isValid = validator.pattern.test(value);
    
    if (!isValid && value !== '') {
        field.classList.add('error');
        errorElement.textContent = validator.message;
        field.style.borderColor = '#e74c3c';
    } else {
        field.classList.remove('error');
        errorElement.textContent = '';
        field.style.borderColor = value !== '' ? '#27ae60' : '#e0e0e0';
    }
    
    return isValid;
}

// Soumission du formulaire
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    formInputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (isValid) {
        // Simulation d'envoi
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('Message envoyé avec succès !', 'success');
            contactForm.reset();
            formInputs.forEach(input => {
                input.style.borderColor = '#e0e0e0';
                input.classList.remove('error');
                input.parentNode.querySelector('.error-message').textContent = '';
            });
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    } else {
        showNotification('Veuillez corriger les erreurs dans le formulaire', 'error');
    }
});

// Système de notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Styles pour la notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Fermeture automatique
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
    
    // Fermeture manuelle
    notification.querySelector('.notification-close').addEventListener('click', () => {
        closeNotification(notification);
    });
}

function closeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Animation des barres de progression
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress');
    progressBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.setProperty('--progress-width', width + '%');
        bar.classList.add('animate');
    });
}

// Lancer l'animation des barres de progression quand la section est visible
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateProgressBars();
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const skillsSection = document.querySelector('.container-5');
if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// Effet de parallaxe pour les images
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.image img, .item-2 img');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Préchargement des images
function preloadImages() {
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

// Amélioration de l'accessibilité
document.addEventListener('keydown', (e) => {
    // Navigation au clavier
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Gestion du menu mobile (pour les écrans très petits)
function initMobileMenu() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.createElement('button');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    menuToggle.style.cssText = `
        display: none;
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
    `;
    
    document.querySelector('.container-1').insertBefore(menuToggle, navbar);
    
    menuToggle.addEventListener('click', () => {
        navbar.classList.toggle('mobile-open');
        menuToggle.innerHTML = navbar.classList.contains('mobile-open') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Fermer le menu en cliquant sur un lien
    navbar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('mobile-open');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// Initialiser le menu mobile
initMobileMenu();

// Amélioration des performances
let ticking = false;

function updateOnScroll() {
    // Code pour les animations au scroll
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
});

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Précharger les images
    preloadImages();
    
    // Ajouter des classes pour les animations initiales
    document.body.classList.add('loaded');
    
    // Initialiser les tooltips pour les projets
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Gestion des erreurs
window.addEventListener('error', (e) => {
    console.error('Erreur JavaScript:', e.error);
    showNotification('Une erreur est survenue. Veuillez recharger la page.', 'error');
});

// Service Worker pour le cache (optionnel)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW enregistré:', registration);
            })
            .catch(error => {
                console.log('SW échec:', error);
            });
    });
}