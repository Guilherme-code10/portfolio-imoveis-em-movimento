/* Busca de CEP e geolocalização sob ação explícita do usuário.
   Dados completos ficam no cadastro; o mapa público recebe só coordenadas aproximadas. */
(()=>{
"use strict";
const UF={AC:"Acre",AL:"Alagoas",AP:"Amapá",AM:"Amazonas",BA:"Bahia",CE:"Ceará",DF:"Distrito Federal",ES:"Espírito Santo",GO:"Goiás",MA:"Maranhão",MT:"Mato Grosso",MS:"Mato Grosso do Sul",MG:"Minas Gerais",PA:"Pará",PB:"Paraíba",PR:"Paraná",PE:"Pernambuco",PI:"Piauí",RJ:"Rio de Janeiro",RN:"Rio Grande do Norte",RS:"Rio Grande do Sul",RO:"Rondônia",RR:"Roraima",SC:"Santa Catarina",SP:"São Paulo",SE:"Sergipe",TO:"Tocantins"};
const digits=value=>String(value||"").replace(/\D/g,"");
const f=(form,name)=>form.elements.namedItem(name);
const val=(form,name)=>String(f(form,name)?.value||"").trim();
const set=(form,name,value)=>{const input=f(form,name);if(!input||value==null)return;input.value=value;input.dispatchEvent(new Event("change",{bubbles:true}))};
function setRegion(form){const city=val(form,"city"),district=val(form,"neighborhood");if(city&&f(form,"region"))set(form,"region",[district,city].filter(Boolean).join(", "))}
function setup(form,{message=()=>{}}={}){
  const input=f(form,"cep"),button=form.querySelector("[data-cep-lookup]");
  if(!input)return;
  let debounce,lastCep="",lookupSequence=0;
  const format=value=>{const s=digits(value).slice(0,8);return s.length>5?s.slice(0,5)+"-"+s.slice(5):s};
  async function lookup(){
    const cep=digits(input.value);
    if(cep.length!==8){message("Informe os 8 números do CEP.");return false}
    if(lastCep===cep&&val(form,"city"))return true;
    const requestId=++lookupSequence;input.value=format(cep);
    if(button)button.disabled=true;message("Buscando informações do CEP...");
    try{
      const result=await fetch("https://viacep.com.br/ws/"+cep+"/json/",{headers:{Accept:"application/json"}});
      if(!result.ok)throw Error("O serviço de CEP está indisponível.");
      const data=await result.json();
      if(requestId!==lookupSequence)return false;
      if(data.erro||!data.localidade||!data.uf)throw Error("CEP não encontrado. Confira o número informado.");
      set(form,"street",data.logradouro||"");
      set(form,"neighborhood",data.bairro||"");
      set(form,"city",data.localidade||"");
      set(form,"uf",data.uf||"");
      setRegion(form);
      lastCep=cep;
      message("CEP encontrado! Confira a rua, informe o número e clique em localizar no mapa. O endereço completo não será exibido ao público.");
      return true
    }catch(e){if(requestId===lookupSequence)message((e.message||"Erro ao consultar CEP.")+" Você também pode preencher manualmente.");return false}
    finally{if(button)button.disabled=false}
  }
  input.addEventListener("input",()=>{
    input.value=format(input.value);
    clearTimeout(debounce);
    if(digits(input.value).length===8&&digits(input.value)!==lastCep)debounce=setTimeout(lookup,400)
  });
  input.addEventListener("blur",()=>{if(digits(input.value).length===8&&digits(input.value)!==lastCep)lookup()});
  if(button)button.addEventListener("click",lookup);
  const district=f(form,"neighborhood"),city=f(form,"city");
  for(const el of [district,city])el?.addEventListener("change",()=>setRegion(form));
  return {lookup}
}
let lastGeocode=0;
async function requestLocation(q){
  // Limite leve para o serviço público Nominatim; somente em cliques, nunca em massa.
  const delay=Math.max(0,1100-(Date.now()-lastGeocode));
  if(delay)await new Promise(resolve=>setTimeout(resolve,delay));
  lastGeocode=Date.now();
  const params=new URLSearchParams({q,format:"json",limit:"1",countrycodes:"br"});
  const response=await fetch("https://nominatim.openstreetmap.org/search?"+params,{headers:{Accept:"application/json"}});
  if(!response.ok)throw Error("O serviço de mapas não respondeu. Tente mais tarde.");
  const rows=await response.json();if(!Array.isArray(rows)||!rows.length)return null;
  const lat=Number(rows[0].lat),lng=Number(rows[0].lon);
  if(!Number.isFinite(lat)||!Number.isFinite(lng)||lat< -34||lat>6||lng< -74||lng> -33)return null;
  return {lat,lng}
}
async function geocode(form){
  const city=val(form,"city"),uf=val(form,"uf").toUpperCase(),street=val(form,"street"),number=val(form,"number"),neighborhood=val(form,"neighborhood");
  if(!city||!UF[uf])throw Error("Informe uma cidade e selecione o estado para localizar.");
  if(street){
    const first=[street,number,neighborhood,city,UF[uf],"Brasil"].filter(Boolean).join(", ");
    const found=await requestLocation(first);
    if(found)return {...found,precision:"endereço aproximado"}
  }
  if(neighborhood){
    const found=await requestLocation([neighborhood,city,UF[uf],"Brasil"].join(", "));
    if(found)return {...found,precision:"bairro aproximado"}
  }
  const center=await requestLocation([city,UF[uf],"Brasil"].join(", "));
  if(center)return {...center,precision:"centro da cidade"};
  throw Error("Não conseguimos localizar o endereço. Confira os dados ou marque manualmente no mapa.")
}
window.ImoveisEndereco={setup,geocode,UF,digits};
})();