import { resolveFixture } from './utils';
import { testMigration } from './testMigration';

test('should delete all json files', () => {
  testMigration({
    registerMigration: (tasks) => {
      tasks.delete('delete json files', '*.json');
    },
    fixtures: resolveFixture('delete'),
  });
});
