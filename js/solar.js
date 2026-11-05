/* DrillUp Core Quest – napelemes tartalék-hajtás: a felszínen a gép MINDIG tud vízszintesen mozogni (a raktár tele vagy üres,
   a tank kifogyott vagy sem). Ha az üzemanyag elfogyott, a gép tetején lévő napelemek által táplált elektromotorok viszik – lassan,
   dombon is, de CSAK nappal; éjjel várni kell reggelig. A nappal a valós óra szerint számít (ugyanaz, mint a játék nap-éjszaka rajza).
   Mélyben (S.depth>0) nem működik: ott a meglévő üzemanyag-szabályok érvényesek. Nem nyúl a mentéshez. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('solar');
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const SOL={hr:null,msgT:0,
 // aktuális óra (tesztben felülírható: SOL.hr)
 hour(){if(SOL.hr!=null)return SOL.hr;const d=new Date();return d.getHours()+d.getMinutes()/60},
 // nap-erősség 0..1 (a játék ég-rajzával azonos képlet)
 day(h){h=h==null?SOL.hour():h;return cl(Math.sin((h-6)/12*Math.PI)*3+.35,0,1)},
 sun(h){return SOL.day(h)>=.35},
 // a felszíni, tank nélküli, vízszintes mozgás engedélyezett-e (gombnyomáskor is használjuk)
 can(s){try{return(s==='L'||s==='R'||s==='H')&&S.depth<=.01&&S.fuel<=1e-6}catch(e){return false}},
 // várakozás reggelig (óra, szöveg)
 wake(){const h=SOL.hour();for(let i=0;i<=1440;i++){const t=(h+i/60)%24;if(SOL.sun(t)){const hh=Math.floor(t),mm=Math.round((t-hh)*60);return(hh<10?'0':'')+hh+':'+(mm<10?'0':'')+mm}}return'?'},
 speed(c){return Math.max(.45,(c&&c.vh?c.vh:1)*.3)},
 // a step() elején hívódik: true = lekezelte (a normál lépést ki kell hagyni)
 step(dt,m){
  if(!SOL.can(m))return false;
  const tp=S.tr.at(-1);let mm=m;if(m==='H'){if(!tp){S.st='idle';S.mode='';return true}mm=OP[tp[0]]}
  if(mm!=='L'&&mm!=='R')return false;
  if(!SOL.sun()){S.st='idle';S.mode='';if(SOL.msgT<=0){SOL.msgT=5;try{toast('🌙 Éjszaka a napelemek nem termelnek – várj reggelig (kb. '+SOL.wake()+').')}catch(e){}}return true}
  let c=null;try{c=calc()}catch(e){}
  const dx=DV[mm][0],back=tp&&tp[0]===OP[mm];let dist=SOL.speed(c)*dt;if(back)dist=Math.min(dist,tp[1]);
  S.mode='travel';S.x+=dx*dist;
  if(back){tp[1]-=dist;if(tp[1]<1e-6)S.tr.pop()}else if(dist>0){if(tp&&tp[0]===mm)tp[1]+=dist;else S.tr.push([mm,dist])}
  if(!SOL.told){SOL.told=1;try{msg('☀ Napelemes tartalék-hajtás: üzemanyag nélkül is mozoghatsz a felszínen (lassan, csak nappal).',true)}catch(e){}}
  return true},
 tickMsg(dt){if(SOL.msgT>0)SOL.msgT-=dt}
};
W.SOL=SOL;
if(W.on)on('frame',dt=>{try{SOL.tickMsg(Math.min(dt,.1))}catch(e){}});
})(typeof window!=='undefined'?window:globalThis);
