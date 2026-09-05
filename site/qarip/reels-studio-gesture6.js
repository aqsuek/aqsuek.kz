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
      position:relative;overflow:hidden;
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
    .subtitle-stack [data-selected="1"]{outline:2px solid #d9ff47;outline-offset:6px}
    .reels-handle{display:none;position:absolute;z-index:8;width:20px;height:20px;border:2px solid #fff;border-radius:50%;background:#171715;box-shadow:0 2px 8px #0008;touch-action:none}
    [data-selected="1"]>.reels-handle{display:block}
    .reels-handle.resize{right:-13px;bottom:-13px;background:#d9ff47;border-color:#171715}
    .reels-handle.rotate{left:50%;top:-30px;transform:translateX(-50%)}
    .reels-handle.rotate:after{content:"";position:absolute;width:1px;height:10px;background:#fff;left:50%;top:18px}
    .font-chip{display:none!important}
    .reel-progress{z-index:5!important;bottom:20px!important;left:24px!important;right:24px!important}
    .text-add{display:none!important}
    .text-color-tools{display:grid;gap:10px;margin-top:12px;padding-top:12px;border-top:1px solid #ffffff16}
    .text-add-btn{width:100%;min-height:42px;border:1px dashed #d9ff4788;border-radius:10px;background:#191918;color:#d9ff47;font:800 12px/1 Arial,sans-serif;letter-spacing:.06em;cursor:pointer}
    .text-add-btn:hover{background:#d9ff47;color:#171715}
    .text-layer-picks{display:flex;flex-wrap:wrap;gap:6px}
    .text-layer-picks button{min-height:32px;padding:0 10px;border:1px solid #ffffff22;border-radius:8px;background:#191918;color:#fff;font:700 11px/1 Arial,sans-serif;cursor:pointer}
    .text-layer-picks button.active{background:#d9ff47;color:#171715;border-color:#d9ff47}
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
    .reels-copy-edit input.extra-input{grid-column:1/-1}
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
    @media(max-width:900px){.reels-pick{padding:52px 16px 44px!important}.reels-pick:before{inset:10px}.reels-controls{box-sizing:border-box}.reels-copy h2:after{margin-top:18px}.reels-options:not(.reels-colors) button b{font-size:13px!important}}
    @media(max-width:390px){.reels-controls{padding:14px}.reels-options:not(.reels-colors) button{padding:8px!important;min-height:60px}.reels-options:not(.reels-colors) button b{font-size:12px!important}.reels-colors button b{font-size:9px!important}}
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const emptyLayer = () => ({ x: 0, y: 0, scale: 1, rotation: 0, color: "", bg: null, on: false, text: "" });
  let state = { hook: emptyLayer(), mark: emptyLayer(), extra: emptyLayer() };
  try {
    const stored = JSON.parse(localStorage.getItem(STORE) || "{}");
    const oldPos = JSON.parse(localStorage.getItem("qarip-reels-text-position") || "{}");
    ["hook", "mark", "extra"].forEach((key) => {
      state[key] = { ...emptyLayer(), ...(oldPos[key] || {}), ...(stored[key] || {}) };
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
    const current = stack.querySelector("[data-selected='1']");
    if (current?.classList.contains("sub-mark")) return "mark";
    if (current?.classList.contains("sub-extra")) return "extra";
    return "hook";
  }

  function selectLayer(stack, key) {
    stack.querySelectorAll("[data-selected]").forEach((item) => item.removeAttribute("data-selected"));
    const el = stack.querySelector(key === "hook" ? ".sub-hook" : key === "mark" ? ".sub-mark" : ".sub-extra");
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

  function bindLayer(stack, key, selector) {
    const element = stack.querySelector(selector);
    if (!element || element.dataset.layerReady === "1") return;
    element.dataset.layerReady = "1";
    applyLayerLook(element, key);
    const resize = document.createElement("span");
    resize.className = "reels-handle resize";
    resize.setAttribute("aria-label", "Өлшемін өзгерту");
    const rotate = document.createElement("span");
    rotate.className = "reels-handle rotate";
    rotate.setAttribute("aria-label", "Бұру");
    element.append(resize, rotate);

    const select = () => selectLayer(stack, key);
    element.addEventListener("pointerdown", (event) => {
      if (event.target.closest(".reels-handle")) return;
      event.preventDefault();
      select();
      const start = { pointerX: event.clientX, pointerY: event.clientY, x: state[key].x, y: state[key].y };
      element.setPointerCapture(event.pointerId);
      const move = (moveEvent) => {
        state[key].x = Math.max(-108, Math.min(108, start.x + moveEvent.clientX - start.pointerX));
        state[key].y = Math.max(-180, Math.min(180, start.y + moveEvent.clientY - start.pointerY));
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
    resize.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      select();
      const start = { x: event.clientX, y: event.clientY, scale: state[key].scale };
      resize.setPointerCapture(event.pointerId);
      const move = (moveEvent) => {
        state[key].scale = Math.max(0.55, Math.min(1.8, start.scale + (moveEvent.clientX - start.x + moveEvent.clientY - start.y) / 150));
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
      const start = { x: event.clientX, rotation: state[key].rotation };
      rotate.setPointerCapture(event.pointerId);
      const move = (moveEvent) => {
        state[key].rotation = Math.max(-35, Math.min(35, start.rotation + (moveEvent.clientX - start.x) * 0.55));
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

  function createExtra(stack, editor) {
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
    selectLayer(stack, "extra");
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

  async function copySticker() {
    const preview = document.querySelector(".phone-preview");
    const btn = document.querySelector(".reels-sticker");
    if (!preview || !btn) return;
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Көшірілуде…";
    preview.classList.add("exporting", "sticker-export");
    try {
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      await loadHtml2Canvas();
      const shot = await withTimeout(
        window.html2canvas(preview, {
          scale: 2,
          backgroundColor: null,
          logging: false,
          useCORS: true,
          onclone(doc) {
            const clone = doc.querySelector(".phone-preview");
            if (!clone) return;
            clone.style.background = "transparent";
            clone.style.borderColor = "transparent";
            clone.style.boxShadow = "none";
          },
        }),
        15000,
        "html2canvas"
      );
      const canvas = cropTransparent(shot);
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
      if (!stack.querySelector(".sub-extra")) createExtra(stack, editor);
      else {
        extraInput(editor);
        const chip = document.querySelector('.text-layer-picks [data-layer="extra"]');
        if (chip) chip.hidden = false;
      }
    }
    LAYERS.forEach(([key, selector]) => bindLayer(stack, key, selector));

    const hookInput = editor?.querySelector('input[aria-label="Акцент"]');
    const markInput = editor?.querySelector('input[aria-label="Қосымша"]');
    hookInput?.addEventListener("focus", () => selectLayer(stack, "hook"));
    markInput?.addEventListener("focus", () => selectLayer(stack, "mark"));

    if (preview.dataset.toolsReady === "1") {
      applyLayerLook(stack.querySelector(".sub-hook"), "hook");
      applyLayerLook(stack.querySelector(".sub-mark"), "mark");
      applyLayerLook(stack.querySelector(".sub-extra"), "extra");
      ensureStickerButton();
      return;
    }
    preview.dataset.toolsReady = "1";

    const tools = document.createElement("div");
    tools.className = "text-color-tools";
    tools.innerHTML = `
      <button type="button" class="text-add-btn">+ Мәтін қосу</button>
      <div class="text-layer-picks">
        <button type="button" class="active" data-layer="hook">Акцент</button>
        <button type="button" data-layer="mark">Қосымша</button>
        <button type="button" data-layer="extra" hidden>Жаңа мәтін</button>
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

    tools.querySelector(".text-add-btn").addEventListener("click", () => createExtra(stack, editor));
    tools.querySelector(".text-layer-picks").addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-layer]");
      if (!btn || btn.hidden) return;
      if (btn.dataset.layer === "extra") createExtra(stack, editor);
      else selectLayer(stack, btn.dataset.layer);
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

    if (!stack.querySelector("[data-selected]")) selectLayer(stack, "hook");
    ensureStickerButton();
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
