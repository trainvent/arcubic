import {copyFileSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {Resvg} from '@resvg/resvg-js';
import Color from 'colorjs.io';
import {defaults, themeTokens} from '../src/palette.ts';
import {accentTextColors} from '../src/core/text-colors.ts';
import {bevel, loader, typography} from '../src/core/design.ts';
import {ansiColors} from './ansi.mjs';

const root = new URL('../', import.meta.url);
const out = new URL('ports/vscode/', root);
const pkg = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'));
const MIN_TEXT_CONTRAST = 4.5;
const PUBLISHER = 'trainvent';
const NAME = 'arcubic';
const modes = ['light', 'dark'];
const label = mode => `Arcubic ${mode === 'light' ? 'Light' : 'Dark'}`;
const themeFile = mode => `themes/arcubic-${mode}-color-theme.json`;
// VS Code adds this class to .monaco-workbench while the theme is active (extension id + path,
// non-word characters replaced by '-'), so the UI stylesheet only applies to Arcubic.
const themeClass = mode => `${PUBLISHER}-${NAME}-${themeFile(mode)}`.replace(/[^_a-zA-Z0-9-]/g, '-');

// Every corner size VS Code defines, except the circle used for avatars.
const cornerSizes = ['xSmall', 'small', 'medium', 'large', 'xLarge'].map(size => `--vscode-cornerRadius-${size}`)
  .concat(['panels', 'editorArea', 'primarySideBar', 'secondarySideBar', 'toolsPanel', 'activityBar']
    .map(part => `--vscode-${part}-cornerRadius`))
  .concat(['--modern-ui-window-corner-radius', '--modern-ui-connected-tab-radius']);
const squareCorners = cornerSizes.map(name => `${name}:0!important`).join(';');

// Document tabs: their height including the 1px edges, and the space above them.
const TAB_HEIGHT = 28;
const TAB_GAP = 5;
const ICON_SIZE = 256;

const contrast = (a, b) => Color.contrast(new Color(a), new Color(b), 'WCAG21');
const TRANSPARENT = '#00000000';

function palette(mode) {
  const t = themeTokens(defaults, mode);
  const s = (family, step) => {
    const value = t[`--${family}-${step}`];
    if (!value) throw new Error(`--${family}-${step} is not an Arcubic token`);
    return value;
  };
  const on = background => [s('gray', 1), s('gray', 12)]
    .sort((a, b) => contrast(b, background) - contrast(a, background))[0];
  // The lightest solid step of a family that still carries readable text.
  const solid = family => {
    const step = [9, 10, 11].find(n => contrast(on(s(family, n)), s(family, n)) >= MIN_TEXT_CONTRAST);
    if (!step) throw new Error(`${family} has no solid step with readable text`);
    return s(family, step);
  };
  const role = value => typeof value === 'string' ? value : s('gray', value.gray);
  const b = bevel[mode];
  return {
    t, s, on, solid,
    text: accentTextColors(t),
    bevel: {
      face: role(b.face), high: role(b.high), low: role(b.low),
      accentHigh: s('teal', b.accentHigh), accentLow: s('teal', b.accentLow),
    },
  };
}

/** Workbench colours. Surfaces are neutral; teal marks focus, selection and the primary action. */
function workbenchColors(mode) {
  const {t, s, on, solid, text, bevel} = palette(mode);
  const dark = mode === 'dark';
  const primary = solid('teal');
  const ansiNames = ['Black', 'Red', 'Green', 'Yellow', 'Blue', 'Magenta', 'Cyan', 'White'];
  const ansi = ansiColors(t, mode);
  const colors = {
    foreground: s('gray', 12),
    descriptionForeground: text.muted,
    disabledForeground: s('gray', 9),
    errorForeground: t['--color-error-text'],
    focusBorder: s('teal', 8),
    'icon.foreground': s('gray', 11),
    'toolbar.hoverBackground': s('gray', 4),
    'toolbar.activeBackground': s('gray', 5),
    'selection.background': t['--color-selection-background'],
    'widget.border': s('gray', 6),
    'widget.shadow': dark ? '#0000004d' : '#00000026',
    'sash.hoverBorder': s('teal', 8),
    'textLink.foreground': text.blue,
    'textLink.activeForeground': text.blueHover,
    'textBlockQuote.background': s('gray', 2),
    'textBlockQuote.border': s('teal', 8),
    'textCodeBlock.background': s('gray', 3),
    'textPreformat.foreground': text.orange,
    'textPreformat.background': s('gray', 3),
    'textSeparator.foreground': s('gray', 6),

    'button.background': primary,
    'button.foreground': on(primary),
    'button.hoverBackground': s('teal', 10),
    'button.border': TRANSPARENT,
    'button.separator': on(primary),
    'button.secondaryBackground': bevel.face,
    'button.secondaryForeground': s('gray', 12),
    'button.secondaryHoverBackground': s('gray', 5),
    'checkbox.background': s('gray', 1),
    'checkbox.border': s('gray', 7),
    'checkbox.foreground': text.teal,
    'checkbox.selectBackground': s('gray', 2),
    'checkbox.selectBorder': s('teal', 8),
    'dropdown.background': s('gray', 2),
    'dropdown.listBackground': s('gray', 2),
    'dropdown.border': s('gray', 7),
    'dropdown.foreground': s('gray', 12),
    'input.background': s('gray', 1),
    'input.border': s('gray', 7),
    'input.foreground': s('gray', 12),
    'input.placeholderForeground': s('gray', 11),
    'inputOption.activeBackground': s('teal', 'a4'),
    'inputOption.activeBorder': s('teal', 8),
    'inputOption.activeForeground': s('gray', 12),
    'inputOption.hoverBackground': s('gray', 4),
    'inputValidation.errorBackground': t['--color-error-background'],
    'inputValidation.errorBorder': t['--color-error-border'],
    'inputValidation.errorForeground': t['--color-error-text'],
    'inputValidation.warningBackground': t['--color-warning-background'],
    'inputValidation.warningBorder': t['--color-warning-border'],
    'inputValidation.warningForeground': t['--color-warning-text'],
    'inputValidation.infoBackground': s('blue', 3),
    'inputValidation.infoBorder': s('blue', 7),
    'inputValidation.infoForeground': text.blue,
    'badge.background': primary,
    'badge.foreground': on(primary),
    'progressBar.background': s('teal', 9),
    'scrollbar.shadow': TRANSPARENT,
    'scrollbarSlider.background': s('gray', 'a5'),
    'scrollbarSlider.hoverBackground': s('gray', 'a7'),
    'scrollbarSlider.activeBackground': s('gray', 'a8'),
    'keybindingLabel.background': s('gray', 3),
    'keybindingLabel.foreground': s('gray', 12),
    'keybindingLabel.border': s('gray', 7),
    'keybindingLabel.bottomBorder': s('gray', 8),

    'titleBar.activeBackground': s('gray', 2),
    'titleBar.activeForeground': s('gray', 12),
    'titleBar.inactiveBackground': s('gray', 2),
    'titleBar.inactiveForeground': s('gray', 11),
    'titleBar.border': s('gray', 6),
    'commandCenter.background': s('gray', 1),
    'commandCenter.foreground': s('gray', 11),
    'commandCenter.activeBackground': s('gray', 3),
    'commandCenter.activeForeground': s('gray', 12),
    'commandCenter.border': s('gray', 6),
    'commandCenter.activeBorder': s('gray', 7),
    'menubar.selectionBackground': s('gray', 4),
    'menubar.selectionForeground': s('gray', 12),
    'menu.background': s('gray', 2),
    'menu.foreground': s('gray', 12),
    'menu.border': s('gray', 6),
    'menu.selectionBackground': s('teal', 'a5'),
    'menu.selectionForeground': s('gray', 12),
    'menu.separatorBackground': s('gray', 6),

    'activityBar.background': s('gray', 2),
    'activityBar.foreground': s('gray', 12),
    'activityBar.inactiveForeground': s('gray', 11),
    'activityBar.activeBorder': s('teal', 9),
    'activityBar.activeBackground': s('gray', 3),
    'activityBar.border': s('gray', 6),
    'activityBarBadge.background': primary,
    'activityBarBadge.foreground': on(primary),
    'activityBarTop.foreground': s('gray', 12),
    'activityBarTop.inactiveForeground': s('gray', 11),
    'activityBarTop.activeBorder': s('teal', 9),
    'sideBar.background': s('gray', 2),
    'sideBar.foreground': text.muted,
    'sideBar.border': s('gray', 6),
    'sideBarTitle.foreground': s('gray', 12),
    'sideBarSectionHeader.background': s('gray', 2),
    'sideBarSectionHeader.foreground': s('gray', 12),
    'sideBarSectionHeader.border': s('gray', 6),
    'sideBar.dropBackground': s('teal', 'a4'),

    // As in the Obsidian file tree: the selected row is a gray step up with teal text.
    'list.activeSelectionBackground': s('gray', 4),
    'list.activeSelectionForeground': text.teal,
    'list.activeSelectionIconForeground': text.teal,
    'list.inactiveSelectionBackground': s('gray', 4),
    'list.inactiveSelectionForeground': text.teal,
    'list.hoverBackground': s('gray', 3),
    'list.hoverForeground': s('gray', 12),
    'list.focusOutline': s('teal', 8),
    'list.inactiveFocusOutline': s('gray', 7),
    'list.highlightForeground': text.teal,
    'list.focusHighlightForeground': text.teal,
    'list.dropBackground': s('teal', 'a4'),
    'list.errorForeground': t['--color-error-text'],
    'list.warningForeground': text.amber,
    'tree.indentGuidesStroke': s('gray', 6),
    'tree.inactiveIndentGuidesStroke': s('gray', 5),

    'editorGroup.border': s('gray', 6),
    'editorGroup.dropBackground': s('teal', 'a4'),
    'editorGroupHeader.tabsBackground': s('gray', 2),
    'editorGroupHeader.tabsBorder': TRANSPARENT,
    'editorGroupHeader.noTabsBackground': s('gray', 1),
    'tab.activeBackground': s('gray', 1),
    // As in Obsidian: the active tab joins the page and carries teal text, no accent line.
    'tab.activeForeground': text.teal,
    'tab.activeBorderTop': TRANSPARENT,
    'tab.activeBorder': s('gray', 1),
    'tab.unfocusedActiveBackground': s('gray', 1),
    'tab.unfocusedActiveForeground': text.teal,
    'tab.unfocusedActiveBorderTop': TRANSPARENT,
    'tab.inactiveBackground': bevel.face,
    'tab.inactiveForeground': s('gray', 11),
    'tab.unfocusedInactiveBackground': bevel.face,
    'tab.unfocusedInactiveForeground': s('gray', 11),
    'tab.hoverBackground': s('gray', 5),
    'tab.hoverForeground': s('gray', 12),
    'tab.border': TRANSPARENT,
    'tab.lastPinnedBorder': s('gray', 7),
    'tab.dragAndDropBorder': s('teal', 9),
    'breadcrumb.background': s('gray', 1),
    'breadcrumb.foreground': s('gray', 11),
    'breadcrumb.focusForeground': s('gray', 12),
    'breadcrumb.activeSelectionForeground': text.teal,
    'breadcrumbPicker.background': s('gray', 2),

    'editor.background': s('gray', 1),
    'editor.foreground': s('gray', 12),
    'editorLineNumber.foreground': s('gray', 10),
    'editorLineNumber.activeForeground': s('gray', 12),
    'editorCursor.foreground': text.teal,
    'editor.selectionBackground': t['--color-selection-background'],
    'editor.inactiveSelectionBackground': s('teal', 3),
    'editor.selectionHighlightBackground': s('teal', 'a4'),
    'editor.wordHighlightBackground': s('gray', 'a4'),
    'editor.wordHighlightStrongBackground': s('amber', 'a4'),
    'editor.findMatchBackground': s('amber', 'a7'),
    'editor.findMatchBorder': s('amber', 9),
    'editor.findMatchHighlightBackground': s('amber', 'a4'),
    'editor.findRangeHighlightBackground': s('gray', 'a3'),
    'editor.lineHighlightBackground': s('gray', 'a2'),
    'editor.lineHighlightBorder': s('gray', 3),
    'editor.rangeHighlightBackground': s('teal', 'a3'),
    'editor.hoverHighlightBackground': s('teal', 'a3'),
    'editorLink.activeForeground': text.blue,
    'editorWhitespace.foreground': s('gray', 6),
    'editorIndentGuide.background1': s('gray', 5),
    'editorIndentGuide.activeBackground1': s('gray', 8),
    'editorRuler.foreground': s('gray', 5),
    'editorBracketMatch.background': s('teal', 'a4'),
    'editorBracketMatch.border': s('teal', 8),
    'editorBracketHighlight.foreground1': text.teal,
    'editorBracketHighlight.foreground2': text.amber,
    'editorBracketHighlight.foreground3': text.orange,
    'editorBracketHighlight.foreground4': text.teal,
    'editorBracketHighlight.foreground5': text.amber,
    'editorBracketHighlight.foreground6': text.orange,
    'editorBracketHighlight.unexpectedBracket.foreground': t['--color-error-text'],
    'editorError.foreground': s('tomato', 11),
    'editorWarning.foreground': s('amber', 11),
    'editorInfo.foreground': s('blue', 11),
    'editorHint.foreground': s('teal', 11),
    'editorGutter.background': s('gray', 1),
    'editorGutter.addedBackground': s('green', 9),
    'editorGutter.modifiedBackground': s('amber', 9),
    'editorGutter.deletedBackground': s('tomato', 9),
    'editorOverviewRuler.border': s('gray', 5),
    'editorOverviewRuler.addedForeground': s('green', 9),
    'editorOverviewRuler.modifiedForeground': s('amber', 9),
    'editorOverviewRuler.deletedForeground': s('tomato', 9),
    'editorOverviewRuler.errorForeground': s('tomato', 9),
    'editorOverviewRuler.warningForeground': s('amber', 9),
    'editorOverviewRuler.findMatchForeground': s('amber', 9),
    'editorWidget.background': s('gray', 2),
    'editorWidget.foreground': s('gray', 12),
    'editorWidget.border': s('gray', 6),
    'editorSuggestWidget.background': s('gray', 2),
    'editorSuggestWidget.border': s('gray', 6),
    'editorSuggestWidget.foreground': s('gray', 12),
    'editorSuggestWidget.selectedBackground': s('teal', 'a5'),
    'editorSuggestWidget.selectedForeground': s('gray', 12),
    'editorSuggestWidget.highlightForeground': text.teal,
    'editorSuggestWidget.focusHighlightForeground': text.teal,
    'editorHoverWidget.background': s('gray', 2),
    'editorHoverWidget.border': s('gray', 6),
    'editorStickyScroll.background': s('gray', 1),
    'editorStickyScroll.shadow': dark ? '#00000066' : '#0000001a',
    'peekView.border': s('teal', 8),
    'peekViewTitle.background': s('gray', 3),
    'peekViewTitleLabel.foreground': s('gray', 12),
    'peekViewTitleDescription.foreground': text.muted,
    'peekViewEditor.background': s('gray', 2),
    'peekViewEditor.matchHighlightBackground': s('amber', 'a5'),
    'peekViewResult.background': s('gray', 2),
    'peekViewResult.selectionBackground': s('teal', 'a5'),
    'peekViewResult.matchHighlightBackground': s('amber', 'a5'),
    'diffEditor.insertedTextBackground': s('green', 'a4'),
    'diffEditor.removedTextBackground': s('tomato', 'a4'),
    'diffEditor.insertedLineBackground': s('green', 'a3'),
    'diffEditor.removedLineBackground': s('tomato', 'a3'),
    'diffEditor.diagonalFill': s('gray', 5),
    'merge.currentHeaderBackground': s('green', 'a5'),
    'merge.currentContentBackground': s('green', 'a3'),
    'merge.incomingHeaderBackground': s('blue', 'a5'),
    'merge.incomingContentBackground': s('blue', 'a3'),

    'panel.background': s('gray', 1),
    'panel.border': s('gray', 6),
    'panelTitle.activeForeground': s('gray', 12),
    'panelTitle.activeBorder': s('teal', 9),
    'panelTitle.inactiveForeground': s('gray', 11),
    'panelSection.border': s('gray', 6),
    'panelSectionHeader.background': s('gray', 2),
    'panelInput.border': s('gray', 7),
    'terminal.background': s('gray', 1),
    'terminal.foreground': s('gray', 12),
    'terminal.border': s('gray', 6),
    'terminal.selectionBackground': t['--color-selection-background'],
    'terminalCursor.foreground': text.teal,
    ...Object.fromEntries(ansi.map((color, i) =>
      [`terminal.ansi${i < 8 ? '' : 'Bright'}${ansiNames[i % 8]}`, color])),

    'statusBar.background': s('gray', 2),
    'statusBar.foreground': s('gray', 12),
    'statusBar.border': s('gray', 6),
    'statusBar.noFolderBackground': s('gray', 2),
    'statusBar.debuggingBackground': solid('amber'),
    'statusBar.debuggingForeground': on(solid('amber')),
    'statusBar.debuggingBorder': s('gray', 6),
    'statusBarItem.hoverBackground': s('gray', 4),
    'statusBarItem.activeBackground': s('gray', 5),
    'statusBarItem.prominentBackground': s('gray', 4),
    'statusBarItem.prominentForeground': s('gray', 12),
    'statusBarItem.remoteBackground': primary,
    'statusBarItem.remoteForeground': on(primary),
    'statusBarItem.errorBackground': solid('tomato'),
    'statusBarItem.errorForeground': on(solid('tomato')),
    'statusBarItem.warningBackground': solid('amber'),
    'statusBarItem.warningForeground': on(solid('amber')),

    'quickInput.background': s('gray', 2),
    'quickInput.foreground': s('gray', 12),
    'quickInputList.focusBackground': s('teal', 'a5'),
    'quickInputList.focusForeground': s('gray', 12),
    'quickInputTitle.background': s('gray', 3),
    'pickerGroup.foreground': text.amber,
    'pickerGroup.border': s('gray', 6),
    'notifications.background': s('gray', 2),
    'notifications.foreground': s('gray', 12),
    'notifications.border': s('gray', 6),
    'notificationCenterHeader.background': s('gray', 3),
    'notificationCenterHeader.foreground': s('gray', 12),
    'notificationToast.border': s('gray', 6),
    'notificationsErrorIcon.foreground': s('tomato', 11),
    'notificationsWarningIcon.foreground': s('amber', 11),
    'notificationsInfoIcon.foreground': s('blue', 11),
    'notificationLink.foreground': text.blue,
    'welcomePage.tileBackground': s('gray', 2),
    'welcomePage.tileHoverBackground': s('gray', 3),
    'welcomePage.tileBorder': s('gray', 6),
    'walkThrough.embeddedEditorBackground': s('gray', 2),
    'settings.headerForeground': s('gray', 12),
    'settings.modifiedItemIndicator': s('amber', 9),
    'settings.focusedRowBackground': s('gray', 'a2'),
    'settings.rowHoverBackground': s('gray', 'a2'),
    'extensionButton.prominentBackground': primary,
    'extensionButton.prominentForeground': on(primary),
    'extensionButton.prominentHoverBackground': s('teal', 10),
    'extensionBadge.remoteBackground': primary,
    'extensionBadge.remoteForeground': on(primary),

    'gitDecoration.addedResourceForeground': t['--color-success-text'],
    'gitDecoration.untrackedResourceForeground': t['--color-success-text'],
    'gitDecoration.modifiedResourceForeground': text.amber,
    'gitDecoration.deletedResourceForeground': t['--color-error-text'],
    'gitDecoration.conflictingResourceForeground': text.orange,
    'gitDecoration.ignoredResourceForeground': s('gray', 10),
    'gitDecoration.submoduleResourceForeground': text.blue,
    'debugToolBar.background': s('gray', 2),
    'debugToolBar.border': s('gray', 6),
    'charts.foreground': s('gray', 12),
    'charts.lines': s('gray', 6),
    'charts.blue': s('blue', 9),
    'charts.green': s('green', 9),
    'charts.orange': s('orange', 9),
    'charts.yellow': s('amber', 9),
    'charts.red': s('tomato', 9),
    'charts.purple': s('teal', 9),
  };
  for (const [text, background] of [
    ['foreground', 'editor.background'], ['descriptionForeground', 'sideBar.background'],
    ['button.foreground', 'button.background'], ['button.secondaryForeground', 'button.secondaryBackground'],
    ['badge.foreground', 'badge.background'], ['statusBar.foreground', 'statusBar.background'],
    ['statusBarItem.errorForeground', 'statusBarItem.errorBackground'],
    ['statusBarItem.warningForeground', 'statusBarItem.warningBackground'],
    ['tab.inactiveForeground', 'tab.inactiveBackground'], ['tab.activeForeground', 'tab.activeBackground'], ['textLink.foreground', 'editor.background'],
    ['input.placeholderForeground', 'input.background'], ['list.highlightForeground', 'sideBar.background'],
    ['sideBar.foreground', 'sideBar.background'], ['list.activeSelectionForeground', 'list.activeSelectionBackground'],
  ]) {
    const ratio = contrast(colors[text], colors[background]);
    if (ratio < MIN_TEXT_CONTRAST) throw new Error(`${mode}: ${text} on ${background} is ${ratio.toFixed(2)}:1`);
  }
  return colors;
}

/** Syntax roles follow the Obsidian code blocks: teal keywords, orange functions and values,
 * amber types and properties, blue strings, muted comments. */
function syntax(mode) {
  const {s, t, text} = palette(mode);
  const roles = {
    plain: s('gray', 12), comment: text.muted, keyword: text.teal, fn: text.orange, value: text.orange,
    type: text.amber, property: text.amber, string: text.blue, error: t['--color-error-text'],
    inserted: t['--color-success-text'],
  };
  for (const [role, color] of Object.entries(roles)) {
    const ratio = contrast(color, s('gray', 1));
    if (ratio < MIN_TEXT_CONTRAST) throw new Error(`${mode}: syntax ${role} is ${ratio.toFixed(2)}:1`);
  }
  const rule = (name, scope, foreground, fontStyle) =>
    ({name, scope, settings: fontStyle ? {foreground, fontStyle} : {foreground}});
  const tokenColors = [
    rule('Comments', ['comment', 'punctuation.definition.comment'], roles.comment),
    rule('Keywords', ['keyword', 'storage', 'storage.type', 'keyword.control', 'keyword.other.unit'], roles.keyword),
    rule('Operators', ['keyword.operator', 'punctuation.accessor', 'punctuation.separator.key-value'], roles.plain),
    rule('Strings', ['string', 'string.template', 'punctuation.definition.string', 'string.regexp'], roles.string),
    rule('Escapes', ['constant.character.escape', 'constant.other.placeholder'], roles.value),
    rule('Values', ['constant.numeric', 'constant.language', 'constant.other', 'support.constant', 'variable.other.constant', 'variable.other.enummember'], roles.value),
    rule('Functions', ['entity.name.function', 'support.function', 'meta.function-call entity.name.function', 'variable.function'], roles.fn),
    rule('Types', ['entity.name.type', 'entity.name.class', 'entity.name.namespace', 'support.type', 'support.class', 'entity.other.inherited-class', 'storage.type.class.jsdoc'], roles.type),
    rule('Properties', ['variable.other.property', 'variable.other.object.property', 'support.type.property-name', 'meta.object-literal.key', 'entity.name.tag.yaml'], roles.property),
    rule('Variables', ['variable', 'variable.parameter', 'meta.definition.variable'], roles.plain),
    rule('Language variables', ['variable.language'], roles.keyword),
    rule('Tags', ['entity.name.tag', 'punctuation.definition.tag'], roles.keyword),
    rule('Attributes', ['entity.other.attribute-name'], roles.property),
    rule('Decorators', ['meta.decorator', 'entity.name.function.decorator', 'punctuation.decorator'], roles.value),
    rule('Invalid', ['invalid', 'invalid.illegal'], roles.error),
    rule('Headings', ['markup.heading', 'entity.name.section'], roles.keyword, 'bold'),
    rule('Bold', ['markup.bold'], roles.plain, 'bold'),
    rule('Italic', ['markup.italic'], roles.plain, 'italic'),
    rule('Links', ['markup.underline.link', 'string.other.link'], roles.string, 'underline'),
    rule('Inline code', ['markup.inline.raw', 'markup.fenced_code', 'markup.raw'], roles.value),
    rule('Quotes', ['markup.quote'], roles.comment),
    rule('Lists', ['punctuation.definition.list', 'markup.list punctuation'], roles.property),
    rule('Inserted', ['markup.inserted'], roles.inserted),
    rule('Deleted', ['markup.deleted'], roles.error),
    rule('Changed', ['markup.changed'], roles.property),
  ];
  const semanticTokenColors = {
    namespace: roles.type, class: roles.type, enum: roles.type, interface: roles.type, struct: roles.type,
    type: roles.type, typeParameter: roles.type, function: roles.fn, method: roles.fn, macro: roles.fn,
    decorator: roles.value, property: roles.property, enumMember: roles.value, keyword: roles.keyword,
    string: roles.string, number: roles.value, regexp: roles.string, comment: roles.comment,
    variable: roles.plain, parameter: roles.plain, 'variable.readonly': roles.value,
    'variable.defaultLibrary': roles.value, 'property.readonly': roles.property,
  };
  return {tokenColors, semanticTokenColors};
}

function colorTheme(mode) {
  return {
    $schema: 'vscode://schemas/color-theme',
    name: label(mode),
    type: mode,
    semanticHighlighting: true,
    colors: workbenchColors(mode),
    ...syntax(mode),
  };
}

/** The triangle fuse as an SVG image. The guide is the faint route, the fuse a dash travelling
 * along it. Used as a mask, so the loader takes the colour of the icon it replaces. */
function fuseSvg({animated}) {
  const dash = loader.fuseDash;
  const fuse = animated
    ? `<path d='${loader.route}' pathLength='100' stroke-width='60' stroke-dasharray='${dash} ${100 - dash}' stroke-dashoffset='100'><animate attributeName='stroke-dashoffset' from='100' to='0' dur='${loader.durationSeconds}s' repeatCount='indefinite'/></path>`
    : `<path d='${loader.route}' stroke-width='60'/>`;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${loader.viewBox}' fill='none' stroke='#000' stroke-linecap='round' stroke-linejoin='round'><path d='${loader.route}' stroke-width='44' opacity='.35'/>${fuse}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/** What a colour theme can't do: raised and inset bevels, square controls, the triangle loader
 * and the interface font. Loaded by a CSS loader extension; see ports/vscode/README.md. */
function uiStylesheet() {
  const tokens = modes.map(mode => {
    const {s, bevel, text} = palette(mode);
    return `.${themeClass(mode)}{
--arc-face:${bevel.face};--arc-high:${bevel.high};--arc-low:${bevel.low};
--arc-accent-high:${bevel.accentHigh};--arc-accent-low:${bevel.accentLow};
--arc-inset-face:${s('gray', 1)};--arc-focus:${s('teal', 8)};
--arc-tree-guide:${s('gray', 6)};--arc-tree-marker:${text.muted};
--arc-page:${s('gray', 1)};--arc-line:${s('gray', 6)};--arc-tab-edge:${s('gray', 7)};
--arc-text:${text.body};--arc-muted:${text.muted};--arc-danger:${s('tomato', 11)};
--arc-selected:${s('teal', 3)};--arc-selected-hover:${s('teal', 4)};--arc-selected-edge:${s('teal', 8)};--arc-selected-text:${text.teal};
}`;
  }).join('\n');
  const scope = modes.map(mode => `.${themeClass(mode)}`).join(',');
  const any = selector => `:is(${scope}) ${selector}`;
  const raised = '--arc-edge-tl:var(--arc-high);--arc-edge-br:var(--arc-low)';
  return `/*! Arcubic for VS Code — generated by npm run build:vscode. Applies only while an Arcubic theme is active. */
${tokens}
/* Square corners. VS Code writes its corner sizes in a rule with three classes, so these need !important. */
.monaco-workbench:is(${scope}),:is(${scope}) .monaco-workbench{${squareCorners}}
.monaco-workbench:is(${scope}){font-family:${typography.interface.replace(', sans-serif', '')},system-ui,sans-serif}

/* Raised buttons: light top-left edge, dark bottom-right edge; pressing swaps them. */
${any(':is(.monaco-button,.monaco-text-button,.extension-action.label)')}{
${raised};border-radius:0!important;border:1px solid!important;
border-color:var(--arc-edge-tl) var(--arc-edge-br) var(--arc-edge-br) var(--arc-edge-tl)!important;
box-shadow:inset 1px 1px 0 var(--arc-edge-tl),inset -1px -1px 0 var(--arc-edge-br)!important;
outline-offset:2px}
${any(':is(.monaco-button,.monaco-text-button,.extension-action.label):not(.secondary)')}{--arc-edge-tl:var(--arc-accent-high);--arc-edge-br:var(--arc-accent-low)}
${any(':is(.monaco-button,.monaco-text-button).secondary')}{${raised}}
${any(':is(.monaco-button,.monaco-text-button,.extension-action.label):not(.disabled):active')}{
border-color:var(--arc-edge-br) var(--arc-edge-tl) var(--arc-edge-tl) var(--arc-edge-br)!important;
box-shadow:inset 1px 1px 0 var(--arc-edge-br),inset -1px -1px 0 var(--arc-edge-tl)!important}
${any('.monaco-button-dropdown>.monaco-button')}{border-radius:0!important}
${any('.monaco-button-dropdown-separator')}{background:transparent!important}
${any(':is(.monaco-button,.monaco-text-button).disabled')}{box-shadow:none!important;border-color:var(--arc-high)!important}
${any(':is(.monaco-button,.monaco-text-button,.extension-action.label):not(.disabled):hover')}{filter:brightness(1.06)}
${any(':is(.monaco-button,.monaco-text-button,.extension-action.label):not(.disabled):active')}{transform:translateY(1px)}

/* Document tabs as in Obsidian: inactive tabs are raised keys side by side; the active tab
   joins the page below it. */
${any('.part.editor .title .tabs-container>.tab')}{
margin:${TAB_GAP}px 0 0 0!important;box-sizing:border-box!important;
height:${TAB_HEIGHT}px!important;min-height:${TAB_HEIGHT}px!important;max-height:${TAB_HEIGHT}px!important;
--editor-group-tab-height:${TAB_HEIGHT - 2}px!important;
border:1px solid!important;border-color:var(--arc-tab-edge) var(--arc-low) var(--arc-low) var(--arc-tab-edge)!important;
background:var(--arc-face)!important;color:var(--arc-muted)!important;
box-shadow:inset 1px 1px 0 var(--arc-high),inset -1px -1px 0 var(--arc-low)!important}
${any('.part.editor .title .tabs-container>.tab:first-child')}{margin-left:4px!important}
/* VS Code's tab height differs between its tab modes, so the keys have a fixed height of their own;
   inside a tab, VS Code's height variable is set to match so icons and labels stay centred. */
${any('.part.editor .title .tabs-container')}{align-items:flex-end}
${any('.part.editor .title .tabs-container>.tab :is(.tab-label,.monaco-icon-label)')}{line-height:${TAB_HEIGHT - 2}px!important}
/* VS Code's modern tabs paint a second, bordered layer inside each tab; the tab itself is the key. */
${any('.part.editor .title .tabs-container>.tab>.tab-fill')}{display:none!important}
${any('.part.editor .title .tabs-container>.tab:not(.active):hover')}{filter:brightness(1.06);color:var(--arc-text)!important}
${any('.part.editor .title .tabs-container>.tab.active')}{
z-index:1;background:var(--arc-page)!important;color:var(--arc-selected-text)!important;box-shadow:none!important;
border-color:var(--arc-line) var(--arc-line) var(--arc-page) var(--arc-line)!important}
${any('.part.editor .title .tabs-container>.tab :is(.tab-border-top-container,.tab-border-bottom-container)')}{display:none!important}
${any('.part.editor .title .tabs-container>.tab .tab-actions .action-label:hover')}{background:transparent!important;color:var(--arc-danger)!important}

/* Panel and side bar view tabs as in Obsidian's side docks: a flat key with a light top edge;
   the open view is teal with a teal base line. */
${any('.pane-composite-part>:is(.title,.header-or-footer)>.composite-bar-container .action-item:not(.icon)')}{
background:var(--arc-face);box-shadow:inset 0 1px 0 var(--arc-high);margin-right:2px}
${any('.pane-composite-part>:is(.title,.header-or-footer)>.composite-bar-container .action-item:not(.icon):hover')}{background:var(--vscode-toolbar-hoverBackground)}
${any('.pane-composite-part>:is(.title,.header-or-footer)>.composite-bar-container .action-item.checked:not(.icon)')}{
background:var(--arc-selected);box-shadow:inset 0 -1px 0 var(--arc-selected-edge)}
${any('.pane-composite-part>:is(.title,.header-or-footer)>.composite-bar-container .action-item.checked:not(.icon) .action-label')}{color:var(--arc-selected-text)!important}
${any('.pane-composite-part>:is(.title,.header-or-footer)>.composite-bar-container .action-item:not(.icon) .active-item-indicator')}{display:none}

/* Option toggles (match case, regex, …) press in while on. */
${any('.monaco-custom-toggle.checked')}{background:var(--arc-selected)!important;color:var(--arc-selected-text)!important;
border-color:var(--arc-low) var(--arc-selected-edge) var(--arc-selected-edge) var(--arc-low)!important}

/* Inset fields: dark top-left edge, light bottom-right edge. */
${any(':is(.monaco-inputbox,.monaco-select-box,.monaco-custom-toggle.monaco-checkbox:not(.checked))')}{
border-radius:0!important;border:1px solid!important;
border-color:var(--arc-low) var(--arc-high) var(--arc-high) var(--arc-low)!important}
${any('.monaco-inputbox.synthetic-focus,.monaco-select-box:focus')}{outline:1px solid var(--arc-focus)!important;outline-offset:-1px}

/* Square corners everywhere else Arcubic draws a control or panel. */
${any(':is(.monaco-custom-toggle,.quick-input-widget,.monaco-hover,.suggest-widget,.notification-toast,.notifications-center,.monaco-menu-container,.monaco-menu,.context-view .monaco-menu,.keybinding-label>.monaco-keybinding-key,.badge-content,.command-center-center)')}{border-radius:0!important}

/* File trees as in Obsidian: a bar marks each folder (thick when open, thin when closed)
   and the guide lines between levels stay visible. */
${any('.monaco-tl-twistie.collapsible:not(.codicon-tree-item-loading)::before')}{
content:''!important;width:3px;height:12px;background:var(--arc-tree-marker);border-radius:0;transform:none!important}
${any('.monaco-tl-twistie.collapsible.collapsed:not(.codicon-tree-item-loading)::before')}{width:1px}
${any('.monaco-tl-indent>.indent-guide')}{opacity:1!important;border-left-color:var(--arc-tree-guide)!important}

/* Loader: every spinning icon becomes the triangle fuse. */
${any(':is(.codicon-modifier-spin,.codicon-loading,.codicon-tree-item-loading)')}{animation:none!important}
${any(':is(.codicon-modifier-spin,.codicon-loading,.codicon-tree-item-loading)::before')}{
content:''!important;display:inline-block;width:1em;height:1em;vertical-align:-.125em;animation:none!important;
background:currentColor;-webkit-mask:${fuseSvg({animated: true})} center/contain no-repeat}
/* The thin progress bar under view titles keeps its place; its moving part becomes a square-ended fuse. */
${any('.monaco-progress-container.infinite .progress-bit')}{width:6%;height:2px}
@media (prefers-reduced-motion:reduce){
${any(':is(.codicon-modifier-spin,.codicon-loading,.codicon-tree-item-loading)::before')}{-webkit-mask-image:${fuseSvg({animated: false})}}
${any('.monaco-progress-container.infinite .progress-bit')}{animation:none!important;width:100%;opacity:.5}
}
`;
}

const extensionManifest = {
  name: NAME,
  displayName: 'Arcubic',
  description: 'Teal, amber and burnt orange on neutral grayscale surfaces.',
  version: pkg.version,
  publisher: PUBLISHER,
  license: 'MIT',
  icon: 'icon.png',
  repository: {type: 'git', url: 'https://github.com/trainvent/arcubic'},
  engines: {vscode: '^1.90.0'},
  categories: ['Themes'],
  keywords: ['theme', 'dark', 'light', 'teal', 'arcubic'],
  contributes: {
    themes: modes.map(mode => ({label: label(mode), uiTheme: mode === 'light' ? 'vs' : 'vs-dark', path: `./${themeFile(mode)}`})),
  },
};

mkdirSync(new URL('themes/', out), {recursive: true});
for (const mode of modes) writeFileSync(new URL(themeFile(mode), out), JSON.stringify(colorTheme(mode), null, 2) + '\n');
writeFileSync(new URL('arcubic-vscode.css', out), uiStylesheet());
writeFileSync(new URL('package.json', out), JSON.stringify(extensionManifest, null, 2) + '\n');
const logo = new Resvg(readFileSync(new URL('public/logo.svg', root)), {fitTo: {mode: 'width', value: ICON_SIZE}});
writeFileSync(new URL('icon.png', out), logo.render().asPng());
copyFileSync(new URL('LICENSE', root), new URL('LICENSE', out));
console.log('Built ports/vscode (themes, arcubic-vscode.css, package.json)');
