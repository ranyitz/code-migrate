import { red } from 'chalk';
import { Migration } from '../Migration';
import { writeReportFile } from './writeReportFile';

export const quietReporter = ({ events }: Migration): void => {
  events.on('task-fail', ({ error, task, file }) => {
    console.log(task.title);
    console.error(`${red('X')} ${task.type} failed: ${file?.path}`);
    console.error();
    console.error(error);
  });

  events.on('migration-after-run', ({ migration, options: { reportFile } }) => {
    if (reportFile) {
      writeReportFile(migration, reportFile);
    }
  });
};
