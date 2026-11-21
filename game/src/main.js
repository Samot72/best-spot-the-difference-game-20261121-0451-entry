// Harbour Morning — Spot the Difference: wires the harbour scenes, clicks,
// timer, hints and end screens together. Played entirely with the mouse.
import { DIFFERENCES, differenceAt } from './differences.js';
import { buildSceneSVG } from './scene.js';
import {
  PHASE_LOST, PHASE_PLAYING, PHASE_TITLE, PHASE_WON, applyWrongClick,
  createRound, formatClock, markFound, scoreWithTimeBonus, spendHint,
  startRound, tickSecond,
} from './state.js';

const leftScene = document.getElementById('scene-left');
const rightScene = document.getElementById('scene-right');
const leftPanel = document.getElementById('panel-left');
const rightPanel = document.getElementById('panel-right');
const foundLabel = document.getElementById('found-count');
const remainLabel = document.getElementById('remain-count');
const timerLabel = document.getElementById('timer');
const scoreLabel = document.getElementById('score');
const hintButton = document.getElementById('hint-button');
const messageLabel = document.getElementById('message');
const titleOverlay = document.getElementById('title-overlay');
const endOverlay = document.getElementById('end-overlay');
const endTitle = document.getElementById('end-title');
const endText = document.getElementById('end-text');
const startButton = document.getElementById('start-button');
const againButton = document.getElementById('again-button');

const params = new URLSearchParams(location.search);
const shotName = params.get('shot');
let round = createRound(shotName ? () => 0.9 : Math.random);
let timerId = null;
let pulseTimers = [];

function renderScenes() {
  leftScene.innerHTML = buildSceneSVG(false, round.variants);
  rightScene.innerHTML = buildSceneSVG(true, round.variants);
}

function markerElement(diff, kind) {
  const el = document.createElement('div');
  el.className = `marker ${kind}`;
  el.style.left = `${(diff.x / 400) * 100}%`;
  el.style.top = `${(diff.y / 300) * 100}%`;
  el.dataset.diffId = diff.id;
  return el;
}

function clearMarkers() {
  for (const panel of [leftPanel, rightPanel]) {
    panel.querySelectorAll('.marker').forEach((el) => el.remove());
  }
}

function drawFoundMarkers() {
  clearMarkers();
  for (const diff of DIFFERENCES) {
    if (!round.found.has(diff.id)) continue;
    leftPanel.appendChild(markerElement(diff, 'found'));
    rightPanel.appendChild(markerElement(diff, 'found'));
  }
}

function pulseHint(diff) {
  const marks = [];
  for (const panel of [leftPanel, rightPanel]) {
    const el = markerElement(diff, 'hint');
    panel.appendChild(el);
    marks.push(el);
  }
  const timer = setTimeout(() => marks.forEach((el) => el.remove()), 1700);
  pulseTimers.push(timer);
}

function refreshHud(message) {
  foundLabel.textContent = `${round.found.size} / ${DIFFERENCES.length} found`;
  remainLabel.textContent = `${DIFFERENCES.length - round.found.size} to go`;
  timerLabel.textContent = formatClock(round.secondsLeft);
  timerLabel.classList.toggle('urgent', round.secondsLeft <= 30 && round.phase === PHASE_PLAYING);
  scoreLabel.textContent = `Score ${scoreWithTimeBonus(round)}`;
  hintButton.textContent = `Hint (${round.hintsLeft} left)`;
  hintButton.disabled = round.hintsLeft <= 0 || round.phase !== PHASE_PLAYING;
  if (message !== undefined) messageLabel.textContent = message;
}

function showEnd() {
  const won = round.phase === PHASE_WON;
  endTitle.textContent = won ? 'The ferry can leave — harbour restored!' : 'The ferry left without you…';
  endText.textContent = won
    ? `All 7 differences found with ${formatClock(round.secondsLeft)} to spare. Final score ${scoreWithTimeBonus(round)}.`
    : `Time ran out with ${round.found.size} of 7 differences found. The harbour stays slightly wrong.`;
  againButton.textContent = won ? 'Play Again' : 'Try Again';
  endOverlay.classList.remove('hidden');
}

