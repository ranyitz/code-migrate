import chalk from 'chalk';
import { FileAction } from './types';

export const formatSingleFileAction = (fileAction: FileAction) => {
  switch (fileAction.type) {
    case 'transform': {
      const { originalFile, newFile, task } = fileAction;

      let fileNameChange = '';

      if (originalFile.fileName !== newFile.fileName) {
        fileNameChange = originalFile.fileName + ' ->';
      }

      return `${chalk.blue('transform:')} ${fileNameChange} ${
        newFile.fileName
      } ${chalk.dim(task.title)}`;
    }

    case 'create': {
      const { newFile, task } = fileAction;
      return `${chalk.green('create:    ')} ${newFile.fileName} ${chalk.dim(
        task.title
      )}`;
    }

    case 'remove': {
      return `${chalk.red('remove:    ')} ${
        fileAction.file.fileName
      } ${chalk.dim(fileAction.task.title)}`;
    }

    case 'rename': {
      const { originalFile, newFile, task } = fileAction;
      return `${chalk.yellow('rename:    ')} ${originalFile.fileName} -> ${
        newFile.fileName
      } ${chalk.dim(task.title)}`;
    }

    default: {
      // @ts-expect-error ts thinks that task is "never"
      throw new Error(`unknown fileAction type "${fileAction.type}"`);
    }
  }
};

export const formatFileActions = (fileActions: Array<FileAction>) => {
  return fileActions.map(formatSingleFileAction).join('\n');
};
