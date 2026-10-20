# Botica Viva · Entregável digital

Duas aplicações estáticas autónomas, em português de Portugal:

- `app/index.html`: Plano Básico.
- `pro/index.html`: Plano PRO, incluindo os três materiais adicionais.

Cada pasta inclui os recursos de que precisa e pode ser entregue separadamente. Para abrir diretamente, utilize o respetivo `index.html`. Para pré-visualização por HTTP, a partir da raiz do repositório:

```powershell
node meu-projeto/botica-viva-2026-10-19/servidor-app.mjs
```

Acesso local: <http://127.0.0.1:4174/app/> e <http://127.0.0.1:4174/pro/>.

Em 20/10/2026, o utilizador escolheu publicar o MVP sem login. O build da raiz exporta apenas os ficheiros de produção para `public/app/` e `public/pro/`, no domínio existente da Vercel:

- Básico: <https://ervasportuguesas.vercel.app/app/>.
- PRO: <https://ervasportuguesas.vercel.app/pro/>.
- Obrigado comum para a Hotmart: <https://ervasportuguesas.vercel.app/obrigado.html>.
- Obrigado individual: `/obrigado-basico.html` ou `/obrigado-pro.html`.

Não há conta nem validação de pagamento nesta versão: qualquer pessoa com o link pode abrir o material. As pastas separadas mantêm os conteúdos organizados, sem impedir a partilha dos endereços. O progresso continua guardado apenas no navegador. Para prévia da publicação completa, usar `node servidor-local.mjs` na raiz, em `http://127.0.0.1:4173`.

## Edição

- Texto e oferta: `src/conteudo.mjs` e a configuração de oferta em `scripts/gerar.mjs`.
- Checkout PRO: configurado em `scripts/gerar.mjs` com a oferta real Hotmart `uszcskzv`, apresentada só após o primeiro resultado no Básico.
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
