// Scroll fluide
const elements = document.querySelectorAll('.scroll-animate');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Ajoute un délai progressif selon l'ordre des éléments
      elements.forEach((el, i) => {
        if (el === entry.target) {
          setTimeout(() => {
            el.classList.add('visible');
          }, i * 150); // 150ms de délai entre chaque
        }
      });
      observer.unobserve(entry.target); // Optionnel : n'anime qu'une fois
    }
  });
}, { threshold: 0.15 });

elements.forEach(el => observer.observe(el));


// Scroll fluide personnalisé (lent)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      window.scrollTo({
        top: target.offsetTop,
        behavior: 'smooth'
      });
    }
  });
});