/* ---------- PARTICLE BACKGROUND (lightweight canvas) ---------- */
(() => {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const particles = [];
  const count = Math.floor((w*h) / 70000) + 30;

  function rand(min,max){ return Math.random()*(max-min)+min }

  function create(){
    for(let i=0;i<count;i++){
      particles.push({
        x: rand(0,w),
        y: rand(0,h),
        r: rand(0.6,2.6),
        vx: rand(-0.2,0.2),
        vy: rand(-0.1,0.1),
        hue: rand(200,280),
        life: rand(60,180)
      });
    }
  }
  create();

  function resize(){
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
  }
  addEventListener('resize', resize);

  function draw(){
    ctx.clearRect(0,0,w,h);
    // soft vignette
    const g = ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0,'rgba(6,6,8,0.35)');
    g.addColorStop(1,'rgba(6,6,8,0.9)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    // connect-ish blurred nodes
    for(let i=0;i<particles.length;i++){
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.05;
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;
      // glow
      const grd = ctx.createRadialGradient(p.x,p.y,p.r*0.2,p.x,p.y,p.r*10);
      grd.addColorStop(0, `hsla(${p.hue},80%,70%,${0.12})`);
      grd.addColorStop(0.2, `hsla(${p.hue},70%,60%,${0.06})`);
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r*10,0,Math.PI*2);
      ctx.fill();
      // small dot center
      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue},80%,60%,${0.9})`;
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    }

    // lines between close dots (subtle)
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a=particles[i], b=particles[j];
        const dx=a.x-b.x, dy=a.y-b.y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist < 110){
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.strokeStyle = `rgba(100,120,255,${(110-dist)/600})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ---------- DARK THEME (we only provide dark; keep toggle hidden) ---------- */
document.addEventListener('DOMContentLoaded', ()=> {
  // optional toggle for future: keep ready but hidden
  const toggle = document.getElementById('mode-toggle');
  if(toggle){
    toggle.addEventListener('click', ()=> {
      document.body.classList.toggle('light-mode');
    });
  }

  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if(href.startsWith('#')){
        e.preventDefault();
        const el = document.querySelector(href);
        if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });
});
