import { resolveFixture } from './utils';
import { testMigration } from './testMigration';

test('should perform a transformation of the filename & the contents', () => {
  testMigration({
    registerMigration: (tasks) => {
      tasks.transform(
        'transform bar to baz in filename and json contents',
        '*.json',
        ({ fileName, source }) => {
          return {
            fileName: fileName.replace('bar', 'baz'),
            source: source.replace('bar', 'baz'),
          };
        }
      );
    },
    fixtures: resolveFixture('transform'),
  });
});
