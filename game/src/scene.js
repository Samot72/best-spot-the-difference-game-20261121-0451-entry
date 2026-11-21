// Draws one harbour panel as inline SVG. `changed` says whether this panel is
// the altered copy; `variants` (from differences.js) decides which way round
// each alteration appears this round, so replays reshuffle the hunt.

function cloudShape(x, y, scale) {
  return `<g transform="translate(${x} ${y}) scale(${scale})" fill="#ffffff" opacity="0.95">
    <ellipse cx="0" cy="0" rx="26" ry="12"/><ellipse cx="18" cy="-6" rx="20" ry="11"/>
    <ellipse cx="-19" cy="-4" rx="17" ry="9"/></g>`;
}

function seagullShape(x, y) {
  return `<g transform="translate(${x} ${y})" stroke="#33566e" stroke-width="3" fill="none" stroke-linecap="round">
    <path d="M-13 2 Q-6 -7 0 0 Q6 -7 13 2"/></g>`;
}

function lighthouseShape() {
  return `<g>
    <rect x="20" y="96" width="34" height="116" fill="#f4efe4"/>
    <rect x="20" y="122" width="34" height="16" fill="#d84f4f"/>
    <rect x="20" y="158" width="34" height="16" fill="#d84f4f"/>
    <rect x="14" y="84" width="46" height="12" rx="3" fill="#33566e"/>
    <rect x="29" y="66" width="16" height="18" fill="#ffd94d" stroke="#33566e" stroke-width="2"/>
    <path d="M37 52 L50 66 L24 66 Z" fill="#d84f4f"/>
    <rect x="31" y="182" width="12" height="30" rx="5" fill="#33566e"/>
  </g>`;
}

function harbourHouseShape(windowLit) {
  const windowFill = windowLit ? '#ffd94d' : '#2e4356';
  return `<g>
    <rect x="106" y="122" width="46" height="90" fill="#f7c873"/>
    <path d="M100 124 L129 100 L158 124 Z" fill="#a8573c"/>
    <rect x="120" y="128" width="16" height="18" fill="${windowFill}" stroke="#7a4a2b" stroke-width="2"/>
    <line x1="128" y1="128" x2="128" y2="146" stroke="#7a4a2b" stroke-width="2"/>
    <rect x="140" y="176" width="6" height="10" fill="#fff3d6"/>
    <rect x="110" y="176" width="6" height="10" fill="#fff3d6"/>
    <rect x="121" y="188" width="14" height="24" fill="#7a4a2b"/>
  </g>`;
}

function smallHouseShape(x, body, roof) {
  return `<g>
    <rect x="${x}" y="146" width="38" height="66" fill="${body}"/>
    <path d="M${x - 4} 148 L${x + 19} 128 L${x + 42} 148 Z" fill="${roof}"/>
    <rect x="${x + 13}" y="160" width="11" height="13" fill="#fff3d6"/>
    <rect x="${x + 12}" y="186" width="13" height="26" fill="#5b4632"/>
  </g>`;
}

function boatShape(flagColour, hasStripe) {
  const stripe = hasStripe
    ? '<path d="M162 196 L256 196 L248 206 L170 206 Z" fill="#ffffff" opacity="0.9"/>'
    : '';
  return `<g>
    <rect x="206" y="104" width="4" height="84" fill="#7a4a2b"/>
    <polygon points="212,94 212,112 234,103" fill="${flagColour}"/>
    <path d="M210 112 L210 178 L172 178 Z" fill="#fdf6e3"/>
    <path d="M216 118 L216 178 L250 178 Z" fill="#f2d492"/>
    <path d="M156 188 L262 188 L246 214 L172 214 Z" fill="#c8543c"/>
    ${stripe}
    <circle cx="188" cy="200" r="4" fill="#33566e"/><circle cx="228" cy="200" r="4" fill="#33566e"/>
  </g>`;
}

function crateShape(x, y, size, fill) {
  return `<g>
    <rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${fill}" stroke="#7a4a2b" stroke-width="2"/>
    <line x1="${x}" y1="${y}" x2="${x + size}" y2="${y + size}" stroke="#7a4a2b" stroke-width="2"/>
    <line x1="${x + size}" y1="${y}" x2="${x}" y2="${y + size}" stroke="#7a4a2b" stroke-width="2"/>
  </g>`;
}

function dockShape(hasExtraCrate) {
  const extra = hasExtraCrate ? crateShape(322, 180, 28, '#d9a05b') : '';
  return `<g>
    <rect x="0" y="236" width="400" height="14" fill="#9a6a44"/>
    <rect x="0" y="236" width="400" height="4" fill="#b98a5c"/>
    <rect x="30" y="250" width="8" height="26" fill="#7a4a2b"/>
    <rect x="190" y="250" width="8" height="26" fill="#7a4a2b"/>
    <rect x="352" y="250" width="8" height="26" fill="#7a4a2b"/>
    ${crateShape(306, 208, 28, '#c98f4e')}
    ${crateShape(336, 208, 28, '#b97f3e')}
    ${extra}
  </g>`;
}

function catShape(x) {
  return `<g transform="translate(${x} 236)" fill="#3a3f4a">
    <ellipse cx="0" cy="-8" rx="11" ry="8"/>
    <circle cx="10" cy="-16" r="6.5"/>
    <polygon points="5,-20 7,-27 11,-21"/><polygon points="12,-21 16,-26 16,-19"/>
    <path d="M-10 -6 Q-20 -4 -18 -14" stroke="#3a3f4a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <circle cx="12" cy="-17" r="1.2" fill="#ffd94d"/>
  </g>`;
}

function wavesShape() {
  return `<g stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.55" stroke-linecap="round">
    <path d="M20 286 Q34 280 48 286 T76 286"/><path d="M120 292 Q134 286 148 292 T176 292"/>
    <path d="M250 284 Q264 278 278 284 T306 284"/><path d="M322 294 Q336 288 350 294 T378 294"/>
  </g>`;
}

// Build the full SVG markup for one panel. The base panel is the true harbour;
// the changed panel applies exactly the seven alterations.
export function buildSceneSVG(changed, variants) {
  const showGull = changed ? variants.seagull : !variants.seagull;
  const flagColour = (changed !== variants.flag) ? '#2b6de2' : '#e23b3b';
  const hasExtraCrate = changed !== variants.crate ? true : false;
  const hasStripe = changed ? variants.stripe : !variants.stripe;
  const windowLit = changed ? variants.window : !variants.window;
  const catX = (changed !== variants.cat) ? 118 : 90;
  const cloudX = (changed !== variants.cloud) ? 306 : 258;
  return `
  <rect x="0" y="0" width="400" height="212" fill="#bfe3f2"/>
  <circle cx="52" cy="40" r="19" fill="#ffdf6b"/>
  ${cloudShape(88, 42, 1)}
  ${cloudShape(cloudX, 36, 0.9)}
  ${showGull ? seagullShape(322, 52) : ''}
  ${seagullShape(150, 30)}
  <rect x="0" y="206" width="400" height="94" fill="#4d90b8"/>
  ${lighthouseShape()}
  ${harbourHouseShape(windowLit)}
  ${smallHouseShape(268, '#e8eef2', '#33566e')}
  ${smallHouseShape(316, '#f2d8c9', '#8a5a44')}
  ${boatShape(flagColour, hasStripe)}
  ${dockShape(hasExtraCrate)}
  ${catShape(catX)}
  ${wavesShape()}`;
}
