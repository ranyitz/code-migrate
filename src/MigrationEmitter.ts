import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter';
import { File } from './File';
import { Migration } from './Migration';
import { Task } from './types';

interface MigrationEvents {
  ['task-start']: ({ task }: { task: Task }) => void;
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
  ['rename-start']: ({ file, task }: { file: File; task: Task }) => void;
  ['rename-success-change']: ({
    originalFile,
    newFile,
    task,
  }: {
    originalFile: File;
    newFile: File;
    task: Task;
  }) => void;
  ['rename-success-noop']: ({ file, task }: { file: File; task: Task }) => void;
  ['rename-fail']: ({
    file,
    error,
    task,
  }: {
    file: File;
    error: Error;
    task: Task;
  }) => void;
  ['create-start']: ({ file, task }: { file?: File; task: Task }) => void;
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
  ['create-fail']: ({
    file,
    error,
    task,
  }: {
    file?: File;
    error: Error;
    task: Task;
  }) => void;
  ['delete-start']: ({ file, task }: { file: File; task: Task }) => void;
  ['delete-success']: ({ file, task }: { file: File; task: Task }) => void;
  ['delete-success-noop']: ({ file, task }: { file: File; task: Task }) => void;
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
