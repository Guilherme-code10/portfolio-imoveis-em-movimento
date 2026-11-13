(()=>{
"use strict";
const photo=(id,w=1400)=>"https://images.unsplash.com/"+id+"?auto=format&fit=crop&w="+w+"&q=82";
const propertyDemo=[
{id:"aurora",demo:true,title:"Residência Aurora",type:"Casa contemporânea",region:"Conceito residencial",tag:"ARQUITETURA CONTEMPORÂNEA",description:"Um exercício visual de apresentação imobiliária com linhas contemporâneas, luz natural e espaços amplos. As imagens são ilustrativas e não representam um imóvel à venda.",rooms:"3",baths:"3",area:"—",parking:"2",photos:[photo("photo-1600585154340-be6161a56a0c"),photo("photo-1600607687939-ce8a6c25118c"),photo("photo-1600566753086-00f18fb6b3ea")]},
{id:"essenza",demo:true,title:"Residência Essenza",type:"Apartamento premium",region:"Conceito de interiores",tag:"AMBIENTES E DETALHES",description:"Demonstração de como apresentar ambientes internos em uma sequência envolvente, destacando materiais, espaços e luminosidade. Imagens de referência, sem relação com um imóvel disponível.",rooms:"2",baths:"2",area:"—",parking:"1",photos:[photo("photo-1600607687939-ce8a6c25118c"),photo("photo-1600566753086-00f18fb6b3ea"),photo("photo-1600576752355-35792bedcfea")]},
{id:"bosque",demo:true,title:"Casa Bosque",type:"Casa com jardim",region:"Conceito de paisagismo",tag:"EXTERIOR E ARQUITETURA",description:"Um roteiro de apresentação visual que conecta ambientes externos e internos a partir de fotografias, com movimentos discretos. Todas as imagens são ilustrativas.",rooms:"4",baths:"3",area:"—",parking:"2",photos:[photo("photo-1600566753190-17f0baa2a6c3"),photo("photo-1600585152915-d208bec867a1"),photo("photo-1600607687920-4e2a09cf159d")]}
];
const guarulhosTests=[
  {
    "id": "teste-maia",
    "demo": true,
    "testListing": true,
    "title": "Residência Jardim Maia",
    "type": "Casa",
    "region": "Jardim Maia, Guarulhos/SP",
    "city": "Guarulhos",
    "uf": "SP",
    "neighborhood": "Jardim Maia",
    "lat": "-23.454",
    "lng": "-46.531",
    "purpose": "Venda",
    "price": "1850000",
    "rooms": "4",
    "baths": "4",
    "parking": "3",
    "area": "285",
    "tag": "ALTO PADRÃO",
    "description": "Casa espaçosa com jardim, área gourmet e suítes. Anúncio inteiramente fictício criado para simular a experiência de navegação no mapa. Fotos meramente ilustrativas; o marcador indica somente uma área aproximada do bairro. NÃO É UM IMÓVEL REAL À VENDA.",
    "photos": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=82"
    ],
    "createdAt": 1794582000000
  },
  {
    "id": "teste-centro",
    "demo": true,
    "testListing": true,
    "title": "Apartamento Praça Central",
    "type": "Apartamento",
    "region": "Centro, Guarulhos/SP",
    "city": "Guarulhos",
    "uf": "SP",
    "neighborhood": "Centro",
    "lat": "-23.462",
    "lng": "-46.535",
    "purpose": "Venda",
    "price": "495000",
    "rooms": "2",
    "baths": "2",
    "parking": "1",
    "area": "74",
    "tag": "APARTAMENTO URBANO",
    "description": "Apartamento moderno próximo à região central, com varanda e espaço integrado. Dados e fotografia meramente ilustrativos. Fotos meramente ilustrativas; o marcador indica somente uma área aproximada do bairro. NÃO É UM IMÓVEL REAL À VENDA.",
    "photos": [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=82"
    ],
    "createdAt": 1794578400000
  },
  {
    "id": "teste-vila-augusta",
    "demo": true,
    "testListing": true,
    "title": "Loft Vila Augusta",
    "type": "Apartamento",
    "region": "Vila Augusta, Guarulhos/SP",
    "city": "Guarulhos",
    "uf": "SP",
    "neighborhood": "Vila Augusta",
    "lat": "-23.474",
    "lng": "-46.550",
    "purpose": "Venda",
    "price": "580000",
    "rooms": "1",
    "baths": "1",
    "parking": "1",
    "area": "62",
    "tag": "LOFT CONTEMPORÂNEO",
    "description": "Loft de conceito aberto e acabamento contemporâneo. Este imóvel não existe: foi criado exclusivamente para testes do portfólio. Fotos meramente ilustrativas; o marcador indica somente uma área aproximada do bairro. NÃO É UM IMÓVEL REAL À VENDA.",
    "photos": [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=82"
    ],
    "createdAt": 1794574800000
  },
  {
    "id": "teste-bom-clima",
    "demo": true,
    "testListing": true,
    "title": "Casa Jardim do Bom Clima",
    "type": "Casa",
    "region": "Bom Clima, Guarulhos/SP",
    "city": "Guarulhos",
    "uf": "SP",
    "neighborhood": "Bom Clima",
    "lat": "-23.457",
    "lng": "-46.516",
    "purpose": "Venda",
    "price": "790000",
    "rooms": "3",
    "baths": "2",
    "parking": "2",
    "area": "160",
    "tag": "CASA FAMILIAR",
    "description": "Casa fictícia com quintal, sala iluminada e três dormitórios em bairro residencial. Localização aproximada e valor simulado. Fotos meramente ilustrativas; o marcador indica somente uma área aproximada do bairro. NÃO É UM IMÓVEL REAL À VENDA.",
    "photos": [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=82"
    ],
    "createdAt": 1794571200000
  },
  {
    "id": "teste-macedo",
    "demo": true,
    "testListing": true,
    "title": "Sobrado Macedo",
    "type": "Casa",
    "region": "Macedo, Guarulhos/SP",
    "city": "Guarulhos",
    "uf": "SP",
    "neighborhood": "Macedo",
    "lat": "-23.471",
    "lng": "-46.520",
    "purpose": "Venda",
    "price": "940000",
    "rooms": "3",
    "baths": "3",
    "parking": "2",
    "area": "190",
    "tag": "SOBRADO",
    "description": "Sobrado ilustrativo com três dormitórios e garagem, projetado somente como exemplo de cadastro no mapa. Fotos meramente ilustrativas; o marcador indica somente uma área aproximada do bairro. NÃO É UM IMÓVEL REAL À VENDA.",
    "photos": [
      "https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=1400&q=82"
    ],
    "createdAt": 1794567600000
  },
  {
    "id": "teste-picanco",
    "demo": true,
    "testListing": true,
    "title": "Cobertura Vista Picanço",
    "type": "Cobertura",
    "region": "Picanço, Guarulhos/SP",
    "city": "Guarulhos",
    "uf": "SP",
    "neighborhood": "Picanço",
    "lat": "-23.442",
    "lng": "-46.552",
    "purpose": "Venda",
    "price": "1280000",
    "rooms": "3",
    "baths": "3",
    "parking": "2",
    "area": "180",
    "tag": "ALTO PADRÃO",
    "description": "Cobertura fictícia com terraço e vista aberta. Todas as características e o preço são simulados. Fotos meramente ilustrativas; o marcador indica somente uma área aproximada do bairro. NÃO É UM IMÓVEL REAL À VENDA.",
    "photos": [
      "https://images.unsplash.com/photo-1600576752355-35792bedcfea?auto=format&fit=crop&w=1400&q=82"
    ],
    "createdAt": 1794564000000
  },
  {
    "id": "teste-vila-galvao",
    "demo": true,
    "testListing": true,
    "title": "Casa Vila Galvão",
    "type": "Casa",
    "region": "Vila Galvão, Guarulhos/SP",
    "city": "Guarulhos",
    "uf": "SP",
    "neighborhood": "Vila Galvão",
    "lat": "-23.447",
    "lng": "-46.571",
    "purpose": "Venda",
    "price": "665000",
    "rooms": "3",
    "baths": "2",
    "parking": "2",
    "area": "145",
    "tag": "CASA COM JARDIM",
    "description": "Casa térrea ilustrativa com jardim, três quartos e área externa. Não corresponde a um endereço ou anúncio real. Fotos meramente ilustrativas; o marcador indica somente uma área aproximada do bairro. NÃO É UM IMÓVEL REAL À VENDA.",
    "photos": [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=82"
    ],
    "createdAt": 1794560400000
  },
  {
    "id": "teste-ponte-grande",
    "demo": true,
    "testListing": true,
    "title": "Residencial Ponte Grande",
    "type": "Apartamento",
    "region": "Ponte Grande, Guarulhos/SP",
    "city": "Guarulhos",
    "uf": "SP",
    "neighborhood": "Ponte Grande",
    "lat": "-23.494",
    "lng": "-46.553",
    "purpose": "Venda",
    "price": "425000",
    "rooms": "2",
    "baths": "1",
    "parking": "1",
    "area": "59",
    "tag": "PRIMEIRO IMÓVEL",
    "description": "Apartamento fictício com dois dormitórios. Não se confunde com o imóvel real da Cabral: é somente um exemplo para testar filtros e localização. Fotos meramente ilustrativas; o marcador indica somente uma área aproximada do bairro. NÃO É UM IMÓVEL REAL À VENDA.",
    "photos": [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=82"
    ],
    "createdAt": 1794556800000
  }
];
const DB="imoveis-em-movimento-v1",STORE="cadastros";
function openDb(){return new Promise((resolve,reject)=>{if(!indexedDB){reject(Error("Navegador não suporta armazenamento local."));return}const req=indexedDB.open(DB,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE,{keyPath:"id"})};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
async function query(method,record){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,method==="get"||method==="getAll"?"readonly":"readwrite");const s=tx.objectStore(STORE);const req=method==="getAll"?s.getAll():method==="get"?s.get(record):method==="put"?s.put(record):s.delete(record);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);tx.oncomplete=()=>db.close();tx.onerror=()=>reject(tx.error)})}
const blobUrls=new Set();
function urlOf(v){if(typeof v==="string")return v;const u=URL.createObjectURL(v);blobUrls.add(u);return u}
window.addEventListener("pagehide",()=>{blobUrls.forEach(x=>URL.revokeObjectURL(x));blobUrls.clear()});
function onlineItem(p){return {...p,online:true,demo:false,status:"published",tag:"PUBLICADO",region:[p.neighborhood,p.city+"/"+p.uf].filter(Boolean).join(", "),createdAt:Date.parse(p.updatedAt)||0,photos:Array.isArray(p.photos)?p.photos:[]}}
async function publicOnline(){
 try{const response=await fetch("/api/properties?limit=100",{cache:"no-store"});if(!response.ok)return [];const payload=await response.json();return Array.isArray(payload.items)?payload.items.filter(p=>Array.isArray(p.photos)&&p.photos.length>0).map(onlineItem):[]}catch{return []}
}
async function all(){
 const [custom,online]=await Promise.all([query("getAll").catch(()=>[]),publicOnline()]);
 const remoteIds=new Set(online.map(p=>p.id));
 return [...online,...custom.filter(p=>!remoteIds.has(p.id)).sort((a,b)=>b.createdAt-a.createdAt),...guarulhosTests,...propertyDemo]
}
async function find(id){
 const example=[...guarulhosTests,...propertyDemo].find(x=>x.id===id);if(example)return example;
 const local=await query("get",id).catch(()=>null);if(local)return local;
 try{const r=await fetch("/api/properties?id="+encodeURIComponent(id),{cache:"no-store"});if(!r.ok)return null;const payload=await r.json();return payload.item?onlineItem(payload.item):null}catch{return null}
}
function makeCard(p){const a=document.createElement("a");a.className="listing-card";a.href="imovel.html?id="+encodeURIComponent(p.id);a.innerHTML='<div class="listing-photo"><img alt="" loading="lazy"><span class="listing-chip"></span><span class="listing-icon" aria-hidden="true">↗</span></div><div class="listing-content"><div class="listing-eyebrow"></div><h3></h3><p></p><div class="listing-bottom"><span class="listing-type"></span><span>Ver detalhes ↗</span></div></div>';a.querySelector("img").src=urlOf(p.photos[0]);a.querySelector("img").alt=p.title;a.querySelector(".listing-chip").textContent=p.testListing?"FICTÍCIO · TESTE":p.online?"PUBLICADO":p.demo?"DEMONSTRAÇÃO":"CADASTRO LOCAL";a.querySelector(".listing-eyebrow").textContent=p.tag||"IMÓVEL CADASTRADO";a.querySelector("h3").textContent=p.title;a.querySelector("p").textContent=p.region||"Localização não informada";a.querySelector(".listing-type").textContent=(p.type||"Imóvel")+(p.purpose&&(!p.demo||p.testListing)?" · "+p.purpose:"");if(p.price&&(!p.demo||p.testListing)){const price=document.createElement("strong");price.className="listing-price";price.textContent=Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0}).format(Number(p.price));a.querySelector(".listing-content>p").append(" · ",price,p.testListing?" (valor fictício)":"")}return a}
window.Imoveis={demo:[...guarulhosTests,...propertyDemo],test:guarulhosTests,all,find,save:p=>query("put",p),remove:id=>query("delete",id),urlOf,makeCard};
})();