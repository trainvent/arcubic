import obsidian from 'stylelint-config-obsidianmd';

// Apply the official Obsidian-specific review rules to the generated artifact.
// Omit inherited stylistic rules: sources retain the repository's compact format.
export default {
  ...obsidian,
  extends: [],
  rules: {
    ...obsidian.rules,
    'plugin/no-unsupported-browser-features': [true, {
      ...obsidian.rules['plugin/no-unsupported-browser-features'][1],
      // Conservative target matching the reported Obsidian 1.7.4 review baseline.
      browsers: ['electron >= 31'],
    }],
  },
};
