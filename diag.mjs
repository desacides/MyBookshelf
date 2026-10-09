import fs from 'fs';
const K="f66e52017e39560a0e36d90d9af2c200";
const F=JSON.parse(fs.readFileSync('films.json','utf8'));
const norm=x=>String(x||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/&/g," et ").replace(/[^a-z0-9]+/g," ").trim();
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function J(u){ for(let k=0;k<4;k++){ try{ const r=await fetch(u); if(r.status===429){await sleep(1500);continue;} return await r.json(); }catch(e){ await sleep(800);} } return {}; }
const out=[];
for(const f of F){
  const title=f.title, year=f.year; let id=f.tmdbId, cands=[];
  if(!id){
    const tries=[title, title.split(/ [-–:] |, /)[0]].filter((x,i,a)=>x && a.indexOf(x)===i);
    let best=null;
    for(const q of tries){
      const r=await J(`https://api.themoviedb.org/3/search/movie?api_key=${K}&language=fr-FR&query=${encodeURIComponent(q)}`);
      (r.results||[]).forEach((x,i)=>{
        const exact=[x.title,x.original_title].some(t=>norm(t)===norm(q))||[x.title,x.original_title].some(t=>norm(t)===norm(title));
        const ry=(x.release_date||"").slice(0,4), dy=year&&ry?Math.abs(+ry-+year):99;
        const sc=(exact?10:0)+(dy===0?6:dy===1?4:0)+(1-i/20);
        if(!best||sc>best.sc) best={id:x.id,sc,ok:exact||dy<=1};
        if(cands.length<4 && !cands.find(c=>c.id===x.id)) cands.push({id:x.id,t:x.title,o:x.original_title,y:ry,p:!!x.poster_path});
      });
    }
    if(best&&best.ok&&best.sc>=6) id=best.id;
  }
  const row={vid:f.vid,title,year,auteur:f.auteur,override:!!f.tmdbId};
  if(id){
    const d=await J(`https://api.themoviedb.org/3/movie/${id}?api_key=${K}&language=fr-FR&append_to_response=credits`);
    row.id=id; row.t=d.title; row.o=d.original_title; row.ol=d.original_language; row.y=(d.release_date||"").slice(0,4); row.poster=!!d.poster_path;
    row.dir=((d.credits&&d.credits.crew)||[]).filter(c=>c.job==="Director").map(c=>c.name).join(", ");
  } else row.cands=cands;
  out.push(row);
}
fs.writeFileSync('report.json',JSON.stringify(out));
console.log("done",out.length,out.filter(r=>!r.id).length);
