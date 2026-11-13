import {json,fail} from "../_lib/security.js";
// API publica: somente imoveis publicados, nunca registros de teste ou rascunhos.
const safe=r=>({id:r.id,title:r.title,type:r.type,purpose:r.purpose,price:r.price_cents==null?null:r.price_cents/100,city:r.city,uf:r.uf,neighborhood:r.neighborhood,lat:r.lat,lng:r.lng,description:r.description,rooms:r.rooms,baths:r.baths,parking:r.parking,area:r.area,photos:JSON.parse(r.photos_json||"[]"),updatedAt:r.updated_at});
export async function onRequestGet({request,env}){
  if(!env.DB)return fail("Catalogo online ainda nao ativado.",503);
  try{
    const url=new URL(request.url),uf=(url.searchParams.get("uf")||"").toUpperCase();
    const id=url.searchParams.get("id");
    if(id){
      if(!/^[a-z0-9-]{8,80}$/i.test(id))return fail("ID invalido.",400);
      const one=await env.DB.prepare("SELECT * FROM properties WHERE id=? AND status='published'").bind(id).first();
      return one?json({item:safe(one)}):fail("Imovel nao encontrado.",404)
    }
    const limit=Math.max(1,Math.min(100,Number(url.searchParams.get("limit"))||50));
    const q=uf&&/^[A-Z]{2}$/.test(uf)?"SELECT * FROM properties WHERE status='published' AND uf=? ORDER BY updated_at DESC LIMIT ?":"SELECT * FROM properties WHERE status='published' ORDER BY updated_at DESC LIMIT ?";
    const stmt=env.DB.prepare(q);
    const {results}=uf&&/^[A-Z]{2}$/.test(uf)?await stmt.bind(uf,limit).all():await stmt.bind(limit).all();
    return json({items:(results||[]).map(safe)});
  }catch(e){return fail("Catalogo online temporariamente indisponivel.",503)}
}