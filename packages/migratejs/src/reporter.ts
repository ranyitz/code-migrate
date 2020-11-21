import { blue, bold, green, red } from 'chalk';
import { Migration } from './Migration';

export const reporter = (migration: Migration): void => {
  const { events } = migration;

  events.on('transform-fail', ({ file, error }) => {
    console.log(`${red('X')} transform failed: ${file.fileName}`);
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

  // events.on('transform-success-change', ({ originalFile, newFile }) => {
  // console.log(
  //   `${green('✔')} ${originalFile.fileName} -> ${newFile.fileName}`
  // );
  // });

  // events.on('transform-success-noop', ({ file }) => {
  // console.log(`${blue('noop')} ${file.fileName}`);
  // });
};
