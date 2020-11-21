import { resolveFixture } from './utils';
import { createTestkit } from './createTestkit';

test('transform', () => {
  const testkit = createTestkit();

  testkit.run({
    fixtures: resolveFixture('transform'),
  });
});
