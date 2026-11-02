import Color from 'colorjs.io';

const minimumContrast = 4.5;

/** Text roles share hues, but choose foregrounds against every ordinary UI surface. */
export function accentTextColors(palette: Record<string, string>): Record<string, string> {
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
  const intermediate = (seed: string, left: string, right: string) => {
    const color = new Color(seed).to('oklch');
    const neighbors = [left, right].map(hue => new Color(palette[`--${hue}-11`]).to('oklch'));
    // Sample the existing hue path; match its neighbors' text brightness and chroma.
    color.coords[0] = (neighbors[0].coords[0] + neighbors[1].coords[0]) / 2;
    color.coords[1] = Math.min(color.coords[1], (neighbors[0].coords[1] + neighbors[1].coords[1]) / 2);
    const target = new Color(palette['--gray-12']);
    for (let step = 0; step <= 50; step++) {
      const candidate = color.mix(target, step / 50, {space: 'oklch'}).toGamut({space: 'srgb'});
      if (readable(new Color(hex(candidate)))) return hex(candidate);
    }
    return hex(target);
  };
  const primaryTeal = () => {
    const base = new Color(accent('teal'));
    const dark = new Color(palette['--gray-1']).to('oklch').coords[0] < .5;
    const target = new Color(dark ? palette['--teal-12'] : '#fff');
    // Lift primary text toward a pale Teal; on light surfaces stop before contrast drops.
    const amount = dark ? .4 : .12;
    for (let step = 20; step >= 0; step--) {
      const candidate = base.mix(target, amount * step / 20, {space: 'srgb'});
      if (readable(new Color(hex(candidate)))) return hex(candidate);
    }
    return hex(base);
  };
  const greenish = palette['--lime-9'];
  return {
    body: safe(new Color(palette['--gray-12']), '--gray-12'),
    muted: safe(new Color(palette['--gray-11']), '--gray-12'),
    teal: primaryTeal(),
    amber: accent('amber'),
    greenish: intermediate(greenish, 'teal', 'amber'),
    gold: intermediate(palette['--gold-9'], 'amber', 'orange'),
    orange: accent('orange'),
    orangeHover: palette['--orange-12'],
  };
}

/** Shared web roles; application adapters assign their own semantic roles. */
export function textColorTokens(palette: Record<string, string>): Record<string, string> {
  const colors = accentTextColors(palette);
  return {
    '--arc-text-body': colors.body,
    '--arc-text-secondary': colors.muted,
    '--arc-text-quiet': colors.muted,
    '--arc-text-title': colors.teal,
    '--arc-text-section': colors.amber,
    '--arc-text-detail': colors.greenish,
    '--arc-text-active': colors.teal,
    '--arc-text-link': colors.orange,
    '--arc-text-link-hover': colors.orangeHover,
  };
}
