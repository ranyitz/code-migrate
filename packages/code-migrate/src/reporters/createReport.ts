import chalk from 'chalk';
import { TaskResult } from '../types';
import { groupBy, isEmpty } from 'lodash';

export const formatSingletaskResult = (taskResult: TaskResult) => {
  switch (taskResult.type) {
    case 'transform': {
      const { newFile } = taskResult;

      return `${chalk.blue('transform:')} ${newFile.fileName}`;
    }

    case 'create': {
      const { newFile } = taskResult;
      return `${chalk.green('create:')} ${newFile.fileName}`;
    }

    case 'remove': {
      return `${chalk.red('remove:')} ${taskResult.file.fileName}`;
    }

    case 'rename': {
      const { originalFile, newFile } = taskResult;
      return `${chalk.yellow('rename:')} ${originalFile.fileName} -> ${
        newFile.fileName
      }`;
    }

    default: {
      // @ts-expect-error ts thinks that task is "never"
      throw new Error(`unknown taskResult type "${taskResult.type}"`);
    }
  }
};

export const createReport = (taskResults: Array<TaskResult>) => {
  if (isEmpty(taskResults)) {
    return chalk.blue('🤷‍♂️ the migration passed without changes');
  }

  const output = [];

  for (const [taskTitle, tasktaskResults] of Object.entries(
    groupBy(taskResults, 'task.title')
  )) {
    output.push(
      chalk.underline(chalk.bold(taskTitle)) +
        '\n' +
        tasktaskResults.map(formatSingletaskResult).join('\n')
    );
  }

  return output.join('\n\n');
};
