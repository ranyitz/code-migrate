import chalk from 'chalk';
import { FileAction } from './types';
import { groupBy, isEmpty } from 'lodash';

export const formatSingleFileAction = (fileAction: FileAction) => {
  switch (fileAction.type) {
    case 'transform': {
      const { newFile } = fileAction;

      // return newFile.fileName;
      return `${chalk.blue('transform:')} ${newFile.fileName}`;
    }

    case 'create': {
      const { newFile } = fileAction;
      return newFile.fileName;
      // return `${chalk.green('create:    ')} ${newFile.fileName}`;
    }

    case 'remove': {
      return fileAction.file.fileName;
      // return `${chalk.red('remove:    ')} ${
      //   fileAction.file.fileName
      // } ${chalk.dim(fileAction.task.title)}`;
    }

    case 'rename': {
      const { originalFile, newFile } = fileAction;
      // return `${originalFile.fileName} -> ${newFile.fileName}`;
      return `${chalk.yellow('rename:')} ${originalFile.fileName} -> ${
        newFile.fileName
      }`;
    }

    default: {
      // @ts-expect-error ts thinks that task is "never"
      throw new Error(`unknown fileAction type "${fileAction.type}"`);
    }
  }
};

export const createReport = (fileActions: Array<FileAction>) => {
  if (isEmpty(fileActions)) {
    return chalk.blue('🤷‍♂️ the migration passed without changes');
  }

  const output = [];

  for (const [taskTitle, taskFileActions] of Object.entries(
    groupBy(fileActions, 'task.title')
  )) {
    output.push(
      chalk.underline(chalk.bold(taskTitle)) +
        '\n' +
        taskFileActions.map(formatSingleFileAction).join('\n')
    );
  }

  return output.join('\n\n');
};
