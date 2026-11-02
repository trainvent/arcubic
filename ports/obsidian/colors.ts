import Color from 'colorjs.io';
import {accentTextColors} from '../../src/core/text-colors.ts';

/** These five assignments control the entire Obsidian adapter, including solid tones. */
export const obsidianAccentFamilies = {
  primary: 'teal', section: 'orange', detail: 'amber', emphasis: 'orange', link: 'blue',
} as const;

/** Obsidian owns this assignment; shared web semantic roles never enter the adapter. */
export function obsidianColors(palette: Record<string, string>): Record<string, string> {
  const colors = accentTextColors(palette);
  const families = obsidianAccentFamilies;
  const accent = (family: string) => colors[family];
  const contrast = (a: string, b: string) => Color.contrast(new Color(a), new Color(b), 'WCAG21');
  const on = (background: string) => [palette['--gray-1'], palette['--gray-12']]
    .sort((a, b) => contrast(b, background) - contrast(a, background))[0];
  const result: Record<string, string> = {
    '--arc-obs-primary': accent(families.primary),
    '--arc-obs-detail': accent(families.detail),
    '--arc-obs-section': accent(families.section),
    '--arc-obs-emphasis': accent(families.emphasis),
    '--arc-obs-link': accent(families.link),
    '--arc-obs-link-hover': palette[`--${families.link}-12`],
    '--arc-obs-body': colors.body,
    '--arc-obs-muted': colors.muted,
    '--arc-obs-faint': colors.muted,
    '--arc-obs-on-primary': on(palette[`--${families.primary}-9`]),
    '--arc-obs-on-checkbox': on(accent(families.detail)),
    '--arc-obs-error': palette['--color-error-text'],
    '--arc-obs-success': palette['--color-success-text'],
    '--arc-obs-on-danger': on(palette['--tomato-9']),
  };
  for (const [role, family] of Object.entries({...families, danger: 'tomato'})) {
    for (let step = 1; step <= 12; step++) result[`--arc-obs-${role}-${step}`] = palette[`--${family}-${step}`];
  }
  for (const step of [4, 5]) result[`--arc-obs-primary-a${step}`] = palette[`--${families.primary}-a${step}`];
  const callouts = {
    note: accent(families.primary), summary: accent(families.emphasis), question: accent(families.section),
    warning: colors.orange, success: palette['--green-11'], error: palette['--tomato-11'],
    example: accent(families.link), quote: colors.muted,
  };
  const base = new Color(palette['--gray-1']);
  for (const [role, color] of Object.entries(callouts)) {
    result[`--arc-obs-callout-${role}`] = color;
    const background = base.mix(new Color(color), .1, {space: 'srgb'});
    result[`--arc-obs-callout-${role}-text`] = contrast(color, background.toString()) >= 4.5 ? color : colors.body;
  }
  return result;
}
