// Variant only: forward campaign attribution, never product/payment controls.
(() => {
  const incoming = new URLSearchParams(window.location.search);
  const allowed = name => /^utm_[a-z0-9_]+$/.test(name) || ['fbclid', 'gclid', 'msclkid', 'ttclid', 'src', 'sck'].includes(name);
  document.querySelectorAll('a[data-checkout-plan="pro"]').forEach(link => {
    const target = new URL(link.href);
    if (target.origin !== 'https://pay.hotmart.com') return;
    const keys = new Set([...incoming.keys()].filter(allowed));
    for (const key of keys) {
      // Existing checkout attribution takes precedence; do not duplicate on reinsertion.
      if (target.searchParams.has(key)) continue;
      for (const value of incoming.getAll(key)) target.searchParams.append(key, value);
    }
    link.href = target.href;
  });
})();
