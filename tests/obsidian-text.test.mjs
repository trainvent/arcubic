import {test} from 'node:test';
import assert from 'node:assert/strict';
import Color from 'colorjs.io';
import {defaults, themeTokens} from '../src/palette.ts';
import {textColorTokens} from '../src/core/text-colors.ts';

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
    const accents = ['title', 'section', 'detail', 'link'].map(role => roles[`--arc-text-${role}`]);
    assert.equal(new Set(accents).size, 4, 'Distinct heading and link accents');
    assert.equal(roles['--arc-text-active'], roles['--arc-text-title'], 'Selection uses the primary Teal');
    assert.equal(roles['--arc-text-body'], palette['--gray-12']);
    for (let step = 1; step <= 12; step++) {
      const channels = new Color(palette[`--gray-${step}`]).to('srgb').coords;
      assert.ok(Math.max(...channels) - Math.min(...channels) < .00001, 'Neutral ramp is achromatic');
    }
    if (mode === 'dark') assert.equal(palette['--gray-12'], '#fff');

  });
}
