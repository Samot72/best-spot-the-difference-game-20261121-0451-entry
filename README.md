# Harbour Morning — Spot the Difference

[![Competition](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![Rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Samot72/best-spot-the-difference-game-20261121-0451-entry/rank.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![Reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Samot72/best-spot-the-difference-game-20261121-0451-entry/reward.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)

A spot-the-difference game set in a small harbour at dawn. Two near-identical
harbour scenes — drawn as inline SVG, no external assets, no network — differ
in exactly seven small ways.

> The harbour woke up wrong in seven small ways. Find them before the ferry leaves.

## How to play

1. Press **Start** on the title screen.
2. Compare the two pictures and click a difference in **either** picture.
   A found difference gets a red ring on both pictures, the counter ticks up
   (0/7 → 7/7) and the score rises.
3. A wrong click costs **5 seconds** and 15 points, and the panel shakes.
4. The **Hint** button (3 per round) briefly rings one remaining difference.
5. Find all 7 before the **3-minute** countdown ends to win — your remaining
   time is added to the score. Run out of time and the ferry leaves without
   you; **Play Again** starts a fresh round.

## The seven differences

A missing seagull, a changed flag colour, an extra crate on the dock, a boat
stripe gone, a harbour-house window lit or unlit, the pier cat moved along
the dock, and a cloud shifted sideways. On every Play Again the game
reshuffles **which variant** of each difference appears (the flag may go
red→blue or blue→red, the cat sits at either end of its stretch of pier, the
cloud drifts either way, and so on), so a replayed round is a fresh hunt, not
a memorised one.

## Files

- `main.ts` — the hand-in program (Node 22, standard library only): copies
  `game/` and `screenshots/` to the output directory and writes
  `dossier.json` with `vendor/makefun-game.ts`.
- `game/index.html` — page, HUD (found counter, remaining, timer, score,
  hint button), title and end overlays.
- `game/style.css` — layout, ring markers, pulse and shake animations.
- `game/src/differences.js` — the seven differences, their click spots, and
  the scoring / timing constants.
- `game/src/scene.js` — draws one harbour panel as inline SVG; the changed
  panel applies the seven alterations.
- `game/src/state.js` — round state: found set, clock, hints, score, phases.
- `game/src/main.js` — wiring: clicks, timer, hints, end screens, and the
  `?shot=` screenshot staging used to capture the screenshots.
- `screenshots/` — real renders of the running game: a round with 3 of 7
  found (cover), the title screen, a fresh round, and the win screen.
- `vendor/makefun-game.ts` — the kit's dossier library, unchanged.

## Run it

Serve `game/` with any static file server and open it in a desktop browser —
it plays fully offline. To produce the hand-in output:

```sh
MAKEFUN_OUTPUT_DIR=/tmp/spotdiff-out node main.ts
```

Submission title: **Harbour Morning — Spot the Difference**
