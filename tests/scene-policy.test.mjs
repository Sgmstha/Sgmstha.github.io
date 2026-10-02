import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getScrollSegment, shouldRenderScene } from '../src/components/scene/scrollPath.ts';

test('scroll progress follows measured, uneven section boundaries', () => {
  assert.deepEqual(getScrollSegment([0, 800, 2200, 2800], 1500), { index: 1, progress: .5 });
  assert.deepEqual(getScrollSegment([0, 800, 2200, 2800], 2200), { index: 2, progress: 0 });
});

test('overscroll and collapsed sections cannot produce invalid camera progress', () => {
  assert.deepEqual(getScrollSegment([0, 800, 2200], -100), { index: 0, progress: 0 });
  assert.deepEqual(getScrollSegment([0, 800, 2200], 3000), { index: 1, progress: 1 });
  assert.deepEqual(getScrollSegment([0, 0, 900], 450), { index: 1, progress: .5 });
  assert.deepEqual(getScrollSegment([0, 0], 100), { index: 0, progress: 1 });
  assert.deepEqual(getScrollSegment([], 100), { index: 0, progress: 0 });
});

test('each fallback condition independently prevents scene loading', () => {
  const base = { mobile: false, reducedMotion: false, saveData: false };
  assert.equal(shouldRenderScene(base), true);
  for (const condition of Object.keys(base)) {
    assert.equal(shouldRenderScene({ ...base, [condition]: true }), false);
  }
});
