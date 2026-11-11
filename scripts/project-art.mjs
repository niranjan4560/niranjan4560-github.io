/**
 * On-brand abstract illustrations used as project previews until real screenshots exist.
 * Colours come from CSS custom properties, so they follow the active theme.
 */
const W = 640;
const H = 400;

const grid = () => {
  let lines = '';
  for (let x = 40; x < W; x += 40) lines += `M${x} 0V${H}`;
  for (let y = 40; y < H; y += 40) lines += `M0 ${y}H${W}`;
  return `<path class="art-grid" d="${lines}"/>`;
};

/** ROC-style curve over a plot — Disease Prediction. */
const chart = () => {
  const curve = 'M80 330 C 110 170, 200 110, 300 92 S 500 72, 560 70';
  return `${grid()}
  <path class="art-axis" d="M80 60V330H570"/>
  <path class="art-dash" d="M80 330 560 70"/>
  <path class="art-fill" d="${curve} V330 H80 Z"/>
  <path class="art-stroke" d="${curve}"/>
  <circle class="art-dot" cx="300" cy="92" r="6"/>`;
};

/** UI wireframe with flagged regions and a scan line — Dark Pattern Detector. */
const scan = () => `${grid()}
  <rect class="art-panel" x="120" y="54" width="400" height="292" rx="14"/>
  <rect class="art-block" x="148" y="84" width="180" height="16" rx="8"/>
  <rect class="art-block" x="148" y="116" width="300" height="10" rx="5"/>
  <rect class="art-block" x="148" y="136" width="260" height="10" rx="5"/>
  <rect class="art-flag" x="140" y="168" width="170" height="64" rx="10"/>
  <rect class="art-block" x="156" y="186" width="110" height="12" rx="6"/>
  <rect class="art-block" x="156" y="206" width="80" height="10" rx="5"/>
  <rect class="art-flag" x="328" y="168" width="170" height="64" rx="10"/>
  <rect class="art-block" x="344" y="186" width="120" height="12" rx="6"/>
  <rect class="art-cta" x="148" y="262" width="150" height="40" rx="20"/>
  <rect class="art-block" x="318" y="278" width="110" height="8" rx="4"/>
  <path class="art-scan" d="M120 246H520"/>
  <rect class="art-tag" x="430" y="140" width="98" height="26" rx="13"/>
  <text class="art-tag-text" x="479" y="158" text-anchor="middle">flagged</text>`;

/** Activity heatmap + trend — RepVault. */
const pulse = () => {
  let cells = '';
  const levels = [0.15, 0.35, 0.6, 0.9];
  for (let c = 0; c < 18; c++) {
    for (let r = 0; r < 5; r++) {
      const v = levels[(c * 7 + r * 3 + ((c * r) % 5)) % 4];
      cells += `<rect class="art-cell" x="${92 + c * 26}" y="${208 + r * 26}" width="20" height="20" rx="5" fill-opacity="${v}"/>`;
    }
  }
  const trend = 'M92 150 L150 132 L208 140 L266 110 L324 118 L382 88 L440 96 L498 66 L548 72';
  return `${grid()}
  <text class="art-label" x="92" y="56">Workouts synced</text>
  <path class="art-stroke" d="${trend}"/>
  <path class="art-fill" d="${trend} V178 H92 Z"/>
  <circle class="art-dot" cx="498" cy="66" r="6"/>
  ${cells}`;
};

const arts = { chart, scan, pulse };

export const projectArt = (kind, title) =>
  `<svg class="project-art" viewBox="0 0 ${W} ${H}" role="img" aria-label="Illustration for ${title} (screenshot coming soon)" preserveAspectRatio="xMidYMid slice">${arts[kind]()}</svg>`;
