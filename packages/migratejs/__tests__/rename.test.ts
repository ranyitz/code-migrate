import { resolveFixture } from './utils';
import { createTestkit } from './createTestkit';

test('rename', () => {
  const testkit = createTestkit({
    fixtures: resolveFixture('rename'),
  });

  testkit.run();
});
