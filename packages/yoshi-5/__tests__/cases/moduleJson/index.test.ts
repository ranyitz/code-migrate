import { createTestkit } from '../../../../migratejs/__tests__/createTestkit';
import { migrationFile } from '../../utils';

const testkit = createTestkit({
  migrationFile,
});

test('change module.json to application.json', () => {
  testkit.run({ fixtures: __dirname });
});
