(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || sessionStorage.getItem('sharon-swarm-seen')) return;
  sessionStorage.setItem('sharon-swarm-seen', '1');

  const style = document.createElement('style');
  style.textContent = `
    #sharon-swarm { position:fixed; inset:0; z-index:10000; background:#000; color:#f4f4f5; display:grid; place-items:center; overflow:hidden; font-family:Inter,system-ui,sans-serif; transition:opacity .65s ease,visibility .65s ease; }
    #sharon-swarm.is-done { opacity:0; visibility:hidden; pointer-events:none; }
    #sharon-swarm .swarm-frame { width:min(760px,88vw); position:relative; padding:clamp(24px,5vw,56px); border:1px solid #29292e; border-radius:22px; background:linear-gradient(145deg,#0b0b0e,#030303); box-shadow:0 0 90px #c8ff3d0b; }
    #sharon-swarm .swarm-kicker { color:#c8ff3d; font:500 11px 'DM Mono',monospace; letter-spacing:.2em; }
    #sharon-swarm h2 { margin:18px 0 10px; font-size:clamp(30px,6vw,58px); line-height:.98; letter-spacing:-.06em; }
    #sharon-swarm p { color:#a6a6ad; font-size:13px; margin:0; }
    #sharon-swarm .swarm-stage { height:150px; position:relative; margin:28px 0 20px; border:1px solid #29292e; border-radius:12px; overflow:hidden; background-image:linear-gradient(#ffffff08 1px,transparent 1px),linear-gradient(90deg,#ffffff08 1px,transparent 1px); background-size:24px 24px; }
    #sharon-swarm .swarm-node { position:absolute; width:10px; height:10px; border:1px solid #c8ff3d; border-radius:2px; box-shadow:0 0 14px #c8ff3d55; animation:swarm-pulse 1.2s ease-in-out infinite alternate; }
    #sharon-swarm .swarm-node:nth-child(1){left:18%;top:30%} #sharon-swarm .swarm-node:nth-child(2){left:47%;top:58%;animation-delay:.2s} #sharon-swarm .swarm-node:nth-child(3){left:76%;top:22%;animation-delay:.4s}
    #sharon-swarm .swarm-cursor { position:absolute; top:0; left:0; display:flex; align-items:flex-start; gap:5px; animation:swarm-path 4.8s cubic-bezier(.55,.05,.25,1) infinite alternate; }
    #sharon-swarm .swarm-cursor svg { width:18px;height:22px; filter:drop-shadow(0 1px 2px #000); }
    #sharon-swarm .swarm-tag { margin:14px 0 0 12px; padding:3px 6px; background:#c8ff3d; color:#050505; border-radius:3px; font:600 9px 'DM Mono',monospace; letter-spacing:.08em; white-space:nowrap; }
    #sharon-swarm .swarm-cursor.c2 { animation-delay:-1.6s; animation-duration:5.6s; }
    #sharon-swarm .swarm-cursor.c2 .swarm-tag { background:#f4f4f5; }
    #sharon-swarm .swarm-cursor.c3 { animation-delay:-3s; animation-duration:4.3s; }
    #sharon-swarm .swarm-cursor.c3 .swarm-tag { background:#8b9cff; }
    #sharon-swarm .swarm-progress { height:2px; background:#29292e; margin-top:24px; overflow:hidden; }
    #sharon-swarm .swarm-progress span { display:block; height:100%; width:0; background:#c8ff3d; box-shadow:0 0 12px #c8ff3d; animation:swarm-progress 8.5s linear forwards; }
    #sharon-swarm .swarm-bottom { display:flex; justify-content:space-between; gap:12px; align-items:center; margin-top:12px; color:#777780; font:10px 'DM Mono',monospace; letter-spacing:.1em; }
    #sharon-swarm button { border:1px solid #414148; border-radius:999px; color:#f4f4f5; background:transparent; padding:8px 13px; font:500 11px Inter,system-ui,sans-serif; cursor:pointer; }
    #sharon-swarm button:hover { border-color:#c8ff3d; color:#c8ff3d; }
    @keyframes swarm-path { 0%{transform:translate(4vw,20px)} 25%{transform:translate(35vw,80px)} 50%{transform:translate(18vw,115px)} 75%{transform:translate(58vw,35px)} 100%{transform:translate(70vw,100px)} }
    @keyframes swarm-progress { to{width:100%} }
    @keyframes swarm-pulse { to{transform:scale(1.6);background:#c8ff3d55} }
    @media(max-width:600px){#sharon-swarm .swarm-stage{height:120px}#sharon-swarm .swarm-frame{padding:24px}#sharon-swarm .swarm-cursor{animation-name:swarm-path-mobile}@keyframes swarm-path-mobile{0%{transform:translate(4vw,10px)}50%{transform:translate(35vw,70px)}100%{transform:translate(65vw,35px)}}}
    @media(prefers-reduced-motion:reduce){#sharon-swarm{display:none}}
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.id = 'sharon-swarm';
  overlay.setAttribute('role','status');
  overlay.setAttribute('aria-label','Portfolio intro animation');
  const pointer = `<svg viewBox="0 0 18 22" aria-hidden="true"><path d="M2 1 16 13 9.5 13.5 6.5 20Z" fill="currentColor" stroke="#050505" stroke-width="1.2" stroke-linejoin="round"/></svg>`;
  overlay.innerHTML = `<div class="swarm-frame"><div class="swarm-kicker">SHARON.M / CREATIVE SYSTEM</div><h2>Building the<br><span style="color:#c8ff3d">visual experience.</span></h2><p>Multiple agents. One creative direction.</p><div class="swarm-stage"><i class="swarm-node"></i><i class="swarm-node"></i><i class="swarm-node"></i><div class="swarm-cursor">${pointer}<span class="swarm-tag">LAYOUT</span></div><div class="swarm-cursor c2">${pointer}<span class="swarm-tag">MOTION</span></div><div class="swarm-cursor c3">${pointer}<span class="swarm-tag">DETAILS</span></div></div><div class="swarm-progress"><span></span></div><div class="swarm-bottom"><span>INITIALIZING / 03 AGENTS</span><button type="button" aria-label="Skip intro animation">Skip intro ↗</button></div></div>`;
  document.body.appendChild(overlay);
  const finish = () => overlay.classList.add('is-done');
  overlay.querySelector('button').addEventListener('click',finish);
  window.setTimeout(finish,8800);
  window.setTimeout(()=>overlay.remove(),9600);
})();
