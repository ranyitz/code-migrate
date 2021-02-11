import { resolveFixture } from './utils';
import { createTestkit } from 'code-migrate/testing';

test('rename', async () => {
  const testkit = createTestkit();

  await testkit.run({
    fixtures: resolveFixture('rename'),
  });
});
