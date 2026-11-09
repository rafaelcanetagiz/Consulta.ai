"use strict";
// RASCUNHO: textos genéricos a validar com os técnicos do IMAC antes de divulgar.
const N=s=>(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const L=[
[["certidao de dispensa"],"O IMAC reconheceu que a sua atividade, como foi informada, não precisa de licença ambiental.",["Baixe e guarde a certidão","Confira a validade e as condições no próprio documento","Se a atividade mudar, fale com o IMAC antes de continuar"],"concluido"],
[["certidao de regularidade"],"Comprova que o imóvel ou a atividade está regular perante o IMAC, no que foi verificado.",["Guarde uma cópia","Confira a validade no documento"],"concluido"],
[["reposicao florestal"],"Trata da obrigação de compensar a madeira explorada (reposição florestal).",["Leia como e até quando cumprir","Fale com seu responsável técnico","Guarde os comprovantes de cumprimento"],"acao"],
[["notificacao"],"O IMAC está avisando que falta algo ou que algo precisa ser corrigido.",["Leia com atenção e veja o prazo","Reúna e entregue o que foi pedido dentro do prazo","Em caso de dúvida, procure o IMAC ou seu responsável técnico"],"acao"],
[["parecer tecnico","relatorio tecnico"],"Análise de um técnico do IMAC com a conclusão sobre o pedido. Costuma embasar a decisão.",["Veja se a conclusão aponta pendências","Aguarde a decisão do órgão","Atenda as exigências, se houver"],"espera"],
[["laudo de vistoria","relatorio de vistoria","relatorio de visita"],"Registro da visita do técnico ao local.",["Confira se o registro confere com a realidade","Aguarde a análise","Avise o IMAC se algo estiver errado"],"espera"],
[["termo de compromisso"],"Acordo em que você assume obrigações com o IMAC.",["Leia as obrigações e os prazos","Cumpra o combinado e guarde os comprovantes","Guarde uma cópia assinada"],"acao"],
[["autorizacao","licenca"],"O IMAC permitiu a atividade ou o ato descrito, normalmente com condições e prazo.",["Leia as condições e a validade","Cumpra as condições","Veja no documento o prazo para renovar"],"concluido"],
[["recibo eletronico de protocolo"],"Comprovante de que o seu documento foi recebido.",["Guarde o comprovante"],"concluido"],
[["requerimento"],"Pedido formal feito ao IMAC.",["Confira se está completo","Aguarde a análise"],"espera"],
[["oficio"],"Comunicação formal enviada pelo IMAC ou a ele.",["Veja a quem é dirigido e se há prazo","Responda, se for pedido"],"acao"],
[["despacho","memorando","informacao","nota tecnica","termo de abertura","capa do processo"],"Documento interno do órgão que encaminha ou registra o andamento. Em geral, não exige nada de você.",[],"interno"],
[["certidao"],"Declaração oficial do IMAC sobre uma situação.",["Confira seus dados e a validade","Guarde uma cópia"],"concluido"]
];
exports.explicarDocumento=(tipo,titulo)=>{const n=N(tipo+" "+titulo);const h=L.find(e=>e[0].some(k=>n.includes(k)));return h?{significado:h[1],acao:h[2],categoria:h[3]}:null};
const R=[[/recebid[oa] na unidade (.+)/i,"O processo chegou ao setor $1."],[/remetid[oa] pela unidade (.+)/i,"O processo saiu do setor $1 e foi para outro setor."],[/conclus[aã]o do processo na unidade/i,"O setor terminou a sua parte e deixou o processo aguardando o próximo passo."],[/(juntada|incluss[aã]o|documento .*(inclu|assinad))/i,"Um documento foi adicionado ao processo."]];
exports.simplificar=d=>{for(const [re,t] of R){const m=(d||"").match(re);if(m)return d.replace(/^[\s\S]*$/,t.replace("$1",(m[1]||"").trim()))}return ""};
