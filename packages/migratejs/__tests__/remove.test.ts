import { resolveFixture } from './utils';
import { createTestkit } from './createTestkit';

test('remove', () => {
  const testkit = createTestkit();

  testkit.run({ fixtures: resolveFixture('remove') });
});
