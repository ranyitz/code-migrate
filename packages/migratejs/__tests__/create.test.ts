import { resolveFixture } from './utils';
import { createTestkit } from '../testing';

test('create', () => {
  const testkit = createTestkit();

  testkit.run({
    fixtures: resolveFixture('create'),
  });
});
