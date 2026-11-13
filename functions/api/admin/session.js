import {authenticated,json} from "../../_lib/security.js";
export async function onRequestGet(context){
  const who=await authenticated(context);
  return who.error||json({authenticated:true,email:who.email});
}