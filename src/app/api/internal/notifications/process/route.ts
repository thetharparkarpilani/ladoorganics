import {NextRequest,NextResponse} from "next/server";
import {timingSafeEqual} from "crypto";
import {db} from "@/lib/db";
import {sendNotification} from "@/lib/email";
export const runtime="nodejs";
type OutboxRow={id:string;recipient:string;template_id:string|null;payload:Record<string,unknown>;attempts:number};
function escapeHtml(v:unknown):string{return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]||c);}
function renderTemplate(s:string,v:Record<string,unknown>):string{return s.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g,(_m,k:string)=>escapeHtml(v[k]??""));}
function authorized(req:NextRequest):boolean{const a=process.env.CRON_SECRET||"",b=(req.headers.get("authorization")||"").replace(/^Bearer\s+/i,"");if(a.length<32||!b)return false;const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y);}
export async function POST(req:NextRequest){
 if(!process.env.CRON_SECRET||process.env.CRON_SECRET.length<32)return NextResponse.json({error:"Notification worker is not configured."},{status:503,headers:{"Cache-Control":"no-store"}});
 if(!authorized(req))return NextResponse.json({error:"Unauthorized."},{status:401,headers:{"Cache-Control":"no-store"}});
 let claimed:OutboxRow[];
 try{const result=await db.query("WITH due AS (SELECT id FROM notification_outbox WHERE attempts<8 AND ((status='pending' AND available_at<=NOW()) OR (status='processing' AND locked_at<NOW()-INTERVAL '10 minutes')) ORDER BY available_at ASC,created_at ASC FOR UPDATE SKIP LOCKED LIMIT 5) UPDATE notification_outbox AS outbox SET status='processing',attempts=outbox.attempts+1,locked_at=NOW() FROM due WHERE outbox.id=due.id RETURNING outbox.id,outbox.recipient,outbox.template_id,outbox.payload,outbox.attempts");claimed=result.rows as OutboxRow[];}
 catch(error){console.error("Notification outbox claim failed:",error);return NextResponse.json({error:"Notification queue is temporarily unavailable."},{status:503,headers:{"Cache-Control":"no-store"}});}
 let sent=0,retried=0,dead=0;
 for(const row of claimed){try{
  let subject="",html="";
  if(row.template_id){const result=await db.query("SELECT subject,html_content FROM email_templates WHERE id=$1 LIMIT 1",[row.template_id]);const template=result.rows[0];if(!template){await db.query("UPDATE notification_outbox SET status='dead',locked_at=NULL,last_error='Email template is missing' WHERE id=$1",[row.id]);dead++;continue;}subject=renderTemplate(String(template.subject),row.payload||{});html=renderTemplate(String(template.html_content),row.payload||{});}
  else{subject=typeof row.payload?.subject==="string"?row.payload.subject:"";html=typeof row.payload?.htmlContent==="string"?row.payload.htmlContent:"";}
  const delivered=Boolean(subject&&html)&&await sendNotification(row.recipient,subject,html);
  if(delivered){await db.query("UPDATE notification_outbox SET status='sent',sent_at=NOW(),locked_at=NULL,last_error=NULL WHERE id=$1",[row.id]);sent++;}
  else{const terminal=row.attempts>=8;await db.query("UPDATE notification_outbox SET status=$2,locked_at=NULL,available_at=NOW()+make_interval(secs=>LEAST(3600,30*power(2,GREATEST($3-1,0))::integer)),last_error=$4 WHERE id=$1",[row.id,terminal?"dead":"pending",row.attempts,subject&&html?"Email provider unavailable or delivery failed":"Email payload is incomplete"]);if(terminal)dead++;else retried++;}
 }catch(error){console.error("Notification outbox delivery attempt failed:",row.id,error);const terminal=row.attempts>=8;await db.query("UPDATE notification_outbox SET status=$2,locked_at=NULL,available_at=NOW()+make_interval(secs=>LEAST(3600,30*power(2,GREATEST($3-1,0))::integer)),last_error='Unexpected delivery worker error' WHERE id=$1",[row.id,terminal?"dead":"pending",row.attempts]).catch(e=>console.error("Notification retry state update failed:",e));if(terminal)dead++;else retried++;}}
 return NextResponse.json({processed:claimed.length,sent,retried,dead},{headers:{"Cache-Control":"no-store"}});
}
