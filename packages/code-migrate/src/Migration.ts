import { runSingleTask } from './tasks/runTask';
import { MigrationEmitter, aggregateEvents } from './events';
import type {
  Options,
  TaskResult,
  RegisterCreateTask,
  RegisterRemoveTask,
  RegisterRenameTask,
  RegisterTransformTask,
  RegisterAfterHook,
  Task,
} from './types';
import { isPattern } from './utils';
import { defaultReporter, quietReporter } from './reporters';
import { VirtualFileSystem } from './VirtualFileSystem';
import { AfterHookFn } from './hooks';

export type RegisterMethods = {
  transform: RegisterTransformTask;
  rename: RegisterRenameTask;
  remove: RegisterRemoveTask;
  create: RegisterCreateTask;
  after: RegisterAfterHook;
};

export class Migration {
  options: Options;
  events: MigrationEmitter;
  fs: VirtualFileSystem;
  instructions: Array<TaskResult>;
  afterHooks: Array<AfterHookFn>;

  constructor(options: Options) {
    this.options = options;
    this.events = new MigrationEmitter(this);
    this.fs = new VirtualFileSystem({ cwd: options.cwd });
    this.instructions = [];
    this.afterHooks = [];
  }

  runTask(task: Task) {
    this.events.emit('task-start', { task });
    this.instructions.push(...runSingleTask(task, this).taskResults);
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

  after: RegisterAfterHook = (afterFn: AfterHookFn) => {
    this.afterHooks.push(afterFn);
  };

  registerMethods: RegisterMethods = {
    transform: this.transform,
    rename: this.rename,
    remove: this.remove,
    create: this.create,
    after: this.after,
  };

  getMigrationInstructions(): TaskResult[] {
    return this.instructions;
  }

  write() {
    this.fs.writeChangesToDisc();
    this.afterHooks.forEach((fn) => fn());
  }

  static init(options: Options): Migration {
    const migration = new Migration(options);

    aggregateEvents(migration);

    const reporter = options.quiet ? quietReporter : defaultReporter;

    reporter(migration);

    return migration;
  }
}
