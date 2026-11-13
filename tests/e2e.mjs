import assert from "node:assert/strict";
import {createServer} from "node:http";
import {readFile} from "node:fs/promises";
import path from "node:path";
import {chromium} from "playwright";

const root=process.cwd();
const mime={".html":"text/html; charset=utf-8",".js":"application/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".svg":"image/svg+xml",".json":"application/json"};
const server=createServer(async(req,res)=>{
 try{
  let target=decodeURIComponent(new URL(req.url,"http://127.0.0.1").pathname);
  if(target==="/")target="/index.html";
  if(target.startsWith("/api/")){res.writeHead(503,{"content-type":"application/json"});res.end('{"error":"Painel online ainda não configurado"}');return}
  const file=path.resolve(root,"."+target);
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
  const body=await readFile(file);
  res.writeHead(200,{"content-type":mime[path.extname(file)]||"application/octet-stream"});
  res.end(body)
 }catch{res.writeHead(404);res.end("Not found")}
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const url="http://127.0.0.1:"+server.address().port;
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1280,height:800}});
const errors=[];
page.on("pageerror",e=>errors.push(e.message));
async function waitCount(n){await page.waitForFunction(n=>document.querySelector("#map-count")?.textContent?.startsWith(String(n)+" "),n,{timeout:30000})}
try{
 await page.goto(url+"/mapa.html",{waitUntil:"domcontentloaded"});
 await waitCount(8);
 assert.equal(await page.locator(".dyn-property-card").count(),8);
 await page.locator(".dyn-property-card").first().locator(".dyn-property-select").click();
 assert.equal(await page.locator(".dyn-leaflet-marker.is-selected").count(),1,"Ao selecionar, exatamente um marcador deve ficar azul");
 assert.equal(await page.locator(".dyn-property-card.is-selected").count(),1,"O card selecionado deve acompanhar o marcador");
 await page.locator(".dyn-property-card").nth(1).locator(".dyn-property-select").click();
 assert.equal(await page.locator(".dyn-leaflet-marker.is-selected").count(),1,"A seleção anterior deve voltar à cor padrão");
 assert.equal(await page.locator(".dyn-property-card.is-selected").count(),1,"A seleção deve trocar de card");
 await page.locator("#map-selected-close").click();
 assert.equal(await page.locator(".dyn-leaflet-marker.is-selected").count(),0,"Ao fechar a ficha, nenhuma casa deve permanecer azul");
 await page.locator('[data-category="casa"]').click();
 await waitCount(4);
 await page.locator(".dyn-property-card").first().locator(".dyn-card-fav").click();
 await page.locator('[data-category="favoritos"]').click();
 await waitCount(1);
 await page.locator(".dyn-property-card").first().locator(".dyn-property-details").click();
 await page.waitForURL(/imovel\.html\?id=/);
 await page.waitForFunction(()=>document.querySelector("#detail-status")?.textContent?.includes("FICTÍCIO"));
 assert.equal(await page.locator("#detail-favorite").getAttribute("aria-pressed"),"true");
 await page.locator("#detail-favorite").click();
 assert.equal(await page.locator("#detail-favorite").getAttribute("aria-pressed"),"false");
 await page.route("https://viacep.com.br/**",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({cep:"07010-000",logradouro:"Praça de Teste",bairro:"Centro",localidade:"Guarulhos",uf:"SP"})}));
 await page.route("https://nominatim.openstreetmap.org/**",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify([{lat:"-23.46",lon:"-46.53"}])}));
 await page.goto(url+"/cadastrar.html",{waitUntil:"domcontentloaded"});
 await page.locator('input[name="cep"]').fill("07010000");
 await page.waitForFunction(()=>document.querySelector('input[name="city"]')?.value==="Guarulhos",{timeout:15000});
 assert.equal(await page.locator('input[name="street"]').inputValue(),"Praça de Teste");
 await page.locator('input[name="number"]').fill("100");
 await page.locator("#find-city").click();
 await page.waitForFunction(()=>document.querySelector('input[name="lat"]')?.value==="-23.46",{timeout:15000});
 await page.locator('input[name="title"]').fill("Imóvel de teste Playwright");
 await page.locator('select[name="type"]').selectOption("Casa");
 await page.locator('textarea[name="description"]').fill("Imóvel fictício para validar fluxo do painel local.");
 await page.locator("#property-files").setInputFiles({name:"teste.png",mimeType:"image/png",buffer:Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9WVDJb8AAAAASUVORK5CYII=","base64")});
 await page.locator("#save-property").click();
 await page.waitForFunction(()=>document.querySelector("#admin-message")?.textContent?.includes("Imóvel salvo"),{timeout:15000});
 await page.goto(url+"/mapa.html",{waitUntil:"domcontentloaded"});
 await waitCount(9);
 await page.setViewportSize({width:390,height:844});
 await page.goto(url+"/mapa.html",{waitUntil:"domcontentloaded"});
 await waitCount(9);
 const width=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:window.innerWidth}));
 assert.ok(width.scroll<=width.viewport+15,"Layout mobile apresentou rolagem horizontal excessiva: "+JSON.stringify(width));
 assert.deepEqual(errors,[],"Erros JS não tratados no navegador");
 console.log("E2E OK: 8 imóveis, filtro casas, favorito, detalhes, CEP, geolocalização, cadastro local e mapa mobile.")
}catch(error){
 await page.screenshot({path:"e2e-falha.png",fullPage:true}).catch(()=>{});
 console.error("E2E FALHOU:",error);
 console.error("ERROS NO NAVEGADOR:",errors);
 process.exitCode=1
}finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
