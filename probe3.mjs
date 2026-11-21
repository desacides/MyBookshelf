import fs from 'fs';
const UA={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36'};
const out=[];
async function get(u){ const r=await fetch(u,{headers:UA}); const b=Buffer.from(await r.arrayBuffer()); return {s:r.status,t:r.headers.get('content-type'),b}; }
const q=encodeURIComponent('bib.title all "spy family tome 9" and bib.publisher all "kurokawa"');
const x=(await get(`https://catalogue.bnf.fr/api/SRU?version=1.2&operation=searchRetrieve&query=${q}&recordSchema=dublincore&maximumRecords=3`)).b.toString();
out.push({xml:x.slice(0,4000)});
const ark=(x.match(/ark:\/12148\/(cb[0-9a-z]+)/)||[])[1]; const isbn=(x.match(/ISBN\s*([0-9X-]{10,17})/i)||[])[1];
out.push({ark,isbn});
for(const u of [`https://catalogue.bnf.fr/couverture?&appName=NE&idArk=ark:/12148/${ark}&couverture=1`,`https://catalogue.bnf.fr/couverture?appName=NE&idArk=ark:/12148/${ark}`]){ const r=await get(u); out.push({u,s:r.s,t:r.t,len:r.b.length}); if(r.b.length>2000) fs.writeFileSync('bnf.jpg',r.b); }
if(isbn){ const d=isbn.replace(/-/g,''); const i10=d.length===13? (()=>{const c=d.slice(3,12); let s=0; for(let k=0;k<9;k++) s+=(10-k)*+c[k]; const ck=(11-s%11)%11; return c+(ck===10?'X':ck);})():d;
 for(const u of [`https://images-na.ssl-images-amazon.com/images/P/${i10}.01.L.jpg`,`https://covers.openlibrary.org/b/isbn/${d}-L.jpg?default=false`]){ const r=await get(u); out.push({u,s:r.s,t:r.t,len:r.b.length}); if(r.b.length>2000) fs.writeFileSync('amz.jpg',r.b);} }
fs.writeFileSync('probe3.json',JSON.stringify(out,null,1));
