import { resolveFixture } from './utils';
import { createTestkit } from '../src/testing/createTestkit';

test('rename', () => {
  const testkit = createTestkit();

  testkit.run({
    fixtures: resolveFixture('rename'),
  });
});
