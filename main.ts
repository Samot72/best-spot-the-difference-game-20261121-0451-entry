// Harbour Morning — Spot the Difference: the hand-in program (Node 22,
// standard library only). It copies game/ and screenshots/ from beside this
// file to the output directory and writes dossier.json there with the
// vendored make.fun library, exactly as the kit's starter pattern prescribes.
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   MAKEFUN_OUTPUT_DIR=/tmp/spotdiff-out node main.ts

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

// The gate's own caps, named so the hand-in refuses nothing the scorer would
// accept and accepts nothing it would refuse: 4 screenshots of at most
// 256 KiB, at most 993 game files / 48 MiB, paths of at most 1000 bytes, and
// the dossier text capped at 160 KiB.
const DOSSIER_LIMITS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};

writeFileSync(join(out, 'dossier.json'), buildDossier(out, DOSSIER_LIMITS));
