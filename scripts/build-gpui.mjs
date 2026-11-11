import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import Color from 'colorjs.io';
import {defaults, themeTokens} from '../src/palette.ts';
import {bevel, geometry, typography} from '../src/core/design.ts';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const out = new URL('../ports/gpui/', import.meta.url);
const MIN_TEXT_CONTRAST = 4.5;

const contrast = (a, b) => Color.contrast(new Color(a), new Color(b), 'WCAG21');

/** GPUI Kit theme colors for one mode, all taken from the shared Arcubic tokens. */
function gpuiColors(t) {
  const s = (family, step) => t[`--${family}-${step}`];
  const on = background => [s('gray', 1), s('gray', 12)]
    .sort((a, b) => contrast(b, background) - contrast(a, background))[0];
  // The lightest solid step of a family that still carries readable text.
  const solid = family => {
    const step = [9, 10, 11].find(n => contrast(on(s(family, n)), s(family, n)) >= MIN_TEXT_CONTRAST);
    if (!step) throw new Error(`${family} has no solid step with readable text`);
    return s(family, step);
  };
  const colors = {
    background: s('gray', 1),
    foreground: s('gray', 12),
    border: s('gray', 6),
    'input.border': s('gray', 7),
    ring: s('teal', 8),
    caret: s('teal', 11),
    'selection.background': t['--color-selection-background'],
    overlay: t['--color-overlay'],
    'window.border': s('gray', 6),

    'muted.background': s('gray', 3),
    'muted.foreground': s('gray', 11),
    'accent.background': s('teal', 3),
    'accent.foreground': s('teal', 12),
    'primary.background': solid('teal'),
    'primary.hover.background': s('teal', 10),
    'primary.active.background': s('teal', 10),
    'primary.foreground': on(solid('teal')),
    'secondary.background': s('gray', 3),
    'secondary.hover.background': s('gray', 4),
    'secondary.active.background': s('gray', 5),
    'secondary.foreground': s('gray', 12),

    'danger.background': solid('tomato'),
    'danger.foreground': on(solid('tomato')),
    'warning.background': solid('amber'),
    'warning.foreground': on(solid('amber')),
    'success.background': solid('green'),
    'success.foreground': on(solid('green')),
    'info.background': solid('blue'),
    'info.foreground': on(solid('blue')),

    'link.foreground': t['--arc-text-link'],
    'link.hover.foreground': t['--arc-text-link-hover'],
    'link.active.foreground': t['--arc-text-link'],

    'popover.background': t['--color-panel-solid'],
    'popover.foreground': s('gray', 12),
    'group_box.background': s('gray', 2),
    'group_box.foreground': s('gray', 12),
    'accordion.background': s('gray', 1),
    'description_list_label.background': s('gray', 2),
    'description_list_label.foreground': s('gray', 12),

    'list.background': s('gray', 1),
    'list.even.background': s('gray', 2),
    'list.head.background': s('gray', 2),
    'list.hover.background': s('gray', 3),
    'list.active.background': s('teal', 'a4'),
    'list.active.border': s('teal', 8),
    'table.background': s('gray', 1),
    'table.even.background': s('gray', 2),
    'table.head.background': s('gray', 2),
    'table.head.foreground': s('gray', 11),
    'table.hover.background': s('gray', 3),
    'table.active.background': s('teal', 'a4'),
    'table.active.border': s('teal', 8),
    'table.row.border': s('gray', 5),

    'sidebar.background': s('gray', 2),
    'sidebar.foreground': s('gray', 12),
    'sidebar.border': s('gray', 6),
    'sidebar.accent.background': s('gray', 4),
    'sidebar.accent.foreground': s('gray', 12),
    'sidebar.primary.background': s('teal', 9),
    'sidebar.primary.foreground': on(s('teal', 9)),
    'title_bar.background': s('gray', 2),
    'title_bar.border': s('gray', 6),
    'status_bar.background': s('gray', 2),
    'status_bar.border': s('gray', 6),

    'tab.background': '#00000000',
    'tab.foreground': s('gray', 11),
    'tab.active.background': s('gray', 1),
    'tab.active.foreground': s('gray', 12),
    'tab_bar.background': s('gray', 2),
    'tab_bar.segmented.background': s('gray', 3),

    'switch.background': s('gray', 7),
    'slider.bar.background': s('teal', 9),
    'slider.thumb.background': s('gray', 1),
    'progress_bar.background': s('teal', 9),
    'skeleton.background': s('gray', 3),
    'scrollbar.background': '#00000000',
    'scrollbar.thumb.background': s('gray', 'a8'),
    'scrollbar.thumb.hover.background': s('gray', 'a9'),
    drag_border: s('teal', 9),
    'drop_target.background': s('teal', 'a4'),

    'chart.1': s('teal', 9),
    'chart.2': s('amber', 9),
    'chart.3': s('orange', 9),
    'chart.4': s('blue', 9),
    'chart.5': s('green', 9),
    'chart.bullish': s('green', 9),
    'chart.bearish': s('tomato', 9),
    'chart.grid': s('gray', 5),

    'base.red': s('tomato', 11),
    'base.red.light': s('tomato', 9),
    'base.green': s('green', 11),
    'base.green.light': s('green', 9),
    'base.blue': s('blue', 11),
    'base.blue.light': s('blue', 9),
    'base.yellow': s('amber', 11),
    'base.yellow.light': s('amber', 9),
    'base.magenta': s('orange', 11),
    'base.magenta.light': s('orange', 9),
    'base.cyan': s('teal', 11),
    'base.cyan.light': s('teal', 9),
  };
  for (const [key, value] of Object.entries(colors)) {
    if (!value) throw new Error(`${key} has no Arcubic token`);
  }
  for (const [text, background] of [
    ['foreground', 'background'], ['muted.foreground', 'background'],
    ['primary.foreground', 'primary.background'], ['danger.foreground', 'danger.background'],
    ['warning.foreground', 'warning.background'], ['success.foreground', 'success.background'],
    ['info.foreground', 'info.background'],
    ['link.foreground', 'background'], ['popover.foreground', 'popover.background'],
  ]) {
    const ratio = contrast(colors[text], colors[background]);
    if (ratio < MIN_TEXT_CONTRAST) throw new Error(`${text} on ${background} is ${ratio.toFixed(2)}:1`);
  }
  return colors;
}

