import {authenticated,bodyJSON,fail,json} from "../../_lib/security.js";
const ids=/^\/api\/media\/[0-9a-f-]{36}\.(jpg|png|webp)$/;
const kinds=["Casa","Apartamento","Cobertura","Terreno","Outro"];
const purposes=["Venda","Locação","Temporada"];
const states=new Set("AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" "));
const parseRow=r=>({...r,price:r.price_cents==null?null:r.price_cents/100,photos:JSON.parse(r.photos_json||"[]")});
const str=(v,max=150)=>String(v??"").trim().slice(0,max);
function validate(input){
  const title=str(input.title,100),type=str(input.type,20),purpose=str(input.purpose||"Venda",20),status=str(input.status||"draft",20);
  const city=str(input.city,80),uf=str(input.uf,2).toUpperCase(),neighborhood=str(input.neighborhood,80),description=str(input.description,3000);
  const lat=Number(input.lat),lng=Number(input.lng);
  const price=input.price==null||input.price===""?null:Number(input.price);
  const photos=Array.isArray(input.photos)?input.photos:[];
  const rooms=Number(input.rooms||0),baths=Number(input.baths||0),parking=Number(input.parking||0),area=Number(input.area||0);
  if(title.length<4||!kinds.includes(type)||!purposes.includes(purpose)||!["draft","published","archived"].includes(status))throw Error("Nome, tipo, finalidade ou situacao invalidos.");
  if(city.length<2||!states.has(uf)||!Number.isFinite(lat)||!Number.isFinite(lng)||lat< -34||lat>6||lng< -74||lng> -33)throw Error("Cidade, estado ou coordenadas invalidas.");
  if(price!==null&&(!Number.isFinite(price)||price<0||price>999999999))throw Error("Preco invalido.");
  for(const n of [rooms,baths,parking])if(!Number.isInteger(n)||n<0||n>100)throw Error("Quartos, banheiros ou vagas invalidos.");
  if(!Number.isFinite(area)||area<0||area>1000000)throw Error("Area invalida.");
  if(photos.length>8||photos.some(p=>typeof p!=="string"||!ids.test(p)))throw Error("Fotografias devem ser enviadas ao armazenamento autorizado (maximo 8).");
  if(status==="published"&&!photos.length)throw Error("Para publicar, e necessario ter ao menos uma fotografia.");
  return {title,type,purpose,status,price_cents:price===null?null:Math.round(price*100),city,uf,neighborhood,lat:Math.round(lat*100)/100,lng:Math.round(lng*100)/100,description,rooms,baths,parking,area,photos_json:JSON.stringify(photos)}
}
export async function onRequest(context){
  const who=await authenticated(context);if(who.error)return who.error;
  const DB=context.env.DB;if(!DB)return fail("Vinculo D1 DB nao configurado no projeto Pages.",503);
  const {request}=context;const method=request.method;
  try{
    if(method==="GET"){
      const {results}=await DB.prepare("SELECT * FROM properties ORDER BY updated_at DESC LIMIT 200").all();
      return json({items:(results||[]).map(parseRow),admin:who.email});
    }
    if(!["POST","PUT","DELETE"].includes(method))return fail("Metodo nao permitido.",405);
    const origin=request.headers.get("origin");
    if(origin&&origin!==new URL(request.url).origin)return fail("Origem da solicitacao nao permitida.",403);
    if(method==="DELETE"){
      const id=new URL(request.url).searchParams.get("id");
      if(!id||!/^[a-z0-9-]{8,80}$/i.test(id))return fail("Identificador invalido.",400);
      const result=await DB.prepare("UPDATE properties SET status='archived', updated_at=datetime('now') WHERE id=?").bind(id).run();
      if(!result.meta?.changes)return fail("Imovel nao encontrado.",404);
      return json({ok:true,status:"archived"});
    }
    if(!(request.headers.get("content-type")||"").includes("application/json"))return fail("Use application/json.",415);
    const payload=await bodyJSON(request);
    const p=validate(payload);
    if(method==="POST"){
      const id=crypto.randomUUID();
      await DB.prepare("INSERT INTO properties (id,title,type,purpose,status,price_cents,city,uf,neighborhood,lat,lng,description,rooms,baths,parking,area,photos_json,created_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
        .bind(id,p.title,p.type,p.purpose,p.status,p.price_cents,p.city,p.uf,p.neighborhood,p.lat,p.lng,p.description,p.rooms,p.baths,p.parking,p.area,p.photos_json,who.email).run();
      return json({ok:true,id,status:p.status},201);
    }
    const id=new URL(request.url).searchParams.get("id");
    if(!id||!/^[a-z0-9-]{8,80}$/i.test(id))return fail("Identificador invalido.",400);
    const updated=await DB.prepare("UPDATE properties SET title=?,type=?,purpose=?,status=?,price_cents=?,city=?,uf=?,neighborhood=?,lat=?,lng=?,description=?,rooms=?,baths=?,parking=?,area=?,photos_json=?,updated_at=datetime('now') WHERE id=?")
       .bind(p.title,p.type,p.purpose,p.status,p.price_cents,p.city,p.uf,p.neighborhood,p.lat,p.lng,p.description,p.rooms,p.baths,p.parking,p.area,p.photos_json,id).run();
    if(!updated.meta?.changes)return fail("Imovel nao encontrado.",404);
    return json({ok:true,id,status:p.status});
  }catch(e){
    if(e instanceof SyntaxError)return fail("JSON invalido.");
    if(e.message?.includes("D1")||e.message?.includes("no such table"))return fail("Banco D1 indisponivel ou esquema SQL nao aplicado.",503);
    if(/invalid|invalido|necessario|maximo/i.test(e.message||""))return fail(e.message,400);
    return fail("Nao foi possivel concluir a solicitacao.",500);
  }
}
