import { resolveFixture } from './utils';
import { createTestkit } from 'code-migrate/testing';

test('async', async () => {
  const testkit = createTestkit();

  await testkit.run({
    fixtures: resolveFixture('async'),
  });
});
