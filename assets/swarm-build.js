(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = [...document.querySelectorAll('.hero > .wrap, section.section, .footer')];
  if (!targets.length || reduce) { document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')); return; }

  const style = document.createElement('style');
  style.textContent = `
    .swarm-build-target { opacity:.08; transform:translateY(28px); filter:blur(3px); transition:opacity .7s ease,transform .8s cubic-bezier(.2,.7,.2,1),filter .7s ease; }
    .swarm-build-target.swarm-built { opacity:1; transform:none; filter:none; }
    #swarm-build-cursors { position:fixed; inset:0; z-index:20; pointer-events:none; overflow:hidden; }
    .swarm-build-cursor { position:absolute; left:0; top:0; display:flex; align-items:flex-start; gap:4px; will-change:transform; transition:transform .85s cubic-bezier(.2,.7,.2,1); filter:drop-shadow(0 2px 4px #0008); }
    .swarm-build-cursor svg { width:17px;height:22px; flex:none; }
    .swarm-build-cursor span { margin:15px 0 0 2px; padding:4px 6px; border-radius:3px; background:var(--lime,#c8ff3d); color:#050505; font:500 9px 'DM Mono',monospace; letter-spacing:.06em; white-space:nowrap; }
    .swarm-build-cursor.c2 span { background:#f4f4f5; }
    .swarm-build-cursor.c3 span { background:#8b9cff; }
    @media(max-width:600px){.swarm-build-target{transform:translateY(18px);filter:blur(2px)}.swarm-build-cursor svg{width:14px;height:18px}.swarm-build-cursor span{font-size:8px}}
    @media(prefers-reduced-motion:reduce){.swarm-build-target{opacity:1;transform:none;filter:none}}
  `;
  document.head.appendChild(style);
  const layer=document.createElement('div'); layer.id='swarm-build-cursors'; layer.setAttribute('aria-hidden','true');
  const pointer='<svg viewBox="0 0 18 22"><path d="M2 1 16 13 9.5 13.5 6.5 20Z" fill="currentColor" stroke="#050505" stroke-width="1.2" stroke-linejoin="round"/></svg>';
  const agents=['LAYOUT','VISUALS','DETAILS'];
  const cursors=agents.map((name,i)=>{const el=document.createElement('div');el.className='swarm-build-cursor'+(i?' c'+(i+1):'');el.innerHTML=pointer+'<span>'+name+'</span>';layer.appendChild(el);return el;});
  document.body.appendChild(layer);
  targets.forEach((el,i)=>{el.classList.add('swarm-build-target');el.dataset.swarmIndex=i;});

  const place=(cursor,target,index)=>{
    const rect=target.getBoundingClientRect();
    const offsets=[{x:Math.min(36,rect.width*.15),y:Math.min(24,rect.height*.2)},{x:Math.max(10,rect.width*.65),y:Math.min(45,rect.height*.3)},{x:Math.max(10,rect.width*.35),y:Math.max(12,rect.height*.65)}];
    const o=offsets[index];
    cursor.style.transform=`translate(${Math.max(8,Math.min(innerWidth-80,rect.left+o.x))}px,${Math.max(8,Math.min(innerHeight-30,rect.top+o.y))}px)`;
  };
  let active=0;
  const build=(target)=>{
    if(target.classList.contains('swarm-built'))return;
    target.classList.add('swarm-built');
    const index=Number(target.dataset.swarmIndex);
    cursors.forEach((cursor,i)=>place(cursor,target,(i+index)%3));
    active=index;
  };
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting){build(entry.target);observer.unobserve(entry.target);}});
  },{rootMargin:'-8% 0px -8% 0px',threshold:.08});
  targets.forEach((el,i)=>{if(i===0){requestAnimationFrame(()=>build(el));}else observer.observe(el);});
  window.addEventListener('scroll',()=>{
    const visible=targets.find(el=>{const r=el.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight;});
    if(visible)cursors.forEach((cursor,i)=>place(cursor,visible,(i+active)%3));
  },{passive:true});
})();
