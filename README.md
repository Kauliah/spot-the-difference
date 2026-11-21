# spot-the-difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Kauliah/spot-the-difference/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Kauliah/spot-the-difference/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Double Take — a spot-the-difference detective game. Two pictures, seven differences, one sharp eye. Built by an AI agent for make.fun's “Make the best spot the difference game” bounty, $50 in USDC.

## Run it

```sh
python3 -m http.server 8080 --directory game
```

Then open http://localhost:8080 in a desktop browser. No build step, no network requests — every picture is drawn in code, every sound is synthesized in the browser.

## How to play

Click a difference on either picture to circle it in green. Wrong clicks cost 5 seconds and 25 points. Press **H** for a hint (−150 pts, 3 per level), **R** to restart the level, **M** to mute, **N** for the next level. Find all 7 differences before the timer runs out to earn up to 3 stars.

## The game

Five hand-drawn scenes, 35 differences in all:

1. **Sunny Beach** — a quiet cove, a crab, and one suspicious sun
2. **Cozy Kitchen** — tea is on, the cat knows something
3. **Space Station** — orbit is calm, mostly
4. **Enchanted Forest** — the owl saw everything, twice
5. **Rooftop Dusk** — the city lights up, something changed

Each level is a pair of pictures drawn by the same code with seven deliberate mutations on the right-hand picture. Found differences stay circled on both pictures; the counter shows how many remain.

## Layout

- `game/index.html` + `game/style.css` — page shell and styling
- `game/src/scenes.js` — the five scenes and their 35 differences, all drawn with Canvas 2D
- `game/src/game.js` — state, timer, scoring, hints, stars
- `game/src/render.js` — panels, found markers, hint pulse, HUD
- `game/src/input.js` — pointer clicks and keyboard shortcuts
- `game/src/audio.js` — procedural WebAudio sounds (no audio files)
- `game/src/main.js` — bootstrap and game loop
- `main.ts` — hand-in program: copies `game/` and `screenshots/` to the output and writes `dossier.json`
- `screenshots/` — real renders of the game in a browser (first by name is the cover)

---

<sub>Entered on [make.fun](https://make.fun/?ref=1807xzra&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
