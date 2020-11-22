import { resolveFixture } from './utils';
import { createTestkit } from '../testing';

test('rename', () => {
  const testkit = createTestkit();

  testkit.run({
    fixtures: resolveFixture('rename'),
  });
});
