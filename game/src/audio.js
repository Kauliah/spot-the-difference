// Double Take — procedural WebAudio sounds. No audio assets, no network.
let ctx = null;
let muted = false;

function ensure() {
  if (ctx) return ctx;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
  } catch (e) {
    ctx = null;
  }
  return ctx;
}

function tone(freq, dur, type, gain, when = 0) {
  const ac = ensure();
  if (!ac || muted) return;
  try {
    const t0 = ac.currentTime + when;
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  } catch (e) { /* audio is a garnish, never a crash */ }
}

export const sfx = {
  click() { tone(700, 0.06, 'sine', 0.12); },
  found() {
    tone(660, 0.12, 'sine', 0.2);
    tone(880, 0.18, 'sine', 0.2, 0.09);
    tone(1320, 0.22, 'sine', 0.14, 0.18);
  },
  wrong() {
    tone(160, 0.22, 'sawtooth', 0.12);
    tone(110, 0.28, 'sawtooth', 0.1, 0.05);
  },
  hint() { tone(990, 0.1, 'triangle', 0.15); tone(740, 0.14, 'triangle', 0.15, 0.08); },
  win() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, 'triangle', 0.18, i * 0.11));
  },
  tick() { tone(440, 0.05, 'square', 0.06); },
  setMuted(m) { muted = m; },
  isMuted() { return muted; },
};
