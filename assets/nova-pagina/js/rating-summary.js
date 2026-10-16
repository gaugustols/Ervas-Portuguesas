// Animate once on entry; static HTML remains readable without JavaScript.
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const summaries = document.querySelectorAll('[data-rating-summary]');
  if (!summaries.length || reduce.matches) return;
  const clamp = value => Math.max(0, Math.min(1, value));
  const ease = value => value * value * (3 - 2 * value);
  const format = new Intl.NumberFormat('pt-PT', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const animate = root => {
    if (root.dataset.ratingPlayed || reduce.matches) return;
    root.dataset.ratingPlayed = 'true';
    const score = root.querySelector('[data-rating-score]');
    const count = root.querySelector('[data-rating-count]');
    const stars = root.querySelectorAll('[data-rating-star]');
    const finalScore = Number(score?.dataset.ratingScore);
    const finalCount = Number(count?.dataset.ratingCount);
    if (!score || !count || !Number.isFinite(finalScore) || !Number.isFinite(finalCount)) return;
    const restore = () => {
      score.textContent = format.format(finalScore);
      count.textContent = String(finalCount);
      stars.forEach(star => { star.style.width = star.dataset.ratingStar + '%'; });
      root.classList.remove('rating-summary--playing');
    };
    root.classList.add('rating-summary--playing');
    const start = performance.now();
    const tick = now => {
      const frame = Math.min(78, (now - start) / 1000 * 30);
      if (reduce.matches) { restore(); return; }
      const progress = ease(clamp(frame / 42));
      score.textContent = format.format(finalScore * progress);
      count.textContent = String(Math.round(finalCount * progress));
      const fill = finalScore * ease(clamp((frame - 12) / 34));
      stars.forEach((star, index) => { star.style.width = clamp(fill - index) * 100 + '%'; });
      if (frame < 78) requestAnimationFrame(tick);
      else restore();
    };
    tick(start);
  };
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { observer.unobserve(entry.target); animate(entry.target); }
    });
  }, { threshold: .15 });
  summaries.forEach(root => observer.observe(root));
})();
