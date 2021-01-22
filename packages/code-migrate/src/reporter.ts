import { red } from 'chalk';
import { Migration } from './Migration';

export const reporter = (migration: Migration): void => {
  const { events } = migration;

  events.on('transform-fail', ({ file, error, task }) => {
    console.log(
      `${red('X')} transform failed on
      task: "${task.title}"
      file: "${file.fileName}"`
    );
    console.error(error);
  });

  events.on('create-fail', ({ error }) => {
    console.log(`${red('X')} create failed`);
    console.error(error);
  });

  events.on('rename-fail', ({ error, file }) => {
    console.log(`${red('X')} rename failed: ${file.fileName}`);
    console.error(error);
  });

  // events.on('task-start', ({ task }) => {
  // console.log(bold(task.title));
  // });

  events.on('transform-success-change', ({ newFile }) => {
    // console.log(`${green('✔')} ${newFile.fileName}`);
  });

  events.on('transform-success-noop', ({ file }) => {
    // console.log(`${blue('-')} ${dim(file.fileName)}`);
  });
};
