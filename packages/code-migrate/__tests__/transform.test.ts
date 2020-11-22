import { resolveFixture } from './utils';
import { createTestkit } from '../src/testing/createTestkit';

test('transform', () => {
  const testkit = createTestkit();

  testkit.run({
    fixtures: resolveFixture('transform'),
  });
});
