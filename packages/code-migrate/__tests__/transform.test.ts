import { resolveFixture } from './utils';
import { createTestkit } from 'code-migrate/testing';

test('transform', () => {
  const testkit = createTestkit();

  testkit.run({
    fixtures: resolveFixture('transform'),
  });
});
