# Arcubic for VS Code

Arcubic Light and Arcubic Dark: teal, amber and burnt orange on neutral grayscale surfaces, generated from the shared Arcubic palette with `npm run build:vscode`.

## Install the theme

Search for **Arcubic** in the Extensions view; it's on the VS Code Marketplace and Open VSX. Or download `arcubic-vscode-<version>.vsix` from the [latest release](https://github.com/trainvent/arcubic/releases/latest), then:

```sh
code --install-extension arcubic-vscode-<version>.vsix
```

Choose **Arcubic Dark** or **Arcubic Light** with *Preferences: Color Theme*. For the editor, set `"editor.fontFamily": "Geist Mono"` if the font is installed.

## Raised buttons and the triangle loader (optional)

A colour theme can only set colours. `arcubic-vscode.css` (in the same release) adds what it can't do:

- raised buttons that press in, inset input fields, and option toggles that stay pressed while on
- document tabs as in Obsidian: inactive tabs are raised keys, the active tab joins the page
- a file tree as in Obsidian: folder bars instead of arrows, guide lines always shown
- panel tabs as in Obsidian's side docks
- square corners everywhere
- the triangle fuse in place of every spinning loading icon
- Chakra Petch as the interface font, when it is installed on your system

It only applies while an Arcubic theme is active.

VS Code has no supported way to load custom CSS, so this needs the [Custom UI Style](https://marketplace.visualstudio.com/items?itemName=subframe7536.custom-ui-style) extension, which patches VS Code's own files:

1. Install Custom UI Style.
2. Save `arcubic-vscode.css`, for example to `~/.config/arcubic/arcubic-vscode.css`, and add to your settings:

   ```json
   "custom-ui-style.external.imports": ["file://${userHome}/.config/arcubic/arcubic-vscode.css"]
   ```

3. Run *Custom UI Style: Reload*, then fully quit and restart VS Code.

Run it again after each VS Code update. *Custom UI Style: Rollback* removes the patch.

VS Code installed as a **snap** or **AppImage** can't be patched, because its files are read-only. Use the `.deb`, `.rpm` or `.tar.gz` build from [code.visualstudio.com](https://code.visualstudio.com/download) instead. If VS Code lives in a system folder, give your user ownership of it first (for example `sudo chown -R $(whoami) /usr/share/code`).

Install [Chakra Petch](https://fonts.google.com/specimen/Chakra+Petch) and [Geist Mono](https://fonts.google.com/specimen/Geist+Mono) as system fonts; VS Code doesn't load fonts from stylesheets.
