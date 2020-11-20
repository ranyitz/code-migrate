import { resolveFixture } from './utils';
import { createTestkit } from './createTestkit';

test('transform', () => {
  const testkit = createTestkit({
    fixtures: resolveFixture('transform'),
  });

  testkit.run(({ transform }) => {
    transform(
      'transform bar to baz in filename and json contents',
      '*.json',
      ({ fileName, source }) => {
        return {
          fileName: fileName.replace('bar', 'baz'),
          source: source.replace('bar', 'baz'),
        };
      }
    );
  });
});
