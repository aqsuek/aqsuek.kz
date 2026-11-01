/* DauysTap web — dictation, text to speech, video to text. No build step, no dependencies. */
(() => {
  'use strict';

  const CONFIG = Object.assign({ keyServer: '', apiKey: '' }, window.DAUYSTAP_CONFIG || {});
  const STT_URL = 'wss://stt-rt.soniox.com/transcribe-websocket';
  const STT_MODEL = 'stt-rt-v5';
  const TTS_URL = 'https://tts-rt.soniox.com/tts';
  const TTS_MODEL = 'tts-rt-v2';
  const HINTS = ['kk', 'ru', 'en'];
  const RATE = 16000;
  const MAX_RECORD_SECONDS = 600;
  const MAX_FILE = 200 * 1024 * 1024;
  const HISTORY_KEY = 'dauystap.history.v1';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const $ = (id) => document.getElementById(id);

  /* ---------- toast ---------- */
  let toastTimer;
  function toast(text, isError) {
    const el = $('toast');
    el.textContent = text;
    el.classList.toggle('is-error', !!isError);
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-on'), isError ? 5200 : 2400);
  }

  async function copy(text) {
    if (!text.trim()) { toast('Көшіретін мәтін жоқ'); return; }
    try { await navigator.clipboard.writeText(text); toast('Мәтін көшірілді'); }
    catch { toast('Көшіру мүмкін болмады — мәтінді белгілеп көшіріңіз', true); }
  }

  /* ---------- progress bar with percent ----------
     Real progress is used when known (set); otherwise the bar eases toward a cap
     so a long wait never looks frozen. done() runs it to 100% and hides it. */
  function Progress(root) {
    const label = root.querySelector('[data-label]');
    const pct = root.querySelector('[data-pct]');
    const bar = root.querySelector('[data-bar]');
    let shown = 0, target = 0, cap = 0.9, active = false, finishing = false, last = 0, raf = 0;
    function frame(now) {
      const dt = Math.min(100, now - (last || now)) / 1000;
      last = now;
      if (active && !finishing) target += (cap - target) * Math.min(1, dt * 0.12);
      shown = reduced ? target : shown + (target - shown) * Math.min(1, dt * (finishing ? 10 : 5));
      const p = Math.round(shown * 100);
      pct.textContent = p + '%';
      bar.style.width = (shown * 100).toFixed(2) + '%';
      root.setAttribute('aria-valuenow', String(p));
      if (finishing && shown > 0.995) {
        pct.textContent = '100%'; bar.style.width = '100%';
        finishing = false; active = false;
        setTimeout(() => { if (!active) root.hidden = true; }, 450);
        return;
      }
      if (active) raf = requestAnimationFrame(frame);
    }
    root.setAttribute('role', 'progressbar');
    root.setAttribute('aria-valuemin', '0');
    root.setAttribute('aria-valuemax', '100');
    return {
      start(text, ceiling = 0.9) {
        cancelAnimationFrame(raf);
        label.textContent = text; root.setAttribute('aria-label', text);
        shown = 0; target = 0.03; cap = ceiling; active = true; finishing = false; last = 0;
        root.hidden = false; raf = requestAnimationFrame(frame);
      },
      stage(text, from, to) {
        if (!active) this.start(text, to);
        label.textContent = text; root.setAttribute('aria-label', text);
        target = Math.max(target, from); cap = Math.max(target, Math.min(0.98, to));
      },
      set(value) { if (active) { target = Math.max(target, Math.min(0.99, value)); if (cap < target) cap = Math.min(0.99, target + 0.02); } },
      done() { if (!active) return; target = 1; cap = 1; finishing = true; },
      hide() { active = false; finishing = false; cancelAnimationFrame(raf); root.hidden = true; },
      get active() { return active; }
    };
  }

  /* ---------- Google sign-in ---------- */
  const TOKEN_KEY = 'aqsuek.google';
  const auth = { token: null, profile: null, waiters: [] };

  function decodeJwt(token) {
    try {
      const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(decodeURIComponent(atob(part).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
    } catch { return null; }
  }
  function tokenValid(token, marginSeconds) {
    const p = token && decodeJwt(token);
    return !!(p && p.exp && p.exp * 1000 - Date.now() > (marginSeconds || 0) * 1000);
  }
  function setToken(token) {
    auth.token = token;
    auth.profile = token ? decodeJwt(token) : null;
    try { token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY); } catch {}
    renderAuth();
    if (token) { auth.waiters.splice(0).forEach((w) => w(token)); refreshQuota(); }
  }
  function renderAuth() {
    const signedIn = !!auth.token;
    $('gate').hidden = signedIn;
    $('app-body').hidden = !signedIn;
    $('account').hidden = !signedIn;
    if (signedIn && auth.profile) $('account-email').textContent = auth.profile.email || auth.profile.name || '';
  }
  function showGate(message) {
    $('gate-note').textContent = message || '';
    $('gate-note').hidden = !message;
    setToken(null);
    if (window.google && google.accounts && google.accounts.id) google.accounts.id.prompt();
  }
  // Resolves with a token that is valid for at least another minute; asks to sign in again if needed.
  function ensureToken() {
    if (tokenValid(auth.token, 60)) return Promise.resolve(auth.token);
    return new Promise((resolve) => {
      auth.waiters.push(resolve);
      showGate('Қауіпсіздік үшін қайта кіріңіз — бір рет басу жеткілікті.');
    });
  }
  function initGoogle() {
    if (!window.google || !google.accounts || !google.accounts.id) { setTimeout(initGoogle, 200); return; }
    google.accounts.id.initialize({
      client_id: CONFIG.googleClientId,
      callback: (r) => { if (r && r.credential) setToken(r.credential); },
      auto_select: true,
      itp_support: true,
      use_fedcm_for_prompt: true,
      context: 'signin'
    });
    google.accounts.id.renderButton($('gate-button'), { theme: 'filled_black', size: 'large', shape: 'pill', text: 'continue_with', locale: 'kk', width: 300 });
    if (!auth.token) google.accounts.id.prompt();
  }
  $('sign-out').addEventListener('click', () => {
    if (window.google && google.accounts && google.accounts.id) google.accounts.id.disableAutoSelect();
    showGate('');
  });

  function renderQuota(q, unlimited) {
    const el = $('account-quota');
    if (unlimited) { el.textContent = 'Шексіз'; return; }
    if (!q) { el.textContent = ''; return; }
    const left = (k) => Math.max(0, q[k].limit - q[k].used);
    el.textContent = 'Бүгін: ' + left('transcribe_websocket') + ' жазу · ' + left('tts_rt') + ' дауыс';
  }
  async function refreshQuota() {
    if (!CONFIG.keyServer || !tokenValid(auth.token, 10)) return;
    try {
      const res = await fetch(CONFIG.keyServer, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + auth.token }, body: JSON.stringify({ action: 'quota' }) });
      if (res.status === 401) { showGate('Қайта кіріңіз.'); return; }
      if (res.ok) { const d = await res.json(); renderQuota(d.quota, d.unlimited); }
    } catch {}
  }

  /* ---------- keys ---------- */
  async function getKey(usage) {
    if (CONFIG.keyServer) {
      const token = await ensureToken();
      const res = await fetch(CONFIG.keyServer, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ usage })
      });
      if (res.status === 401) { showGate('Қайта кіріңіз.'); throw new Error('Алдымен Google арқылы кіріңіз.'); }
      if (res.status === 429) {
        const d = await res.json().catch(() => ({}));
        if (d.error === 'quota') { refreshQuota(); throw new Error(usage === 'tts_rt' ? 'Бүгінгі дауыс лимиті бітті (' + d.limit + '). Ертең жаңарады.' : 'Бүгінгі жазу лимиті бітті (' + d.limit + '). Ертең жаңарады.'); }
        throw new Error('Сұраныс тым көп. Бір минуттан соң қайталаңыз.');
      }
      if (!res.ok) throw new Error('Қызметке қосылу мүмкін болмады.');
      const data = await res.json();
      renderQuota(data.quota, data.unlimited);
      return data.api_key;
    }
    if (CONFIG.apiKey) return CONFIG.apiKey;
    throw new Error('Қызмет әзірге қосылмаған.');
  }

  function friendly(error) {
    const text = String((error && error.message) || error || '');
    if (/лимит|Google/.test(text)) return text;
    if (/balance|quota|credit/i.test(text)) return 'Қызмет уақытша қолжетімсіз. Кейінірек қайталаңыз.';
    if (/401|unauthor|invalid api key|api key/i.test(text)) return 'Қызметке қосылу мүмкін болмады.';
    if (/NotAllowedError|Permission|denied/i.test(text)) return 'Микрофонға рұқсат берілмеді. Браузердің баптауынан рұқсат беріңіз.';
    if (/NotFoundError|device/i.test(text)) return 'Микрофон табылмады.';
    if (/network|Failed to fetch|WebSocket/i.test(text)) return 'Интернет байланысын тексеріңіз.';
    return text || 'Белгісіз қате. Қайта байқап көріңіз.';
  }

  /* ---------- realtime speech-to-text session ---------- */
  class Stt {
    constructor({ onText }) {
      this.onText = onText;
      this.final = '';
      this.partial = '';
      this.queue = [];
      this.ws = null;
      this.closed = false;
      this.finished = new Promise((resolve, reject) => { this._resolve = resolve; this._reject = reject; });
      this.finished.catch(() => {});
    }
    async open() {
      const key = await getKey('transcribe_websocket');
      if (this.closed) return;
      const ws = new WebSocket(STT_URL);
      ws.binaryType = 'arraybuffer';
      this.ws = ws;
      ws.onopen = () => {
        ws.send(JSON.stringify({
          api_key: key, model: STT_MODEL, audio_format: 'pcm_s16le', sample_rate: RATE, num_channels: 1,
          language_hints: HINTS, enable_endpoint_detection: false
        }));
        this.queue.forEach((chunk) => ws.send(chunk));
        this.queue = [];
        if (this.ending) ws.send('');
      };
      ws.onmessage = (event) => {
        let data;
        try { data = JSON.parse(event.data); } catch { return; }
        if (data.error_message) { this._fail(new Error(data.error_message)); return; }
        let partial = '';
        for (const t of data.tokens || []) {
          if (t.text === '<end>' || t.text === '<fin>') continue;
          if (t.is_final) this.final += t.text; else partial += t.text;
        }
        this.partial = partial;
        this.onText(this.final, this.partial);
        if (data.finished) { this.closed = true; ws.close(); this._resolve(this.final.trim()); }
      };
      ws.onerror = () => this._fail(new Error('WebSocket'));
      ws.onclose = () => { if (!this.closed) this._fail(new Error('Байланыс үзілді. Қайта байқап көріңіз.')); };
    }
    send(int16) {
      const buf = int16.buffer.slice(int16.byteOffset, int16.byteOffset + int16.byteLength);
      if (this.ws && this.ws.readyState === 1) this.ws.send(buf); else if (!this.closed) this.queue.push(buf);
    }
    get backlog() { return this.ws ? this.ws.bufferedAmount : 0; }
    end() {
      this.ending = true;
      if (this.ws && this.ws.readyState === 1) this.ws.send('');
      return this.finished;
    }
    cancel() { this.closed = true; try { this.ws && this.ws.close(); } catch {} this._reject(new Error('cancelled')); }
    _fail(error) { if (this.closed) return; this.closed = true; try { this.ws && this.ws.close(); } catch {} this._reject(error); }
  }

  function toInt16(float32) {
    const out = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
      const s = Math.max(-1, Math.min(1, float32[i]));
      out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return out;
  }

  function downsample(input, fromRate) {
    if (fromRate === RATE) return input;
    const ratio = fromRate / RATE;
    const length = Math.floor(input.length / ratio);
    const out = new Float32Array(length);
    let pos = 0;
    for (let i = 0; i < length; i++) {
      const next = Math.floor((i + 1) * ratio);
      let sum = 0, count = 0;
      for (; pos < next && pos < input.length; pos++) { sum += input[pos]; count++; }
      out[i] = count ? sum / count : 0;
    }
    return out;
  }

  /* ---------- history ---------- */
  function readHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
  }
  function writeHistory(items) {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 200))); } catch {}
  }
  function addHistory(text, kind) {
    if (!text.trim()) return;
    const items = readHistory();
    items.unshift({ id: Date.now().toString(36), time: Date.now(), text: text.trim(), kind });
    writeHistory(items);
    renderHistory();
  }
  const pad = (n) => String(n).padStart(2, '0');
  const dateFormat = { format: (t) => { const d = new Date(t); return pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + String(d.getFullYear()).slice(2) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); } };
  const kindNames = { dictation: 'Диктовка', video: 'Видео' };
  function renderHistory() {
    const list = $('history-list');
    const query = $('history-search').value.trim().toLowerCase();
    const items = readHistory().filter((it) => !query || it.text.toLowerCase().includes(query));
    list.replaceChildren();
    for (const item of items) {
      const li = document.createElement('li');
      const time = document.createElement('time');
      time.dateTime = new Date(item.time).toISOString();
      time.textContent = dateFormat.format(item.time) + ' · ' + (kindNames[item.kind] || 'Мәтін');
      const p = document.createElement('p');
      p.textContent = item.text;
      const actions = document.createElement('div');
      actions.className = 'dt-row-actions';
      const mk = (text, fn, danger) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'dt-link' + (danger ? ' is-danger' : ''); b.textContent = text; b.addEventListener('click', fn); actions.append(b); };
      mk('Көшіру', () => copy(item.text));
      mk('Дауыспен тыңдау', () => { $('tts-text').value = item.text.slice(0, 1500); updateTtsCount(); selectTab('voice'); });
      mk('Өшіру', () => { writeHistory(readHistory().filter((x) => x.id !== item.id)); renderHistory(); }, true);
      li.append(time, p, actions);
      list.append(li);
    }
    const total = readHistory().length;
    $('history-empty').hidden = items.length > 0;
    $('history-empty').textContent = total && !items.length ? 'Мәтін табылмады.' : 'Алғашқы мәтініңіз осы жерде пайда болады. Тарих тек осы браузерде сақталады.';
    $('history-clear').hidden = total === 0;
  }

  /* ---------- tabs ---------- */
  const tabs = ['dictate', 'voice', 'video', 'history'];
  function selectTab(name, focus) {
    for (const t of tabs) {
      const tab = $('tab-' + t), panel = $('panel-' + t), on = t === name;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      panel.hidden = !on;
      if (on && focus) tab.focus();
    }
    if (history.replaceState) history.replaceState(null, '', name === 'dictate' ? location.pathname : '#' + name);
  }
  tabs.forEach((t, i) => {
    const tab = $('tab-' + t);
    tab.addEventListener('click', () => selectTab(t));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      selectTab(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length], true);
    });
  });

  /* ---------- waveform ---------- */
  const canvas = $('dict-wave');
  const g = canvas.getContext('2d');
  let analyser = null, waveRaf = 0;
  function drawWave() {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== Math.round(w * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const bars = Math.max(16, Math.floor(w / 9));
    let data = null;
    if (analyser) { data = new Uint8Array(analyser.fftSize); analyser.getByteTimeDomainData(data); }
    const t = performance.now() / 400;
    for (let i = 0; i < bars; i++) {
      const env = Math.sin(Math.PI * (i + 0.5) / bars);
      let level;
      if (data) {
        const slice = Math.floor(data.length / bars);
        let peak = 0;
        for (let j = i * slice; j < (i + 1) * slice; j++) peak = Math.max(peak, Math.abs(data[j] - 128) / 128);
        level = 0.08 + Math.min(1, peak * 2.4);
      } else {
        level = 0.1 + 0.08 * Math.abs(Math.sin(i * 1.7 + (reduced ? 0 : t)));
      }
      const bh = Math.max(4, h * level * env);
      const x = i * (w / bars);
      g.fillStyle = `rgba(118, 210, 255, ${0.45 + 0.55 * env})`;
      const bw = Math.min(4, (w / bars) * 0.5);
      g.beginPath();
      if (g.roundRect) g.roundRect(x, (h - bh) / 2, bw, bh, 2); else g.rect(x, (h - bh) / 2, bw, bh);
      g.fill();
    }
    if (analyser || !reduced) waveRaf = requestAnimationFrame(drawWave);
  }

  /* ---------- dictation ---------- */
  const dict = { stt: null, stream: null, ctx: null, node: null, started: 0, timer: 0, busy: false };
  const dictProgress = Progress($('dict-progress'));
  const dictOut = $('dict-output');
  let dictBase = '';

  function renderDictation(finalText, partial) {
    dictOut.replaceChildren(document.createTextNode(dictBase + finalText));
    if (partial) { const span = document.createElement('span'); span.className = 'dt-partial'; span.textContent = partial; dictOut.append(span); }
    dictOut.scrollTop = dictOut.scrollHeight;
    updateDictCount();
  }
  function updateDictCount() { $('dict-count').textContent = dictOut.textContent.length + ' таңба'; }

  function setRecordingUi(on) {
    const mic = $('dict-mic');
    mic.setAttribute('aria-pressed', String(on));
    mic.setAttribute('aria-label', on ? 'Жазуды тоқтату' : 'Жазуды бастау');
    $('dict-hint').textContent = on ? 'Тыңдап тұрмын… Тоқтату үшін қайта басыңыз.' : 'Микрофонды басып, сөйлей беріңіз. Қайта басқанда тоқтайды.';
    $('dict-timer').hidden = !on;
  }

  async function startDictation() {
    if (dict.busy) return;
    dict.busy = true;
    $('dict-mic').disabled = true;
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('Бұл браузер микрофонды қолдамайды.');
      dict.stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      const existing = dictOut.textContent.trim();
      dictBase = existing ? existing + (/[\s\n]$/.test(dictOut.textContent) ? '' : ' ') : '';
      dict.stt = new Stt({ onText: renderDictation });
      dict.stt.open().catch((e) => failDictation(e));
      dict.stt.finished.catch((e) => { if (e.message !== 'cancelled') failDictation(e); });
      const Ctx = window.AudioContext || window.webkitAudioContext;
      dict.ctx = new Ctx();
      const source = dict.ctx.createMediaStreamSource(dict.stream);
      analyser = dict.ctx.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      dict.node = dict.ctx.createScriptProcessor(4096, 1, 1);
      dict.node.onaudioprocess = (e) => { if (dict.stt) dict.stt.send(toInt16(downsample(e.inputBuffer.getChannelData(0), dict.ctx.sampleRate))); };
      source.connect(dict.node);
      dict.node.connect(dict.ctx.destination);
      dict.started = Date.now();
      dict.timer = setInterval(() => {
        const s = Math.floor((Date.now() - dict.started) / 1000);
        $('dict-timer').textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
        if (s >= MAX_RECORD_SECONDS) stopDictation();
      }, 250);
      setRecordingUi(true);
      cancelAnimationFrame(waveRaf); drawWave();
    } catch (e) {
      releaseMic();
      dict.busy = false;
      toast(friendly(e), true);
    } finally {
      $('dict-mic').disabled = false;
    }
  }

  function releaseMic() {
    clearInterval(dict.timer);
    if (dict.node) { dict.node.onaudioprocess = null; try { dict.node.disconnect(); } catch {} }
    if (dict.stream) dict.stream.getTracks().forEach((t) => t.stop());
    if (dict.ctx) dict.ctx.close().catch(() => {});
    dict.node = dict.stream = dict.ctx = null;
    analyser = null;
    setRecordingUi(false);
  }

  async function stopDictation() {
    if (!dict.stt) return;
    const stt = dict.stt;
    dict.stt = null;
    releaseMic();
    $('dict-mic').disabled = true;
    dictProgress.start('Танылуда', 0.95);
    try {
      const text = await stt.end();
      dictProgress.done();
      renderDictation(text, '');
      if (text) { addHistory(text, 'dictation'); toast('Дайын'); } else toast('Сөйлеу танылмады', true);
    } catch (e) {
      if (e.message !== 'cancelled') { dictProgress.hide(); toast(friendly(e), true); }
    } finally {
      dict.busy = false;
      $('dict-mic').disabled = false;
    }
  }

  function failDictation(e) {
    if (!dict.stt) return;
    dict.stt = null; dict.busy = false;
    releaseMic();
    dictProgress.hide();
    $('dict-mic').disabled = false;
    renderDictation('', '');
    toast(friendly(e), true);
  }

  $('dict-mic').addEventListener('click', () => { if (dict.stream) stopDictation(); else startDictation(); });
  $('dict-copy').addEventListener('click', () => copy(dictOut.textContent));
  $('dict-clear').addEventListener('click', () => { dictOut.textContent = ''; dictBase = ''; updateDictCount(); });
  $('dict-to-voice').addEventListener('click', () => {
    const text = dictOut.textContent.trim();
    if (!text) { toast('Алдымен мәтін жазыңыз'); return; }
    $('tts-text').value = text.slice(0, 1500); updateTtsCount(); selectTab('voice');
  });
  dictOut.addEventListener('input', updateDictCount);

  /* ---------- text to speech ---------- */
  const ttsProgress = Progress($('tts-progress'));
  const ttsText = $('tts-text');
  let ttsUrl = null, ttsBusy = false;
  function updateTtsCount() {
    const n = ttsText.value.length;
    $('tts-count').textContent = n + ' / 1500';
    $('tts-go').disabled = ttsBusy || !ttsText.value.trim();
  }
  ttsText.addEventListener('input', updateTtsCount);
  document.querySelectorAll('[data-preset]').forEach((b) => b.addEventListener('click', () => { ttsText.value = b.dataset.preset; updateTtsCount(); }));

  try {
    const saved = JSON.parse(localStorage.getItem('dauystap.tts') || '{}');
    if (saved.voice) $('tts-voice').value = saved.voice;
    if (saved.lang) $('tts-lang').value = saved.lang;
  } catch {}
  const saveTts = () => { try { localStorage.setItem('dauystap.tts', JSON.stringify({ voice: $('tts-voice').value, lang: $('tts-lang').value })); } catch {} };
  $('tts-voice').addEventListener('change', saveTts);
  $('tts-lang').addEventListener('change', saveTts);

  $('tts-go').addEventListener('click', async () => {
    const text = ttsText.value.trim();
    if (!text || ttsBusy) return;
    ttsBusy = true; updateTtsCount();
    $('tts-go').textContent = 'Дауыс жасалуда…';
    ttsProgress.start('Дауыс жасалуда', 0.5);
    try {
      const key = await getKey('tts_rt');
      const res = await fetch(TTS_URL, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: TTS_MODEL, language: $('tts-lang').value, voice: $('tts-voice').value, audio_format: 'mp3', text })
      });
      if (!res.ok) throw new Error(res.status === 401 || res.status === 403 ? 'api key' : 'Дауыс жасау мүмкін болмады (' + res.status + ').');
      ttsProgress.stage('Аудио жүктелуде', 0.5, 0.95);
      const total = Number(res.headers.get('content-length')) || 0;
      const chunks = []; let received = 0;
      if (res.body && res.body.getReader) {
        const reader = res.body.getReader();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value); received += value.length;
          if (total) ttsProgress.set(0.5 + 0.48 * received / total);
        }
      } else { chunks.push(new Uint8Array(await res.arrayBuffer())); }
      const blob = new Blob(chunks, { type: 'audio/mpeg' });
      if (blob.size < 12) throw new Error('Аудио бос келді.');
      if (ttsUrl) URL.revokeObjectURL(ttsUrl);
      ttsUrl = URL.createObjectURL(blob);
      const audio = $('tts-audio');
      audio.src = ttsUrl; audio.hidden = false;
      const dl = $('tts-download'); dl.href = ttsUrl; dl.hidden = false;
      ttsProgress.done();
      audio.play().catch(() => {});
    } catch (e) {
      ttsProgress.hide();
      toast(friendly(e), true);
    } finally {
      ttsBusy = false;
      $('tts-go').textContent = '▶ Тыңдау';
      updateTtsCount();
    }
  });

  /* ---------- video to text ---------- */
  const videoProgress = Progress($('video-progress'));
  const videoOut = $('video-output');
  let videoJob = null;

  async function transcribeFile(file) {
    if (videoJob) return;
    if (file.size > MAX_FILE) { toast('Файл тым үлкен: 200 МБ-тан аспауы керек.', true); return; }
    const job = { cancelled: false, stt: null };
    videoJob = job;
    $('video-name').textContent = file.name; $('video-name').hidden = false;
    $('video-cancel-row').hidden = false;
    $('video-file').disabled = true;
    videoOut.textContent = ''; $('video-count').textContent = '0 таңба';
    const check = () => { if (job.cancelled) throw new Error('cancelled'); };
    try {
      videoProgress.start('Видео оқылуда', 0.1);
      const bytes = await file.arrayBuffer(); check();
      videoProgress.stage('Дыбыс бөлінуде', 0.1, 0.3);
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      let decoded;
      try { decoded = await ctx.decodeAudioData(bytes); }
      catch { throw new Error('Бұл файлдан дыбыс алу мүмкін болмады. MP4 не MP3 файлын байқап көріңіз.'); }
      finally { ctx.close().catch(() => {}); }
      check();
      const length = Math.ceil(decoded.duration * RATE);
      const offline = new OfflineAudioContext(1, Math.max(1, length), RATE);
      const src = offline.createBufferSource(); src.buffer = decoded; src.connect(offline.destination); src.start();
      const mono = (await offline.startRendering()).getChannelData(0); check();
      videoProgress.stage('Танылуда', 0.32, 0.33);
      job.stt = new Stt({ onText: (f, p) => { videoOut.textContent = f + p; $('video-count').textContent = videoOut.textContent.length + ' таңба'; } });
      await job.stt.open(); check();
      const step = RATE; // 1 second per chunk
      for (let i = 0; i < mono.length; i += step) {
        check();
        job.stt.send(toInt16(mono.subarray(i, i + step)));
        videoProgress.set(0.33 + 0.6 * Math.min(1, (i + step) / mono.length));
        // pace at ~10× real time and respect the socket buffer
        await new Promise((r) => setTimeout(r, 100));
        while (job.stt.backlog > 1 << 20) { check(); await new Promise((r) => setTimeout(r, 100)); }
      }
      videoProgress.stage('Аяқталуда', 0.93, 0.98);
      const text = await job.stt.end();
      check();
      videoOut.textContent = text; $('video-count').textContent = text.length + ' таңба';
      videoProgress.done();
      if (text) { addHistory(text, 'video'); toast('Дайын. Мәтін тарихқа сақталды'); } else toast('Видеода сөйлеу табылмады', true);
    } catch (e) {
      videoProgress.hide();
      if (e.message === 'cancelled') toast('Тоқтатылды'); else toast(friendly(e), true);
    } finally {
      if (job.stt && job.cancelled) job.stt.cancel();
      videoJob = null;
      $('video-cancel-row').hidden = true;
      $('video-file').disabled = false;
      $('video-file').value = '';
    }
  }

  $('video-file').addEventListener('change', (e) => { const f = e.target.files && e.target.files[0]; if (f) transcribeFile(f); });
  const drop = $('video-drop');
  ['dragenter', 'dragover'].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add('is-over'); }));
  ['dragleave', 'drop'].forEach((t) => drop.addEventListener(t, () => drop.classList.remove('is-over')));
  drop.addEventListener('drop', (e) => { e.preventDefault(); const f = e.dataTransfer.files && e.dataTransfer.files[0]; if (f) transcribeFile(f); });
  $('video-cancel').addEventListener('click', () => { if (videoJob) { videoJob.cancelled = true; if (videoJob.stt) videoJob.stt.cancel(); } });
  $('video-copy').addEventListener('click', () => copy(videoOut.textContent));

  /* ---------- history ---------- */
  $('history-search').addEventListener('input', renderHistory);
  $('history-clear').addEventListener('click', () => {
    if (!readHistory().length) return;
    if (window.confirm('Барлық мәтінді өшіресіз бе?')) { writeHistory([]); renderHistory(); }
  });


  /* ---------- install as an app (PWA) ---------- */
  let installPrompt = null;
  const installBtn = $('install-app');
  const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/dauystap/sw.js', { scope: '/dauystap/' }).catch(() => {});
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installPrompt = e; if (!standalone) installBtn.hidden = false; });
  if (isIos && !standalone) installBtn.hidden = false;
  installBtn.addEventListener('click', async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const choice = await installPrompt.userChoice.catch(() => null);
      if (choice && choice.outcome === 'accepted') installBtn.hidden = true;
      installPrompt = null;
    } else if (isIos) {
      toast('Safari-де «Бөлісу» ⬆︎ батырмасын басып, «Басты экранға қосу» таңдаңыз');
    }
  });
  window.addEventListener('appinstalled', () => { installBtn.hidden = true; toast('DauysTap басты экранға қосылды'); });

  /* ---------- init ---------- */
  try { const saved = localStorage.getItem(TOKEN_KEY); if (tokenValid(saved, 60)) setToken(saved); } catch {}
  renderAuth();
  if (CONFIG.googleClientId) initGoogle(); else { $('gate').hidden = true; $('app-body').hidden = false; }
  renderHistory();
  updateTtsCount();
  updateDictCount();
  drawWave();
  const start = location.hash.replace('#', '');
  if (tabs.includes(start)) selectTab(start);
  window.addEventListener('beforeunload', (e) => { if (dict.stream || videoJob) { e.preventDefault(); e.returnValue = ''; } });
})();
