import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

test('native header ships artwork and the full 546 frame timeline without an emulator', () => {
  assert.equal(existsSync('public/header/animation.js'), true);
  const source = readFileSync('public/header/animation.js', 'utf8');
  assert.match(source, /546/);
  assert.doesNotMatch(source, /\beval\s*\(|new Function\s*\(|\.swf|ruffle|shockwave/i);
  assert.match(source, /requestAnimationFrame/);
  assert.doesNotMatch(source, /getElementById\("(?:width_size|height_size)"\)/);
  const component = readFileSync('src/components/Header.astro', 'utf8');
  assert.match(component, /width="1002"/);
  assert.match(component, /height="191"/);
});
