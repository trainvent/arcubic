# Arcubic core

`arcubic-tokens.css` is a generated, platform-independent token sheet. Build it with `npm run build:core` (Node 24). It contains the shared palette, foreground roles, font stacks, typography metrics, and geometry ratios.

```html
<link rel="stylesheet" href="arcubic-tokens.css">
<div class="arcubic-theme" data-mode="dark">...</div>
```

Use `--gray-*`, `--teal-*`, `--amber-*`, `--orange-*` and semantic `--color-*` properties. `--arc-*` properties define typography and geometry. This layer contains no Obsidian selectors. The web components live in `src/components`; application adapters live in `ports/`.