/** What GPUI Kit's theme format has no place for. Apps that know Arcubic read it; GPUI Kit
 * ignores it. Sizes are in pixels; the switch's sizes are ratios of its height. */
function arcubicExtras(t, mode) {
  const s = (family, step) => t[`--${family}-${step}`];
  const role = value => typeof value === 'string' ? value : s('gray', value.gray);
  const b = bevel[mode];
  const accent = 'teal';
  return {
    type: {caption: typography.caption, ui: typography.ui, body: typography.body, heading: typography.noteHeading},
    leading: {ui: typography.uiLineHeight, body: typography.bodyLineHeight},
    border: geometry.border,
    text: {
      body: t['--arc-text-body'],
      secondary: t['--arc-text-secondary'],
      title: t['--arc-text-title'],
      section: t['--arc-text-section'],
      detail: t['--arc-text-detail'],
      active: t['--arc-text-active'],
      link: t['--arc-text-link'],
      link_hover: t['--arc-text-link-hover'],
    },
    switch: {
      height: geometry.switchHeight,
      width_ratio: geometry.switchWidthRatio,
      rim_ratio: geometry.switchRimRatio,
      slant_ratio: geometry.switchSlantRatio,
      triangle_width_ratio: geometry.switchTriangleWidthRatio,
      triangle_height_ratio: geometry.switchTriangleHeightRatio,
      off: {
        rim: [role(b.high), s('gray', 6), role(b.low)],
        chamber: [s('gray', 2), s('gray', 4)],
        thumb: [s('gray', 12), s('gray', 10)],
      },
      on: {
        rim: [s(accent, b.accentHigh), s(accent, 8), s(accent, b.accentLow)],
        chamber: [s(accent, 2), s(accent, 4)],
        thumb: [s(accent, 11), s(accent, 9)],
      },
      focus: s(accent, 9),
    },
  };
}

const themeSet = {
  $schema: 'https://github.com/longbridge/gpui-kit/raw/refs/heads/main/.theme-schema.json',
  name: 'Arcubic',
  author: 'Trainvent',
  version: pkg.version,
  themes: ['light', 'dark'].map(mode => ({
    name: `Arcubic ${mode === 'light' ? 'Light' : 'Dark'}`,
    mode,
    // GPUI uses these names as-is, so the app embeds the fonts (see README).
    'font.family': 'Chakra Petch',
    'mono_font.family': 'Geist Mono',
    'font.size': typography.ui,
    'mono_font.size': typography.ui,
    radius: 0,
    'radius.lg': 0,
    colors: gpuiColors(themeTokens(defaults, mode)),
    arcubic: arcubicExtras(themeTokens(defaults, mode), mode),
  })),
};

mkdirSync(out, {recursive: true});
writeFileSync(new URL('arcubic.json', out), JSON.stringify(themeSet, null, 2) + '\n');
console.log('Built ports/gpui/arcubic.json');
