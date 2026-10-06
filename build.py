#!/usr/bin/env python3
"""Génère index.html (version publique en lecture seule de My Bookshelf).

Usage : python3 build.py <page.html> <dossier_snapshot> [index.html]
  - page.html : la page de l'artefact (source)
  - dossier_snapshot : contient avis/*.json, ajouts/*.json, suivi/*.json
    (un fichier JSON par document de la base de l'artefact)
Le fichier n'est réécrit que si les données ou la page ont changé.
"""
import sys, os, re, json, glob, time

def load(coll_dir):
    out = {}
    for f in sorted(glob.glob(os.path.join(coll_dir, "*.json"))):
        with open(f, encoding="utf-8") as fh:
            out[os.path.splitext(os.path.basename(f))[0]] = json.load(fh)
    return out

def main():
    page, snap = sys.argv[1], sys.argv[2]
    dest = sys.argv[3] if len(sys.argv) > 3 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "index.html")
    html = open(page, encoding="utf-8").read()
    if "<script data-app>" not in html:
        sys.exit("ERREUR : script principal (data-app) introuvable dans la page")
    # retire tout script ajouté par la plateforme et les balises meta http-equiv / base
    html = re.sub(r"<script(?![^>]*\bdata-app\b)[^>]*>.*?</script>", "", html, flags=re.S | re.I)
    html = re.sub(r"<meta[^>]*http-equiv[^>]*>|<base[^>]*>", "", html, flags=re.I)
    data = {k: load(os.path.join(snap, k)) for k in ("avis", "ajouts", "suivi", "medias")}
    body = json.dumps(data, ensure_ascii=False, sort_keys=True)
    # compare avec la version précédente (hors date) pour éviter les commits inutiles
    if os.path.exists(dest):
        old = open(dest, encoding="utf-8").read()
        m = re.search(r"<!--sig:([0-9a-f]+)-->", old)
        import hashlib
        sig = hashlib.sha1((html + body).encode()).hexdigest()
        if m and m.group(1) == sig:
            print("Aucun changement"); return
    import hashlib
    sig = hashlib.sha1((html + body).encode()).hexdigest()
    data["date"] = int(time.time() * 1000)
    snap_js = "<script>window.MBS_SNAPSHOT=" + json.dumps(data, ensure_ascii=False).replace("<", "\\u003c") + ";</script>"
    html = html.replace("<script data-app>", snap_js + "\n<script data-app>", 1)
    if not html.lstrip().lower().startswith("<!doctype"):
        html = "<!doctype html>\n" + html
    html = html.rstrip() + "\n<!--sig:" + sig + "-->\n"
    open(dest, "w", encoding="utf-8").write(html)
    print("index.html mis à jour :", {k: len(v) for k, v in data.items() if k != "date"})

if __name__ == "__main__":
    main()
