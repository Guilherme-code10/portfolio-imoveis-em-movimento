(()=>{
"use strict";
const $=id=>document.getElementById(id),form=$("property-form");
const field=n=>form.elements[n];
const states={AC:"Acre",AL:"Alagoas",AP:"Amapá",AM:"Amazonas",BA:"Bahia",CE:"Ceará",DF:"Distrito Federal",ES:"Espírito Santo",GO:"Goiás",MA:"Maranhão",MT:"Mato Grosso",MS:"Mato Grosso do Sul",MG:"Minas Gerais",PA:"Pará",PB:"Paraíba",PR:"Paraná",PE:"Pernambuco",PI:"Piauí",RJ:"Rio de Janeiro",RN:"Rio Grande do Norte",RS:"Rio Grande do Sul",RO:"Rondônia",RR:"Roraima",SC:"Santa Catarina",SP:"São Paulo",SE:"Sergipe",TO:"Tocantins"};
for(const [abbr,name]of Object.entries(states)){const opt=document.createElement("option");opt.value=abbr;opt.textContent=name+" ("+abbr+")";field("uf").append(opt)}
const status=$("geo-status"),find=$("find-city");let map=null,marker=null;
const bounds=([lat,lng])=>lat>=-34&&lat<=6&&lng>=-74&&lng<=-33;
function setPosition(pos,zoom=12){const [lat,lng]=pos;if(!bounds(pos)){status.textContent="Escolha um ponto localizado no Brasil.";return}
  field("lat").value=lat.toFixed(2);field("lng").value=lng.toFixed(2);
  if(map){if(marker)marker.setLatLng(pos);else marker=L.circleMarker(pos,{radius:10,fillColor:"#b99460",fillOpacity:1,color:"#fff",weight:3}).addTo(map);map.setView(pos,zoom)}
  status.textContent="Localização aproximada marcada. Você pode clicar em outro ponto do mapa para ajustar."
}
if(typeof L!=="undefined"){
  map=L.map("admin-location-map",{scrollWheelZoom:false,minZoom:3}).setView([-14.2,-51.9],4);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19}).addTo(map);
  map.on("click",e=>setPosition([e.latlng.lat,e.latlng.lng],Math.max(9,map.getZoom())));
}else{status.textContent="O mapa não carregou. Verifique sua conexão. Você poderá salvar o cadastro, mas ele não aparecerá no mapa nacional."}
ImoveisEndereco.setup(form,{message:text=>{status.textContent=text}});
find.addEventListener("click",async()=>{find.disabled=true;status.textContent="Localizando o endereço (ou bairro/cidade, se necessário)...";try{const found=await ImoveisEndereco.geocode(form);setPosition([found.lat,found.lng],12);status.textContent="Localização obtida por "+found.precision+". O marcador público será arredondado para preservar a privacidade. Confira e ajuste no mapa se necessário."}catch(e){status.textContent=(e.message||"Não foi possível localizar o endereço.")+" Você também pode clicar manualmente no mapa."}finally{find.disabled=false}});

function restore(data){if(!map)return;const lat=Number(data?.lat),lng=Number(data?.lng);if(Number.isFinite(lat)&&Number.isFinite(lng)&&Math.abs(lat)>.001&&Math.abs(lng)>.001&&bounds([lat,lng]))setPosition([lat,lng],11)}
function clear(){field("lat").value="";field("lng").value="";if(map){if(marker){marker.remove();marker=null}map.setView([-14.2,-51.9],4)}status.textContent="Localize a cidade ou clique no mapa para marcar uma posição aproximada."}
window.addEventListener("map:restore",event=>restore(event.detail));
window.addEventListener("map:reset",clear);
})();