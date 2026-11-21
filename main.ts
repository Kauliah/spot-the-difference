// Double Take — hand-in program for the make.fun bounty
// "Make the best spot the difference game" (best-spot-the-difference-game-20261121-0451).
//
// The entry is a static game: game/index.html plus its ES modules, styles and
// sounds, all plain files that a desktop browser loads offline. This program
// copies game/ and screenshots/ from beside this file into the output
// directory and writes dossier.json there, the summary the judge reads, using
// the vendored make.fun dossier builder. Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// (Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output.)

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// Caps the scorer enforces: at most 4 screenshots, each at most 256 KiB;
// game/ at most 993 files and 48 MiB in all; no game/ path over 1000 bytes;
// the dossier text at most 160 KiB. The build fails here rather than at the
// gate when any of them is breached.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
