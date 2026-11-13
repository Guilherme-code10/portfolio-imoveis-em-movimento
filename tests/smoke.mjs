import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root=process.cwd();
const read=file=>fs.readFileSync(path.join(root,file),"utf8");
const required=[
 "index.html","mapa.html","imoveis.html","imovel.html","cadastrar.html",
 "painel-online.html","apresentacao.html","js/endereco.js","js/mapa.js",
 "js/imoveis-core.js","js/painel-online.js","schema.sql"
];
required.forEach(file=>assert.ok(fs.existsSync(path.join(root,file)),file+" ausente"));
const jsFiles=[
 "js/app.js","js/cadastrar-page.js","js/endereco.js","js/imoveis-core.js",
 "js/imoveis-page.js","js/imovel-page.js","js/localizacao-admin.js",
 "js/mapa.js","js/painel-online.js",
 "functions/_lib/security.js","functions/api/admin/properties.js",
 "functions/api/admin/media.js","functions/api/admin/session.js",
 "functions/api/properties.js","functions/api/media/[file].js"
];
for(const file of jsFiles){
  let code=read(file);
  if(file.startsWith("functions/"))code=code.split("\n").filter(line=>!line.trim().startsWith("import ")).join("\n").replace(/\bexport /g,"");
  assert.doesNotThrow(()=>new vm.Script(code,{filename:file}),file);
}
const pages={
 "mapa.html":["js/mapa.js"],
 "cadastrar.html":["js/cadastrar-page.js","js/localizacao-admin.js"],
 "painel-online.html":["js/painel-online.js"],
 "imovel.html":["js/imovel-page.js"],
 "apresentacao.html":[]
};
for(const [page,files] of Object.entries(pages)){
 const html=read(page);
 for(const file of files){
  const js=read(file);
  const ids=[...js.matchAll(/\$\("([^"]+)"\)/g)].map(match=>match[1]);
  for(const id of new Set(ids))assert.ok(html.includes('id="'+id+'"'),page+" sem #"+id+" usado em "+file);
 }
 for(const match of html.matchAll(/\b(?:src|href)="((?:css|js)\/[^"]+\.(?:js|css)(?:\?[^"]*)?)"/g)){
  const file=match[1].split("?")[0];assert.ok(fs.existsSync(path.join(root,file)),page+" referencia arquivo ausente "+file)
 }
}
const core=read("js/imoveis-core.js");
const fixtureMatch=core.match(/const guarulhosTests=(\[[\s\S]*?\]);\nconst DB=/);
assert.ok(fixtureMatch,"Dados fictícios não encontrados");
const demos=JSON.parse(fixtureMatch[1]);
assert.equal(demos.length,8,"A vitrine deve apresentar os oito anúncios fictícios de Guarulhos");
assert.equal(new Set(demos.map(p=>p.id)).size,8,"IDs duplicados");
assert.ok(demos.every(p=>p.testListing&&p.demo&&p.city==="Guarulhos"&&p.uf==="SP"&&p.price&&p.photos?.length));
const map=read("js/mapa.js");
assert.ok(map.includes("(!p.demo||p.testListing)"),"Anúncios falsos do portfolio não podem parecer reais");
assert.ok(map.includes("https://tile.openstreetmap.org/"),"Base de mapa do OpenStreetMap deve estar configurada");
assert.ok(map.includes("map-bedrooms")&&map.includes("map-max-price")&&map.includes("favoritos"));
const address=read("js/endereco.js");
assert.ok(address.includes("viacep.com.br")&&address.includes("nominatim.openstreetmap.org"));
const schema=read("schema.sql");
for(const name of ["cep","street","number","complement"])assert.ok(schema.includes(name+" TEXT"),"Coluna privada "+name+" ausente");
const admin=read("functions/api/admin/properties.js");
const insert=admin.match(/INSERT INTO properties \(([^)]+)\) VALUES \(([^)]+)\)/);
assert.ok(insert,"INSERT de imóveis ausente");
assert.equal(insert[1].split(",").length,insert[2].split(",").length,"Quantidade de valores SQL diferente das colunas");
const publicApi=read("functions/api/properties.js");
assert.ok(publicApi.includes("status='published'"),"A API pública deve filtrar imóveis publicados");
const safe=publicApi.match(/const safe=r=>\(\{([\s\S]*?)\}\);/);
assert.ok(safe,"Projeção pública de dados não encontrada");
for(const field of ["cep","street","number","complement","created_by"])assert.ok(!safe[1].includes(field+":"),"Informação privada exposta: "+field);
const security=read("functions/_lib/security.js");
assert.ok(security.includes("crypto.subtle.verify")&&security.includes("ADMIN_EMAILS"));
assert.ok(read("painel-online.html").includes('id="admin-workspace" class="online-admin-workspace" hidden'));
assert.ok(read("apresentacao.html").includes("imovel.html?id=teste-maia"));
console.log("OK: "+jsFiles.length+" scripts, "+Object.keys(pages).length+" páginas, 8 imóveis fictícios, mapa, CEP, SQL e controles de acesso.");
