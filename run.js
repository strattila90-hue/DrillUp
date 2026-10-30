'use strict';
/* Futtatás: node run.js   (nincs külső függőség). Logikát és kivételeket ellenőriz – megjelenést, érintést, hangot nem. */
const {boot}=require('./harness');
let pass=0,fail=0;const only=process.argv[2];let grp='';
const group=n=>{grp=n;console.log('\n'+n)};
function t(name,fn){if(only&&!grp.toLowerCase().includes(only.toLowerCase()))return;try{fn();pass++;console.log('  ✓',name)}catch(e){fail++;console.log('  ✗',name,'→',e.message)}}
const eq=(a,b,m)=>{if(JSON.stringify(a)!==JSON.stringify(b))throw new Error((m||'')+' várt: '+JSON.stringify(b)+' kapott: '+JSON.stringify(a))};
const ok=(c,m)=>{if(!c)throw new Error(m||'feltétel hamis')};
const legacy=(x={})=>JSON.stringify(Object.assign({cash:123456,depth:0,st:'idle',fuel:250,hp:93,u:{d:1,h:1,t:1,c:1},cg:{'Kőszén':12.5},fin:{},disc:{'Római ezüstdénár':1},max:812,t:1.7e12,log:['régi'],set:{vol:30,sc:600,auto:0},won:0,x:0,tr:[],tn:[[0,0,0,812]]},x));

group('A) Mentés: betöltés, migráció, védelem');
t('régi (verziótlan) mentés változatlanul betöltődik, v=2',()=>{const raw=legacy(),g=boot({store:{drillup1:raw}}),S=g.T.S;
 eq(S.cash,123456);eq(S.u,{d:1,h:1,t:1,c:1,f:0});eq(S.set.vol,30);eq(S.set.sc,600);eq(S.set.auto,0);eq(S.cg['Kőszén'],12.5);eq(S.max,812);eq(S.tn,[[0,0,0,812]]);eq(S.v,2);eq(S.set.q,'a')});
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
 const g2=boot({store:{drillup1:legacy({cash:5})}});eq(g2.sb.Save.importStr(str,g2.T.sanitizeSave,g2.T.init),null);const o=JSON.parse(g2.store.drillup1);eq(o.cash,777);eq(o.u.d,3);eq(o.v,2);ok(g2.store.drillup1_pre_import)});
t('érvénytelen import elutasítva, a mentés változatlan',()=>{const g=boot({store:{drillup1:legacy()}});const b=g.store.drillup1;ok(g.sb.Save.importStr('nem json',g.T.sanitizeSave,g.T.init));ok(g.sb.Save.importStr('{"a":1}',g.T.sanitizeSave,g.T.init));eq(g.store.drillup1,b)});
t('a save() esemény kisül és ment',()=>{const g=boot();let n=0;g.sb.on('save',()=>n++);g.T.save();eq(n,1);ok(g.store.drillup1)});

group('B) Eseménykampók');
t('step/sim/tick/frame/world.back/world.front/hud mind kisül, helyes adattal',()=>{const g=boot();const c={};['step','sim','tick','frame','world.back','world.front','hud','save'].forEach(e=>g.sb.on(e,a=>{c[e]=(c[e]||0)+1;c['a_'+e]=a}));
 g.T.S.fuel=300;g.T.go('D');g.frames(90);g.T.tick();g.T.save();
 for(const e of['step','sim','tick','frame','world.back','world.front','hud','save'])ok(c[e]>0,e+' nem sült ki');
 ok(typeof c['a_step']==='number'&&typeof c['a_sim']==='number'&&typeof c['a_frame']==='number');const V=c['a_world.back'];ok(typeof V.SX==='function'&&typeof V.cx==='number'&&V.K===10&&typeof V.lamp==='function'&&Array.isArray(V.GL))});
t('a hibás figyelő nem állítja le a játékot, a hiba látszik a hibakeresőben',()=>{const g=boot();g.sb.on('step',()=>{throw new Error('teszt')});g.T.S.fuel=300;g.T.S.eng=g.now()-5000;g.T.go('R');const e=g.frames(60);ok(g.T.S.x>0,'a gép mozdult');ok(e.some(m=>/step: teszt/.test(m)),'a hiba nem látszik')});

