# Manual de acesso e utilização

Pedido: manual PDF em português de Portugal para entrega após compra e revisão do produto na Hotmart.

Saída: `output/pdf/botica-viva-manual-de-acesso.pdf`, na raiz do repositório.

## Estado

Atualizado em 23/10/2026 com as ligações públicas reais dos planos Básico/PRO, 38 plantas, «O meu percurso», acesso vitalício e garantia de 7 dias. O utilizador confirmou que o apoio ainda não está definido. O PDF continua marcado como **versão para revisão** até configurar o contacto e testar compra/entrega. Não contém endereços locais, credenciais ou afirmações de integração pós-compra já operacional. A criação do documento não garante aprovação pela Hotmart.

## Atualização

`BASIC_ACCESS_URL` e `PRO_ACCESS_URL` já usam os endereços publicados. Definir `SUPPORT_CONTACT` quando existir um canal real e confirmar o percurso de acesso antes de remover o estado de revisão. Depois, gerar novamente:

```powershell
python meu-projeto/botica-viva-2026-10-19/manual/gerar_manual.py
```

Dependência de geração: `reportlab`. A validação usa `pypdf` para texto, páginas e ligações, e `pymupdf` para renderização. Não são dependências do webapp ou da landing.

Fontes de consulta: ajuda oficial Hotmart sobre acesso e contacto do produtor, ligada no PDF. Os passos, nomes das áreas e limites de armazenamento correspondem ao código atual do webapp. As condições de acesso vitalício e garantia foram confirmadas pelo utilizador; a garantia de 7 dias também consta nos checkouts públicos.

O PDF final é um entregável solicitado; o código e este ficheiro permitem atualizá-lo. Capturas de revisão ficam em pasta temporária e não devem integrar o commit.

## Verificação

Cinco páginas A4 renderizadas e revistas visualmente em 23/10/2026, sem cortes ou sobreposições. Verificados texto selecionável em PT-PT, numeração, destinos internos, seis endereços externos HTTPS, quantidades e ausência de endereços locais. PDF com aproximadamente 32 KB e fontes incorporadas. A pendência de apoio está indicada na capa, na página de apoio e no rodapé. O percurso de compra/entrega continua por testar.
