// Revisão local: sem rastreamento, coleta de dados ou destinos externos.
(() => {
  document.querySelectorAll('[data-link-pendente]').forEach(link => {
    link.addEventListener('click', event => event.preventDefault());
    link.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') event.preventDefault();
    });
  });
  const link = document.getElementById('cta-fixo-link');
  const oferta = document.getElementById('oferta');
  if (link && oferta && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          link.removeAttribute('href');
          link.setAttribute('aria-disabled', 'true');
        } else {
          link.setAttribute('href', '#oferta');
          link.removeAttribute('aria-disabled');
        }
      });
    }, { threshold: 0.15 });
    observer.observe(oferta);
  }
})();
