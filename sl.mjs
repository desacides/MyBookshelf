import fs from 'fs';
const UA={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36','Accept':'text/html,application/xhtml+xml','Accept-Language':'en-US,en;q=0.9'};
const out=[];
for(const u of ['https://www.setlist.fm/search?query=nada+surf+lyon+2025','https://www.setlist.fm/setlist/nada-surf/2025/tavastia-helsinki-finland-4b46cfe6.html','https://api.setlist.fm/rest/1.0/search/setlists?artistName=nada%20surf&date=24-02-2025']){
 try{const r=await fetch(u,{headers:UA}); const t=await r.text(); out.push({u,s:r.status,len:t.length,head:t.slice(0,300),links:[...t.matchAll(/href="([^"]*\/setlist\/[^"]+\.html)"/g)].slice(0,15).map(m=>m[1]),songs:[...t.matchAll(/class="songLabel"[^>]*>([^<]+)</g)].map(m=>m[1])});}catch(e){out.push({u,err:e.message})}
}
fs.writeFileSync('sl.json',JSON.stringify(out,null,1));
