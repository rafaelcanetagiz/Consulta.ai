"use strict";
process.env.TOKEN_SECRET="segredo-de-teste-0123456789";
const assert=require("assert"),{sign,verify}=require("../lib/token"),{parseProcesso}=require("../lib/sei"),{explicarDocumento}=require("../lib/explicacoes");
const t=sign({a:1,t:Date.now()});assert(verify(t,1000)&&!verify(t+"x",1000)&&!verify(t,-1));
const html=`<table><tr><td>Processo:</td><td>0001.000123.00045/2026-17</td></tr><tr><td>Tipo:</td><td>Licenciamento Ambiental</td></tr></table>
<table><tr><th>Documento</th><th>Tipo</th><th>Data</th></tr><tr><td><a href="/sei/modulos/pesquisa/md_pesq_documento_consulta_externa.php?x=1">Certidão 1 (0009)</a></td><td>Certidão</td><td>02/11/2026</td></tr></table>
<table><tr><th>Data/Hora</th><th>Unidade</th><th>Descrição</th></tr><tr><td>01/11/2026 09:00</td><td>IMAC/DILIC</td><td>Processo recebido na unidade IMAC/DILIC</td></tr><tr><td>03/11/2026 10:00</td><td>IMAC/DIJUR</td><td>Processo recebido na unidade IMAC/DIJUR</td></tr></table>`;
const r=parseProcesso(html);
assert.equal(r.cabecalho.tipo,"Licenciamento Ambiental");assert.equal(r.onde.unidade,"IMAC/DIJUR");assert.match(r.onde.simples,/chegou ao setor IMAC\/DIJUR/);
assert.equal(r.documentos.length,1);assert(r.documentos[0].link.startsWith("https://app.sei.ac.gov.br/"));assert.equal(r.documentos[0].explicacao.categoria,"concluido");
assert.equal(explicarDocumento("Certidão","Certidão de Dispensa de Licenciamento Ambiental").categoria,"concluido");
console.log("ok: token, leitor de processo e explicações");
