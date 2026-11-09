"use strict";
// Utilitários mínimos de HTML (sem dependências), suficientes para as páginas em tabelas do SEI.
const E={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:" ",aacute:"á",eacute:"é",iacute:"í",oacute:"ó",uacute:"ú",acirc:"â",ecirc:"ê",ocirc:"ô",atilde:"ã",otilde:"õ",ccedil:"ç",agrave:"à",Aacute:"Á",Eacute:"É",Iacute:"Í",Oacute:"Ó",Uacute:"Ú",Atilde:"Ã",Ccedil:"Ç",ordm:"º",ordf:"ª"};
const dec=s=>s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi,(m,e)=>{if(e[0]==="#"){const n=/^#x/i.test(e)?parseInt(e.slice(2),16):parseInt(e.slice(1),10);return n>0&&n<1114112?String.fromCodePoint(n):m}return E[e]??m});
const text=h=>dec(h.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi," ").replace(/<br\s*\/?>/gi," ").replace(/<[^>]+>/g," ")).replace(/\s+/g," ").trim();
const attr=(tag,n)=>{const m=tag.match(new RegExp("\\b"+n+"\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s>]+))","i"));return m?dec(m[1]??m[2]??m[3]):""};
const links=h=>[...h.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map(m=>({href:attr(m[1],"href"),text:text(m[2])})).filter(l=>l.href);
function tables(h){const out=[];for(const t of h.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi)){const rows=[];for(const r of t[1].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)){const cells=[...r[1].matchAll(/<t([dh])\b[^>]*>([\s\S]*?)<\/t\1>/gi)].map(c=>({text:text(c[2]),links:links(c[2])}));if(cells.length)rows.push(cells)}if(rows.length)out.push(rows)}return out}
const forms=h=>[...h.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi)].map(f=>({action:attr(f[1],"action"),inputs:[...f[2].matchAll(/<input\b[^>]*>/gi)].map(i=>({name:attr(i[0],"name"),type:(attr(i[0],"type")||"text").toLowerCase(),value:attr(i[0],"value")}))}));
const imgs=h=>[...h.matchAll(/<img\b[^>]*>/gi)].map(m=>attr(m[0],"src")).filter(Boolean);
module.exports={dec,text,attr,links,tables,forms,imgs};
