import { MigrationEmitter } from './MigrationEmitter';
import {
  Options,
  RegisterCreateTask,
  RegisterDeleteTask,
  RegisterRenameTask,
  RegisterTransformTask,
  Task,
} from './types';
import { isPattern } from './utils';

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

  create: RegisterCreateTask = (title, patternOrCreateFn, createFn) => {
    if (isPattern(patternOrCreateFn)) {
      this.tasks.push({
        type: 'create',
        title,
        pattern: patternOrCreateFn,
        fn: createFn,
      });
    } else {
      this.tasks.push({ type: 'create', title, fn: patternOrCreateFn });
    }
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
