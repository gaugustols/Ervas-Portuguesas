// Configure separadamente os links de pagamento; vazios mantêm os CTAs pendentes.
const BASIC_CHECKOUT_URL = 'https://pay.hotmart.com/P108062599Y?off=dv3haixa&checkoutMode=10';
const PRO_CHECKOUT_URL = 'https://pay.hotmart.com/P108062599Y?off=uszcskzv&checkoutMode=10';

(() => {
  const checkouts = { basic: BASIC_CHECKOUT_URL, pro: PRO_CHECKOUT_URL };
  document.querySelectorAll('[data-checkout-plan]').forEach(link => {
    const endereco = checkouts[link.dataset.checkoutPlan]?.trim();
    if (!endereco) return;
    let destino;
    try {
      destino = new URL(endereco);
    } catch {
      return;
    }
    if (!['https:', 'http:'].includes(destino.protocol)) return;
    link.setAttribute('href', destino.href);
    link.removeAttribute('aria-disabled');
    link.removeAttribute('data-link-pendente');
  });
  document.querySelectorAll('[data-link-pendente]').forEach(link => {
    link.addEventListener('click', event => event.preventDefault());
    link.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') event.preventDefault();
    });
  });

})();

// Ampliacao acessivel dos capturas de testemunhos, sem dependencias externas.
(() => {
  if (!('HTMLDialogElement' in window)) return;
  const imagens = document.querySelectorAll('.dep-card img');
  if (!imagens.length) return;
  const dialogo = document.createElement('dialog');
  if (typeof dialogo.showModal !== 'function') return;
  dialogo.className = 'dep-zoom';
  dialogo.setAttribute('aria-label', 'Testemunho ampliado');
  const fechar = document.createElement('button');
  fechar.type = 'button';
  fechar.className = 'dep-zoom-fechar';
  fechar.textContent = 'Fechar';
  const ampliada = document.createElement('img');
  dialogo.append(fechar, ampliada);
  document.body.append(dialogo);
  let origem = null;
  imagens.forEach(imagem => {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'dep-ampliar';
    botao.setAttribute('aria-label', 'Ampliar: ' + imagem.alt);
    botao.setAttribute('aria-haspopup', 'dialog');
    const icone = document.createElement('span');
    icone.className = 'dep-ampliar-icone';
    icone.textContent = '↗';
    icone.setAttribute('aria-hidden', 'true');
    imagem.replaceWith(botao);
    botao.append(imagem, icone);
    botao.addEventListener('click', () => {
      origem = botao;
      ampliada.src = imagem.currentSrc || imagem.src;
      ampliada.alt = imagem.alt;
      dialogo.showModal();
      document.body.classList.add('dep-zoom-aberto');
      fechar.focus();
    });
  });
  fechar.addEventListener('click', () => dialogo.close());
  dialogo.addEventListener('click', event => {
    if (event.target === dialogo) {
      const area = dialogo.getBoundingClientRect();
      if (event.clientX < area.left || event.clientX > area.right ||
          event.clientY < area.top || event.clientY > area.bottom) dialogo.close();
    }
  });
  dialogo.addEventListener('close', () => {
    document.body.classList.remove('dep-zoom-aberto');
    if (origem && origem.isConnected) origem.focus();
  });
})();

// Um prazo de uma hora por sessao, partilhado por todos os contadores.
(() => {
  const blocos = Array.from(document.querySelectorAll('[data-offer-countdown-block]'))
    .map(bloco => ({
      bloco,
      contador: bloco.querySelector('[data-offer-countdown]'),
      rotulo: bloco.querySelector('[data-offer-label]'),
    }))
    .filter(({ contador, rotulo }) => contador && rotulo);
  if (!blocos.length) return;
  const chave = 'botica-viva-offer-session-v2';
  let limite = Date.now() + 60 * 60 * 1000;
  try {
    const guardado = Number(window.sessionStorage.getItem(chave));
    if (Number.isFinite(guardado) && guardado > 0) {
      limite = guardado;
    } else {
      window.sessionStorage.setItem(chave, String(limite));
    }
  } catch {
    // O contador continua a funcionar se o armazenamento estiver indisponivel.
  }
  blocos.forEach(({ bloco }) => { bloco.hidden = false; });
  let intervalo = null;
  const atualizar = () => {
    const segundos = Math.max(0, Math.ceil((limite - Date.now()) / 1000));
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const resto = segundos % 60;
    const tempo = [horas, minutos, resto]
      .map(valor => String(valor).padStart(2, '0')).join(':');
    blocos.forEach(({ contador, rotulo }) => {
      contador.textContent = tempo;
      contador.dateTime = 'PT' + segundos + 'S';
      if (segundos === 0) rotulo.textContent = 'Oferta expirada';
    });
    if (segundos === 0) {
      if (intervalo !== null) clearInterval(intervalo);
    }
    return segundos;
  };
  if (atualizar() > 0) intervalo = setInterval(atualizar, 1000);
  window.addEventListener('pageshow', atualizar);
  document.addEventListener('visibilitychange', atualizar);
})();

