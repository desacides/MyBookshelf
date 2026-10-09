import fs from 'fs';
const K="f66e52017e39560a0e36d90d9af2c200";
const I=JSON.parse(fs.readFileSync('ids.json','utf8')); const out={};
for(const {vid,id} of I){ if(!id) continue;
  for(let k=0;k<4;k++){ try{ const d=await (await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${K}&language=fr-FR&append_to_response=credits,alternative_titles`)).json();
    const en=((d.alternative_titles&&d.alternative_titles.titles)||[]).filter(t=>t.iso_3166_1==="US"||t.iso_3166_1==="GB").map(t=>t.title).slice(0,1);
    out[vid]={id, o:d.original_title, ol:d.original_language, t:d.title, en:en[0]||"", cast:((d.credits&&d.credits.cast)||[]).slice(0,8).map(c=>c.name), dir:((d.credits&&d.credits.crew)||[]).filter(c=>c.job==="Director").map(c=>c.name), p:!!d.poster_path}; break; }catch(e){ await new Promise(r=>setTimeout(r,1000)); } }
}
fs.writeFileSync('info.json',JSON.stringify(out)); console.log(Object.keys(out).length);
