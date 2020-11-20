import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter';
import { File } from './File';
import { Migration } from './Migration';
import { Task } from './types';

interface MigrationEvents {
  ['task-start']: () => void;
  ['transform-start']: ({ file, task }: { file: File; task: Task }) => void;
  ['transform-success-change']: ({
    originalFile,
    newFile,
    task,
  }: {
    originalFile: File;
    newFile: File;
    task: Task;
  }) => void;
  ['transform-success-noop']: ({
    file,
    task,
  }: {
    file: File;
    task: Task;
  }) => void;
  ['transform-fail']: ({
    file,
    error,
    task,
  }: {
    file: File;
    error: Error;
    task: Task;
  }) => void;
}

export class MigrationEmitter extends (EventEmitter as new () => TypedEmitter<
  MigrationEvents
>) {
  migration: Migration;

  constructor(migration: Migration) {
    super();
    this.migration = migration;
  }
}
