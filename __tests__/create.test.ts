import { resolveFixture } from './utils';
import { testMigration } from './testMigration';

test('should create a file based on another file', () => {
  testMigration({
    registerMigration: (tasks) => {
      tasks.create(
        'create another file with added an bar',
        '*.json',
        ({ fileName, source }) => {
          return {
            fileName: fileName.replace('foo', 'foo-bar'),
            source: source.replace('bar', 'bar-bar'),
          };
        }
      );
    },
    fixtures: resolveFixture('create'),
  });
});
