// Round state for Harbour Morning: which differences are found, the clock,
// hints and score. Pure bookkeeping — the DOM lives in main.js.
import {
  GAME_SECONDS, MAX_HINTS, POINTS_PER_FIND, TOTAL_DIFFERENCES,
  WRONG_CLICK_PENALTY_POINTS, WRONG_CLICK_PENALTY_SECONDS, rollVariants,
} from './differences.js';

export const PHASE_TITLE = 'title';
export const PHASE_PLAYING = 'playing';
export const PHASE_WON = 'won';
export const PHASE_LOST = 'lost';

export function createRound(random) {
  return {
    phase: PHASE_TITLE,
    variants: rollVariants(random),
    found: new Set(),
    secondsLeft: GAME_SECONDS,
    hintsLeft: MAX_HINTS,
    score: 0,
    wrongClicks: 0,
    hintedId: null,
  };
}

export function startRound(round) {
  round.phase = PHASE_PLAYING;
  return round;
}

export function markFound(round, diff) {
  if (round.found.has(diff.id)) return false;
  round.found.add(diff.id);
  round.score += POINTS_PER_FIND;
  if (round.found.size >= TOTAL_DIFFERENCES) round.phase = PHASE_WON;
  return true;
}

export function applyWrongClick(round) {
  round.wrongClicks += 1;
  round.score = Math.max(0, round.score - WRONG_CLICK_PENALTY_POINTS);
  round.secondsLeft = Math.max(0, round.secondsLeft - WRONG_CLICK_PENALTY_SECONDS);
  if (round.secondsLeft <= 0) round.phase = PHASE_LOST;
}

export function tickSecond(round) {
  if (round.phase !== PHASE_PLAYING) return;
  round.secondsLeft -= 1;
  if (round.secondsLeft <= 0) {
    round.secondsLeft = 0;
    round.phase = PHASE_LOST;
  }
}

export function spendHint(round, remainingDiffs) {
  if (round.hintsLeft <= 0 || remainingDiffs.length === 0) return null;
  round.hintsLeft -= 1;
  const pick = remainingDiffs[Math.floor(Math.random() * remainingDiffs.length)];
  round.hintedId = pick.id;
  return pick;
}

export function scoreWithTimeBonus(round) {
  return round.score + (round.phase === PHASE_WON ? round.secondsLeft * 2 : 0);
}

export function formatClock(seconds) {
  const safe = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(safe / 60);
  const rest = String(safe % 60).padStart(2, '0');
  return `${minutes}:${rest}`;
}
