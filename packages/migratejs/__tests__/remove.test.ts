import { resolveFixture } from './utils';
import { createTestkit } from './createTestkit';

test('remove', () => {
  const testkit = createTestkit({
    fixtures: resolveFixture('remove'),
  });

  testkit.run();
});
