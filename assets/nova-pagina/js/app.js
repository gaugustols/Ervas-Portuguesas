// Configure separadamente os links de pagamento; vazios mantêm os CTAs pendentes.
const BASIC_CHECKOUT_URL = '';
const PRO_CHECKOUT_URL = '';

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

// Amostra do guia: seleciona conteudo ja presente na pagina, sem recolher dados.
(() => {
  const raiz = document.querySelector('[data-guide-preview]');
  if (!raiz) return;
  const navegacao = raiz.querySelector('[data-preview-tabs]');
  const botoes = Array.from(raiz.querySelectorAll('[data-preview-topic]'));
  const paineis = Array.from(raiz.querySelectorAll('[data-preview-panel]'));
  const exploracao = raiz.querySelector('[data-preview-exploration]');
  const progresso = raiz.querySelector('[data-preview-progress]');
  const preenchimento = raiz.querySelector('[data-preview-progress-fill]');
  if (!navegacao || !botoes.length || botoes.length !== paineis.length) return;
  const visitados = new Set();
  const selecionar = (chave, moverFoco = false) => {
    const botaoAtivo = botoes.find(botao => botao.dataset.previewTopic === chave);
    const painelAtivo = paineis.find(painel => painel.dataset.previewPanel === chave);
    if (!botaoAtivo || !painelAtivo) return;
    botoes.forEach(botao => {
      const ativo = botao === botaoAtivo;
      botao.setAttribute('aria-selected', String(ativo));
      botao.tabIndex = ativo ? 0 : -1;
    });
    paineis.forEach(painel => {
      painel.hidden = painel !== painelAtivo;
      painel.setAttribute('role', 'tabpanel');
    });
    visitados.add(chave);
    if (progresso) progresso.textContent = visitados.size + ' de ' + botoes.length + ' temas explorados';
    if (preenchimento) preenchimento.style.width = (visitados.size / botoes.length * 100) + '%';
    if (moverFoco) botaoAtivo.focus();
  };
  botoes.forEach((botao, indice) => {
    botao.addEventListener('click', () => selecionar(botao.dataset.previewTopic));
    botao.addEventListener('keydown', evento => {
      let seguinte;
      if (evento.key === 'ArrowRight') seguinte = (indice + 1) % botoes.length;
      else if (evento.key === 'ArrowLeft') seguinte = (indice - 1 + botoes.length) % botoes.length;
      else if (evento.key === 'Home') seguinte = 0;
      else if (evento.key === 'End') seguinte = botoes.length - 1;
      else return;
      evento.preventDefault();
      selecionar(botoes[seguinte].dataset.previewTopic, true);
    });
  });
  selecionar(botoes[0].dataset.previewTopic);
  navegacao.hidden = false;
  if (exploracao) exploracao.hidden = false;
})();
