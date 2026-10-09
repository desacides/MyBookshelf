import fs from 'fs';
const K="f66e52017e39560a0e36d90d9af2c200";
const Q=JSON.parse(fs.readFileSync('q.json','utf8')); const out=[];
for(const [q,y] of Q){
  const r=await (await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${K}&language=fr-FR&query=${encodeURIComponent(q)}`)).json();
  const res=[];
  for(const x of (r.results||[]).slice(0,4)){
    const d=await (await fetch(`https://api.themoviedb.org/3/movie/${x.id}?api_key=${K}&language=fr-FR&append_to_response=credits`)).json();
    res.push({id:x.id,t:d.title,o:d.original_title,y:(d.release_date||"").slice(0,4),p:!!d.poster_path,dir:(d.credits.crew||[]).filter(c=>c.job==="Director").map(c=>c.name).join(", "),pop:d.popularity});
  }
  out.push({q,y,res});
}
fs.writeFileSync('q_report.json',JSON.stringify(out));
