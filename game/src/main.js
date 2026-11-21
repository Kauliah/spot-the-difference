// Double Take — bootstrap: wires state, rendering, input and the game loop.
// Demo mode (for screenshots): ?shot=menu | mid1 | mid3 | win | complete
// enters a real game state with the timer frozen — the same code the player sees.
import { LEVELS } from './scenes.js';
import { sfx } from './audio.js';
import {
  newGameState, startLevel, diffAt, markFound, applyWrong, useHint,
  levelComplete, finishLevel, tick,
} from './game.js';
import { drawPanels, renderHud, renderMenu, showScreen } from './render.js';
import { bindPanels, bindKeys } from './input.js';

const $ = (id) => document.getElementById(id);
const els = {
  level: $('hud-level'),
  found: $('hud-found'),
  score: $('hud-score'),
  time: $('hud-time'),
  timerFill: $('timerfill'),
  hintBtn: $('btn-hint'),
  levelTitle: $('level-title'),
};

const state = newGameState();
let wrongFlash = null;
let lastTick = performance.now();

function refresh() {
  drawPanels(state, $('panelA'), $('panelB'), wrongFlash);
  renderHud(state, els);
}

function toast(msg, bad = false) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.toggle('bad', bad);
}

function onPick(panel, x, y) {
  if (state.screen !== 'play') return;
  const index = diffAt(state, x, y);
  if (index >= 0) {
    if (markFound(state, index)) {
      sfx.found();
      const d = LEVELS[state.levelIndex].diffs[index];
      toast(`Found it — ${d.label}! (+100)`);
      if (levelComplete(state)) {
        sfx.win();
        finishLevel(state);
        showLevelDone();
      }
    } else {
      toast('Already found — try another spot.');
    }
  } else {
    sfx.wrong();
    applyWrong(state);
    wrongFlash = { panel, x, y, until: Date.now() + 600 };
    toast(`Not a difference — minus 5 seconds, minus 25 points.`, true);
    if (state.timeLeft <= 0) showTimeUp();
  }
  refresh();
}

function showLevelDone() {
  $('done-title').textContent = `Level ${state.levelIndex + 1} Complete!`;
  $('done-stars').textContent = '★'.repeat(state.stars) + '☆'.repeat(3 - state.stars);
  $('done-detail').textContent =
    `All ${LEVELS[state.levelIndex].diffs.length} differences found with ` +
    `${state.wrongs === 0 ? 'no mistakes' : state.wrongs + ' mistake' + (state.wrongs > 1 ? 's' : '')}.`;
  $('done-score').textContent =
    `Time bonus +${state.timeBonus} · Total score ${state.score}`;
  showScreen('level-done');
  renderHud(state, els);
}

function showTimeUp() {
  const level = LEVELS[state.levelIndex];
  $('timeup-detail').textContent =
    `You found ${state.found.size} of ${level.diffs.length} differences in ${level.name}. ` +
    `The remaining ones are still hiding — give it another go.`;
  showScreen('time-up');
}

function showGameDone() {
  $('final-score').textContent = `Final score: ${state.score} · All 35 differences found.`;
  showScreen('game-done');
}

function goMenu() {
  state.screen = 'menu';
  renderMenu(state, $('level-cards'));
  showScreen('menu');
}

function start(i) {
  if (i >= state.unlocked) return;
  startLevel(state, i);
  showScreen('play');
  toast('Find all 7 differences — click on either picture.');
  refresh();
}

// Demo states for screenshots: real states, timer frozen.
function enterDemo(shot) {
  state.demo = true;
  if (shot === 'menu') {
    goMenu();
    return;
  }
  if (shot === 'mid1' || shot === 'mid3' || shot === 'win') {
    const levelIndex = shot === 'mid3' ? 2 : 0;
    startLevel(state, levelIndex);
    showScreen('play');
    const found = shot === 'mid1' ? [0, 2, 4] : shot === 'mid3' ? [0, 1, 2, 3, 5] : [0, 1, 2, 3, 4, 5, 6];
    for (const i of found) markFound(state, i);
    state.timeLeft = shot === 'mid1' ? 121 : shot === 'mid3' ? 96 : 0;
    if (shot === 'win') {
      state.timeLeft = 87;
      finishLevel(state);
      showLevelDone();
    }
    refresh();
    return;
  }
  if (shot === 'complete') {
    state.screen = 'gameDone';
    state.score = 4745;
    showGameDone();
    return;
  }
  goMenu();
}

function loop(now) {
  const dt = Math.min(0.25, (now - lastTick) / 1000);
  lastTick = now;
  if (state.screen === 'play') {
    const before = state.timeLeft;
    tick(state, dt);
    if (state.screen === 'timeUp') {
      showTimeUp();
    } else if (Math.ceil(before) !== Math.ceil(state.timeLeft)) {
      if (state.timeLeft <= 10 && state.timeLeft > 0) sfx.tick();
      refresh();
    }
  }
  if (state.hintFlash && Date.now() >= state.hintFlash.until) {
    state.hintFlash = null;
    refresh();
  }
  requestAnimationFrame(loop);
}

function init() {
  window.__doubleTake = { startLevel: start, state };
  bindPanels($('panelA'), $('panelB'), onPick);
  bindKeys({
    hint: () => {
      if (state.screen !== 'play') return;
      const picked = useHint(state);
      if (picked >= 0) {
        sfx.hint();
        toast('Hint: look inside the gold circle. (−150 pts)');
        refresh();
      }
    },
    restart: () => {
      if (state.screen === 'play' || state.screen === 'timeUp') {
        sfx.click();
        start(state.levelIndex);
      }
    },
    mute: () => {
      sfx.setMuted(!sfx.isMuted());
      $('btn-sound').textContent = `Sound: ${sfx.isMuted() ? 'off' : 'on'} (M)`;
    },
    next: () => {
      if (state.screen === 'levelDone') start(state.levelIndex + 1);
    },
    menu: () => goMenu(),
    select: (i) => { if (state.screen === 'menu') start(i); },
  });
  $('btn-hint').addEventListener('click', () => {
    if (state.screen !== 'play') return;
    const picked = useHint(state);
    if (picked >= 0) { sfx.hint(); toast('Hint: look inside the gold circle. (−150 pts)'); refresh(); }
  });
  $('btn-restart').addEventListener('click', () => start(state.levelIndex));
  $('btn-sound').addEventListener('click', () => {
    sfx.setMuted(!sfx.isMuted());
    $('btn-sound').textContent = `Sound: ${sfx.isMuted() ? 'off' : 'on'} (M)`;
  });
  $('btn-menu').addEventListener('click', goMenu);
  $('btn-next').addEventListener('click', () => start(state.levelIndex + 1));
  $('btn-replay').addEventListener('click', () => start(state.levelIndex));
  $('btn-done-menu').addEventListener('click', goMenu);
  $('btn-again').addEventListener('click', () => { state.score = 0; state.unlocked = 1; start(0); });
  $('btn-final-menu').addEventListener('click', goMenu);
  $('btn-retry').addEventListener('click', () => start(state.levelIndex));
  $('btn-time-menu').addEventListener('click', goMenu);

  const shot = new URLSearchParams(location.search).get('shot');
  if (shot) enterDemo(shot);
  else goMenu();
  requestAnimationFrame(loop);
}

init();
