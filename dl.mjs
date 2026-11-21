import fs from 'fs';
const UA={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36','Accept':'image/avif,image/webp,image/*,*/*'};
const isb=JSON.parse(fs.readFileSync('isbn.json'));
fs.mkdirSync('img',{recursive:true});
const log={};
async function get(u){ try{const r=await fetch(u,{headers:UA}); const b=Buffer.from(await r.arrayBuffer()); return {s:r.status,t:r.headers.get('content-type')||'',b};}catch(e){return {s:0,t:'',b:Buffer.alloc(0)}} }
for(const [vid,list] of Object.entries(isb)){
 log[vid]=null;
 for(const i of list){
   let r=await get(`https://products-images.di-static.com/image/x/${i}-475x500-1.jpg`);
   if(r.s===200&&/image/.test(r.t)&&r.b.length>3000){fs.writeFileSync(`img/${vid}.jpg`,r.b);log[vid]={i,src:'decitre',len:r.b.length};break;}
 }
 if(!log[vid]) for(const i of list){
   let r=await get(`https://books.google.com/books/content?vid=ISBN${i}&printsec=frontcover&img=1&zoom=1`);
   if(r.s===200&&/image/.test(r.t)&&r.b.length>2500){fs.writeFileSync(`img/${vid}.jpg`,r.b);log[vid]={i,src:'google',len:r.b.length};break;}
 }
}
// extra BnF lookups
const Q={trois:'bib.title all "trois corps" and bib.publisher all "hachette"',dix:'bib.author all "christie" and bib.publisher all "paquet"',sikc:'bib.title all "something is killing the children" and bib.date all "2025 2026"'};
const ex={};
for(const [k,q] of Object.entries(Q)){ const x=await (await fetch(`https://catalogue.bnf.fr/api/SRU?version=1.2&operation=searchRetrieve&query=${encodeURIComponent(q)}&recordSchema=dublincore&maximumRecords=50`)).text();
 ex[k]=x.split('<srw:record>').slice(1).map(r=>[(r.match(/<dc:title>([^<]*)/)||[])[1],(r.match(/ISBN\s*([0-9X-]+)/)||[])[1],(r.match(/<dc:date>([^<]*)/)||[])[1]]); }
fs.writeFileSync('dl.json',JSON.stringify({log,ex},null,0));
