(() => {
  const css = `
    .reels-pick{
      position:relative;overflow:hidden;
      background:radial-gradient(circle at 12% 20%,#253d9b55 0,transparent 28%),radial-gradient(circle at 92% 82%,#d9ff4730 0,transparent 23%),#151513;
    }
    .reels-pick:before{content:"";position:absolute;inset:20px;border:1px solid #ffffff12;pointer-events:none}
    .reels-copy{position:relative;z-index:1;text-align:center}
    .reels-copy h2{letter-spacing:-.055em;line-height:.88}
    .reels-copy h2:after{display:none}
    .phone-preview{position:relative;box-shadow:0 28px 60px #0009,0 0 0 1px #ffffff18}
    .phone-preview:before{content:"";position:absolute;z-index:2;inset:0;background:linear-gradient(180deg,#080b1608 26%,#0c0d1266 76%,#090a0f99 100%);pointer-events:none}
    .phone-preview:after{display:none}
    .reel-ui{padding-left:0}
    .subtitle-stack{z-index:4!important;inset:0!important;width:auto!important;height:auto!important;transform:none!important;text-align:center!important;text-shadow:0 4px 18px #000!important;pointer-events:none}
    .subtitle-stack .sub-hook,.subtitle-stack .sub-mark{position:absolute;left:50%;margin:0!important;touch-action:none;user-select:none;cursor:grab;pointer-events:auto}
    .subtitle-stack .sub-hook{top:43%;max-width:calc(100% - 48px);letter-spacing:-.045em;text-transform:none!important;line-height:.92!important;transform:translate(calc(-50% + var(--hook-x,0px)),calc(-50% + var(--hook-y,0px))) rotate(var(--hook-rotate,0deg)) scale(var(--hook-scale,1))}
    .subtitle-stack .sub-mark{top:57%;display:inline-block;padding:8px 13px!important;border-radius:5px;box-shadow:0 7px 18px #0005;transform:translate(calc(-50% + var(--mark-x,0px)),calc(-50% + var(--mark-y,0px))) rotate(calc(-1.2deg + var(--mark-rotate,0deg))) scale(var(--mark-scale,1))}
    .subtitle-stack .sub-hook:active,.subtitle-stack .sub-mark:active{cursor:grabbing}
    .reels-handle{display:none;position:absolute;z-index:8;width:20px;height:20px;border:2px solid #fff;border-radius:50%;background:#171715;box-shadow:0 2px 8px #0008;touch-action:none}
    [data-selected="1"]>.reels-handle{display:block}
    .reels-handle.resize{right:-13px;bottom:-13px;background:#d9ff47;border-color:#171715}
    .reels-handle.rotate{left:50%;top:-30px;transform:translateX(-50%)}
    .reels-handle.rotate:after{content:"";position:absolute;width:1px;height:10px;background:#fff;left:50%;top:18px}
    .font-chip{display:none!important}
    .reel-progress{z-index:5!important;bottom:20px!important;left:24px!important;right:24px!important}
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

  function enableTextDrag() {
    const preview = document.querySelector(".phone-preview");
    const stack = preview?.querySelector(".subtitle-stack");
    if (!preview || !stack || stack.dataset.dragReady) return;
    stack.dataset.dragReady = "1";
    let position = { hook: { x: 0, y: 0, scale: 1, rotation: 0 }, mark: { x: 0, y: 0, scale: 1, rotation: 0 } };
    try {
      const stored = JSON.parse(localStorage.getItem("qarip-reels-text-position") || "{}");
      position = { ...position, ...stored, hook: { ...position.hook, ...stored.hook }, mark: { ...position.mark, ...stored.mark } };
    } catch {}
    const paint = () => {
      stack.style.setProperty("--hook-x", `${position.hook.x}px`);
      stack.style.setProperty("--hook-y", `${position.hook.y}px`);
      stack.style.setProperty("--hook-scale", position.hook.scale);
      stack.style.setProperty("--hook-rotate", `${position.hook.rotation}deg`);
      stack.style.setProperty("--mark-x", `${position.mark.x}px`);
      stack.style.setProperty("--mark-y", `${position.mark.y}px`);
      stack.style.setProperty("--mark-scale", position.mark.scale);
      stack.style.setProperty("--mark-rotate", `${position.mark.rotation}deg`);
    };
    paint();
    [["hook", ".sub-hook"], ["mark", ".sub-mark"]].forEach(([key, selector]) => {
      const element = stack.querySelector(selector);
      if (!element) return;
      const resize = document.createElement("span");
      resize.className = "reels-handle resize";
      resize.setAttribute("aria-label", "Өлшемін өзгерту");
      const rotate = document.createElement("span");
      rotate.className = "reels-handle rotate";
      rotate.setAttribute("aria-label", "Бұру");
      element.append(resize, rotate);
      const select = () => {
        stack.querySelectorAll("[data-selected]").forEach((item) => item.removeAttribute("data-selected"));
        element.dataset.selected = "1";
      };
      element.addEventListener("pointerdown", (event) => {
        if (event.target.closest(".reels-handle")) return;
        event.preventDefault();
        select();
        const start = { pointerX: event.clientX, pointerY: event.clientY, ...position[key] };
        element.setPointerCapture(event.pointerId);
        const move = (moveEvent) => {
          position[key].x = Math.max(-108, Math.min(108, start.x + moveEvent.clientX - start.pointerX));
          position[key].y = Math.max(-180, Math.min(180, start.y + moveEvent.clientY - start.pointerY));
          paint();
        };
        const end = () => {
          element.removeEventListener("pointermove", move);
          element.removeEventListener("pointerup", end);
          element.removeEventListener("pointercancel", end);
          localStorage.setItem("qarip-reels-text-position", JSON.stringify(position));
        };
        element.addEventListener("pointermove", move);
        element.addEventListener("pointerup", end);
        element.addEventListener("pointercancel", end);
      });
      resize.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        event.stopPropagation();
        select();
        const start = { x: event.clientX, y: event.clientY, scale: position[key].scale };
        resize.setPointerCapture(event.pointerId);
        const move = (moveEvent) => {
          const distance = (moveEvent.clientX - start.x + moveEvent.clientY - start.y) / 150;
          position[key].scale = Math.max(0.55, Math.min(1.8, start.scale + distance));
          paint();
        };
        const end = () => {
          resize.removeEventListener("pointermove", move);
          resize.removeEventListener("pointerup", end);
          resize.removeEventListener("pointercancel", end);
          localStorage.setItem("qarip-reels-text-position", JSON.stringify(position));
        };
        resize.addEventListener("pointermove", move);
        resize.addEventListener("pointerup", end);
        resize.addEventListener("pointercancel", end);
      });
      rotate.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        event.stopPropagation();
        select();
        const start = { x: event.clientX, rotation: position[key].rotation };
        rotate.setPointerCapture(event.pointerId);
        const move = (moveEvent) => {
          position[key].rotation = Math.max(-35, Math.min(35, start.rotation + (moveEvent.clientX - start.x) * 0.55));
          paint();
        };
        const end = () => {
          rotate.removeEventListener("pointermove", move);
          rotate.removeEventListener("pointerup", end);
          rotate.removeEventListener("pointercancel", end);
          localStorage.setItem("qarip-reels-text-position", JSON.stringify(position));
        };
        rotate.addEventListener("pointermove", move);
        rotate.addEventListener("pointerup", end);
        rotate.addEventListener("pointercancel", end);
      });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", enableTextDrag);
  else enableTextDrag();
  window.addEventListener("load", () => setTimeout(enableTextDrag, 220));
})();
