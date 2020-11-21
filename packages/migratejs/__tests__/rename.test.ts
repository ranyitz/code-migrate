import { resolveFixture } from './utils';
import { createTestkit } from './createTestkit';

test('rename', () => {
  const testkit = createTestkit();

  testkit.run({
    fixtures: resolveFixture('rename'),
  });
});
