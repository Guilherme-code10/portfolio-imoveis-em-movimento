(()=>{
"use strict";
const $=id=>document.getElementById(id),loading=$("detail-loading"),section=$("detail");let urls=[];
const id=new URLSearchParams(location.search).get("id")||"aurora";
Promise.resolve(Imoveis.find(id)).then(p=>{if(!p){loading.textContent="Imóvel não encontrado neste navegador. Confira o endereço ou volte à vitrine.";return}
section.hidden=false;loading.hidden=true;document.title=p.title+" | Imóveis em Movimento";$("detail-title").textContent=p.title;$("detail-region").textContent=p.region||"Apresentação do imóvel";$("detail-tag").textContent=p.tag||"IMÓVEL CADASTRADO";$("detail-status").textContent=p.demo?"DEMONSTRAÇÃO — NÃO ESTÁ À VENDA":"CADASTRO LOCAL — NÃO PUBLICADO ONLINE";$("detail-description").textContent=p.description||"Sem descrição cadastrada.";
const srcOf=v=>{const u=Imoveis.urlOf(v);urls.push(u);return u};$("detail-cover").src=srcOf(p.photos[0]);$("detail-cover").alt="Fotografia principal de "+p.title;
const stats=$("detail-stats");stats.replaceChildren();[["TIPO",p.type],["ÁREA",p.area&&p.area!=="—"?p.area+" m²":"Não informada"],["QUARTOS",p.rooms||"—"],["BANHEIROS",p.baths||"—"],["VAGAS",p.parking||"—"]].forEach(([a,b])=>{const d=document.createElement("div"),small=document.createElement("span"),strong=document.createElement("strong");small.textContent=a;strong.textContent=b||"—";d.append(small,strong);stats.append(d)});
const gallery=$("detail-gallery");gallery.replaceChildren();p.photos.forEach((f,i)=>{const pic=document.createElement("img");pic.src=srcOf(f);pic.alt="Foto "+(i+1)+" de "+p.title;pic.loading=i?"lazy":"eager";gallery.append(pic)});
}).catch(()=>{loading.textContent="Não foi possível abrir esse cadastro neste dispositivo."});
})();