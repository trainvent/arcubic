# Three colors along the arc

Arcubic's identity uses three ordered families: Teal, Amber and Burnt orange. Blue links, Green success and Red errors are functional colors outside this curve. Tags use Teal.

| Position | Family | Token | Default seed |
| --- | --- | --- | --- |
| 0 | Teal | `--teal-*` | `#12A594` |
| 0.5 | Amber | `--amber-*` | `#FFC53D` |
| 1 | Burnt orange | `--orange-*` | `#F76B15` |

The default profile uses native Radix anchors and their complete scales. Edited anchors receive generated OKLCH scales. The original profile samples the cubic formula:

```text
hue(i) = 17.79 + 152.09 × (1 − i)³
```

The original profile uses 75% saturation and 45% lightness; the Soft profile tunes these for a softer balance. Backgrounds and ordinary text use neutral grays, independently of the accent curve.

`src/palette.ts` owns the defaults and scales. Application adapters assign their own semantic roles. `npm run build:brand` regenerates the three-dot curve, title banner and optional triangle artwork from the shared defaults.
