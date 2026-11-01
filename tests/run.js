'use strict';
/* Futtatás: node tests/run.js   (nincs külső függőség). Logikát és kivételeket ellenőriz – megjelenést, érintést, hangot nem. */
const {boot}=require('./harness');
let pass=0,fail=0;const only=process.argv[2];let grp='';
const group=n=>{grp=n;console.log('\n'+n)};
function t(name,fn){if(only&&!grp.toLowerCase().includes(only.toLowerCase()))return;try{fn();pass++;console.log('  ✓',name)}catch(e){fail++;console.log('  ✗',name,'→',e.message)}}
const eq=(a,b,m)=>{if(JSON.stringify(a)!==JSON.stringify(b))throw new Error((m||'')+' várt: '+JSON.stringify(b)+' kapott: '+JSON.stringify(a))};
const ok=(c,m)=>{if(!c)throw new Error(m||'feltétel hamis')};
const legacy=(x={})=>JSON.stringify(Object.assign({cash:123456,depth:0,st:'idle',fuel:250,hp:93,u:{d:1,h:1,t:1,c:1},cg:{'Kőszén':12.5},fin:{},disc:{'Római ezüstdénár':1},max:812,t:1.7e12,log:['régi'],set:{vol:30,sc:600,auto:0},won:0,x:0,tr:[],tn:[[0,0,0,812]]},x));

group('A) Mentés: betöltés, migráció, védelem');
t('régi (verziótlan) mentés változatlanul betöltődik, v=aktuális',()=>{const raw=legacy(),g=boot({store:{drillup1:raw}}),S=g.T.S;
 eq(S.cash,123456);eq(S.u,{d:1,h:1,t:1,c:1,f:0,g:0});eq(S.set.vol,30);eq(S.set.sc,600);eq(S.set.auto,0);eq(S.cg['Kőszén'],12.5);eq(S.max,812);eq(S.tn,[[0,0,0,812]]);eq(S.v,g.sb.Save.VER);eq(S.set.q,'a');eq(S.gf,60);eq(S.gon,1);eq(S.en,0)});
t('migráció előtt másolat készül (drillup1_pre_v1) és nem íródik felül',()=>{const raw=legacy(),g=boot({store:{drillup1:raw}});eq(g.store.drillup1_pre_v1,raw);
 g.store.drillup1=legacy({cash:5});const g2=boot({store:g.store});eq(g2.store.drillup1_pre_v1,raw,'az első másolat marad')});
t('sérült főmentés → tartalék betöltése, a sérült megőrzése',()=>{const g=boot({store:{drillup1:'{rossz',drillup1_bak:legacy({cash:777})}});eq(g.T.S.cash,777);eq(g.store.drillup1_corrupt,'{rossz');eq(g.sb.Save.info.src,'drillup1_bak')});
t('minden sérült → tiszta kezdőállapot, nincs kivétel',()=>{const g=boot({store:{drillup1:'xx',drillup1_bak:'yy'}});eq(g.T.S.cash,250000)});
t('értékek ellenőrzése: kivett/rossz mezők javítása',()=>{const raw=legacy({u:{d:99,h:-4,t:'x',c:1.5},st:'zzz',fuel:null,depth:-5,cg:{'Nincs ilyen':5,'Kőszén':-3,'Homok':7},fin:{'x':2},tr:'rossz',tn:[[1,2]],hp:500,log:[1,'ok']});
 const g=boot({store:{drillup1:raw}}),S=g.T.S;eq(S.u.d,g.T.D.length-1);eq(S.u.h,0);eq(S.u.t,0);eq(S.u.c,0);eq(S.st,'idle');eq(S.fuel,300);eq(S.depth,0);eq(S.cg,{'Homok':7});eq(S.fin,{});eq(S.tr,[]);eq(S.tn,[]);eq(S.hp,100);eq(S.log,['ok'])});
