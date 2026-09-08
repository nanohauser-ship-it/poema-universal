/* eslint-disable @typescript-eslint/no-require-imports */
// Run: node --test app/poema-universal/gran-avatar/tests/avatarRuntime.test.cjs
// Transpile with the project's existing TypeScript; no additional test packages.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, filename);
};
const { AvatarTimeline, splitVoiceText } = require('../lib/avatarTimeline.ts');
const { createAvatarPlayback } = require('../lib/avatarAudio.ts');
const { avatarPerformanceSignal } = require('../lib/avatarPerformanceSignal.ts');
const { canPerform } = require('../lib/avatarCapabilities.ts');

let now = 0;
let nextFrame = 1;
const frames = new Map();
const audios = [];
const revoked = [];
let urlCount = 0;
Object.defineProperty(globalThis, 'performance', { value: { now: () => now }, configurable: true });
globalThis.window = {
  setTimeout, clearTimeout,
  requestAnimationFrame: (fn) => { const id = nextFrame++; frames.set(id, fn); return id; },
  cancelAnimationFrame: (id) => frames.delete(id),
};
URL.createObjectURL = () => `blob:test-${++urlCount}`;
URL.revokeObjectURL = (url) => revoked.push(url);
class FakeAudio extends EventTarget {
  currentTime = 0; duration = 2; paused = true; ended = false; playbackRate = 1; src = '';
  constructor() { super(); audios.push(this); }
  load() { if (this.src) queueMicrotask(() => this.dispatchEvent(new Event('loadedmetadata'))); }
  play() { this.paused = false; return Promise.resolve(); }
  pause() { this.paused = true; }
  removeAttribute() { this.src = ''; }
}
globalThis.Audio = FakeAudio;
const flush = () => new Promise((resolve) => setImmediate(resolve));
async function advance(seconds) {
  for (let i = 0; i < Math.ceil(seconds / 0.05); i++) {
    now += 50;
    for (const audio of audios) {
      if (!audio.paused && !audio.ended) {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 0.05 * audio.playbackRate);
        if (audio.currentTime >= audio.duration) { audio.ended = true; audio.paused = true; }
      }
    }
    const scheduled = [...frames.values()]; frames.clear();
    for (const fn of scheduled) fn(now);
    await flush();
  }
}
function playback(text, extra = {}) {
  return createAvatarPlayback({ text, purpose: 'speaking', rate: 1, onReady() {}, onProgress() {}, onEvent() {}, ...extra });
}

test('score sorts events, rejects ambiguous IDs and never repeats after pause', () => {
  const timeline = new AvatarTimeline([{ id: 'b', time: 3, action: 'lookAtViewer' }, { id: 'a', time: 1, action: 'silence', duration: 2 }]);
  assert.deepEqual(timeline.advance(1).map(e => e.id), ['a']);
  assert.deepEqual(timeline.advance(1), []);
  assert.deepEqual(timeline.advance(4).map(e => e.id), ['b']);
  assert.throws(() => new AvatarTimeline([{ id: 'x', time: NaN, action: 'lookAtViewer' }]));
  assert.throws(() => new AvatarTimeline([{ id: 'x', time: 1, action: 'silence', duration: 31 }]));
  assert.equal(canPerform('synchronized', { action: 'handGesture' }), false);
});

test('text chunks preserve verse whitespace and do not split ordinary words', () => {
  const text = ('Un verso\notro verso\n\n').repeat(150).trim();
  const chunks = splitVoiceText(text);
  assert.ok(chunks.every(c => c.length <= 1100));
  assert.deepEqual(chunks.join(' ').split(/\s+/), text.split(/\s+/));
  assert.ok(chunks[0].includes('\n'));
  assert.deepEqual(splitVoiceText('   '), []);
  assert.ok(splitVoiceText('x'.repeat(1200)).every(c => c.length <= 1100));
});

test('intentional silence freezes audio and user pause freezes the hold', async () => {
  globalThis.fetch = async () => new Response(new Blob(['test']), { status: 200 });
  const events = [];
  const player = playback('silence test', { score: [{ id: 'hold', time: 0.5, action: 'silence', duration: 1 }], onEvent: e => events.push(e.id) });
  const completion = player.run();
  await flush(); await advance(0.65);
  const audio = audios.at(-1);
  const heldTime = audio.currentTime;
  assert.ok(audio.paused);
  player.pause();
  await advance(2);
  assert.equal(audio.currentTime, heldTime);
  assert.equal(avatarPerformanceSignal.silent, true);
  player.resume();
  await advance(0.2);
  assert.equal(audio.currentTime, heldTime);
  await advance(3);
  await completion;
  assert.deepEqual(events, ['hold']);
  assert.equal(audio.src, '');
  assert.equal(frames.size, 0);
});

