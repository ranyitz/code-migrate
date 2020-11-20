import { resolveFixture } from './utils';
import { createTestkit } from './createTestkit';
import path from 'path';

test('rename', () => {
  const testkit = createTestkit({
    fixtures: resolveFixture('rename'),
  });

  testkit.run(({ rename }) => {
    rename('transform foo.json to foo-bar.json', 'foo.json', ({ fileName }) => {
      return { fileName: `${path.basename(fileName, '.json')}-bar.json` };
    });
  });
});
