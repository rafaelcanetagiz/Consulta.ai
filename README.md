# Consulta AI - SEI

Landing page do Consulta AI: ajuda produtores rurais e responsáveis técnicos a entender documentos, etapas e o andamento dos processos SEI no IMAC (Acre).

## Estado atual
- Página de uma seção (HTML estático, sem build). Mockup de WhatsApp e campo de número do processo.
- O botão "Iniciar conversa no WhatsApp" e a consulta ao SEI **ainda não funcionam** (próximo passo).

## Arquivos
- `index.html`: a página, autocontida (mascote e ícone embutidos).
- `og.jpg`: imagem de pré-visualização ao compartilhar o link.
- `docs/plano-negocio.html`: plano de negócio e plano técnico (simulador). Contém nomes de interlocutores do IMAC: manter o repositório privado.
- `docs/index.src.html`: código-fonte legível da página, com marcadores no lugar das imagens embutidas.

## Deploy
Vercel, automático a cada push na branch principal. Não há etapa de build.

## Pendências
- Ajustar `og:url` e `og:image` em `index.html` para o domínio final do Vercel.
- Integrar o acesso ao SEI do IMAC e o WhatsApp Business.
