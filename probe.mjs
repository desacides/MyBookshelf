import fs from 'fs';
const UA={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36','Accept-Language':'fr-FR,fr;q=0.9'};
const out=[];
async function t(name,u){ try{ const r=await fetch(u,{headers:UA,redirect:'follow'}); const txt=await r.text(); out.push({name,u,status:r.status,len:txt.length,head:txt.slice(0,300).replace(/\s+/g,' '),imgs:[...txt.matchAll(/(https?:[^"' ]+\.(?:jpg|jpeg|png|webp))/gi)].map(m=>m[1]).filter(x=>/couv|cover|media|book|manga|img/i.test(x)).slice(0,8)}); }catch(e){ out.push({name,u,err:String(e)}); } }
await t('gbooks','https://www.googleapis.com/books/v1/volumes?q=Spy%20x%20Family%20tome%209%20Kurokawa&langRestrict=fr&maxResults=5');
await t('gbooks2','https://www.googleapis.com/books/v1/volumes?q=intitle:Kaamelott+inpublisher:Casterman&langRestrict=fr&maxResults=20');
await t('manganews','https://www.manga-news.com/index.php/manga/Spy-X-Family/vol-9');
await t('mangasearch','https://www.manga-news.com/index.php/recherche/?q=spy+x+family');
await t('bedetheque','https://www.bedetheque.com/search/tout?RechTexte=blacksad');
await t('bedetheque2','https://www.bedetheque.com/serie-1159-BD-Blacksad.html');
await t('nautiljon','https://www.nautiljon.com/mangas/spy+x+family/volume-9,1086455.html');
await t('ol','https://openlibrary.org/search.json?q=blacksad&language=fre&limit=5');
await t('bubble','https://www.bubblebd.com/recherche?q=blacksad');
await t('decitre','https://www.decitre.fr/rechercher/result?q=blacksad');
await t('bdfugue','https://www.bdfugue.com/catalogsearch/result/?q=blacksad');
fs.writeFileSync('probe.json',JSON.stringify(out,null,1));
