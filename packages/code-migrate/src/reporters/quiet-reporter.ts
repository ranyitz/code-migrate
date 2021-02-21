import { red } from 'chalk';
import { Migration } from '../Migration';
import type { Reporter } from './';

export const quietReporter: Reporter = ({ events }: Migration): void => {
  events.on('task-fail', ({ error, task, file }) => {
    console.log(task.title);
    console.error(`${red('X')} ${task.type} failed: ${file?.path}`);
    console.error();
    console.error(error);
  });
};
