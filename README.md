# Prism theme lab

A local Radix Themes playground for the equal-hue-spacing experiment based on the logo: teal `#1DC9AC`, green `#68C91D`, and burnt orange `#C9501D`. “Prism” is a working name.

## Run

```sh
npm install
npm run dev
```

`npm run build` checks TypeScript and creates the production build in `dist/`.

Edit the three seed colors, switch appearance, click swatches to copy, and export both appearances as `prism-theme.css`. Source edits persist in browser local storage. Reset restores the experimental palette.

## Palette

`src/palette.ts` is the source of truth. It creates custom OKLCH tonal scales, retaining the exact source hex at step 9, and tints Radix gray neutrals toward teal. These are our own experimental scales, not the output of the official Radix custom palette generator. The page uses real `@radix-ui/themes` components.

The export supplies solid and alpha steps 1–12, contrast/surface/indicator/track variables, and gray/background tokens. Import it after Radix Themes CSS and use `accentColor="teal"`, `"amber"`, or `"orange"`. Contrast readings cover step 11 text on the page background; they do not certify every component/color pairing. The syntax card is a palette study, not an editor theme export.
