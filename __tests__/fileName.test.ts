import { resolveFixture } from './utils';
import { testMigration } from './testMigration';

test('should change the fileName', () => {
  testMigration({
    migration: (task) => {
      task('transform foo.json to foo-bar.json', 'foo.json', ({ fileName }) => {
        return { fileName: `${fileName}-bar.json` };
      });
    },
    fixtures: resolveFixture('fileName'),
  });
});
