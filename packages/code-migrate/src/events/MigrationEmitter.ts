import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter';
import type { File } from '../File';
import type { Migration } from '../Migration';
import type { Results } from '../runMigration';
import type { Task, TaskError, TaskResult } from '../types';

interface MigrationEvents {
  ['task-start']: ({ file, task }: { file: File; task: Task }) => void;
  ['task-fail']: (taskError: TaskError) => void;
  ['task-success']: (taskResult: TaskResult) => void;
  ['transform-success-noop']: ({
    file,
    task,
  }: {
    file: File;
    task: Task;
  }) => void;
  ['rename-success-noop']: ({ file, task }: { file: File; task: Task }) => void;
  ['create-success-abort']: ({ task }: { task: Task }) => void;
  ['create-success-override']: ({
    originalFile,
    newFile,
    task,
  }: {
    originalFile: File;
    newFile: File;
    task: Task;
  }) => void;
  ['remove-success-noop']: ({ file, task }: { file: File; task: Task }) => void;
  ['migration-start']: ({
    title,
    migration,
  }: {
    title: string;
    migration: Migration;
  }) => void;
  ['migration-after-run']: (results: Results) => void;
  ['migration-after-write']: () => void;
  ['migration-after-prompt-aborted']: () => void;
  ['migration-after-prompt-confirmed']: () => void;
  ['migration-before-prompt']: () => void;
}

export class MigrationEmitter extends (EventEmitter as new () => TypedEmitter<MigrationEvents>) {
  migration: Migration;

  constructor(migration: Migration) {
    super();
    this.migration = migration;
  }
}