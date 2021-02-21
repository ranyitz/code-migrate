import { bold, red } from 'chalk';
import { Migration } from '../Migration';
import type { Reporter } from './';
import { createMarkdownReport } from './createMarkdownReport';

export const markdownReporter: Reporter = (migration: Migration): void => {
  const { events } = migration;

  events.on('migration-after-run', ({ migration, options: { dry } }) => {
    if (dry) {
      console.log();
      console.log(bold('dry-run mode, no files will be modified'));
    }

    console.log();
    console.log(createMarkdownReport(migration));
  });

  events.on('migration-before-prompt', () => {
    // space the prompt
    console.log();
  });

  events.on('migration-after-prompt-aborted', () => {
    console.log();
    console.log(red('Migration aborted'));
  });
};
