"use strict";
// Mostra a estrutura do formulário do SEI para ajustar o leitor. Ative com DIAG_KEY e acesse /api/diagnostico?chave=SUA_CHAVE
const {diagnostico}=require("../lib/sei");
module.exports=async(req,res)=>{
  res.setHeader("Cache-Control","no-store");
  if(!process.env.DIAG_KEY||req.query.chave!==process.env.DIAG_KEY)return res.status(404).end();
  try{res.status(200).json(await diagnostico())}catch(e){res.status(502).json({erro:e.message})}
};
