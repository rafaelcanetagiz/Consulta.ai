"use strict";
// Limite simples por IP (memória da instância; reforço básico, não substitui proteção de borda).
const m=new Map();
module.exports=(k,max=12)=>{const n=Date.now(),a=(m.get(k)||[]).filter(t=>n-t<60000);a.push(n);m.set(k,a);if(m.size>5000)m.clear();return a.length>max};
