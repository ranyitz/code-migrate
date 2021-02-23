import path from 'path';
import { resolveFixture, runMigrationAndGetOutput } from '../utils';

const fixtures = resolveFixture('no-ts-node');
const migrationFile = path.join(fixtures, 'migration.js');

test('should fail when used on a js file and use TypeScript', async () => {
  expect.assertions(1);
  try {
    await runMigrationAndGetOutput({
      fixtures,
      migrationFile,
    });
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
  }
});
