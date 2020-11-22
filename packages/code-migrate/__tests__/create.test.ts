import { resolveFixture } from './utils';
import { createTestkit } from '../src/testing/createTestkit';

test('create', () => {
  const testkit = createTestkit();

  testkit.run({
    fixtures: resolveFixture('create'),
  });
});
