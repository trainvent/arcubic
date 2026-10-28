/** Platform-independent Arcubic defaults. Adapters map these roles to their UI. */
export const typography = {
 interface: "'Alliance No.2', ui-sans-serif, sans-serif",
 reading: "'Lora', Georgia, serif",
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
 switchTriangleWidthRatio: 13/22,
 switchTriangleHeightRatio: 11/22,
 switchSlantRatio: Math.tan(Math.PI/6),
};
export function designTokens(): Record<string,string> {
 return {
  '--arc-font-interface':typography.interface,'--arc-font-reading':typography.reading,'--arc-font-code':typography.code,
  '--arc-type-caption':`${typography.caption}px`,'--arc-type-ui':`${typography.ui}px`,'--arc-type-body':`${typography.body}px`,'--arc-type-heading':`${typography.noteHeading}px`,
  '--arc-leading-ui':String(typography.uiLineHeight),'--arc-leading-body':String(typography.bodyLineHeight),
  '--arc-radius':`${geometry.radius}px`,'--arc-border-width':`${geometry.border}px`,'--arc-switch-height':`${geometry.switchHeight}px`,
  ...Object.fromEntries(Object.entries(geometry).filter(([key])=>key.endsWith('Ratio')).map(([key,value])=>[`--arc-${key.replace(/[A-Z]/g,letter=>'-'+letter.toLowerCase())}`,String(value)])),
 };
}
