// The seven differences of Harbour Morning. Coordinates live in one panel's
// local space (400 x 300); the same spot is checked on both panels, so a click
// on either picture can find a difference. `r` is the forgiving click radius.
export const DIFFERENCES = [
  { id: 'seagull', label: 'A seagull left the lamp post', x: 322, y: 52, r: 26 },
  { id: 'flag', label: 'The boat flag changed colour', x: 214, y: 92, r: 22 },
  { id: 'crate', label: 'An extra crate on the dock', x: 336, y: 208, r: 28 },
  { id: 'stripe', label: 'The boat lost its stripe', x: 208, y: 196, r: 30 },
  { id: 'window', label: 'A harbour house window went dark', x: 128, y: 138, r: 20 },
  { id: 'cat', label: 'The pier cat moved along the dock', x: 104, y: 232, r: 26 },
  { id: 'cloud', label: 'A cloud drifted sideways', x: 282, y: 36, r: 32 },
];

export const TOTAL_DIFFERENCES = DIFFERENCES.length;
export const GAME_SECONDS = 180;
export const MAX_HINTS = 3;
export const WRONG_CLICK_PENALTY_SECONDS = 5;
export const POINTS_PER_FIND = 100;
export const WRONG_CLICK_PENALTY_POINTS = 15;

// Pick, for every difference, which way round it appears this round. The left
// panel always shows the "base" harbour and the right panel the changed one,
// but the flip decides what the change looks like (flag red->blue or blue->red,
// cat sitting left or right, cloud shifted east or west, and so on), so a
// replay is not the same hunt memorised.
export function rollVariants(random) {
  const variants = {};
  for (const diff of DIFFERENCES) variants[diff.id] = random() < 0.5;
  return variants;
}

export function differenceAt(x, y, foundIds) {
  let best = null;
  let bestDistance = Infinity;
  for (const diff of DIFFERENCES) {
    if (foundIds.has(diff.id)) continue;
    const distance = Math.hypot(x - diff.x, y - diff.y);
    if (distance <= diff.r && distance < bestDistance) {
      best = diff;
      bestDistance = distance;
    }
  }
  return best;
}
