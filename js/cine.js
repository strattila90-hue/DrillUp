/* Drill Up – élethű utófeldolgozás (vignetta, filmszemcse, por a fényben) + cinematic mód (kezelőszervek nélküli, filmes kamera, felirat-beszámolók).
   Az élethű effektek a minőségváltót (Gov.q) követik: q0 = nincs, q1 = vignetta, q2 = + szemcse és por. A beállítás: S.set.rl (0 = ki). */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('cine');
const cl=(v,a,b)=>Math.min(b,Math.max(a,v)),R=(a,b)=>a+Math.random()*(b-a);
const CIN={on:false,k:0,cap:null,capT:0,hint:0,vg:null,vgW:0,vgH:0,vgS:0,gr:null,mote:[],bt:0,t0:0,
 q(){return W.Gov?Gov.q:2},
 rl(){return typeof S!=='undefined'&&S.set&&S.set.rl===0?0:1},
 enter(){if(CIN.on)return;CIN.on=true;CIN.t0=Date.now();CIN.hint=1;document.body.classList.add('cin');try{STO.close();SRF.close()}catch(e){}
  try{if(document.documentElement.requestFullscreen&&!document.fullscreenElement)document.documentElement.requestFullscreen().catch(()=>{})}catch(e){}},
 exit(){if(!CIN.on)return;CIN.on=false;CIN.cap=null;document.body.classList.remove('cin');if(W.ZM){ZM.t=1;ZM.ox=ZM.oy=0}
  try{if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen().catch(()=>{})}catch(e){}},
 caption(e){CIN.cap=e;CIN.capT=0;if(W.STO)STO.cur=e},
 btn(){if(typeof document==='undefined'||!document.getElementById)return;const st=document.getElementById('stage');if(!st||document.getElementById('cinBtn'))return;
  const b=document.createElement('button');b.id='cinBtn';b.setAttribute('aria-label','Cinematic mód');b.textContent='🎬';b.onpointerdown=e=>{e.preventDefault();e.stopPropagation();CIN.enter()};st.appendChild(b)},
 step(dt){CIN.bt+=dt;if(CIN.bt>.6){CIN.bt=0;CIN.btn()}
  CIN.k+=((CIN.on?1:0)-CIN.k)*Math.min(1,dt*2.5);
  if(CIN.on){const t=(Date.now()-CIN.t0)/1000;if(W.ZM){ZM.t=1.3+.3*Math.sin(t/11)+.08*Math.sin(t/4.3);ZM.ox=Math.sin(t/7.7)*26;ZM.oy=Math.cos(t/9.3)*10}
   if(CIN.cap){CIN.capT+=dt;if(CIN.capT>Math.min(22,9+CIN.cap.s.length*.045)){CIN.cap=null;if(W.STO)STO.cur=null}}
   if(CIN.hint>0)CIN.hint=Math.max(0,CIN.hint-dt/5)}},
 vgC(w,h,s){if(CIN.vg&&CIN.vgW===w&&CIN.vgH===h&&CIN.vgS===s)return CIN.vg;const c=CIN.vg||(CIN.vg=document.createElement('canvas'));c.width=Math.max(2,w>>1);c.height=Math.max(2,h>>1);const g=c.getContext('2d'),r=g.createRadialGradient(c.width/2,c.height/2,Math.min(c.width,c.height)*.28,c.width/2,c.height/2,Math.hypot(c.width,c.height)*.55);r.addColorStop(0,'rgba(0,0,0,0)');r.addColorStop(1,`rgba(0,0,0,${s})`);g.fillStyle=r;g.fillRect(0,0,c.width,c.height);CIN.vgW=w;CIN.vgH=h;CIN.vgS=s;return c},
 grain(){if(CIN.gr)return CIN.gr;const c=document.createElement('canvas');c.width=c.height=96;const g=c.getContext('2d'),d=g.createImageData(96,96);for(let i=0;i<d.data.length;i+=4){const v=Math.random()*255|0;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}g.putImageData(d,0,0);return CIN.gr=c},
 post(x,w,h,ts,dt,day,ry){const q=CIN.q(),k=CIN.k,cin=CIN.on;
  if(CIN.rl()&&q>=1||cin){
   x.save();x.globalAlpha=1;x.drawImage(CIN.vgC(w,h,cin?.62:.42),0,0,w,h);x.restore();
   if(q>=2||cin){ // por a fényben
    const dark=cl((1-day)*.9+(ry>2?.7:0),0,1);
    if(dark>.05){if(CIN.mote.length<(q>=2?34:16)){CIN.mote.push({x:R(0,w),y:R(0,h),vx:R(-6,6),vy:R(-4,3),r:R(.6,1.7),p:R(0,6.3)})}
     x.save();x.globalCompositeOperation='lighter';for(const m of CIN.mote){m.x+=(m.vx+Math.sin(ts/1300+m.p)*4)*dt;m.y+=(m.vy+Math.cos(ts/1700+m.p)*3)*dt;if(m.x<-4)m.x=w+4;else if(m.x>w+4)m.x=-4;if(m.y<-4)m.y=h+4;else if(m.y>h+4)m.y=-4;
      const a=.16*dark*(.5+.5*Math.sin(ts/900+m.p));x.fillStyle=`rgba(255,226,170,${a})`;x.beginPath();x.arc(m.x,m.y,m.r,0,7);x.fill()}x.restore()}}
   if(q>=2||cin&&q>=1){const g=CIN.grain(),ox=R(0,96)|0,oy=R(0,96)|0;x.save();x.globalAlpha=cin?.07:.045;x.globalCompositeOperation='overlay';
    for(let yy=-oy;yy<h;yy+=96)for(let xx=-ox;xx<w;xx+=96)x.drawImage(g,xx,yy);x.restore()}}
  if(cin||k>.02){ // filmes sávok
   const bh=(w<h?h*.075:Math.max(h*.07,(h-w/2.39)/2))*k;x.fillStyle='#000';x.fillRect(0,0,w,bh);x.fillRect(0,h-bh,w,bh);
   if(CIN.cap&&cin){const e=CIN.cap,t=CIN.capT,a=cl(Math.min(t/1.2,(Math.min(22,9+e.s.length*.045)-t)/1.2),0,1);
    x.save();x.globalAlpha=a;x.textAlign='left';const px=Math.max(14,w*.06),mw=w-px*2;x.fillStyle='#d9b36a';x.font='bold 10px Georgia';x.fillText('📜 '+e.y+' · '+STO.fd(e.d),px,h-bh-0-Math.max(66,bh*.9)-14);
    x.fillStyle='#fff';x.font='bold 17px Georgia';x.fillText(e.t,px,h-bh-Math.max(66,bh*.9)+6);x.fillStyle='rgba(255,255,255,.88)';x.font='12px Georgia';
    const words=e.s.split(' ');let line='',y=h-bh-Math.max(66,bh*.9)+24,n=0;for(const wd of words){const t2=line?line+' '+wd:wd;if(x.measureText(t2).width>mw&&line){x.fillText(line,px,y);line=wd;y+=16;n++}else line=t2}x.fillText(line,px,y);x.restore()}
   if(CIN.hint>0&&cin){x.save();x.globalAlpha=Math.min(1,CIN.hint*2)*.8;x.fillStyle='#fff';x.font='11px Georgia';x.textAlign='center';x.fillText('Koppints a kilépéshez',w/2,bh+18);x.restore()}}}
};
W.CIN=CIN;
if(W.on)on('frame',dt=>{try{CIN.step(Math.min(dt,.1))}catch(e){DBG.err='cine: '+(e.message||e)}});
if(typeof document!=='undefined'){let dn=null;
 document.addEventListener('pointerdown',e=>{dn=CIN.on?{x:e.clientX,y:e.clientY,t:Date.now()}:null},true);
 document.addEventListener('pointerup',e=>{if(!dn||!CIN.on)return;const d=dn;dn=null;if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>12||Date.now()-d.t>700)return;e.stopPropagation();CIN.exit()},true);
 document.addEventListener('keydown',e=>{if(e.key==='Escape')CIN.exit()})}
})(typeof window!=='undefined'?window:globalThis);
