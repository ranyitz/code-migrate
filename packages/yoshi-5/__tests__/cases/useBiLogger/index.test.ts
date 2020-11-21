import path from 'path';
import { createTestkit } from '../../../../migratejs/__tests__/createTestkit';
import { migrationFile } from '../../utils';

const testkit = createTestkit({
  migrationFile,
});

test('useBiLogger cjs', () => {
  testkit.run({ fixtures: path.join(__dirname, 'cjs') });
});

test('useBiLogger esm', () => {
  testkit.run({ fixtures: path.join(__dirname, 'esm') });
});
