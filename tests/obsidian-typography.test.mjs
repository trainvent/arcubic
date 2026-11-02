import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('Obsidian styles cannot import compact web typography or override native size settings',()=>{
 for(const file of ['theme.css','plugins.css']){
  const source=readFileSync(new URL(`../ports/obsidian/src/${file}`,import.meta.url),'utf8');
  assert.doesNotMatch(source,/--arc-(?:type-|leading-)/);
  assert.doesNotMatch(source,/--(?:font-ui-[\w-]+|font-text-size|nav-item-size|tab-font-size|h[1-6]-size|inline-title-size|code-size)\s*:/);
 }
});
