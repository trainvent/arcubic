/** Platform-independent Arcubic defaults. Adapters map these roles to their UI. */
export const typography = {
 interface: "'Chakra Petch', ui-sans-serif, sans-serif",
 /** Lora where it is loaded or installed, otherwise the closest system serif on each platform. */
 reading: "'Lora', Charter, 'Bitstream Charter', 'Sitka Text', Cambria, Georgia, serif",
 code: "'Geist Mono', ui-monospace, monospace",
 caption: 11, ui: 13, body: 15, noteHeading: 24,
 uiLineHeight: 1.4, bodyLineHeight: 1.65,
};
export const geometry = {
 radius: 0, border: 1,
 switchHeight: 22,
 switchWidthRatio: 42/22,
 switchRimRatio: 2/22,
 switchThumbRatio: 18/22,
 switchInsetRatio: 4/22,
 switchTravelRatio: 16/22,
 switchTriangleWidthRatio: 16/22,
 switchTriangleHeightRatio: 16/22*Math.sqrt(3)/2,
 switchSlantRatio: Math.tan(Math.PI/6),
};
/** Selected-tab marker for narrow tabs and menu bar titles: an accent tint with a base line in the
 * accent. Values are steps of the accent scale. */
export const selectedTab = {fill: 3, hoverFill: 4, edge: 8} as const;
/** Document tab strip, shared by every app adapter. VS Code fixes the strip height itself; the
 * tabs leave the same gap above them and before the first tab. */
export const documentTabs = {stripHeight: 31, tabHeight: 28};
export const documentTabInset = documentTabs.stripHeight - documentTabs.tabHeight;
/** Code surfaces, as steps of the neutral scale. Inline code sits a step above the block fill so it
 * stays visible on the near-white light background; both share the block edge. */
export const codeSurface = {inlineFill: 3, blockFill: 2, edge: 6} as const;
export function designTokens(): Record<string,string> {
 return {
  '--arc-font-interface':typography.interface,'--arc-font-reading':typography.reading,'--arc-font-code':typography.code,
  '--arc-type-caption':`${typography.caption}px`,'--arc-type-ui':`${typography.ui}px`,'--arc-type-body':`${typography.body}px`,'--arc-type-heading':`${typography.noteHeading}px`,
  '--arc-leading-ui':String(typography.uiLineHeight),'--arc-leading-body':String(typography.bodyLineHeight),
  '--arc-tab-strip-height':`${documentTabs.stripHeight}px`,'--arc-tab-height':`${documentTabs.tabHeight}px`,'--arc-tab-inset':`${documentTabInset}px`,
  '--arc-code-fill':`var(--gray-${codeSurface.inlineFill})`,'--arc-code-block-fill':`var(--gray-${codeSurface.blockFill})`,'--arc-code-edge':`var(--gray-${codeSurface.edge})`,
  '--arc-radius':`${geometry.radius}px`,'--arc-border-width':`${geometry.border}px`,'--arc-switch-height':`${geometry.switchHeight}px`,
  ...Object.fromEntries(Object.entries(geometry).filter(([key])=>key.endsWith('Ratio')).map(([key,value])=>[`--arc-${key.replace(/[A-Z]/g,letter=>'-'+letter.toLowerCase())}`,String(value)])),
 };
}
/** Raised and sunken edges of controls such as the switch. Gray values are steps of the neutral
 * scale; accent values are steps of the control's accent family. Mirrors `.arcubic-ui` in
 * src/components/base.css. */
export const bevel = {
 dark: {high: {gray: 7}, low: {gray: 1}, face: {gray: 4}, accentHigh: 11, accentLow: 7},
 light: {high: '#fff', low: {gray: 8}, face: {gray: 3}, accentHigh: 6, accentLow: 10},
} as const;
/** Triangle portion of the Le Logo continuous fuse route (no enclosing circle), traced by every
 * Arcubic loader. The fuse is a dash of `fuseDash` out of a path length of 100. */
