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

The original profile follows this hue curve. The active Radix profile uses complete native scales, preserving their hue, saturation and lightness at every step. Custom seed scales are generated separately in OKLCH.

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
