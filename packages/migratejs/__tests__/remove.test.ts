import { resolveFixture } from './utils';
import { createTestkit } from '../testing';

test('remove', () => {
  const testkit = createTestkit();

  testkit.run({ fixtures: resolveFixture('remove') });
});
