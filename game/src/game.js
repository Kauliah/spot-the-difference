// Double Take — game state: levels, timer, scoring, hints, stars.
// Pure logic; rendering lives in render.js, input in input.js.
import { LEVELS } from './scenes.js';

export const DIFF_POINTS = 100;
export const WRONG_TIME_PENALTY = 5; // seconds
export const WRONG_POINT_PENALTY = 25;
export const HINT_COST = 150;
export const HINTS_PER_LEVEL = 3;

export function newGameState() {
  return {
    screen: 'menu', // menu | play | levelDone | gameDone | timeUp
    levelIndex: 0,
    found: new Set(), // diff indexes found this level
    wrongs: 0,
    hintsLeft: HINTS_PER_LEVEL,
    hintFlash: null, // {index, until} — diff highlighted by a hint
    score: 0,
    timeLeft: LEVELS[0].time,
    timeBonus: 0,
    stars: 0,
    demo: false, // demo mode: timer frozen (used for screenshots)
    unlocked: 1, // levels unlocked (1-based count)
    best: loadBest(),
  };
}

function loadBest() {
  try {
    return JSON.parse(localStorage.getItem('double-take-best') || '{}');
  } catch (e) {
    return {};
  }
}

export function saveBest(state) {
  try {
    localStorage.setItem('double-take-best', JSON.stringify(state.best));
  } catch (e) { /* private mode: progress just does not persist */ }
}

export function levelStars(state, levelIndex) {
  // 3 stars: no mistakes and plenty of time left; 2: comfortable; else 1.
  if (state.wrongs === 0 && state.timeLeft > 45) return 3;
  if (state.timeLeft > 15) return 2;
  return 1;
}

export function startLevel(state, levelIndex) {
  const level = LEVELS[levelIndex];
  state.levelIndex = levelIndex;
  state.found = new Set();
  state.wrongs = 0;
  state.hintsLeft = HINTS_PER_LEVEL;
  state.hintFlash = null;
  state.timeLeft = level.time;
  state.timeBonus = 0;
  state.stars = 0;
  state.screen = 'play';
}

export function diffAt(state, x, y) {
  // Returns the diff index under (x, y) in panel coordinates, or -1.
  const diffs = LEVELS[state.levelIndex].diffs;
  for (let i = 0; i < diffs.length; i++) {
    const d = diffs[i];
    const dx = x - d.x;
    const dy = y - d.y;
    if (dx * dx + dy * dy <= d.r * d.r) return i;
  }
  return -1;
}

export function markFound(state, index) {
  if (state.found.has(index)) return false;
  state.found.add(index);
  state.score += DIFF_POINTS;
  return true;
}

export function applyWrong(state) {
  state.wrongs += 1;
  state.timeLeft = Math.max(0, state.timeLeft - WRONG_TIME_PENALTY);
  state.score = Math.max(0, state.score - WRONG_POINT_PENALTY);
}

export function useHint(state) {
  if (state.hintsLeft <= 0 || state.screen !== 'play') return -1;
  const diffs = LEVELS[state.levelIndex].diffs;
  const remaining = diffs.map((d, i) => i).filter((i) => !state.found.has(i));
  if (remaining.length === 0) return -1;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - HINT_COST);
  state.hintFlash = { index: pick, until: Date.now() + 2000 };
  return pick;
}

export function levelComplete(state) {
  return state.found.size === LEVELS[state.levelIndex].diffs.length;
}

export function finishLevel(state) {
  state.timeBonus = state.timeLeft * 5;
  state.score += state.timeBonus;
  state.stars = levelStars(state, state.levelIndex);
  const key = LEVELS[state.levelIndex].id;
  if (!state.best[key] || state.best[key] < state.stars) state.best[key] = state.stars;
  if (state.levelIndex + 1 < LEVELS.length) {
    state.unlocked = Math.max(state.unlocked, state.levelIndex + 2);
  }
  saveBest(state);
  state.screen = state.levelIndex === LEVELS.length - 1 ? 'gameDone' : 'levelDone';
}

export function tick(state, dt) {
  if (state.screen !== 'play' || state.demo) return;
  state.timeLeft = Math.max(0, state.timeLeft - dt);
  if (state.timeLeft <= 0) state.screen = 'timeUp';
}

export function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}
