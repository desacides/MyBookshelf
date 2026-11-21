import json,re,unicodedata
d=json.load(open('bnf.json'))
def nz(s): return unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()
def subs(s):
    o={}
    for p in s.split(' | '):
        if ':' in p: k,v=p.split(':',1); o.setdefault(k,[]).append(v)
    return o
recs={}
for k,v in d.items():
    L=[]
    for r in v:
        isb=[subs(x).get('a',[None])[0] for x in r.get('010',[])]; isb=[re.sub('[^0-9X]','',i) for i in isb if i]
        if not isb: continue
        t=subs(r['200'][0]) if r.get('200') else {}
        title=' '.join(t.get('a',[])+t.get('e',[])+t.get('i',[]))
        nums=t.get('h',[])
        for f in ('225','461'):
            for x in r.get(f,[]):
                s=subs(x); nums+=s.get('v',[]); title+=' || '+' '.join(s.get('a',[])+s.get('t',[]))
        pub=' '.join(' '.join(subs(x).get('c',[])+subs(x).get('d',[])) for x in r.get('210',[])+r.get('214',[]))
        L.append(dict(isbn=isb[0],title=title,nums=nums,pub=pub,coll=bool(re.search(r'collector|perfect|luxe|coffret|tomes? \d+ (a|à)',nz(title)+' '+nz(str(r.get('200')))))))
    recs[k]=L
json.dump(recs,open('recs.json','w'),ensure_ascii=False,indent=0)
for k,L in recs.items():
    print('==',k,len(L))
    for r in L: print('   ',r['isbn'],r['nums'],r['title'][:110],'|',r['pub'][:30],'C' if r['coll'] else '')
