import {test} from 'node:test';
import assert from 'node:assert/strict';
import Color from 'colorjs.io';
import {defaults, themeTokens} from '../src/palette.ts';
import {textColorTokens} from '../ports/obsidian/text-colors.ts';

for (const mode of ['light', 'dark']) {
  test(`${mode}: reading, navigation, and heading text stays readable on ordinary and selected surfaces`, () => {
    const palette = themeTokens(defaults, mode);
    const roles = textColorTokens(palette);
    const surfaces = ['--gray-1', '--gray-2', '--gray-3', '--gray-4', '--teal-3', '--teal-4'];
    for (const [role, foreground] of Object.entries(roles)) {
      for (const surface of surfaces) {
        const contrast = Color.contrast(new Color(foreground), new Color(palette[surface]), 'WCAG21');
        assert.ok(contrast >= 4.5, `${role} on ${surface}: ${contrast.toFixed(2)}:1`);
      }
    }
    assert.notEqual(roles['--arc-text-title'], roles['--arc-text-section']);
    assert.notEqual(roles['--arc-text-section'], roles['--arc-text-detail']);
    assert.notEqual(roles['--arc-text-active'], roles['--arc-text-link']);
  });
}
