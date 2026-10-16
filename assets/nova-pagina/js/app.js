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

// Sete minutos por sessao; recarregar a pagina nao reinicia o contador.
(() => {
  const bloco = document.querySelector('[data-offer-countdown-block]');
  if (!bloco) return;
  const contador = bloco.querySelector('[data-offer-countdown]');
  const rotulo = bloco.querySelector('[data-offer-label]');
  if (!contador || !rotulo) return;
  const chave = 'botica-viva-offer-session-v1';
  let limite = Date.now() + 7 * 60 * 1000;
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
  bloco.hidden = false;
  let intervalo = null;
  const atualizar = () => {
    const segundos = Math.max(0, Math.ceil((limite - Date.now()) / 1000));
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const resto = segundos % 60;
    contador.textContent = [horas, minutos, resto]
      .map(valor => String(valor).padStart(2, '0')).join(':');
    contador.dateTime = 'PT' + segundos + 'S';
    if (segundos === 0) {
      rotulo.textContent = 'Oferta expirada';
      if (intervalo !== null) clearInterval(intervalo);
    }
    return segundos;
  };
  if (atualizar() > 0) intervalo = setInterval(atualizar, 1000);
  window.addEventListener('pageshow', atualizar);
  document.addEventListener('visibilitychange', atualizar);
})();
