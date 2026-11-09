// A játék statikus fájljainak bemásolása a natív csomagba (mobile/www).
// Forrás: a sw.js gyorsítótár-listája (A) – így új modulnál csak a sw.js-t kell bővíteni.
const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'..'),OUT=path.join(__dirname,'www');
const sw=fs.readFileSync(path.join(ROOT,'sw.js'),'utf8');
const m=sw.match(/A=\[([^\]]*)\]/);if(!m)throw new Error('sw.js: az A lista nem található');
const files=JSON.parse('['+m[1].replace(/'/g,'"')+']').filter(f=>f&&f!=='./');
fs.rmSync(OUT,{recursive:true,force:true});
for(const f of files){const src=path.join(ROOT,f),dst=path.join(OUT,f);
 if(!fs.existsSync(src))throw new Error('Hiányzó fájl: '+f);
 fs.mkdirSync(path.dirname(dst),{recursive:true});fs.copyFileSync(src,dst)}
// a webes index.html-ben hivatkozott, de a listában nem szereplő szkriptek ellenőrzése
const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const miss=[...html.matchAll(/<script src="([^"]+)"/g)].map(x=>x[1]).filter(s=>!files.includes(s));
for(const s of miss){if(!fs.existsSync(path.join(ROOT,s)))throw new Error('Hiányzó szkript: '+s);
 fs.mkdirSync(path.dirname(path.join(OUT,s)),{recursive:true});fs.copyFileSync(path.join(ROOT,s),path.join(OUT,s))}
console.log('www: '+(files.length+miss.length)+' fájl'+(miss.length?' (sw.js-ből hiányzott: '+miss.join(', ')+')':''));
