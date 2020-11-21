import path from 'path';
import { createTestkit } from '../../../../migratejs/__tests__/createTestkit';
import { migrationFile } from '../../utils';

const testkit = createTestkit({
  migrationFile,
});

test('no env file', () => {
  testkit.run({ fixtures: path.join(__dirname, 'cjs') });
});

test('env var configured', () => {
  testkit.run({ fixtures: path.join(__dirname, 'esm') });
});
