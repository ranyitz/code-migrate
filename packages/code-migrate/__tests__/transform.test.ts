import { resolveFixture } from './utils';
import { createTestkit } from '../testing';

test('transform', () => {
  const testkit = createTestkit();

  testkit.run({
    fixtures: resolveFixture('transform'),
  });
});
