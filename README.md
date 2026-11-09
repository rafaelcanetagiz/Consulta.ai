# Consulta AI - SEI

Ajuda produtores rurais e responsáveis técnicos a entender documentos, etapas e o andamento dos processos SEI no IMAC (Acre).

## Como funciona
1. A pessoa digita o número do processo e clica em **Consultar meu processo**.
2. `GET /api/captcha`: o servidor abre a Pesquisa Pública do SEI, guarda a sessão num token assinado (5 min) e devolve a imagem de segurança.
3. A pessoa digita as letras (**o captcha é sempre resolvido por um humano; nunca automatizamos isso**).
4. `POST /api/consultar`: o servidor envia o formulário ao SEI, lê o processo e devolve andamento, unidade atual e documentos com explicação em linguagem simples (`lib/explicacoes.js`).
5. Se algo falhar, a página oferece abrir a pesquisa oficial do SEI.

## Configuração no Vercel (obrigatória)
Em Settings > Environment Variables:
- `TOKEN_SECRET`: frase longa e aleatória (assina os tokens).
- `DIAG_KEY` (opcional): habilita `/api/diagnostico?chave=...`, que mostra a estrutura do formulário do SEI.

A região das funções é São Paulo (`gru1`, em `vercel.json`), porque sistemas públicos às vezes bloqueiam IPs de fora do Brasil.

## Limites conhecidos
- **O leitor do SEI nunca rodou contra o site real** (foi escrito sem acesso à rede). Após o deploy, teste com um processo público. Se falhar, abra `/api/diagnostico` e use a saída para ajustar `lib/sei.js`.
- As explicações em `lib/explicacoes.js` são um rascunho genérico: validar com técnicos do IMAC antes de divulgar.
- Obter autorização formal do IMAC (ofício) antes do lançamento e, depois, migrar para o web service oficial do SEI.
- Só dados públicos; nada é gravado. Limite de requisições por IP é básico (em memória).

## Arquivos
- `index.html`, `og.jpg`: página (autocontida) e imagem de compartilhamento.
- `api/`: funções do Vercel. `lib/`: leitor do SEI, token, limite e explicações. `test/smoke.js`: `npm test`.
- `docs/plano-negocio.html`: plano de negócio (contém nomes do IMAC: manter o repositório privado).
- `docs/index.src.html`: fonte legível da página, com marcadores no lugar das imagens.

## Pendências
- WhatsApp Business (ainda não integrado). Mais tipos de documento. Explicações por IA.
