import { bold, cyan, green, red } from 'chalk';
import { createReport } from './createReport';
import { Migration } from '../Migration';

export const defaultReporter = (migration: Migration): void => {
  const { events } = migration;

  events.on('migration-start', ({ title, migration }) => {
    console.log(`${cyan('🏃‍ Running:')} ${title}`);
    console.log(`${cyan('📁 On:')} ${migration.options.cwd}`);
  });

  events.on('migration-after-run', ({ migration, options: { dry } }) => {
    if (dry) {
      console.log(bold('dry-run mode, no files will be modified'));
      console.log();
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
    console.log(green('The migration was done successfully 🎉'));
  });

  events.on('migration-after-prompt-aborted', () => {
    console.log();
    console.log(red('Migration aborted'));
  });
};
