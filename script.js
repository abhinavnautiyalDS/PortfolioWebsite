const menuButton=document.getElementById("menu-toggle");
const nav=document.getElementById("site-nav");
if(menuButton&&nav){
  menuButton.addEventListener("click",()=>{
    const open=nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded",String(open));
    menuButton.innerHTML=open?'CLOSE <i></i>':'MENU <i></i>';
  });
  nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded","false");
    menuButton.innerHTML='MENU <i></i>';
  }));
}
const year=document.getElementById("year");
if(year)year.textContent=new Date().getFullYear();

// A restrained two-source interference field: wave superposition, not a starfield.
const canvas=document.getElementById("quantum-field");
if(canvas&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  const ctx=canvas.getContext("2d",{alpha:true});
  const buffer=document.createElement("canvas");
  const bctx=buffer.getContext("2d");
  let width=0,height=0,frame=0,raf=0,pointer={x:.5,y:.5};
  const resize=()=>{
    const rect=canvas.getBoundingClientRect();
    const dpr=Math.min(window.devicePixelRatio||1,1.5);
    width=Math.max(1,Math.floor(rect.width*dpr));
    height=Math.max(1,Math.floor(rect.height*dpr));
    canvas.width=width;canvas.height=height;
    buffer.width=Math.max(160,Math.floor(width/3.5));
    buffer.height=Math.max(100,Math.floor(height/3.5));
    ctx.setTransform(1,0,0,1,0,0);
  };
  const draw=()=>{
    const w=buffer.width,h=buffer.height;
    const image=bctx.createImageData(w,h),data=image.data;
    const t=frame*.012;
    const sx1=w*(.37+pointer.x*.08),sy1=h*(.43+pointer.y*.08);
    const sx2=w*(.69-pointer.x*.08),sy2=h*(.57-pointer.y*.08);
    for(let y=0;y<h;y++){
      for(let x=0;x<w;x++){
        const i=(y*w+x)*4;
        const d1=Math.hypot(x-sx1,y-sy1),d2=Math.hypot(x-sx2,y-sy2);
        const wave=Math.sin(d1*.115-t)+Math.sin(d2*.115-t);
        const ridge=Math.pow(Math.max(0,Math.cos(wave*1.35)),10);
        const glow=Math.min(1,Math.abs(wave)*.22+ridge*.8);
        const hue=(x/w)*.55+(y/h)*.15;
        data[i]=Math.round(65+70*hue);
        data[i+1]=Math.round(125+95*(1-hue));
        data[i+2]=Math.round(190+65*hue);
        data[i+3]=Math.round(glow*105);
      }
    }
    bctx.putImageData(image,0,0);
    ctx.clearRect(0,0,width,height);
    ctx.imageSmoothingEnabled=true;
    ctx.drawImage(buffer,0,0,width,height);
    frame++;
    raf=requestAnimationFrame(draw);
  };
  const move=e=>{
    const r=canvas.getBoundingClientRect();
    pointer.x=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));
    pointer.y=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));
  };
  resize();draw();
  window.addEventListener("resize",resize,{passive:true});
  canvas.addEventListener("pointermove",move,{passive:true});
  document.addEventListener("visibilitychange",()=>{
    if(document.hidden){cancelAnimationFrame(raf);}
    else if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches)draw();
  });
}
