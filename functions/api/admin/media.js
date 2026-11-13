import {authenticated,fail,json} from "../../_lib/security.js";
// Administradores autorizados podem enviar imagens para R2. Sem bindings, falha fechada.
export async function onRequestPost(context){
  const who=await authenticated(context);if(who.error)return who.error;
  const {env,request}=context;
  if(!env.PHOTOS)return fail("Armazenamento R2 PHOTOS nao configurado.",503);
  const origin=request.headers.get("origin");
  if(origin&&origin!==new URL(request.url).origin)return fail("Origem nao permitida.",403);
  if(!(request.headers.get("content-type")||"").includes("multipart/form-data"))return fail("Envie formulario com arquivo.",415);
  const length=Number(request.headers.get("content-length"));
  if(Number.isFinite(length)&&length>9*1024*1024)return fail("Arquivo muito grande (limite de 8 MB).",413);
  try{
    const body=await request.formData(),file=body.get("photo");
    if(!file||typeof file.arrayBuffer!=="function")return fail("Selecione uma imagem valida.",400);
    if(file.size>8*1024*1024||file.size<100)return fail("A imagem deve ter no maximo 8 MB.",413);
    const bytes=new Uint8Array(await file.arrayBuffer()),type=file.type;
    const isJpg=type==="image/jpeg"&&bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff;
    const isPng=type==="image/png"&&bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71;
    const isWebp=type==="image/webp"&&String.fromCharCode(...bytes.slice(0,4))==="RIFF"&&String.fromCharCode(...bytes.slice(8,12))==="WEBP";
    if(!isJpg&&!isPng&&!isWebp)return fail("Formato invalido. Aceitamos JPG, PNG ou WebP.",415);
    const ext=isJpg?"jpg":isPng?"png":"webp",key=crypto.randomUUID()+"."+ext;
    await env.PHOTOS.put("public/"+key,bytes,{httpMetadata:{contentType:type}});
    return json({ok:true,url:"/api/media/"+key},201);
  }catch{return fail("Falha ao processar a imagem.",500)}
}