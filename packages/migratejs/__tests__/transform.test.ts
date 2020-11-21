import { resolveFixture } from './utils';
import { createTestkit } from './createTestkit';

test('transform', () => {
  const testkit = createTestkit({
    fixtures: resolveFixture('transform'),
  });

  testkit.run();
});
