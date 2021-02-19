import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter';
import type { File } from '../File';
import type { Migration } from '../Migration';
import type { Results } from '../runMigration';
import type { Task, TaskError } from '../types';

interface MigrationEvents {
  ['task-start']: ({ task }: { task: Task }) => void;
  ['task-fail']: ({
    task,
    file,
    error,
  }: {
    task: Task;
    file?: File;
    error: Error;
  }) => void;
  ['task-success']: ({
    task,
    file,
    originalFile,
    newFile,
  }: {
    task: Task;
    file?: File;
    originalFile?: File;
    newFile?: File;
  }) => void;
  ['transform-start']: ({ file, task }: { file: File; task: Task }) => void;
  ['transform-success']: ({
    originalFile,
    newFile,
    task,
  }: {
    originalFile?: File;
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
  ['transform-fail']: (taskError: TaskError) => void;
  ['rename-start']: ({ file, task }: { file: File; task: Task }) => void;
  ['rename-success']: ({
    originalFile,
    newFile,
    task,
  }: {
    originalFile: File;
    newFile: File;
    task: Task;
  }) => void;
  ['rename-success-noop']: ({ file, task }: { file: File; task: Task }) => void;
  ['rename-fail']: (taskError: TaskError) => void;
  ['create-start']: ({ file, task }: { file?: File; task: Task }) => void;
  ['create-success-cancle']: ({ task }: { task: Task }) => void;
  ['create-success']: ({
    newFile,
    task,
  }: {
    newFile: File;
    task: Task;
  }) => void;
  ['create-success-override']: ({
    originalFile,
    newFile,
    task,
  }: {
    originalFile: File;
    newFile: File;
    task: Task;
  }) => void;
  ['create-fail']: (taskError: TaskError) => void;
  ['remove-start']: ({ file, task }: { file: File; task: Task }) => void;
  ['remove-success']: ({ file, task }: { file: File; task: Task }) => void;
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
