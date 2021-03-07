import path from 'path';
import { resolveFixture } from '../utils';
import { createCli } from '../../src/cli/createCli';

const migrationFileFull = path.join(resolveFixture('full'), 'migration.ts');
const migrationFileTransform = path.join(
  resolveFixture('transform'),
  'migration.ts'
);

createCli({
  binName: 'code-migrate',
  version: require('../../package.json').version,
  migrationFile: migrationFileTransform,
  subCommands: {
    full: {
      migrationFile: migrationFileFull,
    },
  },
});
