import { createTestkit } from '../../../../migratejs/__tests__/createTestkit';

const testkit = createTestkit({
  fixtures: __dirname,
  migrationFile: '../../../migration.ts',
});

test('change module.json to application.json', () => {
  testkit.run();
});
