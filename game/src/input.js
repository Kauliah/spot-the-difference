// Double Take — input: pointer clicks on the panels and keyboard shortcuts.
// Converts a click on a canvas element into panel coordinates (the canvas is
// displayed at its natural 460x340 size, but we scale defensively).
import { PANEL_W, PANEL_H } from './scenes.js';

export function panelCoords(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * PANEL_W;
  const y = ((event.clientY - rect.top) / rect.height) * PANEL_H;
  return { x, y };
}

export function bindPanels(canvasA, canvasB, onPick) {
  for (const [canvas, panel] of [[canvasA, 'A'], [canvasB, 'B']]) {
    canvas.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      const { x, y } = panelCoords(canvas, event);
      onPick(panel, x, y);
    });
  }
}

export function bindKeys(handlers) {
  document.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (key === 'h' && handlers.hint) handlers.hint();
    else if (key === 'r' && handlers.restart) handlers.restart();
    else if (key === 'm' && handlers.mute) handlers.mute();
    else if (key === 'n' && handlers.next) handlers.next();
    else if (key === 'escape' && handlers.menu) handlers.menu();
    else if (/^[1-5]$/.test(key) && handlers.select) handlers.select(Number(key) - 1);
  });
}
