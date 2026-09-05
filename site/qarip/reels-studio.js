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
    .phone-preview{
      position:relative;
      width:min(720px,96vw)!important;
      max-width:100%;
      aspect-ratio:16/9!important;
      height:auto!important;
      border:1px solid #ffffff22!important;
      border-radius:16px!important;
      background:#101014!important;
      box-shadow:0 18px 40px #0006;
      overflow:hidden!important;
    }
    .phone-preview:before,.phone-preview:after{display:none!important}
    .reel-ui,.reel-progress,.reel-orbit,.font-chip{display:none!important}
    .subtitle-stack{z-index:4!important;inset:0!important;width:auto!important;height:auto!important;overflow:hidden!important;transform:none!important;text-align:center!important;text-shadow:0 4px 18px #000!important;pointer-events:none}
    .subtitle-stack .sub-hook,.subtitle-stack .sub-mark,.subtitle-stack .sub-extra{position:absolute;left:50%;display:inline-block!important;box-sizing:border-box!important;text-align:center;max-width:calc(100% - 28px);margin:0!important;overflow-wrap:anywhere;word-break:break-word;white-space:normal!important;touch-action:none;user-select:none;cursor:grab;pointer-events:auto}
    .subtitle-stack .sub-hook{top:38%;letter-spacing:-.045em;text-transform:none!important;line-height:.92!important;transform:translate(calc(-50% + var(--hook-x,0px)),calc(-50% + var(--hook-y,0px))) rotate(var(--hook-rotate,0deg)) scale(var(--hook-scale,1))}
    .subtitle-stack .sub-mark{top:58%;padding:8px 13px!important;border-radius:5px;box-shadow:0 7px 18px #0005;transform:translate(calc(-50% + var(--mark-x,0px)),calc(-50% + var(--mark-y,0px))) rotate(var(--mark-rotate,0deg)) scale(var(--mark-scale,1))}
    .subtitle-stack .sub-extra{top:74%;color:#fff;font:700 18px/1.1 Arial,sans-serif;transform:translate(calc(-50% + var(--extra-x,0px)),calc(-50% + var(--extra-y,0px))) rotate(var(--extra-rotate,0deg)) scale(var(--extra-scale,1))}
    .subtitle-stack .sub-hook:active,.subtitle-stack .sub-mark:active,.subtitle-stack .sub-extra:active{cursor:grabbing}
    .subtitle-stack [data-selected="1"]{outline:2px solid #d9ff47;outline-offset:10px}
    .reels-handle{display:none;position:absolute;z-index:12;width:30px;height:30px;border:2px solid #fff;border-radius:50%;background:#171715;box-shadow:0 2px 10px #000a;touch-action:none;pointer-events:auto}
    [data-selected="1"]>.reels-handle{display:block!important}
    .reels-handle.resize,.reels-handle.stretch-l{
      top:50%;bottom:auto;width:18px;height:32px;border-radius:9px;background:#d9ff47;border-color:#171715;cursor:ew-resize;transform:translateY(-50%)
    }
    .reels-handle.resize{right:-16px;left:auto}
    .reels-handle.stretch-l{left:-16px;right:auto}
    .reels-handle.scale{
      right:-18px;bottom:-18px;top:auto;left:auto;width:22px;height:22px;
      background:#d9ff47;border-color:#171715;cursor:nwse-resize;transform:none
    }
    .reels-handle.rotate{left:50%;top:-40px;transform:translateX(-50%)}
    .reels-handle.rotate:after{content:"";position:absolute;width:2px;height:12px;background:#fff;left:50%;top:28px;transform:translateX(-50%)}
    .reels-handle.delete{left:-18px;top:-18px;width:26px;height:26px;background:#ff2d7b;border-color:#fff;color:#fff;font:800 16px/26px Arial,sans-serif;text-align:center}
    .reels-handle.delete:before{content:"×"}
    .reels-guide{position:absolute;z-index:6;background:#d9ff47;pointer-events:none;opacity:0}
    .reels-guide.x{top:0;bottom:0;left:50%;width:1px;transform:translateX(-50%)}
    .reels-guide.y{left:0;right:0;top:50%;height:1px;transform:translateY(-50%)}
    .phone-preview[data-snap-x="1"] .reels-guide.x,
    .phone-preview[data-snap-y="1"] .reels-guide.y{opacity:.9}
    .subtitle-stack [data-snap-rot="1"]{outline-color:#fff}
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
    .text-face-row button{width:auto!important;height:32px!important;min-width:72px;border:1px solid #ffffff22!important;border-radius:8px!important;background:#191918;color:#fff;padding:0 12px;font:700 12px/1 Arial,sans-serif}
    .text-face-row button.active{background:#d9ff47;color:#171715;outline:none}
    .text-face-row button[data-face="regular"]{font-weight:400}
    .text-face-row button[data-face="bold"]{font-weight:800}
    .text-face-row button[data-face="italic"]{font-style:italic;font-weight:600}
    .reels-controls{position:relative;z-index:1;width:min(520px,100%);padding:22px;border:1px solid #ffffff18;border-radius:22px;background:#20201d;box-shadow:0 20px 45px #0004}
    .reels-label{display:flex;align-items:center;gap:10px;margin:0!important;color:#d9ff47!important;font:800 10px/1 Arial,sans-serif!important;letter-spacing:.16em}
    .reels-label:after{content:"";height:1px;flex:1;background:#ffffff20}
    .reels-controls>.reels-label{font-size:0!important;letter-spacing:0!important;padding-top:4px}
    .reels-controls>.reels-label:before{font:800 11px/1 Arial,sans-serif;letter-spacing:.12em}
    .reels-controls>.reels-label:nth-of-type(1):before{content:"01 · СУБТИТР СТИЛІ"}
    .reels-controls>.reels-label:nth-of-type(2):before{content:"02 · ТҮС ПАЛИТРАСЫ"}
    .reels-controls>.reels-label:nth-of-type(3):before{content:"03 · МӘТІНІҢІЗ"}
    .reels-controls>.reels-label[data-section="text"]:before{content:"01 · МӘТІНІҢІЗ"}
    .reels-controls>.reels-label[data-section="style"]:before{content:"02 · ҚАРІП"}
    .reels-controls>.reels-label[data-section="palette"],
    .reels-options{display:none!important}
    .reels-font-pick{margin-top:10px}
    .reels-font-search{width:100%;box-sizing:border-box;min-height:44px;border:1px solid #ffffff22;border-radius:10px;background:#161615;color:#fff;padding:12px 14px;font:700 14px/1 Arial,sans-serif}
    .reels-font-list{margin-top:8px;max-height:min(32vh,260px);overflow:auto;display:grid;gap:6px;-webkit-overflow-scrolling:touch}
    .reels-font-item{display:grid;grid-template-columns:1fr auto;align-items:center;gap:10px;min-height:54px;padding:8px 12px;border:1px solid #ffffff18;border-radius:10px;background:#191918;color:#fff;text-align:left;cursor:pointer}
    .reels-font-item b{font-size:20px;font-weight:700;line-height:1.1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .reels-font-item small{color:#8a8a84;font:700 11px/1 Arial,sans-serif;letter-spacing:.04em}
    .reels-font-item.active{background:#d9ff47;color:#171715;border-color:#d9ff47}
    .reels-font-item.active small{color:#4d4d47}
    .reels-font-empty{color:#8a8a84;margin:0;padding:14px 4px;font:700 13px/1.4 Arial,sans-serif}
    .reels-copy-edit{margin-top:12px!important;display:flex!important;flex-wrap:wrap;gap:8px}
    .reels-copy-edit input{flex:1;min-width:140px;border-radius:10px!important;border-color:#ffffff22!important;background:#161615!important;color:#fff!important;padding:12px!important}
    .reels-copy-edit input.extra-input{flex-basis:100%}
    .reels-copy-edit input[data-layer-off="1"]{display:none!important}
    .reels-size{display:none!important}
    .reels-actions{display:grid!important;grid-template-columns:1fr;gap:8px;margin-top:14px}
    .reels-actions .reels-act:not(.reels-sticker){display:none!important}
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
    .phone-preview.sticker-export .font-chip,
    .phone-preview.sticker-export .reels-guide{display:none!important}
    @media(max-width:900px){
      .reels-pick{padding:24px 16px 36px!important}
      .reels-pick:before{inset:10px}
      .reels-controls{box-sizing:border-box}
      .reels-copy h2:after{margin-top:12px}
      .phone-preview{position:sticky;top:8px;z-index:12;width:min(100%,96vw)!important;aspect-ratio:16/9!important}
    }
    @media(max-width:390px){.reels-controls{padding:14px}}
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const emptyLayer = (on = false) => ({ x: 0, y: 0, scale: 1, boxW: 0, rotation: 0, color: "", bg: null, on, text: "", family: "", face: "" });
  let state = { hook: emptyLayer(true), mark: emptyLayer(true), extra: emptyLayer(false) };
  try {
    const stored = JSON.parse(localStorage.getItem(STORE) || "{}");
    const oldPos = JSON.parse(localStorage.getItem("qarip-reels-text-position") || "{}");
    ["hook", "mark", "extra"].forEach((key) => {
      const fallbackOn = key !== "extra";
      const saved = stored[key] || {};
      const moved = oldPos[key] || {};
      state[key] = { ...emptyLayer(fallbackOn), ...moved, ...saved };
      state[key].stretch = 1;
      if (!(state[key].boxW > 0)) state[key].boxW = 0;
      if (!Object.prototype.hasOwnProperty.call(saved, "on") && !Object.prototype.hasOwnProperty.call(moved, "on")) {
        state[key].on = fallbackOn;
      }
    });
  } catch {}

  function save() {
    localStorage.setItem(STORE, JSON.stringify(state));
  }

  function applyBox(el, key) {
    if (!el) return;
    const w = Number(state[key].boxW) || 0;
    if (w > 0) {
      el.style.setProperty("width", `${Math.round(w)}px`, "important");
      el.style.setProperty("box-sizing", "border-box", "important");
    } else {
      el.style.removeProperty("width");
    }
  }

  function paint(stack) {
    ["hook", "mark", "extra"].forEach((key) => {
      const layer = state[key];
      stack.style.setProperty(`--${key}-x`, `${layer.x}px`);
      stack.style.setProperty(`--${key}-y`, `${layer.y}px`);
      stack.style.setProperty(`--${key}-scale`, layer.scale);
      stack.style.setProperty(`--${key}-rotate`, `${layer.rotation}deg`);
      applyBox(stack.querySelector(layerSelector(key)), key);
    });
  }

  function containLayer(stack, key, mayScale = true) {
    const preview = stack?.closest(".phone-preview") || document.querySelector(".phone-preview");
    const el = stack?.querySelector(layerSelector(key));
    if (!preview || !el || !isOn(key)) return;
    const pad = 18;
    const frame = preview.getBoundingClientRect();
    const innerW = frame.width - pad * 2;
    const innerH = frame.height - pad * 2;
    if (innerW < 24 || innerH < 24) return;
    for (let i = 0; i < 5; i += 1) {
      const box = el.getBoundingClientRect();
      if (box.width < 1 || box.height < 1) return;
      if (box.width > innerW + 0.5) {
        if (mayScale) {
          state[key].scale = Math.max(0.25, state[key].scale * (innerW / box.width));
        } else {
          const layoutW = Math.max(48, el.offsetWidth);
          state[key].boxW = Math.max(48, layoutW * (innerW / box.width));
        }
        paint(stack);
        continue;
      }
      if (mayScale && box.height > innerH + 0.5) {
        state[key].scale = Math.max(0.25, state[key].scale * (innerH / box.height));
        paint(stack);
        continue;
      }
      let dx = 0;
      let dy = 0;
      const left = box.left - (frame.left + pad);
      const right = frame.right - pad - box.right;
      const top = box.top - (frame.top + pad);
      const bottom = frame.bottom - pad - box.bottom;
      if (left < 0 && right >= 0) dx = -left;
      else if (right < 0 && left >= 0) dx = right;
      if (top < 0 && bottom >= 0) dy = -top;
      else if (bottom < 0 && top >= 0) dy = bottom;
      if (!dx && !dy) return;
      state[key].x += dx;
      state[key].y += dy;
      paint(stack);
    }
  }

  function containAll(stack) {
    visibleKeys().forEach((key) => containLayer(stack, key, true));
  }

  const ANGLE_STOPS = [0, 45, 90, 135, 180, 225, 270, 315];
  const ANGLE_SNAP = 8;
  const AXIS_SNAP = 8;

  function snapAngle(deg) {
    const a = ((deg % 360) + 360) % 360;
    let nearest = 0;
    let best = 999;
    ANGLE_STOPS.forEach((stop) => {
      let delta = Math.abs(a - stop);
      if (delta > 180) delta = 360 - delta;
      if (delta < best) {
        best = delta;
        nearest = stop;
      }
    });
    if (best <= ANGLE_SNAP) return nearest;
    return deg;
  }

  function ensureGuides(preview) {
    if (!preview || preview.querySelector(".reels-guide")) return;
    const x = document.createElement("i");
    x.className = "reels-guide x";
    const y = document.createElement("i");
    y.className = "reels-guide y";
    preview.append(x, y);
  }

  function setSnap(preview, el, flags) {
    if (preview) {
      preview.dataset.snapX = flags.x ? "1" : "0";
      preview.dataset.snapY = flags.y ? "1" : "0";
    }
    if (el) {
      if (flags.rot) el.dataset.snapRot = "1";
      else el.removeAttribute("data-snap-rot");
    }
  }

  function clearSnap(preview, el) {
    setSnap(preview, el, { x: false, y: false, rot: false });
  }

  function magnetMove(stack, key) {
    const preview = stack.closest(".phone-preview") || document.querySelector(".phone-preview");
    const el = stack.querySelector(layerSelector(key));
    if (!preview || !el) return;
    ensureGuides(preview);
    const frame = preview.getBoundingClientRect();
    const box = el.getBoundingClientRect();
    const cx = frame.left + frame.width / 2;
    const cy = frame.top + frame.height / 2;
    const lx = box.left + box.width / 2;
    const ly = box.top + box.height / 2;
    const flags = { x: false, y: false, rot: false };
    if (Math.abs(lx - cx) <= AXIS_SNAP) {
      state[key].x += cx - lx;
      flags.x = true;
    }
    if (Math.abs(ly - cy) <= AXIS_SNAP) {
      state[key].y += cy - ly;
      flags.y = true;
    }
    paint(stack);
    setSnap(preview, el, flags);
  }

  function magnetRotate(stack, key, raw) {
    const snapped = snapAngle(raw);
    state[key].rotation = snapped;
    const preview = stack.closest(".phone-preview") || document.querySelector(".phone-preview");
    const el = stack.querySelector(layerSelector(key));
    if (preview) ensureGuides(preview);
    const a = ((snapped % 360) + 360) % 360;
    setSnap(preview, el, { x: false, y: false, rot: ANGLE_STOPS.includes(a) });
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
    applyBox(el, key);
    if (layer.family) el.style.setProperty("font-family", layer.family, "important");
    if (layer.face === "regular") {
      el.style.setProperty("font-weight", "400", "important");
      el.style.setProperty("font-style", "normal", "important");
    } else if (layer.face === "bold") {
      el.style.setProperty("font-weight", "800", "important");
      el.style.setProperty("font-style", "normal", "important");
    } else if (layer.face === "italic") {
      el.style.setProperty("font-weight", "700", "important");
      el.style.setProperty("font-style", "italic", "important");
    }
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
    syncFace(key);
    syncFontActive();
  }

  function inferFace(el, layer) {
    if (layer?.face) return layer.face;
    if (!el) return "regular";
    const style = getComputedStyle(el);
    const italic = style.fontStyle === "italic" || style.fontStyle === "oblique";
    const bold = parseInt(style.fontWeight, 10) >= 600;
    if (italic) return "italic";
    if (bold) return "bold";
    return "regular";
  }

  function syncFace(key) {
    const tools = document.querySelector(".text-color-tools");
    if (!tools) return;
    const stack = document.querySelector(".subtitle-stack");
    const el = stack?.querySelector(layerSelector(key));
    const face = inferFace(el, state[key]);
    tools.querySelectorAll("[data-face]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.face === face);
    });
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

  function axisX(center, rotationDeg, x, y) {
    const rot = (rotationDeg * Math.PI) / 180;
    return (x - center.x) * Math.cos(rot) + (y - center.y) * Math.sin(rot);
  }

  function bindStretchHandle(handle, element, stack, key) {
    const select = () => selectLayer(stack, key);
    handle.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      select();
      const center = layerCenter(element);
      const startHalf = Math.max(12, element.getBoundingClientRect().width / 2);
      const startW = Math.max(48, state[key].boxW || element.offsetWidth);
      handle.setPointerCapture(event.pointerId);
      const move = (moveEvent) => {
        const now = Math.abs(axisX(center, state[key].rotation, moveEvent.clientX, moveEvent.clientY));
        const preview = stack.closest(".phone-preview");
        const innerW = (preview?.getBoundingClientRect().width || 720) - 36;
        const maxW = innerW / Math.max(0.25, state[key].scale || 1);
        state[key].boxW = Math.max(48, Math.min(maxW, startW * (now / startHalf)));
        paint(stack);
        containLayer(stack, key, false);
      };
      const end = () => {
        handle.removeEventListener("pointermove", move);
        handle.removeEventListener("pointerup", end);
        handle.removeEventListener("pointercancel", end);
        save();
      };
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", end);
      handle.addEventListener("pointercancel", end);
    });
  }

  function bindScaleHandle(handle, element, stack, key) {
    const select = () => selectLayer(stack, key);
    handle.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      select();
      const center = layerCenter(element);
      const startDist = Math.max(12, Math.hypot(event.clientX - center.x, event.clientY - center.y));
      const startScale = state[key].scale;
      handle.setPointerCapture(event.pointerId);
      const move = (moveEvent) => {
        const dist = Math.hypot(moveEvent.clientX - center.x, moveEvent.clientY - center.y);
        state[key].scale = Math.max(0.25, Math.min(4, startScale * (dist / startDist)));
        paint(stack);
        containLayer(stack, key, true);
      };
      const end = () => {
        handle.removeEventListener("pointermove", move);
        handle.removeEventListener("pointerup", end);
        handle.removeEventListener("pointercancel", end);
        save();
      };
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", end);
      handle.addEventListener("pointercancel", end);
    });
  }

  function bindHandlePointers(element, resize, rotate, del, stack, key, stretchL, scaleH) {
    const select = () => selectLayer(stack, key);
    bindStretchHandle(resize, element, stack, key);
    if (stretchL) bindStretchHandle(stretchL, element, stack, key);
    if (scaleH) bindScaleHandle(scaleH, element, stack, key);
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
        magnetRotate(stack, key, startRot + (ang - startAng));
        paint(stack);
        containLayer(stack, key, true);
      };
      const end = () => {
        rotate.removeEventListener("pointermove", move);
        rotate.removeEventListener("pointerup", end);
        rotate.removeEventListener("pointercancel", end);
        clearSnap(stack.closest(".phone-preview"), element);
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
    let stretchL = element.querySelector(":scope > .reels-handle.stretch-l");
    let scaleH = element.querySelector(":scope > .reels-handle.scale");
    let rotate = element.querySelector(":scope > .reels-handle.rotate");
    let del = element.querySelector(":scope > .reels-handle.delete");
    if (!resize || !stretchL || !scaleH || !rotate || !del || resize.dataset.box !== "2") {
      element.querySelectorAll(":scope > .reels-handle").forEach((node) => node.remove());
      resize = document.createElement("span");
      resize.className = "reels-handle resize";
      resize.dataset.box = "2";
      resize.setAttribute("aria-label", "Рамканы созу");
      stretchL = document.createElement("span");
      stretchL.className = "reels-handle stretch-l";
      stretchL.dataset.box = "2";
      stretchL.setAttribute("aria-label", "Рамканы созу");
      scaleH = document.createElement("span");
      scaleH.className = "reels-handle scale";
      scaleH.setAttribute("aria-label", "Мәтін өлшемі");
      rotate = document.createElement("span");
      rotate.className = "reels-handle rotate";
      rotate.setAttribute("aria-label", "Бұру");
      del = document.createElement("span");
      del.className = "reels-handle delete";
      del.setAttribute("aria-label", "Өшіру");
      element.append(resize, stretchL, scaleH, rotate, del);
      bindHandlePointers(element, resize, rotate, del, stack, key, stretchL, scaleH);
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
        state[key].x = start.x + moveEvent.clientX - start.pointerX;
        state[key].y = start.y + moveEvent.clientY - start.pointerY;
        paint(stack);
        magnetMove(stack, key);
        containLayer(stack, key, false);
      };
      const end = () => {
        element.removeEventListener("pointermove", move);
        element.removeEventListener("pointerup", end);
        element.removeEventListener("pointercancel", end);
        clearSnap(stack.closest(".phone-preview"), element);
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
        magnetRotate(stack, key, pinch.rotation + (pinchAng(event.touches[0], event.touches[1]) - pinch.ang));
        paint(stack);
        containLayer(stack, key, true);
      },
      { passive: false }
    );
    element.addEventListener("touchend", (event) => {
      if (event.touches.length < 2 && element._qaripPinch) {
        element._qaripPinch = null;
        clearSnap(stack.closest(".phone-preview"), element);
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
      const stack = document.querySelector(".subtitle-stack");
      if (stack) containLayer(stack, "extra", true);
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

  function cropToVisibleLayers(canvas, preview, stack) {
    const frame = preview.getBoundingClientRect();
    if (!frame.width || !frame.height) return cropTransparent(canvas);
    const nodes = ["hook", "mark", "extra"]
      .filter(isOn)
      .map((key) => stack.querySelector(layerSelector(key)))
      .filter((el) => el && getComputedStyle(el).display !== "none");
    if (!nodes.length) return cropTransparent(canvas);
    const scaleX = canvas.width / frame.width;
    const scaleY = canvas.height / frame.height;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    nodes.forEach((el) => {
      const rect = el.getBoundingClientRect();
      minX = Math.min(minX, rect.left);
      minY = Math.min(minY, rect.top);
      maxX = Math.max(maxX, rect.right);
      maxY = Math.max(maxY, rect.bottom);
    });
    const pad = 28;
    const x = Math.max(0, Math.floor((minX - frame.left) * scaleX - pad));
    const y = Math.max(0, Math.floor((minY - frame.top) * scaleY - pad));
    const w = Math.min(canvas.width - x, Math.ceil((maxX - minX) * scaleX + pad * 2));
    const h = Math.min(canvas.height - y, Math.ceil((maxY - minY) * scaleY + pad * 2));
    if (w < 8 || h < 8) return cropTransparent(canvas);
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
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const shot = await withTimeout(
      window.html2canvas(preview, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true,
        onclone(doc) {
          const clone = doc.querySelector(".phone-preview");
          if (!clone) return;
          clone.style.setProperty("background", "transparent", "important");
          clone.style.setProperty("border-color", "transparent", "important");
          clone.style.setProperty("box-shadow", "none", "important");
          clone.querySelectorAll(".reels-handle, .reel-ui, .reel-orbit, .reel-progress, .font-chip").forEach((node) => node.remove());
          clone.querySelectorAll("[data-layer-off='1']").forEach((node) => node.remove());
          clone.querySelectorAll("[data-selected]").forEach((node) => node.removeAttribute("data-selected"));
        },
      }),
      15000,
      "html2canvas"
    );
    return cropToVisibleLayers(shot, preview, stack);
  }

  async function copySticker() {
    const preview = document.querySelector(".phone-preview");
    const stack = preview?.querySelector(".subtitle-stack");
    const btn = document.querySelector(".reels-sticker");
    if (!preview || !stack || !btn) return;
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Көшірілуде…";
    preview.classList.add("exporting", "sticker-export");
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
      preview.classList.remove("exporting", "sticker-export");
      btn.disabled = false;
      btn.textContent = label;
    }
  }

  function escHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[char]));
  }

  function catalogFonts() {
    const seen = new Set();
    const fonts = [];
    document.querySelectorAll(".font-card").forEach((card) => {
      const name = card.querySelector("h3")?.textContent?.trim();
      const preview = card.querySelector(".font-preview");
      const family = preview?.style.fontFamily || "";
      if (!name || !family || seen.has(name)) return;
      seen.add(name);
      fonts.push({ name, family });
    });
    return fonts;
  }

  function applyFontToSelected(stack, family, name) {
    const key = selectedKey(stack);
    state[key].family = family;
    state[key].fontName = name;
    applyLayerLook(stack.querySelector(layerSelector(key)), key);
    if (document.fonts?.load && family) {
      const face = state[key].face;
      const weight = face === "regular" ? "400" : "700";
      const style = face === "italic" ? "italic" : "normal";
      document.fonts.load(`${style} ${weight} 48px ${family}`).catch(() => {}).finally(() => containLayer(stack, key, true));
    } else {
      containLayer(stack, key, true);
    }
    save();
    syncFontActive();
  }

  function syncFontActive() {
    const stack = document.querySelector(".subtitle-stack");
    const pick = document.querySelector(".reels-font-pick");
    if (!stack || !pick) return;
    const key = selectedKey(stack);
    const selectedName = state[key]?.fontName || "";
    const selectedFamily = state[key]?.family || "";
    const list = pick.querySelector(".reels-font-list");
    list?.querySelectorAll(".reels-font-item").forEach((item) => {
      const family = decodeURIComponent(item.dataset.family || "");
      const on = selectedName ? item.dataset.name === selectedName : family === selectedFamily;
      item.classList.toggle("active", on);
    });
    const active = list?.querySelector(".reels-font-item.active");
    if (!list || !active) return;
    const listBox = list.getBoundingClientRect();
    const itemBox = active.getBoundingClientRect();
    if (itemBox.top < listBox.top || itemBox.bottom > listBox.bottom) {
      active.scrollIntoView({ block: "nearest" });
    }
  }

  function renderFontList(stack) {
    const pick = document.querySelector(".reels-font-pick");
    if (!pick) return;
    const query = pick.querySelector(".reels-font-search")?.value.trim().toLowerCase() || "";
    const list = pick.querySelector(".reels-font-list");
    const fonts = catalogFonts().filter((font) => !query || font.name.toLowerCase().includes(query));
    if (!list) return;
    if (!fonts.length) {
      list.innerHTML = '<p class="reels-font-empty">Қаріп табылмады.</p>';
      return;
    }
    const key = selectedKey(stack || document.querySelector(".subtitle-stack"));
    const selectedName = state[key]?.fontName || "";
    const selectedFamily = state[key]?.family || "";
    list.innerHTML = fonts
      .map((font) => {
        const on = selectedName ? font.name === selectedName : font.family === selectedFamily;
        return `<button type="button" class="reels-font-item${on ? " active" : ""}" data-name="${escHtml(font.name)}" data-family="${encodeURIComponent(font.family)}"><b style="font-family:${escHtml(font.family)}">${escHtml(font.name)}</b><small>Әә Ғғ Ққ</small></button>`;
      })
      .join("");
  }

  function ensureFontPicker(stack) {
    const controls = document.querySelector(".reels-controls");
    if (!controls) return;
    const styleLabel =
      controls.querySelector('.reels-label[data-section="style"]') ||
      [...controls.querySelectorAll(":scope > .reels-label")].find((label) => label.dataset.section !== "text" && label.dataset.section !== "palette");
    let pick = controls.querySelector(".reels-font-pick");
    if (!pick) {
      pick = document.createElement("div");
      pick.className = "reels-font-pick";
      pick.innerHTML =
        '<input class="reels-font-search" type="search" placeholder="Қаріп атауын іздеу..." aria-label="Қаріп іздеу"><div class="reels-font-list"></div>';
      if (styleLabel) styleLabel.after(pick);
      else controls.append(pick);
      pick.querySelector(".reels-font-search").addEventListener("input", () => renderFontList(stack));
      pick.querySelector(".reels-font-list").addEventListener("click", (event) => {
        const item = event.target.closest(".reels-font-item");
        if (!item) return;
        const named = catalogFonts().find((font) => font.name === item.dataset.name);
        const family = named?.family || decodeURIComponent(item.dataset.family || "");
        applyFontToSelected(stack, family, item.dataset.name);
      });
    }
    if (controls.dataset.fontPickObserve !== "1") {
      controls.dataset.fontPickObserve = "1";
      let restore = 0;
      new MutationObserver(() => {
        if (controls.querySelector(".reels-font-pick")) return;
        clearTimeout(restore);
        restore = setTimeout(() => ensureFontPicker(stack), 40);
      }).observe(controls, { childList: true });
    }
    renderFontList(stack);
    const grid = document.querySelector(".font-grid");
    if (grid && grid.dataset.fontPickWatch !== "1") {
      grid.dataset.fontPickWatch = "1";
      let timer = 0;
      new MutationObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(() => renderFontList(stack), 80);
      }).observe(grid, { childList: true });
    }
  }

  function ensureFaceRow(stack) {
    const tools = document.querySelector(".text-color-tools");
    if (!tools) return;
    if (!tools.querySelector(".text-face-row")) {
      const row = document.createElement("div");
      row.className = "text-tool-row text-face-row";
      row.dataset.row = "face";
      row.innerHTML =
        '<span>СТИЛЬ</span><button type="button" data-face="regular">Қалыпты</button><button type="button" data-face="bold">Қалың</button><button type="button" data-face="italic">Курсив</button>';
      const textRow = tools.querySelector('[data-row="text"]');
      if (textRow) textRow.before(row);
      else tools.append(row);
    }
    syncFace(selectedKey(stack));
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
    ensureGuides(preview);
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
    if (hookInput && hookInput.dataset.containReady !== "1") {
      hookInput.dataset.containReady = "1";
      hookInput.addEventListener("input", () => requestAnimationFrame(() => containLayer(stack, "hook", true)));
    }
    if (markInput && markInput.dataset.containReady !== "1") {
      markInput.dataset.containReady = "1";
      markInput.addEventListener("input", () => requestAnimationFrame(() => containLayer(stack, "mark", true)));
    }
    containAll(stack);
    if (preview.dataset.containObserve !== "1") {
      preview.dataset.containObserve = "1";
      new ResizeObserver(() => containAll(stack)).observe(preview);
    }

    if (preview.dataset.toolsReady === "1") {
      applyLayerLook(stack.querySelector(".sub-hook"), "hook");
      applyLayerLook(stack.querySelector(".sub-mark"), "mark");
      applyLayerLook(stack.querySelector(".sub-extra"), "extra");
      containAll(stack);
      syncLayerVisibility(stack, editor);
      ensureStickerButton();
      ensureFontPicker(stack);
      ensureFaceRow(stack);
      if (!stack.querySelector("[data-selected='1']:not([data-layer-off])")) {
        selectLayer(stack, visibleKeys()[0] || "hook");
      }
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
      <div class="text-tool-row text-face-row" data-row="face">
        <span>СТИЛЬ</span>
        <button type="button" data-face="regular">Қалыпты</button>
        <button type="button" data-face="bold">Қалың</button>
        <button type="button" data-face="italic">Курсив</button>
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
      const faceBtn = event.target.closest("[data-face]");
      if (!off && !textBtn && !bgBtn && !faceBtn) return;
      const key = selectedKey(stack);
      const el = stack.querySelector(layerSelector(key));
      if (off) state[key].bg = "";
      if (textBtn) state[key].color = textBtn.dataset.textColor;
      if (bgBtn) state[key].bg = bgBtn.dataset.bgColor;
      if (faceBtn) state[key].face = faceBtn.dataset.face;
      applyLayerLook(el, key);
      syncSwatches(key);
      syncFace(key);
      if (faceBtn) containLayer(stack, key, true);
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
    ensureFontPicker(stack);
    ensureFaceRow(stack);
    syncLayerVisibility(stack, editor);
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
