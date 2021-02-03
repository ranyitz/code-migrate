import { resolveFixture } from './utils';
import { createTestkit } from 'code-migrate/testing';

test('abort', () => {
  const testkit = createTestkit();

  testkit.run({
    fixtures: resolveFixture('abort'),
  });
});
