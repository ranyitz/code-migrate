import { bold, cyan, green, red } from 'chalk';
import { createReport } from './createReport';
import { Migration } from '../Migration';
import type { Reporter } from './';

export const defaultReporter: Reporter = (migration: Migration): void => {
  const { events } = migration;

  events.on('migration-start', ({ migration }) => {
    console.log(`${cyan('🏃‍ Running:')} ${migration.title}`);
    console.log(`${cyan('📁 On:')} ${migration.options.cwd}`);
  });

  events.on('migration-after-run', ({ migration, options: { dry } }) => {
    if (dry) {
      console.log();
      console.log(bold('dry-run mode, no files will be modified'));
    }

    console.log();
    console.log(createReport(migration));
  });

  events.on('migration-before-prompt', () => {
    // space the prompt
    console.log();
  });

  events.on('migration-after-write', () => {
    console.log();
    console.log(green('The migration has been completed successfully 🎉'));
  });

  events.on('migration-after-prompt-aborted', () => {
    console.log();
    console.log(red('Migration aborted'));
  });
};
