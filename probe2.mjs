import fs from 'fs';
const UA={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36'};
const out=[];
async function t(name,u,bin){ try{ const r=await fetch(u,{headers:UA}); const buf=Buffer.from(await r.arrayBuffer()); out.push({name,status:r.status,type:r.headers.get('content-type'),len:buf.length,head:bin?'':buf.toString('utf8').slice(0,1500)}); }catch(e){ out.push({name,err:String(e)}); } }
const q=encodeURIComponent('bib.title all "spy family" and bib.publisher all "kurokawa"');
await t('bnf',`https://catalogue.bnf.fr/api/SRU?version=1.2&operation=searchRetrieve&query=${q}&recordSchema=dublincore&maximumRecords=5`);
await t('amz10','https://images-na.ssl-images-amazon.com/images/P/2380711028.01.L.jpg',1);
await t('amz10b','https://m.media-amazon.com/images/P/2380711028.01._SCLZZZZZZZ_.jpg',1);
await t('olcov','https://covers.openlibrary.org/b/isbn/9782380711028-L.jpg?default=false',1);
await t('mnimg','https://www.manga-news.com/public/images/vols/spy-x-family-1-kurokawa.webp',1);
await t('bdimg','https://www.bedetheque.com/media/Couvertures/Couv_25633.jpg',1);
fs.writeFileSync('probe2.json',JSON.stringify(out,null,1));
