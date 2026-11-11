# Arcubic for GPUI Kit

`arcubic.json` is a GPUI Kit theme set with Arcubic Light and Arcubic Dark, generated with `npm run build:gpui` from the shared palette. Load it with GPUI Kit's theme config (`ThemeSet` / `ThemeConfig`) and apply the variant that matches the window's mode.

The theme names its fonts but doesn't ship them: embed Chakra Petch (interface) and Geist Mono (code) in the app, for example with `add_fonts`. Both are under the SIL Open Font License; the TTFs are on Google Fonts.

Solid colours (primary, danger, warning, success, info) use the lightest step of their family whose text reaches 4.5:1, so they can differ between light and dark. The build fails when a main text pair drops below that.

Corners are square (`radius` 0), as everywhere in Arcubic. The triangle switch is web-only; GPUI Kit draws its own switch in Arcubic colours.
