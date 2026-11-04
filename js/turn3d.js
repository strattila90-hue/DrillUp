// Valódi 3D-s (perspektivikus) gépmodell a fordulás idejére – a nyers 2D-s oldalnézet helyett
(function(W){
const D=44,LIGHT=(()=>{const v=[-.45,.78,.5],l=Math.hypot(...v);return v.map(a=>a/l)})();
const hx=c=>{c=String(c||'#888');if(c[0]!=='#')return[136,136,136];if(c.length===4)c='#'+c[1]+c[1]+c[2]+c[2]+c[3]+c[3];return[parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)]};
const shade=(rgb,k)=>'rgb('+rgb.map(v=>Math.max(0,Math.min(255,v*k|0))).join()+')';
const nrm=v=>{const l=Math.hypot(v[0],v[1],v[2])||1;return[v[0]/l,v[1]/l,v[2]/l]};
let GEO=null,gk='';
function quadN(p){const a=p[0],b=p[1],c=p[2],u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]];return nrm([u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]])}
// doboz: 6 lap, kifelé mutató normálokkal
function box(F,x0,x1,y0,y1,z0,z1,col,o){o=o||{};const P=(x,y,z)=>[x,y,z];
 const f=[[[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[x1,y0,z1]],[[x0,y0,z1],[x0,y1,z1],[x0,y1,z0],[x0,y0,z0]],[[x0,y1,z0],[x0,y1,z1],[x1,y1,z1],[x1,y1,z0]],[[x0,y0,z1],[x0,y0,z0],[x1,y0,z0],[x1,y0,z1]],[[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],[x0,y0,z1]],[[x0,y0,z0],[x0,y1,z0],[x1,y1,z0],[x1,y0,z0]]];
 const ns=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
 f.forEach((p,i)=>F.push({p,n:ns[i],col,tag:o.tag&&o.tag[i]}));}
// X tengelyű henger (Y,Z középpont)
function cylX(F,x0,x1,cy,cz,r,seg,colf){for(let i=0;i<seg;i++){const a0=i/seg*6.2832,a1=(i+1)/seg*6.2832,am=(a0+a1)/2,y0=cy+r*Math.sin(a0),z0=cz+r*Math.cos(a0),y1=cy+r*Math.sin(a1),z1=cz+r*Math.cos(a1);F.push({p:[[x0,y0,z0],[x1,y0,z0],[x1,y1,z1],[x0,y1,z1]],n:[0,Math.sin(am),Math.cos(am)],col:colf(i)})}}
function cylY(F,cx,cz,y0,y1,r,seg,col){for(let i=0;i<seg;i++){const a0=i/seg*6.2832,a1=(i+1)/seg*6.2832,am=(a0+a1)/2;F.push({p:[[cx+r*Math.cos(a0),y0,cz+r*Math.sin(a0)],[cx+r*Math.cos(a0),y1,cz+r*Math.sin(a0)],[cx+r*Math.cos(a1),y1,cz+r*Math.sin(a1)],[cx+r*Math.cos(a1),y0,cz+r*Math.sin(a1)]],n:[Math.cos(am),0,Math.sin(am)],col})}F.push({p:[[cx-r,y1,cz-r*.0],[cx,y1,cz+r],[cx+r,y1,cz],[cx,y1,cz-r]],n:[0,1,0],col})}
function build(c1,c2,hdc,lit){const F=[],A=hx(c1),B=hx(c2),G=hx('#2a2c30'),DK=hx('#15181c'),HD=hx(hdc||'#8c9199');
 // lánctalpak
 for(const s of[1,-1]){const z0=s>0?1.05:-1.75,z1=s>0?1.75:-1.05;box(F,-12,-3.8,-2.05,-1.05,z0,z1,G);
  for(let x=-11.7;x<-4;x+=.55){const z=s>0?1.76:-1.76;F.push({p:[[x,-1.95,z],[x,-1.2,z],[x+.2,-1.2,z],[x+.2,-1.95,z]],n:[0,0,s],col:DK,b:.02})}
  F.push({p:[[-11.6,-1.7,s*1.77],[-11.6,-1.4,s*1.77],[-11.3,-1.4,s*1.77],[-11.3,-1.7,s*1.77]],n:[0,0,s],col:HD,b:.03})}
 // váz + kupola
 box(F,-12.2,-5.6,-1.1,1.9,-1.3,1.3,A,{});
 box(F,-12.2,-5.6,-1.1,-.9,-1.32,1.32,DK);
 // ablakok mindkét oldalon
 for(const s of[1,-1])for(let i=0;i<3;i++){const x=-9.1+i*1.05,z=s*1.31;F.push({p:[[x,.3,z],[x,1.2,z],[x+.9,1.2,z],[x+.9,.3,z]],n:[0,0,s],col:lit?hx('#caa86a'):hx('#25404f'),b:.04,glass:1})}
 // hasi sárga-fekete csík
 for(const s of[1,-1])F.push({p:[[-12.2,-.75,s*1.31],[-12.2,-.55,s*1.31],[-5.6,-.55,s*1.31],[-5.6,-.75,s*1.31]],n:[0,0,s],col:hx('#d9a520'),b:.03});
 // kémény
 cylY(F,-11,0,1.9,3.1,.28,10,DK);
 // tetőkazán + szellőzők, oldalsó bordák
 cylX(F,-11.7,-6.2,1.55,0,.55,12,i=>i%3?B:A);box(F,-8.3,-7.3,1.9,2.25,-.5,.5,DK);box(F,-6.9,-6.3,1.9,2.15,-.4,.4,DK);
 for(const s of[1,-1])for(const x of[-11.3,-9.6,-7.9,-6.3]){const z=s*1.315;F.push({p:[[x,-.4,z],[x,.2,z],[x+.06,.2,z],[x+.06,-.4,z]],n:[0,0,s],col:DK,b:.02});}
 // kerekek a lánctalpon
 for(const s of[1,-1])for(const x of[-11.2,-9.9,-8.6,-7.3,-6.0,-4.7]){const z=s*1.78,pts=[];for(let i=0;i<8;i++){const a=i/8*6.2832;pts.push([x+.36*Math.cos(a),-1.55+.36*Math.sin(a),z])}F.push({p:pts,n:[0,0,s],col:hx('#5b616a'),b:.035})}
 // dob
 cylX(F,-5.6,-1.6,0,0,2.0,18,i=>i%2?B:A);
 cylX(F,-5.95,-5.4,0,0,2.1,18,i=>DK);
 for(const s of[1,-1]){const z=s*1.84;F.push({p:[[-3.6,-.95,z],[-3.6,.95,z],[-2.6,.95,z],[-2.6,-.95,z]],n:[0,0,s],col:hx('#0b1014'),b:.05});for(let i=0;i<4;i++){F.push({p:[[-5.45,.35+i*.4-.1,s*1.95],[-5.45,.35+i*.4+.1,s*1.95],[-5.2,.35+i*.4+.1,s*1.95],[-5.2,.35+i*.4-.1,s*1.95]],n:[0,0,s],col:hx('#ff8a1e'),b:.06})}}
 // fej alapkorong (kúp tövének takarása)
 return F}
const cache={};
function model(hl,ht,lit){const k=hl+'|'+ht+'|'+(lit?1:0);if(cache[k])return cache[k];const hc=(typeof HC!=='undefined'&&HC[hl])||['#9fb6c0','#6f8794'],hdc=(typeof HDC!=='undefined'&&HDC[ht])||'#8c9199';return cache[k]=build(hc[0],hc[1],hdc,lit)}
function draw(x,o){const yaw=o.yaw||0,cs=Math.cos(yaw),sn=Math.sin(yaw),F=model(o.hl|0,o.ht|0,o.lit),out=[];
 const rot=(X,Y,Z)=>[X*cs-Z*sn,Y,X*sn+Z*cs];
 const add=(f,extra)=>{const P=f.p.map(q=>rot(q[0],q[1],q[2])),N=rot(f.n[0],f.n[1],f.n[2]);let cx=0,cy=0,cz=0;P.forEach(q=>{cx+=q[0];cy+=q[1];cz+=q[2]});cx/=P.length;cy/=P.length;cz/=P.length;
  if(N[0]*(0-cx)+N[1]*(0-cy)+N[2]*(D-cz)<=0)return;out.push({P,N,col:f.col,z:cz+(f.b||0),glass:f.glass,line:f.line})};
 F.forEach(f=>add(f));
 // fúrófej kúp + élek (forgó)
 const R=1.9,X0=-1.6,XA=.65,seg=14,sp=o.sp||0,hdc=hx((typeof HDC!=='undefined'&&HDC[o.ht|0])||'#8c9199'),dark=hx('#3a3d42');
 for(let i=0;i<seg;i++){const a0=sp+i/seg*6.2832,a1=sp+(i+1)/seg*6.2832,am=(a0+a1)/2;const p=[[XA,0,0],[X0,R*Math.sin(a0),R*Math.cos(a0)],[X0,R*Math.sin(a1),R*Math.cos(a1)]];
  add({p,n:nrm([.66,.76*Math.sin(am),.76*Math.cos(am)]),col:i%2?hdc:dark})}
 add({p:[[X0,-R,0],[X0,0,R],[X0,R,0],[X0,0,-R]],n:[-1,0,0],col:dark});
 const hz=Math.min(1,o.heat||0);
 out.sort((a,b)=>a.z-b.z);
 x.save();x.lineJoin='round';
 for(const f of out){const lam=Math.max(0,f.N[0]*LIGHT[0]+f.N[1]*LIGHT[1]+f.N[2]*LIGHT[2]),k=f.glass?.9+.3*lam:.42+.68*lam;
  x.beginPath();f.P.forEach((q,i)=>{const p=D/(D-q[2]);i?x.lineTo(q[0]*p,-q[1]*p):x.moveTo(q[0]*p,-q[1]*p)});x.closePath();
  x.fillStyle=shade(f.col,k);x.fill();x.strokeStyle='rgba(0,0,0,.28)';x.lineWidth=.03;x.stroke()}
 // fogak a kúp mentén (látható oldalon)
 for(let k=0;k<6;k++)for(const t of[.3,.55,.78]){const a=sp+k*1.0472+t*2.6,r=R*(1-t),X=X0+(XA-X0)*t,Y=r*Math.sin(a),Z=r*Math.cos(a),P=rot(X,Y,Z),N=rot(.66,.76*Math.sin(a),.76*Math.cos(a));
  if(N[2]*(D-P[2])+N[0]*(-P[0])+N[1]*(-P[1])<=0)continue;const p=D/(D-P[2]);x.fillStyle=hz>.1?'#ff9a3a':'#e9edf2';x.beginPath();x.arc(P[0]*p,-P[1]*p,.12*p,0,7);x.fill()}
 x.restore()}
W.T3={draw,D};
})(typeof window!=='undefined'?window:globalThis);
