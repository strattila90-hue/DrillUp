// Páncéltest izzása nagy mélységben: a hőmérséklet és a páncélszint határozza meg
(function(W){
const TOL=[420,760,1250,2100,3100,5000],cl=(v,a,b)=>Math.min(b,Math.max(a,v));
const HGL={
 T(ry){try{return typeof lerp==='function'&&typeof TT!=='undefined'?lerp(TT,ry):0}catch(e){return 0}},
 // 0..1.2: mennyire izzik a páncél (jobb páncél = később kezd izzani)
 g(ry,hl){const T=HGL.T(ry),tol=TOL[cl(hl|0,0,5)];return cl((T/tol-.38)/.62,0,1.2)},
 col(g,a){g=cl(g,0,1.2);const r=255,gg=Math.round(50+150*Math.min(1,g)*Math.min(1,g)+40*Math.max(0,g-1)),b=Math.round(10+130*Math.pow(Math.min(1,g),3));return `rgba(${r},${gg},${b},${a})`},
 // a gép saját méter-koordinátáiban, a páncélra (váz + dob) additívan
 hull(x,o){const g=o.g||0;if(g<=.02)return;const t=o.ts||0,pulse=1+.07*Math.sin(t/230)+.04*Math.sin(t/97),k=Math.min(1,g)*pulse;
  x.save();x.globalCompositeOperation='lighter';
  const rects=[[-12.5,-2.0,7.2,3.3,.4],[-4.75,-1.7,3.2,3.4,.1]];
  for(const[a,b,w,h,r]of rects){const gr=x.createLinearGradient(a,0,a+w,0);gr.addColorStop(0,HGL.col(g*.75,.42*k));gr.addColorStop(1,HGL.col(g,.62*k));x.fillStyle=gr;x.beginPath();if(x.roundRect)x.roundRect(a,b,w,h,r);else x.rect(a,b,w,h);x.fill()}
  // izzó lemezhézagok és szegecssorok
  x.strokeStyle=HGL.col(Math.min(1.1,g+.25),.8*k);x.lineWidth=.06;x.beginPath();for(const px of[-11.3,-9.95,-8.6,-7.25,-6.1]){x.moveTo(px,-1.95);x.lineTo(px,1.2)}for(const px of[-4.4,-3.5,-2.6,-1.9]){x.moveTo(px,-1.6);x.lineTo(px,1.6)}x.moveTo(-12.4,-.15);x.lineTo(-5.4,-.15);x.stroke();
  x.restore()},
 // körfény + hőhullám a gép körül (a világ-koordinátákban, képpont egységben)
 halo(x,cx,cy,K,g,ts){if(g<=.05)return;const r=K*(11+4*Math.min(1,g)),gr=x.createRadialGradient(cx-K*5,cy,0,cx-K*5,cy,r);gr.addColorStop(0,HGL.col(g,.28*Math.min(1,g)));gr.addColorStop(1,HGL.col(g,0));x.save();x.globalCompositeOperation='lighter';x.fillStyle=gr;x.fillRect(cx-K*5-r,cy-r,r*2,r*2);x.restore()}
};
W.HGL=HGL;
})(typeof window!=='undefined'?window:globalThis);
