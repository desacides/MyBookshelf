import fs from 'fs';
const Q={
pokemon:'bib.title all "pokemon" and bib.publisher all "kurokawa"',
mashle:'bib.author all "komoto"',
dix:'bib.title all "etaient dix" and bib.author all "nikaido"',
spy:'bib.title all "spy family" and bib.publisher all "kurokawa"',
pga:'bib.title all "power gamer"',
lost:'bib.title all "lost stranger"',
gto:'bib.author all "fujisawa" and bib.publisher all "pika"',
beck:'bib.title all "beck" and bib.author all "sakuishi"',
eorzea:'bib.title all "eorzea"',
beast:'bib.title all "medicinal herb"',
kaam:'bib.title all "kaamelott" and bib.author all "dupre"',
blacksad:'bib.title all "blacksad"',
litteul:'bib.author all "coyote" and bib.title all "kevin"',
trois:'bib.title all "trois corps" and bib.author all "liu"',
valette:'bib.author all "valette philippe"',
fabcaro:'bib.author all "fabcaro"',
pulsions:'bib.title all "pulsions" and bib.author all "khojandi"',
marsault:'bib.author all "marsault"',
bataclan:'bib.title all "mon bataclan"',
alcide:'bib.title all "alcide"',
jose:'bib.title all "petit jose"',
fables:'bib.title all "fables" and bib.publisher all "urban"',
wolf:'bib.title all "wolf among us"',
sikc:'bib.title all "something is killing"',
nice:'bib.title all "nice house"',
imposter:'bib.title all "batman imposter"',
lis:'bib.title all "life is strange" and bib.publisher all "urban"',
rick:'bib.title all "boite caca"',
picsou:'bib.title all "jeunesse de picsou"',
};
const out={};
for(const [k,q] of Object.entries(Q)){
 out[k]=[];
 for(let start=1;start<400;start+=50){
  let x='';
  try{ x=await (await fetch(`https://catalogue.bnf.fr/api/SRU?version=1.2&operation=searchRetrieve&query=${encodeURIComponent(q)}&recordSchema=unimarcxchange&maximumRecords=50&startRecord=${start}`)).text(); }catch(e){out[k].push({err:e.message});break;}
  const recs=x.split(/<srw:record>/).slice(1);
  for(const r of recs){
   const f={};
   for(const m of r.matchAll(/<mxc:datafield[^>]*tag="(\d+)"[^>]*>([\s\S]*?)<\/mxc:datafield>/g)){
     if(!['010','200','225','461','210','214','700','702'].includes(m[1])) continue;
     const subs=[...m[2].matchAll(/code="(.)">([^<]*)</g)].map(s=>s[1]+':'+s[2]).join(' | ');
     (f[m[1]]=f[m[1]]||[]).push(subs);
   }
   out[k].push(f);
  }
  const tot=+(x.match(/numberOfRecords>(\d+)/)||[])[1]||0;
  if(start+50>tot) break;
 }
}
fs.writeFileSync('bnf.json',JSON.stringify(out));