test('stop rejects pending preparation without creating audio or leaking URLs', async () => {
  const count = audios.length;
  globalThis.fetch = (_url, { signal }) => new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new DOMException('cancel', 'AbortError')), { once: true }));
  const player = playback('cancel preparation');
  const completion = player.run();
  player.stop();
  await assert.rejects(completion, { name: 'AbortError' });
  assert.equal(audios.length, count);
});

test('stop settles active playback and releases resources', async () => {
  globalThis.fetch = async () => new Response(new Blob(['test']), { status: 200 });
  const player = playback('cancel playing');
  const completion = player.run();
  await flush(); await advance(0.1);
  player.stop();
  await assert.rejects(completion, { name: 'AbortError' });
  assert.equal(audios.at(-1).src, '');
  assert.equal(frames.size, 0);
  assert.ok(revoked.length >= 2);
});

test('rate changes persist into the next fragment and progress follows duration', async () => {
  globalThis.fetch = async () => new Response(new Blob(['test']), { status: 200 });
  const progress = [];
  const start = audios.length;
  const player = playback(('palabra '.repeat(200)), { onProgress: p => progress.push(p) });
  const completion = player.run();
  await flush(); await advance(0.1);
  player.setRate(1.2);
  await advance(2);
  assert.equal(audios[start + 1].playbackRate, 1.2);
  await advance(3);
  await completion;
  assert.equal(progress.at(-1), 1);
  assert.ok(progress.every((p, i) => !i || p >= progress[i - 1]));
});

test('reading completes its final silence rather than waiting on stopped audio time', async () => {
  globalThis.fetch = async () => new Response(new Blob(['test']), { status: 200 });
  const player = playback('final reading', { purpose: 'reading' });
  let finished = false;
  const completion = player.run().then(() => { finished = true; });
  await flush(); await advance(2.1);
  assert.equal(finished, false);
  assert.equal(avatarPerformanceSignal.silent, true);
  await advance(3);
  await completion;
  assert.equal(finished, true);
  assert.equal(frames.size, 0);
});

test('user pause during preparation prevents autoplay until resumed', async () => {
  globalThis.fetch = async () => new Response(new Blob(['test']), { status: 200 });
  const player = playback('paused before ready');
  const completion = player.run();
  player.pause();
  await flush(); await advance(0.5);
  assert.equal(audios.at(-1).currentTime, 0);
  player.resume();
  await advance(3);
  await completion;
});

test('a failed request aborts its sibling and leaves no background work', async () => {
  let requests = 0;
  globalThis.fetch = (_url, { signal }) => {
    requests++;
    if (requests === 1) return Promise.resolve(new Response(JSON.stringify({ error: 'Voice unavailable' }), { status: 500 }));
    return new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new DOMException('cancel', 'AbortError')), { once: true }));
  };
  const player = playback('different '.repeat(200));
  await assert.rejects(player.run(), /Voice unavailable/);
  assert.equal(requests, 2);
  assert.equal(frames.size, 0);
});

test('IndexedDB save waits for commit and rejects transaction abort after request success', async () => {
  const { saveAvatarPoem } = require('../lib/avatarArchiveStore.ts');
  let transaction;
  globalThis.indexedDB = {
    open() {
      const request = {};
      queueMicrotask(() => {
        request.result = {
          close() {},
          transaction() {
            transaction = {
              objectStore() {
                return { put() { const op = { result: 'poem' }; queueMicrotask(() => op.onsuccess()); return op; } };
              },
            };
            return transaction;
          },
        };
        request.onsuccess();
      });
      return request;
    },
  };
  let saved = false;
  const pending = saveAvatarPoem({ id: 'poem' }).then(() => { saved = true; });
  await flush();
  assert.equal(saved, false);
  transaction.oncomplete();
  await pending;
  assert.equal(saved, true);
  const aborted = saveAvatarPoem({ id: 'poem' });
  await flush();
  transaction.error = new Error('disk full');
  transaction.onabort();
  await assert.rejects(aborted, /disk full/);
});
