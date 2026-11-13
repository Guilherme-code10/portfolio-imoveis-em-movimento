(()=>{
"use strict";
const $=id=>document.getElementById(id);
const startButton=$("cabral-start"),toggle=$("cabral-toggle"),restart=$("cabral-restart"),progress=$("cabral-progress"),clock=$("cabral-clock"),photo=$("cabral-photo"),fallback=$("cabral-photo-fallback");
const head=$("cabral-film-headline"),sub=$("cabral-film-subheadline"),kicker=$("cabral-film-kicker"),text=$("cabral-film-sequence");
const duration=20000;
const beats=[
  {t:0,k:"CABRAL NEGÓCIOS IMOBILIÁRIOS",h:"Casa na Ponte Grande",s:"Guarulhos · São Paulo"},
  {t:4000,k:"IMÓVEL REAL · CA67890-CABU",h:"338 m² anunciados",s:"Área informada pela imobiliária"},
  {t:8000,k:"UM ESPAÇO PARA SUA FAMÍLIA",h:"2 dormitórios",s:"2 banheiros · ambientes descritos no anúncio"},
  {t:12000,k:"COMODIDADE PARA RECEBER",h:"5 vagas de garagem",s:"O espaço coberto que aparece na fotografia"},
  {t:16000,k:"VALOR ANUNCIADO",h:"R$ 1.190.000",s:"Confirme disponibilidade e condições com a Cabral"}
];
let playing=false,elapsed=0,started=0,frameId=0,lastBeat=-1;
function stamp(ms){const s=Math.floor(ms/1000);return "00:"+String(s).padStart(2,"0")}
function update(t){
  elapsed=Math.min(duration,Math.max(0,t));
  const index=Math.min(beats.length-1,Math.floor(elapsed/4000));
  if(index!==lastBeat){lastBeat=index;const b=beats[index];text.classList.remove("visible");kicker.textContent=b.k;head.textContent=b.h;sub.textContent=b.s;text.classList.add("visible")}
  const p=elapsed/duration;
  photo.style.transform="scale("+(1.03+.16*p).toFixed(4)+") translate("+(-1.5*p).toFixed(3)+"%,"+(1.2*p).toFixed(3)+"%)";
  progress.style.width=(p*100).toFixed(2)+"%";
  clock.textContent=stamp(elapsed)+" / 00:20";
}
function pause(){playing=false;cancelAnimationFrame(frameId);toggle.textContent="▶ Reproduzir"}
function tick(now){if(!playing)return;update(now-started);if(elapsed>=duration){pause();toggle.textContent="↻ Rever";return}frameId=requestAnimationFrame(tick)}
function play(){if(elapsed>=duration)update(0);startButton.hidden=true;playing=true;started=performance.now()-elapsed;toggle.textContent="❚❚ Pausar";frameId=requestAnimationFrame(tick)}
function replay(){pause();update(0);play()}
startButton.addEventListener("click",play);
toggle.addEventListener("click",()=>playing?pause():play());
restart.addEventListener("click",replay);
photo.addEventListener("error",()=>{fallback.hidden=false;photo.hidden=true});
update(0);
window.addEventListener("pagehide",pause);
})();