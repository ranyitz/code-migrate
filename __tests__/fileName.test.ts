import { resolveFixture } from './utils';
import { testMigration } from './testMigration';
import path from 'path';

test('should change the fileName', () => {
  testMigration({
    migration: (migration) => {
      migration.transform();
      migration.rename();
      migration.delete();
      migration.create();

      task('transform foo.json to foo-bar.json', 'foo.json', ({ fileName }) => {
        return { fileName: `${path.basename(fileName, '.json')}-bar.json` };
      });
    },
    fixtures: resolveFixture('fileName'),
  });
});