t('mélyen lévő gép mentése visszaúttal pótlódik',()=>{const g=boot({store:{drillup1:legacy({depth:300,tr:[]})}});eq(g.T.S.tr,[['D',300]])});
t('mentés kihagyja a sérült (NaN) állapotot, a főmentés érintetlen',()=>{const g=boot();g.sb.Save.save(g.T.S);const before=g.store.drillup1;g.T.S.cash=NaN;eq(g.sb.Save.save(g.T.S),false);eq(g.store.drillup1,before)});
t('tárhely-hiba nem dob kivételt, majd felépül',()=>{const g=boot();g.st.quota=true;eq(g.sb.Save.save(g.T.S),false);ok(g.sb.Save.err);g.st.quota=false;eq(g.sb.Save.save(g.T.S),true);eq(g.sb.Save.err,null)});
t('gördülő tartalék: 10 perc után frissül, az előző a bak2-be kerül',()=>{const g=boot();g.T.S.cash=111;g.sb.Save.save(g.T.S);const b1=g.store.drillup1_bak;ok(b1);g.advance(11*60e3);g.T.S.cash=222;g.sb.Save.save(g.T.S);eq(g.store.drillup1_bak2,b1);eq(JSON.parse(g.store.drillup1_bak).cash,222)});
t('export → import oda-vissza azonos, a régi főmentés pre_import alá kerül',()=>{const g=boot();g.T.S.cash=777;g.T.S.u.d=3;const str=g.sb.Save.exportStr(g.T.S);
 const g2=boot({store:{drillup1:legacy({cash:5})}});eq(g2.sb.Save.importStr(str,g2.T.sanitizeSave,g2.T.init),null);const o=JSON.parse(g2.store.drillup1);eq(o.cash,777);eq(o.u.d,3);eq(o.v,g2.sb.Save.VER);ok(g2.store.drillup1_pre_import)});
t('érvénytelen import elutasítva, a mentés változatlan',()=>{const g=boot({store:{drillup1:legacy()}});const b=g.store.drillup1;ok(g.sb.Save.importStr('nem json',g.T.sanitizeSave,g.T.init));ok(g.sb.Save.importStr('{"a":1}',g.T.sanitizeSave,g.T.init));eq(g.store.drillup1,b)});
t('a save() esemény kisül és ment',()=>{const g=boot();let n=0;g.sb.on('save',()=>n++);g.T.save();eq(n,1);ok(g.store.drillup1)});

group('B) Eseménykampók');
t('step/sim/tick/frame/world.back/world.front/hud mind kisül, helyes adattal',()=>{const g=boot();const c={};['step','sim','tick','frame','world.back','world.front','hud','save'].forEach(e=>g.sb.on(e,a=>{c[e]=(c[e]||0)+1;c['a_'+e]=a}));
 g.engineOn();g.T.S.fuel=300;g.T.go('D');g.frames(90);g.T.tick();g.T.save();
 for(const e of['step','sim','tick','frame','world.back','world.front','hud','save'])ok(c[e]>0,e+' nem sült ki');
 ok(typeof c['a_step']==='number'&&typeof c['a_sim']==='number'&&typeof c['a_frame']==='number');const V=c['a_world.back'];ok(typeof V.SX==='function'&&typeof V.cx==='number'&&V.K===10&&typeof V.lamp==='function'&&Array.isArray(V.GL))});
t('a hibás figyelő nem állítja le a játékot, a hiba látszik a hibakeresőben',()=>{const g=boot();g.sb.on('step',()=>{throw new Error('teszt')});g.engineOn();g.T.S.fuel=300;g.T.go('R');const e=g.frames(60);ok(g.T.S.x>0,'a gép mozdult');ok(e.some(m=>/step: teszt/.test(m)),'a hiba nem látszik')});

