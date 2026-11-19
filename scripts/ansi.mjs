import Color from 'colorjs.io';
import * as radix from '@radix-ui/colors';

const MIN_TEXT_CONTRAST = 4.5;
const scale = (name, mode) => radix[mode === 'dark' ? `${name}Dark` : name];

/** The 16 ANSI colours for one mode, all readable on the terminal background (gray 1).
 * Slots 0–7 are normal, 8–15 bright. Green and red are status colours, blue is for links;
 * teal, amber and orange carry the identity. */
export function ansiColors(tokens, mode) {
  const background = tokens['--gray-1'];
  const ratio = value => Color.contrast(new Color(value), new Color(background), 'WCAG21');
  // The first of the given Radix steps that reads on the background.
  const radixText = (name, steps = [10, 11]) => {
    const values = steps.map(step => scale(name, mode)[`${name}${step}`]);
    return values.find(value => ratio(value) >= MIN_TEXT_CONTRAST) ?? values.at(-1);
  };
  const arcubicText = hue => ratio(tokens[`--${hue}-11`]) >= MIN_TEXT_CONTRAST ? tokens[`--${hue}-11`] : tokens[`--${hue}-12`];
  const colors = [
    tokens['--gray-5'], radixText('tomato'), radixText('green'), arcubicText('amber'),
    radixText('blue'), radixText('purple'), arcubicText('teal'), tokens['--gray-11'],
    tokens['--gray-11'], arcubicText('orange'), radixText('green', [12]), arcubicText('amber'),
    radixText('blue', [11, 12]), radixText('purple', [11, 12]), radixText('teal', [11, 12]), tokens['--gray-12'],
  ];
  // Slot 0 is the "black" that sits on the background; every other slot carries text.
  for (let i = 1; i < 16; i++) {
    if (ratio(colors[i]) < MIN_TEXT_CONTRAST) throw new Error(`${mode} ANSI ${i} fails text contrast`);
  }
  return colors;
}
