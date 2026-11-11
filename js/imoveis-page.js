(()=>{
"use strict";
const search=document.getElementById("search"),filter=document.getElementById("filter"),listing=document.getElementById("listing"),count=document.getElementById("count"),empty=document.getElementById("empty-listing");
let items=[];
const clean=v=>String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
function render(){const q=clean(search.value.trim()),type=filter.value;const visible=items.filter(p=>{const text=clean([p.title,p.region,p.type,p.tag,p.description].join(" "));const matchType=!type||(type==="Outro"?!/casa|apartamento/i.test(p.type):clean(p.type).includes(clean(type)));return text.includes(q)&&matchType});listing.replaceChildren();visible.forEach(p=>listing.append(Imoveis.makeCard(p)));count.textContent=visible.length+" apresentaç"+(visible.length===1?"ão":"ões");empty.hidden=visible.length!==0}
Promise.resolve(Imoveis.all()).then(list=>{items=list;render()}).catch(()=>{items=Imoveis.demo;render()});search.addEventListener("input",render);filter.addEventListener("change",render);
})();