// Reuses the existing Meta base pixel. No new pixel, payment or personal data.
(() => {
  if (window.__boticaConversionEvents) return;
  window.__boticaConversionEvents = true;
  const variant = document.body.dataset.lpVariant || 'original';
  const send = (name, params) => {
    if (typeof window.fbq !== 'function') return;
    try { window.fbq('trackCustom', name, { lp_variant: variant, ...params }); }
    catch { /* Analytics must never prevent navigation. */ }
  };
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a.btn');
    if (!link || link.getAttribute('aria-disabled') === 'true' || link.hasAttribute('data-link-pendente')) return;
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const plan = link.dataset.checkoutPlan;
    const cta_id = link.dataset.ctaId || (link.closest('.hero') ? 'hero' : link.closest('section')?.id || 'final');
    send('CTA_Click', { cta_id });
    // A link click is intent, not a confirmed initiation on the external checkout.
    if (!['basic', 'pro'].includes(plan)) return;
    const destination = new URL(link.href);
    if (destination.origin !== 'https://pay.hotmart.com') return;
    send('Checkout_Click', { cta_id, plan, value: plan === 'pro' ? 14.9 : 7.9, currency: 'EUR' });
  });
  // Observe the actual prices: the entire pricing section is taller than a mobile viewport.
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    const visible = entries.find(entry => entry.isIntersecting && entry.intersectionRatio >= 0.5);
    if (!visible) return;
    const plan = visible.target.closest('.oferta-plano').querySelector('[data-checkout-plan]')?.dataset.checkoutPlan;
    send('Pricing_View', { visible_plan: plan });
    observer.disconnect(); // Once per page view, even after scrolling away and back.
  }, { threshold: 0.5 });
  document.querySelectorAll('#oferta .plano-valor').forEach(price => observer.observe(price));
})();
