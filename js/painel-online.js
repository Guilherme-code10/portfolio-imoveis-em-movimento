(()=>{
"use strict";
const $=id=>document.getElementById(id),form=$("online-property-form"),workspace=$("admin-workspace"),notice=$("admin-auth-message");
const list=$("online-properties-list"),photosUI=$("online-photo-list"),session=$("admin-session");
const states={AC:"Acre",AL:"Alagoas",AP:"Amapá",AM:"Amazonas",BA:"Bahia",CE:"Ceará",DF:"Distrito Federal",ES:"Espírito Santo",GO:"Goiás",MA:"Maranhão",MT:"Mato Grosso",MS:"Mato Grosso do Sul",MG:"Minas Gerais",PA:"Pará",PB:"Paraíba",PR:"Paraná",PE:"Pernambuco",PI:"Piauí",RJ:"Rio de Janeiro",RN:"Rio Grande do Norte",RS:"Rio Grande do Sul",RO:"Rondônia",RR:"Roraima",SC:"Santa Catarina",SP:"São Paulo",SE:"Sergipe",TO:"Tocantins"};
const field=name=>form.elements.namedItem(name),selectedPhotos=$("online-photos");
let entries=[],editId=null,photoUrls=[];
const h=(node,value)=>{node.textContent=value;return node};
function message(value,error=false){notice.textContent=value;notice.classList.toggle("error",error)}
for(const [code,name] of Object.entries(states)){const option=document.createElement("option");option.value=code;option.textContent=name+" ("+code+")";field("uf").append(option)}
async function api(url,options={}){
 const response=await fetch(url,{credentials:"same-origin",...options});
 const payload=await response.json().catch(()=>({}));
 if(!response.ok)throw Error(payload.error||"Falha na requisicao ("+response.status+")");
 return payload
}
function formatPrice(p){return p.price==null?"Sob consulta":new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0}).format(p.price)}
function drawPhotos(){
 photosUI.replaceChildren();
 for(const url of photoUrls){
  const box=document.createElement("div");box.className="online-photo-item";
  const img=document.createElement("img");img.src=url;img.alt="Imagem cadastrada";
  const btn=document.createElement("button");btn.type="button";btn.setAttribute("aria-label","Remover esta foto");btn.textContent="✕";
  btn.addEventListener("click",()=>{photoUrls=photoUrls.filter(u=>u!==url);drawPhotos()});
  box.append(img,btn);photosUI.append(box)
 }
}
function reset(){
 form.reset();editId=null;photoUrls=[];selectedPhotos.value="";
 $("editor-heading").textContent="Novo imóvel";field("status").value="draft";$("online-geo-status").textContent="Escolha uma cidade e UF para marcar a localização aproximada.";
 drawPhotos()
}
function edit(p){
 reset();editId=p.id;
 for(const key of ["title","type","purpose","status","price","cep","street","number","complement","city","uf","neighborhood","lat","lng","rooms","baths","parking","area","description"]){
  if(field(key))field(key).value=p[key]??""
 }
 photoUrls=Array.isArray(p.photos)?p.photos.slice():[];
 $("editor-heading").textContent="Editando: "+p.title;
 drawPhotos();form.scrollIntoView({behavior:"smooth",block:"start"})
}
function render(){
 list.replaceChildren();
 h($("online-total"),entries.length);
 h($("online-published"),entries.filter(p=>p.status==="published").length);
 h($("online-drafts"),entries.filter(p=>p.status==="draft").length);
 if(!entries.length){const p=document.createElement("p");p.className="online-empty";p.textContent="Nenhum imóvel registrado no banco. Cadastre o primeiro usando o formulário.";list.append(p);return}
 for(const p of entries){
  const article=document.createElement("article");article.className="online-list-card";
  if(p.photos?.[0]){const img=document.createElement("img");img.src=p.photos[0];img.alt="Miniatura do imóvel";article.append(img)}
  const inner=document.createElement("div");
  const label=document.createElement("small");label.textContent=p.status==="published"?"PUBLICADO":p.status==="archived"?"ARQUIVADO":"RASCUNHO";
  const title=document.createElement("strong");title.textContent=p.title;
  const sub=document.createElement("span");sub.textContent=[p.city,p.uf].filter(Boolean).join(" / ")+" · "+formatPrice(p);
  inner.append(label,title,sub);
  const row=document.createElement("div");row.className="online-row-actions";
  const btn=document.createElement("button");btn.type="button";btn.textContent="Editar";btn.addEventListener("click",()=>edit(p));row.append(btn);
  if(p.status!=="archived"){const del=document.createElement("button");del.type="button";del.textContent="Arquivar";del.addEventListener("click",async()=>{
    if(!confirm("Arquivar "+p.title+"? Ele sairá da vitrine pública."))return;
    try{await api("/api/admin/properties?id="+encodeURIComponent(p.id),{method:"DELETE"});message("Imóvel arquivado.");await load()}catch(e){message(e.message,true)}
  });row.append(del)}
  inner.append(row);article.append(inner);list.append(article)
 }
}
async function load(){
 const data=await api("/api/admin/properties");
 entries=data.items||[];
 render()
}
ImoveisEndereco.setup(form,{message:text=>h($("online-geo-status"),text)});
$("online-new").addEventListener("click",()=>{reset();form.scrollIntoView({behavior:"smooth"})});
$("locate-online").addEventListener("click",async()=>{
 const city=String(field("city").value||"").trim(),uf=field("uf").value;
 if(!city||!uf){h($("online-geo-status"),"Informe uma cidade e selecione a UF.");return}
 const button=$("locate-online");button.disabled=true;
 h($("online-geo-status"),"Localizando centro aproximado da cidade...");
 try{
  const found=await ImoveisEndereco.geocode(form);
  field("lat").value=(Math.round(found.lat*100)/100).toFixed(2);
  field("lng").value=(Math.round(found.lng*100)/100).toFixed(2);
  h($("online-geo-status"),"Posição estimada: "+found.precision+". Confira as coordenadas aproximadas antes de salvar.");
 }catch(e){h($("online-geo-status"),e.message)}finally{button.disabled=false}
});
form.addEventListener("submit",async event=>{
 event.preventDefault();if(!form.reportValidity())return;
 const button=$("online-save");button.disabled=true;message("Processando cadastro e imagens...");
 try{
  const newFiles=Array.from(selectedPhotos.files||[]);
  if(photoUrls.length+newFiles.length>8)throw Error("Limite total de 8 fotografias por imóvel.");
  for(const file of newFiles){
   if(file.size>8*1024*1024)throw Error("Foto excede 8 MB: "+file.name);
   const body=new FormData();body.append("photo",file);
   const uploaded=await api("/api/admin/media",{method:"POST",body});
   photoUrls.push(uploaded.url)
  }
  drawPhotos();
  const data=Object.fromEntries(new FormData(form).entries());
  delete data.photo;
  const payload={...data,photos:photoUrls,
   price:data.price===""?null:Number(data.price),
   lat:Number(data.lat),lng:Number(data.lng),
   rooms:Number(data.rooms||0),baths:Number(data.baths||0),parking:Number(data.parking||0),area:Number(data.area||0)};
  await api("/api/admin/properties"+(editId?"?id="+encodeURIComponent(editId):""),{
   method:editId?"PUT":"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload)
  });
  await load();reset();message("Cadastro salvo no banco D1. Publicações aparecem na API após a aprovação.")
 }catch(e){message(e.message,true)}finally{button.disabled=false}
});
async function init(){
 try{
  const user=await api("/api/admin/session");
  session.textContent="ADMIN · "+user.email;
  workspace.hidden=false;message("Acesso autenticado. Trabalhando com o banco online.");
  await load()
 }catch(e){
  session.textContent="ACESSO NAO ATIVADO";
  workspace.hidden=true;
  message(e.message+". É necessário configurar Cloudflare Access, a lista de administradores e os vínculos D1/R2 para ativar o painel.",true)
 }
}
init();
})();