import { flatMap } from 'lodash';
import { runTask } from './tasks/runTask';
import { MigrationEmitter } from './MigrationEmitter';
import type {
  Options,
  FileAction,
  RegisterCreateTask,
  RegisterRemoveTask,
  RegisterRenameTask,
  RegisterTransformTask,
  Task,
} from './types';
import { isPattern } from './utils';
import { reporter } from './reporter';
import { VirtualFileSystem } from './VirtualFileSystem';

export type RegisterTasks = {
  transform: RegisterTransformTask;
  rename: RegisterRenameTask;
  remove: RegisterRemoveTask;
  create: RegisterCreateTask;
};

export class Migration {
  tasks: Array<Task>;
  options: Options;
  events: MigrationEmitter;
  fs: VirtualFileSystem;

  constructor(options: Options) {
    this.tasks = [];
    this.options = options;
    this.events = new MigrationEmitter(this);
    this.fs = new VirtualFileSystem({ cwd: options.cwd });
  }

  transform: RegisterTransformTask = (title, pattern, transformFn) => {
    this.tasks.push({ type: 'transform', title, pattern, fn: transformFn });
  };

  rename: RegisterRenameTask = (title, pattern, renameFn) => {
    this.tasks.push({ type: 'rename', title, pattern, fn: renameFn });
  };

  remove: RegisterRemoveTask = (title, pattern) => {
    this.tasks.push({ type: 'remove', title, pattern });
  };

  create: RegisterCreateTask = (title, patternOrCreateFn, createFn) => {
    if (isPattern(patternOrCreateFn)) {
      if (!createFn) {
        throw new Error(
          `When using a pattern for the second argument of the createTask function
You must supply a createFunction as the third argument`
        );
      }

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

  registerTaskMethods: RegisterTasks = {
    transform: this.transform,
    rename: this.rename,
    remove: this.remove,
    create: this.create,
  };

  prepare() {
    const fileActions: Array<FileAction> = flatMap(this.tasks, (task) => {
      this.events.emit('task-start', { task });

      return runTask(task, this);
    });

    return fileActions;
  }

  write() {
    this.fs.writeChangesToDisc();
  }

  run() {
    this.prepare();
    // TODO - Map all actions and ask regarding overrides on create

    this.write();
  }

  static create(options: Options): Migration {
    const migration = new Migration(options);

    reporter(migration);

    return migration;
  }
}
