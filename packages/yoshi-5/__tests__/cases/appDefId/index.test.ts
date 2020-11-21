import { createTestkit } from '../../../../migratejs/__tests__/createTestkit';
import { migrationFile } from '../../utils';

const testkit = createTestkit({
  migrationFile,
});

test('appDefId to appDefinitionId', () => {
  testkit.run({ fixtures: __dirname });
});
