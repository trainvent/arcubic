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
export function designTokens(): Record<string,string> {
 return {
  '--arc-font-interface':typography.interface,'--arc-font-reading':typography.reading,'--arc-font-code':typography.code,
  '--arc-type-caption':`${typography.caption}px`,'--arc-type-ui':`${typography.ui}px`,'--arc-type-body':`${typography.body}px`,'--arc-type-heading':`${typography.noteHeading}px`,
  '--arc-leading-ui':String(typography.uiLineHeight),'--arc-leading-body':String(typography.bodyLineHeight),
  '--arc-tab-strip-height':`${documentTabs.stripHeight}px`,'--arc-tab-height':`${documentTabs.tabHeight}px`,'--arc-tab-inset':`${documentTabInset}px`,
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
 durationSeconds: 1.8,
} as const;
/** The triangle fuse as a CSS `url()`: the faint route plus a dash travelling along it. Used as a
 * mask, so the loader takes the colour of whatever it replaces. `animated: false` keeps the
 * whole route lit, for reduced motion. */
export function loaderMask({animated}: {animated: boolean}) {
 const dash = loader.fuseDash;
 const fuse = animated
  ? `<path d='${loader.route}' pathLength='100' stroke-width='60' stroke-dasharray='${dash} ${100 - dash}' stroke-dashoffset='100'><animate attributeName='stroke-dashoffset' from='100' to='0' dur='${loader.durationSeconds}s' repeatCount='indefinite'/></path>`
  : `<path d='${loader.route}' stroke-width='60'/>`;
 const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${loader.viewBox}' fill='none' stroke='#000' stroke-linecap='round' stroke-linejoin='round'><path d='${loader.route}' stroke-width='44' opacity='.35'/>${fuse}</svg>`;
 return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
