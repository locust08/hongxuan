import test from 'node:test';
import assert from 'node:assert/strict';
import { localTimestamp } from '../src/server/time.ts';

test('new business timestamps preserve Malaysia wall-clock semantics independently of host timezone', () => {
  assert.equal(localTimestamp(new Date('2026-11-02T00:05:09Z')), '2026-11-02T08:05:09');
  assert.equal(localTimestamp(new Date('2026-11-02T20:00:00Z')), '2026-11-03T04:00:00');
});
