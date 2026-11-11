# Arcubic for GPUI Kit

`arcubic.json` is a GPUI Kit theme set with Arcubic Light and Arcubic Dark, generated with `npm run build:gpui` from the shared palette. Load it with GPUI Kit's theme config (`ThemeSet` / `ThemeConfig`) and apply the variant that matches the window's mode.

The theme names its fonts but doesn't ship them: embed Chakra Petch (interface) and Geist Mono (code) in the app, for example with `add_fonts`. Both are under the SIL Open Font License; the TTFs are on Google Fonts.

Solid colours (primary, danger, warning, success, info) use the lightest step of their family whose text reaches 4.5:1, so they can differ between light and dark. The build fails when a main text pair drops below that.

Corners are square (`radius` 0), as everywhere in Arcubic, and the base font size is the UI size (13px).

Each theme also has an `arcubic` section with what GPUI Kit's format can't hold; GPUI Kit ignores it, apps that know Arcubic read it:

- `type` and `leading`: the caption, UI, body and heading sizes and line heights.
- `border`: the border width.
- `text`: the text roles (`title`, `section`, `detail`, `active`, `secondary`, `link`, …).
- `switch`: the triangle switch, with its height, ratios of that height, and the off and on colours (rim gradient high → mid → low, chamber top → bottom, triangle light → dark). The bevel roles come from `bevel` in `src/core/design.ts`.
