import { MigrationEmitter } from './migrationEmitter';

export const reporter = (migrationEmitter: MigrationEmitter): void => {
  migrationEmitter.onTransformEvent('transform-start', ({ file }) => {
    console.log('transformStart', file.fileName);
  });

  migrationEmitter.onTransformEvent('transform-fail', ({ file }) => {
    console.log('transform-fail', file.fileName);
  });

  migrationEmitter.onTransformEvent('transform-success-change', ({ file }) => {
    console.log('transform-success-change', file.fileName);
  });

  migrationEmitter.onTransformEvent('transform-success-noop', ({ file }) => {
    console.log('transform-success-noop', file.fileName);
  });
};
