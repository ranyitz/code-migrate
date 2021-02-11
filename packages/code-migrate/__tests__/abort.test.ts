import { resolveFixture } from './utils';
import { createTestkit } from 'code-migrate/testing';

test('abort', async () => {
  const testkit = createTestkit();

  await testkit.run({
    fixtures: resolveFixture('abort'),
  });
});
