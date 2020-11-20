import { flatMap } from 'lodash';
import { runTask } from './tasks/runTask';
import fs from 'fs-extra';
import type { FileAction, RunMigration } from './types';
import { Migration } from './Migration';

export const createRunMigration = (
  migration: Migration
): RunMigration => () => {
  const fileActions: Array<FileAction> = flatMap(migration.tasks, (task) => {
    migration.events.emit('task-start', { task });

    return runTask(task, migration);
  });

  // TODO - Map all actions and ask regarding overrides on create
  // TODO - Show dry-run
  // TODO - Prompt should start migration
  fileActions.forEach(executeFileAction);
};

function executeFileAction(fileAction: FileAction) {
  switch (fileAction.type) {
    case 'transform': {
      const { originalFile, newFile } = fileAction;
      fs.removeSync(originalFile.path);
      fs.writeFileSync(newFile.path, newFile.source);
      break;
    }

    case 'create': {
      const { newFile } = fileAction;
      fs.writeFileSync(newFile.path, newFile.source);
      break;
    }

    case 'remove': {
      fs.removeSync(fileAction.filePath);
      break;
    }

    case 'rename': {
      const { originalFilePath, newFilePath } = fileAction;
      fs.renameSync(originalFilePath, newFilePath);
      break;
    }

    default: {
      // @ts-expect-error ts thinks that task is "never"
      throw new Error(`unknown fileAction type "${task.type}"`);
    }
  }
}
