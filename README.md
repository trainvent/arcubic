# Arcubic

<img src="public/arcubic.svg" alt="Arcubic" width="128"/>

Teal, amber and burnt orange on Sage. A reusable design system with square panels, raised controls, inset fields and a sliding triangle switch.

## Alpha release

Download the [v0.1.0-alpha.1 prerelease](https://github.com/Trainvent/arcubic/releases/tag/v0.1.0-alpha.1) for the installable Obsidian theme, shared CSS tokens and terminal palette. See [installation and known limitations](docs/alpha-release.md). That first release uses optional Alliance; the current working build instead bundles Chakra Petch under the OFL.

Arcubic's code is [MIT licensed](LICENSE). Bundled fonts retain their included OFL licenses.

## Shared core and adapters

| Part | Location | Purpose |
| --- | --- | --- |
| Shared colors | `src/palette.ts` | Full Radix scales, semantic roles and contrast-aware text |
| Shared design | `src/core/design.ts` | Typography roles and proportional switch geometry |
| Framework-free CSS | `packages/core/arcubic-tokens.css` | Generated tokens for websites and other adapters |
| React components | `src/components/` | Radix components with Arcubic styling |
| Web preview | `src/main.tsx` | Colors, terminal, interface and component examples |
| Obsidian | `ports/obsidian/` | Standalone native theme, built from the shared core |
| Terminal | `ports/terminal/` | ANSI palette and terminal exports |

App-specific selectors stay in their adapters. Obsidian does not introduce a dependency into the web components.

## Develop

Requires Node 24+.

```sh
npm ci
npm run dev
npm run build
npm run build:themes
```

The preview has Web, Terminal, Interface and Components pages, with light and dark modes. `build:themes` regenerates the plain CSS tokens, Obsidian theme and terminal palette.

## Colors

The default uses complete Radix Teal, Amber, Orange and Sage scales. Success uses Green; errors use Tomato. The light page is `#FEFFFF`, with Sage panels. Dark mode uses Sage 1 (`#101211`). Accent text chooses step 11 or 12 for its actual page/panel background to meet 4.5:1 contrast. Raw scale values remain unchanged.

The original three-color identity is described by:

```text
hue(i) = 17.79 + (1 − i)³ × 152.09,  0 ≤ i ≤ 1
```

Samples at 0, 0.5 and 1 give 169.88°, 36.80125° and 17.79°. The current UI uses Radix's full scales rather than forcing every shade onto that hue curve. See [hue curves](docs/hue-curves.md) for the cubic and experimental five-point extension.

## Typography

- Interface: Chakra Petch Regular.
- Reading: Lora, including real bold and italic faces.
- Code and terminal: Geist Mono.

Chakra Petch, Lora and Geist Mono are installed through Fontsource and included under their OFL licenses. The Obsidian theme embeds all three; no separate font download is needed.

## Use elsewhere

For framework-free websites, see [shared CSS tokens](packages/core/README.md). For Obsidian installation, see [the adapter instructions](ports/obsidian/README.md). Terminal export instructions are in [ports/terminal](ports/terminal/).
