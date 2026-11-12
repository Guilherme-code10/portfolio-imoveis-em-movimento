(()=>{
"use strict";
const $=id=>document.getElementById(id);
const matterport=$("matterport-frame");
$("load-matterport").addEventListener("click",()=>{
  matterport.src="https://my.matterport.com/show/?m=ovWEMMzTD2V&play=1";
  matterport.hidden=false;
  $("matterport-intro").hidden=true;
});
const files=$("tour-files"), list=$("tour-files-list"), status=$("tour-status"), build=$("tour-build"), form=$("tour-form");
let panoramas=[], viewer=null, urls=[];
const maxPhotos=8, maxBytes=18*1024*1024;
function tell(s,warning=false){status.textContent=s;status.classList.toggle("is-error",warning)}
function cleanup(){for(const u of urls)URL.revokeObjectURL(u);urls=[]}
function ratioOf(file){return new Promise((resolve,reject)=>{
  const src=URL.createObjectURL(file),img=new Image();
  img.onload=()=>{URL.revokeObjectURL(src);resolve({w:img.naturalWidth,h:img.naturalHeight})};
  img.onerror=()=>{URL.revokeObjectURL(src);reject(Error("Arquivo não é uma imagem válida"))};
  img.src=src;
})}
async function prepare(file){
  const {w,h}=await ratioOf(file);
  if(Math.abs(w/h-2)>0.16)throw Error(file.name+" não é um panorama 360° equiretangular (proporção 2:1).");
  if(w<1000||h<500)throw Error(file.name+" tem resolução muito baixa para este passeio.");
  if(w<=4096){const u=URL.createObjectURL(file);urls.push(u);return u}
  const src=URL.createObjectURL(file),image=new Image();
  try{
    await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=src});
    const canvas=document.createElement("canvas");
    canvas.width=4096;canvas.height=2048;
    canvas.getContext("2d").drawImage(image,0,0,4096,2048);
    const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error("Falha ao preparar imagem")),"image/jpeg",0.86));
    const u=URL.createObjectURL(blob);urls.push(u);return u
  }finally{URL.revokeObjectURL(src)}
}
files.addEventListener("change",async()=>{
  const selected=Array.from(files.files||[]);list.replaceChildren();panoramas=[];build.disabled=true;
  if(!selected.length){tell("Adicione pelo menos 2 panoramas.");return}
  if(selected.length<2||selected.length>maxPhotos){tell("Selecione entre 2 e 8 panoramas.",true);return}
  const invalid=selected.find(f=>!["image/jpeg","image/png","image/webp"].includes(f.type)||f.size>maxBytes);
  if(invalid){tell("Confira o arquivo "+invalid.name+". Tipos permitidos: JPG, PNG ou WebP, até 18 MB.",true);return}
  for(let i=0;i<selected.length;i++){
    const p=document.createElement("label"),title=document.createElement("span"),input=document.createElement("input");
    p.className="tour-file-entry";title.textContent=String(i+1).padStart(2,"0")+" · "+selected[i].name;
    input.type="text";input.maxLength=36;input.placeholder="Nome do ambiente";
    const guesses=["Entrada","Sala","Cozinha","Quarto","Banheiro","Área externa","Suíte","Varanda"];
    input.value=guesses[i]||"Ambiente "+(i+1);
    p.append(title,input);list.append(p);
  }
  panoramas=selected;build.disabled=false;tell("Fotos selecionadas. Dê nome aos ambientes e monte o passeio.");
});
function demolish(){if(viewer){try{viewer.destroy()}catch(e){console.warn("Erro ao destruir visualizador:",e)}viewer=null}const node=$("local-panorama");node.replaceChildren();cleanup()}
form.addEventListener("submit",async e=>{
  e.preventDefault();if(panoramas.length<2)return;
  if(typeof pannellum==="undefined"){tell("Não foi possível carregar o visualizador 360°. Verifique sua conexão e tente novamente.",true);return}
  build.disabled=true;tell("Preparando as imagens panorâmicas...");
  demolish();
  const chosen=panoramas.slice(),labels=[...list.querySelectorAll("input")].map((el,i)=>el.value.trim()||"Ambiente "+(i+1));
  const scenes={};
  try{
    const sources=[];
    for(const photo of chosen)sources.push(await prepare(photo));
    sources.forEach((u,i)=>{
      const spots=[];
      if(i>0)spots.push({pitch:-14,yaw:-65,type:"scene",sceneId:"ambiente-"+(i-1),text:"Voltar para "+labels[i-1]});
      if(i<sources.length-1)spots.push({pitch:-14,yaw:55,type:"scene",sceneId:"ambiente-"+(i+1),text:"Ir para "+labels[i+1]});
      scenes["ambiente-"+i]={type:"equirectangular",panorama:u,title:labels[i],hfov:100,autoLoad:true,hotSpots:spots};
    });
    const root=$("local-panorama");
    viewer=pannellum.viewer(root,{default:{firstScene:"ambiente-0",sceneFadeDuration:650,autoLoad:true,showControls:true},scenes});
    $("tour-preview-empty").hidden=true;
    $("tour-preview-badge").textContent="PRÉVIA ATIVA";
    const nav=$("tour-room-list");nav.replaceChildren();nav.hidden=false;
    labels.forEach((label,i)=>{
      const btn=document.createElement("button");btn.type="button";btn.textContent=(i+1)+". "+label;
      btn.addEventListener("click",()=>{viewer?.loadScene("ambiente-"+i)});
      nav.append(btn);
    });
    const setActive=scene=>{
      nav.querySelectorAll("button").forEach((el,i)=>el.classList.toggle("active",scene==="ambiente-"+i));
      const index=Number(scene.split("-")[1])||0;
      $("tour-current-room").textContent=labels[index]+" · Arraste e clique nas setas para explorar";
    };
    viewer.on("scenechange",setActive);
    setActive("ambiente-0");
    $("tour-fullscreen").disabled=false;
    tell("Seu passeio está pronto! Arraste para olhar ao redor ou clique nas setas para trocar de cômodo.");
    $("local-panorama").scrollIntoView({behavior:"smooth",block:"center"});
  }catch(err){
    demolish();$("tour-preview-empty").hidden=false;
    $("tour-room-list").hidden=true;
    $("tour-preview-badge").textContent="AGUARDANDO IMAGENS";
    $("tour-fullscreen").disabled=true;
    tell("Não foi possível montar o passeio: "+(err.message||"erro inesperado"),true)
  }finally{build.disabled=panoramas.length<2}
});
$("tour-fullscreen").addEventListener("click",()=>{if(viewer){try{viewer.toggleFullscreen()}catch{tell("Tela cheia não está disponível neste dispositivo.",true)}}});
window.addEventListener("pagehide",()=>{demolish()});
})();