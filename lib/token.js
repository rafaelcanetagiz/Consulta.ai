"use strict";
const c=require("crypto");
const sec=()=>{const s=process.env.TOKEN_SECRET;if(!s||s.length<16)throw Object.assign(new Error("Configure a variável TOKEN_SECRET no Vercel (16+ caracteres)."),{codigo:"config"});return s};
const mac=p=>c.createHmac("sha256",sec()).update(p).digest("base64url");
exports.sign=o=>{const p=Buffer.from(JSON.stringify(o)).toString("base64url");return p+"."+mac(p)};
exports.verify=(tk,ttl)=>{if(typeof tk!=="string")return null;const [p,s]=tk.split(".");if(!p||!s)return null;const e=mac(p);if(e.length!==s.length||!c.timingSafeEqual(Buffer.from(e),Buffer.from(s)))return null;try{const o=JSON.parse(Buffer.from(p,"base64url"));return Date.now()-o.t<ttl?o:null}catch{return null}};
