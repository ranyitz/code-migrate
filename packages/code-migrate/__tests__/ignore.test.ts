import { resolveFixture } from './utils';
import { createTestkit } from 'code-migrate/testing';

test('ignore node_modules & .git directories', async () => {
  const testkit = createTestkit();

  await testkit.run({
    fixtures: resolveFixture('ignore'),
  });
});