group('C) Teljesítmény-szabályozó');
t('lassú képkockáknál lejjebb vált, utána nem pattog vissza',()=>{const g=boot(),G=g.sb.Gov;G.init('a');eq(G.q,2);for(let i=0;i<80;i++)G.frame(40);eq(G.q,1,'3,2 mp után egy fokozat');for(let i=0;i<300;i++)G.frame(40);eq(G.q,0);for(let i=0;i<300;i++)G.frame(16.7);eq(G.q,0,'60 mp-ig tilos felfelé')});
t('hosszú gyors futás után felvált',()=>{const g=boot(),G=g.sb.Gov;G.init('a');for(let i=0;i<200;i++)G.frame(40);const q0=G.q;for(let i=0;i<6000;i++)G.frame(16.7);ok(G.q>q0)});
t('kézi mód állandó, értékek: részecske 90/160/260, DPR-sapka 1/1,5/2',()=>{const g=boot(),G=g.sb.Gov;G.setMode('0');eq([G.parts(),G.dpr(3),G.dust()],[90,1,false]);for(let i=0;i<500;i++)G.frame(60);eq(G.q,0);G.setMode('1');eq([G.parts(),G.dpr(3)],[160,1.5]);G.setMode('2');eq([G.parts(),G.dpr(3),G.dpr(1)],[260,2,1])});
t('a beállítás a mentésbe kerül és visszatölt',()=>{const g=boot();g.T.S.set.q='1';g.sb.Gov.setMode('1');g.T.save();const g2=boot({store:g.store});eq(g2.T.S.set.q,'1');eq(g2.sb.Gov.q,1)});
t('alacsony minőségnél kevesebb részecske keletkezik',()=>{const run=q=>{const g=boot();g.engineOn();g.sb.Gov.setMode(String(q));const S=g.T.S;S.depth=50;S.tr=[['D',50]];S.tn=[[0,0,0,50]];S.fuel=500;g.T.go('D');g.frames(240);return g.T.pr.length};ok(run(0)<run(2),'Q0 < Q2')});

