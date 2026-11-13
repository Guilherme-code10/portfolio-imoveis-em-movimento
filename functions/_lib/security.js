// Protecao de endpoints administrativos: valida assinatura e claims do Cloudflare Access.
// Nao confiar somente em cookies, cabecalhos nao verificados ou controles client-side.
const response=(message,status)=>new Response(JSON.stringify({error:message}),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff"}});
const textDecoder=new TextDecoder();
function parsePart(s){
  const padded=s.replace(/-/g,"+").replace(/_/g,"/").padEnd(Math.ceil(s.length/4)*4,"=");
  const raw=atob(padded),bytes=new Uint8Array(raw.length);
  for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
  return bytes;
}
function readPart(s){return JSON.parse(textDecoder.decode(parsePart(s)))}
export async function authenticated(context){
  const {ACCESS_TEAM_DOMAIN:domain,ACCESS_AUD:aud,ADMIN_EMAILS:emails}=context.env;
  if(!domain||!aud||!emails)return {error:response("Painel nao configurado. Configure Cloudflare Access e a lista de administradores.",503)};
  const allowed=emails.split(",").map(s=>s.trim().toLowerCase()).filter(Boolean);
  const host=String(domain).replace(/^https:\/\//,"").replace(/\/$/,"").toLowerCase();
  if(!/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(host)||allowed.length===0)return {error:response("Configuracao de autenticacao invalida.",503)};
  const jwt=context.request.headers.get("Cf-Access-Jwt-Assertion");
  if(!jwt)return {error:response("Autenticacao Cloudflare Access necessaria.",401)};
  try{
    const parts=jwt.split(".");if(parts.length!==3||parts.some(x=>!x))throw Error("jwt format");
    const header=readPart(parts[0]),payload=readPart(parts[1]);
    if(header.alg!=="RS256"||!header.kid||typeof header.kid!=="string")throw Error("unsupported jwt");
    const now=Math.floor(Date.now()/1000);
    if(!Number.isFinite(payload.exp)||payload.exp<=now||!Number.isFinite(payload.iat)||payload.iat>now+60)throw Error("expired jwt");
    if(payload.nbf&&payload.nbf>now+60)throw Error("future jwt");
    if(payload.iss!=="https://"+host)throw Error("wrong issuer");
    if(!(Array.isArray(payload.aud)?payload.aud.includes(aud):payload.aud===aud))throw Error("wrong audience");
    const email=String(payload.email||"").toLowerCase();
    if(!email||!allowed.includes(email))throw Error("not allowed");
    const certs=await fetch("https://"+host+"/cdn-cgi/access/certs");
    if(!certs.ok)throw Error("cert lookup");
    const {keys}=await certs.json();
    const key=Array.isArray(keys)?keys.find(k=>k.kid===header.kid&&k.kty==="RSA"):null;
    if(!key)throw Error("unknown signing key");
    const cryptoKey=await crypto.subtle.importKey("jwk",key,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["verify"]);
    const signature=parsePart(parts[2]);
    const message=new TextEncoder().encode(parts[0]+"."+parts[1]);
    if(!await crypto.subtle.verify("RSASSA-PKCS1-v1_5",cryptoKey,signature,message))throw Error("bad signature");
    return {email};
  }catch(error){return {error:response("Sessao invalida ou sem permissao administrativa.",403)}}
}
export function fail(message,status=400){return response(message,status)}
export function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff"}})}
export async function bodyJSON(request,max=12000){
  const len=Number(request.headers.get("content-length"));
  if(Number.isFinite(len)&&len>max)throw Error("Payload excede o limite");
  const text=await request.text();if(new TextEncoder().encode(text).byteLength>max)throw Error("Payload excede o limite");
  return JSON.parse(text);
}
