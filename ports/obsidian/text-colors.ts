import Color from 'colorjs.io';

const minimumContrast = 4.5;

/** Text roles share hues, but choose foregrounds against every ordinary UI surface. */
export function textColorTokens(palette: Record<string, string>): Record<string, string> {
  const backgrounds = [...[1, 2, 3, 4].map(step => palette[`--gray-${step}`]), palette['--teal-3'], palette['--teal-4']].map(color => new Color(color));
  const readable = (color: Color) => backgrounds.every(background =>
    Color.contrast(color, background, 'WCAG21') >= minimumContrast);
  const hex = (color: Color) => color.to('srgb').toString({format: 'hex'});
  const mix = (first: string, second: string, amount: number) =>
    new Color(palette[first]).mix(new Color(palette[second]), amount, {space: 'srgb'});
  const safe = (candidate: Color, fallback: string) => hex(readable(candidate) ? candidate : new Color(palette[fallback]));
  const accent = (hue: string) => {
    // Darken only as far as contrast needs; keep the recognizable accent hue.
    for (let step = 0; step <= 20; step++) {
      const candidate = mix(`--${hue}-11`, `--${hue}-12`, step / 20);
      if (readable(new Color(hex(candidate)))) return hex(candidate);
    }
    return palette[`--${hue}-12`];
  };
  const body = mix('--gray-12', '--gray-11', .28).mix(new Color(palette['--teal-12']), .1, {space: 'srgb'});
  return {
    '--arc-text-body': safe(body, '--gray-12'),
    '--arc-text-secondary': safe(mix('--gray-11', '--teal-12', .18), '--gray-12'),
    '--arc-text-quiet': safe(mix('--gray-11', '--gray-10', .18), '--gray-11'),
    '--arc-text-title': accent('orange'),
    '--arc-text-section': accent('amber'),
    '--arc-text-detail': accent('teal'),
    '--arc-text-active': accent('orange'),
    '--arc-text-link': accent('teal'),
  };
}
