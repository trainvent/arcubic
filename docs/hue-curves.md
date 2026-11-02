# Five colors along the arc

Arcubic uses five ordered families: Teal, Greenish, Amber, Golden orange and Burnt orange. Sampling adds color roles without changing the original cubic formula.

## Default profile

The existing Radix Teal, Amber and Orange anchors remain at positions 0, 0.5 and 1. The intermediate positions interpolate hue, saturation and lightness between their neighboring anchors.

| Position | Family | Token | Default seed |
| --- | --- | --- | --- |
| 0 | Teal | `--teal-*` | `#12A594` |
| 0.25 | Greenish | `--lime-*` | `#3BED0C` |
| 0.5 | Amber | `--amber-*` | `#FFC53D` |
| 0.75 | Golden orange | `--gold-*` | `#FB9B29` |
| 1 | Burnt orange | `--orange-*` | `#F76B15` |

Teal, Amber and Orange retain complete native Radix scales. Greenish and Golden orange receive generated OKLCH scales. The source colors are step-9 anchors; readable foregrounds and subtle backgrounds use their own tones.

## Original cubic profile

```text
hue(i) = 17.79 + (1 − i)³ × 152.09
```

| Position | Hue | Family |
| --- | --- | --- |
| 0 | 169.88° | Teal |
| 0.25 | 81.95° | Greenish |
| 0.5 | 36.80° | Amber |
| 0.75 | 20.17° | Golden orange |
| 1 | 17.79° | Burnt orange |

The three established sample positions remain unchanged. Two additional samples expose intermediate hues; the curve itself is unchanged. The default Radix profile and original cubic profile are distinct, as before. The soft profile keeps the cubic hue path with adjusted saturation and lightness.

## Shared implementation

`src/palette.ts` owns the five defaults, scales and surface ramp. The web preview and generated core tokens consume it directly. Obsidian maps the five families to text roles, while the terminal adapts them to ANSI slots and retains Blue/Purple utility colors.

The surface ramp follows the Greenish hue at very low chroma. Its lightness is based on the established neutral ramp, preserving the approved subtle dark/light appearances. Semantic success Green and error Tomato are separate from the decorative Greenish family.

`npm run build:brand` regenerates the artwork from the same five defaults. The title banner, triangle logo and curve icon therefore match the palette example.
