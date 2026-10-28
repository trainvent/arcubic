# Arcubic

<img src="public/arcubic.svg" alt="Arcubic" width="128"/>

Teal, amber and burnt orange on Sage. A reusable design system with square panels, raised controls, inset fields and a sliding triangle switch.

## Styling guidelines

Arcubic aims for a precise, technical interface with a tactile feel. Clear structure, restrained color and deliberate geometry should make the controls feel coherent across websites and applications.

- **Use depth where interaction benefits from it.** Raised buttons suggest pressing; inset fields and tracks suggest input. Keep content panels quiet and flat. A thin bevel is usually enough, especially on compact controls; preserve space for their text and icons.
- **Keep the structure geometric.** Favor square edges, aligned boundaries and consistent spacing. Active document tabs should connect to their page, while inactive tabs recede into the surrounding surface.
- **Make triangles functional.** Use them for direction, state and progress: the switch slides left/down when off and right/up when on, and the loader follows a triangular path. Keep angles, proportions and internal spacing consistent as these elements scale.
- **Keep hover, selection and focus distinct.** Hover is a small change in brightness or text color. Selection persists after the pointer leaves. Keyboard focus stays visible with a light, single outline. Avoid stacked focus rings, heavy hover boxes and separate highlights around button text.
- **Give color a clear role.** Sage provides the surfaces; teal, amber and burnt orange establish the identity. Use accents selectively. Green and red communicate success and error, rather than becoming additional decorative accents.
- **Let typography do its job.** Use a technical interface face, a comfortable reading face and a true monospace for code. Keep labels legible at small sizes and leave enough room for descenders, including in placeholders, tags and truncated labels.
- **Make motion explain a change.** Keep transitions short and purposeful: a button depresses, a switch travels and rotates, a loader indicates progress. Respect reduced-motion preferences.
- **Adapt to the host without losing the system.** Preserve native behavior and keyboard interaction. Test normal, hovered, pressed, selected, focused and disabled states in context, in both light and dark modes. Check contrast against the actual surface behind the text.

The guiding principle is restraint: geometry gives Arcubic its character, while depth and color help people understand what they can do.

## Alpha release

Download the [0.1.2 alpha release](https://github.com/Trainvent/arcubic/releases/tag/0.1.2) for the installable Obsidian theme, shared CSS tokens and terminal palette. See [installation and known limitations](docs/alpha-release.md). The current build bundles Chakra Petch, Lora and Geist Mono under the OFL.

The root `manifest.json`, `theme.css` and `versions.json` are generated Obsidian distribution files. Native source stays in `ports/obsidian/`; shared web tokens and components stay independent. Rebuild with `npm run build:obsidian` after changing the adapter.

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
