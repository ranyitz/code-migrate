import { EventEmitter } from 'events';
import {
  Options,
  RegisterCreateTask,
  RegisterDeleteTask,
  RegisterRenameTask,
  RegisterTransformTask,
  Task,
} from './types';

export type RegisterTasks = {
  transform: RegisterTransformTask;
  rename: RegisterRenameTask;
  delete: RegisterDeleteTask;
  create: RegisterCreateTask;
};

export class Migration {
  tasks: Array<Task>;
  options: Options;
  events: MigrationEmitter;

  constructor(options: Options) {
    this.tasks = [];
    this.options = options;
    this.events = new MigrationEmitter(this);
  }

  transform: RegisterTransformTask = (title, pattern, transformFn) => {
    this.tasks.push({ type: 'transform', title, pattern, fn: transformFn });
  };

  rename: RegisterRenameTask = (title, pattern, renameFn) => {
    this.tasks.push({ type: 'rename', title, pattern, fn: renameFn });
  };

  delete: RegisterDeleteTask = (title, pattern) => {
    this.tasks.push({ type: 'delete', title, pattern });
  };

  create: RegisterCreateTask = (title, createFn) => {
    this.tasks.push({ type: 'create', title, fn: createFn });
  };

  getRegisterTaskMethods(): RegisterTasks {
    return {
      transform: this.transform,
      rename: this.rename,
      delete: this.delete,
      create: this.create,
    };
  }
}

export class MigrationEmitter extends EventEmitter {
  migration: Migration;

  constructor(migration: Migration) {
    super();
    this.migration = migration;
  }

  emitTaskStart = (...args: any) => {
    this.emit('task-start', ...args);
  };

  onTaskStart = (...args: any) => {
    this.on('task-start', args);
  };
}
