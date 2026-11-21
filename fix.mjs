import fs from 'fs';
const UA={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36','Accept':'image/*'};
fs.mkdirSync('img',{recursive:true}); const out=[];
const T=[['gto--19-18',['https://images-na.ssl-images-amazon.com/images/P/2845991894.01.L.jpg','https://m.media-amazon.com/images/P/2845991894.01._SCLZZZZZZZ_.jpg','https://products-images.di-static.com/image/x/9782845991897-475x500-1.jpg','https://covers.openlibrary.org/b/isbn/2845991894-L.jpg?default=false','https://products-images.di-static.com/image/x/9782811641191-475x500-1.jpg']],
['mashle--hs-mash-burnedead-et-le-livre-des-aventures',['https://products-images.di-static.com/image/x/9782820347107-475x500-1.jpg']]];
for(const [vid,us] of T){ for(const u of us){ try{const r=await fetch(u,{headers:UA}); const b=Buffer.from(await r.arrayBuffer()); out.push([u,r.status,b.length]); if(r.ok&&b.length>3000){fs.writeFileSync(`img/${vid}.jpg`,b);break;}}catch(e){out.push([u,e.message])} } }
fs.writeFileSync('fix.json',JSON.stringify(out));
