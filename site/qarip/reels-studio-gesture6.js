(() => {
  const STORE = "qarip-reels-layers";
  const COLORS = ["#ffffff", "#d9ff47", "#ff2d7b", "#64b5ff", "#ff9f1c", "#171715"];
  const LAYERS = [
    ["hook", ".sub-hook", "Акцент"],
    ["mark", ".sub-mark", "Қосымша"],
    ["extra", ".sub-extra", "Жаңа мәтін"],
  ];

  const css = `
    .reels-pick{
      position:relative;overflow:visible;
      background:radial-gradient(circle at 12% 20%,#253d9b55 0,transparent 28%),radial-gradient(circle at 92% 82%,#d9ff4730 0,transparent 23%),#151513;
    }
    .reels-pick:before{content:"";position:absolute;inset:20px;border:1px solid #ffffff12;pointer-events:none}
    .reels-copy{position:relative;z-index:1;text-align:center}
    .reels-copy h2{letter-spacing:-.055em;line-height:.88}
    .reels-copy h2:after{display:none}
    .phone-preview{position:relative;box-shadow:0 28px 60px #0009,0 0 0 1px #ffffff18;overflow:visible!important}
    .phone-preview:before{content:"";position:absolute;z-index:2;inset:0;background:linear-gradient(180deg,#080b1608 26%,#0c0d1266 76%,#090a0f99 100%);pointer-events:none}
    .phone-preview:after{display:none}
    .reel-ui{padding-left:0}
    .subtitle-stack{z-index:4!important;inset:0!important;width:auto!important;height:auto!important;transform:none!important;text-align:center!important;text-shadow:0 4px 18px #000!important;pointer-events:none}
    .subtitle-stack .sub-hook,.subtitle-stack .sub-mark,.subtitle-stack .sub-extra{position:absolute;left:50%;margin:0!important;touch-action:none;user-select:none;cursor:grab;pointer-events:auto}
    .subtitle-stack .sub-hook{top:43%;max-width:calc(100% - 48px);letter-spacing:-.045em;text-transform:none!important;line-height:.92!important;transform:translate(calc(-50% + var(--hook-x,0px)),calc(-50% + var(--hook-y,0px))) rotate(var(--hook-rotate,0deg)) scale(var(--hook-scale,1))}
    .subtitle-stack .sub-mark{top:57%;display:inline-block;padding:8px 13px!important;border-radius:5px;box-shadow:0 7px 18px #0005;transform:translate(calc(-50% + var(--mark-x,0px)),calc(-50% + var(--mark-y,0px))) rotate(calc(-1.2deg + var(--mark-rotate,0deg))) scale(var(--mark-scale,1))}
    .subtitle-stack .sub-extra{top:68%;max-width:calc(100% - 48px);color:#fff;font:700 18px/1.1 Arial,sans-serif;transform:translate(calc(-50% + var(--extra-x,0px)),calc(-50% + var(--extra-y,0px))) rotate(var(--extra-rotate,0deg)) scale(var(--extra-scale,1))}
    .subtitle-stack .sub-hook:active,.subtitle-stack .sub-mark:active,.subtitle-stack .sub-extra:active{cursor:grabbing}
    .subtitle-stack [data-selected="1"]{outline:2px solid #d9ff47;outline-offset:10px}
    .reels-handle{display:none;position:absolute;z-index:12;width:30px;height:30px;border:2px solid #fff;border-radius:50%;background:#171715;box-shadow:0 2px 10px #000a;touch-action:none;pointer-events:auto}
    [data-selected="1"]>.reels-handle{display:block!important}
    .reels-handle.resize{right:-18px;bottom:-18px;background:#d9ff47;border-color:#171715}
    .reels-handle.rotate{left:50%;top:-40px;transform:translateX(-50%)}
    .reels-handle.rotate:after{content:"";position:absolute;width:2px;height:12px;background:#fff;left:50%;top:28px;transform:translateX(-50%)}
    .reels-handle.delete{left:-18px;top:-18px;width:26px;height:26px;background:#ff2d7b;border-color:#fff;color:#fff;font:800 16px/26px Arial,sans-serif;text-align:center}
    .reels-handle.delete:before{content:"×"}
    .font-chip{display:none!important}
    .reel-progress{z-index:5!important;bottom:20px!important;left:24px!important;right:24px!important}
    .text-add{display:none!important}
    .text-color-tools{display:grid;gap:10px;margin-top:12px;padding-top:12px;border-top:1px solid #ffffff16}
    .text-add-btn{width:100%;min-height:42px;border:1px dashed #d9ff4788;border-radius:10px;background:#191918;color:#d9ff47;font:800 12px/1 Arial,sans-serif;letter-spacing:.06em;cursor:pointer}
    .text-add-btn:hover{background:#d9ff47;color:#171715}
    .text-add-btn[hidden]{display:none!important}
    .text-layer-picks{display:flex;flex-wrap:wrap;gap:6px}
    .text-layer-picks button{position:relative;min-height:32px;padding:0 26px 0 10px;border:1px solid #ffffff22;border-radius:8px;background:#191918;color:#fff;font:700 11px/1 Arial,sans-serif;cursor:pointer}
    .text-layer-picks button.active{background:#d9ff47;color:#171715;border-color:#d9ff47}
    .text-layer-picks .layer-x{position:absolute;right:5px;top:50%;transform:translateY(-50%);width:18px;height:18px;border:0;border-radius:50%;background:#ffffff18;color:inherit;font:800 13px/18px Arial,sans-serif;padding:0;cursor:pointer}
    .text-layer-picks button.active .layer-x{background:#17171522}
    .text-layer-picks button[data-last="1"] .layer-x{display:none}
    .sub-hook[data-layer-off="1"],.sub-mark[data-layer-off="1"],.sub-extra[data-layer-off="1"]{display:none!important}
    .subtitle-stack[data-one="1"] .reels-handle.delete{display:none!important}
    .text-tool-row{display:flex;align-items:center;flex-wrap:wrap;gap:7px}
    .text-tool-row span{width:42px;color:#9b9b94;font:800 9px/1 Arial,sans-serif;letter-spacing:.08em}
    .text-tool-row button{width:26px;height:26px;border:2px solid #fff4;border-radius:50%;padding:0;cursor:pointer}
    .text-tool-row button.active{outline:2px solid #d9ff47;outline-offset:2px}
    .text-tool-row .bg-off{width:auto;height:26px;border-radius:7px;padding:0 8px;background:#191918;color:#fff;font:800 9px/1 Arial,sans-serif}
    .text-tool-row .bg-off.active{background:#d9ff47;color:#171715}
    .text-tool-row input[type=color]{width:32px;height:28px;padding:0;border:1px solid #ffffff33;border-radius:6px;background:transparent;cursor:pointer}
    .reels-controls{position:relative;z-index:1;width:min(520px,100%);padding:22px;border:1px solid #ffffff18;border-radius:22px;background:#20201d;box-shadow:0 20px 45px #0004}
    .reels-label{display:flex;align-items:center;gap:10px;margin:0!important;color:#d9ff47!important;font:800 10px/1 Arial,sans-serif!important;letter-spacing:.16em}
    .reels-label:after{content:"";height:1px;flex:1;background:#ffffff20}
    .reels-controls>.reels-label{font-size:0!important;letter-spacing:0!important;padding-top:4px}
    .reels-controls>.reels-label:before{font:800 11px/1 Arial,sans-serif;letter-spacing:.12em}
    .reels-controls>.reels-label:nth-of-type(1):before{content:"01 · СУБТИТР СТИЛІ"}
    .reels-controls>.reels-label:nth-of-type(2):before{content:"02 · ТҮС ПАЛИТРАСЫ"}
    .reels-controls>.reels-label:nth-of-type(3):before{content:"03 · МӘТІНІҢІЗ"}
    .reels-controls>.reels-label[data-section="text"]:before{content:"01 · МӘТІНІҢІЗ"}
    .reels-controls>.reels-label[data-section="style"]:before{content:"02 · СУБТИТР СТИЛІ"}
    .reels-controls>.reels-label[data-section="palette"]:before{content:"03 · ТҮС ПАЛИТРАСЫ"}
    .reels-options{margin-top:12px!important;border:0!important;gap:8px!important}
    .reels-options:not(.reels-colors){
      display:grid!important;
      grid-template-columns:none!important;
      grid-template-rows:repeat(2,minmax(56px,auto));
      grid-auto-flow:column;
      grid-auto-columns:calc(25% - 6px);
      overflow-x:auto;
      overflow-y:hidden;
      scroll-snap-type:x mandatory;
      scrollbar-width:thin;
      padding-bottom:6px;
      -webkit-overflow-scrolling:touch;
      overscroll-behavior-x:contain;
      touch-action:pan-x;
      cursor:grab;
    }
    .reels-options:not(.reels-colors)::-webkit-scrollbar{height:4px}
    .reels-options:not(.reels-colors)::-webkit-scrollbar-thumb{background:#ffffff33;border-radius:99px}
    .reels-options:not(.reels-colors) button{min-height:56px;min-width:0;scroll-snap-align:start;padding:8px 10px!important;border:1px solid #ffffff22!important;border-radius:12px!important;background:#191918!important;text-align:left!important;display:grid!important;grid-template-columns:20px 1fr!important;align-items:center!important}
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
    .reels-copy-edit{margin-top:12px!important;display:flex!important;flex-wrap:wrap;gap:8px}
    .reels-copy-edit input{flex:1;min-width:140px;border-radius:10px!important;border-color:#ffffff22!important;background:#161615!important;color:#fff!important;padding:12px!important}
    .reels-copy-edit input.extra-input{flex-basis:100%}
    .reels-copy-edit input[data-layer-off="1"]{display:none!important}
    .reels-size{display:none!important}
    .reels-actions{display:grid!important;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}
    .reels-actions a.reels-act{display:none!important}
    .reels-actions .reels-sticker{grid-column:1/-1;background:#d9ff47!important;color:#171715!important;border-color:#d9ff47!important;min-height:46px}
    .reels-sticker-toast{display:none;margin:0 0 10px;padding:10px 12px;border-radius:10px;background:#d9ff47;color:#171715;font:800 12px/1.35 Arial,sans-serif}
    .reels-sticker-toast[data-show="1"]{display:block}
    .phone-preview.exporting:before{display:none}
    .phone-preview.exporting .reels-handle,.phone-preview.exporting .text-add{display:none!important}
    .phone-preview.exporting .subtitle-stack [data-selected="1"]{outline:none!important}
    .phone-preview.sticker-export{background:transparent!important;border-color:transparent!important;box-shadow:none!important}
    .phone-preview.sticker-export:before,
    .phone-preview.sticker-export .reel-orbit,
    .phone-preview.sticker-export .reel-ui,
    .phone-preview.sticker-export .reel-progress,
    .phone-preview.sticker-export .font-chip{display:none!important}
    @media(max-width:900px){
      .reels-pick{padding:24px 16px 36px!important}
      .reels-pick:before{inset:10px}
      .reels-controls{box-sizing:border-box}
      .reels-copy h2:after{margin-top:12px}
      .phone-preview{position:sticky;top:8px;z-index:12;width:min(158px,42vw)!important;background:#12131a;box-shadow:0 16px 40px #000a}
      .reels-options:not(.reels-colors){grid-auto-columns:calc(50% - 4px)}
      .reels-options:not(.reels-colors) button b{font-size:13px!important}
    }
    @media(max-width:390px){.reels-controls{padding:14px}.reels-options:not(.reels-colors) button{padding:8px!important;min-height:54px}.reels-options:not(.reels-colors) button b{font-size:12px!important}.reels-colors button b{font-size:9px!important}}
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const emptyLayer = (on = false) => ({ x: 0, y: 0, scale: 1, rotation: 0, color: "", bg: null, on, text: "" });
  let state = { hook: emptyLayer(true), mark: emptyLayer(true), extra: emptyLayer(false) };
  try {
    const stored = JSON.parse(localStorage.getItem(STORE) || "{}");
    const oldPos = JSON.parse(localStorage.getItem("qarip-reels-text-position") || "{}");
    ["hook", "mark", "extra"].forEach((key) => {
      const fallbackOn = key !== "extra";
      const saved = stored[key] || {};
      const moved = oldPos[key] || {};
      state[key] = { ...emptyLayer(fallbackOn), ...moved, ...saved };
      if (!Object.prototype.hasOwnProperty.call(saved, "on") && !Object.prototype.hasOwnProperty.call(moved, "on")) {
        state[key].on = fallbackOn;
      }
    });
  } catch {}

  function save() {
    localStorage.setItem(STORE, JSON.stringify(state));
  }

  function paint(stack) {
    ["hook", "mark", "extra"].forEach((key) => {
      const layer = state[key];
      stack.style.setProperty(`--${key}-x`, `${layer.x}px`);
      stack.style.setProperty(`--${key}-y`, `${layer.y}px`);
      stack.style.setProperty(`--${key}-scale`, layer.scale);
      stack.style.setProperty(`--${key}-rotate`, `${layer.rotation}deg`);
    });
  }

  function isOn(key) {
    return state[key].on !== false;
  }

  function visibleKeys() {
    return ["hook", "mark", "extra"].filter(isOn);
  }

  function layerSelector(key) {
    return key === "hook" ? ".sub-hook" : key === "mark" ? ".sub-mark" : ".sub-extra";
  }

  function layerInput(editor, key) {
    if (key === "hook") return editor?.querySelector('input[aria-label="Акцент"]');
    if (key === "mark") return editor?.querySelector('input[aria-label="Қосымша"]');
    return editor?.querySelector(".extra-input");
  }

  function syncLayerVisibility(stack, editor) {
    stack = stack || document.querySelector(".subtitle-stack");
    editor = editor || document.querySelector(".reels-copy-edit");
    const live = visibleKeys();
    if (stack) stack.dataset.one = live.length === 1 ? "1" : "0";
    ["hook", "mark", "extra"].forEach((key) => {
      const on = isOn(key);
      const el = stack?.querySelector(layerSelector(key));
      if (el) {
        if (on) el.removeAttribute("data-layer-off");
        else el.setAttribute("data-layer-off", "1");
      }
      const input = layerInput(editor, key);
      if (input) {
        if (on) input.removeAttribute("data-layer-off");
        else input.setAttribute("data-layer-off", "1");
      }
      const chip = document.querySelector(`.text-layer-picks [data-layer="${key}"]`);
      if (chip) {
        chip.hidden = !on;
        if (on && live.length === 1) chip.setAttribute("data-last", "1");
        else chip.removeAttribute("data-last");
      }
    });
    const addBtn = document.querySelector(".text-add-btn");
    if (addBtn) addBtn.hidden = live.length >= 3;
  }

  function removeLayer(stack, editor, key) {
    if (visibleKeys().length <= 1) {
      toast("Кемінде бір мәтін қалу керек.");
      return;
    }
    state[key].on = false;
    syncLayerVisibility(stack, editor);
    const next = visibleKeys()[0] || "hook";
    selectLayer(stack, next);
    save();
  }

  function addLayer(stack, editor) {
    const next = ["hook", "mark", "extra"].find((key) => !isOn(key));
    if (!next) return;
    if (next === "extra") {
      createExtra(stack, editor, true);
      syncLayerVisibility(stack, editor);
      return;
    }
    state[next].on = true;
    syncLayerVisibility(stack, editor);
    bindLayer(stack, next, layerSelector(next));
    selectLayer(stack, next);
    layerInput(editor, next)?.focus();
    save();
  }

  function setLayerText(el, value) {
    if (!el) return;
    const next = value ?? "";
    let text = [...el.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
    if (!text) {
      text = document.createTextNode(next);
      el.insertBefore(text, el.firstChild);
    } else text.nodeValue = next;
  }

  function applyLayerLook(el, key) {
    if (!el) return;
    const layer = state[key];
    if (layer.color) el.style.setProperty("color", layer.color, "important");
    if (layer.bg) {
      el.style.setProperty("background", layer.bg, "important");
      el.style.setProperty("padding", "7px 11px", "important");
      el.style.setProperty("border-radius", "6px", "important");
      el.style.setProperty("box-shadow", "0 6px 16px #0005", "important");
      el.dataset.hasBg = "1";
    } else if (layer.bg === "") {
      el.style.setProperty("background", "transparent", "important");
      el.style.setProperty("box-shadow", "none", "important");
      if (key !== "mark") el.style.setProperty("padding", "0", "important");
      el.dataset.hasBg = "0";
    }
  }

  function selectedKey(stack) {
    const current = stack.querySelector("[data-selected='1']:not([data-layer-off])");
    if (current?.classList.contains("sub-mark")) return "mark";
    if (current?.classList.contains("sub-extra")) return "extra";
    if (current?.classList.contains("sub-hook")) return "hook";
    return visibleKeys()[0] || "hook";
  }

  function selectLayer(stack, key) {
    if (!isOn(key)) return;
    stack.querySelectorAll("[data-selected]").forEach((item) => item.removeAttribute("data-selected"));
    const el = stack.querySelector(layerSelector(key));
    if (el) el.dataset.selected = "1";
    document.querySelectorAll(".text-layer-picks button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.layer === key);
    });
    syncSwatches(key);
  }

  function syncSwatches(key) {
    const layer = state[key];
    const tools = document.querySelector(".text-color-tools");
    if (!tools) return;
    tools.querySelectorAll("[data-text-color]").forEach((btn) => {
      btn.classList.toggle("active", !!layer.color && btn.dataset.textColor === layer.color);
    });
    tools.querySelectorAll("[data-bg-color]").forEach((btn) => {
      btn.classList.toggle("active", !!layer.bg && btn.dataset.bgColor === layer.bg);
    });
    const off = tools.querySelector(".bg-off");
    if (off) off.classList.toggle("active", layer.bg === "");
    const textNative = tools.querySelector("[data-native='text']");
    const bgNative = tools.querySelector("[data-native='bg']");
    if (textNative && layer.color) textNative.value = layer.color;
    if (bgNative && layer.bg) bgNative.value = layer.bg;
  }

  function layerCenter(element) {
    const rect = element.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }

  function bindHandlePointers(element, resize, rotate, del, stack, key) {
    const select = () => selectLayer(stack, key);
    resize.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      select();
      const center = layerCenter(element);
      const startDist = Math.max(12, Math.hypot(event.clientX - center.x, event.clientY - center.y));
      const startScale = state[key].scale;
      resize.setPointerCapture(event.pointerId);
      const move = (moveEvent) => {
        const dist = Math.hypot(moveEvent.clientX - center.x, moveEvent.clientY - center.y);
        state[key].scale = Math.max(0.25, Math.min(4, startScale * (dist / startDist)));
        paint(stack);
      };
      const end = () => {
        resize.removeEventListener("pointermove", move);
        resize.removeEventListener("pointerup", end);
        resize.removeEventListener("pointercancel", end);
        save();
      };
      resize.addEventListener("pointermove", move);
      resize.addEventListener("pointerup", end);
      resize.addEventListener("pointercancel", end);
    });
    rotate.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      select();
      const center = layerCenter(element);
      const startAng = Math.atan2(event.clientY - center.y, event.clientX - center.x) * (180 / Math.PI);
      const startRot = state[key].rotation;
      rotate.setPointerCapture(event.pointerId);
      const move = (moveEvent) => {
        const ang = Math.atan2(moveEvent.clientY - center.y, moveEvent.clientX - center.x) * (180 / Math.PI);
        state[key].rotation = startRot + (ang - startAng);
        paint(stack);
      };
      const end = () => {
        rotate.removeEventListener("pointermove", move);
        rotate.removeEventListener("pointerup", end);
        rotate.removeEventListener("pointercancel", end);
        save();
      };
      rotate.addEventListener("pointermove", move);
      rotate.addEventListener("pointerup", end);
      rotate.addEventListener("pointercancel", end);
    });
    del.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      removeLayer(stack, document.querySelector(".reels-copy-edit"), key);
    });
  }

  function bindLayer(stack, key, selector) {
    const element = stack.querySelector(selector);
    if (!element) return;
    applyLayerLook(element, key);
    let resize = element.querySelector(":scope > .reels-handle.resize");
    let rotate = element.querySelector(":scope > .reels-handle.rotate");
    let del = element.querySelector(":scope > .reels-handle.delete");
    if (!resize || !rotate || !del) {
      element.querySelectorAll(":scope > .reels-handle").forEach((node) => node.remove());
      resize = document.createElement("span");
      resize.className = "reels-handle resize";
      resize.setAttribute("aria-label", "Өлшемін өзгерту");
      rotate = document.createElement("span");
      rotate.className = "reels-handle rotate";
      rotate.setAttribute("aria-label", "Бұру");
      del = document.createElement("span");
      del.className = "reels-handle delete";
      del.setAttribute("aria-label", "Өшіру");
      element.append(resize, rotate, del);
      bindHandlePointers(element, resize, rotate, del, stack, key);
    }
    if (element.dataset.layerReady === "1") return;
    element.dataset.layerReady = "1";

    const select = () => selectLayer(stack, key);
    element.addEventListener("pointerdown", (event) => {
      if (event.target.closest(".reels-handle")) return;
      if (element._qaripPinch) return;
      event.preventDefault();
      select();
      const start = { pointerX: event.clientX, pointerY: event.clientY, x: state[key].x, y: state[key].y };
      element.setPointerCapture(event.pointerId);
      const move = (moveEvent) => {
        if (element._qaripPinch) return;
        state[key].x = Math.max(-160, Math.min(160, start.x + moveEvent.clientX - start.pointerX));
        state[key].y = Math.max(-240, Math.min(240, start.y + moveEvent.clientY - start.pointerY));
        paint(stack);
      };
      const end = () => {
        element.removeEventListener("pointermove", move);
        element.removeEventListener("pointerup", end);
        element.removeEventListener("pointercancel", end);
        save();
      };
      element.addEventListener("pointermove", move);
      element.addEventListener("pointerup", end);
      element.addEventListener("pointercancel", end);
    });
    const pinchDist = (a, b) => Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
    const pinchAng = (a, b) => Math.atan2(b.clientY - a.clientY, b.clientX - a.clientX) * (180 / Math.PI);
    element.addEventListener(
      "touchstart",
      (event) => {
        if (event.touches.length !== 2) return;
        event.preventDefault();
        select();
        element._qaripPinch = {
          dist: pinchDist(event.touches[0], event.touches[1]),
          ang: pinchAng(event.touches[0], event.touches[1]),
          scale: state[key].scale,
          rotation: state[key].rotation,
        };
      },
      { passive: false }
    );
    element.addEventListener(
      "touchmove",
      (event) => {
        const pinch = element._qaripPinch;
        if (!pinch || event.touches.length !== 2) return;
        event.preventDefault();
        const dist = pinchDist(event.touches[0], event.touches[1]);
        state[key].scale = Math.max(0.25, Math.min(4, pinch.scale * (dist / Math.max(12, pinch.dist))));
        state[key].rotation = pinch.rotation + (pinchAng(event.touches[0], event.touches[1]) - pinch.ang);
        paint(stack);
      },
      { passive: false }
    );
    element.addEventListener("touchend", (event) => {
      if (event.touches.length < 2 && element._qaripPinch) {
        element._qaripPinch = null;
        save();
      }
    });
  }

  function extraInput(editor) {
    let input = editor?.querySelector(".extra-input");
    if (input || !editor) return input;
    input = document.createElement("input");
    input.className = "extra-input";
    input.placeholder = "Жаңа мәтін";
    input.setAttribute("aria-label", "Жаңа мәтін");
    input.value = state.extra.text || "Жаңа мәтін";
    input.addEventListener("input", () => {
      const extra = document.querySelector(".sub-extra");
      state.extra.text = input.value;
      setLayerText(extra, input.value);
      save();
    });
    input.addEventListener("focus", () => {
      const stack = document.querySelector(".subtitle-stack");
      if (stack) selectLayer(stack, "extra");
    });
    editor.append(input);
    return input;
  }

  function createExtra(stack, editor, select = true) {
    let extra = stack.querySelector(".sub-extra");
    if (!extra) {
      extra = document.createElement("span");
      extra.className = "sub-extra";
      extra.append(document.createTextNode(state.extra.text || "Жаңа мәтін"));
      stack.append(extra);
    }
    state.extra.on = true;
    if (!state.extra.text) state.extra.text = "Жаңа мәтін";
    extraInput(editor);
    const chip = document.querySelector('.text-layer-picks [data-layer="extra"]');
    if (chip) chip.hidden = false;
    bindLayer(stack, "extra", ".sub-extra");
    applyLayerLook(extra, "extra");
    if (select) selectLayer(stack, "extra");
    syncLayerVisibility(stack, editor);
    save();
    return extra;
  }

  function swatchButtons(kind) {
    return COLORS.map(
      (color) =>
        `<button type="button" data-${kind}-color="${color}" style="background:${color}" aria-label="${color}"></button>`
    ).join("");
  }

  function toast(message) {
    const controls = document.querySelector(".reels-controls");
    if (!controls) return;
    let el = controls.querySelector(".reels-sticker-toast");
    if (!el) {
      el = document.createElement("p");
      el.className = "reels-sticker-toast";
      controls.prepend(el);
    }
    el.textContent = message;
    el.dataset.show = "1";
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
      el.dataset.show = "0";
    }, 3200);
  }

  function withTimeout(promise, ms, label) {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error(label || "timeout")), ms)),
    ]);
  }

  function loadHtml2Canvas() {
    if (window.html2canvas) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
      script.onload = resolve;
      script.onerror = reject;
      setTimeout(() => reject(new Error("html2canvas")), 12000);
      document.head.appendChild(script);
    });
  }

  function cropTransparent(canvas) {
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    const pixels = ctx.getImageData(0, 0, width, height).data;
    let minX = width;
    let minY = height;
    let maxX = 0;
    let maxY = 0;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (pixels[(y * width + x) * 4 + 3] > 12) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (maxX <= minX || maxY <= minY) return canvas;
    const pad = 36;
    const x = Math.max(0, minX - pad);
    const y = Math.max(0, minY - pad);
    const w = Math.min(width - x, maxX - minX + pad * 2);
    const h = Math.min(height - y, maxY - minY + pad * 2);
    const out = document.createElement("canvas");
    out.width = w;
    out.height = h;
    out.getContext("2d").drawImage(canvas, x, y, w, h, 0, 0, w, h);
    return out;
  }

  async function writePng(blob) {
    try {
      await withTimeout(navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]), 2500, "clipboard");
      return "copied";
    } catch {}
    const link = document.createElement("a");
    link.download = "qarip-sticker.png";
    link.href = URL.createObjectURL(blob);
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 2500);
    return "saved";
  }

  async function renderStackSticker(preview, stack) {
    const frame = preview.getBoundingClientRect();
    const pad = Math.round(Math.max(frame.width, frame.height) * 0.6);
    const host = document.createElement("div");
    host.style.cssText = `position:fixed;left:-12000px;top:0;width:${Math.round(frame.width + pad * 2)}px;height:${Math.round(frame.height + pad * 2)}px;background:transparent;overflow:visible;pointer-events:none`;
    const clone = stack.cloneNode(true);
    clone.querySelectorAll(".reels-handle").forEach((node) => node.remove());
    clone.querySelectorAll("[data-layer-off='1']").forEach((node) => node.remove());
    clone.querySelectorAll("[data-selected]").forEach((node) => node.removeAttribute("data-selected"));
    clone.style.position = "absolute";
    clone.style.left = `${pad}px`;
    clone.style.top = `${pad}px`;
    clone.style.width = `${frame.width}px`;
    clone.style.height = `${frame.height}px`;
    clone.style.inset = "auto";
    clone.style.overflow = "visible";
    clone.style.background = "transparent";
    clone.style.transform = "none";
    ["hook", "mark", "extra"].forEach((key) => {
      ["x", "y", "scale", "rotate"].forEach((prop) => {
        const name = `--${key}-${prop}`;
        clone.style.setProperty(name, stack.style.getPropertyValue(name));
      });
    });
    host.appendChild(clone);
    document.body.appendChild(host);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    try {
      const shot = await withTimeout(
        window.html2canvas(host, {
          scale: 2,
          backgroundColor: null,
          logging: false,
          useCORS: true,
        }),
        15000,
        "html2canvas"
      );
      return cropTransparent(shot);
    } finally {
      host.remove();
    }
  }

  async function copySticker() {
    const preview = document.querySelector(".phone-preview");
    const stack = preview?.querySelector(".subtitle-stack");
    const btn = document.querySelector(".reels-sticker");
    if (!preview || !stack || !btn) return;
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Көшірілуде…";
    preview.classList.add("exporting");
    try {
      await loadHtml2Canvas();
      const canvas = await renderStackSticker(preview, stack);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("blob");
      const result = await writePng(blob);
      toast(
        result === "copied"
          ? "Көшірілді. Instagram Stories-қа қойыңыз."
          : "Стикер сақталды. Stories-қа фотодан қосыңыз."
      );
    } catch (error) {
      console.warn(error);
      toast("Көшіру шықпады. Қайта көріңіз.");
    } finally {
      preview.classList.remove("exporting");
      btn.disabled = false;
      btn.textContent = label;
    }
  }

  function bindStyleCarousel() {
    const rail = document.querySelector(".reels-options:not(.reels-colors)");
    if (!rail || rail.dataset.carouselReady === "1") return;
    rail.dataset.carouselReady = "1";
    let drag = null;
    rail.addEventListener("pointerdown", (event) => {
      drag = { x: event.clientX, left: rail.scrollLeft, moved: false, id: event.pointerId };
      rail.setPointerCapture(event.pointerId);
    });
    rail.addEventListener("pointermove", (event) => {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x;
      if (Math.abs(dx) > 8) {
        drag.moved = true;
        rail.dataset.dragged = "1";
      }
      if (drag.moved) rail.scrollLeft = drag.left - dx;
    });
    const end = () => {
      drag = null;
      setTimeout(() => {
        rail.dataset.dragged = "0";
      }, 0);
    };
    rail.addEventListener("pointerup", end);
    rail.addEventListener("pointercancel", end);
    rail.addEventListener(
      "click",
      (event) => {
        if (rail.dataset.dragged !== "1") return;
        event.preventDefault();
        event.stopPropagation();
      },
      true
    );
  }

  function keepStyleInCarousel() {
    const rail = document.querySelector(".reels-options:not(.reels-colors)");
    const selected = rail?.querySelector("button.selected");
    if (!rail || !selected) return;
    const railBox = rail.getBoundingClientRect();
    const btnBox = selected.getBoundingClientRect();
    if (btnBox.left >= railBox.left && btnBox.right <= railBox.right) return;
    rail.scrollBy({ left: btnBox.left - railBox.left - 8, behavior: "auto" });
  }

  function ensureStickerButton() {
    const actions = document.querySelector(".reels-actions");
    if (!actions || actions.querySelector(".reels-sticker")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "reels-act reels-sticker";
    button.textContent = "Стикер · Instagram";
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      copySticker();
    });
    actions.prepend(button);
  }

  function boot() {
    const preview = document.querySelector(".phone-preview");
    const stack = preview?.querySelector(".subtitle-stack");
    const editor = document.querySelector(".reels-copy-edit");
    if (!preview || !stack) return;
    paint(stack);
    if (state.extra.on) {
      if (!stack.querySelector(".sub-extra")) createExtra(stack, editor, false);
      else {
        extraInput(editor);
        const chip = document.querySelector('.text-layer-picks [data-layer="extra"]');
        if (chip) chip.hidden = false;
      }
    }
    LAYERS.forEach(([key, selector]) => bindLayer(stack, key, selector));
    syncLayerVisibility(stack, editor);

    const hookInput = editor?.querySelector('input[aria-label="Акцент"]');
    const markInput = editor?.querySelector('input[aria-label="Қосымша"]');
    hookInput?.addEventListener("focus", () => selectLayer(stack, "hook"));
    markInput?.addEventListener("focus", () => selectLayer(stack, "mark"));

    if (preview.dataset.toolsReady === "1") {
      applyLayerLook(stack.querySelector(".sub-hook"), "hook");
      applyLayerLook(stack.querySelector(".sub-mark"), "mark");
      applyLayerLook(stack.querySelector(".sub-extra"), "extra");
      syncLayerVisibility(stack, editor);
      ensureStickerButton();
      if (!stack.querySelector("[data-selected='1']:not([data-layer-off])")) {
        selectLayer(stack, visibleKeys()[0] || "hook");
      }
      bindStyleCarousel();
      keepStyleInCarousel();
      return;
    }
    preview.dataset.toolsReady = "1";

    const tools = document.createElement("div");
    tools.className = "text-color-tools";
    tools.innerHTML = `
      <button type="button" class="text-add-btn">+ Мәтін қосу</button>
      <div class="text-layer-picks">
        <button type="button" class="active" data-layer="hook">Акцент<span class="layer-x" aria-label="Өшіру">×</span></button>
        <button type="button" data-layer="mark">Қосымша<span class="layer-x" aria-label="Өшіру">×</span></button>
        <button type="button" data-layer="extra" hidden>Жаңа мәтін<span class="layer-x" aria-label="Өшіру">×</span></button>
      </div>
      <div class="text-tool-row" data-row="text">
        <span>ТҮС</span>
        ${swatchButtons("text")}
        <input type="color" data-native="text" value="#ffffff" aria-label="Мәтін түсі">
      </div>
      <div class="text-tool-row" data-row="bg">
        <span>ФОН</span>
        ${swatchButtons("bg")}
        <input type="color" data-native="bg" value="#d9ff47" aria-label="Мәтін фоны">
        <button type="button" class="bg-off">ЖОҚ</button>
      </div>
    `;
    editor?.after(tools);

    const controls = document.querySelector(".reels-controls");
    const labels = controls?.querySelectorAll(":scope > .reels-label");
    const styleLabel = labels?.[0];
    const paletteLabel = labels?.[1];
    const textLabel = labels?.[2];
    if (styleLabel && paletteLabel && textLabel) {
      styleLabel.dataset.section = "style";
      paletteLabel.dataset.section = "palette";
      textLabel.dataset.section = "text";
      controls.insertBefore(textLabel, styleLabel);
      controls.insertBefore(editor, styleLabel);
      controls.insertBefore(tools, styleLabel);
    }

    tools.querySelector(".text-add-btn").addEventListener("click", () => addLayer(stack, editor));
    tools.querySelector(".text-layer-picks").addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-layer]");
      if (!btn || btn.hidden) return;
      event.preventDefault();
      event.stopPropagation();
      if (event.target.closest(".layer-x")) {
        removeLayer(stack, editor, btn.dataset.layer);
        return;
      }
      selectLayer(stack, btn.dataset.layer);
    });
    tools.addEventListener("click", (event) => {
      const off = event.target.closest(".bg-off");
      const textBtn = event.target.closest("[data-text-color]");
      const bgBtn = event.target.closest("[data-bg-color]");
      if (!off && !textBtn && !bgBtn) return;
      const key = selectedKey(stack);
      const el = stack.querySelector(key === "hook" ? ".sub-hook" : key === "mark" ? ".sub-mark" : ".sub-extra");
      if (off) state[key].bg = "";
      if (textBtn) state[key].color = textBtn.dataset.textColor;
      if (bgBtn) state[key].bg = bgBtn.dataset.bgColor;
      applyLayerLook(el, key);
      syncSwatches(key);
      save();
    });
    tools.querySelector("[data-native='text']").addEventListener("input", (event) => {
      const key = selectedKey(stack);
      state[key].color = event.target.value;
      applyLayerLook(
        stack.querySelector(key === "hook" ? ".sub-hook" : key === "mark" ? ".sub-mark" : ".sub-extra"),
        key
      );
      syncSwatches(key);
      save();
    });
    tools.querySelector("[data-native='bg']").addEventListener("input", (event) => {
      const key = selectedKey(stack);
      state[key].bg = event.target.value;
      applyLayerLook(
        stack.querySelector(key === "hook" ? ".sub-hook" : key === "mark" ? ".sub-mark" : ".sub-extra"),
        key
      );
      syncSwatches(key);
      save();
    });

    if (!stack.querySelector("[data-selected='1']:not([data-layer-off])")) {
      selectLayer(stack, visibleKeys()[0] || "hook");
    }
    ensureStickerButton();
    bindStyleCarousel();
    keepStyleInCarousel();
    if (preview.dataset.observeReady !== "1") {
      preview.dataset.observeReady = "1";
      let timer = 0;
      new MutationObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(() => boot(), 30);
      }).observe(stack, { childList: true });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", () => setTimeout(boot, 220));
})();
