import path from 'path';
import { createTestkit } from '../../../../migratejs/__tests__/createTestkit';
import { migrationFile } from '../../utils';

const testkit = createTestkit({
  migrationFile,
});

test('no env file', () => {
  testkit.run({ fixtures: path.join(__dirname, 'noEnvFile') });
});

test('env var configured', () => {
  testkit.run({ fixtures: path.join(__dirname, 'envVarConfigured') });
});

test('env file exists', () => {
  testkit.run({ fixtures: path.join(__dirname, 'envFileExist') });
});