// Capturas reais da aplicacao: navegacao manual por toque, rato e teclado.
(() => {
  const root = document.querySelector('[data-real-app-gallery]');
  if (!root) return;
  const track = root.querySelector('[data-real-app-track]');
  const slides = Array.from(root.querySelectorAll('[data-real-app-slide]'));
  const tabs = Array.from(root.querySelectorAll('[data-real-app-tab]'));
  const controls = root.querySelector('[data-real-app-controls]');
  const previous = root.querySelector('[data-real-app-prev]');
  const next = root.querySelector('[data-real-app-next]');
  const counter = root.querySelector('[data-real-app-count]');
  if (!track || !slides.length || tabs.length !== slides.length) return;
  let index = 0;
  const sync = () => {
    const nextIndex = Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / Math.max(1, track.clientWidth))));
    if (nextIndex === index && counter.textContent === (index + 1) + ' / ' + slides.length) return;
    index = nextIndex;
    tabs.forEach((tab, i) => {
      if (i === index) tab.setAttribute('aria-current', 'true');
      else tab.removeAttribute('aria-current');
    });
    counter.textContent = (index + 1) + ' / ' + slides.length;
  };
  const go = target => {
    index = (target + slides.length) % slides.length;
    track.scrollTo({ left: index * track.clientWidth, behavior: 'instant' });
    tabs.forEach((tab, i) => {
      if (i === index) tab.setAttribute('aria-current', 'true');
      else tab.removeAttribute('aria-current');
    });
    counter.textContent = (index + 1) + ' / ' + slides.length;
  };
  tabs.forEach((tab, i) => tab.addEventListener('click', event => {
    event.preventDefault();
    go(i);
  }));
  previous.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));
  track.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') go(index + 1);
    else if (event.key === 'ArrowLeft') go(index - 1);
    else if (event.key === 'Home') go(0);
    else if (event.key === 'End') go(slides.length - 1);
    else return;
    event.preventDefault();
  });
  let scrollFrame = 0;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(sync);
  }, { passive: true });
  if ('ResizeObserver' in window) {
    let lastWidth = track.clientWidth;
    new ResizeObserver(() => {
      if (lastWidth === track.clientWidth) return;
      lastWidth = track.clientWidth;
      track.scrollTo({ left: index * lastWidth, behavior: 'instant' });
    }).observe(track);
  }
  controls.hidden = false;
})();

// Carrossel das areas da Botica Viva: toque nativo, setas, teclado e arrasto no desktop.
(() => {
  const root = document.querySelector('[data-inside-gallery]');
  if (!root) return;
  const track = root.querySelector('[data-inside-track]');
  const items = Array.from(root.querySelectorAll('.inside-item'));
  const controls = root.querySelector('[data-inside-controls]');
  const previous = root.querySelector('[data-inside-prev]');
  const next = root.querySelector('[data-inside-next]');
  if (!track || !items.length || !previous || !next || !controls) return;
  const update = () => {
    const max = Math.max(0, track.scrollWidth - track.clientWidth);
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max - 2;
  };
  const move = direction => {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const distance = items[0].getBoundingClientRect().width + gap;
    track.scrollBy({ left: distance * direction, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') move(1);
    else if (event.key === 'ArrowLeft') move(-1);
    else if (event.key === 'Home') track.scrollTo({ left: 0, behavior: 'instant' });
    else if (event.key === 'End') track.scrollTo({ left: track.scrollWidth, behavior: 'instant' });
    else return;
    event.preventDefault();
  });
  track.addEventListener('scroll', update, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(update).observe(track);
  let drag = null;
  track.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, left: track.scrollLeft, moved: false };
  });
  track.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    const delta = event.clientX - drag.x;
    if (!drag.moved && Math.abs(delta) < 6) return;
    if (!drag.moved) {
      drag.moved = true;
      track.setPointerCapture(event.pointerId);
      track.classList.add('is-dragging');
    }
    event.preventDefault();
    track.scrollLeft = drag.left - delta;
  });
  const finish = event => {
    if (!drag || drag.id !== event.pointerId) return;
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    drag = null;
    track.classList.remove('is-dragging');
    update();
  };
  track.addEventListener('pointerup', finish);
  track.addEventListener('pointercancel', finish);
  track.addEventListener('lostpointercapture', () => { drag = null; track.classList.remove('is-dragging'); });
  controls.hidden = false;
  update();
})();
