import { MigrationEmitter } from './migrationEmitter';
import { blue, green, red } from 'chalk';

export const reporter = (migrationEmitter: MigrationEmitter): void => {
  migrationEmitter.onTransformEvent('transform-fail', ({ file, error }) => {
    console.log(`${red('X')} ${file.fileName}`);
    console.error(error);
  });

  migrationEmitter.onTransformEvent('transform-success-change', ({ file }) => {
    console.log(`${green('✔')} ${file.fileName}`);
  });

  migrationEmitter.onTransformEvent('transform-success-noop', ({ file }) => {
    console.log(`${blue('noop')} ${file.fileName}`);
  });
};