group('D) Regresszió: a meglévő játék működik');
t('koppintás: elindul és tart; újabb koppintás megállít',()=>{const g=boot(),T=g.T;g.engineOn();T.S.set.sc=60;T.pd('D',g.ev);T.pu();g.frames(120);eq(T.S.st,'D');ok(T.S.depth>0.3,'mélyült');T.pd('D',g.ev);T.pu();g.frames(5);eq(T.S.st,'idle')});
t('nyomva tartás: amíg tartod megy, felengedésre megáll',()=>{const g=boot(),T=g.T;g.engineOn();T.S.set.sc=60;T.pd('R',g.ev);g.runTimers();g.frames(60);eq(T.S.st,'R');ok(T.hold&&T.hold.mom);T.pu();g.frames(3);eq(T.S.st,'idle')});
t('irányváltás új nyomással',()=>{const g=boot(),T=g.T;T.pd('L',g.ev);T.pu();g.frames(30);T.pd('R',g.ev);eq(T.S.st,'R');T.pu()});
t('kevés üzemanyag: automatikus tankolás indulás előtt',()=>{const g=boot(),T=g.T;g.engineOn();T.S.fuel=3;g.T.go('D');g.frames(60);eq(T.S.st,'D');ok(T.S.fuel>100);ok(T.S.cash<250000)});
t('nincs pénz: nem indul, érthető üzenet',()=>{const g=boot(),T=g.T;T.S.fuel=3;T.S.cash=0;T.go('D');eq(T.S.st,'idle');ok(g.toasts.some(m=>/Kevés az üzemanyag/.test(m)))});
t('kemény kőzet: gránit előtt megáll 0-s fejjel, 1-es fejjel halad',()=>{const g=boot(),T=g.T,S=T.S;g.engineOn();S.depth=3999.995;S.tr=[['D',3999.995]];S.fuel=800;S.set.auto=0;S.set.sc=1;T.go('D');g.frames(300);eq(S.st,'idle');ok(S.depth>3999.99&&S.depth<4000.001);S.u.f=1;T.go('D');g.frames(200);eq(S.st,'D');ok(S.depth>4000)});
t('vészüzemanyag: üres tartálynál a raktárból éget',()=>{const g=boot(),T=g.T,S=T.S;g.engineOn();S.depth=10;S.tr=[['D',10]];S.fuel=0;S.cg={'Kőszén':50};T.go('D');g.frames(30);ok(S.fuel>0);ok(S.cg['Kőszén']<50);eq(S.st,'D')});
t('gyors hazatérés 6 mp alatt hazaér',()=>{const g=boot(),T=g.T,S=T.S;g.engineOn();S.depth=1200;S.x=300;S.tr=[['R',300],['D',1200]];S.fuel=800;S.cg={};T.go('H');let f=0;for(;f<600&&S.st=='H';f++)g.frames(1);ok(f*16.7<6000,'túl lassú: '+f);eq(S.depth,0);eq(S.x,0)});
t('mélyen kifogyó üzemanyag: a gép elvész, a pénz megmarad',()=>{const g=boot(),T=g.T,S=T.S;g.engineOn();S.depth=100;S.tr=[['D',100]];S.fuel=0.0001;S.cg={};S.set.auto=0;S.cash=4242;T.go('U');g.frames(400);ok(S.depth==0||S.st=='idle');eq(S.cash,4242)});
t('rajzolás: minden meghajtás/páncél/fúrófej-szinten kivétel nélkül',()=>{const g=boot(),T=g.T,S=T.S;let errs=[];for(let k=0;k<7;k++){S.u.d=k;S.u.h=Math.min(5,k);S.u.f=Math.min(5,k);errs=errs.concat(g.frames(6))}eq(errs,[])});
t('rajzolás: mélyen, alagúttal, lefelé és vízszintesen fúrva',()=>{const g=boot(),T=g.T,S=T.S;S.depth=500;S.tn=[[0,0,0,500],[0,500,80,500]];S.x=40;S.tr=[['D',500],['R',40]];S.fuel=500;S.set.sc=60;let e=[];for(const d of['R','L','D','U']){T.go(d);e=e.concat(g.frames(90))}eq(e,[])});
t('főmenü és hős-jelenet: 200 képkocka, kivétel nélkül; a menü alatt a játékrajz szünetel',()=>{const g=boot({menu:true}),T=g.T;let bad=0;for(let i=0;i<200;i++){g.advance(17);try{T.hero(g.mc,i*17)}catch(e){bad++}}eq(bad,0);T.showMM();T.showMM('set');eq(g.frames(10),[])});
t('panelek (adatok/raktár/fúrófej) szövege felépül',()=>{const g=boot();for(const k of['info','store','head']){g.T.sheetT=k;const h=g.T.sheetHTML();ok(typeof h==='string'&&h.length>40,k)}});
t('base.js nélkül is elindul és játszható (tartalék ágak)',()=>{const g=boot({skip:['js/base.js']});ok(!g.sb.Save&&!g.sb.Gov);g.engineOn();g.T.S.fuel=300;g.T.go('R');eq(g.frames(60),[]);ok(g.T.S.x>0);g.T.save();ok(g.store.drillup1)});


