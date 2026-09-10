"use client";

import { useEffect, useRef, useState } from "react";
import SalaCorazonVivo from "./SalaCorazonVivo";
import styles from "./RecordingStudio.module.css";

type Shot = "world" | "voice" | "meeting";
const shots: [Shot, string, string][] = [["voice", "La voz", "Tu presencia"], ["meeting", "El encuentro", "Voz + mundo"], ["world", "El mundo", "Imagen + voz"]];

export default function RecordingStudio() {
  const [classic, setClassic] = useState(false);
  return classic ? <><button className={styles.returnButton} onClick={() => setClassic(false)}>Entrar en modo rodaje</button><SalaCorazonVivo /></> : <Studio onExit={() => setClassic(true)} />;
}

function Studio({ onExit }: { onExit: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const camera = useRef<HTMLVideoElement>(null);
  const art = useRef<HTMLVideoElement>(null);
  const picture = useRef<HTMLImageElement | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const output = useRef<MediaStream | null>(null);
  const ambience = useRef<HTMLAudioElement>(null);
  const audioGraph = useRef<{context: AudioContext; destination: MediaStreamAudioDestinationNode; voice: GainNode; music: GainNode; analyser: AnalyserNode; data: Uint8Array<ArrayBuffer>; input?: MediaStreamAudioSourceNode} | null>(null);
  const meter = useRef<HTMLMeterElement>(null);
  const [voiceGain, setVoiceGain] = useState(0.8);
  const [musicGain, setMusicGain] = useState(0.16);
  const [musicUrl, setMusicUrl] = useState("");
  const urls = useRef<string[]>([]);
  const alive = useRef(true);
  const [shot, setShot] = useState<Shot>("world");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [recording, setRecording] = useState(false);
  const [muted, setMuted] = useState(false);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [microphoneId, setMicrophoneId] = useState("");
  const [filteredVoice, setFilteredVoice] = useState(false);
  const [text, setText] = useState("Hay formas de ternura\nque no necesitan palabras.");
  const [caption, setCaption] = useState(true);
  const [verse, setVerse] = useState(0);
  const [error, setError] = useState("");
  const [takes, setTakes] = useState<{id: number; url: string; extension: string}[]>([]);
  const nextTakeId = useRef(1);
  const [seconds, setSeconds] = useState(0);
  const config = useRef({shot, text, caption, verse, voiceGain, musicGain, muted});
  useEffect(() => { config.current = {shot, text, caption, verse, voiceGain, musicGain, muted}; }, [shot, text, caption, verse, voiceGain, musicGain, muted]);

  useEffect(() => {
    alive.current = true;
    const ownedUrls = urls.current;
    let frame = 0;
    let last = 0;
    function draw(now: number) {
      frame = requestAnimationFrame(draw);
      if (now - last < 1000 / 30) return;
      last = now;
      const graph = audioGraph.current;
      if (graph) {
        graph.analyser.getByteTimeDomainData(graph.data);
        const level = Math.sqrt(graph.data.reduce((sum, value) => sum + ((value - 128) / 128) ** 2, 0) / graph.data.length);
        if (meter.current) meter.current.value = Math.min(1, level * 4);
        graph.voice.gain.setTargetAtTime(config.current.muted ? 0 : config.current.voiceGain, graph.context.currentTime, .04);
        graph.music.gain.setTargetAtTime(config.current.musicGain * (level > .025 && !config.current.muted ? .3 : 1), graph.context.currentTime, .25);
      }
      const ctx = canvas.current?.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#100e0a";
      ctx.fillRect(0, 0, 1080, 1920);
      function cover(source: HTMLVideoElement | HTMLImageElement | null, x: number, y: number, w: number, h: number, mirror = false) {
        if (!source) return;
        const sw = source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth;
        const sh = source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight;
        if (!sw || !sh) return;
        const ratio = Math.max(w / sw, h / sh);
        ctx!.save(); ctx!.beginPath(); ctx!.rect(x, y, w, h); ctx!.clip();
        if (mirror) { ctx!.translate(x * 2 + w, 0); ctx!.scale(-1, 1); }
        ctx!.drawImage(source, x + (w - sw * ratio) / 2, y + (h - sh * ratio) / 2, sw * ratio, sh * ratio);
        ctx!.restore();
      }
      const state = config.current;
      const background = picture.current ?? art.current;
      if (state.shot === "world") cover(background, 0, 0, 1080, 1920);
      else if (state.shot === "voice") cover(camera.current, 0, 0, 1080, 1920, true);
      else { cover(camera.current, 0, 0, 1080, 820, true); cover(background, 0, 820, 1080, 1100); }
      const shade = ctx.createLinearGradient(0, 1150, 0, 1920);
      shade.addColorStop(0, "transparent"); shade.addColorStop(1, "rgba(0,0,0,.82)");
      ctx.fillStyle = shade; ctx.fillRect(0, 1150, 1080, 770);
      ctx.textAlign = "center";
      if (state.caption) {
        const paragraphs = state.text.split(/\n\s*\n/);
        const words = (paragraphs[Math.min(state.verse, paragraphs.length - 1)] ?? "").split(/\s+/);
        ctx.font = "48px Georgia";
        const lines: string[] = []; let line = "";
        for (const word of words) { const candidate = line ? `${line} ${word}` : word; if (ctx.measureText(candidate).width > 780 && line) { lines.push(line); line = word; } else line = candidate; }
        if (line) lines.push(line);
        ctx.fillStyle = "#f4eddf"; ctx.shadowColor = "#000"; ctx.shadowBlur = 12;
        lines.slice(0, 5).forEach((value, i) => ctx.fillText(value, 510, 1450 + i * 64));
        ctx.shadowBlur = 0;
      }
      ctx.fillStyle = "#c7b68a"; ctx.font = "23px Georgia";
      ctx.fillText("P O E M A   U N I V E R S A L", 510, 1770);
    }
    frame = requestAnimationFrame(draw);
    return () => {
      alive.current = false; cancelAnimationFrame(frame);
      if (recorder.current?.state === "recording") recorder.current.stop();
      stream.current?.getTracks().forEach(track => track.stop());
      output.current?.getTracks().forEach(track => track.stop());
      void audioGraph.current?.context.close();
      audioGraph.current = null;
      ownedUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    if (!recording) return;
    const start = Date.now();
    const id = setInterval(() => setSeconds(Math.floor((Date.now() - start) / 1000)), 250);
    return () => clearInterval(id);
  }, [recording]);

  async function activate() {
    setBusy(true); setError("");
    try {
      const media = await navigator.mediaDevices.getUserMedia({video: {width: {ideal: 1920}, height: {ideal: 1080}}, audio: {deviceId: microphoneId ? {exact: microphoneId} : undefined, echoCancellation: filteredVoice, noiseSuppression: filteredVoice, autoGainControl: false, channelCount: {ideal: 1}}});
      if (!alive.current) { media.getTracks().forEach(track => track.stop()); return; }
      stream.current?.getTracks().forEach(track => track.stop()); stream.current = media;
      if (camera.current) { camera.current.srcObject = media; await camera.current.play(); }
      if (!audioGraph.current) {
        const context = new AudioContext();
        const destination = context.createMediaStreamDestination();
        const voice = context.createGain(); const music = context.createGain();
        const analyser = context.createAnalyser(); analyser.fftSize = 256;
        // Leave headroom for the sum of voice and ambience.
        const master = context.createGain(); master.gain.value = 0.65;
        voice.connect(master); music.connect(master); master.connect(destination);
        if (ambience.current) context.createMediaElementSource(ambience.current).connect(music);
        audioGraph.current = {context, destination, voice, music, analyser, data: new Uint8Array(new ArrayBuffer(analyser.fftSize))};
      }
      const graph = audioGraph.current;
      await graph.context.resume();
      graph.input?.disconnect();
      graph.input = graph.context.createMediaStreamSource(media);
      graph.input.connect(graph.voice); graph.input.connect(graph.analyser);
      setReady(true); setMuted(false);
      // Device labels become available after capture permission is granted.
      void navigator.mediaDevices.enumerateDevices().then(devices => {
        if (alive.current) setMicrophones(devices.filter(device => device.kind === "audioinput"));
      }).catch(() => {});
      media.getTracks().forEach(track => track.addEventListener("ended", () => { if (alive.current) { setReady(false); if (recorder.current?.state === "recording") recorder.current.stop(); } }));
    } catch { stream.current?.getTracks().forEach(track => track.stop()); if (alive.current) {setReady(false); setError("No se pudo activar la cámara y el micrófono. Revisa los permisos del navegador.");} }
    finally { if (alive.current) setBusy(false); }
  }

  function record() {
    setError("");
    if (!ready || !canvas.current) { setError("Activa primero la cámara y el micrófono para grabar tu voz."); return; }
    try {
      if (typeof MediaRecorder === "undefined") throw new Error("unsupported");
      const mime = ["video/mp4", "video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"].find(type => MediaRecorder.isTypeSupported(type));
      if (!mime) throw new Error("unsupported");
      const capture = canvas.current.captureStream(30);
      audioGraph.current?.destination.stream.getAudioTracks().forEach(track => capture.addTrack(track.clone()));
      output.current = capture;
      const instance = new MediaRecorder(capture, {mimeType: mime, videoBitsPerSecond: 8_000_000, audioBitsPerSecond: 192_000});
      recorder.current = instance;
      const chunks: Blob[] = [];
      instance.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      instance.onstop = () => {
        capture.getTracks().forEach(track => track.stop());
        if (!alive.current) return;
        setRecording(false);
        if (chunks.length) {
          const url = URL.createObjectURL(new Blob(chunks, {type: instance.mimeType})); urls.current.push(url);
          const id = nextTakeId.current++;
          setTakes(previous => [...previous, {id, url, extension: instance.mimeType.includes("mp4") ? "mp4" : "webm"}]);
        }
      };
      instance.onerror = () => { if (alive.current) setError("La grabación se interrumpió. Comprueba la toma antes de descargarla."); capture.getTracks().forEach(track => track.stop()); if (instance.state !== "inactive") instance.stop(); };
      instance.start(1000); setSeconds(0); setRecording(true);
    } catch { output.current?.getTracks().forEach(track => track.stop()); setError("Este navegador no pudo iniciar la grabación del encuadre. Prueba con un navegador actualizado."); }
  }

  function deleteTake(url: string) {
    setTakes(previous => previous.filter(take => take.url !== url));
    URL.revokeObjectURL(url);
    const index = urls.current.indexOf(url);
    if (index !== -1) urls.current.splice(index, 1);
  }

  function loadImage(file?: File) {
    if (!file) return;
    const url = URL.createObjectURL(file); urls.current.push(url);
    const image = new Image(); image.onload = () => { if (alive.current) picture.current = image; }; image.onerror = () => setError("No se pudo abrir esa imagen."); image.src = url;
  }

  return <main className={styles.studio}>
    <header className={styles.header}><p>POEMA UNIVERSAL · ESTUDIO DE LECTURA</p><h1>Sala del Corazón Vivo</h1><span>Un instante de voz. Un mundo que permanece.</span><button onClick={onExit} disabled={recording}>Sala clásica ↗</button></header>
    <div className={styles.layout}>
      <section className={styles.stage}><div className={styles.stageHeading}><span>TU PELÍCULA</span><span>9:16 · 1080 × 1920</span></div><canvas ref={canvas} width={1080} height={1920} aria-label="Encuadre final del vídeo, con imagen y subtítulos" /><p className={styles.note}>Solo este encuadre se graba. La sala queda fuera de la película.</p><div className={styles.sequence}><button onClick={() => setShot("world")}>01 · Apertura</button><button disabled={!ready} onClick={() => setShot("voice")}>02 · La voz</button><button onClick={() => {setShot("world"); setCaption(false);}}>03 · Silencio</button></div></section>
      <aside className={styles.controls}>
        <section><h2>TU PRESENCIA</h2><div className={styles.camera}><video ref={camera} muted playsInline />{!ready && <span>Tu voz habita este lugar.</span>}</div><button disabled={busy || recording} onClick={activate}>{busy ? "Activando…" : ready ? "Reconectar cámara + micro" : "Activar cámara + micro"}</button><button disabled={!ready} onClick={() => { const value = !muted; setMuted(value); stream.current?.getAudioTracks().forEach(t => {t.enabled = !value;});  }}>{muted ? "Activar voz" : "Silenciar voz"}</button></section>
        <section><h2>COMPOSICIÓN</h2><div className={styles.shots}>{shots.map(([key, label, detail]) => <button key={key} aria-pressed={shot === key} disabled={key !== "world" && !ready} onClick={() => setShot(key)}><span className={styles[key]} /><strong>{label}</strong><small>{detail}</small></button>)}</div></section>
        <section><h2>EL MUNDO QUE TE ACOMPAÑA</h2><label className={styles.upload}>Elegir una imagen<input type="file" accept="image/*" onChange={event => loadImage(event.target.files?.[0])} /></label><button onClick={() => {picture.current = null;}}>Volver al mundo original</button><p className={styles.note}>Libros, enlaces y pantalla secundaria siguen disponibles en Sala clásica.</p></section>
        <section><h2>AUDIO</h2><label>Micrófono<select aria-label="Micrófono de grabación" disabled={recording || busy} value={microphoneId} onChange={event => setMicrophoneId(event.target.value)}><option value="">Predeterminado del sistema</option>{microphones.map((device, index) => <option key={device.deviceId || index} value={device.deviceId}>{device.label || `Micrófono ${index + 1}`}</option>)}</select></label><label><input type="checkbox" disabled={recording || busy} checked={filteredVoice} onChange={event => setFilteredVoice(event.target.checked)} /> Reducir ruido y eco</label><p className={styles.note}>Voz natural por defecto, sin ajuste automático de volumen. Después de cambiar el micrófono o los filtros, pulsa «Reconectar cámara + micro». Usa auriculares para evitar que otros sonidos entren por el micrófono.</p><label>Voz <meter ref={meter} min={0} max={1} value={0} /><input aria-label="Volumen de voz" type="range" min="0" max="1" step="0.01" value={voiceGain} onChange={event => setVoiceGain(Number(event.target.value))} /></label><label>Ambiente<input aria-label="Volumen de ambiente" type="range" min="0" max="0.5" step="0.01" value={musicGain} onChange={event => setMusicGain(Number(event.target.value))} /></label><input aria-label="Cargar sonido ambiental" type="file" accept="audio/*" disabled={recording} onChange={event => {const file = event.target.files?.[0]; if (file) {const url = URL.createObjectURL(file); urls.current.push(url); setMusicUrl(url);}}} /><button disabled={!ready || !musicUrl} onClick={() => { if (ambience.current?.paused) void ambience.current.play().catch(() => setError("No se pudo reproducir ese audio.")); else ambience.current?.pause(); }}>Reproducir / pausar ambiente</button><p className={styles.note}>El ambiente baja al hablar. La mezcla se graba sin reproducir tu micro por los altavoces.</p></section>
        <section><h2>SUBTÍTULOS · POR VERSO</h2><label><input type="checkbox" checked={caption} onChange={event => setCaption(event.target.checked)} /> Mostrar en la película</label><textarea aria-label="Versos del poema" value={text} onChange={event => {setText(event.target.value); setVerse(0);}} /><p className={styles.note}>Separa cada fragmento con una línea vacía. Avanza al recitar.</p><div className={styles.verse}><button disabled={verse === 0} onClick={() => setVerse(v => v - 1)}>← Anterior</button><span>{verse + 1} / {text.split(/\n\s*\n/).length}</span><button disabled={verse >= text.split(/\n\s*\n/).length - 1} onClick={() => setVerse(v => v + 1)}>Siguiente →</button></div></section>
        <section className={styles.record}><button disabled={busy} onClick={() => recording ? recorder.current?.stop() : record()}><span />{recording ? `Terminar toma · ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2,"0")}` : "Grabar lectura"}</button><p>1080 × 1920 · 30 fps · voz directa</p><small>MP4 cuando el navegador lo permite; WebM como alternativa.</small></section>
        {error && <p role="alert" className={styles.error}>{error}</p>}
        {takes.map((take) => <section key={take.url}><h2>TOMA {String(take.id).padStart(2,"0")}</h2><video className={styles.take} src={take.url} controls playsInline /><a href={take.url} download={`poema-universal-toma-${take.id}.${take.extension}`}>Descargar {take.extension.toUpperCase()} ↓</a><button type="button" aria-label={`Borrar toma ${take.id}`} onClick={() => deleteTake(take.url)}>Borrar toma</button><p className={styles.note}>Descarga tu toma antes de salir o recargar.</p></section>)}
      </aside>
    </div>
    <audio ref={ambience} src={musicUrl || undefined} loop />
    <video ref={art} className={styles.source} src="/poema-universal/sala-corazon-vivo/estudio-reposo.mp4" autoPlay loop muted playsInline />
  </main>;
}
