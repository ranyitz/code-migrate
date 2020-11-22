import { resolveFixture } from './utils';
import { createTestkit } from 'code-migrate/testing';

test('rename', () => {
  const testkit = createTestkit();

  testkit.run({
    fixtures: resolveFixture('rename'),
  });
});
