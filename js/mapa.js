(()=>{
"use strict";
const $=id=>document.getElementById(id);
const states={AC:"Acre",AL:"Alagoas",AP:"Amapá",AM:"Amazonas",BA:"Bahia",CE:"Ceará",DF:"Distrito Federal",ES:"Espírito Santo",GO:"Goiás",MA:"Maranhão",MT:"Mato Grosso",MS:"Mato Grosso do Sul",MG:"Minas Gerais",PA:"Pará",PB:"Paraíba",PR:"Paraná",PE:"Pernambuco",PI:"Piauí",RJ:"Rio de Janeiro",RN:"Rio Grande do Norte",RS:"Rio Grande do Sul",RO:"Rondônia",RR:"Roraima",SC:"Santa Catarina",SP:"São Paulo",SE:"Sergipe",TO:"Tocantins"};
const uf=$("map-state"),search=$("map-query"),result=$("map-results");
for(const [key,value]of Object.entries(states)){const option=document.createElement("option");option.value=key;option.textContent=value+" ("+key+")";uf.append(option)}
const norm=v=>String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
const coords=p=>{const a=Number(p.lat),b=Number(p.lng);return Number.isFinite(a)&&Number.isFinite(b)&&a>=-34&&a<=6&&b>=-74&&b<=-33&&Math.abs(a)>0.001&&Math.abs(b)>0.001?[a,b]:null};
let map,markers,records=[];
if(typeof L==="undefined"){result.textContent="O mapa não carregou. Verifique sua conexão e atualize a página.";return}
map=L.map("brasil-map",{scrollWheelZoom:false,minZoom:3,maxZoom:17}).setView([-14.2,-51.9],4);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19}).addTo(map);
markers=L.layerGroup().addTo(map);
function render(){
 const visible=records.filter(p=>(!uf.value||p.uf===uf.value)&&norm([p.city,p.uf,p.region,p.title].join(" ")).includes(norm(search.value)));
 markers.clearLayers();result.replaceChildren();$("map-count").textContent=visible.length+" "+(visible.length===1?"imóvel":"imóveis");
 const allPoints=[],groups=new Map();
 for(const p of visible){
   const row=document.createElement("article");row.className="map-result";
   const heading=document.createElement("strong");heading.textContent=p.title;
   const where=document.createElement("span");where.textContent=(p.city||"Cidade")+" · "+p.uf;
   const link=document.createElement("a");link.href="imovel.html?id="+encodeURIComponent(p.id);link.textContent="Ver imóvel ↗";
   row.append(heading,where,link);result.append(row);
   const c=coords(p);if(!c)continue;
   const key=c.map(x=>x.toFixed(4)).join(",");allPoints.push(c);
   if(!groups.has(key))groups.set(key,[]);groups.get(key).push(p)
 }
 for(const [key,list]of groups){
   const position=key.split(",").map(Number);
   const dot=L.circleMarker(position,{radius:11,color:"#fff",weight:3,fillColor:"#b99460",fillOpacity:1}).addTo(markers);
   const popup=document.createElement("div");popup.className="map-popup";
   const title=document.createElement("strong");title.textContent=list[0].city+" / "+list[0].uf;popup.append(title);
   for(const p of list){const a=document.createElement("a");a.href="imovel.html?id="+encodeURIComponent(p.id);a.textContent=p.title+" ↗";popup.append(a)}
   dot.bindPopup(popup)
 }
 if(allPoints.length===1)map.setView(allPoints[0],10);
 else if(allPoints.length>1)map.fitBounds(allPoints,{padding:[40,40],maxZoom:11});
 else map.setView([-14.2,-51.9],4);
 if(!visible.length){const p=document.createElement("p");p.className="map-empty";p.textContent=records.length?"Nenhum imóvel encontrado com esses filtros.":"Ainda não existe nenhum imóvel com localização aproximada salvo neste navegador. Cadastre uma casa e marque a cidade no mapa.";result.append(p)}
 $("total-homes").textContent=records.length;
 $("total-states").textContent=new Set(records.map(p=>p.uf).filter(Boolean)).size;
 $("total-cities").textContent=new Set(records.map(p=>(p.uf||"")+"-"+(p.city||""))).size;
}
Imoveis.all().then(data=>{records=data.filter(p=>!p.demo&&coords(p));render()}).catch(()=>{records=[];render()});
uf.addEventListener("change",render);search.addEventListener("input",render);
$("map-reset").addEventListener("click",()=>{uf.value="";search.value="";render()});
})();