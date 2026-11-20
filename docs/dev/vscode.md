# Trying VS Code changes

`npm run dev:vscode` builds a separate extension, **Arcubic Dev**, with the themes *Arcubic Light Dev* and *Arcubic Dark Dev*. It installs next to the released Arcubic extension, so the two never overwrite each other.

Like the released extension, Arcubic Dev keeps its stylesheet current at the path Custom UI Style imports, here a file named `arcubic-vscode-dev.css`. Add it once:

```json
"custom-ui-style.external.imports": [
  "file://${userHome}/.config/arcubic/arcubic-vscode.css",
  "file://${userHome}/.config/arcubic/arcubic-vscode-dev.css"
]
```

The dev stylesheet only applies while a Dev theme is active, because VS Code scopes it by extension id.

After each run:

- **Colour changes** need *Developer: Reload Window*.
- **Stylesheet changes** need a window reload, which updates the file and offers *Apply*, then a full quit and restart of VS Code.

To see which rule draws something, open *Help → Toggle Developer Tools* in VS Code and inspect the element.