export const loader = {
 viewBox: '20 -40 860 760',
 route: 'M450 9.45 L548.3474 179.7927 L831.5275 670.275 L634.8327 670.275 L68.4725 670.275 L166.8199 499.9323 L514.1917 626.3653 L634.8327 670.275 L570.641 306.2257 L548.3474 179.7927 L265.1673 417.409 L343.9101 388.749 L570.641 306.2257 L556.0899 388.749 L514.1917 626.3653 L450 572.502 L556.0899 388.749 L343.9101 388.749 L450 572.502 L265.1673 417.409 L166.8199 499.9323 L450 9.45',
 fuseDash: 26,
 strokeWidth: 60,
 durationSeconds: 1.8,
} as const;
/** The Continuous trace with its enclosing circle, without the faint guide the Flutter
 * `TriangleRefreshIndicator` draws: a moving dash of `dash` (share of the route) and an arrowhead on
 * its leading edge. The arrow is drawn pointing along +x and is aligned to the route. */
export const syncTrace = {
 viewBox: '-70 -70 1040 1040',
 route: `M450 9.45 A445 445 0 0 1 831.5275 670.275 A445 445 0 0 1 68.4725 670.275 A445 445 0 0 1 450 9.45 ${loader.route.replace(/^M450 9\.45 /, 'L450 9.45 ')}`,
 dash: 0.26,
 strokeWidth: 60,
 arrow: '100,0 -50,82 -50,-82',
 durationSeconds: 1.8,
} as const;
/** Determinate loader after the Flutter Trace fuze: the triangle route draws itself from its start
 * while its leading end sizzles. Sizes are in the 900-unit route space. */
export const fuseProgress = {
 viewBox: '0 0 900 900',
 strokeWidth: 41,
 /** Share of the route at the burning end that sizzles. */
 sizzleLength: 4.5,
} as const;
/** The triangle fuse as a CSS `url()`: a dash travelling along the route. Used as a
 * mask, so the loader takes the colour of whatever it replaces. `animated: false` keeps the
 * whole route lit, for reduced motion. */
export function loaderMask({animated}: {animated: boolean}) {
 const dash = loader.fuseDash;
 const fuse = animated
  ? `<path d='${loader.route}' pathLength='100' stroke-width='${loader.strokeWidth}' stroke-dasharray='${dash} ${100 - dash}' stroke-dashoffset='100'><animate attributeName='stroke-dashoffset' from='100' to='0' dur='${loader.durationSeconds}s' repeatCount='indefinite'/></path>`
  : `<path d='${loader.route}' stroke-width='${loader.strokeWidth}'/>`;
 const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${loader.viewBox}' fill='none' stroke='#000' stroke-linecap='round' stroke-linejoin='round'>${fuse}</svg>`;
 return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
/** The sync trace as a CSS mask `url()`, for themes without components. `animated: false` is its
 * first frame: the dash at the start of the route, the arrow on its leading edge. */
export function syncMask({animated}: {animated: boolean}) {
 const {dash, durationSeconds, route} = syncTrace;
 const length = dash * 100;
 const timing = `dur='${durationSeconds}s' repeatCount='indefinite'`;
 const dashMotion = animated ? `<animate attributeName='stroke-dashoffset' from='100' to='0' ${timing}/>` : '';
 const arrowMotion = animated
  ? `<animateMotion path='${route}' rotate='auto' calcMode='linear' keyPoints='${dash};1;0;${dash}' keyTimes='0;${1 - dash};${1 - dash};1' ${timing}/>`
  : `<animateMotion path='${route}' rotate='auto' calcMode='linear' keyPoints='${dash};${dash}' keyTimes='0;1' dur='1s' fill='freeze'/>`;
 const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${syncTrace.viewBox}' fill='none' stroke='#000' stroke-linecap='round' stroke-linejoin='round'><path d='${route}' pathLength='100' stroke-width='${syncTrace.strokeWidth}' stroke-dasharray='${length} ${100 - length}' stroke-dashoffset='100'>${dashMotion}</path><polygon points='${syncTrace.arrow}' fill='#000' stroke='none'>${arrowMotion}</polygon></svg>`;
 return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
