import { resolveFixture } from './utils';
import { createTestkit } from './createTestkit';

test('create', () => {
  const testkit = createTestkit();

  testkit.run({
    fixtures: resolveFixture('create'),
  });
});
