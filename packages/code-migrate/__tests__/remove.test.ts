import { resolveFixture } from './utils';
import { createTestkit } from 'code-migrate/testing';

test('remove', () => {
  const testkit = createTestkit();

  testkit.run({ fixtures: resolveFixture('remove') });
});
