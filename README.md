# Arcubic theme lab

A local Radix Themes playground for a cubic palette inspired by the logo.

## The formula

Arcubic samples a cubic arc through hue:

```text
hue(i) = start + (1 − i)³ × range
```

With `i` from 0 to 1, `start = 17.79°`, and `range = 152.09°`:

| i | Hue | Color |
| --- | --- | --- |
| 0 | 169.88° | Teal |
| 0.5 | 36.80125° | Amber |
| 1 | 17.79° | Burnt orange |

The implementation in `src/palette.ts` is:

```ts
export function hueForI(i: number): number {
  return 17.79 + 152.09 * (1 - i) ** 3;
}
```

Hue follows this curve. The default Soft profile uses teal S70/L42, amber S90/L58, and orange S82/L51. The Radix comparison profile uses saturation and lightness from the corresponding Radix step-9 colors. Supporting shades are generated separately in OKLCH.

## Run

```sh
npm install
npm run dev
```

`npm run build` checks TypeScript and creates the production build in `dist/`.

Compare Original (75% saturation / 45% lightness), Radix anchor values, and Soft (teal S70/L42, amber S90/L58, orange S82/L51) using the profile toggle. All three use the same cubic hues. The selected profile drives the palette, component preview, and CSS export. Soft is the default; reset returns to Soft. Manual color edits switch the profile label to Custom.

Edit the three seed colors, switch appearance, click swatches to copy, and export both appearances as `arcubic-theme.css`. Source edits persist in browser local storage. Reset restores the experimental palette.

## Palette

`src/palette.ts` is the source of truth. `hueForI(i)` calculates `17.79 + 152.09 * (1 - i) ** 3` over 0–1: teal → amber → orange. Anchor saturation and lightness come from the corresponding installed Radix step-9 colors, interpolated for intermediate samples. It creates custom OKLCH tonal scales, retaining the exact source hex at step 9, and tints Radix gray neutrals toward teal. These are our own experimental scales, not the output of the official Radix custom palette generator. The page uses real `@radix-ui/themes` components.

The export supplies solid and alpha steps 1–12, contrast/surface/indicator/track variables, and gray/background tokens. Import it after Radix Themes CSS and use `accentColor="teal"`, `"amber"`, or `"orange"`. Contrast readings cover step 11 text on the page background; they do not certify every component/color pairing. The syntax card is a palette study, not an editor theme export.
