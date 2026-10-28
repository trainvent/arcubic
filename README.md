# Arcubic theme lab

<img src="public/arcubic.svg" alt="Arcubic cubic curve with three colored sample points" width="128"/>

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

Hue follows this curve. The Soft profile uses teal S70/L42, amber S90/L58, and orange S82/L51. The default Radix profile uses hue, saturation, and lightness from the corresponding Radix step-9 colors. Supporting shades are generated separately in OKLCH.

### Five-point alternative: monotone cubic spline

An experimental extension alongside the three-point cubic, not the active palette generator. A shape-preserving cubic spline (PCHIP) passes through five explicit hue anchors:

| i | Hue (degrees, approximate) | Color |
| --- | --- | --- |
| 0 | 0 | Red |
| 0.25 | 22.8 | Radix orange |
| 0.5 | 42.1 | Radix amber |
| 0.75 | 120 | Green |
| 1 | 173.1 | Radix teal |

Orange, amber, and teal are rounded representations of the existing Radix hues; an implementation should derive their exact HSL hues from the installed colors. Red and green are proposed additional hue anchors, not the current Tomato and Green semantic scales.

For a segment between anchors `x[j]` and `x[j+1]`, let `d = x[j+1] − x[j]` and `u = (i − x[j]) / d`. The cubic Hermite form is:

```text
hue(i) = (2u³ − 3u² + 1) × h[j]
       + (u³ − 2u² + u) × d × m[j]
       + (−2u³ + 3u²) × h[j+1]
       + (u³ − u²) × d × m[j+1]
```

PCHIP chooses the slopes `m` to preserve monotonicity without overshooting. The segments join with continuous first derivatives. Unlike the main formula, this curve encodes five chosen anchors rather than deriving them from only a start, range, and exponent.

A reference implementation in Python (requires SciPy; documentation only):

```python
from scipy.interpolate import PchipInterpolator

hue_curve = PchipInterpolator(
    [0, 0.25, 0.5, 0.75, 1],
    [0, 22.8, 42.1, 120, 173.1],
    extrapolate=False,
)

def hue_for_i_five_point(i):
    if not 0 <= i <= 1:
        raise ValueError("i must be between 0 and 1")
    return float(hue_curve(i))
```

Sampling `i = 0, 0.25, 0.5, 0.75, 1` returns the five anchors. This alternative runs red → teal; use `hue_for_i_five_point(1 - i)` to follow the main cubic's teal → red direction. Saturation and lightness would be specified separately.

## Run

```sh
npm install
npm run dev
```

`npm run build` checks TypeScript and creates the production build in `dist/`.

Compare Original (75% saturation / 45% lightness), Radix anchor values, and Soft (teal S70/L42, amber S90/L58, orange S82/L51) using the profile toggle. Original and Soft use the cubic hues; Radix uses its exact native step-9 colors. The selected profile drives the palette, component preview, and CSS export. Radix is the default; reset returns to Radix. Manual color edits switch the profile label to Custom.

Edit the three seed colors, switch appearance, click swatches to copy, and export both appearances as `arcubic-theme.css`. Source edits persist in browser local storage. Reset restores the experimental palette.

## Palette

`src/palette.ts` is the source of truth. `hueForI(i)` calculates `17.79 + 152.09 * (1 - i) ** 3` over 0–1: teal → amber → orange. Anchor saturation and lightness come from the corresponding installed Radix step-9 colors, interpolated for intermediate samples. The default profile uses the full Radix Teal, Amber, and Orange scales, including their native alpha variants and Radix Themes surface/contrast tokens. Original, Soft, and edited anchors use custom OKLCH tonal scales, retaining the exact source hex at step 9. It uses the exact Radix Sage neutral scale for backgrounds, surfaces, borders, and neutral text in both appearances. The custom comparison scales are experimental; the default Radix scales come directly from the installed packages. The page uses real `@radix-ui/themes` components.

The export supplies solid and alpha steps 1–12, contrast/surface/indicator/track variables, and gray/background tokens. Import it after Radix Themes CSS and use `accentColor="teal"`, `"amber"`, or `"orange"`. Accent text chooses step 11 if it meets WCAG AA 4.5:1 on its actual page or panel background, otherwise step 12, via semantic `--teal-text`, `--amber-text`, and `--orange-text` tokens. Radix scale values and solid-button contrast tokens remain intact. Contrast readings cover the selected text step on the actual Sage panel surface; they do not certify every component/color pairing. The syntax card is a palette study, not an editor theme export.

The light page canvas is `#FEFFFF`; filled tiles use Sage step 2 (`#F7F9F8`). Dark mode keeps Sage step 1 for the canvas. Foreground selection and contrast checks use each actual surface.

## Semantic colors

Teal is the primary accent, amber handles warnings, and orange remains a secondary accent. Success uses the full Radix Green scale; errors use the full Tomato scale. Both include native solid and alpha steps in the CSS export.

`--color-success-*`, `--color-warning-*`, and `--color-error-*` expose `background`, `border`, `text`, and `solid` roles. Text uses step 11 when it meets 4.5:1 against the status background, otherwise step 12. `--color-selection-background`, `--color-selection-text`, and `--color-overlay` cover selection and modal backdrops.

## Terminal palette

The first terminal port is dark-only: [arcubic-dark.Xresources](ports/terminal/arcubic-dark.Xresources). Regenerate with `npm run build:terminal`.

