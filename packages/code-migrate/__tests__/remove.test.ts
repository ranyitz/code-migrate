import { resolveFixture } from './utils';
import { createTestkit } from '../src/testing/createTestkit';

test('remove', () => {
  const testkit = createTestkit();

  testkit.run({ fixtures: resolveFixture('remove') });
});
