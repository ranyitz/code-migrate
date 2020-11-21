import { createTestkit } from '../../../../migratejs/__tests__/createTestkit';
import { migrationFile } from '../../utils';

const testkit = createTestkit({
  migrationFile,
});

test('yoshi-bm to yoshi-flow-bm', () => {
  testkit.run({ fixtures: __dirname });
});
