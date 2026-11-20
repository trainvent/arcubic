# Trying VS Code changes

`npm run dev:vscode` builds a separate extension, **Arcubic Dev**, with the themes *Arcubic Light Dev* and *Arcubic Dark Dev*. It installs next to the released Arcubic extension, so the two never overwrite each other.

The script also copies the dev stylesheet to `~/.config/arcubic/arcubic-vscode-dev.css`. Add that file to Custom UI Style once:

```json
"custom-ui-style.external.imports": [
  "file://${userHome}/.config/arcubic/arcubic-vscode.css",
  "file://${userHome}/.config/arcubic/arcubic-vscode-dev.css"
]
```

The dev stylesheet only applies while a Dev theme is active, because VS Code scopes it by extension id.

After each run:

- **Colour changes** need *Developer: Reload Window*.
- **Stylesheet changes** need *Custom UI Style: Reload*, then a full quit and restart of VS Code.

To see which rule draws something, open *Help → Toggle Developer Tools* in VS Code and inspect the element.
