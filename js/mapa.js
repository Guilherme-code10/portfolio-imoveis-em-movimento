(()=>{
"use strict";
const $=id=>document.getElementById(id);
const states={AC:"Acre",AL:"Alagoas",AP:"Amapá",AM:"Amazonas",BA:"Bahia",CE:"Ceará",DF:"Distrito Federal",ES:"Espírito Santo",GO:"Goiás",MA:"Maranhão",MT:"Mato Grosso",MS:"Mato Grosso do Sul",MG:"Minas Gerais",PA:"Pará",PB:"Paraíba",PR:"Paraná",PE:"Pernambuco",PI:"Piauí",RJ:"Rio de Janeiro",RN:"Rio Grande do Norte",RS:"Rio Grande do Sul",RO:"Rondônia",RR:"Roraima",SC:"Santa Catarina",SP:"São Paulo",SE:"Sergipe",TO:"Tocantins"};
const norm=value=>String(value??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
const money=new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0});
const coordinates=p=>{const lat=Number(p.lat),lng=Number(p.lng);return Number.isFinite(lat)&&Number.isFinite(lng)&&lat>=-34&&lat<=6&&lng>=-74&&lng<=-33&&Math.abs(lat)>.001&&Math.abs(lng)>.001?[lat,lng]:null};
const coordsOf=p=>coordinates(p);
const favoriteKey="imoveis-em-movimento-favoritos-v1";
const favorites=()=>{try{return new Set(JSON.parse(localStorage.getItem(favoriteKey)||"[]"))}catch{return new Set()}};
function toggleFavorite(id){try{const set=favorites();if(set.has(id))set.delete(id);else set.add(id);localStorage.setItem(favoriteKey,JSON.stringify([...set]));render(false)}catch{}}
const state=$("map-state"),search=$("map-query"),sort=$("map-sort"),bedrooms=$("map-bedrooms"),maxPrice=$("map-max-price"),list=$("map-results"),count=$("map-count");
const categoryBtns=[...document.querySelectorAll("[data-category]")];
const selection=$("map-selected"),selectionPhoto=$("map-selected-photo");
const emptyOnMap=$("map-empty");
const countryCenter=[-14.2,-51.9],countryZoom=4;
let category="todos",properties=[],map=null,markerLayer=null,lastVisible=[],selectedPropertyId=null;
const propertyMarkers=new Map();
function updateSelectedMarkers(){
  const uniqueMarkers=new Set(propertyMarkers.values());
  const activeMarker=selectedPropertyId?propertyMarkers.get(selectedPropertyId):null;
  for(const marker of uniqueMarkers){
    const node=marker.getElement();if(!node)continue;
    const isActive=marker===activeMarker;
    node.classList.toggle("is-selected",isActive);
    marker.setZIndexOffset(isActive?1000:0);
  }
}
function clearSelection(){
  selectedPropertyId=null;selection.hidden=true;
  list.querySelectorAll(".dyn-property-card").forEach(card=>card.classList.remove("is-selected"));
  list.querySelectorAll(".dyn-property-select").forEach(button=>button.setAttribute("aria-pressed","false"));
  updateSelectedMarkers();
}
for(const [key,value] of Object.entries(states)){const opt=document.createElement("option");opt.value=key;opt.textContent=value+" · "+key;state.append(opt)}
if(typeof L!=="undefined"){
  map=L.map("brasil-map",{scrollWheelZoom:false,zoomControl:false,minZoom:3,maxZoom:17}).setView(countryCenter,countryZoom);
  L.control.zoom({position:"bottomright"}).addTo(map);
  const mapTiles=L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{
    maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  let loadedOneTile=false,failedTiles=0;
  mapTiles.on("tileload",()=>{loadedOneTile=true;failedTiles=0;const notice=document.getElementById("map-tiles-warning");if(notice)notice.remove()});
  mapTiles.on("tileerror",()=>{failedTiles++;if(!loadedOneTile&&failedTiles>=3&&!document.getElementById("map-tiles-warning")){const notice=document.createElement("div");notice.id="map-tiles-warning";notice.className="dyn-map-warning";notice.textContent="A base cartográfica não carregou. Verifique sua conexão ou tente atualizar esta página.";document.querySelector(".dyn-map-panel").append(notice)}});
  markerLayer=L.layerGroup().addTo(map);
}else{
  const target=$("brasil-map");target.textContent="Não foi possível carregar o mapa. Verifique sua conexão.";target.classList.add("dyn-map-offline")
}
const price=p=>{const n=Number(p.price);return p.price!==undefined&&p.price!==""&&Number.isFinite(n)&&n>0?n:null};
function premium(p){return norm(p.tag).includes("alto padrao")||norm(p.tag).includes("premium")||norm(p.tag).includes("luxo")||(norm(p.purpose)!=="locacao"&&price(p)!==null&&price(p)>=1000000)}
function filtered(){
  const q=norm(search.value);
  const found=properties.filter(p=>{
    if(state.value&&p.uf!==state.value)return false;
    if(Number(bedrooms.value)>0&&Number(p.rooms||0)<Number(bedrooms.value))return false;
    if(Number(maxPrice.value)>0&&(price(p)===null||price(p)>Number(maxPrice.value)))return false;
    if(q&&!norm([p.title,p.city,p.region,p.uf,p.type,p.tag].join(" ")).includes(q))return false;
    if(category==="premium")return premium(p);
    if(category==="favoritos")return favorites().has(p.id);
    if(category==="casa")return norm(p.type).includes("casa");
    if(category==="apartamento")return norm(p.type).includes("apartamento")||norm(p.type).includes("cobertura");
    return true
  });
  if(sort.value==="asc")found.sort((a,b)=>(price(a)??Infinity)-(price(b)??Infinity));
  else if(sort.value==="desc")found.sort((a,b)=>(price(b)??-1)-(price(a)??-1));
  else found.sort((a,b)=>(Number(b.createdAt)||0)-(Number(a.createdAt)||0));
  return found
}
function selectProperty(p,focus=true){
  selectedPropertyId=p.id;
  selection.hidden=false;emptyOnMap.hidden=true;
  $("map-selected-tag").textContent=p.testListing?"FICTÍCIO · TESTE":(p.type||"IMÓVEL").toUpperCase()+" · "+(p.purpose||"CONSULTAR").toUpperCase();
  $("map-selected-title").textContent=p.title;
  $("map-selected-region").textContent=[p.neighborhood||p.region,p.city,p.uf].filter(Boolean).join(" · ");
  $("map-selected-price").textContent=price(p)!==null?money.format(price(p))+(p.testListing?" · SIMULADO":""):"VALOR SOB CONSULTA";
  $("map-selected-link").href="imovel.html?id="+encodeURIComponent(p.id);
  if(p.photos&&p.photos[0]){
    selectionPhoto.hidden=false;selectionPhoto.src=Imoveis.urlOf(p.photos[0]);selectionPhoto.alt=(p.testListing?"Foto ilustrativa para o cadastro fictício ":"Foto de ")+p.title;
    selectionPhoto.onerror=()=>{selectionPhoto.hidden=true}
  }else{selectionPhoto.hidden=true;selectionPhoto.removeAttribute("src")}
  list.querySelectorAll(".dyn-property-card").forEach(card=>{
    const active=card.dataset.id===p.id;
    card.classList.toggle("is-selected",active);
    card.querySelector(".dyn-property-select")?.setAttribute("aria-pressed",String(active));
  });
  updateSelectedMarkers();
  const latlng=coordsOf(p);
  if(map&&latlng&&focus)map.flyTo(latlng,Math.max(map.getZoom(),10),{duration:.8})
}
function propertyCard(p,index){
  const article=document.createElement("article");article.className="dyn-property-card";article.dataset.id=p.id;
  const select=document.createElement("button");select.className="dyn-property-select";select.type="button";select.setAttribute("aria-pressed","false");select.setAttribute("aria-label","Mostrar "+p.title+" no mapa");
  const media=document.createElement("span");media.className="dyn-property-media";
  if(p.photos&&p.photos[0]){
    const image=document.createElement("img");image.loading=index<3?"eager":"lazy";
    image.alt=(p.testListing?"Imagem ilustrativa para o imóvel fictício ":"Imagem do imóvel ")+p.title;image.src=Imoveis.urlOf(p.photos[0]);media.append(image);
  }else{media.textContent="⌂"}
  const chip=document.createElement("span");chip.className="dyn-property-chip";chip.textContent=p.testListing?"FICTÍCIO · TESTE":(p.purpose||"IMÓVEL").toUpperCase();
  media.append(chip);
  const copy=document.createElement("span");copy.className="dyn-property-copy";
  const loc=document.createElement("span");loc.className="dyn-property-region";loc.textContent=(p.neighborhood||p.city||"Bairro")+" / "+(p.city||"Cidade");
  const title=document.createElement("strong");title.className="dyn-property-title";title.textContent=p.title;
  const kind=document.createElement("span");kind.className="dyn-property-kind";kind.textContent=(p.type||"Imóvel")+(p.rooms?" · "+p.rooms+" quartos":"");
  const value=document.createElement("span");value.className="dyn-property-price";value.textContent=price(p)!==null?money.format(price(p))+(p.testListing?" · TESTE":""):"Sob consulta";
  copy.append(loc,title,kind,value);
  select.append(media,copy);select.addEventListener("click",()=>selectProperty(p));
  const details=document.createElement("a");details.className="dyn-property-details";details.href="imovel.html?id="+encodeURIComponent(p.id);details.textContent="VER DETALHES DO IMÓVEL ↗";
  const fav=document.createElement("button");fav.type="button";fav.className="dyn-card-fav";const isFav=favorites().has(p.id);fav.textContent=isFav?"♥ SALVO":"♡ FAVORITAR";fav.setAttribute("aria-pressed",String(isFav));fav.setAttribute("aria-label",(isFav?"Remover dos favoritos: ":"Adicionar aos favoritos: ")+p.title);fav.addEventListener("click",()=>toggleFavorite(p.id));article.append(select,details,fav);return article
}
function render(focus=false){
  const matches=filtered();lastVisible=matches;
  count.textContent=matches.length+" "+(matches.length===1?"IMÓVEL ENCONTRADO":"IMÓVEIS ENCONTRADOS");
  selection.hidden=true;list.replaceChildren();
  propertyMarkers.clear();
  if(markerLayer)markerLayer.clearLayers();
  const groups=new Map(),points=[];
  for(const [index,p] of matches.entries()){
    list.append(propertyCard(p,index));
    const c=coordsOf(p);if(!c)continue;points.push(c);
    const key=c.map(n=>n.toFixed(3)).join(",");
    if(!groups.has(key))groups.set(key,[]);
    groups.get(key).push(p)
  }
  for(const [key,items] of groups){
    if(!map||!markerLayer)break;
    const c=key.split(",").map(Number),many=items.length>1;
    const icon=L.divIcon({className:"dyn-leaflet-marker",html:'<div class="dyn-house-pin"><span aria-hidden="true">'+(many?items.length:"⌂")+'</span></div>',iconSize:[46,52],iconAnchor:[23,45],popupAnchor:[0,-44]});
    const marker=L.marker(c,{icon,title:many?items.length+" imóveis em "+items[0].city:items[0].title+(items[0].testListing?" (fictício)":""),keyboard:true});
    marker.addTo(markerLayer);
    for(const item of items)propertyMarkers.set(item.id,marker);
    marker.on("click",()=>{
      selectProperty(items[0],false);
      if(items.length>1){
        const sub=document.createElement("div");sub.className="dyn-group-popup";
        const h=document.createElement("strong");h.textContent=items.length+" imóveis em "+items[0].city;sub.append(h);
        for(const item of items){const b=document.createElement("button");b.type="button";b.textContent=item.title+" ↗";b.addEventListener("click",()=>{selectProperty(item,false);map.closePopup()});sub.append(b)}
        marker.bindPopup(sub).openPopup()
      }
    })
  }
  if(selectedPropertyId){
    const current=matches.find(item=>item.id===selectedPropertyId);
    if(current)selectProperty(current,false);
    else clearSelection();
  }
  emptyOnMap.hidden=matches.length!==0 || properties.length!==0;
  if(!matches.length){const card=document.createElement("div");card.className="dyn-empty-result";
    const icon=document.createElement("span");icon.textContent="⌂";
    const h=document.createElement("strong");h.textContent=properties.length?"Nenhum imóvel encontrado.":"Ainda não há imóveis no mapa.";
    const p=document.createElement("p");p.textContent=category==="favoritos"?"Clique em FAVORITAR em um imóvel da lista ou salve-o na página de detalhes.":properties.length?"Experimente outra categoria, estado ou busca.":"Cadastre um imóvel e indique sua cidade para ele aparecer aqui. Os anúncios de teste são sempre identificados como fictícios.";
    const a=document.createElement("a");a.href=properties.length?"imoveis.html":"cadastrar.html";a.textContent=properties.length?"VER VITRINE ↗":"CADASTRAR IMÓVEL ↗";
    card.append(icon,h,p,a);list.append(card);
  }
  if(map&&focus){
    if(points.length>1)map.fitBounds(points,{padding:[55,55],maxZoom:13,animate:true});
    else if(points.length===1)map.flyTo(points[0],10,{duration:.6});
    else map.flyTo(countryCenter,countryZoom,{duration:.6})
  }
}
$("map-selected-close").addEventListener("click",clearSelection);
$("map-reset").addEventListener("click",()=>{
  clearSelection();
  state.value="";search.value="";sort.value="recent";bedrooms.value="0";maxPrice.value="0";category="todos";
  categoryBtns.forEach(b=>{const on=b.dataset.category==="todos";b.classList.toggle("is-active",on);b.setAttribute("aria-pressed",String(on))});
  render(false);if(map)map.flyTo(countryCenter,countryZoom,{duration:.6})
});
categoryBtns.forEach(b=>b.addEventListener("click",()=>{category=b.dataset.category;categoryBtns.forEach(x=>{const on=x===b;x.classList.toggle("is-active",on);x.setAttribute("aria-pressed",String(on))});render(true)}));
state.addEventListener("change",()=>render(true));search.addEventListener("input",()=>render(true));sort.addEventListener("change",()=>render(false));bedrooms.addEventListener("change",()=>render(true));maxPrice.addEventListener("change",()=>render(true));
Promise.resolve(Imoveis.all()).then(data=>{
  properties=data.filter(p=>(!p.demo||p.testListing)&&coordsOf(p));
  $("total-homes").textContent=properties.length;
  $("total-states").textContent=new Set(properties.map(p=>p.uf).filter(Boolean)).size;
  $("total-cities").textContent=new Set(properties.map(p=>(p.uf||"")+"|"+(p.city||""))).size;
  render(true);
}).catch(()=>{properties=[];count.textContent="CATÁLOGO INDISPONÍVEL";render(false)});
window.addEventListener("resize",()=>{if(map)map.invalidateSize()});window.addEventListener("storage",e=>{if(e.key===favoriteKey)render(false)});
})();