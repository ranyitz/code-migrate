import { resolveFixture } from './utils';
import { createTestkit } from 'code-migrate/testing';

test('async', () => {
  const testkit = createTestkit();

  testkit.run({
    fixtures: resolveFixture('async'),
  });
});
