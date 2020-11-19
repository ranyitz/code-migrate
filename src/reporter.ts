import { MigrationEmitter } from './migrationEmitter';
import { blue, bold, green, red } from 'chalk';

export const reporter = (migrationEmitter: MigrationEmitter): void => {
  migrationEmitter.onTaskEvent('task-start', ({ task }) => {
    console.log(bold(task.name));
  });

  migrationEmitter.onTransformEvent('transform-fail', ({ file, error }) => {
    console.log(`${red('X')} ${file.fileName}`);
    console.error(error);
  });

  migrationEmitter.onTransformEvent(
    'transform-success-change',
    ({ originalFile, newFile }) => {
      console.log(
        `${green('✔')} ${originalFile.fileName} -> ${newFile.fileName}`
      );
    }
  );

  migrationEmitter.onTransformEvent('transform-success-noop', ({ file }) => {
    console.log(`${blue('noop')} ${file.fileName}`);
  });
};
