# Manual de acesso e utilização

Pedido: manual PDF em português de Portugal para entrega após compra e revisão do produto na Hotmart.

Saída: `output/pdf/botica-viva-manual-de-acesso.pdf`, na raiz do repositório.

## Estado

O utilizador confirmou em 19/10/2026 que o endereço público e o contacto de apoio ainda não estão definidos. O PDF está, por isso, marcado como **versão para revisão**, com ambos os pontos assinalados. Não contém endereços locais, ligações fictícias, credenciais ou afirmações de integração pós-compra já operacional. A criação do documento não garante aprovação pela Hotmart.

## Atualização

Definir `BASIC_ACCESS_URL`, `PRO_ACCESS_URL` e `SUPPORT_CONTACT` em `gerar_manual.py` quando os dados reais existirem. Confirmar o percurso de acesso antes de remover o estado de revisão. Depois, gerar novamente:

```powershell
python meu-projeto/botica-viva-2026-10-19/manual/gerar_manual.py
```

Dependência de geração: `reportlab`. A validação usa `pypdf` para texto, páginas e ligações, e `pymupdf` para renderização. Não são dependências do webapp ou da landing.

Fontes de consulta: documentação oficial Hotmart sobre acesso a compras e contacto do produtor, consultada em 19/10/2026 e ligada no próprio PDF. Os passos de utilização, áreas e limites de armazenamento correspondem ao código atual do webapp. Não foram criados endereços ou regras novas de acesso.

O PDF final é um entregável solicitado; o código e este ficheiro permitem atualizá-lo. Capturas de revisão ficam em pasta temporária e não devem integrar o commit.

## Verificação

Cinco páginas A4 renderizadas e revistas visualmente, sem cortes ou sobreposições. Verificados texto selecionável em PT-PT, numeração, destinos internos, quatro endereços externos HTTPS e ausência de endereços locais. O PDF tem aproximadamente 32 KB, com fontes incorporadas. A pendência de acesso e apoio está indicada na capa, na página de acesso e no rodapé.