group('E) 1. fázis: motor, áramfejlesztő, blueprint');
const base0=(o={})=>{const g=boot(o);g.T.S.set.sc=1;return g};
t('motor: kikapcsolva nem mozdul; az irány gomb automatikusan beindítja, ~2-4 mp után halad',()=>{const g=base0(),T=g.T,S=T.S;eq(S.en,0);S.fuel=300;T.go('R');g.frames(30);eq(S.x,0,'0,5 mp-nél még áll');eq(S.en,1);let f=30;for(;f<400&&!g.sb.ENG.ready();f++)g.frames(1);ok(f>90&&f<300,'felpörgés ideje: '+(f*16.7/1000).toFixed(1)+' mp');g.frames(120);ok(S.x>1,'halad')});
t('motor: kézi kapcsoló be/ki, kikapcsoláskor megáll a gép',()=>{const g=base0(),T=g.T,S=T.S;g.sb.PW.toggleEng();eq(S.en,1);g.frames(250);ok(g.sb.ENG.ready());T.go('R');g.frames(30);g.sb.PW.toggleEng();eq(S.en,0);eq(S.st,'idle');g.frames(150);eq(g.sb.ENG.rpm,0)});
t('motor: üresjáratban fogyaszt, 120 mp után magától leáll',()=>{const g=base0(),T=g.T,S=T.S;g.engineOn();S.fuel=300;g.sb.ENG.ld=.08;g.advance(130e3);T.sim();eq(S.en,0);const burn=300-S.fuel;ok(burn>.5&&burn<1.2,'üresjárati fogyasztás: '+burn.toFixed(2)+' kg');ok(S.log.some(m=>/üresjárati/.test(m)))});
t('motor: nincs üzemanyag → nem indul, érthető üzenet',()=>{const g=base0(),T=g.T,S=T.S;S.fuel=0;eq(g.sb.PW.toggleEng(),undefined);eq(S.en,0);ok(g.toasts.some(m=>/Nincs üzemanyag/.test(m)))});
t('terhelés: a kemény kőzet terhelőbb mint a talaj',()=>{const ld=d=>{const g=base0(),T=g.T,S=T.S;g.engineOn();S.fuel=800;S.depth=d;S.tr=[['D',d]];T.go('D');g.frames(200);return g.sb.ENG.ld};const a=ld(10),b=ld(1000);ok(b>a+.15,'talaj '+a.toFixed(2)+' / kőzet '+b.toFixed(2))});
t('fogyasztás: puha kőzetben kevesebb üzemanyag megy el másodpercenként',()=>{const burn=d=>{const g=base0(),T=g.T,S=T.S;g.engineOn();S.fuel=800;S.depth=d;S.tr=[['D',d]];T.go('D');g.frames(60);const f0=S.fuel;g.frames(300);return(f0-S.fuel)/(300*.0167)};const a=burn(10),b=burn(1000);ok(a<b*.9,'talaj '+a.toFixed(3)+' < kőzet '+b.toFixed(3)+' kg/s')});
t('generátor: fogyasztás időarányos (30 kW, 25 kW igény → ~37,5 kg/óra)',()=>{const g=base0(),T=g.T,S=T.S;S.gon=1;S.gf=60;g.sb.GEN.step(3600);ok(Math.abs(60-S.gf-37.5)<1.5,'fogyott: '+(60-S.gf).toFixed(1))});
t('generátor: be/ki kapcsoló, üres tankkal nem kapcsol be',()=>{const g=base0(),T=g.T,S=T.S;S.gon=0;S.gf=0;g.sb.GEN.toggle();eq(S.gon,0);ok(g.toasts.some(m=>/Üres a generátor/.test(m)));S.gf=10;g.sb.GEN.toggle();eq(S.gon,1);g.sb.GEN.toggle();eq(S.gon,0)});
t('generátor: bekapcsolva ~7% gyorsabb fúrás (tehermentesíti a motort)',()=>{const g=base0(),T=g.T,S=T.S;S.depth=1000;S.gf=60;S.gon=0;const a=T.calc().v;S.gon=1;const b=T.calc().v;ok(b/a>1.05&&b/a<1.09,'arány '+(b/a).toFixed(3))});
t('generátor: elfogyó üzemanyag leállítja',()=>{const g=base0(),T=g.T,S=T.S;S.gon=1;S.gf=.0005;g.sb.GEN.step(100);eq(S.gon,0);eq(S.gf,0);ok(S.log.some(m=>/generátor üzemanyaga elfogyott/.test(m)))});
t('generátor: fúrás közben fogy a tank (esemény-kampó)',()=>{const g=base0(),T=g.T,S=T.S;g.engineOn();S.fuel=800;S.gon=1;S.gf=60;S.set.sc=60;T.go('D');g.frames(200);ok(S.gf<60,'a tank nem fogyott')});
t('generátor: fejlesztés (üzemanyagtípus-váltás visszatérít, tankot ürít)',()=>{const g=base0(),T=g.T,S=T.S;S.cash=1e7;S.gf=100;const c0=S.cash;T.buy('g');eq(S.u.g,1);eq(S.gf,0);eq(S.gon,0);eq(Math.round(S.cash),Math.round(c0-2.5e5+100*40*.8))});
t('gép elvesztésekor a felszíni generátor szintje megmarad, a motor leáll',()=>{const g=base0(),T=g.T,S=T.S;S.u.g=2;S.u.d=3;S.en=1;S.depth=100;T.strand('teszt');eq(S.u.g,2);eq(S.u.d,0);eq(S.en,0);eq(S.depth,0)});
t('mentés-migráció: 2-es mentés → generátor- és motor-mezők, hibás szint levágva',()=>{const g=boot({store:{drillup1:legacy({v:2,u:{d:1,h:1,t:1,c:1,f:0}})}});eq([g.T.S.u.g,g.T.S.gf,g.T.S.gon,g.T.S.en],[0,60,1,0]);eq(g.T.S.v,g.sb.Save.VER);const g2=boot({store:{drillup1:legacy({v:2,u:{d:1,h:1,t:1,c:1,f:0,g:99},gf:9999,gon:1})}});eq(g2.T.S.u.g,4);ok(g2.T.S.gf<=8.0001)});
t('világítás: a generátor ellátottsága (0 ha ki/üres, <1 ha túlterhelt)',()=>{const g=base0(),T=g.T,S=T.S,G=g.sb.GEN;S.gon=0;eq(G.sat(),0);S.gon=1;S.gf=10;ok(G.sat()>0);S.depth=1000;S.mode='drill';ok(G.sat()<1,'a Gőzdinamó 30 kW-ja kevés a mély fúráshoz');S.u.g=2;ok(G.sat()===1)});
t('kezelőfelület: dock-kapcsolók, adatpanel',()=>{const g=base0(),T=g.T;T.go('idle');ok(/id="swM"/.test(g.sb.PW.dock())&&/id="swG"/.test(g.sb.PW.dock()));T.sheetT='info';const h=T.sheetHTML();ok(/Motor/.test(h)&&/Generátor/.test(h));g.sb.PW.live()});
t('indítási animáció + generátor-rajz: kivétel nélkül minden szinten és állapotban',()=>{const g=base0(),T=g.T,S=T.S;let e=[];S.fuel=500;T.go('D');e=e.concat(g.frames(260));for(let lv=0;lv<5;lv++){S.u.g=lv;for(const on of[0,1]){S.gon=on;S.gf=on?5:0;e=e.concat(g.frames(8))}}eq(e,[])});
t('blueprint: rajz, kiválasztás, százalék, fejlesztés a bázison',()=>{const g=base0(),T=g.T,S=T.S,B=g.sb.BP;S.cash=1e10;let h=B.html();ok(/<svg/.test(h)&&/Fejlesztés –/.test(h));for(const p of B.parts){B.sel=p.k;const html=B.html();ok(html.includes(p.n),p.k);const pc=B.pct(p);ok(pc>=0&&pc<=100)}
 B.pick('f');eq(B.sel,'f');const c0=S.cash,f0=S.u.f,price=T.HD[f0+1].at(-1);B.buy();eq(S.u.f,f0+1);eq(S.cash,c0-price)});
t('blueprint: a bázison kívül nem fejleszthető, a gomb letiltva és indoklással',()=>{const g=base0(),T=g.T,S=T.S,B=g.sb.BP;S.depth=50;B.sel='h';const h=B.html();ok(/Fejleszteni csak a bázison/.test(h)&&/disabled/.test(h));const c0=S.cash;B.buy();eq(S.cash,c0)});
t('blueprint: maximális szinten nincs vásárlás, 100%',()=>{const g=base0(),T=g.T,S=T.S,B=g.sb.BP;S.u.h=T.H.length-1;B.sel='h';const h=B.html();ok(/Maximális szint/.test(h));eq(B.pct(B.parts.find(p=>p.k==='h')),100)});

console.log(`\nÖsszesen: ${pass} sikeres, ${fail} sikertelen`);process.exit(fail?1:0);