group('C) Teljesítmény-szabályozó');
t('lassú képkockáknál lejjebb vált, utána nem pattog vissza',()=>{const g=boot(),G=g.sb.Gov;G.init('a');eq(G.q,2);for(let i=0;i<80;i++)G.frame(40);eq(G.q,1,'3,2 mp után egy fokozat');for(let i=0;i<300;i++)G.frame(40);eq(G.q,0);for(let i=0;i<300;i++)G.frame(16.7);eq(G.q,0,'60 mp-ig tilos felfelé')});
t('hosszú gyors futás után felvált',()=>{const g=boot(),G=g.sb.Gov;G.init('a');for(let i=0;i<200;i++)G.frame(40);const q0=G.q;for(let i=0;i<6000;i++)G.frame(16.7);ok(G.q>q0)});
t('kézi mód állandó, értékek: részecske 90/160/260, DPR-sapka 1/1,5/2',()=>{const g=boot(),G=g.sb.Gov;G.setMode('0');eq([G.parts(),G.dpr(3),G.dust()],[90,1,false]);for(let i=0;i<500;i++)G.frame(60);eq(G.q,0);G.setMode('1');eq([G.parts(),G.dpr(3)],[160,1.5]);G.setMode('2');eq([G.parts(),G.dpr(3),G.dpr(1)],[260,2,1])});
t('a beállítás a mentésbe kerül és visszatölt',()=>{const g=boot();g.T.S.set.q='1';g.sb.Gov.setMode('1');g.T.save();const g2=boot({store:g.store});eq(g2.T.S.set.q,'1');eq(g2.sb.Gov.q,1)});
t('alacsony minőségnél kevesebb részecske keletkezik',()=>{const run=q=>{const g=boot();g.sb.Gov.setMode(String(q));const S=g.T.S;S.depth=50;S.tr=[['D',50]];S.tn=[[0,0,0,50]];S.fuel=500;S.eng=g.now()-5000;g.T.go('D');g.frames(240);return g.T.pr.length};ok(run(0)<run(2),'Q0 < Q2')});

