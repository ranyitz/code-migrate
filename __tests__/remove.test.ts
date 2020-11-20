import { resolveFixture } from './utils';
import { testMigration } from './testMigration';

test('should remove all json files', () => {
  testMigration({
    registerMigration: (tasks) => {
      tasks.remove('remove json files', '*.json');
    },
    fixtures: resolveFixture('remove'),
  });
});
