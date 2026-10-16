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

Confira a página no desktop e em uma largura móvel, role até o rodapé para carregar todas as imagens e teste as âncoras e o CTA fixo. Na aba Network do navegador, CSS, JavaScript, imagens e fontes devem carregar sem erros.

Os links de checkout, atendimento, termos e privacidade mantêm o estado desativado da versão atual. O CTA móvel leva à seção da oferta.

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
