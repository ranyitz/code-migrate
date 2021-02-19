import { resolveFixture } from './utils';
import { createTestkit } from 'code-migrate/testing';

createTestkit({ migrationFile: 'migration.ts' }).test({
  fixtures: resolveFixture('create'),
});
