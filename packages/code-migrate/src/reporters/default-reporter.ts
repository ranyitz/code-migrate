import { bold, cyan, green, red } from 'chalk';
import { createReport } from './createReport';
import { Migration } from '../Migration';
import { writeReportFile } from './writeReportFile';

export const defaultReporter = (migration: Migration): void => {
  const { events } = migration;

  events.on('migration-start', ({ migration }) => {
    console.log(`${cyan('🏃‍ Running:')} ${migration.title}`);
    console.log(`${cyan('📁 On:')} ${migration.options.cwd}`);
  });

  events.on(
    'migration-after-run',
    ({ migration, options: { dry, reportFile } }) => {
      if (dry) {
        console.log(bold('dry-run mode, no files will be modified'));
        console.log();
      }

      console.log();
      console.log(createReport(migration));

      if (reportFile) {
        writeReportFile(migration, reportFile);
      }
    }
  );

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
