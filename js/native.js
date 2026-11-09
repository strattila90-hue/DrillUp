// Natív-app viselkedés: nincs nagyítás/húzás/kijelölés, kijelző ébren, vissza-gomb a menüre
(function(W){
 const NAT={app:!!((W.matchMedia&&W.matchMedia('(display-mode: standalone)').matches)||W.navigator.standalone||W.Capacitor)};
 W.NAT=NAT;if(typeof document==='undefined')return;
 const d=document,ed=e=>e.target&&e.target.closest&&e.target.closest('input,textarea,select,[contenteditable]');
 try{const st=d.createElement('style');st.textContent='html,body{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation;overscroll-behavior:none}input,textarea{-webkit-user-select:text;user-select:text}#top{align-items:center}#top .tbn{background:#2a221a;color:#efe3d0;border:1px solid #5a4a32;border-radius:8px;font:inherit;font-size:15px;line-height:1;padding:5px 9px;margin-left:6px;touch-action:manipulation}#top .tbn:active{background:#46382a}#top .rg{display:flex;align-items:center;gap:0}';d.head.appendChild(st)}catch(e){}
 if(NAT.app)d.documentElement.classList.add('app');
 ['gesturestart','gesturechange','gestureend'].forEach(n=>d.addEventListener(n,e=>e.preventDefault(),{passive:false}));
 d.addEventListener('touchmove',e=>{if(e.touches&&e.touches.length>1)e.preventDefault()},{passive:false});
 d.addEventListener('contextmenu',e=>{if(!ed(e))e.preventDefault()});
 d.addEventListener('selectstart',e=>{if(!ed(e))e.preventDefault()});
 d.addEventListener('dblclick',e=>{if(!ed(e))e.preventDefault()});
 // kijelző ébren tartása játék közben
 let wl=null;const lock=async()=>{try{if(navigator.wakeLock&&!d.hidden&&!wl){wl=await navigator.wakeLock.request('screen');wl.addEventListener('release',()=>{wl=null})}}catch(e){wl=null}};
 d.addEventListener('visibilitychange',()=>{if(!d.hidden)lock()});['pointerdown','touchstart'].forEach(n=>d.addEventListener(n,lock,{passive:true,once:false}));lock();
 try{if(screen.orientation&&screen.orientation.lock)screen.orientation.lock('portrait').catch(()=>{})}catch(e){}
 // Android vissza-gomb: ne lépjen ki a játékból, hanem nyissa meg a menüt
 try{history.replaceState({g:1},'');history.pushState({g:2},'');W.addEventListener('popstate',()=>{history.pushState({g:2},'');if(NAT.back&&NAT.back())return;try{if(!d.getElementById('mm'))showMM()}catch(e){}})}catch(e){}
})(typeof window!=='undefined'?window:globalThis);
