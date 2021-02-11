import { resolveFixture } from './utils';
import { createTestkit } from 'code-migrate/testing';

test('create', async () => {
  const testkit = createTestkit();

  await testkit.run({
    fixtures: resolveFixture('create'),
  });
});
