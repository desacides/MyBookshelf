import json,re,unicodedata
R=json.load(open('recs.json')); B=json.load(open('../biblio/bdlist.json'))
def nz(s): return unicodedata.normalize('NFKD',s or '').encode('ascii','ignore').decode().lower().replace('&amp;','et')
def yr(p):
    m=re.findall(r'(?:19|20)\d\d',p); return int(m[0]) if m else 0
def num(r):
    for x in r['nums']:
        m=re.fullmatch(r'\s*(?:vol(?:ume)?\.?|tome)?\s*(\d+)\s*',nz(x))
        if m: return m.group(1)
    m=re.search(r'(?:- t|tome |\. )(\d+)\b',nz(r['title']))
    return m.group(1) if m else None
C={ # serie : (bnfkey, include regex, exclude regex, years)
'Pokémon – La Grande Aventure : Rouge, Bleu, Jaune':('pokemon',r'^pokemon la grande aventure \|\|',r'complete|illustr|1-3',(2014,2015)),
'Pokémon – Or et Argent':('pokemon',r'or et argent',r'complete|heart',(2016,2016)),
'Pokémon – Rubis et Saphir':('pokemon',r'rubis et saphir',r'complete|omega',(2014,2016)),
'Pokémon – Rouge Feu et Vert Feuille / Émeraude':('pokemon',r'rouge feu|emeraude',r'complete',(2017,2017)),
'Pokémon – Diamant et Perle / Platine':('pokemon',r'diamant|platine',r'complete',(2018,2019)),
'Pokémon – Or HeartGold et Argent SoulSilver':('pokemon',r'heart gold',r'',(2018,2018)),
'Pokémon – Noir et Blanc':('pokemon',r'^pokemon noir et blanc',r'',(2011,2014)),
'Pokémon – Noir 2 et Blanc 2':('pokemon',r'noir 2',r'',(2021,2021)),
'Pokémon – X et Y':('pokemon',r'^pokemon xy',r'',(2015,2017)),
'Pokémon – Rubis Oméga et Saphir Alpha':('pokemon',r'omega',r'',(2024,2024)),
'Pokémon – Soleil et Lune':('pokemon',r'soleil et lune',r'',(2017,2020)),
'Pokémon – Épée et Bouclier':('pokemon',r'epee et bouclier',r'',(2021,2024)),
'Pokémon – Écarlate et Violet':('pokemon',r'ecarlate et violet',r'',(2024,2026)),
'Pokémon Horizon':('pokemon',r'horizon',r'',(2019,2019)),
'Mashle':('mashle',r'mashle',r'roman|1-3|tomes',(2021,2024)),
'Spy×Family':('spy',r'spy x family',r'coloriage|roman|guidebook|1-3|tomes',(2020,2026)),
'Power Gamer Adventure':('pga',r'power gamer',r'',(2021,2021)),
'Final Fantasy – Lost Stranger':('lost',r'lost stranger',r'',(2018,2026)),
'GTO – Great Teacher Onizuka':('gto',r'^gto great teacher onizuka \|\| gto\.',r'',(2001,2004)),
'Beck':('beck',r'^beck \|\|',r'mongolian|perfect',(2004,2011)),
}
res={}
for v in B:
    c=C.get(v['serie'])
    if not c: continue
    k,inc,exc,(y0,y1)=c
    want=re.sub(r'\D','',v['n']) or '1'
    cands=[r for r in R[k] if re.search(inc,nz(r['title'])) and not (exc and re.search(exc,nz(r['title'])+' '+' '.join(r['nums']))) and y0<=yr(r['pub'])<=y1 and num(r)==want]
    if v['serie']=='Pokémon – Diamant et Perle / Platine' and want=='5': pass
    if cands: res[v["vid"]]=[c["isbn"] for c in cands]
print(len(res))
miss=[ (v['serie'],v['n'],v['t']) for v in B if v['vid'] not in res]
for m in miss: print(m)
json.dump(res,open('isbn_auto.json','w'),indent=0)
