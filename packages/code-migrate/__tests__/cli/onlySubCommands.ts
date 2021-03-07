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
  subCommands: {
    full: {
      migrationFile: migrationFileFull,
    },
    transform: {
      migrationFile: migrationFileTransform,
    },
  },
});