group('D) Regresszió: a meglévő játék működik');
t('koppintás: elindul és tart; újabb koppintás megállít',()=>{const g=boot(),T=g.T;T.S.set.sc=60;T.S.eng=g.now()-5000;T.pd('D',g.ev);T.pu();g.frames(120);eq(T.S.st,'D');ok(T.S.depth>0.3,'mélyült');T.pd('D',g.ev);T.pu();g.frames(5);eq(T.S.st,'idle')});
t('nyomva tartás: amíg tartod megy, felengedésre megáll',()=>{const g=boot(),T=g.T;T.S.set.sc=60;T.pd('R',g.ev);g.runTimers();g.frames(60);eq(T.S.st,'R');ok(T.hold&&T.hold.mom);T.pu();g.frames(3);eq(T.S.st,'idle')});
t('irányváltás új nyomással',()=>{const g=boot(),T=g.T;T.pd('L',g.ev);T.pu();g.frames(30);T.pd('R',g.ev);eq(T.S.st,'R');T.pu()});
t('kevés üzemanyag: automatikus tankolás indulás előtt',()=>{const g=boot(),T=g.T;T.S.fuel=3;T.S.eng=g.now()-5000;g.T.go('D');g.frames(60);eq(T.S.st,'D');ok(T.S.fuel>100);ok(T.S.cash<250000)});
t('nincs pénz: nem indul, érthető üzenet',()=>{const g=boot(),T=g.T;T.S.fuel=3;T.S.cash=0;T.go('D');eq(T.S.st,'idle');ok(g.toasts.some(m=>/Kevés az üzemanyag/.test(m)))});
t('kemény kőzet: gránit előtt megáll 0-s fejjel, 1-es fejjel halad',()=>{const g=boot(),T=g.T,S=T.S;S.depth=3999.995;S.tr=[['D',3999.995]];S.fuel=800;S.set.auto=0;S.set.sc=1;S.eng=g.now()-5000;T.go('D');g.frames(300);eq(S.st,'idle');ok(S.depth>3999.99&&S.depth<4000.001);S.u.f=1;T.go('D');g.frames(200);eq(S.st,'D');ok(S.depth>4000)});
t('vészüzemanyag: üres tartálynál a raktárból éget',()=>{const g=boot(),T=g.T,S=T.S;S.depth=10;S.tr=[['D',10]];S.fuel=0;S.cg={'Kőszén':50};S.eng=g.now()-5000;T.go('D');g.frames(30);ok(S.fuel>0);ok(S.cg['Kőszén']<50);eq(S.st,'D')});
t('gyors hazatérés 6 mp alatt hazaér',()=>{const g=boot(),T=g.T,S=T.S;S.depth=1200;S.x=300;S.tr=[['R',300],['D',1200]];S.fuel=800;S.cg={};S.eng=g.now()-5000;T.go('H');let f=0;for(;f<600&&S.st=='H';f++)g.frames(1);ok(f*16.7<6000,'túl lassú: '+f);eq(S.depth,0);eq(S.x,0)});
t('mélyen kifogyó üzemanyag: a gép elvész, a pénz megmarad',()=>{const g=boot(),T=g.T,S=T.S;S.depth=100;S.tr=[['D',100]];S.fuel=0.0001;S.cg={};S.set.auto=0;S.cash=4242;S.eng=g.now()-5000;T.go('U');g.frames(400);ok(S.depth==0||S.st=='idle');eq(S.cash,4242)});
t('rajzolás: minden meghajtás/páncél/fúrófej-szinten kivétel nélkül',()=>{const g=boot(),T=g.T,S=T.S;let errs=[];for(let k=0;k<7;k++){S.u.d=k;S.u.h=Math.min(5,k);S.u.f=Math.min(5,k);errs=errs.concat(g.frames(6))}eq(errs,[])});
t('rajzolás: mélyen, alagúttal, lefelé és vízszintesen fúrva',()=>{const g=boot(),T=g.T,S=T.S;S.depth=500;S.tn=[[0,0,0,500],[0,500,80,500]];S.x=40;S.tr=[['D',500],['R',40]];S.fuel=500;S.set.sc=60;let e=[];for(const d of['R','L','D','U']){T.go(d);e=e.concat(g.frames(90))}eq(e,[])});
t('főmenü és hős-jelenet: 200 képkocka, kivétel nélkül; a menü alatt a játékrajz szünetel',()=>{const g=boot({menu:true}),T=g.T;let bad=0;for(let i=0;i<200;i++){g.advance(17);try{T.hero(g.mc,i*17)}catch(e){bad++}}eq(bad,0);T.showMM();T.showMM('set');eq(g.frames(10),[])});
t('panelek (adatok/raktár/fúrófej) szövege felépül',()=>{const g=boot();for(const k of['info','store','head']){g.T.sheetT=k;const h=g.T.sheetHTML();ok(typeof h==='string'&&h.length>40,k)}});
t('base.js nélkül is elindul és játszható (tartalék ágak)',()=>{const g=boot({skip:['js/base.js']});ok(!g.sb.Save&&!g.sb.Gov);g.T.S.fuel=300;g.T.S.eng=g.now()-5000;g.T.go('R');eq(g.frames(60),[]);ok(g.T.S.x>0);g.T.save();ok(g.store.drillup1)});
group('E) Motor és áramfejlesztő');
t('motor indítása: bemelegedés után mozog a gép',()=>{const g=boot(),T=g.T;T.S.fuel=300;T.go('R');g.frames(30);eq(T.S.x,0,'még melegszik');g.frames(80);ok(T.S.x>0,'már mozog')});
t('álló, beindított motor üresjáratban is fogyaszt',()=>{const g=boot(),T=g.T;T.S.eng=g.now()-5000;T.S.fuel=300;g.frames(600);ok(T.S.fuel<300&&T.S.fuel>299,'fogyasztás: '+(300-T.S.fuel))});
t('leállított motor nem fogyaszt',()=>{const g=boot(),T=g.T;T.S.eng=0;T.S.fuel=300;g.frames(600);eq(T.S.fuel,300)});
t('áramfejlesztő: bekapcsolva ég, kikapcsolva nem',()=>{const g=boot(),T=g.T;T.S.gen={f:50,on:1};g.frames(600);ok(T.S.gen.f<50&&T.S.gen.f>49.5,'ég');T.S.gen.on=0;const f=T.S.gen.f;g.frames(600);eq(T.S.gen.f,f)});
t('mentés: motor és áramfejlesztő visszatöltődik',()=>{const g=boot();g.T.S.eng=1.7e12-1000;g.T.S.gen={f:40,on:1};g.T.save();const g2=boot({store:g.store});eq(g2.T.S.eng,1.7e12-1000);eq(g2.T.S.gen,{f:40,on:1})});
t('műhely nézet: a fejlesztési, motor- és áramfejlesztő kártyák felépülnek',()=>{const g=boot(),T=g.T;T.S.gen={f:20,on:1};const h=T.vShop();ok(h.includes('Motor'),'motor kártya');ok(h.includes('Áramfejlesztő'),'áramfejlesztő kártya');ok(h.includes('fejlesztve'),'fejlesztési sáv')});

console.log(`\nÖsszesen: ${pass} sikeres, ${fail} sikertelen`);process.exit(fail?1:0);
