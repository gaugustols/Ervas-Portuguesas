# Botica Viva · Entregável digital

Duas aplicações estáticas autónomas, em português de Portugal:

- `app/index.html`: Plano Básico.
- `pro/index.html`: Plano PRO, incluindo os três materiais adicionais.

Cada pasta inclui os recursos de que precisa e pode ser entregue separadamente. Para abrir diretamente, utilize o respetivo `index.html`. Para pré-visualização por HTTP, a partir da raiz do repositório:

```powershell
node meu-projeto/botica-viva-2026-10-19/servidor-app.mjs
```

Acesso local: <http://127.0.0.1:4174/app/> e <http://127.0.0.1:4174/pro/>.

Não há conta nem validação de pagamento nesta versão. A distribuição deve ser feita pela plataforma de entrega escolhida pelo vendedor. Não publicar as duas pastas abertamente se pretender restringir materiais por plano. A exportação Vercel atual da landing page não as inclui.

## Edição

- Texto e oferta: `src/conteudo.mjs` e a configuração de oferta em `scripts/gerar.mjs`.
- Checkout: substituir `#PLACEHOLDER-CHECKOUT-PRO` por um URL HTTPS real em `scripts/gerar.mjs`. Até lá o botão permanece desativado.
- Interface: `src/template.html`, `src/styles.css`, `src/app.js`.
- Fotografias e licenças: `media/creditos.json`, autor e ligação exibidos em cada ficha e em Fontes.

Depois de editar, gerar novamente as duas versões:

```powershell
node meu-projeto/botica-viva-2026-10-19/scripts/gerar.mjs
```

Não é necessário descarregar fotografias novamente: as imagens selecionadas já estão incluídas. `scripts/fotografias.mjs` documenta a aquisição e respeita limites de pedidos.

## Dados e conteúdo

Progresso, favoritos e fichas ficam no navegador/dispositivo, separadamente por plano. Há exportação JSON e descarga de fichas em texto. Não há importação, sincronização entre dispositivos ou transferência automática do Básico para o PRO. Limpar os dados do navegador pode eliminar os registos. Não introduzir dados clínicos pessoais.

Conteúdo educativo original para adultos, com fontes de consulta. Não é prescrição ou identificação botânica suficiente para colheita. Antes de comercializar o novo conteúdo, realizar revisão editorial e profissional das alegações de saúde da oferta e do material. Os testes técnicos não constituem validação clínica. Ver `02-OFERTA.md` e `08-WEBAPP.md`.
