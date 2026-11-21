import fs from 'fs';
const UA={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36','Accept':'image/avif,image/webp,image/*,*/*'};
const out=[];
async function get(u){ try{const r=await fetch(u,{headers:UA,redirect:'follow'}); const b=Buffer.from(await r.arrayBuffer()); return {s:r.status,t:r.headers.get('content-type'),b,url:r.url};}catch(e){return {s:'ERR '+e.message,b:Buffer.alloc(0)}} }
fs.mkdirSync('p4',{recursive:true});
const isbns=['9791042021030','9782845387421','9782723442273'];
let k=0;
for(const i of isbns){
 const urls=[`https://books.google.com/books/content?vid=ISBN${i}&printsec=frontcover&img=1&zoom=1`,
 `https://books.google.com/books/content?vid=ISBN${i}&printsec=frontcover&img=1&zoom=0`,
 `https://products-images.di-static.com/image/x/${i}-475x500-1.jpg`,
 `https://images.leslibraires.fr/books/${i}.jpg`,
 `https://m.media-amazon.com/images/P/${i}.01.L.jpg`,
 `https://www.placedeslibraires.fr/Couvertures/${i}.jpg`,
 `https://images.isbndb.com/covers/${i.slice(-4,-2)}/${i.slice(-2)}/${i}.jpg`,
 `https://www.babelio.com/couv/${i}.jpg`,
 `https://static.wixstatic.com/x`,
 `https://www.lalibrairie.com/cache/img/livres/${i}.jpg`,
 `https://covers.openlibrary.org/b/isbn/${i}-L.jpg?default=false`];
 for(const u of urls){ const r=await get(u); k++; out.push({u,s:r.s,t:r.t,len:r.b.length,final:r.url}); if(r.b.length>3000 && /image/.test(r.t||'')) fs.writeFileSync(`p4/${k}.jpg`,r.b); }
}
// BnF SRU unimarc for Beck glenat? test other series titles
for(const q of ['bib.title all "beck" and bib.publisher all "delcourt"','bib.title all "kaamelott" and bib.publisher all "casterman"','bib.title all "mashle" and bib.publisher all "kaze"']){
 const x=(await get(`https://catalogue.bnf.fr/api/SRU?version=1.2&operation=searchRetrieve&query=${encodeURIComponent(q)}&recordSchema=dublincore&maximumRecords=50`)).b.toString();
 out.push({q,recs:x.split('<srw:record>').slice(1).map(r=>[(r.match(/<dc:title>([^<]*)/)||[])[1],(r.match(/ISBN\s*([0-9X-]+)/)||[])[1],(r.match(/<dc:publisher>([^<]*)/)||[])[1]])});
}
fs.writeFileSync('probe4.json',JSON.stringify(out,null,1));
