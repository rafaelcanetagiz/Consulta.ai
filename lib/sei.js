"use strict";
const {text,attr,links,tables,forms,imgs}=require("./html");
const {sign,verify}=require("./token");
const {explicarDocumento,simplificar}=require("./explicacoes");
const HOST="app.sei.ac.gov.br",BASE="https://"+HOST;
const FORM=BASE+"/sei/modulos/pesquisa/md_pesq_processo_pesquisar.php?acao_externa=protocolo_pesquisar&acao_origem_externa=protocolo_pesquisar&id_orgao_acesso_externo=0";
const UA="ConsultaAI/0.1 (consulta publica; consultaai-two.vercel.app)";
const erro=(codigo,mensagem)=>Object.assign(new Error(mensagem),{codigo});
const abs=(u,b)=>{const x=new URL(u,b);if(x.protocol!=="https:"||x.hostname!==HOST)throw erro("url_invalida","Endereço fora do SEI.");return x.href};
const safe=(u,b)=>{try{return abs(u,b)}catch{return ""}};
function jar(h,c){for(const s of(h.getSetCookie?h.getSetCookie():[])){const kv=s.split(";")[0],i=kv.indexOf("=");if(i>0)c[kv.slice(0,i).trim()]=kv.slice(i+1)}}
const ck=c=>Object.entries(c).map(([k,v])=>k+"="+v).join("; ");
async function req(url,{method="GET",body,cookies={},referer}={}){
  let u=abs(url,BASE);
  for(let i=0;i<4;i++){
    const r=await fetch(u,{method,redirect:"manual",body,signal:AbortSignal.timeout(12000),headers:{"user-agent":UA,"accept-language":"pt-BR,pt;q=0.9",cookie:ck(cookies),...(referer?{referer}:{}),...(method==="POST"?{"content-type":"application/x-www-form-urlencoded",origin:BASE}:{})}});
    jar(r.headers,cookies);
    const loc=r.headers.get("location");
    if(r.status>=300&&r.status<400&&loc){u=abs(loc,u);method="GET";body=undefined;continue}
    const buf=Buffer.from(await r.arrayBuffer()),ct=r.headers.get("content-type")||"";
    let html="";if(/text|html/i.test(ct)){const cs=(ct.match(/charset=([\w-]+)/i)||[])[1]||"iso-8859-1";try{html=new TextDecoder(cs).decode(buf)}catch{html=buf.toString("latin1")}}
    return {status:r.status,url:u,html,buf,ct};
  }
  throw erro("redirecionamentos","O SEI redirecionou demais.");
}
async function novoDesafio(){
  const cookies={},p=await req(FORM,{cookies});
  if(p.status!==200)throw erro("sei_indisponivel","O SEI não respondeu (código "+p.status+").");
  const fs=forms(p.html),f=fs.find(x=>x.inputs.some(i=>/captcha|protocolo/i.test(i.name)))||fs[0];
  const img=imgs(p.html).find(s=>/captcha/i.test(s)&&!/audio/i.test(s));
  if(!f||!img)throw erro("formulario_inesperado","Não encontrei o formulário ou o captcha do SEI.");
  const c=await req(img,{cookies,referer:FORM}),campos={};let proto="txtProtocoloPesquisa",cap="txtCaptcha";
  for(const i of f.inputs){if(!i.name)continue;
    if(/captcha/i.test(i.name)&&i.type==="text")cap=i.name;
    else if(/protocolo/i.test(i.name)&&i.type==="text")proto=i.name;
    else if(i.type==="hidden")campos[i.name]=i.value;
    else if(i.type==="checkbox"&&/sinprocessos/i.test(i.name))campos[i.name]=i.value||"P";
    else if(i.type==="text")campos[i.name]="";}
  return {token:sign({c:cookies,a:abs(f.action||FORM,FORM),f:campos,p:proto,k:cap,t:Date.now()}),imagem:"data:"+(c.ct.split(";")[0]||"image/png")+";base64,"+c.buf.toString("base64")};
}
const ts=s=>{const m=(s||"").match(/(\d\d)\/(\d\d)\/(\d{4})(?:\D+(\d\d):(\d\d))?/);return m?Date.UTC(+m[3],m[2]-1,+m[1],+(m[4]||0),+(m[5]||0)):0};
function parseProcesso(html,base=FORM){
  const cab={},andamentos=[],documentos=[],ix=(h,re)=>h.findIndex(x=>re.test(x));
  for(const rows of tables(html)){
    const hd=rows[0].map(c=>c.text.toLowerCase());
    if(rows.every(r=>r.length===2&&/:$/.test(r[0].text)))rows.forEach(r=>{cab[r[0].text.replace(/:$/,"").toLowerCase()]=r[1].text});
    const iu=ix(hd,/unidade/),id=ix(hd,/data/),ic=ix(hd,/descri/),ip=ix(hd,/documento|protocolo/),it=ix(hd,/tipo/);
    if(iu>=0&&id>=0&&ic>=0&&!andamentos.length)rows.slice(1).forEach(r=>r[ic]&&andamentos.push({data:r[id]?.text||"",unidade:r[iu]?.text||"",descricao:r[ic].text,simples:simplificar(r[ic].text)}));
    if(ip>=0&&it>=0&&id>=0&&!documentos.length)rows.slice(1).forEach(r=>r[ip]&&documentos.push({numero:r[ip].text,tipo:r[it]?.text||"",data:r[id]?.text||"",link:r[ip].links[0]?safe(r[ip].links[0].href,base):"",explicacao:explicarDocumento(r[it]?.text||"",r[ip].text)}));
  }
  andamentos.sort((a,b)=>ts(b.data)-ts(a.data));
  const a=andamentos[0];
  return {cabecalho:cab,andamentos,documentos,onde:a?{unidade:a.unidade,data:a.data,simples:a.simples}:null,textoBruto:andamentos.length||documentos.length?undefined:text(html).slice(0,3000)};
}
async function consultar(token,processo,captcha){
  const d=verify(token,5*60*1000);if(!d)throw erro("token","A imagem expirou. Vou gerar outra.");
  const r=await req(d.a,{method:"POST",cookies:d.c,referer:FORM,body:new URLSearchParams({...d.f,[d.p]:processo,[d.k]:captcha}).toString()});
  const t=text(r.html),lk=links(r.html).find(l=>/processo_exibir|processo_visualizar/i.test(l.href));
  if(!lk){
    if(/(c[oó]digo|captcha|confirma)/i.test(t)&&/(inv[aá]lid|incorret|errad)/i.test(t))throw erro("captcha","As letras não conferem. Tente de novo.");
    if(/(nenhum|n[aã]o (foi )?(encontrad|localizad))/i.test(t))throw erro("nao_encontrado","Não encontrei esse processo na pesquisa pública. Confira o número; ele também pode ser restrito.");
    throw erro("resposta_inesperada","O SEI respondeu em um formato que ainda não conheço.");
  }
  const p=await req(lk.href,{cookies:d.c,referer:d.a});
  return {numero:lk.text||processo,link:p.url,...parseProcesso(p.html,p.url)};
}
async function diagnostico(){
  const p=await req(FORM,{cookies:{}});
  return {status:p.status,forms:forms(p.html),imagens:imgs(p.html),tabelas:tables(p.html).length,trecho:text(p.html).slice(0,500)};
}
module.exports={novoDesafio,consultar,diagnostico,parseProcesso};
