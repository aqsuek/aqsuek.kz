// Shared behaviour for every AQSUEK page.
const AQ=(()=>{
  const KZ=/([ӘәҒғҚқҢңӨөҰұҮүҺһІі])/g;
  const PAIRS=["Әә","Ғғ","Ққ","Ңң","Өө","Ұұ","Үү","Һһ","Іі"];
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const cx=document.createElement('canvas').getContext('2d');
  // A glyph is present only if its width doesn't depend on the fallback font.
  function has(name,w,ch){
    cx.font=`${w} 40px '${String(name).replace(/'/g,"\\'")}', monospace`;const a=cx.measureText(ch).width;
    cx.font=`${w} 40px '${String(name).replace(/'/g,"\\'")}', serif`;const b=cx.measureText(ch).width;
    return Math.abs(a-b)<.01;
  }
  const loaded={};
  // Resolves once the Google stylesheet has arrived, so font loading can start after it.
  function loadFont(name,w=400){
    const key=name+w;
    return loaded[key]||(loaded[key]=new Promise(res=>{
      const l=document.createElement('link');l.rel='stylesheet';
      l.href=`https://fonts.googleapis.com/css2?family=${name.replace(/ /g,'+')}:wght@${w}&display=swap`;
      l.onload=l.onerror=()=>res();
      document.head.appendChild(l);
    }));
  }
  function kzCount(name,w=400){
    const ready=loadFont(name,w);
    const tries=[0,400,1200];
    const check=()=>document.fonts.load(`${w} 40px '${name}'`,PAIRS.join('')).then(f=>f.length?PAIRS.filter(p=>[...p].every(ch=>has(name,w,ch))).length:null);
    // The stylesheet may still be in flight on the first try.
    return tries.reduce((p,ms)=>p.then(n=>n!=null?n:new Promise(r=>setTimeout(r,ms)).then(check)),ready.then(()=>null)).then(n=>n??0);
  }
  const badge=n=>`<span class="ok${n!=null&&n<9?' bad':''}">${n==null?'Тексерілуде':n+'/9 әріп'}</span>`;
  const markKZ=s=>esc(s).replace(KZ,'<mark class="kz">$1</mark>');
  function store(k,v){try{if(v===undefined)return JSON.parse(localStorage.getItem('aq.'+k));localStorage.setItem('aq.'+k,JSON.stringify(v))}catch(_){return null}}
  function toast(msg){
    let el=document.getElementById('toast');
    if(!el){el=document.createElement('div');el.id='toast';el.className='toast glass strong';el.setAttribute('role','status');document.body.appendChild(el)}
    el.textContent=msg;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),2200);
  }

  /* ---------- Qarip catalog ----------
     The single source of truth is the site's own /qarip/data/fonts.json, read at runtime,
     so adding or removing a font there shows up here with no code change. */
  const CAT_BASE=/(^|\.)aqsuek\.kz$/.test(location.hostname)?location.origin:'https://aqsuek.kz';
  const CAT_URL=CAT_BASE+'/qarip/data/fonts.json';
  const abs=u=>{try{return u?new URL(u,CAT_BASE+'/').href:null}catch(_){return null}};
  // GitHub Pages doesn't carry the zip/rar archives; they live on the tanba-fonts-v1 tag (same rule as qarip-lib.js).
  const ARCHIVE_CDN='https://raw.githubusercontent.com/aqsuek/aqsuek.kz/tanba-fonts-v1/site/tanba/downloads/';
  const archive=u=>{const m=/\/(?:qarip|tanba)\/downloads\/([^/?#]+\.(?:zip|rar))$/i.exec(String(u||''));return m?ARCHIVE_CDN+m[1]:abs(u)};
  const CAT_KK={"Display":"Дисплей","Handwritten":"Қолжазба","Monospace":"Моно","Sans Serif":"Санс-сериф","Serif":"Сериф"};
  function norm(f){
    if(!f||typeof f!=='object'||!(f.name||f.family))return null;
    const name=String(f.name||f.family), preview=String(f.preview||'');
    const google=preview.startsWith('google:')?preview.slice(7).trim():(f.source==='google'?String(f.family||name):null);
    const faces=google?[]:(Array.isArray(f.faces)&&f.faces.length?f.faces:[{url:preview,weight:400,style:'normal'}])
      .map(x=>x&&abs(x.url)?{url:abs(x.url),weight:String(x.weight||400),style:String(x.style||'normal')}:null).filter(Boolean);
    if(!google&&!faces.length)return null;
    const catKey=String(f.category||f.style||'Other');
    return {name,slug:String(f.slug||name.toLowerCase().replace(/\s+/g,'-')),family:google||String(f.family||'AQ '+name),google,faces,w:400,
      catKey,cat:String(f.style||CAT_KK[catKey]||catKey),license:f.license==='open'?'open':'check',download:archive(f.download),
      // The catalog names Google as the maker of its Google-hosted fonts; show the designer instead.
      maker:String((/google/i.test(f.maker||'')?f.author:f.maker)||f.author||''),stories:f.useCase==='stories'||/\bstories\b/i.test(String(f.tags||'')),ok:null,failed:false};
  }
  // Used only when the live catalog can't be reached (offline, or a sandbox that blocks aqsuek.kz).
  const FALLBACK=[["Montserrat","Sans Serif",600],["Golos Text","Sans Serif",500],["Onest","Sans Serif",500],["Roboto","Sans Serif",500],["Open Sans","Sans Serif",500],["PT Sans","Sans Serif",400],
    ["Fira Sans","Sans Serif",500],["IBM Plex Sans","Sans Serif",500],["Ubuntu","Sans Serif",500],["Nunito","Sans Serif",600],["Rubik","Sans Serif",500],["Raleway","Sans Serif",600],
    ["Commissioner","Sans Serif",500],["Inter Tight","Sans Serif",600],["Geologica","Sans Serif",700],["Didact Gothic","Sans Serif",400],["Scada","Sans Serif",400],["Cuprum","Sans Serif",500],["Arsenal","Sans Serif",400],
    ["Lora","Serif",500],["PT Serif","Serif",400],["Noto Serif","Serif",500],["Merriweather","Serif",400],["Source Serif 4","Serif",500],["Literata","Serif",500],
    ["Alegreya","Serif",500],["Spectral","Serif",500],["EB Garamond","Serif",500],["Cormorant Garamond","Serif",600],["Old Standard TT","Serif",400],
    ["Playfair","Serif",600],["Prata","Serif",400],["Roboto Slab","Serif",500],["Podkova","Serif",500],["Kurale","Serif",400],
    ["Yeseva One","Display",400],["Oswald","Display",500],["Exo 2","Display",700],["Montserrat Alternates","Display",700],["Comfortaa","Display",600],
    ["Tektur","Display",700],["Press Start 2P","Display",400],["Philosopher","Display",700],["Forum","Display",400],["Play","Display",700],
    ["Caveat","Handwritten",500],["Pacifico","Handwritten",400],["Lobster","Handwritten",400],["Bad Script","Handwritten",400],
    ["IBM Plex Mono","Monospace",500],["Fira Code","Monospace",500],["Ubuntu Mono","Monospace",400]]
    .map(([n,c,w])=>({name:n,slug:n.toLowerCase().replace(/\s+/g,'-'),family:n,google:n,faces:[],w,catKey:c,cat:CAT_KK[c],license:'open',
      download:'https://fonts.google.com/specimen/'+n.replace(/ /g,'+'),maker:'',stories:["Montserrat","Oswald","Comfortaa","Yeseva One","Rubik","Caveat","Lobster","Geologica","Playfair"].includes(n),ok:null,failed:false}));
  // Checked on 2 Nov 2026: the file won't open (dela-gothic-one) or Kazakh letters are missing (the rest).
  // Any other font that fails the same check at runtime is dropped too, see isComplete().
  const HIDDEN=new Set(["dela-gothic-one","st-africa","spectrashell","black-rose","telingaterdisplay","manrope","playfair-display","orelega-one","ponomar"]);
  let catP=null;
  function catalog(){
    return catP||(catP=fetch(CAT_URL,{cache:'no-cache'})
      .then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json()})
      .then(j=>{
        const seen=new Set(),list=(Array.isArray(j)?j:(j&&Array.isArray(j.fonts)?j.fonts:[])).map(norm)
          .filter(f=>f&&!HIDDEN.has(f.slug)&&!seen.has(f.slug)&&seen.add(f.slug));
        if(!list.length)throw new Error('empty catalog');
        return {list,live:true};
      })
      .catch(err=>({list:FALLBACK.map(f=>({...f})),live:false,err:String(err)})));
  }
  const using={};
  function useFont(F){
    if(using[F.slug])return using[F.slug];
    let p;
    if(F.google)p=loadFont(F.google,F.w).then(()=>document.fonts.load(`${F.w} 40px '${F.family}'`,PAIRS.join(''))).then(r=>{if(!r.length)throw 0});
    else p=Promise.all(F.faces.map(fc=>new FontFace(F.family,`url("${fc.url}")`,{weight:fc.weight,style:fc.style,display:'swap'}).load().then(x=>document.fonts.add(x))));
    return using[F.slug]=p.then(()=>{F.failed=false},()=>{F.failed=true});
  }
  const kzCheck=(family,w=400)=>PAIRS.filter(p=>[...p].every(ch=>has(family,w,ch))).length;
  // A font earns a place in the catalog only if it opens and carries all nine Kazakh letters.
  const isComplete=F=>!F.failed&&F.ok===9;
  const fontBadge=F=>F.failed?'<span class="ok bad">Жүктелмеді</span>':badge(F.ok);

  return {KZ,PAIRS,esc,loadFont,kzCount,badge,markKZ,store,toast,catalog,useFont,kzCheck,fontBadge,isComplete};
})();

// Light sheen follows the pointer across each glass surface.
document.addEventListener('pointermove',e=>{
  for(const g of document.querySelectorAll('.glass')){
    const r=g.getBoundingClientRect();
    if(r.bottom<0||r.top>innerHeight) continue;
    g.style.setProperty('--mx',(e.clientX-r.left)+'px');
    g.style.setProperty('--my',(e.clientY-r.top)+'px');
  }
},{passive:true});

document.getElementById('cp')?.addEventListener('click',e=>{
  const btn=e.currentTarget, em=document.getElementById('em');
  const sel=()=>{const r=document.createRange();r.selectNodeContents(em);const s=getSelection();s.removeAllRanges();s.addRange(r)};
  try{navigator.clipboard.writeText(em.textContent).then(()=>{btn.textContent='Көшірілді';setTimeout(()=>btn.textContent='Көшіру',1600)},sel)}catch(_){sel()}
});
