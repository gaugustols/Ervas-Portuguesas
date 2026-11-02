# Ervas Portuguesas

Landing page estática com entrada em `index.html`, na raiz. Os recursos da página ficam em `assets/nova-pagina/`: CSS, JavaScript, imagens, fontes locais e suas licenças.

Para servir a versão estática já gerada, não é necessário instalar dependências.
Para alterar o componente React da headline, execute `npm ci`, `npm run typecheck`
e `npm run build`. A estrutura TypeScript/Tailwind, a configuração shadcn/ui e a
demo Remotion estão documentadas em [docs/hook-question.md](docs/hook-question.md).

## Testar localmente

Com Node.js instalado, execute na raiz do projeto:

```powershell
node servidor-local.mjs
```

Abra **http://127.0.0.1:4173**. Para encerrar o servidor, pressione Ctrl+C. Ele serve somente o HTML da raiz e os recursos da página.

Confira a página no desktop e em uma largura móvel, role até ao rodapé e teste as âncoras e os CTAs. Na aba Network do navegador, os recursos locais devem carregar sem erros.

Os botões Básico e PRO da original usam os links Hotmart já configurados. A versão original continua em `/` e `/index.html`. A variante `/teste-ervas.html` é focada no PRO (€14,90): todos os seus CTAs de compra levam à oferta PRO existente; o Básico continua disponível apenas na original. A variante encaminha UTMs e identificadores de atribuição permitidos para o checkout, sem permitir alterar a oferta por parâmetros da URL. Não há distribuição automática de tráfego entre as versões.

`npm run build` gera ambas as páginas e inclui a variante na pasta `public/`. Para atualizar apenas a variante a partir do HTML original, execute `npm run build:test-hero` e `node scripts/export-static.mjs`.

O rastreamento reutiliza o Pixel existente: `CTA_Click`, `Pricing_View` e `Checkout_Click`, com identificação da variante. Um clique não dispara `InitiateCheckout`, pois a LP não consegue confirmar o início no checkout externo. Auditoria, parâmetros, limitações e reprodução dos testes: [relatório de conversão](docs/auditoria-conversao.md).

Estado da publicação de teste, validações atuais e pendências externas: [relatório de homologação](docs/homologacao.md).

## Estrutura

```text
index.html
assets/nova-pagina/
  css/
  js/
  images/
  fonts/
servidor-local.mjs
README.md
```

As pastas de revisão e os scripts da migração foram removidos após a confirmação de que não eram dependências da página ou do servidor principal. As instruções de teste foram reunidas neste README.

## Backup anterior à substituição

O HTML anterior, seus recursos e o manifesto de hashes continuam no backup externo:

```text
C:\Users\User\Desktop\projetos\backups-lowticket-ervas-portuguesas\antes-substituicao-57ab6355-88b9-4f9b-b92a-97b270aea746
```

O backup não faz parte da publicação. A limpeza não altera `.git`, `.gitignore` ou as configurações de conexão com GitHub e Vercel, e não executa commit, push ou deploy.
