import { resolveFixture } from './utils';
import { createTestkit } from 'code-migrate/testing';

test('create', () => {
  const testkit = createTestkit();

  testkit.run({
    fixtures: resolveFixture('create'),
  });
});
