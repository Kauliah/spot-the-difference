// Double Take — rendering: draws both panels, found markers, wrong-click
// flashes and the hint pulse. The HUD (score, timer, counter) is DOM.
import { LEVELS, PANEL_W, PANEL_H } from './scenes.js';
import { formatTime } from './game.js';

const MARKER = '#2e9e5b';

export function drawPanels(state, canvasA, canvasB, wrongFlash) {
  const level = LEVELS[state.levelIndex];
  for (const [canvas, variant] of [[canvasA, 0], [canvasB, 1]]) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, PANEL_W, PANEL_H);
    level.draw(ctx, variant);
    // found markers on both pictures
    for (const i of state.found) {
      drawMarker(ctx, level.diffs[i]);
    }
    // hint pulse on both pictures
    if (state.hintFlash && Date.now() < state.hintFlash.until) {
      const d = level.diffs[state.hintFlash.index];
      const pulse = 1 + 0.25 * Math.sin(Date.now() / 120);
      ctx.strokeStyle = '#f2a541';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * pulse, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  // wrong-click red X on the panel that was clicked
  if (wrongFlash && Date.now() < wrongFlash.until) {
    const ctx = (wrongFlash.panel === 'A' ? canvasA : canvasB).getContext('2d');
    const { x, y } = wrongFlash;
    ctx.strokeStyle = '#d64545';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 12, y - 12); ctx.lineTo(x + 12, y + 12);
    ctx.moveTo(x + 12, y - 12); ctx.lineTo(x - 12, y + 12);
    ctx.stroke();
  }
}

function drawMarker(ctx, d) {
  ctx.strokeStyle = MARKER;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
  ctx.stroke();
  // small tick inside the circle so a found difference reads at a glance
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(d.x - 8, d.y);
  ctx.lineTo(d.x - 2, d.y + 6);
  ctx.lineTo(d.x + 9, d.y - 6);
  ctx.stroke();
}

export function renderHud(state, els) {
  const level = LEVELS[state.levelIndex];
  els.level.textContent = `${state.levelIndex + 1} / ${LEVELS.length}`;
  els.found.textContent = `${state.found.size} / ${level.diffs.length}`;
  els.score.textContent = String(state.score);
  els.time.textContent = formatTime(state.timeLeft);
  const frac = state.timeLeft / level.time;
  els.timerFill.style.width = `${Math.max(0, frac * 100)}%`;
  els.timerFill.classList.toggle('low', frac < 0.25);
  els.hintBtn.textContent = `Hint (H) · ${state.hintsLeft} left`;
  els.hintBtn.disabled = state.hintsLeft <= 0 || state.screen !== 'play';
  els.levelTitle.textContent = `Level ${state.levelIndex + 1} — ${level.name}`;
}

export function renderMenu(state, container) {
  container.innerHTML = '';
  LEVELS.forEach((level, i) => {
    const card = document.createElement('div');
    const locked = i >= state.unlocked;
    card.className = 'level-card' + (locked ? ' locked' : '');
    const stars = state.best[level.id] || 0;
    card.innerHTML =
      `<div class="num">LEVEL ${i + 1}</div>` +
      `<h3>${level.name}</h3>` +
      `<p>${level.blurb}</p>` +
      `<div class="best">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>`;
    if (!locked) {
      card.addEventListener('click', () => window.__doubleTake.startLevel(i));
    }
    container.appendChild(card);
  });
}

export function showScreen(name) {
  for (const id of ['menu', 'play', 'level-done', 'game-done', 'time-up']) {
    document.getElementById(id).classList.toggle('hidden', id !== name);
  }
  document.getElementById('hud').classList.toggle('hidden', name !== 'play');
  document.getElementById('timerbar').style.display = name === 'play' ? '' : 'none';
}
