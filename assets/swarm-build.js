(() => {
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce)return;
  const style=document.createElement('style');
  style.textContent=`
    .swarm-assemble{--build:0;opacity:calc(.18 + var(--build)*.82);clip-path:inset(0 calc((1 - var(--build))*100%) 0 0);transform:translateY(calc((1 - var(--build))*22px));filter:blur(calc((1 - var(--build))*2px));will-change:clip-path,transform,opacity;}
    .swarm-assemble.swarm-finished{clip-path:none;transform:none;filter:none;opacity:1;}
    .swarm-card{--build:0;opacity:calc(.12 + var(--build)*.88);clip-path:inset(0 calc((1 - var(--build))*100%) 0 0);transform:translateY(calc((1 - var(--build))*28px)) scale(calc(.96 + var(--build)*.04));border-color:color-mix(in srgb,var(--line) calc(100% - var(--build)*45%),var(--lime) calc(var(--build)*45%));}
    .swarm-image{--build:0;clip-path:inset(0 calc((1 - var(--build))*100%) 0 0);transform:scale(calc(1.08 - var(--build)*.08));}
    #swarm-live-cursors{position:fixed;inset:0;z-index:30;pointer-events:none;overflow:hidden}
    .swarm-live-cursor{position:absolute;top:0;left:0;display:flex;gap:4px;align-items:flex-start;will-change:transform;transition:transform .32s cubic-bezier(.2,.8,.2,1);filter:drop-shadow(0 2px 4px #0009)}
    .swarm-live-cursor svg{width:17px;height:22px;flex:none}
    .swarm-live-cursor b{font:500 9px 'DM Mono',monospace;letter-spacing:.05em;background:#c8ff3d;color:#050505;padding:4px 6px;border-radius:3px;margin:14px 0 0 2px;white-space:nowrap}
    .swarm-live-cursor:nth-child(2) b{background:#f4f4f5}.swarm-live-cursor:nth-child(3) b{background:#8b9cff}
    .swarm-live-cursor.is-clicking svg{animation:swarm-click .25s ease}
    @keyframes swarm-click{50%{transform:scale(.78)}}
    @media(max-width:600px){.swarm-live-cursor svg{width:14px;height:18px}.swarm-live-cursor b{font-size:8px}}
  `;
  document.head.appendChild(style);
  const targets=[...document.querySelectorAll('.hero .eyebrow,.hero .name,.hero .intro,.hero .actions,.section .label,.section .heading,.project,.igbox,.about-grid > *, .social,.contact,.footer')];
  const imgs=[...document.querySelectorAll('.project .preview img')];
  targets.forEach(el=>el.classList.add('swarm-assemble'));
  document.querySelectorAll('.project').forEach(el=>el.classList.add('swarm-card'));
  imgs.forEach(el=>el.classList.add('swarm-image'));
  const layer=document.createElement('div');layer.id='swarm-live-cursors';layer.setAttribute('aria-hidden','true');
  const svg='<svg viewBox="0 0 18 22"><path d="M2 1 16 13 9.5 13.5 6.5 20Z" fill="currentColor" stroke="#050505" stroke-width="1.2" stroke-linejoin="round"/></svg>';
  const cursors=['LAYOUT','VISUALS','DETAILS'].map((n,i)=>{const c=document.createElement('div');c.className='swarm-live-cursor';c.innerHTML=svg+'<b>'+n+'</b>';layer.append(c);return c;});document.body.append(layer);
  let last=-1,raf=0;
  function update(){raf=0;const vh=innerHeight;let focus=null,focusIndex=0;
    targets.forEach((el,i)=>{const r=el.getBoundingClientRect();const p=Math.max(0,Math.min(1,(vh*.82-r.top)/(Math.max(120,r.height+vh*.35))));el.style.setProperty('--build',p.toFixed(3));if(p>=.02&&p<.99)el.classList.remove('swarm-finished');if(p>=.99)el.classList.add('swarm-finished');if(!focus&&r.bottom>vh*.15&&r.top<vh*.85){focus=el;focusIndex=i;}});
    document.querySelectorAll('.project').forEach(el=>{const r=el.getBoundingClientRect();const p=Math.max(0,Math.min(1,(vh*.85-r.top)/(Math.max(140,r.height+vh*.25))));el.style.setProperty('--build',p.toFixed(3));});
    imgs.forEach(el=>{const r=el.getBoundingClientRect();const p=Math.max(0,Math.min(1,(vh*.85-r.top)/(Math.max(100,r.height+vh*.2))));el.style.setProperty('--build',p.toFixed(3));});
    if(focus){const r=focus.getBoundingClientRect();cursors.forEach((c,i)=>{const x=Math.max(8,Math.min(innerWidth-90,r.left+r.width*[.22,.68,.46][i]));const y=Math.max(8,Math.min(vh-32,r.top+r.height*[.28,.52,.78][i]));c.style.transform=`translate(${x}px,${y}px)`;if(focusIndex!==last&&i===focusIndex%3){c.classList.add('is-clicking');setTimeout(()=>c.classList.remove('is-clicking'),260);}});last=focusIndex;}
  }
  function onScroll(){if(!raf)raf=requestAnimationFrame(update)}
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);update();
})();