(() => {
  const MAX_SIZE = 40 * 1024 * 1024;
  const state = { voices: [], selectedId: null, playingId: null, drafts: [], chorus: false };
  const energy = { value: 0 };
  let audio = null;
  let audioContext = null;
  let analyser = null;
  let source = null;
  let progressFrame = 0;

  const $ = (selector) => document.querySelector(selector);
  const card = $("#voiceCard");
  const studio = $("#studio");
  const audioInput = $("#audioInput");
  const dropZone = $("#dropZone");
  const draftList = $("#draftList");
  const uploadButton = $("#uploadButton");

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  const hashText = (value) => { let hash = 2166136261; for (let i = 0; i < value.length; i += 1) { hash ^= value.charCodeAt(i); hash = Math.imul(hash, 16777619); } return Math.abs(hash >>> 0); };
  const seeded = (seed, index) => { const value = Math.sin(seed * .0001 + index * 12.9898) * 43758.5453; return value - Math.floor(value); };
  const formatTime = (value) => { if (!Number.isFinite(value)) return "0:00"; return `${Math.floor(value / 60)}:${Math.floor(value % 60).toString().padStart(2, "0")}`; };
  const formatSize = (bytes) => bytes < 1048576 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1048576).toFixed(1)} MB`;

  function showError(message) {
    const toast = $("#errorToast");
    toast.innerHTML = `${escapeHtml(message)}<button type="button" aria-label="Cerrar aviso">×</button>`;
    toast.hidden = false;
    toast.querySelector("button").onclick = () => { toast.hidden = true; };
  }

  function selectedVoice() {
    return state.voices.find((voice) => voice.id === state.selectedId) || state.voices[0] || null;
  }

  function waveform(seed, active) {
    const hash = hashText(seed || "voice");
    return `<div class="waveform${active ? " is-active" : ""}" aria-hidden="true">${Array.from({ length: 42 }, (_, index) => `<span style="height:${12 + seeded(hash, index) * 62}%;animation-delay:${index * -34}ms"></span>`).join("")}</div>`;
  }

  function renderCard() {
    const voice = selectedVoice();
    const count = state.voices.length;
    $("#voiceCount").textContent = String(count);
    $("#voiceCountLabel").textContent = count === 1 ? "VOZ CONSERVADA" : "VOCES CONSERVADAS";
    $("#humanityButton").lastChild.textContent = count ? "ESCUCHAR A LA HUMANIDAD" : "DARLE UNA VOZ A LA TIERRA";
    if (!voice) {
      card.className = "voice-card is-empty";
      card.innerHTML = `<div class="empty-voice"><span class="voice-index">LA PRIMERA VOZ</span><h2>La Tierra está esperando</h2><p>Incorpora una o varias grabaciones para que la esfera comience a guardar la memoria humana.</p><button type="button" class="secondary-button" data-open-studio>＋ AÑADIR VOCES</button></div>`;
      card.querySelector("[data-open-studio]").onclick = openStudio;
      return;
    }
    const index = state.voices.findIndex((item) => item.id === voice.id) + 1;
    const playing = state.playingId === voice.id && audio && !audio.paused;
    card.className = "voice-card has-voice";
    card.innerHTML = `
      <div class="voice-card-head"><span class="voice-index">VOZ ${String(index).padStart(3, "0")}</span><button class="play-button" type="button" aria-label="${playing ? "Pausar voz" : "Escuchar voz"}">${playing ? '<span class="pause-icon"></span>' : '<span class="play-icon"></span>'}</button></div>
      <div class="gold-rule"></div><h2>${escapeHtml(voice.name)}</h2>
      <p class="origin">${escapeHtml([voice.place, voice.language].filter(Boolean).join(" · ") || "Procedencia por registrar")}</p>
      ${waveform(voice.id, playing)}
      <div class="audio-progress"><span id="elapsed">${formatTime(audio?.currentTime || 0)}</span><input id="seek" type="range" min="0" max="${audio?.duration || 1}" step=".01" value="${Math.min(audio?.currentTime || 0, audio?.duration || 1)}" aria-label="Posición del audio"><span id="duration">${formatTime(audio?.duration || 0)}</span></div>
      ${voice.excerpt ? `<blockquote>“${escapeHtml(voice.excerpt)}”</blockquote>` : ""}
      <div class="card-actions"><button type="button" data-open-studio>＋ Añadir más</button><button type="button" class="remove-voice">Retirar</button></div>`;
    card.querySelector(".play-button").onclick = () => toggleVoice(voice);
    card.querySelector("[data-open-studio]").onclick = openStudio;
    card.querySelector(".remove-voice").onclick = () => removeVoice(voice);
    card.querySelector("#seek").oninput = (event) => { if (audio) audio.currentTime = Number(event.target.value); };
  }

  async function loadVoices() {
    try {
      const response = await fetch("/api/voices", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No se pudieron leer las voces");
      state.voices = result.voices || [];
      if (!state.voices.some((voice) => voice.id === state.selectedId)) state.selectedId = state.voices[0]?.id || null;
      renderCard();
    } catch (error) { showError(error.message || "No se pudo abrir el archivo sonoro"); renderCard(); }
  }

  function ensureAudioGraph() {
    if (!audio) {
      audio = new Audio();
      audio.preload = "metadata";
      audio.addEventListener("loadedmetadata", renderCard);
      audio.addEventListener("ended", () => {
        const current = state.voices.findIndex((voice) => voice.id === state.playingId);
        state.playingId = null;
        energy.value = 0;
        if (state.chorus && state.voices.length > 1) toggleVoice(state.voices[(current + 1) % state.voices.length]); else renderCard();
      });
    }
    if (!source && window.AudioContext) {
      audioContext = new AudioContext();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = .82;
      source = audioContext.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
    }
  }

  async function toggleVoice(voice) {
    ensureAudioGraph();
    state.selectedId = voice.id;
    if (audioContext?.state === "suspended") await audioContext.resume();
    if (state.playingId === voice.id && !audio.paused) { audio.pause(); state.playingId = null; state.chorus = false; renderCard(); return; }
    if (!audio.src.includes(`id=${encodeURIComponent(voice.id)}`)) audio.src = `/api/audio?id=${encodeURIComponent(voice.id)}`;
    try { await audio.play(); state.playingId = voice.id; renderCard(); } catch { showError("El navegador no pudo reproducir esta grabación."); }
  }

  function updateAudioEnergy() {
    if (analyser) {
      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 0; i < Math.min(48, data.length); i += 1) sum += data[i];
      const target = sum / Math.min(48, data.length) / 255;
      energy.value += (target - energy.value) * .18;
    } else energy.value *= .9;
    const seek = $("#seek");
    if (seek && audio) {
      seek.max = audio.duration || 1; seek.value = Math.min(audio.currentTime || 0, audio.duration || 1);
      $("#elapsed").textContent = formatTime(audio.currentTime); $("#duration").textContent = formatTime(audio.duration);
    }
    progressFrame = requestAnimationFrame(updateAudioEnergy);
  }

  async function removeVoice(voice) {
    if (!confirm(`¿Retirar la voz de ${voice.name} del archivo?`)) return;
    if (state.playingId === voice.id) { audio?.pause(); state.playingId = null; }
    const response = await fetch(`/api/voices?id=${encodeURIComponent(voice.id)}`, { method: "DELETE" });
    if (!response.ok) { const result = await response.json(); showError(result.error || "No se pudo retirar la voz"); return; }
    await loadVoices();
  }

  function openStudio() { studio.hidden = false; }
  function closeStudio() { studio.hidden = true; }

  function addFiles(files) {
    Array.from(files).filter((file) => file.type.startsWith("audio/") || /\.(mp3|wav|m4a|aac|ogg|webm)$/i.test(file.name)).forEach((file) => {
      state.drafts.push({ key: `${file.name}-${Date.now()}-${Math.random()}`, file, name: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "), place: "", language: "", excerpt: "", status: file.size <= MAX_SIZE ? "ready" : "error", error: file.size <= MAX_SIZE ? "" : "El archivo supera los 40 MB" });
    });
    renderDrafts();
  }

  function renderDrafts() {
    draftList.innerHTML = state.drafts.map((draft, index) => `<article class="draft-card status-${draft.status}" data-key="${escapeHtml(draft.key)}"><div class="draft-number">${String(index + 1).padStart(2, "0")}</div><div class="draft-fields"><div class="file-line"><strong>${escapeHtml(draft.file.name)}</strong><span>${formatSize(draft.file.size)}</span></div><div class="field-grid"><label>Nombre de la voz<input data-field="name" value="${escapeHtml(draft.name)}"></label><label>Lugar<input data-field="place" value="${escapeHtml(draft.place)}" placeholder="Dakar, Senegal"></label><label>Idioma<input data-field="language" value="${escapeHtml(draft.language)}" placeholder="Wolof"></label><label class="excerpt-field">Verso o fragmento<textarea data-field="excerpt" placeholder="La frase que acompañará a esta voz…" rows="2">${escapeHtml(draft.excerpt)}</textarea></label></div>${draft.status === "uploading" ? '<p class="status-line">Guardando la voz…</p>' : ""}${draft.status === "done" ? '<p class="status-line success">Voz incorporada a la esfera</p>' : ""}${draft.error ? `<p class="status-line error">${escapeHtml(draft.error)}</p>` : ""}</div><button type="button" class="remove-draft" aria-label="Quitar ${escapeHtml(draft.file.name)}">×</button></article>`).join("");
    draftList.querySelectorAll("[data-field]").forEach((field) => { field.oninput = () => { const draft = state.drafts.find((item) => item.key === field.closest("article").dataset.key); if (draft) draft[field.dataset.field] = field.value; }; });
    draftList.querySelectorAll(".remove-draft").forEach((button) => { button.onclick = () => { const key = button.closest("article").dataset.key; state.drafts = state.drafts.filter((item) => item.key !== key); renderDrafts(); }; });
    const ready = state.drafts.some((draft) => draft.status === "ready");
    uploadButton.disabled = !ready;
    $("#draftSummary").textContent = state.drafts.length ? `${state.drafts.length} ${state.drafts.length === 1 ? "grabación preparada" : "grabaciones preparadas"}` : "Puedes incorporar tantas voces como necesites";
  }

  async function uploadDrafts(event) {
    event.preventDefault(); uploadButton.disabled = true;
    for (const draft of state.drafts.filter((item) => item.status === "ready")) {
      draft.status = "uploading"; renderDrafts();
      const form = new FormData(); form.set("audio", draft.file); form.set("name", draft.name.trim() || "Voz sin nombre"); form.set("place", draft.place.trim()); form.set("language", draft.language.trim()); form.set("excerpt", draft.excerpt.trim());
      try { const response = await fetch("/api/voices", { method: "POST", body: form }); const result = await response.json(); if (!response.ok) throw new Error(result.error || "No se pudo guardar la voz"); draft.status = "done"; }
      catch (error) { draft.status = "error"; draft.error = error.message || "Error al guardar"; }
      renderDrafts();
    }
    await loadVoices();
  }

  function initSphere() {
    const canvas = $("#voiceSphere"); const context = canvas.getContext("2d");
    const points = []; const total = 1380; const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < total; i += 1) { const y = 1 - i / (total - 1) * 2; const radius = Math.sqrt(1 - y * y); const theta = golden * i; points.push({ x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius, seed: seeded(total, i) }); }
    const rotation = { x: -.12, y: .22 }; const velocity = { x: 0, y: .0018 }; const drag = { active: false, x: 0, y: 0, moved: 0 }; let width = 0; let height = 0; let projected = [];
    const resize = () => { const rect = canvas.getBoundingClientRect(); const dpr = Math.min(devicePixelRatio || 1, 2); width = rect.width; height = rect.height; canvas.width = Math.max(1, Math.round(width * dpr)); canvas.height = Math.max(1, Math.round(height * dpr)); context.setTransform(dpr, 0, 0, dpr, 0, 0); };
    new ResizeObserver(resize).observe(canvas); resize();
    const rotate = (point) => { const cy = Math.cos(rotation.y), sy = Math.sin(rotation.y); const x = point.x * cy - point.z * sy, z = point.x * sy + point.z * cy; const cx = Math.cos(rotation.x), sx = Math.sin(rotation.x); return { x, y: point.y * cx - z * sx, z: point.y * sx + z * cx }; };
    function draw(time) {
      context.clearRect(0, 0, width, height); const cx = width / 2, cy = height / 2 + Math.min(24, height * .025), radius = Math.min(width, height) * .385;
      if (!drag.active) { rotation.y += velocity.y + .0011; rotation.x += velocity.x; velocity.x *= .965; velocity.y *= .965; }
      const halo = context.createRadialGradient(cx, cy, radius * .2, cx, cy, radius * 1.32); halo.addColorStop(0, `rgba(255,230,174,${.12 + energy.value * .15})`); halo.addColorStop(.58, `rgba(213,168,88,${.05 + energy.value * .08})`); halo.addColorStop(1, "rgba(0,0,0,0)"); context.fillStyle = halo; context.beginPath(); context.arc(cx, cy, radius * 1.35, 0, Math.PI * 2); context.fill();
      points.map((point) => ({ ...rotate(point), seed: point.seed })).sort((a,b) => a.z - b.z).forEach((point) => { const perspective = .83 + (point.z + 1) * .105, px = cx + point.x * radius * perspective, py = cy + point.y * radius * perspective, front = (point.z + 1) / 2, pulse = Math.max(0, Math.sin(time * .0014 + point.seed * 22)); context.fillStyle = `rgba(255,${Math.round(219 + front * 24)},${Math.round(152 + front * 70)},${Math.min(1,.12 + front * .64 + pulse * (.08 + energy.value * .28))})`; context.beginPath(); context.arc(px, py, .35 + front * 1.18 + (pulse + energy.value) * .5, 0, Math.PI * 2); context.fill(); });
      context.save(); context.globalCompositeOperation = "screen";
      for (let ribbon = 0; ribbon < 7; ribbon += 1) { context.beginPath(); const phase = time * (.00016 + ribbon * .000008) + ribbon * .82; let drawing = false; for (let step = 0; step <= 180; step += 1) { const longitude = step / 180 * Math.PI * 2 + phase, latitude = Math.sin(longitude * (1.3 + ribbon * .07) + ribbon) * (.18 + ribbon * .022), point = rotate({ x: Math.cos(longitude) * Math.cos(latitude), y: Math.sin(latitude), z: Math.sin(longitude) * Math.cos(latitude) }); if (point.z < -.48) { drawing = false; continue; } const perspective = .83 + (point.z + 1) * .105, px = cx + point.x * radius * perspective, py = cy + point.y * radius * perspective; if (!drawing) { context.moveTo(px,py); drawing = true; } else context.lineTo(px,py); } context.strokeStyle = `rgba(255,226,174,${.12 + ribbon * .018 + energy.value * .17})`; context.lineWidth = .55 + energy.value * .85; context.stroke(); } context.restore();
      projected = state.voices.map((voice, index) => { const point = rotate(points[hashText(voice.id) % points.length]), perspective = .83 + (point.z + 1) * .105, px = cx + point.x * radius * perspective, py = cy + point.y * radius * perspective, selected = voice.id === state.selectedId; context.shadowColor = selected ? "rgba(255,245,208,.98)" : "rgba(224,174,90,.88)"; context.shadowBlur = 6 + energy.value * 9; context.fillStyle = selected ? "#fff6dc" : "#efc16e"; context.beginPath(); context.arc(px, py, selected ? 5.2 : 3.2, 0, Math.PI * 2); context.fill(); context.shadowBlur = 0; return { id: voice.id, x: px, y: py, radius: selected ? 14 : 11, depth: point.z }; }).sort((a,b) => b.depth - a.depth);
      const angle = time * .00028, lx = cx + Math.cos(angle) * radius * .88, ly = cy + Math.sin(angle * 1.36) * radius * .42, glow = context.createRadialGradient(lx,ly,0,lx,ly,36 + energy.value * 28); glow.addColorStop(0, `rgba(255,245,206,${.75 + energy.value * .2})`); glow.addColorStop(.18, `rgba(244,190,91,${.32 + energy.value * .22})`); glow.addColorStop(1,"rgba(244,190,91,0)"); context.fillStyle = glow; context.beginPath(); context.arc(lx,ly,36 + energy.value * 28,0,Math.PI*2); context.fill(); requestAnimationFrame(draw);
    }
    canvas.onpointerdown = (event) => { canvas.setPointerCapture(event.pointerId); Object.assign(drag,{active:true,x:event.clientX,y:event.clientY,moved:0}); velocity.x = velocity.y = 0; };
    canvas.onpointermove = (event) => { if (!drag.active) return; const dx = event.clientX - drag.x, dy = event.clientY - drag.y; drag.x = event.clientX; drag.y = event.clientY; drag.moved += Math.abs(dx) + Math.abs(dy); rotation.y += dx * .006; rotation.x = Math.max(-1.15,Math.min(1.15,rotation.x + dy * .004)); velocity.x = dy * .00024; velocity.y = dx * .00032; };
    canvas.onpointerup = (event) => { if (drag.moved < 8) { const rect = canvas.getBoundingClientRect(), x = event.clientX - rect.left, y = event.clientY - rect.top, hit = projected.find((item) => Math.hypot(item.x-x,item.y-y) <= item.radius); if (hit) { state.selectedId = hit.id; renderCard(); } } drag.active = false; };
    canvas.onpointercancel = () => { drag.active = false; }; requestAnimationFrame(draw);
  }

  document.querySelectorAll("[data-open-studio]").forEach((button) => { button.onclick = openStudio; });
  $("#closeStudio").onclick = closeStudio;
  $("#chooseAudio").onclick = () => audioInput.click();
  audioInput.onchange = () => { addFiles(audioInput.files); audioInput.value = ""; };
  dropZone.ondragover = (event) => { event.preventDefault(); dropZone.classList.add("is-dragging"); };
  dropZone.ondragleave = () => dropZone.classList.remove("is-dragging");
  dropZone.ondrop = (event) => { event.preventDefault(); dropZone.classList.remove("is-dragging"); addFiles(event.dataTransfer.files); };
  $("#uploadForm").onsubmit = uploadDrafts;
  $("#humanityButton").onclick = () => { if (!state.voices.length) return openStudio(); state.chorus = true; toggleVoice(selectedVoice() || state.voices[0]); };
  window.addEventListener("beforeunload", () => { cancelAnimationFrame(progressFrame); audio?.pause(); audioContext?.close(); });
  initSphere(); updateAudioEnergy(); loadVoices();
})();
