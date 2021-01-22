import { runSingleTask } from './tasks/runTask';
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
  instructions: Array<FileAction>;
  options: Options;
  events: MigrationEmitter;
  fs: VirtualFileSystem;

  constructor(options: Options) {
    this.instructions = [];
    this.options = options;
    this.events = new MigrationEmitter(this);
    this.fs = new VirtualFileSystem({ cwd: options.cwd });
  }

  runTask(task: Task) {
    this.events.emit('task-start', { task });
    this.instructions.push(...runSingleTask(task, this));
  }

  transform: RegisterTransformTask = (title, pattern, transformFn) => {
    this.runTask({ type: 'transform', title, pattern, fn: transformFn });
  };

  rename: RegisterRenameTask = (title, pattern, renameFn) => {
    this.runTask({ type: 'rename', title, pattern, fn: renameFn });
  };

  remove: RegisterRemoveTask = (title, pattern, removeFn) => {
    this.runTask({ type: 'remove', title, pattern, fn: removeFn });
  };

  create: RegisterCreateTask = (title, patternOrCreateFn, createFn) => {
    let task: Task;

    if (isPattern(patternOrCreateFn)) {
      if (!createFn) {
        throw new Error(
          `When using a pattern for the second argument of the createTask function
You must supply a createFunction as the third argument`
        );
      }

      task = {
        type: 'create',
        title,
        pattern: patternOrCreateFn,
        fn: createFn,
      };
    } else {
      task = { type: 'create', title, fn: patternOrCreateFn };
    }

    this.runTask(task);
  };

  registerTaskMethods: RegisterTasks = {
    transform: this.transform,
    rename: this.rename,
    remove: this.remove,
    create: this.create,
  };

  getMigrationInstructions(): FileAction[] {
    return this.instructions;
  }

  write() {
    this.fs.writeChangesToDisc();
  }

  run() {
    // TODO - Map all actions and ask regarding overrides on create

    this.write();
  }

  static create(options: Options): Migration {
    const migration = new Migration(options);

    reporter(migration);

    return migration;
  }
}
