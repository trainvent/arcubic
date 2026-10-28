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
