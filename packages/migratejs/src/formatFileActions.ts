import chalk from 'chalk';
import { FileAction } from './types';

export const formatSingleFileAction = (fileAction: FileAction) => {
  switch (fileAction.type) {
    case 'transform': {
      const { originalFile, newFile } = fileAction;

      let fileNameChange = '';

      if (originalFile.fileName !== newFile.fileName) {
        fileNameChange = originalFile.fileName + ' ->';
      }

      return `${chalk.blue('transform:')} ${fileNameChange} ${
        newFile.fileName
      }`;
    }

    case 'create': {
      const { newFile } = fileAction;
      return `${chalk.green('create:')} ${newFile.fileName}`;
    }

    case 'remove': {
      return `${chalk.red('remove:')} ${fileAction.file.fileName}`;
    }

    case 'rename': {
      const { originalFile, newFile } = fileAction;
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

export const formatFileActions = (fileActions: Array<FileAction>) => {
  return fileActions.map(formatSingleFileAction).join('\n');
};
