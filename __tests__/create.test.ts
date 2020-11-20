import { resolveFixture } from './utils';
import { createTestkit } from './createTestkit';

test('create', () => {
  const testkit = createTestkit({
    fixtures: resolveFixture('create'),
  });

  testkit.run(({ create }) => {
    create(
      'create another file with added an bar',
      '*.json',
      ({ fileName, source }) => {
        return {
          fileName: fileName.replace('foo', 'foo-bar'),
          source: source.replace('bar', 'bar-bar'),
        };
      }
    );
  });
});