function stopTimer() {
  if (timerId !== null) clearInterval(timerId);
  timerId = null;
}

function beginTimer() {
  stopTimer();
  timerId = setInterval(() => {
    tickSecond(round);
    refreshHud();
    if (round.phase === PHASE_LOST) {
      stopTimer();
      showEnd();
    }
  }, 1000);
}

function beginPlay(message) {
  titleOverlay.classList.add('hidden');
  endOverlay.classList.add('hidden');
  startRound(round);
  renderScenes();
  drawFoundMarkers();
  refreshHud(message ?? 'Click a difference in either picture.');
  beginTimer();
}

function newRound() {
  pulseTimers.forEach(clearTimeout);
  pulseTimers = [];
  round = createRound(Math.random);
  beginPlay('A fresh morning, freshly wrong in seven small ways.');
}

function panelLocalCoords(event, panel) {
  const rect = panel.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * 400,
    y: ((event.clientY - rect.top) / rect.height) * 300,
  };
}

function handlePanelClick(event) {
  if (round.phase !== PHASE_PLAYING) return;
  const panel = event.currentTarget;
  const { x, y } = panelLocalCoords(event, panel);
  const diff = differenceAt(x, y, round.found);
  if (diff) {
    markFound(round, diff);
    drawFoundMarkers();
    const justFound = panel.querySelectorAll('.marker.found');
    justFound.forEach((el) => el.classList.add('pulse'));
    refreshHud(`Found: ${diff.label}.`);
    if (round.phase === PHASE_WON) {
      stopTimer();
      refreshHud(`Found: ${diff.label}.`);
      showEnd();
    }
  } else {
    panel.classList.remove('shake');
    void panel.offsetWidth;
    panel.classList.add('shake');
    applyWrongClick(round);
    refreshHud('Not a difference — the clock loses 5 seconds.');
    if (round.phase === PHASE_LOST) {
      stopTimer();
      showEnd();
    }
  }
}

function handleHint() {
  if (round.phase !== PHASE_PLAYING) return;
  const remaining = DIFFERENCES.filter((diff) => !round.found.has(diff.id));
  const pick = spendHint(round, remaining);
  if (pick) {
    pulseHint(pick);
    refreshHud('Somewhere inside the glowing ring…');
  }
}

leftPanel.addEventListener('click', handlePanelClick);
rightPanel.addEventListener('click', handlePanelClick);
hintButton.addEventListener('click', handleHint);
startButton.addEventListener('click', () => beginPlay());
againButton.addEventListener('click', newRound);

// Screenshot staging: ?shot=title|mid|found|win renders a real state of the
// running game (same scenes, markers and overlays as play) for the maker's
// screenshots. It never changes how a normal visit plays.
function stageShot(name) {
  if (name === 'mid' || name === 'found' || name === 'win') {
    startRound(round);
    titleOverlay.classList.add('hidden');
    if (name === 'found' || name === 'win') {
      const picks = name === 'win'
        ? DIFFERENCES
        : DIFFERENCES.filter((diff) => ['seagull', 'flag', 'window'].includes(diff.id));
      for (const diff of picks) round.found.add(diff.id);
      round.score = picks.length * 100;
    }
    if (name === 'mid') round.secondsLeft = 161;
    if (name === 'found') round.secondsLeft = 137;
    if (name === 'win') {
      round.secondsLeft = 74;
      round.phase = PHASE_WON;
    }
    renderScenes();
    drawFoundMarkers();
    refreshHud(name === 'win' ? 'Every difference found!' : undefined);
    if (name === 'win') showEnd();
  } else {
    renderScenes();
    refreshHud('Find the 7 differences before the ferry leaves.');
  }
}

if (shotName) stageShot(shotName);
else {
  renderScenes();
  refreshHud('Find the 7 differences before the ferry leaves.');
}
export { stageShot };
