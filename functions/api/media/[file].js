import {fail} from "../../_lib/security.js";
export async function onRequestGet({params,env}){
  if(!env.PHOTOS)return fail("Imagens indisponiveis.",503);
  const key=String(params.file||"");
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/.test(key))return fail("Imagem invalida.",400);
  const object=await env.PHOTOS.get("public/"+key);
  if(!object)return fail("Imagem nao encontrada.",404);
  const type=object.httpMetadata?.contentType||"image/jpeg";
  if(!["image/jpeg","image/png","image/webp"].includes(type))return fail("Conteudo nao permitido.",415);
  return new Response(object.body,{headers:{"content-type":type,"cache-control":"public, max-age=86400","x-content-type-options":"nosniff"}});
}