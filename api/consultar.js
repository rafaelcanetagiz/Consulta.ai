"use strict";
const {consultar,novoDesafio}=require("../lib/sei");
const limite=require("../lib/limite");
const STATUS={captcha:422,token:422,nao_encontrado:404,config:500};
module.exports=async(req,res)=>{
  res.setHeader("Cache-Control","no-store");
  if(req.method!=="POST")return res.status(405).json({erro:"metodo"});
  const ip=String(req.headers["x-forwarded-for"]||"").split(",")[0];
  if(limite("q"+ip))return res.status(429).json({erro:"limite",mensagem:"Muitas tentativas. Aguarde um minuto."});
  const b=req.body||{},processo=String(b.processo||"").trim(),captcha=String(b.captcha||"").trim();
  if(!/^[0-9.\/-]{6,40}$/.test(processo)||!/^\w{3,12}$/.test(captcha))return res.status(400).json({erro:"dados",mensagem:"Confira o número do processo e as letras da imagem."});
  try{res.status(200).json({ok:true,...await consultar(b.token,processo,captcha)})}
  catch(e){
    const novo=["captcha","token"].includes(e.codigo)?await novoDesafio().catch(()=>null):null;
    res.status(STATUS[e.codigo]||502).json({erro:e.codigo||"falha",mensagem:e.message,novoDesafio:novo});
  }
};
