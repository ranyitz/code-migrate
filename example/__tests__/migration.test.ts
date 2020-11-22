import { createTestkit } from 'code-migrate/testing';
import path from 'path';

const testkit = createTestkit({
  migrationFile: path.join(__dirname, '../migration.ts'),
});

it('should run the migration on my-app', () => {
  testkit.run({ fixtures: path.join(__dirname, 'my-app') });
});
