"use strict";
const {novoDesafio}=require("../lib/sei");
const limite=require("../lib/limite");
module.exports=async(req,res)=>{
  res.setHeader("Cache-Control","no-store");
  const ip=String(req.headers["x-forwarded-for"]||"").split(",")[0];
  if(limite("c"+ip))return res.status(429).json({erro:"limite",mensagem:"Muitas tentativas. Aguarde um minuto."});
  try{res.status(200).json(await novoDesafio())}
  catch(e){res.status(e.codigo==="config"?500:502).json({erro:e.codigo||"falha",mensagem:e.message})}
};
