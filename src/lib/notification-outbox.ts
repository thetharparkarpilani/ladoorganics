import type { PoolClient } from "pg";
type OrderNotificationInput = { orderId:string; orderNumber:string; customerName:string; customerEmail:string; customerPhone:string; totalInr:number; paymentMethod:string; paymentStatus:string };
function escapeHtml(value:unknown):string{return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]||c);}
export async function enqueueOrderNotifications(client:PoolClient,input:OrderNotificationInput):Promise<void>{
 await client.query("INSERT INTO notification_outbox (channel,recipient,template_id,payload,idempotency_key) VALUES ('email',$1,'order_received',$2::jsonb,$3) ON CONFLICT (idempotency_key) DO NOTHING",
 [input.customerEmail,JSON.stringify({name:input.customerName,order_number:input.orderNumber,amount:input.totalInr,payment_method:input.paymentMethod}),"order:"+input.orderId+":customer-email"]);
 const adminRecipient=process.env.ADMIN_NOTIFICATION_EMAIL?.trim(); if(!adminRecipient)return;
 const siteUrl=(process.env.NEXT_PUBLIC_SITE_URL||"https://ladoorganics.in").replace(/\/$/,"");
 const rows=[["Order number",input.orderNumber],["Customer",input.customerName],["Email",input.customerEmail],["Phone",input.customerPhone],["Total (INR)",input.totalInr],["Payment method",input.paymentMethod],["Payment status",input.paymentStatus],["Order status","pending_confirmation"]]
 .map(([label,value])=>'<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">'+escapeHtml(label)+'</td><td style="padding:8px;border-bottom:1px solid #eee;">'+escapeHtml(value)+"</td></tr>").join("");
 await client.query("INSERT INTO notification_outbox (channel,recipient,template_id,payload,idempotency_key) VALUES ('email',$1,NULL,$2::jsonb,$3) ON CONFLICT (idempotency_key) DO NOTHING",
 [adminRecipient,JSON.stringify({subject:"New Lado Organics order: "+input.orderNumber,htmlContent:'<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#30291f;"><h2 style="color:#8b4b32;">New Lado Organics customer order</h2><p>A customer order has been recorded and is awaiting review. This is not a payment confirmation.</p><table style="width:100%;border-collapse:collapse;">'+rows+'</table><p style="margin-top:24px;"><a href="'+escapeHtml(siteUrl)+'/admin" style="display:inline-block;padding:12px 18px;background:#68452f;color:#fff;text-decoration:none;border-radius:8px;">Open Admin Dashboard</a></p></div>'}),"order:"+input.orderId+":admin-email"]);
}
