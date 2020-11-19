import { MigrationEmitter } from './migrationEmitter';

export const reporter = (migrationEmitter: MigrationEmitter): void => {
  console.log(migrationEmitter.eventNames());
  migrationEmitter.onTransformEvent('transform-start', ({ file }) => {
    console.log('transformStart', file.fileName);
  });
};
