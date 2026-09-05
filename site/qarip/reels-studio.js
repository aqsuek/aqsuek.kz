(() => {
  const css = `
    .reels-pick{
      position:relative;overflow:hidden;
      background:radial-gradient(circle at 12% 20%,#253d9b55 0,transparent 28%),radial-gradient(circle at 92% 82%,#d9ff4730 0,transparent 23%),#151513;
    }
    .reels-pick:before{content:"";position:absolute;inset:20px;border:1px solid #ffffff12;pointer-events:none}
    .reels-copy{position:relative;z-index:1;text-align:center}
    .reels-copy h2{letter-spacing:-.055em;line-height:.88}
    .reels-copy h2:after{content:"Жұпты таңдаңыз · мәтінді жазыңыз · PNG сақтаңыз";display:block;margin-top:24px;color:#9b9b94;font:600 11px/1.4 Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase}
    .phone-preview{position:relative;box-shadow:0 28px 60px #0009,0 0 0 1px #ffffff18}
    .phone-preview:after{content:"LIVE PREVIEW";position:absolute;z-index:5;top:13px;left:16px;color:#fff9;font:700 8px/1 Arial,sans-serif;letter-spacing:.18em}
    .reel-ui{padding-left:94px}
    .reels-controls{position:relative;z-index:1;width:min(520px,100%);padding:22px;border:1px solid #ffffff18;border-radius:22px;background:#20201d;box-shadow:0 20px 45px #0004}
    .reels-label{display:flex;align-items:center;gap:10px;margin:0!important;color:#d9ff47!important;font:800 10px/1 Arial,sans-serif!important;letter-spacing:.16em}
    .reels-label:after{content:"";height:1px;flex:1;background:#ffffff20}
    .reels-controls>.reels-label{font-size:0!important;letter-spacing:0!important;padding-top:4px}
    .reels-controls>.reels-label:before{font:800 11px/1 Arial,sans-serif;letter-spacing:.12em}
    .reels-controls>.reels-label:nth-of-type(1):before{content:"01 · СУБТИТР СТИЛІ"}
    .reels-controls>.reels-label:nth-of-type(2):before{content:"02 · ТҮС ПАЛИТРАСЫ"}
    .reels-controls>.reels-label:nth-of-type(3):before{content:"03 · МӘТІНІҢІЗ"}
    .reels-size .reels-label{font-size:0!important;letter-spacing:0!important}
    .reels-size .reels-label:before{content:"04 · ӨЛШЕМ";font:800 11px/1 Arial,sans-serif;letter-spacing:.12em}
    .reels-options{margin-top:12px!important;border:0!important;gap:9px!important}
    .reels-options:not(.reels-colors){grid-template-columns:repeat(2,minmax(0,1fr))!important}
    .reels-options:not(.reels-colors) button{min-height:66px;padding:10px 12px!important;border:1px solid #ffffff22!important;border-radius:12px!important;background:#191918!important;text-align:left!important;display:grid!important;grid-template-columns:20px 1fr!important;align-items:center!important}
    .reels-options:not(.reels-colors) button b{font-size:14px!important;line-height:1.15!important}
    .reels-options:not(.reels-colors) button:after{display:block;grid-column:2;color:#85857f;font:700 8px/1 Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase}
    .reels-options:not(.reels-colors) button:nth-child(1):after{content:"ЭДИТОРИАЛ"}
    .reels-options:not(.reels-colors) button:nth-child(2):after{content:"ПРЕМИУМ"}
    .reels-options:not(.reels-colors) button:nth-child(3):after{content:"ЖАҢАЛЫҚ"}
    .reels-options:not(.reels-colors) button:nth-child(4):after{content:"ОҚИҒА"}
    .reels-options:not(.reels-colors) button:nth-child(5):after{content:"ЖУРНАЛ"}
    .reels-options:not(.reels-colors) button:nth-child(6):after{content:"ХУК"}
    .reels-options:not(.reels-colors) button:nth-child(7):after{content:"ҚАЛЫҢ АКЦЕНТ"}
    .reels-options:not(.reels-colors) button:nth-child(8):after{content:"КЕЗДЕЙСОҚ"}
    .reels-options:not(.reels-colors) button.selected{background:#d9ff47!important;color:#161615!important;border-color:#d9ff47!important}
    .reels-options:not(.reels-colors) button.selected:after{color:#4d4d47}
    .reels-options:not(.reels-colors) button.random{background:transparent!important}
    .reels-colors{grid-template-columns:repeat(4,minmax(0,1fr))!important}
    .reels-colors button{min-height:58px;padding:8px 4px!important;border:1px solid #ffffff22!important;border-radius:12px!important;background:#191918!important}
    .reels-copy-edit{margin-top:12px!important;display:grid!important;grid-template-columns:1fr 1fr;gap:8px}
    .reels-copy-edit input{min-width:0;border-radius:10px!important;border-color:#ffffff22!important;background:#161615!important;color:#fff!important;padding:12px!important}
    .reels-size{margin-top:16px;padding-top:14px;border-top:1px solid #ffffff18}
    .reels-actions{display:none!important}
    @media(max-width:900px){.reels-pick{padding:52px 16px 44px!important}.reels-pick:before{inset:10px}.reels-controls{box-sizing:border-box}.reels-copy h2:after{margin-top:18px}.reels-options:not(.reels-colors) button b{font-size:13px!important}}
    @media(max-width:390px){.reels-controls{padding:14px}.reels-options:not(.reels-colors) button{padding:8px!important;min-height:60px}.reels-options:not(.reels-colors) button b{font-size:12px!important}.reels-colors button b{font-size:9px!important}}
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
})();