Sage provides the background and foreground. ANSI cyan uses Teal, normal yellow uses Orange, and bright yellow uses Amber. Tomato and Green provide error/success colors; Radix Blue and Purple fill the conventional ANSI slots. Normal text accents use step 10 when it reaches 4.5:1 against the background, otherwise step 11; bright accents use step 11. ANSI black is a low-contrast utility color and is excluded from the text check. Cursor and selection colors are also declared; terminal.sexy previews the background, foreground, and 16 ANSI colors.

[Preview Arcubic Dark in terminal.sexy](https://terminal.sexy/#EBIR7O7tLjEw7GFCM7B0_4AfO57_0Z3_DrOerbWyrbWy_5d9PdaM_8oWcLj_0Z3_C9i27O7t)

### GNOME Terminal installation

Run `python3 scripts/install-gnome-terminal.py` to create an Arcubic Dark profile and make it the default. Existing profiles are retained; a dconf backup is saved under `~/.config/arcubic/`. Open a new terminal window to use it, or select Arcubic Dark in an existing window's profile menu. This changes terminal colors, not the zsh prompt layout.

### Terminal preview page

Open `/#terminal` in the local preview. The page imports `ports/terminal/arcubic-dark.Xresources` directly, so the swatches, shell/Git/code samples, download, contrast matrix, and terminal.sexy link all use the same palette as the installer. The web page's appearance switch changes the surrounding interface; the terminal preview remains the fixed dark terminal port. Click any ANSI card to copy its hex value and inspect its source step.

## Interface direction

The preview uses tactile geometry: square, flat Sage panels with raised beveled controls and inset fields/tracks. Buttons reverse their bevel when pressed; slider thumbs and switches use rectangular raised surfaces. Light and dark modes use separate edge highlights/shadows. The Interface page (`/#styles`) is the selected workspace reference. Terminal output and ANSI swatches keep the canonical terminal colors.

The CSS export currently contains color tokens; the preview's component geometry and bevel rules live in `src/style.css`.

### Typography preview

Interface and content text currently use Alliance No.2 Light (weight 300). Code and terminal output keep their monospace fonts. Place the local font at `public/fonts/alliance-no2-light.otf`; the binary is ignored by Git. The current local source is `~/Bibliothek/alliance-font-family/Alliance Font Family/Degarism Studio - Alliance No.2 Light.otf`. Without it, the preview falls back to the system sans serif. Synthetic bold is disabled while testing this single weight.

### custom_1 text style

`src/custom_1.css` defines the first typography profile, independently of the font file and interface geometry. It uses Alliance No.2 Light at its actual 300 weight without synthetic bold. Core roles: captions 11px/1.4, UI 13px/1.4, reading text 15px/1.65, note headings 24px/1.25. Page titles scale from 30–40px. Code and terminal output remain monospace. The Interface page includes a specimen with role sizes and representative Latin/German glyphs.

## Component library

Open `/#components` for the searchable catalog. Fifteen collections cover buttons and icon buttons; text fields and form validation; checkbox groups/cards; radio groups/cards; direction switches and sliders; select and segmented controls; dropdown/context menus and submenus; dialogs, alert dialogs, popovers and hover cards; tabs and navigation; cards, avatars, aspect ratios and insets; typography and copyable code blocks; badges, callouts and loading states; tables/data lists; layout/scroll helpers; and disclosure/accordion examples.

`src/components/index.ts` is the reusable entry point. It re-exports Radix Themes and adds Arcubic's `DirectionSwitch` (also exported as `Switch`), `CodeBlock`, and theme-aware overlay wrappers. The Arcubic `Theme` hosts portal content within the current theme so dialogs, menus, tooltips and popovers inherit the active accent and typography. Interaction and accessibility behavior come from Radix; native details elements handle disclosure examples. The catalog's demo mutations are browser-local and do not send data.

```tsx
import type { CSSProperties } from 'react';
import { Theme, Button, CheckboxCards, Switch, CodeBlock } from './components';
import { defaults, themeTokens } from './palette';

<Theme className="arcubic-ui" appearance="dark" accentColor="teal" radius="none"
  style={themeTokens(defaults, 'dark') as CSSProperties}>
  <Button>Save changes</Button>
  <Switch aria-label="Focus mode" />
</Theme>
```

The current preview imports Radix's CSS first, followed by `src/style.css`, `src/custom_1.css`, and `src/components/arcubic.css`. `src/component-library.css` contains the catalog layout only. This is a source library inside the project, not a published npm package. The CSS token download remains a color export; it does not yet bundle the component library.

### Triangle loader

`Spinner` and the loading states of `Button`/`IconButton` use a continuous stroke through the nested-triangle motif from `Zeta_Reusables/logo_animations/fuse/fuse-animation.js`. The surrounding circle is omitted for clarity at icon size. The route is rendered as inline SVG, inherits `currentColor`, and loops with CSS; GSAP is not required. Sizes are 16, 20, and 28px. Reduced-motion mode displays a static complete motif.

### Current font pairing

`custom_1` now assigns Alliance No.2 Light (300) to interface text, Lora Regular (400) to reading text, and Nippo Regular (400) to code examples. Nippo is proportional, so its code examples do not preserve fixed-width character columns. Terminal output uses Geist Mono Regular, self-hosted through `@fontsource/geist-mono`; installing the terminal palette does not change terminal fonts. Font binaries remain local and excluded from Git. Lora is sourced from Google Fonts, Nippo from Fontshare’s official CDN.

- Alliance: `public/fonts/alliance-no2-light.otf`
- Reading: `public/fonts/lora-regular.ttf` — https://fonts.google.com/specimen/Lora
- Code: `public/fonts/nippo-regular.woff2` — https://www.fontshare.com/fonts/nippo

Code and terminal text now both use Geist Mono Regular. Nippo has been replaced and is no longer loaded.
